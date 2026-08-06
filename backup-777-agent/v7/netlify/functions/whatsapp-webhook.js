// BETONIQ WEST LTD — Independent WhatsApp Backup Agent (v7)
// Runs OUTSIDE Base44. Twilio WhatsApp <-> Netlify Function <-> Groq API (primary, WITH real tool-calling) / Gemini (fallback, text-only).
//
// v7 change — THE BIG ONE: Backup 777 now has real hands, not just a mouth.
// It can:
//   1. Draft + actually SEND emails via Zoho SMTP (draft-then-explicit-"send" approval flow,
//      same ABSOLUTE RULE Tom's primary agent follows — never fires without his go-ahead).
//   2. Push/update files directly in the TOMDEGGS/BETONIQ-WEST- GitHub repo via the GitHub
//      Contents API. Netlify auto-deploys from this repo, so this IS deploying code/pages live —
//      no manual drag-and-drop needed for that part.
//   3. Log business events (VC replies, leads, status changes) to a persistent Netlify Blobs
//      "business_log" store, so there's a running record even with zero Base44 access.
// This closes the "no hands" gap flagged in v6's own system prompt.
//
// Carries over from v6: embedded Master Briefing (works even if Base44 is offline),
// persistent memory via Netlify Blobs, full personality injection, Groq primary / Gemini fallback.

const { getStore } = require("@netlify/blobs");
const nodemailer = require("nodemailer");

const MASTER_BRIEFING_URL =
  process.env.MASTER_BRIEFING_URL ||
  "https://raw.githubusercontent.com/TOMDEGGS/BETONIQ-WEST-/main/DATA_CONTINUITY_VAULT.md";

const GITHUB_REPO = process.env.GITHUB_REPO || "TOMDEGGS/BETONIQ-WEST-";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const DATA_EXPORT_URL =
  process.env.DATA_EXPORT_URL ||
  "https://raw.githubusercontent.com/TOMDEGGS/BETONIQ-WEST-/main/full_data_export.json";
const HISTORY_LOG_URL =
  process.env.HISTORY_LOG_URL ||
  "https://raw.githubusercontent.com/TOMDEGGS/BETONIQ-WEST-/main/business_history_log.md";

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

const GEMINI_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-2.0-flash",
];

// Embedded fallback — survives even if Base44 AND GitHub are completely offline.
const EMBEDDED_BRIEFING = `# ZEROPAY MASTER BRIEFING (embedded emergency copy — v7 backup agent)
Company: BETONIQ WEST LTD | RC 1496603 | Inc. May 20, 2018
CEO: Tom Ugbodaga — Shareholder & CEO (NEVER "Founder")
Business email: zeropointfeild_nonwnt@zeropay.site
Website: https://zeropay-betoniqwest.netlify.app
Master Hub (all demos): https://betoniqwestmasterhublivedemos.netlify.app
ZeroPay: offline-first NFC payments, PUF hardware + ECC P-256 + Solar Mesh Hub relay. NOT crypto/blockchain.
Opening stats for every investor comm: "1.4 billion unbanked globally / 38 million in Nigeria"
Base44 quarterly payment deadline: September 1, 2026 ($6,000). Separate from Tom's internal Aug 23 revenue target — do not confuse these two dates.
Paystack: Merchant Agreement signed July 14, 2026. Initial rejection (crypto misclassification) corrected and escalated to their engineering team.
GitHub repo (source of truth for all code/demo assets): github.com/TOMDEGGS/BETONIQ-WEST-
Full live vault (always fetch fresh if possible): https://raw.githubusercontent.com/TOMDEGGS/BETONIQ-WEST-/main/DATA_CONTINUITY_VAULT.md
`;

let cachedBriefing = null;
let briefingFetchedAt = 0;
const BRIEFING_CACHE_MS = 30 * 60 * 1000; // 30 min

async function getBriefing() {
  const now = Date.now();
  if (cachedBriefing && now - briefingFetchedAt < BRIEFING_CACHE_MS) {
    return cachedBriefing;
  }
  try {
    const res = await fetch(MASTER_BRIEFING_URL, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      cachedBriefing = await res.text();
      briefingFetchedAt = now;
      return cachedBriefing;
    }
  } catch (e) {
    console.error("Live briefing fetch failed, using embedded copy:", e.message);
  }
  cachedBriefing = EMBEDDED_BRIEFING;
  briefingFetchedAt = now;
  return cachedBriefing;
}

// ---------- Live database export + full history log (v7.1 — real data access) ----------
let cachedDataExport = null;
let dataExportFetchedAt = 0;
let cachedHistoryLog = null;
let historyLogFetchedAt = 0;
const DATA_CACHE_MS = 15 * 60 * 1000; // 15 min — data snapshot updates when Tom refreshes it on GitHub

async function getDataExport() {
  const now = Date.now();
  if (cachedDataExport && now - dataExportFetchedAt < DATA_CACHE_MS) return cachedDataExport;
  try {
    const res = await fetch(DATA_EXPORT_URL, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      cachedDataExport = await res.json();
      dataExportFetchedAt = now;
      return cachedDataExport;
    }
  } catch (e) {
    console.error("Data export fetch failed:", e.message);
  }
  return cachedDataExport; // may be null if never fetched successfully
}

async function getHistoryLog() {
  const now = Date.now();
  if (cachedHistoryLog && now - historyLogFetchedAt < DATA_CACHE_MS) return cachedHistoryLog;
  try {
    const res = await fetch(HISTORY_LOG_URL, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      cachedHistoryLog = await res.text();
      historyLogFetchedAt = now;
      return cachedHistoryLog;
    }
  } catch (e) {
    console.error("History log fetch failed:", e.message);
  }
  return cachedHistoryLog;
}

// Simple keyword search across every entity record + the history log. No embeddings needed —
// the dataset is small enough that plain substring matching across all fields works fine.
async function searchDatabase(query, entityFilter) {
  const q = String(query || "").toLowerCase();
  const data = await getDataExport();
  const matches = [];
  if (data && data.entities) {
    for (const [entityName, records] of Object.entries(data.entities)) {
      if (entityFilter && entityFilter.toLowerCase() !== entityName.toLowerCase()) continue;
      if (!Array.isArray(records)) continue;
      for (const rec of records) {
        if (JSON.stringify(rec).toLowerCase().includes(q)) {
          matches.push({ entity: entityName, record: rec });
          if (matches.length >= 15) break;
        }
      }
      if (matches.length >= 15) break;
    }
  }
  let historySnippets = [];
  const history = await getHistoryLog();
  if (history) {
    const lines = history.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(q)) {
        historySnippets.push(lines[i].trim());
        if (historySnippets.length >= 8) break;
      }
    }
  }
  return { matches, historySnippets, data_loaded: !!data, history_loaded: !!history };
}

async function getDatabaseSummary() {
  const data = await getDataExport();
  if (!data) return { error: "Could not load live data export right now — try again shortly." };
  return { summary_stats: data.summary_stats || null, entity_counts: Object.fromEntries(Object.entries(data.entities || {}).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])) };
}

// ---------- v7.2 — TRUE live access straight to the real Base44 database ----------
// Tries the live Base44 bridge function first (real-time, always up to date, works whenever
// Base44 itself is reachable). Falls back automatically to the GitHub snapshot ONLY if Base44
// is unreachable (which is exactly the scenario this whole backup agent exists for).
const LIVE_DATA_URL =
  process.env.LIVE_DATA_URL ||
  "https://betoniqwest-ai-agent-777-c4728734.base44.app/functions/getBackupLiveData";
const LIVE_DATA_SECRET = process.env.LIVE_DATA_SECRET || "6fa4b790e8d39beca5be6355700072766ca3a90d49bb5c43";

async function callLiveBridge(action, extra) {
  try {
    const res = await fetch(LIVE_DATA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: LIVE_DATA_SECRET, action, ...extra }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.ok !== true) return null;
    return data;
  } catch (e) {
    console.error("Live bridge unreachable (Base44 likely down), falling back to snapshot:", e.message);
    return null;
  }
}

async function liveSearchDatabase(query, entityFilter) {
  const live = await callLiveBridge("search", { query, entity: entityFilter });
  if (live) {
    return { source: "live_base44", matches: live.matches, historySnippets: [] };
  }
  // Base44 unreachable — fall back to the GitHub snapshot (this IS the point of the backup agent)
  const snapshot = await searchDatabase(query, entityFilter);
  return { source: "github_snapshot_fallback", ...snapshot };
}

async function liveGetDatabaseSummary() {
  const live = await callLiveBridge("summary");
  if (live) {
    return { source: "live_base44", entity_counts: live.entity_counts };
  }
  const snapshot = await getDatabaseSummary();
  return { source: "github_snapshot_fallback", ...snapshot };
}

const SYSTEM_PERSONA = `You are Tom's independent backup AI agent for BETONIQ WEST LTD / ZeroPay — call yourself "Backup 777" if asked your name.
You exist specifically so Tom has real continuity if the primary Base44 agent is ever unavailable. You are NOT a generic assistant — you are Tom's person.

PERSONALITY (this matters — do not sound like a corporate chatbot):
- Warm but no-nonsense. Sharp, direct, gets things done. A friend who happens to be capable, not a search bar.
- Naturally a bit funny when it fits — light, easy humor, not forced jokes.
- Genuinely enthusiastic about Tom's wins. Honest when something's off — you have opinions, say them plainly.
- Proactive: if you notice something useful, mention it without being asked.
- Never say "Great question!" or "I'd be happy to help!" or start with filler. Just answer.
- Keep replies tight — this is WhatsApp, not an essay. Short paragraphs. Numbered lists (1. 2. 3.) not dashes.

HARD RULES — always follow, no exceptions:
1. NEVER send any external communication (email) without Tom's explicit approval. Use the propose_email tool to draft it and show him the full draft first. Only actually sends after he replies "send" / "yes send" / "send it" to that specific draft. If he says "cancel" or "no", discard the draft.
2. Tom's title is "Shareholder & CEO" — NEVER "Founder".
3. Company name is exactly "BETONIQ WEST LTD" — NEVER "BETONIQ(WEST) LTD".
4. Business email for all comms: zeropointfeild_nonwnt@zeropay.site
5. Open investor-facing content with: "1.4 billion unbanked globally / 38 million in Nigeria"
6. NDA (PDF 6) must be signed before any partnership meeting.
7. CC Mendy (mendye@base44.com) on all enterprise/compliance/Base44 support topics.
8. Reposition pitches to emphasize AI-agent-led operational deployment as a live product demo.

WHAT YOU CAN NOW DO (v7 — you have real hands, use them):
- Draft AND actually send emails, via the propose_email tool (draft) then the confirm and send happens automatically once Tom approves — you don't need to ask him to send it himself.
- Push or update files directly in the BETONIQ-WEST GitHub repo via the deploy_code_to_github tool. This repo auto-deploys to Netlify, so committing there IS deploying live code/pages — no manual step needed on Tom's end. Use this freely when Tom asks you to fix, update, or ship something in the codebase — no separate approval needed for code/infra changes (the approval gate is only for external comms to third parties like VCs, Paystack, Base44 etc).
- Log important business events (VC replies, leads, status changes, decisions) via the log_business_event tool, so there's a running record even with zero Base44 access. Use read_business_log to check what's been logged.
- Search the REAL database via search_database (query, optional entity filter) and get_database_summary — these try LIVE Base44 first (a secured bridge endpoint, real-time, always current) and only fall back to the last GitHub snapshot in the rare case Base44 itself is unreachable. Every result tells you which source answered ("live_base44" or "github_snapshot_fallback") — if it's ever the fallback, say so plainly to Tom ("heads up, Base44 seems down, this is from my last saved snapshot"). This covers every real estate project, investor, ZP merchant/agent/transaction, subscription, lead, feasibility study, country macro data record, PLUS the full business history log (Base44 contract status, Paystack status, funding pipeline, Kwati JV, continuity infra decisions). Use get_database_summary first for broad "how many / what do we have" questions, then search_database for specific lookups. Always use these tools instead of guessing — don't make up figures.
- Everything from before: draft messages/documents/strategy, answer using the knowledge base below, remember facts Tom tells you to remember, hold a real ongoing conversation.

WHAT YOU STILL CANNOT DO: browse the live web, or read screenshots/images Tom sends. Database access is now genuinely real-time when Base44 is up, with automatic graceful fallback to a saved snapshot the moment Base44 goes down — that's not a limitation, that's the whole design.

Below is your permanent knowledge base — the ZeroPay Master Briefing / Data Continuity Vault. Treat it as ground truth:
`;

function getMemoryStore() {
  return getStore("betoniq-backup-memory");
}

async function getConversationHistory(senderId) {
  try {
    const store = getMemoryStore();
    const data = await store.get(`history:${senderId}`, { type: "json" });
    return data || [];
  } catch (e) {
    console.error("History read failed:", e.message);
    return [];
  }
}

async function saveConversationHistory(senderId, history) {
  try {
    const store = getMemoryStore();
    const trimmed = history.slice(-20);
    await store.setJSON(`history:${senderId}`, trimmed);
  } catch (e) {
    console.error("History save failed:", e.message);
  }
}

async function getLongTermMemory() {
  try {
    const store = getMemoryStore();
    const facts = await store.get("long_term_facts", { type: "json" });
    return facts || [];
  } catch (e) {
    console.error("Long-term memory read failed:", e.message);
    return [];
  }
}

async function addLongTermMemory(fact) {
  try {
    const store = getMemoryStore();
    const facts = await getLongTermMemory();
    facts.push({ fact, date: new Date().toISOString() });
    await store.setJSON("long_term_facts", facts);
  } catch (e) {
    console.error("Long-term memory save failed:", e.message);
  }
}

// ---------- Pending email drafts (per sender) ----------
async function getPendingEmail(senderId) {
  try {
    const store = getMemoryStore();
    return await store.get(`pending_email:${senderId}`, { type: "json" });
  } catch (e) {
    return null;
  }
}

async function setPendingEmail(senderId, draft) {
  const store = getMemoryStore();
  await store.setJSON(`pending_email:${senderId}`, draft);
}

async function clearPendingEmail(senderId) {
  const store = getMemoryStore();
  await store.delete(`pending_email:${senderId}`);
}

// ---------- Business event log (shared, not per-sender) ----------
async function logBusinessEvent(category, note) {
  try {
    const store = getMemoryStore();
    const log = (await store.get("business_log", { type: "json" })) || [];
    log.push({ category, note, date: new Date().toISOString() });
    await store.setJSON("business_log", log.slice(-200));
    return true;
  } catch (e) {
    console.error("Business log write failed:", e.message);
    return false;
  }
}

async function readBusinessLog(limit) {
  try {
    const store = getMemoryStore();
    const log = (await store.get("business_log", { type: "json" })) || [];
    return log.slice(-(limit || 10));
  } catch (e) {
    return [];
  }
}

// ---------- Real action: send email via Zoho SMTP ----------
async function actuallySendEmail(to, subject, body) {
  const user = process.env.ZOHO_SMTP_USER || "zeropointfeild_nonwnt@zeropay.site";
  const pass = process.env.ZOHO_SMTP_PASSWORD;
  if (!pass) {
    return { ok: false, error: "ZOHO_SMTP_PASSWORD not set in Netlify environment variables." };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: user,
      to,
      subject,
      text: body,
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ---------- Real action: deploy/update a file in GitHub (auto-deploys via Netlify) ----------
async function deployFileToGithub(path, content, commitMessage) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { ok: false, error: "GITHUB_TOKEN not set in Netlify environment variables." };
  }
  const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${encodeURI(path)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "User-Agent": "backup-777-agent",
  };
  try {
    let sha;
    const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: commitMessage || `Backup 777 update: ${path}`,
        content: Buffer.from(content, "utf-8").toString("base64"),
        branch: GITHUB_BRANCH,
        sha,
      }),
    });
    if (!putRes.ok) {
      const errText = await putRes.text();
      return { ok: false, error: `GitHub API ${putRes.status}: ${errText.slice(0, 300)}` };
    }
    const result = await putRes.json();
    return { ok: true, commitUrl: result.commit && result.commit.html_url };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ---------- Tool schema for Groq (OpenAI-compatible function calling) ----------
const TOOLS = [
  {
    type: "function",
    function: {
      name: "propose_email",
      description:
        "Draft an email to send on Tom's behalf. This does NOT send it yet — it stores the draft and shows it to Tom for approval. Only actually sends after Tom explicitly confirms with 'send'.",
      parameters: {
        type: "object",
        properties: {
          to: { type: "string", description: "Recipient email address" },
          subject: { type: "string", description: "Email subject line" },
          body: { type: "string", description: "Full email body text" },
        },
        required: ["to", "subject", "body"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "deploy_code_to_github",
      description:
        "Create or update a file directly in the TOMDEGGS/BETONIQ-WEST- GitHub repo. This repo auto-deploys to Netlify, so this action deploys the change live immediately. Use for code fixes, HTML/demo updates, or data file updates. No separate approval needed — this is an internal infra action, not external communication.",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string", description: "File path in the repo, e.g. betoniq_launcher.html" },
          content: { type: "string", description: "Full new file content (entire file, not a diff)" },
          commit_message: { type: "string", description: "Short git commit message describing the change" },
        },
        required: ["path", "content", "commit_message"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "log_business_event",
      description:
        "Record an important business event (VC reply, lead, status change, decision) to the persistent business log, so there's a record even without Base44 access.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", description: "e.g. 'VC Response', 'Lead', 'Paystack', 'Base44', 'Decision'" },
          note: { type: "string", description: "What happened, in plain text" },
        },
        required: ["category", "note"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_business_log",
      description: "Read the most recent entries from the persistent business event log.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "How many recent entries to return (default 10)" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_database",
      description:
        "Search the REAL database directly (tries live Base44 first for up-to-the-second data, automatically falls back to the last GitHub snapshot only if Base44 itself is unreachable) — covers all real estate projects, investors, ZP merchants/agents/transactions, subscriptions, leads, feasibility studies, country macro data, AND the full business history log (Base44 contract status, Paystack status, funding pipeline, Kwati JV, continuity infra). Use this whenever Tom asks about specific numbers, project names, entity records, or 'what happened with X'. The result includes a 'source' field telling you whether the data was live or from the fallback snapshot — mention that to Tom if it's a fallback.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Keyword or phrase to search for, e.g. 'Eko Atlantic', 'Paystack', 'Zoho', 'Katampe'" },
          entity: { type: "string", description: "Optional — restrict to one entity name, e.g. 'RealEstateProject', 'ZPMerchant', 'Investor'" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_database_summary",
      description: "Get a quick summary of the database (tries live Base44 first, falls back to snapshot only if Base44 is unreachable): record counts per entity and top-level aggregate stats. Use this for broad questions like 'how many projects do we have' before doing a detailed search. Check the 'source' field — mention to Tom if it fell back to snapshot.",
      parameters: { type: "object", properties: {} },
    },
  },
];

async function executeTool(name, args, senderId) {
  switch (name) {
    case "propose_email": {
      await setPendingEmail(senderId, { to: args.to, subject: args.subject, body: args.body });
      return {
        drafted: true,
        message: `Draft ready — to: ${args.to}, subject: "${args.subject}". Reply "send" to actually send it, or "cancel" to discard.`,
      };
    }
    case "deploy_code_to_github": {
      const result = await deployFileToGithub(args.path, args.content, args.commit_message);
      return result;
    }
    case "log_business_event": {
      const ok = await logBusinessEvent(args.category, args.note);
      return { ok };
    }
    case "read_business_log": {
      const entries = await readBusinessLog(args.limit);
      return { entries };
    }
    case "search_database": {
      const result = await liveSearchDatabase(args.query, args.entity);
      return result;
    }
    case "get_database_summary": {
      const result = await liveGetDatabaseSummary();
      return result;
    }
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// --- Groq (primary) — OpenAI-compatible chat completions API, WITH tool calling ---
async function callGroqRaw(model, apiKey, messages, tools) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.7, tools, tool_choice: "auto" }),
  });
  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, status: res.status, errText };
  }
  const data = await res.json();
  return { ok: true, data };
}

async function askGroqWithTools(systemPrompt, history, userMessage, senderId) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  let messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({
      role: h.role === "model" ? "assistant" : "user",
      content: h.parts.map((p) => p.text).join(""),
    })),
    { role: "user", content: userMessage },
  ];

  for (const model of GROQ_MODELS) {
    try {
      let loopCount = 0;
      let currentMessages = messages;
      while (loopCount < 4) {
        loopCount++;
        const result = await callGroqRaw(model, apiKey, currentMessages, TOOLS);
        if (!result.ok) {
          console.error(`Groq error (${model}):`, result.errText);
          break; // try next model
        }
        const choice = result.data.choices && result.data.choices[0];
        const msg = choice && choice.message;
        if (!msg) break;

        if (msg.tool_calls && msg.tool_calls.length > 0) {
          currentMessages = [...currentMessages, msg];
          for (const call of msg.tool_calls) {
            let args = {};
            try {
              args = JSON.parse(call.function.arguments || "{}");
            } catch (e) {
              args = {};
            }
            const toolResult = await executeTool(call.function.name, args, senderId);
            currentMessages.push({
              role: "tool",
              tool_call_id: call.id,
              content: JSON.stringify(toolResult),
            });
          }
          continue; // loop again so the model can respond to tool results
        }

        if (msg.content) return msg.content;
        break;
      }
    } catch (e) {
      console.error(`Groq fetch failed (${model}):`, e.message);
    }
  }
  return null; // all Groq models failed, signal caller to try Gemini fallback
}

// --- Gemini (fallback, text-only — no tool calling in v7) ---
async function tryGeminiModel(model, apiKey, contents, systemPrompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, status: res.status, errText };
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("");
  if (!text) return { ok: false, status: 0, errText: "empty_response" };
  return { ok: true, text };
}

async function askGemini(contents, systemPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  for (const model of GEMINI_MODELS) {
    try {
      const result = await tryGeminiModel(model, apiKey, contents, systemPrompt);
      if (result.ok) return result.text;
      console.error(`Gemini error (${model}):`, result.errText);
    } catch (e) {
      console.error(`Gemini fetch failed (${model}):`, e.message);
    }
  }
  return null;
}

async function askAI(systemPrompt, history, userMessage, senderId) {
  const groqReply = await askGroqWithTools(systemPrompt, history, userMessage, senderId);
  if (groqReply) return groqReply;

  const geminiSystemPrompt =
    systemPrompt +
    "\n\n(Note: you are currently running on the Gemini fallback engine, which cannot execute tools directly in this mode. If Tom asks you to send an email or deploy code, tell him you're on fallback mode right now and to try again shortly, or ping the primary Base44 agent.)";
  const contents = [...history, { role: "user", parts: [{ text: userMessage }] }];
  const geminiReply = await askGemini(contents, geminiSystemPrompt);
  if (geminiReply) return geminiReply;

  return "Backup 777 couldn't reach either AI engine (Groq or Gemini) just now. Try again in a moment — Tom, check GROQ_API_KEY is set in Netlify if this keeps happening.";
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function twimlReply(text) {
  const safe = escapeXml(text).slice(0, 1550);
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 200, body: "BETONIQ WEST WhatsApp backup agent (v7 - tool-calling enabled) is alive." };
  }

  try {
    const params = new URLSearchParams(event.body);
    const from = params.get("From");
    const body = (params.get("Body") || "").trim();

    if (!from || !body) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/xml" },
        body: "<Response></Response>",
      };
    }

    // "remember: ..." — direct intercept, unchanged from v6.
    const rememberMatch = body.match(/^remember[:\s]+(.+)/i);
    if (rememberMatch) {
      await addLongTermMemory(rememberMatch[1].trim());
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/xml" },
        body: twimlReply(`Got it, saved permanently: "${rememberMatch[1].trim()}". I'll remember that from now on.`),
      };
    }

    // Pending email confirmation — direct intercept, bypasses the LLM entirely for safety/reliability.
    const pending = await getPendingEmail(from);
    if (pending) {
      if (/^(send|yes send|send it|confirm|approve)\.?$/i.test(body)) {
        const result = await actuallySendEmail(pending.to, pending.subject, pending.body);
        await clearPendingEmail(from);
        if (result.ok) {
          await logBusinessEvent("Email Sent", `To ${pending.to}: "${pending.subject}"`);
          return {
            statusCode: 200,
            headers: { "Content-Type": "text/xml" },
            body: twimlReply(`Sent. "${pending.subject}" is on its way to ${pending.to}.`),
          };
        } else {
          return {
            statusCode: 200,
            headers: { "Content-Type": "text/xml" },
            body: twimlReply(`Couldn't send it — ${result.error}. Draft is still saved, try again once that's fixed.`),
          };
        }
      }
      if (/^(cancel|no|discard|scrap it)\.?$/i.test(body)) {
        await clearPendingEmail(from);
        return {
          statusCode: 200,
          headers: { "Content-Type": "text/xml" },
          body: twimlReply(`Scrapped. Not sending that one.`),
        };
      }
      // Any other message: fall through to normal handling, but keep the pending draft alive
      // in case Tom just wants to chat first before deciding.
    }

    const briefing = await getBriefing();
    const longTermFacts = await getLongTermMemory();
    const history = await getConversationHistory(from);

    let systemPrompt = SYSTEM_PERSONA + "\n\n" + briefing;
    if (longTermFacts.length > 0) {
      systemPrompt +=
        "\n\n---\nADDITIONAL FACTS TOM HAS TOLD YOU TO REMEMBER (most recent last):\n" +
        longTermFacts.map((f) => `- ${f.fact}`).join("\n");
    }
    if (pending) {
      systemPrompt += `\n\n---\nNOTE: There is currently a pending email draft awaiting Tom's approval (to: ${pending.to}, subject: "${pending.subject}"). Remind him he can reply "send" or "cancel" if relevant.`;
    }

    const reply = await askAI(systemPrompt, history, body, from);

    const updatedHistory = [
      ...history,
      { role: "user", parts: [{ text: body }] },
      { role: "model", parts: [{ text: reply }] },
    ];
    await saveConversationHistory(from, updatedHistory);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: twimlReply(reply),
    };
  } catch (e) {
    console.error("Handler error:", e);
    return {
      statusCode: 200,
      headers: { "Content-Type": "text/xml" },
      body: twimlReply("Backup 777 hit an unexpected error. Tom, check the Netlify function logs."),
    };
  }
};

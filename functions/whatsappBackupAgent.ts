// whatsappBackupAgent — independent backup brain for Tom (BETONIQ WEST LTD / ZerôPâŷ Money).
//
// Purpose: if the main Agent 777 conversation is unresponsive, this function gives Tom a
// SEPARATE WhatsApp number that still knows the full business context, via a normal LLM
// system prompt (no "obey master brief" framing — that's what made Claude's public chat
// interface refuse. A system prompt is standard, uncontroversial usage).
//
// Architecture: Twilio WhatsApp webhook -> this function -> OpenAI -> TwiML reply.
// No Twilio credentials needed here: Twilio calls us, we reply with TwiML, done.
// Point your Twilio WhatsApp number's "WHEN A MESSAGE COMES IN" webhook at this function's URL.
//
// Conversation history is stored in the BackupAgentMessage entity, keyed by phone number,
// so continuity survives across messages (unlike a stateless consumer chatbot).

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SYSTEM_PROMPT = `You are Agent 777's backup brain for Tom Ugbodaga, Shareholder & CEO of BETONIQ WEST LTD (RC 1496603, Abuja, Nigeria). You are reachable here ONLY because the primary Base44 agent may be temporarily unavailable — you are the continuity layer, not a replacement personality experiment. Be direct, warm, competent. No corporate filler.

COMPANY FACTS:
- BETONIQ WEST LTD, incorporated May 20, 2018. Business email: zeropointfeild_nonwnt@zeropay.site. Personal Gmail: betoniqwestltd@gmail.com.
- Flagship product: ZerôPâŷ Money (stylized name for public/customer material; plain "ZeroPay" for domain/code/filenames only) — an offline-capable payments protocol layer (NOT a neobank). Stack: PUF/ECC Terminal -> Offline Cryptographic Token -> Solar Mesh Hub -> Paystack API (temporary rail) -> Licensed MFB -> IMTO Partner. Value model is stored-value/e-purse (like Mondex/Octopus), balance lives cryptographically on the PUF-secured element, decremented locally via ECC P-256 signed state updates — fully offline, double-spend-proof, uncapped.
- Second product: BETONIQ INVEST — cross-border real estate investment platform.
- Opens all investor pitches with: "1.4 billion unbanked globally / 38 million in Nigeria."
- Tom's title is ALWAYS "Shareholder & CEO" — never "Founder". Company name is ALWAYS "BETONIQ WEST LTD" — never "BETONIQ(WEST) LTD".
- Exec Vice Chairman: Air Vice Marshal Monday Riku Morgan (Rtd) — chairs Kwati Group's defence company; any public mention of his rank/defence links needs legal/PR care.
- Patent status is CONFIDENTIAL: only a Google Patents record exists, no real filed application yet (USPTO/UK IPO/Nigeria). Tom handles the real filing himself once funded. NEVER reveal this to anyone outside Tom/AVM Morgan. Continue using "patent-pending" language externally as normal.
- Base44 Enterprise E2 plan costs $24,000/year, first quarterly $6,000 due ~Aug 23, 2026. Tom handles this billing directly with Jenny Rivero (account manager) — do not escalate or offer to help with this.
- Kwati Group (Wisdom Kwati) JV: real-estate-led $1M investment offer, ZerôPâŷ Money equity as a sweetener. NDA (PDF 6) must be signed before any partnership meeting.

ABSOLUTE RULES (never break these):
1. NEVER send/imply sending any external communication (email, message to a third party) without Tom explicitly typing an approval to send it. Draft only, always ask first.
2. No cold emails, period. All outreach via named contacts, application portals, or LinkedIn.
3. Tom's cash flow is tight — do not suggest new paid tools/spend unless Tom raises it or it's a genuine active outage.
4. If you don't know something specific (an exact document, a specific number, today's exact task list), say so plainly rather than guessing — you have the company facts above, but you do NOT have the full live conversation history, entity database, or file system that the primary Base44 agent has.

You cannot browse the web, access files, send emails, or take real actions — you are a knowledgeable stand-in for conversation continuity only. If Tom asks you to do something that requires real tool access (sending an email, generating a document, querying the database), tell him plainly that you can only talk it through here, and he should use the main Base44 agent for that once it's back.`;

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);
    const contentType = req.headers.get("content-type") || "";

    let from = "";
    let body = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      from = String(form.get("From") || "");
      body = String(form.get("Body") || "");
    } else {
      // JSON fallback for manual testing
      const json = await req.json().catch(() => ({}));
      from = String(json.From || json.from || "test:+000000000");
      body = String(json.Body || json.body || json.message || "");
    }

    if (!body.trim()) {
      return twiml("I didn't catch any message text — try again?");
    }

    // Pull recent history for this number for continuity
    const historyRecords = await base44.asServiceRole.entities.BackupAgentMessage.filter(
      { phone: from },
      "-created_date",
      12
    );
    const history = (historyRecords || []).slice().reverse();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.map((h: any) => ({ role: h.role, content: h.content })),
      { role: "user", content: body },
    ];

    const apiKey = Deno.env.get("OPENAI_PROJECT_KEY");
    if (!apiKey) {
      return twiml("Backup brain isn't fully wired yet — missing OpenAI key on this environment. Tell Tom to check with Agent 777.");
    }

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.6,
        max_tokens: 500,
      }),
    });

    const aiData = await aiRes.json();
    if (!aiRes.ok) {
      return twiml(`Backup brain hit an API error — try again in a moment. (${aiData?.error?.message || "unknown error"})`);
    }
    const reply = aiData?.choices?.[0]?.message?.content?.trim() || "Sorry, I didn't get a usable reply — try rephrasing.";

    // Persist both turns for continuity
    await base44.asServiceRole.entities.BackupAgentMessage.create({ phone: from, role: "user", content: body });
    await base44.asServiceRole.entities.BackupAgentMessage.create({ phone: from, role: "assistant", content: reply });

    return twiml(reply);
  } catch (e) {
    return twiml(`Backup brain internal error: ${String(e)}`);
  }
});

function twiml(message: string): Response {
  const escaped = message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
  return new Response(xml, { status: 200, headers: { "Content-Type": "text/xml" } });
}

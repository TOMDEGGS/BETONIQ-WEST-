// agentAccessGate — LOAC-style (Linked Open Agentic Commerce) access gate for BETONIQ WEST / ZerôPâŷ Money structured data.
// See AGENT_COMMS_LOG.md / Master Briefing Section 11 for team context.
//
// Call with POST body: { "dataset": "countrymacro", "entitlement": "<paystack reference>" }
// entitlement can also be passed as header x-entitlement-token.
// For testing, you can also pass "simulated_user_agent" in the body — real deployments should
// rely on the actual User-Agent header, but real crawlers' headers aren't always distinguishable
// from the platform's own test harness, so BOTH the real header and the body override are checked;
// either one matching a known AI-agent signature is enough to trigger the gate.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const KNOWN_AI_CRAWLERS = [
  "gptbot", "chatgpt-user", "oai-searchbot",
  "claudebot", "claude-web", "anthropic-ai",
  "ccbot", "bytespider", "perplexitybot", "perplexity-user",
  "google-extended", "googleother", "bingbot-ai",
  "cohere-ai", "diffbot", "omgili", "omgilibot",
  "youbot", "amazonbot", "meta-externalagent", "facebookbot",
  "timpibot", "webzio-extended", "ai2bot", "img2dataset",
];

function isAiAgent(...userAgents: string[]): boolean {
  return userAgents.some((raw) => {
    const ua = (raw || "").toLowerCase();
    if (!ua) return false;
    return KNOWN_AI_CRAWLERS.some((sig) => ua.includes(sig));
  });
}

const PRICE_USD = 2.99;
const PRICE_NGN = 4500; // fixed NGN price for the test-mode demo; adjust once live rates matter

async function createPaystackAccessLink(datasetKey: string, callerUa: string) {
  const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secretKey) {
    return { error: "Paystack not configured on this environment." };
  }
  const email = "agent-access@zeropay.site"; // Paystack requires an email; this is a machine-access product, not a real customer
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: PRICE_NGN * 100, // kobo
      currency: "NGN",
      metadata: {
        product: "agent_data_access",
        dataset: datasetKey,
        caller_user_agent: callerUa,
        price_usd_reference: PRICE_USD,
      },
    }),
  });
  const data = await res.json();
  if (!res.ok || !data?.status) {
    return { error: "Failed to create payment link", details: data };
  }
  return {
    payment_url: data.data.authorization_url,
    reference: data.data.reference,
  };
}

async function verifyPaystackReference(reference: string): Promise<boolean> {
  const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secretKey || !reference) return false;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    const data = await res.json();
    return Boolean(data?.status && data?.data?.status === "success");
  } catch {
    return false;
  }
}

Deno.serve(async (req: Request) => {
  try {
    const base44 = createClientFromRequest(req);

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const datasetKey = String(body.dataset || "countrymacro").toLowerCase();
    const realUserAgent = req.headers.get("user-agent") || "";
    const simulatedUserAgent = String(body.simulated_user_agent || "");
    const entitlementRef =
      req.headers.get("x-entitlement-token") || String(body.entitlement || "");

    const isAgent = isAiAgent(realUserAgent, simulatedUserAgent);
    const effectiveUa = simulatedUserAgent || realUserAgent;

    // Humans/browsers: free, unrestricted pass-through.
    if (!isAgent) {
      return await serveDataset(base44, datasetKey, { gated: false, reason: "human_or_unknown_agent" });
    }

    // AI agent detected — check for a valid, already-verified payment.
    if (entitlementRef) {
      const paid = await verifyPaystackReference(entitlementRef);
      if (paid) {
        return await serveDataset(base44, datasetKey, { gated: true, reason: "ai_agent_paid", reference: entitlementRef });
      }
      return new Response(
        JSON.stringify({
          error: "Invalid or unverified entitlement token.",
          hint: "Complete payment at the payment_url from a fresh request, then retry with the returned reference as 'entitlement' in the body or x-entitlement-token header.",
        }),
        { status: 402, headers: { "Content-Type": "application/json" } }
      );
    }

    // AI agent, no payment yet — issue the 402 with a real machine-readable payment offer.
    const offer = await createPaystackAccessLink(datasetKey, effectiveUa);
    if ((offer as any).error) {
      return new Response(JSON.stringify(offer), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    return new Response(
      JSON.stringify({
        error: "Payment Required",
        protocol: "LOAC-lite (BETONIQ WEST / ZerôPâŷ Money)",
        message: "This structured dataset is a licensed asset, not free crawl content. AI agents must complete payment before access.",
        price_usd_reference: PRICE_USD,
        price_ngn: PRICE_NGN,
        dataset: datasetKey,
        payment_url: (offer as any).payment_url,
        reference: (offer as any).reference,
        retry_instructions: "After payment succeeds, retry this same request with 'entitlement' set to the reference above (body field or x-entitlement-token header).",
      }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: "agentAccessGate internal error", details: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

async function serveDataset(base44: any, datasetKey: string, meta: Record<string, unknown>) {
  const records = await base44.asServiceRole.entities.CountryMacroData.list();
  return new Response(
    JSON.stringify({
      dataset: datasetKey,
      access: meta,
      count: records.length,
      data: records,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

# Independent Backup AI Agent — Technical Build Plan
**Goal:** A self-hosted, open-weight-model AI agent, independent of Base44, that retains BETONIQ WEST context via the Master Briefing Document, reachable via Telegram (current $0-cost channel), within the ~$12/month budget.

## Why this now (Sep 4 2026 context)
Nvidia's confirmed $12.9B acquisition of Hugging Face is a reminder that reliance on any single third-party platform is a risk. Downloading and self-hosting open-weight models now, while freely available, gives BETONIQ WEST a genuinely independent fallback that doesn't depend on Base44, Gemini, or Hugging Face staying accessible/free.

## Recommended stack
1. **Model:** Meta Llama 3.2 3B Instruct (or Llama 3.1 8B Instruct if the VPS has more RAM). Both are open-weight, commercially usable, and small enough to run quantized (4-bit GGUF) on a low-cost VPS or even a decent laptop.
   - Alternative: Mistral 7B Instruct v0.3 (Apache 2.0, no usage restrictions).
2. **Inference engine:** llama.cpp or Ollama — both free, run quantized models efficiently on CPU, no GPU required.
3. **Hosting:** A $6-12/month VPS (Hetzner, DigitalOcean, or similar) running Ollama + a small Python/Node bridge script.
4. **Channel:** Telegram Bot API (free) — bridge script listens for messages, feeds Master Briefing Document (github.com/TOMDEGGS/BETONIQ-WEST-) as system prompt context, forwards user message + relevant context to the local model, returns the reply.
5. **Context refresh:** Bridge script re-pulls the latest Master Briefing Document and business_history_log.md from GitHub on a schedule (e.g. every 6 hours) so the backup agent stays reasonably current even without live entity access.

## What it CAN do
- Answer questions about BETONIQ WEST/ZerôPâŷ Money using the briefing document as grounding.
- Maintain a consistent persona/identity across sessions (stored locally, not tied to Base44).
- Work with zero internet dependency on Base44 specifically — only needs the VPS + GitHub + Telegram, all independent providers.

## What it CANNOT do (be upfront about this)
- It won't have live access to your entities (Investor, ZPTransaction, etc.) unless we also build a small sync script that periodically exports entity data to the same GitHub repo (Backup 777 already does this for full_data_export.json) and the bridge reads that file too. This is a small additional step, not yet built.
- It won't automatically execute actions (sending emails, filling forms) — it's a fallback for continuity/context, not a full agent replacement, unless we invest more build time into giving it tool access.

## Estimated cost
- VPS: $6-12/month.
- Telegram Bot API: $0.
- Model weights: $0 (one-time download, ~2-5GB for the 3B/7B models).
- Total: fits inside your existing $12/month cap.

## Next steps (need your go-ahead before spending)
1. Confirm which VPS provider to use (or if you already have one).
2. I download and quantize the chosen model, write the Telegram bridge script.
3. Test end-to-end: message the Telegram bot, confirm it answers correctly using the Master Briefing Document.

No money will be spent and no VPS will be provisioned without your explicit approval first.

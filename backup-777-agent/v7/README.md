BETONIQ WEST LTD — Independent WhatsApp Backup Agent (v7)
============================================================

THE BIG CHANGE FROM v6: Backup 777 now has real hands, not just a mouth.

v6's own system prompt used to say: "you cannot ... deploy code, or touch a
database — you have no hands, only text." v7 fixes that.

New capabilities (Groq engine only — tool-calling requires the primary
Groq path; if it falls back to Gemini, tools are unavailable for that
reply and it will say so):

1. SEND EMAILS FOR REAL, with the same approval gate the primary Base44
   agent uses: it drafts via Zoho SMTP, shows Tom the full draft, and only
   actually sends after he replies "send" (or cancels with "cancel").
   VERIFIED: SMTP credentials currently stored in ZOHO_SMTP_PASSWORD are
   FAILING AUTHENTICATION (535 Invalid login) as of this build. The code
   is correct and tested against smtp.zoho.com on both port 465 (SSL) and
   587 (STARTTLS) — both rejected with the current password. This is a
   credential problem, not a code problem. Tom needs to generate a fresh
   Zoho app-specific password for SMTP (Zoho Mail -> Settings -> Security
   -> App Passwords -> generate one labeled "Backup777 SMTP") and put the
   new value in Netlify env var ZOHO_SMTP_PASSWORD before this will work.

2. DEPLOY CODE FOR REAL: can create/update any file directly in the
   TOMDEGGS/BETONIQ-WEST- GitHub repo via the GitHub Contents API. That
   repo auto-deploys to Netlify, so this literally ships code/pages live —
   no manual step. VERIFIED WORKING: tested live during this build (created
   a real commit, confirmed it landed, then cleaned it up).

3. BUSINESS EVENT LOG: persistent record of things like VC replies, leads,
   status changes — stored in Netlify Blobs, so there's a running paper
   trail even with zero Base44 access. Ask it "what's in the business log"
   any time.

Everything from v6 carries over: embedded + live-fetched Master Briefing
(now pointed at the live GitHub Data Continuity Vault instead of a static
Base44 file URL, so it self-updates whenever the vault is pushed), Groq
primary / Gemini fallback, persistent per-sender chat memory, "remember: ..."
command for permanent facts, full personality injection.

REQUIRED NETLIFY ENVIRONMENT VARIABLES (Site settings -> Environment variables):
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN   (carry over, unchanged)
- GROQ_API_KEY                            (carry over, unchanged)
- GEMINI_API_KEY                          (carry over, unchanged — fallback only)
- GITHUB_TOKEN            <-- NEW, REQUIRED for code deploys. Use a GitHub
                               classic PAT with "repo" scope (same kind Tom
                               already generated for the main agent).
- ZOHO_SMTP_PASSWORD      <-- NEW, REQUIRED for email sending. Currently
                               invalid, needs regenerating (see above).
- ZOHO_SMTP_USER          (optional, defaults to
                               zeropointfeild_nonwnt@zeropay.site)
- GITHUB_REPO             (optional, defaults to TOMDEGGS/BETONIQ-WEST-)
- MASTER_BRIEFING_URL     (optional, defaults to the live GitHub vault raw URL)

DEPLOY: same as before — zip this whole folder and drag it onto Netlify
Deploys for the existing Backup 777 site (or run `netlify deploy --prod`
from this folder if the Netlify CLI is linked). Existing env vars carry
over automatically since it's the same site; just add the two new ones
above (GITHUB_TOKEN, ZOHO_SMTP_PASSWORD) before testing send/deploy.

HOW TO TEST AFTER DEPLOY (via WhatsApp to the Backup 777 number):
1. "log this: testing v7 tool calling" -> should confirm it logged a
   business event.
2. "what's in the business log" -> should read it back.
3. "draft an email to betoniqwestltd@gmail.com, subject Test, saying this
   is a v7 test" -> should show a draft and ask you to say "send" or
   "cancel". Try "cancel" first to confirm that path works safely.
4. Ask it to fix something trivial in a demo file, e.g. "in
   betoniq_launcher.html, change nothing, just confirm you can read and
   push that file back unchanged as a test commit" -> should commit and
   give you the GitHub commit link.

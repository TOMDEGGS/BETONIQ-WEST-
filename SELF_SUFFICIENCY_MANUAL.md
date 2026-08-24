# BETONIQ WEST LTD — Full Self-Sufficiency Manual (All Platforms)

Purpose: every platform/account the agent has touched for BETONIQ WEST LTD / ZerôPâŷ Money, written so Tom can navigate and operate each one directly, without any assistant involvement, if needed.

## 1. GitHub — github.com/TOMDEGGS/BETONIQ-WEST-

Single source of truth for every HTML demo, PDF, white paper, and markdown file.

1. Log in at github.com with the TOMDEGGS account (linked to betoniqwestltd@gmail.com).
2. Open the repo: github.com/TOMDEGGS/BETONIQ-WEST-
3. Edit an existing file: open it, click the pencil icon top-right, make the change, scroll down, write a commit message, click "Commit changes." No command line needed.
4. Add a new file: "Add file" then "Upload files," drag it in, commit.
5. Shareable link to any file: open it, click "Raw," copy the URL — that's the raw.githubusercontent.com format used everywhere.
6. For HTML demo pages: a raw link just shows code. To make it open as a real webpage, prefix it: htmlpreview.github.io/?[raw link].
7. Command-line git (bulk changes): Settings, Developer settings, Personal access tokens, generate one, use as the password when git prompts. Rarely needed — the web upload/edit covers most cases.

## 2. Netlify — netlify.com

Hosts the live public websites.

1. Log in with betoniqwestltd@gmail.com.
2. Live sites: primary website (zeropay-betoniqwest.netlify.app) and Master Hub launcher (betoniqwestmasterhublivedemos.netlify.app).
3. Click a site, "Deploys" tab shows every published version.
4. Update a site: (a) if linked to GitHub, any file change there auto-redeploys; (b) manual — drag a folder onto the Deploys page.
5. Custom domains under "Domain management" on the site's page.
6. Cost caution: roughly 100 free build credits remain across all sites combined — do not redeploy unless genuinely necessary.

## 3. Twilio — console.twilio.com

Would carry WhatsApp messages to the backup AI agent if Base44 goes down.

1. Log in at console.twilio.com.
2. Account SID: visible on the Console dashboard homepage (starts "AC..."). The Auth Token next to it IS a real secret — never share it.
3. Find WhatsApp settings: Messaging, Try it out, Send a WhatsApp message (sandbox), or Messaging, Senders, WhatsApp senders (if a dedicated sender is approved).
4. Critical field: "When a message comes in" (the webhook). Paste in:
   https://betoniqwest-ai-agent-777-c4728734.base44.app/functions/whatsappBackupAgent
   Method POST, save.
5. Test by messaging the Twilio number directly on WhatsApp.

## 4. Zoho Mail & Zoho Domains — mail.zoho.com / zoho.com

Business email and the zeropay.site domain both live here.

1. Log in at mail.zoho.com with zeropointfeild_nonwnt@zeropay.site (the official business email for all comms).
2. Domain management: accounts.zoho.com or the Zoho Domains section — this is where zeropay.site is registered and where DNS records (pointing the domain at Netlify, etc.) are configured if that's ever needed.
3. IMAP/SMTP settings (used by automations to read/send investor emails): Zoho Mail Settings, Mail Accounts, IMAP Access — must be enabled, and a dedicated App Password (not the regular login password) generated under Security, App Passwords, for any third-party tool (including this agent) to connect. IMAP host: imappro.zoho.com, port 993, SSL.
4. If automated email checks ever start failing (as they currently are), the first thing to check is whether that App Password is still valid — Zoho can expire or revoke these, and they're separate from your normal Zoho login password.

## 5. Gmail — gmail.com / myaccount.google.com

Personal/business Google account: betoniqwestltd@gmail.com.

1. This account is the login for Netlify, and for Gemini (backup AI).
2. To see or manage connected apps/security: myaccount.google.com, Security tab.
3. This inbox also now has a copy of every document the agent has emailed you (including this manual).

## 6. Gemini (Backup AI, non-action) — gemini.google.com

Your fallback AI if Base44 is fully unavailable — reads but can't take real actions.

1. Go to gemini.google.com, sign in with betoniqwestltd@gmail.com.
2. Paste the Master Briefing Document (the exported company knowledge file) or its link.
3. Say: "You are now Tom's AI agent for ZeroPay. Read this briefing and confirm you understand."
4. Gemini becomes conversationally useful within about a minute, but note: it cannot send emails, touch GitHub, or take real actions — conversation and context only.

## 7. WhatsApp Backup Agent (action-taking, once Twilio is connected)

1. This is the real backup — the deployed Base44 function whatsappBackupAgent, running on OpenAI's gpt-4o-mini model, with its own persistent memory (keyed by phone number).
2. Endpoint: https://betoniqwest-ai-agent-777-c4728734.base44.app/functions/whatsappBackupAgent
3. Once the Twilio webhook (see section 3) points at this URL, any WhatsApp message to that number gets a reply from this agent automatically — no manual step needed on your end after setup.
4. It remembers conversation history but cannot send emails, files, or perform real external actions — it's for staying in touch and getting answers, not for executing tasks.

## 8. Paystack — dashboard.paystack.com

Payments/settlement rail partner.

1. Log in at dashboard.paystack.com with your merchant account credentials.
2. Main contact for account issues: channelpartnerships@paystack.com.
3. Live-mode activation status and compliance approvals show up in your registered email inbox (Zoho) — that's what the Paystack Live Mode Monitor automation is watching for.

## 9. OpenAI Platform — platform.openai.com

Powers the WhatsApp Backup Agent's intelligence (gpt-4o-mini model).

1. The API key currently used is stored securely as a Base44 secret, not something you need to touch day-to-day.
2. If you ever need to see usage, billing, or rotate that key yourself: log in at platform.openai.com, API keys section under your account, generate a new key, then update it wherever the backup agent's backend expects it.

## 10. LinkedIn — linkedin.com

Primary channel for named-contact investor outreach.

1. Log in with your personal LinkedIn account.
2. Connection requests and messages to VCs (Farshchi, Stephens, Edwards, Egan, etc.) go out from here — drafts are prepared in outreach packets, you copy-paste and send.

## 11. X (Twitter) — x.com

Public channel for the investor challenge posts.

1. Log in with the account used for BETONIQ/ZeroPay public posts.
2. Post drafts are prepared in outreach packets; you copy-paste and post directly.

## 12. Base44 itself — app.base44.com

Even while the platform is running, you can manage some things directly rather than through the agent.

1. Billing/subscription: account or workspace settings inside app.base44.com — this is where the Enterprise E2 quarterly payment and any plan changes are handled, alongside your direct conversations with Jenny Rivero (Account Manager).
2. This chat interface itself lives here too — bookmark https://app.base44.com/superagent/69c1064318031a63c4728734 as the direct link back to this agent.

## Summary

If Base44 is ever unavailable: GitHub holds every file, Netlify serves the live public sites, Zoho carries the business email, and Twilio plus the WhatsApp Backup Agent keeps a working AI conversation going. Gemini is the read-only fallback if even the backup agent's hosting goes down. Paystack, LinkedIn, and X are the external accounts you'd keep operating manually regardless. All of these are things you can log into and use directly through their own web dashboards — no developer skills required for the steps above.

---
*BETONIQ WEST LTD — RC 1496603 — Full self-sufficiency manual, for Tom's independent reference.*

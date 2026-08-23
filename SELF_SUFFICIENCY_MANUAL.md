# BETONIQ WEST LTD — Self-Sufficiency Manual: GitHub, Netlify, Twilio

Purpose: everything the agent does on these 3 platforms, written so Tom can do it himself without any assistant involvement if Base44 becomes unavailable.

## 1. GitHub (github.com/TOMDEGGS/BETONIQ-WEST-)

This is the single source of truth for every HTML demo, PDF, white paper, and markdown file.

1. Log in at github.com with the TOMDEGGS account (linked to betoniqwestltd@gmail.com).
2. Open the repo: github.com/TOMDEGGS/BETONIQ-WEST-
3. **Edit an existing file (no command line needed):** open the file in the repo view, click the pencil/edit icon top-right, make the change, scroll down, write a short commit message, click "Commit changes."
4. **Add a new file:** inside the repo, click "Add file" → "Upload files," drag the file in, write a commit message, click "Commit changes."
5. **Get a shareable link to any file:** open the file, click "Raw," copy that URL. That's the raw.githubusercontent.com format used everywhere in this project.
6. **For interactive HTML demo pages specifically:** a raw link just shows code, not a working page. To make it open as an actual webpage, prefix it: htmlpreview.github.io/?[raw link]. That's the format behind every "zeropay_demo.html"-style link.
7. **If you ever need real command-line git** (bulk multi-file changes): go to Settings → Developer settings → Personal access tokens → generate one, use it as the password when git prompts for authentication. But the web upload/edit above covers the vast majority of real use cases.

## 2. Netlify (netlify.com)

This hosts the live public websites (no login required for visitors).

1. Log in at netlify.com with betoniqwestltd@gmail.com.
2. Two live sites on the dashboard: the primary website (zeropay-betoniqwest.netlify.app) and the Master Hub launcher (betoniqwestmasterhublivedemos.netlify.app).
3. Click a site name → "Deploys" tab shows every version ever published.
4. **Two ways to update a live site:**
   a. If the site is linked to the GitHub repo, any file change on GitHub auto-triggers a redeploy — nothing to do on Netlify itself.
   b. Manual deploy — drag a folder of files straight onto the deploy area on the Deploys page; Netlify publishes in seconds.
5. Custom domain settings (e.g. pointing zeropay.site) live under "Domain management" on that site's page.
6. **Cost caution:** roughly 100 free build credits remain across all these sites combined. Do not redeploy or touch settings unless genuinely necessary — each deploy uses up part of that budget.

## 3. Twilio (console.twilio.com)

This is what would carry WhatsApp messages to the backup AI agent if Base44 goes down.

1. Log in at console.twilio.com.
2. Account SID: visible on your Twilio Console dashboard homepage (starts with "AC..."). Not fully secret, but no need to paste it anywhere public either — just glance at it there when needed. The Auth Token shown next to it on the dashboard IS a real secret — never share or paste that anywhere public.
3. Find the WhatsApp number's settings: Messaging (left sidebar) → Try it out → Send a WhatsApp message (sandbox), or Messaging → Senders → WhatsApp senders (if a dedicated approved sender exists).
4. The critical field is **"When a message comes in"** — this is the webhook. Paste in:
   https://betoniqwest-ai-agent-777-c4728734.base44.app/functions/whatsappBackupAgent
   Set the method to POST, then save.
5. Once saved, any WhatsApp message sent to that Twilio number is automatically forwarded to the backup AI agent — no further Twilio secrets needed, it just receives the message and sends back a reply.
6. **To test:** send a WhatsApp message to the Twilio number and confirm the backup agent replies.

## Summary of what this replaces
If Base44 is ever unavailable: GitHub holds every file, Netlify serves the live public sites from those files, and Twilio + this webhook keeps a working AI conversation going via WhatsApp using the Master Briefing Document as its knowledge base. All three are things Tom can operate directly through their own web dashboards — no developer skills required for the day-to-day tasks above.

---
*BETONIQ WEST LTD — RC 1496603 — Self-sufficiency manual, for Tom's independent reference.*

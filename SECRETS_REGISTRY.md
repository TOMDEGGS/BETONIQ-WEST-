# ZEROPAY SECRETS REGISTRY
## BETONIQ WEST LTD — Confidential
## Last Updated: July 31, 2026

This file lists ALL secrets/API keys that must be re-configured if moving platforms.
The actual secret VALUES are stored in Base44 Secrets Vault (Settings → Security → Secrets).
To retrieve values: go to base44.com → Agent Settings → Security → Secrets → Reveal.

---

## SECRETS STORED IN BASE44 VAULT

### 1. ZOHO_SMTP_PASSWORD
Used for: Sending all outbound VC emails via Zoho SMTP
Email: zeropointfeild_nonwnt@zeropay.site
SMTP Server: smtp.zoho.com | Port: 465 (SSL)
Where to get: Zoho Mail → Settings → Security → App Passwords → Generate

### 2. ZOHO_IMAP_PASSWORD  
Used for: Monitoring incoming VC responses in real time
IMAP Server: imap.zoho.com | Port: 993 (SSL)
Where to get: Zoho Mail → Settings → Security → App Passwords → IMAP app password
Note: This is a SEPARATE app password from SMTP — must be created specifically as "BETONIQ IMAP"

### 3. PAYSTACK_SECRET_KEY
Used for: Paystack payment processing (Merchant Agreement signed July 14, 2026)
Paystack Merchant ID: Signed agreement with channelpartnerships@paystack.com
Where to get: Paystack Dashboard → Settings → API Keys & Webhooks
Live Key starts with: sk_live_...
Test Key starts with: sk_test_...

---

## CREDENTIALS NOT IN BASE44 (stored externally)

### GitHub
Username: TOMDEGGS
Repo: github.com/TOMDEGGS/BETONIQ-WEST-
Access: Personal Access Token (stored in GitHub Settings → Developer Settings → PAT)

### Zoho Mail (Primary Email Account)
Account: zeropointfeild_nonwnt@zeropay.site
Login: zoho.com/mail
Recovery: betoniqwestltd@gmail.com

### Netlify (Landing Page Hosting)
Site: curious-pithivier-cff79f.netlify.app
Login: netlify.com with betoniqwestltd@gmail.com
Site URL: https://curious-pithivier-cff79f.netlify.app

### Google Account (Gmail + Gemini + Drive)
Email: betoniqwestltd@gmail.com
Gemini Backup AI: gemini.google.com (sign in with this Gmail)
Google Drive backup: drive.google.com

### Base44 Account
Email: betoniqwestltd@gmail.com
Enterprise E2 plan: $24,000/year
First quarterly payment: $6,000 due August 23, 2026
Account Manager: Jenny Rivero — jennyr@base44.com

---

## HOW TO RECREATE ON A NEW PLATFORM (Step by Step)

1. Go to Gemini (gemini.google.com) — sign in with betoniqwestltd@gmail.com
2. Paste Master Briefing Document — URL in ZEROPAY_MASTER_BRIEFING.md
3. Gemini is now operational as backup AI

4. For email sending: configure Zoho SMTP
   - Server: smtp.zoho.com | Port: 465 | SSL
   - Username: zeropointfeild_nonwnt@zeropay.site
   - Password: [generate new app password from Zoho Security settings]

5. For email monitoring: configure Zoho IMAP
   - Server: imap.zoho.com | Port: 993 | SSL
   - Username: zeropointfeild_nonwnt@zeropay.site
   - Password: [generate new IMAP app password from Zoho Security settings]

6. For Paystack: use existing Merchant Agreement (signed July 14, 2026)
   - Get API keys from Paystack Dashboard
   - Live mode activation pending CBN sandbox completion

7. All HTML demos are on GitHub — permanently accessible at:
   github.com/TOMDEGGS/BETONIQ-WEST-

8. Landing page is on Netlify — permanently accessible at:
   https://curious-pithivier-cff79f.netlify.app


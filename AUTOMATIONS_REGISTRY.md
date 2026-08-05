# ZEROPAY AUTOMATIONS REGISTRY
## BETONIQ WEST LTD — Confidential
## Last Updated: July 31, 2026

These are the 3 active automations running in Base44.
If platform changes, these must be recreated.

---

## AUTOMATION 1: LOI & VC Response Real-Time Monitor
Type: Scheduled (every 15 minutes)
Purpose: Monitors Zoho IMAP inbox for incoming VC responses, LOIs, term sheets
Triggers: Runs every 15 minutes, checks for new emails from VC/investor domains
Action: Alerts Tom via WhatsApp immediately when investor email received
Credits used: ~0.1 per run
Status: ACTIVE ✅

## AUTOMATION 2: Daily VC Response Monitor  
Type: Scheduled (daily)
Purpose: Daily summary of all VC inbox activity
Action: Sends daily digest of investor communications
Credits used: ~0.0 per run
Status: ACTIVE ✅

## AUTOMATION 3: Paystack Live Mode Activation Monitor
Type: Scheduled
Purpose: Monitors for Paystack live mode activation confirmation
Action: Alerts when Paystack activates ZeroPay merchant account to live mode
Credits used: ~0.1 per run
Status: ACTIVE ✅

---

## HOW TO RECREATE AUTOMATIONS ON A NEW PLATFORM

All three automations require:
1. Zoho IMAP credentials (see SECRETS_REGISTRY.md)
2. WhatsApp channel connection (or Telegram as alternative)
3. The Master Briefing Document so the AI knows what to look for

To recreate on Make.com (free tier):
- Create a "Watch Emails" scenario on Zoho IMAP
- Filter for investor/VC email domains
- Send notification via WhatsApp Business API or Gmail


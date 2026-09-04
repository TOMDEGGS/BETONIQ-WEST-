# ZerôPâŷ Terminal-Side Fraud Risk Scoring Framework
**Status:** Design v1 — rule-based, NOT a trained ML model (insufficient labeled data)
**Data reviewed:** 9 ZPTransaction records (demo/seed), 8 ZPMerchant records, 6 ZPAgent records — no fraud/not-fraud labels present in current dataset.

## Why rule-based, not ML, right now
A real ML fraud model needs hundreds/thousands of labeled transactions (fraud vs legitimate outcomes). We don't have that yet — we have demo data. Claiming an ML model exists today would be false. This framework is designed to run NOW on the terminal with zero training data, and to convert into a trained classifier later once live transactions accumulate with confirmed outcomes (chargebacks, disputes, confirmed fraud reports).

## Risk score inputs (0-100 scale, higher = riskier)
1. **Amount deviation** — transaction amount vs merchant's own daily_volume_ngn / total_transactions average. Flag if >5x typical ticket size.
2. **Offline duration risk** — time since token was generated vs 72-hour TTL. Risk increases sharply after 48h unsynced.
3. **Sync anomaly** — sync_time_seconds far outside normal range (0-2s in current data) may indicate tampering or relay attack attempts.
4. **Device/agent mismatch** — transaction device_id not previously associated with that merchant_id.
5. **Distance bounding flag** — already captured in notes field (e.g. "Dist:5cm") from the anti-relay layer; any distance reading outside the expected NFC proximity range (0-10cm) is an automatic high-risk flag.
6. **Location jump** — merchant's registered city/country vs transaction location_city/location_country mismatch.
7. **Velocity check** — multiple offline transactions queued from the same device_id within an implausibly short window before sync.

## Scoring logic (example)
- Each flag above contributes 10-25 points depending on severity.
- Score 0-30: auto-approve on sync.
- Score 31-60: flag for agent/merchant review before settlement.
- Score 61-100: hold and require manual verification (call agent, confirm with merchant) before releasing funds.

## Path to real ML model
Once live pilot transactions accumulate (target: the FID-funded pilot itself is the data-generation event), label outcomes (confirmed good / confirmed fraud/dispute) and train a lightweight gradient-boosted tree (e.g. XGBoost/LightGBM) on the same features above. This is a classical tabular ML problem — does not need Hugging Face or an LLM; runs fine on the terminal's existing hardware budget.

## Honest current status
No model is trained. This is a specification ready to implement as terminal firmware logic today, and to upgrade to a trained classifier once real transaction history with confirmed outcomes exists — which is exactly what the FID pilot will generate.

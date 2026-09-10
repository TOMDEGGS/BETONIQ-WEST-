# Zero-Network Distribution Launch Posts — Draft (Sep 10, 2026)
All copy below is ready to post as-is or edit. Tom posts these himself, per standing preference.

---

## 1. HACKER NEWS — "Show HN" post

TITLE (paste exactly, HN strips most formatting from titles):
Show HN: An offline payment protocol using PUF + ECC that works with zero connectivity

URL field: https://rawcdn.githack.com/TOMDEGGS/BETONIQ-WEST-/main/crowdfunding/back_us.html (the live crowdfunding page with all 5 payment tiers)

BODY TEXT (post this as the first comment under your own submission, HN convention):

Hi HN — I'm Tom, building ZerôPâŷ Money, a payment protocol for places where the network can't be trusted to be there when a transaction happens.

The problem: every digital payment system today — card, mobile money, bank transfer — assumes a live internet connection at the exact moment of payment. That assumption fails constantly across large parts of Africa, rural regions everywhere, and anywhere infrastructure is unreliable.

What I built: a terminal that signs transactions fully offline using ECC P-256 elliptic curve cryptography, anchored to a silicon-level Physical Unclonable Function (PUF) for tamper-proof hardware identity, with distance-bounding checks to prevent relay/replay attacks. The signed transaction is held as an offline cryptographic token for up to 72 hours, then syncs and settles automatically the moment any connectivity appears (even a few seconds of signal is enough).

I formally verified the core protocol logic using TLA+ (the same formal-verification approach used to catch real bugs in distributed systems at AWS and Azure before they ship) rather than just testing happy paths.

Currently live: a working Paystack merchant integration for settlement, and a small crowdfunding round to fund our first pilot terminal production run (link in the post URL above) if anyone wants to back real hardware getting built rather than just discuss the crypto design. I'm working on getting real dead-zone transaction footage recorded with an actual merchant this week too.

Genuinely interested in HN's take on the crypto design — particularly the distance-bounding approach against relay attacks, and any prior art I should know about. Also happy to answer anything about the offline sync/settlement model.

---

## 2. PRODUCT HUNT — Listing

PRODUCT NAME: BETONIQ INVEST — Free AI Feasibility Score

TAGLINE (60 char max): Instant AI-style ROI score for any real estate project

DESCRIPTION:
Get an instant feasibility and ROI estimate for any real estate project in seconds — no signup wall, no sales call. Plug in the country, project type, and investment amount, and get a real, data-backed score built from actual macroeconomic indicators (GDP growth, real estate market growth, political stability, foreign investment climate) — not a guess.

Built by BETONIQ WEST LTD as part of BETONIQ INVEST, an AI-powered real estate investment platform connecting global capital to verified projects across Nigeria, West Africa, the UK, and beyond.

Try it free. If you want the full AI-verified feasibility study, compliance checks, and direct access to vetted projects, that's where the paid tiers come in — but the instant score is free, always.

FIRST MAKER COMMENT (post immediately after listing goes live):
Hey Product Hunt — Tom here, Shareholder & CEO of BETONIQ WEST LTD. We built this because every real estate feasibility study I'd seen took weeks and cost thousands before you even knew if a project was worth pursuing. This tool gives you a real, data-driven directional answer in under 30 seconds, for free. Would love feedback on what other data points you'd want to see in the score. Also running a small crowdfunding round for our sister project ZerôPâŷ Money (offline payment terminals) if anyone wants to check that out too: https://rawcdn.githack.com/TOMDEGGS/BETONIQ-WEST-/main/crowdfunding/back_us.html

---

## 3. REDDIT — three tailored posts

### r/Nigeria
TITLE: Built a free tool that scores real estate investment feasibility using actual macro data — would love feedback from people who know the market better than any algorithm

BODY:
I've been building BETONIQ INVEST, a platform connecting global investors to verified real estate projects in Nigeria and West Africa. Just shipped a free tool that gives an instant AI-style feasibility/ROI score for any project using real macroeconomic data (GDP growth, FDI climate, real estate growth rates) instead of the usual sales-pitch numbers you see in property listings.

Genuinely want feedback from people who actually understand the Nigerian real estate market on whether the scoring feels accurate or where it's off. Link in comments if mods are okay with it — otherwise happy to DM.

### r/fintech
TITLE: We formally verified our offline payment protocol with TLA+ before writing a line of code — here's why that mattered

BODY:
Building ZerôPâŷ Money, an offline-first payment protocol (PUF + ECC P-256 signing, distance-bounding anti-relay checks, 72-hour offline token TTL, auto-sync on reconnect). Rather than just testing happy paths, we ran the core protocol logic through TLA+ formal verification — the same method used to catch real distributed-systems bugs at AWS and Azure before shipping.

Curious what this community thinks about offline-first payment security models generally — is formal verification something more fintech infra teams should be doing, or is it overkill pre-product-market-fit? Also running a small crowdfunding round to fund the first pilot terminal production batch, link here if you want to see the tiers: https://rawcdn.githack.com/TOMDEGGS/BETONIQ-WEST-/main/crowdfunding/back_us.html

### r/SideProject
TITLE: Built a free instant ROI scoring tool for real estate — 30 seconds, no signup wall, would love brutal feedback

BODY:
Working on BETONIQ INVEST (AI-powered real estate investment platform, Nigeria/West Africa/UK focus). Just shipped a free "try it in 30 seconds" feasibility scorer — no email wall to see the result, real macro data behind the score instead of fake numbers. Would genuinely appreciate people trying to break it / telling me where the UX or the scoring logic feels off. Building this mostly solo with an AI agent handling a lot of the backend work, happy to talk shop about that workflow too if anyone's curious.

---
NOTES FOR TOM:
- HN is strict about self-promotion tone — the post above is deliberately technical/humble, not marketing copy. Keep it that way when posting.
- Reddit: many subs require you to comment with the link rather than post it directly, or have karma/account-age minimums — check each sub's rules before posting, and starting with r/SideProject (most tolerant of self-promo) might be the easiest first post.
- Product Hunt requires the maker account to be set up in advance and works best with a launch scheduled for a specific day (Tue-Thu tend to get the most traffic).
- None of this has been posted yet — all yours to review, edit, and publish yourself.

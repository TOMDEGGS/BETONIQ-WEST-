# ZerôPâŷ Money — Technical Objection-Killer FAQ (For Deep-Tech Reviewers)

**Purpose:** the fastest way to lose credibility with a PhD-level technical partner is to look like you haven't stress-tested your own claim. This document pre-answers the hardest questions a cryptography/hardware-security reviewer will ask, honestly — including a known real weakness in the underlying primitive — before they ask it. That is what actually earns trust, not a punchier tagline.

## Q1: "PUFs are known to have reliability and side-channel vulnerabilities — published research (e.g. delay-based PUF side-channel attacks, machine-learning modeling attacks on PUF responses) shows they can be characterized or extracted under lab conditions. How do you handle that?"

Honest answer: this is a real, documented limitation of PUFs as a primitive on their own — university research since 2011 has shown delay-based PUF implementations can be vulnerable to side-channel and machine-learning modeling attacks under sustained physical access to the chip. We do not claim the PUF alone is unbreakable. Our architecture treats the PUF as one layer in a 5-layer stack (PUF → ECC P-256 signing → distance-bounding anti-relay → offline cryptographic tokens with monotonic counters → mesh-hub reconciliation), specifically because no single primitive should be trusted in isolation. A successful PUF-modeling attack would require sustained, invasive lab access to a specific physical chip — it does not scale to mass fraud across a distributed terminal fleet, and any successful clone would still be caught at reconciliation via the monotonic-counter/nonce-uniqueness check described in the state-machine proof, which flags and bricks duplicate presentations regardless of how the underlying key material was obtained.

## Q2: "NFC/distance-bounding protocols have known range and relay-attack limitations. What stops a wormhole/relay attack between two colluding devices far apart?"

Distance-bounding is included precisely to defeat relay/wormhole attacks — it measures round-trip signal timing to enforce a maximum physical distance between Origin and Receiving Device during the handshake, rejecting any transaction where the timing implies the devices are further apart than direct NFC range allows. We do not disclose the specific timing thresholds or protocol parameters pre-NDA, consistent with standard practice for any unpublished security primitive.

## Q3: "How does reconciliation behave if a Solar Mesh Hub itself is compromised or malicious — is this Byzantine-fault-tolerant?"

This is a fair and hard question we do not currently have full formal proof for at the mesh-network layer (as opposed to the device-to-device layer, which is proven in the state-machine paper). Byzantine fault tolerance across a gossiping mesh of hubs is the next formal work item, and we would rather say that plainly than overclaim. We are actively engaging an independent academic reviewer specifically to help formalize this layer.

## Q4: "How do you handle firmware updates to a secure element that already has committed cryptographic state — doesn't a firmware update risk invalidating in-flight tokens?"

Firmware updates to a chip holding live monotonic counter state are handled by requiring full reconciliation (all in-flight tokens settled) before any firmware update is applied to that specific unit — a unit cannot be updated while it holds unreconciled token state. This is an operational constraint, not a cryptographic one, and is disclosed at this level pre-NDA because it describes a process constraint, not the underlying mechanism.

## Q5: "Every offline payment system claims to solve double-spend. What's actually novel here versus, say, Chaumian e-cash or existing agent-banking store-and-forward models?"

Chaumian e-cash (Chaum, 1983) solved offline double-spend detection cryptographically but relied on the payee eventually connecting to a central bank to redeem blinded tokens — detection, not prevention, and no hardware-rooted physical binding. Agent-banking store-and-forward (Moniepoint, OPay-style) tolerates a bounded fraud window by capping transaction size. ZerôPâŷ Money's contribution is combining hardware-rooted device identity (PUF-bound signing keys) with a monotonic-counter invariant that makes the *token itself* single-use by construction, not just detectably-spent after the fact — meaning uncapped transaction sizes become defensible, which neither prior approach achieves.

## Q6: "Are you claiming this is unbreakable?"

No. We are claiming a specific, provable invariant: any duplicate presentation of the same token is detected and attributed at the next reconciliation event, with a bounded exposure window (the token TTL). We are not claiming the underlying hardware primitive is theoretically unbreakable — we are claiming the system as a whole degrades gracefully and self-heals, which is a materially stronger and more honest claim than "impossible to hack."

---
*BETONIQ WEST LTD — RC 1496603 — Draft, unsent. This level of honesty about known limitations is what actually earns a second meeting with serious technical reviewers.*

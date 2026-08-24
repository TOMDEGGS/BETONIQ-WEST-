---------------------------- MODULE ZeroPayDoubleSpend ----------------------------
(*
  ZerôPâŷ Money — Formal Model of the Offline Double-Spend Prevention Protocol
  BETONIQ WEST LTD (RC 1496603)

  This is a machine-checkable formalization of the token state machine described in
  ZEROPAY_DOUBLESPEND_CRYPTOGRAPHIC_PROOF.md. It models:
    - A single token T issued once by an Origin Device (hardware-enforced monotonic
      counter -> a token's (N, C_A) pair can never be re-issued).
    - An adversary who CAN replay the captured token to multiple Receiving Devices
      while those devices are offline from each other (the "fog of war" window).
    - Reconciliation at a Solar Mesh Hub, which is the single source of truth that
      resolves duplicate presentations.

  SAFETY PROPERTY CHECKED: at most one Receiving Device's redemption of token T is
  ever marked Reconciled (accepted permanently). Every other presentation of the
  same token is eventually Bricked. This is the Token Uniqueness Invariant from
  Section 3 of the proof paper, expressed as a TLA+ temporal property and checked
  exhaustively by the TLC model checker across every possible ordering of events.
*)

EXTENDS Naturals, FiniteSets, Sequences, TLC

CONSTANTS Devices        \* the set of Receiving Devices an adversary can replay to

VARIABLES
  deviceState,            \* [Devices -> {"NoToken","ProvisionallyRedeemed","Reconciled","Bricked"}]
  hubSeenNonce,           \* BOOLEAN: has the Solar Mesh Hub registry seen nonce N from any device yet
  hubWinner               \* the device (or "none") whose redemption the Hub accepted as first-seen

ASSUME Devices # {}

Init ==
  /\ deviceState = [d \in Devices |-> "NoToken"]
  /\ hubSeenNonce = FALSE
  /\ hubWinner = "none"

(* An adversary replays the single captured token T to device d while d is offline.
   Per the proof: this is ALWAYS accepted provisionally, exactly once per device,
   because an offline Receiving Device has no way to know another device already
   saw this nonce. This models the worst case for the defender. *)
ReceiveOffline(d) ==
  /\ deviceState[d] = "NoToken"
  /\ deviceState' = [deviceState EXCEPT ![d] = "ProvisionallyRedeemed"]
  /\ UNCHANGED <<hubSeenNonce, hubWinner>>

(* Device d reconnects to the Solar Mesh Hub and the global registry is queried.
   Per Section 3, step 4 of the proof: the registry accepts the FIRST-SEEN nonce as
   Reconciled, and marks every subsequent presentation as Bricked. This is the
   mechanism under test. *)
Reconcile(d) ==
  /\ deviceState[d] = "ProvisionallyRedeemed"
  /\ IF hubSeenNonce = FALSE
        THEN /\ hubSeenNonce' = TRUE
             /\ hubWinner' = d
             /\ deviceState' = [deviceState EXCEPT ![d] = "Reconciled"]
        ELSE /\ hubWinner' = hubWinner
             /\ hubSeenNonce' = hubSeenNonce
             /\ deviceState' = [deviceState EXCEPT ![d] = "Bricked"]

Next ==
  \/ \E d \in Devices : ReceiveOffline(d)
  \/ \E d \in Devices : Reconcile(d)

Spec == Init /\ [][Next]_<<deviceState, hubSeenNonce, hubWinner>> /\ WF_<<deviceState, hubSeenNonce, hubWinner>>(Next)

-----------------------------------------------------------------------------------
(* SAFETY: Token Uniqueness Invariant.
   At most one device may ever be in state "Reconciled" for this token. *)
TokenUniquenessInvariant ==
  Cardinality({d \in Devices : deviceState[d] = "Reconciled"}) <= 1

(* SAFETY: attribution/no-silent-loss invariant.
   Any device that is Reconciled must be the one and only Hub-recorded winner —
   never silently double-credited without attribution. *)
NoSilentDoubleCreditInvariant ==
  \A d \in Devices :
    (deviceState[d] = "Reconciled") => (hubWinner = d)

(* LIVENESS: every device that provisionally redeemed eventually reaches a final,
   attributable state (Reconciled or Bricked) once it reconciles — the exposure
   window is bounded, not permanent. *)
EventualResolution ==
  \A d \in Devices :
    (deviceState[d] = "ProvisionallyRedeemed") ~> (deviceState[d] \in {"Reconciled","Bricked"})
=====================================================================================

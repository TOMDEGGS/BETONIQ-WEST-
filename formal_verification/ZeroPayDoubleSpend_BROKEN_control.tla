---------------------- MODULE ZeroPayDoubleSpend_BROKEN_control ----------------------
(* NEGATIVE CONTROL: same model, but the Hub's first-seen nonce dedup is REMOVED,
   i.e. every device that reconciles is naively marked "Reconciled" regardless of
   whether the nonce was already seen. This simulates what happens WITHOUT the
   Token Uniqueness Invariant mechanism from Section 3 of the proof paper.
   Purpose: prove the model checker actually catches a real double-spend when the
   defense is absent, so the clean pass on the real spec is not vacuous. *)

EXTENDS Naturals, FiniteSets, Sequences, TLC

CONSTANTS Devices

VARIABLES deviceState, hubSeenNonce, hubWinner

Init ==
  /\ deviceState = [d \in Devices |-> "NoToken"]
  /\ hubSeenNonce = FALSE
  /\ hubWinner = "none"

ReceiveOffline(d) ==
  /\ deviceState[d] = "NoToken"
  /\ deviceState' = [deviceState EXCEPT ![d] = "ProvisionallyRedeemed"]
  /\ UNCHANGED <<hubSeenNonce, hubWinner>>

(* BROKEN: no dedup check at all — every reconciliation is accepted as "Reconciled" *)
Reconcile(d) ==
  /\ deviceState[d] = "ProvisionallyRedeemed"
  /\ deviceState' = [deviceState EXCEPT ![d] = "Reconciled"]
  /\ hubSeenNonce' = TRUE
  /\ hubWinner' = d

Next ==
  \/ \E d \in Devices : ReceiveOffline(d)
  \/ \E d \in Devices : Reconcile(d)

Spec == Init /\ [][Next]_<<deviceState, hubSeenNonce, hubWinner>> /\ WF_<<deviceState, hubSeenNonce, hubWinner>>(Next)

TokenUniquenessInvariant ==
  Cardinality({d \in Devices : deviceState[d] = "Reconciled"}) <= 1
=========================================================================================

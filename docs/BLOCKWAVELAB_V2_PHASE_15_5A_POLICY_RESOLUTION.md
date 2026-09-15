# BlockWaveLab V2 — Phase 15.5A Policy & Lifecycle Design Resolution

## Status

This document is planning-only and implementation-blocked. It resolves the unresolved lifecycle policy questions raised by Phase 15.5 without creating application code, SQL, migrations, payment provider logic, entitlement logic, delivery activation logic, or deployment changes.

This document preserves all approved business decisions already in force, including:

- the approved four pillars and ten services
- the `project_services` requested-selection boundary
- `organizations` as the business/customer boundary
- `projects` as the delivery container boundary
- the existing role model: `OWNER`, `ADMIN`, `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, `VIEWER`
- the existing append-only `audit_events` foundation
- the approved separation between commercial status and delivery/service activation
- the approved rule that observation is part of paid implementation
- the requirement that payment, entitlement, and delivery activation remain separate domains from proposal/agreement state

No prices, tax rates, percentages, legal promises, refund percentages, provider-specific behavior, or legal/e-signature policy is invented in this document.

---

## 1. Approved Baseline to Preserve

### Existing production baseline

- `organizations` is the tenant/customer boundary.
- `projects` are delivery containers owned by an organization.
- `project_services` is the selected service entry point and must remain a request/selection record, not a commercial commitment.
- `proposals` and `agreements` are separate commercial records with immutable historical snapshots.
- `audit_events` is the authoritative append-only audit sink.
- `SECURITY DEFINER` with fixed `search_path` and restricted grants remain the preferred pattern for trusted server-side functions.
- Direct browser writes to sensitive tables remain denied by database policy.

### Existing requested lifecycle boundary

The current repository architecture preserves this sequence:

```text
CATALOG
  -> project_service REQUESTED
  -> proposal snapshot/version
  -> proposal acceptance
  -> agreement required when the owner approves it
  -> agreement active when approved
  -> payment obligation, if approved
  -> payment settlement, if approved
  -> entitlement, if approved
  -> delivery activation, if approved
  -> implementation -> deployment -> paid observation -> stabilization -> documentation -> handover
  -> optional separately purchased ongoing service
```

This sequence is explicit and intentionally not merged into a single lifecycle field.

### Existing status vocabulary preserved

`project_services.status` remains:

- `REQUESTED`
- `QUOTED`
- `APPROVED`
- `PAYMENT_PENDING`
- `ACTIVE`
- `PAUSED`
- `CANCELLED`
- `COMPLETED`

The current repository treats these as an existing operational vocabulary, but not as a universal status field. The design in this document preserves that distinction.

---

## 2. Commercial Commitment: The Required Separation of States

The system must distinguish the following as separate domains and separate facts:

### 2.1 Proposal accepted

A proposal is a negotiation artifact. Proposal acceptance records that a specific proposal version was accepted by an authorized actor under an approved process.

It is not by itself:

- a payment obligation
- a settlement
- entitlement issuance
- delivery activation
- service availability
- subscription start
- legal settlement or a signed contract where legal review requires an agreement

A proposal can be accepted while no payment exists, no entitlement exists, and no service is active.

### 2.2 Agreement required

The requirement for agreement creation is a policy decision, not an automatic consequence of proposal acceptance.

An agreement may be:

- required for a high-risk or legally significant commercial commitment
- required for a multi-project or custom-scope commitment
- optional for lower-risk, clearly defined purchases when approved
- absent for administrative or pre-approval non-binding steps

Agreement requirement must be decided per engagement type and must not be inferred from project access or a generic `ACTIVE` flag.

### 2.3 Agreement active

Agreement active means the approved agreement version is in force according to the business/legal process.

It does not imply:

- payment is complete
- entitlement is active
- service delivery has started
- observation has started
- recurring service is active

### 2.4 Payment obligation

A payment obligation is a formal commercial record that a specified amount and/or schedule is owed under an approved source and purpose.

It is distinct from:

- proposal acceptance
- agreement acceptance
- payment attempt
- payment settlement
- entitlement
- delivery activation

### 2.5 Payment settlement

Payment settlement means funds have been successfully handled under a provider-neutral settlement model or an approved alternative operation.

It is distinct from:

- payment obligation creation
- payment attempt creation
- provider event handling
- partial refunds, credits, chargebacks, or disputes

### 2.6 Entitlement

An entitlement is a server-authoritative permission to use or receive a capability, service, access window, or scope under an approved rule set.

It is distinct from:

- proposal acceptance
- agreement acceptance
- payment obligation
- payment settlement
- service selection
- project-service status

### 2.7 Delivery activation

Delivery activation is the explicit gate that allows an operationally active service to begin under a separate readiness and authorization model.

It occurs only after the required commercial and readiness checks are satisfied.

### 2.8 Required separation rule

The system must maintain separate state boundaries:

```text
Proposal state != Agreement state != Payment obligation state != Payment settlement state != Entitlement state != Delivery activation state
```

No single `status` value may be used to represent all of them.

---

## 3. Payment Obligation: Provider-Neutral Order/Obligation Abstraction

This section defines the required future design without choosing a payment provider.

### 3.1 Required payment obligation record

A payment obligation must be a provider-neutral record containing at least:

- `id`
- `organization_id`
- `project_id` where applicable
- `proposal_id`
- `proposal_version_id`
- `agreement_id` where applicable
- `agreement_version_id` where applicable
- `commercial_snapshot_reference` or immutable snapshot pointer
- `amount_snapshot` or amount policy reference, if approved
- `currency_snapshot` or approved currency reference, if approved
- `due_at` / `expires_at` / `effective_at` where approved
- `created_by` / `approved_by` / actor information
- `idempotency_key`
- `lifecycle_state`
- `reason_code`
- `status_reason` / `failure_reason` when applicable
- `source_reference` to the approved commercial source
- `created_at`, `updated_at`
- `audit correlation` to `audit_events`

### 3.2 Association rules

The abstraction must link to the exact commercial source:

- the exact proposal that was accepted or approved
- the exact accepted proposal version
- the exact agreement if agreement is required
- the exact agreement version if agreement is in force
- the project and/or organization that owns the obligation
- the commercial snapshot used for that obligation

### 3.3 Snapshot requirements

A payment obligation must not rely on mutable live catalog or project state. It must preserve a historical snapshot of the commercial scope and any approved amount policy details.

### 3.4 Lifecycle state model

The lifecycle state is a separate domain from the proposal and agreement states. Candidate provider-neutral states are:

- `PENDING`
- `REQUIRES_ACTION`
- `PROCESSING`
- `SUCCEEDED`
- `FAILED`
- `CANCELLED`
- `EXPIRED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`
- `DISPUTED`

These are design candidates only and must not be treated as final without owner/legal/accounting/provider approval.

### 3.5 Relationship to attempts and transactions

The payment obligation is not the same as a payment attempt or transaction.

A safe model is:

```text
payment_obligation
  -> one or more payment_attempts
  -> one or more provider events
  -> one or more settlement records
  -> optional refund/credit/dispute records
```

The attempt records may reference the obligation, but the obligation remains the source-of-truth for policy and expected commercial context.

### 3.6 No provider selection yet

This document does not select or endorse a provider, gateway, payment processor, reconciliation model, or external legal/compliance flow.

---

## 4. Payment Structure: Service and Commercial Scope Design

This section describes structural support without selecting exact percentages, terms, or provider behavior.

### 4.1 Support structures required

The design must support:

- 100% upfront payment
- deposit + milestones
- multiple services in one proposal
- multiple projects in one proposal
- partial service purchase
- repeat purchase
- one-time implementation
- separately purchased recurring ongoing service

### 4.2 Structural design principles

The system must support these scenarios without collapsing them into a single status value.

#### One-time implementation

A one-time implementation purchase is a transactional commercial commitment for a defined deliverable or scope bundle under an approved source record.

#### Deposit + milestone

This requires a payment obligation with multiple scheduled amounts or phases, each linked to the same approved source and a clear milestone policy.

#### Multiple services in one proposal

A single proposal may include multiple service items that are individually identified and individually linked to a source record. This requires a line-item or item-level snapshot model.

#### Multiple projects in one proposal

This requires explicit project ownership on each item and must not be inferred from the organization alone. Without explicit approval, multi-project proposals remain blocked.

#### Partial service purchase

This requires a scope snapshot that represents only the approved portion, and a formal linkage to the resulting entitlement or delivery scope. It must never be encoded as an ambiguous “some active” state.

#### Repeat purchase

Repeated acquisition of a service or offering must be represented as a new approved commercial instance unless the owner approves reuse semantics. This protects historical lineage and avoids overwriting earlier scope.

#### Separate ongoing service

Ongoing service must be distinctly modeled as a separate commercial component from the initial implementation. Monthly is the primary model; annual is optional and future-facing only.

### 4.3 Design constraint

The data model must not assume that all purchase combinations are a single invoice or a single flat-rate payment. The obligation must be policy-driven, not hard-coded.

---

## 5. Payment States: Candidate Provider-Neutral States

The Phase 15.5 plan was explicit that the payment candidate state set is not final and requires approval. This section defines the allowed design candidate states and their policy implications.

### 5.1 Candidate states (Phase 15.5 design candidates only)

- `PENDING`
- `REQUIRES_ACTION`
- `PROCESSING`
- `SUCCEEDED`
- `FAILED`
- `CANCELLED`
- `EXPIRED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`
- `DISPUTED`

These are candidate states only. They are not final implementation enums without owner, accounting, legal, and provider review.

### 5.2 Allowed transitions

The following are conceptually valid design patterns, subject to final policy:

```text
PENDING -> REQUIRES_ACTION -> PENDING
PENDING -> PROCESSING
PENDING -> CANCELLED
PENDING -> EXPIRED
PROCESSING -> SUCCEEDED
PROCESSING -> FAILED
PROCESSING -> CANCELLED
SUCCEEDED -> REFUNDED
SUCCEEDED -> PARTIALLY_REFUNDED
SUCCEEDED -> DISPUTED
FAILED -> REQUIRES_ACTION
FAILED -> CANCELLED
REFUNDED -> DISPUTED (if unresolved)
```

### 5.3 Terminal states

The following are likely terminal states, subject to policy:

- `SUCCEEDED`
- `FAILED`
- `CANCELLED`
- `EXPIRED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`
- `DISPUTED`

### 5.4 Retry behavior

Retry may apply only to a payment obligation or payment attempt that is still retryable. The system must not auto-retry a payment in a way that duplicates settlement, creates duplicate entitlement, or replays a provider event.

### 5.5 Expiry behavior

A payment obligation may expire when:

- the underlying proposal or agreement expires
- the payment due date passes without approval or fulfillmen
- the proposed commercial source is no longer valid

Expiry must be explicit and auditable. It must not silently mutate the underlying commercial source.

### 5.6 Cancellation

Cancellation can apply to a pending or processing payment obligation and must preserve the historical commercial and audit record. Cancellation does not imply a refund; it only changes the current payment state.

### 5.7 Duplicate/replay behavior

Duplicate or replay behavior must be prevented using:

- idempotency key on obligation creation
- idempotency key on attempt creation
- unique provider event fingerprint or safe dedupe key
- safe correlation to the underlying proposal/agreement and project ownership

### 5.8 Concurrent update behavior

Concurrent payment updates must be handled with optimistic concurrency or server-side version checking. Payment rows must never be updated on stale state without checking the last known version and acting deterministically.

### 5.9 Open decisions still required

The following still require owner/provider/accounting/legal decision:

- exact terminal lists
- whether provider errors are reversible
- whether `FAILED` can be retried automatically
- whether `SUCCEEDED` can be reversed by a refund/credit record
- whether payment obligations are required before agreement acceptance or after it
- whether recurring monthly payments are governed by a separate recurring record or a single obligation model

---

## 6. Agreement → Payment Relationship

This section defines the required design relationship but deliberately avoids inventing policy.

### 6.1 When agreement is mandatory

Agreement may be mandatory when:

- the commitment includes a legal/commercial obligation
- the engagement contains custom scope, multi-project scope, or special terms
- the owner decides a formal company commitment is required
- the engagement has a milestone or recurring service model requiring formal approval
- legal review requires documented terms acceptance

This is a decision to be approved; it is not a default rule to infer from project access.

### 6.2 When proposal acceptance alone can proceed

Proposal acceptance alone may be permitted only when:

- the owner-approved policy says it is sufficient for the engagement type
- no agreement is required under the specific policy
- a payment obligation, entitlement, and delivery activation are still managed as separate domains

This must not automatically become a legal or financial commitment unless the owner confirms it.

### 6.3 Exact accepted version reference

The payment obligation and any agreement must reference the exact accepted proposal version or agreement version that is in force at the time of the decision.

This prevents versions from drifting after the commitment is created.

### 6.4 Can payment exist without an agreement?

Yes, only if the approved policy explicitly allows it. The system must not silently assume payment without agreement is illegal or valid.

The required design rule is:

```text
Payment obligation may exist with or without agreement, but the system must record which source version is authoritative and why the obligation is valid.
```

### 6.5 How recurring service differs from one-time implementation

Recurring ongoing service is not the same as one-time implementation because it creates:

- a time-bound or open-ended recurring commitment
- a separate optional payment schedule
- a separate entitlement or access window
- potentially a distinct service-delivery operating model

Recurring monthly service should remain separate from one-time implementation and must not be implied by agreement activation or project implementation completion.

---

## 7. Refund / Credit / Cancellation Design

This section defines provider-neutral records and state effects without legal commitments.

### 7.1 Required record types

A future refund-credit-cancellation model requires separate records for:

- `refund`
- `credit`
- `dispute`
- `chargeback` or external claim record
- `payment_failure`
- `cancellation`
- supplier/provider event reconciliation

These records must remain immutable once created.

### 7.2 State effects

The design must define state effects for:

- before implementation
- during implementation
- during paid observation
- after handover
- ongoing monthly service cancellation
- payment failure

### 7.3 Before implementation

Before implementation, a cancellation or refund may be handled as a commercial reversal or a partial reversal depending on approved policy. The design must preserve the historical obligation and any entitlement or delivery gate state.

### 7.4 During implementation

During implementation, a partial or full cancellation may require:

- a partial work review
- entitlement suspension or revocation
- project/service pause or cancellation
- refund or credit logic
- explicit delivery/work stop authority

### 7.5 During paid observation

Observation is part of paid implementation, so a cancellation or refund during observation must use the same separation principle: payment outcome and service operational state remain distinct.

### 7.6 After handover

After handover, optional ongoing service and any separate recurring service schedule must be handled under their own policy. Handover does not automatically reset or cancel all prior obligations.

### 7.7 Ongoing monthly service cancellation

Cancellation of optional recurring service must be handled as a recurring service policy event, not as a one-time implementation refund by default.

### 7.8 Refund, credit, dispute, chargeback

These are distinct behaviors and must not be collapsed into one generic status value. They require:

- immutable source record references
- payment obligation reference
- settlement or transaction reference
- entitlement impact record
- audit correlation
- explicit reason code

### 7.9 Legal warning

This section is a technical design model only. It does not create customer-facing legal promises, cancellation guarantees, refund guarantees, or service credits. Those remain owner/legal/accounting decisions.

---

## 8. Entitlement Design

An entitlement is a separate domain and must be explicit.

### 8.1 Required entitlement fields

At minimum, an entitlement must identify:

- `organization_id`
- `project_id` where applicable
- `service_id` or project-service source
- `capability_name` or offering capability
- `source_type` such as accepted proposal, approved agreement, payment settlement, or explicit service exception
- `source_id` and source version reference
- `payment_reference` where a payment or settlement condition applies
- `effective_from`
- `effective_until`
- `scope_limits` or scope snapshot
- `status`: `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED`
- `created_by` and `approved_by`
- `audit correlation`

### 8.2 What can create an entitlement

An entitlement can be created only by a trusted server-side policy and an approved prerequisite set.

Allowed creation sources include:

- valid approved commercial source + required payment/settlement or approved exception
- explicit service activation policy after all gates pass
- approved recurring service activation
- approved internal operational exception by a cleared authority

### 8.3 What cannot create an entitlement

An entitlement must not be created by:

- proposal acceptance alone
- agreement acceptance alone
- project-service selection alone
- a browser-only success flag
- a payment intent that has not been verified
- a generic `ACTIVE` status on a project or service
- a static client-side state change

### 8.4 Active/suspended/revoked/expired behavior

The entitlement must support separate state transitions:

```text
PENDING -> ACTIVE
ACTIVE -> SUSPENDED
ACTIVE -> REVOKED
ACTIVE -> EXPIRED
SUSPENDED -> ACTIVE
SUSPENDED -> REVOKED
REVOKED -> ACTIVE only by a new explicit approval flow
```

These transitions require a trusted policy and audit record.

### 8.5 Scope and limits

The entitlement record must include the scope and limits under which access is granted. A valid entitlement is not just “customer has access”; it must identify the actual allowed scope, time window, and operational limits.

---

## 9. Delivery Activation Gate

Delivery activation is a separate explicit gate before a project service can become operationally active.

### 9.1 Required verification before activation

Before activation, the system must verify all of the following:

- organization active and project active
- correct `project_service` row and correct source record
- approved catalog/service lineage
- proposal/agreement requirement satisfied per policy
- payment obligation or approved exception satisfied
- entitlement active (if required)
- scope snapshot available
- actor authorization
- expected version and state validation
- idempotency guard
- atomic audit event written

### 9.2 Activation must be explicit

Activation must not be inferred from:

- submission of a proposal
- agreement acceptance alone
- payment obligation creation alone
- `project_service.status = ACTIVE` without a server-authoritative transition
- browser state or UI click without trusted server validation

### 9.3 Activation record design

Future activation should update a separate activation record or explicit service-delivery state rather than overloading project-service state into a universal status field.

---

## 10. Project Service Lifecycle: Existing Status Audit and Recommended Interaction

The current status list is:

- `REQUESTED`
- `QUOTED`
- `APPROVED`
- `PAYMENT_PENDING`
- `ACTIVE`
- `PAUSED`
- `CANCELLED`
- `COMPLETED`

### 10.1 Classification

These statuses should be treated as follows:

- Commercial states: `REQUESTED`, `QUOTED`, `APPROVED`, `PAYMENT_PENDING`
- Delivery states: `ACTIVE`, `PAUSED`, `COMPLETED`
- Administrative/terminal states: `CANCELLED`
- Legacy or future-facing states: any status that is not explicitly used by the current approved business flow

### 10.2 Design recommendation

The statuses must not be collapsed into a single universal state field.

A safer model is:

```text
project_service selection state
  + commercial commitment state
  + payment state
  + entitlement state
  + delivery operational state
```

Each state should be governed by its own policy and audit path. The project service record should remain the source record, but not the only state holder for all lifecycle domains.

### 10.3 What must not happen

The following must remain disallowed:

- `APPROVED` or `ACTIVE` from proposal acceptance alone
- `PAYMENT_PENDING` without a payment obligation or approved exception
- `ACTIVE` without entitlement and delivery activation rules
- `COMPLETED` without a proper closure or transition record

---

## 11. Observation Design

Observation remains part of the paid implementation lifecycle and is not free support.

### 11.1 Observation start

Observation start requires an explicit approved transition after implementation or deployment readiness is confirmed.

### 11.2 Observation period

The observation period must be represented as an approved bounded or policy-governed interval, but the document intentionally does not invent a duration.

### 11.3 Stabilization

Stabilization is a separate phase with explicit delivery criteria and must not be automatically started with project-service selection or proposal acceptance.

### 11.4 Documentation

Documentation occurs after implementation or stabilization according to the approved delivery lifecycle. It must be governed by a distinct transition and should be tied to the project and service scope snapshot.

### 11.5 Handover

Handover occurs only after the approved completion conditions are met and the ownership, operational responsibility, and audit trail are recorded.

### 11.6 Optional ongoing service

Optional ongoing service follows handover and is separately purchased. It must not be created as a continuation of implementation without an explicit approval process.

---

## 12. Ongoing Service Boundary

The system must preserve the boundary between:

- one-time implementation
- separately paid ongoing service

### 12.1 Primary rule

Monthly recurring service is the primary model for ongoing service. Annual is future/optional and must remain outside the current implementation plan unless separately approved.

### 12.2 Required separation

One-time implementation and ongoing service must not share the same payment obligation or entitlement without a deliberate, explicit policy. The relationship must be tracked separately.

### 12.3 Recurrent service policy

Any recurring service model must keep:

- billing policy separate from implementation payment
- entitlement separate from delivery activation
- handover separate from recurring service activation
- cancellation as a separate recurring-service policy action

### 12.4 Payment model

Subscription billing must be kept out of this design; the plan requires a future decision before recurring billing logic is introduced.

---

## 13. Idempotency Matrix

The future commercial lifecycle requires idempotency per operation, not one blanket rule.

| Operation | Required idempotency key or dedupe field | Why needed | Current gap |
|---|---|---|---|
| Proposal acceptance | yes | prevent duplicate acceptance replay | gap: proposal acceptance has an immutable snapshot boundary but not a fully resolved acceptance replay policy |
| Agreement acceptance | yes | prevent duplicate agreement acceptance / duplicate active source | gap: acceptance model exists but broader lifecycle policy is unresolved |
| Payment obligation | yes | prevent duplicate commercial obligations for the same source and scope | gap: no payment domain exists |
| Payment attempt | yes | prevent duplicate attempts for the same obligation | gap: no payment domain exists |
| Provider event | yes | prevent replay and duplicate settlement / refund processing | gap: provider domain not selected |
| Refund / credit | yes | prevent duplicate financial correction processing | gap: no financial correction domain exists |
| Entitlement issuance | yes | prevent duplicate access or grant creation | gap: entitlement domain not implemented |
| Entitlement revocation | yes | prevent duplicate suspension/revocation/retry loops | gap: entitlement domain not implemented |
| Delivery activation | yes | prevent duplicate activation / double-start of service work | gap: no delivery activation boundary exists |
| Delivery transitions | yes | prevent duplicate stage progression and state drift | gap: delivery domain not implemented |

### 13.1 Future idempotency design

Idempotency keys must be preserved at the server boundary, not inferred from the browser. They must be keyed to the exact source type, source version, project scope, and actor policy.

---

## 14. Authorization Model

The system must preserve the existing role model without inventing a new role.

### 14.1 Existing roles preserved

- `OWNER`
- `ADMIN`
- `MEMBER`
- `PROJECT_MANAGER`
- `CONTRIBUTOR`
- `VIEWER`

### 14.2 Minimum required authority map

| Action | Minimum authority requirement |
|---|---|
| Create proposal | explicit commercial action policy; not implied by project access |
| Issue proposal | explicit commercial action policy; not implied by project access |
| Accept proposal | explicit authority; not implied by ownership or project access |
| Create agreement | explicit policy; not implied by project access |
| Accept agreement | explicit authority and evidence policy |
| Create payment obligation | explicit approval and commercial source validity |
| Process payment attempt | trusted server and provider policy |
| Release entitlement | trusted server or approved operational authority |
| Activate delivery | explicit project/service readiness and policy |
| Suspend or revoke delivery/entitlement | explicit service or commercial authority |
| Cancel payment or refund credit | explicit financial authority and policy |

### 14.3 Default rule

Default role behavior remains strict: membership or project management does not grant commercial acceptance or financial authority unless the owner explicitly approves that policy.

---

## 15. RLS / Security Design

The design remains subject to the same principles already used in the repository:

- deny by default
- tenant isolation
- project-level enforceability
- `SECURITY DEFINER` only for trusted authorization logic
- fixed `search_path`
- restricted grant execution
- no secrets or provider credentials in browser code
- no service role in browser code
- append-only audit records

### 15.1 Required tenant/project predicates for future tables

Future payment, refund, entitlement, delivery, and lifecycle tables must enforce:

- row belongs to the organization
- row belongs to the project where applicable
- user has current organization membership and active role
- project membership is validated for project-scoped rows
- the requested `project_id` matches the owning project and organization
- the source proposal/version/agreement/version is valid for the same tenant/project
- the action is permitted by policy for the actor and record state

### 15.2 Negative tests required

The future design must include negative tests for:

- payment records belonging to another organization
- payment attempts for another project
- provider event replay from another tenant
- refund / credit records without valid source payment
- entitlement records created without a valid source or payment exception
- delivery activation for a project/service not owned by the same tenant
- observation transitions for a service not active under approved policy
- lifecycle event writes that bypass the audit or state model

### 15.3 Security requirement

The design must preserve `SECURITY DEFINER + fixed search_path + restricted grants` for any trusted server-side function that checks source ownership, proposal validity, agreement validity, or entitlement readiness.

---

## 16. Audit and Event Model

The repository already uses `audit_events` as the append-only audit sink. This design must preserve that model.

### 16.1 What belongs in `audit_events`

`audit_events` should hold:

- proposal created, issued, accepted, rejected, cancelled, expired
- agreement created, versioned, accepted, activated, suspended, terminated
- payment obligation created / updated / cancelled / expired
- payment attempt created / processed / failed / completed
- provider event accepted / rejected / replayed
- refund / credit / dispute created
- entitlement created / suspended / revoked / expired
- delivery activation / transitions / cancellation
- authorizations denied and rejected state transitions

### 16.2 What requires a persistent domain/event record

Persistent domain records are required when the state or process needs to be queried, reconciled, retried, or audited as a source-of-truth domain object, such as:

- payment obligation
- payment attempt / transaction
- provider event record
- refund / credit / dispute
- entitlement
- delivery engagement / activation state
- observation lifecycle within implementation

### 16.3 What must be immutable

The following must remain immutable once recorded:

- source proposal/version snapshots
- agreement/version snapshots
- accepted commercial source references
- policy evidence related to a significant state transition
- payment settlement results
- entitlement issuance and revocation decisions
- delivery activation transition evidence

### 16.4 What requires retryable processing state

The following require retryable processing state:

- provider webhook/event processing
- payment reconciliation
- settlement result processing
- refund/credit execution
- entitlement issuance after prerequisites are verified
- future asynchronous notification or downstream activation jobs

This should not use a duplicate generic audit system. It should use proper domain records plus `audit_events` correlation.

---

## 17. Implementation Order: Future Sequencing Only

The following sequence is the approved planning order. It is not implementation authorization.

### A. Business-policy decisions

1. decide when proposal acceptance is binding and when agreement is required
2. decide who may issue, approve, accept, and activate commercial commitments
3. decide the exact owner/legal/accounting/provider approval path
4. decide whether proposals or agreements may span multiple projects
5. decide whether partial purchases, repeat purchases, and custom scopes are allowed

### B. Database foundation

1. add payment obligation tables and references
2. add payment attempt / settlement / refund / credit logical models
3. add entitlement tables and lifecycle records
4. add delivery activation or service engagement record
5. add observation and ongoing-service relation tables only if required by approved policy

### C. Trusted RPC/server boundaries

1. enforce proposal/agreement ownership and version validation
2. enforce payment obligation creation only from approved sources
3. enforce entitlement creation only after approved prerequisites
4. enforce delivery activation only after commercial and readiness gates pass
5. write audit records atomically with every state transition

### D. Payment provider integration

1. only after provider and accounting policy is approved
2. add provider-neutral event verification and idempotency guards
3. add dispute/refund handling and reconciliation

### E. Entitlement

1. define capability and scope model
2. define active/suspended/revoked/expired transitions
3. link entitlement to payment settlement or approved exception
4. enforce access restrictions through server logic

### F. Delivery activation

1. define activation prerequisites and explicit readiness checks
2. define delivery state progression and closure rules
3. define observation and handover policies separately

### G. UI

1. expose only approved states and deterministic actions
2. display source/version lineage and state explanation
3. never present payment success without server validation
4. never present capability access without entitlement verification

### H. Runtime/security/replay testing

1. challenge cross-tenant access via negative tests
2. validate idempotency and replays
3. validate price or commercial source version checks
4. validate RLS, server-side enforcement, and audit insertion paths
5. validate provider event security if a provider is later added

---

## 18. Blockers Table

| Decision | Current status | Can be implemented without owner/provider/legal decision? | Required before implementation? | Owner/provider/legal dependency |
|---|---|---|---|---|
| Whether proposal acceptance is binding | unresolved | no | yes | owner + legal |
| Whether agreement is mandatory | unresolved | no | yes | owner + legal |
| Who can issue/approve/accept proposals and agreements | unresolved | no | yes | owner + legal |
| Payment obligation source and rules | unresolved | no | yes | owner + accounting + provider if later selected |
| Exact payment/funding structure | unresolved | no | yes | owner + accounting |
| Price model and currency | unresolved | no | yes | owner + accounting |
| Tax treatment | unresolved | no | yes | accounting + legal |
| Payment sequencing and terms | unresolved | no | yes | owner + legal + accounting |
| Refund/credit/cancellation behavior | unresolved | no | yes | owner + accounting + legal + provider |
| Entitlement prerequisites and source coverage | unresolved | no | yes | owner + legal + operations |
| Service activation prerequisites | unresolved | no | yes | owner + operations |
| Delivery lifecycle and observation policy | partially defined | no | yes | owner + operations |
| Recurring ongoing service policy | partial | no | yes | owner + accounting |
| Provider selection | not started | no | yes if provider needed | provider + owner |
| E-signature/legal evidence treatment | unresolved | no | yes if used | legal |
| Multi-project proposal and agreement policy | unresolved | no | yes | owner + legal |
| Partial purchase and custom scope rules | unresolved | no | yes | owner + operations + legal |
| Concurrent update and retry policy | partial design | no | yes | technical + owner |

---

## 19. Readiness

### 19.1 Policy/design readiness score

**Policy/design readiness: 72/100**

Reasoning:

- current proposal/agreement foundation and project-service boundary are strong: 20/25
- commercial state separation is clear: 15/15
- payment obligation, settlement, and provider-neutral abstraction are defined but not approved: 12/20
- entitlement and delivery activation gates are explicitly required but not yet approved: 13/20
- remaining unknowns are mostly business/legal/accounting/provider decisions: 12/20

### 19.2 Payment implementation readiness

**Payment implementation readiness: 18/100**

Reasoning:

- provider-neutral design exists conceptually
- obligation structure is drafted
- lifecycle states are candidates only
- accounting, legal, payment terms, provider, and refund policy are unresolved
- no actual payment flow may be implemented at this stage

### 19.3 Entitlement implementation readiness

**Entitlement implementation readiness: 24/100**

Reasoning:

- entitlement boundary is well-defined conceptually
- source and scope requirements are documented
- payment/settlement linkage must still be approved
- actual service capability and access policy need explicit owner decisions

### 19.4 Delivery activation implementation readiness

**Delivery activation implementation readiness: 26/100**

Reasoning:

- gating requirements are explicit and separated from commercial acceptance
- project/service readiness rules are recognized
- action authority and state machine decisions remain unresolved
- payment and entitlement prerequisites remain policy-dependent

### 19.5 Final verdict

**OVERALL VERDICT: BLOCKED**

This phase is approved for detailed design and business-policy resolution only. It is blocked from payment, entitlement, and delivery activation implementation until the required owner, accounting, legal, and provider decisions are formally recorded.

---

## 20. Final Design Rule

The system may continue to design, refine, and resolve policy for payment, entitlement, and delivery activation, but it must not implement them prematurely. The approved sequence remains:

```text
design policy -> approved decision -> database foundation -> trusted server logic -> provider integration -> entitlement -> delivery activation -> UI -> runtime verification
```

Not:

```text
proposal acceptance -> implicit payment -> implicit entitlement -> implicit delivery activation
```

This design document is therefore a decision-resolution artifact only and is intentionally limited to the policy and lifecycle design required before lawful and operational implementation.

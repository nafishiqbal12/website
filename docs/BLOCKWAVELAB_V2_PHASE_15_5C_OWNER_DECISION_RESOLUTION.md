# BlockWaveLab V2 - Phase 15.5C Owner Decision Resolution

## 1. Executive Summary

This is a planning-only resolution document. It does not implement code, SQL, migrations, payment tables, payment RPCs, providers, checkout, webhooks, entitlements, delivery activation, subscriptions, trials, UI, or deployment.

This document takes every unresolved C item and every D dependency identified by the Phase 15.5B register and classifies what can be derived from the approved BlockWaveLab business model, what still requires an owner decision, what requires accounting/legal/provider input, and what is purely technical implementation policy.

The approved directions are preserved:

- BlockWaveLab remains an AI Automation & DevOps Partner for Web3 Projects.
- Exactly four pillars remain: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- The approved ten services remain unchanged.
- Organizations remain the customer/tenant boundary.
- Projects remain delivery containers.
- `project_services` remains a service request/selection boundary, not proof of payment.
- Proposal and agreement remain separate commercial domains.
- Proposal and agreement versions remain immutable historical snapshots.
- Authenticated in-platform acceptance is the primary acceptance mechanism.
- Acceptance records actor, exact version, timestamp, checksum, and approved evidence fields.
- Commercial acceptance does not mean payment succeeded, entitlement is active, delivery is active, or implementation started.
- USD is the primary commercial currency direction.
- Pricing is scope/proposal-based; no final prices are invented.
- One proposal may contain multiple services and multiple explicitly scoped projects.
- Partial purchases, repeat purchases, and custom scope within the existing architecture are supported directions.
- One-time implementation and recurring managed service remain separate.
- Monthly recurring service is primary; annual is optional/future-facing.
- Observation is part of paid implementation and is not free service.
- Existing roles remain unchanged; no commercial role is created.
- OWNER remains the ultimate commercial authority; ADMIN does not automatically receive OWNER-level final approval.
- Payment, entitlement, and delivery activation remain separate domains.
- No provider, tax treatment, refund percentage, payment percentage, margin, discount, or legal promise is invented.

### Final status

**Phase 15.6 Payment Foundation readiness: BLOCKED.**

A provider-specific integration is not required for a future provider-neutral foundation, but the payment foundation still cannot be implemented until the owner resolves the commercial source, payment timing, amount/schedule, failure/retry, and allocation policies listed below. External dependencies remain explicit and are not silently marked resolved.

---

## 2. Source Documents

Authoritative planning sources inspected:

1. `docs/BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md`
2. `docs/BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md`
3. `docs/BLOCKWAVELAB_V2_PHASE_15_5_PLAN.md`
4. `docs/BLOCKWAVELAB_V2_PHASE_15_4B_DECISION_REGISTER.md`
5. `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md`

Consistency sources inspected:

- `supabase/migrations/202609140011_commercial_foundation.sql`
- `supabase/migrations/202609140012_commercial_gap_remediation.sql`
- `supabase/migrations/202609130008_catalog_foundation.sql`
- `src/lib/organizations/types.ts`
- `docs/PHASE_15_3_IMPLEMENTATION.md`

### Source-count reconciliation

The 15.5B matrix reports 15 C items, but its rows contain 16 C classifications: IDs 7, 16, 18, 20, 22, 24, 35, 38, 40, 45, 49, 50, 52, 54, 56, and 58.

The 15.5B matrix reports 4 D items and the separate dependency table reports 8 dependencies. The D-labeled matrix rows are IDs 9, 27, 28, 29, 41, 43, and 46. The separate eighth dependency is legal cancellation/refund language, which is not given its own D-labeled matrix row.

This document resolves the complete set rather than repeating those arithmetic omissions:

- C items reviewed: **16**
- D dependencies reviewed: **8**

No source decision is silently removed because of the 15.5B count mismatch.

---

## 3. Complete C-Item Decision Matrix

Classification values used in this matrix are:

- `OWNER DECISION`
- `ACCOUNTING DEPENDENCY`
- `LEGAL DEPENDENCY`
- `PAYMENT PROVIDER DEPENDENCY`
- `TECHNICAL DECISION`
- `DERIVED FROM APPROVED BUSINESS MODEL`

A C item can have a finalized business direction while its exact implementation mechanics remain unresolved. In those cases the direction is recorded as derived, but the specific mechanic remains blocked.

| 15.5B ID | Exact unresolved decision | Classification | Approved direction / resolution | Blocks Phase 15.6? | Minimum decision required to unblock |
|---:|---|---|---|---|---|
| 7 | Exact fixed/calculated/negotiated pricing mechanics, units, rounding, discount authority, and pricing workflow. | OWNER DECISION; TECHNICAL DECISION | **DERIVED FROM APPROVED BUSINESS MODEL:** pricing is scope/proposal-based and must preserve an immutable commercial snapshot. Exact modes, units, rounding, discounts, and calculation workflow are not approved. | **Yes** for creating payment obligations with reliable amount meaning. | Owner approves the permitted pricing modes and snapshot fields. Accounting must confirm amount/rounding treatment before financial implementation. |
| 16 | Allocation of one payment obligation across explicitly scoped projects and proposal items. | OWNER DECISION; ACCOUNTING DEPENDENCY | Multi-project proposals are allowed only when each project is explicitly scoped. Allocation, partial settlement, refund allocation, and reporting are unresolved. | **Yes** for multi-project payment obligations; **no** for a single-project provider-neutral foundation if the foundation excludes multi-project allocation. | Owner approves allocation semantics; accounting confirms settlement and reporting treatment. |
| 18 | Whether partial purchases use line-level acceptance, a new proposal version, separate commercial instances, or another controlled mechanism. | OWNER DECISION; TECHNICAL DECISION | **DERIVED FROM APPROVED BUSINESS MODEL:** partial purchases are supported and must preserve explicit scope and immutable versions. The exact mechanism is unresolved. | **Yes** for partial purchase implementation. | Owner selects one controlled partial-purchase mechanism and its source/version rules. |
| 20 | Exact behavior for repeat, renewal, upgrade, downgrade, add-on, and phased purchases. | OWNER DECISION; TECHNICAL DECISION | **DERIVED FROM APPROVED BUSINESS MODEL:** repeat purchases are supported as new commercial instances with independent lineage. Renewal, upgrade, downgrade, add-on, and phase semantics are not approved. | **Yes** for repeat/renewal behavior; **no** for a foundation limited to a new independent commercial instance. | Owner approves which repeat variants are supported and how each references prior scope. |
| 22 | Required fields, approval path, catalog traceability, delivery mapping, and payment allocation for custom scope. | OWNER DECISION; TECHNICAL DECISION | Custom scope is allowed only within the existing four-pillar/service architecture. No new category or unbounded free-form product is allowed. | **Yes** for custom-scope payment obligations; **no** for catalog-bound standard scope. | Owner approves structured custom-scope fields, authority, source lineage, and allowed delivery mapping. |
| 24 | Engagement types, risk levels, custom/multi-project cases, and exceptions that require an agreement. | OWNER DECISION; LEGAL DEPENDENCY | Agreement requirement remains policy-driven. Proposal and agreement remain separate domains. | **Yes** for a payment foundation that must enforce agreement prerequisites. | Owner defines applicability and exceptions; legal confirms that the resulting terms/acceptance model is sufficient. |
| 35 | Existing-role/policy path for proposal creation, issuance, review, and internal approval. | OWNER DECISION | OWNER remains ultimate commercial authority; ADMIN may have operational commercial management without automatic final authority. No new role is created. | **Yes** for trusted payment-obligation creation from an approved proposal. | Owner maps each action to existing roles/policies and defines approval evidence. |
| 38 | Whether payment occurs before acceptance, after acceptance, by milestone, or by another approved gate. | OWNER DECISION; ACCOUNTING DEPENDENCY | One-time implementation and recurring service remain separate. No universal payment sequence is approved. | **Yes** for payment-obligation creation and trusted lifecycle transitions. | Owner approves sequencing and permitted exceptions; accounting confirms invoice/settlement consequences. |
| 40 | Failure, retry, expiry, cancellation, stale-state, and operational response behavior. | OWNER DECISION; PAYMENT PROVIDER DEPENDENCY; TECHNICAL DECISION | Candidate states remain design candidates only. Browser-controlled success is prohibited. | **Yes** for payment attempt and settlement lifecycle implementation. | Owner approves business retry/expiry/cancellation policy; provider confirms event/error behavior; technical design specifies idempotent state transitions. |
| 45 | Operational effects before implementation, during implementation, during paid observation, after handover, and for ongoing monthly service. | OWNER DECISION; LEGAL DEPENDENCY | Cancellation is case-based and distinct from refund, credit, dispute, and payment failure. No customer-facing promise is invented. | **Yes** for payment-dependent activation and entitlement effects. | Owner approves operational stop/pause/continue policy; legal reviews customer-facing terms. |
| 49 | Entitlement start trigger, end trigger, scope limits, and one-time versus recurring-service behavior. | OWNER DECISION; TECHNICAL DECISION | Entitlement must be server-controlled, source-linked, time-bounded, scope-limited, and audited. | **Yes** for entitlement issuance; **no** for a payment obligation-only foundation that does not issue access. | Owner approves start/end and scope policy; technical design maps it to trusted transitions. |
| 50 | Whether access is suspended, revoked, expires, or remains readable after payment failure, refund, or cancellation. | OWNER DECISION; LEGAL DEPENDENCY; ACCOUNTING DEPENDENCY | No automatic access effect is inferred. Payment, entitlement, and delivery remain separate. | **Yes** for entitlement enforcement and payment-to-access transitions. | Owner approves operational effects; legal/accounting confirm consequences tied to customer remedies and financial events. |
| 52 | Which existing role/policy may authorize delivery activation and what readiness exception path exists. | OWNER DECISION; TECHNICAL DECISION | PROJECT_MANAGER does not automatically receive commercial activation authority. No new role is created. | **No** for a provider-neutral payment obligation foundation; **yes** for delivery activation implementation. | Owner approves activation authority and exception policy using existing roles/policies. |
| 54 | Exact interaction between `project_services` statuses and future commercial/payment/entitlement/delivery records. | OWNER DECISION; TECHNICAL DECISION | Existing statuses remain non-universal vocabulary. `REQUESTED` is not payment, entitlement, or delivery activation. | **Yes** for a foundation that mutates service lifecycle; **no** for isolated payment-obligation records that do not activate services. | Owner approves transition contracts and technical state separation. |
| 56 | Observation start/completion evidence, stabilization/documentation/handover criteria, and duration policy. | OWNER DECISION; TECHNICAL DECISION | Observation remains paid implementation. No duration is invented. | **No** for provider-neutral payment obligation storage; **yes** for delivery/observation activation. | Owner approves operational entry/exit evidence and duration policy. |
| 58 | Recurring-service start, pause, cancellation, expiry, entitlement effects, and annual behavior. | OWNER DECISION; ACCOUNTING DEPENDENCY | Monthly recurring service is primary; annual is optional/future-facing. Ongoing service is separate from implementation. | **No** for one-time payment-obligation foundation if recurring billing is excluded; **yes** for recurring-service implementation. | Owner approves recurring lifecycle; accounting confirms recurring billing/record treatment. |

### C-item outcome

**C items resolved by approved direction:**

- scope/proposal-based pricing direction
- multi-project proposal eligibility when explicitly scoped
- partial purchases supported
- repeat purchases supported as new commercial instances
- custom scope allowed within the existing architecture
- one-time and recurring service separation
- monthly recurring primary and annual future/optional
- OWNER/ADMIN authority boundary
- authenticated in-platform acceptance as the primary workflow

These are directional resolutions only. The exact mechanics listed in the matrix remain unresolved where the payment foundation or trusted lifecycle depends on them.

**C items still unresolved:** all 16 C rows remain unresolved at the exact policy/mechanics level required for implementation. The approved model narrows them but does not supply missing schedules, transitions, authority details, allocation rules, or operational effects.

---

## 4. Complete D-Item Dependency Matrix

| Dependency | Source identity | Classification | Current resolution | Blocks provider-neutral Phase 15.6 foundation? | What remains externally required |
|---|---|---|---|---|---|
| Currency/accounting implementation | 15.5B ID 9 | ACCOUNTING DEPENDENCY | USD is the primary currency direction. No tax, exchange, rounding, ledger, or multi-currency behavior is invented. | **Potentially yes** for financial amount implementation; **no** if Phase 15.6 stores approved commercial snapshots without tax/ledger behavior and accounting signs off the boundary. | Confirm minor units, rounding, accounting records, reporting, and whether any non-USD case is allowed. |
| Proposal acceptance legal effect | 15.5B ID 27 | LEGAL DEPENDENCY | Authenticated acceptance is the primary workflow; legal binding effect is not claimed. | **No** for provider-neutral payment obligation storage if the source is explicitly recorded as a non-legal acceptance fact; **yes** for binding customer-facing commitment behavior. | Legal determination of binding effect and affected engagement types. |
| Agreement acceptance legal effect | 15.5B ID 28 | LEGAL DEPENDENCY | Agreement acceptance remains a recorded versioned fact; enforceability is not inferred. | **No** for provider-neutral schema planning; **yes** for implementation that asserts legal enforceability. | Legal confirmation of terms, acceptance, amendment, termination, and enforceability. |
| Acceptance evidence and privacy | 15.5B ID 29 | LEGAL DEPENDENCY | Preserve actor, exact version, timestamp, checksum, and already designed evidence. Do not add IP/device/signature evidence by assumption. | **No** for the minimum existing authenticated acceptance fact; **yes** for additional evidence or legally meaningful signature behavior. | Legal/privacy approval of identity assurance, consent, evidence fields, retention, access, and privacy basis. |
| Payment settlement and reconciliation | 15.5B ID 41 | ACCOUNTING DEPENDENCY; PAYMENT PROVIDER DEPENDENCY | Settlement is separate from obligation and requires trusted processing. No provider or reconciliation result is assumed. | **Yes** for implementing a payment lifecycle that marks settlement or drives entitlement; **no** for a provider-neutral obligation record that stops before settlement. | Accounting and provider definitions for settlement evidence, reconciliation timing, corrections, disputes, ownership, and reporting. |
| Refund/credit/chargeback treatment | 15.5B ID 43 | ACCOUNTING DEPENDENCY; LEGAL DEPENDENCY; PAYMENT PROVIDER DEPENDENCY | Refunds and credits remain case-based; no amounts or customer promises are created. | **No** for an obligation foundation that does not process corrections; **yes** for refund, credit, dispute, or entitlement-reversal implementation. | Accounting entries, authority, legal/customer language, provider capabilities, and entitlement effects. |
| Dispute/chargeback handling | 15.5B ID 46 | PAYMENT PROVIDER DEPENDENCY; ACCOUNTING DEPENDENCY; LEGAL DEPENDENCY | Disputes require immutable source records and reconciliation; no provider flow is selected. | **No** for provider-neutral obligation storage; **yes** for provider event processing, settlement correction, or access-revocation automation. | Provider event model, accounting treatment, legal response, evidence, deadlines, and access effects. |
| Legal cancellation/refund language | 15.5B external dependency table | LEGAL DEPENDENCY | Cancellation is case-based and no legal promise is made. | **No** for provider-neutral data model; **yes** for customer-facing policy, automated remedy, or contract behavior. | Approved customer-facing terms for cancellation, refund, credit, dispute, termination, and ongoing-service cancellation. |
| Payment provider selection and capabilities | 15.5B external dependency table | PAYMENT PROVIDER DEPENDENCY | No provider is selected. Provider-neutral foundation is preferred. | **No** for provider-neutral payment obligation and attempt design if provider-specific integration is explicitly excluded. | Provider selection, supported methods, event signatures, refunds, disputes, fees, and operational limits before integration. |

### D-item outcome

External dependencies are preserved as external. Provider selection does **not** unnecessarily block a provider-neutral payment foundation. Settlement, accounting, legal, and evidence dependencies still block any implementation that would claim financial settlement, legal enforceability, customer remedy, or access effects.

---

## 5. Finalized Decisions

The following decisions no longer require re-opening for Phase 15.6 planning, although their technical implementation must still respect the remaining blockers:

1. The business identity and catalog boundary are fixed.
2. The four pillars and ten services are fixed.
3. Organizations and projects retain their current ownership roles.
4. `project_services` remains a request/selection record.
5. Proposal and agreement are separate aggregates.
6. Proposal and agreement versions remain immutable historical snapshots.
7. Authenticated in-platform acceptance is the primary acceptance mechanism.
8. Acceptance must preserve actor, exact version, timestamp, checksum, and approved evidence fields.
9. Acceptance never directly means payment success, entitlement, delivery activation, or implementation start.
10. USD is the primary currency direction.
11. Commercial pricing is scope/proposal-based; no fixed amounts are invented.
12. One proposal may contain multiple services.
13. One proposal may cover multiple projects only with explicit project-level scoping.
14. Partial purchases are supported as explicit scope.
15. Repeat purchases are supported as new commercial instances.
16. Custom scope remains within the existing four-pillar/service architecture.
17. One-time implementation and recurring managed service remain separate.
18. Monthly recurring service is primary; annual is optional/future-facing.
19. Observation is part of paid implementation and is not free service.
20. Existing roles remain unchanged; no commercial role is introduced.
21. OWNER is ultimate commercial authority; ADMIN is not automatically final OWNER-level approver.
22. Payment, entitlement, and delivery activation remain separate domains.
23. No provider, tax rule, refund percentage, payment percentage, margin, discount, or legal promise is invented.
24. The three-day trial remains deferred.

---

## 6. Derived Decisions

The following are derived from the approved model and may guide future design without inventing policy:

- Every future payment obligation must reference the exact accepted/approved source version and immutable commercial snapshot.
- Multi-project proposals require explicit project ownership on each item; organization ownership alone is insufficient.
- Partial and repeat purchases require independent lineage and must not mutate issued snapshots.
- Entitlement creation must be server-controlled, source-linked, time-bounded, scope-limited, and audited.
- Delivery activation must verify organization/project state, project-service lineage, commercial prerequisites, payment or approved exception, entitlement where required, scope snapshot, actor authority, expected state/version, idempotency, and atomic audit.
- `project_services.status` must not become a universal commercial/payment/entitlement/delivery state.
- Candidate payment states remain candidates until the owner and required external parties approve final transitions.
- Browser state cannot mark payment succeeded, entitlement active, or delivery active.
- `audit_events` remains the audit sink; persistent domain records are added only where reconciliation, retries, immutable state, or lifecycle queries require them.
- Fixed `search_path`, restricted grants, deny-by-default RLS, persisted tenant/project ownership checks, and negative cross-tenant tests remain required.
- Provider-specific event verification is deferred until a provider is selected, but replay/idempotency must be designed at the provider-neutral boundary.

---

## 7. Remaining External Dependencies

The remaining external dependencies are:

- accounting confirmation for USD amount storage, minor units, rounding, reporting, tax basis, and financial records;
- legal confirmation of proposal/agreement binding effect and authoritative terms;
- legal/privacy confirmation of acceptance evidence, identity assurance, consent, retention, and access;
- accounting/provider confirmation of settlement, reconciliation, corrections, refund, credit, and chargeback handling;
- legal approval of customer-facing cancellation, refund, credit, dispute, and termination language;
- provider selection and capability confirmation before provider-specific integration;
- any e-signature or contract provider determination if legal review requires one.

No external dependency is represented as resolved merely because a provider-neutral design exists.

---

## 8. Payment Policy Resolution

### 8.1 Candidate states

The Phase 15.5A candidate states remain design candidates only:

```text
PENDING
REQUIRES_ACTION
PROCESSING
SUCCEEDED
FAILED
CANCELLED
EXPIRED
REFUNDED
PARTIALLY_REFUNDED
DISPUTED
```

They must not be converted into final database enums or browser behavior by this phase.

### 8.2 Terminal-state policy

**BLOCKED - OWNER / EXTERNAL DECISION REQUIRED.** The owner must decide which states are terminal for the business process. Accounting/provider review is required for whether a settlement can later be corrected, disputed, refunded, or partially refunded.

### 8.3 Retry and failure

**BLOCKED - OWNER / PAYMENT PROVIDER DECISION REQUIRED.** The owner must define whether a failed attempt may be retried, when an obligation expires, and when cancellation stops further attempts. The provider must define error categories, event timing, and safe retry behavior.

### 8.4 Payment obligation timing

**BLOCKED - OWNER DECISION REQUIRED.** Payment may not be assumed before or after agreement acceptance. The owner must approve the sequence for each supported engagement type. Agreement-required commitments must not create payment obligations from an arbitrary or non-authoritative source.

### 8.5 Payment without agreement

Payment without an agreement is permitted only if the owner-approved engagement policy explicitly allows it and the exact accepted proposal/version is the authoritative source. Where an agreement is required, payment cannot bypass it. This is a derived rule, but the engagement matrix remains an owner decision.

### 8.6 Upfront, deposit, and milestone structure

The design must support 100% upfront, deposit/milestone, and separate recurring structures, but exact schedules remain **BLOCKED - OWNER / ACCOUNTING DECISION REQUIRED**. No percentages, due dates, invoice rules, or milestone completion assumptions are invented.

### 8.7 Recurring payment model

Monthly recurring service is primary and annual is optional/future-facing. The exact recurring obligation, retry, pause, cancellation, and accounting model remains **BLOCKED - OWNER / ACCOUNTING / PAYMENT PROVIDER DECISION REQUIRED**. No subscription billing is implemented.

### 8.8 Expiry and cancellation

Expiry and cancellation must preserve immutable history and must not imply a refund. Exact expiry triggers, cancellation authority, and operational effects remain **BLOCKED - OWNER DECISION REQUIRED**, with legal/accounting review for customer-facing terms.

### 8.9 Replay, idempotency, and concurrency

The technical minimum is resolved as a design constraint:

- operation-specific idempotency keys or safe dedupe fields;
- provider-event replay protection;
- exact source/version correlation;
- expected-version/state checks;
- deterministic stale-update behavior;
- atomic audit correlation.

The provider-specific event key and processing semantics remain externally blocked, but they do not block designing the provider-neutral foundation.

---

## 9. Agreement Policy Resolution

### 9.1 When agreement is mandatory

**BLOCKED - OWNER DECISION REQUIRED, WITH LEGAL REVIEW.** The owner must identify engagement types, risk levels, custom/multi-project cases, recurring cases, and exceptions requiring an agreement.

### 9.2 When proposal acceptance alone is sufficient

Proposal acceptance alone is sufficient only where the owner-approved engagement policy says no agreement is required. Authenticated acceptance remains the primary workflow mechanism, but legal effect is not implied.

### 9.3 Payment without agreement

Payment may exist without an agreement only for an owner-approved engagement type where the accepted proposal/version is the authoritative source. It cannot exist without an authoritative commercial source or as a bypass of a required agreement.

### 9.4 Authoritative source version

Every payment obligation, entitlement decision, or delivery activation decision must reference the exact accepted proposal version and, where applicable, the exact active agreement version. The commercial snapshot must remain immutable. A later catalog edit or proposal revision must not rewrite an existing source.

### 9.5 Legal effect and evidence

Authenticated in-platform acceptance is the primary product mechanism. Legal binding effect, signature sufficiency, evidence retention, and any external e-signature requirement remain **BLOCKED - LEGAL / PRIVACY DEPENDENCY**.

---

## 10. Refund and Cancellation Policy Resolution

This section intentionally resolves the design questions without creating customer-facing promises.

| Scenario | Current policy direction | Status |
|---|---|---|
| Cancellation before implementation | Case-based review; preserve source and audit history; do not assume refund or credit. | BLOCKED - OWNER operational policy + legal/accounting review |
| Cancellation during implementation | Case-based stop/pause/continue decision with scope and work review; preserve payment and delivery history. | BLOCKED - OWNER operational policy + legal/accounting review |
| Cancellation during paid observation | Observation remains paid implementation; payment and delivery effects remain separate. | BLOCKED - OWNER operational policy + legal/accounting review |
| Cancellation after handover | Treat implementation and any ongoing service as separate commitments; do not infer cancellation of prior obligations. | BLOCKED - OWNER operational policy + legal/accounting review |
| Recurring-service cancellation | Separate recurring-service event with monthly-primary behavior; no annual behavior is implemented. | BLOCKED - OWNER + accounting review |
| Payment failure | Do not mark settlement, entitlement, or delivery active from browser state; retry, expiry, pause, and access effects require policy. | BLOCKED - OWNER + provider/accounting review |
| Refund | Record as a separate immutable correction linked to the source settlement/obligation; no automatic customer promise. | BLOCKED - ACCOUNTING / LEGAL / PROVIDER |
| Partial refund | Require explicit source, amount/scope allocation, entitlement effect, and audit correlation. No percentage is invented. | BLOCKED - ACCOUNTING / LEGAL / PROVIDER |
| Credit | Keep distinct from refund and payment settlement; define expiry, scope, authority, and accounting treatment externally. | BLOCKED - OWNER + ACCOUNTING / LEGAL |
| Dispute/chargeback | Preserve immutable event/source references and reconciliation state; do not select provider behavior. | BLOCKED - PAYMENT PROVIDER / ACCOUNTING / LEGAL |

No legal promise, no-refund rule, refund percentage, credit guarantee, or automatic entitlement revocation is created.

---

## 11. Multi-Project, Partial, Repeat, and Custom Scope Resolution

### Multi-project proposals

Allowed only when each project is explicitly represented, authorized, and linked to the relevant proposal item. Organization ownership does not replace project-level allocation.

**Remaining blocker:** payment allocation, partial settlement, refund allocation, entitlement scope, and delivery activation across projects.

### Multiple services in one proposal

Allowed. Each service item must retain its own service/offering identity, project scope where applicable, scope snapshot, commercial snapshot, and downstream lineage.

**Remaining blocker:** allocation and partial acceptance mechanics.

### Partial service purchases

Supported as explicit approved scope. An issued proposal snapshot must not be mutated to create a partial purchase.

**Remaining blocker:** owner selection of line-level acceptance, new version, separate commercial instance, or another controlled method.

### Repeat purchases

Supported as new commercial instances with independent historical lineage.

**Remaining blocker:** exact renewal, upgrade, downgrade, add-on, phase, and duplicate project/offering semantics.

### Custom scope

Allowed only within the existing four pillars and ten-service architecture. Custom scope must be structured, reviewed, traceable to the relevant service architecture, and connected to a delivery scope.

**Remaining blocker:** owner approval of required structure, authority, validation, and payment/delivery mapping.

---

## 12. Entitlement Prerequisites

Entitlement implementation remains blocked, but the minimum prerequisite contract is clear:

1. organization and project ownership are valid and active;
2. the exact project service and catalog lineage are identified;
3. the approved proposal/version and agreement/version requirements are satisfied;
4. the payment obligation is valid and the required settlement or approved exception is verified;
5. the entitlement capability and scope limits are explicit;
6. start and end times are determined by approved policy;
7. the actor and trusted server transition are authorized;
8. idempotency and expected-version checks pass;
9. the entitlement transition is audit-correlated atomically.

Entitlement cannot be created by catalog selection, proposal acceptance alone, agreement acceptance alone, payment intent creation, browser state, or an unverified provider event.

Suspension, revocation, restoration, and expiry after payment failure, refund, credit, dispute, or cancellation remain **BLOCKED - OWNER / ACCOUNTING / LEGAL / PROVIDER DECISION REQUIRED** according to the event.

---

## 13. Delivery Activation Prerequisites

Delivery activation remains a separate future transition. Before a project service becomes operationally active, the future trusted boundary must verify:

1. active organization and active project;
2. correct project-service row;
3. approved catalog/service lineage;
4. proposal/agreement requirement satisfied;
5. payment obligation or approved exception satisfied;
6. active entitlement where required;
7. immutable scope snapshot available;
8. actor authorization under an existing role/policy;
9. expected state/version matches;
10. idempotency guard passes;
11. audit event is written atomically.

The minimum operational sequence is:

```text
approved commercial source
  -> approved payment obligation / verified settlement or exception
  -> entitlement decision
  -> delivery activation
  -> implementation
  -> deployment
  -> paid observation
  -> stabilization
  -> documentation
  -> handover
  -> optional ongoing service
```

Implementation start, observation start, stabilization, documentation, handover, and recurring-service activation must each remain explicit transitions. No proposal/agreement acceptance or payment intent may automatically start them.

**Remaining blockers:** activation authority, project-service transition contract, readiness evidence, entitlement effects, observation criteria, and ongoing-service start policy.

---

## 14. Recurring-Service Policy

The approved boundary is:

- one-time implementation is a separate commercial commitment;
- observation is part of that paid implementation;
- ongoing managed service is optional and separately paid;
- monthly recurring service is primary;
- annual recurring service is optional/future-facing;
- handover does not automatically create ongoing service;
- implementation payment and recurring payment must not share an obligation or entitlement without an explicit approved relationship;
- recurring-service cancellation is not automatically a one-time implementation refund.

The exact recurring billing, retry, pause, cancellation, expiry, entitlement, and accounting behavior remains blocked pending owner/accounting/provider resolution. No subscription implementation is created.

---

## 15. Items That Still Block Phase 15.6

Phase 15.6 remains blocked by the following items:

### Owner-policy blockers

- exact pricing mechanics and proposal snapshot semantics;
- multi-project payment allocation;
- partial purchase mechanism;
- repeat/renewal/upgrade/downgrade/add-on/phase semantics;
- custom scope structure and approval path;
- agreement applicability and exceptions;
- proposal issuance and internal approval authority;
- payment sequencing and supported schedules;
- payment failure/retry/expiry/cancellation policy;
- entitlement start/end and financial-event effects;
- delivery activation authority;
- project-service transition rules;
- observation and handover criteria where they control payment/delivery gates;
- recurring-service lifecycle where recurring payment is included in the foundation;
- cancellation effects that determine whether obligations or access continue.

### External blockers for settlement-aware implementation

- accounting confirmation for payment amounts, rounding, reporting, and financial records;
- provider/accounting settlement and reconciliation model;
- legal effect of proposal/agreement acceptance;
- acceptance evidence/privacy requirements beyond the minimum existing fact;
- refund/credit/chargeback treatment;
- legal cancellation/refund language;
- provider capabilities and event/replay semantics before provider integration.

### Provider-specific distinction

Provider selection does not block a provider-neutral payment obligation/attempt foundation if that foundation explicitly stops before provider-specific settlement and event processing. It does block provider integration and any implementation that claims verified provider settlement.

---

## 16. Items That No Longer Block Phase 15.6

The following no longer block provider-neutral Phase 15.6 planning or a narrowly scoped foundation, provided the phase explicitly excludes settlement-dependent behavior:

- business identity, four pillars, and ten services;
- organization/project tenant and delivery boundaries;
- existing role names and the prohibition on new roles;
- `project_services` as a non-activating request boundary;
- proposal/agreement separation;
- immutable proposal/agreement snapshots;
- authenticated acceptance as the primary workflow mechanism;
- recording actor, exact version, timestamp, checksum, and approved existing evidence;
- commercial acceptance not implying payment, entitlement, delivery, or implementation;
- USD as the primary currency direction, subject to accounting treatment;
- scope/proposal-based pricing direction, while exact mechanics remain blocked for obligation creation;
- multiple services in one proposal;
- multi-project proposal eligibility with explicit project scope;
- partial purchases as an approved direction;
- repeat purchases as new commercial instances;
- custom scope within the existing four-pillar/service architecture;
- one-time and recurring-service separation;
- monthly-primary and annual-future recurring direction;
- paid observation boundary;
- OWNER/ADMIN authority ceiling;
- server-controlled, source-linked, time-bounded entitlement principle;
- separate payment, entitlement, and delivery domains;
- no browser-controlled success or activation;
- provider-neutral design and operation-specific idempotency principles;
- reuse of `audit_events` rather than a duplicate audit system;
- the deferred three-day trial.

These items no longer block the architecture and planning boundary. They do not, by themselves, authorize production implementation.

---

## 17. Final Implementation Gate

### Gate name

> **READY FOR PHASE 15.6 PAYMENT FOUNDATION IMPLEMENTATION**

### Gate result

**FALSE**

### Final verdict

> **BLOCKED - OWNER / EXTERNAL DECISION REQUIRED**

The gate remains false because the payment foundation cannot safely create authoritative obligations or trusted lifecycle transitions until amount/snapshot semantics, source/agreement timing, payment sequencing, allocation, retry/failure, and required authority decisions are resolved. Settlement-aware behavior additionally requires accounting, legal, privacy, and provider determinations.

A limited provider-neutral data-model planning exercise may proceed without selecting a provider. It must not be represented as payment settlement implementation, entitlement implementation, delivery activation, or Phase 15.6 completion.

### Required next phase

**Phase 15.6 - Payment Foundation Planning**

Phase 15.6 must be created as a separate planning phase. This document does not create that plan and does not implement any part of it.

### Stop boundary

No payment tables, payment RPCs, payment provider integration, checkout, webhooks, entitlements, delivery activation, subscriptions, trials, source-code changes, SQL, migrations, UI changes, or deployment may be performed under Phase 15.5C.

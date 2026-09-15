# BlockWaveLab V2 - Phase 15.5D Owner Decision Closure

## Status

This is a planning-only closure matrix. It does not implement source code, SQL, migrations, payment tables, payment RPCs, providers, checkout, webhooks, entitlements, delivery activation, subscriptions, trials, UI, or deployment.

It reduces the complete unresolved set from Phase 15.5C into:

- **A - Already decided by the approved business model**
- **B - Strongly derived and safe to implement as an architectural constraint**
- **C - Requires explicit OWNER choice**
- **D - Requires external legal/accounting/payment-provider input**
- **E - Can be deferred without blocking a narrowly scoped provider-neutral Phase 15.6 foundation**

### Closure result

The approved business model resolves the commercial direction, but five owner decisions remain necessary before a provider-neutral payment foundation can safely create payment obligations and trusted lifecycle transitions.

All eight external dependencies can be deferred for a provider-neutral foundation that stops before settlement, refunds, disputes, tax calculation, legal claims, entitlement issuance, and provider-specific event processing. They remain mandatory before those later capabilities are implemented.

**Phase 15.6 gate: NO.**

---

## 1. Source Documents

Primary sources inspected:

1. `docs/BLOCKWAVELAB_V2_PHASE_15_5C_OWNER_DECISION_RESOLUTION.md`
2. `docs/BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md`
3. `docs/BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md`
4. `docs/BLOCKWAVELAB_V2_PHASE_15_4B_DECISION_REGISTER.md`
5. `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md`
6. `docs/BLOCKWAVELAB_V2_PHASE_15_5_PLAN.md`

Consistency sources inspected:

- `supabase/migrations/202609140011_commercial_foundation.sql`
- `supabase/migrations/202609140012_commercial_gap_remediation.sql`
- `supabase/migrations/202609130008_catalog_foundation.sql`
- `src/lib/organizations/types.ts`
- `docs/PHASE_15_3_IMPLEMENTATION.md`

The Phase 15.5B count discrepancy is preserved: its matrix contains 16 C rows despite reporting 15, and its 8-item external dependency table includes one dependency without a separate D matrix row. This closure matrix reviews all 16 C items and all 8 D dependencies.

---

## 2. Finalized A Decisions

These decisions are closed and must not be reopened by Phase 15.6:

- BlockWaveLab remains an AI Automation & DevOps Partner for Web3 Projects.
- Exactly four pillars remain: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- The approved ten services remain unchanged.
- `organizations` remains the customer/tenant boundary.
- `projects` remain delivery containers.
- Existing roles remain `OWNER`, `ADMIN`, `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER`.
- No new commercial role is created.
- OWNER remains the ultimate commercial authority.
- ADMIN does not automatically receive OWNER-level final commercial authority.
- `project_services` remains a service request/selection boundary, not proof of payment or activation.
- Proposal and agreement remain separate commercial domains.
- Proposal and agreement versions remain immutable historical snapshots.
- Authenticated in-platform acceptance remains the primary acceptance mechanism.
- Acceptance records actor, exact version, timestamp, checksum, and approved evidence fields already designed.
- Proposal acceptance is not payment success.
- Agreement acceptance is not payment success.
- Payment success is not entitlement activation.
- Entitlement activation is not delivery activation.
- Pricing is scope/proposal-based; actual prices are not invented.
- USD is the primary commercial currency direction.
- One proposal may contain multiple services.
- One proposal may cover multiple projects only when explicitly scoped per project.
- Partial purchases are supported.
- Repeat purchases are supported as new commercial instances.
- Custom scope is allowed only within the existing four-pillar/service architecture.
- One-time implementation and recurring managed service remain separate.
- Monthly recurring service is primary; annual recurring service is optional/future-facing.
- Observation is part of paid implementation and is not free service.
- Ongoing service is optional and separately paid.
- The three-day trial remains deferred.
- No browser-controlled financial, entitlement, or delivery state change is allowed.
- Payment, entitlement, and delivery activation remain separate domains.

---

## 3. Derived B Decisions

These are safe architectural constraints. They do not supply missing commercial policy values:

- Future payment obligations reference an exact accepted/approved commercial source and immutable snapshot.
- Multi-project items carry explicit project ownership; organization ownership alone is insufficient.
- Partial and repeat purchases preserve independent lineage and do not mutate issued snapshots.
- Payment obligation state is separate from payment attempt, settlement, refund, credit, dispute, entitlement, and delivery state.
- Entitlements are server-controlled, source-linked, time-bounded, scope-limited, and audited.
- Delivery activation is a separate trusted transition after commercial and readiness checks.
- Existing `project_services` statuses are not a universal payment/entitlement/delivery state machine.
- Candidate payment states remain candidates until final transitions are approved.
- Sensitive operations require operation-specific idempotency, replay protection, expected-version checks, and deterministic stale-update behavior.
- RLS must enforce organization/project ownership and source-version integrity; direct browser writes to sensitive future domains remain denied.
- `SECURITY DEFINER` functions require fixed `search_path` and restricted grants where trusted server-side checks are needed.
- `audit_events` remains the audit sink; persistent domain records are used only where reconciliation, retries, immutable history, or lifecycle queries require them.
- Provider-specific event verification is deferred until a provider is selected.

---

## 4. Complete C-Item Closure Matrix

All 16 C items from Phase 15.5C are included. `OWNER DECISION REQUIRED` is YES for every C item because the owner must approve or explicitly defer its business scope. `Blocks Phase 15.6` refers to the narrowly scoped provider-neutral payment foundation defined in Section 8, not later entitlement, delivery, settlement, or provider integration.

| ID | Exact unresolved issue | Approved model already determines | What remains undecided | Recommended default option | Alternative option | Technical change if approved | Blocks Phase 15.6? | OWNER decision required |
|---:|---|---|---|---|---|---|---|---|
| 7 | Exact pricing mechanics, amount representation, units, rounding, discounts, and snapshot workflow. | Pricing is scope/proposal-based, USD-primary, and historically snapshotted; no price is invented. | Fixed versus calculated versus negotiated mechanics, units, rounding, discount authority, and amount semantics. | Use a proposal snapshot with explicit amount meaning and no pricing engine assumption until approved. | Support a richer calculation/negotiation model after explicit approval. | Defines payment-obligation amount fields, snapshot validation, totals, and future reconciliation inputs. | **YES** for obligation creation; **NO** for schema-only planning that stores an opaque approved snapshot. | YES |
| 16 | Allocation of one payment obligation across explicitly scoped projects and proposal items. | Multi-project proposals are allowed only with explicit project-level scope. | Allocation, partial settlement, refund allocation, reporting, and entitlement allocation. | Defer multi-project settlement allocation; implement only a source/item reference model or single-project obligation first. | Approve item-level allocation and support multi-project obligations in the foundation. | Adds allocation records, item-level amounts, project predicates, and correction rules. | **NO** if multi-project settlement is explicitly excluded from Phase 15.6; **YES** for multi-project obligation implementation. | YES |
| 18 | Partial purchase mechanism: line-level acceptance, new version, separate instance, or another controlled method. | Partial purchases are supported and must preserve explicit scope and immutable versions. | The exact acceptance, source-version, payment, entitlement, and delivery mechanism. | Use a new immutable proposal version or separate commercial instance for the approved partial scope. | Use line-level acceptance with per-item states. | Changes proposal-item acceptance, obligation source references, allocation, and downstream entitlement scope. | **NO** for a full-scope foundation that excludes partial execution; **YES** for partial purchase support. | YES |
| 20 | Repeat, renewal, upgrade, downgrade, add-on, and phased-purchase semantics. | Repeat purchases are supported as new commercial instances with independent lineage. | Which repeat variants are supported and how prior scope is referenced. | Defer renewal/upgrade/downgrade/add-on semantics; support only independently created new instances later. | Add explicit amendment, renewal, or add-on relationships. | Adds commercial lineage, supersession, compatibility, and possible allocation rules. | **NO** for a new-instance-only foundation; **YES** for repeat-variant implementation. | YES |
| 22 | Structured custom-scope fields, approval, catalog traceability, delivery mapping, and payment allocation. | Custom scope is allowed only within the existing four-pillar/service architecture. | Required fields, validation, authority, limits, and mapping to services/offers. | Defer custom-scope payment execution; accept only standard catalog-linked scope in the foundation. | Add a reviewed structured custom-scope extension. | Adds validation, scope snapshots, approval metadata, allocation, and delivery mappings. | **NO** for catalog-bound foundation; **YES** for custom-scope obligations. | YES |
| 24 | Engagement types, risk levels, custom/multi-project cases, and exceptions requiring an agreement. | Agreement is required when approved policy requires it; proposal and agreement remain separate. | Exact applicability and exceptions; legal sufficiency of the resulting terms. | Make agreement requirement an explicit policy input and reject obligation creation when a required agreement is absent. | Allow proposal-only obligations for approved low-risk engagement types. | Adds source-policy checks and agreement/version foreign-key requirements to trusted creation. | **YES** for a foundation claiming support for all engagement types; **NO** for a proposal-only scope explicitly excluding agreement-gated cases. | YES |
| 35 | Existing-role/policy path for proposal creation, issuance, review, and internal approval. | OWNER is ultimate commercial authority; ADMIN lacks automatic OWNER-level final authority; no new role. | Which existing action policy permits each proposal action and what evidence is required. | Reuse OWNER-controlled policy and keep unapproved proposal actions denied. | Permit narrowly defined ADMIN operational actions without final approval. | Adds action-policy checks to trusted creation and approval boundaries. | **NO** for payment tables/source references using existing approved records; **YES** for an RPC that creates obligations from unapproved proposals. | YES |
| 38 | Payment timing relative to acceptance, agreement, milestones, and other gates. | Acceptance does not equal payment; implementation and recurring service remain separate. | Whether obligation creation is before/after acceptance, agreement, settlement, or milestone; allowed exceptions. | Require an accepted authoritative source and create obligations before settlement without activating entitlement or delivery. | Permit approved pre-acceptance or milestone-specific obligations. | Defines obligation creation predicates, due/expiry fields, and state transition entry points. | **YES** for trusted obligation lifecycle; **NO** for schema-only modeling without creation behavior. | YES |
| 40 | Failure, retry, expiry, cancellation, stale-state, and operational response behavior. | Candidate states are not final; browser-controlled payment success is prohibited. | Retry eligibility, terminal states, expiry triggers, cancellation authority, and provider error mapping. | Implement only idempotent pending/processing/failure recording with no automatic retry, entitlement, or delivery effects until policy is approved. | Approve bounded retries and explicit expiry/cancellation transitions. | Defines state machine transitions, idempotency keys, expected-version checks, and processing state. | **YES** for trusted payment lifecycle; **NO** for passive obligation schema only. | YES |
| 45 | Operational effects of cancellation before implementation, during implementation, observation, after handover, and during ongoing service. | Cancellation is case-based and distinct from refund, credit, dispute, and payment failure; no legal promise is invented. | Stop/pause/continue behavior, work ownership, entitlement effects, and customer communication. | Record cancellation as a separate event and defer operational effects to an approved case workflow. | Approve phase-specific automatic pauses or closure transitions. | Adds case records, state-effect rules, entitlement/delivery transitions, and audit events. | **NO** for payment obligation storage; **YES** for automated settlement-to-access or delivery effects. | YES |
| 49 | Entitlement start trigger, end trigger, scope limits, and one-time versus recurring behavior. | Entitlement is server-controlled, source-linked, time-bounded, scope-limited, and audited. | Exact start/end triggers, capability scope, limits, and recurring behavior. | Defer entitlement issuance until payment and capability policy are approved; retain source references in payment design. | Implement approved one-time or recurring entitlement policies separately. | Adds entitlement source, time-window, scope, and lifecycle records. | **NO** for payment foundation that does not issue access; **YES** for entitlement implementation. | YES |
| 50 | Access effects after payment failure, refund, credit, dispute, or cancellation. | No automatic access effect is inferred; payment, entitlement, and delivery remain separate. | Suspend, revoke, expire, restore, or read-only behavior by event. | No automatic access mutation; require explicit trusted case transition. | Approve event-specific automatic suspension or revocation. | Adds entitlement/delivery transition rules and event processing. | **NO** for provider-neutral payment obligation foundation; **YES** for access enforcement. | YES |
| 52 | Existing role/policy authorized to approve or invoke delivery activation and readiness exceptions. | PROJECT_MANAGER is not automatically commercial activation authority; no new role. | Exact action policy and exception authority. | Defer activation authority to the delivery phase and keep payment foundation unable to activate delivery. | Approve OWNER or an existing policy path for explicit activation. | Adds activation RPC authorization, readiness checks, idempotency, and audit. | **NO** for payment foundation; **YES** for delivery activation. | YES |
| 54 | Interaction between `project_services` statuses and future payment, entitlement, and delivery records. | `REQUESTED` is non-activating and statuses are not a universal lifecycle. | Exact transition contracts and closure semantics. | Keep payment records separate and do not mutate `project_services` in Phase 15.6. | Approve explicit payment-pending or activation transitions later. | Adds state transition guards and project-service linkage. | **NO** for isolated payment foundation; **YES** for service-lifecycle mutation. | YES |
| 56 | Observation start/completion evidence, stabilization/documentation/handover criteria, and duration. | Observation is paid implementation and is not free; no duration is invented. | Duration, entry/exit evidence, readiness, stabilization, documentation, and handover criteria. | Defer all delivery-stage transitions and store only source references. | Approve explicit delivery evidence and stage automation later. | Adds delivery engagement, observation, stage transitions, and audit records. | **NO** for payment obligation foundation; **YES** for delivery implementation. | YES |
| 58 | Recurring-service start, pause, cancellation, expiry, entitlement effects, and annual behavior. | Ongoing service is optional/separate; monthly is primary; annual is optional/future. | Exact recurring obligation, retry, pause, cancellation, expiry, entitlement, and accounting behavior. | Exclude recurring billing behavior from Phase 15.6 and preserve a separate future relationship. | Include a provider-neutral recurring obligation model after owner/accounting approval. | Adds recurring schedule, period, retry, cancellation, and entitlement records. | **NO** for one-time-only foundation; **YES** for recurring payment implementation. | YES |

### C closure summary

- All 16 C items have an approved directional boundary.
- **5 C items are true Phase 15.6 payment-foundation blockers:** IDs **7, 24, 38, 40**, plus the authority/source rule represented by **35** when obligation creation is included. The minimum set is consolidated in Section 8.
- The remaining C items can be deferred if Phase 15.6 explicitly excludes multi-project allocation, partial execution, repeat variants, custom scope, entitlement, delivery activation, observation automation, and recurring billing.
- No C item is silently treated as fully resolved for later implementation.

---

## 5. Complete D-Dependency Closure Matrix

| ID | External dependency | Why it is external | Can provider-neutral implementation proceed without it? | What must eventually be supplied | Blocks Phase 15.6? | OWNER action required |
|---|---|---|---|---|---|---|
| D-9 | Currency/accounting implementation: USD amount storage, rounding, tax basis, reporting, ledger, and non-USD treatment. | Accounting and tax treatment depends on entity, jurisdiction, records, and professional requirements. | **Yes**, if Phase 15.6 stores an approved USD commercial snapshot and does not calculate tax, create invoices, or claim settlement. | Accounting-approved amount units, rounding, reporting, tax basis, retention, and any supported currency policy. | **NO** for a narrowly scoped provider-neutral foundation; **YES** for financial totals, tax, invoices, or settlement reporting. | NO, except to route the dependency to accounting. |
| D-27 | Legal effect of proposal acceptance. | Technical acceptance does not establish enforceability or binding commercial effect. | **Yes**, if acceptance is recorded as an authenticated source fact without legal claims. | Legal determination of binding effect and affected engagement types. | **NO** for source-linked obligation schema; **YES** for binding customer-facing behavior. | NO; legal owner action is required. |
| D-28 | Legal effect and authoritative terms of agreement acceptance. | Contract enforceability, terms, amendments, and termination require legal review. | **Yes**, for provider-neutral source references that do not assert legal sufficiency. | Approved terms authority, acceptance effect, amendment/termination/expiry rules. | **NO** for schema planning; **YES** for legally asserted agreement-gated behavior. | NO; legal owner action is required. |
| D-29 | Acceptance evidence, identity, privacy, consent, and retention. | Evidence collection and personal-data retention create legal/privacy obligations. | **Yes**, using the already designed minimum actor/version/timestamp/checksum fact and no extra evidence claims. | Legal/privacy-approved evidence fields, identity assurance, retention, access, and consent requirements. | **NO** for minimum provider-neutral source recording; **YES** for expanded evidence or signature behavior. | NO; legal/privacy owner action is required. |
| D-41 | Payment settlement and reconciliation. | Settlement truth, reconciliation timing, corrections, and reporting depend on accounting and provider records. | **Yes**, for obligation and attempt records that stop before verified settlement. | Accounting/provider settlement evidence, reconciliation process, corrections, disputes, ownership, and reporting. | **NO** for pre-settlement provider-neutral foundation; **YES** for settlement or entitlement activation. | NO; accounting/provider action is required. |
| D-43 | Refund, credit, and chargeback treatment. | Financial corrections, customer remedies, provider capabilities, and access effects are external. | **Yes**, if correction records and access effects are excluded from the initial foundation. | Approved accounting entries, authority, customer terms, provider operations, and entitlement effects. | **NO** for pre-settlement obligation foundation; **YES** for correction or access-reversal implementation. | NO; accounting/legal/provider action is required. |
| D-46 | Dispute and chargeback handling. | Provider event model, financial response, legal evidence, deadlines, and accounting treatment are external. | **Yes**, if dispute processing is deferred and the foundation only preserves source references. | Provider event contract, reconciliation, evidence, response policy, accounting treatment, and access effects. | **NO** for provider-neutral obligation schema; **YES** for provider event processing or automated revocation. | NO; provider/accounting/legal action is required. |
| D-EXT | Legal cancellation/refund language and any e-signature/contract provider requirement. | Customer-facing legal language and signature standards cannot be inferred from technical design. | **Yes**, if no legal promise, e-signature claim, or automated remedy is implemented. | Approved terms for cancellation, refund, credit, dispute, termination, evidence, and any provider requirement. | **NO** for provider-neutral data/domain foundation; **YES** for customer-facing legal workflow or automated remedy. | NO; legal owner action is required. |

### D closure summary

- D dependencies blocking a narrowly scoped provider-neutral payment foundation: **0**.
- D dependencies that must be resolved before settlement, refund, dispute, tax, legal-claim, provider, entitlement, or automated-remedy behavior: **8**.
- No D dependency is treated as resolved. Deferral means the foundation must explicitly exclude the dependent behavior.

---

## 6. Decisions That Can Be Deferred Without Blocking Provider-Neutral Phase 15.6

The following can remain policy-configurable or deferred if Phase 15.6 is narrowed accordingly:

- provider selection and provider event signatures;
- tax calculation and tax-provider behavior;
- invoices, accounting ledger entries, and settlement reporting;
- refunds, credits, disputes, and chargebacks;
- legal binding claims and e-signature behavior;
- expanded acceptance evidence such as IP/device capture;
- entitlement issuance and access effects;
- delivery activation, implementation start, observation, stabilization, documentation, and handover automation;
- recurring billing and subscription lifecycle;
- multi-project payment allocation;
- partial purchase execution;
- repeat/renewal/upgrade/downgrade/add-on mechanics;
- custom-scope payment execution;
- cancellation-driven automated state changes.

Deferral is safe only when the provider-neutral foundation stores source/version references and does not create downstream financial, access, or delivery effects.

---

## 7. Decisions That Still Block Provider-Neutral Phase 15.6

For Phase 15.6 as a payment obligation and trusted server-side payment lifecycle foundation, the following owner decisions remain blocking:

1. **Commercial amount/snapshot semantics:** what an approved USD scope/proposal snapshot means for amount, units, rounding, and permitted pricing modes.
2. **Commercial source and agreement gate:** which engagement types require an agreement and which exact accepted proposal/agreement version authorizes an obligation.
3. **Payment timing and schedule:** whether and when an obligation is created relative to acceptance, agreement, deposits, milestones, and recurring separation.
4. **Payment failure lifecycle:** minimum approved behavior for pending, processing, failed, expired, cancelled, retryable, terminal, and stale updates.
5. **Trusted creation authority:** which existing role/policy may create or approve payment obligations from an approved commercial source, preserving OWNER authority and ADMIN's non-automatic final authority.

These five items are the minimum owner decision set for a Phase 15.6 foundation that creates payment obligations or trusted payment state transitions. If Phase 15.6 is reduced to passive schema planning only, items 1-5 may be documented as configuration placeholders, but that would not be payment foundation implementation.

---

## 8. Phase 15.6 Gate Analysis

### 8.1 Which decisions are truly required before a provider-neutral payment foundation?

The minimum required owner decisions are the five items in Section 7:

1. amount and commercial snapshot semantics;
2. agreement/source applicability and exact source-version authority;
3. payment timing and supported schedule entry points;
4. payment failure/retry/expiry/cancellation lifecycle;
5. trusted creation and approval authority using existing roles/policies.

A provider is not required for these decisions. Provider-neutral state and event boundaries can be designed without provider selection, but they must not claim settlement.

### 8.2 Which decisions can safely remain configurable or deferred?

Multi-project settlement allocation, partial execution, repeat variants, custom-scope execution, entitlement timing, delivery authority, observation criteria, recurring billing, refunds, credits, disputes, tax, invoices, legal effect, e-signature, and provider-specific events can be deferred when the initial foundation explicitly excludes those behaviors.

The approved directional constraints for these areas should remain documented, but their operational transitions must not be implemented by assumption.

### 8.3 Which external dependencies do not block the database/domain foundation?

All eight D dependencies can be deferred for a narrowly scoped provider-neutral foundation:

- accounting/tax implementation details;
- proposal legal effect;
- agreement legal effect;
- expanded acceptance evidence/privacy requirements;
- settlement and reconciliation;
- refunds/credits/chargebacks;
- disputes/chargebacks;
- legal cancellation/refund language and e-signature/provider determination.

They do not block storage of immutable source/version references, approved USD snapshot context, operation-specific idempotency, expected-version checks, and pre-settlement lifecycle facts. They do block the corresponding downstream behavior.

### 8.4 Which exact decisions must be answered by the OWNER before Phase 15.6?

The OWNER must answer:

1. What approved scope/proposal amount representation and permitted pricing modes may create a payment obligation?
2. Which engagement types require an agreement, and which exact accepted proposal/agreement version is authoritative?
3. When may a payment obligation be created relative to acceptance, agreement, deposits, milestones, and recurring separation?
4. What are the minimum business transitions for failure, retry, expiry, cancellation, terminal state, and stale payment updates?
5. Which existing role/policy may create or approve a payment obligation, while preserving OWNER ultimate authority and ADMIN's non-automatic final authority?

No answer should include invented prices, tax rates, refund percentages, provider behavior, legal promises, or new roles.

### 8.5 Minimum decision set required to start Phase 15.6 safely

The minimum set is exactly:

1. **Approved commercial snapshot and amount contract** for scope/proposal-based USD obligations, without requiring final public prices.
2. **Approved source/agreement contract** identifying when agreement is required and which exact accepted version authorizes payment obligation creation.
3. **Approved payment schedule contract** covering obligation timing, upfront/deposit/milestone entry points, and explicit separation of recurring service.
4. **Approved payment lifecycle contract** covering candidate-state transitions, failure/retry/expiry/cancellation, idempotency, and concurrency expectations.
5. **Approved action-authority contract** mapping obligation creation/approval to existing roles and policies.

Provider, tax, accounting, legal, refund, dispute, entitlement, and delivery decisions remain required before their dependent behavior, but they need not block a foundation explicitly limited to pre-settlement provider-neutral payment records.

---

## 9. Final Closure Summary

### Final C-item classification

- Directionally derived from the approved model: all 16 C items have bounded business direction.
- Fully resolved for payment-foundation implementation: **0**.
- True blockers for a trusted provider-neutral payment foundation: **5 consolidated owner decisions**.
- Deferrable C mechanics when scope is explicitly narrowed: the remaining 11 items.

### Final D-item classification

- External dependencies reviewed: **8**.
- Blocking the narrowly scoped provider-neutral foundation: **0**.
- Blocking later settlement-aware, legal, tax, refund, dispute, entitlement, or provider behavior: **8**.

### Phase 15.6 readiness

**NOT READY.** The provider-neutral foundation can be planned without a selected provider, but it must not be implemented until the five minimum owner decisions are explicitly approved.

---

## PHASE 15.6 GATE

- **READY: NO**
- **OWNER DECISIONS REQUIRED: 5**
- **EXTERNAL DEPENDENCIES BLOCKING FOUNDATION: 0**
- **EXTERNAL DEPENDENCIES THAT CAN BE DEFERRED: 8**
- **MINIMUM REQUIRED OWNER DECISIONS:**
  1. Approve the commercial amount/snapshot contract for scope/proposal-based USD payment obligations without inventing final prices.
  2. Approve agreement applicability and the exact accepted proposal/agreement version that authorizes a payment obligation.
  3. Approve payment obligation timing and supported schedule entry points, including upfront/deposit/milestone and recurring-service separation.
  4. Approve payment failure, retry, expiry, cancellation, terminal-state, idempotency, and concurrency behavior.
  5. Approve the existing-role/policy authority for creating and approving payment obligations while preserving OWNER ultimate authority and ADMIN's non-automatic final authority.

**FINAL VERDICT: BLOCKED - OWNER DECISIONS REQUIRED**

Do not start Phase 15.6 implementation, create payment tables, create payment RPCs, integrate a provider, or change application behavior under Phase 15.5D.

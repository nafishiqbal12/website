# BlockWaveLab V2 — D-006 Multi-Project and Partial Allocation Review Package

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-D006-REVIEW-001 |
| Title | BlockWaveLab V2 D-006 Multi-Project and Partial Allocation Review Package |
| Version | 0.1 |
| Status | DRAFT — REVIEW PACKAGE; NOT AN APPROVED FINANCIAL, ACCOUNTING, TAX, LEGAL, OR PROVIDER POLICY |
| Owner | Accountable owner not yet assigned |
| Approver | Founder/Business Owner and required specialist review pending |
| Effective date | 2026-10-09 |
| Decision | D-006 — Multi-project and partial allocation |

This package organizes Founder, accounting/tax, legal/privacy, provider,
security, product, and delivery questions. It does not select allocation
rules, financial treatment, provider behavior, tax treatment, or customer
commitments. D-006 remains **UNRESOLVED**.

## 2. Authoritative Current Position

The [Owner Decision Matrix, D-006](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
records that explicit project scope is required and allocation behavior is
undefined. It preserves project-level ownership and allows the option to defer
settlement allocation, while approval of allocation, partial settlement,
refund, reporting, and entitlement behavior remains outstanding.

The [Charter Decision Register, D-006](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
records D-006 as **UNRESOLVED** and requires policy plus runtime evidence.
The [Owner Decision Resolution Plan](./BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md)
identifies allocation as a commercial scope and allocation gate requiring
owner/accounting review.

Current documented technical boundaries include:

- Organization is the tenant and commercial owner; project is the delivery
  container owned by one organization.
- Commercial records, payment obligations, entitlements, and delivery records
  are separate concepts and state machines.
- Proposal and payment snapshots preserve historical source relationships.
- The current payment foundation does not implement refunds, credits, disputes,
  chargebacks, or reconciliation.
- Runtime authorization, tenant isolation, settlement, entitlement, and
  delivery behavior remain unverified where recorded by release documentation.

## 3. Decision Boundaries

### Existing documented requirements or constraints

- Every query path must resolve organization ownership before returning data.
- Server-side authorization and database RLS are required; client-provided
  organization or project identifiers are not access proof.
- Business status transitions are server-owned and audit-linked.
- Approved proposal versions, payment records, and audit history are intended
  to preserve historical records rather than silently rewrite them.
- D-004 makes Founder/Business Owner approval the commercial default unless
  explicit, scoped, documented delegation exists.
- D-003 does not approve specific prices, bundles, margins, public prices, or
  payment execution.

### Not approved by this package

- One commercial record covering multiple projects.
- Cross-project allocation, partial purchase, split settlement, or allocation
  limits.
- Currency, precision, rounding, fee, tax, or reconciliation treatment.
- Refund, credit, cancellation, dispute, or chargeback behavior.
- Automatic entitlement, delivery, or ongoing-service effects.
- Customer-facing allocation promises, reporting commitments, or SLAs.
- Runtime or provider readiness.

## 4. Review Questions

Every question requires an explicit recorded outcome or documented deferral.
This package does not answer the questions.

| ID | Question | Current documented position | Unknowns | Decision-maker / specialist | Dependencies | Required closure evidence | Exact repository source |
|---|---|---|---|---|---|---|---|
| D006-Q01 | What is the authoritative meaning and boundary of a project, engagement, order, invoice, payment, and allocation? | Organization owns commercial records; project is the delivery container; the domain model separately identifies proposals, invoices, payments, and project services. | Whether an engagement/order is a first-class record, whether one invoice/payment spans projects, and what allocation means operationally and financially. | Founder/Business Owner; product; accounting/tax specialist. | D-003, D-005, D-007. | Approved vocabulary and relationship/state model with owner and specialist review. | `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md` — “Core Aggregates”, “Ownership Rules”, and “Core Relationships”; `docs/BLOCKWAVELAB_SRS.md` — “Terminology”. |
| D006-Q02 | May one proposal, agreement, invoice, payment obligation, payment, or settlement cover multiple projects? | Current documented model is project-scoped for delivery and commercial relationships; multi-project allocation is undefined. | Permitted aggregate scope, source relationships, tenant boundary, approval path, reporting, and provider constraints. | Founder/Business Owner; accounting/tax, legal/privacy, and provider specialists. | D-003, D-005, D-007, D-012. | Explicit owner decision, legal/accounting/provider review, schema relationship specification, and authorized runtime tests. | Owner Decision Matrix D-006; `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md` — “Core Relationships”; `docs/PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md` — payment obligation source boundaries. |
| D006-Q03 | Are full and partial allocation permitted, and what allocation limits, minimums, or exclusions apply? | Allocation and partial purchase behavior are unresolved; no limits are documented. | Allocation basis, permitted scope, minimum/maximum shares, item/project boundaries, and whether partial settlement is allowed. | Founder/Business Owner; accounting/tax specialist; legal/provider input. | D-003, D-005, D-008, D-012. | Approved allocation policy with examples, negative cases, financial treatment, and provider capability evidence. | Owner Decision Matrix D-006; Charter Decision Register D-006; D-005 and D-008 review packages. |
| D006-Q04 | How are allocation changes, reversals, corrections, cancellations, and immutable historical records handled? | Commercial source snapshots and lifecycle events are intended to preserve history; D-006 correction behavior is not defined. | Mutation versus reversal, effective date, prior allocation visibility, audit reason, correction authority, and legal/accounting record treatment. | Founder/Business Owner; accounting/tax, legal/privacy, security, and engineering specialists. | D-005, D-007, D-008, D-016. | Versioned allocation/correction policy, immutable record model, audit evidence, and authorized negative/runtime tests. | `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md` — “State Ownership”; `docs/PHASE_15_COMMERCIAL_FOUNDATION_IMPLEMENTATION.md` — “Schema”, “RLS”, and “Audit Events”. |
| D006-Q05 | What currency, precision, rounding, fee, tax, exchange, and reconciliation rules apply when value is allocated across projects or records? | USD is the primary direction, but D-005 leaves storage, rounding, exchange, tax, reporting, fees, and reconciliation open. | Currency representation, calculation order, rounding allocation, fee/tax distribution, FX responsibility, and reconciliation source of truth. | Founder/Business Owner; accounting/tax specialist; provider input. | D-005, D-012, D-003. | Accounting/tax determination, approved allocation examples, reconciliation procedure, and later implementation/runtime evidence. | D-005 Review Package — questions D005-Q01 through D005-Q07; Owner Decision Matrix D-005; `docs/BLOCKWAVELAB_SRS.md` payment requirements. |
| D006-Q06 | How do refunds, credits, cancellations, disputes, chargebacks, and allocation reversals affect each project and the aggregate commercial record? | D-008 is unresolved; refund, credit, dispute, chargeback, and reconciliation behavior is not implemented or approved. | Event-to-project mapping, partial refund allocation, credit scope, reversal order, entitlement effects, and provider state mapping. | Founder/Business Owner; legal/privacy, accounting/tax, provider, and security specialists. | D-005, D-007, D-008, D-012. | Approved exception/allocation matrix, provider mapping, accounting treatment, audit linkage, and runtime tests. | D-008 Review Package — questions D008-Q03 through D008-Q11; `docs/PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md` — exclusions and status boundary. |
| D006-Q07 | How are organization and tenant isolation enforced for cross-project reads, writes, approvals, allocations, and reports? | Organization is the tenant boundary; project roles are scoped; no ordinary role may cross organization boundaries. | Cross-project same-tenant permissions, cross-tenant denial, report aggregation, support access, and break-glass evidence. | Security/privacy specialist; Founder/Business Owner; engineering. | D-007, D-011, D-016. | Approved access matrix, server/RLS evidence, cross-project and cross-tenant negative tests, and audit review. | `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md` — “Explicit Authorization Algorithm”, “Tenant Isolation Rules”, and “Sensitive Actions”; `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — “API Rules”. |
| D006-Q08 | Who may approve an allocation, reallocation, partial settlement, correction, or exception? | D-004 gives the Founder/Business Owner default final commercial authority; D-016 approved role-level accountability without named assignees. | Delegation scope, approval sequence, separation of duties, self-approval, evidence ownership, and escalation. | Founder/Business Owner; legal/accounting/security specialists as applicable. | D-004, D-016, D-005, D-008. | Explicit authority matrix/delegation record, approval/reason evidence, audit trail, and unauthorized-action tests. | Owner Decision Matrix D-004/D-016; Project Charter “Approved role-level accountability model”; Authorization Model “Sensitive Actions”. |
| D006-Q09 | What happens to entitlements, delivery activation, implementation, project closure, handover, and ongoing services when allocation changes or becomes invalid? | Entitlement and delivery are separate state machines; delivery activation is a separate runtime-required gate; ongoing service is optional and scope-dependent. | Allocation-to-entitlement mapping, suspension/revocation, closure prerequisites, handover effects, and ongoing-service treatment. | Founder/Business Owner; product, delivery/operations, security, accounting, legal, and provider specialists. | D-008, D-010, D-011, D-012, D-014. | Approved lifecycle matrix, operating procedure, source linkage, audit evidence, and authenticated lifecycle tests. | `docs/04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md` — “Lifecycle State Boundary” and “Stage Playbook”; `docs/BLOCKWAVELAB_SRS.md` — §§6.18–6.20. |
| D006-Q10 | What idempotency, duplicate-event, retry, replay, audit, and exception controls apply to allocation and its financial or lifecycle effects? | API guidance requires idempotency for payments and lifecycle transitions; D-006 behavior is not implemented or runtime verified. | Idempotency key scope, event correlation, duplicate outcomes, retry safety, partial failure recovery, and manual reconciliation. | Engineering/security; provider and accounting/tax specialists; Founder/Business Owner. | D-005, D-008, D-011, D-012. | Approved control design, trusted server implementation, duplicate/replay/negative tests, and reconciliation evidence. | `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md` — “Webhooks”, “API Rules”, “Important Operation Contracts”, and “Idempotency”; Release Readiness Checklist payment and runtime gates. |
| D006-Q11 | What customer-facing proposal, invoice, payment, entitlement, and reporting representations may describe allocation without creating an unsupported commitment? | D-003 permits scoped/custom quotation direction but no specific prices or public pricing; customer-facing allocation wording is not approved. | Displayed totals, project-level breakdowns, invoice/report formats, disclaimers, correction notices, and support expectations. | Founder/Business Owner; legal/privacy and accounting/tax specialists; product/delivery. | D-003, D-005, D-007, D-008, D-014. | Approved customer-facing language, controlled examples, legal/accounting review, and traceable source snapshots. | D-003 records; D-005 and D-007 Review Packages; `docs/04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md` — “Approval and Evidence Rules”. |
| D006-Q12 | What reporting, reconciliation, project closure, and audit evidence are required for aggregate and project-level allocation? | D-005 leaves reporting and reconciliation open; release documentation distinguishes structural evidence from runtime evidence. | Report owner, period/cutoff, source of truth, unmatched values, export, retention, closure criteria, and evidence ownership. | Founder/Business Owner; accounting/tax, legal/privacy, security, provider, and operations specialists. | D-005, D-007, D-008, D-012, D-016. | Approved reporting/reconciliation procedure, evidence register, retention/access decision, and authorized runtime/provider evidence. | D-005 Review Package — questions D005-Q07 through D005-Q09; D-007 Review Package — questions D007-Q07 through D007-Q09; Release Readiness Checklist. |

## 5. Specialist Review Questions

Review must determine, without assuming a jurisdiction, provider capability,
or financial outcome:

1. Whether allocation changes financial records, tax treatment, invoices,
   credits, refunds, or reporting obligations.
2. Whether one commercial record may legally or operationally cover multiple
   projects or customer scopes.
3. How partial allocation, rounding, fees, taxes, currency conversion, and
   reconciliation are treated.
4. What evidence, access, retention, export, correction, and deletion rules
   apply to aggregate and project-level records.
5. Which provider states and events can represent allocation, reversal,
   dispute, refund, or settlement outcomes.
6. Which customer-facing representations are permitted without creating
   pricing, tax, legal, SLA, or service commitments.

No accounting, tax, legal, privacy, provider, or customer-facing conclusion is
supplied by this package.

## 6. Dependency Analysis

### D-003 — Pricing mechanics

D-003 remains partially resolved in principle. No specific price, bundle,
margin, public price, amount semantic, or payment execution was approved.
Allocation must not be used to infer pricing or discount policy.

### D-005 — Accounting and tax treatment

D-005 remains **UNRESOLVED / EXTERNAL INPUT**. Currency, precision, rounding,
exchange, tax, provider fees, reporting, and reconciliation treatment are
prerequisites for any allocation policy.

### D-007 — Agreement and acceptance policy

D-007 remains **UNRESOLVED / EXTERNAL INPUT**. Agreement applicability,
authority, privacy, evidence, retention, and customer representations may
govern aggregate and project-level commercial records.

### D-008 — Refund, credit, cancellation, dispute, and chargeback behavior

D-008 remains **UNRESOLVED / EXTERNAL INPUT**. Allocation reversals and
project-level financial effects must not be inferred from existing schemas.

### D-010 — Entitlement lifecycle

D-010 remains unresolved. Allocation changes must not automatically revoke,
suspend, restore, or preserve access without approved policy.

### D-011 — Delivery activation gate

D-011 remains **UNRESOLVED / RUNTIME REQUIRED**. Allocation evidence does not
prove delivery activation or project readiness.

### D-012 — Payment settlement behavior

D-012 remains **DEFERRED / RUNTIME NOT VERIFIED**. No settlement, provider,
replay, or reconciliation success is claimed.

## 7. Closure Checklist

D-006 should remain unresolved until the following are recorded:

- [ ] Authoritative definitions for project, engagement, order, invoice, payment, and allocation are approved.
- [ ] Single-project versus multi-project commercial-record scope is decided.
- [ ] Full/partial allocation boundaries and allocation limits are approved.
- [ ] Allocation changes, reversals, corrections, and immutable record rules are approved.
- [ ] Currency, precision, rounding, fees, tax, exchange, and reconciliation treatment is reviewed.
- [ ] Refund, credit, cancellation, dispute, and chargeback allocation effects are approved.
- [ ] Tenant isolation, authorization, approval, and delegation evidence is recorded.
- [ ] Entitlement, delivery activation, project closure, handover, and ongoing-service effects are mapped.
- [ ] Idempotency, duplicate, retry, replay, audit, and exception controls are approved.
- [ ] Customer-facing representations and reporting boundaries are approved.
- [ ] Required specialist and runtime/provider evidence is obtained before claiming behavior.

## 8. Current Non-Readiness Boundaries

This package does not authorize:

- Multi-project payment, invoice, settlement, refund, credit, or allocation execution.
- Partial purchase, partial settlement, or allocation-based entitlement changes.
- Cross-project or cross-tenant access changes.
- Delivery activation, project closure, handover, or ongoing-service changes.
- Customer pricing, tax, accounting, provider, SLA, or support commitments.
- Production release.

Release readiness remains **BLOCKED**. Runtime authorization, tenant
isolation, payment-provider, settlement, reconciliation, entitlement,
delivery activation, and operational behavior remain **NOT VERIFIED** where
recorded by the release documentation.

## 9. Source Index

- [Owner Decision Matrix](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
- [Charter Decision Register](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
- [Owner Decision Resolution Plan](./BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md)
- [Project Charter](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
- [D-005 Accounting and Tax Review Package](./BLOCKWAVELAB_V2_D005_ACCOUNTING_TAX_REVIEW_PACKAGE.md)
- [D-007 Legal and Privacy Review Package](./BLOCKWAVELAB_V2_D007_LEGAL_PRIVACY_REVIEW_PACKAGE.md)
- [D-008 Refund, Dispute, and Chargeback Review Package](./BLOCKWAVELAB_V2_D008_REFUND_DISPUTE_REVIEW_PACKAGE.md)
- [Domain Model](../BLOCKWAVELAB_V2_DOMAIN_MODEL.md)
- [Authorization Model](../BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md)
- [API Blueprint](../BLOCKWAVELAB_V2_API_BLUEPRINT.md)
- [Software Requirements Specification](../BLOCKWAVELAB_SRS.md)
- [Client Delivery Playbook](../04-delivery/BLOCKWAVELAB_V2_CLIENT_DELIVERY_PLAYBOOK.md)
- [Release Readiness Checklist](../RELEASE_READINESS_CHECKLIST.md)

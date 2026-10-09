# BlockWaveLab V2 — D-005 Accounting and Tax Review Package

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-D005-REVIEW-001 |
| Title | BlockWaveLab V2 D-005 Accounting and Tax Review Package |
| Version | 0.1 |
| Status | DRAFT — SPECIALIST REVIEW PACKAGE; NOT AN APPROVED ACCOUNTING OR TAX POLICY |
| Owner | Accountable owner not yet assigned |
| Approver | Founder/Business Owner and required accounting/tax specialist review pending |
| Effective date | 2026-10-09 |
| Decision | D-005 — Currency/accounting treatment |

This package organizes questions for Founder/Business Owner and accounting/tax
review. It does not select a currency policy, tax jurisdiction, tax rate,
accounting standard, provider behavior, or financial control. D-005 remains
**UNRESOLVED / EXTERNAL INPUT**.

## 2. Authoritative Current Position

The Owner Decision Matrix records D-005 as **UNRESOLVED / EXTERNAL INPUT**:
USD is the documented primary direction, while storage, rounding, exchange,
tax, and reporting remain open. Accounting/tax specialist input is required.
See [Owner Decision Matrix, D-005](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
and [Charter Decision Register, D-005](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md).

The current repository does not establish:

- A supported-currency set beyond the documented USD-primary direction.
- Minor-unit or decimal precision rules.
- An exchange-rate source, timestamp, or conversion responsibility.
- Tax jurisdictions, nexus, rates, exemptions, or calculation responsibility.
- Invoice, receipt, credit, refund, or financial-record policy.
- Provider-fee treatment, markup, pass-through, or reimbursement policy.
- Settlement reconciliation ownership, timing, or correction rules.
- A complete accounting ledger or reporting policy.

The [Business/Product Baseline, commercial policy section](../02-business/BLOCKWAVELAB_V2_BUSINESS_PRODUCT_BASELINE.md)
explicitly leaves currency, tax, accounting, refunds, chargebacks, and
recurring-billing policy unresolved.

## 3. Decision Boundaries

### Existing documented facts

- USD is the primary commercial currency direction.
- D-003 permits fixed-scope implementation pricing, custom quotation for
  materially variable scope, and separately priced monthly Managed Operations
  in principle.
- D-003 does not approve specific prices, formulas, margins, public pricing,
  payment execution, or recurring billing.
- D-004 makes the Founder/Business Owner the default final pricing and
  commercial approver unless explicit, scoped, documented delegation exists.
- Proposal/agreement acceptance, payment settlement, entitlement, and delivery
  activation are separate stages.
- Payment obligation, payment attempt, settlement, refund, credit, dispute,
  entitlement, and delivery states are separate domains.
- The payment foundation reports USD-only obligation storage for its current
  provider-neutral foundation, but this is implementation scope evidence, not
  an approved enterprise currency policy.
- Financial and provider runtime behavior remains unverified where identified
  by the release checklist.

### Not approved by this package

- Any currency policy or non-USD support.
- Tax treatment, tax rates, tax jurisdiction, or tax advice.
- Accounting standard, revenue recognition, invoice status, or reporting rule.
- Provider fees, pass-through, markup, reimbursement, or margin treatment.
- Refund, credit, cancellation, dispute, or chargeback policy.
- Settlement success, reconciliation completion, or provider readiness.
- Recurring billing or public pricing.

## 4. Review Questions

Each question requires an explicit recorded outcome or documented deferral.
“Proposed review consideration” text is not an approved policy.

| ID | Question | Why needed | Current documented position | Unknown | Decision-maker / specialist | Dependencies | Closure evidence | Repository source |
|---|---|---|---|---|---|---|---|---|
| D005-Q01 | Is USD only, a bounded supported-currency set, or another currency policy permitted? | Defines proposal, obligation, payment, reporting, and reconciliation representation. | USD is primary direction; current foundation accepts USD for its scoped implementation. | Supported currencies, customer-facing display, storage, settlement, and non-USD handling. | Founder/Business Owner; accounting/tax specialist. | D-003, D-012, and any D-002 jurisdiction direction. | Approved currency policy and data-model representation; specialist review record. | Owner Decision Matrix §4, D-005; Phase 15.6 `create_payment_obligation` section. |
| D005-Q02 | What amount precision, minor-unit, decimal, and rounding rules apply at proposal, obligation, fee, tax, refund, and reporting boundaries? | Prevents inconsistent totals, reconciliation differences, and irreversible financial-record errors. | Rounding and storage remain open; no accounting treatment is approved. | Precision by currency, rounding mode, calculation order, and correction handling. | Accounting/tax specialist; Founder/Business Owner for commercial policy. | D-003, D-008, D-012. | Approved precision/rounding policy with examples and negative cases; later implementation evidence if used. | Owner Decision Matrix §4, D-005; Charter Register commercial policy table. |
| D005-Q03 | If conversion is allowed, which exchange-rate source, timestamp, quote direction, and conversion responsibility apply? | Establishes reproducible amounts and reporting lineage when proposal and settlement currencies differ. | Exchange treatment is unresolved; no source or conversion behavior is approved. | Source, fallback, timestamp, rate lock, responsibility, and correction process. | Accounting/tax specialist; Founder/Business Owner. | D-002, D-005-Q01, D-012. | Approved FX policy, source contract or documented source, timestamp/lineage fields, reconciliation procedure. | Owner Decision Matrix §4, D-005; Project Charter §29, D-005. |
| D005-Q04 | Which party determines, calculates, collects, reports, and bears tax obligations for each approved engagement context? | Tax responsibility cannot be safely inferred from technical payment or proposal flows. | Tax basis, calculation, display, and reporting are not defined. | Jurisdiction, nexus, registration, exemptions, rates, evidence, and responsibility. | Accounting/tax specialist; legal/privacy input where customer terms are affected; Founder/Business Owner. | D-002, D-003, D-007, D-012. | Written specialist determination and owner-approved commercial/tax boundary; no tax claim before closure. | Project Charter §14 Commercial Policy Decisions; Owner Decision Matrix D-005. |
| D005-Q05 | What invoices, receipts, credit notes, refund records, and other financial records are required, and when are they issued? | Determines customer records, accounting entries, audit evidence, and provider/reconciliation obligations. | Invoice, receipt, credit, refund, and financial-record requirements are not approved. | Record types, issuer, trigger, numbering, content, retention, correction, and cancellation rules. | Accounting/tax specialist; legal input where customer-facing terms apply; Founder/Business Owner. | D-005, D-008, D-012. | Approved record lifecycle and retention policy; sample controlled record definitions; implementation approval separately. | Business/Product Baseline commercial policy; Phase 15.5D D-9/D-43/D-EXT dependencies. |
| D005-Q06 | How are payment-provider fees, foreign-exchange fees, taxes on fees, reimbursements, pass-through costs, markup, and margin represented? | Prevents unapproved commercial assumptions and inaccurate gross/net reporting. | No provider-fee, pass-through, markup, or reimbursement policy is documented. | Who bears fees, whether disclosed, how recorded, and how they affect pricing/accounting. | Founder/Business Owner; accounting/tax specialist; provider input. | D-003, D-004, D-008, D-012. | Approved fee and cost-treatment policy with accounting mapping; no fee or margin claim before closure. | Owner Decision Matrix D-003/D-004/D-005; Business/Product Baseline commercial policy. |
| D005-Q07 | What settlement, reconciliation, exception, reporting cadence, and ownership rules apply? | Connects provider records to obligations, attempts, settlement, refunds, disputes, and financial reporting without conflating states. | Settlement and reconciliation require accounting/provider input; replay and provider runtime evidence are not verified. | Source of truth, timing, tolerances, unmatched records, corrections, ownership, and reporting outputs. | Accounting/tax specialist; payment-provider specialist; Founder/Business Owner. | D-008, D-009 if reopened, D-012. | Approved reconciliation procedure, exception policy, ownership record, provider/accounting evidence, and runtime tests when authorized. | Owner Decision Resolution Plan D-012; Phase 15.5D D-41; Release Readiness Checklist §7. |
| D005-Q08 | Which financial records and source snapshots are immutable, and how are corrections, reversals, and audit events recorded? | Protects historical accuracy and supports audit, disputes, reconciliation, and controlled corrections. | Payment obligations and snapshots are described as immutable in the foundation; accounting-record immutability and correction policy remain open. | Immutable fields, correction mechanism, reversal versus mutation, retention, access, and audit-event requirements. | Accounting specialist; security/privacy specialist; Founder/Business Owner. | D-004, D-008, D-012. | Approved immutability/correction policy, audit-field requirements, retention/access determination, and later control evidence. | Phase 15.6 lifecycle hardening; Authorization Model §7; Owner Decision Matrix D-005/D-008. |
| D005-Q09 | What accounting and tax evidence must be retained for proposals, approvals, obligations, attempts, settlements, fees, taxes, refunds, credits, disputes, and corrections? | Defines auditability and the evidence package needed for reporting and review. | Audit events and source-linked records exist structurally; retention and specialist evidence requirements are not fully approved. | Retention period, access, export, reconciliation support, evidence owner, and legal hold requirements. | Accounting/tax specialist; legal/privacy specialist; Founder/Business Owner. | D-004, D-007, D-008, D-012, D-016. | Approved retention/evidence policy and assigned evidence ownership; runtime audit tests where applicable. | Owner Decision Matrix D-004/D-005; Traceability Matrix TR-004; Authorization Model §7. |

## 5. Required Specialist Questions

Accounting/tax review should answer, without assuming a jurisdiction or legal
outcome:

1. What entity, customer, supplier, and engagement facts are required before
   currency, tax, invoicing, or reporting treatment can be determined?
2. Is USD-primary representation acceptable for the current scope, and what
   precision, rounding, and exchange controls are required?
3. Which commercial events require accounting records, and which source is
   authoritative for each event?
4. How should provider fees, refunds, credits, disputes, chargebacks, and
   foreign-exchange differences be recorded?
5. What evidence and retention are required for audit, correction, dispute, and
   reconciliation purposes?
6. Which questions require separate legal, privacy, payment-provider, or
   jurisdiction-specific advice?

No answer is supplied by this package.

## 6. Dependency Analysis

### D-003 — Pricing mechanics

D-003 is partially resolved only in principle. D-005 must not invent pricing
units, amounts, formulas, margins, discounts, public prices, or proposal
semantics. Accounting/tax input may be needed for amount and reporting
treatment before material pricing policy is baselined.

### D-008 — Refund, credit, cancellation, dispute, and chargeback behavior

D-008 remains unresolved / external input. Tax, accounting entries, authority,
state effects, provider mapping, and customer treatment must not be inferred
from the payment foundation.

### D-012 — Payment settlement behavior

D-012 remains deferred / runtime not verified. Accounting/provider review is
required for settlement truth, reconciliation, corrections, reporting, and
provider exceptions. No settlement success is claimed.

### Other related boundaries

- D-002 may affect jurisdictional and tax analysis.
- D-004 controls who may approve commercial and financial exceptions but does
  not itself decide accounting or tax treatment.
- D-007 may affect legally required acceptance, records, and retention.
- D-009 remains deferred / unresolved; no recurring-billing accounting behavior
  is authorized.
- D-016 leaves named evidence ownership and specialist assignments open.

## 7. Closure Checklist

D-005 should remain unresolved until the following are recorded:

- [ ] Founder/Business Owner confirms the commercial scope to be reviewed.
- [ ] Accounting/tax specialist determination is obtained.
- [ ] Currency and supported-currency policy is approved.
- [ ] Precision and rounding policy is approved.
- [ ] Exchange-rate responsibility and lineage are approved, if applicable.
- [ ] Tax responsibility and jurisdictional boundary are documented.
- [ ] Invoice, receipt, credit, refund, and financial-record requirements are approved.
- [ ] Provider-fee and cost treatment is approved.
- [ ] Settlement and reconciliation policy is approved or explicitly excluded.
- [ ] Financial-record immutability, correction, retention, and audit policy is approved.
- [ ] Required evidence owners and specialist reviewers are recorded.
- [ ] Related implementation and runtime evidence is obtained before claiming behavior.

## 8. Current Non-Readiness Boundaries

This package does not authorize:

- Payment-provider execution or settlement.
- Recurring billing.
- Tax calculation.
- Invoice or receipt generation.
- Refunds, credits, disputes, or chargebacks.
- Public pricing.
- Entitlement or delivery activation.
- Production release.

Release readiness remains **BLOCKED**. Payment-provider, settlement,
reconciliation, authenticated runtime, and operational evidence remain
**NOT VERIFIED** where recorded by the release documentation.

## 9. Source Index

- [Owner Decision Matrix, D-005](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md#d-005)
- [Charter Decision Register, D-005](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md#d-005)
- [Owner Decision Resolution Plan, D-005](./BLOCKWAVELAB_V2_OWNER_DECISION_RESOLUTION_PLAN.md#d-005)
- [Project Charter, Commercial Policy Decisions](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md#14-commercial-policy-decisions)
- [Business/Product Baseline](../02-business/BLOCKWAVELAB_V2_BUSINESS_PRODUCT_BASELINE.md)
- [Phase 15.5D Owner Decision Closure](../BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md)
- [Phase 15.6 Payment Foundation Implementation](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md)
- [Release Readiness Checklist](../RELEASE_READINESS_CHECKLIST.md)
- [Authorization Model](../BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md)
- [Governance Traceability Matrix](../00-governance/traceability-matrix.md)

# Traceability Matrix

| Field | Value |
|---|---|
| Document ID | BWL-TRACE-MATRIX-001 |
| Title | BlockWaveLab V2 Governance Traceability Matrix |
| Version | 0.1 |
| Status | DRAFT — GOVERNANCE TRACEABILITY MATRIX |
| Owner | Accountable owner not yet assigned |
| Review status | Pending governance review |
| Authority | High-level governance traceability; does not replace SRS requirement IDs |
| Last updated | 2026-10-09 |

| Requirement ID | Requirement | Source | Design or implementation reference | Verification reference | Status | Notes |
|---|---|---|---|---|---|---|
| TR-001 | Approved four-pillar taxonomy | BLOCKWAVELAB_V2_SPEC.md; BLOCKWAVELAB_SRS.md | BWL-BUSINESS-001; BWL-SERVICE-CATALOG-001; public routes/catalog | FINAL_AUDIT_REPORT.md; RELEASE_READINESS_CHECKLIST.md | Structurally verified | Four pillars documented; D-001 five-service current working catalog approved by Founder/Business Owner on 2026-10-09; historical discrepancy retained |
| TR-002 | Client lifecycle and paid observation boundary | BLOCKWAVELAB_V2_SPEC.md §§11, 18, 22; BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md §11.2; BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md evidence rows 55–56; BLOCKWAVELAB_V2_CLIENT_JOURNEY.md; D-018 | BWL-BUSINESS-001; BWL-DELIVERY-001 | RELEASE_READINESS_CHECKLIST.md | Approved policy / runtime not verified | The historical 60-day references are retained in BLOCKWAVELAB_V2_SPEC.md for traceability; D-018 approves 30 calendar days after deployment as the current working policy. Findings, KPI context, stabilization actions, required evidence, and authorized exit approval remain required. The Phase 15.5 policy and decision-finalization records remain historical records and are superseded for current duration policy by D-018; runtime remains unverified |

## Historical observation-policy supersession

The historical duration references in [BLOCKWAVELAB_V2_SPEC.md](../BLOCKWAVELAB_V2_SPEC.md) §§11, 18, and 22 are retained unchanged for traceability and are superseded for current policy by D-018. [BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md](../BLOCKWAVELAB_V2_PHASE_15_5A_POLICY_RESOLUTION.md) §11.2 and [BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md](../BLOCKWAVELAB_V2_PHASE_15_5B_OWNER_DECISION_FINALIZATION.md) evidence rows 55–56 are historical records that intentionally left the duration open at the time; they are not current policy statements. D-018 approves 30 calendar days after deployment. The policy does not establish acceptance criteria, SLA/SLO commitments, legal terms, runtime implementation, or automatic handover.

## Accountability governance cross-reference

D-016 is approved by the Founder/Business Owner on 2026-10-09 under Option A
(recorded by CHG-2026-10-09-020):
role-level accountability now, with named individuals nominated later. The
Founder/Business Owner retains final approval authority unless an explicit,
scoped delegation is recorded. Named ownership, escalation paths, evidence
ownership, and complete RACI implementation remain open; no role title implies
legal, financial, pricing, settlement, production, or release authority.

## Pricing governance cross-reference

D-003 is partially resolved by Founder/Business Owner approval on 2026-10-09
(recorded by CHG-2026-10-09-021):
D-003-A permits fixed-scope implementation pricing, custom quotations for
materially variable or non-standard scope, and separately priced monthly
Managed Operations when explicitly scoped and approved. D-003-B permits only
documented, case-specific introductory discounts. D-003-C defers public prices
while permitting approved service descriptions and inquiry/custom-quotation
messaging. Specific prices, ranges, bundles, margins, payment execution,
recurring-billing implementation, and related decisions remain unresolved.

## Pricing authority governance cross-reference

D-004 was approved by the Founder/Business Owner on 2026-10-09 under Option A
(recorded by CHG-2026-10-09-022):
the Founder/Business Owner retains final pricing and commercial approval
authority unless an explicit, scoped, documented delegation is recorded.
Preparation, scoping, estimating, and review do not constitute approval.
Discounts, non-standard commitments, unapproved bundles, price changes, and
material scope changes require documented approval, reasons or applicable
supporting evidence, and change-control evidence. No numerical discount cap,
monetary threshold, new approval limit, named assignee, or specialist approval
is established. Agreement acceptance, payment settlement, entitlement,
delivery activation, production release, and accounting/tax decisions remain
separate gates.

## Observation-policy change cross-reference

D-018 was approved by the Founder/Business Owner on 2026-10-09
(recorded by CHG-2026-10-09-019) for 30 calendar days after deployment as the
current working observation policy. Historical 60-day references remain
preserved in the source specification and are superseded for current policy.
| TR-003 | Tenant and project ownership boundaries | BLOCKWAVELAB_SRS.md; BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md | BWL-PLATFORM-001; domain and database blueprints | Runtime audit/remediation; authenticated runtime tests deferred | Structurally verified / runtime not verified | No production claim |
| TR-004 | Commercial, payment, entitlement, and delivery separation | BLOCKWAVELAB_SRS.md; Phase 15 decision records; D-003 | BWL-PLATFORM-001; BWL-DELIVERY-001 | PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md; RELEASE_READINESS_CHECKLIST.md | Structurally verified / runtime not verified | D-003-A permits fixed-scope implementation, custom quotation, and separately priced monthly Managed Operations in principle; D-003-B permits documented case-specific introductory discounts; D-003-C defers public prices. No specific prices, recurring-billing implementation, provider readiness, or public pricing is approved. Provider and lifecycle evidence remain incomplete |
| TR-005 | Named service specifications | BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md; BLOCKWAVELAB_SRS.md | BWL-SERVICE-CATALOG-001; BWL-TRACE-001 | BWL-SVC-001-AC-01..05 through BWL-SVC-005-AC-01..04 | Documented / approved catalog / runtime-unverified | Five names are the approved current working catalog under D-001; historical discrepancy preserved; service criteria still require their own evidence and review |
| TR-006 | Capability-to-requirement-to-release mapping | BLOCKWAVELAB_SRS.md; DOCUMENTATION_ARCHITECTURE.md | BWL-TRACE-001; service acceptance matrices | Release checklist, static evidence, and future runtime test evidence | Draft / incomplete | Exact SRS IDs are mapped where available; TBD/PROPOSED criteria are not approved requirements |

# BlockWaveLab V2 Charter Decision & Conflict Resolution Register

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-CHARTER-DECISION-001 |
| Title | BlockWaveLab V2 Charter Decision & Conflict Resolution Register |
| Version | 0.1 |
| Status | DRAFT — PENDING OWNER REVIEW |
| Classification | INTERNAL PROJECT GOVERNANCE |
| Authority | DECISION SUPPORT — NOT A PROJECT CHARTER |
| Owner | OWNER NOT YET ASSIGNED |
| Approver | OWNER NOT YET ASSIGNED |

This register audits [BLOCKWAVELAB_V2_PROJECT_CHARTER.md](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
against the repository documentation. It does not amend or supersede that
Charter or any source-of-truth document.

## 2. Purpose

This register identifies what must be resolved, evidenced, or explicitly
accepted before Charter v0.1 can become `BASELINED / APPROVED`.

It preserves uncertainty and conflicts. It does not create Charter v1.0,
make business decisions, assign owners, set deadlines, or claim runtime
verification.

## 3. Decision-Making Rules

### Documented fact

A statement explicitly present in a source document. It may describe approved
direction, planned design, implementation evidence, or historical activity.
It is not automatically a current runtime fact.

### Evidence-backed conclusion

A conclusion supported by one or more repository documents, source inspection,
migration inspection, or explicit verification records. The evidence class must
be stated as `LOCAL`, `STRUCTURALLY VERIFIED`, `REMOTE VERIFIED`,
`RUNTIME VERIFIED`, `HISTORICAL`, `DEFERRED`, `BLOCKED`, or `NOT VERIFIED`.

### Documentation conflict

Two or more documents make materially different claims about the same scope,
state, decision, or evidence. The conflict remains open until the applicable
authority and current evidence are explicitly recorded.

### Owner decision required

A business, product, governance, commercial, or policy choice that cannot be
selected from technical evidence without inventing a decision.

### Runtime verification required

The claim concerns authenticated behavior, tenant isolation, provider
execution, deployed configuration, lifecycle transitions, or other behavior
that static documents cannot prove.

### Deferred decision

A decision intentionally postponed by the existing documentation. Deferred
does not mean approved, implemented, or unnecessary.

### Blocked decision

A decision or verification that cannot proceed because a required identity,
environment, provider configuration, approval, or other prerequisite is absent.

### Authority rule

The documentation architecture defines the general precedence:

```text
Approved business decision
→ approved architecture decision
→ source code and migrations
→ verified deployed/runtime state
→ explanatory or historical documentation
```

This precedence is applied only to the relevant claim. It does not silently
erase a conflict or convert an implementation artifact into business approval.

## 4. Charter v0.1 Audit Summary

Charter v0.1 correctly preserves the principal Step 2 findings:

- The four-pillar business model is represented without adding a fifth pillar.
- Geographic scope is marked `UNRESOLVED`.
- The ten-versus-five service catalog issue is explicitly preserved.
- Commercial policies are separated into documented direction and unresolved policy.
- Implementation claims use evidence-status labels.
- The project is explicitly not production-release approved.
- The eight material documentation conflicts are recorded.
- Owner assignments and missing information are not invented.
- Runtime, provider, and operational gates remain blocked or not verified.

The Charter is suitable as a governance draft. It cannot yet be baselined
because the conflicts and decisions in this register remain unresolved, and
the document register and traceability matrix are not populated.

Audit conclusion: **PARTIALLY COMPLETE — OWNER DECISIONS / EVIDENCE RECONCILIATION REQUIRED.**

## 5. Conflict Resolution Register

| ID | Conflict | Documents Involved | What Each Document Says | Conflict Type | Can Documentation Evidence Resolve It? | Owner Decision Required? | Runtime Evidence Required? | Recommended Resolution Path | Current Status |
|---|---|---|---|---|---|---|---|---|---|
| C-001 | Ten services versus five explicitly named services | [PHASE_15_2 service catalog](../BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md) | The historical source references ten grouped services but explicitly names five; the Founder/Business Owner approved the five named services as the current working catalog on 2026-10-09. | Historical discrepancy retained; current catalog resolved | Partially; the source discrepancy remains historical and the approval resolves only the current working catalog. | No for the current five-service catalog; yes for any future additions | No for the current catalog; runtime catalog behavior is separate | Retain the historical source unchanged, record the approved five-service catalog, and require documented change control for future additions. | RESOLVED FOR CURRENT CATALOG / HISTORICAL DISCREPANCY RETAINED |
| C-002 | Phase 15.6 delivery activation ambiguity | [PHASE_15_6 implementation](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md); [SRS](../BLOCKWAVELAB_SRS.md) | Phase 15.6 describes delivery foundations and also excludes or separates delivery activation in different sections; the SRS marks related behavior partial/deferred. | Scope/status | Partially; documents can classify scope but cannot prove behavior. | Possibly, for approved scope boundary | Yes | Reconcile exact objects, transitions, deployment state, and runtime evidence. | UNRESOLVED / NOT VERIFIED |
| C-003 | Phase 15.6 settlement/provider ambiguity | [PHASE_15_6 implementation](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md); [Release checklist](../RELEASE_READINESS_CHECKLIST.md) | Settlement migrations and webhook deployment are described, while live provider execution, secrets, and replay behavior remain deferred or not verified. | Implementation/evidence | Yes for artifact classification; no for provider behavior. | No new business decision for testing, but provider authorization is required | Yes | Separate local schema, remote deployment, configuration, live execution, and replay evidence. | DEFERRED / NOT VERIFIED |
| C-004 | Phase 15.5D gate versus Phase 15.6 implementation | [15.5D closure](../BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md); [PHASE_15_6 implementation](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md) | 15.5D records the Phase 15.6 gate as `NO`; later documentation reports Phase 15.6 work. | Governance/chronology | Yes only if a supersession or gate-change record exists; none was found in the reviewed set. | Yes, to approve or record the gate transition | Not for chronology; yes for resulting implementation claims | Record chronology, supersession, or explicit authorization without rewriting history. | UNRESOLVED |
| C-005 | Remote environment status inconsistency | [SRS](../BLOCKWAVELAB_SRS.md); [Release checklist](../RELEASE_READINESS_CHECKLIST.md); later Phase 15 reports | Some documents describe Supabase as inactive/unverified; others report remote migration and function metadata verification. | Deployment/evidence | Yes with a current timestamped inspection; historical reports alone are insufficient. | No, unless release acceptance is required | Yes | Recheck linked environment, migrations, functions, configuration, and availability. | NOT VERIFIED / UNRESOLVED |
| C-006 | Historical runtime defect versus remediation result | [Runtime audit](../PHASE_15_COMMERCIAL_FOUNDATION_RUNTIME_AUDIT.md); [gap remediation](../PHASE_15_COMMERCIAL_FOUNDATION_GAP_REMEDIATION.md) | The audit reports a high-severity cross-tenant `create_agreement` defect and `FAIL`; remediation reports a forward-only fix and `PASS WITH DEFERRED RUNTIME TESTS`. | Security/history | Yes for chronology and static remediation evidence; not for live behavior. | No policy decision, but release owner must accept evidence posture | Yes | Preserve the finding, link the remediation, and run approved cross-tenant tests. | HISTORICAL SEQUENCE / RUNTIME NOT VERIFIED |
| C-007 | Intended client journey versus runtime evidence | [Client journey](../BLOCKWAVELAB_V2_CLIENT_JOURNEY.md); [Release checklist](../RELEASE_READINESS_CHECKLIST.md) | The journey describes payment, activation, implementation, and handover; release evidence says runtime behavior is partial, blocked, or deferred. | Product intent/evidence | Yes for intended-versus-current classification; not for operation. | No, unless lifecycle scope changes | Yes | Label the journey as intended and attach stage-specific runtime evidence. | DOCUMENTED INTENT / NOT VERIFIED |
| C-008 | Phase 11 historical status versus later implementation | [Platform architecture](../BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md); later Phase 12–15 reports | Phase 11 is planning-only; later documents report implementation and deployment work. | Historical scope | Yes; phase/date labels can distinguish the claims. | No, unless current architecture has changed | Only for current implementation claims | Mark Phase 11 as historical within its scope and maintain a current-status index. | HISTORICAL / DOCUMENTED |

## 6. SERVICE CATALOG DECISION

The repository and founder direction support the following approved current
working position:

> **The current working catalog contains the five explicitly named services;
> the historical source discrepancy references ten grouped services but does
> not provide five additional names.**

The five explicitly named services are:

1. Delivery Infrastructure Foundation
2. CI/CD Hardening and Release Workflow
3. Automation Workflow Foundation
4. Managed Release Operations
5. Technical Readiness and Trust Systems

The service catalog also documents four approved capability pillars and
capability-level service concepts. Those capability lists must not be treated
as authorization to invent five additional sellable service names.

**Working decision status: APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09.**

**Approval authority:** Founder/Business Owner

**Approval date:** 2026-10-09
**Approval scope:** The five explicitly named services are the official current
working catalog. This approval does not invent or approve the five unnamed
historical service groupings, and future additions require documented change
control.

The historical discrepancy remains retained for traceability. Future services
must be introduced through documented change management after formal approval.
The Charter and service catalog remain separate draft documents until their
own review gates are complete; this decision approval does not baseline either
document or approve production readiness.

### Observation-period evidence note

The V2 specification explicitly documents a **60-day observation** period
beginning after production deployment and treats observation as part of the
paid implementation lifecycle. Later commercial decision records leave the
observation duration unresolved and state that a duration must not be
invented. This historical 60-day statement is superseded for the current working policy
by D-018: **30 calendar days after deployment**, approved by the
Founder/Business Owner on **2026-10-09**. The 30-day policy is not runtime
evidence, does not define acceptance metrics or an SLA/SLO, and does not by
itself authorize handover or stage progression.

## 7. PHASE 15.5D / 15.6 RECONCILIATION

### Phase 15.5D gate

[BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md](../BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md)
states that the Phase 15.6 gate is `NO` and that five owner decisions remain
necessary before a narrowly scoped provider-neutral payment foundation.

### Phase 15.6 implementation references

[PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md)
reports provider-neutral payment, entitlement, delivery, and lifecycle
foundations, and separately reports settlement/webhook artifacts. It also
states that settlement, provider execution, downstream lifecycle behavior, or
some delivery transitions remain separate, deferred, or not runtime verified.

### Delivery activation

The source set consistently documents a conceptual separation:

```text
Payment settlement ≠ entitlement activation ≠ delivery activation
```

The contradiction concerns implementation scope and evidence, not the
documented separation principle. It cannot be resolved by assuming that a
table, migration, RPC, or local report proves an end-to-end transition.

### Settlement/provider behavior

The repository documents local/provider-boundary and, in some reports, remote
deployment evidence. It does not document a completed live Stripe event,
replay/idempotency runtime test, or fully configured trusted provider runtime.

### Determination

Documentation can reconcile terminology and chronology, but it cannot by
itself prove current delivery activation or provider behavior. Resolution
requires:

- A supersession or gate-transition record for the 15.5D/15.6 sequence.
- Current repository and remote deployment inspection.
- Approved authenticated lifecycle tests.
- Approved provider test-mode execution and replay evidence.

**Status: UNRESOLVED / RUNTIME VERIFICATION REQUIRED.**

## 8. REMOTE ENVIRONMENT STATUS

The reviewed documents contain these different evidence classes:

- Some SRS and release-checklist statements describe remote/runtime claims as
  inactive, blocked, deferred, or not verified.
- Later implementation reports describe remote migrations, function metadata,
  and synchronization through named migration points.
- Payment reports state that Stripe secrets were absent and no live Stripe
  event was processed.

These statements may refer to different dates or evidence layers, but the
repository does not provide one authoritative current environment snapshot.

The following must be distinguished:

1. Local migration exists.
2. Remote migration ledger is synchronized.
3. Remote function is deployed and active.
4. Trusted provider secrets are configured.
5. Runtime can authenticate and execute.
6. Live provider event is accepted and reconciled.
7. Replay and negative behavior are verified.

No current runtime verification is claimed by this register.

**Status: NOT VERIFIED / UNRESOLVED.**

## 9. RUNTIME DEFECT VS REMEDIATION

### Historical defect

The commercial runtime audit reported that `create_agreement` did not fully
bind proposal and source-version references to the supplied organization and
project. It classified this as a high-severity tenant-integrity defect and
recorded a `FAIL` verdict.

### Documented remediation

The remediation report states that a forward-only migration replaced the
function and added organization, project, proposal, source-version, accepted
current-version, and relationship checks. It reports static validation and
remote migration synchronization.

### Evidence distinction

| Evidence layer | Current conclusion |
|---|---|
| Code/migration remediation | DOCUMENTED / STRUCTURALLY VERIFIED by the remediation report |
| Local/static verification | DOCUMENTED as passed |
| Remote migration/deployment | DOCUMENTED as synchronized in the remediation report |
| Authenticated cross-tenant runtime test | DEFERRED / NOT VERIFIED |
| Final production security conclusion | BLOCKED pending runtime evidence |

The remediation does not erase the historical finding. It provides a later
documented remediation state whose runtime effectiveness remains unverified.

## 10. CLIENT JOURNEY VS RUNTIME EVIDENCE

The client journey documents an intended path from public discovery through
organization/project setup, proposal, payment, implementation, observation,
handover, and ongoing service.

The SRS, release checklist, runtime audit, and remediation reports state that:

- Authentication runtime tests are incomplete.
- Cross-tenant and role-negative tests are deferred.
- Provider execution and replay tests are not verified.
- Payment, entitlement, and delivery transitions are not proven end to end.
- Some standalone routes and runtime UI behaviors were historically deferred
  and later structurally remediated, but authenticated browser verification
  remains incomplete.

Therefore:

- The journey is **DOCUMENTED INTENT**.
- The implemented pieces are **LOCAL** or **STRUCTURALLY VERIFIED** where stated.
- The complete operational journey is **NOT VERIFIED**.
- The journey must not be described as operational or production-ready until
  stage-specific runtime evidence exists.

## 11. PHASE 11 HISTORICAL STATUS

The Phase 11 architecture document explicitly scopes itself as a planning
proposal and states that authenticated platform, backend, payment, AI runtime,
monitoring, and admin implementation were not included in that phase.

Later Phase 12–15 documents describe later implementation work. This supports
the following evidence-backed classification:

- Phase 11 statements are **HISTORICAL within the Phase 11 scope**.
- They remain authoritative for what Phase 11 did or did not contain.
- They are not sufficient evidence of the current repository state.
- Later documents do not automatically supersede Phase 11 architecture intent
  unless they explicitly change that intent.

The current architecture baseline requires a dated/current-status index that
distinguishes phase-scoped historical facts from current implementation and
runtime evidence.

**Status: HISTORICAL / CURRENT STATUS INDEX REQUIRED.**

## 12. GEOGRAPHIC / JURISDICTION DECISION

The repository documents Web3 teams, early-stage through enterprise-level
clients, and USD as the primary commercial currency direction.

It does not establish:

- Target countries or regions
- Legal jurisdictions
- Contracting entities
- Data residency
- Supported languages
- Regional tax treatment
- Geographic qualification or exclusion rules

**Current status: UNRESOLVED.**

No country, region, jurisdiction, or geographic market commitment may be
added to Charter v1.0 without explicit owner and applicable legal review.

## 13. STAKEHOLDER / ACCOUNTABILITY DECISION

The repository identifies role categories but does not assign named
accountability. Missing or unassigned accountability includes:

- Business owner
- Product owner
- Engineering owner
- Operations owner
- Security owner
- Legal/privacy owner
- Accounting owner
- Provider/integration owner
- Release owner
- Documentation owner

The existing platform roles (`OWNER`, `ADMIN`, `MEMBER`, `PROJECT_MANAGER`,
`CONTRIBUTOR`, `VIEWER`, and documented platform roles) must not be confused
with organizational accountability assignments.

Charter v1.0 should include a RACI or equivalent matrix containing role,
accountability, decision authority, escalation path, and evidence ownership.
Names and assignments must come from the owner; none are invented here.

**Status: MISSING INFORMATION / OWNER DECISION REQUIRED.**

## 14. COMMERCIAL POLICY DECISIONS

The following decisions remain open or externally dependent:

| Area | Current documented position | Required determination | Status |
|---|---|---|---|
| Pricing | Scope/proposal-based direction; no prices | Fixed, calculated, negotiated, or hybrid mechanics; amount semantics | UNRESOLVED |
| Pricing authority | Founder/Business Owner retains final pricing and commercial approval authority under D-004 Option A; named delegation assignments remain open | Approver, delegation, and audit limits | APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09; specific delegations remain open |
| Currency | USD primary direction | Storage, minor units, exchange, and non-USD treatment | UNRESOLVED / ACCOUNTING INPUT |
| Tax | Not defined | Tax basis, calculation, display, and reporting | UNRESOLVED / ACCOUNTING INPUT |
| Accounting | Not defined | Reconciliation, reporting, and treatment of commercial events | UNRESOLVED / ACCOUNTING INPUT |
| Refunds and credits | Not defined | Eligibility, authority, allocation, and state effects | UNRESOLVED |
| Cancellation and pause | Explicit transition direction only | Timing, access, operational, and financial effects | UNRESOLVED |
| Disputes and chargebacks | Not defined | Provider, entitlement, delivery, and accounting effects | UNRESOLVED / PROVIDER INPUT |
| Recurring billing | Monthly primary direction; annual optional/future; execution is not approved | Execution, renewal, failure, cancellation, and provider behavior | DEFERRED / UNRESOLVED |
| Entitlement duration | Server-controlled and scoped in architecture | Duration, suspension, expiry, and revocation policy | UNRESOLVED |
| Service activation | Separate explicit gate after commercial checks | Authority, prerequisites, and evidence | UNRESOLVED / RUNTIME REQUIRED |
| Acceptance | Authenticated in-platform direction | Legal effect, evidence, identity assurance, retention, and privacy | UNRESOLVED / LEGAL INPUT |
| Settlement | Provider-verified server boundary | Provider mapping, reconciliation, replay, and exception behavior | DEFERRED / RUNTIME REQUIRED |

This register does not select policies or convert recommendations into
approved decisions.

## 15. CURRENT SDLC / PROJECT PHASE

The source set supports these facts:

- Public website and several platform foundations are documented as implemented
  locally or structurally verified.
- Commercial, payment, entitlement, and delivery foundations are described in
  later Phase 15 documents.
- Phase 15.5D records a `NO` gate for Phase 15.6.
- Phase 15.6 documents later implementation activity.
- Release readiness remains blocked by runtime, provider, operational, and
  governance gaps.

The evidence does not support one definitive current phase label.

### Documentation-safe status wording

> **Post-Phase-15 commercial/payment foundation work; current phase and gate
> reconciliation unresolved; release readiness blocked pending runtime,
> provider, operational, and governance evidence.**

This wording avoids falsely claiming that the project is either still before
Phase 15.6 or fully through Phase 15.6.

**Status: UNRESOLVED CURRENT PHASE / BLOCKED RELEASE POSTURE.**

## 16. RELEASE GOVERNANCE

### Currently release-blocking

- No complete authenticated runtime verification.
- No complete cross-tenant and role-negative authorization evidence.
- No complete provider live-event, replay, and settlement runtime evidence.
- Incomplete operational monitoring, incident, backup/recovery, and rollback evidence.
- Unresolved service catalog, geographic, commercial, legal, accounting, and
  accountability decisions.
- Contradictory current phase and remote-environment statements.
- Empty or incomplete governance registers.

### Requires runtime evidence

- Authentication and session behavior
- Organization/project authorization
- Cross-tenant isolation
- Commercial mutation and acceptance behavior
- Payment settlement and replay/idempotency
- Entitlement and delivery activation
- Authenticated browser journeys and deep links
- Current remote environment availability and configuration

### Requires owner or external decision

- Final service catalog
- Geographic/jurisdictional scope
- Pricing and approval authority
- Tax/accounting policy
- Refund/cancellation/dispute/chargeback policy
- Recurring billing
- Acceptance/legal/privacy evidence
- Entitlement and service activation policy
- Named accountability and release authority

### Requires documentation baseline

- Current-status and supersession record
- Updated document register
- Populated traceability matrix
- Explicit conflict-resolution records
- Versioned decision approvals

### Historical

- Phase 11 planning-only status
- The original `create_agreement` defect and failed audit
- Earlier phase implementation reports and their evidence dates

## 17. DECISION REGISTER

| Decision ID | Decision | Category | Current documented position | Options explicitly supported by existing documentation | Decision owner required | Evidence required | Impact | Status |
|---|---|---|---|---|---|---|---|---|
| D-001 | Final service count and names | Product | Founder/Business Owner approved the five explicitly named services as the official current working catalog on 2026-10-09; the historical source discrepancy references ten grouped services; no additional names are supplied. | Approved current working catalog with change-controlled additions | No further decision is required for the current five-service catalog. | Approval record and versioned catalog/change record | Product, sales, requirements, traceability | APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09 |
| D-002 | Geographic and jurisdictional scope | Business/compliance | Not established | None documented | Yes | Owner and legal record | Market, contracts, tax, privacy, operations | UNRESOLVED |
| D-003 | Pricing mechanics | Commercial | Founder/Business Owner approved D-003-A fixed-scope implementation, custom quotation for materially variable/non-standard scope, and separately priced monthly Managed Operations in principle on 2026-10-09. D-003-B permits documented, case-specific introductory discounts. D-003-C defers public prices while permitting approved service descriptions and inquiry/custom-quotation messaging. | No specific prices, price ranges, bundles, margins, payment execution, recurring-billing implementation, or public pricing are approved. | Yes | Approved commercial policy and proposal snapshot rules | Payment, proposal, accounting, tests | PARTIALLY RESOLVED — D-003-A/B/C APPROVED IN PRINCIPLE; MATERIAL PRICING POLICY UNRESOLVED |
| D-004 | Pricing authority | Governance | Founder/Business Owner approved Option A on 2026-10-09: Founder-controlled pricing and commercial approval authority is the default unless explicit, scoped, documented delegation is recorded. Preparation, scoping, estimating, and review do not constitute approval; discounts and exceptions require documented approval, reasons, evidence, and applicable change control. | Owner-controlled default with explicit, scoped, documented delegation | Yes | Approval policy, delegation records where applicable, and audit evidence | Commercial governance | APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09 |
| D-005 | Currency/accounting treatment | Commercial/accounting | USD primary direction; accounting/tax input remains required | One approved currency, bounded currency set, or per-proposal currency are documented as policy options; accounting input remains required | Yes/external | Accounting determination | Payment, tax, reporting | UNRESOLVED / EXTERNAL INPUT |
| D-006 | Multi-project and partial allocation | Commercial | Explicit scope required; allocation undefined | Defer multi-project settlement allocation or approve item/project allocation | Yes | Policy plus runtime tests | Obligations, refunds, entitlements | UNRESOLVED |
| D-007 | Agreement and acceptance policy | Legal/product | Authenticated acceptance direction; legal effect not claimed; legal/privacy input remains required | Agreement-required boundary and minimum acceptance evidence must be selected from documented candidates | Yes/external | Legal/privacy approval and runtime acceptance test | Commercial, privacy, audit | UNRESOLVED / EXTERNAL INPUT |
| D-008 | Refund/credit/cancellation/dispute behavior | Commercial/provider | Not defined; legal, accounting, and payment-provider input remains required | No final option selected in source documents | Yes/external | Approved policy and provider behavior | Payment, entitlement, delivery | UNRESOLVED / EXTERNAL INPUT |
| D-009 | Recurring billing execution | Commercial/provider | Monthly primary; annual optional/future; execution is not approved | Defer execution or approve a provider-backed recurring model | Yes | Provider configuration and runtime tests | Subscriptions, access, accounting | DEFERRED / UNRESOLVED |
| D-010 | Entitlement lifecycle | Product/technical | Server-controlled and scoped direction | Duration, suspension, expiry, and revocation require policy selection | Yes | Policy plus authenticated lifecycle tests | Access and delivery | UNRESOLVED |
| D-011 | Delivery activation gate | Delivery/security | Separate explicit gate; runtime transition evidence remains required | Define prerequisites and authority without coupling it to payment automatically | Yes | Runtime transition evidence | Delivery start and audit | UNRESOLVED / RUNTIME REQUIRED |
| D-012 | Payment settlement behavior | Provider/technical | Provider-verified boundary; live test absent; settlement remains runtime not verified | Provider-neutral foundation before provider-specific behavior, or approved provider execution | Yes/external | Live provider event, replay, reconciliation | Payment and release | DEFERRED / RUNTIME NOT VERIFIED |
| D-013 | GROW launch scope | Product/delivery | Capability family documented; launch detail unclear | Client-selectable or reviewed capability-family boundary are documented directions | Yes | Approved catalog and acceptance criteria | Product and delivery | UNRESOLVED |
| D-014 | OPERATE boundaries | Operations | Capability family documented; coverage unclear | Explicitly scoped operations with monitoring/support boundary, or defer offering | Yes | Operating model and acceptance evidence | Support, SLO/SLA, risk | UNRESOLVED |
| D-015 | AUTOMATE provider and limits | Technical/commercial | Provider not selected; human governance required; security/privacy/provider input remains required | Scope provider per engagement or defer provider-backed automation | Yes | Security/privacy/provider review | Cost, privacy, AI controls | UNRESOLVED / EXTERNAL INPUT |
| D-016 | Accountability and RACI | Governance | Founder/Business Owner approved Option A on 2026-10-09: role-level accountability now, with named individuals nominated later; Founder retains final approval authority unless explicitly delegated | Role-level RACI/equivalent model; named owners, escalation paths, evidence ownership, and scoped delegation remain open | Yes | Owner-approved governance record and later named-owner records | All downstream gates | APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09 |
| D-017 | Current phase and gate | SDLC governance | Phase 15.5D gate conflicts with Phase 15.6 reports | Record chronology and explicit supersession/gate transition | Yes | Versioned governance decision and evidence index | Charter status and roadmap | UNRESOLVED |
| D-018 | Standard post-deployment observation duration | Commercial/delivery governance | BLOCKWAVELAB_V2_SPEC.md preserves historical 60-day observation statements; the current working policy requires an owner-selected duration without inventing commercial commitments. | Founder/Business Owner selected 30 calendar days after deployment on 2026-10-09. | No for the policy decision; runtime observation execution remains unverified. | Not currently required. | Dated owner decision and controlled documentation update. | Observation policy gate; separate from acceptance, KPI, SLA/SLO, and release gates. | Owner Decision Register, Charter, Business Baseline, Delivery Playbook, change log. | BLOCKWAVELAB_V2_SPEC.md §§11, 18, and 22 remain historical source content; current policy references and delivery governance documents supersede them for current policy. | Delivery planning and observation exit evidence. | APPROVED — FOUNDER/BUSINESS OWNER, 2026-10-09 |

No options outside existing documentation are introduced by this register.

## 18. EVIDENCE REGISTER

| Evidence class | Decisions/items resolvable | Current evidence | Limitation |
|---|---|---|---|
| Existing documentation | Four pillars, observation as paid implementation, organization/project boundaries, documented lifecycle intent, historical phase scope | V2 spec, client journey, architecture, decision registers | Does not prove current runtime or settle unresolved policy |
| Repository inspection | Presence of routes, migrations, functions, static controls, document versions, and local artifacts | Source, migration, and documentation inspection | Does not prove deployed or executed behavior |
| Runtime verification | Auth, RLS, cross-tenant isolation, commercial transitions, entitlement, delivery activation, browser journeys | Requires approved identities and reachable environment | Currently deferred or blocked |
| External provider verification | Stripe secrets/configuration, live test event, webhook signature, replay, settlement reconciliation | Payment foundation and release documents identify required evidence | No completed live provider evidence documented |
| Owner/business decision | Service count/names, geography, pricing, authority, commercial policy, accountability, launch boundaries | Decision registers identify unresolved areas | Owners and decisions are not assigned/baselined |
| Legal/privacy/accounting input | Acceptance evidence, retention, tax, accounting, refunds, disputes, chargebacks | Decision documents identify dependencies | Must not be inferred technically |
| Release governance | Current phase, supersession, evidence acceptance, production approval | Release checklist and documentation architecture | No final release approval exists |

## 19. CHARTER v1.0 EXIT CRITERIA

Charter v0.1 may move to `BASELINED / APPROVED` only after all of the
following are true and recorded:

1. The business owner has approved or explicitly deferred every decision in
   the decision register.
2. Geographic and jurisdictional scope is explicitly recorded, or formally
   marked out of scope with the required legal implications addressed.
3. The service catalog conflict is resolved without inventing unsupported services.
4. Stakeholder accountability and RACI/equivalent governance are assigned.
5. Phase 15.5D/15.6 chronology, gate, and current phase are reconciled.
6. Remote environment and deployment claims have one timestamped evidence record.
7. Runtime authorization, tenant-isolation, lifecycle, and browser evidence is
   completed or formally accepted as a documented release limitation.
8. Provider configuration, live test, webhook, replay, and settlement evidence
   is completed or explicitly excluded from the approved release scope.
9. Operational readiness, monitoring, incident, backup/recovery, and rollback
   evidence is documented for the intended release scope.
10. Historical audit findings and remediation evidence are cross-referenced
    with current verification status.
11. The document register, change log, and traceability matrix are updated.
12. All conflicts have a documented resolution, supersession, or accepted
    unresolved status with an accountable owner.
13. The Charter is reviewed and approved by the authorized owner and release
    authority.

This register does not mark any criterion complete.

## 20. RECOMMENDED OWNER REVIEW AGENDA

1. Confirm the final service count and explicitly named services.
2. Confirm geographic and jurisdictional scope.
3. Assign business, product, engineering, operations, security, legal/privacy,
   accounting, provider, documentation, and release accountability.
4. Decide pricing authority and permitted pricing mechanics.
5. Route currency, tax, accounting, acceptance, retention, refund, dispute,
   and chargeback matters to the appropriate accountable owners.
6. Decide whether recurring billing, trial, GROW, OPERATE, and AUTOMATE
   capabilities are in the intended release scope.
7. Reconcile the Phase 15.5D gate with Phase 15.6 implementation records.
8. Confirm the evidence required for current remote, runtime, provider, and
   operational claims.
9. Confirm the release-blocking criteria and the authority to accept residual risk.

## 21. TRACEABILITY IMPACT

| Unresolved area | Downstream artifacts potentially affected |
|---|---|
| Service count and names | SRS, Business Requirements, Use Cases, Domain Model, Architecture, API Specification, Traceability Matrix, Release Documentation, Operations Documentation |
| Geographic/jurisdictional scope | Business Requirements, SRS, Security Model, Architecture, API Specification, Test Strategy, Operations Documentation, Release Documentation |
| Pricing and commercial authority | SRS, Business Requirements, Use Cases, ERD, Domain Model, Architecture, API Specification, Security Model, Test Strategy, Traceability Matrix, Release Documentation |
| Tax/accounting/refunds/disputes/chargebacks | SRS, Business Requirements, ERD, Domain Model, API Specification, Test Strategy, Release Documentation, Operations Documentation |
| Acceptance and legal/privacy evidence | SRS, Use Cases, Security Model, API Specification, Test Strategy, Operations Documentation, Release Documentation |
| Recurring billing and entitlement lifecycle | SRS, Use Cases, ERD, Domain Model, Architecture, API Specification, Security Model, Test Strategy, Operations Documentation |
| Delivery activation | SRS, Use Cases, Domain Model, Architecture, API Specification, Security Model, Test Strategy, Release Documentation, Operations Documentation |
| GROW/OPERATE/AUTOMATE launch boundaries | Business Requirements, SRS, Use Cases, Architecture, API Specification, Test Strategy, Operations Documentation |
| Current phase and deployment status | Traceability Matrix, Release Documentation, Operations Documentation, Charter governance records |
| Accountability/RACI | All governance, requirements, test, release, security, and operations artifacts |

The impact table identifies affected artifacts; it does not create or update
those artifacts.

## 22. FINAL STATUS

CHARTER DECISION STATUS:
DRAFT — OWNER DECISIONS / EVIDENCE RECONCILIATION REQUIRED

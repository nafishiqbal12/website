# BlockWaveLab V2 Owner Decision Resolution Plan

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-OWNER-RESOLUTION-001 |
| Version | 0.1 |
| Status | DRAFT — PENDING OWNER REVIEW |
| Classification | INTERNAL PROJECT GOVERNANCE |
| Authority | DECISION RESOLUTION WORKFLOW — NOT A BASELINE DECISION RECORD |
| Accountable owner | Accountable owner not yet assigned. |
| Approver | Accountable owner not yet assigned. |

This plan is a controlled workflow for the existing 17-decision inventory. It
does not decide, approve, defer, or implement any decision.

## 2. Purpose

This document defines how the decisions in the Owner Decision Matrix will be
resolved, evidenced, approved, recorded, and traced into downstream SDLC
artifacts.

It is a workflow document only. It does not modify or supersede:

- [BLOCKWAVELAB_V2_PROJECT_CHARTER.md](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
- [BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
- [BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)

## 3. Source Documents

Primary sources:

1. [Charter Decision Register](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
2. [Owner Decision Matrix](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
3. [Project Charter Draft](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
4. [BlockWaveLab V2 Specification](../BLOCKWAVELAB_V2_SPEC.md)
5. [BlockWaveLab SRS](../BLOCKWAVELAB_SRS.md)
6. [Platform Architecture](../BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md)
7. [Client Journey](../BLOCKWAVELAB_V2_CLIENT_JOURNEY.md)
8. [Service Catalog](../BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md)
9. [Phase 15.5D Owner Decision Closure](../BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md)
10. [Phase 15.6 Payment Foundation Implementation](../PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md)
11. [Release Readiness Checklist](../RELEASE_READINESS_CHECKLIST.md)
12. [Documentation Architecture](../DOCUMENTATION_ARCHITECTURE.md)

## 4. Resolution Principles

1. The 17 decisions in the Owner Decision Matrix are the complete decision
   inventory for this workflow.
2. No decision is implied by implementation convenience.
3. Documentation evidence can establish facts and evidence status, but cannot
   create an owner, commercial, legal, accounting, geographic, or provider
   decision.
4. Runtime evidence must be labeled separately from local or static evidence.
5. Specialist input must be recorded where legal, accounting, provider,
   privacy, or security consequences exist.
6. An approved decision must identify its approver, effective version, scope,
   evidence, and affected documents.
7. Deferred does not mean approved, implemented, or production-ready.
8. Conflicting historical documents remain unchanged; a later decision record
   must describe supersession or chronology explicitly.
9. Any downstream document update requires controlled versioning and change
   logging.

## 5. Decision Resolution Workflow

### Gate 1 — Prepare

- Confirm the decision inventory is unchanged.
- Assign an accountable owner or record that the owner remains unassigned.
- Identify affected stakeholders and specialist reviewers.
- Confirm whether the decision is business, technical, runtime, external, or
  governance-led.

### Gate 2 — Gather evidence

- Collect relevant source documents and repository evidence.
- Classify each item as local, structural, remote, runtime, historical,
  deferred, blocked, or not verified.
- Record conflicts without choosing silently.

### Gate 3 — Review

- Present only documented options and implications.
- Obtain required owner, business, specialist, security, or release review.
- Record questions and evidence gaps.

### Gate 4 — Decide or formally defer

- Record the approved outcome, explicit deferral, or unresolved disposition.
- Do not treat silence or implementation activity as approval.
- Record any conditions, scope limitations, and required follow-up evidence.

### Gate 5 — Propagate

- Update the approved decision record.
- Update affected requirements, architecture, security, test, operational, and
  release documents only through controlled change.
- Update the document register, change log, and traceability matrix.

### Gate 6 — Verify and close

- Execute required repository, runtime, provider, or specialist checks.
- Record evidence and residual gaps.
- Mark the decision closed only when its acceptance criteria are met.

## 6. Master Resolution Plan — all 17 decisions

The decision IDs appear exactly once in this table. Later sections refer to
decision titles rather than repeating IDs.

| Decision ID | Decision title | Primary decision category | Who/role must resolve it | Repository evidence can resolve it? | Runtime evidence required? | External specialist input required? | Required evidence/input | Decision gate | Approved outcome record | Existing documents that may require controlled updates | Downstream SDLC impact | Current status | Recommended next action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D-001 | Final service count and names | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Partially; it can confirm five named services and the conflict. | No, unless catalog behavior is later tested. | Not currently required. | Approved catalog decision and versioned service list. | Product/catalog approval gate. | Owner Decision Register, Service Catalog, Charter. | Service Catalog, SRS, Charter, traceability matrix, release documentation. | Product scope, requirements, use cases, domain model, API, operations. | OWNER DECISION REQUIRED | Assign owner and review the five named services without inventing the remaining entries. |
| D-002 | Geographic and jurisdictional scope | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Yes for confirming absence of current scope; no for selecting scope. | No. | Legal/privacy and tax input may be required after direction. | Owner direction and applicable legal/compliance record. | Market and compliance scope gate. | Owner Decision Register, Charter, applicable legal/compliance record. | Charter, SRS, business requirements, security, operations. | Market, contracts, privacy, tax, data residency. | OWNER DECISION REQUIRED | Confirm whether scope will be defined or explicitly left unresolved/out of scope. |
| D-003 | Pricing mechanics | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Yes for documenting candidate modes and absence of prices. | No initially. | Accounting input may be required. | Approved commercial policy defining permitted mechanics and snapshots. | Commercial policy gate. | Owner Decision Register, commercial policy, SRS. | SRS, domain model, database blueprint, API, payment documents. | Proposals, payment obligations, accounting, tests. | OWNER DECISION REQUIRED | Convene owner and accounting review using only documented candidate modes. |
| D-004 | Pricing authority | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Yes for confirming existing roles do not establish pricing authority. | No initially. | Legal/accounting input may be required. | Authority matrix, delegation limits, audit expectations. | Commercial authority gate. | Owner Decision Register, authorization model, Charter. | Authorization model, SRS, API, security, operations. | Approval controls, audit, commercial governance. | OWNER DECISION REQUIRED | Assign accountable authority before commercial behavior is baselined. |
| D-005 | Currency/accounting treatment | EXTERNAL SPECIALIST INPUT | Accountable owner not yet assigned, with accounting specialist input. | Yes for documenting USD direction and open fields. | Possibly for payment/reporting validation after policy. | Accounting/tax specialist required. | Accounting determination, currency representation, rounding, exchange, reporting. | Accounting and financial-control gate. | Approved accounting policy, Owner Decision Register, SRS. | SRS, database blueprint, domain model, API, payment and release documents. | Amounts, tax, reconciliation, reporting, refunds. | EXTERNAL SPECIALIST INPUT REQUIRED | Route to accounting/tax review; do not infer financial treatment. |
| D-006 | Multi-project and partial allocation | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Partially; it can confirm explicit project-scope requirements. | Yes if the behavior is approved for implementation. | Accounting/provider input may be required. | Allocation policy, partial-purchase rules, refund and entitlement lineage. | Commercial scope and allocation gate. | Owner Decision Register, commercial policy, domain model. | SRS, ERD/domain model, API, security, payment, entitlement documents. | Obligations, settlement, refunds, entitlements, reporting. | OWNER DECISION REQUIRED | Decide whether allocation is approved, bounded, or deferred. |
| D-007 | Agreement and acceptance policy | EXTERNAL SPECIALIST INPUT | Accountable owner not yet assigned, with legal/privacy input. | Yes for the existing authenticated technical boundary. | Yes for acceptance and evidence behavior after policy. | Legal/privacy specialist required. | Agreement-required boundary, evidence, identity assurance, retention, privacy basis. | Legal and acceptance gate. | Approved legal/product policy, Owner Decision Register, SRS. | SRS, API, security, audit, test, release, operations documents. | Commercial authority, privacy, audit, user journeys. | EXTERNAL SPECIALIST INPUT REQUIRED | Obtain legal/privacy determination before claiming acceptance completeness. |
| D-008 | Refund/credit/cancellation/dispute behavior | EXTERNAL SPECIALIST INPUT | Accountable owner not yet assigned, with legal/accounting/provider input. | Only for confirming the policy is absent. | Yes after policy and provider behavior exist. | Legal, accounting, and provider specialists required. | Approved exception policy, state effects, authority, accounting and provider mapping. | Financial exception gate. | Commercial policy, Owner Decision Register, SRS. | SRS, domain model, API, payment, entitlement, delivery, operations. | Financial state, access, delivery, support, reconciliation. | EXTERNAL SPECIALIST INPUT REQUIRED | Create a specialist review package; do not implement or imply behavior. |
| D-009 | Recurring billing execution | DEFERRED DECISION | Accountable owner not yet assigned if scope is reopened. | Yes for confirming current deferral. | Yes if later authorized. | Provider/accounting/legal input if activated. | Explicit scope decision and provider/runtime evidence if reopened. | Release-scope expansion gate. | Owner Decision Register, Charter scope, future commercial policy. | SRS, domain model, API, payment, operations, release documents. | Subscription, renewal, failure, cancellation, accounting. | DEFERRED | Keep deferred unless the owner explicitly expands the approved scope. |
| D-010 | Entitlement lifecycle | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Partially; it can confirm server-controlled separation and existing structures. | Yes for access transitions after policy. | Security input may be required. | Duration, suspension, expiry, revocation, scope, and access policy. | Entitlement policy and security gate. | Owner Decision Register, SRS, domain model, authorization model. | SRS, domain model, database blueprint, API, security, tests. | Access, delivery, support, audit. | OWNER DECISION REQUIRED | Define policy boundaries before treating entitlement foundations as complete. |
| D-011 | Delivery activation gate | RUNTIME VERIFICATION | Accountable owner not yet assigned; release/operations authority required. | Partially; static functions, grants, and state boundaries can be inspected. | Yes. | Security/release input may be required. | Approved prerequisites plus authenticated positive, negative, idempotency, and audit tests. | Delivery admission and runtime gate. | Owner Decision Register, runtime evidence record, release checklist. | SRS, domain model, API, security, test strategy, operations, release. | Delivery start, audit, handover, support. | RUNTIME VERIFICATION REQUIRED | Reconcile policy boundary, then execute approved tests in a reachable environment. |
| D-012 | Payment settlement behavior | EXTERNAL SPECIALIST INPUT | Accountable owner not yet assigned, with provider/accounting/security input. | Yes for adapter, webhook, migration, and fail-closed inspection. | Yes. | Provider, accounting, and security specialists required. | Provider configuration, live event, signature, replay, reconciliation, and exception evidence. | Provider settlement and release gate. | Provider decision record, Owner Decision Register, release evidence. | SRS, API, security model, payment documents, operations, release. | Payment, entitlements, accounting, incident response. | EXTERNAL SPECIALIST INPUT REQUIRED | Keep settlement unverified until approved provider testing is complete. |
| D-013 | GROW launch scope | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Yes for documenting the capability family and legacy exclusions. | No initially. | Not inherently required. | Approved launch boundary, catalog availability, and acceptance criteria. | Product launch-scope gate. | Owner Decision Register, Service Catalog, Charter. | Service Catalog, SRS, requirements, operations, release. | Product, delivery, marketing/content, acceptance. | OWNER DECISION REQUIRED | Owner reviews whether GROW is launchable and under what documented scope. |
| D-014 | OPERATE boundaries | OWNER / BUSINESS DECISION | Accountable owner not yet assigned. | Partially; capability family and existing operational artifacts can be inspected. | Required for operational claims after scope approval. | Security/operations input may be required. | Coverage, monitoring/support boundary, acceptance criteria, and operating model. | Service and operations gate. | Owner Decision Register, Service Catalog, Operations documentation, Charter. | SRS, architecture, service catalog, operations, release, security. | Support, incident response, SLO/SLA claims, delivery. | OWNER DECISION REQUIRED | Define a bounded offering or formally defer it; do not infer commitments. |
| D-015 | AUTOMATE provider and limits | EXTERNAL SPECIALIST INPUT | Accountable owner not yet assigned, with security/privacy/provider input. | Yes for confirming no provider is selected and governance boundaries exist. | Yes for provider-backed operation. | Security, privacy, and provider specialists required. | Provider review, data/tool permissions, usage limits, approvals, audit, runtime tests. | AI/provider security gate. | Approved AI/provider policy, Owner Decision Register, SRS. | Architecture, API, security model, SRS, test strategy, operations, release. | Cost, privacy, permissions, audit, operations. | EXTERNAL SPECIALIST INPUT REQUIRED | Maintain provider-neutral scope until specialist review and owner authorization. |
| D-016 | Accountability and RACI | GOVERNANCE / DOCUMENTATION DECISION | Accountable owner not yet assigned. | Yes for identifying roles and missing assignments. | No, except evidence ownership for later tests. | None inherently required; specialists must be assigned. | Approved RACI/equivalent, escalation path, decision authority, evidence ownership. | Governance-baseline gate. | Charter, Owner Decision Register, document register, change log. | All requirements, architecture, security, testing, release, operations. | Every downstream approval and evidence path. | GOVERNANCE ACTION REQUIRED | Assign accountability before asking owners to approve dependent decisions. |
| D-017 | Current phase and gate | GOVERNANCE / DOCUMENTATION DECISION | Accountable owner not yet assigned; release authority required. | Yes for comparing chronology and status claims. | Only for validating current implementation claims, not chronology itself. | Release governance input may be required. | Versioned chronology, supersession/gate record, current evidence index. | SDLC status and release-governance gate. | Charter, Owner Decision Register, release checklist, document register. | Charter, roadmap, SRS status, traceability, release and operations documents. | Project status, roadmap, release approval, evidence interpretation. | GOVERNANCE ACTION REQUIRED | Record a safe current-status wording without rewriting historical documents. |

## 7. Owner/Business Decisions

The following primary categories require explicit business-owner action:

- Final service count and names
- Geographic and jurisdictional scope
- Pricing mechanics
- Pricing authority
- Multi-project and partial allocation
- Entitlement lifecycle
- GROW launch scope
- OPERATE boundaries

For each item, the owner must either approve a documented outcome, explicitly
defer it, or record that it remains unresolved. No absence of response is an
approval.

## 8. Repository Evidence Decisions

Repository evidence should be gathered before owner review to avoid asking the
owner to decide factual questions already answerable from the repository:

- The five explicitly named services and the unresolved catalog remainder
- The absence of an authoritative geographic scope
- Existing candidate pricing modes and lack of price values
- Existing role definitions and absence of assigned pricing authority
- USD as the documented primary currency direction
- Existing authenticated acceptance boundary and its limitations
- Existing deferred recurring-billing scope
- Static delivery and settlement boundaries
- Document chronology and missing supersession records

Repository evidence can classify facts. It cannot approve the business outcome.

## 9. Runtime Verification Decisions

Runtime verification is required after policy and scope prerequisites are
approved for:

- Delivery activation
- Entitlement transitions
- Authenticated acceptance
- Approved multi-project or partial-allocation behavior
- Payment settlement, webhook, replay, and reconciliation
- Authenticated browser journeys and tenant-isolation behavior where relevant

Runtime results must identify environment, test identity, timestamp, expected
state, observed state, evidence location, and residual risk.

## 10. External Specialist Input Decisions

Specialist review is required for:

- Currency, accounting, tax, exchange, and reporting treatment
- Agreement and acceptance evidence, legal effect, privacy, and retention
- Refunds, credits, cancellations, disputes, and chargebacks
- Provider settlement and reconciliation
- AUTOMATE provider, privacy, security, tool, and usage boundaries

Specialists advise or approve within their authority; they do not replace the
business owner’s product or commercial decision.

## 11. Deferred Decisions

Recurring billing execution is explicitly deferred in the source decision
inventory. Live provider settlement behavior remains deferred until the
required provider configuration and evidence exist.

Any additional deferral requires a recorded owner decision, scope limitation,
review date or trigger where applicable, and a statement of what remains
blocked by the deferral.

## 12. Dependency and Ordering Map

The following relationships are supported by the existing documentation or are
explicitly marked as requiring owner confirmation:

| Relationship | Basis | Explanation |
|---|---|---|
| Accountability and RACI → all later decision gates | Document-supported | Named authority and evidence ownership are required to process later approvals. |
| Current phase and gate → Charter status and release documentation | Document-supported | Phase 15.5D and Phase 15.6 status must be reconciled before current-status claims are baselined. |
| Final service catalog → SRS, requirements, use cases, and traceability | Document-supported | The service-count conflict directly affects product vocabulary and downstream mapping. |
| Geographic/jurisdictional scope → legal, tax, privacy, security, and operations | Document-supported | The Charter analysis identifies these downstream effects; the owner must confirm the actual scope. |
| Pricing mechanics and authority → currency/accounting treatment | Requires owner confirmation | The documents identify related commercial dependencies but do not establish a mandatory sequencing rule. |
| Currency/accounting treatment → payment, refund, dispute, and settlement records | Document-supported | Financial representation affects payment and reconciliation semantics. |
| Agreement/acceptance policy → commercial acceptance tests and audit evidence | Document-supported | Legal/privacy policy must precede final acceptance evidence claims. |
| Refund/dispute policy → provider settlement and entitlement effects | Requires owner confirmation | The relationship is documented as a dependency, but exact sequencing requires policy approval. |
| Entitlement lifecycle → delivery activation gate | Document-supported | The architecture separates entitlement from delivery activation and requires explicit transition rules. |
| Provider settlement behavior → entitlement and release evidence | Document-supported | Settlement is not entitlement or delivery activation, but provider evidence is needed for downstream claims. |
| GROW, OPERATE, and AUTOMATE scope → service catalog and operating documentation | Document-supported | Launch boundaries affect service acceptance and operating scope. |

No additional dependency is asserted beyond the relationships above.

## 13. Documents Affected After Decisions

Approved decisions may require controlled updates to existing documents,
depending on the decision scope:

- [BLOCKWAVELAB_V2_PROJECT_CHARTER.md](./BLOCKWAVELAB_V2_PROJECT_CHARTER.md)
- [BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
- [BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md](./BLOCKWAVELAB_V2_OWNER_DECISION_MATRIX.md)
- [BLOCKWAVELAB_V2_SPEC.md](../BLOCKWAVELAB_V2_SPEC.md)
- [BLOCKWAVELAB_SRS.md](../BLOCKWAVELAB_SRS.md)
- [BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md](../BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md)
- [BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md](../BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md)
- [BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md](../BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md)
- [BLOCKWAVELAB_V2_DOMAIN_MODEL.md](../BLOCKWAVELAB_V2_DOMAIN_MODEL.md)
- [BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md](../BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md)
- [BLOCKWAVELAB_V2_API_BLUEPRINT.md](../BLOCKWAVELAB_V2_API_BLUEPRINT.md)
- [BLOCKWAVELAB_V2_CLIENT_JOURNEY.md](../BLOCKWAVELAB_V2_CLIENT_JOURNEY.md)
- [RELEASE_READINESS_CHECKLIST.md](../RELEASE_READINESS_CHECKLIST.md)
- [DOCUMENTATION_ARCHITECTURE.md](../DOCUMENTATION_ARCHITECTURE.md)

The documents above must not be edited merely because this plan exists.
Changes require an approved decision, a change record, and appropriate
technical, legal, security, or release review.

## 14. Charter v1.0 Readiness Gate

The existing Charter v1.0 exit criteria map to this workflow as follows:

| Charter exit criterion | Resolution-plan control | Current state |
|---|---|---|
| Every decision approved or explicitly deferred | Master plan status and decision record | BLOCKED |
| Geographic scope recorded | Geographic decision workflow and specialist route | OWNER DECISION REQUIRED |
| Service catalog conflict resolved | Catalog decision gate | OWNER DECISION REQUIRED |
| Stakeholder accountability/RACI assigned | Governance decision gate | GOVERNANCE ACTION REQUIRED |
| Phase 15.5D/15.6 chronology reconciled | Current-phase governance gate | GOVERNANCE ACTION REQUIRED |
| Remote environment evidence recorded | Repository/runtime/provider evidence gates | RUNTIME VERIFICATION REQUIRED |
| Authorization, isolation, lifecycle, and browser evidence complete or accepted as limitation | Runtime verification workflow | RUNTIME VERIFICATION REQUIRED |
| Provider configuration, live test, replay, and settlement evidence complete or excluded | External/provider workflow | EXTERNAL SPECIALIST INPUT REQUIRED |
| Operational readiness evidence documented | Operations and release gate | BLOCKED |
| Historical findings cross-referenced with current evidence | Documentation propagation workflow | GOVERNANCE ACTION REQUIRED |
| Document register, change log, and traceability matrix updated | Documentation governance gate | GOVERNANCE ACTION REQUIRED |
| Conflicts resolved, superseded, or accepted with accountable owner | Conflict and decision records | BLOCKED |
| Authorized owner and release authority approve Charter | Final approval gate | GOVERNANCE ACTION REQUIRED |

This plan does not mark any criterion complete.

## 15. Open Governance Items

- Accountable owner not yet assigned.
- Decision approvers and specialist reviewers are not formally assigned.
- The document register, change log, and traceability matrix require controlled
  population after decisions are recorded.
- No decision-resolution meeting record or approval record exists in the
  reviewed source set.
- Current phase, remote environment, and runtime evidence require a dated
  evidence index.
- Any accepted residual risk requires an authorized release decision.

## 16. Final Status

OWNER DECISION RESOLUTION PLAN STATUS:
DRAFT — PENDING OWNER REVIEW

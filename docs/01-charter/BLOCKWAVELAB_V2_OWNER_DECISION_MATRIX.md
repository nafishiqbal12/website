# BlockWaveLab V2 Owner Decision Matrix

## 1. Document Control

| Field | Value |
|---|---|
| Document ID | BWL-OWNER-DECISION-001 |
| Title | BlockWaveLab V2 Owner Decision Matrix |
| Version | 0.1 |
| Status | DRAFT — PENDING OWNER REVIEW |
| Classification | INTERNAL PROJECT GOVERNANCE |
| Authority | OWNER DECISION SUPPORT — NOT BASELINED |
| Owner | OWNER NOT YET ASSIGNED |
| Approver | OWNER NOT YET ASSIGNED |

This matrix converts the 17 unresolved decisions in the
[Charter Decision Register](./BLOCKWAVELAB_V2_CHARTER_DECISION_REGISTER.md)
into an owner-review and evidence-resolution plan. It does not decide any
business, legal, accounting, provider, security, or governance question.

## 2. Purpose

The purpose of this document is to identify, for each unresolved decision:

- the primary resolution category;
- what repository evidence can establish;
- what requires owner or specialist input;
- what runtime evidence is needed;
- which downstream SDLC artifacts may be affected; and
- the next action required before Charter v1.0 can be baselined.

The categories are mutually exclusive at the primary-classification level.
Secondary evidence or specialist dependencies are described in their own
columns and do not change the primary category.

## 3. Classification Rules

| Category | Meaning |
|---|---|
| **A. OWNER / BUSINESS DECISION** | A business, product, commercial, or policy choice requiring explicit owner direction. |
| **B. TECHNICAL / REPOSITORY EVIDENCE** | A question that can be answered from source, migration, document, or static repository evidence without selecting a new policy. |
| **C. RUNTIME VERIFICATION** | A question about deployed, authenticated, provider, lifecycle, or behavioral evidence that static inspection cannot prove. |
| **D. EXTERNAL SPECIALIST INPUT** | A question requiring legal, accounting, provider, privacy, or security-specialist determination. |
| **E. DEFERRED DECISION** | A decision intentionally postponed in the existing documentation and not required for the currently bounded scope. |
| **F. GOVERNANCE / DOCUMENTATION DECISION** | A question about authority, status, accountability, chronology, baselining, or evidence records. |

Classification does not imply that a decision is approved. `UNRESOLVED`,
`DEFERRED`, `BLOCKED`, `NOT VERIFIED`, and `MISSING INFORMATION` remain
distinct statuses.

## 4. Owner Decision Matrix

| Decision ID | Decision | Category | Why This Category Applies | Current Documented Position | What Can Be Resolved Without Owner Decision | What Cannot Be Resolved Without Owner Decision | Required Evidence | Required External Input | Downstream Impact | Recommended Next Action | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D-001 | Final service count and names | A. OWNER / BUSINESS DECISION | The repository cannot supply missing sellable service names without inventing business content. | Ten grouped services are referenced; five are explicitly named. | Record the five named services and preserve the inconsistency. | Confirm whether the final catalog has ten services and approve any additional names or correct the count. | Approved catalog record and versioned decision. | None currently required; legal review may follow catalog scope. | Product scope, SRS, requirements, use cases, domain model, API, traceability, release, operations. | Owner reviews the five names and confirms the final count without accepting invented entries. | UNRESOLVED |
| D-002 | Geographic and jurisdictional scope | A. OWNER / BUSINESS DECISION | Market scope is a business commitment and is absent from the repository. | Web3 customer segments are documented; no geography or jurisdiction is established. | Confirm that the repository currently contains no geographic commitment. | Select or explicitly exclude geographic and jurisdictional scope. | Owner decision record; resulting legal/compliance scope. | Legal/privacy and tax input after owner direction. | Business requirements, SRS, security, architecture, API, test strategy, operations, release. | Owner records geographic scope or formally marks it unresolved/out of scope with implications. | UNRESOLVED |
| D-003 | Pricing mechanics | A. OWNER / BUSINESS DECISION | Technical evidence cannot choose how the business prices scope. | Scope/proposal-based direction exists; no prices are approved. | Preserve candidate modes already documented: fixed, calculated, negotiated, hybrid, or manual snapshot. | Select permitted pricing modes, amount semantics, units, rounding, and discount authority. | Approved commercial policy and proposal snapshot rules. | Accounting input may be needed for amount and reporting treatment. | SRS, business requirements, use cases, ERD, domain model, API, tests, traceability, release. | Owner selects or defers the pricing policy; no implementation inference. | UNRESOLVED |
| D-004 | Pricing authority | A. OWNER / BUSINESS DECISION | Authority and delegation are governance choices. | Pricing ownership and approval limits are not assigned. | Identify that existing roles do not automatically establish commercial authority. | Assign accountable approver(s), delegation limits, and audit requirements. | Approved authority matrix and audit policy. | Legal/accounting input if authority creates contractual or financial obligations. | Commercial requirements, authorization model, API, security, audit, operations, release. | Owner assigns authority or records a bounded interim policy. | UNRESOLVED |
| D-005 | Currency/accounting treatment | D. EXTERNAL SPECIALIST INPUT | USD direction is documented, but accounting and financial treatment cannot be safely invented technically. | USD is primary; storage, rounding, exchange, tax, and reporting remain open. | Preserve USD as the documented direction and identify unresolved accounting fields. | Choose accounting treatment, currency support, exchange, rounding, and reporting policy. | Accounting determination and approved commercial data model. | Accounting/tax specialist input required. | SRS, ERD, domain model, API, payment, reporting, tests, operations, release. | Route the decision to accounting; owner records the resulting policy without inventing it. | UNRESOLVED / EXTERNAL INPUT |
| D-006 | Multi-project and partial allocation | A. OWNER / BUSINESS DECISION | Whether and how commercial scope is allocated is a business policy choice. | Explicit project scope is required; allocation behavior is undefined. | Preserve project-level ownership and the option to defer settlement allocation. | Approve allocation, partial settlement, refund, reporting, and entitlement behavior. | Commercial policy plus allocation and negative-test evidence. | Accounting/provider input for settlement and refund treatment. | ERD, domain model, API, security, payment, entitlement, delivery, tests, traceability. | Owner chooses a bounded single-project/deferred path or approves allocation policy. | UNRESOLVED |
| D-007 | Agreement and acceptance policy | D. EXTERNAL SPECIALIST INPUT | Legal effect, identity assurance, evidence, retention, and privacy cannot be decided by technical design alone. | Authenticated in-platform acceptance is documented; legal enforceability is not claimed. | Preserve the technical acceptance boundary and its non-signature limitation. | Decide agreement-required cases and approved acceptance evidence and retention. | Legal/privacy-approved acceptance policy and authenticated test results. | Legal, privacy, and potentially compliance input required. | SRS, use cases, security, API, audit, tests, release, operations. | Obtain legal/privacy determination, then record owner-approved product scope. | UNRESOLVED / EXTERNAL INPUT |
| D-008 | Refund, credit, cancellation, dispute, and chargeback behavior | D. EXTERNAL SPECIALIST INPUT | Financial, contractual, provider, and legal consequences are external to repository evidence. | Policies are not defined; no behavior should be invented. | Record that the current implementation must not claim these behaviors. | Approve eligibility, authority, state effects, allocation, and customer treatment. | Approved policy, provider mapping, accounting treatment, and runtime tests. | Legal, accounting, and payment-provider input required. | SRS, requirements, ERD, domain model, API, security, tests, release, operations. | Route policy questions to the relevant specialists before implementation scope is baselined. | UNRESOLVED / EXTERNAL INPUT |
| D-009 | Recurring billing execution | E. DEFERRED DECISION | Existing documents explicitly make annual service future/optional and defer recurring execution details. | Monthly recurring service is primary direction; execution is not approved. | Preserve the deferred status and separate ongoing service from implementation. | Authorize subscription execution, renewal, failure, cancellation, and provider behavior. | Explicit scope decision and provider/runtime evidence if activated. | Provider, accounting, and legal input if implementation is authorized. | SRS, requirements, ERD, domain model, API, security, tests, operations, release. | Keep recurring execution deferred until the owner explicitly adds it to scope. | DEFERRED / UNRESOLVED |
| D-010 | Entitlement lifecycle | A. OWNER / BUSINESS DECISION | Duration, suspension, expiry, and revocation are service-access policy choices even though technical foundations exist. | Entitlements are server-controlled, source-linked, scoped, and audited; exact lifecycle policy is open. | Verify the documented separation from payment and delivery and inspect existing structures. | Select duration, suspension, expiry, revocation, and scope rules. | Approved lifecycle policy and authenticated entitlement tests. | Security input may be required for access-risk treatment. | SRS, domain model, ERD, API, authorization, security, tests, operations. | Owner approves lifecycle policy before claiming complete access behavior. | UNRESOLVED |
| D-011 | Delivery activation gate | C. RUNTIME VERIFICATION | The key unresolved claim is whether the deployed trusted transition behaves correctly under real authorization and state conditions. | Delivery activation is documented as a separate explicit gate; exact current implementation status is inconsistent. | Inspect local functions, migrations, grants, and state boundaries. | Define business prerequisites and authority if not already accepted; technical inspection cannot create them. | Authenticated positive/negative lifecycle tests, idempotency, stale-state, and audit evidence. | Security/release input for acceptance of residual risk. | SRS, use cases, domain model, API, security, test strategy, release, operations. | Reconcile policy boundary, then execute approved runtime tests against the reachable environment. | UNRESOLVED / RUNTIME REQUIRED |
| D-012 | Payment settlement behavior | D. EXTERNAL SPECIALIST INPUT | Provider-specific settlement, reconciliation, replay, and exception behavior require provider and financial expertise. | Provider-verified server boundary exists; live provider test is absent. | Inspect adapter, webhook signature checks, migrations, grants, and fail-closed behavior. | Authorize provider behavior, supported event scope, settlement exceptions, and release acceptance. | Live provider test event, signature validation, replay/idempotency, amount/currency checks, and reconciliation evidence. | Payment-provider and accounting input; security review for webhook boundary. | SRS, ERD, domain model, API, security, tests, release, operations. | Keep live settlement unverified until approved provider configuration and test evidence exist. | DEFERRED / RUNTIME NOT VERIFIED |
| D-013 | GROW launch scope | A. OWNER / BUSINESS DECISION | Whether a capability family is launchable and client-selectable is a product decision. | GROW is an approved pillar/capability family; launch detail is unclear. | Preserve documented GROW capabilities and identify unsupported legacy marketing services. | Choose initial launch boundary, catalog availability, and acceptance criteria. | Approved catalog and service acceptance evidence. | None inherently required; legal/compliance input may follow scope. | Business requirements, SRS, use cases, service catalog, architecture, operations, release. | Owner reviews launch scope without expanding the approved vocabulary. | UNRESOLVED |
| D-014 | OPERATE boundaries | A. OWNER / BUSINESS DECISION | Coverage and support commitments define the service being sold. | OPERATE capabilities are documented; monitoring, support, and response boundaries are not final. | Preserve the capability family and inspect existing operational foundations. | Approve coverage, monitoring/support boundaries, acceptance criteria, and any commitments. | Operating model, scope templates, and release/operations evidence. | Security and operational specialist input where coverage creates risk commitments. | SRS, use cases, architecture, API, security, tests, operations, release. | Owner approves a bounded offering or explicitly defers it. | UNRESOLVED |
| D-015 | AUTOMATE provider and limits | D. EXTERNAL SPECIALIST INPUT | Model/provider, data handling, permissions, and usage limits have security, privacy, and provider implications. | Provider is not selected; human governance and bounded tools are documented. | Inspect existing provider boundaries and confirm no runtime provider is claimed. | Select provider/usage policy and authorize client-facing automation scope. | Provider/security review, tool permissions, audit design, and runtime tests. | Security, privacy, and provider input required. | SRS, architecture, API, security, test strategy, operations, release. | Keep provider-backed scope unresolved until specialist review and owner authorization. | UNRESOLVED / EXTERNAL INPUT |
| D-016 | Accountability and RACI | F. GOVERNANCE / DOCUMENTATION DECISION | The missing artifact is an accountability model, not a technical implementation decision. | Roles are documented but named owners, decision authority, and escalation are absent. | Build a role-to-decision inventory from existing documents without assigning names. | Approve named accountability, RACI, escalation, and evidence ownership. | Owner-approved RACI/equivalent governance record. | None inherently required, though specialists must be assigned where relevant. | All requirements, architecture, security, test, release, and operations artifacts. | Create an owner review agenda and populate accountability before baselining. | MISSING INFORMATION |
| D-017 | Current phase and gate | F. GOVERNANCE / DOCUMENTATION DECISION | The issue is conflicting chronology and missing supersession evidence. | Phase 15.5D records a `NO` gate; later Phase 15.6 documents implementation activity. | Compare dated/versioned reports, migration references, and status statements. | Approve the authoritative current phase wording and gate transition record. | Versioned supersession/chronology record and current evidence index. | Release governance input may be required for acceptance. | Charter, roadmap, SRS status, traceability, release, operations documentation. | Record chronology and current safe wording without rewriting historical reports. | UNRESOLVED |

## 5. Decisions That Require Business Owner

The following have a primary category of **A. OWNER / BUSINESS DECISION**:

- D-001 — Final service count and names
- D-002 — Geographic and jurisdictional scope
- D-003 — Pricing mechanics
- D-004 — Pricing authority
- D-006 — Multi-project and partial allocation
- D-010 — Entitlement lifecycle
- D-013 — GROW launch scope
- D-014 — OPERATE boundaries

These entries require explicit owner direction because repository evidence cannot
choose the business outcome without inventing requirements.

## 6. Decisions That Can Be Resolved by Repository Evidence

The repository can resolve evidence classification, but not necessarily the
underlying business decision, for:

- D-001: confirm the five names actually present and preserve the ten-versus-five conflict.
- D-002: confirm that geography is absent from the current evidence.
- D-003: confirm the documented candidate pricing modes and absence of prices.
- D-004: confirm that platform roles do not by themselves establish pricing authority.
- D-005: confirm USD as the documented primary direction.
- D-007: confirm authenticated acceptance exists as a technical direction without a legal-signature claim.
- D-009: confirm recurring execution is deferred.
- D-011: inspect local lifecycle functions, migrations, grants, and state boundaries.
- D-012: inspect provider adapter, webhook, migration, and fail-closed design.
- D-013–D-015: confirm documented capability families and current provider/operational boundaries.
- D-017: compare report chronology and identify missing supersession evidence.

Repository inspection cannot turn these findings into owner approval or runtime
proof.

## 7. Decisions Requiring Runtime Verification

The following require a reachable configured environment and approved test
identities or provider credentials:

- D-011: delivery activation gates, authorization, idempotency, stale-state,
  and audit behavior.
- D-012: live settlement, webhook signature verification, replay behavior,
  reconciliation, and provider exception handling.
- D-010: entitlement transitions and access effects after policy is approved.
- D-007: authenticated acceptance behavior and evidence capture after policy is approved.
- D-006: multi-project or partial allocation behavior if that scope is approved.

Runtime verification must not be reported as complete from migration presence,
static inspection, or a local build alone.

## 8. Decisions Requiring Legal/Accounting/Provider/Security Input

Primary category **D. EXTERNAL SPECIALIST INPUT** applies to:

- D-005 — Currency/accounting treatment
- D-007 — Agreement and acceptance policy
- D-008 — Refund/credit/cancellation/dispute behavior
- D-012 — Payment settlement behavior
- D-015 — AUTOMATE provider and limits

Specialist input is also relevant to D-002, D-003, D-004, D-006, D-009, D-010,
and D-011 where the selected business policy creates financial, privacy,
security, contractual, or provider consequences. This does not transfer the
owner's business decision to a specialist.

## 9. Decisions That Should Remain Deferred

The repository explicitly supports deferral for:

- D-009 — recurring billing execution
- D-012 — live provider settlement behavior until provider configuration and
  test evidence exist

Other decisions may be deferred only through an explicit owner decision and
scope statement. Deferral must not be treated as approval or implementation.

## 10. Downstream SDLC Impact

| Decision area | Potentially affected artifacts |
|---|---|
| Service catalog and launch scope | SRS, business requirements, use cases, domain model, architecture, API specification, traceability matrix, release and operations documentation |
| Geography and jurisdiction | Business requirements, SRS, security model, architecture, API, test strategy, operations, release |
| Pricing, authority, currency, and accounting | SRS, ERD, domain model, API, authorization/security model, payment tests, traceability, release, operations |
| Acceptance and legal evidence | SRS, use cases, API, security, audit design, test strategy, release, operations |
| Refunds, disputes, chargebacks, and recurring billing | SRS, business requirements, ERD, domain model, API, provider/security model, tests, release, operations |
| Entitlement and delivery activation | SRS, use cases, ERD, domain model, architecture, API, security model, test strategy, release, operations |
| Provider and AI limits | SRS, architecture, API, security, privacy, test strategy, operations, release |
| Accountability and current phase | Charter, document register, change log, traceability matrix, release documentation, operations documentation |

No downstream artifact is updated by this matrix.

## 11. Recommended Decision Sequence

The sequence below prioritizes decisions with the broadest downstream impact.
It is a recommended review order, not an imposed deadline or decision.

1. **D-016 — Accountability and RACI**  
   Establish who can make and evidence subsequent decisions.
2. **D-017 — Current phase and gate**  
   Establish a safe status vocabulary and chronology for all later records.
3. **D-001 — Final service count and names**  
   Baseline the product/service vocabulary before requirements and traceability.
4. **D-002 — Geographic and jurisdictional scope**  
   Establish market, compliance, and operating boundaries.
5. **D-003, D-004, and D-005 — Pricing, authority, currency/accounting**  
   Resolve the commercial foundation with accounting input where required.
6. **D-007 and D-008 — Acceptance and financial exception policies**  
   Obtain legal, privacy, accounting, and provider input before lifecycle claims.
7. **D-006 and D-010 — Allocation and entitlement lifecycle**  
   Define scope lineage and access consequences.
8. **D-011 and D-012 — Delivery activation and settlement evidence**  
   Finalize policy boundaries, then perform runtime/provider verification.
9. **D-013, D-014, and D-015 — GROW, OPERATE, and AUTOMATE boundaries**  
   Confirm launchable service scope and operational/provider constraints.
10. **D-009 — Recurring billing execution**  
    Keep deferred unless the owner explicitly expands release scope.

The sequence does not decide any entry or guarantee that later items depend
technically on earlier ones; it identifies governance leverage and dependency.

## 12. Charter v1.0 Readiness Impact

Charter v1.0 cannot be baselined until:

- Each decision has an owner, status, and evidence path.
- Owner/business decisions are explicitly approved or explicitly deferred.
- Specialist-dependent decisions have appropriate legal, accounting, provider,
  privacy, or security input.
- Runtime-required claims have current evidence or an explicit release-scope
  limitation.
- The service catalog, geography, accountability model, current phase, and
  commercial boundaries are not silently ambiguous.
- The document register, change log, and traceability matrix are updated.

The current effect is:

> **Charter readiness: PARTIALLY COMPLETE; owner decisions, specialist input,
> governance records, and runtime evidence remain required.**

## 13. Final Status

OWNER DECISION MATRIX STATUS:
DRAFT — PENDING OWNER REVIEW

# BlockWaveLab V2 — Phase 15.4B Final Commercial Decision Register

## 1. Purpose

This register is the final Phase 15.4B planning and decision-register step before any commercial implementation. It audits all 32 Phase 15.4 blockers and records what is locked, what is strongly implied but not approved, what requires an owner decision, and what requires legal, accounting, or provider input.

This document does not implement proposals, agreements, pricing, payments, subscriptions, entitlements, service delivery, migrations, RPCs, RLS, UI, providers, or Phase 15.5 work. A recommendation marked `RECOMMENDATION — NOT APPROVED` is not a BlockWaveLab decision.

## 2. Authoritative Sources

Reviewed repository sources:

- `docs/BLOCKWAVELAB_V2_PHASE_15_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_PLAN.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md`
- `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md`
- `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md`
- `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md`
- `docs/BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md`
- `docs/BLOCKWAVELAB_V2_CLIENT_JOURNEY.md`
- `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md`
- `docs/BLOCKWAVELAB_V2_PHASE_11_GAP_RESOLUTION.md`
- `docs/PHASE_15_1_IMPLEMENTATION.md`
- `docs/PHASE_15_2_IMPLEMENTATION.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_2_SERVICE_CATALOG.md`
- `docs/PHASE_15_3_IMPLEMENTATION.md`
- Current Phase 13/14 implementation and authorization documents.
- Current Supabase migration architecture through `202609140010`, including organizations, project roles, catalog, project services, RLS, trusted RPCs, and `audit_events`.

Referenced source availability:

- `BlockWaveLab_Final_Business_Model.docx` is not present in the workspace. Its contents are not inferred.
- `BlockWaveLab_Complete_Execution_Plan.docx` is not present in the workspace. Its contents are not inferred.
- `docs/BLOCKWAVELAB_V2_PHASE_15_COMMERCIAL_MODEL.md` is not present. Its contents are not inferred.

The latest approved business model supplied with this task is treated as authoritative for the locked rules stated in this register, without inventing contents for absent files.

## 3. Already Locked Decisions

These decisions are directly supported by the supplied approved business model and/or the implemented architecture:

- BlockWaveLab is an AI Automation + DevOps Partner for Web3 Projects.
- The target includes small projects through larger projects and organizations.
- The catalog has exactly four pillars: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- Clients may purchase one category or combine multiple categories.
- One-time/project implementation is supported.
- Ongoing service after handover is optional and separately paid.
- Observation is part of the paid implementation lifecycle and must not be described as free support, free monitoring, or “two months free.”
- The delivery lifecycle is `IMPLEMENTATION -> DEPLOYMENT -> OBSERVATION -> STABILIZATION -> DOCUMENTATION -> HANDOVER -> OPTIONAL ONGOING_SERVICE`.
- AI assists with automation and operational efficiency; it does not replace humans. Strategic, sensitive, and approval-required actions retain human governance.
- `organizations` is the current customer and tenant boundary; `projects` are delivery containers.
- Existing organization/project roles remain authoritative and must not be silently redefined as commercial authority.
- `project_services` is the requested service-selection boundary. `REQUESTED` does not mean payment, proposal approval, agreement acceptance, entitlement, delivery activation, subscription start, or managed-service start.
- Commercial state and delivery state remain separate.
- The existing append-only `audit_events` foundation is reused rather than duplicated.
- Supabase/Postgres/native capabilities are preferred; unnecessary paid SaaS, APIs, and infrastructure are avoided.
- Future pricing must account for scope/complexity and operating cost sufficiently to preserve BlockWaveLab margin.
- Prices, taxes, legal terms, payment-provider rules, e-signature requirements, and commercial role authority must not be invented.

## 4. Derived / Strongly Implied Decisions

These are safe architectural constraints, but are not final owner approvals for commercial behavior:

- Pricing must be tied to project scope and complexity rather than being inferred from the catalog alone. This does not choose fixed, calculated, negotiated, public, or private pricing.
- One-time implementation and optional ongoing service should be represented as separable commercial components so recurring work is not silently bundled into implementation.
- A proposal or agreement action must not automatically create payment, entitlement, subscription, service activation, observation, or delivery activation.
- Any future payment confirmation must be server-authoritative and provider-verified; browser state cannot mark payment complete.
- Any future commercial approval must use an explicitly approved action policy. Existing role membership alone is insufficient evidence of acceptance authority.
- Historical proposal/agreement versions must retain snapshots and remain understandable after catalog content changes.
- Commercial transitions should be explicit, idempotent, concurrency-checked, and audited through the existing audit foundation.

These implications must not be converted into prices, role grants, legal claims, or irreversible state transitions without owner approval.

## 5. Unresolved Decisions Requiring Owner Approval

Classification uses exactly the following categories: `A. ALREADY DECIDED`, `B. DERIVED / STRONGLY IMPLIED`, `C. UNRESOLVED — REQUIRES OWNER DECISION`, and `D. LEGAL / ACCOUNTING / PROVIDER DEPENDENCY`.

| ID | Decision | Why It Matters | Options | Recommendation (NOT APPROVED) | Cost/Risk | Owner Decision |
|---:|---|---|---|---|---|---|
| 1 | Pricing ownership / pricing authority — **C** | Pricing needs a clear accountable approver to protect margin and prevent unauthorized commitments. | (1) Owner-controlled pricing. (2) Approved internal operating policy. (3) Proposal-specific approval by an authorized existing policy path. | **RECOMMENDATION — NOT APPROVED:** Use a documented approval policy with a small number of accountable approvers and audit every change. | Unclear ownership causes inconsistent quotes, margin leakage, and unauthorized commitments; a new role would add complexity and is prohibited without approval. | Approve accountable owner and delegation limits. |
| 2 | Price representation — **C** | A proposal needs a historical commercial snapshot, but the system must not guess units, amount semantics, or rounding. | (1) Fixed line amounts. (2) Quantity/rate components. (3) Scope estimate/range before approval, then fixed snapshot. (4) Manual proposal snapshot without a pricing engine. | **RECOMMENDATION — NOT APPROVED:** Start with the smallest approved representation that preserves exact historical totals and component meaning. | A pricing engine increases build and test cost; weak snapshots create disputes and prevent reliable reconciliation. | Approve fields, units, rounding, and snapshot rules. |
| 3 | Fixed vs calculated vs negotiated pricing — **C** | Scope/complexity pricing does not select the commercial calculation mode. | (1) Fixed catalog prices. (2) Scope-calculated quote. (3) Negotiated proposal price. (4) Hybrid: calculation baseline plus approved negotiation. | **RECOMMENDATION — NOT APPROVED:** Use a scope-based proposal model with an approved calculation/negotiation policy, if the owner confirms it. | Fixed pricing risks under-scoping; calculation adds policy complexity; negotiation adds approval and audit burden. | Select the permitted pricing modes and approval path. |
| 4 | Currency — **C** | Currency affects amount storage, display, tax, invoices, refunds, provider compatibility, and historical meaning. | (1) One approved currency. (2) A bounded list of currencies. (3) Currency selected per organization/proposal. (4) Multi-currency only after accounting approval. | **RECOMMENDATION — NOT APPROVED:** Begin with one approved currency if business/accounting confirms that it covers the target market. | Multi-currency increases accounting, exchange-rate, refund, reporting, and provider complexity. | Approve supported currencies and minor-unit/exchange rules. |
| 5 | Tax — **D** | Tax treatment depends on jurisdiction, registration, customer location, exemptions, invoicing, and accounting evidence. | External/legal/accounting options include tax-inclusive, tax-exclusive, or separately calculated tax; provider calculation may or may not be required. | **RECOMMENDATION — NOT APPROVED:** Obtain accounting/legal treatment first, then encode only the required policy. | Incorrect tax treatment creates compliance, correction, reporting, and customer-liability risk; provider use adds recurring cost. | Accounting/legal owner must decide jurisdiction, treatment, evidence, and provider need. |
| 6 | Discount model — **C** | Discounts change margin, totals, tax basis, approval authority, and historical proposal meaning. | (1) No discounts. (2) Fixed approved discount bands. (3) Case-by-case authorized discount. (4) Time-limited promotion. | **RECOMMENDATION — NOT APPROVED:** Default to no discount behavior until authority and margin controls are approved. | Discount stacking and unauthorized concessions create margin loss and reconciliation disputes. | Approve availability, authority, limits, stacking, and expiry. |
| 7 | Payment terms — **C** | Terms determine cash flow, implementation risk, invoice obligations, late-payment handling, and delivery gates. | (1) Full upfront. (2) Deposit plus milestones. (3) Implementation payment plus separate recurring billing. (4) Custom approved terms per proposal. | **RECOMMENDATION — NOT APPROVED:** Keep one-time implementation and recurring service terms separate, with only approved exceptions. | Milestones increase operational and reconciliation work; upfront payment reduces exposure but may affect sales; custom terms increase review burden. | Approve due dates, schedules, exceptions, and late-payment treatment. |
| 8 | Payment-before-acceptance vs payment-after-acceptance — **C** | Sequence changes whether acceptance creates an obligation before funds are settled and controls when work may begin. | (1) Accept then pay. (2) Pay then accept/activate. (3) Accept, then deposit/payment gate. (4) Vary by offering or engagement type. | **RECOMMENDATION — NOT APPROVED:** Use explicit per-engagement gates rather than one implicit sequence. | Multiple sequences increase state complexity and support burden; premature work creates credit and margin exposure. | Approve sequence and any exceptions. |
| 9 | Deposits / milestones / invoicing — **C** | These determine cash timing, partial completion, invoice records, and what happens when work pauses or changes. | (1) No deposits or milestones. (2) Deposit plus milestone invoices. (3) Single implementation invoice. (4) Separate implementation and recurring invoices. | **RECOMMENDATION — NOT APPROVED:** Use the simplest schedule that matches scope risk and preserves separability of ongoing service. | Milestones require more state, reconciliation, and audit; a single invoice can increase exposure on complex work. | Approve supported schedules and invoice obligations. |
| 10 | Refunds / credits / chargebacks — **D** | These affect accounting, customer remedies, provider capabilities, entitlement revocation, and historical audit. | External/legal/accounting/provider decisions may allow full/partial refunds, service credits, no automatic credits, or provider-mediated chargebacks. | **RECOMMENDATION — NOT APPROVED:** Define policy with accounting/legal and provider input before modeling outcomes. | Refund/credit ledgers and chargeback reconciliation add operational burden; unclear policy creates financial and entitlement disputes. | Accounting/legal/provider owners must define treatment and authority. |
| 11 | Whether proposal acceptance is binding — **C** | This determines whether an acceptance action creates a commercial/legal commitment or only records client intent. | (1) Non-binding review approval. (2) Binding proposal acceptance. (3) Binding only when agreement is accepted. (4) Binding only for specified engagement types. | **RECOMMENDATION — NOT APPROVED:** Treat proposal acceptance as non-binding until binding effect is expressly approved. | Mislabeling intent as commitment creates legal and operational exposure; non-binding flow may require a later agreement step. | Approve binding effect and affected engagement types. |
| 12 | Whether an agreement is mandatory — **C** | The requirement changes the workflow, terms source, acceptance evidence, and legal/commercial boundary. | (1) Every engagement. (2) Only specified engagement types or risk levels. (3) Only custom/recurring/enterprise engagements. (4) Agreement optional where approved proposal is sufficient. | **RECOMMENDATION — NOT APPROVED:** Require an agreement only after the owner identifies the commitments that need one, rather than assuming universal or zero use. | Universal agreements add review and acceptance overhead; optional agreements can create inconsistent obligations and legal ambiguity. | Approve applicability and exceptions. |
| 13 | Who can issue proposals — **C** | Issuance exposes a client-facing commercial version and may create internal accountability. | (1) Authorized internal operator policy. (2) Owner/admin under a commercial action policy. (3) Separate approved workflow using existing platform policy. | **RECOMMENDATION — NOT APPROVED:** Require an explicit issuance action policy and audit trail; do not infer it from project access. | Overbroad issuance risks unauthorized promises; narrow authority adds operational bottlenecks. | Approve actor scope and approval/audit requirements. |
| 14 | Who can approve proposals — **C** | Internal approval is distinct from issuance and client acceptance and should protect scope, price, and margin. | (1) One accountable internal approver. (2) Owner/admin policy with thresholds. (3) Approval based on engagement risk or amount after those concepts are approved. | **RECOMMENDATION — NOT APPROVED:** Use explicit action policy and thresholds only after price/authority decisions exist. | Approval chains increase cycle time; weak approval allows margin and scope errors. | Approve approver scope, thresholds, and delegation. |
| 15 | Who can accept proposals — **C** | Acceptance authority determines who may commit the organization and what evidence is needed. | (1) Explicitly authorized organization representative. (2) Authorized representative plus agreement acceptance. (3) Acceptance only through a separately verified legal process. | **RECOMMENDATION — NOT APPROVED:** Default deny until authority and evidence are formally approved. | Overbroad acceptance creates legal exposure; restrictive workflows increase sales friction and support work. | Approve accepting actor and evidence policy. |
| 16 | Whether OWNER may accept — **C** | Ownership is an organization role, not automatic proof of legal authority for every commercial commitment. | (1) Yes, subject to explicit policy. (2) Only for defined commitment types/limits. (3) No, require a separately designated representative. | **RECOMMENDATION — NOT APPROVED:** Do not grant by role name; decide based on organizational authority evidence. | Granting too broadly risks unauthorized commitments; requiring evidence adds operational and legal verification work. | Explicitly approve or deny OWNER authority. |
| 17 | Whether ADMIN may accept — **C** | ADMIN has administrative access but current architecture does not grant commercial acceptance authority. | (1) No. (2) Yes under explicit delegation and limits. (3) Only issue/review, not accept. | **RECOMMENDATION — NOT APPROVED:** Keep ADMIN non-accepting unless explicit delegation is approved. | Broad ADMIN authority expands risk and audit scope; narrow authority may require an operator workflow. | Explicitly approve or deny ADMIN authority. |
| 18 | Whether MEMBER may accept — **A** | MEMBER must not approve commercial commitments by default and must not gain authority from ordinary membership. | Locked rule: no commercial acceptance authority from MEMBER status. Any future change requires explicit owner decision and role-policy change. | **RECOMMENDATION — NOT APPROVED:** Preserve no authority. | Prevents accidental commitments and preserves least privilege; exceptions would require policy and test expansion. | Record confirmation; no change approved. |
| 19 | Whether PROJECT_MANAGER may accept — **A** | PROJECT_MANAGER is a delivery role and does not automatically approve commercial commitments. | Locked rule: project management access does not equal commercial acceptance authority. | **RECOMMENDATION — NOT APPROVED:** Preserve no authority unless separately approved. | Prevents delivery authority from becoming financial/legal authority; separate workflows add clarity. | Record confirmation; no change approved. |
| 20 | Acceptance method — **C** | Method controls user experience, evidence, replay handling, identity assurance, and possible legal effect. | (1) Authenticated explicit action. (2) Checkbox plus terms/version and timestamp. (3) Typed-name acknowledgement. (4) External signed document or e-signature. | **RECOMMENDATION — NOT APPROVED:** Use the least complex method that legal review confirms is sufficient; do not claim enforceability beforehand. | External signature adds provider and transaction cost; weak evidence increases dispute risk; richer capture increases privacy and retention burden. | Approve method and workflow semantics. |
| 21 | Legal/e-signature requirements — **D** | Legal requirements determine whether in-platform acceptance is sufficient and whether identity/signature providers are mandatory. | Legal options may range from authenticated acceptance to a reviewed e-signature or external signed agreement. | **RECOMMENDATION — NOT APPROVED:** Obtain legal determination before selecting a provider or asserting signature validity. | Provider integration adds cost, dependency, retention, and failure modes; insufficient evidence creates legal risk. | Legal owner decides required standard and provider need. |
| 22 | Required acceptance evidence — **D** | Evidence must prove what was accepted, by whom, when, and under which terms without collecting unjustified personal data. | Capture may include actor, timestamp, terms version/checksum, consent text, authentication context, IP/device data, or signed artifact, subject to legal/privacy review. | **RECOMMENDATION — NOT APPROVED:** Capture only the minimum evidence legal/privacy owners approve. | More evidence increases storage, privacy, retention, and access-control burden; too little evidence increases dispute risk. | Legal/privacy owner approves evidence and retention. |
| 23 | Repeat purchase semantics — **C** | The current project/offering uniqueness and historical snapshots do not define repeat, renewal, upgrade, or phased purchases. | (1) New project-service instance. (2) Versioned change/add-on. (3) Quantity/period on one item. (4) Disallow repeat purchase until an approved change flow exists. | **RECOMMENDATION — NOT APPROVED:** Use an explicit new commercial instance for materially separate work if the owner approves it. | New instances preserve history but increase rows and workflow complexity; implicit reuse risks overwriting scope. | Approve repeat, renewal, upgrade, and phase semantics. |
| 24 | Partial purchase semantics — **C** | Partial acceptance or settlement changes entitlement, scope, delivery, and refund behavior. | (1) Full proposal only. (2) Line-level acceptance. (3) Partial scope with a new proposal version. (4) Partial payment without activation. | **RECOMMENDATION — NOT APPROVED:** Prefer new versioned scope for partial changes rather than mutating an issued proposal. | Line-level state multiplies testing and reconciliation; full-package rules may reduce flexibility but simplify controls. | Approve whether and how partial purchase is supported. |
| 25 | Custom proposal item semantics — **C** | Custom work must remain historically clear, authorized, priced, and connected to delivery without inventing an unbounded product category. | (1) No custom items. (2) Structured custom scope tied to a project. (3) Approved custom/enterprise item with snapshots and review. (4) Custom work represented as a new approved offering. | **RECOMMENDATION — NOT APPROVED:** Use structured, reviewed custom scope only if owner approval defines required fields and boundaries. | Free-form items increase abuse and ambiguity; structured custom work increases review effort but protects scope and margin. | Approve custom-item availability and structure. |
| 26 | Whether one proposal may cover multiple projects — **C** | Multi-project proposals affect tenant/project authorization, item ownership, acceptance scope, invoicing, and delivery activation. | (1) One project only. (2) Multiple projects in one organization. (3) Organization-level proposal with project items. (4) Separate proposal per project. | **RECOMMENDATION — NOT APPROVED:** Start one proposal per project unless the owner explicitly approves a multi-project aggregate. | Aggregation reduces duplication but complicates RLS, partial acceptance, changes, and reporting. | Approve scope and cross-project rules. |
| 27 | Whether one agreement may cover multiple projects — **C** | Agreement scope affects legal terms, authorization, amendments, cancellation, and entitlement across projects. | (1) One project only. (2) Multiple projects in one organization. (3) Organization-wide agreement with project schedules. (4) Separate agreement per commitment. | **RECOMMENDATION — NOT APPROVED:** Keep agreements project-scoped until legal and domain owners approve aggregation. | Organization-wide agreements reduce documents but amplify legal, authorization, and cancellation complexity. | Approve agreement aggregation rules. |
| 28 | Commercial state machines — **C** | State transitions control history, acceptance, expiry, payment, cancellation, and delivery gates. Existing documents contain candidate but non-final states. | (1) Minimal proposal/agreement states. (2) Detailed states for review/view/approval/expiry. (3) Separate aggregate-specific state machines. (4) Policy-versioned transitions. | **RECOMMENDATION — NOT APPROVED:** Use separate minimal state machines per aggregate with explicit, audited transitions. | More states increase implementation/test cost; too few states hide business facts and create unsafe shortcuts. | Approve final states, transitions, reversibility, and terminal behavior. |
| 29 | Commercial -> payment gate — **B** | Payment must be server-authoritative, but exact sequencing, exceptions, and provider behavior are unresolved. | Payment may be before acceptance, after acceptance, milestone-based, or separately scheduled. | **RECOMMENDATION — NOT APPROVED:** Require an explicit server-authoritative payment gate before any payment-dependent activation. | Provider/reconciliation complexity and failed-payment handling add operational cost; premature activation creates loss exposure. | Approve gate and exceptions. |
| 30 | Commercial -> entitlement gate — **B** | Acceptance must not automatically grant service access; entitlement prerequisites remain undefined. | Entitlement may require agreement, payment, approved exception, recurring commitment, or a combination. | **RECOMMENDATION — NOT APPROVED:** Keep entitlement as an explicit server-side transition after approved prerequisites. | Entitlement logic adds policy and audit cost; automatic grants risk unauthorized service consumption. | Approve prerequisite policy and revocation behavior. |
| 31 | Commercial -> service activation gate — **B** | `REQUESTED` must not become `ACTIVE` from proposal/agreement acceptance alone. | Activation may require approved agreement, payment/exception, onboarding completion, staffing/readiness, or a combination. | **RECOMMENDATION — NOT APPROVED:** Require a separately authorized, idempotent, audited activation transition. | Explicit gates add workflow work but prevent unpaid or unready delivery. | Approve prerequisites and activation authority. |
| 32 | Commercial -> observation/delivery activation gate — **B** | Commercial acceptance and delivery stages must remain separate; observation is paid implementation, not free support. | Delivery may begin after approved commercial gates, after payment, after readiness evidence, or by separately approved exception. | **RECOMMENDATION — NOT APPROVED:** Keep delivery/observation activation as a distinct transition with explicit readiness and commercial prerequisites. | Readiness checks add operational coordination; automatic start risks scope, staffing, and margin failures. | Approve entry gates and exception policy. |

### Classification summary

- **A. ALREADY DECIDED:** 2
- **B. DERIVED / STRONGLY IMPLIED:** 5
- **C. UNRESOLVED — REQUIRES OWNER DECISION:** 21
- **D. LEGAL / ACCOUNTING / PROVIDER DEPENDENCY:** 4
- **Total:** 32

## 6. Legal / Accounting / Provider Dependencies

The following cannot be resolved by technical design alone:

- Tax jurisdiction, registration, inclusive/exclusive treatment, exemptions, filing evidence, and whether a tax/accounting provider is needed.
- Refund, credit, chargeback, invoice correction, and financial-record treatment.
- Whether proposal or agreement acceptance is legally binding and what terms are authoritative.
- Whether ordinary authenticated acceptance, clickwrap, typed acknowledgement, uploaded signature, or an e-signature/external agreement is sufficient.
- Required identity assurance, consent language, IP/device capture, retention, privacy basis, and evidence access controls.
- Payment provider, webhook verification, reconciliation, payout, refund, and dispute capabilities, if a provider is later required.
- E-signature or contract provider selection, if legal review requires one.
- Accounting records, financial retention, reporting, and organization/legal-entity requirements.

Architecture can prepare provider-neutral boundaries, immutable snapshots, terms checksums, server-side authorization, idempotency, audit references, and RLS. It must not choose providers, legal effect, tax behavior, evidence retention, or financial policy in place of the responsible owner.

## 7. Commercial State Boundaries

These states are conceptual boundaries only. They are not approved final enums or implementation authorization.

### Catalog state

Catalog pillars, services, and offerings have active/inactive and effective-date behavior. Catalog billing mode is descriptive metadata and does not create recurring billing or payment.

### Selection/request state

`project_services` records a requested project/offering selection. Current state is `REQUESTED` at selection. It is not a proposal, payment, agreement, entitlement, subscription, or delivery activation.

### Proposal state

A proposal is a negotiation container with versioned client-facing snapshots. Candidate states include draft, review, sent/viewed, changes requested, accepted/approved, rejected, expired, and cancelled. Final state names and transitions remain owner decisions.

### Agreement state

An agreement is a distinct commercial/legal commitment aggregate if the owner decides it is required. Candidate states include draft, pending acceptance, active, suspended, terminated, and expired. Legal effect and final states remain unresolved.

### Payment state

Payment is a separate settlement domain. Candidate states include pending, processing, paid, failed, refunded, partially refunded, and cancelled. No payment provider, terms, tax, invoice, or state machine is approved.

### Entitlement state

Entitlement is a server-authoritative capability/time-window decision, not a consequence of catalog selection or acceptance alone. Candidate states include pending, active, suspended, revoked, and expired. Prerequisites and revocation policy remain unresolved.

### Delivery state

Delivery follows the approved lifecycle: implementation, deployment, paid observation, stabilization, documentation, handover, and optional ongoing service. Delivery stage is separate from commercial state and must not be activated automatically by proposal or agreement acceptance.

## 8. Intended Commercial-to-Delivery Flow

The conceptual flow is:

```text
CATALOG
  -> SERVICE_SELECTION / REQUESTED project_service
  -> PROPOSAL VERSION
  -> PROPOSAL ACCEPTANCE or REVIEW OUTCOME
  -> AGREEMENT, if owner/legal policy requires it
  -> PAYMENT, according to approved payment policy
  -> ENTITLEMENT, after approved prerequisites
  -> DELIVERY ACTIVATION, after explicit commercial and readiness gates
  -> IMPLEMENTATION
  -> DEPLOYMENT
  -> PAID OBSERVATION
  -> STABILIZATION
  -> DOCUMENTATION
  -> HANDOVER
  -> OPTIONAL SEPARATELY PURCHASED ONGOING_SERVICE
```

This is intentionally conceptual. The exact ordering between proposal acceptance, agreement, and payment remains unresolved. No step implies automatic creation of the next step. Commercial state and delivery state remain separate, and acceptance must not automatically activate service, observation, entitlement, subscription, or delivery.

## 9. Cost-Control Rules

- Prefer the existing Supabase/Postgres, Auth, RLS, trusted-function, and audit foundations.
- Do not add a payment, tax, accounting, e-signature, email, AI, monitoring, or other provider until an approved requirement justifies its cost and operational burden.
- Keep one-time implementation and optional ongoing service commercially separable so recurring operating costs are not hidden inside implementation.
- Treat observation as paid implementation scope; do not offer or model it as free support.
- Avoid a pricing engine, multi-currency, discount engine, milestone engine, or multi-project aggregate until the owner approves the business need.
- Preserve immutable snapshots and audit history so catalog changes do not cause rework, disputes, or historical data repair.
- Use explicit, idempotent, server-authoritative transitions to reduce fraud, duplicate activation, and reconciliation cost.
- Apply data minimization to acceptance evidence; unnecessary evidence increases storage, privacy, backup, and review obligations.
- Bound proposal/custom content and paginate future reads to control abuse and infrastructure load.
- Include provider fees, tax/accounting work, delivery labor, observation work, ongoing operational labor, and support burden in whatever future pricing policy the owner approves. No numerical margin or cost is invented here.

## 10. Minimum Decisions Required Before Commercial Implementation

The smallest safe approval package is:

1. Pricing authority and model: representation, scope/complexity treatment, fixed/calculated/negotiated modes, public versus proposal-based pricing, recurring monthly/annual options, mixed one-time/recurring handling, currency, tax responsibility, and discount authority.
2. Payment policy: terms, acceptance/payment sequence, deposits, milestones, invoices, refunds, credits, chargebacks, cancellation, and exceptions.
3. Legal commitment policy: proposal binding effect, agreement requirement, authoritative terms, amendment/termination/expiry rules, and whether acceptance is separate from agreement acceptance.
4. Acceptance policy: who may issue, approve, send, and accept; explicit treatment of OWNER, ADMIN, MEMBER, PROJECT_MANAGER, CONTRIBUTOR, and VIEWER; method; evidence; identity assurance; and e-signature/provider requirement.
5. Purchase/domain policy: full versus partial purchases, multiple services, repeat/renewal/upgrade behavior, custom scope, custom projects, and proposal/agreement multi-project scope.
6. Final state and gate policy: proposal/agreement/payment/entitlement states, commercial-to-payment gate, entitlement gate, service activation gate, and delivery/observation gate.
7. External sign-off: accounting/tax, legal/e-signature, and provider decisions where applicable.

No proposal, agreement, payment, entitlement, or service-delivery implementation should begin until this minimum package is approved and recorded.

## 11. Decisions That Must NOT Be Invented

Do not invent:

- prices, currency, taxes, discounts, payment terms, deposits, milestones, refunds, credits, chargebacks, or margin percentages
- public pricing, monthly/annual rates, fixed prices, calculated prices, negotiated prices, or mixed pricing policy
- binding effect, agreement language, signature validity, e-signature method, identity assurance, or evidence retention
- payment provider, tax provider, accounting provider, e-signature provider, email/SMS provider, AI provider, or monitoring provider
- commercial authority for OWNER, ADMIN, MEMBER, PROJECT_MANAGER, CONTRIBUTOR, or VIEWER
- a new commercial, billing, customer, or internal staff role
- repeat, partial, custom, multi-service, or multi-project semantics
- final commercial status names, transition reversibility, or payment/entitlement/activation exceptions
- automatic payment, entitlement, subscription, observation, delivery, or ongoing-service activation from acceptance
- a fifth pillar, new service category, mandatory subscription, free observation period, or human-replacement AI claim

## 12. Phase 15.4B Readiness

BLOCKED — OWNER DECISIONS REQUIRED

The approved model locks the business direction and architecture boundaries, but 21 decisions still require owner approval and 4 require legal, accounting, or provider determination. The remaining register is intentionally not converted into implementation behavior.

## Scope Confirmation

- ONLY this document was created: `docs/BLOCKWAVELAB_V2_PHASE_15_4B_DECISION_REGISTER.md`
- NO application code changed
- NO database schema changed
- NO migration created or modified
- NO RPC/function created or modified
- NO RLS changed
- NO deployment occurred
- NO test users or credentials created
- NO secrets added
- NO Phase 15.5 work started

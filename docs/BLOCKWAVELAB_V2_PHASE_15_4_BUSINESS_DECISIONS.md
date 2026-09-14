# BlockWaveLab V2 Phase 15.4 Business Decision Resolution

## 1. Purpose

This document resolves the previously identified Phase 15.4 commercial blockers using only authoritative BlockWaveLab business decisions and the existing repository architecture. It distinguishes decisions that are already locked, decisions strongly constrained but not final, and decisions that genuinely remain unresolved.

This is a read-only business decision resolution and audit artifact. It does not authorize migrations, RPCs, application code, UI, deployment, payment integration, legal integration, test users, or Phase 15.5 work.

A technical recommendation is not treated as an approved business decision. Where sources conflict, the conflict is recorded and the item remains unresolved.

## 2. Authoritative Sources Reviewed

Repository sources reviewed:

- `docs/BLOCKWAVELAB_V2_PHASE_15_PLAN.md`: commercial boundary, catalog, proposal, agreement, payment, entitlement, delivery, and unresolved-decision sections.
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_PLAN.md`: current Phase 15.4 proposal/agreement audit, blocker list, authorization implications, immutability, RLS, and downstream activation constraints.
- `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md`: proposed client journey, roles, proposal/commercial architecture, lifecycle, cost/provider boundaries, and deferred decisions.
- `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md`: organization/project role model, authorization algorithm, tenant isolation, and sensitive-action policy.
- `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md`: canonical organization, project, catalog, proposal, agreement, and lifecycle vocabulary.
- `docs/BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md`: proposed ownership columns, commercial aggregates, agreement/acceptance records, immutability, RLS, and audit requirements.
- `docs/BLOCKWAVELAB_V2_CLIENT_JOURNEY.md`: proposal review/approval, payment confirmation, activation gates, paid observation, and optional ongoing service.
- `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md`: proposal approval operation, authorization boundary, expected-version checks, idempotency, and audit contract.
- `docs/BLOCKWAVELAB_V2_PHASE_11_GAP_RESOLUTION.md`: deny-by-default authorization, role ceilings, RLS strategy, policy versioning, and unresolved product/legal decisions.
- `docs/PHASE_15_1_IMPLEMENTATION.md`: implemented catalog foundation and explicit commercial deferrals.
- `docs/PHASE_15_2_IMPLEMENTATION.md`: deployed unpriced catalog offerings and explicit pricing/payment deferrals.
- `docs/PHASE_15_2_SERVICE_CATALOG.md`: approved catalog content planning and cost/provider guardrails.
- `docs/PHASE_15_3_IMPLEMENTATION.md`: requested project-service selection boundary and explicit non-activation behavior.
- Current Supabase migration architecture through `supabase/migrations/202609140010_project_service_selection_hardening.sql`: organizations, roles, projects, project roles, catalog, project services, RLS, trusted RPCs, and `audit_events`.

Requested source availability notes:

- `docs/BLOCKWAVELAB_V2_PHASE_15_COMMERCIAL_MODEL.md` is not present in the repository. No decision is inferred from its absence.
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md` did not exist before this document was created.
- The repository contains `docs/PHASE_15_2_IMPLEMENTATION.md` and `docs/PHASE_15_2_SERVICE_CATALOG.md`; those names are used here rather than treating similarly named missing files as authoritative.
- The authoritative business model supplied with this audit request was reviewed as the governing business source, but is not represented as a repository file.

## 3. Decision Matrix

Classifications are exclusive:

- **ALREADY DECIDED**: directly supported by the approved business model or implemented architecture.
- **DERIVED / STRONGLY IMPLIED**: constrained by approved decisions, but not final enough to become implementation behavior without explicit approval.
- **UNRESOLVED BUSINESS DECISION**: no authoritative final decision exists.
- **LEGAL / ACCOUNTING / PROVIDER DEPENDENCY**: requires a professional, accounting, legal, or provider decision and must not be invented technically.

| # | Decision | Classification | Current Decision | Source/Basis | Implementation Impact |
|---:|---|---|---|---|---|
| 1 | Pricing ownership / pricing authority | UNRESOLVED BUSINESS DECISION | Pricing must protect margin, but no person, team, role, or approval authority owns pricing decisions. | Approved model requires scope/complexity pricing and loss protection; Phase 15.2 defers pricing. | Do not expose pricing mutation or approval behavior. |
| 2 | Price representation | UNRESOLVED BUSINESS DECISION | No approved representation for fixed amount, rate, unit amount, estimate, range, or component totals exists. | Phase 15.2 explicitly adds no price fields; database blueprint is conceptual only. | Do not choose amount fields, units, rounding, or zero/null semantics. |
| 3 | Fixed vs calculated vs negotiated pricing | DERIVED / STRONGLY IMPLIED | Scope/complexity-based pricing and margin protection constrain pricing toward scoped and potentially negotiated calculation, but do not select fixed, calculated, negotiated, or a combination. | Approved model says pricing is based on project scope/complexity; Phase 15 plan describes quote calculation as a recommendation. | Treat the pricing mode as pending approval; do not implement a pricing engine or assume negotiation rules. |
| 4 | Currency | UNRESOLVED BUSINESS DECISION | No supported currency, multi-currency policy, minor-unit convention, or exchange-rate policy is approved. | Phase 15.2 explicitly defers currency. | Do not create currency defaults or totals. |
| 5 | Tax | LEGAL / ACCOUNTING / PROVIDER DEPENDENCY | Tax jurisdiction, registration, inclusivity, exemptions, calculation responsibility, and evidence are undecided. | Phase 15 plan and Phase 15.2 defer tax; correct treatment depends on legal/accounting requirements. | Do not implement tax fields, calculations, or a tax provider boundary. |
| 6 | Discount model | UNRESOLVED BUSINESS DECISION | No discount authority, type, stacking, expiry, or approval limit is approved. | Phase 15.2 explicitly defers discounts. | Do not implement discount inputs or totals. |
| 7 | Payment terms | UNRESOLVED BUSINESS DECISION | No due-date, payment schedule, late-payment, invoice, or payment-before-work policy is approved. | Phase 15 plan lists payment terms as unresolved; client journey only describes a future payment gate. | Do not create payment-term behavior or invoice obligations. |
| 8 | Payment-before-acceptance vs payment-after-acceptance | UNRESOLVED BUSINESS DECISION | The sequence is not decided. Proposal acceptance may not be assumed to require or waive payment. | Phase 15.4 plan explicitly leaves this open; client journey places approval and payment in sequence but does not establish legal policy. | Keep acceptance/payment sequencing blocked and independently modeled. |
| 9 | Deposits / milestones / invoicing | UNRESOLVED BUSINESS DECISION | No deposit, milestone billing, invoice, or settlement schedule is approved. | Phase 15 planning proposes future payment entities only; no payment tables exist. | Do not create billing schedules or invoice workflows. |
| 10 | Refunds / credits / chargebacks | LEGAL / ACCOUNTING / PROVIDER DEPENDENCY | Outcomes, authority, accounting treatment, and provider capabilities are not decided. | Phase 15 planning describes conceptual future records; refund and credit policy remains deferred. | Do not implement settlement correction or entitlement-revocation rules. |
| 11 | Whether proposal acceptance is binding | UNRESOLVED BUSINESS DECISION | No authoritative source establishes whether proposal acceptance itself creates a binding commitment. | Client journey says approval; Phase 15 recommends agreement as a separate boundary and explicitly leaves binding effect open. | Do not label proposal acceptance legally binding or activate obligations from it. |
| 12 | Whether an agreement is mandatory | UNRESOLVED BUSINESS DECISION | It is not decided whether every accepted proposal requires an agreement or whether some commitments may use another approved artifact. | Phase 15.4 plan explicitly asks this question; Phase 11 review says the minimum legal/commercial record is unresolved. | Do not force or omit agreement creation in a workflow. |
| 13 | Who can issue proposals | UNRESOLVED BUSINESS DECISION | No commercial issuance authority is approved for existing organization or project roles, and no internal staff role may be invented. | API blueprint names an authorized approval operation; authorization model describes future platform paths; neither defines Phase 15.4 issuance authority. | Keep proposal issuance permission and actor policy blocked. |
| 14 | Who can approve proposals | UNRESOLVED BUSINESS DECISION | No approved client or internal approval authority is defined. | Existing role documents define organization/project access, not a commercial approval grant; Phase 15.4 preserves this separation. | Do not map approval to OWNER, ADMIN, or PROJECT_MANAGER by assumption. |
| 15 | Who can accept proposals | UNRESOLVED BUSINESS DECISION | Acceptance authority is not decided and must be distinct from ordinary project access. | Phase 15.4 explicitly states acceptance authority is unresolved. | Default deny commercial acceptance until an approved action policy exists. |
| 16 | Whether OWNER may accept | UNRESOLVED BUSINESS DECISION | OWNER is the organization ownership role, but ownership alone is not evidence of legal authority to accept commercial commitments. | Authorization model gives OWNER broad organization control, while business rules prohibit silently treating role ownership as legal acceptance authority. | Do not grant acceptance to OWNER without explicit authority and evidence policy. |
| 17 | Whether ADMIN may accept | UNRESOLVED BUSINESS DECISION | ADMIN may administer organization/project foundations, but no commercial acceptance authority is granted. | Implemented Phase 13 role contract limits ADMIN; Phase 15.4 explicitly says ADMIN must not automatically approve commitments. | Do not grant acceptance to ADMIN by role inheritance. |
| 18 | Whether MEMBER may accept | ALREADY DECIDED | MEMBER must not be assumed or treated as able to approve commercial commitments. | Explicit business rule; current architecture limits MEMBER to assigned project work and organization-visible data. | Keep MEMBER unable to accept unless a separately approved role policy changes this. |
| 19 | Whether PROJECT_MANAGER may accept | ALREADY DECIDED | PROJECT_MANAGER is a delivery/project role, not an automatically commercial approval role. | Existing project-role model and Phase 15.4 authorization analysis separate project management from commercial authority. | Do not grant acceptance through project-management access. |
| 20 | Acceptance method | UNRESOLVED BUSINESS DECISION | Ordinary authenticated acceptance, clickwrap, typed name, uploaded signature, or another method is not selected. | Phase 15.4 lists alternatives and explicitly defers the method. | Do not implement an acceptance UI or method field as legally meaningful. |
| 21 | Legal/e-signature requirements | LEGAL / ACCOUNTING / PROVIDER DEPENDENCY | Legal binding requirements, signature level, identity assurance, and any provider requirement are unknown. | Phase 11 review and Phase 15.4 both identify agreement/e-signature requirements as unresolved. | No e-signature provider, signature claim, or legal workflow may be invented. |
| 22 | Required acceptance evidence | LEGAL / ACCOUNTING / PROVIDER DEPENDENCY | Terms version/checksum and actor/timestamp are architectural candidates, but required IP/device, consent, identity, retention, and evidence standards are not approved. | Database blueprint and Phase 15.4 propose evidence fields only where legally justified. | Do not decide evidence retention or privacy-sensitive capture. |
| 23 | Repeat purchase semantics | UNRESOLVED BUSINESS DECISION | Repeated, phased, renewed, upgraded, or separately scoped purchases of one offering are not defined. | Existing `(project_id, offering_id)` uniqueness and Phase 15.4 explicitly require a decision for repeated purchases. | Do not choose duplicate-row, revision, quantity, or new-project semantics. |
| 24 | Partial purchase semantics | UNRESOLVED BUSINESS DECISION | Partial approval, partial acceptance, partial delivery, and partial settlement behavior are not defined. | Phase 15.4 lists partial approvals/purchases as unresolved; no commercial tables exist. | Do not implement line-level acceptance or partial activation. |
| 25 | Custom proposal item semantics | UNRESOLVED BUSINESS DECISION | Custom/enterprise work is mentioned conceptually, but item structure, catalog traceability, pricing, approvals, and scope rules are not approved. | Platform architecture mentions custom enterprise line items; Phase 15.4 says custom item policy remains unresolved. | Do not create free-form commercial items or use custom text as a commitment. |
| 26 | Whether one proposal may cover multiple projects | UNRESOLVED BUSINESS DECISION | The initial proposal recommendation is organization/project scoped, while multi-project coverage is not finally decided. | Phase 15 plan describes one organization/project proposal and separately notes possible multi-project combinations; no implementation exists. | Do not support cross-project proposal aggregation. |
| 27 | Whether one agreement may cover multiple projects | UNRESOLVED BUSINESS DECISION | No agreement aggregation or scope/authorization model for multiple projects is approved. | Phase 15.4 explicitly leaves multi-project agreements open. | Keep agreement scope to an approved future policy; do not infer it from organization ownership. |
| 28 | Commercial state machines | UNRESOLVED BUSINESS DECISION | Candidate proposal/agreement/payment states are documented as recommendations, not approved final state machines. | Phase 15 and platform architecture contain differing recommended state sets; Phase 15.4 says exact states require approval. | Do not encode candidate statuses or irreversible transitions as final behavior. |
| 29 | Commercial -> payment gate | DERIVED / STRONGLY IMPLIED | Payment cannot be marked complete from browser state, and payment/activation must follow an approved gate; the exact gate and exceptions are unresolved. | API/payment architecture requires server verification; Phase 15.4 forbids automatic downstream activation and leaves payment sequencing open. | Implement no payment gate; preserve a future explicit, server-authoritative transition boundary. |
| 30 | Commercial -> entitlement gate | DERIVED / STRONGLY IMPLIED | Proposal/agreement acceptance must not automatically create entitlement; exact agreement/payment/exception conditions remain unresolved. | Phase 15 plan defines source-linked entitlements; Phase 15.3 says selection does not grant entitlement; Phase 15.4 preserves the separation. | Do not create entitlements or infer access from acceptance. |
| 31 | Commercial -> service activation gate | DERIVED / STRONGLY IMPLIED | Service activation must be explicit, separately authorized, and audited; the required commercial prerequisites are unresolved. | Phase 15.3 `REQUESTED` boundary and Phase 15.4 non-activation rule are explicit. | Do not transition `project_services` to `ACTIVE` from proposal/agreement acceptance. |
| 32 | Commercial -> observation/delivery activation gate | DERIVED / STRONGLY IMPLIED | Acceptance cannot automatically start delivery or observation; paid implementation and later delivery gates must remain separate. | Approved lifecycle, paid-observation rule, client journey gates, and Phase 15.4 separation rule. | Do not create delivery, observation, or ongoing service from acceptance alone. |

### Classification summary

- **ALREADY DECIDED:** 2
- **DERIVED / STRONGLY IMPLIED:** 5
- **UNRESOLVED BUSINESS DECISION:** 21
- **LEGAL / ACCOUNTING / PROVIDER DEPENDENCY:** 4

Total: 32 blocker categories.

## 4. Decisions Already Locked

The following decisions are supported directly by the approved business model or current implemented architecture:

- BlockWaveLab has exactly four pillars: `BUILD`, `AUTOMATE`, `OPERATE`, and `GROW`.
- The approved catalog contains the ten documented service entries under those four pillars; no new business category is authorized.
- One-time/project implementation work exists as a supported commercial mode.
- Ongoing service is optional, separately purchased, and separately paid; recurring service is not mandatory for every service.
- Observation is part of the paid implementation lifecycle.
- Observation must not be positioned as free support, free monitoring, or “two months free.”
- `organizations` is the current tenant/customer and commercial boundary.
- `projects` are delivery containers owned by an organization.
- `project_services` is a requested service selection boundary; `REQUESTED` is not payment, approval, agreement, entitlement, delivery, subscription, or managed-service activation.
- Commercial state and delivery state must remain separate.
- AI assists with repetitive work and operational efficiency; it does not replace humans, and sensitive/strategic/approval boundaries remain human-governed.
- Existing organization/project authorization and RLS remain authoritative. No new commercial role or second tenant boundary is approved.
- Existing `audit_events` is the audit foundation to reuse; a duplicate commercial audit system is not approved.
- Cost and margin protection are mandatory. Future pricing must account for scope/complexity and operating cost sufficiently to avoid operating at a loss.
- Unnecessary paid SaaS, APIs, infrastructure, and providers must be avoided; existing Supabase/Postgres/free-tier capabilities are preferred where practical.
- No price, currency, tax, discount, payment, legal, e-signature, provider, or role-authority value may be invented to make implementation appear complete.

The locked decisions do not answer who may issue or accept a commercial commitment, how it is priced, or what makes acceptance legally effective.

## 5. Decisions Still Unresolved

### Commercial

- Pricing ownership and approval authority.
- Price representation and fixed/calculated/negotiated model.
- Currency and amount/rounding conventions.
- Discount authority and calculation.
- Payment terms and payment sequencing.
- Deposits, milestones, invoices, due dates, late payment, refunds, credits, and chargebacks.
- Whether payment is required before acceptance, after acceptance, or at defined gates.
- Whether multiple currencies or payer/legal-entity arrangements are needed.

### Legal

- Whether proposal acceptance is binding.
- Whether an agreement is mandatory and which terms are authoritative.
- Legal effect of agreement acceptance.
- Amendment, renewal, termination, expiry, and retention rules.
- Required identity assurance, consent language, terms presentation, and acceptance evidence.
- Whether an ordinary authenticated action is sufficient or a signature/e-signature standard is required.

### Authorization

- Which existing role or explicitly approved policy may issue proposals.
- Which existing role or explicitly approved policy may approve proposals.
- Which existing role or explicitly approved policy may accept proposals and agreements.
- Whether OWNER or ADMIN can accept on behalf of an organization and what evidence of authority is required.
- Confirmation that MEMBER, CONTRIBUTOR, VIEWER, and PROJECT_MANAGER do not gain commercial acceptance authority through ordinary membership/project access. The current default is no authority, but a final commercial action policy remains required.
- Any internal operator authority must use existing approved platform policy; no new internal role may be invented.

### Domain

- Final proposal and agreement state machines and reversible transitions.
- Repeat, renewal, upgrade, downgrade, and phased purchase semantics.
- Partial purchase, partial approval, line-level acceptance, and settlement behavior.
- Custom proposal item structure and validation.
- Whether one proposal may cover multiple projects.
- Whether one agreement may cover multiple projects or proposals.
- Exact prerequisites and sequencing between commercial commitment, payment, entitlement, service activation, observation, and delivery.

### Provider/Operations

- Payment provider and webhook/reconciliation requirements.
- E-signature or contract provider, if legally required.
- Tax calculation/accounting provider and records required by the applicable jurisdiction.
- Operational ownership for pricing, proposal issuance, agreement administration, reconciliation, and audit review.
- Retention, privacy, access, backup, and recovery requirements for acceptance evidence and financial records.

## 6. Decisions That MUST NOT Be Invented

The following must remain explicitly unassigned until approved:

- prices, rates, totals, margins, currency, exchange rates, rounding, and price units
- tax rates, tax jurisdictions, tax-inclusive/exclusive behavior, exemptions, or tax provider behavior
- discounts, promotions, credits, deposits, milestones, payment terms, late fees, refunds, chargebacks, or invoice rules
- payment-before-acceptance or payment-after-acceptance sequencing
- legal binding effect of proposal or agreement acceptance
- agreement language, terms version, amendment/termination rules, or signature validity
- e-signature provider, acceptance method, identity verification, consent text, IP/device capture, or evidence retention
- commercial authority for OWNER, ADMIN, MEMBER, PROJECT_MANAGER, CONTRIBUTOR, or VIEWER
- a new commercial, billing, customer, or internal staff role
- repeated/partial/custom purchase semantics or multi-project aggregation
- automatic payment, entitlement, subscription, observation, delivery, or service activation from a proposal/agreement action
- a fifth pillar, new service category, mandatory subscription, free observation period, or unsupported AI/human-replacement claim

## 7. Minimum Decision Set Required Before Implementation

The smallest safe decision set is:

1. Approve pricing authority and price model, including price representation, currency, tax responsibility, and discount policy.
2. Approve payment terms and sequencing, including whether acceptance can precede payment and how deposits, milestones, invoicing, refunds, credits, and chargebacks are treated.
3. Approve whether proposal acceptance is binding and whether an agreement is mandatory, including authoritative terms and amendment/termination rules.
4. Approve the acceptance method and required legal/evidentiary record, including any e-signature or provider requirement.
5. Approve the commercial action policy for proposal issuance, approval, and acceptance using existing roles/policies. Explicitly decide OWNER and ADMIN; preserve MEMBER, PROJECT_MANAGER, CONTRIBUTOR, and VIEWER as non-authorizing by default unless formally changed.
6. Approve proposal/agreement domain semantics: final state machines, repeat/partial/custom purchases, and whether proposals or agreements may span multiple projects.
7. Approve explicit gates for payment, entitlement, service activation, observation, and delivery, with no implicit activation from acceptance.

Provider, accounting, and legal sign-off must be attached to the applicable decisions rather than substituted by technical defaults.

## 8. What Can Proceed Without These Decisions

Safe planning and audit work can continue:

- Maintain the organization-as-tenant and project-as-delivery-container architecture.
- Maintain the four-pillar catalog and current unpriced offering content.
- Maintain `project_services` as a requested selection boundary with no activation implication.
- Define non-binding domain diagrams, ownership paths, snapshot/immutability requirements, threat models, RLS predicates, audit-event references, and negative-test plans.
- Prepare decision records and examples that contain no prices, currencies, taxes, payment terms, legal claims, provider choices, or role grants.
- Review cost-control, data-minimization, retention, concurrency, replay, and tenant-isolation requirements.
- Refine the future implementation sequence and acceptance criteria after business/legal/accounting decisions are recorded.

No proposal/agreement schema, RPC, UI, acceptance flow, payment flow, entitlement flow, service activation, or delivery activation should be implemented as a commercial commitment until the minimum decision set is approved.

## 9. Cost-Control Review

The approved model requires margin protection but does not provide numerical prices or costs. Therefore:

- Pricing must account for project scope/complexity and operating cost, but no margin percentage or amount may be invented.
- One-time implementation and optional ongoing service should remain separate so recurring operational cost is not silently absorbed into implementation work.
- Paid observation must be scoped as implementation work; presenting it as free would undermine both commercial clarity and cost recovery.
- Proposal and agreement planning should reuse Supabase/Postgres, Auth, RLS, trusted functions, and the existing audit foundation rather than adding paid SaaS or duplicate infrastructure.
- Payment, tax, accounting, and e-signature providers should be introduced only when an approved requirement justifies their operating, transaction, compliance, and maintenance cost.
- AI, email, monitoring, and other external providers should remain optional boundaries until a real workflow requires them and the provider cost can be included in approved pricing.
- Snapshot retention, acceptance evidence, audit history, and financial records create storage, privacy, backup, and review obligations; their retention policy must be approved before implementation.
- Cost control does not justify guessing a cheap default. A technically inexpensive but legally or commercially incorrect workflow can create greater operating loss and liability.

## 10. Final Phase 15.4 Decision Status

BLOCKED — BUSINESS DECISIONS REQUIRED

The business model resolves important commercial direction and architecture boundaries, but 21 blocker categories remain unresolved and four require legal/accounting/provider decisions. Proposal/agreement implementation that creates or represents commercial commitment is not ready.

## 11. Scope Confirmation

- ONLY this document changed/created: `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md`
- NO DB changes
- NO application changes
- NO migration
- NO deployment
- NO test users
- NO Phase 15.5 work

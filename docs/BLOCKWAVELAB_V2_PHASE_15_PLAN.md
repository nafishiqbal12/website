# BlockWaveLab V2 Phase 15 Plan

## Commercial and Business Engine Architecture Audit

## Status

Planning and repository audit only. No Phase 15 application code, migration, database object, payment integration, checkout, invoice flow, subscription flow, or UI was created in this phase.

Phase 14 Client Platform remains complete with runtime authenticated verification deferred. Phase 15 begins the commercial/business-engine planning boundary only. Phase 16 and all later work remain out of scope.

## Executive Summary

BlockWaveLab remains:

> AI Automation and DevOps Partner for Web3 Projects

The only service pillars are:

1. BUILD
2. AUTOMATE
3. OPERATE
4. GROW

A client may select one pillar, multiple pillars, or a custom combination of services. The approved delivery lifecycle remains:

```text
Implementation -> Deployment -> Observation -> Stabilization -> Documentation -> Handover -> Optional ongoing service
```

Observation is a paid implementation stage. It is not free support, free monitoring, or a two-month promotional offer. Optional ongoing service is separately purchased and separately entitled.

### Recommended commercial architecture

- Keep `organizations` as the tenant, client, and commercial customer boundary for the initial system.
- Keep `projects` as delivery containers owned by an organization.
- Normalize the catalog as fixed pillars, services, and versioned service offerings.
- Represent a client selection with `project_services`.
- Represent negotiation with `proposals` and immutable `proposal_versions`.
- Represent legal/commercial commitment with first-class `agreements` and immutable agreement versions or acceptance snapshots.
- Keep commercial state and delivery stage in separate state machines.
- Represent access to purchased work with time-bounded, source-linked `entitlements`; payment success alone never means unrestricted service access.
- Keep payment providers behind a server-only adapter and verified webhook boundary.
- Reuse the deployed `audit_events` foundation; do not create a second audit system.

## A. Current Baseline Audit

### Repository and runtime

- Vite + React 18 + TypeScript + Tailwind remain the application stack.
- The custom history API router is preserved.
- Supabase Auth is the identity boundary.
- Browser code uses the public Supabase client only.
- Phase 14 provides authenticated dashboard, organization, invitation, project, and project-membership surfaces.
- `src/lib/organizations/types.ts` and `src/lib/organizations/data.ts` provide organization, invitation, project, and membership types/data access.
- Phase 14 uses trusted RPCs for mutations and RLS-scoped reads.
- No commercial data-access module, catalog module, pricing module, proposal module, agreement module, invoice module, payment adapter, or entitlement module exists.

### Deployed database baseline

Deployed migrations currently provide:

- `profiles`
- `organizations`
- `organization_members`
- `organization_invitations`
- `projects`
- `project_members`
- `audit_events`
- fixed-search-path authorization/audit functions and ACL hardening

There are no deployed tables for:

- pillars, services, service offerings, or project services
- quotes, proposals, proposal versions, or proposal items
- agreements or agreement acceptances
- invoices, payment intents, transactions, refunds, credits, subscriptions, or subscription items
- entitlements, trial policies, or trial instances
- delivery engagements, service delivery records, or lifecycle events beyond the existing audit foundation
- billing profiles, tax profiles, payment-provider customers, or payment-provider callbacks

### Existing architecture already reusable

The Phase 11 documents already define commercial vocabulary, catalog normalization, proposals, payments, subscriptions, trials, entitlements, agreements, lifecycle events, provider adapters, and audit boundaries. These are conceptual contracts only and must be made implementation-ready by this plan.

The Phase 13 organization/project model is sufficient as the tenant/access foundation. It should not be duplicated by a second client, customer, workspace, or billing-account concept unless a concrete legal/accounting requirement makes that necessary.

## B. Service Catalog

### Fixed pillar model

`pillars` is a bounded catalog reference with exactly these stable keys:

- `BUILD`
- `AUTOMATE`
- `OPERATE`
- `GROW`

No fifth pillar, legacy crypto-marketing category, or generic marketing-agency category is introduced.

### Service definition

A `service` is a capability within one fixed pillar. It should include:

- stable key
- pillar reference
- display name and description
- scope summary
- active/inactive state
- internal/client visibility policy where needed
- created/updated timestamps

A service describes capability, not a price or a specific client commitment.

### Service offering

A `service_offering` is a selectable commercial/delivery variant of a service. It should include:

- service reference
- version
- display name
- scope template/reference
- billing mode: `ONE_TIME`, `RECURRING`, or `ONE_TIME_AND_RECURRING`
- availability state
- effective start/end dates
- optional delivery template reference
- pricing-rule reference or snapshot policy, not mutable client pricing

Optional variants are appropriate for scope, support level, cadence, or implementation shape. They must remain within one of the four pillars and must not become new business categories.

### One-time and recurring behavior

A service offering may support:

- one-time paid implementation
- recurring ongoing service
- both, where implementation and post-handover service are distinct commercial records

The catalog must not force every service into a subscription. A recurring commitment is created only when the client explicitly purchases ongoing service.

### Organization/project relationship

Catalog records are global configuration. A client selection is represented by `project_services`, which binds:

```text
organization -> project -> project_service -> service_offering -> service -> pillar
```

`project_services` must retain a scope snapshot and must not trust a later catalog edit to rewrite an approved client commitment.

## C. Commercial Customer Model

### Recommended model

Use the existing `organizations` table as the commercial customer boundary.

```text
User -> organization_membership -> Organization
Organization -> Project
Organization/Project -> commercial records
```

The organization is:

- the tenant boundary
- the client/customer account for initial commercial records
- the owner of projects, project services, proposals, agreements, invoices, payments, subscriptions, credits, and entitlements where the record is organization-scoped

Projects remain delivery containers owned by one organization. A project can carry multiple selected services across the four pillars.

### Commercial account decision

Do not add a separate `commercial_accounts` or `billing_profiles` table in the first Phase 15 implementation unless one of these requirements is approved:

- one organization must have multiple independently billed legal entities
- tax identity and invoice recipient differ from the organization profile
- one payer must fund projects across multiple organizations
- accounting provider identity cannot be represented safely by organization fields

Recommended initial approach: add only clearly justified billing/tax fields to a dedicated later commercial profile aggregate if needed, never duplicate organization ownership or membership. This is an unresolved decision and blocks payment-ready implementation, not catalog/proposal planning.

## D. Service Selection

A client selects one or more offerings for a project through a controlled mutation:

1. Confirm active organization membership and project access.
2. Resolve active service offering versions from the catalog.
3. Create or update a draft `project_service` selection.
4. Capture requested scope and pillar-specific onboarding requirements later.
5. Include selected services in a proposal snapshot.
6. Activate delivery only after the approved commercial gates.
7. Create entitlements from the approved agreement/payment/commitment rules.

Multiple pillars are represented by multiple `project_services` rows, not by a new package category. A multi-pillar request may share one proposal and agreement while preserving per-service scope, commercial state, and delivery participation.

A client cannot select an inactive offering, create an entitlement directly, or activate delivery through a browser table write.

## E. Proposal and Quote Model

### Quote

A `quote` is an internal or system-calculated commercial snapshot used to prepare a client-facing proposal. It may include:

- organization/project
- calculation inputs
- currency
- subtotal/tax/discount references where legally approved
- total snapshot
- expiration
- status
- calculation/policy version

A quote is not itself acceptance or payment authorization.

### Proposal

A `proposal` is the negotiation container for one organization/project commercial request. It should include:

- organization/project ownership
- current status
- current version reference
- valid-until timestamp
- source quote/reference
- created/updated timestamps

### Proposal version

A `proposal_version` is an immutable client-facing snapshot after issuance. It should include:

- proposal reference
- monotonically increasing version number
- scope snapshot
- commercial snapshot
- currency
- subtotal/discount/tax/total snapshots
- status
- issued/sent/viewed/accepted/rejected/expired timestamps
- actor references
- supersedes/version reason

Recommended statuses:

```text
DRAFT -> INTERNAL_REVIEW -> SENT -> VIEWED -> CHANGES_REQUESTED
                             -> APPROVED
                             -> REJECTED
                             -> EXPIRED
                             -> CANCELLED
```

An approved, rejected, expired, or issued version must never be overwritten. Revision creates a new version. Proposal item rows must snapshot the selected offering, scope, quantity, fee mode, and price; later catalog changes cannot rewrite history.

### Acceptance

Proposal acceptance must use an idempotent trusted mutation with:

- authenticated actor
- organization/project authorization
- expected proposal version
- current valid status and validity date
- immutable acceptance record
- audit event

Payment-required proposals may be accepted before payment, but entitlement/activation must remain blocked until the commercial policy says payment or an approved exception is satisfied.

## F. Agreement Model

### Recommendation

Use a first-class `agreements` aggregate because proposal acceptance and legal/commercial commitment are related but not identical. Do not build legal document storage in Phase 15 unless a signed file/reference is already required.

An agreement should include:

- organization/project
- source proposal and accepted proposal version
- terms version/reference
- status
- effective_at and expires_at where applicable
- cancellation/termination state and timestamps
- required acceptance flag
- created/updated timestamps

Recommended agreement states:

```text
DRAFT -> PENDING_ACCEPTANCE -> ACTIVE -> SUSPENDED -> TERMINATED | EXPIRED
```

An `agreement_acceptance` record must be immutable and include:

- agreement/version reference
- authenticated actor
- acceptance timestamp
- terms checksum/reference
- safe request context only where legally justified
- audit correlation ID

Proposal acceptance may create a pending agreement; agreement acceptance is the legal commitment boundary. The exact e-signature/provider requirement is unresolved and blocks legal-ready implementation, not architecture planning.

## G. Commercial vs Delivery State

These are separate fields and separate state machines.

### Commercial status

At proposal/agreement/project-service level, use bounded statuses such as:

```text
DRAFT
PROPOSED
ACCEPTED
PAYMENT_PENDING
PAID
ACTIVE
PAST_DUE
SUSPENDED
CANCELLED
REFUNDED
EXPIRED
COMPLETED
```

The exact state set must be owned by the aggregate; do not use one universal status enum for every commercial record.

### Delivery stage

Use the approved lifecycle:

```text
NOT_STARTED
IMPLEMENTATION
DEPLOYMENT
OBSERVATION
STABILIZATION
DOCUMENTATION
HANDOVER
COMPLETED
ONGOING
PAUSED
CANCELLED
```

A project can be commercially `ACTIVE` while its delivery stage is `IMPLEMENTATION`. A project service can be commercially active while another selected service is still awaiting approval. No UI infers payment, entitlement, or delivery readiness from a single status field.

## H. Payment Architecture Boundary

### Future payment entities

- `payment_intents`: server-created request to collect a defined amount for a defined commercial record.
- `payments`/`payment_transactions`: immutable settlement attempts and outcomes.
- `payment_events`: verified provider event references with idempotency keys and processing state.
- `refunds`: immutable full/partial refund records linked to payment/invoice.
- `credits`: controlled service/account credits with source, amount, balance, expiry, and policy reference.

Each payment record should include:

- organization/project and source commercial record
- provider and provider reference
- amount in minor currency units
- ISO currency code
- status
- idempotency key
- created/processed timestamps
- safe provider metadata reference, never provider secrets

### Server-only boundary

The browser may request a payment intent or read sanitized payment status after authorization. It must never:

- create provider customers directly
- receive provider secret keys
- mark a payment paid
- trust a browser payment-success flag
- activate an entitlement based only on client state

Provider callbacks must be server/edge-only, signature-verified, replay-protected, idempotent, persisted as safe event references, and processed asynchronously where needed.

### Phase allocation

Phase 15 planning defines the entity and provider boundary. A later payment implementation phase must implement provider adapters, webhook verification, reconciliation, refunds, and production payment tests. Checkout/payment gateway work is not Phase 15 planning implementation.

## I. Recurring Service and Subscription Model

Recurring service is optional after handover and separately paid.

Separate these concepts:

- `agreement`: commercial/legal commitment and terms
- `subscription` or recurring commitment: billing schedule and renewal commitment
- `subscription_item`: selected offering/quantity/price snapshot
- `entitlement`: currently granted capability/time window
- `service_delivery`: actual operational delivery record

Supported billing modes:

- one-time implementation
- monthly ongoing service
- annual ongoing service
- custom approved recurring interval if business/legal policy allows

Recommended subscription states:

```text
TRIALING -> ACTIVE -> PAST_DUE -> PAUSED -> CANCELLED | EXPIRED
```

A subscription cannot be implied by a one-time implementation payment. Ongoing service starts only after handover or an explicitly approved early-start agreement, and it needs a separate activation/audit event.

## J. Entitlement Model

The entitlement answer is:

> What service capability may this organization/project receive now, under which source, during what period, and with what restrictions?

An `entitlement` should include:

- organization/project/service or offering subject
- capability key
- source type/reference: agreement, payment, subscription, approved exception, or trial policy
- starts_at/ends_at
- status: `PENDING`, `ACTIVE`, `SUSPENDED`, `REVOKED`, `EXPIRED`
- limits/scope snapshot
- reason/policy version
- created/revoked timestamps

Entitlement evaluation must consider:

- approved proposal/agreement
- payment or approved payment exception
- active recurring commitment where applicable
- refund/reversal/chargeback outcome
- cancellation/expiry
- implementation period
- paid observation period
- handover completion
- optional ongoing-service activation

A one-time payment may support implementation entitlement but does not automatically grant ongoing OPERATE, AUTOMATE, or GROW service. Entitlements are server-authoritative and cannot be extended by client input.

## K. Delivery and Observation Model

### Service delivery record

Use a `service_deliveries` or equivalent delivery aggregate linked to `project_service`, not a generic project status field. It should retain:

- organization/project/project_service
- delivery owner/actor references
- commercial status reference
- delivery stage
- started/completed timestamps
- stage gate evidence/reference
- blockers and reason fields
- handover status

### Lifecycle events

Use immutable `service_lifecycle_events` and, where needed, `project_lifecycle_events` with:

- actor
- organization/project/project_service
- previous commercial/delivery state
- next state
- reason
- evidence/document reference
- correlation ID
- timestamp

### Observation

Observation is an explicit paid implementation stage:

```text
DEPLOYMENT accepted -> OBSERVATION active -> findings/stabilization plan -> STABILIZATION -> DOCUMENTATION -> HANDOVER
```

An observation record should include:

- service delivery reference
- starts_at
- planned ends_at
- actual ends_at
- status: `SCHEDULED`, `ACTIVE`, `FINDINGS_RECORDED`, `COMPLETED`, `EXTENDED_BY_APPROVED_CHANGE`, `CANCELLED`
- observation scope and success criteria
- findings reference
- stabilization handoff reference

Observation does not create free support. If observation needs extension, it requires an approved scope/commercial change. Handover requires defined documentation/evidence and acceptance condition. Ongoing service is a separate entitlement after handover.

## L. Documents

Phase 15 should model references, not implement storage/upload.

- Proposal versions reference scope/commercial snapshots and optional document references.
- Agreements reference terms version/checksum and optional signed document metadata.
- Implementation documentation belongs to delivery/service records and later `documents`/`document_versions`.
- Handover documentation is a versioned deliverable with acceptance state.

Private files, signed URLs, storage scanning, visibility, retention, and document access events belong to the later document/delivery implementation. Do not place files or secrets in ordinary commercial rows.

## M. Refunds, Credits, and Policy Boundaries

### Refunds

A refund is a settlement correction, not a status shortcut. It must be linked to a payment/transaction and contain:

- full or partial amount
- currency
- reason/policy reference
- provider refund reference
- requested/processed timestamps
- status and actor

Refund outcomes may revoke or reduce entitlements according to a versioned policy. They must not erase proposal, agreement, payment, or audit history.

### Credits

A credit is a controlled future service/account value with:

- organization/project owner
- source event/reference
- amount and currency or service-unit basis
- balance/consumption history
- expiry
- policy/version
- audit references

Credits are not a replacement for refunds and cannot be created by a client mutation.

### Cancellation and failure

Cancellation needs effective date, actor, reason, scope, and policy. Failed payment should normally block new activation/new work while preserving read access to paid/client-visible records; exact grace, suspension, and termination rules require business/legal approval.

## N. Audit Events

Reuse `public.audit_events`; do not create a duplicate audit system. Future migrations should extend its bounded event types and add explicit target references or safe metadata as required.

Commercial events requiring audit include:

- catalog/service offering activated/deactivated
- project service selected, quoted, approved, activated, paused, cancelled
- proposal created, issued, revised, accepted, rejected, expired, cancelled
- agreement created, accepted, suspended, terminated, expired
- payment intent created, payment initiated, succeeded, failed, reconciled
- refund requested/issued/failed
- credit issued/consumed/expired/revoked
- entitlement created, activated, suspended, revoked, expired
- delivery started, stage transitioned, observation started/completed, stabilization completed, handover completed

Audit metadata must exclude passwords, access/refresh tokens, provider secrets, raw invitation tokens, and sensitive payment payloads. Business audit records remain append-only and separate from technical logs.

## O. Authorization Model

Use existing roles only.

### Organization OWNER

- view organization/project commercial records
- manage catalog selections and project services
- create/revise proposals where authorized
- accept agreements for the organization
- view/manage payment and recurring-service records subject to policy
- approve commercial/delivery gates
- manage organization-level commercial settings

### Organization ADMIN

- view commercial records
- request/select services and manage project service setup where policy permits
- create draft proposals or prepare commercial changes
- manage delivery administration
- cannot transfer ownership, remove the last owner, or perform ownership-sensitive/destructive financial actions unless a separate approved policy grants it

### Organization MEMBER

- view permitted organization/project commercial status
- request/select services within assigned project scope where enabled
- contribute requirements and delivery work
- cannot accept agreements, approve proposals, manage payment, or activate recurring commitments by default

### Project roles

- `PROJECT_MANAGER`: manage assigned project scope/delivery and prepare requests; cannot grant organization commercial authority.
- `CONTRIBUTOR`: assigned delivery work and permitted client-visible records.
- `VIEWER`: approved read-only project/commercial summaries.

Proposal acceptance/agreement acceptance should require an explicit organization-level permission path, normally `OWNER`, with an approved delegated policy decision before allowing `ADMIN`. Project roles never grant billing authority. UI permission checks are UX only; every read/mutation is reauthorized server-side/RLS.

## P. State Machines

### Proposal

```text
DRAFT -> INTERNAL_REVIEW -> SENT -> VIEWED -> CHANGES_REQUESTED -> SENT
                                      -> APPROVED
                                      -> REJECTED
                                      -> EXPIRED
                                      -> CANCELLED
```

- Draft/internal actors create and revise.
- Owner or approved organization approver accepts/rejects.
- Expiry is server-owned.
- Issued/approved versions are immutable; revisions create new versions.

### Agreement

```text
DRAFT -> PENDING_ACCEPTANCE -> ACTIVE -> SUSPENDED -> TERMINATED | EXPIRED
```

- Organization owner or approved legal/commercial actor accepts.
- Acceptance snapshot is immutable.
- Termination requires actor, reason, effective date, and audit.

### Payment

```text
PENDING -> PROCESSING -> PAID | FAILED | CANCELLED
PAID -> REFUNDED | PARTIALLY_REFUNDED
```

- Provider/webhook boundary owns authoritative transitions.
- Idempotency and replay protection are mandatory.
- Client cannot set payment status.

### Entitlement

```text
PENDING -> ACTIVE -> SUSPENDED -> REVOKED | EXPIRED
```

- Created by approved commercial/payment/commitment policy.
- Revoked or suspended by server policy, refund, cancellation, or failed payment rules.
- History is retained.

### Delivery

```text
NOT_STARTED -> IMPLEMENTATION -> DEPLOYMENT -> OBSERVATION -> STABILIZATION -> DOCUMENTATION -> HANDOVER -> ONGOING
```

Side states: `PAUSED`, `CANCELLED`, `COMPLETED`.

- Delivery actors trigger stage transitions with gate evidence.
- Observation is paid implementation, never free support.
- Ongoing starts only through a separate approved service commitment.

### Observation

```text
SCHEDULED -> ACTIVE -> FINDINGS_RECORDED -> COMPLETED
                         -> EXTENDED_BY_APPROVED_CHANGE
                         -> CANCELLED
```

- Starts only after accepted deployment.
- Ends when findings and stabilization plan are recorded.
- Extensions require approved commercial/scope change.

### Recurring service

```text
PENDING -> TRIALING -> ACTIVE -> PAST_DUE -> PAUSED -> CANCELLED | EXPIRED
```

The exact `TRIALING` use is policy-controlled. No recurring service is created by a one-time implementation payment.

## Q. Future Database Migration Sequence

No migration was created or deployed for this audit. Proposed forward-only implementation order:

1. `008_catalog_pillars_services.sql`
2. `009_service_offerings.sql`
3. `010_project_services.sql`
4. `011_quotes_proposals_versions_items.sql`
5. `012_agreements_acceptances.sql`
6. `013_commercial_status_and_policy_snapshots.sql` if status/policy fields cannot be contained in the previous aggregates
7. `014_entitlements_trials.sql`
8. `015_service_deliveries_lifecycle_events_observation.sql`
9. `016_invoices_payment_intents_transactions.sql`
10. `017_payment_events_refunds_credits.sql`
11. `018_subscriptions_recurring_services.sql`
12. `019_commercial_rls_functions_acl_hardening.sql`
13. `020_commercial_negative_authorization_tests.sql`

This order is proposed, not approved execution. Each migration must be forward-only, independently reviewed, RLS-complete, and tested before the next aggregate is exposed. Payment-provider callbacks and production provider integration remain a later implementation boundary after schema readiness.

## R. API/RPC Boundaries

### Browser-safe reads

- active catalog pillars/services/offering summaries
- authorized project service selections
- authorized proposal/version summaries
- authorized agreement status/acceptance summaries
- authorized entitlement status
- sanitized invoice/payment/subscription status after provider integration
- delivery stage/observation summaries

All reads remain organization/project scoped and paginated where collections can grow.

### Trusted mutations

- create/update project service selection
- create/revise/issue proposal versions
- accept/reject proposal version
- create/accept agreement
- request payment intent
- create entitlement from approved commercial outcome
- transition delivery/observation stages with expected-version and gate evidence
- activate/pause/cancel recurring service
- issue/refund/consume credits under policy

No browser call may mark payment paid, self-grant entitlement, overwrite an approved proposal, or activate delivery without the server/database policy path.

### Provider callbacks and internal operations

- payment webhooks: server/edge only, signature verified, replay-protected, idempotent
- email/webhook delivery: server/edge only
- reconciliation jobs: internal trusted boundary
- refunds/credits/manual exceptions: elevated, reason-required, audited operations

## S. RLS and Database Security

Every commercial row must have a direct organization path or a project path resolvable to one organization. Policies must require:

1. valid authenticated identity
2. active organization membership
3. organization role ceiling
4. project membership where project-scoped
5. resource/status/action policy

Client-visible records must exclude internal pricing notes, provider payloads, tax secrets, processor references not intended for clients, and internal delivery notes.

Financial, agreement, proposal-version, entitlement, and audit records should be append-only or state-transition-only. Direct deletes are denied; archival/terminal states preserve history. Security-definer functions must use fixed `search_path`, constrained arguments, explicit ACLs, and no service-role credential exposure.

## T. Phase Boundary

### Phase 15 planning/audit

- domain model and state contracts
- catalog/commercial/delivery separation
- authorization and RLS design
- audit and provider boundaries
- migration/API sequence
- unresolved business/legal decisions

### Phase 15 implementation

- catalog and service offerings
- project service selection
- proposal/quote/version foundations
- agreement/acceptance foundation
- entitlement and delivery/observation foundation as approved
- tests, RLS, and data access

### Future payment-provider implementation

- provider adapter
- checkout/payment intent flow
- webhooks and reconciliation
- refunds/credits execution
- production payment tests and operational runbooks

### Future delivery/service execution

- requirements, milestones, tasks, deliverables, documents
- operational work execution and handover evidence
- optional ongoing-service fulfillment

### Future AI/automation implementation

- agent runtime, tools, permissions, approvals, execution logs
- no AI runtime is part of this Phase 15 plan implementation.

## U. Business Model Compliance

This plan does not introduce:

- the old crypto marketing-agency positioning
- legacy marketing service categories
- employee replacement claims
- unsupported AI promises
- forced subscriptions or mandatory monthly plans
- free observation/support periods
- new top-level business categories

It preserves:

> BlockWaveLab — AI Automation and DevOps Partner for Web3 Projects

with exactly:

> BUILD / AUTOMATE / OPERATE / GROW

Observation remains paid implementation. Ongoing service is optional and separately paid.

## V. Risks and Unresolved Decisions

### Blocks implementation readiness

1. **Pricing ownership and calculation rules**: who owns catalog pricing, discounts, tax, and currency conversion; blocks price-bearing proposal implementation.
2. **Legal agreement/e-signature boundary**: whether terms are managed in-app, through signed documents, or through a provider; blocks legal-ready agreement acceptance.
3. **Payment provider and merchant-of-record decisions**: provider, countries, currencies, tax, webhook contract, and settlement ownership; blocks payment implementation.
4. **Refund/credit/grace policy**: commercial effects on entitlements and delivery; blocks production financial transitions.
5. **Commercial approver delegation**: whether `ADMIN` may accept proposals/agreements or only `OWNER`; blocks final authorization policy.

### Non-blocking planning risks

- Catalog variants can become an accidental fifth service category unless pillar ownership is enforced.
- Proposal and agreement snapshots can drift without immutable version constraints.
- Payment success and entitlement activation can be incorrectly coupled without idempotent transition functions.
- Observation can be misrepresented as free support unless copy, agreement, and entitlement policy all use paid implementation language.
- Billing-profile duplication can create inconsistent customer ownership unless organization remains the default commercial boundary.
- Provider payloads and financial identifiers can leak through browser reads without sanitized DTOs and RLS columns/views.
- Audit event growth and retention need privacy/legal policy before production.

## W. Readiness Assessment

**Phase 15 planning readiness: 86/100.**

The architecture is sufficiently defined to begin a non-payment catalog/proposal implementation slice after the unresolved decisions are explicitly recorded. It is not ready for payment-provider integration or production commercial activation until pricing, legal acceptance, merchant/provider, refund/credit, and commercial-approver decisions are approved.

## Exact Next Step

Approve the Phase 15 decision register, then begin **Phase 15.1 Catalog Foundation** as a separate implementation task:

1. approve the four-pillar catalog keys and service/offering ownership
2. approve pricing snapshot/currency policy boundaries
3. implement catalog read/RLS foundations only
4. add project-service selection after catalog validation
5. do not add checkout, payment gateways, invoices, subscriptions, or provider callbacks in 15.1

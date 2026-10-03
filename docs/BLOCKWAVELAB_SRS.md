# BlockWaveLab Software Requirements Specification

## 1. Document Control

**Purpose:** Define what the BlockWaveLab software must do, using repository evidence and approved business decisions.

**Scope:** The current Vite/React client, Supabase-backed organization and commercial foundations, payment provider boundary, delivery lifecycle records, security controls, and documented future boundaries.

**Status:** CURRENT LOCAL SRS / REMOTE RUNTIME NOT VERIFIED.

**Business and architecture sources:**

- `docs/BLOCKWAVELAB_V2_SPEC.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_4B_DECISION_REGISTER.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_4_BUSINESS_DECISIONS.md`
- `docs/BLOCKWAVELAB_V2_PHASE_15_5D_OWNER_DECISION_CLOSURE.md`
- `docs/BLOCKWAVELAB_V2_PLATFORM_ARCHITECTURE.md`
- `docs/BLOCKWAVELAB_V2_DOMAIN_MODEL.md`
- `docs/BLOCKWAVELAB_V2_AUTHORIZATION_MODEL.md`
- `docs/BLOCKWAVELAB_V2_DATABASE_BLUEPRINT.md`
- `docs/BLOCKWAVELAB_V2_API_BLUEPRINT.md`
- `docs/BLOCKWAVELAB_V2_CLIENT_JOURNEY.md`
- `docs/DOCUMENTATION_ARCHITECTURE.md`

**Implementation sources:**

- `src/`
- `supabase/migrations/`
- `supabase/functions/stripe-webhook/index.ts`
- `package.json`
- `docs/PHASE_15_6_PAYMENT_FOUNDATION_IMPLEMENTATION.md`

### Terminology

- **Organization:** Tenant boundary.
- **Project:** Delivery container owned by an organization.
- **Project service:** A project's selected catalog offering.
- **Proposal version:** Immutable commercial scope snapshot after issuance.
- **Payment obligation:** Server-owned amount owed from an accepted commercial source.
- **Payment attempt:** Provider-neutral attempt linked to one obligation.
- **Settlement:** Trusted record created from a verified provider event.
- **Entitlement:** Authorization to receive a scoped project service.
- **Delivery activation:** Admission of an active entitlement into delivery at `IMPLEMENTATION`.
- **RPC:** Trusted database function exposed through a controlled execution grant.

### Requirement status definitions

- **CURRENT / IMPLEMENTED:** Present in source or local migrations and supported by structural evidence.
- **CURRENT / PARTIALLY IMPLEMENTED:** A local boundary exists, but part of the user/runtime flow or evidence is incomplete.
- **PLANNED:** Defined by approved architecture or journey documents but not implemented in the current repository.
- **DEFERRED:** Intentionally postponed, commonly because provider/runtime infrastructure is unavailable.
- **NOT VERIFIED:** A local implementation exists, but the required remote or runtime evidence is absent.
- **REQUIRES OWNER DECISION:** The repository identifies a business or policy choice that is not resolved by implementation.
- **OUT OF SCOPE:** Explicitly excluded from the current product slice.

### SRS maintenance principle

Requirement IDs are stable. Business changes require business and architecture review before implementation changes. This SRS must distinguish local implementation evidence from remote deployment and runtime evidence. Historical phase reports do not silently update current requirements.

## 2. Product Overview

BlockWaveLab is a technical growth partner for Web3 teams. The software platform supports authenticated organizations and projects, catalog-based service selection, commercial proposal and agreement workflows, payment boundaries, entitlement, delivery admission, and later delivery records.

The approved service model has exactly four pillars:

- **BUILD:** DevOps and cloud infrastructure.
- **AUTOMATE:** AI-assisted workflow and operations automation.
- **OPERATE:** Managed DevOps and AI operations.
- **GROW:** Growth, content, community, and delivery-aligned support.

The current repository combines a public Vite/React website with an authenticated platform surface and Supabase-oriented organization, commercial, payment, and delivery foundations. The repository contains local migration and function definitions. The linked Supabase project is currently inactive, so remote database/runtime claims remain unverified.

## 3. Product Scope

### 3.1 Current Scope

The current repository includes:

- Public four-pillar website content and route-driven SEO.
- Authentication client boundaries and profile handling.
- Organizations, memberships, invitations, projects, and project memberships.
- Catalog pillars, services, offerings, and project-service selection.
- Proposal/version/item and agreement/version/acceptance records.
- Payment obligations, payment attempts, provider adapter contracts, Stripe server adapter, and a fail-closed Stripe webhook function.
- Verified settlement, settlement-backed entitlement activation, delivery activation, and downstream delivery record foundations.
- RLS, trusted RPCs, immutable source fields, audit events, and idempotency controls in local migrations.

### 3.2 Planned Scope

The architecture documents define future or incomplete capabilities including richer onboarding, requirements, notifications, support, monitoring, agent workflows, formal API contracts, operational runbooks, and release evidence systems. These are not treated as current requirements unless the repository implements them.

### 3.3 Deferred Scope

- Live Stripe Checkout and webhook execution.
- Remote migration and database verification while Supabase is inactive.
- Authenticated runtime identity tests.
- Provider replay tests and end-to-end settlement runtime tests.
- Full production operations, monitoring, incident, and release evidence workflows.

### 3.4 Out of Scope

- New service pillars or categories.
- Invented prices, taxes, refunds, disputes, chargebacks, or accounting behavior.
- New payment providers.
- Automatic background expiry jobs.
- Automatic progression through delivery stages.
- Unapproved subscriptions or billing automation.
- A replacement architecture or duplicate lifecycle tables.

### 3.5 Requires Owner Decision

The repository documents unresolved decisions around detailed pricing, legal/accounting policy, agreement policy variations, recurring billing execution, refund/dispute policy, and certain future role or collaborator rules. These must not be inferred from code.

## 4. Stakeholders and Users

| User or role | Supported meaning | Status |
|---|---|---|
| Authenticated user | Person with an authenticated account/profile boundary. | CURRENT / IMPLEMENTED locally |
| Organization OWNER | Organization commercial and membership authority. | CURRENT / IMPLEMENTED locally |
| Organization ADMIN | Organization/project/service administration within policy limits. | CURRENT / IMPLEMENTED locally |
| Organization MEMBER | Access to permitted organization/project work. | CURRENT / IMPLEMENTED locally |
| Project manager | Project-level role documented by the authorization model; implementation is represented in project membership roles where present. | CURRENT / PARTIALLY IMPLEMENTED |
| Project contributor | Project-level contributor boundary. | CURRENT / PARTIALLY IMPLEMENTED |
| Project viewer | Project-level read boundary. | CURRENT / PARTIALLY IMPLEMENTED |
| Platform administrator roles | Described in architecture authorization documents but not established as a verified current application role. | PLANNED / NOT VERIFIED |

## 5. Business-to-Software Requirements

The SRS translates approved business decisions into software behavior. It does not redefine the four pillars, create pricing, or convert an architectural proposal into a deployed feature.

### Business requirements

| ID | Requirement | Status | Source | Implementation area |
|---|---|---|---|---|
| BUS-REQ-001 | The software shall represent exactly BUILD, AUTOMATE, OPERATE, and GROW as the approved service pillars. | CURRENT / IMPLEMENTED | `BLOCKWAVELAB_V2_SPEC.md` | `src/lib/design/pillars.ts`, catalog migrations |
| BUS-REQ-002 | The software shall preserve the distinction between implementation, deployment, observation, stabilization, documentation, handover, and optional ongoing service. | CURRENT / IMPLEMENTED locally | Spec and lifecycle migrations | `supabase/migrations/202609150018` through `202609150024` |
| BUS-REQ-003 | The software shall treat commercial approval, payment settlement, entitlement, and delivery activation as separate boundaries. | CURRENT / IMPLEMENTED locally | Phase 15 payment documentation | Payment and lifecycle migrations |
| BUS-REQ-004 | The software shall not introduce services, prices, providers, or lifecycle states without an approved decision. | CURRENT / OPERATING CONSTRAINT | Documentation architecture and spec | All change surfaces |

## 6. Functional Requirements

### 6.1 Authentication

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| AUTH-REQ-001 | The system shall establish an authenticated user identity before protected organization or project operations. | CURRENT / IMPLEMENTED | Phase 12; `src/lib/auth/` | STATIC EVIDENCE |
| AUTH-REQ-002 | The system shall expose sign-in, sign-up, sign-out, password reset, and profile/session UI boundaries where configured. | CURRENT / PARTIALLY IMPLEMENTED | `src/lib/auth/`, `src/pages/AuthPages.tsx` | STATIC EVIDENCE |
| AUTH-REQ-003 | The system shall deny protected operations when authentication is absent or invalid. | CURRENT / IMPLEMENTED locally | Auth context and RLS/RPC guards | STATIC EVIDENCE; runtime NOT VERIFIED |
| AUTH-REQ-004 | Authentication failure responses shall not expose unnecessary account existence information. | PLANNED / PARTIALLY IMPLEMENTED | Authorization/API blueprints | NOT VERIFIED |

### 6.2 User Profiles

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| USR-REQ-001 | The system shall maintain a profile boundary linked to the authenticated user. | CURRENT / IMPLEMENTED locally | `202609080001_profiles.sql` | STATIC EVIDENCE |
| USR-REQ-002 | The platform shall expose only the profile operations permitted by the authenticated user boundary. | CURRENT / PARTIALLY IMPLEMENTED | Auth/profile source and RLS | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.3 Organizations

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| ORG-REQ-001 | The system shall model an organization as the tenant boundary for owned projects and commercial records. | CURRENT / IMPLEMENTED locally | Organization migrations and types | STATIC EVIDENCE |
| ORG-REQ-002 | An authorized user shall be able to create and list organizations through trusted operations. | CURRENT / IMPLEMENTED locally | `create_organization`, organization data helpers | STATIC EVIDENCE |
| ORG-REQ-003 | Organization status shall include ACTIVE, SUSPENDED, and ARCHIVED behavior. | CURRENT / IMPLEMENTED locally | Organization schema | STATIC EVIDENCE |
| ORG-REQ-004 | Organization data access shall be scoped by active membership and tenant authorization. | CURRENT / IMPLEMENTED locally | Organization RLS and authorization functions | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.4 Organization Membership

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| ORG-REQ-005 | The system shall support OWNER, ADMIN, and MEMBER organization roles. | CURRENT / IMPLEMENTED locally | `OrganizationRole`, membership migration | STATIC EVIDENCE |
| ORG-REQ-006 | Membership status shall control access and support PENDING, ACTIVE, SUSPENDED, and REMOVED states. | CURRENT / IMPLEMENTED locally | Membership schema and policies | STATIC EVIDENCE |
| ORG-REQ-007 | Membership mutation shall be performed through authorized server-side lifecycle functions rather than direct browser writes. | CURRENT / IMPLEMENTED locally | Membership RLS/RPCs | STATIC EVIDENCE |

### 6.5 Invitations

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| ORG-REQ-008 | Authorized organization users shall be able to create, accept, revoke, and expire organization invitations through trusted functions. | CURRENT / IMPLEMENTED locally | `202609100004_organization_invitations.sql` | STATIC EVIDENCE |
| ORG-REQ-009 | Invitation acceptance shall enforce token, organization, status, expiry, and intended-user checks. | CURRENT / IMPLEMENTED locally | Invitation RPCs | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.6 Projects

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PROJ-REQ-001 | An organization shall contain projects owned by that organization. | CURRENT / IMPLEMENTED locally | `202609100005_projects.sql` | STATIC EVIDENCE |
| PROJ-REQ-002 | Authorized organization users shall be able to create, update, and archive projects through trusted operations. | CURRENT / IMPLEMENTED locally | Project RPCs and data helpers | STATIC EVIDENCE |
| PROJ-REQ-003 | Project records shall preserve ACTIVE, PAUSED, and ARCHIVED states. | CURRENT / IMPLEMENTED locally | Project schema/types | STATIC EVIDENCE |
| PROJ-REQ-004 | Project reads and mutations shall enforce organization ownership and project authorization. | CURRENT / IMPLEMENTED locally | Project RLS/RPCs | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.7 Project Membership

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PROJ-REQ-005 | The system shall support project membership and project-level roles without elevating organization authority. | CURRENT / PARTIALLY IMPLEMENTED | Project membership migration and authorization model | STATIC EVIDENCE |
| PROJ-REQ-006 | Project membership shall support add, update, and remove operations through authorized functions. | CURRENT / IMPLEMENTED locally | Project membership RPCs | STATIC EVIDENCE |

### 6.8 Service Catalog

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| CAT-REQ-001 | The system shall expose exactly the four approved catalog pillars. | CURRENT / IMPLEMENTED | Catalog migrations and pillar constants | STATIC EVIDENCE |
| CAT-REQ-002 | A service offering shall belong to a catalog service and pillar and carry scope, billing-mode, availability, and effective-date data. | CURRENT / IMPLEMENTED locally | `202609130008_catalog_foundation.sql` | STATIC EVIDENCE |
| CAT-REQ-003 | Client catalog writes shall be denied; clients may read eligible catalog data. | CURRENT / IMPLEMENTED locally | Catalog RLS/policies | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.9 Project Service Selection

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| CAT-REQ-004 | An authorized project user shall be able to request a selected service offering for a project. | CURRENT / IMPLEMENTED locally | `select_project_service`, organization data helper | STATIC EVIDENCE |
| CAT-REQ-005 | Project-service selection shall validate project ownership, offering availability, duplicate selection, and requested-scope shape. | CURRENT / IMPLEMENTED locally | Selection hardening migration | STATIC EVIDENCE |
| CAT-REQ-006 | Project-service selection shall remain separate from proposal approval, payment, entitlement, and delivery activation. | CURRENT / IMPLEMENTED locally | Selection RPC and lifecycle boundaries | STATIC EVIDENCE |

### 6.10 Proposals

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| COM-REQ-001 | The system shall model a proposal as a commercial negotiation container scoped to an organization and optional project. | CURRENT / IMPLEMENTED locally | Commercial migrations/types | STATIC EVIDENCE |
| COM-REQ-002 | Authorized commercial users shall be able to create, issue, accept, reject, or revise proposals through state-controlled operations. | CURRENT / IMPLEMENTED locally | Proposal RPCs and data helpers | STATIC EVIDENCE; runtime NOT VERIFIED |
| COM-REQ-003 | Proposal validity and expected-version checks shall prevent stale approval or issuance transitions. | CURRENT / IMPLEMENTED locally | Proposal RPCs | STATIC EVIDENCE |

### 6.11 Proposal Versions

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| COM-REQ-004 | Proposal versions shall preserve scope, commercial snapshot, checksum, and version history. | CURRENT / IMPLEMENTED locally | Proposal version schema | STATIC EVIDENCE |
| COM-REQ-005 | Issued or accepted proposal snapshots and proposal items shall not be silently rewritten or deleted. | CURRENT / IMPLEMENTED locally | Commercial immutability trigger | STATIC EVIDENCE |
| COM-REQ-006 | Payment obligations shall reference the accepted current proposal version. | CURRENT / IMPLEMENTED locally | Payment obligation RPC | STATIC EVIDENCE |

### 6.12 Agreements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| COM-REQ-007 | The system shall support an agreement when the approved commercial flow requires one. | CURRENT / IMPLEMENTED locally | Agreement migrations/RPCs | STATIC EVIDENCE |
| COM-REQ-008 | An agreement shall preserve its organization, project, proposal, and source proposal-version relationships. | CURRENT / IMPLEMENTED locally | Agreement remediation migration | STATIC EVIDENCE |

### 6.13 Agreement Acceptance

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| COM-REQ-009 | Agreement acceptance shall record the accepted agreement version, actor, checksum, and idempotency key. | CURRENT / IMPLEMENTED locally | `accept_agreement`, acceptance schema | STATIC EVIDENCE |
| COM-REQ-010 | Agreement acceptance shall reject invalid agreement states and conflicting idempotency reuse. | CURRENT / IMPLEMENTED locally | `202610030003_commercial_boundary_integrity.sql` | STATIC EVIDENCE |

### 6.14 Payment Obligations

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PAY-REQ-001 | A payment obligation shall reference an accepted proposal/current version and an optional accepted active agreement source. | CURRENT / IMPLEMENTED locally | `create_payment_obligation` | STATIC EVIDENCE |
| PAY-REQ-002 | Payment obligations shall preserve amount, currency, purpose, schedule, source snapshots, and idempotency identity. | CURRENT / IMPLEMENTED locally | Obligation schema/RPC | STATIC EVIDENCE |
| PAY-REQ-003 | Payment obligations shall support PENDING, CANCELLED, and EXPIRED states with controlled transitions. | CURRENT / IMPLEMENTED locally | Obligation lifecycle migrations | STATIC EVIDENCE |
| PAY-REQ-004 | Obligation source and monetary fields shall be immutable after creation. | CURRENT / IMPLEMENTED locally | Obligation hardening trigger | STATIC EVIDENCE |

### 6.15 Payment Attempts

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PAY-REQ-005 | A payment attempt shall belong to one payment obligation and match its amount and currency. | CURRENT / IMPLEMENTED locally | `create_payment_attempt` | STATIC EVIDENCE |
| PAY-REQ-006 | Attempts shall preserve CREATED, PROCESSING, FAILED, CANCELLED, and EXPIRED states without inventing additional states. | CURRENT / IMPLEMENTED locally | Attempt schema/RPC | STATIC EVIDENCE |
| PAY-REQ-007 | Failed, cancelled, or expired attempts shall not create settlements. | CURRENT / IMPLEMENTED locally | Settlement RPC | STATIC EVIDENCE |
| PAY-REQ-008 | Attempt source fields shall be immutable and settled attempts shall not later change lifecycle state. | CURRENT / IMPLEMENTED locally | Attempt triggers and `202610030004` | STATIC EVIDENCE |

### 6.16 Payment Provider Boundary

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PAY-REQ-009 | Provider-specific payment behavior shall remain behind a provider-neutral payment service and adapter boundary. | CURRENT / IMPLEMENTED locally | `src/lib/payments/providerAdapter.ts`, `service.ts` | STATIC EVIDENCE |
| PAY-REQ-010 | Missing trusted provider configuration shall fail closed without fabricating checkout URLs or payment success. | CURRENT / IMPLEMENTED locally | Stripe adapter/service | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.17 Payment Settlement

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| SET-REQ-001 | A settlement shall be created only through the trusted settlement RPC after webhook verification and internal correlation. | CURRENT / IMPLEMENTED locally | Stripe Edge Function and settlement RPC | STATIC EVIDENCE; runtime NOT VERIFIED |
| SET-REQ-002 | The external webhook boundary shall accept only verified `checkout.session.completed` events. | CURRENT / IMPLEMENTED locally | `stripe-webhook/index.ts` | STATIC EVIDENCE |
| SET-REQ-003 | Settlement creation shall reject failed, cancelled, or expired attempts and non-pending obligations. | CURRENT / IMPLEMENTED locally | Settlement RPC | STATIC EVIDENCE |
| SET-REQ-004 | Settlement amount and currency shall match the obligation and attempt. | CURRENT / IMPLEMENTED locally | Settlement RPC/webhook | STATIC EVIDENCE |
| SET-REQ-005 | Provider event identity and payment-attempt identity shall be unique for settlement records. | CURRENT / IMPLEMENTED locally | Settlement constraints/RPC | STATIC EVIDENCE |

### 6.18 Entitlements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| ENT-REQ-001 | The trusted settlement-backed path shall create an entitlement only from an existing valid settlement. | CURRENT / IMPLEMENTED locally | `activate_entitlement_from_settlement` | STATIC EVIDENCE |
| ENT-REQ-002 | Entitlement activation shall validate attempt, obligation, proposal/version, agreement/version, project/service, organization, amount, and currency relationships. | CURRENT / IMPLEMENTED locally | Settlement entitlement migration | STATIC EVIDENCE |
| ENT-REQ-003 | Entitlement settlement linkage and source/grant fields shall be immutable, with deterministic idempotency. | CURRENT / IMPLEMENTED locally | Entitlement triggers/constraints | STATIC EVIDENCE |
| ENT-REQ-004 | The legacy direct entitlement activation grant shall remain inaccessible so an unverified payment cannot self-grant entitlement. | CURRENT / IMPLEMENTED locally | `202610030003_commercial_boundary_integrity.sql` | STATIC EVIDENCE |

### 6.19 Delivery Activation

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-001 | Delivery activation shall require an active, non-expired, verified entitlement. | CURRENT / IMPLEMENTED locally | `activate_delivery` | STATIC EVIDENCE |
| DEL-REQ-002 | Delivery activation shall validate organization, project, project service, commercial source, settlement linkage where present, and active catalog relationships. | CURRENT / IMPLEMENTED locally | `202610030002_delivery_activation_integrity.sql` | STATIC EVIDENCE |
| DEL-REQ-003 | Initial delivery activation shall use state ACTIVE and stage IMPLEMENTATION. | CURRENT / IMPLEMENTED locally | Delivery activation schema/RPC | STATIC EVIDENCE |
| DEL-REQ-004 | Browser clients shall not directly create, update, or delete delivery activations. | CURRENT / IMPLEMENTED locally | Delivery RLS/grants | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.20 Implementation

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-005 | Implementation initialization shall require an active delivery activation at IMPLEMENTATION and a matching active entitlement. | CURRENT / IMPLEMENTED locally | `202609150018_implementation_records.sql` | STATIC EVIDENCE |
| DEL-REQ-006 | Implementation initialization shall not be triggered automatically by settlement, entitlement, or delivery activation creation. | CURRENT / IMPLEMENTED locally | Separate RPC boundaries | STATIC EVIDENCE |

### 6.21 Deployment

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-007 | Deployment initialization shall require the approved active implementation/delivery context. | CURRENT / IMPLEMENTED locally | `202609150019_deployment_records.sql` | STATIC EVIDENCE |
| DEL-REQ-008 | Deployment shall remain a separate lifecycle boundary and shall not be initialized by payment or entitlement events. | CURRENT / IMPLEMENTED locally | Deployment RPC boundaries | STATIC EVIDENCE |

### 6.22 Observation

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-009 | Observation initialization shall require the approved active deployment and upstream delivery context. | CURRENT / IMPLEMENTED locally | `202609150020_observation_records.sql` | STATIC EVIDENCE |
| DEL-REQ-010 | Observation shall remain a paid implementation stage and shall not be represented as free support. | CURRENT / IMPLEMENTED locally | Business spec and observation migration | STATIC EVIDENCE |

### 6.23 Stabilization

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-011 | Stabilization initialization shall require an eligible active observation/deployment/implementation context. | CURRENT / IMPLEMENTED locally | `202609150021_stabilization_records.sql` | STATIC EVIDENCE |
| DEL-REQ-012 | Stabilization shall remain a separate stateful lifecycle record with controlled status transitions. | CURRENT / IMPLEMENTED locally | Stabilization migration | STATIC EVIDENCE |

### 6.24 Documentation

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-013 | Documentation records shall be created only from the approved upstream delivery context. | CURRENT / IMPLEMENTED locally | `202609150022_documentation_records.sql` | STATIC EVIDENCE |
| DEL-REQ-014 | Documentation completion shall remain a prerequisite for handover in the lifecycle model. | CURRENT / PARTIALLY IMPLEMENTED | Handover/documentation migrations | STATIC EVIDENCE |

### 6.25 Handover

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-015 | Handover initialization shall require the approved documentation/stabilization delivery context. | CURRENT / IMPLEMENTED locally | `202609150023_handover_records.sql` | STATIC EVIDENCE |
| DEL-REQ-016 | Handover shall remain a separate transition before optional ongoing service. | CURRENT / IMPLEMENTED locally | Handover/ongoing-service migrations | STATIC EVIDENCE |

### 6.26 Ongoing Service

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DEL-REQ-017 | Ongoing service shall be optional and separately represented after handover. | CURRENT / IMPLEMENTED locally | `202609150024_ongoing_service_records.sql` | STATIC EVIDENCE |
| DEL-REQ-018 | Ongoing service shall preserve the approved monthly/annual billing vocabulary without inventing pricing. | CURRENT / PARTIALLY IMPLEMENTED | Ongoing-service schema and business specification | STATIC EVIDENCE; pricing NOT VERIFIED |

### 6.27 Audit Events

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| AUD-REQ-001 | Meaningful organization, project, commercial, payment, entitlement, and delivery transitions shall create correlated audit events where the current migrations define them. | CURRENT / IMPLEMENTED locally | `audit_events` and audit helper functions | STATIC EVIDENCE |
| AUD-REQ-002 | Audit records shall not be directly writable or readable by ordinary authenticated clients where policies prohibit it, and shall not contain credentials or provider secrets. | CURRENT / IMPLEMENTED locally | Audit RLS and audit helper functions | STATIC EVIDENCE; runtime NOT VERIFIED |

### 6.28 Client Platform

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| API-REQ-001 | The authenticated client shall provide organization, project, catalog, commercial, payment-record, entitlement, and delivery-record read surfaces backed by scoped data helpers. | CURRENT / IMPLEMENTED locally | `src/lib/organizations/data.ts`, `PlatformApp.tsx` | STATIC EVIDENCE |
| API-REQ-002 | The client shall present delivery, implementation, deployment, observation, stabilization, handover, and ongoing-service records as read-only where no approved browser mutation control exists. | CURRENT / IMPLEMENTED locally | `PlatformApp.tsx` | STATIC EVIDENCE |
| API-REQ-003 | Client requests shall use stable error states for unavailable, unauthorized, empty, loading, and failure conditions. | CURRENT / PARTIALLY IMPLEMENTED | Platform UI and data helpers | STATIC EVIDENCE; UX runtime NOT VERIFIED |

### 6.29 AI / Automation Boundaries

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| AI-REQ-001 | AI and automation shall assist approved workflows without replacing human governance or high-impact approval responsibilities. | PLANNED | Spec and platform architecture | OWNER/ARCHITECTURE DECISION |
| AI-REQ-002 | Future agent actions shall have explicit tool, permission, scope, approval, and audit boundaries. | PLANNED | Authorization/API/domain documents | NOT IMPLEMENTED |
| AI-REQ-003 | The current payment and lifecycle implementation shall not silently introduce an AI runtime or automatic AI-triggered lifecycle progression. | CURRENT / IMPLEMENTED | Repository scope inspection | STATIC EVIDENCE |

### 6.30 Error and Failure Handling

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| API-REQ-004 | The system shall reject invalid authentication, authorization, tenant, state, source, and idempotency conditions without creating partial lifecycle records. | CURRENT / PARTIALLY IMPLEMENTED locally | RPC validation and RLS | STATIC EVIDENCE; runtime NOT VERIFIED |
| API-REQ-005 | Invalid webhook signatures, missing Stripe configuration, unsupported event types, and missing correlation metadata shall fail safely. | CURRENT / IMPLEMENTED locally | Stripe Edge Function | STATIC EVIDENCE; runtime NOT VERIFIED |
| API-REQ-006 | Inactive or unreachable infrastructure shall be represented as deferred or blocked evidence, not as successful runtime behavior. | CURRENT / OPERATING REQUIREMENT | Documentation architecture and phase evidence | STATIC EVIDENCE |

## 7. Commercial Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| COM-REQ-011 | Commercial scope shall be represented through proposal versions and item snapshots rather than silently changing an approved baseline. | CURRENT / IMPLEMENTED locally | Commercial schema/triggers | STATIC EVIDENCE |
| COM-REQ-012 | The commercial model shall support one-time implementation and optional ongoing service after handover. | CURRENT / PARTIALLY IMPLEMENTED | Spec and lifecycle migrations | STATIC EVIDENCE |
| COM-REQ-013 | The software shall preserve USD as the current payment currency context. | CURRENT / IMPLEMENTED locally | Payment migrations | STATIC EVIDENCE |
| COM-REQ-014 | Monthly ongoing service is the primary recurring model and annual service is optional where approved. | CURRENT / PARTIALLY IMPLEMENTED | Spec and ongoing-service schema | STATIC EVIDENCE; pricing NOT VERIFIED |
| COM-REQ-015 | Repeat purchases, partial purchases, multiple services in one proposal, multiple explicitly scoped projects, and custom approved scope shall not mutate historical approved records. | CURRENT / PARTIALLY IMPLEMENTED | Spec, proposal items, payment obligation validations | STATIC EVIDENCE |
| COM-REQ-016 | The system shall not invent prices, deposit percentages, tax rules, refund promises, or accounting rules. | CURRENT / OPERATING REQUIREMENT | Decision registers and scope constraints | STATIC EVIDENCE |

## 8. Payment Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| PAY-REQ-011 | Checkout creation shall use server-authoritative obligation/attempt data and stable internal correlation metadata. | CURRENT / IMPLEMENTED locally | Stripe adapter and payment service | STATIC EVIDENCE |
| PAY-REQ-012 | The webhook shall preserve the raw request body and require valid Stripe signature verification before trusting event data. | CURRENT / IMPLEMENTED locally | `stripe-webhook/index.ts` | STATIC EVIDENCE |
| PAY-REQ-013 | Only verified `checkout.session.completed` shall enter the current settlement path; other verified event types shall be safely ignored. | CURRENT / IMPLEMENTED locally | Stripe Edge Function | STATIC EVIDENCE |
| PAY-REQ-014 | Authenticated browser clients shall not create or mutate payment settlements. | CURRENT / IMPLEMENTED locally | Settlement grants/RLS | STATIC EVIDENCE |
| PAY-REQ-015 | Duplicate webhook delivery shall not create duplicate settlement records. | CURRENT / IMPLEMENTED locally | Provider-event uniqueness and RPC conflict handling | STATIC EVIDENCE; runtime NOT VERIFIED |
| PAY-REQ-016 | Live Stripe Checkout, webhook delivery, and settlement runtime behavior shall not be represented as verified without actual configured execution. | CURRENT / DEFERRED | Phase 15.6 report | NOT VERIFIED |

## 9. Delivery Lifecycle Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| REL-REQ-001 | The software shall respect the sequence Catalog -> Service Selection -> Proposal -> Acceptance -> Agreement when required -> Payment -> Entitlement -> Delivery Activation -> downstream delivery lifecycle. | CURRENT / IMPLEMENTED locally | Spec and migration chain | STATIC EVIDENCE |
| REL-REQ-002 | Settlement shall remain distinct from entitlement, and entitlement shall remain distinct from delivery activation. | CURRENT / IMPLEMENTED locally | 202610030001/002 | STATIC EVIDENCE |
| REL-REQ-003 | No unauthorized browser/client shortcut shall initialize a required downstream stage. | CURRENT / IMPLEMENTED locally | RLS, grants, RPC boundaries | STATIC EVIDENCE; runtime NOT VERIFIED |
| REL-REQ-004 | Ongoing service shall require the approved handover condition and remain separately paid and optional. | CURRENT / PARTIALLY IMPLEMENTED | Ongoing-service migration and spec | STATIC EVIDENCE; runtime NOT VERIFIED |

## 10. Authorization and Security Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| SEC-REQ-001 | Every tenant-owned read and mutation shall resolve organization ownership and applicable project access. | CURRENT / IMPLEMENTED locally | RLS policies and RPC checks | STATIC EVIDENCE |
| SEC-REQ-002 | Client-controlled organization, project, obligation, attempt, settlement, entitlement, and delivery IDs shall not be treated as authorization by themselves. | CURRENT / IMPLEMENTED locally | Trusted RPC relationship checks | STATIC EVIDENCE |
| SEC-REQ-003 | Protected RPCs shall use `SECURITY DEFINER` only where needed and fix their `search_path`. | CURRENT / IMPLEMENTED locally | Migration functions | STATIC EVIDENCE |
| SEC-REQ-004 | Browser clients shall not receive service-role, Stripe secret, webhook secret, or other privileged credentials. | CURRENT / IMPLEMENTED locally | Server-only adapter/function environment boundaries | STATIC EVIDENCE |
| SEC-REQ-005 | RLS shall deny direct client writes to protected commercial, payment, entitlement, delivery, and audit records. | CURRENT / IMPLEMENTED locally | RLS policies | STATIC EVIDENCE; runtime NOT VERIFIED |
| SEC-REQ-006 | Anonymous execution of trusted payment, entitlement, delivery, and audit operations shall be denied. | CURRENT / IMPLEMENTED locally | Function grants | STATIC EVIDENCE |
| SEC-REQ-007 | OWNER-only commercial/lifecycle operations shall remain protected by server-side role checks. | CURRENT / IMPLEMENTED locally | `private.commercial_owner` and lifecycle RPCs | STATIC EVIDENCE; runtime NOT VERIFIED |
| SEC-REQ-008 | Security controls shall be verified against actual policies, functions, grants, and runtime evidence rather than documentation alone. | CURRENT / OPERATING REQUIREMENT | Documentation architecture | STATIC EVIDENCE |

## 11. Data Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| DATA-REQ-001 | The data model shall preserve organization ownership paths for tenant records and project ownership paths for project records. | CURRENT / IMPLEMENTED locally | Migrations and RLS | STATIC EVIDENCE |
| DATA-REQ-002 | Historical proposal, agreement, payment, entitlement, delivery, and audit source relationships shall be immutable where defined by the migrations. | CURRENT / IMPLEMENTED locally | Immutable triggers | STATIC EVIDENCE |
| DATA-REQ-003 | Financial and lifecycle snapshots shall preserve amount/currency/source context needed for later reconciliation. | CURRENT / IMPLEMENTED locally | Proposal/payment/settlement snapshots | STATIC EVIDENCE |
| DATA-REQ-004 | Database changes shall be append-only migrations with explicit RLS, grants, constraints, and rollback/recovery consideration. | CURRENT / OPERATING REQUIREMENT | Migration map and current migration practice | STATIC EVIDENCE |

## 12. Integration Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| API-REQ-007 | Supabase shall provide the configured browser client boundary and the server-side database/auth integration boundary. | CURRENT / PARTIALLY IMPLEMENTED | `src/lib/supabase/`, migrations | STATIC EVIDENCE; remote NOT VERIFIED |
| API-REQ-008 | Stripe shall be isolated behind the provider adapter and trusted webhook boundary. | CURRENT / IMPLEMENTED locally | `src/lib/payments/`, Edge Function | STATIC EVIDENCE |
| API-REQ-009 | The system shall distinguish integration implemented, configured, deployed, runtime verified, and deferred states. | CURRENT / OPERATING REQUIREMENT | Documentation architecture | STATIC EVIDENCE |

## 13. Non-Functional Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| NFR-REQ-001 | The system shall fail closed on missing provider configuration, invalid authorization, invalid lifecycle state, and invalid webhook signature. | CURRENT / IMPLEMENTED locally | RPCs, RLS, webhook | STATIC EVIDENCE |
| NFR-REQ-002 | The system shall preserve tenant isolation and immutable commercial history under retries and conflicting requests. | CURRENT / IMPLEMENTED locally | Constraints, locks, triggers | STATIC EVIDENCE |
| NFR-REQ-003 | The repository shall support repeatable typecheck, lint, and production build validation. | CURRENT / IMPLEMENTED | `package.json` scripts | VERIFIED LOCALLY in prior validation |
| NFR-REQ-004 | The system shall remain maintainable through provider-neutral boundaries, explicit domain types, and append-only migrations. | CURRENT / PARTIALLY IMPLEMENTED | `src/lib/payments`, organizations domain, migrations | STATIC EVIDENCE |
| NFR-REQ-005 | Production observability, incident response, performance targets, and operational SLOs shall be documented before claiming production readiness. | PLANNED / DEFERRED | Architecture and documentation roadmap | NOT IMPLEMENTED |

## 14. User Experience Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| NFR-REQ-006 | The public site shall present the approved four-pillar positioning and route-driven content where the current pages support it. | CURRENT / PARTIALLY IMPLEMENTED | `src/pages/`, routes, SEO config | STATIC EVIDENCE |
| NFR-REQ-007 | The authenticated platform shall expose organization, project, commercial, entitlement, and delivery records according to the available platform UI. | CURRENT / PARTIALLY IMPLEMENTED | `src/pages/platform/PlatformApp.tsx` | STATIC EVIDENCE; runtime NOT VERIFIED |
| NFR-REQ-008 | Delivery and later lifecycle views shall remain read-only unless an approved existing lifecycle control is provided. | CURRENT / IMPLEMENTED locally | Platform UI and RPC boundary | STATIC EVIDENCE |

## 15. Error, Failure, and Recovery Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| NFR-REQ-009 | Unauthorized and cross-tenant operations shall be rejected without exposing protected tenant data. | CURRENT / IMPLEMENTED locally | RLS/RPC policies | STATIC EVIDENCE; runtime NOT VERIFIED |
| NFR-REQ-010 | Invalid lifecycle transitions and stale expected states shall fail with safe conflicts rather than silently changing state. | CURRENT / IMPLEMENTED locally | Lifecycle RPCs | STATIC EVIDENCE |
| NFR-REQ-011 | Payment failure, expiry, cancellation, invalid signature, duplicate event, and idempotency conflict paths shall fail safely and preserve audit/history. | CURRENT / IMPLEMENTED locally | Payment migrations and webhook | STATIC EVIDENCE; runtime NOT VERIFIED |
| NFR-REQ-012 | An inactive or unreachable Supabase project shall be reported as blocked/deferred rather than treated as successful deployment. | CURRENT / IMPLEMENTED as operating rule | Documentation architecture and phase reports | STATIC EVIDENCE |

## 16. AI and Automation Requirements

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| AI-REQ-004 | AI-assisted workflows shall preserve human governance for strategic, sensitive, and approval responsibilities. | PLANNED | Spec and architecture documents | OWNER/ARCHITECTURE DECISION |
| AI-REQ-005 | Future AI automation shall be scoped to explicit tools, permissions, project boundaries, approvals, and audit records. | PLANNED | Domain/API/authorization documents | NOT IMPLEMENTED |
| AI-REQ-006 | No current AI runtime shall be inferred from marketing content or architecture proposals. | CURRENT / OPERATING REQUIREMENT | Repository inspection | STATIC EVIDENCE |

## 17. External Constraints and Dependencies

| ID | Requirement | Status | Source / implementation | Verification |
|---|---|---|---|---|
| NFR-REQ-013 | The web application shall use the repository's Vite, React, TypeScript, Tailwind/PostCSS, Supabase client, and Stripe package boundaries as currently configured. | CURRENT / IMPLEMENTED | `package.json` and source | STATIC EVIDENCE |
| NFR-REQ-014 | Supabase remote claims shall depend on the linked project being reachable and the migration/function state being explicitly checked. | CURRENT / DEFERRED | Documentation architecture and environment evidence | NOT VERIFIED |
| NFR-REQ-015 | Stripe runtime behavior shall depend on trusted server configuration for `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. | CURRENT / DEFERRED | Stripe adapter/webhook | NOT VERIFIED |

## 18. Out of Scope

| ID | Requirement | Status | Source |
|---|---|---|---|
| BUS-REQ-005 | The current SRS shall not define refunds, disputes, chargebacks, tax, accounting, or subscription execution behavior absent an approved implementation. | OUT OF SCOPE | Phase 15 decisions and implementation reports |
| PAY-REQ-017 | The current SRS shall not add a second payment provider or an additional Stripe event type such as `payment_intent.succeeded`. | OUT OF SCOPE | Current webhook implementation |
| REL-REQ-005 | The current SRS shall not define production-readiness closure, a later phase, or a new lifecycle beyond the documented current boundary. | OUT OF SCOPE | Documentation architecture and phase scope |

## 19. Requirements Traceability Matrix

The requirement tables above are the detailed traceability source. The following compact matrix records the stable ID ranges, evidence source, implementation area, and verification posture.

| ID range | Requirement area | Status posture | Source document | Implementation area | Verification state |
|---|---|---|---|---|---|
| BUS-REQ-001..005 | Business model and scope | Current plus out of scope | V2 spec, decision registers | Pillars, lifecycle, repository policy | STATIC EVIDENCE |
| AUTH-REQ-001..004 | Authentication | Current/partial and planned | Phase 12, authorization/API docs | `src/lib/auth`, Supabase auth boundary | NOT VERIFIED remotely |
| USR-REQ-001..002 | Profiles | Current/partial | Profile migration | `profiles`, auth client | STATIC EVIDENCE |
| ORG-REQ-001..009 | Organizations, membership, invitations | Current | Organization migrations/RBAC docs | `src/lib/organizations`, RPCs | STATIC EVIDENCE |
| PROJ-REQ-001..006 | Projects and project membership | Current/partial | Project migrations/RBAC docs | Project RPCs and data helpers | STATIC EVIDENCE |
| CAT-REQ-001..006 | Catalog and service selection | Current | Catalog migrations | Catalog/project-service RPCs | STATIC EVIDENCE |
| COM-REQ-001..016 | Proposals, agreements, commercial rules | Current/partial | Decision registers, commercial migrations | Commercial RPCs/data helpers | STATIC EVIDENCE |
| PAY-REQ-001..017 | Payment obligations, attempts, provider boundary | Current/deferred/out of scope | Payment migrations, phase report | `src/lib/payments`, payment RPCs | STATIC EVIDENCE; runtime deferred |
| SET-REQ-001..005 | Settlement | Current/deferred | Settlement migration/webhook | `stripe-webhook`, settlement RPC | STATIC EVIDENCE; runtime NOT VERIFIED |
| ENT-REQ-001..004 | Entitlement | Current | Settlement bridge migrations | Entitlement RPCs/types/data | STATIC EVIDENCE; remote NOT VERIFIED |
| DEL-REQ-001..018 | Delivery and downstream lifecycle | Current/partial | Delivery migrations | Delivery RPCs/types/data/UI | STATIC EVIDENCE; runtime NOT VERIFIED |
| AUD-REQ-001..002 | Audit | Current | Audit migrations/helpers | Audit events and private audit RPCs | STATIC EVIDENCE |
| API-REQ-001..009 | Client/API/integration boundaries | Current/partial | API blueprint and source | Data helpers, adapters, Supabase client | STATIC EVIDENCE |
| SEC-REQ-001..008 | Security and authorization | Current local | Authorization model and migrations | RLS, grants, `SECURITY DEFINER`, triggers | STATIC EVIDENCE; runtime NOT VERIFIED |
| DATA-REQ-001..004 | Data integrity and migration safety | Current | Database blueprint and migrations | Tables, constraints, append-only migrations | STATIC EVIDENCE |
| AI-REQ-001..006 | AI boundaries | Planned/current operating | Spec and architecture docs | No current AI runtime | NOT IMPLEMENTED |
| NFR-REQ-001..015 | Non-functional, UX, errors, dependencies | Current/partial/planned | Package/source/docs | Build scripts, UI, provider boundaries | Local/static; runtime deferred |
| REL-REQ-001..005 | Lifecycle and release scope | Current/partial/out of scope | Spec, journey, migrations | Lifecycle RPCs and migrations | STATIC EVIDENCE |

## 20. Acceptance Criteria

These criteria are objective gates. They are not marked passed unless the stated evidence exists.

| Area | Acceptance criterion | Current evidence |
|---|---|---|
| Authentication and tenant access | Protected reads/writes deny missing, inactive, cross-tenant, or insufficient-role users. | Local RLS/RPC static evidence; runtime test deferred. |
| Commercial history | Issued proposal/agreement snapshots and source payment records cannot be silently rewritten. | Local immutable triggers and constraints. |
| Payment | A failed/cancelled/expired attempt or obligation cannot produce settlement; duplicate provider events are rejected/idempotent. | Local RPC/constraint evidence; live provider test deferred. |
| Entitlement | Only the settlement-backed trusted path can create a settlement-backed entitlement with matching source relationships. | Local migration/RPC evidence; remote/runtime verification deferred. |
| Delivery | Delivery activation requires active valid upstream state and begins at IMPLEMENTATION without creating later records automatically. | Local migration/RPC evidence; runtime verification deferred. |
| Audit | Meaningful lifecycle transitions create correlated audit records without secrets. | Local audit functions/RLS evidence. |
| Build quality | Typecheck, lint, and production build complete successfully. | Previously recorded local validation evidence; this documentation task does not rerun application commands. |
| Remote release | Migration ledger, deployed function state, and runtime behavior are verified in the linked project. | Not verified because Supabase is inactive. |

## 21. SRS Change Control

```text
Business change
  -> SRS review
    -> Architecture review
      -> Code impact review
        -> Database/runtime impact review
          -> Implementation
            -> Verification
              -> Documentation update
                -> Release readiness
```

Requirement IDs must remain stable. Historical requirements must not silently disappear when traceability matters. Changes to pricing, services, roles, lifecycle, payment behavior, or security boundaries require the appropriate approved decision before code or schema changes.

## 22. Current System Requirement Status

### Current implemented or structurally implemented

Identity/profile, organizations, memberships, invitations, projects, project membership, four-pillar catalog, project-service selection, proposal/version/item records, agreement/version/acceptance records, payment obligations, payment attempts, settlement boundary, settlement-backed entitlement activation, delivery activation, downstream delivery record foundations, RLS, trusted RPC boundaries, immutable source fields, idempotency controls, audit helpers, and read-only platform displays are present in local source/migrations.

### Current partially implemented

The authenticated platform UX, project-level role experience, commercial UI workflows, provider checkout runtime, ongoing-service commercial execution, and some API/error contracts have local foundations but incomplete end-to-end runtime evidence or broader workflow coverage.

### Planned

Formal consolidated architecture/engineering/runtime documents, full AI governance/runtime, richer onboarding/requirements/support/monitoring operations, release/runbook systems, and future production operations capabilities remain planned where not implemented in this repository.

### Deferred

Live Stripe checkout/webhook/settlement testing, remote migration verification, remote RLS/grant/function verification, and authenticated runtime identity testing are deferred while trusted provider/runtime infrastructure is unavailable and the Supabase project is inactive.

### Not verified

No claim is made that local migrations are applied to the remote database, that the current Edge Function runtime has processed a live provider event, or that runtime security behavior has passed authenticated negative tests.

### Requires owner decision

Detailed pricing, tax/accounting/refund/dispute policy, recurring billing execution policy, legal agreement variations, and future platform/admin/AI policy decisions remain outside implementation assumptions.

## 23. SRS Change Protocol

```text
Business decision
  -> Architecture decision
    -> Code implementation
      -> Database/runtime implementation
        -> Verification
          -> Documentation update
            -> Release readiness
              -> Release record
```

This SRS is a requirements document. It must not become the architecture decision register, migration ledger, source-code walkthrough, or release record. Those artifacts remain governed by `docs/DOCUMENTATION_ARCHITECTURE.md`.

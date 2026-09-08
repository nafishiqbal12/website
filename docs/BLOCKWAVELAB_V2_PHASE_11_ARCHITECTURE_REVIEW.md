# BlockWaveLab V2 Phase 11 Architecture Review

## Review Status
Final architecture review before Phase 12. Documentation-only review. No application code was modified and Phase 12 was not started.

## A. Executive Summary

Phase 11 provides a strong conceptual foundation for the future BlockWaveLab client platform:
- modular-monolith direction is appropriate
- the four-pillar model is preserved
- the paid implementation lifecycle is correctly defined
- multi-tenancy, project roles, server-side authorization, auditability, AI approval gates, and monitoring boundaries are recognized
- the existing public V2 website is explicitly protected from premature platform work

However, the architecture is not yet implementation-ready for Authentication + User Profiles. The largest issues are not missing feature ideas; they are missing authoritative contracts and state semantics that Phase 12 will depend on:
1. authentication/provider/session ownership is not decided
2. trial behavior is configurable in principle but lacks a complete state machine and policy model
3. RBAC precedence between platform, organization, and project roles is not formalized
4. invitations, sessions, profiles, security events, and auth API contracts are not sufficiently specified
5. lifecycle transition rules and audit/event persistence are described but not modeled concretely
6. business/legal decisions affecting account deletion, retention, ownership transfer, billing access, and support expectations remain unresolved

**Final decision: NOT READY for Phase 12 Authentication + User Profiles.**

Phase 12 can begin planning or a short architecture-hardening subphase, but implementation should wait until the Critical/High findings in section L are resolved.

## B. What Is Correct

### PASS - Business model
- Exactly four pillars are preserved: BUILD, AUTOMATE, OPERATE, GROW.
- One, multiple, or all four pillars can be selected through `project_services`.
- GROW is not reintroduced as the retired crypto marketing agency model.

### PASS - Lifecycle principle
- Implementation → Deployment → Observation → Stabilization → Documentation → Handover → Optional Ongoing Service is consistently represented.
- Observation is explicitly part of the paid implementation engagement and is never described as free support.

### PASS - Architecture direction
- Modular monolith first is appropriate for the current repository and team scale.
- Existing Vite/React/TypeScript public architecture is preserved.
- Provider integrations are placed behind future adapters.
- Monitoring and AI are separated from core project/task data.

### PASS - Security principles
- Server-side authorization is authoritative.
- RLS/tenant policies are recognized as a second enforcement layer.
- Service-role credentials remain server-only.
- Signed URLs, webhook verification, idempotency, rate limiting, audit logs, and AI approval gates are identified.

### PASS - Future platform separation
- Public website, authenticated client area, and internal operations area are separated conceptually.
- Internal-only notes/documents are distinguished from client-visible records.

## C. Missing Functions

### HIGH - Authenticated identity operations are not fully specified
The documents mention authentication, verification, reset, sessions, and MFA readiness but do not define the authoritative provider, session strategy, token/cookie model, profile creation trigger, logout/revocation behavior, account recovery, or auth error contract.

### HIGH - Invitation lifecycle is incomplete
Invitation creation is mentioned, but the complete lifecycle is not defined:
- created
- sent
- viewed
- accepted
- expired
- revoked
- already-member
- email mismatch
- duplicate invitation

### MEDIUM - Organization ownership operations need explicit workflows
Ownership transfer is mentioned, but the required confirmation, pending-owner acceptance, rollback, last-owner protection, and audit sequence need a stateful workflow.

### MEDIUM - Agreements/contracts are unresolved
The architecture says to evaluate agreements/contracts later, but project activation, payment, and handover may require a contract or acceptance artifact. The minimum legal/commercial record is not decided.

### MEDIUM - Client intake/contact boundary is unresolved
The existing `src/api/leads/capture.ts` is explicitly template-grade and non-wired, but the future direct-contact journey depends on a safe intake contract. This is correctly deferred, but Phase 12 should not accidentally build on it.

## D. Missing Edge Cases

### HIGH - Authentication edge cases
Not fully specified:
- duplicate email/account linking
- email verification token replay
- password reset token replay and expiry
- session revocation after password/security change
- concurrent sessions/devices
- account lockout/rate limiting
- provider outage during sign-in
- deleted/suspended profile with active sessions

### HIGH - Organization/invitation edge cases
- invitation accepted by a different email
- invitation accepted after role/org was changed
- invitation revoked while open
- duplicate pending invitations
- owner transfer failure midway
- organization deletion with active projects/subscriptions

### MEDIUM - Project/service edge cases
- project with an approved proposal but no active project service
- service offering retired after selection
- all project services cancelled
- service cancellation while tasks/documents/incidents remain active
- lifecycle transition requested out of order
- concurrent operators attempting different transitions

### MEDIUM - Commercial edge cases
- partial payment or overpayment
- refund/credit application
- invoice voiding
- currency/tax change after proposal approval
- subscription renewal event arriving after cancellation
- duplicate provider webhook with conflicting status

### MEDIUM - Document/support edge cases
- file upload interrupted or malicious
- document version approved while a newer draft exists
- ticket attachment access after membership removal
- internal-only document accidentally referenced by a client endpoint

## E. Security Gaps

### CRITICAL - Auth provider and session security contract is not decided
Phase 12 cannot safely implement authentication without deciding whether Supabase Auth is adopted or another provider is used, where sessions live, how refresh/revocation works, how email verification/reset are configured, and which server boundary validates identity.

### HIGH - RBAC precedence is descriptive, not enforceable
The role matrix lists platform, organization, and project roles but does not define:
- precedence when roles conflict
- whether organization `VIEWER` can have project `PROJECT_MANAGER`
- how role ceilings are calculated
- how platform break-glass access is constrained
- exact permission policy representation

### HIGH - RLS policy ownership is not concrete enough
The database blueprint says RLS is required but does not specify policy predicates, helper functions, service-role boundaries, or negative-test requirements per table. This is dangerous for a multi-tenant Phase 12 foundation.

### HIGH - Account/security event model is missing
Authentication needs a durable security-event model for sign-in, sign-out, verification, reset, MFA changes, failed attempts, session revocation, and suspicious activity. `audit_logs` alone is not enough unless event retention and sensitive-field rules are defined.

### MEDIUM - Secret and file threat model needs detail
The documents correctly prohibit ordinary secret fields and require signed URLs, but do not define malware scanning, file type/size policy, object-key ownership, download authorization, secret rotation, or provider secret storage.

## F. Database Gaps

### HIGH - Authentication support tables are incomplete
The blueprint has `profiles` but does not specify:
- external auth user identifier/provider
- profile deletion/suspension state
- security/session linkage strategy
- verified email state ownership
- user consent/privacy fields where required

### HIGH - Lifecycle event persistence is missing from the table list
The domain model names `ProjectLifecycleEvent`, but the database blueprint does not list a corresponding table. This creates an implementation gap for transition auditability and timeline rendering.

### HIGH - Configuration/policy storage is underspecified
The architecture requires configurable trials, availability, pricing, proposal validity, notification templates, lifecycle rules, and permission policies, but no concrete configuration/policy/version tables are defined.

### MEDIUM - Trial/entitlement records are missing
A configurable 3-day trial needs explicit eligibility, enrollment, start/end, conversion, abuse, and entitlements. No `trial_policies`, `trial_instances`, or equivalent model is named.

### MEDIUM - Refunds/credits and reconciliation are missing
Payments include refund states, but there are no refund, credit, payment-event, reconciliation, or provider-event records.

### MEDIUM - Notification event/template relationships are too compressed
The database list names notification tables but does not define event identity, template version, channel delivery attempt, dedupe key, or user/org/project targeting relationships.

### MEDIUM - Agreements/contracts remain unresolved
If contract acceptance is required before payment/activation, the schema needs an explicit immutable agreement/acceptance model or a documented decision to treat it as a document type.

## G. API Gaps

### CRITICAL - Phase 12 auth API boundary is incomplete
The API blueprint lists identity generally but does not define endpoints/contracts for:
- sign-up/sign-in/sign-out
- email verification
- password reset/change
- session refresh/revocation
- current user/profile
- security events
- auth provider error mapping

### HIGH - Authorization failure contract is missing
The platform needs a consistent distinction between unauthenticated (`401`), authenticated but forbidden (`403`), hidden tenant existence (`404`/safe denial), validation (`400/422`), conflict (`409`), and rate limit (`429`).

### HIGH - Invitation API contract is missing
Create, resend, revoke, accept, list, role-change, duplicate handling, and idempotency behavior need explicit API definitions.

### MEDIUM - File/document APIs are incomplete
The blueprint does not define presigned upload initiation, completion/finalization, download authorization, version creation, virus-scan status, or access event behavior.

### MEDIUM - Lifecycle transition API is incomplete
A generic lifecycle transition endpoint needs allowed-transition validation, optimistic concurrency/version checks, required evidence/approval checks, reason capture, and audit behavior.

### MEDIUM - Catalog/configuration APIs are missing
Internal APIs for managing offerings, policy versions, question definitions, trial rules, notification templates, and availability are necessary before those rules can truly be configurable.

## H. UX/Product Gaps

### HIGH - Account/org creation sequencing is unresolved
The journey allows account creation, organization creation/join, and project creation but does not specify whether a new user must create an organization immediately, can defer it, or can only join by invitation. This affects Phase 12 onboarding and empty states.

### HIGH - Auth UX states are incomplete
The documents list generic UX states but do not specify flows for verification pending, expired verification, reset success, password policy errors, locked account, session expired, provider unavailable, or multi-device session management.

### MEDIUM - Client-facing lifecycle evidence is not defined enough
The documents name exit evidence but do not specify the canonical client timeline, who can approve each gate, how blockers appear, or how internal notes are separated from client-facing findings.

### MEDIUM - Billing access during failure is unresolved
The architecture says access treatment requires business/legal decisions. The client UI needs at least a temporary policy for read access, document access, new work, support, and ongoing operations during failed payment.

### LOW - Organization switcher behavior needs explicit UX rules
The need is recognized, but default organization, last-used organization, unauthorized deep links, and pending invitation visibility are not specified.

## I. Business-Model Gaps

### HIGH - Trial policy is not operationally defined
The trial is configurable in principle but lacks approved decisions for:
- eligible pillars/offers
- whether a trial is per user, organization, project, or service
- whether multiple trials are allowed
- start trigger
- output/deliverables
- conversion behavior
- what happens at expiration
- trial abuse controls

### HIGH - Observation/stabilization commercial treatment needs precise modeling
The documents correctly say observation is paid implementation scope, but do not specify whether it is one proposal line, a required milestone, or a separate fee component, and which approval/payment gate controls it.

### MEDIUM - Ongoing service activation rules need business decisions
The model says ongoing service is optional, but does not define minimum handover acceptance, lead time, proration, renewal notice, pause/resume, or cancellation effective date.

### MEDIUM - Enterprise/custom engagement boundary is vague
The architecture supports custom enterprise but does not define which rules may be negotiated, which controls remain mandatory, or which approvals are needed internally.

## J. Contradictions

### MEDIUM - `ACTIVE` project state versus lifecycle stage
The state machine places `ACTIVE` before `IMPLEMENTATION` and explains that it means commercially activated. The client journey calls “project activation” immediately before implementation. This is workable but should be represented as two explicit fields (`commercial_status` and `delivery_stage`) or renamed to prevent UI/API confusion.

### MEDIUM - Project lifecycle and service lifecycle are not fully separated
The documents define project states and `project_service` statuses, but do not state which transitions are project-wide versus pillar/service-specific. A project can have BUILD in implementation while GROW is only proposed; this needs explicit transition ownership.

### LOW - Platform admin role scope is broad
`SUPER_ADMIN` and `OPERATIONS_ADMIN` are described as platform roles, while the permission matrix allows platform roles to supersede tenant permissions. The exception is acknowledged but needs an explicit break-glass policy and route/data restrictions.

### LOW - Supabase is both candidate infrastructure and a future integration boundary
This is not a technical contradiction, but the decision should be recorded before Phase 12 so auth/database/RLS work does not begin on an assumed provider.

## K. Over-Engineering Risks

### MEDIUM - Too many domains may be mistaken for immediate services
The module list includes monitoring, agents, billing, support, and admin even though they are deferred. Implementation teams may prematurely create tables/routes for all of them.

### MEDIUM - Configurability could become an ungoverned generic rules engine
Trials, lifecycle transitions, pricing, permissions, notifications, and onboarding are all configurable candidates. Each needs bounded schemas and owners; avoid a generic JSON rules engine in V1.

### MEDIUM - Provider abstraction before provider choice
Adapters are correct at the boundary, but excessive abstraction before the first provider is selected may delay Phase 12. Define a narrow provider port only where replacement risk is real.

### LOW - Full contract/agreement domain may be premature
A first implementation may use an immutable agreement document/acceptance record before introducing a full contract subsystem, pending legal requirements.

## L. Required Fixes Before Phase 12

### CRITICAL
1. Decide the Phase 12 identity provider and session architecture: Supabase Auth versus another provider; define browser/server boundary, refresh/revocation, verification/reset, and environment/secrets contract.
2. Define the authoritative server authorization model and RLS policy pattern, including role precedence, permission evaluation, tenant predicates, and negative tests.

### HIGH
3. Add explicit Phase 12 auth database/API contracts for profiles, external auth identity linkage, invitations, sessions/security events, verification, password reset, and membership status.
4. Define invitation state machine and acceptance/duplicate/email-mismatch behavior.
5. Separate `commercial_status` from `delivery_stage`, or formally rename/define `ACTIVE` so it cannot be misread as a delivery stage.
6. Define the configurable trial policy and trial instance/entitlement model, even if trial implementation remains deferred.
7. Add `project_lifecycle_events` and configuration/policy versioning to the database blueprint.
8. Define standard API error/status semantics and auth/authorization endpoint contracts.

### MEDIUM
9. Decide whether agreements are first-class records or immutable document acceptances.
10. Define security-event retention and sensitive-field redaction.
11. Define minimum file/document upload and signed-URL security controls.
12. Define organization creation/defer/join UX and billing-failure access policy.

## M. Optional Future Improvements

- Add formal architecture decision records for provider selection, session model, RLS strategy, and agreement representation.
- Add sequence diagrams for signup, invitation acceptance, organization switching, proposal approval, payment webhook reconciliation, and lifecycle transitions.
- Add a machine-readable state-transition matrix once implementation begins.
- Add a threat model and abuse-case catalog before public auth launch.
- Add data classification and retention matrix for profiles, documents, payments, support, audit, AI, and monitoring data.
- Add contract tests for provider adapters and webhook idempotency.
- Add a permission-policy test fixture that generates positive and negative matrix cases.

## N. Final Readiness Score

**Score: 68/100**

Score rationale:
- Business model/lifecycle alignment: 16/16
- Domain/service/project concepts: 14/18
- Multi-tenancy/RBAC/security principles: 13/20
- Database/API implementability: 10/18
- Client UX/journey completeness: 8/12
- Operations/audit/recovery readiness: 7/10
- Provider/configuration decisions: 0/6 because key Phase 12 provider/session decisions remain unresolved

## Final Phase 12 Decision

**NOT READY**

BlockWaveLab V2 architecture is not ready for Phase 12 Authentication + User Profiles implementation yet.

Reasons:
1. The identity provider and session architecture are not selected.
2. The server-side authorization/RLS pattern and role precedence are not concrete enough to implement safely.
3. Auth-specific database and API contracts are incomplete.
4. Invitation and membership edge cases lack a defined state machine.
5. Project commercial status versus delivery stage needs separation before auth-dependent workspace permissions are built.

The architecture is ready for a short Phase 11 hardening decision step, not for production auth code. Once the Critical and High fixes in section L are documented and approved, Phase 12 can begin without changing the public V2 foundation.

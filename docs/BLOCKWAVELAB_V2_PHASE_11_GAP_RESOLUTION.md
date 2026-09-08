# BlockWaveLab V2 Phase 11.1 Gap Resolution

## Review Scope
This document resolves the implementation-blocking findings from [BLOCKWAVELAB_V2_PHASE_11_ARCHITECTURE_REVIEW.md](docs/BLOCKWAVELAB_V2_PHASE_11_ARCHITECTURE_REVIEW.md). It is documentation-only. No application source code, authentication, Supabase configuration, database migration, payment integration, AI backend, or monitoring backend was created.

## Executive Summary

Phase 11.1 converts the Phase 11 conceptual architecture into implementation contracts sufficient to begin Phase 12 Authentication + User Profiles safely.

Resolved at architecture level:
- planned identity provider and session boundary
- authentication flows and security events
- explicit server-side authorization algorithm and RLS strategy
- role precedence and tenant isolation
- invitation and membership state machines
- separation of commercial status from delivery stage
- configurable trial policy, trial instances, and entitlements
- persistent lifecycle/service events
- missing database aggregates and relationships
- authentication, invitation, lifecycle, document, and standard error API contracts
- document/invitation security boundaries
- AI approval and kill-switch boundary
- configuration/policy ownership and versioning
- failure/recovery behavior

Remaining items are product/legal decisions or implementation-time verification, not unresolved architecture blockers.

## Findings From Architecture Review

| Severity | Finding | Resolution |
|---|---|---|
| CRITICAL | Identity provider/session model undecided | Supabase Auth with PKCE is the planned provider boundary; application authorization remains server/RLS-owned. |
| CRITICAL | Auth API boundary incomplete | Auth operations, safe errors, session lifecycle, verification, reset, and recovery are now defined. |
| HIGH | RBAC precedence not enforceable | Deny-by-default algorithm and independent organization/project ceilings are defined. |
| HIGH | RLS pattern too abstract | Membership predicates, project scope, service-role boundary, and negative tests are defined. |
| HIGH | Invitation state behavior incomplete | Exact invitation/membership states and transition actors are defined. |
| HIGH | Auth database contracts incomplete | Auth identities, security events, invitations, sessions boundary, and membership states are defined. |
| HIGH | Project commercial/delivery state ambiguity | Separate `commercial_status` and `delivery_stage` are now mandatory. |
| HIGH | Trial model incomplete | Versioned policy, instance, entitlement, lifecycle, timezone, and abuse behavior are defined. |
| HIGH | Lifecycle event persistence missing | Project/service lifecycle event records are added to the conceptual schema. |
| MEDIUM | Policy/configuration storage missing | Bounded versioned policy records are added; no generic rules engine is proposed. |
| MEDIUM | Refunds/credits/reconciliation missing | Refund, credit, and payment-event records are added. |
| MEDIUM | Document/invitation API gaps | Upload/download authorization, invitation operations, idempotency, and audit are defined. |

## Resolved Findings

All Critical and High findings from the review have an architecture-level resolution. Medium findings affecting Phase 12 boundaries are also resolved sufficiently for implementation planning. Product/legal choices that do not block identity implementation remain explicitly deferred.

## Authentication Decision

### Planned provider
Use **Supabase Auth** as the planned identity provider because:
- `@supabase/supabase-js` is already present in the repository.
- Supabase Auth can provide email/password, verification, reset, session management, and future OAuth boundaries.
- The planned database boundary already requires PostgreSQL/RLS/Storage-like capabilities.

This is a planned provider decision, not an implementation. No Supabase project, keys, environment variables, client, schema, or deployment configuration is created in Phase 11.1.

### Authentication flows
- Email/password signup.
- Email/password sign-in.
- Email verification with single-use expiring provider flow.
- Password reset/change through single-use expiring provider flow.
- Account recovery with safe responses that do not reveal account existence.
- Logout of current session.
- Security-sensitive changes revoke current/all sessions according to policy.
- Future OAuth/social login is an adapter boundary; it maps provider identity to one application profile and never bypasses organization authorization.

### Frontend/backend boundary
- Frontend invokes the approved auth client boundary and displays state.
- Auth provider validates credentials and issues/rotates sessions.
- Backend validates access tokens and resolves application profile/memberships.
- Backend/RLS authorizes all tenant data.
- Frontend guards are UX only.

## Session Architecture

- Browser session uses Supabase Auth with PKCE.
- Access/refresh behavior is provider-managed through the approved client boundary.
- Backend validates the access token for every authenticated request.
- Logout revokes the current session; password reset/security changes trigger session invalidation according to policy.
- Session expiry produces a safe reauthentication flow; only safe/idempotent reads may be retried.
- Concurrent sessions are represented by provider sessions/security events; future UI may list/revoke sessions.
- Service-role credentials are server-only and never included in frontend bundles.

## Authorization Algorithm

For every request:
1. Validate provider access token and resolve `auth_identity` and profile.
2. Reject unauthenticated, expired, revoked, or inactive identities with `401`.
3. Resolve organization/project ownership from the requested resource, not only request body/header IDs.
4. Require `organization_members.status = ACTIVE`.
5. If project-scoped, require active project membership unless an explicit organization-admin policy grants project administration.
6. Compute organization-role ceiling and project-role permissions separately.
7. Intersect requested action with ownership, membership, role, policy, and resource state.
8. Deny by default.
9. Return `403` for known-but-forbidden access or a safe `404` when tenant existence must be hidden.
10. Validate state/version/concurrency guards for mutations.
11. Emit an immutable audit/security event for security-sensitive or business state changes.

## RBAC Precedence

- Platform access is a separate audited policy path and does not silently become ordinary organization membership.
- Organization roles define the maximum organization scope available to the user.
- Project roles grant narrower project permissions only within an active organization membership.
- A project role cannot grant organization settings, membership management, or billing access.
- A restrictive organization state, such as suspended membership, overrides all project roles.
- A project membership does not create access to sibling projects.
- If multiple organization memberships exist, permissions are evaluated independently per active organization context.
- No permission is granted by the union of unrelated organizations.

Examples:
- Organization Admin + Project Member: organization administration is allowed by organization policy; project actions are limited to project-member capabilities.
- Organization Member + Project Manager: project management is allowed only for assigned projects; organization settings, membership, and billing remain denied.
- Organization Viewer + Project Contributor: contributor actions are limited to the assigned project; no organization-wide edit access.
- Suspended membership: all tenant/project data is denied except narrowly defined account/invitation recovery surfaces.

## Invitation State Machine

States:
`CREATED → PENDING → VIEWED → ACCEPTED`

Terminal alternatives:
- `EXPIRED`
- `REVOKED`
- `DECLINED`

Transitions:
- Owner/Admin creates invitation: `CREATED → PENDING`.
- Delivery/view tracking: `PENDING → VIEWED`.
- Intended authenticated email accepts: `VIEWED/PENDING → ACCEPTED` and creates `ACTIVE` membership.
- Invited user declines: `PENDING/VIEWED → DECLINED`.
- Expiry job/provider policy: `PENDING/VIEWED → EXPIRED`.
- Owner/Admin revokes: `PENDING/VIEWED → REVOKED`.

Rules:
- Token is hashed, single-use, expiring, and bound to organization, role, and intended email.
- Email mismatch fails closed unless an explicit secure account-linking policy is approved.
- Duplicate pending invitation is idempotently returned or rejected by policy.
- Acceptance is audited and cannot create duplicate membership.

## Membership State Machine

States:
`PENDING → ACTIVE → SUSPENDED → REMOVED`

- `PENDING`: invitation accepted or membership creation awaiting required activation.
- `ACTIVE`: normal authorization eligible.
- `SUSPENDED`: organization owner/admin or platform policy temporarily denies tenant access.
- `REMOVED`: membership terminated; historical audit remains.

Rules:
- Owner/Admin may activate/suspend/remove organization members under policy.
- Project membership can be created/removed by organization admin or authorized project manager without changing organization membership.
- Last-owner removal is blocked until another owner accepts ownership.
- Removed/suspended membership is checked server-side on every request.

## Commercial State Machine

Commercial state is separate from delivery stage.

### Organization/project service commercial states
`REQUESTED → QUOTED → APPROVED → PAYMENT_REQUIRED → ACTIVE → PAST_DUE → SUSPENDED → CANCELLED | EXPIRED`

- `REQUESTED`: client or operator requested a service.
- `QUOTED`: quote/proposal exists.
- `APPROVED`: client approved an immutable proposal version.
- `PAYMENT_REQUIRED`: activation is blocked pending required payment.
- `ACTIVE`: commercial entitlement is active.
- `PAST_DUE`: renewal/payment failure is unresolved.
- `SUSPENDED`: service access/work is restricted under approved policy.
- `CANCELLED`: intentionally terminated.
- `EXPIRED`: time-bounded offering/trial/term ended without continuation.

### Payment states
`PENDING → PROCESSING → PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED | CANCELLED`

### Subscription states
`TRIALING → ACTIVE → PAST_DUE → PAUSED → CANCELLED | EXPIRED`

A project may be commercially `ACTIVE` while its delivery stage is `IMPLEMENTATION`. No commercial state transition automatically implies a delivery transition without an explicit policy/actor.

## Trial Model

The business default is a configurable three-calendar-day trial, not a hard-coded application constant.

### Policy
`trial_policies` define:
- policy version and owner
- duration in calendar/time units
- timezone rule
- eligible pillars/offerings
- organization/user/project eligibility scope
- maximum trial count
- required qualification/output
- conversion path
- entitlement limits
- expiration behavior
- effective dates

### Instance
`trial_instances` record:
- policy version
- user/organization/project/service subject
- eligibility decision
- start timestamp
- calculated end timestamp
- timezone/reference clock
- state
- conversion/cancellation/expiration timestamps
- abuse/risk flags

### States
`ELIGIBLE → STARTING → ACTIVE → CONVERTED | CANCELLED | EXPIRED | REVOKED`

### Rules
- Eligibility is evaluated server-side and recorded.
- Start occurs only after qualification and explicit start action/policy trigger.
- End is calculated from policy, using one canonical clock (UTC) plus recorded business timezone.
- A trial grants only explicitly configured entitlements; it does not grant unrestricted production rollout or ongoing support.
- Conversion creates/links a proposal/commercial path; it does not silently activate paid service.
- Expiration removes trial entitlements and preserves records.
- Repeat trials are blocked by policy scope and historical instances.
- Abuse controls include rate limits, identity/org history, invitation limits, and operator review flags.

## Project/Delivery State Machine

Commercial status and delivery stage are separate fields.

Delivery stages:
`DRAFT → ONBOARDING → SCOPING → IMPLEMENTATION → DEPLOYMENT → OBSERVATION → STABILIZATION → DOCUMENTATION → HANDOVER → ONGOING_SERVICE`

Side states:
- `PAUSED`
- `COMPLETED`
- `CANCELLED`
- `ARCHIVED`

Guards:
- Implementation requires accepted scope, required onboarding, commercial activation, and assigned owner.
- Deployment requires implementation acceptance, readiness criteria, rollback plan, and approval.
- Observation begins only after accepted deployment.
- Stabilization requires observation findings or an explicitly recorded operational issue.
- Documentation requires required artifacts and change history.
- Handover requires documentation gate and ownership/acceptance record.
- Ongoing service requires explicit commercial continuation after handover.
- Invalid transitions return conflict and create no state change.
- Cancellation/pause requires authorized actor, reason, effective date, and impact policy.
- Change requests create scope/commercial review and do not mutate approved baseline silently.

## Lifecycle Event Model

Immutable `project_lifecycle_events` and `service_lifecycle_events` capture:
- event ID/type
- actor identity and actor role
- organization/project/project-service
- previous state and new state
- reason
- evidence/document/approval references
- timestamp
- correlation/request ID
- policy version
- safe metadata

Original event payload, actor, state values, and timestamp are immutable. Processing metadata such as delivery/notification attempts may be mutable. Retention, PII redaction, and deletion exceptions are policy-controlled.

## Database Contract Changes

Add or explicitly model:
- `auth_identities`
- `security_events`
- invitation state fields and transition history
- membership state fields
- `project_lifecycle_events`
- `service_lifecycle_events`
- separate project `commercial_status` and `delivery_stage`
- `trial_policies`, `trial_instances`, `entitlements`
- `agreements`, `agreement_acceptances`
- `refunds`, `credits`, `payment_events`
- `policy_versions`
- notification event/template/delivery dedupe relationships

RLS contract:
1. Resolve provider subject to profile.
2. Require active organization membership.
3. Require project membership for project rows unless explicit org-admin policy applies.
4. Repeat ownership predicates in RLS.
5. Keep service-role access server-only.
6. Require negative cross-tenant tests before API exposure.

## API Contract Changes

### Auth
- Signup/sign-in/sign-out, current profile, verification, reset/change password, recovery, session revoke.
- Actor: public/authenticated as appropriate.
- Failures: safe `401`, validation `422`, rate limit `429`, generic provider failure with correlation ID.
- Audit: security event for outcome and actor/session metadata.

### Invitations/memberships
- Create/resend/revoke/accept/decline/list invitations.
- Change/suspend/remove membership.
- Actor: Owner/Admin or intended invited user.
- Failures: expired/revoked/email mismatch/duplicate/permission conflict.
- Idempotency: create/accept/revoke operations.
- Audit: all state transitions.

### Projects/services/onboarding
- Create project, select service offering, start/submit onboarding, add project member.
- Authorize organization role/project role according to matrix.
- Output includes current version/status; conflicts use `409`.

### Proposals/commercials
- Create proposal version, send, view, request changes, approve/reject, create invoice, reconcile payment, activate entitlement.
- Approved versions are immutable; approval/payment operations are idempotent and audited.

### Lifecycle
- Request transition with expected current version, target state, reason, evidence IDs, and optional client approval.
- Server validates allowed transition and guards, persists event, then emits notifications.

### Documents
- Create upload intent, finalize upload, create version, authorize download, archive/delete request.
- Server verifies project/visibility access, file policy, scan status, and signed URL scope.

### Notifications/support/audit
- Scoped feed/preferences, ticket/message operations, event/audit reads for authorized operators.
- Internal-only records never appear in client endpoints.

Standard failures:
- `401` unauthenticated
- `403` authenticated but forbidden
- safe `404` hidden tenant/resource
- `409` state/version/idempotency conflict
- `422` business validation
- `429` rate limit
- `5xx` safe provider/server error

## Policy/Configuration Model

Use bounded versioned `policy_versions` records for:
- trial duration/eligibility/entitlements
- invitation expiry and role limits
- onboarding questions and required answers
- lifecycle guards/required approvals
- service availability and offering versions
- proposal validity and billing intervals
- notification templates/preferences
- file limits/retention
- support priorities/escalation
- role/action grants

Each policy has type, version, schema-validated payload, owner, status, effective dates, approval/audit metadata. Do not build a generic executable rules engine.

## Security Decisions

- Supabase Auth with PKCE is the planned identity boundary; no runtime configuration is created now.
- Server-side authorization and RLS are mandatory and deny by default.
- Auth/security events are separate from ordinary business audit records where retention/redaction differ.
- Invitations are hashed, expiring, single-use, email-bound, and rate-limited.
- Private document access uses scoped signed URLs; upload size/type/scan rules are required.
- Webhooks require signature verification, replay protection, idempotency, and async reconciliation.
- Secrets are server/provider-managed and never ordinary onboarding fields or frontend environment values.
- Privileged admin actions require explicit policy, confirmation, reason, and audit event.

## AI Safety Boundary

AI actions are authorized by organization → project → agent → tool permission. Agents receive only allowlisted tools and scoped data. Sensitive credentials are isolated from prompts/execution context. Strategic, financial, security-critical, destructive, or approval-required actions require human approval. Every execution records actor/agent, policy version, tool/action, input/output references, result, approval, failure, and correlation ID. A project/org kill switch disables execution and future retries. Failures fail closed and remain auditable.

## Failure/Recovery Model

- Partial signup: provider state remains recoverable; application profile creation is idempotent and resumable.
- Expired session: safe reauthentication; preserve only safe local drafts.
- Duplicate invitation: idempotent result or explicit conflict; no duplicate active membership.
- Payment failure: no new activation; preserve read access according to approved policy; notify and reconcile.
- Webhook retry/duplicate event: provider event ID/idempotency record prevents duplicate effects.
- Lifecycle race: optimistic version check returns `409`; only one transition commits.
- Deleted organization: block deletion while dependencies exist; archive/retention policy applies.
- Removed member: immediate server denial; existing signed URLs expire/revoke by policy.
- Abandoned project: remains in defined dormant/paused state; retention job is policy-controlled.
- Failed handover: remain in documentation/handover blocker state; ongoing service cannot silently activate.
- Document access failure: safe error, audit event, no storage path leakage.
- Notification failure: retry/dead-letter status; business state does not roll back solely because delivery failed.

## Remaining Risks

- Supabase project/environment and exact session persistence settings still require implementation-owner approval.
- Legal/business owners must approve retention, deletion, refund/credit, support, billing-failure, and contract policies.
- RLS and authorization correctness require executable negative tests during Phase 12/13.
- Provider outages and email deliverability require operational runbooks before production.

## Deferred Decisions

- OAuth provider list and account-linking policy.
- MFA enforcement level and recovery-code policy.
- Agreement/e-signature provider versus immutable agreement document.
- Tax/currency/refund/proration/legal terms.
- Data residency and retention durations.
- Enterprise SSO/compliance requirements.

These do not block Phase 12 identity implementation if the identity/security owner approves the documented defaults and records decisions before production rollout.

## Phase 12 Preconditions

Before implementation begins:
1. Approve Supabase Auth/PKCE as the provider boundary.
2. Create an environment/secrets contract without committing values.
3. Approve session persistence, revocation, verification, reset, and recovery defaults.
4. Implement profile/auth-identity linkage design and security-event retention.
5. Implement authorization policy helpers and RLS tests before exposing tenant data.
6. Implement invitation/membership state handling or keep those flows behind a disabled feature boundary.
7. Add architecture decision records for provider and session choices.

## Final Readiness Decision

**READINESS SCORE: 88/100**

**DECISION: READY FOR PHASE 12**

The implementation-blocking architecture findings from the Phase 11 review are resolved at the documentation level. Phase 12 may begin with authentication and user profiles, provided it follows the provider/session/RBAC/RLS contracts above and does not prematurely implement billing, AI runtime, monitoring, or client-platform domains outside its scope.

# BlockWaveLab V2 API Blueprint

## Boundary
Phase 11 defines service boundaries only. No API routes, handlers, webhooks, jobs, or provider integrations are implemented.

## Public API
- Public catalog/pillar content.
- Public resource metadata.
- Health/readiness endpoint when backend exists.
- Contact/intake endpoint only after a real serverless contract is approved.

## Authenticated API Domains

### Identity
- signup/sign-in/sign-out, current profile, sessions, verification, password reset/change, account recovery, MFA readiness.
- `401` means unauthenticated/expired/revoked; safe error mapping must not reveal account existence.

### Organizations
- organization CRUD, memberships, invitations, role changes, active context.
- Invitation operations: create/resend/revoke/accept/decline/list with email binding, expiry, idempotency, and audit events.

### Projects
- project CRUD, membership, lifecycle transitions, stage history.

### Catalog/Services
- pillars/services/offerings read; project service request/activation workflows.

### Onboarding
- session creation, question definitions, answer save/submit, completion review.

### Requirements/Proposals
- requirement CRUD, acceptance criteria, comments, change requests, proposal versions, approve/reject.

### Commercials
- quotes, invoices, payment status, subscriptions, service activation. Provider references are server-only.
- Trial policy/instance and entitlement reads are server-authoritative; client cannot extend or self-grant entitlement.

### Delivery
- milestones, tasks, dependencies, deliverables, documents, approvals.

### Notifications/Support
- notification feed/preferences, tickets, messages, attachments.

### Future Monitoring/Agents
- monitors/incidents/alerts and agent config/execution/approval, behind separate permission gates.

## Admin API
Separate route namespace and authorization policy for catalog, organizations, projects, proposals, delivery, support, monitoring, agents, notifications, audit, and system settings.

## Webhooks
Provider webhooks must:
- verify signatures
- enforce timestamp/replay protection
- use idempotency keys
- persist raw event reference without secrets
- return quickly and process asynchronously
- create audit/reconciliation events

Likely future webhook domains: payment, email, monitoring, AI provider.

## Background Jobs
- notification delivery/retry
- proposal expiry
- invoice/subscription reconciliation
- document processing
- incident correlation
- AI execution and approval timeout

## API Rules
- Validate input at boundary with versioned schemas.
- Authorize tenant/project access server-side before reads and writes.
- Paginate all list endpoints.
- Use optimistic concurrency/version checks for proposals, requirements, and documents.
- Return stable error codes plus safe messages.
- Never expose service-role credentials or provider secrets.
- Log correlation IDs and business audit events separately from technical logs.

## Standard Failure Contract

- `401`: missing, expired, revoked, or invalid authentication.
- `403`: authenticated but not permitted by membership/role/policy.
- `404`: resource not found or tenant existence intentionally hidden.
- `409`: state/version/idempotency conflict.
- `422`: valid request shape but business validation failed.
- `429`: rate limit or abuse-control response.
- `5xx`: safe generic server/provider failure with correlation ID.

## Important Operation Contracts

| Operation | Actor/authorization | Input/output | Failure/audit |
|---|---|---|---|
| Signup/sign-in | public/provider boundary | credentials/provider proof → session state | rate-limit, safe errors, security event |
| Create invitation | Owner/Admin | org, email, role → invitation ID/state | duplicate/limit conflict, audit |
| Accept invitation | authenticated matching user | token → membership | expired/revoked/email mismatch, audit |
| Create project | Owner/Admin/authorized PM | org/project input → project | membership/validation conflict, audit |
| Select service | authorized project/org actor | offering IDs → project-service request | unavailable/duplicate conflict, audit |
| Submit onboarding | project member/PM | versioned answers → completion state | validation/version conflict, audit |
| Approve proposal | authorized client approver | proposal version ID → immutable approval | expired/version/state conflict, audit |
| Transition lifecycle | authorized operator/client gate actor | expected version, next state, evidence → event | invalid transition/concurrency conflict, audit |
| Upload document | authorized project actor | upload intent/version metadata → signed upload | type/size/access failure, access event |
| Read notification/support | authenticated member | cursor/filter → scoped records | tenant denial, access audit where sensitive |
| Execute AI action | agent policy + project scope | tool/action request → execution/approval state | denied/approval required/failure, audit |

## Idempotency
Required for payments, proposal approval, service activation, lifecycle transitions, invitations, and webhook processing. Duplicate events must be safe and observable.

# BlockWaveLab V2 Platform Architecture

## Status
Phase 11 architecture proposal. Planning only. No authenticated platform, backend, payment, AI runtime, monitoring engine, or admin implementation is included in this phase.

## A. Repository Audit Summary

### Current verified foundation
- Vite 7 + React 18 + TypeScript SPA.
- Custom browser-history router in `src/routes/router.tsx` and `src/routes/routeConfig.ts`.
- Route-driven metadata and JSON-LD in `src/routes/seoConfig.ts` and `src/routes/router.tsx`.
- Tailwind 3/PostCSS styling with Phase 5 shared primitives under `src/components/ui` and shells under `src/components/shells`.
- MDX content pipeline for blog and case studies.
- Netlify SPA deployment baseline and GitHub Actions CI for lint, typecheck, and build.
- OG and sitemap generation scripts run as part of the build.
- `@supabase/supabase-js` is installed, but no Supabase client, environment contract, schema, auth flow, RLS policy, or active integration exists.
- `src/api/leads/capture.ts` is a template-grade, non-wired handler with Next.js/Express comments and placeholder CRM/database behavior. It is not a production backend contract.

### Reusable infrastructure
- Existing public shell, design primitives, SEO, OG, sitemap, MDX, and CI/build pipeline.
- Existing `types.ts` is too generic and legacy-shaped for the platform domain; future platform types should be introduced in a dedicated domain module rather than overloading it.
- Existing `StateViews`, `Field`, `Modal`, `Alert`, `Button`, `Card`, `Grid`, and shell primitives are suitable for future authenticated UI.

### Must not change in Phase 11
- Public four-pillar business model: BUILD, AUTOMATE, OPERATE, GROW.
- Public route behavior and SEO baseline.
- Existing build commands and deployment foundation.
- Observation wording: it is part of paid implementation and is not free support.
- No production backend or integrations yet.

## B. Current Architecture Summary

```text
Browser
  -> Vite React public SPA
      -> custom route resolver
      -> public shell/navigation/footer
      -> v2 pages and MDX resource pages
      -> route-driven SEO/OG metadata

Build/Release
  -> npm typecheck
  -> npm lint
  -> OG generation
  -> sitemap generation
  -> Vite production build
  -> Netlify SPA deployment

Future platform boundary
  -> authenticated application shell
  -> modular monolith API/domain services
  -> PostgreSQL/Supabase Auth/RLS/Storage or equivalent
  -> provider adapters for payments, email, AI, monitoring
```

## C. Proposed Platform Architecture

### Recommendation: modular monolith first
Use one deployable application with explicit domain modules and authoritative server-side authorization. Do not split into microservices until scale, team ownership, or operational isolation proves the need.

Proposed logical modules:
- `identity`: users, profiles, sessions, verification, MFA readiness.
- `organizations`: tenants, memberships, roles, invitations.
- `projects`: projects, project membership, lifecycle state.
- `catalog`: four pillars, services, offerings, configurable availability.
- `onboarding`: sessions, selected services, dynamic questions, answers.
- `requirements`: requirement items, acceptance criteria, approvals, comments.
- `proposals`: versions, line items, approvals, expiration.
- `commercials`: quotes, invoices, payments, subscriptions, service activation.
- `delivery`: milestones, tasks, deliverables, stage gates.
- `documents`: metadata, versions, visibility, signed storage references.
- `notifications`: events, templates, preferences, delivery attempts.
- `support`: tickets, messages, attachments, escalation.
- `monitoring`: future monitors, incidents, alerts, events.
- `agents`: future agents, tools, permissions, executions, approvals.
- `audit`: immutable business/security audit events.
- `admin`: internal operational workflows with elevated permissions.

### Deployment boundary
Keep the existing public Vite SPA intact. Add authenticated/admin applications as route-aware shells or a separately bundled application only when implementation begins. Keep public marketing content separate from authenticated data fetching and authorization logic.

### Data boundary
Every tenant-owned row must carry an organization ownership path, directly or through project/service ownership. Server-side policies must enforce tenant isolation; client-provided organization/project IDs are never trusted.

## D. Complete Client Journey

### Primary journey
Visitor → explore homepage and pillars → select one or more pillars → request service or contact directly → create account or accept invitation → verify account → create/join organization → create project → select services → dynamic onboarding → requirements and scope → proposal version → client review → approval → payment confirmation → project activation → implementation → deployment → observation → stabilization → documentation → handover → optional ongoing service → operations/support/monitoring → renew, upgrade, pause, or add services.

### Alternative journeys
- BUILD only: one project service, BUILD-specific onboarding, implementation/deployment gates, optional OPERATE afterward.
- AUTOMATE only: workflow/agent requirements, tool boundaries, human approvals, implementation and controlled deployment, optional ongoing AI operations.
- OPERATE only: requires an existing system/context assessment before support activation; monitoring/support scope is explicit.
- GROW only: readiness, content, community, and feedback-loop onboarding; no legacy marketing package model.
- BUILD + OPERATE: implementation hands off into optional managed operations with separate activation.
- All four: one project with four project-service records and pillar-specific onboarding sections.
- Additional service: existing organization selects a new service, creates a scoped change/proposal, then activates after approval/payment.
- Upgrade: new proposal/version or service offering transition; prior approved scope remains immutable.
- Pause/cancel: explicit service state transition, access/operations treatment defined by agreement and legal policy.
- Enterprise custom: internal-created proposal, custom line items, approval workflow, negotiated terms, optional SSO/integration later.
- Direct contact: internal operator creates organization/project/onboarding shell after qualification.
- Organization invitation: invite token → verified account → membership acceptance → role assignment → project access.

## E. Information Architecture

### Public website
`/`, `/build`, `/automate`, `/operate`, `/grow`, `/blog`, `/blog/:slug`, `/blog/tag/:tag`, `/case-studies`, `/case-studies/:slug`, contact/legal/resource surfaces as approved.

### Authenticated client area
- `/app` dashboard
- organizations and memberships
- projects and project workspace
- services and onboarding
- requirements and scope changes
- proposals and approvals
- agreements/documents
- billing, invoices, payments, subscriptions
- milestones, tasks, deliverables
- monitoring and incidents
- support and notifications
- team, settings, security

### Internal operations area
Separate protected namespace such as `/ops` or a separate application shell:
- clients/organizations/projects
- catalog and offerings
- proposals/contracts/commercials
- delivery/support/monitoring
- agents and approvals
- notifications and audit logs
- system configuration

## F. Multi-Tenancy and Roles

### Tenant model
A user can belong to multiple organizations. The active organization is a request/UI context, never an authorization guarantee. Every server query scopes by authenticated identity plus organization membership and role.

### Roles
Platform:
- `SUPER_ADMIN`: platform-wide, audited, break-glass access.
- `OPERATIONS_ADMIN`: operational access limited by policy; no arbitrary hidden access.

Organization:
- `OWNER`: organization settings, membership, projects, services, proposals, billing authority.
- `ADMIN`: membership/project/service administration except ownership transfer and destructive billing actions.
- `MEMBER`: work on assigned projects, requirements, tasks, documents, support.
- `VIEWER`: read permitted client-visible data.

Project:
- `PROJECT_MANAGER`: project scope, requirements, milestones, tasks, deliverable approvals.
- `CONTRIBUTOR`: assigned tasks, comments, approved document access.
- `VIEWER`: project read access.

Project roles are necessary for V1 because one organization may contain multiple projects with different delivery teams. Organization roles establish the ceiling; project membership establishes the project boundary.

## G. Project Lifecycle State Machine

Recommended states:
`DRAFT → ONBOARDING → SCOPING → PROPOSAL_PENDING → AWAITING_APPROVAL → AWAITING_PAYMENT → ACTIVE → IMPLEMENTATION → DEPLOYMENT → OBSERVATION → STABILIZATION → DOCUMENTATION → HANDOVER → ONGOING_SERVICE`

Terminal/side states:
- `PAUSED`: reversible operational pause with reason and owner.
- `COMPLETED`: delivery finished with no active ongoing service.
- `CANCELLED`: terminated by authorized transition and reason.
- `ARCHIVED`: retention/access state after completion or cancellation.

Do not use both `ACTIVE` and `IMPLEMENTATION` as competing meanings: `ACTIVE` means commercially activated; delivery stage then advances to `IMPLEMENTATION`.

Every transition needs actor, timestamp, prior state, next state, reason, and optional approval/reference.

## H. Service Architecture

Exactly four catalog pillars:
- BUILD
- AUTOMATE
- OPERATE
- GROW

Normalized entities:
- `pillar`: stable business category.
- `service`: capability within a pillar.
- `service_offering`: configurable commercial/delivery variant with availability, scope template, billing mode, and effective dates.
- `project_service`: selected/quoted/approved/active relationship between project and offering.
- `service_status`: requested, quoted, approved, payment_required, active, paused, cancelled, completed.

Pillar names are catalog data and constants, not duplicated UI-only business logic. UI reads stable identifiers and localized/display labels from a catalog boundary.

## I. Onboarding Architecture

An onboarding session is scoped to organization, project, and selected service IDs. It contains a general section plus dynamic pillar sections.

General: project context, goals, contact, team, timeline, constraints.
BUILD: environments, providers, repositories, deployment, CI/CD, infrastructure needs.
AUTOMATE: workflows, systems, use case, APIs, approval boundaries; never raw secrets.
OPERATE: existing system, monitoring/support scope, incidents, operational expectations.
GROW: product readiness, content/community workflow, growth context, feedback needs.

Use versioned question definitions and answer records. Questions can be required by offering/configuration. Secrets/API keys are entered through a future secret-management flow, not ordinary onboarding fields.

## J. Requirements, Scope, and Change Control

Requirement aggregate:
- requirement category: functional, technical, business, constraint, dependency, assumption.
- priority and status.
- acceptance criteria.
- client-visible/internal visibility.
- comments, attachments, approvals.

Scope changes are explicit:
`CHANGE_REQUESTED → UNDER_REVIEW → IMPACT_ASSESSED → CLIENT_APPROVAL_REQUIRED → APPROVED/REJECTED → SCOPE_VERSIONED`

An approved proposal/scope is immutable. New scope creates a version or change record; it never silently mutates the approved baseline.

## K. Proposal, Commercial, and Billing Architecture

Separate catalog pricing from project pricing:
- catalog price/rule: internal/configurable reference.
- quote: project-specific calculation snapshot.
- proposal version: client-facing scope and commercial snapshot.
- proposal item: service, deliverable, fee mode, quantity, price, optionality.
- invoice/payment: settlement records.
- subscription/subscription item: ongoing service commitment.

Proposal statuses:
`DRAFT → INTERNAL_REVIEW → SENT → VIEWED → CHANGES_REQUESTED → APPROVED/REJECTED/EXPIRED/CANCELLED`

Commercial modes:
- one-time implementation
- monthly ongoing service
- annual ongoing service
- multi-service package
- custom/enterprise
- optional add-ons

Payment states:
`PENDING → PROCESSING → PAID | FAILED | REFUNDED | PARTIALLY_REFUNDED | CANCELLED`

Subscription states:
`TRIALING → ACTIVE → PAST_DUE → PAUSED → CANCELLED | EXPIRED`

The 3-day trial is a configurable business rule: eligibility, duration, eligible offerings, conversion path, and abuse controls live in configuration/policy data, not scattered UI conditionals.

Billing failure treatment requires business/legal decisions. Default architecture should restrict new work and service activation, preserve read access to paid/client-visible records, and never silently delete documents.

## L. Delivery Workflow

### Implementation
Purpose: build the approved scope. Entry: payment/activation and accepted requirements. Exit: implementation acceptance and deployment readiness. Owners: delivery team/client approver. Deliverables: technical setup, workflows, baseline documentation.

### Deployment
Purpose: controlled release. Entry: readiness criteria and rollback plan. Exit: accepted production deployment. Owners: delivery operator plus client approver. Deliverables: deployment record and acceptance evidence.

### Observation
Purpose: inspect reliability, behavior, and operational quality after deployment. Entry: deployment accepted. Exit: observation findings and stabilization plan. This is part of the paid implementation engagement, never free support.

### Stabilization
Purpose: execute prioritized fixes/optimizations. Exit: predictable operation or documented limitations.

### Documentation
Purpose: complete architecture, workflows, runbooks, and change log. Exit: documentation gate approved.

### Handover
Purpose: transfer ownership, context, known limitations, and training context. Exit: formal handover accepted.

### Optional ongoing service
Separate activation after handover. May include OPERATE support, deployed automation support, or GROW operations only when explicitly purchased.

## M. Tasks, Milestones, Deliverables, and Documents

```text
Project
  -> Milestone
      -> Task
          -> Subtask
  -> Deliverable
  -> Document
```

Tasks need title, description, status, priority, assignee, dates, dependencies, project/milestone/service references, visibility, and audit history. Internal-only notes must never appear in client queries.

Deliverables need type, status, version, approval state, owner, and document/file reference. Documents need organization/project ownership, visibility (`CLIENT_VISIBLE` or `INTERNAL_ONLY`), versions, storage reference, archive state, and access audit.

## N. Notifications and Support

Notification entities: event, template, preference, delivery attempt. Channels: in-app/email initially; messaging integrations later. Events include proposal/payment/state/task/deliverable/approval/incident/renewal transitions.

Support is separate from tasks:
`OPEN → ACKNOWLEDGED → IN_PROGRESS → WAITING_FOR_CLIENT → RESOLVED → CLOSED`
A ticket belongs to organization/project, requester, category, priority, assigned operator, messages, attachments, and timestamps.

## O. Monitoring Architecture

Deferred, separate domain. Future entities:
- monitor and monitor type
- endpoint/target
- health check
- incident
- alert
- notification rule
- monitoring event

Monitoring data must not be embedded in project/task tables. Incident storms require deduplication, correlation, suppression windows, escalation policy, and auditability.

## P. AI Agent Architecture

Deferred runtime, planned boundary:
`Organization → Project → Agent → Agent Config → Skill → Tool Permission → Execution → Execution Log → Human Approval`

Agents are scoped to approved operational tasks. Tool allowlists, environment separation, rate limits, approval gates, execution history, and immutable audit events are mandatory. High-impact actions require approval; agents augment teams and do not receive unrestricted access.

## Q. Security Architecture

- Authentication provider owns password/session primitives; email verification, reset, MFA readiness, session revocation, and device/session review are required.
- Server-side authorization is authoritative; client permission checks are UX only.
- Database RLS/tenant policies must enforce organization/project ownership.
- Service-role credentials remain server-only.
- Validate all input at API boundary; rate-limit auth, invitations, proposals, support, webhooks, and file operations.
- Use signed URLs for private documents; scan/limit file uploads.
- Verify webhook signatures and idempotency keys.
- Apply secure headers, CSP review, CSRF protection where cookie sessions are used, and XSS-safe rendering.
- Audit security, membership, role, proposal, payment, service, document, AI, monitoring, and admin actions.

## R. Proposed Database/ERD Relationship Map

```text
profiles 1---* organization_members *---1 organizations
organizations 1---* projects
projects 1---* project_members *---1 profiles
pillars 1---* services 1---* service_offerings
projects 1---* project_services *---1 service_offerings
projects 1---* onboarding_sessions 1---* onboarding_answers
projects 1---* requirements 1---* requirement_items
projects 1---* proposals 1---* proposal_versions 1---* proposal_items
projects 1---* milestones 1---* tasks
projects 1---* deliverables 1---* documents
organizations 1---* quotes 1---* invoices 1---* payments
projects 1---* subscriptions 1---* subscription_items
projects 1---* change_requests
projects 1---* support_tickets 1---* support_messages
profiles 1---* notifications; profiles 1---1 notification_preferences
organizations/projects 1---* audit_logs
projects 1---* monitors 1---* incidents 1---* monitoring_events
projects 1---* agents 1---* agent_executions
```

Evaluate agreements/contracts as a separate immutable document/agreement aggregate before billing implementation. Avoid creating tables for a feature until ownership, retention, and lifecycle are clear.

## S. API and Backend Boundaries

Public:
- public catalog/content/health endpoints only.

Authenticated:
- identity/profile
- organizations/members/invitations
- projects/services/onboarding
- requirements/proposals
- delivery/documents
- notifications/support
- billing read operations after provider integration

Admin:
- organization/project operations
- catalog/offering management
- proposal/commercial management
- delivery/support/monitoring/agent operations
- audit/system configuration

Webhooks:
- payment provider events
- email/provider events
- future monitoring/AI provider events

Background jobs:
- notification delivery
- proposal expiry
- invoice/subscription reconciliation
- document processing
- monitoring correlation
- AI execution/approval timeout

Use application service modules behind API handlers. Do not let UI components call providers or database directly.

## T. Frontend Architecture

Preserve Vite + React + TypeScript + Tailwind. Add, when implementation begins:
- public shell: current router and v2 design system
- authenticated shell: organization/project context, route guard, permission-aware navigation
- admin shell: separate protected navigation and dangerous-action confirmations
- data fetching: query/cache layer chosen at Phase 12 with server-state ownership; avoid duplicating server state in global UI state
- forms: typed schema validation at client and server boundaries
- error boundaries and shared loading/empty/error/unauthorized/forbidden states using Phase 5 primitives
- optimistic updates only for low-risk reversible actions; proposals, payments, lifecycle transitions require server confirmation

Do not migrate frameworks or replace the current router without measured need.

## U. UX State Requirements

Every platform screen must define loading, empty, error, unauthorized, forbidden, success, partial-data, and offline/retry states. Destructive actions require confirmation and result feedback. Proposal/payment/lifecycle screens must show immutable version/status history rather than only current state.

## U1. Edge Cases

- Multiple organizations require explicit active-organization context and request-time reauthorization.
- Removed or suspended members lose access immediately; pending invitations are invalidated as policy requires.
- Empty organizations/projects use explicit empty states and authorized create actions.
- Projects with multiple services compose multiple `project_services` records and dynamic onboarding sections.
- Expired/rejected proposals preserve history and require a new version.
- Approved proposal changes never overwrite the approved snapshot; they create a new version and approval flow.
- Failed or duplicate payment/webhook events use idempotency and reconciliation; activation must never happen twice.
- Trial expiry/abuse is controlled by configurable server-side eligibility, history, and rate limits.
- Service upgrades, downgrades, additions, pauses, and cancellations use explicit change/proposal flows.
- Missing client information or unapproved deliverables create blockers and cannot silently advance lifecycle state.
- AI failures/high-impact actions fail closed and require controlled retry or human approval.
- Monitoring alert storms require correlation/deduplication and incident history.
- Unauthorized access returns a safe denial and does not leak tenant existence.
- Archived/deleted projects deny mutations and require defined recovery/deletion policy.

## V. Auditability

Audit actor, organization, project, action, target type/id, timestamp, metadata, request correlation ID, and justified security context. Audit login/security events, membership/role changes, project/service activation, proposals/approvals, payments/subscriptions, scope changes, document access, AI executions/approvals, monitoring incidents, and admin actions. Separate business audit logs from technical application logs.

## V1. Observability

Technical observability should include structured application logs, request correlation IDs, API latency/error metrics, failed jobs, webhook failures, payment reconciliation failures, AI execution failures, and monitoring-provider failures. Business audit logs remain separate from technical logs and use stricter retention/access controls. Alerts should be actionable, deduplicated, and scoped to operators rather than exposing raw infrastructure noise to clients.

## W. Backup, Recovery, Retention

Define before production:
- database backup frequency and tested restore procedure
- document/object-storage versioning and retention
- soft-delete/archive policy
- organization/account deletion policy with legal review
- recovery objectives (RPO/RTO)
- incident/disaster runbook

Do not promise retention, deletion, or recovery timelines until legal/business owners approve them.

## W1. Data Ownership and Recovery Rules

- Organization data is tenant-owned; project records inherit organization ownership.
- Client-visible documents are retained through approved versions and archive state.
- Financial and audit records are not cascade-deleted by ordinary project deletion.
- Account/organization deletion requires policy, legal, privacy, and dependency review.
- Recovery must restore ownership relationships and audit continuity, not only raw rows.

## X. Admin Architecture

Internal operators need protected tools for client/org/project management, catalog, proposals, delivery, support, monitoring, agents, notifications, and audits. Dangerous actions require elevated permission, explicit confirmation, reason capture, and audit event. Super-admin access should be rare and break-glass audited.

## Y. Future Integration Boundaries

Adapters should isolate:
- Supabase Auth/Postgres/Storage/RLS
- payment provider and webhook verification
- email provider
- GitHub/repository metadata
- cloud providers
- monitoring providers
- Discord/community systems
- AI model providers
- analytics/status/notification channels

No integration is implemented in Phase 11.

## Z. Non-Functional Requirements

Security/tenant isolation: mandatory gate.
Scalability: modular monolith and indexed tenant queries first.
Availability: define service objectives before managed operations.
Performance: public pages remain static-friendly; authenticated APIs paginate and filter server-side.
Maintainability: domain modules, typed contracts, migrations, tests, ADRs.
Accessibility: preserve current keyboard/focus/contrast standards.
Internationalization: keep display copy and dates/amounts separable from domain values.
Privacy: data minimization and purpose-based access.
Observability: structured technical logs plus business audit logs.
Testability: unit/domain, API authorization, RLS, integration, and end-to-end critical flows.
Recovery: tested backups and restore.

## AA. Configurable Business Rules

Store/configure, rather than hard-code:
- trial eligibility/duration/conversion
- service/pillar availability
- offerings and pricing rules
- billing intervals
- proposal validity
- lifecycle transitions and required approvals
- onboarding question definitions
- notification preferences/templates
- support priorities/escalation
- service packages/add-ons
- permission policy versions where needed

Configuration needs ownership, effective dates, audit history, validation, and safe defaults.

## AB. Deferred Features

Deferred because the public foundation is stable and architecture must be validated first:
- production payments/billing/subscriptions: provider/legal/reconciliation complexity
- AI runtime: permission, cost, safety, audit, and provider dependency complexity
- monitoring engine: operational scale and alert correctness
- complex analytics: data definitions should follow real workflows
- enterprise SSO: customer demand and identity contracts first
- mobile app: no validated mobile workflow yet
- full CRM/ticketing replacement: integrate only after support requirements are evidenced
- advanced workflow engine: start with explicit lifecycle transitions
- admin/client portal: implement after identity/tenant model is tested

## AC. Phase 12-24 Roadmap

- Phase 12: authentication, profiles, email verification, password reset, session/security foundation.
- Phase 13: organizations, invitations, memberships, RBAC, project-level roles, RLS tests.
- Phase 14: projects, organization/project context, client workspace shell, lifecycle read model.
- Phase 15: service catalog, project service selection, dynamic onboarding and versioned questions.
- Phase 16: requirements, scope/change requests, proposals, versioning, approvals.
- Phase 17: catalog/project pricing snapshots, invoices, payments, subscriptions, configurable trial policy, provider webhooks.
- Phase 18: delivery milestones/tasks/deliverables/documents and client-visible/internal visibility.
- Phase 19: notifications, preferences, support tickets/messages, email delivery.
- Phase 20: AI agent configuration, permissions, approvals, execution logs, then runtime only after security gates.
- Phase 21: monitoring entities and provider adapters, incident correlation, alert policies.
- Phase 22: complete client dashboard and internal admin operations shell.
- Phase 23: security hardening, RLS/authorization tests, threat modeling, accessibility, performance, backup/restore, observability.
- Phase 24: production launch readiness, legal/business sign-off, migration/runbooks, staged rollout.

## AD. Architecture Decisions and Rationale

1. Preserve Vite/React/TypeScript: current public site is stable and no platform requirement justifies migration.
2. Modular monolith first: avoids premature distributed-systems complexity while preserving domain boundaries.
3. Supabase is a candidate, not an assumption: dependency exists but no active configuration; evaluate Auth/Postgres/Storage/RLS before adoption.
4. Server-side authorization is authoritative: client-side routing cannot enforce tenant security.
5. Project roles are included in V1: one organization can have multiple projects and teams.
6. Catalog is normalized: four pillars remain fixed while offerings/pricing/configuration evolve.
7. Proposal versions are immutable after approval: protects scope/commercial auditability.
8. Observation is a paid implementation stage: prevents incorrect free-support expectations.
9. Monitoring and AI are separate future domains: prevents contaminating core project/task schema.
10. Provider integrations use adapters: keeps business domain independent from vendor APIs.

## AE. Unresolved Business Decisions

- Exact trial eligibility, service eligibility, duration, and conversion policy.
- Pricing ownership, tax/currency rules, refunds, credits, grace periods, and cancellation terms.
- Contract/agreement requirements and e-signature provider.
- Support service levels and response expectations.
- Monitoring coverage and incident escalation commitments.
- Data retention, deletion, residency, and privacy/legal obligations.
- Enterprise SSO/compliance requirements.
- What client-visible evidence is required at each lifecycle gate.

## AF. Acceptance Checklist

1. Existing V2 website preserved: planned.
2. No framework migration: confirmed.
3. No production backend/payment/AI/monitoring implementation: confirmed.
4. Four-pillar model preserved: confirmed.
5. Multi-tenant organization model defined: confirmed.
6. RBAC and project roles defined: confirmed.
7. Client journey and alternatives defined: confirmed.
8. Lifecycle/state machine defined: confirmed.
9. Catalog/service architecture defined: confirmed.
10. Onboarding/requirements/proposals/commercials defined: confirmed.
11. Delivery/document/notification/support architecture defined: confirmed.
12. AI/monitoring/security boundaries defined: confirmed.
13. Database/API/frontend/admin boundaries defined: confirmed.
14. Edge cases, observability, recovery, deferred features, and roadmap documented in companion documents.
15. Phase 11 remains documentation-only.

## AG. Phase 11.1 Resolved Contracts

### Authentication decision
The planned provider boundary is **Supabase Auth with PostgreSQL, RLS, and Storage**, because the repository already carries `@supabase/supabase-js` and the platform needs integrated identity, relational tenancy, row-level isolation, and private document storage. This is an architecture decision only; no Supabase project, environment variables, client, schema, or configuration is created in Phase 11.1.

### Session model
- Browser authentication uses Supabase Auth with PKCE for email/password and future OAuth.
- The browser holds the provider-managed session through the approved client boundary; application APIs validate the access token server-side.
- Refresh is provider-managed and must rotate/revoke sessions according to provider policy.
- Logout revokes the current session; password/security changes revoke all sessions where policy requires.
- Server endpoints never trust a client-supplied user/org/project identity and never expose service-role credentials.
- Future OAuth/social providers are adapters behind the identity boundary, not application-specific user models.

### Commercial and delivery separation
Projects must carry separate `commercial_status` and `delivery_stage` fields. Commercial status controls activation/payment entitlement; delivery stage controls implementation/deployment/observation/stabilization/documentation/handover. A project can be commercially active while delivery is in implementation, and each `project_service` can have its own commercial status and delivery participation.

### Trial decision
Trial policy is represented by versioned `trial_policies`, `trial_instances`, and `entitlements`. Duration is stored as policy data, not code. The current business default is three calendar days, but the policy can change without a code rewrite. Trial state and entitlement behavior are defined in the companion gap-resolution document.

### Authorization decision
Authorization uses deny-by-default intersection of:
1. authenticated identity/session validity
2. active organization membership
3. organization-role ceiling
4. project membership/project-role ceiling
5. resource ownership and action policy

The most permissive role does not automatically win across scopes. A project role can grant project-level capability only within an organization membership that remains active; it cannot grant organization billing/settings access. Platform break-glass access is a separately audited policy path.

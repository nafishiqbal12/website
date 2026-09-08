# BlockWaveLab V2 Phase 11 Plan

## Objective
Produce validated architecture documentation for the future client platform without changing the stable public V2 website or implementing backend/product features.

## Completed in Phase 11
- Repository and dependency audit.
- Public/current architecture summary.
- Modular-monolith recommendation.
- Client journey and alternative journeys.
- Multi-tenant organizations and RBAC.
- Project lifecycle and service catalog model.
- Onboarding, requirements, scope/change, proposal, commercial, billing, delivery, document, notification, support, monitoring, AI, security, database, API, frontend, admin, audit, recovery, configuration, deferral, and roadmap definitions.
- Architecture decision rationale and unresolved business decisions.

## Implementation Roadmap

### Phase 12 - Identity
Auth provider, profiles, verification, reset, sessions, MFA readiness, auth tests.

### Phase 13 - Organizations and RBAC
Organizations, invitations, membership roles, project roles, tenant RLS, negative authorization tests.

### Phase 14 - Projects and Workspace
Projects, lifecycle read model, organization/project context, client workspace shell, loading/empty/error states.

### Phase 15 - Catalog and Onboarding
Pillars/services/offerings, project service selection, versioned dynamic onboarding, answer validation.

### Phase 16 - Requirements and Proposals
Requirements, acceptance criteria, change requests, scope versions, proposals, approvals, expiry.

### Phase 17 - Commercials
Pricing snapshots, quotes, invoices, payment provider adapter, webhooks, subscriptions, configurable trial policy, reconciliation.

### Phase 18 - Delivery
Milestones, tasks, dependencies, deliverables, documents, client/internal visibility, approvals.

### Phase 19 - Notifications and Support
In-app/email events, preferences, templates, retries, tickets, messages, attachments, escalation.

### Phase 20 - AI Agent Platform
Agent configurations, permissions, tools, human approval, execution logs, rate limits, then runtime behind security gates.

### Phase 21 - Monitoring and Operations
Monitoring entities, provider adapters, incident correlation, alert rules, operational UI, retention.

### Phase 22 - Client/Admin Platforms
Complete client dashboard and internal operations shell; dangerous action confirmation and audit.

### Phase 23 - Hardening
Threat model, RLS/auth tests, input/file/webhook security, accessibility, performance, observability, backup/restore.

### Phase 24 - Launch
Business/legal sign-off, migration/runbooks, data retention policy, staged rollout, rollback plan, production readiness review.

## Phase Gates
Each implementation phase must pass:
- typecheck/lint/build
- domain/API tests
- authorization/RLS negative tests where applicable
- accessibility checks for UI work
- auditability review for state changes
- no regressions to public V2 routes/SEO/build

## Explicit Non-Goals
No Phase 11 application code, database migrations, auth setup, payment provider, AI runtime, monitoring engine, admin UI, client portal, or production integration.

## Phase 11.1 Preconditions Resolved

- Planned identity provider boundary: Supabase Auth with PKCE, subject to project/environment approval; no configuration is created here.
- Session lifecycle, verification, reset, logout, revocation, and future OAuth boundary are documented.
- Server-side authorization algorithm, role precedence, deny-by-default behavior, and RLS strategy are documented.
- Invitation and membership states/transitions are documented.
- Commercial status is explicitly separated from delivery stage.
- Configurable trial policy, trial instance, entitlements, and abuse controls are documented.
- Lifecycle event persistence, policy versions, agreements, refunds, credits, and payment events are added to the conceptual model.
- Auth, invitation, lifecycle, document, and error API contracts are defined.

Phase 12 must not begin implementation until the provider/environment decision and the Critical/High architecture contracts are approved by the product/security owners.

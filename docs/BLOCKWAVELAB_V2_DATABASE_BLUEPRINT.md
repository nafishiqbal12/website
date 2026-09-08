# BlockWaveLab V2 Database Blueprint

## Status
Proposed normalized relational blueprint. No migrations or database code are created in Phase 11.

## Recommended Ownership Columns
Tenant-owned tables should include `organization_id` directly where practical. Project-owned tables include `project_id` and resolve organization ownership through `projects.organization_id`. Add `created_at`, `updated_at`, and actor/audit fields where state changes matter.

## Core Tables

### Identity and tenancy
- `profiles`: `id`, display/contact metadata, timestamps.
- `auth_identities`: provider, provider_user_id, profile FK, verified_at, status.
- `security_events`: profile/user, event type, outcome, session reference, safe metadata, timestamp.
- `organizations`: `id`, name, slug, status, settings reference, timestamps.
- `organization_members`: `organization_id`, `user_id`, role, status, invited_by, accepted_at.
- `organization_invitations`: token hash, organization, intended email, role, state, expiry, created/revoked/accepted timestamps.
- `project_members`: `project_id`, `user_id`, project role, status.

### Catalog
- `pillars`: stable key, display name, description, active flag.
- `services`: pillar FK, stable key, display name, description, active flag.
- `service_offerings`: service FK, version, scope template, billing mode, availability, effective dates.
- `project_services`: project/offering FKs, status, requested/approved/activated timestamps, scope snapshot.
- `service_lifecycle_events`: project service, commercial/delivery state transition, actor, reason, correlation ID, timestamp.

### Projects and onboarding
- `projects`: organization FK, name, slug, description, status, lifecycle stage, primary contact, target dates, metadata.
- `project_lifecycle_events`: project, previous state, next state, actor, reason, evidence references, correlation ID, timestamp.
- `onboarding_sessions`: organization/project, version, status, started/completed timestamps.
- `onboarding_questions`: versioned definition, pillar/service applicability, required flag, validation schema.
- `onboarding_answers`: session/question, typed answer, visibility, completion metadata.

### Requirements and delivery
- `requirements`: project FK, category, title, description, priority, status, visibility.
- `requirement_items`: requirement FK, acceptance criteria, dependencies, assumptions.
- `requirement_approvals`: requirement/scope version, actor, decision, timestamp.
- `change_requests`: project FK, requested scope, impact assessment, cost/time delta, status, approval.
- `milestones`: project FK, title, stage, dates, status, visibility.
- `tasks`: project/milestone/service FKs, title, status, priority, assignee, due dates, visibility.
- `task_dependencies`: task-to-task relationship.
- `deliverables`: project/milestone/task FK, type, status, version, approval state, document FK.

### Proposals and commercial records
- `proposals`: organization/project, current status, valid-until, current-version FK.
- `proposal_versions`: proposal FK, version number, scope/commercial snapshot, status, approved_at.
- `proposal_items`: version FK, offering/deliverable, quantity, price snapshot, optional flag.
- `quotes`: project, calculation inputs, total snapshot, expiry, status.
- `invoices`: organization/project, source proposal/version, amount/currency, status, due date.
- `payments`: invoice, provider reference, amount, status, idempotency key, timestamps.
- `subscriptions`: organization/project, status, interval, provider reference, current period.
- `subscription_items`: subscription, offering/service, quantity, price snapshot, status.
- `refunds`: payment/invoice FK, amount, reason, provider reference, status, timestamps.
- `credits`: organization/project, source, amount/balance, expiry, status, audit references.
- `payment_events`: provider event ID, payment/subscription FK, event type, payload reference, idempotency key, processed status.
- `trial_policies`: versioned eligibility, duration, eligible offerings, entitlement rules, effective dates.
- `trial_instances`: organization/project/service, policy version, state, starts/ends, conversion/cancellation timestamps.
- `entitlements`: subject/project/service, source type/reference, capability, starts/ends, state.
- `agreements`: proposal/version or document reference, organization/project, state, terms version, required/accepted timestamps.
- `agreement_acceptances`: agreement, actor, acceptance snapshot/checksum, timestamp, IP/device metadata only where justified.

### Documents and support
- `documents`: organization/project, type, visibility, current version, storage key, archived flag.
- `document_versions`: document, version, storage key/checksum, author, created_at.
- `document_access_events`: document/user/action/timestamp.
- `support_tickets`: organization/project, requester, category, priority, status, assignee.
- `support_messages`: ticket, author, body, attachments, visibility, timestamps.

### Cross-cutting
- `notifications`, `notification_templates`, `notification_preferences`, `notification_deliveries`.
- `audit_logs`: actor, tenant/project, action, target, metadata, correlation ID, timestamp.
- `policy_versions`: bounded policy type, version, typed configuration, owner, effective dates, status.

## Future Domain Tables
- Monitoring: `monitors`, `health_checks`, `incidents`, `alerts`, `monitoring_events`, `notification_rules`.
- AI: `agents`, `agent_configs`, `agent_skills`, `tool_permissions`, `agent_executions`, `human_approvals`, `execution_logs`.

## Indexes and Constraints
- Unique organization slug.
- Unique project slug within organization.
- Unique membership `(organization_id, user_id)` and project membership `(project_id, user_id)`.
- Unique active catalog keys and offering versions.
- Unique proposal version `(proposal_id, version_number)`.
- Unique payment provider event/idempotency key.
- Unique auth identity `(provider, provider_user_id)`.
- Unique active trial constraint per organization/project/service according to policy.
- Unique invitation token hash and pending invitation policy key.
- Unique agreement acceptance per actor/version where required.
- Index every tenant/project FK, lifecycle status, due date, and timestamp used in queues.
- Foreign keys use explicit delete behavior; financial/audit records should not cascade-delete.

## RLS/Authorization Shape
Every tenant table needs organization membership enforcement. Project records additionally require project membership where applicable. Admin access uses explicit platform roles and audit events; service-role access is server-only.

## Migration Principles
1. Introduce tables by aggregate and migration.
2. Add RLS policies with negative tests before exposing endpoints.
3. Use enum/reference tables only where lifecycle/configuration needs justify them.
4. Preserve immutable snapshots for approvals, pricing, and documents.
5. Avoid storing secrets/API keys in ordinary business tables.

## Phase 11.1 RLS and authorization contract

1. Resolve the authenticated provider subject to `profiles`/`auth_identities`.
2. Permit access only when an `organization_members` row is `ACTIVE`.
3. For project rows, require active organization membership plus active `project_members` membership unless the action is explicitly organization-admin scoped.
4. Apply role/action policies server-side and repeat the ownership predicate in RLS.
5. Platform/admin access uses a separate audited policy path and never bypasses logging.
6. RLS negative tests are required for every tenant table before API exposure.

## Phase 11.1 Retention and event contract

Lifecycle, security, payment-provider, and audit events are append-only. Mutable processing fields such as `processed_at` and `delivery_attempts` may update without changing the original event payload. Event retention, PII redaction, and deletion exceptions require policy versioning and legal approval.

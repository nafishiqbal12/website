# BlockWaveLab V2 Authorization Model

## Principle
Authentication establishes identity. Server-side authorization establishes access. Client-side route guards and hidden buttons are not security controls.

## Planned Identity Boundary

The planned Phase 12 provider is Supabase Auth with PKCE, subject to environment/project approval. Supabase owns credential verification and provider sessions; application authorization is resolved from application profiles, organization memberships, project memberships, and policy tables. No service-role key is exposed to the browser.

## Role Hierarchy

### Platform roles
- `SUPER_ADMIN`: exceptional platform-wide access; break-glass and audited.
- `OPERATIONS_ADMIN`: internal operational access granted by policy.

### Organization roles
- `OWNER`: full organization control, billing/proposals, membership, project/service management, ownership transfer.
- `ADMIN`: team/project/service administration; no ownership transfer or destructive financial action unless explicitly delegated.
- `MEMBER`: work on assigned project data, requirements, tasks, documents, and support.
- `VIEWER`: read client-visible organization/project information.

### Project roles
- `PROJECT_MANAGER`: scope, requirements, milestones, tasks, deliverables, client approvals.
- `CONTRIBUTOR`: assigned work, comments, approved document access.
- `VIEWER`: read project-visible records.

Project roles are required for V1 because one organization may have separate teams and permissions per project.

## Permission Matrix

Legend: `V` view, `C` create, `E` edit, `D` delete/archive request, `A` approve, `M` manage, `B` billing/admin.

| Resource | Owner | Admin | Member | Viewer | PM | Contributor | Project Viewer |
|---|---|---|---|---|---|---|---|
| Organization | V/E/M/B | V/E/M | V | V | V | V | V |
| Team members | C/E/M | C/E/M | V | V | V project only | V project only | V project only |
| Projects | C/E/M/D | C/E/M/D | V assigned | V assigned | C/E/M project | V project | V project |
| Services | C/E/M/B | C/E/M | V | V | C/E project | V | V |
| Onboarding | C/E/M | C/E/M | C/E assigned | V | C/E/M project | C/E assigned | V |
| Requirements | C/E/A | C/E | C/E assigned | V | C/E/A | C/E assigned | V |
| Proposals | C/E/A/B | C/E/A | V | V | C/E/A project | V | V |
| Billing | V/C/E/B | V/E (policy) | none | none | V project summary | none | none |
| Documents | C/E/D/M | C/E/D/M | C/E assigned | V client-visible | C/E/A project | C/E assigned | V |
| Tasks | C/E/M | C/E/M | C/E assigned | V | C/E/M | C/E assigned | V |
| Support | C/E/M | C/E/M | C/E own/project | C own | C/E/M project | C/E own | C own |
| Monitoring | V/M | V/M | V assigned | V summary | V/M project | V assigned | V summary |
| AI agents | C/E/M/A | C/E/M/A | V assigned | V summary | C/E/A project | V assigned | V summary |
| Settings | B/M | M limited | none | none | project settings | none | none |

Platform roles can supersede tenant permissions only through explicit server policies and always create audit records. No ordinary client role can cross organization boundaries.

## Explicit Authorization Algorithm

For every request:
1. Validate the provider access token and resolve `auth_identity`/profile.
2. Reject with `401` if the session is missing, expired, revoked, or identity is inactive.
3. Resolve the requested organization from the resource, never only from a client header/body value.
4. Require an `ACTIVE` organization membership; otherwise return a safe denial.
5. Resolve project membership when the resource is project-scoped.
6. Compute the organization role ceiling and project role permissions independently.
7. Intersect the requested action with both ownership scope and role policy.
8. Deny by default; return `403` for known-but-forbidden resources or a safe `404` where tenant existence must be hidden.
9. For mutations, verify state/version/concurrency guards and emit an audit event.

Examples:
- Organization Admin + Project Member: organization-level administration is allowed where policy grants it; project work is limited to member permissions. Project membership does not elevate billing through the project.
- Organization Member + Project Manager: project management is allowed only for assigned projects; organization settings, membership administration, and billing remain denied.
- Multiple organizations: the same user receives a separate membership/permission evaluation per active organization; no permissions carry across tenants.
- Suspended membership: all tenant/project reads and writes are denied except narrowly defined invitation/account recovery surfaces.
- Organization Viewer + Project Contributor: contributor actions are limited to the assigned project and cannot grant organization-wide edit or management access.

## Tenant Isolation Rules
- Resolve authenticated user and organization membership on every request.
- Scope every query to organization/project ownership in the server layer.
- Use database RLS as a second enforcement layer.
- Never accept an organization/project ID as sufficient proof of access.
- Deny by default when membership is missing, suspended, or revoked.
- Re-check authorization for mutations and approval transitions.

## Sensitive Actions
Require elevated role plus confirmation and audit reason:
- ownership transfer
- member removal
- proposal approval/revision
- payment/refund action
- subscription pause/cancel
- service activation/deactivation
- lifecycle transition override
- document visibility change
- AI tool permission change
- monitoring suppression

## Invitation and Membership Edge Rules
- Invitation tokens are hashed, single-use, expiring, and bound to intended organization/role.
- Removed users lose access immediately on server checks.
- Owner transfer requires a new owner acceptance and audit event.
- A last-owner removal is forbidden until another owner exists.
- Membership status must be checked even when cached UI state says access is available.

## Permission Representation

Use bounded server-side action policies such as `project.task.edit`, `organization.member.manage`, and `billing.invoice.view`, with role grants stored/versioned as policy data. Do not create a generic client-editable permission language in V1. Platform break-glass access requires explicit admin policy, confirmation, reason, and audit metadata.

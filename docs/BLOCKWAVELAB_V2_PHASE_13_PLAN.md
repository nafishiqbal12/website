# BlockWaveLab V2 Phase 13 Plan

## Organization, Membership, Invitation, RBAC, and Project Access Foundation

## Status

Planning and repository audit only. This document defines the implementation contract for Phase 13. No Phase 13 application code, schema, migration, RLS policy, or live database change is included in this stage.

Phase 12 remains complete and is not restarted, rewritten, or migrated destructively. Phase 14 is out of scope.

## Scope and Non-Goals

Phase 13 establishes the minimum multi-tenant access foundation for the BlockWaveLab platform:

- organizations
- organization memberships
- organization roles
- invitations
- projects owned by organizations
- project memberships and project-scoped authorization
- tenant isolation through server/database authorization and RLS
- an append-only audit-event foundation

The public V2 website and its four service pillars remain unchanged:

1. BUILD
2. AUTOMATE
3. OPERATE
4. GROW

The following remain out of scope: billing, subscriptions, payments, AI runtime, monitoring, support, admin UI, full client dashboard, service catalog workflows, onboarding workflows, and Phase 14 work.

## 1. Repository Audit

### 1.1 Existing identity and Supabase boundary

- `src/lib/supabase/client.ts` creates a browser Supabase client only when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are present and valid.
- The client uses PKCE, persisted sessions, automatic refresh, and URL session detection through `@supabase/ssr`.
- No service-role key is present in the browser boundary. This must remain true.
- `src/lib/auth/AuthProvider.tsx` owns session initialization and Supabase auth-state subscription. It exposes identity/session state and auth operations through `useAuth`.
- Supabase Auth is the identity boundary. Phase 13 must use `auth.uid()` as the database subject and must not create a second credential or session system.

### 1.2 Existing profile data layer and migration

- `src/lib/auth/profile.ts` reads and updates only the authenticated user's profile row by user ID.
- `supabase/migrations/202609080001_profiles.sql` creates `public.profiles` with a foreign key to `auth.users`, a profile-creation trigger, timestamps, and RLS.
- Existing profile policies allow a user to select, insert, and update only their own row and explicitly deny profile deletion.
- The profile migration is a Phase 12 artifact. It must not be modified or rewritten. Phase 13 migrations must be forward-only and may reference `profiles`/`auth.users` without changing their ownership semantics.

### 1.3 Existing router and private-route behavior

- `src/routes/router.tsx` is a custom history API router. It renders public routes and the existing auth/profile pages.
- `src/routes/routeConfig.ts` currently defines `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/profile` as auth routes.
- `ProfilePage` redirects to `/login` when no session exists after loading. This is a UX guard only, not an authorization boundary.
- No organization, invitation, project, or dashboard route exists.
- Phase 13 may add minimal authenticated UI only when a slice requires it. Route guards must never be treated as a substitute for server/database authorization.

### 1.4 Existing types and data-access patterns

- `src/types.ts` currently contains public content types and no tenancy/domain access types.
- Supabase access is currently direct and browser-scoped through the client and small domain helpers such as `profile.ts`.
- There is no server API, server-side authorization helper, RPC boundary, organization context provider, membership helper, invitation helper, project helper, or audit helper.
- New Phase 13 data access must be domain-oriented and must keep authorization predicates in database/server-owned functions or policies rather than trusting client-provided tenant IDs.

### 1.5 Environment and documentation

- Environment declarations are limited to browser-safe Supabase variables in `src/vite-env.d.ts`.
- No service-role environment variable may be added to Vite-exposed configuration.
- Phase 11 documentation already defines Supabase Auth, active memberships, tenant isolation, project scope, deny-by-default authorization, invitations, and auditability as architectural requirements.
- Existing Phase 11 documents contain broader future roles (`VIEWER`, `PROJECT_MANAGER`, `CONTRIBUTOR`) and future platform roles. This Phase 13 contract narrows organization RBAC to `OWNER`, `ADMIN`, and `MEMBER`; it does not introduce platform roles or a client-visible admin surface.

## 2. Reusable Components

The following are reusable without changing their Phase 12 contract:

- Supabase browser client and public environment validation.
- Supabase Auth session, refresh, logout, recovery, and verification behavior.
- `AuthProvider`/`useAuth` as the source of current identity and session state.
- `profiles` as the application profile reference for `auth.users.id`.
- Existing profile RLS and profile data helper.
- Existing custom history API router and route configuration.
- Existing UI shells, controls, and design system for any later authenticated screens.
- Existing Phase 11 authorization algorithm as a baseline, refined below for the smaller Phase 13 role set.
- Existing migration naming and forward-only migration approach.
- Existing validation commands: `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`.

## 3. Missing Components

Phase 13 must add, in dependency order:

- organization schema, lifecycle states, identifiers, and owner bootstrap behavior
- organization membership schema, lifecycle states, constraints, and role changes
- reusable authorization predicates/RPCs and RLS policies
- invitation schema, hashed single-use tokens, lifecycle transitions, and identity binding
- project schema and organization ownership
- project membership schema and project-level access resolution
- append-only audit event foundation and mutation hooks
- negative authorization tests and integration/security verification

No current file or migration provides these capabilities.

## 4. Phase 13 Architecture Contract

### A. Organization model

`organizations` is the tenant and commercial ownership boundary. A user may belong to multiple organizations; an active organization in UI state is only context and is never proof of access.

Required fields:

- `id uuid primary key`, generated by the database
- `name text`, required and bounded
- `slug text`, required, normalized, and unique across organizations; it is a safe routing identifier, not a secret
- `status`, initially `ACTIVE` and `SUSPENDED`; `ARCHIVED` may be represented for lifecycle completion but must deny ordinary access
- `created_at`, `updated_at` timestamptz values with database defaults
- `created_by uuid` referencing the authenticated profile/user where the actor is retained

Identifiers must be opaque UUIDs for authorization and database relationships. Slugs are safe public identifiers only after the resource has passed authorization and must not be used as access proofs.

Creation must atomically create the organization, its initial active `OWNER` membership, and the corresponding audit event. There must never be an organization with no owner after a successful creation. Ownership transfer is not part of the first UI slice, but the schema and constraints must prevent removing or deactivating the last owner.

Organization status is authoritative for access. Suspended or archived organizations deny normal reads and writes while retaining records for audit and controlled recovery workflows.

### B. Membership model

`organization_members` represents the user-to-organization relationship. Users do not own tenant records directly; active membership grants access subject to role and resource scope.

Required fields:

- `organization_id` foreign key to `organizations`
- `user_id` foreign key to `auth.users`/`profiles`
- `role` organization role
- `status`, initially `ACTIVE`, `INVITED`, `SUSPENDED`, and `REMOVED`
- `invited_by` nullable actor reference
- `joined_at`/`accepted_at` nullable timestamps as appropriate
- `created_at`, `updated_at`
- optional `removed_at`/`suspended_at` and actor fields when the lifecycle requires them

Constraints:

- unique `(organization_id, user_id)`; membership is not duplicated for one user and organization
- foreign keys must use explicit delete behavior; tenant deletion must not silently destroy audit history
- only one effective membership row exists per organization/user
- the database must enforce that an organization retains at least one active owner

Membership lifecycle:

- `INVITED` is reserved for a pending membership path and is not tenant access.
- `ACTIVE` permits role-based access.
- `SUSPENDED` and `REMOVED` deny tenant/project access immediately.
- Membership changes must be performed through an authorized mutation path, update timestamps, and emit an audit event.

Role precedence is ordered `OWNER > ADMIN > MEMBER` for organization-scoped actions. Precedence is a ceiling, not a blanket grant: an organization owner does not automatically become a member of every project unless the project authorization policy explicitly grants organization-owner administration for that project. No lower role can inherit or escalate to a higher role by changing a client request.

### C. Roles

#### Organization roles

Phase 13 uses only these organization roles:

- `OWNER`: full organization foundation control, including organization settings, membership administration, invitations, project administration, and role changes, subject to last-owner and audit safeguards.
- `ADMIN`: organization membership/invitation and project administration, but cannot transfer ownership, remove the last owner, or perform future billing/platform actions.
- `MEMBER`: ordinary active organization membership. Access is limited to organization-visible data and explicitly assigned project access; it cannot manage members, roles, invitations, or organization ownership.

There is no organization `VIEWER` role in this phase. Read-only access can be represented later by project membership or a separately approved role change; it must not be invented here.

#### Project roles

The existing architecture justifies project-scoped roles because one organization may contain separate delivery teams. Phase 13 should use the smallest already-documented project set:

- `PROJECT_MANAGER`: manage the assigned project foundation and its project memberships where policy permits; cannot alter organization membership or cross organization boundaries.
- `CONTRIBUTOR`: work on assigned project records allowed by the future project policy; cannot manage project membership.
- `VIEWER`: read project-visible records only.

A project role is never an organization role and never raises the user's organization ceiling. Organization `OWNER`/`ADMIN` may receive project administration through an explicit organization-admin policy, but that is an authorization rule, not an implicit project-membership row. Organization `MEMBER` must have active project membership for project-scoped access.

### D. Invitation model

`organization_invitations` represents a pending request for a specific organization and intended identity.

Required fields:

- `id uuid primary key`
- `organization_id`
- `inviter_user_id`
- `invitee_email_normalized`, used for identity binding and duplicate detection
- `role`, limited to roles the inviter is allowed to grant; initial invitations may grant `ADMIN` or `MEMBER`, while `OWNER` is not granted by ordinary invitation creation
- `status`: `PENDING`, `ACCEPTED`, `REJECTED`, `REVOKED`, `EXPIRED`
- `token_hash`, unique and never reversible
- `expires_at`
- `created_at`, `accepted_at`, `rejected_at`, `revoked_at`, and actor fields where applicable
- optional `accepted_by_user_id`, which must match the authenticated accepting identity

Secure token strategy:

1. Generate high-entropy random token bytes on a trusted server/edge boundary.
2. Send the raw token only through the approved invitation delivery path and the minimum acceptance URL mechanism.
3. Store only a cryptographic hash of the token in the database; never store the raw token, log it, include it in audit metadata, or expose it through list/read queries.
4. Treat the token as a one-time bearer capability. Hash the presented value and compare it server-side/RLS-safe through a controlled acceptance function.
5. Do not put organization, role, email, or other sensitive invitation state in the URL. The URL may contain only the opaque token required to begin acceptance, preferably in a short-lived path/query parameter that is removed from browser history after capture.

Acceptance requires an authenticated, verified Supabase identity whose normalized email matches the invitation email. The invitation must still be pending and unexpired. Acceptance atomically changes the invitation state and creates or activates the one membership row; replay is rejected. Rejection and revocation are terminal. Expired pending invitations are denied and may be marked `EXPIRED` by a controlled maintenance path.

Duplicate handling is deterministic: at most one pending invitation exists for the same organization, normalized invitee email, and effective role scope. Resend should rotate the token and expiry through an idempotent operation rather than create unlimited pending rows. A new invitation after rejection/revocation/expiry is a new lifecycle event.

### E. Project model

`projects` is owned by exactly one organization.

Required foundation fields:

- `id uuid primary key`
- `organization_id` foreign key to `organizations`
- `name text`, required and bounded
- organization-unique normalized `slug`
- `description`/metadata fields only where needed by the foundation
- `status`, initially `ACTIVE`, `PAUSED`, and `ARCHIVED` or another explicitly approved bounded set
- `created_by`, `created_at`, `updated_at`

Project status controls lifecycle availability but does not replace membership authorization. Archived projects are not writable and ordinary reads may be restricted according to policy; audit history remains available through authorized paths.

`project_members` maps users to projects with an explicit project role and active/inactive status. It must enforce unique `(project_id, user_id)`, resolve organization ownership through `projects.organization_id`, and prevent a project member from being attached through a different organization context.

Project authorization requires both:

- active organization membership in the owning organization, and
- active project membership for member-scoped actions, or an explicit organization-owner/admin project-management grant.

### F. Authorization algorithm

Every server-side query, RPC, mutation, and database policy follows this order:

1. Resolve the Supabase Auth subject from the verified access token using `auth.uid()`.
2. Reject unauthenticated, expired, revoked, or inactive identities with `401` or the safe database equivalent.
3. Resolve the organization from the target row's stored ownership path, never from a client-supplied organization ID alone.
4. Require the organization to be in an access-allowing status.
5. Require an `ACTIVE` organization membership for the authenticated user.
6. Compute the organization role ceiling (`OWNER`, `ADMIN`, or `MEMBER`).
7. If project-scoped, resolve the project through its organization owner and require active project membership unless an explicit owner/admin policy grants the requested project-management action.
8. Evaluate the requested action against the role policy and resource status. Project role permissions cannot exceed organization permissions.
9. Deny by default. Use `403` for an authenticated forbidden operation and a safe `404` where revealing another tenant's resource existence would create an oracle.
10. For mutations, apply state, uniqueness, concurrency, and last-owner safeguards, then emit the required audit event in the same trusted transaction where practical.

React route guards and hidden controls may improve UX only. They must not be used as authorization evidence, and every RLS policy must independently reproduce the tenant and membership predicates.

### G. RLS strategy

All Phase 13 tables must enable RLS. Policies must be explicit for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`; absence of a policy is not treated as a complete design.

#### Organizations

- `SELECT`: authenticated users may see only organizations where they have an `ACTIVE` membership.
- `INSERT`: organization creation must use a trusted transaction/function that binds the creator to `auth.uid()`, creates the owner membership, and emits audit data. Direct client insertion must be denied.
- `UPDATE`: only active `OWNER` or policy-approved `ADMIN` may update allowed organization fields; status changes and ownership-sensitive fields require the controlled mutation path.
- `DELETE`: deny direct deletion. Archive/suspend through an explicit lifecycle operation; audit records are retained.

#### Organization memberships

- `SELECT`: active members may see membership records for their organization only, with sensitive invitation/token fields excluded from client-facing reads.
- `INSERT`: deny direct arbitrary insertion. Membership creation occurs through organization creation or invitation acceptance, with role ceilings enforced by trusted logic.
- `UPDATE`: only `OWNER`/authorized `ADMIN` may change permitted member status or role; an admin cannot grant owner, alter the last owner, or modify a user outside the same organization. The target user's identity cannot be changed.
- `DELETE`: deny direct deletion. Use a controlled removal/suspension operation that enforces last-owner protection and emits an audit event.

#### Invitations

- `SELECT`: authorized `OWNER`/`ADMIN` may list sanitized invitation metadata for their organization; raw token hashes and token material are never selected to clients. The invitee may use only the controlled acceptance path and must not gain broad invitation enumeration.
- `INSERT`: only `OWNER`/`ADMIN` may create invitations for the same organization and allowed role scope; duplicate pending invitations and inviter privilege escalation are rejected.
- `UPDATE`: only controlled functions may accept, reject, revoke, expire, or rotate invitations. State transitions must check current status, expiry, actor, and intended email.
- `DELETE`: deny direct deletion; retain invitation records for audit and use terminal statuses.

#### Projects

- `SELECT`: require active organization membership and project ownership through the target row; member-level reads additionally require active project membership or an explicit policy grant.
- `INSERT`: only active `OWNER`/`ADMIN` or another explicitly approved project-creation capability may create a project, and the organization is derived from the authorized actor/resource context rather than trusted input alone.
- `UPDATE`: only project managers or active organization owner/admin policy may update permitted fields; status transitions are controlled and audited.
- `DELETE`: deny direct deletion. Archive through an authorized lifecycle mutation.

#### Project memberships

- `SELECT`: active organization members may see only project memberships for projects in their organization; project-level users receive only the membership visibility approved by policy.
- `INSERT`: only active organization `OWNER`/`ADMIN` or authorized `PROJECT_MANAGER` may add members, and the target user must have active membership in the same organization. A project role cannot create organization access.
- `UPDATE`: only authorized project/organization managers may change project role/status within their ceiling; no inactive or cross-organization user may be activated.
- `DELETE`: deny direct deletion; controlled removal/deactivation must be audited and cannot be used to bypass organization membership removal.

The first implementation must prefer security-definer database functions with fixed `search_path` and carefully constrained inputs for multi-table transitions such as organization creation and invitation acceptance. Any such function must avoid dynamic SQL, never return token material, and be covered by positive and negative tests. Service-role access, if a later server boundary requires it, remains server-only and must not be exposed through Vite.

### H. Audit events

Phase 13 creates the minimum append-only `audit_events` foundation. Each event should retain:

- event ID, event type, actor user ID, organization ID, optional project ID
- target type and target ID
- immutable event timestamp
- safe structured metadata with PII/token redaction
- correlation/request ID where available
- outcome/reason where needed

Minimum event types:

- organization created
- membership created, activated, suspended, removed, or changed
- organization role changed
- invitation created, accepted, rejected, revoked, expired, or rotated
- project created or archived/status-changed
- project membership created, changed, deactivated, or removed

Audit inserts must be trusted and append-only to clients. Direct client update/delete is denied. No admin UI is built in Phase 13, and raw invitation tokens, password data, access tokens, or service credentials must never be included.

### I. Security boundaries

The implementation must explicitly protect against:

- IDOR: resource ownership is resolved from database relationships and RLS, not a URL/body ID.
- Cross-organization access: every tenant-owned query includes active membership and ownership predicates.
- Privilege escalation: role grants are bounded by the actor's effective role; project roles cannot elevate organization access.
- Unauthorized role changes: role/status mutations use controlled functions/policies, same-tenant checks, and last-owner protection.
- Wrong-identity invitation acceptance: acceptance requires a verified Supabase identity whose normalized email matches the intended invitee.
- Stale/revoked invitations: acceptance checks pending status, expiry, token hash, and one-time transition atomically.
- Deleted/inactive memberships: all reads and writes re-check active membership; cached React state is never authoritative.
- Client-side authorization bypass: server/database authorization remains effective if all UI guards and network requests are manually altered.
- Token leakage: raw invitation tokens are never stored, logged, returned by list queries, or placed alongside sensitive invitation state in URLs.

### J. Migration strategy

- Add new timestamped forward-only migrations after `202609080001_profiles.sql`.
- Do not edit or rewrite the Phase 12 migration.
- Do not use `supabase db reset`, destructive resets, drops of `auth.users`/`profiles`, or destructive data migrations.
- Introduce aggregates in dependency order and add constraints/RLS in the same migration or an immediately dependent migration.
- Use explicit foreign-key delete behavior; retain audit and lifecycle history.
- Validate migrations against a disposable/local approved database or Supabase migration workflow without applying destructive commands to the live environment.
- Before exposing a table to application code, add RLS policies and negative tests for cross-tenant reads/writes, role escalation, inactive membership, and invitation replay.

## 5. Implementation Slices

### 13.1 Organization foundation

**Files to create/change**

- Create a new forward-only organization migration after the Phase 12 profile migration.
- Create a small organization domain/data-access module under `src/lib/organizations/` only after the database contract is validated.
- Add no public website changes. Add authenticated UI only if required to exercise organization creation safely.

**Database migration and RLS**

- Create `organizations` with bounded status, UUID identity, normalized unique slug, timestamps, actor reference, and explicit foreign keys.
- Add the atomic create-organization path that creates the initial owner membership in the following membership slice if dependency ordering requires it.
- Enable RLS and add explicit policies; deny direct delete.

**Frontend**

- No dashboard redesign. Reuse `AuthProvider`, existing router, and existing UI shells only for a minimal authenticated organization context/creation flow when approved.

**Validation commands**

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- migration apply/check in the approved non-destructive Supabase workflow
- SQL positive/negative RLS tests for tenant isolation
- `git diff --check`

**Security acceptance criteria**

- A user cannot select, update, or infer another organization's rows through a changed ID/slug.
- Organization creation cannot create an ownerless organization.
- Direct client deletion is denied.
- Phase 12 profile/auth behavior is unchanged.

### 13.2 Membership and organization roles

**Files to create/change**

- Add a forward-only membership migration.
- Add organization membership types and a domain data-access module.
- Extend authenticated context only with derived membership data; do not treat it as an authorization source.

**Database migration and RLS**

- Create `organization_members`, role/status constraints, unique organization/user constraint, indexes, and last-owner safeguards.
- Add explicit SELECT/INSERT/UPDATE/DELETE policies and controlled role/status mutation functions.

**Frontend**

- Minimal membership listing/invite entry point may be added later in this slice; no full dashboard or admin UI.

**Validation commands**

- Typecheck, lint, build, migration verification, and SQL negative tests for role escalation and cross-tenant membership access.

**Security acceptance criteria**

- Only active members access tenant data.
- Only owners/admins can manage permitted memberships.
- Admin cannot grant owner or remove the last owner.
- Suspended/removed members lose access immediately.

### 13.3 RLS and authorization enforcement

**Files to create/change**

- Add shared authorization policy documentation/types and controlled database functions/RLS helpers.
- Add focused authorization tests; avoid putting authorization decisions in `router.tsx`.

**Database migration and RLS**

- Harden organization and membership policies with the exact algorithm above.
- Add reusable same-organization and active-membership predicates without recursive or bypassable policy design.

**Frontend**

- Use authorization results for UX states only. No client role or organization ID is trusted for access.

**Validation commands**

- SQL matrix tests for select/insert/update/delete, inactive states, role ceilings, and IDOR attempts.
- `npm run typecheck`, `npm run lint`, `npm run build`.

**Security acceptance criteria**

- Manually altered browser requests cannot cross tenant boundaries.
- Every policy defaults to deny and has a corresponding negative test.
- Known forbidden operations fail safely without leaking tenant existence.

### 13.4 Invitation lifecycle

**Files to create/change**

- Add a forward-only invitation migration.
- Add a trusted invitation operation boundary and a sanitized invitation data helper.
- Add only the minimal route/UI required to initiate or accept an invitation; no sensitive invitation state is rendered from URL data.

**Database migration and RLS**

- Create invitation state, expiry, normalized email, token hash, uniqueness/indexes, and lifecycle timestamps.
- Add explicit policies and controlled create/accept/reject/revoke/rotate transitions.

**Frontend**

- Capture the opaque token, remove it from visible/history state as soon as practical, require authenticated verified identity, and show generic safe outcomes.

**Validation commands**

- Unit/integration tests for token hashing, duplicate pending invitations, email mismatch, expiry, revocation, replay, and idempotency.
- Typecheck, lint, build, migration/RLS tests.

**Security acceptance criteria**

- Raw tokens are never stored or returned.
- A different authenticated email cannot accept the invitation.
- A stale, revoked, rejected, or already accepted invitation cannot create access.
- Acceptance creates exactly one effective membership and one audit event.

### 13.5 Project foundation

**Files to create/change**

- Add a forward-only projects migration.
- Add project domain types/data access.
- Add no full project dashboard.

**Database migration and RLS**

- Create organization-owned `projects`, bounded status, organization-unique slug, indexes, and explicit foreign keys.
- Add organization membership and project ownership RLS for all CRUD operations; deny direct delete.

**Frontend**

- Add only the minimal authenticated project creation/listing surface needed for validation, reusing existing shells.

**Validation commands**

- Typecheck, lint, build, migration verification, and project IDOR/cross-organization SQL tests.

**Security acceptance criteria**

- Projects cannot be created under an organization the actor cannot manage.
- A project ID from another organization cannot be read or updated.
- Archived projects cannot be mutated through ordinary paths.

### 13.6 Project membership and project authorization

**Files to create/change**

- Add a forward-only project membership migration.
- Add project membership types and authorization/data-access helpers.
- Add no separate client-side permission engine.

**Database migration and RLS**

- Create `project_members`, role/status constraints, same-organization membership checks, unique project/user constraint, and policies for all operations.
- Enforce that project roles cannot bypass organization membership or organization role ceilings.

**Frontend**

- Minimal project member management/read states only after database enforcement exists.

**Validation commands**

- Authorization matrix tests for organization owner/admin/member combined with project manager/contributor/viewer.
- Typecheck, lint, build, migration/RLS tests.

**Security acceptance criteria**

- A project member from another organization cannot be attached.
- Removing/suspending organization membership immediately blocks project access.
- Project role changes cannot grant organization membership or role management.

### 13.7 Audit event foundation

**Files to create/change**

- Add a forward-only audit migration.
- Add a server/database event-writing helper or trusted trigger/function integration.
- Add no audit UI.

**Database migration and RLS**

- Create append-only `audit_events` with tenant/project references, target, actor, event type, safe metadata, and correlation ID.
- Permit trusted inserts only; deny client updates/deletes and exclude token material.

**Frontend**

- None beyond safe mutation outcome handling.

**Validation commands**

- Verify each required mutation emits one appropriate event and no sensitive metadata.
- Typecheck, lint, build, migration/RLS tests.

**Security acceptance criteria**

- Organization, membership, role, invitation, project, and project membership changes are attributable.
- Audit records cannot be altered by ordinary tenant users.

### 13.8 Integration and security verification

**Files to create/change**

- Add focused integration/security test fixtures and documentation of the approved test environment.
- Update Phase 13 implementation/report documentation after all prior slices pass.

**Database migration and RLS**

- Verify migration order and live-schema compatibility without reset or destructive commands.

**Frontend**

- Verify existing login, session persistence, profile read/update, logout, and private route behavior after new domain modules are present.

**Validation commands**

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- focused RLS/integration/security tests
- `git diff --check`
- live Supabase verification using approved non-secret environment configuration, without printing credentials

**Security acceptance criteria**

- Phase 12 regression checks pass.
- Cross-organization access, IDOR, role escalation, invitation mismatch/replay, inactive membership, and client-side bypass tests all fail closed.
- No service-role key or secret is exposed, logged, committed, or placed in Vite environment variables.

## 6. Risks and Open Decisions

- Existing Phase 11 documents describe future platform roles and a broader organization/project matrix. Phase 13 must not silently implement those future roles; the scoped contract above is authoritative for this phase.
- Supabase browser access alone is insufficient for raw-token invitation issuance/delivery. A trusted server/edge operation must be approved before invitation implementation; it must not require exposing a service-role key in the browser.
- RLS helper functions can create recursion or privilege bypass if they query policy-protected tables carelessly. Each helper needs fixed search path, constrained inputs, and negative tests.
- Organization creation and invitation acceptance are multi-row transactions. Partial success must be impossible.
- The current router has no dashboard shell. Adding domain routes before authorization enforcement would create a misleading security boundary and should wait for slice 13.3.
- Phase 12.1 documentation in the repository describes an earlier unconfigured live-verification state, while the current task context says live verification completed. That historical report should remain unchanged unless a separate documentation correction is requested; it does not alter the Phase 12 code contract.
- Invitation email delivery, ownership transfer, organization deletion, and project lifecycle depth require later approved contracts and are not implementation blockers for the foundation when represented as explicit deferred states.

## 7. Exact Next Task

**Phase 13.1 Organization Foundation**

Create the first forward-only organization migration and its focused authorization/RLS tests after confirming the approved Supabase migration workflow. Do not modify `202609080001_profiles.sql`, do not create memberships/projects/invitations in the same initial slice unless required by an explicitly reviewed atomic owner-bootstrap dependency, and do not modify the public V2 website routes or service pillars.

# BlockWaveLab V2 Phase 15 Commercial Foundation Runtime Audit

## Final Verdict

**FAIL**

The deployed foundation is structurally synchronized and static checks pass, but a concrete cross-tenant reference-validation defect was found in `create_agreement`. No speculative fix was made and no follow-up migration was deployed. Authenticated runtime A/B verification is also deferred because no approved test sessions or credentials are available.

## Scope

Audited the already-deployed migration `supabase/migrations/202609140011_commercial_foundation.sql`, its RPC grants and `SECURITY DEFINER` boundaries, RLS policies, immutable-history triggers, existing TypeScript data helpers, project-level commercial UI, route registration, migration synchronization, and repository validation.

No application code, schema, migration, RPC, RLS policy, deployment, test user, credential, or secret was changed during this audit. The only file created by this audit is this report.

## Tests Attempted

- `supabase migration list --linked`
- Static inspection of all six commercial tables and seven public commercial RPCs.
- Static inspection of RLS policies, authenticated-only grants, fixed `search_path`, ownership checks, immutability triggers, and audit-event extensions.
- Static inspection of proposal/agreement data helpers and `CommercialPanel`.
- Route/deep-link inspection for `/proposals`, `/proposals/:id`, `/agreements`, and `/agreements/:id`.
- Repository search for payment providers, service-role keys, secrets, token logging, and privileged browser access.
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`

No live authenticated A/B test was attempted because no approved existing test users or active sessions were available. No credentials were created, printed, exposed, or committed.

## Tests Passed

### Deployment and structure

- Local and remote migration `202609140011` are synchronized.
- Six commercial tables are present in the deployed migration definition:
  - `proposals`
  - `proposal_versions`
  - `proposal_items`
  - `agreements`
  - `agreement_versions`
  - `agreement_acceptances`
- Commercial RPCs are granted to `authenticated` and revoked from `public`/`anon`:
  - `create_proposal`
  - `create_proposal_version`
  - `issue_proposal`
  - `accept_proposal`
  - `create_agreement`
  - `create_agreement_version`
  - `accept_agreement`
- Sensitive RPCs use `SECURITY DEFINER` and fixed search paths.
- All six commercial tables enable RLS.
- Direct client INSERT/UPDATE/DELETE policies are denied for commercial tables.
- Existing `audit_events` is reused and extended with commercial references/events.

### Static authorization and isolation findings

- Proposal/agreement mutations call `private.commercial_owner`, requiring an active `OWNER` membership for the supplied organization.
- `ADMIN` is not granted owner-level commercial mutation authority by these RPCs.
- `MEMBER`, `PROJECT_MANAGER`, `CONTRIBUTOR`, and `VIEWER` do not receive commercial mutation authority through the new functions.
- Project references in `create_proposal`, proposal item project-service resolution, and `create_agreement` are checked against persisted organization ownership where those checks are present.
- Read policies require active organization membership and project access for project-scoped records.
- No service-role key, payment credential, payment provider, e-signature provider, or token logging pattern was found in the inspected commercial source/migration surfaces.

### Immutability and replay design

- Proposal items and agreement acceptance records have update/delete protection through triggers and RLS.
- Issued/terminal proposal snapshots protect historical scope, commercial snapshot, currency, checksum, version, and proposal identity.
- Pending/active/terminal agreement versions protect historical terms, checksum, version, and agreement identity.
- Agreement acceptance has an idempotency key uniqueness constraint and returns an existing record for a repeated same-key request.
- Proposal issue/accept operations use expected version checks and row locks.
- No payment, invoice, subscription, entitlement, or delivery tables/functions are present in this migration.

### Repository validation

- `npm run typecheck`: passed.
- `npm run lint`: passed with two pre-existing `SEO.tsx` fast-refresh warnings and no errors.
- `npm run build`: passed with existing chunk-size and Browserslist warnings.
- `git diff --check`: passed.

## Tests Failed / Security Finding

### F-01: `create_agreement` permits cross-tenant source references

**Severity: High.**

The trusted `create_agreement` function validates that the caller owns `p_organization_id` and, when provided, that `p_project_id` belongs to that organization. It does not validate that:

- `p_proposal_id` belongs to `p_organization_id`;
- `p_proposal_id` belongs to `p_project_id` when a project is supplied;
- `p_source_proposal_version_id` belongs to `p_proposal_id`;
- the source proposal version belongs to the same organization/project; or
- the source version is the accepted current version of the referenced proposal.

The current source lookup checks only `proposal_versions.id = p_source_proposal_version_id and status = 'ACCEPTED'`. An authenticated owner who obtains or guesses another tenant's UUID could therefore create an agreement in their own organization that references an accepted proposal version from another organization. This is a tenant-integrity defect even though UUID discovery may be difficult.

**Smallest forward-only fix, not applied:** add a reviewed migration replacing `create_agreement` so it locks and validates the proposal and source version through the same organization/project relationship before insertion. The validation must reject mismatched `proposal_id`, source version, organization, and project with a safe not-found/authorization error. Add a negative cross-tenant test before deployment.

No fix was made or deployed during this audit, per scope.

## Tests Deferred

### Runtime authenticated A/B flows

Deferred because no approved existing test users or active authenticated sessions are available. The following were not claimed as passed:

- OWNER proposal listing, creation, version creation, issue, and acceptance.
- OWNER agreement creation, version creation, and acceptance.
- ADMIN denial/limited behavior.
- MEMBER denial of commercial mutation/approval.
- Project-manager/contributor/viewer denial of final commercial mutation.
- Cross-organization read/mutation denial using real sessions.
- Direct table write denial through the authenticated client.
- Direct mutation attempts against issued/accepted versions and acceptance records.
- Agreement acceptance replay behavior through an authenticated client.
- Confirmation that acceptance creates no downstream payment, invoice, subscription, entitlement, or delivery records at runtime.

### Browser/deep-link checks

The requested standalone routes are not registered in `src/routes/routeConfig.ts`:

- `/proposals`
- `/proposals/:id`
- `/agreements`
- `/agreements/:id`

The available commercial UI is embedded in the project detail surface through `CommercialPanel`. Therefore standalone proposal/agreement deep-link and refresh behavior is **not available**, not merely untested. Project-level commercial UI refresh behavior remains runtime-deferred without an authenticated session.

## Authorization Results

- **OWNER:** static RPC checks grant commercial mutations and acceptance only to active organization owners. Runtime confirmation deferred.
- **ADMIN:** static checks deny owner-only commercial RPCs. Runtime confirmation deferred.
- **MEMBER:** no commercial mutation/approval grant found. Runtime denial test deferred.
- **PROJECT_MANAGER / CONTRIBUTOR / VIEWER:** no commercial acceptance grant found. Runtime denial tests deferred.
- **Cross-organization:** project ownership checks are present in several paths, but the `create_agreement` source-reference defect fails the complete cross-tenant integrity requirement.

## RLS Results

**Static result: PASS with runtime verification deferred.**

All six commercial tables enable RLS. Read policies require active organization membership and project access where project-scoped. Direct client writes are denied. Runtime policy behavior, anonymous denial, cross-organization reads, and direct-write denial were not executed without approved sessions.

## Immutability Results

**Static result: PASS with runtime verification deferred.**

Triggers and RLS protect proposal items, issued/terminal proposal versions, agreement versions after protected states, and acceptance records. Runtime direct-update/delete attempts were not executed. The cross-tenant agreement-reference defect is separate from snapshot immutability.

## Idempotency Results

**Static result: PARTIAL.**

- Agreement acceptance has same-key replay handling plus database uniqueness constraints.
- Proposal issue/accept use expected-version locking and reject stale/repeated state transitions.
- Proposal acceptance does not expose a dedicated acceptance idempotency record; repeated acceptance is rejected by state rather than returning an existing acceptance result.
- Create operations are not idempotency-key based.
- Runtime replay tests were deferred.

## Cross-Tenant Isolation Results

**FAIL.**

RLS/read paths and several ownership checks are structurally present, but `create_agreement` does not bind `proposal_id` and `source_proposal_version_id` to the caller's organization/project. The smallest fix is identified in F-01 and was intentionally not applied.

## Commercial/Delivery Boundary Results

**Static result: PASS.**

The inspected migration contains no payment, invoice, subscription, entitlement, or delivery activation objects. Proposal acceptance only changes proposal state and records an audit event. Agreement acceptance changes agreement state and records audit events; it does not update `project_services`, project delivery stage, or create downstream commercial/payment records. Runtime confirmation was deferred.

## Secret/Security Scan Results

**Static result: PASS.**

No service-role key, payment credential, e-signature secret, provider integration, token logging, or privileged browser-side database client was found in the inspected commercial source and migration surfaces. `.env.local` exists, but its contents were not printed or inspected for this audit.

## Final Verdict

**FAIL**

Reason:

1. A concrete high-severity cross-tenant source-reference defect exists in `create_agreement`.
2. Standalone proposal/agreement deep-link routes requested for verification are not implemented/registered.
3. Authenticated runtime A/B, RLS negative tests, immutability attempts, replay tests, and downstream non-activation checks remain deferred because no approved sessions/test users are available.

No schema/application fix was made, no deployment occurred during this audit, and no payment, subscription, entitlement, invoice, tax, refund, e-signature, trial, or delivery activation work was started.

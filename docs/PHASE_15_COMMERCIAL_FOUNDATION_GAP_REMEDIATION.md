# BlockWaveLab V2 Phase 15 Commercial Foundation Gap Remediation

## Status

**PASS WITH DEFERRED RUNTIME TESTS**

This remediation addressed only the two findings from the Phase 15 commercial foundation runtime/security audit:

1. Cross-tenant proposal/version reference validation in `create_agreement`.
2. Authenticated standalone proposal and agreement index/detail routes.

No payment, invoice, subscription, refund, tax, e-signature, trial, entitlement, delivery activation, AI, email, or external provider work was added.

## Original Audit Findings

The prior runtime/security audit identified:

- A high-severity tenant-integrity defect: `create_agreement` checked the caller's organization and optional project, but did not bind `proposal_id` or `source_proposal_version_id` to that organization/project and accepted any accepted proposal version UUID.
- A functional route gap: `/proposals`, `/proposals/:id`, `/agreements`, and `/agreements/:id` were not registered in the custom router. Commercial UI existed only inside project detail.

## Security Remediation

Migration:

```text
supabase/migrations/202609140012_commercial_gap_remediation.sql
```

The original `202609140011_commercial_foundation.sql` was not edited.

The forward-only migration replaces the existing `create_agreement` function with the same signature and preserves:

- `SECURITY DEFINER`
- `search_path = public, private, pg_temp`
- authenticated-only execution
- existing owner authorization through `private.commercial_owner`
- existing RLS and tenant boundaries

Before insertion, the function now:

- requires the supplied organization to resolve through the authenticated active owner check;
- validates an optional project belongs to that organization and is not archived;
- requires `proposal_id` and `source_proposal_version_id` to be supplied together;
- resolves the proposal from the database by organization, rather than trusting browser relationships;
- requires the proposal status to be `ACCEPTED`;
- requires the proposal project to exactly match the supplied project, including the organization-scoped/null case;
- resolves the source version through `proposal_id`, requires version status `ACCEPTED`, and requires it to be the proposal's current version;
- derives the stored project from the validated proposal relationship;
- rejects mismatched organization, project, proposal, or proposal-version references before creating the agreement.

No RLS weakening, service-role access, or browser privilege was introduced.

## Route Remediation

The existing custom router now recognizes and renders:

- `/proposals`
- `/proposals/:id`
- `/agreements`
- `/agreements/:id`

Changes were limited to the existing route architecture:

- `src/routes/routeConfig.ts`: route keys and path resolution.
- `src/routes/router.tsx`: authenticated `PlatformApp` rendering.
- `src/routes/seoConfig.ts`: existing authenticated `noindex, nofollow` behavior.
- `src/pages/platform/PlatformApp.tsx`: shared authenticated proposal/agreement index/detail view.

The new pages reuse the existing typed commercial data helpers. They display RLS-scoped records, immutable versions, checksums, scope/item counts, and links to the existing project commercial workflow. Proposal creation, issue, acceptance, agreement creation, and agreement acceptance remain implemented only in the existing project-level commercial panel; no second mutation/data layer was created.

The project-level commercial UI remains in place and continues to distinguish commercial records from payment, entitlement, and delivery activation.

## Validation Results

Passed:

- `npm run typecheck`
- `npm run lint` with two pre-existing `SEO.tsx` fast-refresh warnings and no errors
- `npm run build` with existing chunk-size/Browserslist warnings
- `git diff --check`
- `supabase migration list --linked`
- destructive-SQL inspection of the new migration
- static verification of `SECURITY DEFINER`, fixed search path, authenticated grant, and proposal/version relationship checks
- static verification of all four route registrations
- static verification that commercial routes use existing authenticated noindex behavior
- static security scan for service-role keys, payment credentials, secrets, token logging, and external providers in the touched commercial surfaces

Deployment:

```text
202609140012_commercial_gap_remediation.sql -> remote synchronized
```

Only the new remediation migration was deployed with `supabase db push --linked`. No reset or destructive operation was used.

## Deferred Runtime Tests

No approved existing authenticated test users or sessions were available. Therefore these runtime checks remain deferred rather than being reported as passed:

- OWNER positive `create_agreement` flow.
- ADMIN/MEMBER/project-role negative mutation checks.
- Cross-organization and cross-project live RPC attempts.
- Direct authenticated table-write denial.
- Runtime immutable-history update/delete attempts.
- Runtime agreement acceptance replay.
- Browser refresh/deep-link checks with authenticated sessions.
- Runtime confirmation that acceptance creates no payment, invoice, subscription, entitlement, or delivery records.

No credentials or test users were created, printed, exposed, or committed.

## Scope Confirmation

- Existing four-pillar catalog unchanged.
- Existing organization/project roles unchanged.
- Existing commercial migration `202609140011` unchanged.
- No prices, amounts, taxes, discounts, payment percentages, or legal claims added.
- No payment provider, checkout, invoice, subscription, refund, tax, e-signature, trial, entitlement, delivery, AI, email, or external commercial provider work added.
- No service-role key or privileged browser access added.
- Build-generated sitemap date churn was restored; `public/sitemap.xml` is not part of this remediation.

## Final Verdict

**PASS WITH DEFERRED RUNTIME TESTS**

The cross-tenant reference defect is remediated in the deployed forward-only migration, and the four missing authenticated commercial routes are registered with private SEO behavior. Approved-session runtime verification remains outstanding.

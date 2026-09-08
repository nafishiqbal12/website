# BlockWaveLab V2 Phase 12 Implementation

## Architecture implemented
Phase 12 adds a minimal identity/profile foundation on the existing Vite + React + TypeScript SPA.

Implemented boundaries:
- Supabase browser client boundary.
- Auth provider/session state abstraction.
- Email/password sign-up and sign-in flows.
- Sign-out.
- Password reset request and recovery password update flow.
- User-owned application profile data boundary.
- Protected `/profile` route.
- No organization, project, RBAC-management, billing, AI, monitoring, support, or admin features.

## Auth provider boundary
The planned provider is Supabase Auth with PKCE. The client is created only when both browser-safe variables are present:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Only the public anon key belongs in the browser. Service-role keys, database credentials, provider secrets, and tokens must remain server-side and are not accepted by this client module.

When variables are absent, the app stays safe and renders a configuration notice rather than crashing or pretending authentication succeeded.

## Environment contract
Local/deployment configuration must provide:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<public-anon-key>
```

No actual credentials were added to the repository. Do not commit `.env` files or service-role keys.

## Authentication flows
- Sign up: validates email/password, calls provider signup, and displays a verification-oriented success message without exposing account enumeration details.
- Sign in: validates credentials, restores provider session, and routes to `/profile` on success.
- Sign out: calls provider sign-out, clears provider session state, and returns to `/`.
- Password reset: requests a provider reset email with an internal `/reset-password` redirect.
- Password update: requires a recovery-mode provider session and matching password confirmation.
- Session restore: `getSession` initializes state and `onAuthStateChange` tracks changes.
- Expired/missing session: protected profile screen waits during initialization, then routes unauthenticated users to `/login`.

## Session lifecycle
- Supabase Auth owns access/refresh token mechanics.
- PKCE is configured at the client boundary.
- Session state is exposed through `AuthProvider` as `user`, `session`, `isLoading`, `isConfigured`, and `recoveryMode`.
- Application code does not log tokens/passwords or construct custom authentication tokens.
- Future server APIs must validate the provider token server-side; this phase has no server API.

## Profile model
The application profile is separate from auth metadata and is represented by `public.profiles`:
- `id` references `auth.users(id)`.
- `display_name`
- `avatar_path`
- `timezone`
- `locale`
- `created_at`
- `updated_at`

The profile helper exposes only current-user reads/updates and is intentionally not coupled to organizations or projects.

## Database/RLS implementation
Migration:
- `supabase/migrations/202609080001_profiles.sql`

The migration defines:
- `profiles` table with auth-user foreign key.
- idempotent profile-creation trigger for new auth users.
- RLS enabled.
- own-row SELECT/INSERT/UPDATE policies.
- explicit deny-by-policy DELETE behavior.
- `updated_at` index.

The migration has not been applied to a Supabase project in this environment.

## Protected route behavior
Added auth-aware routes to the existing custom router:
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/profile`

Auth routes use `noindex, nofollow` metadata. Public V2 routes remain unchanged.

## Security decisions
- No custom auth implementation.
- No service-role key or credentials in frontend code.
- No passwords/tokens in logs or URLs.
- Password reset uses provider redirect and recovery state.
- Profile queries are keyed by the authenticated user ID and rely on database RLS for authoritative ownership.
- Redirects are fixed internal paths only; no arbitrary redirect parameter is accepted.
- Missing configuration fails closed in the UI.

## Error and recovery behavior
Handled UI states:
- idle
- loading
- success
- validation error
- provider/authentication error
- missing configuration
- session initialization
- recovery-mode required
- signed-out protected-route redirect

Provider error strings are displayed as request failures but no account-existence lookup is performed by application code.

## Known limitations
- Live Supabase authentication was not tested because no project URL/key were available.
- The migration was not applied to a database.
- No automated test runner exists in the repository; validation uses TypeScript, lint, production build, diff checks, and environment-absent behavior.
- Organization membership/RBAC/project authorization remains Phase 13.
- Auth pages are integrated into the custom router but do not provide a full client dashboard.

## Phase 13 dependencies
Phase 13 must build on:
- authenticated `user`/`profile` identity
- Supabase Auth subject mapping
- server-side authorization and RLS policies
- organization memberships/invitations
- project memberships and role precedence

It must not move organization/project authorization into the Phase 12 auth context.

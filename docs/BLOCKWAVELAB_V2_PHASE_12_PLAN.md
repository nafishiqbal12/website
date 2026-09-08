# BlockWaveLab V2 Phase 12 Implementation Plan

## Scope
Implement authentication and application-profile foundations only. Preserve the public V2 website, custom router, SEO, and Phase 5 design system.

## Repository findings
- Vite + React + TypeScript SPA with custom browser-history routing.
- Supabase JS dependency exists, but no client, environment contract, auth provider, migrations, or session state exists.
- Existing `StateViews`, `Field`, `Button`, `Card`, `Container`, `PageShell`, and `Link` primitives are reusable.
- Public route metadata is handled centrally in the router; auth screens will use `noindex` metadata through route configuration/SEO behavior.
- No test runner is configured; validation will use typecheck, lint, build, diff checks, and safe environment-absent behavior.

## Implementation slice
1. Add `src/lib/supabase/client.ts` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` validation, no service-role access, and a disabled-safe client boundary.
2. Add `src/lib/auth/AuthProvider.tsx` exposing session/user/loading/configuration state and sign-in/sign-up/sign-out/reset/update-password operations.
3. Add profile types/data boundary and a `profiles` SQL migration with ownership RLS policies.
4. Add auth screens for `/login`, `/signup`, `/forgot-password`, `/reset-password`, and `/profile` using existing primitives.
5. Extend the existing custom route state/router with auth routes only; do not add React Router or organization/project routes.
6. Add authenticated route loading/redirect behavior without exposing profile data before session initialization.
7. Update environment and Phase 12 implementation documentation; never add credentials.

## Auth decisions applied
- Supabase Auth is the planned identity boundary with PKCE-compatible browser flow.
- Provider session state is restored through `onAuthStateChange` and `getSession`.
- Profile access is user-owned only in this phase; organization/project authorization remains Phase 13.
- Passwords/tokens are never logged or placed in URLs by application code.
- Redirect targets are internal allowlisted paths only.

## Explicit non-goals
- Organizations, invitations, memberships, RBAC management, project access, billing, subscriptions, payments, AI runtime, monitoring, support, admin, and client dashboard.

## Validation
Run `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`. Missing Supabase environment variables must produce a safe configured-state message rather than a runtime crash.

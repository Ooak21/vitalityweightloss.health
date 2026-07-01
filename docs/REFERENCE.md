# Vitality Weight Loss — Reference

## Repo & hosting
- GitHub: `Ooak21/vitalityweightloss.health`
- Hosting: GitHub Pages, custom domain via `CNAME` → `vitalityweightloss.health`
- Deploy: pushing to the default branch publishes directly (static site, no
  build/CI deploy step found)

## Backend
- Convex deployment: `quixotic-cat-492`
  - Client/browser: `https://quixotic-cat-492.convex.cloud`
  - HTTP actions: `https://quixotic-cat-492.convex.site`
- Auth actions: `auth:signIn` (password provider, `flow: signIn|signUp`),
  `auth:signOut`; staff role resolved via `verifyAuth:staffProbe`
- Stripe checkout: `POST {convex.site}/pay-stripe`
- Lead capture: `POST {convex.site}/lead`
- Athena middleware: proxied through Convex site URL (see `glp1.html`)

## Third-party vendors (see `admin.html` vendor tracker for full detail)
- **Stripe** — payments, via Convex HTTP action
- **Telnyx** — AI receptionist voice line, admin-only scope, Conduit Exception
  (no BAA) as of 2026-06-16 confirmation; metadata-only call logging
  (`vit_call_log`)
- **Resend** — patient/provider email, non-PHI content only

## Auth model
- `@convex-dev/auth`, Password provider, RS256 access JWT (~60min) + refresh
  token
- Two isolated localStorage session stores:
  - `vca-vit-staff` — staff/provider sessions
  - `vca-vit-patient` — patient sessions
- Prior architecture used a Supabase JWT bridge; fully replaced by Convex-native
  auth (Milestone B, verified 2026-06-16)

## Notable internal tools
- `crm.html` — staff CRM: leads, referral partners (incl. physician-investor
  badging), GLP-1 Rx async review queue, Communicate/Plans/Voice action
  clusters, calendar (Month/Week/Day views, provider colors)
- `admin.html` — vendor/HIPAA risk register, Resend email tracking metrics
  (HubSpot-style), Telnyx call reporting/CSV export
- Importer supports HubSpot/Apollo CSV exports (underscore/space header
  normalization, segment column)

## Open compliance items
- Resend: non-PHI only; move clinical email to a BAA provider before sending
  clinical content
- Telnyx: BAA required before enabling transcript/recording storage or
  analysis of call content

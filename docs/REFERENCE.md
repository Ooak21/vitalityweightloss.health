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
- Google Calendar sync: Convex `gcal.ts` (not in this repo — lives on the
  Convex deployment). See "Calendar integration" below.

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

## Calendar integration (GitHub issue #3, open, assigned to Miguel)
Google Calendar two-way sync between CRM appointments and each provider's
Google Calendar. Backend lives in Convex (`gcal.ts`), not in this repo.
Frontend consumer is `crm.html`'s schedule (`renderSchedule`).

- **Code-shielded by design**: CRM-origin events on Google carry only
  `"Consult · Patient #ref"` — never a patient name (no PHI on Google).
- External/personal events on a provider's Google calendar surface in the CRM
  only as opaque grey "Busy" blocks (free/busy), never pulled into Vitality's
  data model.
- **Phase 2a (enablement) — DONE, confirmed live by Luis (2026-07-01)**:
  service-account JWT-bearer auth w/ domain-wide delegation, secrets set on
  Convex, outbound `syncAppointment` (create/patch/delete on book/update/
  cancel) verified working end to end.
- **Phase 2b (inbound + busy overlay, not yet done)**: frontend "Busy" overlay
  in `crm.html` `renderSchedule` fed by a `/gcal-freebusy` route; backend
  Google push-notification watch channels per provider calendar →
  `/gcal-webhook` route; incremental sync via syncToken; loop-prevention; cron
  channel renewal.
- Per-provider calendars, mapped via `GCAL_PROVIDER_MAP` (no shared clinic
  calendar, unless that changes later).

## Open compliance items
- Resend: non-PHI only; move clinical email to a BAA provider before sending
  clinical content
- Telnyx: BAA required before enabling transcript/recording storage or
  analysis of call content

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
  - "Add referral partner" modal (`addPractice`) has an optional "Referring
    doctor" field. On submit it chains two existing Convex actions instead of
    requiring a backend change: `add_practice` first, then (if a doctor name
    was entered) `add_provider` against the returned practice id, marked
    `is_primary`. Previously a provider could only be added in a second step
    via the practice detail view's "Add doctor" button.
- `admin.html` — vendor/HIPAA risk register, Resend email tracking metrics
  (HubSpot-style), Telnyx call reporting/CSV export
- Importer supports HubSpot/Apollo CSV exports (underscore/space header
  normalization, segment column)

## Calendar integration (GitHub issue #3, open, assigned to Miguel)
Google Calendar two-way sync between CRM appointments and each provider's
Google Calendar. Backend lives in Convex (`gcal.ts`), not in this repo.
Frontend consumer is `crm.html`'s schedule (`renderToday`, in the "Calendar
widget" block).

- **Code-shielded by design**: CRM-origin events on Google carry only
  `"Consult · Patient #ref"` — never a patient name (no PHI on Google).
- External/personal events on a provider's Google calendar surface in the CRM
  only as opaque grey "Busy" blocks (free/busy), never pulled into Vitality's
  data model.
- **Phase 2a (enablement) — status disputed (2026-07-02)**: previously noted
  as confirmed live by Luis on 2026-07-01, but Luis's later message on issue
  #3 states `GOOGLE_SA_EMAIL` / `GOOGLE_SA_KEY` / `GCAL_PROVIDER_MAP` are all
  unset on the deployment, meaning `syncAppointment` is currently a no-op.
  Unresolved as of this writing, tracked as item 1 in the issue #3 discussion.
  Nothing below this line can be verified end-to-end until it's sorted out.
- **Phase 2b, busy overlay — DONE (2026-07-02)**: `crm.html`'s `renderToday()`
  calls `calFetchBusy()` whenever the visible month/week/day range changes,
  POSTing provider display names to `/gcal-freebusy`
  (`internal.gcal.freeBusyFor` in `vitality-convex/convex/gcal.ts`, which
  resolves names to calendar emails via `GCAL_PROVIDER_MAP` and echoes busy
  data back keyed by name). Busy intervals render as grey blocks/indicators
  alongside appointments in all three calendar views. This only ever shows
  external/personal events as opaque busy blocks, never pulled into
  Vitality's data model.
  - Chose on-demand polling over the originally-scoped push-notification
    watch channels for this piece specifically: `/gcal-freebusy` already
    computes fresh from Google on every call, so there's nothing for a
    webhook to invalidate, and this is an internal staff tool where polling
    per calendar-range change is imperceptibly different from push.
- **Phase 2b, two-way write-back — DONE (2026-07-02)**: CRM-origin
  appointments (created by `syncAppointment`) now sync back from Google.
  `syncAppointment` tags every event it writes with
  `extendedProperties.private.vit_appt_id` (`vitality-convex/convex/gcal.ts`),
  and a new `internal.gcal.runInboundSync` action, on a 10-minute
  `crons.interval` (`vitality-convex/convex/crons.ts`), polls each mapped
  provider's calendar for changes since the last Google `syncToken`
  (persisted per-provider in the new `vit_gcal_sync_state` table). Only
  events carrying our own `vit_appt_id` tag are ever eligible for write-back
  — a provider's personal/external events are never touched, matching the
  locked busy-only design. `internal.patients.applyInboundGcalChange` applies
  a reschedule or cancellation back onto `vit_appointments`, with
  loop-prevention (skips changes within 90s of our own last outbound write,
  via the new `gcal_last_synced_at` field) and idempotency (skips if the
  incoming state already matches what's stored) so polling doesn't create a
  write-back ↔ outbound-sync ping-pong or duplicate audit/note spam.
  - **Polling instead of push, and why**: Google's push-notification
    `watch()` API requires the receiving webhook's domain to be verified in
    Google Search Console under the same GCP project as the service account.
    Convex's `*.convex.site` host isn't a domain anyone here owns, so
    registering a watch channel is blocked until that's solved with separate
    infra (e.g. a small proxy on a domain IBS controls that forwards Google's
    notification POSTs to the real Convex endpoint) — outside this codebase,
    not something to build silently. Revisit push notifications only if
    10-minute polling lag proves genuinely insufficient; the diff/apply logic
    (tagging, loop-prevention, idempotency) is unchanged either way, only how
    "something changed" is learned would differ.
- Per-provider calendars, mapped via `GCAL_PROVIDER_MAP` (no shared clinic
  calendar, unless that changes later).

## Open compliance items
- Resend: non-PHI only; move clinical email to a BAA provider before sending
  clinical content
- Telnyx: BAA required before enabling transcript/recording storage or
  analysis of call content

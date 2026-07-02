# Vitality Weight Loss

GLP-1 medical weight loss practice. Client of IBS (see global CLAUDE.md). Static
multi-page HTML/JS site (no build step) hosted on GitHub Pages, backed by a
Convex deployment for auth, data, and server-side integrations.

## Stack
- Frontend: plain HTML/CSS/vanilla JS, no framework, no bundler
- Backend: Convex (deployment `quixotic-cat-492`) — auth, data, HTTP actions
- Auth: `@convex-dev/auth` Password provider (see `auth-convex.js`) — replaced a
  prior Supabase JWT bridge; identity now lives entirely on Convex
- Payments: Stripe, proxied through a Convex HTTP action (`/pay-stripe`)
- Calendar: Google Calendar sync lives on Convex (`gcal.ts`), not in this repo.
  Outbound sync (CRM → Google) is live. Inbound + busy overlay (phase 2b) is
  not yet built. See GitHub issue #3 and `docs/REFERENCE.md`.
- Voice: Telnyx AI receptionist (admin-only booking/hours/location line)
- Email: Resend (non-PHI patient/provider email only)
- Hosting: GitHub Pages (see `CNAME`), repo `Ooak21/vitalityweightloss.health`

## HIPAA / compliance posture
This is a healthcare site — PHI handling is a first-class concern.
- `admin.html` has a built-in vendor risk tracker (search `side:'us'`) listing
  each third party (Resend, Telnyx, Stripe, etc.), what data they touch, BAA
  status, and mitigations. Check it before wiring in a new vendor or data flow.
- Telnyx currently operates under a "Conduit Exception" — no BAA — but ONLY
  because the AI receptionist is admin-only and stores call metadata
  (intent/outcome/duration) in `vit_call_log`, never transcript/recording
  content. Enabling transcript/recording storage requires a BAA first.
- Resend is non-PHI only (appointment/marketing content). Clinical email needs
  a BAA-capable provider (e.g., Paubox) before it can carry clinical content.
- Session storage is split: `vca-vit-staff` vs `vca-vit-patient` localStorage
  keys, so staff and patient sessions never cross-drop on shared devices.
- When touching auth, email, voice, or payments code, check whether the change
  affects PHI exposure and update `admin.html`'s vendor tracker accordingly.

## Key files
- `index.html`, `glp1.html`, `glp1A.html`, `glp1B.html`, `bloom.html`,
  `total-male.html` — public marketing/landing pages (GLP-1, Bloom, and Total
  Male program variants). `index.html`'s top-nav announcement reel
  (`navSlot`/`navSlotReel`) cycles all three programs. The "no-needle option"
  FAQ card on `index.html` describes a daily oral semaglutide pill (asset:
  `assets/semaglutide-pills.jpg`), not sublingual drops — the dropper product
  (`assets/semaglutide-dropper.png`) is retired from that card.
- `intake.html`, `checkout.html`, `eligibility-check/` — patient intake and
  Stripe checkout flow
- `portal.html`, `portal-login.html` — patient portal
- `crm.html` — internal staff CRM (leads, partners, GLP-1 Rx review queue,
  calendar). This is the actively developed internal tool.
- `admin.html` — internal admin panel: vendor/HIPAA risk tracker, email
  tracking metrics (Resend events), call reporting (Telnyx)
- `auth-convex.js` — Convex-native auth client (sign in/up/out, token refresh)
- `handbook-render.js`, `prelaunch.js` — supporting page logic
- `blog/`, `guides/`, `magazine/`, and many topic subfolders — static content
  pages, each typically its own small folder

## Conventions
- No em dashes in copy (matches global style preference)
- Convex URLs are hardcoded per-file as `https://quixotic-cat-492.convex.cloud`
  / `.convex.site` — no env var indirection since this is a static site
- No package.json / build tooling — everything is loaded via `<script>` tags
  or ESM imports from esm.sh (see `auth-convex.js`)

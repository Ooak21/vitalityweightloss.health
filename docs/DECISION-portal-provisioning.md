# Decision record: patient portal login is STAFF-PROVISIONED (self-registration stays OFF)

**Date:** 2026-07-06
**Decision owner:** Luis Ocadiz (IBS)
**Status:** Decided and implemented
**Scope:** Web intake to patient portal, Vitality Weight Loss. The underlying control is platform-wide (all products on Convex deployment `quixotic-cat-492`).
**Type:** This is a COMPLIANCE / SECURITY decision, not just a UX one. Read the risk section before changing it.

## The decision

A patient who completes web intake does NOT self-create a portal login. Their chart is created, and a front-desk task is generated to provision the login; a staff member creates it and emails the patient their access. The intake success screen tells the patient their portal is being set up.

We deliberately KEPT the platform's self-registration guard in `convex/auth.ts`:

```js
Password({
  profile(params) {
    if (params.flow === "signUp") {
      throw new ConvexError("Self-registration is disabled. Accounts are provisioned by staff.");
    }
    ...
  }
})
```

## Why this is a compliance decision

The self-registration guard is an intentional HIPAA-aligned access control. It ensures every account with access to a patient portal (and therefore to PHI) is created by a verified staff member, rather than by anyone on the public internet who can submit a form. For a covered entity, provisioning-by-staff supports:

- **Identity verification before PHI access.** Staff confirm the person is who they claim before issuing portal credentials. Self-registration issues credentials to an unverified email.
- **Minimum necessary / access management.** Account creation is a controlled, auditable staff action, not an open endpoint.
- **Reduced attack surface pre-launch and pre-BAA.** No public account-creation path to abuse (spam accounts, enumeration, credential stuffing against a signup flow).

## The alternative we rejected, and its risk

The alternative was **self-serve signup**: the password a patient sets at intake would create a real Convex account so the portal works instantly (better for the marketing funnel: intake to engaged in one step).

We rejected it because enabling it is a **compliance risk**:

- It requires REMOVING the `auth.ts` guard, which opens self-registration **platform-wide** across every product on `quixotic-cat-492`, not just Vitality intake.
- It issues portal credentials to **unverified identities** on a healthcare platform, before BAAs are in place and before launch.
- The blast radius is bounded (a self-registered account only ever sees its own chart via identity-scoped access, never another patient's), but it still reverses a deliberate control and weakens the identity-verification posture.

If self-serve is ever wanted later, it must be paired with, at minimum: email verification, an identity check appropriate to PHI access, rate limiting on the signup endpoint, and confirmation that BAAs cover the flow. That is a separate, reviewed change, not a one-line guard removal.

## What was actually broken (context)

Before this decision, intake posted to a legacy Supabase `vit-portal-signup` and signed in via Supabase. The portal runs on Convex auth (different token store). Verified end-to-end 2026-07-06:

- Intake showed "You're all set, go to your patient portal," but the portal never authenticated (Supabase session, Convex portal).
- Logging in later with the intake password returned "Invalid email or password" (the account was in Supabase, not Convex).
- The patient's chart was NOT lost (it is created via the Convex `/patient-prefs` bridge). Only the login was broken, and it failed silently with a false success screen.

## Implementation

- `intake.html`: no longer attempts a self-serve signup. It creates the chart + eligibility tags via `/patient-prefs` with `requestPortalLogin: true`. The success screen says the portal login is being set up and will be emailed (no dead-end link).
- `convex/http.ts` `/patient-prefs`: on `requestPortalLogin`, calls `tasks.createProvisionLogin`.
- `convex/tasks.ts` `createProvisionLogin`: idempotent front-desk task ("Set up portal login — <name>") assigned to Front desk.
- `convex/patients.ts` `upsertPrefsByEmail`: now carries `tags` onto the Convex patient (eligibility flags previously only reached the dead Supabase record).
- `convex/auth.ts`: UNCHANGED. The self-registration guard stays.
- Staff provision the login via the CRM (open the patient record, Create portal login) and email the patient.

## If you revisit this

Do not remove the `auth.ts` guard without an explicit, documented compliance sign-off. It is platform-wide and it is the identity-verification control. See the risk section above.

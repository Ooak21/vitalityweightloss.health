# Decision record: Delinah Gaitan granted PROVIDER access (clinical / PHI tier)

**Date:** 2026-07-07
**Decision owner:** Luis Ocadiz (IBS)
**Authorized by:** Fred Corona (CGO, Vitality), written email request, retained for the record
**Status:** Decided and implemented. INTERIM, review after staff training Saturday 2026-07-11.
**Scope:** Workforce access. One person: Delinah Gaitan, `dgaitan@vitalityacademies.health`, on Convex deployment `quixotic-cat-492`.
**Type:** COMPLIANCE / access-management decision. It grants PHI visibility. Read the minimum-necessary section before changing it.

## The decision

Delinah Gaitan is granted the **provider** role in the Vitality CRM, the clinical tier. This gives her:

- Generation of both Personal Transformation Plans (the VBIS handbook / plan generator).
- Visibility of provider clinical notes (Ana Trujillo, Dr. DeBry) and, on the Tasks board, patient names + medications on Rx-pending tasks that are redacted for non-providers.
- The ability to discuss plans and clinical detail with patients.

She was first provisioned at the **staff** tier on 2026-07-07, then elevated to **provider** the same day at the client's written request.

## Business justification

Delinah is moving from a strictly-sales role into a broader **office role**. Per the clinic she needs to (a) generate the two Personal Transformation Plans, (b) discuss them with patients, and (c) see notes from Ana or the doctor. Items (b) and (c) require the clinical / PHI tier.

## Authorization

Fred Corona (CGO) requested this in writing by email on 2026-07-07:

> "As discussed, as we determine the best path forward, I request that you please give Delinah provider access so she can also generate Personal Transformation Plans. Please keep this email for your records."

The email is retained by Luis Ocadiz as the authorization record. IBS specifically obtained written authorization before widening PHI access.

## Minimum-necessary analysis

Generating the Personal Transformation Plans by itself only requires the **staff** role. The generator is gated by `requireStaff` (`convex/plan.ts`, comment "staff-only; provider/admin review the result"). So plan generation alone did not require elevation; Delinah could already do it at staff.

**Provider** was granted specifically for the clinical-note visibility (Ana / Dr.) and patient-facing plan discussion the clinic asked for. That is a deliberate, authorized PHI expansion, not a side effect of the plan feature. The delta was surfaced to and accepted by the decision owner and the covered entity before the grant.

Because this is interim ("as we determine the best path forward"), the exact role and permissions will be finalized after staff training on **Saturday 2026-07-11**. Retune with `seedAccounts.setRoleByEmail` in either direction.

## What provider unlocks (technical)

- `tasks.ts` `canSeeClinical = me.role === "provider"` reveals patient name + medication on clinical Rx tasks that are otherwise locked and redacted for staff.
- Provider status on the Tasks board makes her a *fallback* Rx-task assignee (`tasks.ts` falls back to "any provider" only if the `/debry/` match misses). Dr. DeBry remains the primary Rx assignee, so routing is unchanged.
- She does NOT automatically receive Rx alert emails. That is the single `VIT_PROVIDER_EMAIL` recipient, currently Dr. DeBry.

## Implementation

- `seedAccounts.provisionStaff` created the login + `vitality_staff` global role + `vit_staff` row (2026-07-07).
- `seedAccounts.setRoleByEmail {email, globalRole: "vitality_provider", staffRole: "provider"}` elevated both layers.
- Verified on the Access Control board: `role: provider`.
- Login: `dgaitan@vitalityacademies.health` (the helper lowercases it). A temp password was issued, to be rotated by Delinah.
- Source roster (`vitality-convex/convex/seedAccounts.ts`) updated to reflect her; she was provisioned live, not seeded.

## Open compliance item

The role change was made with the `setRoleByEmail` ops helper, which does not write a `vit_audit_log` entry. So there is currently no in-system tamper-evident audit row for this grant; this human-readable decision record plus the retained email are the authorization trail. A tamper-evident `vit_audit_log` entry, plus enhancing `setRoleByEmail` / `provisionStaff` to auto-audit future role changes, is pending. It needs a small helper deployed, and a clean deploy is blocked until the current 10-file uncommitted drift in `vitality-convex` is reconciled. Tracked; complete before real-PHI go-live.

## If you revisit this

This is an interim grant pending the 2026-07-11 training. Any change to Delinah's access should be re-documented here (or superseded by a training-outcome record) and, for a reduction or removal, done via `setRoleByEmail`. Do not widen anyone else's PHI access without written authorization from the covered entity, as was obtained here.

# Google Calendar Sync - OAuth Refresh Token Setup (Miguel)

**Owner of this task:** Miguel. **Est. time:** ~20-30 minutes. **You do not touch the backend** - your job is to produce 3 secrets + 2 decisions and hand them to Luis. Luis wires them into the Convex backend.

---

## Why we are doing this (read this first, it explains everything)

We want the CRM to sync appointments to Google Calendar (and read a provider's busy times so we do not double-book). Two ways to authenticate to Google:

1. **Service account + domain-wide delegation** (the original plan). This needs a downloaded service-account KEY file, and it needs a Google Workspace super-admin to authorize the account. **We just hit a wall on this:** the Google org has a security policy turned on (`iam.disableServiceAccountKeyCreation`) that BLOCKS creating those keys. That is the error you saw. So this path is dead unless an org admin turns that policy off, which we do not want to do.

2. **OAuth 2.0 with a refresh token** (what this doc sets up). One Google account signs in ONCE and grants permission. Google gives us a long-lived "refresh token." Our backend uses that refresh token to mint short-lived access tokens whenever it needs to talk to Calendar. **No service-account key, so the org policy does not apply. No super-admin delegation step. Just one consent click.** This is the cleaner path and it is the one we are taking.

That is the whole reason for the switch: the key-creation policy blocked path #1, and path #2 sidesteps it entirely.

---

## What you are producing (the deliverable)

Hand these to Luis when you are done (send them SECURELY - not in a plain text/email; use a password manager share or a secure note):

1. `GOOGLE_OAUTH_CLIENT_ID`
2. `GOOGLE_OAUTH_CLIENT_SECRET`
3. `GOOGLE_OAUTH_REFRESH_TOKEN`

Plus two decisions (see Step 0):

4. **Which Google account** owns the calendar we sync (the account you sign in as in Step 4).
5. **Which calendar(s)** to sync - either that account's primary calendar, or specific calendar IDs.

That is it. Once Luis has those, he does the backend wiring and turns it on.

---

## Step 0 - Decide the calendar account (do this before anything else)

Pick the Google account that will "own" the calendar sync. **Strong recommendation: use a Google account that lives inside the `vitalityacademies.health` Google Workspace** (for example a shared scheduling account, or Fred's/the clinic's Workspace account). 

**Why this matters a lot:** in Step 2 you configure an OAuth consent screen. If that account is a Workspace account, you can set the consent screen to **"Internal,"** and the refresh token **never expires**. If you use a personal gmail (an "External" app left in "Testing" status), **the refresh token dies after 7 days** and the sync silently breaks a week later. So: use a Workspace account and pick "Internal." This is the single biggest gotcha in this whole process.

The account you pick must have access to whatever calendars we want to sync. Simplest for v1: sync to ONE shared calendar (e.g. "Vitality Appointments") that this account owns. If we later want per-provider calendars, each provider shares their calendar with this account (with "Make changes to events" permission) and we reference each calendar by its ID.

Confirm the account choice with Luis/Fred before proceeding.

---

## Step 1 - Enable the Google Calendar API

1. Go to **console.cloud.google.com** and make sure you are in the **VitalityCalanderSync** project (top project picker).
2. Left menu (or search bar) -> **APIs & Services -> Library**.
3. Search **"Google Calendar API"** -> click it -> **Enable**.

---

## Step 2 - Configure the OAuth consent screen

1. **APIs & Services -> OAuth consent screen**.
2. **User type:** choose **Internal** if the account from Step 0 is a `@vitalityacademies.health` Workspace account (this is what we want - no token expiry, no verification hassle). Only choose "External" if you had to use a non-Workspace account.
3. **App name:** `Vitality Calendar Sync`. **User support email:** the account from Step 0. **Developer contact:** same. Save and continue.
4. **Scopes:** click **Add or Remove Scopes**, then in the filter/manual box add exactly:
   ```
   https://www.googleapis.com/auth/calendar
   ```
   (that is full read/write calendar access - we need it to both create events and read busy times). Update -> Save and continue.
5. If you were forced into **External**: add the Step 0 account as a **Test user**, AND before finishing, you MUST later set the app to **"In production" / Publish** status (External + "Testing" = 7-day token death). If you used **Internal**, skip this - you are fine.

---

## Step 3 - Create OAuth client credentials

1. **APIs & Services -> Credentials -> Create Credentials -> OAuth client ID**.
2. **Application type:** **Web application**.
3. **Name:** `Vitality Calendar Sync client`.
4. Under **Authorized redirect URIs**, click **Add URI** and paste EXACTLY:
   ```
   https://developers.google.com/oauthplayground
   ```
   (this lets us use Google's OAuth Playground in Step 4 to grab the refresh token without writing any code.)
5. **Create.** A popup shows your **Client ID** and **Client Secret**. Copy both somewhere safe - these are deliverables #1 and #2.

---

## Step 4 - Get the refresh token (Google OAuth Playground, no code)

1. Open **https://developers.google.com/oauthplayground** in a browser.
2. Click the **gear icon (⚙, top right)** -> check **"Use your own OAuth credentials"** -> paste the **Client ID** and **Client Secret** from Step 3 -> close the gear panel.
3. On the **left (Step 1 - Select & authorize APIs)**, in the "Input your own scopes" box at the bottom, paste:
   ```
   https://www.googleapis.com/auth/calendar
   ```
   -> click **Authorize APIs**.
4. A Google sign-in opens. **Sign in as the Step 0 account** (the calendar owner) and click through the consent (Allow). If it warns the app is unverified (only happens on External), continue via "Advanced -> go to Vitality Calendar Sync".
5. You are returned to the Playground on **Step 2**. Click **Exchange authorization code for tokens**.
6. The response panel now shows an **Access token** AND a **Refresh token**. **Copy the Refresh token** - that is deliverable #3.

**Gotcha:** if you see an access token but NO refresh token, Google only returns the refresh token on the FIRST consent for that account+client. Fix: go to https://myaccount.google.com/permissions (signed in as the Step 0 account), remove "Vitality Calendar Sync," then redo steps 3-6. The Playground already requests offline access + forces consent, so a fresh authorization returns the refresh token.

---

## Step 5 - Hand off to Luis

Send Luis, securely:
- `GOOGLE_OAUTH_CLIENT_ID` (Step 3)
- `GOOGLE_OAUTH_CLIENT_SECRET` (Step 3)
- `GOOGLE_OAUTH_REFRESH_TOKEN` (Step 4)
- the **calendar owner account email** (Step 0)
- the **calendar ID(s)** to sync. For the owner's main calendar this is literally `primary`. For a specific/shared calendar, get its ID from Google Calendar -> that calendar's Settings -> "Integrate calendar" -> **Calendar ID** (looks like `xxxx@group.calendar.google.com`).

You are done. Reply on this task/issue when the values are sent.

---

## What happens next (Luis's part - here so you have the full picture, NOT your job)

Luis sets those 3 values as Convex secrets and reworks `convex/gcal.ts` from the service-account/JWT flow to the OAuth refresh-token flow:
- Exchange the refresh token for an access token at `https://oauth2.googleapis.com/token` (`grant_type=refresh_token`), cache it ~55 min.
- Use that access token as `Authorization: Bearer` on Calendar API calls (event insert/update/delete, freeBusy).
- `GCAL_PROVIDER_MAP` changes from provider->email (impersonation) to provider->calendarId (which calendar each provider's appointments write to).
- Everything stays "code-shield": event titles carry NO patient PHI (e.g. `Consult - Patient #8G8KD`).

No further action needed from you after Step 5.

---

## Quick reference - the two things that most often go wrong

1. **Refresh token expires after 7 days** -> you used External + "Testing." Fix: use an Internal (Workspace) consent screen, OR publish the External app to production.
2. **No refresh token returned in the Playground** -> the account already consented once. Revoke at myaccount.google.com/permissions and re-authorize.

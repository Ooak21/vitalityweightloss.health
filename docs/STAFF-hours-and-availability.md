# Hours & availability — how the clinic controls its own schedule

*Staff guide. Lives in the CRM under **Hours** in the top navigation.*

---

## Why this matters

Vitality now takes bookings on three surfaces:

- the **front desk**, booking in the CRM
- **Vee on the phone**, when someone calls the clinic line
- **Vee in the website chat**, when someone books from vitalityweightloss.health

All three read **one schedule** — the one in the Hours tab. There is no separate calendar for the
phone or the website. If a time is open here, Vee can give it away. If it is not open here, nobody
gets offered it.

So the rule is simple: **the Hours tab is the clinic's word on when people can be booked.** Keeping
it current is what stops a patient being scheduled at a time that does not really exist.

---

## Opening it

CRM → **Hours** (top right, next to Templates and Sequences).

---

## 1. Weekly hours

Pick a person or resource on the left (Dr. DeBry, Richard DeVera, Front Desk, the InBody scanner).
The right side is their normal week.

Each day is made of **blocks**:

| Block | What it means |
|---|---|
| **open** | Bookable. This is the only block that creates appointment times. |
| **lunch** | Carved back out of the open block. Nothing can be booked in it. |
| **admin** | Same as lunch — blocked off for admin, charting, meetings. |
| **closed** | Blocked off. |

A day with no blocks at all is **closed** — nobody can be booked that day.

**To change a day:** edit the times, use **+ add** for a second block, or **remove** to delete one.
Then press **Save hours**. Nothing is saved until you press it.

> **Example — Dr. DeBry is at the eye center on weekday mornings.**
> Set Monday to a single **open** block of 3:00 PM to 5:00 PM, and do the same for the other
> weekdays. Vee will then never offer him a morning. Or delete every weekday block, and Vee will
> not offer him during the week at all.

## 2. "Vee may book"

The checkbox above the week. It controls **the AI only**.

- **Checked** — Vee may book this person on the phone and in the website chat.
- **Unchecked** — Vee will not offer them to anyone. **The front desk can still book them normally
  in the CRM.**

Use this when someone should be scheduled by a human only.

## 3. Closures & one-off changes

For anything that is not the normal week: holidays, PTO, a conference, closing early.

Pick a **date**, choose **who** (a single person, or *Whole clinic*), add a short **reason**, and
press **+ Close that day**. It overrides the weekly hours for that date and appears in the list
above until it passes.

Closing the **whole clinic** on a date takes everybody off, including Vee.

## 4. Appointment types

The length of each visit — Consult, InBody, Follow-up, Injection. Change the number of minutes and
press **Save durations**. That length is what gets blocked out on the calendar when someone books.

---

## How Google Calendar fits in

For any provider with a linked Google Calendar, **busy time in Google is removed on top of these
hours.** A surgery or a personal appointment on the linked calendar automatically closes that time
here. You do not need to enter it twice.

Two things to know:

- Google **only removes** time. It never adds bookable time. If a day is closed in the Hours tab,
  an empty Google calendar will not open it back up.
- This only applies to providers whose calendar is actually linked. **Right now that is Dr. DeBry
  only.** For everyone else, the Hours tab plus what is already booked in the CRM is the whole
  picture — so their real commitments need to be reflected here.

---

## Quick answers

**Someone was offered a time that was not really available.**
Check that person's weekly hours in the Hours tab. That is where the time came from.

**We need to stop the AI booking someone today.**
Uncheck **Vee may book** for them and save. Takes effect immediately. The front desk is unaffected.

**We are closed Thanksgiving.**
Closures → the date → *Whole clinic* → reason "Thanksgiving" → **Close that day**.

**A provider's hours changed permanently.**
Edit their weekly hours and **Save hours**. That is the change — nothing else to update.

**Do I need to enter appointments here?**
No. This is only *when people can be booked*. Actual appointments stay on the board and the Clinic
schedule view.

---

## One habit

When a provider's schedule changes — new day, different hours, a week off — **update the Hours tab
the same day**. It takes under a minute and it is the difference between the phone offering real
times and offering times that do not exist.

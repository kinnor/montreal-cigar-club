# Membership Admission Process — Montreal Cigar Club

*Processus d’admission des membres — Club de Cigare de Montréal*
Version 1.0 · 2026-08-29 · Owner: the Membership Committee (three founding members)

The website promises applicants: **"The Membership Committee will review your application with strict discretion and reply within thirty days."** This document is the internal procedure that keeps that promise.

---

## 1. Principles

| Principle | What it means in practice |
|---|---|
| **Discretion both ways** | Nothing about an applicant is shared outside the committee. Declined applicants are told so courteously, without reasons, and their data is deleted after 12 months. |
| **People, not paperwork** | The only form is the website inquiry. Admission is decided after an in-person conversation, never on paper alone. |
| **Unanimity** | All three founding members must agree to admit. One "no" is a decline (or a deferral, see §4). |
| **Adults only, legally** | 18+ is confirmed at application, checked at the conversation (ID), and restated in the membership agreement. |
| **Capacity first** | Le Fondateur is capped at **50 lockers**; Le Cercle at a number the committee sets each season (suggested 120). Applications beyond capacity go to a waiting list in order of the conversation date. |

## 2. Pipeline and service levels

| Stage | Status in the record | Who | Target time | Applicant hears |
|---|---|---|---|---|
| 0. Inquiry received | `received` | Website → email to `admissions@` + auto-acknowledgement to applicant | Instant | Acknowledgement email with reference `MCC-XXXXXXXX` and this timeline |
| 1. Preliminary review | `review` | Committee secretary (rotating) | ≤ 7 days | Nothing yet |
| 2. Conversation | `conversation` | One founding member (the "sponsor") | Meeting held ≤ 21 days from inquiry | Email proposing 2–3 dates; meeting over a cigar at a salon, a lounge, or the club |
| 3. Committee decision | `committee` | All three founders, at the monthly committee sitting | ≤ 30 days from the conversation | — |
| 4a. Accepted | `accepted` | Sponsor | ≤ 3 days after decision | Welcome email → membership agreement + dues invoice (e-transfer or card) |
| 4b. Waiting list | `waitlist` | Secretary | ≤ 3 days | Email: accepted in principle, seat/locker pending; position not disclosed |
| 4c. Declined | `declined` | Sponsor | ≤ 3 days | Short, warm email; no reasons given; may re-apply after 12 months |
| 5. Onboarding | `member` | Concierge | First salon after payment | Key + passcode handed over in person; locker assigned (Fondateur); allocation profile recorded |

**Hard deadline:** if for any reason the conversation cannot happen within 30 days of the inquiry, the sponsor writes to the applicant with a new date — the applicant must never wait in silence longer than 30 days.

## 3. Preliminary review checklist (stage 1)

The secretary opens the notification email (or `GET /api/admin/submissions?kind=apply`) and checks:

1. **Identity plausibility** — real name, working email, phone if given. Obvious pseudonyms → `declined` without conversation.
2. **Age** — the 18+ box is mandatory on the form; the sponsor will see ID at the conversation.
3. **Tier requested** — Fondateur requests when the 50 lockers are taken automatically go to `waitlist` for Fondateur and are offered Le Cercle meanwhile.
4. **Duplicates / re-applications** — same person within 12 months of a decline → polite hold.
5. **Assign a sponsor** — round-robin among the three founders, unless one already knows the applicant (then that founder sponsors, and the other two decide the vote without the sponsor's "yes" counting twice).

## 4. The conversation (stage 2)

Purpose: to meet the person, not to interview them. The sponsor covers, informally:

- What they smoke, what they want from a club, how they heard of us
- Club culture: no photography of other members, no business solicitation at salons, guests are the member's responsibility, smoking only where the venue permits (Quebec *Tobacco Control Act*)
- Practicalities: dues, locker terms (Fondateur), allocation rests 30 days in the vault, reciprocal clubs
- ID check (18+) — done discreetly

The sponsor writes a **five-line note** to the committee thread the same day: who, palate, fit, concerns, recommendation (admit / defer / decline). "Defer" = revisit after a second meeting or a guest visit to a salon.

## 5. Committee sitting (stage 3)

- Monthly, first week of the month; also by email round if a Fondateur locker frees up mid-month.
- Each application: sponsor's note read, vote recorded (**admit / defer / decline**), decision logged with the date.
- Tie-break does not exist — unanimity or defer. A second defer becomes a decline.

## 6. Acceptance package (stage 4a)

1. Welcome email from the sponsor (personal, not templated)
2. Membership agreement (PDF) — tier, dues, term (12 months, renewable), house rules, privacy notice, locker terms if Fondateur
3. Dues: Le Cercle $1,850 CAD / year · Le Fondateur $4,500 CAD / year — payable within 14 days at **https://montrealcigarclub.ca/dues** (Stripe hosted checkout; the acceptance email includes the link and the applicant's MCC reference); membership starts on payment. The committee receives a "[MCC] Dues paid" email from the webhook
4. Concierge schedules the first salon and prepares key, passcode, and locker plate

## 7. Data handling (Privacy Policy §5)

- Application records live in the site's KV store and in the `admissions@` mailbox only
- Set the status on the record as the file moves; add the decision date
- Delete declined files 12 months after the decision; keep accepted files for the membership + 2 years
- Anyone may ask for access, correction or deletion at `admissions@` — answer within 30 days

## 8. Tooling

| Need | How |
|---|---|
| Be notified of each application / RSVP | Email from `admissions@montrealcigarclub.ca` to `MAIL_TO` (the founder's verified inbox). Applicants write back to `admissions@`, which Email Routing forwards to the same inbox |
| Read all records | `GET https://montrealcigarclub.ca/api/admin/submissions?kind=apply` with `Authorization: Bearer <ADMIN_TOKEN>` |
| Update a record's status | `POST https://montrealcigarclub.ca/api/admin/submissions` body `{"id":"sub:apply:…","status":"conversation","note":"…"}` (same Bearer token) |
| Release RSVP seats (cancellation) | same endpoint with `{"id":"sub:rsvp:…","status":"cancelled"}` — seats return to the pool automatically |
| Reply to an applicant | Reply to the notification email (Reply-To is the applicant) from the `admissions@` identity |

## 9. Salon bookings (RSVP) — companion process

- Seats are reserved on the website at request time and shown as "N seats left"; the concierge **confirms** (`confirmed`) or **cancels** (`cancelled`, which frees the seats) within 3 days
- Non-members: the concierge checks that a member vouches for them or that they are on the applicant pipeline
- Full salon → website shows "Fully booked"; waiting-list requests go to `concierge@`

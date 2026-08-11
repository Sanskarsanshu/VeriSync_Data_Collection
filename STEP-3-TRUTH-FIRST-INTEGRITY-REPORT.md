# STEP 3 — TRUTH-FIRST INTEGRITY REPORT

**Date:** 2026-08-11
**Mode:** READ-ONLY verification. No database writes, no source edits, no migrations, no out-of-scope folder changes.
**Databases inspected:** Neon Postgres (live) via SELECT-only script.
**Code inspected:** `backend/src` (58 `.ts` files) + `frontend_v2/src` (all pages/stores), read-only.

---

## 1. Executive Summary

The system contains three distinct layers of data that do not agree with each other:

1. **Live PostgreSQL (the only truthful source)** — 17 users, 11 students, 5 teachers, 1 admin, 24 subjects, 12 courses, 3 sections, 3 semesters, 3 batches, 3 academic sessions, 3 academic calendars, 26 scheduled classes, 26 attendance sessions (all `LIVE`), 2 attendance records, 2 face embeddings, 23 timetable rules, 6 calendar events, 0 audit logs, 0 revisions, 0 enrollment tokens.
2. **Backend hard-coded fabrications** — `students.service.ts`, `teachers.service.ts`, `subjects.service.ts`, `enrollment.service.ts`, `admin.service.ts`, `attendance.service.ts`, `teacher-portal.service.ts` all return values that do not exist in the database (fabricated course codes like `EC202`, fabricated employee IDs `FAC2021…FAC2023`, fabricated `faceEnrolled: true`, fabricated semester numbers, hardcoded years, default passwords, fallback percentages).
3. **Frontend hard-coded fabrications** — `useDataStore.ts` ships static `initialSubjects`, `initialTeachers`, `initialAuthorizations` and hardcoded attendance/matrices that are displayed as if they were live database data, plus a hardcoded API base URL `http://localhost:3001` (the backend defaults to port 3000 and CORS only whitelists 5173/3000).

**Headline risks:**
- 9 of 11 students (`sectionId 2fa71035`) have **no courses** assigned to their section — they cannot participate in any attendance flow for a real course.
- 3 of 12 courses (`CC101`, `CC103`, `MDC302`) are owned by an **INACTIVE teacher** (Richa Verma, `RV`).
- 25 of 26 scheduled classes are mass-generated 10-minute test slots for `CC208` on a single day.
- All 26 attendance sessions are stuck in `LIVE` and were never closed.
- The only 2 attendance records contain **verification-flag contradictions** and one is **cross-section** (student from section `2fa71035` marked in a section-`bb33bb36` course).
- The only live attendance session (`9fe396a5`) carries a `dynamicQrSecret` that is **not** a base64 JWT token (6-char plaintext `"aovjlhi"`) — produced by a code path inconsistent with the current service.

This report is **read-only**. Nothing below has been changed. All proposed corrections are listed as BEFORE→AFTER candidates and remain `UNRESOLVED` until the owner explicitly approves.

---

## 2. Scope & Method

| Item | Status |
|---|---|
| DB SELECT-only introspection | Done — no writes |
| Backend source read (58 `.ts`) | Done — no edits |
| Frontend source read (`frontend_v2/src`) | Done — no edits |
| Out-of-scope folders (`my_mvp/`, `temp_repo/`, `VeriSync_Safe_Backup/`, `docs/`, `frontend/`) | Read-only context only — not modified |
| Migrations / seeds / scripts | Not run |

---

## 3. Portal Data-Source Classification

| Portal / Store | Data | Classification |
|---|---|---|
| Student dashboard/history (pages) | API calls w/ `credentials: include` | `DYNAMIC DATABASE DATA` (cookie-authenticated) |
| `useDataStore` CRUD calls | `fetchWithAuth` → hardcoded `http://localhost:3001` + Bearer | `UNKNOWN SOURCE` (wrong port; not in CORS whitelist) |
| `useDataStore.initialSubjects` | 24 hardcoded MCA subjects | `INCORRECT STATIC DATA` (mirrors DB but hardcoded; semester literals diverge from real enrollment) |
| `useDataStore.initialTeachers` | 5 hardcoded teachers | `INCORRECT STATIC DATA` (DB employee IDs are `RV/PK/SC/BKP/FAC2024`, not `FAC2020…FAC2023`) |
| `useDataStore.initialAuthorizations` | Hardcoded auth code `Wc7P2kLm9Q` FAC2021/CC102 | `INCORRECT STATIC DATA` (DB `EnrollmentTokens` count = 0) |
| Admin portal | `admin.service.ts` fallbacks | `INCORRECT STATIC DATA` when DB empty |
| Teacher portal | `teacher-portal.service.ts` | `DYNAMIC DATABASE DATA` + hardcoded year `2026` |
| Student profile | `students.service.ts` fallbacks | `INCORRECT STATIC DATA` (fabricated `EC202`/`CC101`, `faceEnrolled`, `room:'TBD'`) |
| Health root | `app.controller.ts` `'Hello World!'` | `SAFE STATIC DATA` (harmless) |

---

## 4. Database Truth — People

### 4.1 Users (17 total)
- **ADMIN:** 1 — `bhawna.mca@patnawomenscollege.in` → Admin row `Dr. Bhawna Sinha(HOD)` (`6809cbea-…`).
- **TEACHER:** 5 — see below.
- **STUDENT:** 11 — see below.
- All user `status: ACTIVE`.

### 4.2 Teachers (5) — DB truth
| employeeId | Name | Email | Teacher status | User status |
|---|---|---|---|---|
| `FAC2024` | Dr. Bhawna Sinha | `bhawnasinha@pwc.in` | ACTIVE | ACTIVE |
| `PK` | Dr. Praveen Kumar | `Praveenkumar.mca@pwc.in` | ACTIVE | ACTIVE |
| `SC` | Dr. Sushmita Chakraborty | `Sushmitachakraborty.mca@pwc.in` | ACTIVE | ACTIVE |
| `BKP` | Mr. Braj Kishore Prasad | `Brajkishoreprasad.mca@pwc.in` | ACTIVE | ACTIVE |
| `RV` | Richa Verma | `Ricaverma.mca@pwc.in` | **INACTIVE** | ACTIVE |

> Frontend `initialTeachers` hardcodes employee IDs `FAC2020` (Richa), `FAC2021` (Praveen), `FAC2022` (Sushmita), `FAC2023` (Braj). **DB truth:** `RV`, `PK`, `SC`, `BKP`. Only `FAC2024` (Bhawna) matches. This is a fabrication mismatch to reconcile.

> **Note:** The ADMIN "Dr. Bhawna Sinha(HOD)" and TEACHER "Dr. Bhawna Sinha" are **two different user accounts** (admin `006e047f-…`, teacher `1d335adb-…`, different emails).

### 4.3 Students (11) — DB truth
| rollNumber | registrationNumber | Name | Section |
|---|---|---|---|
| `23bec047` | `23bec047` | shree | `bb33bb36` (Section A) |
| `CS2021` | `23BEC045` | sita | `bb33bb36` (Section A) |
| `MCA030` | `25PWC0030` | Ananya Singh | `2fa71035` (Section A) |
| `MCA031` | `25PWC0031` | Garima | `2fa71035` |
| `MCA032` | `25PWC0032` | Harshita | `2fa71035` |
| `MCA033` | `25PWC0033` | Komal | `2fa71035` |
| `MCA034` | `25PWC0034` | Mahi | `2fa71035` |
| `MCA035` | `25PWC0035` | Neha | `2fa71035` |
| `MCA036` | `25PWC0036` | Pallavi | `2fa71035` |
| `MCA037` | `25PWC0037` | Pooja | `2fa71035` |
| `MCA038` | `25PWC0038` | Riya | `2fa71035` |

> **Anomalies:** shree's roll = reg = lowercase `23bec047` (format differs from `MCA0xx` cohort). sita roll `CS2021` ≠ reg `23BEC045` (mismatched values). All 9 students in `2fa71035` use the `MCA0xx`/`25PWC00xx` pattern.

### 4.4 Student profiles (11)
- 9 rows: `dob/gender/mobileNumber/email/bloodGroup/photoUrl` all `null`; `admissionYear 2025`, `expectedGraduationYear 2027`.
- 2 rows populated (shree, sita) incl. base64 `photoUrl` for shree.
- Face embeddings exist for **only 2 of 11** students (sita, shree) — yet `students.service.ts` fabricates `faceEnrolled: true` for everyone.

---

## 5. Database Truth — Academic Structure

### 5.1 Triplicate cohort (duplicate rows)
| Table | Count | Content |
|---|---|---|
| Sections | 3 | **All named "Section A"**, capacity 50, ACTIVE |
| Semesters | 3 | **All `semesterNumber 3`**, start 2026-07-01, end 2026-11-15 |
| Batches | 3 | **All "2025-2027 Cohort"** |
| Academic Sessions | 3 | **All startYear 2025 / endYear 2027** |
| Academic Calendars | 3 | **All "Academic Calendar 2026-2027"** — see §5.2 |

Three independent chains (section→semester→batch→session) describe the *same* cohort. Only two are in use: `bb33bb36` (2 students) and `2fa71035` (9 students). The third (`1a1245f0`) is empty.

### 5.2 Academic calendars
- All 3 calendars: `startDate 2026-06-01`, **`endDate 2026-05-31T23:59:59` — end date is BEFORE start date** (invalid range).
- 6 calendar events = 3× "Summer Vacation Ends" + 3× "Independence Day" (duplicated per calendar).
- Frontend renders 40+ hardcoded holidays that do not exist in DB calendar events (only 6 exist).

---

## 6. Database Truth — Curriculum

### 6.1 Subjects (24) — DB codes only (no `EC202` exists)
`CC101, CC102, CC103, CC104, CC105, CC206, CC207, CC208, CC209, CC310, CC311, CC312, CC313, CC414, DSE201, DSE402, MAEC101, MAEC302, MDC201, MDC302, SEC101, SEC202, SEC303, SEC404`.

> `EC202` (used as fallback in `students.service.ts`) **does not exist** in the DB.

### 6.2 Courses (12) — all assigned to section `bb33bb36` (Sem 3)
| courseId | code | name | primaryTeacher | teacher status |
|---|---|---|---|---|
| `0e188715` | CC105 | Python Programming | PK | ACTIVE |
| `114fddfd` | CC102 | Advanced DBMS | PK | ACTIVE |
| `1f5eea22` | CC101 | Software Engineering | RV | **INACTIVE** |
| `43b13781` | CC312 | Big Data Analytics | SC | ACTIVE |
| `5a81328f` | CC313 | Mini Project II (Lab) | PK | ACTIVE |
| `6493cec8` | CC104 | Data Communications & Networks | BKP | ACTIVE |
| `7182cce5` | CC208 | AI & ML | PK | ACTIVE |
| `7668a137` | CC311 | Cloud Computing | BKP | ACTIVE |
| `79b23401` | MDC302 | Digital Marketing & E-Commerce | RV | **INACTIVE** |
| `8ead6ebc` | CC310 | Advanced Web Designing (J2EE) | PK | ACTIVE |
| `9386af99` | CC103 | Design & Analysis of Algorithm | RV | **INACTIVE** |
| `9b69b313` | SEC101 | Data Visualization | FAC2024 | ACTIVE |

> **Risk:** 3 ACTIVE courses (`CC101`, `CC103`, `MDC302`) owned by an **INACTIVE** teacher (`RV`).

### 6.3 Course↔Student reachability (critical)
- Courses are scoped to section `bb33bb36` (Sem 3). Only students `shree` + `sita` are in that section.
- The other **9 students (`2fa71035`) have zero courses** → zero scheduled classes → no legitimate attendance possible.
- **EnrollmentTokens: 0** → no enrollment/authorization records exist for any student.

---

## 7. Database Truth — Attendance Chain

### 7.1 Scheduled classes (26)
- **1** for CC101 (`1f5eea22`) on **2026-08-07 10:00–11:00**.
- **25** for CC208 (`7182cce5`) **all on 2026-08-08**, each **10 minutes** long (12:26→12:36, 18:18→18:28, 18:34→18:44, …21:47) — clearly mass-generated test data.
- `duplicateScheduledClassesGrouped: []` (no exact duplicates by course/date/time).

### 7.2 Attendance sessions (26) — ALL `LIVE`, none closed
| verificationMethod | count |
|---|---|
| `null` | 1 |
| FACE | 16 |
| OTP | 3 |
| STATIC_QR | 2 |
| MANUAL | 1 |
| DYNAMIC_QR | 3 |

- Every session `status: LIVE`; no `ARCHIVED`/`CLOSED`.
- Session `9fe396a5` (CC101) carries `dynamicQrSecret: "aovjlhi"` (6-char plaintext — **not** a base64 JWT token) + `currentOtp: "650687"` + 2 records. This is inconsistent with the current `generateQrToken` code path → these rows were created by an older/different code path.

### 7.3 Attendance records (2) — both on session `9fe396a5` (CC101)
| id | student | method | status | markedAt | flags |
|---|---|---|---|---|---|
| `d7743384` | Ananya Singh (MCA030, section `2fa71035`) | MANUAL | PRESENT | 2026-08-07T07:23 | `verifiedByFace: true`, `verifiedByOtp: false` |
| `7889d370` | shree (23bec047, section `bb33bb36`) | FACE | PRESENT | 2026-08-09T10:27 | `verifiedByFace: false`, `verifiedByOtp: false` |

**Contradictions:**
- Record 1: method MANUAL but `verifiedByFace: true` — impossible combination.
- Record 2: method FACE but `verifiedByFace: false` — impossible combination; also marked 2 days after session open date (08-07).
- Record 1 is **cross-section**: student in `2fa71035`, course/session in `bb33bb36`.

### 7.4 Supporting tables
- AttendanceRevisions: **0** — no revision trail despite the UI expecting revisions.
- AuditLogs: **0** — the claimed audit feature has never written a row.
- FaceEmbeddings: **2** (sita `3baec3f4`, shree `1df47546`).
- TimetableRules: **23** (all rooms `null`).

---

## 8. Security Findings

| # | Finding | Severity |
|---|---|---|
| S1 | `jwt.strategy.ts:18` — `secretOrKey: process.env.JWT_SECRET || 'fallback-secret-for-dev'`. If env var missing in any deployment, tokens are forged with a **public default secret**. | High |
| S2 | Default password `'Welcome@123'` hard-coded in `teachers.service.ts` and `enrollment.service.ts` — predictable credentials for any auto-created account. | High |
| S3 | Dual auth: cookie (`HttpOnly`, safe) vs Bearer token stored in `sessionStorage` (XSS-readable). `useDataStore.fetchWithAuth` sends Bearer only, no `credentials: include`. | Medium |
| S4 | Frontend `fetchWithAuth` hardcodes `http://localhost:3001` (`useDataStore.ts:121`) — backend runs port **3000** (default) and CORS whitelist = `{FRONTEND_URL, localhost:5173, localhost:3000}` → store CRUD calls hit the **wrong port / not whitelisted**. | High |
| S5 | `verifiedByFace`/`verifiedByOtp` flags are stored without integrity enforcement — 2/2 existing records are internally contradictory. | Medium |
| S6 | Auth code `Wc7P2kLm9Q` (FAC2021/CC102, expiry 2026-11-15) hardcoded in frontend while DB `EnrollmentTokens` = 0 — static credential exposed in bundle with no DB counterpart. | Medium |
| S7 | Cross-section attendance record exists (`d7743384`) — indicates either a past server-side section check bypass or a manual DB write. | High |
| S8 | All 26 sessions `LIVE` with `closedAt` never set — no lifecycle enforcement on the old rows. | Low |

---

## 9. Relationship-Chain Findings

1. **Student→Section→Course gap:** 9/11 students have no courses in their own section. (Courses only exist under `bb33bb36`.)
2. **Teacher→Course mismatch:** `RV` is INACTIVE yet owns 3 ACTIVE courses.
3. **Admin↔Teacher account split:** `bhawna.mca@patnawomenscollege.in` (admin) vs `bhawnasinha@pwc.in` (teacher) — same person, two identities.
4. **Roll/reg inconsistency:** shree `23bec047`=lowercase-duplicated; sita roll `CS2021` ≠ reg `23BEC045`.
5. **Session→SessionSecret inconsistency:** `dynamicQrSecret` plaintext (`aovjlhi`) not base64 → old code path data.
6. **Calendar chain invalid:** 3 calendars with endDate < startDate.
7. **Triplicate cohort:** 3 parallel Section-A/Sem-3/2025-2027 chains.

---

## 10. Data-Leakage Risks

- Frontend static `initialTeachers`/`initialSubjects`/`initialAuthorizations` are rendered as if live → any user could see fabricated teacher/employee IDs and an authorization code that doesn't exist in DB.
- `useDataStore` Bearer token in `sessionStorage` is XSS-readable.
- Cross-section attendance row indicates section scoping was bypassed at least once historically; if the same flow still accepts client-side section/course pairing anywhere, students could mark in other sections.

---

## 11. Orphan / Integrity Risks

- Section `1a1245f0` + its semester/batch/session/calendar: **empty, fully orphaned** (no students, no courses).
- 9 students with no courses → unreachable by attendance features (functional orphans).
- 25 mass-generated CC208 scheduled classes (10-min slots) pollute the timetable.
- 26 `LIVE` sessions never closed.
- 3 courses owned by INACTIVE teacher.
- No EnrollmentTokens, no AuditLogs, no Revisions — audit/enrollment features are effectively non-functional in the DB.

---

## 12. Exact Records Requiring Correction (BEFORE → AFTER)

All items below are **proposals only** — they are **NOT applied**. Where the correct target value is unknown, the item is marked `UNRESOLVED`.

### R1 — `AttendanceRecord d7743384` (Ananya Singh, cross-section, MANUAL + verifiedByFace:true)
- BEFORE: `sessionId 9fe396a5 (CC101, section bb33bb36)`, `studentId 3fd8a884` (section `2fa71035`), method `MANUAL`, `verifiedByFace: true`.
- AFTER: `UNRESOLVED` — either delete the row (student not in course section) or flag it as a corrected record. Requires owner decision.

### R2 — `AttendanceRecord 7889d370` (shree, FACE + verifiedByFace:false, marked 2 days late)
- BEFORE: method `FACE`, `verifiedByFace: false`, `markedAt 2026-08-09` (session opened 08-07).
- AFTER: `UNRESOLVED` — flags are mutually contradictory; correct either the method or the flag, and confirm the 2-day-late marking legitimacy.

### R3 — Courses `CC101` / `CC103` / `MDC302` owned by INACTIVE teacher `RV`
- BEFORE: `primaryTeacherId = afa3299f` (RV, status INACTIVE), course status ACTIVE.
- AFTER: `UNRESOLVED` — either reactivate teacher `RV` or reassign courses to an ACTIVE teacher (PK/SC/BKP/FAC2024).

### R4 — 25 mass-generated `ScheduledClass` rows for `CC208` (2026-08-08)
- BEFORE: 25 ten-minute slots, same day.
- AFTER: `UNRESOLVED` — deletion candidate (test data). Requires owner approval for DELETE.

### R5 — 26 `AttendanceSession` rows stuck `LIVE`
- BEFORE: `status LIVE`, no `closedAt`.
- AFTER: `UNRESOLVED` — close/archive only with explicit owner approval; note risk of breaking the currently-open session workflow.

### R6 — Teacher employee-ID mismatch (DB vs frontend)
- BEFORE: frontend `initialTeachers` uses `FAC2020…FAC2023`; DB truth `RV/PK/SC/BKP/FAC2024`.
- AFTER: `UNRESOLVED` — the DB employee IDs are authoritative; frontend static list should be replaced by API data (frontend change, not a DB write).

### R7 — `EC202` fabricated subject fallback (`students.service.ts`)
- BEFORE: code paths return subject `EC202` / `CC101` when data is missing.
- AFTER: `UNRESOLVED` — no DB subject `EC202` exists; replace fallback with real lookup or explicit "no data" state.

### R8 — Academic calendars `endDate < startDate`
- BEFORE: `startDate 2026-06-01`, `endDate 2026-05-31T23:59:59` (3 rows).
- AFTER: `UNRESOLVED` — intended range is likely `2026-06-01 → 2027-05-31`; confirm before any UPDATE.

### R9 — Duplicate cohort chains (Sections/Semesters/Batches/Sessions/Calendars)
- BEFORE: 3 identical "Section A"/Sem-3/"2025-2027 Cohort" chains; section `1a1245f0` empty.
- AFTER: `UNRESOLVED` — consolidation/cleanup is a destructive operation; requires explicit owner plan + backup + approval.

### R10 — Frontend hardcoded API base `http://localhost:3001`
- BEFORE: `useDataStore.ts:121` uses port 3001; backend serves on 3000; CORS whitelist excludes 3001.
- AFTER: `UNRESOLVED` — point to `VITE_API_URL`/same origin as other calls; frontend-only change.

---

## 13. Backend Fabricated-Value Inventory (report-only)

| File | Fabricated value(s) |
|---|---|
| `students.service.ts` | `EC202`/`CC101` fallbacks, `faceEnrolled:true`, `room:'TBD'`, `semester \|\| 3`, `AVATAR_COLORS`, `<75` risk threshold, `'Not provided'`/`'Not specified'`, `09:00 AM`, monthly absent `100`, CC101 matrix fallback |
| `teacher-portal.service.ts` | hardcoded year `2026` |
| `enrollment.service.ts` | hardcoded session `'2025-27'`, `'Welcome@123'`, `'MCA'`, fabricated IDs in helpers |
| `teachers.service.ts` | `FAC2021…FAC2024`, `*.mca@pwc.in`, fake UUIDs, `'Welcome@123'` |
| `subjects.service.ts` | hardcoded course codes incl. `CC101`, `CC102`, `EC202`, semester literals |
| `admin.service.ts` | stats fallback (`totalStudents:0`, percentages) |
| `attendance.service.ts` | `verificationMethod:null` handling, 30-min default QR, `'TBA'`, manual/OTP details |
| `app.controller.ts` / `app.service.ts` | `'Hello World!'` root, hardcoded `'api'` text |

---

## 14. Frontend Fabricated-Value Inventory (report-only)

| File | Fabricated value(s) |
|---|---|
| `useDataStore.ts` | hardcoded `http://localhost:3001`; `sessionStorage('verisync_token')`; `initialSubjects` (24 subjects, dates 2025-08-01→2026-05-30); `initialTeachers` (FAC2020–2024, `*.mca@pwc.in`); `initialAuthorizations` (`Wc7P2kLm9Q`, FAC2021/CC102, expiry 2026-11-15, session `'2…'`) |
| Pages/components | hardcoded attendance percentages/matrices, static student/teacher/course arrays, hardcoded JWT/user ids, role strings, dates `2026`, static fallbacks displayed as DB data |
| `generate_placeholders.cjs` | generates placeholder avatar files (not DB data) |

---

## 15. Auth / API Contract Verification

- `POST /api/auth/login` → sets HttpOnly cookie `verisync_session` (secure, sameSite `none`, 7d) **and** returns `access_token` in body.
- `JwtStrategy` accepts cookie **or** `Authorization: Bearer`.
- `GET /api/auth/me` validates JWT via guard; `getMe` uses `req.user.userId` from the token (server-derived, not client-supplied).
- `ProtectedRoute` uses `VITE_API_URL || '/api'` + `credentials: 'include'` (cookie flow) — **correct**.
- `useDataStore.fetchWithAuth` uses hardcoded `localhost:3001` + Bearer only — **inconsistent** with the rest of the app and with the server CORS config.
- Backend port: `process.env.PORT ?? 3000` (no `PORT` in `.env`) → **3000**.

---

## 16. Data-Loss Risk Assessment (if the proposals above were ever applied)

| Proposal | Data-loss risk if executed incorrectly |
|---|---|
| Delete 25 CC208 scheduled classes | Low (test data) but irreversible |
| Close 26 LIVE sessions | Low per-row, but must not close the currently open session workflow; needs idempotent close logic |
| Reassign 3 courses from RV | Medium — could leave orphaned sessions/records referencing old teacher if not handled together |
| Consolidate duplicate cohorts | **High** — section/semester/batch/session/calendar FK chains; must snapshot first |
| Fix calendar dates / roll numbers | Low-Medium — must confirm intended values first |
| Delete cross-section attendance record | Low (2 records exist) — must confirm it is not a real, legitimately-entered attendance |

> Rule honored: no UPDATE/DELETE/INSERT/ALTER/migration/seed performed. Any future write requires BEFORE→AFTER + snapshot + explicit approval.

---

## 17. Open Questions for the Owner (decision required)

1. Is Richa Verma (`RV`) still an active faculty member? Should she be re-activated or should `CC101/CC103/MDC302` be reassigned?
2. Are the 25 `CC208` 10-minute classes on 2026-08-08 real or test data? Can they be deleted?
3. Should the 2 attendance records (`d7743384`, `7889d370`) be kept, corrected, or removed?
4. Which of the 3 duplicate cohort chains is authoritative? Should the empty one (`1a1245f0`) be cleaned up?
5. Should attendance sessions be auto-closed when the class window ends (lifecycle rule)?
6. What is the correct API base URL for production — relative `/api`, `VITE_API_URL`, or a real host?
7. Are `Welcome@123`-created accounts acceptable for the demo, or should they be regenerated with unique passwords?
8. Should student `sita` rollNumber be `CS2021` or `23BEC045`? Should shree's roll be normalized to `23BEC047`?

---

## 18. Recommended Next Step

**Await owner approval.** Proposed Phase after sign-off (NOT started):
- D-1: Reconcile teacher/course ownership (RV question).
- D-2: Clean test scheduled classes + close stale LIVE sessions.
- D-3: Decide fate of the 2 contradictory attendance records and the cross-section row.
- D-4: Frontend truth-wiring: remove hardcoded `initialSubjects/Teachers/Authorizations`, point `fetchWithAuth` to a single API base, unify auth to the cookie flow (or Bearer) consistently.
- D-5: Backend truth-wiring: remove fabricated fallbacks (`EC202`, `faceEnrolled`, `FAC2021…`, `'2025-27'`, default passwords, hardcoded year).
- D-6: Cohort consolidation / orphan cleanup (only after explicit destructive-approval with snapshot).
- D-7: Attendance session lifecycle (auto-close, revision/audit writes).
- D-8: Enable real audit-log + enrollment-token persistence.

---

## 19. Deliverable Files (read-only outputs)

- `C:\Users\sansk\AppData\Local\Temp\opencode\db-truth.js` — SELECT-only DB introspection script (temp).
- `C:\Users\sansk\AppData\Local\Temp\opencode\db-truth-output.json` — 1.6 MB dump used for this report (temp).
- This report: `STEP-3-TRUTH-FIRST-INTEGRITY-REPORT.md`.

---

## 20. Closing Audit Line

**Files modified: 0 / Database writes: 0 / Records deleted: 0 / Records moved: 0 / Records overwritten: 0 / Migrations: 0 / Out-of-scope folders modified: 0.**

---

**Status: STOPPED — awaiting explicit owner approval before any Phase D write action.**

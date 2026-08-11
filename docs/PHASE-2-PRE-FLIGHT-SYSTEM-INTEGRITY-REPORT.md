# PHASE 2 PRE-FLIGHT / SYSTEM INTEGRITY REPORT

> **Scope:** Read-only, full cross-portal diagnosis of VeriSync (Admin / Teacher / Student).
> **Status:** DIAGNOSIS COMPLETE — NO CODE OR DATA WAS MODIFIED.
> **Date:** 2026-08-10
> **Method:** Source audit (backend + all 4 frontend trees), Prisma schema audit, live read-only Neon DB interrogation (`SELECT` only), route/guard matrix, API contract diff, static/mock inventory, orphan/cascade checks, test-baseline capture.

---

## 0. EXECUTIVE SUMMARY

VeriSync is a **single-backend, three-portal** system whose data model is fundamentally sound (User → Student/Teacher/Admin → Section → Course → TimetableRule → ScheduledClass → AttendanceSession → AttendanceRecord), but the **implementation is not yet integrated end-to-end**. The current database is the product of multiple ad-hoc seed/script runs and manual API testing, which has produced **real data-integrity damage** that no frontend can display correctly:

| # | Severity | Finding | Where |
|---|----------|---------|-------|
| D-1 | **CRITICAL** | 9 of 11 students (MCA030–MCA038) are stranded in a Semester-3 section that has **0 courses** → invisible to every Teacher roster, get no timetable, get no active session. | DB sections `2fa71035` vs canonical `bb33bb36` |
| D-2 | **CRITICAL** | **25 duplicate ScheduledClass + 25 duplicate AttendanceSession rows** all on one CC101 course (7182cce5…) on the same date — produced by the `startSession` silent `course.findFirst()` fallback. | `attendance.service.ts:31`, `:35` |
| D-3 | **CRITICAL** | **All 26 AttendanceSessions are LIVE and stale** (class dates 2026-08-07/08, now 2026-08-10) → student `active-session` shows dead sessions; admin "live sessions = 26" is meaningless. | DB `AttendanceSession` |
| D-4 | **HIGH** | Attendance verification is bypassable end-to-end: `qr-verify` treats the client-supplied `studentJwt` string as the student's `userId` with **no JWT decode/verify**, no OTP check, and token check only for `DYNAMIC_QR` sessions. | `attendance.service.ts:168`, `:158-164` |
| D-5 | **HIGH** | **No role/ownership authorization** on most routes. Attendance controller has **zero guards**; teacher-portal student/roster endpoints are JWT-only (any role, any course); `GET /students`, `GET /teachers`, `GET /subjects`, `POST/PATCH/DELETE /students|teachers|subjects` are **fully unauthenticated** (anyone can read the full roster incl. attendance, or modify/delete any record). | controllers (see §3 matrix) |
| D-6 | **HIGH** | Frontend never talks to a real production backend: base URLs are split between `/api` (proxy) and **hardcoded `http://localhost:3001`** (which differs from the backend default port **3000**); the Vite dev proxy strips `/api` that the backend serves under. 3 calls (`/attendance/mark`, `/attendance/simulate-class`, `/attendance/log-scan`) have **no backend route at all**. | `vite.config.ts:17-22`, student pages, `useDataStore.ts:121`, `frontend/src/lib/axios.ts:5` |
| D-7 | **HIGH** | Massive static/mock overlap: teachers `FAC2020–FAC2024`, subject codes, attendance %, sheets, holidays, corrections are hardcoded in ~25 pages; several admin/teacher screens render **pure mock data with no fetch**; Next.js admin pages contain fake faculty (Alan Turing, Ada Lovelace). | §5 inventory |
| D-8 | **MED** | AuditLog table is empty (0 rows) — no durable audit trail of real activity; enrollment OTP verification is permissive (`123456` always passes, in-memory store, no server-side "OTP verified" gate on submit). | `enrollment.service.ts:77-114` |

**Root cause:** no single source of truth was ever enforced — the DB was filled by several non-idempotent seeds (`prisma/seed.ts`, `backend/seed-courses.ts`, ad-hoc `find-*.js` scripts) plus manual `startSession` testing; the frontends were built against a mix of mock data and half-connected APIs.

**Verdict:** The system is **NOT ready for live attendance**. A data-repair pass (one canonical Section A, re-home the 9 students, close/archive stale sessions, de-duplicate the 25 sessions) must precede or accompany the code fixes. All recommended work is in §8 with a strict order.

---

## 1. CURRENT ARCHITECTURE

```
                        ┌──────────────────────────────────────────────┐
                        │            PostgreSQL / Neon (neondb)        │
                        │   User, Student, Teacher, Admin, Course,     │
                        │   Section, Semester, Batch, AcademicSession, │
                        │   Subject, TimetableRule, ScheduledClass,    │
                        │   AttendanceSession, AttendanceRecord,       │
                        │   FaceEmbedding, EnrollmentToken, AuditLog   │
                        └───────────────▲──────────────────────────────┘
                                        │ Prisma 5.22 (PrismaService)
                    ┌───────────────────┴───────────────────┐
                    │        NestJS backend  (port 3000)    │
                    │  global prefix /api · HttpOnly JWT    │
                    │  cookie verisync_session (7d)         │
                    │  modules: auth, students, teachers,   │
                    │  subjects, attendance, teacher-portal,│
                    │  enrollment, admin, timetable, calendar│
                    └───────┬──────────────┬───────────────┘
                            │ /api         │ /api
              ┌─────────────▼───┐   ┌──────▼──────────────────┐
              │ frontend_v2     │   │ frontend (Next.js 16)  │  ← NOT DEPLOYED
              │ Vite SPA (dev   │   │ axios baseURL          │    (root vercel.json
              │  proxy /api→    │   │ localhost:3001, no /api│     builds frontend_v2)
              │  3001, strips   │   └────────────────────────┘
              │  /api; 6 pages  │
              │  hardcode :3001 │   ┌────────────────────────┐
              └─────────────────┘   │ my_mvp (legacy, 0 HTTP,│ ← prototype
                                     │ localStorage only)    │
                                     ├────────────────────────┤
                                     │ temp_repo (Express +  │ ← separate duplicate
                                     │ Prisma, sid cookie,   │   full-stack clone
                                     │ InsightFace, 30s QR)  │
                                     └────────────────────────┘
```

**Which frontend is "real":** the root `vercel.json` deploys **frontend_v2** only. `frontend` (Next.js) is unproxied (`next.config.ts` empty), un-prefixed (calls `localhost:3001/auth/login` without `/api`), and not selected by Vercel. `my_mvp` is a static prototype. `temp_repo` is an unrelated duplicate stack.

**Auth flow:** `POST /api/auth/login` → validates `User.passwordHash` (bcrypt) → signs JWT `{sub, email, role}` → sets HttpOnly cookie `verisync_session` (secure, sameSite:none, 7d) and returns `access_token` + profile. `JwtStrategy` reads cookie or `Authorization: Bearer`. `GET /api/auth/me` re-hydrates the store.

---

## 2. DATABASE STATE & INTEGRATION CHAIN PROOF (live, read-only)

Baseline counts (unchanged from Phase 1): User 17 · Student 11 · StudentProfile 11 · Teacher 5 · Admin 1 · FaceEmbedding 2 · Course 12 · Section 3 · Semester 3 · Batch 3 · AcademicSession 3 · Subject 24 · AttendanceSession 26 · AttendanceRecord 2 · ScheduledClass 26 · TimetableRule 23 · EnrollmentToken 0 · AttendanceRevision 0 · AcademicCalendar 3 · AcademicCalendarEvent 6 · **AuditLog 0**.

### 2.1 CHAIN A — Student sees own attendance (WORKS, but data is synthetic)
`AttendanceRecord → AttendanceSession → ScheduledClass → Course → Subject → Teacher` resolves correctly for the 2 existing records (both in session `9fe396a5`, course **CC101 / Software Engineering / Richa Verma**):
- `23bec047` ("shree") — record `PRESENT`, method attr `FACE` (session itself has `verificationMethod NULL`)
- `MCA030` ("Ananya Singh") — record `PRESENT`, `MANUAL`

**Issue A-1:** Ananya Singh belongs to section `2fa71035` (0 courses) yet has an attendance record in a CC101 class belonging to section `bb33bb36`. The test endpoint `POST /students/me/mark-attendance/:sessionId` (`students.service.ts:305-331`) **never verifies the student is in the session's course section** — cross-section attendance is possible.

### 2.2 CHAIN B — Teacher sees roster (WORKS only for the canonical section)
`Course.primaryTeacherId → Teacher`, roster = students of `Course.sectionId` (`teacher-portal.service.ts:76-80`). Query confirms all 5 teachers resolve and **each sees exactly the 2 students in `bb33bb36`** (shree, sita).

### 2.3 ROOT-CAUSE — 9 of 11 students invisible to every teacher (D-1)
There are **three** "Section A / Semester 3 / 2025-2027 Cohort" rows:

| Section id | Courses | Students | Meaning |
|---|---|---|---|
| `bb33bb36-7f71-4cb8-8668-f7f37cd7c251` | **12** | 2 (23bec047, CS2021) | the working/canonical section |
| `2fa71035-b10b-42a8-99f9-f402c938dee6` | **0** | **9 (MCA030–MCA038)** | stranded students |
| `1a1245f0-1f0a-4ad4-8efe-e9dd70b74d89` | 0 | 0 | empty duplicate |

Consequences for the 9 students: no teacher roster row, no timetable (`getStudentTimetable` queries rules by `course.sectionId`), no `active-session` (queries LIVE sessions by `course.sectionId` → null), admin sees them only via `GET /students` (which fabricates course `EC202` for them, `students.service.ts:527`). This is exactly the reported bug "newly registered student missing from Teacher → Attendance Sheets" — **but it is a section-membership data fault, not an API fault.** New enrollments via `/enrollment/submit` are correctly routed to `bb33bb36` (canonical finder, `enrollment.service.ts:143-182`), so a **new** student WOULD auto-appear; the 9 existing ones are pre-existing bad data.

### 2.4 CHAIN C — Admin sees counts (works, but misleading)
`/admin/stats` → students 11, teachers 5, active_courses 12, **live_sessions 26** (all stale — see D-3).

### 2.5 ORPHAN / CASCADE ANALYSIS (ALL CLEAN)
`SELECT`-verified: 0 ScheduledClass without Course · 0 Session without ScheduledClass · 0 Record without Session · 0 Record without Student · 0 Student without Section/Batch · 0 Course without Section/Teacher · 0 TimetableRule without Course · 0 AuditLog without User · 0 Student/Teacher without User.

**Interpretation:** the schema's FK integrity holds (no dangling rows), but it also means **deleting a Student/User is FK-restricted** when attendance exists — `students.service.ts:622-628` (and `teachers.service.ts:165-188`) do a bare `user.delete` and will throw a 500 FK error rather than soft-delete. Historical attendance cannot be lost *by accident* today, but the deletion UX will error.

### 2.6 DUPLICATE SESSION EXPLOSION (D-2) — exact trigger identified
`startSession` (`attendance.service.ts:25-67`) does:
1. `course.findUnique(id)`; on failure → `course.findFirst()` **silently substitutes the FIRST course in the table** (line 31) and keeps the *sent* `courseId` only in the audit metadata.
2. `scheduledClass.create` **unconditionally** for that course + `new Date()` (line 35-42) — no check for an existing ScheduledClass that day; `ScheduledClass` has no unique constraint on (courseId, date).
3. `attendanceSession.create` with `status: 'LIVE'` (line 53-62).

Result: **25 ScheduledClass + 25 AttendanceSession rows for course 7182cce5 (CC101) on 2026-08-07**, i.e. every "start a session" API test during development silently landed on CC101 and never closed. This is the Phase-1-deferred fix and is the top backend bug.

### 2.7 SESSION LIFECYCLE (D-3)
`AttendanceSession`: 26 LIVE, 0 CLOSED, 0 SCHEDULED. Verification methods: FACE 16, OTP 3, DYNAMIC_QR 3, STATIC_QR 2, MANUAL 1, **NULL 1**. All LIVE sessions' ScheduledClass dates are in the past (2026-08-07/08). `getActiveSession` (`students.service.ts:266-303`) will return a dead session to any student in that course's section. `closeSession` is never invoked by any frontend flow (AdminAttendanceMonitor "End" only clears local state).

---

## 3. BACKEND ROUTE / GUARD MATRIX (authorization audit)

`@UseGuards(JwtAuthGuard)` only — **no role guard exists anywhere** (no `RolesGuard`, no `@Public`, no `APP_GUARD`). "JWT" = any authenticated user (student, teacher, admin, or expired-token holder prevented).

| Route (under /api) | Guard | AuthZ verdict |
|---|---|---|
| `POST auth/login`, `POST auth/logout` | none | OK (public) |
| `GET auth/me` | JWT | OK |
| `POST enrollment/metadata, send-otp, verify-otp, submit, verify-token/:token` | **none** | Public self-service — OK for register, but **no server-side "OTP verified" gate** before submit; `verify-otp` accepts `123456` always |
| `POST enrollment/admin/generate-link`, `GET admin/links` | **none** | **UNSAFE** — any unauthenticated caller can mint enrollment tokens & read all tokens |
| `GET students/me/*` (dashboard, courses, attendance, timetable, active-session, analytics, profile) | JWT | OK — properly scoped to `jwtUser.userId` (student resolved by `user.id`) |
| `POST students/me/mark-attendance/:sessionId` | JWT | **WEAK** — marks attendance in ANY live session; no section/course membership check |
| `PATCH students/me/profile/photo` | JWT | OK (own photo) |
| `GET students`, `POST students`, `PATCH students/:id`, `DELETE students/:id` | **none** | **UNSAFE** — full roster incl. per-student attendance exposed; arbitrary create/update/delete; DELETE cascades via `user.delete` (FK-restricted on records) |
| `GET teachers`, `POST teachers`, `PATCH teachers/:id`, `DELETE teachers/:id` | **none** | **UNSAFE** — returns teacher emails + fake FAC ids; arbitrary delete |
| `GET subjects`, `POST subjects`, `PATCH subjects/:id`, `DELETE subjects/:id` | **none** | **UNSAFE** — arbitrary CRUD |
| `POST attendance/sessions` | **none** | **UNSAFE** — anyone can start sessions on any course; `teacherId` is client-supplied, unverified; fallback bug D-2 |
| `POST attendance/sessions/:id/close` | **none** | **UNSAFE** — `teacherId` from body, never checked against course owner |
| `GET attendance/sessions/:id`, `GET :id/stats` | **none** | **UNSAFE** — any session's records readable |
| `POST attendance/sessions/:id/face-verify` | **none** | **UNSAFE** — liveness is a hardcoded string `'VALID_LIVENESS_SIG_2026'` (`face-verification.service.ts:55`); embedding→student match has **no course/section scope** |
| `POST attendance/sessions/:id/qr-verify` | **none** | **UNSAFE** — `studentJwt` used as plain `userId` (no verify); token checked only when method=DYNAMIC_QR; for OTP/STATIC_QR/FACE/MANUAL sessions a bare userId marks attendance |
| `POST attendance/sessions/:id/manual` | **none** | **UNSAFE** — `overrides` keyed by **roll number**, looked up globally (any student in any section can be marked); `teacherId` unverified |
| `POST attendance/sessions/:id/qr/rotate` | **none** | **UNSAFE** |
| `GET teacher-portal/dashboard` | JWT | OK — teacher resolved by `user.id` |
| `GET teacher-portal/courses/:courseId/students` | JWT | **IDOR** — **no check that the caller teaches this course**; any authenticated user (incl. students) can dump any course's roster |
| `GET teacher-portal/courses/:courseId/attendance-sheet` | JWT | **IDOR** — same; plus **hardcoded year 2026** (`teacher-portal.service.ts:99-101`) |
| `GET timetable/my-schedule` | **none** | **BUG/LEAK** — reads `req.user.userId` but has no guard; for unauthenticated calls `teacherId` is `undefined` → Prisma treats it as no filter → returns **all** teachers' schedules |
| `GET calendar/events/:collegeId`, `GET calendar/eligibility/:courseId` | **none** | **UNSAFE** — public calendar/eligibility |
| `GET admin/stats` | **none** | **LEAK** — global counts to anyone |

### 3.1 Answer: "Can Student A see Student B?"
- **Via self-scoped endpoints: NO.** All `students/me/*` resolve strictly from `jwtUser.userId`.
- **Via aggregate endpoints: YES.** `GET /api/students` (unauthenticated) returns every student's name, roll, email, **and nested attendance records with course codes**; `GET /api/teachers` exposes teacher emails; `GET /api/teacher-portal/courses/:id/students` returns any course's roster to any authenticated role. **This must be fixed with role+ownership enforcement (D-5).**

---

## 4. FRONTEND API CONTRACT AUDIT

### 4.1 Base-URL fragmentation (D-6)
- Family A: `import.meta.env.VITE_API_URL || '/api'` → LoginPage, RegisterPage, ProtectedRoute, useAppStore.logout, TeacherDashboard, TeacherAttendanceSheets.
- Family B: **hardcoded `http://localhost:3001`** → useDataStore.fetchWithAuth (`:121`), StudentDashboard (`:30`), StudentAttendanceHistory (`:29`), StudentMarkAttendance (`:31,:54`), StudentProfile (`:41,:74`), StudentMockJoin (`:39`); EnrollmentFlow default (`:40`).
- No `.env*` exists → `VITE_API_URL` is undefined everywhere.
- `vite.config.ts:17-22` proxies `/api` → `http://localhost:3001` **and rewrites the `/api` prefix away** — correct pairing for a bare backend, wrong for the `/api`-prefixed Nest app. Only `temp_repo/frontend` proxies without the rewrite.
- Port mismatch: backend binds `PORT ?? 3000` (`main.ts:39`) but every frontend targets **3001**.
- `frontend/src/lib/axios.ts:5` → `baseURL: 'http://localhost:3001'` **without** `/api`.

**Net effect in dev:** Family A + proxy works-ish only if the backend is launched with `PORT=3001`; Family B works only if the backend is on 3001 AND CORS allows `http://localhost:5173` (it does). **In production (Vercel), localhost:3001 is unreachable → every student data page, all admin/teacher CRUD, and live-attendance screens fail.**

### 4.2 Endpoints with NO backend route (whitelist gaps)
| Frontend call | File | Result |
|---|---|---|
| `POST /attendance/mark` | student/StudentMockJoin.tsx:39 | 404 |
| `POST /attendance/simulate-class` | admin/AdminAttendanceMonitor.tsx:49 | 404 |
| `POST /attendance/log-scan` | admin/AdminAttendanceMonitor.tsx:78 | 404 |

### 4.3 Dead (implemented but never called)
`/enrollment/admin/generate-link`, `/enrollment/admin/links`, `/timetable/my-schedule`, `/calendar/events/:collegeId`, `/calendar/eligibility/:courseId`, `/admin/stats` — schedules, calendars, dashboards render static/store data instead.

### 4.4 Contract mismatches (backend vs frontend)
- **Auth split-brain:** student pages send only the HttpOnly cookie (`credentials:'include'`); teacher/admin/store send `Authorization: Bearer <sessionStorage.verisync_token>` (some with, some without `credentials`). LoginPage stores `access_token` in `sessionStorage.verisync_token` (Bearér model) while the backend's canonical model is the cookie — two parallel identities.
- `TeacherStartAttendance` collects `date/startTime/room` in its UI but **never sends them** in `POST /attendance/sessions`.
- `EnrollmentFlow` submits `token: "Bypass"` when no query token exists (self-enrollment without an admin-minted token) — backend accepts any token string silently (`enrollment.service.ts:120-128` treats a non-existent token as "no token").
- `RegisterPage` falls back to `fake-batch-id`/`fake-section-id` options when `/enrollment/metadata` is empty — would submit fake IDs.
- Teacher dashboard stat cards ("Average attendance **65.24%**", "Pending corrections **1**") are hardcoded, not from the API.
- `GET /students` returns fabricated fields the store expects (`roll`, `course:'EC202'`, `matrix`, `monthly`, `faceEnrolled:true`, `time:'09:00 AM'`) — store `Student` type mirrors these, locking in the mock.

### 4.5 Next.js `frontend` (not deployed)
- axios baseURL lacks `/api` prefix → `/auth/login`, `/admin/stats` would 404 against the real backend.
- `next.config.ts` has no rewrites; only `middleware.ts` gates `/admin:*` on the cookie.
- Login page **prefills real-looking credentials** `sanskriti81029@gmail.com / Admin@81029` (`app/login/page.tsx`).
- Admin pages are pure mock: courses page shows "CS301 / Dr. Alan Turing / ACTIVE", "CS302 / Dr. Ada Lovelace", "CS303 / Dr. Edgar Codd"; registrations, corrections, shortage pages all render hardcoded rows; `create/course` has its real `api.post('/admin/courses')` **commented out**.

---

## 5. STATIC / MOCK DATA INVENTORY (classify: SAFE = cosmetic/theme, MUST-FROM-DB = real records)

| Area | Examples | Class |
|---|---|---|
| Teacher master (frontend_v2) | `initialTeachers` FAC2020–FAC2024, `data/teacherProfiles.ts`, `mockScheduleData` P1–P6, `useDataStore` seed `initialSubjects` (27), authorizations `AUTH1 Wc7P2kLm9Q`, courseInstances (`CRS-MCA-*`, expectedStudents 60, banner Blue) | **MUST-FROM-DB** |
| Teacher portal | `TeacherDashboard` week 88–96 / verification 75/15/7/3, "65.24%", RAW_STUDENTS MCA030–MCA038, `TeacherReportsAnalytics` TREND_DATA/COURSE_DATA/METHOD_DATA, holidays incl. "Dussehra 2026-10-19→21", "Diwali 2026-11-08→16", REQ-001/002 corrections | **MUST-FROM-DB** |
| Student portal | `StudentAnalytics` MOCK_COURSES CC310–CC313/MDC302 + WEEKLY W1–W5 78–88, `StudentClassSchedule`/`StudentCourses` 5 mock subjects with `/features/*.png`, 3 mock corrections, holidays/calendar | **MUST-FROM-DB** |
| Admin portal | `AdminStudents` RAW_STUDENTS + SESSIONS + COURSES_BY_SESSION, `AdminSheets` MOCK_STUDENTS 26MCA001–012, `AdminReports` 75.6%/61.1%, `AdminCorrections` mockCorrections, `AdminHolidays` 40 holidays 2026-06-29→2027-05-31, `AdminAuthorizations` AUTH2 `ZvqgDDMxAy`, `StudentEnrollmentAdmin` STU001–004 + dead Generate button, `AdminProfile` static CV | **MUST-FROM-DB** |
| Backend responses | `students.service.findAll` (`EC202`, `09:00 AM`, `faceEnrolled:true`, CC101 matrix fallback), `teachers.service.findAll` (FAC2020-24 mapping, `+91 9876543210`, appended "Dr. Bhawna Sinha" admin-as-teacher), `subjects.service` (`Sem-I`), `useAppStore` notifications ("45 students below 75%") | **MUST-FROM-DB (remove from API)** |
| Landing/theme | hero, team, `ui-avatars.com`, avatar colors | SAFE |
| `my_mvp` | localStorage DB `verisync_mvp_db_v1`, hardcoded charts 79–92%, demo user Aditi Kumari, fake 450ms login; `index.html` redirects to non-existent `verisync-landing/` (real dir: `faceattend-landing`) | legacy — decide archive vs remove |
| `temp_repo` | separate Express+Prisma clone (sid cookie + CSRF, InsightFace `w600k_r50.onnx`, 30s QR) | legacy — not wired to this backend |

**frontend_v2 build concern:** orphan folder `frontend_v2\@\components\ui\{card,progress,select}.tsx` exists (duplicate shadcn components not under `src/`). A build was not run during this read-only phase; treat `@/components` resolution as a risk to verify when Phase 2 work begins.

---

## 6. ERROR HANDLING & DATA-LOSS AUDIT

- `fetchWithAuth` throws `API Error: <statusText>` with no user-facing handling; admin CRUD stores swallow errors with `console.error` and **still mutate local state** (e.g. `deleteTeacher` removes from state even if the API call failed — `useDataStore.ts:323-328`).
- Student pages show blank/partial UI on fetch failure; no retry/empty/error states in most pages.
- 401 handling only exists in the unused Next axios interceptor (`frontend/src/lib/axios.ts:13-23`).
- Data-loss risks:
  - `DELETE /students/:id` / `DELETE /teachers/:id` → `user.delete`; hard-delete with FK-restrict on attendance → **500 error** rather than soft-delete/archive; no audit entry.
  - `startSession` fallback silently writes a ScheduledClass+Session to a **different course** than requested (D-2) — creates garbage, never an error.
  - `subject.delete` removes a subject even if Courses reference it → FK-restrict 500.
- Transactions: only `submitEnrollment` uses `$transaction` (good). `startSession`, manual attendance, and corrections are not transactional.
- No `ipAddress`/device fields are ever populated in AuditLog; AuditLog is empty (D-8).

---

## 7. TEST BASELINE (pre-existing, unchanged — NOT to be fixed in Phase 2)

`npm test` (backend): **11 suites, 8 fail / 3 pass, 8 tests failed of 22.** Failing suites: `admin.service`, `admin.controller`, `students.service`, `students.controller`, `teachers.service`, `teachers.controller`, `subjects.service`, `subjects.controller` — all fail at compile with `Nest can't resolve dependencies (PrismaService, index 0)` (missing providers in test modules). No spec covers attendance/teacher-portal/enrollment/calendar. This baseline is preserved as-is.

---

## 8. CONNECTION MATRIX (single source of truth)

| Entity | DB | Backend | Student | Teacher | Admin | Status |
|---|---|---|---|---|---|---|
| Student (identity) | ✓ | ✓ | ✓ | ✓(2/11 only) | ✓(list) | **PARTIAL — 9 students sectionless** |
| Teacher | ✓ | ✓ | ✓ | ✓ | ✓ | CONNECTED (but mock IDs in API) |
| Course ↔ Teacher | ✓ | ✓ | ✓ | ✓ | ✗ (mock) | **PARTIAL** |
| Course ↔ Section | ✓ | ✓ | ✓ | ✓ | ✗ | **PARTIAL** |
| Timetable | ✓ (rules) | ✓ | ✓ (store mock in UI) | ✓ (today schedule) | ✗ (store mock) | PARTIAL |
| Attendance Session | ✓ | ✓ | ✓(active) | ✓(create/close) | count only | **PARTIAL — stale/duplicate** |
| Attendance Record | ✓ | ✓ | ✓ | ✓ | ✗ | PARTIAL |
| Corrections (AttendanceRevision) | ✓ (empty) | — | mock UI | mock UI | mock UI | **MISSING end-to-end** |
| Face Embedding | ✓ (2) | ✓ | ✗ (client sim) | — | — | PARTIAL |
| Audit Log | ✓ (empty) | writes only on session/attn/enroll | — | — | — | **BROKEN (no data, no UI)** |
| Enrollment | ✓ | ✓ | ✓ | — | **dead UI stub** | PARTIAL |

---

## 9. ISSUE REGISTER (root cause → fix → test)

| ID | Severity | What/Why/Where | Depends on | How to fix (later phase) | How to test |
|---|---|---|---|---|---|
| D-1 | CRITICAL | 9 students in zero-course section; 1 empty duplicate section; `findFirst('Section A')` seeds are not idempotent | — | **Data repair:** move MCA030–038 → `bb33bb36` (canonical) in one transaction; delete/archive empty `1a1245f0`; make seeds idempotent (upsert + unique section identity) | Roster query per teacher shows 11 students; each student timetable/active-session resolves |
| D-2 | CRITICAL | `startSession` fallback `findFirst()` + unconditional ScheduledClass.create | D-6 | Remove fallback (404 on bad courseId); enforce `ScheduledClass @@unique([courseId, date])`; one LIVE session per course; delete 25 duplicates | POST bad courseId → 404; repeated start for same course+day → 409 |
| D-3 | CRITICAL | 26 stale LIVE sessions; UI can't close | D-2, D-5 | Close/archive all; auto-close on date+window expiry; admin "End" must call `/sessions/:id/close` | `active-session` returns null after archive; admin live count → 0 |
| D-4 | HIGH | QR/OTP/manual verification bypass; liveness hardcoded | — | Verify `studentJwt` properly (decode JWT, compare sub→Student.userId); enforce method checks (OTP: compare `currentOtp`; STATIC_QR: valid token; FACE: section-scoped match); real challenge-signature validation; scope manual overrides to course section | Tampered token/OTP → 401; student from other section → 403 |
| D-5 | HIGH | No role/ownership guards (see §3) | — | Add RolesGuard (ADMIN/TEACHER/STUDENT) + ownership checks (teacher↔course on teacher-portal & attendance; student↔self); guard students/teachers/subjects/admin/calendar/timetable; scope `timetable/my-schedule` with guard | AuthZ matrix test: student vs teacher vs admin vs anon per route |
| D-6 | HIGH | Base-URL + port + proxy mismatch; 3 phantom endpoints | — | Single `VITE_API_URL`/env contract; backend `/api` prefix kept; vite proxy without `/api`-strip or target `/api` correctly; run backend on documented port; remove/replace `/attendance/mark`, `/simulate-class`, `/log-scan` | Prod deploy: every portal loads real data from Neon |
| D-7 | HIGH | Mock overlap + fabricated API fields | D-1, D-5 | Backend returns real fields only (`rollNumber`, real course codes); frontend consumes them; remove RAW_STUDENTS/mock charts from teacher/admin/student screens | Roster/percentages match DB exactly across 3 portals |
| D-8 | MED | Empty AuditLog; permissive OTP; no OTP gate on submit | — | Server-side OTP state + verified flag required before submit; `123456` removed; log LOGIN/REGISTER/SESSION/ATTENDANCE/CORRECTION events with ip | Duplicate-flow and audit-trail E2E checks |

---

## 10. RECOMMENDED IMPLEMENTATION ORDER (Phase 2 build)

1. **Data repair & constraints** (fixes D-1, D-2, D-3): canonical-section repair script (one transaction), de-dup 25 sessions, archive stale LIVE sessions, `@@unique([courseId, date])`, idempotent seeds. Back up `VeriSync_Safe_Backup/` first.
2. **AuthN/AuthZ hardening** (D-5): RolesGuard + ownership checks; guard every unprotected route; remove client-supplied `teacherId`; scope `timetable/my-schedule`.
3. **Verification integrity** (D-4): real JWT decode for `studentJwt`, per-method enforcement, section scoping, replace hardcoded liveness signature.
4. **API contract unification** (D-6): single env-based base URL, correct proxy/port, remove phantom endpoints, align `frontend/src` axios with `/api`.
5. **Backend truth-first responses** (D-7): purge fabricated fields from `students/teachers/subjects` services; real DTOs.
6. **Frontend re-wiring**: replace static/mock admin/teacher/student screens with the audited endpoints; add loading/error/empty states; enable admin enrollment-link UI; wire corrections → AttendanceRevision.
7. **Audit & OTP** (D-8): durable audit events; server-side OTP gate.
8. **E2E cross-portal pass** incl. a fresh test student (registers → appears in teacher roster → attendance → reflected in student + admin views) and the Student-A-can't-see-Student-B check; keep the 8 pre-existing failing suites as a documented baseline until deliberately reworked.

---

*Report generated read-only. No code, schema, migration, or data was modified. All line references are to the current working tree.*

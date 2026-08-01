# VaultID — 7-Phase Build Roadmap

## From Spec to Production-Ready SaaS Attendance Platform

This roadmap sequences the three revised panel specs (Admin, Teacher, Student) plus a public-facing SaaS landing page into **7 build phases**, each independently shippable and testable.

---

# Phase Ordering & Why

You proposed frontend-then-backend per side. I'm recommending **backend-first per side**, in **Admin → Teacher → Student** order, for one structural reason: this system is a strict dependency chain.

```
Admin creates master data (college/dept/programme/session/subjects/teachers/students)
        │
        ▼
Teacher redeems admin-issued authorisation codes to create courses
        │
        ▼
Student attends courses that only exist because Admin + Teacher already acted
```

If you build Admin Frontend before Admin Backend exists, you're building against mock data that gets thrown away — real waste on a "bulletproof, production-ready" system. If you build Teacher or Student before Admin Backend is live, there's nothing real to connect to (no sessions, no subjects, no authorisation codes). Backend-first per module gives each frontend a real, tested API contract to build against instead of guessing.

The recommended order:

| # | Phase | Depends On |
|---|---|---|
| 1 | **Admin Backend** | Nothing — this is the foundation |
| 2 | **Admin Frontend** | Phase 1 |
| 3 | **Teacher Backend** | Phase 1 (needs admin data: subjects, assignments, auth codes) |
| 4 | **Teacher Frontend** | Phase 3 |
| 5 | **Student Backend** | Phases 1 & 3 (needs courses to exist, enrolment rules, attendance sessions) |
| 6 | **Student Frontend** | Phase 5 |
| 7 | **SaaS Landing Page** | Can run in parallel with any phase — no dependency, but ships last so it can honestly show real product screenshots |

If you'd rather keep your original frontend-first instinct per module (e.g. to demo UI early to stakeholders or the college), that's a legitimate alternative — just know each frontend phase in that case ships with mocked/stubbed data until its backend phase lands, and gets a rewiring pass afterward. I'll note the swap-in points below so you can flip the order without re-planning.

---

# Phase 1 — Admin Backend

## 1.1 Objective
Stand up the entire institutional data model and every rule that Teacher and Student depend on. This is the foundation phase — it also carries system-wide concerns (auth, RBAC, audit logging, DB schema) that the other five module phases will reuse rather than rebuild.

## 1.2 What gets built

**Shared/foundational (built once, used everywhere):**
- Database schema for the full hierarchy: College → Department → Programme → Session → Year → Semester → Section, plus Subjects, Teachers, Students, Courses, Attendance, Corrections, Audit Logs — all as live tables, nothing hardcoded
- Authentication service (email verification, password hashing, JWT/session tokens, OTP)
- Role-based access control middleware (Super Admin / College Admin / Department Admin / Attendance Admin / Academic Coordinator / Auditor)
- Audit logging service (every sensitive write goes through this)
- File/image storage for profile photos and encrypted face embeddings (not raw images)

**Admin-specific modules:**
- College configuration CRUD
- Department / Programme / Academic Session / Academic Structure (Year/Semester/Section) CRUD
- Subject master CRUD with duplicate-code prevention
- Teacher CRUD + invitation/verification workflow + deactivation (soft-delete only)
- Teacher Assignment service (many-to-many, with conflict validation)
- Student CRUD + bulk import (Excel/CSV) with validation preview
- Student Verification service (face-enrolment review queue, encrypted embedding storage)
- Course Authorisation Code service: cryptographically secure generation, hashing, single-use enforcement, expiry, revocation, regeneration
- Course Registration rule engine (automatic / admin-controlled / request-approval)
- Timetable & Academic Calendar services, with conflict detection
- Holiday service (institution-wide, department-wide, special working day, class-cancellation distinction)
- Attendance Management read/query API (aggregation across all the statuses: Present/Absent/Holiday/Cancelled/NA/Excused/Pending/Manual)
- Attendance Correction approval API
- Attendance Sheet generation (Excel/CSV/PDF export) with correct denominator math and variable month-length support
- Reports & Analytics aggregation endpoints
- System Alert event triggers (backend events that generate the auto-notices consumed by Teacher/Student — no manual compose endpoint exists, by design)
- Security Centre APIs (account lock/unlock, session revoke, device block)
- Data Import/Export service with validation preview
- System Settings service (thresholds, code lengths, retention policies — all configurable, not constants)
- Admin Management (role CRUD)

## 1.3 Definition of done
- [ ] Every entity in the hierarchy is a DB row, confirmed by creating a second college/department/programme in a test and verifying zero code changes were needed
- [ ] Course authorisation codes are stored hashed, never in plaintext, and fail closed on any mismatch
- [ ] All destructive-looking actions (remove teacher/student) are soft-deletes with historical data intact
- [ ] Every write to a sensitive table produces an audit log row
- [ ] Full API test suite (unit + integration) covering validation edge cases: duplicate codes, expired sessions, mid-month attendance starts, month-length variance
- [ ] API documentation (OpenAPI/Swagger) published
- [ ] Rate limiting and input validation on every public endpoint

## 1.4 Suggested stack
Node.js/NestJS or Python/FastAPI or Django REST · PostgreSQL (relational integrity matters a lot here — the hierarchy is inherently relational) · Redis for session/rate-limit/QR-token caching · S3-compatible storage for photos/embeddings · Background job queue (BullMQ/Celery) for import validation, code expiry sweeps, report generation.

---

# Phase 2 — Admin Frontend

## 2.1 Objective
Build the Admin Panel UI against the real Phase 1 API — every one of the 34 sections in the Admin spec, organised into the 8 sidebar groups already defined (Dashboard, Academic Setup, User Management, Course Management, Attendance, System Alerts, Reports and Security, Settings).

## 2.2 What gets built
- Dashboard with live summary cards, charts, quick actions, recent-activity feed
- Full CRUD screens for College Config, Departments, Programmes, Sessions, Academic Structure, Subjects
- Teacher management: table + add/edit/deactivate + invitation workflow UI + profile view
- Teacher Assignments: guided multi-step assignment form with live validation feedback
- Student management: table + individual/bulk-import UI with import-preview screen + verification queue with face-image side-by-side comparison
- Course Authorisations: code generation screen with copy/send/revoke/regenerate + usage history
- Active Courses, Course Registrations tables with filters/bulk actions
- Timetable/Calendar/Holidays: calendar-view components with conflict warnings surfaced inline
- Attendance Management: filterable data table + live-session monitor view
- Attendance Corrections: review queue with approve/reject/undo actions
- Attendance Sheets: matrix view (students × dates) + export buttons
- Reports & Analytics: chart-heavy dashboard, configurable thresholds
- System Alerts: read-only log viewer (no compose UI — intentionally absent)
- Security Centre: dashboard + account/device action buttons
- Audit Logs: searchable, filterable, read-only table
- Data Import/Export: upload wizard with validation-preview step
- System Settings, Admin Management: settings forms with role-based visibility

## 2.3 Definition of done
- [ ] Every screen consumes the real Phase 1 API — zero mock data remaining
- [ ] Every sensitive action has a confirmation dialogue (and OTP/password re-entry where the spec calls for it)
- [ ] Empty states, loading states, and error states designed for every table/list
- [ ] Fully responsive (desktop primary, tablet secondary — admin work is rarely mobile-first)
- [ ] Accessibility pass: keyboard nav, contrast, ARIA labels
- [ ] Role-based UI (a Department Admin never sees Super-Admin-only controls, not just via hidden-but-reachable routes)

## 2.4 Suggested stack
React (Next.js) or Vue · Tailwind + a component library (shadcn/ui, Ant Design, or similar — admin panels lean on dense data tables, so a library with strong table/form primitives saves real time) · TanStack Query/SWR for data fetching + caching · Recharts/Chart.js for analytics.

---

# Phase 3 — Teacher Backend

## 3.1 Objective
Build every service a verified, admin-assigned teacher needs to create authorised courses and run attendance sessions — strictly scoped to what Phase 1 has already authorised.

## 3.2 What gets built
- Teacher Authentication (separate from Admin auth flow, same underlying identity provider)
- Teacher Profile service (restricted-field enforcement — teacher can't self-edit department/designation/email)
- Assigned Subjects read API (scoped strictly to this teacher's admin assignments)
- Course Authorisation Validation service — the critical security boundary: re-validates teacher/subject/session/semester/section/code match server-side on every course-creation attempt, independent of whatever the frontend sends
- Course Management service (CRUD scoped to owned courses only)
- Course Student service (enrolled-roster read, scoped to owned courses)
- Schedule service (view + reschedule/cancel requests, conflict checks)
- Attendance Session service: session creation, dynamic QR generation (time-boxed, class-specific, cryptographically signed, single-use per window), session close logic
- Face Verification Status service (consumes Phase 1's stored embeddings for comparison, never re-exposes raw biometric data to the teacher)
- QR Verification service (validates scan against the live session, rejects replays/screenshots)
- Attendance Record service (read + correction-request submission, never direct overwrite)
- Attendance Export service (scoped to the teacher's own courses/sections)
- System Alert consumption endpoints (teacher-facing alert feed — read-only, event-driven)
- Security Log service (teacher's own login/device history)

## 3.3 Definition of done
- [ ] A teacher account can never create a course for a subject/section/session it wasn't assigned, even with a stolen valid-looking code for a different scope — covered by adversarial test cases
- [ ] QR tokens are single-window, signed, and expire server-side (not just hidden client-side)
- [ ] Face-mismatch and device-anomaly detection produce a Pending Review state rather than silently failing or silently passing
- [ ] All attendance-record mutations route through the correction-request workflow, with zero direct-write endpoints exposed
- [ ] Load-tested for the realistic worst case: 50 students scanning within a 2–5 minute window

## 3.4 Suggested stack
Same backend framework/DB as Phase 1 (shared services, different route/permission layer) · WebSocket or short-poll channel for the Live Attendance real-time view · Signed/short-TTL tokens (JWT with tight `exp`) for QR payloads.

---

# Phase 4 — Teacher Frontend

## 4.1 Objective
Build the Teacher Panel UI against the real Phase 3 API, organised into the 6 sidebar groups already defined.

## 4.2 What gets built
- Dashboard: today's schedule, quick actions, summary cards, charts
- My Profile (with restricted-field greying-out matching backend rules)
- Assigned Subjects table
- My Courses (course cards) + Create Course guided form with cascading, auto-filtering dropdowns
- Class Schedule (daily/weekly/monthly views)
- Attendance Dashboard, Start Attendance (QR display screen — this needs to render well on a classroom projector/screen), Live Attendance (real-time student-status list)
- Attendance Records, Attendance Corrections (request form), Attendance Sheets (download UI)
- Students (scoped roster + profile view)
- Reports and Analytics
- System Alerts (read-only feed)
- Security and Login Activity, Settings, Help and Support

## 4.3 Definition of done
- [ ] Start Attendance / QR display screen is legible from a distance (classroom-projector use case) and auto-refreshes without a manual reload
- [ ] Live Attendance view updates in near-real-time as students scan (WebSocket/polling wired to Phase 3)
- [ ] Mobile-responsive, since teachers will often run attendance from a phone/tablet at the front of the room
- [ ] Every screen consumes the real Phase 3 API — zero mock data remaining

## 4.4 Suggested stack
Same frontend stack as Phase 2 for consistency and shared component reuse · a lightweight QR-code rendering library · WebSocket client for Live Attendance.

---

# Phase 5 — Student Backend

## 5.1 Objective
Build the student-facing services: registration against admin-imported records, face enrolment, and the attendance-verification pipeline from the student's side.

## 5.2 What gets built
- Student Authentication + Registration service (roll-number/email match against Phase 1's imported list)
- Email/Phone Verification service
- Face Enrolment service (capture, quality checks, duplicate-face detection, encrypted embedding storage — shares infra with Phase 1's verification queue)
- Student Profile service (restricted-field enforcement)
- Course Enrolment service (automatic-enrolment engine + elective request/approval)
- Enrolled Course read API (scoped strictly to this student)
- Schedule read API
- Dynamic QR Validation service (student-side scan submission, cross-checked against Phase 3's live session)
- Face Verification service (student-side liveness + match against their own enrolled embedding only)
- Device Integrity service (fingerprint/session/IP capture for fraud signals, not sole decision-maker)
- Attendance Record service (read-only for the student's own records) + Correction Request submission
- Attendance Analytics service (daily/weekly/monthly/subject-wise aggregation, percentage math with correct denominator exclusions)
- System Alert consumption endpoints (student-facing)
- Security and Session service (own login history, MFA, session revoke)
- Student Report service (personal sheet export)

## 5.3 Definition of done
- [ ] A student can only ever submit attendance for themselves, in a session they're actually enrolled in, during the active window — enforced server-side even if the client is tampered with
- [ ] Duplicate scans are idempotent (no duplicate records, clear "already recorded" response)
- [ ] Attendance percentage calculation is unit-tested against every edge case in the spec: mid-month starts, holidays, cancellations, variable month length
- [ ] Face embeddings are never returned to any client, including the student's own device
- [ ] Privacy boundary tested: a student's API token cannot retrieve another student's records under any request manipulation

## 5.4 Suggested stack
Same backend framework/DB, sharing the face-verification and QR-validation infrastructure built in Phases 1 and 3 rather than duplicating it.

---

# Phase 6 — Student Frontend

## 6.1 Objective
Build the Student Panel UI against the real Phase 5 API — the highest-traffic, most mobile-critical surface in the whole product, since every student uses this daily to mark attendance.

## 6.2 What gets built
- Registration flow (multi-step: details → email/phone verify → face enrolment → consent → submit)
- Login
- Dashboard: identity card, summary cards, today's schedule, quick actions, analytics
- Enrolled Courses (course cards)
- Class Schedule
- Attendance page (QR scanner + face-verification camera flow — this is the core mobile UX of the entire product)
- Attendance Analytics (charts), Attendance History (table), Correction Requests (form + status tracker)
- Academic Calendar, Holidays
- System Alerts (read-only feed)
- Security and Login Activity, Settings, Help and Support

## 6.3 Definition of done
- [ ] QR-scan + face-verification flow is fast, forgiving of poor lighting/network, and gives unambiguous success/failure feedback — this is the single most-used screen in the product and deserves the most UX iteration
- [ ] Fully mobile-first responsive design (this is the one panel where mobile is primary, not secondary)
- [ ] Offline/flaky-network handling: a dropped request never creates a duplicate attendance record, and the student can safely retry
- [ ] Every screen consumes the real Phase 5 API — zero mock data remaining
- [ ] Accessibility: camera-permission errors and verification failures are announced clearly, not just visually

## 6.4 Suggested stack
Same frontend stack as Phases 2 and 4 for shared design system · native browser camera APIs (`getUserMedia`) for face capture · a well-tested QR-scanning library with good low-light performance.

---

# Phase 7 — SaaS Landing Page

## 7.1 Objective
A standalone, public marketing site that positions VaultID as a professional, scalable, multi-institution SaaS product — not a single-college class project. This ships independently of the app itself (different domain/subdomain, e.g. `vaultid.com` vs `app.vaultid.com`) and can be built in parallel with any other phase, though it lands best last so screenshots/demo footage can be pulled from the real, finished product.

## 7.2 Required sections for a "fully professional, product-ready" SaaS landing page

1. **Navigation bar** — logo, product/features/pricing/about links, "Book a Demo" and "Login" CTAs, sticky on scroll
2. **Hero section** — clear one-sentence value proposition (e.g. "Attendance you can trust — face + QR verified, fraud-proof, audit-ready"), supporting subhead, primary CTA ("Request a Demo") + secondary CTA ("See how it works"), and a hero visual: a real product screenshot or short looping product demo, not generic stock art
3. **Trust bar** — logos or a simple stat strip ("Built for institutions from 50 to 50,000 students," "99.9% verification accuracy," etc.) — use only claims you can actually back
4. **Problem/solution section** — proxy attendance, manual sheet errors, admin overhead — framed as pain points, then bridged into the product's answer
5. **Feature showcase** — 3–4 pillar features with icon + short copy + supporting screenshot each: Multi-Factor Verification (face + QR + device), Zero-Trust Course Authorisation, Real-Time Attendance Analytics, Full Audit Trail & Security Centre
6. **How it works** — a simple 3–4 step visual flow (Admin sets up → Teacher runs sessions → Student scans → Everyone sees clean analytics)
7. **Role-based tour** — tabbed or scroll-triggered section showing Admin/Teacher/Student views side by side, since the three-portal architecture is a real differentiator worth showing off
8. **Security & privacy section** — explicitly addresses biometric-data handling (encrypted embeddings, not raw photos; consent-based; retention policy) since this is the #1 objection an institution's IT/legal team will raise
9. **Scalability section** — explicitly speaks to the "not hardcoded" architecture: "from one department to your entire university" — this is your genuine technical edge, make it a selling point
10. **Pricing** — even if v1 is single-institution, a SaaS landing page needs a pricing section: tiered (e.g. Department / Institution / Enterprise) with a "Contact us" fallback for custom deployments
11. **Social proof** — testimonial or case-study placeholder (Patna Women's College pilot, once you have a quote) — don't fabricate quotes; leave a clearly-marked placeholder if none exist yet
12. **FAQ** — data privacy, offline handling, hardware requirements (do students need special devices? No — just a phone camera), integration questions
13. **Final CTA band** — restate the value prop, one strong CTA
14. **Footer** — product/company/legal links, contact info, social links

## 7.3 Design requirements for "looks like a real SaaS product"

- A genuine design system: consistent type scale, a real color palette (not default Tailwind blue-600 everywhere), consistent spacing/radius tokens, considered micro-interactions (hover states, scroll-triggered reveals, subtle parallax) — see the frontend-design skill for the specific technical guardrails to follow when this gets built
- Custom illustrations or real product screenshots — never generic "SaaS stock" photos of people pointing at whiteboards
- Fast load (this is a marketing site — Lighthouse performance matters for credibility and SEO both)
- SEO basics: proper meta tags, OpenGraph images, semantic HTML, sitemap
- Fully responsive, mobile-first build (most first visits to a marketing site are mobile)
- Analytics + conversion tracking wired in from day one (you'll want to know what converts a visit into a demo request)

## 7.4 Definition of done
- [ ] Every section above is present and uses real product screenshots, not mockups, once Phases 2/4/6 exist
- [ ] Lighthouse performance/SEO/accessibility scores all in the 90s
- [ ] CTA forms (Book a Demo / Contact) actually deliver somewhere (CRM, email, or at minimum a working mailto/form backend)
- [ ] Fully responsive across mobile/tablet/desktop
- [ ] No unverifiable claims (fake logos, fabricated testimonials, invented stats)

## 7.5 Suggested stack
Next.js (static-generation friendly, great for marketing-site SEO/performance) · Tailwind + Framer Motion for interactions · Vercel or similar edge-hosting for fast global load times · a form backend (e.g. a simple serverless function or a service like Formspree) for demo-request capture.

---

# Cross-Phase Concerns (apply to all 7 phases, not a separate phase)

Since you asked for exactly 7 phases, these aren't phase 8 — they're checklist items that recur inside every phase's Definition of Done above, called out here once so nothing gets missed:

- **Security:** input validation, rate limiting, hashed secrets, encrypted biometric storage, RBAC enforced server-side (never trust the frontend), audit logging on every sensitive action
- **Testing:** unit tests for attendance-percentage math and authorisation-code validation especially — these are the two places a subtle bug causes real institutional harm
- **CI/CD:** automated test run + deploy pipeline per phase, so each phase ships independently without breaking the others
- **Documentation:** API docs (Phases 1/3/5), component/design docs (Phases 2/4/6/7)
- **Monitoring/observability:** error tracking and uptime monitoring live before Phase 1 backend goes anywhere near real student data

---

# Summary Timeline View

| Phase | Focus | Ships Independently? | Blocks |
|---|---|---|---|
| 1 | Admin Backend | Yes | Phases 2, 3, 5 |
| 2 | Admin Frontend | No (needs Phase 1) | Nothing else |
| 3 | Teacher Backend | No (needs Phase 1) | Phases 4, 5 |
| 4 | Teacher Frontend | No (needs Phase 3) | Nothing else |
| 5 | Student Backend | No (needs Phases 1, 3) | Phase 6 |
| 6 | Student Frontend | No (needs Phase 5) | Nothing else |
| 7 | SaaS Landing Page | Yes (any time) | Nothing — best last for real screenshots |

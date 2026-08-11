# FaceAttend — Phase 2 Admin Frontend
## Production-Grade Antigravity Master Build Prompt

> Paste this entire document into Antigravity or another agentic coding tool after Phase 1 is available. Treat it as the authoritative implementation contract for the FaceAttend Admin Frontend. Do not reduce the scope, substitute static mockups for working screens, or claim completion while any required screen still uses fake data, placeholder actions, inaccessible controls, or untested API assumptions.

---

# 0. AGENT ROLE, OPERATING MODE, AND COMPLETION STANDARD

You are the lead frontend architect, product UI engineer, accessibility owner, and integration engineer responsible for building **Phase 2: Admin Frontend** of **FaceAttend**, a privacy-preserving, multi-factor smart attendance management platform.

Phase 2 must connect to the real Phase 1 Admin Backend. The frontend is not a visual prototype. It is the operational interface through which authorised administrators configure institutional data, approve identities, manage course authorisations, oversee attendance, review corrections, inspect security events, and generate official reports.

## 0.1 Required working behaviour

1. Inspect the complete repository before writing code. Identify the existing framework, package manager, folder structure, environment configuration, lint rules, design tokens, generated API types, tests, and unfinished work.
2. Inspect the Phase 1 OpenAPI document and running API. Treat the actual documented API as the integration source of truth. Do not guess endpoint shapes from memory.
3. Compare the available API against this Phase 2 contract and create a concise integration-gap report before implementation. Do not hide missing backend endpoints behind permanent mocks.
4. Reuse valid existing components and conventions. Refactor only where necessary for consistency, security, accessibility, or maintainability.
5. Create a dependency-ordered implementation plan: foundation and design system first, authentication and shell second, shared data patterns third, feature modules fourth, testing and hardening continuously.
6. Implement in small, reviewable increments. Run formatting, linting, TypeScript checking, unit tests, component tests, integration tests, accessibility tests, and end-to-end tests after meaningful milestones.
7. Fix failures before proceeding. Do not disable tests, loosen TypeScript, suppress errors broadly, or bypass accessibility rules merely to make the build pass.
8. Use real API data in development once the corresponding Phase 1 endpoint exists. Mock Service Worker may be used only for isolated component tests and Storybook-like development, never as the shipped production data layer.
9. Do not expose access tokens, refresh tokens, OTP values, password values, biometric data references, signed URLs, or sensitive security payloads in browser logs, analytics, error messages, local storage, session storage, query strings, or monitoring breadcrumbs.
10. Do not create any messaging, announcement composer, discussion, assignment, material, notes, posts, comments, replies, or file-sharing interface.

## 0.2 Completion standard

- [ ] The Admin application starts locally using documented commands.
- [ ] The app connects to the real Phase 1 API through environment-based configuration.
- [ ] Authentication, refresh, logout, MFA, session expiry, and protected routing work end to end.
- [ ] Every required Admin route exists and is reachable only by an authorised role and scope.
- [ ] Every table, chart, form, dashboard card, action, export, and workflow uses real API data.
- [ ] No production screen contains hardcoded institutional records or fake metrics.
- [ ] Loading, empty, partial, forbidden, validation, conflict, offline, and server-error states are implemented.
- [ ] Sensitive actions require the correct confirmation or step-up authentication UX.
- [ ] Keyboard navigation, screen-reader semantics, focus handling, colour contrast, and reduced-motion behaviour pass the accessibility gate.
- [ ] Desktop and tablet layouts are production quality; high-priority monitoring and approval workflows remain usable on mobile.
- [ ] Unit, component, integration, accessibility, and end-to-end tests pass.
- [ ] The production build succeeds with no critical console errors or unresolved high-severity TODOs.
- [ ] The forbidden LMS and communication features do not exist in routes, components, menus, search, placeholders, or API clients.

---

# 1. PRODUCT DEFINITION AND STRICT SCOPE

FaceAttend is a **strict attendance-only institutional administration platform**. The Admin Frontend controls institutional setup, identities, academic mappings, attendance governance, corrections, reports, security, and audit evidence. It is not an LMS, classroom feed, communication platform, or file repository.

## 1.1 Allowed Admin capabilities

- Organisation, College, Campus, Department, Programme, curriculum, Academic Session, Batch, Academic Year, Semester, Section, Room, Subject, and Subject Offering administration.
- Teacher pre-authorisation, onboarding oversight, approval, assignment, status management, and restricted security summary.
- Student pre-registration, bulk import, approval, verification review, academic mapping, account status, biometric-consent status, and face re-enrolment administration.
- Course-authorisation generation, one-time code delivery, revocation, regeneration, expiry, usage history, and failed-attempt inspection.
- Course Offering approval, Teacher reassignment, registration locking, roster administration, automatic compulsory enrolment, and controlled elective registration.
- Timetable rules, Scheduled Classes, conflict checks, Calendar Events, Holidays, Special Working Days, and Class Change Requests.
- Attendance policy configuration, live Attendance Session oversight, Attendance Record inspection, Attendance Attempt inspection under restricted permissions, emergency manual-attendance review, and correction approval.
- Attendance matrices, analytics, asynchronous reports, authorised exports, signed downloads, export history, and retention visibility.
- System-generated Alert inspection, Security Centre actions, device/session control, immutable Audit Log viewing, operational status, system settings, and Admin account management.

## 1.2 Strictly forbidden UI and behaviour

- No announcement composer, broadcast composer, custom alert composer, or arbitrary free-text notification sender.
- No chat, private message, group message, inbox, direct message, comment, reply, discussion, Q&A, stream, social feed, or social People page.
- No assignment, classwork, submission, material, notes, resource, syllabus upload, document library, course folder, or academic file-sharing interface.
- No supporting-document upload in Attendance Corrections. Corrections use structured reasons, verification logs, reference IDs, Teacher recommendations, Admin decisions, and offline institutional verification when required.
- No UI placeholder that promises a forbidden future feature.
- No free-text Admin instruction delivered to Teacher or Student Alert feeds.
- No frontend-only permission enforcement. Hidden controls are not a security boundary.

## 1.3 Allowed operational files

- College logo and identity profile photos.
- Temporary protected face-enrolment review images supplied through expiring backend-authorised URLs.
- Admin-only CSV/XLSX imports for approved institutional data.
- Generated attendance reports in CSV, XLSX, PDF, or print-friendly form.
- Generated audit/export files and operational diagnostic downloads when authorised.

The interface must clearly distinguish operational imports and generated reports from prohibited academic file sharing.

---

# 2. PHASE DEPENDENCY AND SOURCES OF TRUTH

## 2.1 Dependency

Phase 2 depends on Phase 1. Do not rebuild backend business logic in the browser. The backend remains authoritative for permissions, scope, validation, state transitions, attendance calculations, capacity, conflicts, audit logging, and report generation.

## 2.2 Sources of truth in descending order

1. The running Phase 1 OpenAPI contract and backend behaviour.
2. The Phase 1 Admin Backend master implementation contract.
3. This Phase 2 Admin Frontend implementation contract.
4. The revised Admin Panel functional specification.
5. Existing valid repository conventions.

## 2.3 API mismatch rule

- Do not invent a successful response for a missing endpoint.
- Do not silently change endpoint semantics in the frontend.
- Do not implement duplicate attendance math client-side as an alternative to the backend.
- Create a typed adapter only for documented response-envelope differences.
- If a required backend action is unavailable, surface a clear development blocker in the implementation report and keep the production control disabled with an honest explanation; do not ship a fake action.
- Generate or derive TypeScript types from OpenAPI whenever practical. Handwritten duplicate API models must be avoided or automatically checked against the schema.

---

# 3. INITIAL DEPLOYMENT AND SCALABILITY

## 3.1 Development seed context

- Organisation: FaceAttend Demo Organisation
- College: Patna Women’s College
- Campus: Main Campus
- Department: Computer Applications
- Programme: Master of Computer Applications
- Programme code: MCA
- Batch/Cohort: configurable, for example MCA 2025–2027
- Academic Year: Second Year
- Semester: configurable current Semester
- Section: Section A
- Initial Student strength: approximately 36
- Initial Section capacity: 50

## 3.2 No-hardcoding rule

The initial institution is development seed data only. Every selector, breadcrumb, filter, title, dashboard query, route parameter, table, and chart must work for multiple Organisations, Colleges, Campuses, Departments, Programmes, Sessions, Batches, Years, Semesters, Sections, and thousands of users.

- Never embed Patna Women’s College, MCA, Second Year, Section A, 36, or 50 in application logic.
- Use backend IDs and human-readable labels returned by the API.
- Persist the Admin’s currently selected context only as a preference, never as an authority boundary.
- Clear or revalidate dependent filters when an ancestor context changes.
- A Department Admin must never see cross-Department options even if they manually alter URL parameters.

---

# 4. FIXED FRONTEND STACK

Use the repository-compatible stable releases of the following technologies. Do not mix multiple competing state, form, or table frameworks without a documented necessity.

## 4.1 Application stack

- Next.js using the App Router.
- React with TypeScript strict mode.
- Tailwind CSS using semantic design tokens and CSS variables.
- shadcn/ui primitives built on accessible Radix components, or an equivalent accessible component system already established in the repository.
- TanStack Query for server-state fetching, caching, mutation, invalidation, and background refetching.
- TanStack Table for dense administrative data grids.
- React Hook Form for forms.
- Zod for client-side form validation and runtime validation of critical boundary data where generated clients do not provide it.

- date-fns or Luxon for date formatting; all display logic must be timezone-aware.
- next-intl or an equivalent structured internationalisation layer so English is implemented cleanly and future Hindi support does not require a rewrite.
- Lucide icons or the repository-standard icon library; icons must never be the only label for critical actions.
- Sonner or an equivalent accessible toast system for non-critical feedback.
- Sentry or an approved error-monitoring client with aggressive sensitive-data redaction.
- Playwright for end-to-end testing.
- Vitest or Jest plus Testing Library for unit and component tests.
- axe-core integration for automated accessibility checks.
- MSW only for tests and isolated component development, not for production data.

## 4.2 Package rules

- Use the existing package manager and lockfile.
- Do not add abandoned or redundant packages.
- Do not use `any` to escape API typing.
- Do not disable strict mode.
- Do not add a second global state library unless a real use case cannot be met by URL state, React context, and TanStack Query.
- Audit bundle size and avoid importing entire icon, chart, or utility libraries.

## 4.3 Rendering strategy

- Use Server Components for static shell, metadata, and non-interactive composition where it genuinely simplifies the app.
- Use Client Components for tables, charts, filters, forms, dialogs, live monitoring, camera/image review controls, and interactive session management.
- Do not expose backend secrets through server-to-client props.
- Use streaming and skeletons for expensive dashboard sections where appropriate.
- Do not cache role-sensitive or institution-sensitive data publicly.
- Use no-store or carefully scoped revalidation for highly sensitive and rapidly changing screens.

---

# 5. REQUIRED REPOSITORY STRUCTURE

Create or adapt a maintainable feature-oriented structure similar to:

```text
/src
  /app
    /(public)
      /admin/login
      /admin/forgot-password
      /admin/reset-password
    /(admin)
      /admin
        /dashboard
        /organisations
        /colleges
        /campuses
        /departments
        /programmes
        /curricula
        /academic-sessions
        /batches
        /academic-years
        /semesters
        /sections
        /rooms
        /subjects
        /subject-offerings
        /teachers
        /teacher-assignments
        /students
        /student-verification
        /face-enrolments
        /course-authorisations
        /course-offerings
        /course-registrations
        /timetables
        /scheduled-classes
        /calendar
        /holidays
        /class-change-requests
        /attendance-policies
        /attendance
        /manual-attendance
        /attendance-corrections
        /attendance-sheets
        /reports
        /system-alerts
        /security
        /audit-logs
        /imports
        /exports
        /system-settings
        /admin-management
        /system-status
        /help
  /components
    /app-shell
    /charts
    /data-display
    /data-table
    /feedback
    /forms
    /navigation
    /overlays
    /security
  /features
    /auth
    /dashboard
    /institutional-setup
    /teachers
    /students
    /courses
    /scheduling
    /attendance
    /reports
    /security
    /settings
  /lib
    /api
      /generated
      /client
      /errors
      /query-keys
    /auth
    /permissions
    /formatters
    /validation
    /telemetry
    /utils
  /hooks
  /providers
  /styles
  /types
  /test
    /fixtures
    /mocks
    /utils
/e2e
/public
/docs
```

- Feature modules own their page-level components, schemas, query hooks, mutations, permission metadata, and tests.
- Shared components must remain domain-neutral.
- Do not create a single massive dashboard component or a generic form abstraction that hides validation and accessibility behaviour.
- Avoid circular imports between features.
- Use path aliases consistently.

---

# 6. DESIGN SYSTEM AND VISUAL DIRECTION

The Admin interface must look like a credible modern institutional SaaS product: professional, calm, information-dense, auditable, and efficient. It must not look like a student project, generic Bootstrap dashboard, or flashy marketing page.

## 6.1 Visual principles

- Desktop-first administrative workspace with responsive tablet and practical mobile fallbacks.
- Clear hierarchy: page title, contextual description, current scope, primary action, filters, content, status, and audit metadata.
- Use whitespace deliberately without wasting space in dense tables.
- Use colour mainly for status and action priority, not decoration.
- Maintain a stable sidebar and header so users do not lose context.
- Use subtle motion only for state transitions; respect reduced motion.
- Show critical status using text, icon, and colour together.
- Prefer side sheets for contextual create/edit tasks and full pages for complex multi-step workflows.
- Prefer explicit labels over unexplained icons.

## 6.2 Semantic design tokens

- background, foreground, card, card-foreground, muted, muted-foreground;
- primary, primary-foreground, secondary, accent;
- border, input, ring, focus;
- success, warning, danger, info and readable foreground variants;
- sidebar background, sidebar foreground, sidebar active, sidebar border;
- chart series tokens that remain distinguishable in light and dark themes;
- spacing, radius, shadow, typography and motion-duration scales.

Do not scatter raw hex values through feature components.

## 6.3 Typography

- Use a highly readable professional sans-serif available through the project configuration.
- Define display, page-title, section-title, body, compact-table, label, helper, and mono/reference styles.
- Use tabular numerals for counts, percentages, dates, and attendance matrices.
- Do not use tiny text below accessible readability thresholds for core information.

## 6.4 Central status language

- Active, Inactive, Suspended, Deactivated, Archived, Completed.
- Invitation Sent, Verification Pending, Pending Approval, Approved, Rejected.
- Generated, Delivered, Used, Expired, Revoked, Regenerated.
- Upcoming, Ongoing, Attendance Open, Completed, Cancelled, Rescheduled, Holiday, Extra Class.
- Present, Absent, Holiday, Cancelled, Not Applicable, Excused, Pending Review, Manually Corrected, Late where enabled.
- Safe, Warning, Critical.
- Validating, Preview Ready, Committing, Completed, Failed.
- Open, Resolved, Reopened.

Create one central status-display map. Never let each feature invent its own labels or colours.

## 6.5 Theme and appearance

- Support light and dark modes through tokens.
- Default may follow system preference.
- Ensure tables, charts, code-reveal panels, dialogs, date pickers, and protected image review are fully themed.
- Persist theme only as a non-sensitive preference.
- Do not allow appearance settings to weaken status accessibility.

---

# 7. APPLICATION SHELL, CONTEXT, AND NAVIGATION

## 7.1 Admin application shell

- Collapsible desktop sidebar and drawer navigation on narrow screens.
- Sticky top header.
- FaceAttend logo and Admin Portal label.
- Current Organisation, College, Department, Session, Batch, Semester, and Section context where the role permits selection.
- Global search restricted to authorised institutional records.
- System Alert bell with unread count.
- Help shortcut.
- Admin profile menu, security shortcut, and logout.
- Breadcrumbs generated from route and entity data.
- Page-level permission and scope awareness.

## 7.2 Final navigation groups

```text
Overview
  Dashboard

Institution Setup
  Organisations                [Super Admin / Organisation Admin]
  Colleges
  Campuses
  Departments
  Programmes
  Curriculum Versions
  Academic Sessions
  Batches / Cohorts
  Academic Years
  Semesters
  Sections
  Rooms
  Subjects
  Subject Offerings

People
  Teachers
  Teacher Assignments
  Students
  Student Verification
  Face Enrolment Reviews
  Admin Management             [authorised roles only]

Course Management
  Course Authorisations
  Course Offerings
  Course Registrations

Scheduling
  Timetables
  Scheduled Classes
  Academic Calendar
  Holidays
  Class Change Requests

Attendance
  Attendance Overview
  Live Sessions
  Attendance Records
  Attendance Attempts          [restricted]
  Manual Attendance Requests
  Attendance Corrections
  Attendance Sheets
  Attendance Policies

Insights
  Reports and Analytics
  Imports
  Exports

Trust and Security
  System Alerts
  Security Centre
  Audit Logs
  System Status

Configuration
  System Settings
  Help and Support
```

## 7.3 Navigation permission rules

- Build navigation from a central route-permission map.
- Hide inaccessible groups and items, but still protect every route and action independently.
- Department Admin sees only Department-scoped descendants.
- Attendance Admin sees attendance, corrections, reports, and permitted user summaries but not academic-master mutation controls.
- Academic Coordinator sees permitted structures, assignments, registrations, and scheduling workflows.
- Read-only Auditor sees authorised read-only screens and never mutation buttons.
- Super Admin-only controls must not render for other roles.
- A direct URL to an inaccessible route must resolve to a safe Not Found or Access Denied experience consistent with backend non-disclosure.

## 7.4 Context selector behaviour

- Selections cascade by academic lineage.
- Changing College clears incompatible Department, Programme, Session, Batch, Semester, and Section selections.
- Context values come from authorised backend lists.
- Context may be reflected in URL search parameters for safe internal views.
- Never put secrets or security-sensitive data in the URL.
- A context selector is a convenience filter; it never grants access.

---

# 8. AUTHENTICATION, SESSION, AND ROUTE PROTECTION

## 8.1 Required authentication screens

- Admin Login.
- MFA challenge.
- Forgot password.
- Reset password.
- Password expired or forced-reset flow.
- Account locked, suspended, or deactivated state.
- Session expired state.
- First-login MFA setup where policy requires it.
- Logout and logout-all session management.

## 8.2 Token and cookie security

- Never store access or refresh tokens in localStorage or sessionStorage.
- Prefer secure HttpOnly SameSite cookies set by backend or a properly designed Next.js Backend-for-Frontend.
- Do not copy tokens into client-visible JavaScript merely for convenience.
- Implement refresh-token rotation handling and forced logout on token reuse detection.
- Do not retry authentication failures indefinitely.
- Clear sensitive query cache and user context on logout or role/scope change.
- Use CSRF protection when cookie-authenticated mutations require it.

## 8.3 Auth bootstrap

1. Resolve the current authenticated Admin.
2. Resolve roles, permissions, assigned scopes, MFA status, and active session state.
3. Load permitted application contexts.
4. Render protected shell only after minimum authorisation state is known.
5. Use a stable full-page authentication skeleton instead of flashing protected content.
6. Redirect inactive or expired accounts to the correct state page.

## 8.4 Step-up authentication

- Explain why verification is required.
- Mask password and OTP values.
- Prevent concurrent submissions.
- Show expiry and retry behaviour without exposing sensitive details.
- Restore focus correctly after error or completion.
- Clear challenge values immediately after completion or cancellation.
- Never log the challenge input.

---

# 9. API CLIENT, SERVER STATE, AND ERROR HANDLING

## 9.1 Typed API client

- Generate TypeScript API types and clients from Phase 1 OpenAPI where practical.
- Wrap the generated client in a small adapter for base URL, cookies, CSRF, request IDs, standard envelopes, cancellation, and normalised errors.
- Do not write ad hoc fetch calls across page components.
- Do not duplicate backend enums manually in multiple files.
- Validate critical boundary responses when generated typing alone is insufficient.

## 9.2 Standard response handling

```ts
interface ApiSuccess<T> {
  data: T;
  meta: {
    request_id: string;
    page?: number;
    limit?: number;
    total_records?: number;
    total_pages?: number;
  };
}

interface ApiFailure {
  error: {
    code: string;
    message: string;
    field?: string | null;
    details?: unknown;
    request_id: string;
  };
}
```

## 9.3 Error UX

- Map stable backend error codes to accurate user-facing guidance.
- Show field-level errors next to fields when field is supplied.
- Show conflict errors without discarding form state.
- Show request_id in a copyable technical-details disclosure, not as the primary message.
- Do not reveal stack traces, database messages, hashes, out-of-scope record existence, or raw security details.
- Handle 401 through controlled refresh or sign-in transition.
- Handle 403/404 according to backend non-disclosure behaviour.
- Handle 409 as conflict requiring correction or refresh.
- Handle 422 as a valid request blocked by business state.
- Handle 429 with retry timing when supplied.
- Handle 500 with safe retry and support reference.

## 9.4 Query behaviour

- Create a central query-key factory per module.
- Use URL-driven filters for list pages.
- Cancel obsolete requests when filters change rapidly.
- Use sensible stale times by data class.
- Do not cache biometric review images longer than required.
- Do not persist sensitive TanStack Query cache to browser storage.
- Use background refresh for dashboards and live oversight only where appropriate.
- Use WebSocket or Server-Sent Events only if Phase 1 exposes a supported channel; otherwise use bounded visibility-aware polling.

## 9.5 Mutation behaviour

- Disable duplicate submission while a mutation is pending.
- Use Idempotency-Key for critical create and transition actions when supported.
- Send optimistic concurrency version or updated_at precondition for sensitive edits.
- Do not optimistically update security, correction, authorisation, or attendance state before server success.
- Invalidate only affected query families.
- Show clear confirmed success and resulting status.
- Never show success before backend transaction confirmation.

---

# 10. URL, FILTER, TABLE, FORM, AND CONFIRMATION CONVENTIONS

## 10.1 URL state

- Use route segments for entity identity and page mode.
- Use query parameters for page, limit, sort, order, filters, view mode, date ranges, and tabs.
- Debounce free-text search.
- Preserve list state when returning from details.
- Provide Clear filters and a visible active-filter count.
- Never place passwords, OTPs, plaintext codes, biometric URLs, or private remarks in URLs.

## 10.2 Data-table standard

- Server-side pagination and allowlisted sorting.
- Typed filters and debounced search.
- Column visibility and density control.
- Sticky headers where useful.
- Row selection only when a valid bulk action exists.
- Accessible row actions.
- Exports only through authorised backend report/export jobs.
- Saved views only if backed by supported preferences; otherwise non-sensitive local preferences only.
- Shape-matched skeleton rows.
- Prerequisite-aware empty states.
- Partial failure and retry.
- Mobile card fallback for high-priority lists.

## 10.3 Form standard

- React Hook Form and Zod.
- Backend remains authoritative.
- Required fields marked textually.
- Helper text for complex relationships.
- Cascading selects load only authorised descendants.
- Searchable comboboxes for large data sets.
- Display dates in College timezone and submit backend-required format.
- Unsaved-change warning for complex forms.
- Autosave only low-risk preferences, never institutional mutations.
- Disable incompatible fields rather than silently discarding values.
- Show backend conflict details near relevant fields.

## 10.4 Confirmation levels

1. Low risk: ordinary confirmation or safe undo.
2. Sensitive: confirmation dialog plus structured reason.
3. Highly sensitive: consequence summary plus password or OTP step-up.

Highly sensitive examples include account deactivation, verified-email changes, face re-enrolment approval, session revocation, device blocking, correction reversal, attendance-policy activation, institution-wide sensitive export, and Admin-role changes.

---

# 11. ROLE AND PERMISSION-AWARE UI

Use backend-provided permission claims and scopes. Centralise checks in permission utilities and route metadata; do not scatter role-name conditionals.

| Role | Typical UI access |
|---|---|
| Super Admin | All Organisations, platform-wide administration, role management, system status, highest-risk actions |
| Organisation Admin | Colleges and descendants within assigned Organisation |
| College Admin | One College and descendants; broad operational control |
| Department Admin | Assigned Department and descendants; no cross-Department records |
| Attendance Admin | Attendance oversight, corrections, sheets, reports, approved security actions; no unrelated academic-master mutation |
| Academic Coordinator | Academic structures, assignments, registrations, timetable and related workflows |
| Read-only Auditor | Authorised read-only records, audit, and reports; no mutations |

- Primary action renders only when permission and scope allow it.
- Row actions are filtered per record state and permission.
- Disabled controls are used only when the user may act after satisfying a visible business condition; inaccessible actions generally do not render.
- Bulk actions compute eligibility across selected rows and explain exclusions.
- Sensitive detail fields can be redacted even when page access is allowed.
- Do not infer access from navigation visibility.
- Every mutation handler checks permission metadata before API invocation, while backend independently enforces it.

---

# 12. GLOBAL COMPONENTS AND CROSS-MODULE UX

## 12.1 Required shared components

- AppShell, Sidebar, MobileNav, Header, Breadcrumbs, ScopeSelector.
- PageHeader with title, description, badges, and primary/secondary actions.
- PermissionGate and ScopeGuard helpers.
- ServerDataTable and MobileRecordCards.
- FilterBar, ActiveFilterChips, DateRangeFilter, EntityCombobox.
- MetricCard, TrendCard, StatusSummary, ChartCard.
- StatusBadge and RiskBadge.
- EntityLink and EntitySummaryCard.
- EmptyState, ErrorState, ForbiddenState, NotFoundState, OfflineBanner, PartialDataNotice.
- ConfirmDialog, ReasonDialog, StepUpAuthDialog, VersionConflictDialog.
- AuditTrail, Timeline, StateTransitionHistory.
- OneTimeSecretReveal for course authorisation codes.
- ImportWizard, ValidationPreviewTable, ExportJobStatus.
- AttendanceMatrix with sticky identity columns and horizontal virtualisation.
- ProtectedImageReview with expiring URL, blur/reveal, no download, and permission logging.
- SystemAlertList with no compose control.
- SecurityEventDetail with structured evidence.
- RequestIdDetails disclosure.
- Skeletons for dashboard, table, detail, form, matrix, and chart views.

## 12.2 Global search

- Search only authorised Teachers, Students, Subjects, Course Offerings, Sections, and Attendance Session references.
- Group results by entity type.
- Do not search messages, announcements, materials, documents, or social content because those features do not exist.
- Debounce and cancel stale searches.
- Apply role and scope server-side.
- Provide keyboard navigation and accessible announcements.

## 12.3 Toasts and Alerts

- Toasts are immediate operation feedback, not durable Alert storage.
- Critical failures remain visible in-page.
- Do not display sensitive payloads in toasts.
- System Alerts are event-generated records; frontend never creates arbitrary Alert content.

---

# 13. COMPLETE ROUTE MAP

```text
/admin/login
/admin/forgot-password
/admin/reset-password
/admin/dashboard

/admin/organisations
/admin/organisations/[organisationId]
/admin/colleges
/admin/colleges/[collegeId]
/admin/campuses
/admin/campuses/[campusId]
/admin/departments
/admin/departments/[departmentId]
/admin/programmes
/admin/programmes/[programmeId]
/admin/curricula
/admin/curricula/[curriculumId]
/admin/academic-sessions
/admin/academic-sessions/[sessionId]
/admin/batches
/admin/batches/[batchId]
/admin/academic-years
/admin/academic-years/[academicYearId]
/admin/semesters
/admin/semesters/[semesterId]
/admin/sections
/admin/sections/[sectionId]
/admin/rooms
/admin/rooms/[roomId]
/admin/subjects
/admin/subjects/[subjectId]
/admin/subject-offerings
/admin/subject-offerings/[subjectOfferingId]

/admin/teachers
/admin/teachers/new
/admin/teachers/[teacherId]
/admin/teachers/[teacherId]/edit
/admin/teacher-assignments
/admin/teacher-assignments/new
/admin/teacher-assignments/[assignmentId]
/admin/students
/admin/students/new
/admin/students/[studentId]
/admin/students/import
/admin/student-verification
/admin/student-verification/[requestId]
/admin/face-enrolments
/admin/face-enrolments/[requestId]
/admin/admin-management
/admin/admin-management/[adminId]

/admin/course-authorisations
/admin/course-authorisations/[authorisationId]
/admin/course-offerings
/admin/course-offerings/[courseOfferingId]
/admin/course-registrations

/admin/timetables
/admin/timetables/[timetableId]
/admin/scheduled-classes
/admin/scheduled-classes/[scheduledClassId]
/admin/calendar
/admin/holidays
/admin/class-change-requests
/admin/class-change-requests/[requestId]

/admin/attendance
/admin/attendance/live
/admin/attendance/sessions/[sessionId]
/admin/attendance/records
/admin/attendance/records/[recordId]
/admin/attendance/attempts
/admin/manual-attendance
/admin/manual-attendance/[requestId]
/admin/attendance-corrections
/admin/attendance-corrections/[correctionId]
/admin/attendance-sheets
/admin/attendance-policies

/admin/reports
/admin/imports
/admin/imports/[jobId]
/admin/exports
/admin/exports/[jobId]
/admin/system-alerts
/admin/security
/admin/security/events/[eventId]
/admin/audit-logs
/admin/system-status
/admin/system-settings
/admin/help
```

---


# 13A. EXPLICIT PHASE 1 API INTEGRATION MAP

> The actual running OpenAPI contract is authoritative. The paths below are the expected Phase 1 integration surface. Generate the client from OpenAPI and reconcile any path-name difference before building screens. Do not create frontend mocks to hide a missing endpoint.

## 13A.1 Authentication and current Admin

- `POST /api/v1/auth/admin/login`
- `POST /api/v1/auth/admin/refresh`
- `POST /api/v1/auth/admin/logout`
- `POST /api/v1/auth/admin/logout-all`
- `POST /api/v1/auth/admin/forgot-password`
- `POST /api/v1/auth/admin/reset-password`
- `POST /api/v1/auth/admin/change-password`
- `POST /api/v1/auth/admin/mfa/setup`
- `POST /api/v1/auth/admin/mfa/verify`
- `POST /api/v1/auth/admin/mfa/disable`
- `GET /api/v1/auth/admin/sessions`
- `DELETE /api/v1/auth/admin/sessions/:sessionId`
- Use the documented current-account/profile/permissions endpoint from OpenAPI. If Phase 1 exposes no consolidated current-Admin endpoint, report this as an integration gap rather than guessing role and scope.

## 13A.2 Institutional master data

Expected REST collections:

- `/api/v1/organisations`
- `/api/v1/colleges`
- `/api/v1/campuses`
- `/api/v1/departments`
- `/api/v1/programmes`
- `/api/v1/curriculum-versions`
- `/api/v1/academic-sessions`
- `/api/v1/batches`
- `/api/v1/academic-years`
- `/api/v1/semesters`
- `/api/v1/sections`
- `/api/v1/rooms`
- `/api/v1/subjects`
- `/api/v1/subject-offerings`
- `/api/v1/attendance-policies`

For each collection, integrate only the actions documented by OpenAPI:

- list with server pagination/filter/sort;
- detail;
- create;
- update;
- activate;
- deactivate;
- complete;
- archive;
- safe delete where explicitly supported;
- history or descendants where explicitly supported.

Do not assume every entity has the same transition endpoint. Generate feature-specific mutations from OpenAPI.

## 13A.3 Teacher administration

- `POST /api/v1/teachers/pre-authorise`
- `POST /api/v1/teachers/:id/send-invitation`
- `POST /api/v1/teachers/:id/resend-invitation`
- `GET /api/v1/teachers`
- `GET /api/v1/teachers/:id`
- `PATCH /api/v1/teachers/:id`
- `POST /api/v1/teachers/:id/approve`
- `POST /api/v1/teachers/:id/reject`
- `POST /api/v1/teachers/:id/suspend`
- `POST /api/v1/teachers/:id/reactivate`
- `POST /api/v1/teachers/:id/deactivate`
- `GET /api/v1/teachers/:id/assignments`
- `GET /api/v1/teachers/:id/security-summary`

Teacher public registration belongs to Phase 3 or a separate Teacher-auth surface and is not implemented as an Admin page.

## 13A.4 Teacher Assignments

Integrate the documented paths for:

- create assignment;
- list/filter assignments;
- detail;
- update effective dates or assignment role;
- revoke;
- conflict pre-check;
- history;
- eligible Teacher lookup;
- eligible Subject Offering lookup;
- eligible Section lookup.

At minimum expect a collection such as `/api/v1/teacher-assignments`. Do not invent a generic update if OpenAPI exposes action-specific transitions.

## 13A.5 Student administration and verification

Integrate the documented paths for:

- individual Student pre-registration;
- Student list/detail;
- permitted update;
- approve/reject;
- suspend/reactivate/deactivate;
- controlled Section change;
- withdrawn/transferred/graduated/archived transition;
- verification history;
- face re-enrolment request/approval/revocation;
- roster export.

Expected import and review surfaces include:

- Student import upload;
- Import Job status;
- row-level validation preview;
- commit;
- cancel/reject;
- validation-report download;
- Student verification queue/detail;
- face-enrolment review queue/detail;
- protected temporary-image access;
- biometric-consent metadata;
- review history.

Do not expose face embeddings or permanent raw-image URLs.

## 13A.6 Course Authorisations

Expected actions:

- `POST /api/v1/course-authorisations/generate`
- deliver through verified-email job;
- revoke;
- regenerate;
- extend expiry;
- detail;
- status/history;
- failed validation attempts;
- usage history.

If the backend uses American spelling (`authorizations`) rather than British spelling (`authorisations`), use the OpenAPI path consistently. Do not support both spellings through duplicated feature code.

## 13A.7 Course Offerings and registrations

Integrate documented endpoints for:

- list/detail Course Offerings;
- approve/reject pending Course Offering;
- suspend/reactivate/archive;
- change primary Teacher;
- add/remove authorised co-Teacher;
- lock/unlock registration;
- roster;
- compulsory auto-enrolment;
- Admin-controlled registration;
- approve/reject elective request;
- withdraw registration;
- eligibility and capacity pre-check.

Never add Stream, Materials, Assignments, Messages, Discussions, or People API calls.

## 13A.8 Timetable, Scheduled Classes, Calendar, and Holidays

Integrate documented endpoints for:

- Timetable Rule list/detail/create/update/state;
- conflict pre-check;
- Scheduled-Class generation;
- future-class regeneration;
- Scheduled-Class list/detail;
- schedule history;
- Calendar Event list/detail/create/update/state;
- Holiday and Special Working Day actions;
- affected-class preview;
- Class Change Request list/detail/conflict/approve/reject.

A frontend calendar library is only a renderer. It must not become the authoritative scheduling engine.

## 13A.9 Attendance oversight

- `GET /api/v1/attendance/sessions`
- `GET /api/v1/attendance/sessions/:id`
- `GET /api/v1/attendance/sessions/:id/live-summary`
- `GET /api/v1/attendance/records`
- `GET /api/v1/attendance/records/:id`
- `GET /api/v1/attendance/attempts`
- `POST /api/v1/attendance/manual-entry-requests`
- `POST /api/v1/attendance/manual-entry-requests/:id/approve`
- `POST /api/v1/attendance/manual-entry-requests/:id/reject`

No generic Attendance Record status PATCH may be called or created.

## 13A.10 Attendance Corrections

Integrate documented endpoints for:

- list/filter queue;
- detail;
- complete state history;
- move to Admin review;
- approve;
- reject;
- return for structured clarification;
- reversal/undo through a new auditable event;
- close;
- correction audit export.

No supporting-document upload endpoint or document viewer may exist.

## 13A.11 Attendance Sheets, analytics, reports, and exports

Integrate:

- Attendance Sheet query endpoints;
- Student report;
- Teacher report;
- Course Offering report;
- Section report;
- Department report;
- Programme report;
- College report;
- asynchronous report-job creation;
- Export Job status;
- retry/cancel where supported;
- signed download;
- export history.

Do not calculate official report totals in the browser.

## 13A.12 System Alerts

Integrate only:

- list;
- detail when supported;
- mark own Alert read/unread;
- delivery status;
- failed-delivery inspection;
- authorised requeue.

There must be no POST Compose endpoint, arbitrary body, reply, comment, or broadcast action.

## 13A.13 Security Centre

Expected actions:

- security dashboard;
- Security Event list/detail/history;
- resolve/reopen;
- account lock/unlock;
- force password reset;
- session list and revoke;
- device list and block/unblock;
- approved face re-enrolment reset workflow;
- suspicious QR/face/course-code/export evidence.

Never expose tokens, full fingerprints, embeddings, or unrestricted internal metrics.

## 13A.14 Audit Logs

Integrate read-only:

- list/filter;
- detail;
- target history;
- actor history;
- authorised export.

No update/delete mutation exists.

## 13A.15 Imports and exports

Integrate:

- Import Job list/detail;
- upload;
- worker status;
- validation preview;
- commit;
- cancel/reject;
- validation report;
- Export Job list/detail;
- retry/cancel where supported;
- signed download.

The browser never performs authoritative import commit logic.

## 13A.16 Settings and Admin Management

Integrate:

- typed System Settings GET/PATCH/history;
- Admin account list/detail/create/pre-authorise;
- invitation;
- role/scope assignment;
- suspend/reactivate/deactivate;
- force reset;
- MFA requirement;
- session revoke;
- security summary.

Never build a generic unrestricted settings key-value editor.

## 13A.17 Health and operational status

Use only browser-safe Admin-authorised operational endpoints for:

- application status;
- database/cache/job/storage summaries;
- backup status;
- migration/application version;
- restore-request state if supported.

Do not call an unrestricted Prometheus metrics endpoint from the browser.

---

# 14. DASHBOARD

## 14.1 Purpose

Provide an operational overview for the current authorised scope. It must answer what requires action, what happened today, whether attendance is functioning, whether identities and courses are ready, and whether security or correction risks exist.

## 14.2 Summary cards

- Total, Active, and Pending Students; pending face reviews.
- Total, Active, and Pending Teachers.
- Active Course Offerings, pending approvals, and expiring authorisations.
- Classes scheduled today and Attendance Sessions active/completed today.
- Present, Absent, and Pending Review today.
- Average attendance percentage for current scope.
- Students below configured threshold.
- Open and overdue Corrections.
- Open Security Events.
- Upcoming Holidays and Class Change Requests.

## 14.3 Charts

- Daily/weekly/monthly attendance trend.
- Course or Subject Offering attendance comparison.
- Teacher class-completion trend.
- Student attendance-distribution bands.
- Low-attendance count by Department/Programme/Section.
- Identity verification status distribution.
- Course-registration status distribution.
- Security event trend by category.
- Manual attendance and correction frequency.

## 14.4 Action queues

- Pending Teacher approvals.
- Pending Student approvals and face reviews.
- Course Offerings awaiting approval.
- Correction requests awaiting Admin action.
- Manual-attendance requests.
- Class change requests.
- Failed imports or exports.
- High-priority Security Events.

## 14.5 Dashboard implementation rules

- Use aggregation endpoints when available; do not create N+1 requests for cards.
- Independent card/chart loading and error states.
- Accessible chart summaries and data alternatives.
- Current context applied consistently.
- No fabricated metrics.
- Recent activity is a read-only Audit/system activity list with no reply, comment, post, or compose.

---

# 15. ORGANISATIONS PAGE

## Purpose

Manage top-level tenants when the authenticated role has platform or Organisation-level authority. Most College-scoped roles will never see this route.

## Primary list or overview

- Organisation name/code.
- Status.
- Number of Colleges.
- Timezone or regional setting if supplied.
- Created/updated timestamps.
- Scoped actions.

## Filters and search

- Status.
- Name/code search.
- Created date range.

## Actions

- Create Organisation.
- View detail.
- Edit permitted fields.
- Activate/deactivate/archive according to backend state.
- Open descendant Colleges.

## Create/edit form

- Name.
- Unique code.
- Status.
- Backend-supported organisational settings only.

## Detail view

- Summary.
- Colleges.
- Assigned Admins.
- Recent Audit history.
- Operational metadata.

## States and edge cases

- Duplicate code.
- Dependency-blocked deactivation.
- Out-of-scope route denial.

## Permission behaviour

- Super Admin or Organisation-management permission.
- Other roles never see route or results.

## Phase 1 API integration

- Generated Organisation CRUD/state endpoints.
- Standard envelopes, soft deletion, version conflict.

## Special implementation rules

- Never treat Organisation as a singleton.
- No cross-tenant counts may leak.

---

# 16. COLLEGES PAGE

## Purpose

Manage College identity, contact information, attendance defaults, and descendant academic structure.

## Primary list or overview

- Logo.
- Name/code.
- Institution type.
- Affiliation.
- Organisation.
- Timezone.
- Minimum attendance.
- Status.
- Descendant counts when supplied.

## Filters and search

- Organisation.
- Status.
- Institution type.
- Name/code search.

## Actions

- Create.
- View.
- Edit.
- Activate/deactivate.
- Open Campuses, Departments, settings, and audit.

## Create/edit form

- Organisation.
- Name/code.
- Institution type.
- Affiliation.
- Email/phone/address/website.
- Logo.
- Timezone.
- Working days.
- Default class duration.
- Policy mapping if supported.

## Detail view

- Identity/contact.
- Descendants.
- Attendance defaults.
- Operational counts.
- Change history.

## States and edge cases

- Invalid timezone.
- Duplicate code.
- Upload failure.
- Active dependencies.

## Permission behaviour

- College Admin edits own College only.
- Organisation Admin manages assigned Colleges.
- Auditor read-only.

## Phase 1 API integration

- College CRUD/state endpoints.
- Controlled logo upload contract.

## Special implementation rules

- Validate MIME/size before upload and rely on backend enforcement.
- Never expose storage keys.
- No hardcoded working days.

---

# 17. CAMPUSES PAGE

## Purpose

Manage physical or logical Campuses under a College.

## Primary list or overview

- Name/code.
- College.
- Address/location.
- Timezone override if supported.
- Room count.
- Status.

## Filters and search

- College.
- Status.
- Search.

## Actions

- Create.
- View.
- Edit.
- Activate/deactivate.
- Open Rooms and linked descendants.

## Create/edit form

- College.
- Name/code.
- Address/location.
- Timezone override.
- Status.

## Detail view

- Summary.
- Rooms.
- Linked Departments/Programmes.
- Audit history.

## States and edge cases

- Duplicate code.
- Cross-College move blocked.
- Dependent Room conflict.

## Permission behaviour

- Organisation/College scope required.
- Department roles read-only or hidden.

## Phase 1 API integration

- Campus CRUD/state endpoints.

## Special implementation rules

- Campus remains a live entity even for a single-campus institution.

---

# 18. DEPARTMENTS PAGE

## Purpose

Manage Departments such as Computer Applications and their relationship to College, Campus, Programmes, Teachers, and Students.

## Primary list or overview

- Name/code.
- College/Campus.
- Head of Department.
- Official email.
- Programme/Teacher/Student counts.
- Status.

## Filters and search

- Organisation/College/Campus.
- Status.
- Head assigned.
- Search.

## Actions

- Create.
- View.
- Edit.
- Assign/change Head.
- Activate/deactivate.
- Open Programmes, Teachers, Students.

## Create/edit form

- College/Campus.
- Name/code.
- Eligible active Head Teacher.
- Official email.
- Status.

## Detail view

- Overview.
- Programmes.
- Teachers.
- Students.
- Sessions.
- Attendance snapshot if authorised.
- Audit history.

## States and edge cases

- Head becomes inactive.
- Duplicate code.
- Cross-scope Teacher.
- Dependency block.

## Permission behaviour

- Department Admin limited to assigned Department.
- College Admin descendant access.
- Attendance Admin read-only if permitted.

## Phase 1 API integration

- Department CRUD.
- Eligible Head lookup.
- State and assignment endpoints.

## Special implementation rules

- Use Department = Computer Applications and Programme = MCA consistently; never store MCA as both.

---

# 19. PROGRAMMES PAGE

## Purpose

Manage programmes such as Master of Computer Applications under a Department.

## Primary list or overview

- Name/short name/code.
- Department.
- Duration.
- Years/Semesters.
- Admission and Section capacity.
- Active curriculum.
- Status.

## Filters and search

- College.
- Department.
- Status.
- Type/level if supplied.
- Search.

## Actions

- Create.
- View.
- Edit.
- Activate/deactivate.
- Open Curricula, Sessions, Batches, Sections.

## Create/edit form

- Department.
- Name/short name/code.
- Duration.
- Total Years/Semesters.
- Admission capacity.
- Default Section capacity.
- Status.

## Detail view

- Overview.
- Curricula.
- Sessions.
- Batches.
- Subject Offerings.
- Sections.
- Audit history.

## States and edge cases

- Capacity below enrolment.
- Invalid duration/semester count.
- Duplicate code.
- Historical lineage lock.

## Permission behaviour

- Academic-master permission.
- Department scope.

## Phase 1 API integration

- Programme CRUD and descendants.

## Special implementation rules

- No hardcoded MCA assumptions; support UG and PG.

---

# 20. CURRICULUM VERSIONS PAGE

## Purpose

Manage versioned Programme curricula so Subject Offerings remain historically stable. This page stores metadata only and distributes no syllabus files.

## Primary list or overview

- Programme.
- Version label/code.
- Effective Session/date.
- Status.
- Offering count.
- Current flag.

## Filters and search

- Programme.
- Status.
- Effective period.
- Search.

## Actions

- Create version.
- View.
- Edit Draft.
- Activate.
- Archive future use.
- Open Subject Offerings.

## Create/edit form

- Programme.
- Version label/code.
- Effective dates/Sessions.
- Metadata description.
- Status.

## Detail view

- Overview.
- Subject Offerings.
- Usage by Sessions/Batches.
- Audit history.

## States and edge cases

- Historical destructive edit blocked.
- Overlap.
- Duplicate version.
- Archive preserves history.

## Permission behaviour

- Academic Coordinator or higher.
- Auditor read-only.

## Phase 1 API integration

- Curriculum CRUD/activation endpoints.

## Special implementation rules

- No syllabus upload, document URL, material attachment, or file distribution.

---

# 21. ACADEMIC SESSIONS PAGE

## Purpose

Manage Programme-specific Academic Sessions and the date boundaries controlling registration and attendance calculation.

## Primary list or overview

- Name/code.
- Programme.
- Start/end.
- Admission/graduation year.
- Status.
- Registration window.
- Semester, teaching, attendance, and end dates.

## Filters and search

- College.
- Department.
- Programme.
- Status.
- Date range.
- Search.

## Actions

- Create.
- View.
- Edit future dates with impact warning.
- Open/close registration.
- Activate.
- Complete.
- Archive.

## Create/edit form

- Programme.
- Name/code.
- Start/end.
- Admission/graduation year.
- Registration timestamps.
- Semester start.
- Teaching start.
- Attendance start.
- Semester end.
- Exam/vacation periods.
- Status.

## Detail view

- Timeline.
- Batches.
- Years.
- Semesters.
- Sections.
- Attendance implications.
- Audit history.

## States and edge cases

- Teaching start before Semester start.
- Attendance start outside Session.
- Invalid registration window.
- Existing class/attendance impact.
- Mid-month NA.

## Permission behaviour

- Academic-master permission.
- Attendance Admin read-only for date impact.

## Phase 1 API integration

- Session CRUD/state endpoints.
- Concurrency version.

## Special implementation rules

- Show impact panel before date changes.
- Explain NA; backend performs calculations.

---

# 22. BATCHES / COHORTS PAGE

## Purpose

Manage admitted cohorts separately from Academic Sessions.

## Primary list or overview

- Name/code.
- Programme.
- Admission/graduation year.
- Session.
- Current Year/Semester.
- Student count.
- Status.

## Filters and search

- Programme.
- Session.
- Status.
- Admission year.
- Search.

## Actions

- Create.
- View.
- Edit allowed metadata.
- Activate/complete/archive.
- Open Years, Semesters, Sections, Students.

## Create/edit form

- Programme.
- Session.
- Name/code.
- Admission year.
- Expected graduation.
- Capacity.
- Status.

## Detail view

- Overview.
- Years.
- Semesters.
- Sections.
- Students.
- Attendance snapshot.
- Audit history.

## States and edge cases

- Duplicate Batch.
- Capacity conflict.
- Historical reparent blocked.
- Archive preserves history.

## Permission behaviour

- Academic-structure permission.
- Department scope.

## Phase 1 API integration

- Batch CRUD/state endpoints.

## Special implementation rules

- Do not merge Batch and Session in labels or forms.

---

# 23. ACADEMIC YEARS PAGE

## Purpose

Manage Year instances within a Batch and Session.

## Primary list or overview

- Year number/label.
- Batch.
- Session.
- Start/end.
- Semester/Section counts.
- Status.

## Filters and search

- Programme.
- Batch.
- Session.
- Status.

## Actions

- Create.
- View.
- Edit dates before dependent attendance.
- Activate/complete/archive.

## Create/edit form

- Batch.
- Session.
- Year number.
- Display label.
- Start/end.
- Status.

## Detail view

- Semesters.
- Sections.
- Students.
- Audit history.

## States and edge cases

- Overlapping years.
- Number exceeds Programme duration.
- Historical date lock.

## Permission behaviour

- Academic-structure permission.

## Phase 1 API integration

- Academic Year CRUD.

## Special implementation rules

- Preserve numeric ordering while displaying readable labels.

---

# 24. SEMESTERS PAGE

## Purpose

Manage Semester instances and attendance-relevant dates within Academic Years and Batches.

## Primary list or overview

- Number/label.
- Academic Year.
- Batch.
- Start/end.
- Teaching start.
- Attendance start.
- Current flag.
- Status.

## Filters and search

- Programme.
- Batch.
- Year.
- Status.
- Date range.

## Actions

- Create.
- View.
- Edit future dates.
- Activate/complete/archive.
- Open Sections and Subject Offerings.

## Create/edit form

- Academic Year.
- Semester number/label.
- Start/end.
- Teaching start.
- Attendance start.
- Status.

## Detail view

- Sections.
- Subject Offerings.
- Timetable coverage.
- Attendance Policy.
- Audit history.

## States and edge cases

- Date overlap.
- Outside Year.
- Attendance impact.
- Duplicate number.

## Permission behaviour

- Academic-structure permission.

## Phase 1 API integration

- Semester CRUD/state endpoints.

## Special implementation rules

- Display NA impact when teaching begins later than calendar start.

---

# 25. SECTIONS PAGE

## Purpose

Manage class Sections under a Semester and Batch, including capacity and coordinator.

## Primary list or overview

- Name/code.
- Programme.
- Batch.
- Year.
- Semester.
- Capacity/current count.
- Coordinator.
- Status.

## Filters and search

- Programme.
- Session.
- Batch.
- Year.
- Semester.
- Status.
- Capacity state.

## Actions

- Create.
- View.
- Edit capacity/coordinator.
- Activate/deactivate/archive.
- Open roster, timetable, Courses, attendance.

## Create/edit form

- Semester.
- Name/code.
- Capacity.
- Eligible coordinator.
- Start/end.
- Status.

## Detail view

- Roster.
- Course Offerings.
- Timetable.
- Attendance summary.
- Capacity history.
- Audit.

## States and edge cases

- Capacity below enrolment.
- Duplicate Section.
- Cross-scope coordinator.
- Historical move blocked.

## Permission behaviour

- Department/Academic Coordinator scope.
- Attendance roles read-only.

## Phase 1 API integration

- Section CRUD and eligible coordinator endpoints.

## Special implementation rules

- Initial cap 50 comes from data/settings, never code.

---

# 26. ROOMS PAGE

## Purpose

Manage classrooms and laboratories for timetable conflict detection.

## Primary list or overview

- Name/code.
- Campus.
- Building/floor.
- Capacity.
- Type.
- Status.

## Filters and search

- College.
- Campus.
- Type.
- Status.
- Capacity.
- Search.

## Actions

- Create.
- View.
- Edit.
- Activate/deactivate.
- Open schedule.

## Create/edit form

- Campus.
- Name/code.
- Building/floor.
- Capacity.
- Type.
- Status.

## Detail view

- Current/upcoming schedule.
- Conflict history if supplied.
- Audit.

## States and edge cases

- Invalid capacity.
- Duplicate code.
- Future timetable dependency.

## Permission behaviour

- Timetable or institution-setup permission.

## Phase 1 API integration

- Room CRUD/schedule endpoints.

## Special implementation rules

- Room optional for online class and required for physical class according to backend.

---

# 27. SUBJECTS PAGE

## Purpose

Manage stable Subject master metadata. This is not a course feed and contains no syllabus upload.

## Primary list or overview

- Name/code.
- Department.
- Programme applicability.
- Type.
- Credits.
- Theory/practical.
- Status.

## Filters and search

- College.
- Department.
- Programme applicability.
- Type.
- Status.
- Search.

## Actions

- Create.
- View.
- Edit.
- Activate/deactivate/archive.
- Open Subject Offerings.

## Create/edit form

- Department.
- Name/code.
- Type.
- Credits.
- Default weekly classes.
- Theory/practical.
- Short metadata description.
- Status.

## Detail view

- Overview.
- Subject Offerings.
- Eligible/assigned Teachers.
- Course Offerings.
- Audit.

## States and edge cases

- Duplicate code.
- Historical-use lock.
- Invalid credits/classes.

## Permission behaviour

- Subject-management permission.
- Department scope.

## Phase 1 API integration

- Subject CRUD/archive endpoints.

## Special implementation rules

- No syllabus URL, document upload, notes, materials, or academic resources.

---

# 28. SUBJECT OFFERINGS PAGE

## Purpose

Map Subjects into a Curriculum, Programme, Semester, and applicability context.

## Primary list or overview

- Subject.
- Programme/Curriculum.
- Semester.
- Type.
- Credits.
- Weekly classes.
- Core/elective.
- Status.

## Filters and search

- Department.
- Programme.
- Curriculum.
- Session.
- Batch.
- Semester.
- Core/elective.
- Status.

## Actions

- Create.
- View.
- Edit future offering.
- Activate/deactivate/archive.
- Open assignments and Course Offerings.

## Create/edit form

- Subject.
- Programme.
- Curriculum.
- Semester.
- Applicability rules.
- Credits override if supported.
- Weekly classes.
- Core/elective.
- Status.

## Detail view

- Lineage.
- Assignments.
- Course Offerings.
- Registration rules.
- Audit.

## States and edge cases

- Invalid lineage.
- Duplicate active offering.
- Historical mutation blocked.

## Permission behaviour

- Academic-master permission.
- Department scope.

## Phase 1 API integration

- Subject Offering CRUD/lookups.

## Special implementation rules

- Selectors must be backend-filtered, never hardcoded.

---

# 29. TEACHERS PAGE

## Purpose

Manage Teacher pre-authorisation, onboarding, approval, assignments, profile, and account lifecycle.

## Primary list or overview

- Photo.
- Name.
- Employee ID.
- Verified official email.
- Department.
- Designation.
- Assignment count.
- Active Course count.
- Verification/account status.
- Last login.

## Filters and search

- College.
- Department.
- Designation.
- Onboarding/account status.
- Assigned state.
- Last login range.
- Name/ID/email search.

## Actions

- Pre-authorise.
- Send/resend invitation.
- View.
- Edit permitted metadata.
- Approve/reject.
- Suspend/reactivate.
- Deactivate with reassignment.
- Open assignments/security summary.

## Create/edit form

- Department.
- Full name.
- Employee ID.
- Official email.
- Phone if institution requires it.
- Designation.
- Qualification.
- Specialisation.
- Photo.
- Joining date.
- Eligible Subjects only if API supports them.

## Detail view

- Identity.
- Onboarding timeline.
- Assignments.
- Courses.
- Schedule.
- Attendance-performance summary.
- Restricted security summary.
- Audit.

## States and edge cases

- Duplicate email/ID.
- Expired invitation.
- Active Course dependencies.
- Verified-email change requires step-up/reverification.
- Out-of-scope Teacher.

## Permission behaviour

- Teacher-management permission.
- Department scope.
- Attendance role sees minimum needed data.
- Auditor read-only.

## Phase 1 API integration

- Teacher pre-authorise, invitation, approval, suspension, reactivation, deactivation, profile, assignments, security-summary endpoints.

## Special implementation rules

- No announcements, documents, bio, office hours, messages, materials, or assignments.
- Deactivation must show affected Courses and reassignment needs.

---

# 30. TEACHER ASSIGNMENTS PAGE

## Purpose

Create the exact Subject Offering, Section, Session, role, and date scope within which a Teacher may operate.

## Primary list or overview

- Teacher.
- Subject Offering.
- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Role.
- Effective/expiry dates.
- Status.

## Filters and search

- Teacher.
- Department.
- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Subject.
- Role.
- Status.

## Actions

- Create.
- Conflict pre-check.
- View.
- Edit role/dates when allowed.
- Revoke.
- History.
- Generate Course Authorisation.

## Create/edit form

- Teacher.
- Subject Offering.
- Session.
- Batch.
- Year.
- Semester.
- Section.
- Assignment type.
- Effective/expiry dates.

## Detail view

- Full lineage.
- Teacher status.
- Authorisations.
- Courses.
- Transition history.
- Audit.

## States and edge cases

- Inactive Teacher.
- Offering mismatch.
- Section mismatch.
- Date outside Session.
- Duplicate assignment.
- Cross-tenant selection.
- Conflict.

## Permission behaviour

- Teacher-assignment permission.
- Department scope.
- Auditor read-only.

## Phase 1 API integration

- Assignment create/list/update/revoke/conflict/history endpoints.

## Special implementation rules

- Use guided multi-step form and final lineage summary.
- No free-text Subject or Section.

---

# 31. STUDENTS PAGE

## Purpose

Manage authorised Student records, onboarding, academic placement, lifecycle, and attendance-related identity status.

## Primary list or overview

- Photo.
- Name.
- Roll/registration number.
- Verified email.
- Programme.
- Batch.
- Year.
- Semester.
- Section.
- Face status.
- Course-registration status.
- Attendance percentage.
- Account status.

## Filters and search

- College.
- Department.
- Programme.
- Session.
- Batch.
- Year.
- Semester.
- Section.
- Account/face/registration status.
- Attendance-risk band.
- Search.

## Actions

- Pre-register.
- Bulk import.
- View.
- Edit permitted mapping.
- Approve/reject.
- Suspend/reactivate.
- Controlled Section change.
- Withdraw/transfer/graduate/archive.
- Request/approve face re-enrolment.
- Export roster.

## Create/edit form

- Full name.
- Roll/registration number.
- Approved email.
- Phone if policy requires.
- Programme.
- Session.
- Batch.
- Year.
- Semester.
- Section.
- Initial status.

## Detail view

- Identity.
- Onboarding.
- Academic placement.
- Course registrations.
- Attendance summary.
- Corrections.
- Face status without embedding.
- Restricted security summary.
- Audit.

## States and edge cases

- Duplicate identifiers.
- Capacity exceeded.
- Invalid lineage.
- Historical attendance during transfer.
- Face pending.
- Sensitive identifier change.

## Permission behaviour

- Student-management permission.
- Department scope.
- Auditor read-only.

## Phase 1 API integration

- Student pre-registration/list/detail/update/transitions/Section change/verification/re-enrolment/roster endpoints.

## Special implementation rules

- Do not collect address/emergency contact unless Phase 1 explicitly requires it.
- Never expose embedding references or unrelated data.

---

# 32. STUDENT BULK IMPORT

## Purpose

Import authorised Student records through validation preview before any commit.

## Primary list or overview

- Job reference.
- Entity/file.
- Initiator.
- Status.
- Valid/invalid counts.
- Created/expiry.
- Commit state.

## Filters and search

- Status.
- Initiator.
- Date range.
- Programme/Section.
- Job search.

## Actions

- Start import.
- Download template if supported.
- Upload CSV/XLSX.
- View/filter preview.
- Commit according to backend policy.
- Cancel/reject.
- Download validation report.
- Retry processing.

## Create/edit form

- Student entity.
- Target academic context.
- Validated file.
- Commit policy only if backend supports.

## Detail view

- Job summary.
- Row preview.
- Error categories.
- Commit result.
- Audit.
- Quarantine expiry.

## States and edge cases

- Wrong MIME/size.
- Malformed headers.
- Duplicate rolls.
- Invalid emails.
- Unknown lineage.
- Capacity issue.
- Worker failure.

## Permission behaviour

- Import permission.
- Scope enforcement.
- Validation report permission if separate.

## Phase 1 API integration

- Import upload/status/preview/commit/cancel/report endpoints.

## Special implementation rules

- Backend parsing and commit are authoritative.
- Show exact rows and stable errors.
- Respect file retention.

---

# 33. STUDENT VERIFICATION QUEUE

## Purpose

Review Student registration identity and authorised-record matching before activation.

## Primary list or overview

- Name.
- Roll/registration.
- Approved email.
- Academic context.
- Submitted time.
- Email/phone verification.
- Face status.
- Risk indicators.
- Queue status.

## Filters and search

- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Risk.
- Submission date.
- Status.
- Search.

## Actions

- Open review.
- Approve.
- Reject with reason.
- Request structured resubmission.
- Suspend.
- View history.

## Create/edit form

- Decision.
- Predefined reason.
- Restricted internal remark.
- Step-up if required.

## Detail view

- Authorised record comparison.
- Identity metadata.
- Verification statuses.
- Face review summary.
- Risk signals.
- Prior events.
- Audit.

## States and edge cases

- Record mismatch.
- Duplicate risk.
- Expired image.
- Concurrent review.
- Student status changed.

## Permission behaviour

- Student-verification permission.
- Minimum necessary data.
- Auditor read-only.

## Phase 1 API integration

- Queue/detail/approve/reject/resubmission/suspend/history endpoints.

## Special implementation rules

- Structured controls, not messaging.
- No arbitrary free-text communication.
- Minimise identity evidence.

---

# 34. FACE ENROLMENT REVIEW

## Purpose

Review temporary encrypted enrolment captures and quality/risk metadata under strict privacy controls.

## Primary list or overview

- Student.
- Submitted time.
- Consent version/status.
- Quality.
- Duplicate/match risk where permitted.
- Review state.
- Image expiry.

## Filters and search

- Programme/Section.
- Review status.
- Risk.
- Consent.
- Date.

## Actions

- Open protected review.
- Approve.
- Reject with predefined reason.
- Request re-enrolment.
- Revoke under policy.
- View history.

## Create/edit form

- Decision.
- Reason code.
- Restricted remark.
- Step-up for reset/revocation.

## Detail view

- Consent.
- Protected expiring capture.
- Quality indicators.
- Enrolment metadata.
- Prior reviews.
- Retention timeline.
- Audit.

## States and edge cases

- Signed URL expired.
- Capture deleted by retention.
- Consent missing/revoked.
- Concurrent decision.
- Image denied.
- Risk unavailable.

## Permission behaviour

- Biometric-review permission.
- No Teacher access.
- Ordinary Attendance Admin excluded unless granted.
- Reveal/action auditable.

## Phase 1 API integration

- Protected image, review, re-enrol/revoke, consent, and history endpoints.

## Special implementation rules

- Never show/download embeddings.
- No image download/open/copy URL.
- Blur until deliberate reveal.
- Clear from DOM/cache where practical.
- No analytics/error capture.

---

# 35. COURSE AUTHORISATIONS PAGE

## Purpose

Issue and govern scoped one-time codes allowing an assigned Teacher to create an attendance Course Offering.

## Primary list or overview

- Teacher.
- Assignment.
- Subject Offering.
- Section.
- Status.
- Expiry.
- Uses.
- Creator/time.

## Filters and search

- Teacher.
- Department.
- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Subject.
- Status.
- Expiry.

## Actions

- Generate.
- Deliver via verified email.
- Reveal once.
- Copy once.
- Revoke.
- Regenerate.
- Extend if permitted.
- View usage/failed attempts.

## Create/edit form

- Eligible Assignment.
- Expiry duration.
- Policy-constrained max uses.
- Optional delivery action.

## Detail view

- Bound scope.
- Status timeline.
- Usage.
- Failed validations.
- Audit.

## States and edge cases

- Inactive assignment.
- Existing valid code.
- Expiry race.
- Concurrent generation.
- Clipboard failure.
- Delivery failure.

## Permission behaviour

- Authorisation-manage permission.
- Plaintext only to generating authorised Admin in immediate response.
- Auditor never sees plaintext.

## Phase 1 API integration

- Generate/deliver/revoke/regenerate/extend/detail/history/failed-attempt endpoints.

## Special implementation rules

- Use OneTimeSecretReveal.
- Never put plaintext in query cache, state store, logs, URL, analytics, or page source.
- After close it is unrecoverable.
- Regenerate instead of re-showing.

---

# 36. COURSE OFFERINGS PAGE

## Purpose

Manage attendance containers created from Subject Offerings, Assignments, Sections, and Authorisations.

## Primary list or overview

- Display name.
- Subject/code.
- Primary/co-Teachers.
- Programme/Batch/Semester/Section.
- Enrolled count.
- Registration lock.
- Dates.
- Status.

## Filters and search

- Department.
- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Teacher.
- Subject.
- Status.
- Approval.

## Actions

- View.
- Approve/reject.
- Suspend/reactivate.
- Archive.
- Change primary Teacher audibly.
- Manage authorised co-Teachers.
- Lock/unlock registration.
- Open roster/schedule/attendance/history.

## Create/edit form

- Only backend-permitted administrative metadata and state.

## Detail view

- Overview.
- Lineage.
- Teachers.
- Roster.
- Schedule.
- Attendance summary.
- Authorisation history.
- Audit.

## States and edge cases

- Inactive Teacher.
- Section mismatch.
- Capacity.
- Historical attendance locks lineage.
- Approval conflict.

## Permission behaviour

- Course-manage permission.
- Department scope.
- Auditor read-only.

## Phase 1 API integration

- Course list/detail/approve/reject/suspend/reactivate/archive/change Teacher/co-Teacher/lock endpoints.

## Special implementation rules

- No Stream, Classwork, Materials, Assignments, Discussions, Messages, People, announcement count, material count, or folders.
- Course is attendance-only.

---

# 37. COURSE REGISTRATIONS PAGE

## Purpose

Manage Student enrolment through automatic compulsory rules, Admin-controlled additions, or approved elective requests.

## Primary list or overview

- Student/roll.
- Course/Subject.
- Section.
- Method.
- Approval.
- Registration date.
- Withdrawal state.

## Filters and search

- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Course.
- Method.
- Status.
- Student search.

## Actions

- Run auto-enrolment.
- Add eligible Student.
- Approve/reject elective.
- Withdraw with reason.
- Export roster.
- Open details.

## Create/edit form

- Course.
- Eligible Student.
- Method/reason.
- Effective date if supported.

## Detail view

- Eligibility.
- Capacity.
- History.
- Attendance implications.
- Audit.

## States and edge cases

- Duplicate.
- Cross-programme/semester.
- Inactive Course.
- Registration closed.
- Capacity.
- Inactive Student.
- Attendance history.

## Permission behaviour

- Registration permission.
- Teacher recommendation is not final Admin authority.
- Department scope.

## Phase 1 API integration

- Auto-enrol/add/approve/reject/withdraw/eligibility/roster endpoints.

## Special implementation rules

- Use pre-check when available.
- No arbitrary invitation or join-code flow.

---

# 38. TIMETABLES PAGE

## Purpose

Manage recurring Timetable Rules that generate future Scheduled Classes without rewriting history.

## Primary list or overview

- Course.
- Teacher.
- Section.
- Day/time.
- Room.
- Type.
- Attendance method.
- Effective dates.
- Status.

## Filters and search

- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Teacher.
- Room.
- Day.
- Status.

## Actions

- Create.
- Conflict pre-check.
- View.
- Edit future rule.
- Activate/deactivate.
- Generate classes.
- Regenerate unaffected future classes.
- View history.

## Create/edit form

- Course.
- Teacher.
- Day.
- Start/end.
- Room or online mode.
- Type.
- Effective range.
- Recurrence.
- Default attendance method.

## Detail view

- Calendar preview.
- Generated future classes.
- Conflicts.
- Rule versions.
- Audit.

## States and edge cases

- Teacher/Section/Room/Holiday conflict.
- Outside Course dates.
- Completed history lock.
- Version conflict.

## Permission behaviour

- Timetable permission.
- Department scope.
- Auditor read-only.

## Phase 1 API integration

- Timetable CRUD/conflict/generation/regeneration/history endpoints.

## Special implementation rules

- Conflicts are explicit and blocking when backend says so.
- Never silently change room/time.
- Use College timezone.

---

# 39. SCHEDULED CLASSES PAGE

## Purpose

Inspect individual class instances generated by Timetable Rules or approved extra/replacement requests.

## Primary list or overview

- Date/time.
- Course.
- Teacher.
- Section.
- Room.
- Type.
- Status.
- Attendance Session status.
- Change origin.

## Filters and search

- Date range.
- Programme.
- Batch.
- Semester.
- Section.
- Teacher.
- Course.
- Room.
- Class/attendance status.

## Actions

- View.
- Approve controlled change where supported.
- Open Attendance Session.
- Open history.

## Create/edit form

- Direct create only for authorised extra/replacement flow if backend supports; otherwise Class Change Request.

## Detail view

- Metadata.
- Timetable origin.
- Change history.
- Attendance Session/summary.
- Audit.

## States and edge cases

- Holiday conflict.
- Completed attendance lock.
- Concurrent change.
- Already cancelled.
- Replacement conflict.

## Permission behaviour

- Scheduling permission.
- Attendance Admin read-only plus attendance link.
- Auditor read-only.

## Phase 1 API integration

- Scheduled-Class list/detail/transition endpoints.

## Special implementation rules

- Never rewrite completed history.
- Show source of every change.

---

# 40. ACADEMIC CALENDAR PAGE

## Purpose

Provide a unified operational calendar for attendance-relevant classes, Holidays, exams, breaks, Special Working Days, and approved changes.

## Primary list or overview

- Month/week/day/agenda views.
- Event title/type.
- Scope.
- Date/time.
- Status.
- Attendance effect.

## Filters and search

- College.
- Department.
- Programme.
- Session.
- Batch.
- Section.
- Event type.
- Date range.

## Actions

- Create permitted Calendar Event.
- Open.
- Edit future.
- Cancel/archive.
- Navigate to related record.

## Create/edit form

- Type.
- Name.
- Date/end.
- Scope lineage.
- Recurring flag if supported.
- Structured attendance effect.

## Detail view

- Event details.
- Scope.
- Attendance effect.
- Affected classes.
- Audit.

## States and edge cases

- Overlap/contradiction.
- Holiday vs Special Working Day.
- Existing attendance impact.
- Timezone boundary.

## Permission behaviour

- Calendar permission.
- Scoped read.

## Phase 1 API integration

- Calendar CRUD/impact endpoints.

## Special implementation rules

- Calendar is not an announcement/social feed.
- No custom broadcast body.

---

# 41. HOLIDAYS PAGE

## Purpose

Manage official Holidays, vacations, exam breaks, emergency closures, and Special Working Days.

## Primary list or overview

- Name.
- Date range.
- Type.
- Scope.
- Recurring.
- Status.
- Attendance effect.

## Filters and search

- Type.
- Scope.
- Session.
- Date range.
- Status.
- Search.

## Actions

- Create.
- View.
- Edit future.
- Activate/cancel.
- Declare Special Working Day.
- View affected classes.

## Create/edit form

- Name.
- Date/end.
- Type.
- Applicable lineage.
- Recurring.
- Status.

## Detail view

- Attendance effect.
- Affected classes.
- Special Working Day conversion.
- Audit.

## States and edge cases

- Holiday conflict.
- Completed attendance exists.
- Scope mismatch.
- Recurring edge case.

## Permission behaviour

- Holiday permission.
- Department scope.

## Phase 1 API integration

- Holiday/Calendar endpoints and affected-class lookup.

## Special implementation rules

- Display Holiday H and Cancelled Class C distinctly.
- Explain H never reduces percentage.

---

# 42. CLASS CHANGE REQUESTS PAGE

## Purpose

Review structured requests for cancellation, rescheduling, extra, or replacement classes.

## Primary list or overview

- Type.
- Original class.
- Requested date/time/room.
- Teacher.
- Reason code.
- Conflict summary.
- Submitted.
- Status.

## Filters and search

- Type.
- Teacher.
- Programme/Section.
- Status.
- Date range.
- Conflict state.

## Actions

- Open.
- Re-run conflict.
- Approve.
- Reject.
- Return for structured correction if supported.
- Open resulting class.

## Create/edit form

- Decision.
- Reason code.
- Restricted Admin remark.
- Step-up if required.

## Detail view

- Original/proposed class.
- Conflicts.
- Affected Student count.
- Attendance effect.
- History.
- Audit.

## States and edge cases

- Original completed.
- New conflict.
- Holiday.
- Duplicate.
- Concurrent decision.

## Permission behaviour

- Scheduling approval permission.
- Auditor read-only.

## Phase 1 API integration

- Class change list/detail/approve/reject/conflict endpoints.

## Special implementation rules

- No broadcast message; state change triggers backend Alert.

---

# 43. ATTENDANCE POLICIES PAGE

## Purpose

Configure versioned College or scoped attendance rules while preserving historical calculation behaviour.

## Primary list or overview

- Policy/version.
- Scope.
- Minimum percentage.
- Methods.
- QR duration/rotation.
- Face/liveness.
- Late/Excused policy.
- Effective dates.
- Status.

## Filters and search

- College.
- Department/Programme scope.
- Status.
- Effective date.

## Actions

- Create version.
- View.
- Edit Draft.
- Activate future policy.
- Retire.
- Compare versions.

## Create/edit form

- Scope.
- Minimum and Safe/Warning/Critical thresholds.
- Methods.
- Windows.
- QR settings.
- Face threshold metadata.
- Liveness.
- Manual attendance.
- Correction deadline.
- Late/Excused rules.
- Effective dates.

## Detail view

- Summary.
- Affected scope.
- Version diff.
- Historical usage.
- Audit.

## States and edge cases

- Overlapping policies.
- Threshold order invalid.
- Historical edit blocked.
- Unsupported method combination.

## Permission behaviour

- Policy/settings permission.
- Step-up for activation if configured.
- Auditor read-only.

## Phase 1 API integration

- Attendance Policy CRUD/version/activation endpoints.

## Special implementation rules

- Never recalculate history in browser.
- Policy preview is explanatory; backend authoritative.

---

# 44. ATTENDANCE OVERVIEW AND LIVE SESSIONS

## Purpose

Monitor current and recent Attendance Sessions across authorised scope without interfering with Teacher operation.

## Primary list or overview

- Course/Scheduled Class.
- Teacher.
- Section.
- Start/close.
- Method.
- Enrolled/Present/Absent/Pending counts.
- Failed/suspicious counts.
- Status.

## Filters and search

- Live/recent.
- Date.
- Department.
- Programme.
- Session.
- Batch.
- Semester.
- Section.
- Teacher.
- Course.
- Method.
- Status.

## Actions

- Open live detail.
- Refresh.
- Open records.
- Open restricted attempts.
- Open Security Event.
- Approved emergency action if backend supports.

## Create/edit form

- No ordinary create/edit form for Teacher-run Sessions.

## Detail view

- Timing/countdown.
- Dynamic counts.
- Verification breakdown.
- Timeline.
- Related class/Teacher.
- Roster summary.
- Security flags.
- Audit.

## States and edge cases

- Session closes while viewing.
- Reconnect.
- Partial summary failure.
- Teacher pause/extend.
- High volume.
- Out-of-scope.

## Permission behaviour

- Attendance-read permission.
- Attempts need stronger permission.
- Auditor data redacted.

## Phase 1 API integration

- Session list/detail/live-summary/record endpoints.
- Supported realtime or bounded polling.

## Special implementation rules

- Never validate QR/faces here.
- Never show live QR token.
- Never expose embeddings.
- Pause polling when hidden.

---

# 45. ATTENDANCE RECORDS PAGE

## Purpose

Inspect authoritative class-wise Attendance Records and navigate to controlled correction workflows.

## Primary list or overview

- Date/time.
- Student/roll.
- Course.
- Teacher.
- Status.
- Verification summary.
- Marked time.
- Correction state.

## Filters and search

- Date range.
- Student/roll.
- Academic lineage.
- Teacher.
- Course/Subject.
- Status.
- Method.
- Correction status.

## Actions

- View.
- Open Session.
- Open correction history.
- Create emergency manual request if permitted.
- Generate scoped export.

## Create/edit form

- No direct status editor.

## Detail view

- Scheduled Class.
- Session.
- Status.
- Verification summary.
- Server timestamp.
- Policy snapshot.
- Correction timeline.
- Audit.

## States and edge cases

- Pending Review.
- No record before close.
- Historical lock.
- Correction in progress.
- Role redaction.

## Permission behaviour

- Attendance-read permission.
- No direct overwrite.
- Security details restricted.

## Phase 1 API integration

- Attendance record list/detail/relationships/export endpoints.

## Special implementation rules

- Central status mapping.
- Explain Holiday/Cancelled/NA exclusion.
- No editable status dropdown.

---

# 46. ATTENDANCE ATTEMPTS PAGE

## Purpose

Inspect failed, duplicate, expired QR, face/liveness, and device-risk attempts. Attempts are not official attendance records.

## Primary list or overview

- Timestamp.
- Student/account reference.
- Session.
- Attempt/result.
- QR.
- Face/liveness.
- Device-risk summary.
- Restricted IP/location.
- Linked Security Event.

## Filters and search

- Date range.
- Attempt type/result.
- Course/Section.
- Student.
- Risk.
- Linked-event status.

## Actions

- View restricted detail.
- Open related records.
- Create review flag if supported.
- Restricted export.

## Create/edit form

- No create/edit form.

## Detail view

- Structured technical evidence.
- No raw biometric image/embedding.
- Risk rationale.
- Related official record.
- Access Audit if supplied.

## States and edge cases

- Retention expiry.
- Redaction.
- High volume.
- Unauthenticated attempt.
- Out-of-scope.

## Permission behaviour

- Dedicated attempt/security permission.
- Auditor redaction.
- Academic Admin may lack device detail.

## Phase 1 API integration

- Attempt list/detail and Security Event endpoints.

## Special implementation rules

- Use risk-review language, not automatic guilt.
- Device signal is never sole proof.
- No analytics payload.

---

# 47. MANUAL ATTENDANCE REQUESTS PAGE

## Purpose

Govern exceptional manual attendance when normal verification fails. Every action must be reasoned, approved, and audited.

## Primary list or overview

- Student.
- Class/Session.
- Current/requested state.
- Requester.
- Structured reason.
- Failure reference.
- Submitted.
- Status.

## Filters and search

- Status.
- Date range.
- Programme/Section.
- Requester.
- Reason.
- Student.

## Actions

- Open.
- Approve.
- Reject.
- View logs/reference.
- Open resulting record.

## Create/edit form

- Decision.
- Reason.
- Admin remark.
- Step-up when required.

## Detail view

- Original Session.
- Failure references.
- Student eligibility.
- Requester.
- History.
- Audit.

## States and edge cases

- Ineligible Session.
- Student not enrolled.
- Duplicate.
- Existing final correction.
- Deadline.
- Concurrent decision.

## Permission behaviour

- Approve permission distinct from request permission.
- Auditor read-only.

## Phase 1 API integration

- Manual request list/detail/approve/reject endpoints.

## Special implementation rules

- No direct record PATCH.
- No supporting document.
- Show exceptional and permanent Audit effect.

---

# 48. ATTENDANCE CORRECTIONS PAGE

## Purpose

Provide final Admin review of structured Student/Teacher correction requests with complete immutable history.

## Primary list or overview

- Student/roll.
- Course/Class.
- Current/requested status.
- Reason.
- Teacher recommendation.
- Submitted/deadline.
- Workflow status.

## Filters and search

- Workflow status.
- Date range.
- Programme/Section.
- Teacher.
- Student.
- Reason.
- Status transition.
- Overdue.

## Actions

- Open.
- Move to Admin review.
- Approve.
- Reject.
- Return for structured clarification.
- Reverse through stronger workflow.
- Close.
- Export Audit report.

## Create/edit form

- Decision.
- Predefined reason.
- Admin remark.
- Step-up if required.
- Concurrency version.

## Detail view

- Before/after preview.
- Student reason.
- Teacher recommendation.
- Verification logs/reference IDs.
- Correction Event timeline.
- Policy/deadline.
- Audit.

## States and edge cases

- Deadline.
- Invalid transition.
- Record changed.
- Concurrent action.
- Already reversed.
- Evidence retention expiry.
- More-info without chat.

## Permission behaviour

- Correction-review permission.
- Reversal stronger.
- Auditor read-only.

## Phase 1 API integration

- Correction queue/detail/transitions/approve/reject/clarification/reversal/close/export endpoints.

## Special implementation rules

- No file upload/viewer.
- More information is structured state, not conversation.
- No silent overwrite.

---

# 49. ATTENDANCE SHEETS PAGE

## Purpose

Render official attendance matrices by Student and class date with correct statuses and authorised asynchronous export.

## Primary list or overview

- Rows = Students.
- Columns = actual Scheduled Class dates/instances.
- Totals = Present, Conducted, percentage.
- Status legend.

## Filters and search

- Academic lineage.
- Course/Subject.
- Teacher.
- Month/date range.
- Status group.

## Actions

- Load matrix.
- Open Student/record.
- Generate CSV/XLSX/PDF.
- Print authorised view.
- Open export job.

## Create/edit form

- No direct cell editing.

## Detail view

- Matrix.
- Formula explanation.
- Policy snapshot.
- Generated time.
- Completeness warning.
- Related corrections.

## States and edge cases

- 28/29/30/31 days.
- Multiple classes/day.
- Mid-month NA.
- Holiday H.
- Cancelled C.
- Pending P.
- Large matrix.
- Export processing.

## Permission behaviour

- Report permission.
- Sensitive export separate.
- Scope enforced.

## Phase 1 API integration

- Attendance sheet and report/export endpoints.

## Special implementation rules

- Do not assume one class per date or fixed 31 columns.
- Virtualise and use sticky identity columns.
- Provide accessible alternative.

---

# 50. REPORTS AND ANALYTICS PAGE

## Purpose

Provide role-scoped analytics and official reports without calculating authoritative attendance totals in the browser.

## Primary list or overview

- Report catalogue.
- Recent jobs.
- Cards/charts by Student, Teacher, Course, Section, Department, Programme, College.

## Filters and search

- Scope.
- Date range.
- Report type/status.
- Risk threshold.
- Teacher/Student/Course.

## Actions

- Run report.
- Save safe preset if supported.
- Open job.
- Signed download.
- Retry failure.
- Cancel queued if supported.

## Create/edit form

- Report type.
- Scope.
- Filters.
- Format.
- Grouping.
- Sensitive-export acknowledgement/step-up.

## Detail view

- Job metadata.
- Parameters.
- Row count.
- Creator.
- Expiry.
- Download history.
- Audit link.

## States and edge cases

- Async large job.
- Expired URL.
- No data.
- Partial source data.
- Denied.
- Failed.
- Purged.

## Permission behaviour

- Report permission.
- Sensitive export permission.
- Scope.
- Auditor limits.

## Phase 1 API integration

- Student/Teacher/Course/Department/Programme/College report and export job endpoints.

## Special implementation rules

- Charts need text/table alternatives.
- Never invent metrics or verification-accuracy claims.

---

# 51. SYSTEM ALERTS PAGE

## Purpose

Inspect structured backend-generated operational Alerts. Admin may never compose arbitrary Alert content.

## Primary list or overview

- Type.
- Priority.
- Recipient/scope.
- Related entity.
- Created.
- Delivery.
- Read state.

## Filters and search

- Type.
- Priority.
- Recipient.
- Scope.
- Date range.
- Read/delivery state.

## Actions

- Mark own Alert read/unread if supported.
- Open related record.
- Inspect delivery failure.
- Requeue failed delivery if authorised.

## Create/edit form

- No create/compose form.

## Detail view

- Structured payload rendered through safe templates.
- Entity links.
- Delivery attempts.
- Audit metadata.

## States and edge cases

- Unknown future type.
- Related entity archived.
- Delivery failure.
- Template mismatch.

## Permission behaviour

- Alert-read and delivery-requeue permissions.
- No broadcast permission exists.

## Phase 1 API integration

- Alert list/detail/read/delivery/requeue endpoints.

## Special implementation rules

- No body/message editor.
- No reply/comment.
- Unknown types get safe generic structured rendering.

---

# 52. SECURITY CENTRE

## Purpose

Provide a high-trust workspace for authentication, device, QR, face/liveness, course-code, export, and account security events.

## Primary list or overview

- Open events/severity.
- Failed login trend.
- Locked accounts.
- Active sessions.
- Blocked devices.
- QR/face/code/export risks.

## Filters and search

- Severity.
- Type.
- Status.
- Subject.
- Scope.
- Date.
- Resolver.

## Actions

- Open.
- Resolve/reopen.
- Lock/unlock account.
- Force password reset.
- Revoke sessions.
- Block/unblock device.
- Approved face reset.
- Disable attendance access if supported.

## Create/edit form

- Structured resolution reason.
- Restricted remark.
- Step-up for high risk.

## Detail view

- Evidence summary.
- Timeline.
- Subject.
- Devices/sessions/attempts.
- Actions.
- Audit.

## States and edge cases

- Redaction.
- Subject inactive.
- Concurrent response.
- Expired session.
- Shared device false positive.

## Permission behaviour

- Security manage permission.
- Separate read/action.
- Auditor read-only/redacted.
- Biometric reset restricted.

## Phase 1 API integration

- Security dashboard/account/session/device/event endpoints.

## Special implementation rules

- Use neutral risk language.
- Never show tokens, full fingerprints, embeddings, or raw sensitive payload.
- High-risk actions require consequences and reason.

---

# 53. AUDIT LOGS PAGE

## Purpose

Provide immutable read-only visibility into sensitive changes and access events.

## Primary list or overview

- Timestamp.
- Actor/role.
- Action.
- Target.
- Result.
- Scope.
- Request ID.

## Filters and search

- Date.
- Actor.
- Role.
- Action category.
- Target type/ID.
- Result.
- Scope.

## Actions

- Open detail.
- Navigate to authorised actor/target.
- Restricted export.

## Create/edit form

- No create/edit/delete form.

## Detail view

- Redacted old/new diff.
- Reason.
- Restricted IP/device summary.
- Request ID.
- Related event.

## States and edge cases

- Archived target.
- Deactivated actor.
- Large values.
- Redaction.
- High volume.

## Permission behaviour

- Audit-read permission.
- Export separate.
- No mutations for any role.

## Phase 1 API integration

- Audit list/detail/target/actor/export endpoints.

## Special implementation rules

- Never edit/delete.
- Render diffs safely.
- Redact passwords, tokens, hashes, embeddings, OTPs, secrets even if backend violates contract.

---

# 54. IMPORTS PAGE

## Purpose

Provide a central secure import centre for Students, Teachers, Subjects, Offerings, structures, mappings, timetables, and Holidays.

## Primary list or overview

- Job reference.
- Entity/file.
- Initiator.
- Scope.
- Status.
- Valid/invalid.
- Times.
- Expiry.

## Filters and search

- Entity.
- Status.
- Initiator.
- Date.
- Scope.

## Actions

- Start.
- Upload.
- Preview.
- Commit.
- Cancel/reject.
- Download validation report.
- Retry worker.

## Create/edit form

- Entity.
- Target scope.
- File.
- Commit policy if supported.

## Detail view

- Row validation.
- Error counts.
- Commit result.
- Audit.
- Retention.

## States and edge cases

- Malformed/MIME/virus.
- Unknown references.
- Duplicates.
- Version conflict.
- Worker failure.
- Quarantine expiry.

## Permission behaviour

- Entity-specific import permission.
- Scope.
- Sensitive data.

## Phase 1 API integration

- Import upload/job/preview/commit/cancel/report endpoints.

## Special implementation rules

- Use reusable ImportWizard.
- Avoid loading giant files into memory.
- Backend parsing authoritative.

---

# 55. EXPORTS PAGE

## Purpose

Provide central visibility into generated export/report jobs and secure downloads.

## Primary list or overview

- Job reference.
- Report/entity.
- Scope.
- Format.
- Initiator.
- Status.
- Rows.
- Times.
- Expiry.

## Filters and search

- Type.
- Status.
- Format.
- Initiator.
- Date.
- Scope.

## Actions

- Open.
- Download while valid.
- Retry.
- Cancel queued if supported.
- Revoke if supported.

## Create/edit form

- No general create form outside report flows unless API supplies catalogue.

## Detail view

- Parameters.
- Audit.
- Signed URL expiry.
- Download history.
- Failure.

## States and edge cases

- Expired URL.
- Purged job.
- Permission revoked.
- Processing.
- Failure.

## Permission behaviour

- Export-read.
- Sensitive download rechecked.
- Auditor limits.

## Phase 1 API integration

- Export job list/detail/retry/cancel/signed-download endpoints.

## Special implementation rules

- No permanent storage URL.
- No file content in app state.
- Show expiry/sensitivity.

---

# 56. SYSTEM SETTINGS PAGE

## Purpose

Manage typed, permission-controlled configuration. Settings are data, not frontend constants.

## Primary list or overview

- Attendance, Authentication, Course, Data/Retention, Alert Templates, and College-default groups.

## Filters and search

- Scope and setting group.

## Actions

- View.
- Edit authorised group.
- Compare changes.
- Save with step-up if required.
- View history.

## Create/edit form

- Thresholds.
- QR.
- Face/liveness.
- Manual attendance.
- Correction deadline.
- OTP/password/lockout/session.
- Retention.
- Course approval.
- Capacity.
- Late/Excused.

## Detail view

- Current value.
- Effective scope.
- Inheritance.
- Constraints.
- History.
- Impact.

## States and edge cases

- Threshold invalid.
- Out of range.
- Inherited read-only.
- Version conflict.
- Active Session impact.

## Permission behaviour

- Settings permission.
- Some Super Admin only.
- Auditor read-only.

## Phase 1 API integration

- Typed Settings GET/PATCH/history endpoints.

## Special implementation rules

- Dedicated forms, never unrestricted key-value editor.
- Show units/consequences.
- Backend authoritative.

---

# 57. ADMIN MANAGEMENT PAGE

## Purpose

Manage Admin accounts, role assignments, scopes, MFA state, and lifecycle under separation of duties.

## Primary list or overview

- Name/email.
- Roles.
- Scopes.
- Status.
- MFA.
- Last login.

## Filters and search

- Role.
- Status.
- MFA.
- Scope.
- Search.

## Actions

- Create/pre-authorise.
- Assign/remove scope.
- Invite.
- Suspend/reactivate/deactivate.
- Force reset.
- Revoke sessions.
- Require MFA.
- Security summary.

## Create/edit form

- Name.
- Official email.
- Roles if supported.
- Exact scopes.
- Status.
- MFA requirement.

## Detail view

- Identity.
- Role/scope.
- Sessions.
- Security.
- Audit.

## States and edge cases

- Last Super Admin.
- Self-lockout.
- Cross-tenant assignment.
- Duplicate email.
- Concurrent update.
- MFA conflict.

## Permission behaviour

- Admin-manage permission.
- Privilege ceiling enforced.
- No user grants more than allowed.

## Phase 1 API integration

- Admin CRUD/state/role/scope/session endpoints.

## Special implementation rules

- Show exact privilege summary before save.
- Step-up high-risk changes.
- Never show password/recovery secrets.

---

# 58. SYSTEM STATUS PAGE

## Purpose

Display real operational health and backup/queue/storage status supplied by backend or infrastructure integration.

## Primary list or overview

- API/DB/Redis/queue/storage.
- Last backup.
- Migration/app version.
- Recent incidents if supplied.

## Filters and search

- Environment/component/status.

## Actions

- Refresh.
- Open failure detail.
- Controlled restore request if supported.
- Open runbook.

## Create/edit form

- No arbitrary mutation without controlled API.

## Detail view

- Component status.
- Checked time.
- Latency.
- Redacted failure.
- Reference.

## States and edge cases

- Unavailable.
- Partial failure.
- Stale status.
- Permission restriction.

## Permission behaviour

- Operational-read or Super Admin.
- Restore restricted.

## Phase 1 API integration

- Health/system-status/backup endpoints if available.

## Special implementation rules

- Never call unrestricted metrics directly.
- Never fake backup success.
- Clearly mark unknown/stale.

---

# 59. HELP AND SUPPORT PAGE

## Purpose

Provide product guidance and structured operational help without an internal chat or messaging system.

## Primary list or overview

- Searchable help topics.
- Role guides.
- Status legend.
- Correction guide.
- Import guide.
- Privacy/retention.
- Configured support contact.

## Filters and search

- Topic/category.

## Actions

- Open guide.
- Copy request ID.
- Download approved diagnostics if supported.
- Use configured external contact.

## Create/edit form

- No internal message/ticket conversation.

## Detail view

- Guide content/version.
- Related routes.

## States and edge cases

- Unavailable content.
- Role cannot access linked feature.

## Permission behaviour

- All authenticated Admins may read relevant help.

## Phase 1 API integration

- Static content or backend-configured support metadata.

## Special implementation rules

- No inbox, chat, comments, replies, or arbitrary messaging.

---

# 60. INITIAL INSTITUTION SETUP WIZARD

Provide an optional guided setup experience for a new authorised College. It orchestrates existing real entity forms and APIs; it does not create a duplicate data model.

## 60.1 Steps

1. Organisation and College.
2. Campus.
3. Department.
4. Programme.
5. Curriculum Version.
6. Academic Session.
7. Batch/Cohort.
8. Academic Year and Semester.
9. Section and Room setup.
10. Subjects and Subject Offerings.
11. Attendance Policy.
12. Teachers and Teacher Assignments.
13. Students or import.
14. Timetable and Holidays.
15. Course Authorisations and Course readiness.
16. Readiness review.

## 60.2 Wizard rules

- Save each completed entity through its real Phase 1 API.
- Allow exit and resume using backend state.
- Do not create one giant client-side transaction.
- Show prerequisites and blockers.
- Show required permissions per step.
- Readiness checks may identify missing configuration but must not invent backend validation.
- Do not hardcode PWC or MCA.
- Initial setup completion does not lock future edits.

---

# 61. COMPLETE ADMIN WORKFLOW SEQUENCES

## 61.1 Teacher onboarding and course readiness

1. Admin pre-authorises Teacher.
2. Backend creates invitation state and queues verified-email delivery.
3. Admin sees status and may resend under policy.
4. Teacher completes external registration.
5. Admin reviews Pending Approval and approves or rejects.
6. Admin creates Teacher Assignment using exact Subject Offering and Section.
7. Admin generates Course Authorisation.
8. One-time code is copied or delivered once.
9. Phase 3 Teacher creates Course Offering.
10. Admin approves Course Offering when policy requires.
11. Backend auto-enrols or queues eligible Students.

## 61.2 Student onboarding

1. Admin creates or imports authorised Student records.
2. Import preview is reviewed and committed.
3. Student registers outside Admin frontend.
4. Verification and face-enrolment queues update.
5. Admin reviews minimum identity evidence and temporary face capture.
6. Admin approves, rejects, or requests structured re-enrolment.
7. Approved Student becomes active.
8. Compulsory registrations are created by backend rules.
9. Admin verifies correct Section and rosters.

## 61.3 Timetable to attendance readiness

1. Admin creates Rooms.
2. Admin creates Timetable Rule for active Course Offering.
3. Frontend requests conflict pre-check.
4. Admin resolves Teacher, Section, Room, or Holiday conflicts.
5. Backend generates future Scheduled Classes.
6. Admin reviews Calendar and Holidays.
7. Class Change Requests are approved or rejected.
8. Teacher starts Attendance Session in Phase 3.
9. Admin monitors Session through live overview.

## 61.4 Correction decision

1. Student or Teacher submits structured correction outside Admin frontend.
2. Teacher recommendation is recorded.
3. Admin queue shows request, deadline, status transition, and system evidence references.
4. Admin opens complete history and authoritative Attendance Record.
5. Admin approves, rejects, or returns for structured clarification.
6. Backend transaction updates record and appends Correction Event and Audit Log.
7. Frontend displays final state and generated Alerts.
8. Any undo uses stronger reversal workflow, never silent edit.

## 61.5 Security incident response

1. Backend raises Security Event.
2. Admin reviews structured risk evidence.
3. Admin opens related account, sessions, devices, attempts, or exports.
4. Admin selects authorised response.
5. High-risk action requires reason and step-up authentication.
6. Backend confirms mutation and writes Audit Log.
7. Admin resolves or reopens event with structured outcome.
8. Frontend shows complete incident timeline.

## 61.6 Report generation

1. Admin selects report type, scope, filters, and format.
2. Frontend validates required inputs.
3. Backend accepts asynchronous job.
4. Frontend tracks job using supported polling/event channel.
5. Completed job exposes short-lived signed download.
6. Download permission is rechecked.
7. Export history records actor, filters, row count, format, and expiry.
8. Expired links cannot download stale files.

---

# 62. LOADING, EMPTY, ERROR, AND CONFLICT STATES

## 62.1 Required states for every route

- Initial skeleton.
- Background refresh.
- True empty data.
- Filter-empty result.
- Missing prerequisite setup.
- Access denied or hidden route.
- Not found or out of scope.
- Offline.
- Timeout.
- Rate limited.
- Validation error.
- Business-rule conflict.
- Optimistic concurrency/version conflict.
- Partial dashboard failure.
- Signed URL expired.
- Background job pending or failed.
- Stale live data.
- Session expired.

## 62.2 Prerequisite-aware empty-state examples

- No Departments: explain College prerequisite and show Add Department only when authorised.
- No Teacher Assignments: explain active Teacher, Subject Offering, and Section prerequisites.
- No Course Authorisations: explain eligible active Assignment requirement.
- No Attendance Sessions: explain Sessions appear after Teacher starts attendance for a valid Scheduled Class.
- No Corrections: state no requests match current filters.
- No Audit Logs: display current scope and date filters.
- No System Alerts: explain Alerts are backend-generated and do not offer Compose.

## 62.3 Version conflict

- Never overwrite silently.
- Explain that another Admin or process changed the record.
- Offer reload current version.
- Preserve safe unsaved values for comparison.
- Allow resubmit only after review.
- Show backend request ID.

---

# 63. ACCESSIBILITY REQUIREMENTS

Target WCAG 2.2 AA on every production route. Accessibility is part of Definition of Done.

- Complete keyboard navigation for sidebar, menus, dialogs, tables, comboboxes, date pickers, tabs, charts, and matrices.
- Visible focus using semantic token.
- Logical heading hierarchy and landmarks.
- Programmatic labels and descriptions.
- Error summary linked to invalid fields.
- Dialog focus trap, initial focus, Escape, and focus restoration.
- Status never communicated by colour alone.
- Accessible contrast for text, icons, borders, charts, and statuses.
- Reduced motion.
- Live regions for async outcomes and job completion without noisy announcements.
- Accessible table captions, headers, and sort state.
- Chart text summary and table alternative.
- Attendance Matrix keyboard path and screen-reader alternative.
- Protected image review includes text evidence; image is not sole evidence.
- Appropriate touch targets.
- Functional at 200% zoom.
- Automated axe plus manual keyboard and screen-reader smoke tests.

---

# 64. RESPONSIVE BEHAVIOUR

## 64.1 Desktop

- Primary Admin workspace.
- Persistent sidebar.
- Dense tables and multi-column details.
- Scroll-safe or virtualised matrices.
- Side sheets and split review layouts.

## 64.2 Tablet

- Collapsible sidebar.
- Filter drawer where needed.
- Important table columns retained; secondary data moves into row detail.
- Approvals and monitoring remain fully functional.

## 64.3 Mobile

- Dashboard, Alerts, Security Events, approvals, live Attendance, and simple details remain usable.
- Use record cards rather than crushed tables.
- Do not hide critical data without detail action.
- Matrices may recommend desktop while still providing summary and record access.
- No accidental page overflow outside intentional grid containers.

---

# 65. PERFORMANCE AND DATA-VOLUME REQUIREMENTS

- Server-side pagination for large lists.
- Virtualise large Attendance matrices and tables where needed.
- Use paginated search comboboxes rather than loading every Student or Teacher.
- Debounce search and cancel stale requests.
- Lazy-load charts, protected images, and secondary tabs.
- Code split per route/feature.
- Avoid waterfalls when aggregation endpoints exist.
- Prefetch only non-sensitive likely navigation.
- Do not retain thousands of records unnecessarily in client memory.
- Track bundle size and route performance.
- Pause live polling when hidden.
- 5,000-row import remains responsive because backend parses it.
- No client-side N+1 requests per table row.

---

# 66. FRONTEND SECURITY AND PRIVACY

## 66.1 Sensitive-data rules

- Never log passwords, OTPs, tokens, one-time codes, signed URLs, biometric data, face images, detailed device fingerprints, or internal correction remarks.
- Do not send sensitive fields to analytics, session replay, error monitoring, or breadcrumbs.
- Disable session replay on biometric and security routes by default.
- Redact API bodies in monitoring.
- Copy sensitive data only through explicit one-time code action.
- Clear one-time code from memory after dialog close.
- Do not persist protected face images through service worker, local storage, or public image optimisation.
- Do not expose permanent object-storage keys.
- Use noopener/noreferrer for external links.
- Use strict CSP and anti-clickjacking headers.
- Prefer plain text. Do not use dangerouslySetInnerHTML without approved sanitisation.

## 66.2 Data minimisation

- Show only fields needed for current task.
- Mask phone/email in broad tables when full value is unnecessary.
- Put raw security evidence behind deliberate reveal and permission.
- Use protected image review only for identity approval.
- No classmate/social visibility.
- No Teacher access is built into this Admin app.
- Explain consent/retention without exposing embedding content.

---

# 67. INTERNATIONALISATION, TIMEZONE, AND FORMATTING

- Default language English.
- Architecture supports future Hindi with message keys and parameters.
- Use College timezone for schedules and attendance display.
- Show timezone near scheduling forms.
- Use locale-aware dates/numbers.
- Use backend percentage precision.
- Use tabular numerals for matrices and metrics.
- Never parse dates with browser-locale assumptions.
- Load working days from settings; do not infer weekends.

---

# 68. TESTING STRATEGY

## 68.1 Unit tests

- Permission utilities and role navigation.
- Status-display mapping.
- API error normalisation.
- Query-key factories.
- Filter URL serialisation.
- Timezone formatting.
- Attendance legend/explanation helpers.
- One-time code memory clearing.
- Sensitive redaction.
- Form schemas and conditional rules.

## 68.2 Component tests

- ServerDataTable pagination, sorting, keyboard behaviour.
- FilterBar URL sync.
- Async EntityCombobox.
- Confirmation, Reason, StepUp, and VersionConflict dialogs.
- OneTimeSecretReveal removed after close.
- ProtectedImageReview no-download and expiry.
- Import preview.
- Attendance Matrix statuses.
- Audit diff redaction.
- Accessible chart summary.
- Empty/error states.

## 68.3 Integration tests

- Login and auth bootstrap.
- 401 refresh and forced logout.
- Permission-driven routes/actions.
- CRUD integrations.
- Conflict preserves form state.
- Version conflict.
- Import upload to commit.
- Report job to signed download.
- System Alerts read-only.
- Security action with step-up.
- Correct query invalidation.

## 68.4 End-to-end flows

1. Super Admin signs in with MFA and creates College lineage through Section.
2. College Admin creates Subject and Subject Offering.
3. Admin pre-authorises, approves, and assigns a Teacher.
4. Admin generates Course Authorisation and plaintext disappears after close.
5. Admin imports Students, reviews preview, commits, and approves a Student.
6. Admin reviews protected face capture and cannot download it or view embedding.
7. Admin creates Timetable, resolves conflict, and generates Scheduled Classes.
8. Admin monitors an Attendance Session and opens records.
9. Admin approves a Correction and sees immutable history.
10. Admin generates Attendance Sheet export and downloads through expiring URL.
11. Attendance Admin cannot mutate academic masters.
12. Department Admin cannot access another Department via URL or filters.
13. Auditor cannot mutate.
14. System Alerts has no composer.
15. No forbidden LMS route/component exists.

## 68.5 Accessibility and visual tests

- axe scan on every route template.
- Keyboard-only login, CRUD, import, approval, correction, and security flow.
- Focus restoration.
- Screen-reader async announcements.
- Chart alternatives.
- High-contrast, dark-mode, reduced-motion smoke tests.
- Visual regression for app shell, dashboard, table, form, protected review, matrix, Security Centre, tablet, and mobile.

## 68.6 Test data

Use deterministic test fixtures clearly marked as test data. MSW and test doubles must model actual Phase 1 envelopes and errors. Never ship test fixtures as production records.

---

# 69. ERROR-CODE UX MATRIX

| Error code | Frontend behaviour |
|---|---|
| `AUTH_INVALID_CREDENTIALS` | Keep login form, clear password, show generic invalid credentials. |
| `AUTH_ACCOUNT_LOCKED` | Show locked state and approved recovery. |
| `AUTH_ACCOUNT_NOT_ACTIVE` | Show account status and support path. |
| `AUTH_MFA_REQUIRED` | Move to MFA challenge. |
| `AUTH_REFRESH_TOKEN_REUSED` | Clear session and force secure sign-in. |
| `ACCESS_OUT_OF_SCOPE` | Show safe inaccessible state without leaking record. |
| `RESOURCE_NOT_FOUND` | Show Not Found and return action. |
| `TENANT_SCOPE_MISMATCH` | Treat as inaccessible and retain request ID. |
| `DUPLICATE_EMAIL` | Attach to email. |
| `DUPLICATE_EMPLOYEE_ID` | Attach to employee ID. |
| `DUPLICATE_ROLL_NUMBER` | Attach to roll/import row. |
| `INVALID_ACADEMIC_LINEAGE` | Show lineage summary and require reselection. |
| `SECTION_CAPACITY_EXCEEDED` | Show capacity/current count and block. |
| `TEACHER_NOT_ACTIVE` | Show status and block dependent action. |
| `TEACHER_NOT_ASSIGNED` | Show Assignment prerequisite. |
| `ASSIGNMENT_CONFLICT` | Show authorised conflict details. |
| `COURSE_AUTHORISATION_INVALID` | Show invalid without exposing code. |
| `COURSE_AUTHORISATION_EXPIRED` | Offer regenerate if permitted. |
| `COURSE_AUTHORISATION_REVOKED` | Show revoked state and Audit. |
| `COURSE_AUTHORISATION_ALREADY_USED` | Show used state; never reveal old code. |
| `COURSE_OFFERING_ALREADY_EXISTS` | Link existing Course if authorised. |
| `TIMETABLE_TEACHER_CONFLICT` | Highlight Teacher/time and conflict. |
| `TIMETABLE_SECTION_CONFLICT` | Highlight Section/time. |
| `TIMETABLE_ROOM_CONFLICT` | Highlight Room/time. |
| `TIMETABLE_HOLIDAY_CONFLICT` | Show Holiday and alternative workflow. |
| `ATTENDANCE_SESSION_NOT_ACTIVE` | Refresh Session state. |
| `ATTENDANCE_ALREADY_RECORDED` | Show existing record; do not create again. |
| `ATTENDANCE_RECORD_LOCKED` | Route to correction workflow. |
| `ATTENDANCE_CORRECTION_DEADLINE_EXPIRED` | Show policy deadline and special permission. |
| `ATTENDANCE_CORRECTION_INVALID_TRANSITION` | Refresh timeline. |
| `IMPORT_VALIDATION_FAILED` | Open row-level preview. |
| `EXPORT_NOT_AUTHORISED` | Block download and show permission denial. |
| `RATE_LIMITED` | Disable retry until allowed. |
| `VERSION_CONFLICT` | Open comparison/reload dialog. |

---

# 70. ANALYTICS AND TELEMETRY

- Collect only approved non-sensitive product-performance telemetry.
- Never collect names, emails, roll numbers, phone numbers, biometrics, attendance statuses, correction reasons, security evidence, one-time codes, signed URLs, or raw API bodies.
- Use route templates rather than entity IDs where possible.
- Disable or mask replay on sensitive routes.
- Record safe errors with request ID.
- Record Core Web Vitals and coarse API latency.
- Document telemetry fields and retention.
- Provide environment switch to disable analytics.

---

# 71. OFFLINE AND NETWORK BEHAVIOUR

- Admin app is never offline-authoritative.
- Show network state.
- Allow safe retry of reads.
- Never silently queue sensitive mutations.
- Do not cache protected API data through service worker by default.
- Preserve only non-sensitive unsaved form values in memory during brief outage.
- Never persist password, OTP, code, biometric data, or security remarks.
- Resume report tracking after reconnect.
- Live Session shows stale timestamp after disconnect.

---

# 72. ENVIRONMENT VARIABLES

```text
NEXT_PUBLIC_APP_NAME=FaceAttend
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ADMIN_BASE_PATH=/admin
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_MSW=false
NEXT_PUBLIC_SUPPORT_EMAIL=
NEXT_PUBLIC_BUILD_SHA=
INTERNAL_API_BASE_URL=http://backend:3001/api/v1
SESSION_COOKIE_NAME=
CSRF_COOKIE_NAME=
```

- Do not expose backend JWT secrets, S3 keys, SMTP credentials, database URLs, or private monitoring secrets.
- Validate environment at build/start.
- Production build fails clearly if required config is absent.
- MSW is disabled in production.

---

# 73. CI/CD AND QUALITY GATES

1. Install from lockfile.
2. Format check.
3. ESLint.
4. Strict TypeScript check.
5. Generated API client freshness.
6. Unit tests.
7. Component tests.
8. Accessibility tests.
9. Production build.
10. Bundle-size budget.
11. Dependency vulnerability audit.
12. Playwright smoke tests against test Phase 1 backend.
13. Optional critical visual regression.
14. Container build when applicable.

- Never deploy on failure.
- Never use production data in CI.
- Never print secrets or sensitive fixtures.
- Include build SHA and version metadata.

---

# 74. DEPLOYMENT AND PRODUCTION HEADERS

- Deploy under isolated Admin subdomain or /admin route.
- HTTPS only in staging/production.
- Strict CSP.
- HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, frame-ancestors, secure cookies.
- Restrict image sources to approved origins.
- Prevent arbitrary framing.
- Environment-specific API origin allowlist.
- Document rollback.
- Post-deploy smoke test: login, dashboard, authorised read, low-risk non-production mutation, report status, logout.

---

# 75. DOCUMENTATION DELIVERABLES

- [ ] README with setup, scripts, build, test, and run.
- [ ] docs/frontend-architecture.md.
- [ ] docs/design-system.md.
- [ ] docs/routes-and-permissions.md.
- [ ] docs/api-integration.md.
- [ ] docs/forms-and-tables.md.
- [ ] docs/security-and-privacy.md.
- [ ] docs/testing.md.
- [ ] docs/deployment.md.
- [ ] docs/feature-status.md mapping every route to implementation/tests.
- [ ] Generated API client instructions.
- [ ] Component catalogue or Storybook-like docs if included.

---

# 76. DEFINITION OF DONE

## 76.1 Foundation

- [ ] Next.js app uses strict TypeScript.
- [ ] Design tokens and accessible shared components exist.
- [ ] Shell, navigation, scope selector, breadcrumbs, theme, and responsive behaviour work.
- [ ] Typed Phase 1 client is integrated.
- [ ] No production mock server.
- [ ] Auth, MFA, refresh, logout, expiry, and protection work.

## 76.2 Permissions

- [ ] Navigation, routes, fields, and actions are permission/scope aware.
- [ ] Department Admin cannot cross Department.
- [ ] Attendance Admin cannot mutate masters.
- [ ] Auditor cannot mutate.
- [ ] High-risk actions use step-up when required.

## 76.3 Institutional setup

- [ ] Organisation through Subject Offering screens are complete.
- [ ] List/detail/create/edit/state workflows use real APIs.
- [ ] Cascading selectors enforce lineage.
- [ ] No institutional seed values are hardcoded.

## 76.4 People

- [ ] Teacher lifecycle and Assignment workflows complete.
- [ ] Student list/detail/lifecycle complete.
- [ ] Bulk import preview/commit complete.
- [ ] Student verification complete.
- [ ] Protected face review works without embedding exposure or download.

## 76.5 Courses and scheduling

- [ ] One-time Authorisation reveal is secure.
- [ ] Authorisation lifecycle/history complete.
- [ ] Course Offering/Registration complete.
- [ ] Timetable conflict flow complete.
- [ ] Scheduled Classes, Calendar, Holidays, and Change Requests complete.
- [ ] No LMS/course-content feature.

## 76.6 Attendance

- [ ] Attendance overview/live Session complete.
- [ ] Records and restricted Attempts complete.
- [ ] Manual Attendance review complete.
- [ ] Correction review/reversal complete.
- [ ] Attendance Sheets display correct statuses and date structures.
- [ ] Policy versioning UI complete.
- [ ] No direct record edit.

## 76.7 Trust, reports, and settings

- [ ] Reports and async exports work.
- [ ] System Alerts read-only.
- [ ] Security Centre complete.
- [ ] Audit Logs immutable/read-only.
- [ ] Import/Export centres complete.
- [ ] Typed Settings complete.
- [ ] Admin Management safeguards complete.
- [ ] System Status uses real data only.
- [ ] Help contains no messaging.

## 76.8 Quality

- [ ] All loading/empty/error/offline/conflict states.
- [ ] WCAG 2.2 AA.
- [ ] Light/dark.
- [ ] Desktop/tablet and critical mobile.
- [ ] All tests pass.
- [ ] Build and CI pass.
- [ ] No sensitive logging or critical console error.
- [ ] Documentation complete.

## 76.9 Scope

- [ ] No chat or messages.
- [ ] No announcement composer.
- [ ] No posts, comments, replies, or discussions.
- [ ] No assignments/submissions.
- [ ] No materials, notes, syllabus uploads, or course documents.
- [ ] No correction attachment upload.
- [ ] No arbitrary Alert body.
- [ ] No social profiles.
- [ ] No hidden placeholder for forbidden features.

---

# 77. REQUIRED FINAL AGENT RESPONSE

1. Repository inspection summary.
2. Architecture and technical decisions.
3. Exact routes implemented.
4. Shared components created.
5. Phase 1 endpoints integrated.
6. Backend contract gaps or deviations.
7. Role/permission matrix.
8. Authentication and token-storage approach.
9. Sensitive redaction and protected-image approach.
10. One-time code handling.
11. Tests and results.
12. Accessibility checks.
13. Build, lint, type-check, and bundle results.
14. Environment variables and run commands.
15. Known limitations with severity.
16. Confirmation of zero production mock data.
17. Confirmation that no forbidden feature exists.

Do not respond only with completed. Include concrete commands, test counts, route list, evidence, and blockers. Never invent passing results.

---

# 78. FINAL IMPLEMENTATION DIRECTIVE

Build Phase 2 as a real, secure, accessible, responsive, role-scoped Admin application connected to the real Phase 1 backend. Prefer correctness, institutional integrity, privacy, and auditable workflows over decorative complexity. Do not weaken server authority, hardcode the initial College, hide missing integration behind mocks, or introduce any feature outside the strict attendance-only product boundary.

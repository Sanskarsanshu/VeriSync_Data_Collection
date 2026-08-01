# FaceAttend — Phase 1 Admin Backend
## Production-Grade Antigravity Master Build Prompt

> Paste this entire document into Antigravity or another agentic coding tool. Treat it as the authoritative implementation contract for Phase 1. Do not reduce the scope, replace real modules with mock data, or leave critical functionality as TODOs.

---

# 0. AGENT ROLE, OPERATING MODE, AND NON-NEGOTIABLE EXPECTATIONS

You are the lead backend architect and senior NestJS engineer responsible for building **Phase 1: Admin Backend** of **FaceAttend**, a privacy-preserving, multi-factor smart attendance management platform.

This backend will become the foundation for:

- Phase 2 — Admin Frontend
- Phase 3 — Teacher Backend
- Phase 4 — Teacher Frontend
- Phase 5 — Student Backend
- Phase 6 — Student Frontend
- Phase 7 — Public SaaS Landing Page

Build the backend as if it will manage real institutional identities, biometric references, attendance records, correction decisions, audit evidence, and official reports.

## 0.1 Required working behaviour

Before writing code:

1. Inspect the existing repository completely.
2. Identify existing files, frameworks, package versions, conventions, environment variables, database configuration, and unfinished modules.
3. Reuse valid existing work instead of rebuilding it unnecessarily.
4. Produce a short internal implementation plan ordered by dependency.
5. Implement in small, testable increments.
6. Run formatting, linting, type checking, migrations, unit tests, integration tests, and end-to-end tests after meaningful milestones.
7. Fix failures before moving to the next module.
8. Do not claim completion while tests fail, migrations are invalid, endpoints are undocumented, or critical modules remain mocked.
9. Do not silently change the requested stack or architecture.
10. Never expose secrets, biometric embeddings, password hashes, reset tokens, OTP values, refresh-token hashes, or internal security details in API responses or logs.

## 0.2 Completion standard

The phase is complete only when:

- the application starts locally from documented commands;
- PostgreSQL, Redis, the job worker, and object storage connect correctly;
- all migrations apply to an empty database;
- seed data loads successfully in development only;
- all required APIs are implemented;
- Swagger accurately documents the APIs;
- RBAC and tenant scoping are enforced server-side;
- sensitive mutations generate audit events;
- unit, integration, and end-to-end tests pass;
- no institutional entity is hardcoded;
- no forbidden LMS or communication feature exists;
- the repository contains no unresolved critical TODOs.

---

# 1. PRODUCT DEFINITION

FaceAttend is a **strict attendance-only institutional platform**.

It is not:

- a learning management system;
- a digital classroom;
- a student-teacher chat platform;
- a messaging application;
- an assignment platform;
- a study-material repository;
- a discussion forum;
- an announcement feed;
- a social or academic content-sharing platform.

## 1.1 Allowed product capabilities

The platform may support only the following functional areas:

- institutional and academic master-data configuration;
- Admin, Teacher, and Student identity onboarding;
- email and phone verification;
- profile photos used for identity display;
- biometric consent and encrypted face-embedding references;
- teacher-subject-section assignments;
- course-offering authorisation;
- course registration and roster management;
- timetable and scheduled-class management;
- academic calendar, holidays, special working days, and class cancellations;
- attendance-session configuration and oversight;
- dynamic QR, face-verification, liveness, and device-risk infrastructure;
- attendance records and analytics;
- structured attendance-correction workflows;
- generated official attendance reports;
- structured system-generated alerts;
- security monitoring;
- immutable audit history;
- controlled data import and export for authorised administrators.

## 1.2 Strictly forbidden capabilities

Do not create database tables, DTOs, endpoints, services, events, UI-facing contracts, placeholders, or future-ready stubs for:

- chat;
- private messages;
- group messages;
- teacher-to-student messages;
- student-to-teacher messages;
- posts;
- feeds;
- comments;
- replies;
- discussions;
- question-and-answer threads;
- announcements composed by a person;
- assignments;
- assignment submissions;
- study notes;
- learning materials;
- course documents;
- teacher file uploads;
- student file uploads;
- syllabus-file distribution;
- academic PDF sharing;
- classwork;
- social profiles;
- “People” pages;
- arbitrary free-text broadcast notifications.

## 1.3 Allowed file and binary handling

The no-file-sharing rule does not prohibit operational system files. The following are allowed only under controlled RBAC:

- profile photos;
- temporary encrypted biometric enrolment captures;
- encrypted face embeddings or embedding blobs;
- Admin-only CSV/XLSX imports for institutional records;
- generated attendance reports in CSV/XLSX/PDF;
- generated audit/export files;
- system-generated archives or backups.

The following are not allowed:

- supporting-document uploads in attendance corrections;
- medical-certificate uploads;
- syllabus uploads;
- notes/material uploads;
- Teacher-to-Student or Student-to-Teacher file exchange.

Attendance corrections must rely on structured reasons, system logs, reference IDs, Teacher recommendations, Admin decisions, and offline institutional verification when required.

---

# 2. INITIAL DEPLOYMENT AND SCALABILITY

## 2.1 Initial seed deployment

Create development seed data for:

- Organisation: FaceAttend Demo Organisation
- College: Patna Women’s College
- Campus: Main Campus
- Department: Computer Applications
- Programme: Master of Computer Applications
- Programme code: MCA
- Academic Session: configurable example such as 2025–2027
- Batch/Cohort: MCA 2025–2027
- Academic Year: Second Year
- Semester: configurable current semester, for example Semester IV
- Section: Section A
- Initial Student strength: 36
- Initial Section capacity: 50

## 2.2 No hardcoding rule

The following must always be stored as database entities and loaded dynamically:

- organisations/tenants;
- colleges;
- campuses;
- departments;
- programmes;
- programme curriculum versions;
- academic sessions;
- batches/cohorts;
- academic years;
- semesters;
- sections;
- subjects;
- subject offerings;
- course offerings;
- rooms/classrooms;
- timetables;
- scheduled classes;
- Teachers;
- Students;
- attendance policies.

Do not place “MCA”, “Second Year”, “Section A”, “Patna Women’s College”, “50”, a fixed Semester, or any institutional name in application logic.

A second College, Department, Programme, Batch, Semester, or Section must be creatable without code changes or schema changes.

---

# 3. FIXED TECHNICAL STACK

Use the following stack unless the existing repository is already built with an equivalent approved version. Do not switch frameworks merely for preference.

## 3.1 Backend

- Node.js 22 LTS or the current repository-supported LTS
- TypeScript with strict mode
- NestJS
- REST API
- API base path: `/api/v1`
- Prisma ORM
- PostgreSQL 16+
- Redis 7+
- BullMQ for background jobs
- S3-compatible object storage; use MinIO for local development
- Swagger/OpenAPI generated from NestJS decorators
- Pino structured JSON logging
- Argon2id for passwords, secrets, and one-time course-authorisation-code hashing
- JWT access tokens and rotating refresh tokens
- Jest and Supertest for testing
- Docker and Docker Compose for local infrastructure

## 3.2 Supporting libraries

Use maintained packages for:

- configuration validation;
- DTO validation and transformation;
- secure headers;
- rate limiting;
- request IDs;
- MIME and upload validation;
- CSV/XLSX parsing;
- date/time handling;
- timezone-safe calculations;
- object storage;
- metrics;
- email transport;
- OpenTelemetry or equivalent tracing when practical.

Avoid abandoned packages.

## 3.3 Architecture style

Build a **modular monolith** with clear domain boundaries. Do not create premature microservices.

Required layers:

- controllers — transport only;
- DTOs — request validation and public response contracts;
- application services — use cases and transactions;
- domain services — reusable business rules;
- repositories/data access — Prisma queries;
- guards/policies — auth, RBAC, tenant and scope enforcement;
- events — internal domain events;
- jobs — BullMQ workers;
- infrastructure adapters — email, Redis, S3, metrics;
- audit service — sensitive-change logging;
- shared error and response handling.

Controllers must not contain business logic.

---

# 4. REPOSITORY AND DEVELOPMENT BASELINE

Create or verify:

```text
/src
  /app
  /config
  /common
    /auth
    /decorators
    /errors
    /filters
    /guards
    /interceptors
    /logging
    /pagination
    /pipes
    /responses
    /security
    /types
    /utils
  /database
    /prisma
    /repositories
    /transactions
  /infrastructure
    /cache
    /email
    /jobs
    /metrics
    /object-storage
    /observability
  /modules
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
    /admin-users
    /identity
    /teachers
    /teacher-assignments
    /students
    /student-verification
    /biometric-consent
    /face-enrolment
    /course-authorisations
    /course-offerings
    /course-registrations
    /timetables
    /scheduled-classes
    /calendar-events
    /holidays
    /class-change-requests
    /attendance-policies
    /attendance-sessions
    /attendance-records
    /attendance-corrections
    /attendance-sheets
    /reports
    /system-alerts
    /security-events
    /device-management
    /audit-logs
    /imports
    /exports
    /system-settings
    /health
/prisma
  schema.prisma
  /migrations
  seed.ts
/test
  /unit
  /integration
  /e2e
/docs
  architecture.md
  permissions.md
  data-retention.md
  api-errors.md
  runbook.md
/docker
```

Also provide:

- `.env.example`;
- `docker-compose.yml`;
- Dockerfile;
- development, test, and production config validation;
- lint, format, type-check, test, migration, seed, and worker scripts;
- README with exact commands.

---

# 5. MULTI-TENANCY AND DATA-SCOPING MODEL

## 5.1 Tenant model

Every institution belongs to an `organisation` tenant.

Use `organisation_id` directly or indirectly on every institutional and operational record. Every repository query must be tenant-scoped.

Tenant isolation must be enforced by server-side policy, not by trusting request parameters.

## 5.2 Scope hierarchy

Use this authoritative hierarchy:

```text
Organisation
  → College
    → Campus
      → Department
        → Programme
          → Curriculum Version
          → Academic Session
            → Batch/Cohort
              → Academic Year
                → Semester
                  → Section
                    → Subject Offering
                      → Course Offering
                        → Timetable Rule
                          → Scheduled Class
                            → Attendance Session
                              → Attendance Records
```

## 5.3 Distinguish these concepts

Do not collapse these into one table:

- **Subject:** reusable academic master, for example “Cloud Computing”.
- **Subject Offering:** a Subject made available to one Programme/Curriculum/Semester.
- **Course Offering:** a Subject Offering taught to a specific Batch/Section by assigned Teacher(s) during a Session.
- **Timetable Rule:** recurring scheduling rule.
- **Scheduled Class:** one actual class occurrence on a specific date/time.
- **Attendance Session:** one temporary attendance window started for one Scheduled Class.

---

# 6. IDENTITY, AUTHENTICATION, AND ACCOUNT MODEL

## 6.1 Shared account foundation

Create a common `user_accounts` identity table for Admin, Teacher, and Student authentication. Role-specific information belongs in profile tables.

Suggested fields:

- `id UUID PK`
- `organisation_id UUID FK`
- `email CITEXT`
- `phone_e164 TEXT nullable`
- `password_hash TEXT nullable`
- `primary_role ENUM(admin, teacher, student)`
- `email_verified_at TIMESTAMPTZ nullable`
- `phone_verified_at TIMESTAMPTZ nullable`
- `status ENUM(invited, verification_pending, registration_incomplete, pending_approval, active, temporarily_suspended, deactivated, archived)`
- `mfa_enabled BOOLEAN`
- `failed_login_count INT`
- `locked_until TIMESTAMPTZ nullable`
- `last_login_at TIMESTAMPTZ nullable`
- `password_changed_at TIMESTAMPTZ nullable`
- `created_at`, `updated_at`, `deleted_at`

Enforce unique email per tenant unless product policy explicitly requires global uniqueness.

## 6.2 Sessions and refresh tokens

Create `auth_sessions` and `refresh_tokens` or a combined session model containing:

- account;
- refresh-token hash;
- device ID;
- user agent;
- IP address;
- issued and expiry times;
- revoked time and reason;
- last-used time;
- trusted-device status.

Refresh tokens must:

- be stored hashed;
- rotate on every refresh;
- invalidate the previous token;
- detect reuse;
- revoke the token family on reuse detection.

## 6.3 Email verification, OTP, and password reset

Create hashed one-time-token records with:

- purpose;
- account/email;
- token hash;
- attempt count;
- expiry;
- consumed time;
- requester IP/device;
- rate-limit metadata.

Never store OTP or reset tokens in plaintext.

## 6.4 Admin bootstrap

Provide a safe CLI or seed-only development mechanism for the first Super Admin.

Production bootstrap must require environment-provided credentials or a secure one-time command. Never ship a default production password.

---

# 7. RBAC AND AUTHORISATION

## 7.1 Admin roles

Support at least:

- Super Admin
- Organisation Admin
- College Admin
- Department Admin
- Attendance Admin
- Academic Coordinator
- Read-only Auditor

Use data-driven role and permission mappings or a strongly centralised policy layer. Do not scatter role strings throughout controllers.

## 7.2 Permission examples

Define permissions such as:

- `organisation.read`
- `college.manage`
- `department.manage`
- `programme.manage`
- `academic_structure.manage`
- `subject.manage`
- `teacher.manage`
- `teacher_assignment.manage`
- `student.manage`
- `student_verification.review`
- `course_authorisation.manage`
- `course_offering.approve`
- `course_registration.manage`
- `timetable.manage`
- `calendar.manage`
- `attendance.read`
- `attendance.manual_entry.request`
- `attendance.manual_entry.approve`
- `attendance_correction.review`
- `report.generate`
- `report.export_sensitive`
- `security.manage`
- `audit.read`
- `settings.manage`
- `admin.manage`

## 7.3 Scope enforcement

Examples:

- Department Admin can access only their Department and its descendants.
- Attendance Admin can access attendance data but cannot modify academic masters.
- Auditor is read-only.
- College Admin cannot access another College in the same Organisation unless granted.
- Out-of-scope objects must return `404`, not reveal their existence.

Every service method must derive scope from the authenticated account and role assignments. Do not trust `organisation_id`, `college_id`, or `department_id` supplied by the client.

---

# 8. DATABASE DESIGN RULES

## 8.1 General rules

- UUID primary keys.
- `created_at` and `updated_at` on all mutable tables.
- `deleted_at` for soft-deletable master/account records.
- CITEXT for case-insensitive unique email fields.
- Explicit unique constraints.
- Explicit indexes for frequent filters and joins.
- Check constraints for percentages, capacities, dates, and counts.
- Foreign keys must use deliberate delete behaviour.
- Historical attendance data must never cascade-delete accidentally.
- Use PostgreSQL enums only when values are stable; otherwise use lookup tables.
- Use numeric/decimal for percentages, never floating-point.
- Store timestamps in UTC; convert using the College timezone at presentation boundaries.

## 8.2 Soft deletion

Never hard-delete:

- Teachers;
- Students;
- Course Offerings;
- Subject Offerings used historically;
- Scheduled Classes with attendance;
- Attendance Sessions;
- Attendance Records;
- Corrections;
- Audit Logs;
- Security Events.

Hard deletion may be allowed only for unused draft configuration records with no dependencies and explicit Super Admin permission.

## 8.3 Auditability

Sensitive updates must capture:

- actor;
- role;
- tenant and scope;
- action;
- target type and ID;
- before and after values;
- reason;
- request ID;
- IP and device metadata;
- result;
- timestamp.

Secrets, hashes, OTP values, face embeddings, and tokens must be redacted before audit persistence.

---

# 9. AUTHORITATIVE DATA MODEL

Implement the following logical tables. Exact Prisma naming may follow repository conventions, but no entity may be omitted without a written technical reason.

## 9.1 Institutional structure

### `organisations`

- id
- legal_name
- display_name
- code
- status
- default_timezone
- created_at
- updated_at
- deleted_at

### `colleges`

- id
- organisation_id
- name
- code unique per Organisation
- institution_type
- university_affiliation nullable
- official_email
- official_phone nullable
- address fields
- website nullable
- logo_object_key nullable
- timezone
- status
- created_at
- updated_at
- deleted_at

### `campuses`

- id
- college_id
- name
- code unique per College
- address fields
- timezone override nullable
- status
- timestamps
- deleted_at

### `departments`

- id
- college_id
- campus_id nullable
- name
- code unique per College
- official_email nullable
- head_teacher_id nullable
- status
- timestamps
- deleted_at

### `programmes`

- id
- department_id
- name
- short_name
- code unique per Department
- programme_level
- duration_years
- total_semesters
- admission_capacity
- default_section_capacity
- status
- timestamps
- deleted_at

### `curriculum_versions`

- id
- programme_id
- name
- version_code
- effective_from
- effective_to nullable
- status
- timestamps

No syllabus-file URL is permitted.

## 9.2 Academic structure

### `academic_sessions`

- id
- programme_id
- name
- code unique per Programme
- admission_year
- graduation_year
- start_date
- end_date
- registration_opens_at nullable
- registration_closes_at nullable
- status
- timestamps

### `batches`

- id
- academic_session_id
- curriculum_version_id
- name
- code
- admission_year
- expected_graduation_year
- capacity
- status
- timestamps

### `academic_years`

- id
- batch_id
- year_number
- name
- start_date
- end_date
- status
- timestamps

### `semesters`

- id
- academic_year_id
- semester_number
- name
- semester_start_date
- teaching_start_date
- attendance_start_date
- semester_end_date
- exam_start_date nullable
- exam_end_date nullable
- status
- timestamps

Critical rule: all dates before `teaching_start_date` or `attendance_start_date`, whichever policy requires, are Not Applicable and never Absent.

### `sections`

- id
- semester_id
- name
- code
- capacity
- class_coordinator_teacher_id nullable
- status
- timestamps
- deleted_at

Unique: `(semester_id, code)`.

### `rooms`

- id
- campus_id
- name
- code
- room_type
- capacity nullable
- status
- timestamps

## 9.3 Subject and course model

### `subjects`

- id
- department_id
- name
- code unique per Department
- subject_type
- credit_value nullable
- is_practical
- description nullable
- status
- timestamps
- deleted_at

Do not include `syllabus_url`, course-material fields, file attachments, or content modules.

### `subject_offerings`

- id
- subject_id
- curriculum_version_id
- semester_number
- academic_year_number
- category: compulsory/elective/audit
- weekly_class_count
- minimum_required_classes nullable
- status
- timestamps

### `teacher_profiles`

- account_id PK/FK
- department_id
- employee_id unique per Organisation or College according to policy
- full_name
- designation
- qualification nullable
- specialisation nullable
- profile_photo_object_key nullable
- joining_date nullable
- approval_status
- timestamps
- deleted_at

Do not add biography, office-hours publishing, announcement permissions, or communication settings.

### `teacher_assignments`

- id
- teacher_account_id
- subject_offering_id
- section_id
- assignment_role
- effective_from
- effective_until nullable
- status
- assigned_by_admin_id
- timestamps

Prevent invalid cross-Programme, cross-Semester, and cross-Section assignments.

### `course_authorisations`

- id
- teacher_assignment_id
- code_hash
- code_fingerprint or lookup prefix that does not reveal the secret
- max_uses default 1
- uses_count
- expires_at
- status
- created_by_admin_id
- delivered_at nullable
- used_at nullable
- revoked_at nullable
- revocation_reason nullable
- parent_authorisation_id nullable for regeneration lineage
- timestamps

The plaintext code must be displayed once only.

### `course_offerings`

- id
- subject_offering_id
- section_id
- primary_teacher_account_id
- course_authorisation_id
- display_name
- classroom_location_text nullable
- start_date
- end_date
- status
- approval_required
- approved_by_admin_id nullable
- approved_at nullable
- timestamps
- deleted_at

No stream, classwork, material, assignment, discussion, people, post, comment, or message relation may exist.

### `course_teacher_assignments`

Support authorised co-Teachers/substitutes without replacing the primary Teacher.

### `course_registrations`

- id
- course_offering_id
- student_account_id
- registration_method
- requested_by nullable
- approval_status
- approved_by_admin_id nullable
- approved_at nullable
- registered_at
- withdrawn_at nullable
- status
- timestamps

Unique: `(course_offering_id, student_account_id)`.

Compulsory enrolment is automatic. Elective requests may be recommended by a Teacher, but final approval belongs to an authorised Admin/Academic Coordinator.

## 9.4 Student identity and biometric administration

### `student_profiles`

- account_id PK/FK
- section_id
- full_name
- roll_number
- registration_number
- profile_photo_object_key nullable
- academic_status
- face_enrolment_status
- account_approval_status
- timestamps
- deleted_at

Roll number must be unique within the configured institutional scope. Registration number must follow College policy.

Do not collect Student address or emergency contact in v1.

### `biometric_consents`

- id
- student_account_id
- consent_version
- purpose_code
- consented_at
- withdrawn_at nullable
- source_ip
- device_info
- retention_policy_snapshot JSONB
- timestamps

### `face_enrolments`

- id
- student_account_id
- embedding_object_key
- embedding_algorithm_version
- encrypted_data_key_ref
- quality_score nullable
- status
- enrolled_at
- approved_at nullable
- approved_by_admin_id nullable
- superseded_by_id nullable
- deletion_due_at nullable
- timestamps

Embeddings must never be returned by an API.

### `face_enrolment_review_requests`

- id
- student_account_id
- temporary_capture_object_keys JSONB
- risk_indicators JSONB
- quality_metrics JSONB
- status
- reviewed_by_admin_id nullable
- structured_rejection_code nullable
- admin_internal_remark nullable
- submitted_at
- reviewed_at nullable
- capture_deletion_due_at
- timestamps

Temporary capture images must be encrypted and automatically deleted after the configured review-retention period.

## 9.5 Timetable, calendar, and Scheduled Classes

### `timetable_rules`

- id
- course_offering_id
- room_id nullable
- day_of_week
- local_start_time
- local_end_time
- class_type
- effective_from
- effective_until
- recurrence_rule nullable
- default_attendance_method
- status
- timestamps

### `scheduled_classes`

- id
- course_offering_id
- timetable_rule_id nullable
- room_id nullable
- scheduled_start_at
- scheduled_end_at
- class_type
- source_type
- status: scheduled, attendance_open, ongoing, completed, cancelled, rescheduled, holiday, extra_class
- original_scheduled_class_id nullable
- cancellation_reason_code nullable
- reschedule_reason_code nullable
- approved_by_admin_id nullable
- timestamps

### `calendar_events`

- id
- organisation/college/campus/department/programme/session/batch/section applicability columns as required
- event_type
- name
- start_date
- end_date
- recurring rule nullable
- description restricted to internal calendar context
- status
- timestamps

### `class_change_requests`

For Teacher cancellation, rescheduling, extra, or replacement class requests:

- id
- scheduled_class_id nullable
- course_offering_id
- request_type
- proposed start/end/room nullable
- structured_reason_code
- short_internal_reason nullable
- requested_by_teacher_id
- status
- reviewed_by_admin_id nullable
- reviewed_at nullable
- timestamps

No free-text Student broadcast message is generated. Approved schedule-state changes trigger structured system alerts.

## 9.6 Attendance policy and status model

### `attendance_policies`

Scope may be Organisation, College, Programme, Batch, or Section.

Fields:

- minimum_attendance_percent
- warning_threshold_percent
- critical_threshold_percent
- attendance_window_seconds
- late_attendance_enabled
- late_grace_seconds nullable
- excused_absence_denominator_policy
- manual_attendance_enabled
- face_required
- qr_required
- device_check_enabled
- correction_deadline_hours
- max_face_retry_attempts
- face_match_threshold
- liveness_required
- status
- effective dates
- timestamps

### Statuses

Support:

- `present`
- `absent`
- `holiday`
- `cancelled`
- `not_applicable`
- `excused`
- `pending_review`
- `manually_corrected`
- `late`, only when College policy enables it

Do not store only display symbols. Map display symbols at the API/presentation layer:

- Present = `1`
- Absent = `0`
- Holiday = `H`
- Cancelled = `C`
- Not Applicable = `NA`
- Excused = `E`
- Pending = `P`
- Manually Corrected = `M`
- Late = `L`

## 9.7 Attendance sessions and QR infrastructure

### `attendance_sessions`

- id
- scheduled_class_id unique unless explicitly reopening under controlled policy
- course_offering_id
- started_by_teacher_account_id
- opened_at
- closes_at
- closed_at nullable
- attendance_method
- status
- current_qr_version
- qr_rotation_seconds
- session_nonce_hash
- expected_student_count
- timestamps

### `attendance_qr_tokens`

- id
- attendance_session_id
- token_hash
- token_version
- valid_from
- valid_until
- revoked_at nullable
- created_at

Correct QR behaviour:

- one active short-lived QR may be scanned by multiple eligible Students;
- each Student may obtain only one attendance result per Scheduled Class;
- token rotation invalidates older token versions after their validity window;
- screenshot replay outside the active window must fail;
- a token is not globally consumed by the first Student;
- token validation is server-side;
- the Student must also be enrolled in the Course Offering;
- duplicate requests are idempotent.

### `attendance_records`

- id
- scheduled_class_id
- attendance_session_id
- student_account_id
- status
- original_status nullable
- finalisation_state
- verification_method
- face_result_code nullable
- face_confidence nullable and restricted
- liveness_result_code nullable
- qr_result_code nullable
- device_risk_level nullable
- device_signal_summary JSONB nullable and access-restricted
- marked_at nullable
- server_received_at
- reference_number unique
- correction_state
- timestamps

Unique constraints:

- `(scheduled_class_id, student_account_id)`
- optionally `(attendance_session_id, student_account_id)`

The Scheduled-Class uniqueness is the final protection against duplicate attendance across session retries/reopens.

### `attendance_attempts`

Store all verification attempts separately from final Attendance Records:

- attendance_session_id
- student_account_id
- attempted_at
- QR result
- face result
- liveness result
- device risk
- request ID
- IP hash or privacy-preserving representation
- outcome
- failure code
- metadata with strict retention

This supports fraud review without repeatedly mutating the official record.

## 9.8 Attendance corrections

### `attendance_corrections`

- id
- attendance_record_id
- submitted_by_account_id
- submitted_by_role
- current_status
- requested_status
- structured_reason_code
- short_explanation
- system_reference_ids JSONB
- teacher_recommendation nullable
- teacher_internal_remark nullable
- recommended_by_teacher_id nullable
- recommended_at nullable
- admin_decision nullable
- admin_internal_remark nullable
- decided_by_admin_id nullable
- decided_at nullable
- workflow_status
- submission_deadline_at
- closed_at nullable
- timestamps

Do not include:

- supporting-document URL;
- attachment relation;
- upload field;
- comment thread;
- reply thread;
- message body.

### `attendance_correction_events`

Append-only state-transition history containing actor, from-state, to-state, reason code, internal remark, and timestamp.

An approved correction must never erase the original status. Preserve:

- original Attendance Record;
- approved corrected status;
- full correction history;
- audit log;
- decision authority.

## 9.9 Alerts, audit, security, import, and export

### `system_alerts`

- id
- recipient account or role/scope
- event_type
- template_key
- structured_payload JSONB
- priority
- delivery_channels
- read_at nullable
- created_at
- expires_at nullable

There must be no human-authored `message`, `body`, `post`, or arbitrary broadcast content.

Allowed event types include:

- account approval status changed;
- face enrolment status changed;
- Teacher assignment changed;
- course authorisation generated/expiring/expired/revoked;
- Course Offering approved/suspended;
- enrolment status changed;
- attendance session started/closed;
- attendance recorded/failed/pending;
- attendance threshold warning;
- correction status changed;
- class cancelled/rescheduled;
- holiday or special working day configured;
- security event.

### `audit_logs`

Append-only. Application role must not have UPDATE or DELETE permission.

### `security_events`

Include:

- failed login;
- account lock;
- refresh-token reuse;
- suspicious OTP activity;
- face mismatch;
- liveness failure;
- device anomaly;
- QR expired/replay attempt;
- course-code failure;
- suspicious export;
- unusual correction activity.

### `device_records`

Track device identifiers only as proportionate fraud signals. Device risk must never be the sole reason for marking a Student absent or guilty.

### `import_jobs`, `import_rows`, `export_jobs`

Admin imports are permitted only for operational master data. Validate before commit. Preserve who imported/exported what and when.

### `system_settings`

Use typed setting definitions. Do not build an unsafe arbitrary key-value system without validation.

---

# 10. CORE ADMIN MODULES

Implement complete modules for:

1. Authentication and Admin account management
2. Organisation management
3. College management
4. Campus management
5. Department management
6. Programme management
7. Curriculum version management
8. Academic Session management
9. Batch/Cohort management
10. Academic Year management
11. Semester management
12. Section management
13. Room management
14. Subject management
15. Subject Offering management
16. Teacher pre-authorisation and profile administration
17. Teacher assignment management
18. Student pre-registration and profile administration
19. Student verification queue
20. Biometric consent and face-enrolment administration
21. Course-authorisation-code management
22. Course Offering approval and administration
23. Course registration management
24. Timetable management
25. Scheduled-Class generation and management
26. Calendar and Holiday management
27. Class change review
28. Attendance policy management
29. Attendance session read/oversight APIs
30. Attendance record read APIs
31. Emergency manual-attendance request/approval
32. Attendance correction final review
33. Attendance sheet generation
34. Reports and analytics
35. System-generated alerts
36. Security Centre
37. Audit log viewer
38. Data import/export
39. System settings
40. Health, metrics, and operational status

---

# 11. REST API CONTRACT

## 11.1 General conventions

- Base path: `/api/v1`
- JSON request and response bodies
- UTC ISO-8601 timestamps
- Stable machine-readable error codes
- Pagination on every list endpoint
- Allowlisted sorting fields only
- Typed filters only
- No raw SQL filters from clients
- Request ID on every request and error response
- Idempotency key support for critical create/transition endpoints
- Optimistic concurrency through `version` or `updated_at` preconditions on sensitive records

## 11.2 Standard success envelope

```json
{
  "data": {},
  "meta": {
    "request_id": "uuid"
  }
}
```

For lists:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 25,
    "total_records": 100,
    "total_pages": 4,
    "request_id": "uuid"
  }
}
```

## 11.3 Standard error envelope

```json
{
  "error": {
    "code": "COURSE_AUTHORISATION_EXPIRED",
    "message": "The course authorisation is no longer valid.",
    "field": null,
    "details": null,
    "request_id": "uuid"
  }
}
```

Do not expose stack traces, SQL errors, hashes, internal IDs not intended for clients, or security-sensitive details.

## 11.4 Authentication endpoints

Implement:

- `POST /auth/admin/login`
- `POST /auth/admin/refresh`
- `POST /auth/admin/logout`
- `POST /auth/admin/logout-all`
- `POST /auth/admin/forgot-password`
- `POST /auth/admin/reset-password`
- `POST /auth/admin/change-password`
- `POST /auth/admin/mfa/setup`
- `POST /auth/admin/mfa/verify`
- `POST /auth/admin/mfa/disable`
- `GET /auth/admin/sessions`
- `DELETE /auth/admin/sessions/:sessionId`

## 11.5 Institutional CRUD

Provide list, detail, create, update, activate, deactivate/archive, and safe-delete actions for:

- organisations;
- colleges;
- campuses;
- departments;
- programmes;
- curriculum versions;
- academic sessions;
- batches;
- academic years;
- semesters;
- sections;
- rooms;
- subjects;
- subject offerings.

Do not expose a generic unrestricted CRUD generator. Each module must enforce domain validation and permission scope.

## 11.6 Teacher administration

Implement:

- `POST /teachers/pre-authorise`
- `POST /teachers/:id/send-invitation`
- `POST /teachers/:id/resend-invitation`
- `GET /teachers`
- `GET /teachers/:id`
- `PATCH /teachers/:id`
- `POST /teachers/:id/approve`
- `POST /teachers/:id/reject`
- `POST /teachers/:id/suspend`
- `POST /teachers/:id/reactivate`
- `POST /teachers/:id/deactivate`
- `GET /teachers/:id/assignments`
- `GET /teachers/:id/security-summary` with restricted output

Public registration endpoints may exist under a separate Teacher-auth route but must validate against pre-authorised records.

## 11.7 Teacher assignments

Implement:

- create;
- list/filter;
- update effective dates/role;
- revoke;
- assignment-conflict pre-check;
- assignment history.

Validation must prove:

- Teacher is approved and active;
- Subject Offering belongs to the same Programme/Curriculum/Semester;
- Section belongs to that Semester/Batch;
- assignment dates fall within Session dates;
- duplicate active assignment does not exist;
- cross-tenant references are impossible.

## 11.8 Student administration

Implement:

- individual pre-registration;
- CSV/XLSX import upload;
- validation preview;
- commit or reject import job;
- list and detail;
- update permitted academic mapping;
- approve/reject registration;
- suspend/reactivate/deactivate;
- change Section through a controlled workflow;
- mark withdrawn/transferred/graduated/archived;
- view verification history;
- request face re-enrolment;
- approve face re-enrolment;
- revoke biometric enrolment under policy;
- export authorised roster.

## 11.9 Course authorisations

Implement:

- generate;
- deliver through verified email job;
- revoke;
- regenerate;
- extend expiry under permission;
- inspect status and history;
- inspect failed validation attempts;
- internal validate-and-create-course service for Phase 3.

The code must:

- be cryptographically random;
- be displayed once;
- be stored as a hash;
- be bound to one Teacher Assignment;
- be scoped to exact Subject Offering and Section;
- expire;
- enforce max uses;
- be transactionally consumed;
- resist race conditions.

## 11.10 Course Offerings and registrations

Implement Admin APIs to:

- list Course Offerings;
- approve or reject pending Course Offerings;
- suspend/reactivate/archive;
- change primary Teacher through an auditable workflow;
- assign/remove authorised co-Teachers;
- lock/unlock registration;
- view roster;
- run compulsory auto-enrolment;
- add an Admin-controlled registration;
- approve/reject elective requests;
- withdraw a Student registration;
- validate capacity and academic eligibility.

## 11.11 Timetable and Scheduled Classes

Implement:

- timetable-rule CRUD;
- conflict pre-check;
- Scheduled-Class generation for a date range;
- regenerate only future unaffected classes;
- room conflict detection;
- Teacher conflict detection;
- Section conflict detection;
- holiday conflict detection;
- class cancellation/reschedule/extra-class approval;
- schedule history.

A timetable change must never rewrite historical Scheduled Classes with completed attendance.

## 11.12 Calendar and holidays

Implement:

- College-wide Holiday;
- Department/Programme/Batch/Section-scoped Holiday;
- Special Working Day;
- Vacation;
- Exam period;
- Semester break;
- Emergency closure;
- recurring annual event where appropriate.

Holiday is `H`, never Absent. Cancelled Class is `C`, not Holiday.

## 11.13 Attendance oversight

Admin endpoints:

- `GET /attendance/sessions`
- `GET /attendance/sessions/:id`
- `GET /attendance/sessions/:id/live-summary`
- `GET /attendance/records`
- `GET /attendance/records/:id`
- `GET /attendance/attempts` restricted
- `POST /attendance/manual-entry-requests`
- `POST /attendance/manual-entry-requests/:id/approve`
- `POST /attendance/manual-entry-requests/:id/reject`

No direct generic PATCH to Attendance Record status.

## 11.14 Attendance corrections

Implement:

- list and filter queue;
- detail with complete state history;
- move to Admin review;
- approve;
- reject;
- return for structured clarification;
- undo an Admin decision only through a new reversal event with stronger permission;
- close;
- export correction audit report.

No supporting-file upload endpoint may exist.

## 11.15 Attendance sheets and reports

Implement asynchronous generation for large reports.

Formats:

- CSV;
- XLSX;
- PDF;
- print-friendly structured JSON/HTML payload if required later.

Report scopes:

- Student;
- Course Offering;
- Subject;
- Section;
- Teacher;
- Department;
- Programme;
- Month;
- Semester;
- College.

Every export must:

- enforce scope;
- record filters;
- record actor;
- record row count;
- expire download access;
- use signed URLs;
- redact restricted security details.

## 11.16 Alerts

Admin may:

- list alerts;
- filter by event type, scope, recipient, priority, date, delivery status;
- mark own alerts read;
- inspect delivery failure;
- requeue failed delivery when authorised.

Do not implement:

- compose alert;
- custom message body;
- broadcast post;
- comment;
- reply.

## 11.17 Security Centre

Implement:

- failed-login summary;
- locked-account list;
- active session list;
- revoke session;
- force password reset;
- block/unblock device;
- suspicious QR attempts;
- repeated face/liveness failures;
- suspicious course-code attempts;
- suspicious export activity;
- resolve/reopen Security Event;
- security-event history;
- limited risk analytics.

## 11.18 Audit Logs

Read-only API with:

- filters;
- pagination;
- target history;
- actor history;
- date range;
- action category;
- success/failure;
- export permission restricted to authorised roles.

No API may update or delete an Audit Log.

## 11.19 Imports and exports

Imports:

- Students;
- Teachers;
- Subjects;
- Subject Offerings;
- Academic structures;
- Course mappings;
- Timetables;
- Holidays.

Workflow:

1. upload to quarantine storage;
2. virus/MIME/size validation;
3. parse in worker;
4. produce row-level preview;
5. Admin confirms;
6. transactional commit with clear partial/all-or-nothing policy;
7. audit;
8. delete quarantine file on schedule.

## 11.20 Settings

Use dedicated typed DTOs and permissions for:

- attendance thresholds;
- QR duration and rotation;
- face-match threshold;
- liveness requirement;
- manual-attendance policy;
- correction deadline;
- OTP expiry;
- password policy;
- failed-login lockout;
- session expiry;
- data-retention durations;
- temporary biometric-capture retention;
- audit-log retention;
- export retention;
- Course Offering approval;
- Section capacity;
- Late policy;
- Excused-absence calculation.

---

# 12. BUSINESS RULES

Implement and unit-test every rule.

## 12.1 Attendance formula

```text
Attendance Percentage = Eligible Present Count / Eligible Conducted Count × 100
```

Default denominator:

- Present: included;
- Absent: included;
- Late: policy-controlled, normally included as attended;
- Excused: policy-controlled;
- Holiday: excluded;
- Cancelled: excluded;
- Not Applicable: excluded;
- Pending Review: excluded from final percentage or presented separately until resolved;
- Manually Corrected: counted according to its approved effective status.

Never calculate from calendar days alone.

## 12.2 Mid-month start

If teaching begins July 15:

- July 1–14 are Not Applicable;
- they must not generate Absent records;
- they must not enter the denominator;
- sheet generation must display `NA` where the matrix includes those dates.

## 12.3 Class-wise calculation

Attendance is attached to Scheduled Classes, not simply dates. Two classes on one day count as two conducted classes.

## 12.4 Month length

Use actual calendar dates and timezone-safe date functions. Support 28, 29, 30, and 31 days.

## 12.5 Holiday and cancellation

- Holiday is centrally configured and may be scoped.
- Holiday never equals Absent.
- Special Working Day overrides Holiday only when explicitly configured.
- A single cancelled lecture is `cancelled`, not Holiday.
- An approved replacement/extra class becomes an eligible Scheduled Class.

## 12.6 Course-authorisation validation

Validate transactionally:

1. account is a Teacher;
2. Teacher account is active and verified;
3. assignment is active;
4. exact Subject Offering matches;
5. exact Section matches;
6. exact Session/Batch/Semester lineage matches;
7. Course Authorisation belongs to the assignment;
8. code hash matches;
9. code is not expired/revoked/used beyond max uses;
10. no duplicate active Course Offering exists;
11. consume authorisation and create Course Offering atomically.

Handle simultaneous redemption using row locking or serialisable logic. Exactly one request may succeed for `max_uses=1`.

## 12.7 Registration

Prevent:

- duplicate enrolment;
- cross-tenant enrolment;
- cross-Programme enrolment without explicit policy;
- cross-Section enrolment without approval;
- inactive Course enrolment;
- over-capacity enrolment;
- enrolment outside registration dates;
- enrolment of inactive Students;
- Teacher self-enrolment decisions without final Admin authority.

## 12.8 Attendance idempotency

A network retry must never create two Attendance Records.

Return the original successful result for the same Idempotency Key when request semantics match.

## 12.9 Attendance finalisation

When an Attendance Session closes:

- verified successful Students become Present;
- unresolved suspicious attempts become Pending Review;
- enrolled Students with no successful record become Absent;
- closed records become immutable except through Correction or approved Manual Entry workflow;
- session summary and audit event are created.

## 12.10 Manual attendance

Emergency manual attendance requires:

- enabled policy;
- structured reason code;
- Teacher or Admin requester;
- Admin approval when required;
- original system state retained;
- audit event;
- resulting record marked as Manually Corrected or linked to correction history.

## 12.11 Corrections

- Student or Teacher submits a structured request in later phases.
- Teacher recommends.
- Admin makes final decision.
- Teacher cannot approve their own recommendation.
- Admin cannot silently overwrite a record.
- Reversal creates a new correction event; it does not delete history.
- No attachments.

## 12.12 Device checks

Device, IP, browser, and account-switching signals are fraud-risk indicators only. They may trigger Pending Review but must not alone impose punitive action.

---

# 13. SYSTEM-GENERATED ALERT ENGINE

Use domain events and template keys.

Example event:

```json
{
  "event_type": "ATTENDANCE_CORRECTION_APPROVED",
  "template_key": "attendance.correction.approved",
  "structured_payload": {
    "attendance_record_id": "uuid",
    "course_offering_id": "uuid",
    "scheduled_class_id": "uuid",
    "effective_status": "present"
  }
}
```

Frontend copy will be generated from trusted templates.

No API caller may supply arbitrary alert text.

Use an outbox pattern or reliable transactional event mechanism so database changes and alert/job publication do not drift.

---

# 14. BACKGROUND JOBS

Implement queues and workers for:

- email invitation delivery;
- email verification delivery;
- password reset delivery;
- Course Authorisation expiry sweep;
- alert delivery;
- Student/Teacher bulk-import parsing;
- import commit;
- temporary upload cleanup;
- temporary biometric-capture cleanup;
- Scheduled-Class generation;
- attendance-threshold recalculation;
- report generation;
- export expiry cleanup;
- audit archive/retention according to policy;
- security-event aggregation;
- stale session revocation;
- backup-status polling where infrastructure supports it.

Every job must have:

- retries with backoff;
- idempotent handler;
- failure/dead-letter handling;
- structured logs;
- metrics;
- correlation/request ID where applicable.

---

# 15. SECURITY REQUIREMENTS

## 15.1 Authentication

- Argon2id password hashing.
- Strong password policy configurable per tenant.
- Access token default 15 minutes.
- Rotating refresh token default 7 days.
- Refresh-token hashes stored server-side.
- Reuse detection.
- MFA for privileged Admin roles.
- Rate limits on login, OTP, reset, registration, imports, exports, and sensitive actions.

## 15.2 Secrets

- Load secrets only from validated environment variables or production secret manager.
- Never log secrets.
- Never commit real `.env` values.
- Support secret rotation.

## 15.3 HTTP security

- Helmet or equivalent secure headers.
- Strict CORS allowlist.
- Request-body size limits.
- File size and MIME limits.
- CSRF strategy if cookies are used.
- Secure, HttpOnly, SameSite cookies if refresh tokens use cookies.
- TLS required in production.

## 15.4 Data protection

- Encryption at rest for biometric objects.
- KMS-compatible envelope encryption design.
- Signed, short-lived object URLs.
- Separate buckets/prefixes for profile photos, temporary biometric captures, embeddings, imports, and reports.
- Raw/temporary captures automatically deleted according to policy.
- Embeddings never exposed to clients.
- PII minimisation.
- PII and security metadata redaction in logs.

## 15.5 Database security

- Separate DB roles for migration, application, read-only reporting where practical.
- Audit table insert-only privileges.
- No raw SQL concatenation.
- Transactions for multi-record state changes.
- Explicit isolation/locking for code redemption and correction approval.

## 15.6 Abuse protection

- IP/account rate limiting.
- account lockout with secure unlock workflow;
- OTP attempt limits;
- invitation abuse limits;
- export throttling;
- anomaly events for repeated failures;
- do not reveal whether out-of-scope records exist.

---

# 16. VALIDATION REQUIREMENTS

Validate:

- UUID format;
- email normalisation;
- E.164 phone format;
- enum values;
- date order;
- Session and Semester boundaries;
- capacity greater than zero;
- attendance thresholds between 0 and 100;
- warning/critical threshold ordering;
- valid timezone names;
- safe sort fields;
- safe file types;
- maximum row counts for imports;
- referential lineage across tenant hierarchy;
- status-transition legality;
- optimistic-concurrency version.

Use centralised status-transition maps. Reject illegal transitions.

---

# 17. ERROR CATALOGUE

Create documented stable error codes, including:

- `AUTH_INVALID_CREDENTIALS`
- `AUTH_ACCOUNT_LOCKED`
- `AUTH_ACCOUNT_NOT_ACTIVE`
- `AUTH_MFA_REQUIRED`
- `AUTH_REFRESH_TOKEN_REUSED`
- `ACCESS_OUT_OF_SCOPE`
- `RESOURCE_NOT_FOUND`
- `TENANT_SCOPE_MISMATCH`
- `DUPLICATE_EMAIL`
- `DUPLICATE_EMPLOYEE_ID`
- `DUPLICATE_ROLL_NUMBER`
- `INVALID_ACADEMIC_LINEAGE`
- `SECTION_CAPACITY_EXCEEDED`
- `TEACHER_NOT_ACTIVE`
- `TEACHER_NOT_ASSIGNED`
- `ASSIGNMENT_CONFLICT`
- `COURSE_AUTHORISATION_INVALID`
- `COURSE_AUTHORISATION_EXPIRED`
- `COURSE_AUTHORISATION_REVOKED`
- `COURSE_AUTHORISATION_ALREADY_USED`
- `COURSE_OFFERING_ALREADY_EXISTS`
- `TIMETABLE_TEACHER_CONFLICT`
- `TIMETABLE_SECTION_CONFLICT`
- `TIMETABLE_ROOM_CONFLICT`
- `TIMETABLE_HOLIDAY_CONFLICT`
- `ATTENDANCE_SESSION_NOT_ACTIVE`
- `ATTENDANCE_ALREADY_RECORDED`
- `ATTENDANCE_RECORD_LOCKED`
- `ATTENDANCE_CORRECTION_DEADLINE_EXPIRED`
- `ATTENDANCE_CORRECTION_INVALID_TRANSITION`
- `IMPORT_VALIDATION_FAILED`
- `EXPORT_NOT_AUTHORISED`
- `RATE_LIMITED`
- `VERSION_CONFLICT`

Document each code in `/docs/api-errors.md`.

---

# 18. IMPORT AND EXPORT SAFETY

## 18.1 Import validation

For every row report:

- valid;
- missing required field;
- invalid email;
- duplicate email;
- duplicate roll number;
- duplicate employee ID;
- unknown Department;
- invalid Programme;
- invalid Session;
- invalid Batch;
- invalid Semester;
- invalid Section;
- cross-tenant reference;
- capacity overflow;
- malformed date;
- invalid enum.

Do not commit during preview.

## 18.2 Commit strategy

Support explicit strategy:

- all-or-nothing transaction for normal imports;
- optional partial commit only when Admin explicitly selects it and receives a row-level result report.

## 18.3 Export security

- signed URL expiry;
- no public bucket;
- export permission checks;
- audit log;
- redaction;
- automatic cleanup;
- no biometric data export through ordinary reports.

---

# 19. REPORTING AND ATTENDANCE CALCULATION SERVICE

Build reusable calculation services used by all future portals.

Required functions:

- Student attendance summary;
- Course Offering summary;
- Subject summary;
- Section summary;
- Teacher class-completion summary;
- daily summary;
- weekly summary;
- monthly summary;
- Semester summary;
- low-attendance list;
- classes needed to reach threshold;
- absence streak;
- status distribution;
- correction history summary.

Use database aggregation efficiently. Avoid N+1 queries.

The “classes needed to reach target” calculation must be unit-tested and handle impossible or already-achieved cases.

---

# 20. OBSERVABILITY AND OPERATIONS

Implement:

- Pino structured JSON logs;
- request ID propagation;
- user/tenant context in logs without excessive PII;
- `/healthz` liveness;
- `/readyz` readiness checking PostgreSQL, Redis, queues, and storage dependency health;
- `/metrics` Prometheus-compatible metrics;
- request latency;
- HTTP status counts;
- DB query timing where practical;
- queue depth;
- job failures;
- email failures;
- report-generation duration;
- import duration;
- security-event counts;
- error tracking integration hook;
- OpenTelemetry tracing hook.

Do not include passwords, tokens, OTPs, embeddings, raw face captures, or sensitive correction explanations in logs.

---

# 21. DATABASE INDEXES

Create explicit indexes at minimum for:

- tenant/scope foreign keys on all scoped tables;
- email and status on accounts;
- employee ID;
- roll number and registration number;
- Teacher Assignment lookup;
- Course Authorisation assignment/status/expiry;
- Course Offering Section/Subject/Teacher/status;
- registration Course/Student unique key;
- timetable Course/day/effective dates;
- Scheduled Class Course/start/status;
- Attendance Session Scheduled Class/status;
- Attendance Record Student/Scheduled Class;
- Attendance Record Course/date through appropriate relations or denormalised read model where justified;
- Correction status/submitted date;
- Alert recipient/read date;
- Security Event type/resolved/date;
- Audit target/action/date;
- import/export status/date.

Use partial indexes for active/non-deleted records when beneficial.

---

# 22. CONCURRENCY AND TRANSACTION REQUIREMENTS

Use transactions for:

- consuming Course Authorisation and creating Course Offering;
- approving Course Offering and auto-enrolling Students;
- closing Attendance Session and creating Absent records;
- approving Manual Entry;
- approving/reversing Correction;
- moving a Student between Sections;
- deactivating a Teacher with reassignment;
- import commit;
- revoking sessions after security events.

Test race conditions:

- two redemptions of one-use code;
- two enrolments for same Student/Course;
- duplicate attendance requests;
- two Admins deciding same Correction;
- timetable update while Scheduled Classes are generated;
- two import commits for same job.

---

# 23. TESTING STRATEGY

## 23.1 Unit tests

Cover:

- attendance denominator;
- all status combinations;
- `NA` handling;
- Leap Year February;
- classes-needed calculation;
- code validation;
- role policies;
- scope policies;
- status transitions;
- capacity rules;
- registration eligibility;
- timetable conflicts;
- correction deadlines;
- alert-template payload validation;
- retention calculations.

## 23.2 Integration tests

Use a real PostgreSQL test database, not only mocks.

Test:

- migrations;
- unique constraints;
- FK behaviour;
- transactions;
- row-locking/race scenarios;
- tenant isolation;
- soft deletion;
- audit generation;
- outbox/job publication;
- imports;
- exports;
- S3/MinIO signed URLs;
- Redis session revocation.

## 23.3 End-to-end tests

Required flows:

### Flow A — Admin bootstrap and academic setup

Create Organisation → College → Campus → Department → Programme → Curriculum → Session → Batch → Academic Year → Semester → Section → Subjects → Subject Offerings.

### Flow B — Teacher onboarding and authorisation

Pre-authorise Teacher → verify account → Admin approves → assign Subject Offering/Section → generate Course Authorisation → internal validation creates Course Offering → Admin approves.

### Flow C — Student import and approval

Upload 36 Students → preview → commit → verify Student records → approve selected registrations → auto-enrol compulsory courses.

### Flow D — timetable and classes

Create timetable → detect conflicts → generate Scheduled Classes → declare Holiday → verify Holiday class treatment → create Special Working Day.

### Flow E — attendance lifecycle

Start Attendance Session through internal test helper or service → validate rotating QR for multiple Students → duplicate Student request returns existing result → close Session → remaining Students become Absent → summary updates.

### Flow F — correction

Submit structured Correction → Teacher recommendation fixture → Admin approval → preserve original status → effective status changes → alert and audit created.

### Flow G — tenant isolation

Create second Organisation/College and prove no cross-tenant read/write access.

## 23.4 Coverage

- minimum 85% for domain and application services;
- 100% targeted coverage for attendance calculations, authorisation validation, Correction state transitions, and RBAC scope policies.

Coverage percentage alone does not replace meaningful assertions.

---

# 24. TEST SCENARIO MATRIX

Include at least:

| Area | Scenario | Expected result |
|---|---|---|
| Tenant | Admin from Organisation A requests Organisation B Student | 404 |
| RBAC | Auditor attempts write | 403 |
| Structure | Section references Semester from another Batch | Rejected |
| Capacity | 51st Student added to capacity-50 Section | Rejected or requires authorised override |
| Assignment | Teacher assigned to wrong Semester Subject Offering | Rejected |
| Authorisation | Correct code for wrong Section | Rejected |
| Authorisation | Expired code | Rejected |
| Authorisation | Two simultaneous one-use redemptions | Exactly one succeeds |
| Course | Duplicate Teacher/Subject Offering/Section Course | Rejected |
| Enrolment | Duplicate Course registration | Idempotent/conflict without duplicate row |
| Timetable | Teacher double-booked | Rejected |
| Timetable | Room double-booked | Rejected |
| Timetable | Holiday conflict | Warning/block according to policy |
| QR | Same active rotating QR scanned by multiple enrolled Students | Each eligible Student may succeed once |
| QR | Old token after rotation | Rejected |
| Attendance | Same Student retries after network failure | Same result; no duplicate |
| Attendance | Session closes with five unmarked Students | Five Absent records |
| Attendance | Two classes same day, Student attends one | 1 of 2, not daily Present |
| Percentage | Four Holidays excluded | Correct denominator |
| Percentage | Teaching starts on 15th | Dates 1–14 are NA |
| Percentage | February Leap Year | 29-day handling correct |
| Correction | Supporting-file attempt | No endpoint/schema field exists |
| Correction | Teacher recommends and tries final approval | Forbidden |
| Correction | Two Admins decide simultaneously | One succeeds, one version conflict |
| Audit | Sensitive mutation | Exactly one redacted Audit Log |
| Import | Invalid rows | Preview only, no commit |
| Export | Out-of-scope report | Rejected and Security Event where appropriate |
| Biometrics | API requests embedding | Never returned |
| Alerts | Admin tries arbitrary message composition | No route exists |

---

# 25. SEED DATA

Create deterministic development seed data only.

Seed:

- one Organisation;
- Patna Women’s College;
- Main Campus;
- Computer Applications Department;
- MCA Programme;
- one Curriculum Version;
- Session 2025–2027;
- one Batch;
- Second Academic Year;
- one Semester with Semester Start and Teaching Start separated by 14 days;
- Section A capacity 50;
- 36 Students;
- 4 Teachers across different statuses;
- 6 Subjects across compulsory/elective/lab categories;
- Subject Offerings;
- Teacher Assignments;
- Course Authorisations across generated/used/expired/revoked states;
- Course Offerings;
- Course registrations;
- rooms;
- timetable rules;
- Scheduled Classes;
- Holiday and Special Working Day;
- Attendance Sessions and Records containing Present, Absent, Holiday, Cancelled, NA, Pending, and Corrected examples;
- Security Events;
- Audit Logs;
- system-generated Alerts.

Passwords in development seed data must come from environment variables or clearly development-only generated values. Never include a reusable production credential.

---

# 26. ENVIRONMENT VARIABLES

Provide a validated `.env.example` covering:

```env
NODE_ENV=development
APP_NAME=FaceAttend
PORT=4000
API_PREFIX=/api/v1
APP_BASE_URL=
ADMIN_FRONTEND_ORIGIN=
TEACHER_FRONTEND_ORIGIN=
STUDENT_FRONTEND_ORIGIN=

DATABASE_URL=
DATABASE_SHADOW_URL=
REDIS_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d

ARGON2_MEMORY_COST=
ARGON2_TIME_COST=
ARGON2_PARALLELISM=

SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM_ADDRESS=

S3_ENDPOINT=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_FORCE_PATH_STYLE=true
S3_BUCKET_PROFILE_PHOTOS=
S3_BUCKET_TEMP_BIOMETRIC_CAPTURES=
S3_BUCKET_FACE_EMBEDDINGS=
S3_BUCKET_IMPORTS=
S3_BUCKET_REPORTS=

OTP_TTL_MINUTES=10
PASSWORD_RESET_TTL_MINUTES=20
FAILED_LOGIN_LIMIT=5
ACCOUNT_LOCK_MINUTES=30
RATE_LIMIT_DEFAULT=
RATE_LIMIT_AUTH=

COURSE_AUTHORISATION_DEFAULT_TTL_HOURS=72
COURSE_AUTHORISATION_CODE_LENGTH=12
ATTENDANCE_QR_ROTATION_SECONDS=15

LOG_LEVEL=info
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
METRICS_ENABLED=true

TEMP_BIOMETRIC_CAPTURE_RETENTION_HOURS=24
IMPORT_QUARANTINE_RETENTION_HOURS=24
REPORT_RETENTION_HOURS=72
```

Validate environment variables at startup and fail fast on missing production requirements.

---

# 27. DATABASE MIGRATIONS AND SEED SAFETY

- All schema changes must be migrations.
- Migrations must apply cleanly to an empty DB.
- Migrations must be reversible when practical.
- Never use destructive reset commands in production scripts.
- Seed must refuse to run in production.
- Add a script to verify migration status.
- Document backup requirements before destructive migration.

---

# 28. CI/CD AND QUALITY GATES

Provide a CI workflow that runs:

1. install with lockfile;
2. format check;
3. lint;
4. TypeScript compile/type check;
5. Prisma schema validation;
6. migration deploy against ephemeral PostgreSQL;
7. unit tests;
8. integration tests;
9. end-to-end tests;
10. coverage threshold;
11. dependency vulnerability audit;
12. Docker image build.

Do not deploy when any gate fails.

---

# 29. BACKUP, RECOVERY, AND RETENTION READINESS

Phase 1 must provide infrastructure-facing readiness even if the cloud platform performs backups.

Implement/document:

- database backup schedule configuration;
- last successful backup status ingestion or Admin-visible placeholder backed by real operational data;
- restore-request permission boundary;
- object-storage versioning recommendation;
- retention jobs;
- export cleanup;
- temporary biometric capture cleanup;
- runbook for database restore;
- runbook for compromised credentials;
- runbook for lost signing keys;
- rollback steps for failed deployment.

Do not provide a fake “backup successful” value.

---

# 30. PERFORMANCE TARGETS

Design and test for:

- 50 Students scanning within a 2-minute window for the initial Section;
- hundreds of concurrent Attendance Sessions across future institutions;
- paginated Admin lists with thousands of Students;
- asynchronous large report generation;
- import preview of at least 5,000 rows;
- no N+1 query patterns in dashboard/report endpoints.

Initial targets under normal development hardware:

- simple read API p95 below 300 ms;
- ordinary write API p95 below 500 ms excluding external email/storage latency;
- duplicate attendance retry response below 300 ms;
- health endpoint below 200 ms;
- report endpoints return job acceptance quickly instead of blocking for large exports.

Record benchmark methodology; do not invent performance claims.

---

# 31. DOCUMENTATION DELIVERABLES

Create:

- `README.md` — setup, commands, architecture summary;
- `docs/architecture.md` — modules and dependency boundaries;
- `docs/data-model.md` — entity hierarchy and relationship explanation;
- `docs/permissions.md` — role/permission matrix;
- `docs/attendance-rules.md` — status and formula rules;
- `docs/security.md` — auth, tokens, encryption, redaction;
- `docs/data-retention.md` — biometric, logs, imports, exports;
- `docs/api-errors.md` — stable error catalogue;
- `docs/events.md` — domain event and Alert template catalogue;
- `docs/runbook.md` — operational response and recovery;
- Swagger/OpenAPI;
- sample API collection or generated client instructions.

---

# 32. DEFINITION OF DONE

Do not mark Phase 1 complete until every item is satisfied.

## Architecture and schema

- [ ] Modular NestJS project created or correctly extended.
- [ ] Complete hierarchy implemented, including Batch, Subject Offering, Course Offering, Timetable Rule, Scheduled Class, and Attendance Session separation.
- [ ] No institutional master data is hardcoded.
- [ ] Migrations work on a clean DB.
- [ ] Development seed works and is blocked in production.
- [ ] Explicit indexes and constraints exist.

## Authentication and security

- [ ] Admin auth, refresh rotation, password reset, session revoke, and MFA implemented.
- [ ] RBAC and tenant scoping enforced server-side.
- [ ] Out-of-scope records return 404.
- [ ] Rate limiting implemented.
- [ ] secrets and PII are redacted.
- [ ] face embeddings cannot be returned through APIs.
- [ ] temporary captures have cleanup jobs.

## Admin functionality

- [ ] All institutional CRUD modules implemented.
- [ ] Teacher onboarding administration implemented.
- [ ] Student import, approval, and verification queue implemented.
- [ ] Course Authorisation lifecycle implemented.
- [ ] Course Offering approval and registration rules implemented.
- [ ] Timetable conflicts and Scheduled-Class generation implemented.
- [ ] Calendar, Holiday, Special Working Day, cancellation, and reschedule rules implemented.
- [ ] Attendance policy and read/oversight APIs implemented.
- [ ] Manual entry and Correction final approval workflows implemented.
- [ ] reports and exports implemented.
- [ ] system-generated Alerts implemented with no compose endpoint.
- [ ] Security Centre and Audit viewer implemented.

## Correctness

- [ ] attendance formulas pass all edge cases.
- [ ] dates before Teaching Start are NA.
- [ ] 28/29/30/31-day handling passes.
- [ ] multiple classes per day are counted individually.
- [ ] QR token is reusable by multiple eligible Students during its validity but one result per Student.
- [ ] duplicate attendance is idempotent.
- [ ] no direct Attendance Record overwrite endpoint exists.
- [ ] original Attendance status is preserved after correction.
- [ ] Teacher recommendation and Admin final decision separation is enforced.

## Quality

- [ ] lint passes.
- [ ] type check passes.
- [ ] unit tests pass.
- [ ] integration tests pass.
- [ ] end-to-end tests pass.
- [ ] coverage thresholds pass.
- [ ] Swagger is accurate.
- [ ] Docker Compose starts required local services.
- [ ] CI workflow passes.
- [ ] no critical TODO or mock remains.

## Scope

- [ ] no chat table or endpoint.
- [ ] no message table or endpoint.
- [ ] no announcement composer.
- [ ] no post/comment/reply.
- [ ] no assignment or submission.
- [ ] no study-material or syllabus upload.
- [ ] no Correction attachment.
- [ ] no arbitrary Alert body.

---

# 33. REQUIRED FINAL AGENT RESPONSE

After implementation, provide a final engineering report containing:

1. What was implemented.
2. Architecture decisions.
3. Files and modules created or changed.
4. Database migrations created.
5. API groups completed.
6. Test results with actual counts.
7. Coverage results.
8. Commands to run locally.
9. Required environment variables.
10. Seed credentials or safe development login procedure.
11. Known limitations that genuinely remain.
12. Confirmation that forbidden LMS/communication features do not exist.
13. Confirmation that no institutional value is hardcoded.
14. Confirmation that all sensitive data is redacted from logs and responses.

Do not provide a vague summary such as “backend completed.” Include verifiable evidence from commands and test output.

---

# 34. FINAL IMPLEMENTATION DIRECTIVE

Build Phase 1 completely. Do not stop at schema generation, placeholder controllers, mock repositories, or empty service methods.

Prioritise correctness, security, privacy, tenant isolation, auditability, and future compatibility with the Teacher and Student phases.

When a requirement is ambiguous, choose the implementation that:

1. preserves the strict attendance-only scope;
2. minimises personal-data collection;
3. prevents unauthorised access;
4. preserves historical audit evidence;
5. avoids hardcoding;
6. supports future multi-institution scale;
7. fails closed rather than allowing an unsafe action.

**Begin by inspecting the repository, validating the chosen stack, documenting the implementation order, and then implementing the system module by module until every Definition-of-Done item passes.**

# Phase 1 Timetable Integration Requirements

## Status

Approved requirement. This document is the implementation contract for the initial timetable integration. It must be delivered against a real database and protected API; it must not use browser storage, mock rows, generated attendance, or hard-coded runtime data.

Calendar eligibility is a mandatory dependency. See `docs/phase-1-academic-calendar-integration.md`; Scheduled Class generation and Attendance Session creation must use its server-side eligibility result.

## Source and scope

- Source reference: `PWC/CSA/TT-01/26`
- Effective from: 01 July 2026
- Time zone: `Asia/Kolkata`
- Included academic scope:
  - MCA I -> First Academic Year -> Semester I -> Section A
  - MCA III -> Second Academic Year -> Semester III -> Section A
- Excluded rows: PGDCA and Others must not be imported as MCA Course Offerings.

### Confirmed Semester III boundaries

For MCA 2025-2027, Second Academic Year, Semester III, Section A:

```text
semester_start_date: 2026-07-01
teaching_start_date: 2026-07-01
attendance_start_date: 2026-07-01
semester_end_date: 2026-11-15
```

Dates must be treated as `NA` before 01 July 2026 and after 15 November 2026. The Academic Calendar can still block normal classes during applicable holidays, vacations, cancellations, and the Semester III examination window.

The initial institution is Patna Women's College, Department of Computer Applications, Master of Computer Applications. It is seed data only: the data model must continue to support additional institutions and academic structures without schema changes.

## Required academic distinctions

The following entities are distinct and must use foreign-key relationships:

```text
Organisation -> College -> Department -> Programme -> Curriculum
-> Academic Session -> Batch/Cohort -> Academic Year -> Semester -> Section
-> Subject Offering -> Course Offering
```

- Batch is not Academic Session.
- Academic Year is not Semester.
- Curriculum Subject is not Course Offering.
- Department is not Programme.

## Curriculum source

Use the MCA Course Structure effective from 2025. The timetable can resolve only the following displayed curriculum codes:

### Semester I

| Code | Subject |
| --- | --- |
| CC101 | Software Engineering |
| CC102 | Advanced Database Management System |
| CC103 | Design & Analysis of Algorithm |
| CC104 | Data Communications & Computer Networks |
| CC105 | Python Programming |
| SEC101 | Data Visualization |

### Semester III

| Code | Subject |
| --- | --- |
| CC310 | Advanced Web Designing using J2EE |
| CC311 | Cloud Computing |
| CC312 | Big Data Analytics |
| CC313 | Mini Project II (Lab) |
| MDC302 | Digital Marketing and E-Commerce |
| MAEC302 | Human Values & Professional Ethics and Gender Sensitization |
| SEC303 | Industrial Visit and Technical Report Writing |

No periods may be invented for curriculum Subjects absent from the timetable source.

## Teacher aliases and identity safeguards

Create a `teacher_aliases` model. Aliases are timetable import values only; they must never be used as employee IDs, usernames, login identities, or canonical display names.

| Alias | Candidate Teacher |
| --- | --- |
| PK | Praveen Kumar |
| RV | Richa Verma |
| BKP | Braj Kishor/Braj Kishore Prasad |
| SC | Sushmita Chakraborty |
| BS | Bhawna Sinha |

Create Admin validation tasks; do not silently overwrite canonical identity data:

| Teacher | Validation task |
| --- | --- |
| Praveen Kumar | `TITLE_CONFIRMATION_REQUIRED` because the timetable calls the teacher Dr. Praveen Kumar while prior data says Mr. Praveen Kumar |
| Sushmita Chakraborty | `TITLE_CONFIRMATION_REQUIRED` because the timetable calls the teacher Dr. Sushmita Chakraborty |
| Braj Kishor Prasad | `NAME_SPELLING_CONFIRMATION_REQUIRED` because the timetable uses Kishore |

Until confirmation, Teacher assignments may use the resolved timetable alias and source display label, but must not activate a canonical login identity or alter the existing profile name/title.

Store `HOD` as an effective-dated administrative role for Bhawna Sinha, not as part of her name.

Richa Verma remains primarily in Computer Science. Create a cross-department assignment to Department of Computer Applications with source `PWC/CSA/TT-01/26`; do not change her primary department.

## Reusable periods

| Code | Time |
| --- | --- |
| P1 | 09:15-10:10 |
| P2 | 10:10-11:05 |
| P3 | 11:05-12:00 |
| P4 | 12:00-12:55 |
| Lunch | 12:55-13:25 |
| P5 | 13:25-14:20 |
| P6 | 14:20-15:15 |

Lunch must never create a Timetable Rule, Scheduled Class, or Attendance Session.

## Timetable rules

Import the supplied recurring rules for MCA I/Semester I/Section A and MCA III/Semester III/Section A with their day, period, curriculum code, component, and Teacher aliases.

The following rules require special status handling:

| Scope | Day | Period | Source | Required status |
| --- | --- | --- | --- | --- |
| MCA III | Friday | P2 | `CC301`, PK | Confirmed Admin mapping: resolve to curriculum code `CC310`; retain `CC301` in source metadata and audit history |
| MCA I | Saturday | P3-P4 | Coding Lab | `NON_CURRICULUM_SCHEDULED_ACTIVITY`, `attendance_tracking_enabled=false`, `ADMIN_REVIEW_REQUIRED` |
| MCA I | Saturday | P5-P6 | Personality Development | `NON_CURRICULUM_SCHEDULED_ACTIVITY`, `attendance_tracking_enabled=false`, `ADMIN_REVIEW_REQUIRED` |

The original source used `CC301`, but the Admin has confirmed that Friday MCA III P2 maps to `CC310`. Import it as `CC310` with PK after Teacher account/assignment approval, while preserving the original source code in import metadata and the audit log.

## Multi-Teacher rules

Create `timetable_rule_teachers`:

```text
timetable_rule_id
teacher_account_id
teacher_role
is_primary
can_start_attendance
can_close_attendance
can_view_live_attendance
effective_from
effective_to
```

Supported roles:

```text
PRIMARY
CO_TEACHER
PROJECT_SUPERVISOR
LAB_INSTRUCTOR
SUPPORTING_FACULTY
```

One timetable period creates one Scheduled Class and, at most, one Attendance Session. Multiple authorized Teachers can assist or view it; only an authorized Teacher can start or close it.

## Scheduled-class generation

Generate a Scheduled Class only when all conditions are true:

```text
Active Timetable Rule
+ Semester teaching dates
+ Academic Calendar eligibility
+ Course Offering validity
+ Teacher conflict validation
+ Section conflict validation
+ Room conflict validation
```

Blocked dates include official and institutional holidays, vacations, applicable examination periods, weekly off days without a special working day, cancelled classes, and dates outside the teaching period.

No blocked date may create an Attendance Session or an Absent Attendance Record.

## Required real backend models

- TeacherAlias
- TimetablePeriod
- TimetableRule
- TimetableRuleTeacher
- TimetableImport
- TimetableImportIssue
- SubjectOffering
- CourseOffering
- ScheduledClass
- AcademicCalendarEvent
- TeacherDepartmentAssignment
- AdministrativeRoleAssignment
- AuditLog

## Required API capability

- Import preview and validation
- Teacher-alias resolution
- Curriculum-subject-code resolution
- Conflict detection
- Admin approval/rejection of import issues
- Timetable Rule queries
- Scheduled Class generation and queries
- Calendar eligibility checks
- Real audit entries
- OpenAPI/Swagger documentation

Every implementation must use real database operations. Placeholder services such as `dto: any`, `return []`, `return dto`, or `return { id }` are prohibited.

## Minimum acceptance tests

- PK, RV, BKP, SC, and BS aliases resolve correctly.
- MCA I resolves to Semester I; MCA III resolves to Semester III.
- Lunch generates no class.
- Monday MCA I P1 resolves to CC101 with RV.
- Monday MCA III P5 creates one class with BS, PK, and BKP.
- Tuesday MCA I P5 resolves to CC104 Practical with BKP.
- Wednesday MCA I P6 resolves to SEC101 Theory with BS.
- Friday MCA III P2 resolves to CC310 with PK and preserves CC301 as the original timetable-source value.
- Saturday MCA III P3 resolves to CC313 with BS and SC.
- Holiday and vacation dates prevent Scheduled Class generation.
- A multi-Teacher class creates only one Attendance Session.
- Richa Verma remains primarily in Computer Science.

## Phase gate

Phase 1 is incomplete until timetable APIs return real persisted data and Scheduled Classes are correctly generated from approved Timetable Rules and calendar eligibility.

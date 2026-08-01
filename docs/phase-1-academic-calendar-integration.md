# Phase 1 Academic Calendar Integration Requirements

## Status and source identity

Approved Phase 1 requirement. The Academic Calendar is a scheduling and attendance-eligibility domain backed by real persisted data. It is not a decorative frontend calendar and the source PDF is not the runtime source of truth after reviewed structured import.

The supplied file name and its content disagree. Preserve both values until an Admin confirms the metadata:

```text
source_file_name: Academic-Calendar-2025-26.pdf
calendar_display_name: Patna Women's College Academic Calendar 2026-2027
calendar_start_date: 2026-06-01
calendar_end_date: 2027-05-31
timezone: Asia/Kolkata
source_status: official institutional calendar supplied by the project owner
```

Suggested calendar seed code: `PWC-ACAD-CAL-2026-27`.

## Required models

### AcademicCalendar

```text
id, organisation_id, college_id, name, code, academic_session_id nullable,
calendar_start_date, calendar_end_date, timezone, source_file_name,
source_document_ref nullable, source_version, status, is_official,
approved_by_admin_id nullable, approved_at nullable, created_at, updated_at, deleted_at
```

Allowed statuses: `draft`, `under_review`, `active`, `superseded`, `archived`.

### AcademicCalendarEvent

```text
id, academic_calendar_id, organisation_id, college_id, campus_id nullable,
department_id nullable, programme_id nullable, academic_session_id nullable,
batch_id nullable, academic_year_id nullable, semester_id nullable, section_id nullable,
title, event_type, event_category, description nullable,
start_date, end_date, start_time nullable, end_time nullable, is_all_day,
scope_type, blocks_regular_classes, allows_attendance_sessions, counts_as_working_day,
attendance_display_code nullable, is_tentative, is_lunar_date,
requires_admin_confirmation, source_page nullable, source_label nullable,
source_payload jsonb nullable, status, created_by_admin_id nullable,
approved_by_admin_id nullable, approved_at nullable, created_at, updated_at, deleted_at
```

Controlled event types:

```text
TEACHING_DAY, REGULAR_CLASSES_BEGIN, COLLEGE_REOPENING, WEEKLY_OFF,
OFFICIAL_HOLIDAY, INSTITUTIONAL_HOLIDAY, DEPARTMENT_HOLIDAY,
RESTRICTED_HOLIDAY, VACATION, EXAMINATION, ORIENTATION, GENERAL_ASSEMBLY,
PARENT_TEACHER_MEETING, COLLEGE_EVENT, DEPARTMENT_EVENT, WORKSHOP, SEMINAR,
COMPETITION, AWARENESS_EVENT, SPECIAL_WORKING_DAY, CLASS_SUSPENSION,
OFFICE_OPEN_NO_CLASSES, OTHER_INFORMATIONAL
```

Scope types: `COLLEGE`, `CAMPUS`, `DEPARTMENT`, `PROGRAMME`, `ACADEMIC_SESSION`, `BATCH`, `ACADEMIC_YEAR`, `SEMESTER`, `SECTION`, `COURSE_OFFERING`.

## Eligibility engine

Implement server-side `CalendarEligibilityService`. The frontend must never decide whether a class or Attendance Session is allowed.

Precedence, highest first:

```text
1. Explicit Course Offering class cancellation
2. Applicable holiday
3. Applicable vacation
4. Applicable examination block
5. Explicit class suspension
6. Approved Special Working Day override
7. Weekly-off policy
8. Active timetable rule and Scheduled Class existence
9. Teaching-start and attendance-start boundaries
10. Permitted manual Admin override
```

Return a structured result such as:

```json
{
  "date": "2026-10-20",
  "is_class_eligible": false,
  "is_attendance_eligible": false,
  "reason_code": "OFFICIAL_HOLIDAY",
  "reason": "Date falls inside the Durga Puja holiday period.",
  "calendar_event_id": "uuid",
  "requires_admin_override": false
}
```

The result code must be one of `ELIGIBLE_SCHEDULED_CLASS`, `NO_SCHEDULED_CLASS`, `BEFORE_TEACHING_START`, `AFTER_SEMESTER_END`, `WEEKLY_OFF`, `OFFICIAL_HOLIDAY`, `INSTITUTIONAL_HOLIDAY`, `VACATION`, `EXAMINATION_BLOCK`, `CLASS_CANCELLED`, `CLASS_SUSPENDED`, `SPECIAL_WORKING_DAY`, `ADMIN_OVERRIDE_REQUIRED`, `CALENDAR_NOT_CONFIGURED`, or `CALENDAR_CONFLICT`.

## Attendance representation

Never create an Absent record for a holiday, weekly off, vacation, pre-teaching date, post-semester date, blocked examination date, date with no Scheduled Class, or cancelled class.

Matrix values are derived from calendar, schedule, and Attendance Record data:

```text
1 = Present; 0 = Absent; H = holiday/institutional holiday/vacation;
C = cancelled class; NA = no applicable class; E = excused;
P = pending review; M = manually corrected; L = late when enabled.
```

Weekly-off display may use `H` only by College display policy; its actual event type remains `WEEKLY_OFF`. The percentage denominator includes only final conducted classes.

Initial working-week recommendation, pending Admin confirmation:

```text
Sunday: Weekly Off
Monday-Saturday: Potential working days
```

## Official class-impacting seed events

Every record retains its source page and original source label. Lunar/festival dates identified below as tentative must have `is_lunar_date=true`, `is_tentative=true`, and `requires_admin_confirmation=true`.

| Dates | Event | Type / scope effect |
| --- | --- | --- |
| 2026-06-01 to 2026-06-20 | Summer Vacation | `VACATION`, college, blocks classes, `H` |
| 2026-06-22 | College reopens | marker only; classes require timetable and Semester applicability |
| 2026-06-26 to 2026-06-27 | Muharram | tentative `OFFICIAL_HOLIDAY`, `H` |
| 2026-06-29 | Kabir Jayanti | `OFFICIAL_HOLIDAY`, `H` |
| 2026-07-01 | Regular classes begin | MCA Semesters I and III only |
| 2026-07-16 | Mt. Carmel Feast Day | `INSTITUTIONAL_HOLIDAY`, `H` |
| 2026-08-04, 15, 24, 26, 28 | Chehallum; Independence Day; Savan Last Somwar; Hazrat Mohammad Sahab ka Janam Diwas; Raksha Bandhan | `OFFICIAL_HOLIDAY`, tentative where religious/lunar confirmation applies |
| 2026-09-04, 17, 25 | Sri Krishna Janmashtami; Vishwakarma Puja; Anant Chaturdashi | `OFFICIAL_HOLIDAY`, `H` |
| 2026-09-07 to 2026-09-12 | Mid-Semester Examination | `EXAMINATION`, applies MCA Semester III, not Semester I |
| 2026-10-02, 11, 15, 17, 19 to 21 | Gandhi Jayanti; Durga Puja/JPN Jayanti; St Teresa Feast; Durga Puja/SKS Jayanti; holiday period | applicable holidays/vacation, blocks classes |
| 2026-10-22 | College reopens | marker only |
| 2026-10-26 to 2026-10-31 | UG Semesters V/VII examination | does not block MCA automatically |
| 2026-11-01 to 2026-11-07 | End-Semester Examination | applies MCA Semester III; blocks normal classes |
| 2026-11-08 to 2026-11-16 | Diwali/Chitragupta/Bhai Dooj/Chhath holiday period | `VACATION`, `H` |
| 2026-11-17 | College reopens | marker only |
| 2026-11-21 to 2026-11-28 | End-Semester Examination | applies MCA Semester I |
| 2026-11-24 | Guru Nanak Jayanti/Kartik Purnima | `OFFICIAL_HOLIDAY`; overrides exam scheduling unless revised |
| 2026-12-03, 25 | Dr Rajendra Prasad Jayanti; Christmas | `OFFICIAL_HOLIDAY`, `H` |
| 2026-12-26 to 2026-12-31 | Winter Vacation | `VACATION`, `H` |
| 2027-01-01, 14, 24, 26 | New Year; Makar Sankranti; Karpuri Thakur Jayanti/Shab-e-Barat; Republic Day | `OFFICIAL_HOLIDAY`; 24 Jan tentative lunar |
| 2027-02-11, 20 | Basant Panchmi; Sant Ravidas Jayanti | `OFFICIAL_HOLIDAY` |
| 2027-02-16 to 2027-02-23 | Mid-Semester Examination | applies MCA Semesters II and IV; 20 Feb remains holiday |
| 2027-03-06, 10, 22, 23, 26 | Maha Shivratri; Eid ul-Fitr; Bihar Diwas/Holi; Holi; Good Friday | `OFFICIAL_HOLIDAY`; Eid tentative lunar |
| 2027-04-14, 15, 19, 23 | Ashoka/Ambedkar Jayanti; Ram Navami; Mahavir Jayanti; Veer Kunwar Singh Jayanti | `OFFICIAL_HOLIDAY` |
| 2027-04-17, 20 to 22, 24, 26 | UG Semester VI/VIII examinations | does not block MCA automatically |
| 2027-04-29 to 2027-04-30 and 2027-05-02 to 2027-05-08 | End-Semester Examination | applies MCA Semester IV; preserve exclusions from official calendar |
| 2027-05-09 to 2027-05-15 | End-Semester Examination | applies MCA Semester II; no examination on 14 May |
| 2027-05-01, 14, 17 to 18, 20 | May Day; Janaki Navami; Eid ul-Adha/Bakrid; Buddha Purnima | `OFFICIAL_HOLIDAY`; Eid tentative lunar |
| 2027-05-22 to 2027-05-31 | Summer Vacation | `VACATION`, `H` |
| 2027-05-25 | Office remains open | `OFFICE_OPEN_NO_CLASSES`, remains inside vacation and never permits Student Attendance |

## Informational events and exams

Workshops, seminars, competitions, awareness days, guest lectures, parent-teacher meetings, assemblies, celebrations, and Department events are imported as structured events. By default they permit regular classes and Attendance Sessions unless the official source or an authorized Admin explicitly sets `blocks_regular_classes=true`.

Regular class Attendance and examination presence are separate. Version 1 blocks regular class Attendance on applicable examination dates; it does not create examination Attendance.

## Tentative-date and conflict workflow

For every lunar/tentative event: Admin confirmation can confirm, move, or cancel the event; then affected Scheduled Classes are recalculated, conflicts are shown, structured system alerts are generated, and the old/new values are audited. No date may shift silently.

Changing a holiday, vacation, examination, or Special Working Day must preview affected classes, Course Offerings, Teachers, Students, and Attendance Sessions. The Admin selects an approved resolution inside a transaction; no resulting change converts Students to Absent.

## APIs and interfaces

Required protected APIs:

```text
GET/POST /api/v1/academic-calendars
GET/PATCH /api/v1/academic-calendars/:id
POST /api/v1/academic-calendars/:id/activate
POST /api/v1/academic-calendars/:id/archive
GET/POST /api/v1/calendar-events
GET/PATCH /api/v1/calendar-events/:id
POST /api/v1/calendar-events/:id/cancel|confirm|change-date
GET /api/v1/calendar/eligibility|day/:date|month|year|conflicts
POST /api/v1/calendar/import
GET /api/v1/calendar/import/:jobId/preview
POST /api/v1/calendar/import/:jobId/commit
POST /api/v1/calendar/recalculate-scheduled-classes
POST /api/v1/calendar/conflicts/:id/resolve
```

All APIs require authentication, RBAC, institutional scope validation, audit logging, OpenAPI documentation, and unit/integration tests.

Admin needs month, week, agenda, year, and list views; import preview; class-impact conflict preview; and event editing. Teachers see only applicable events and may request replacement/extra classes. Students see only their applicable teaching days, schedule changes, holidays, vacations, exam windows, and correction deadlines.

## Minimum tests and phase gate

Test Holiday/Vacation blocking, informational-event non-blocking, Semester-scoped examinations, holiday-over-exam precedence, office-open-without-classes, special Sunday working day, lunar-date recalc, duplicate imports, deterministic overlaps, and role-scoped calendar visibility.

Specific assertions include: 2026-07-16 is an institutional holiday; 2026-09-04 is an official holiday; 2026-10-22 and 2026-11-17 are reopening markers; 2026-11-10 and 2026-12-29 are vacation; 2027-04-20 does not block MCA unless scoped; 2027-05-05 blocks MCA Semester IV; 2027-05-11 blocks MCA Semester II; 2027-05-14 is a holiday; and 2027-05-25 is office-open/no-classes inside vacation.

Phase 1 is incomplete until the official 2026-2027 calendar and class-impacting events are persisted, the eligibility API governs timetable generation and Attendance-session creation, blocked dates never create Absences, and tests, migrations, seed data, lint, build, Swagger, and audit logging pass.

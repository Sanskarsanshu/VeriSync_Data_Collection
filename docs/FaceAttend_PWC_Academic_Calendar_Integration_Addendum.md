# FaceAttend - PWC Academic Calendar Integration Addendum

> Paste this entire addendum into Antigravity after the previously approved PWC MCA scope reply.  
> This addendum is mandatory for Phase 1 backend completion and Phase 2 Admin Frontend integration.

---

# 1. Important Source Clarification

The uploaded file is named `Academic-Calendar-2025-26.pdf`, but the cover and all monthly pages inside the document identify it as the **Patna Women's College Academic Calendar 2026-2027**.

Treat the official calendar content as:

```text
Institution: Patna Women's College
Calendar title: Academic Calendar 2026-2027
Calendar start: June 2026
Calendar end: May 2027
Source status: Official institutional calendar supplied by the project owner
```

Do not silently rename the source file. Store both:

```text
source_file_name = "Academic-Calendar-2025-26.pdf"
calendar_display_name = "Patna Women's College Academic Calendar 2026-2027"
```

The Admin must be able to confirm or correct this metadata before production activation.

---

# 2. Objective

Integrate the official PWC Academic Calendar into FaceAttend so that the system can automatically determine:

- Which dates are regular teaching days
- Which dates are official holidays
- Which dates are weekly offs
- Which dates fall inside Summer or Winter Vacation
- Which dates are examination dates
- Which dates are College reopening dates
- Which dates are Special Working Days
- Which dates contain informational College events but still permit classes
- Which dates block attendance-session creation
- Which dates allow attendance because an approved class is scheduled
- Which dates must display `H`, `C`, or `NA` in attendance views
- Which dates require special Admin approval before a class can be conducted

The Academic Calendar must be connected to:

- Academic Sessions
- Batches/Cohorts
- Academic Years
- Semesters
- Sections
- Subject Offerings
- Course Offerings
- Timetable Rules
- Scheduled Classes
- Attendance Sessions
- Attendance Sheets
- Attendance Analytics
- Student and Teacher calendar views
- System-generated alerts

The PDF must not remain only as a downloadable document. Its operational dates must exist as structured database records.

---

# 3. Calendar Design Principle

Do not treat every event written in the official calendar as a holiday.

The source contains:

1. Official holidays
2. Institutional holidays
3. Vacation ranges
4. Examination periods
5. College reopening dates
6. Regular-class start dates
7. Parent-Teacher meetings
8. General Assemblies
9. College celebrations
10. Departmental events
11. Workshops
12. Seminars
13. Competitions
14. Awareness days
15. Informational observances

Only records explicitly configured to block classes must prevent attendance.

Example:

```text
World Environment Day event:
- Informational/department event
- Does not automatically block regular classes

Mt. Carmel Feast Day:
- Institutional Holiday
- Blocks regular classes and attendance

End Semester Examination:
- Blocks normal classes only for the applicable Programme/Semester/Section
- Does not automatically block unrelated Semesters

College reopens:
- Operational marker
- Allows normal scheduling from that date

General Assembly:
- College event
- Does not automatically cancel all classes unless configured
```

---

# 4. Required Calendar Data Model

## 4.1 `academic_calendars`

Create or verify an `academic_calendars` entity.

Required fields:

```text
id
organisation_id
college_id
name
code
academic_session_id nullable
calendar_start_date
calendar_end_date
timezone
source_file_name
source_document_ref nullable
source_version
status
is_official
approved_by_admin_id
approved_at
created_at
updated_at
deleted_at
```

Suggested status values:

```text
draft
under_review
active
superseded
archived
```

Example seed:

```text
name: Patna Women's College Academic Calendar 2026-2027
code: PWC-ACAD-CAL-2026-27
calendar_start_date: 2026-06-01
calendar_end_date: 2027-05-31
timezone: Asia/Kolkata
is_official: true
status: active
```

## 4.2 `academic_calendar_events`

Required fields:

```text
id
academic_calendar_id
organisation_id
college_id
campus_id nullable
department_id nullable
programme_id nullable
academic_session_id nullable
batch_id nullable
academic_year_id nullable
semester_id nullable
section_id nullable

title
event_type
event_category
description nullable

start_date
end_date
start_time nullable
end_time nullable
is_all_day

scope_type
blocks_regular_classes
allows_attendance_sessions
counts_as_working_day
attendance_display_code nullable
is_tentative
is_lunar_date
requires_admin_confirmation

source_page nullable
source_label nullable
source_payload jsonb nullable

status
created_by_admin_id nullable
approved_by_admin_id nullable
approved_at nullable
created_at
updated_at
deleted_at
```

## 4.3 Event Types

Use controlled event types:

```text
TEACHING_DAY
REGULAR_CLASSES_BEGIN
COLLEGE_REOPENING
WEEKLY_OFF
OFFICIAL_HOLIDAY
INSTITUTIONAL_HOLIDAY
DEPARTMENT_HOLIDAY
RESTRICTED_HOLIDAY
VACATION
EXAMINATION
ORIENTATION
GENERAL_ASSEMBLY
PARENT_TEACHER_MEETING
COLLEGE_EVENT
DEPARTMENT_EVENT
WORKSHOP
SEMINAR
COMPETITION
AWARENESS_EVENT
SPECIAL_WORKING_DAY
CLASS_SUSPENSION
OFFICE_OPEN_NO_CLASSES
OTHER_INFORMATIONAL
```

Do not store raw event-type strings without validation.

## 4.4 Scope Types

```text
COLLEGE
CAMPUS
DEPARTMENT
PROGRAMME
ACADEMIC_SESSION
BATCH
ACADEMIC_YEAR
SEMESTER
SECTION
COURSE_OFFERING
```

A calendar event may apply to the whole College or only a specific MCA Semester.

---

# 5. Class Eligibility Decision Engine

Create a server-side `CalendarEligibilityService`.

The frontend must never decide independently whether attendance is allowed.

For a proposed Scheduled Class or Attendance Session, evaluate this precedence:

```text
1. Explicit class cancellation for the Course Offering and date
2. Active College/Programme/Semester holiday
3. Active vacation range
4. Applicable examination block
5. Explicit class suspension
6. Special Working Day override
7. Weekly-off policy
8. Timetable rule and Scheduled Class existence
9. Teaching-start and attendance-start boundaries
10. Manual Admin override, when policy permits
```

Return a structured result:

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

Possible reason codes:

```text
ELIGIBLE_SCHEDULED_CLASS
NO_SCHEDULED_CLASS
BEFORE_TEACHING_START
AFTER_SEMESTER_END
WEEKLY_OFF
OFFICIAL_HOLIDAY
INSTITUTIONAL_HOLIDAY
VACATION
EXAMINATION_BLOCK
CLASS_CANCELLED
CLASS_SUSPENDED
SPECIAL_WORKING_DAY
ADMIN_OVERRIDE_REQUIRED
CALENDAR_NOT_CONFIGURED
CALENDAR_CONFLICT
```

---

# 6. Attendance Representation Rules

The Academic Calendar and official Attendance Record are related but not identical.

## 6.1 Do Not Create Fake Student Absence Records

Never create `Absent` attendance for:

- Holidays
- Weekly offs
- Vacation days
- Dates before teaching begins
- Dates after the Semester ends
- Examination-blocked dates where no normal class occurred
- Dates with no Scheduled Class
- Cancelled classes

## 6.2 Matrix Display Rules

The Attendance Sheet may derive display values from the calendar:

```text
1  = Present
0  = Absent
H  = Official Holiday / Institutional Holiday / Vacation day
C  = Cancelled Scheduled Class
NA = Date outside the applicable teaching period or no applicable class
E  = Excused, according to College policy
P  = Pending Review
M  = Manually Corrected
L  = Late, only if enabled
```

Weekly offs must be excluded from the denominator. They may be rendered as `H` in the monthly matrix only if the College chooses that display policy, but the underlying calendar event must remain `WEEKLY_OFF`, not `OFFICIAL_HOLIDAY`.

## 6.3 Percentage Formula

```text
Attendance Percentage =
Present-equivalent conducted classes
÷
Final conducted classes
× 100
```

Do not include:

- Holidays
- Weekly offs
- Vacations
- Cancelled classes
- `NA`
- Non-applicable examinations

---

# 7. PWC Weekly Working-Day Policy

Do not assume Saturday or Sunday rules from code constants.

Store the College working-week policy in data.

Initial recommendation for seed configuration:

```text
Sunday: Weekly Off
Monday-Saturday: Potential working days
```

However, the Admin must confirm this from the official PWC policy before production activation.

A Saturday with no timetable is not automatically an Attendance day.

A Sunday may become a class day only through an approved `SPECIAL_WORKING_DAY` plus an approved Scheduled Class.

---

# 8. Official PWC Calendar Seed - Class-Impacting Dates

The following dates are extracted from the supplied PWC Academic Calendar 2026-2027 and must be created as structured seed records.

All records must retain `source_page` and the original source label.

## 8.1 June 2026

### Summer Vacation / Holiday Period

```text
2026-06-01 through 2026-06-20
Type: VACATION
Title: Summer Vacation
Scope: COLLEGE
blocks_regular_classes: true
allows_attendance_sessions: false
attendance_display_code: H
```

The calendar displays holiday blocks across 1-6, 8-13 and 15-20 June, with Sundays handled separately by weekly-off policy.

### College Reopening

```text
2026-06-22
Type: COLLEGE_REOPENING
Title: College re-opens after Summer Vacation
blocks_regular_classes: false
allows_attendance_sessions: dependent on Timetable and Semester applicability
```

### Muharram

```text
2026-06-26 through 2026-06-27
Type: OFFICIAL_HOLIDAY
Title: Muharram
is_lunar_date: true
is_tentative: true
requires_admin_confirmation: true
blocks_regular_classes: true
attendance_display_code: H
```

### Kabir Jayanti

```text
2026-06-29
Type: OFFICIAL_HOLIDAY
Title: Kabir Jayanti
blocks_regular_classes: true
attendance_display_code: H
```

## 8.2 July 2026

### Regular Classes Begin

```text
2026-07-01
Type: REGULAR_CLASSES_BEGIN
Title: Regular classes begin - Semesters I, III, V and VII
```

For FaceAttend MCA:

```text
Applicable MCA Semester I
Applicable MCA Semester III
```

Do not apply it to MCA Semester II or IV.

The Academic Session/Batch configuration remains the final source of truth.

### Mt. Carmel Feast Day

```text
2026-07-16
Type: INSTITUTIONAL_HOLIDAY
Title: Mt. Carmel Feast Day
blocks_regular_classes: true
attendance_display_code: H
```

## 8.3 August 2026

```text
2026-08-04 - Chehallum - OFFICIAL_HOLIDAY
2026-08-15 - Independence Day - OFFICIAL_HOLIDAY
2026-08-24 - Savan Last Somwar - OFFICIAL_HOLIDAY
2026-08-26 - Hazrat Mohammad Sahab ka Janam Diwas - OFFICIAL_HOLIDAY
2026-08-28 - Raksha Bandhan - OFFICIAL_HOLIDAY
```

For dates dependent on religious/lunar confirmation:

```text
is_tentative: true where applicable
requires_admin_confirmation: true
```

## 8.4 September 2026

```text
2026-09-04 - Sri Krishna Janmashtami - OFFICIAL_HOLIDAY
2026-09-17 - Vishwakarma Puja - OFFICIAL_HOLIDAY
2026-09-25 - Anant Chaturdashi - OFFICIAL_HOLIDAY
```

### Mid-Semester Examination Window

```text
2026-09-07 through 2026-09-12
Type: EXAMINATION
Title: Mid Semester Examination - Semesters II, III, IV, VII and VIII
is_tentative: true
```

For MCA:

```text
Semester III: applicable
Semester IV: applicable only if the active academic configuration confirms it
Semester I: not listed
Semester II: applicable
```

Do not globally block the whole College. Scope each exam event to the applicable Semester.

## 8.5 October 2026

```text
2026-10-02 - Mahatma Gandhi Jayanti - OFFICIAL_HOLIDAY
2026-10-11 - Durga Puja Kalash Sthapan / Jai Prakash Narayan Jayanti - OFFICIAL_HOLIDAY
2026-10-15 - Feast of St. Teresa of Avila - INSTITUTIONAL_HOLIDAY
2026-10-17 - Durga Puja / Sri Krishna Singh Jayanti - OFFICIAL_HOLIDAY
2026-10-19 through 2026-10-21 - Holiday period - VACATION/HOLIDAY
```

Sunday 18 October is handled by weekly-off policy.

### College Reopening

```text
2026-10-22
Type: COLLEGE_REOPENING
Title: College re-opens
```

### End-Semester Examination

```text
2026-10-26 through 2026-10-31
Type: EXAMINATION
Title: End Semester Examination - Semesters V and VII (UG)
is_tentative: true
```

This does not automatically apply to MCA because the calendar identifies UG Semesters V and VII.

## 8.6 November 2026

### End-Semester Examination - Semester III

```text
2026-11-01 through 2026-11-07
Type: EXAMINATION
Title: End Semester Examination - Semester III (UG/PG/B.Ed.)
is_tentative: true
```

For MCA:

```text
MCA Semester III: applicable
blocks_regular_classes for the affected Semester/Section: true
```

### Festival Holiday Period

```text
2026-11-08 through 2026-11-16
Type: VACATION
Title: Diwali / Chitragupta Puja / Bhai Dooj / Chhath Puja Holiday Period
blocks_regular_classes: true
attendance_display_code: H
```

Sunday 15 November remains a weekly off inside the range.

### College Reopening

```text
2026-11-17
Type: COLLEGE_REOPENING
Title: College re-opens
```

### End-Semester Examination - Semester I

```text
2026-11-21 through 2026-11-28
Type: EXAMINATION
Title: End Semester Examination - Semester I (UG/PG/B.Ed.)
is_tentative: true
```

For MCA:

```text
MCA Semester I: applicable
```

### Guru Nanak Jayanti / Kartik Purnima

```text
2026-11-24
Type: OFFICIAL_HOLIDAY
Title: Guru Nanak Jayanti / Kartik Purnima
blocks_regular_classes: true
attendance_display_code: H
```

The Holiday must override exam scheduling for that date unless the College publishes a revised exam schedule.

## 8.7 December 2026

```text
2026-12-03 - Dr. Rajendra Prasad Jayanti - OFFICIAL_HOLIDAY
2026-12-25 - Christmas Day - OFFICIAL_HOLIDAY
2026-12-26 through 2026-12-31 - Winter Vacation - VACATION
```

Use:

```text
blocks_regular_classes: true
allows_attendance_sessions: false
attendance_display_code: H
```

Sunday 27 December remains weekly off inside the vacation range.

## 8.8 January 2027

```text
2027-01-01 - New Year - OFFICIAL_HOLIDAY
2027-01-14 - Makar Sankranti - OFFICIAL_HOLIDAY
2027-01-24 - Karpuri Thakur Jayanti / Shab-e-Barat - OFFICIAL_HOLIDAY
2027-01-26 - Republic Day - OFFICIAL_HOLIDAY
```

For Shab-e-Barat:

```text
is_lunar_date: true
is_tentative: true
requires_admin_confirmation: true
```

## 8.9 February 2027

```text
2027-02-11 - Basant Panchmi - OFFICIAL_HOLIDAY
2027-02-20 - Sant Ravidas Jayanti - OFFICIAL_HOLIDAY
```

### Mid-Semester Examination Window

```text
2027-02-16 through 2027-02-23
Type: EXAMINATION
Title: Mid Semester Examination - Semesters II, IV, VI and VIII
is_tentative: true
```

For MCA:

```text
MCA Semester II: applicable
MCA Semester IV: applicable
```

The 20 February Holiday must remain a Holiday and may interrupt the exam window.

## 8.10 March 2027

```text
2027-03-06 - Maha Shivratri - OFFICIAL_HOLIDAY
2027-03-10 - Eid ul-Fitr - OFFICIAL_HOLIDAY
2027-03-22 - Bihar Diwas / Holi - OFFICIAL_HOLIDAY
2027-03-23 - Holi - OFFICIAL_HOLIDAY
2027-03-26 - Good Friday - OFFICIAL_HOLIDAY
```

For Eid ul-Fitr:

```text
is_lunar_date: true
is_tentative: true
requires_admin_confirmation: true
```

## 8.11 April 2027

```text
2027-04-14 - Samrat Ashoka Jayanti / Dr. Bhimrao Ambedkar Jayanti - OFFICIAL_HOLIDAY
2027-04-15 - Ram Navami - OFFICIAL_HOLIDAY
2027-04-19 - Mahavir Jayanti - OFFICIAL_HOLIDAY
2027-04-23 - Veer Kunwar Singh Jayanti - OFFICIAL_HOLIDAY
```

### UG Examination Events Not Automatically Applicable to MCA

```text
2027-04-17
2027-04-20 through 2027-04-22
2027-04-24
2027-04-26
```

The calendar labels these as Semester VI/VIII UG examinations.

Do not block MCA classes from these events unless an Admin explicitly broadens the scope.

### MCA Semester IV End-Semester Examination Begins

```text
2027-04-29 through 2027-04-30
Type: EXAMINATION
Title: End Semester Examination - Semester IV (UG/PG/B.Ed.)
is_tentative: true
```

For MCA Semester IV:

```text
applicable: true
```

## 8.12 May 2027

### Semester IV Examination Continuation

```text
2027-05-02 through 2027-05-08
Type: EXAMINATION
Title: End Semester Examination - Semester IV (UG/PG/B.Ed.)
is_tentative: true
```

The source does not show an exam entry on 7 May; retain the actual per-date entries or create a date range with explicit excluded dates.

### Semester II Examination

```text
2027-05-09 through 2027-05-15
Type: EXAMINATION
Title: End Semester Examination - Semester II (UG/PG/B.Ed.)
is_tentative: true
```

The source has:

```text
Exam dates shown on 9, 10, 11, 12, 13 and 15 May.
14 May is a Holiday.
```

Do not schedule an exam on 14 May unless the official calendar is revised.

### Holidays

```text
2027-05-01 - May Day - OFFICIAL_HOLIDAY
2027-05-14 - Janaki Navami - OFFICIAL_HOLIDAY
2027-05-17 through 2027-05-18 - Eid ul-Adha / Bakrid - OFFICIAL_HOLIDAY
2027-05-20 - Buddha Purnima - OFFICIAL_HOLIDAY
```

For Eid ul-Adha:

```text
is_lunar_date: true
is_tentative: true
requires_admin_confirmation: true
```

### Summer Vacation

```text
2027-05-22 through 2027-05-31
Type: VACATION
Title: Summer Vacation
blocks_regular_classes: true
allows_attendance_sessions: false
attendance_display_code: H
```

### Office Open During Vacation

The source states:

```text
Office remains open on 25 May 2027.
```

Create:

```text
2027-05-25
Type: OFFICE_OPEN_NO_CLASSES
Title: Office remains open
counts_as_working_day: true for administrative staff
blocks_regular_classes: true
allows_attendance_sessions: false
```

Do not confuse an open administrative office with an academic teaching day.

---

# 9. Informational Event Import

The official calendar includes many workshops, seminars, competitions, commemorations and Department activities.

Create an import mechanism capable of storing every official event, but apply these rules:

```text
Default informational event:
blocks_regular_classes = false
allows_attendance_sessions = true
counts_as_working_day = true
```

Examples:

```text
Workshop
Seminar
Competition
Awareness Day
Guest Lecture
Industrial Visit
Parent-Teacher Meeting
General Assembly
College celebration
```

An event blocks classes only when:

- The official source explicitly marks it as Holiday
- It falls in an approved Vacation
- It is an applicable Examination block
- It is an approved Class Suspension
- An authorised Admin sets `blocks_regular_classes=true`

Do not infer class cancellation merely because an event appears on a date.

---

# 10. Examination Applicability

Examinations must be scope-aware.

Required fields:

```text
applicable_programme_ids
applicable_semester_ids
applicable_section_ids
blocks_regular_classes
allows_exam_attendance_session
is_tentative
```

Normal FaceAttend attendance and examination presence are separate concepts.

For v1:

- FaceAttend tracks regular class attendance.
- Do not treat examination presence as normal class attendance.
- On an applicable examination-block date, normal attendance sessions are blocked.
- Future exam-attendance support may be implemented as a separate module, but it is not part of the current scope.

---

# 11. Lunar and Tentative Date Handling

The calendar states that Muslim festival dates are subject to moon sighting.

For every lunar/tentative event:

```text
is_lunar_date = true
is_tentative = true
requires_admin_confirmation = true
```

Required workflow:

```text
Tentative date created
→ Admin receives confirmation reminder
→ Admin confirms, changes, or cancels the date
→ Affected Scheduled Classes are recalculated
→ Conflicts are displayed
→ Teachers and Students receive system-generated calendar-change alerts
→ Audit log records old date and new date
```

Never silently shift a holiday date.

---

# 12. Calendar Conflict Engine

When an Admin adds or changes a Holiday, Vacation, Examination or Special Working Day:

1. Find affected Timetable Rules.
2. Find already-generated Scheduled Classes.
3. Find active or planned Attendance Sessions.
4. Display a conflict preview.
5. Require the Admin to select an action:

```text
Cancel affected classes
Move classes to replacement dates
Keep as Special Working Day
Apply only to selected Programmes/Semesters
Save calendar event without changing existing classes, if policy allows
```

6. Commit changes in a transaction.
7. Generate audit records.
8. Generate structured System Alerts.
9. Recalculate attendance-sheet display values.
10. Do not convert Students to Absent.

---

# 13. Scheduled Class Generation

Do not create one attendance row for every calendar day.

Generate Scheduled Classes from:

```text
Active Timetable Rule
+ Academic Calendar eligibility
+ Semester teaching boundaries
+ Course Offering validity
```

Pseudo-logic:

```text
for each timetable occurrence:
    if date before teaching_start:
        skip / calendar displays NA
    elif date after semester_end:
        skip / calendar displays NA
    elif applicable holiday or vacation:
        skip / calendar displays H
    elif applicable examination blocks classes:
        skip / calendar displays exam
    elif weekly off and no special working day:
        skip
    else:
        create Scheduled Class
```

Scheduled Class generation must be idempotent.

---

# 14. Required Admin Frontend Pages and Components

## 14.1 Academic Calendar Page

Views:

- Month
- Week
- Agenda
- Year overview
- List

Filters:

- College
- Department
- Programme
- Academic Session
- Batch
- Academic Year
- Semester
- Section
- Event Type
- Class-impacting only
- Tentative only
- Lunar-date confirmation pending

Legend:

```text
Teaching Day
Holiday
Vacation
Examination
Special Working Day
College Event
Department Event
Reopening
Weekly Off
```

## 14.2 Calendar Day Detail

Show:

- Date
- All applicable events
- Class eligibility result
- Attendance eligibility result
- Scheduled Classes
- Cancelled Classes
- Scope
- Source page/reference
- Tentative/confirmed state
- Audit history

## 14.3 Add/Edit Event Form

Fields:

- Calendar
- Title
- Type
- Date/range
- Scope
- Applicable Programmes/Semesters/Sections
- Blocks regular classes
- Allows attendance
- Working-day flag
- Attendance display code
- Tentative
- Lunar date
- Source reference
- Reason

## 14.4 Import Calendar

Provide:

```text
Upload structured CSV/XLSX
Validation preview
Duplicate detection
Date conflict detection
Scope validation
Holiday/exam/vacation classification review
Commit
Result report
```

Do not attempt uncontrolled OCR-to-production import.

The official PDF may be used to prepare seed data, but every imported record must be reviewable before activation.

## 14.5 Conflict Preview

Before activating a calendar change, show:

- Classes affected
- Course Offerings affected
- Teachers affected
- Students affected
- Attendance Sessions affected
- Proposed action
- Warnings

## 14.6 Dashboard Calendar Widgets

Add:

- Today's academic status
- Next College holiday
- Next applicable examination
- Upcoming vacation
- Tentative dates awaiting confirmation
- Class-calendar conflicts

---

# 15. Teacher Frontend Integration

Teacher calendar must show only relevant events.

Teacher can:

- View Academic Calendar
- View Holidays
- View applicable examinations
- View Schedule changes
- View College reopening
- Request a replacement/extra class

Teacher cannot:

- Add official holidays
- Edit the Academic Calendar
- Override a Holiday
- Start Attendance on an ineligible date
- Create a class during vacation without authorised approval

If the Teacher attempts to start Attendance on a blocked date, return:

```text
Attendance cannot be started because this date is marked as a Holiday,
Vacation, or applicable Examination period.
```

Include the specific reason.

---

# 16. Student Frontend Integration

Student calendar must show:

- Her Semester's teaching days
- Scheduled Classes
- Holidays
- Vacations
- Applicable examination windows
- College reopening dates
- Cancelled/rescheduled classes
- Correction deadlines

Student must not see:

- Unrelated Department events by default
- Unrelated Semester examination periods
- Internal conflict notes
- Admin-only calendar metadata

---

# 17. System-Generated Alerts

Generate structured alerts for:

```text
Holiday added
Holiday date changed
Lunar holiday confirmed
Vacation begins
College reopening tomorrow
Applicable examination period begins
Class cancelled because of calendar change
Class rescheduled
Special Working Day declared
Calendar conflict requires Admin action
```

No manual announcement composer.

---

# 18. Required APIs

Implement domain-oriented APIs.

```text
GET    /api/v1/academic-calendars
POST   /api/v1/academic-calendars
GET    /api/v1/academic-calendars/:id
PATCH  /api/v1/academic-calendars/:id
POST   /api/v1/academic-calendars/:id/activate
POST   /api/v1/academic-calendars/:id/archive

GET    /api/v1/calendar-events
POST   /api/v1/calendar-events
GET    /api/v1/calendar-events/:id
PATCH  /api/v1/calendar-events/:id
POST   /api/v1/calendar-events/:id/cancel
POST   /api/v1/calendar-events/:id/confirm
POST   /api/v1/calendar-events/:id/change-date

GET    /api/v1/calendar/eligibility
GET    /api/v1/calendar/day/:date
GET    /api/v1/calendar/month
GET    /api/v1/calendar/year
GET    /api/v1/calendar/conflicts

POST   /api/v1/calendar/import
GET    /api/v1/calendar/import/:jobId/preview
POST   /api/v1/calendar/import/:jobId/commit

POST   /api/v1/calendar/recalculate-scheduled-classes
POST   /api/v1/calendar/conflicts/:id/resolve
```

Every endpoint requires:

- Authentication
- RBAC
- Institutional scope
- Validation
- Audit logging
- Swagger documentation
- Unit tests
- Integration tests

---

# 19. Required Tests

At minimum test:

```text
Holiday prevents Scheduled Class generation
Vacation prevents Attendance Session creation
Information event does not block classes
Examination blocks only the applicable Semester
UG-only exam does not block MCA
Holiday inside exam window overrides the exam date
College reopening does not create a class without a Timetable
Office-open date during vacation does not allow Student attendance
Special Working Day allows an approved Sunday class
Lunar holiday date change recalculates affected classes
Changing a Holiday never marks Students Absent
Duplicate calendar import is detected
Overlapping Holiday and Vacation is handled deterministically
Semester I event is invisible to Semester III Student when unrelated
Attendance percentage excludes all blocked dates
```

Specific seed tests:

```text
2026-07-16 returns INSTITUTIONAL_HOLIDAY
2026-09-04 returns OFFICIAL_HOLIDAY
2026-10-22 returns COLLEGE_REOPENING
2026-11-10 returns VACATION
2026-11-17 returns COLLEGE_REOPENING
2026-12-29 returns VACATION
2027-02-18 blocks MCA Semester II/IV normal classes due to exam
2027-03-26 returns OFFICIAL_HOLIDAY
2027-04-20 does not block MCA unless manually scoped
2027-05-05 blocks MCA Semester IV normal classes due to exam
2027-05-11 blocks MCA Semester II normal classes due to exam
2027-05-14 returns OFFICIAL_HOLIDAY
2027-05-25 returns OFFICE_OPEN_NO_CLASSES and VACATION
```

---

# 20. Definition of Done

Do not consider Academic Calendar integration complete until:

- The 2026-2027 PWC calendar exists as an official structured calendar.
- Every class-impacting date listed in this addendum is seeded.
- Regular-class start and College reopening markers are stored.
- Holiday, Vacation and Examination scopes are separate.
- MCA Semester I-IV applicability is configured.
- UG-only examination dates do not incorrectly block MCA.
- Lunar dates are tentative and confirmable.
- The Admin Calendar has month/week/agenda/list views.
- The eligibility API determines whether classes and Attendance are allowed.
- Timetable generation consults the Academic Calendar.
- Attendance Sessions cannot start on blocked dates.
- Holidays/Vacations never generate Absent records.
- Calendar changes produce conflict previews and audit logs.
- Teacher and Student calendars show only applicable records.
- System Alerts are structured and event-generated.
- Swagger, tests, migrations, seed, lint and build pass.
- No calendar decision depends on frontend-only logic.
- No official PDF is treated as the runtime source of truth after structured import.

---

# 21. Final Instruction to Antigravity

```text
Add this PWC Academic Calendar integration to the approved FaceAttend scope.

Do not build the Academic Calendar as a decorative calendar page. Implement it
as a core scheduling and attendance-eligibility domain.

Use the official Patna Women's College Academic Calendar 2026-2027 supplied by
the project owner. Seed every class-impacting Holiday, Vacation, Reopening,
Regular-Class-Start and applicable Examination record listed in this addendum.

The backend must determine whether a Scheduled Class or Attendance Session is
allowed. The frontend must only display and act on the backend result.

Do not mark a Student Absent on a Holiday, Weekly Off, Vacation, non-applicable
Examination date, pre-teaching date, post-semester date, or date with no
Scheduled Class.

Keep examination applicability scoped to Programme and Semester. Do not block
MCA because an unrelated UG examination exists.

Preserve tentative and lunar-date handling, conflict previews, Admin approval,
audit logs, and automatic recalculation of affected Scheduled Classes.

Integrate the resulting data into Admin, Teacher and Student calendar views,
Attendance Sheets, Attendance Analytics and System Alerts.

Proceed without waiting for another confirmation.
```

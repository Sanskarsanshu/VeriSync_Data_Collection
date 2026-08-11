# FaceAttend — PWC MCA Timetable July 2026 Integration Addendum

> **Source:** Department of Computer Applications (MCA), Patna Women’s College  
> **Document reference:** `PWC/CSA/TT-01/26`  
> **Title:** Time Table July 2026  
> **Effective from:** `01 July 2026`  
> **Relevant FaceAttend scope:** MCA First Year / Semester I and MCA Second Year / Semester III  
> **Important:** PGDCA and “Others” rows visible in the source timetable are outside the current FaceAttend MCA deployment and must not be seeded as MCA course offerings.

---

# 1. Mandatory Instruction

Add this timetable to the approved FaceAttend PWC MCA Phase 1 requirements.

Do not store the timetable only as an image or document reference. Convert every applicable MCA I and MCA III timetable cell into structured, recurring timetable data connected to:

- Curriculum Subject
- Subject Offering
- Course Offering
- Teacher Assignment
- Timetable Rule
- Room, when later supplied
- Academic Session
- Batch
- Academic Year
- Semester
- Section
- Academic Calendar
- Scheduled Class generation
- Attendance Session eligibility

The timetable becomes effective on `2026-07-01`.

Do not begin Phase 2 feature completion until this timetable can be returned through real APIs and used to generate Scheduled Classes.

---

# 2. Teacher Abbreviation Mapping

The source timetable uses short Teacher codes. Store these as aliases, not as the Teacher’s primary identity.

| Timetable Code | Supplied Teacher Name | Canonical Handling |
|---|---|---|
| `PK` | Dr. Praveen Kumar | Link to the existing Praveen Kumar Teacher record after title confirmation |
| `RV` | Ms. Richa Verma | Link to Richa Verma; preserve Computer Science as primary Department unless cross-department MCA assignment is approved |
| `BKP` | Mr. Braj Kishore Prasad | Link to the existing Braj Kishor/Braj Kishore Prasad record after spelling confirmation |
| `SC` | Dr. Sushmita Chakraborty | Link to Sushmita Chakraborty after salutation/title confirmation |
| `BS` | Dr. Bhawna Sinha (HOD) | Link to Bhawna Sinha; HOD remains a separate Administrative Role |

## 2.1 Do Not Overwrite Unverified Identity Data

The new timetable supplies operational abbreviations and displayed titles, but there are conflicts with previously supplied profile data:

- Praveen Kumar was previously supplied as `Mr. Praveen Kumar`; the timetable mapping now says `Dr. Praveen Kumar`.
- Sushmita Chakraborty previously had no confirmed salutation; the new mapping says `Dr. Sushmita Chakraborty`.
- The earlier profile used `Braj Kishor Prasad`; the new mapping says `Braj Kishore Prasad`.

Do not silently overwrite canonical profile records.

Create a validation task:

```text
TITLE_CONFIRMATION_REQUIRED: Praveen Kumar
TITLE_CONFIRMATION_REQUIRED: Sushmita Chakraborty
NAME_SPELLING_CONFIRMATION_REQUIRED: Braj Kishor/Kishore Prasad
```

The timetable alias may still be stored and used to resolve source entries, but login activation and public display must use the Admin-confirmed canonical identity.

## 2.2 Required Alias Entity

Create or verify:

```text
teacher_aliases
```

Fields:

```text
id
teacher_account_id nullable
college_id
department_id
alias_type
alias_value
source_reference
effective_from
effective_to nullable
verification_status
verified_by_admin_id nullable
verified_at nullable
created_at
updated_at
```

Suggested alias type:

```text
TIMETABLE_CODE
```

Unique constraint:

```text
UNIQUE(college_id, department_id, alias_type, alias_value, effective_from)
```

Do not use `PK`, `RV`, `BKP`, `SC`, or `BS` as employee IDs.

---

# 3. Period Configuration

Create reusable period records for the PWC MCA timetable.

| Period | Start | End |
|---|---|---|
| P1 | 09:15 | 10:10 |
| P2 | 10:10 | 11:05 |
| P3 | 11:05 | 12:00 |
| P4 | 12:00 | 12:55 |
| Lunch | 12:55 | 13:25 |
| P5 | 13:25 | 14:20 |
| P6 | 14:20 | 15:15 |

Timezone:

```text
Asia/Kolkata
```

Lunch is not a class period and must never generate a Scheduled Class.

Required validation:

```text
P1.end = P2.start
P2.end = P3.start
P3.end = P4.start
P4.end = Lunch.start
Lunch.end = P5.start
P5.end = P6.start
```

---

# 4. Academic Context

## MCA I

Map:

```text
Programme: Master of Computer Applications
Academic Year: First Year
Semester: Semester I
Section: Section A
Timetable label: MCA I
```

## MCA III

Map:

```text
Programme: Master of Computer Applications
Academic Year: Second Year
Semester: Semester III
Section: Section A
Timetable label: MCA III
```

Do not interpret `MCA I` as the first batch and `MCA III` as a separate programme.

---

# 5. Curriculum Code Resolution

Resolve each timetable code to the approved MCA 2025 Curriculum.

## Semester I

| Code | Curriculum Subject |
|---|---|
| CC101 | Software Engineering |
| CC102 | Advanced Database Management System |
| CC103 | Design & Analysis of Algorithm |
| CC104 | Data Communications & Computer Networks |
| CC105 | Python Programming |
| SEC101 | Data Visualization |

The approved Semester I curriculum also includes `MAEC101`, but it is not visible as a normal MCA I timetable entry in the supplied timetable. Do not invent its weekly slot.

## Semester III

| Code | Curriculum Subject |
|---|---|
| CC310 | Advanced Web Designing using J2EE |
| CC311 | Cloud Computing |
| CC312 | Big Data Analytics |
| CC313 | Mini Project II (Lab) |
| MDC302 | Digital Marketing and E-Commerce |

The approved Semester III curriculum also includes `MAEC302` and `SEC303`, but they are not visible as normal MCA III rows in the supplied timetable. Do not invent their weekly slots.

## 5.1 Source Inconsistency: `CC301`

The Friday MCA III P2 cell is printed as:

```text
CC301(T) PK
```

The approved curriculum contains `CC310`, not `CC301`.

Do not silently change it.

Create:

```text
TIMETABLE_SOURCE_CONFLICT
source_value: CC301
likely_candidate: CC310
day: Friday
period: P2
teacher_code: PK
status: ADMIN_REVIEW_REQUIRED
```

Do not activate that Timetable Rule until an authorised Admin confirms whether it is:

- `CC310`, or
- another valid Subject not present in the supplied curriculum.

---

# 6. Delivery-Type Interpretation

Source notation:

```text
(T) = Theory
(L) = Laboratory / Practical
(Mini Project) = Project/Lab supervision
```

Map to controlled values:

```text
THEORY
PRACTICAL
PROJECT_SUPERVISION
CO_CURRICULAR
```

Do not store raw `(T)` and `(L)` as the only business value. Preserve the original notation in source metadata.

---

# 7. MCA I — Semester I Weekly Timetable

# Monday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC101 | Theory | RV |
| P2 | 10:10–11:05 | CC105 | Theory | PK |
| P3 | 11:05–12:00 | CC105 | Practical | PK |
| P4 | 12:00–12:55 | SEC101 | Practical | BS |
| P5 | 13:25–14:20 | CC103 | Theory | RV |
| P6 | 14:20–15:15 | CC102 | Practical | PK |

# Tuesday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC102 | Theory | SC |
| P2 | 10:10–11:05 | CC105 | Theory | PK |
| P3 | 11:05–12:00 | CC104 | Theory | BKP |
| P4 | 12:00–12:55 | CC105 | Practical | PK |
| P5 | 13:25–14:20 | CC104 | Practical | BKP |
| P6 | 14:20–15:15 | CC101 | Theory | RV |

# Wednesday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC102 | Theory | PK |
| P2 | 10:10–11:05 | CC102 | Practical | PK |
| P3 | 11:05–12:00 | CC103 | Theory | RV |
| P4 | 12:00–12:55 | CC105 | Theory | SC |
| P5 | 13:25–14:20 | CC105 | Practical | SC |
| P6 | 14:20–15:15 | SEC101 | Theory | BS |

# Thursday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC104 | Theory | BKP |
| P2 | 10:10–11:05 | CC101 | Theory | RV |
| P3 | 11:05–12:00 | CC102 | Theory | SC |
| P4 | 12:00–12:55 | CC103 | Theory | BS |
| P5 | 13:25–14:20 | CC102 | Theory | PK |
| P6 | 14:20–15:15 | No class shown | — | — |

# Friday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC103 | Theory | BS |
| P2 | 10:10–11:05 | CC105 | Theory | SC |
| P3 | 11:05–12:00 | CC101 | Theory | RV |
| P4 | 12:00–12:55 | CC105 | Practical | SC |
| P5 | 13:25–14:20 | CC104 | Theory | BKP |
| P6 | 14:20–15:15 | No class shown | — | — |

# Saturday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | SEC101 | Theory | BKP |
| P2 | 10:10–11:05 | SEC101 | Practical | BKP |
| P3 | 11:05–12:00 | Coding Lab | Co-curricular / Admin review | BKP, PK |
| P4 | 12:00–12:55 | Coding Lab | Co-curricular / Admin review | RV, BS |
| P5 | 13:25–14:20 | Personality Development | Co-curricular / Admin review | BS, RV |
| P6 | 14:20–15:15 | Personality Development | Co-curricular / Admin review | BS, SC |

## 7.1 Coding Lab and Personality Development

These activities do not have approved MCA 2025 paper codes in the supplied curriculum.

Do not create fake Subject codes.

Store them initially as:

```text
NON_CURRICULUM_SCHEDULED_ACTIVITY
attendance_tracking_enabled: false
status: ADMIN_REVIEW_REQUIRED
```

The Admin must decide whether they are:

- Non-credit attendance-tracked activities,
- Co-curricular sessions,
- Internal lab support,
- Or informational timetable blocks.

Only after approval may they generate Attendance Sessions.

---

# 8. MCA III — Semester III Weekly Timetable

# Monday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC310 | Theory | PK |
| P2 | 10:10–11:05 | CC312 | Theory | SC |
| P3 | 11:05–12:00 | CC311 | Theory | BKP |
| P4 | 12:00–12:55 | CC310 | Practical | PK |
| P5 | 13:25–14:20 | CC313 Mini Project | Project supervision | BS, PK, BKP |
| P6 | 14:20–15:15 | CC313 Mini Project | Project supervision | SC, RV |

# Tuesday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | CC311 | Theory | BKP |
| P2 | 10:10–11:05 | CC312 | Theory | SC |
| P3 | 11:05–12:00 | MDC302 | Theory | BS |
| P4 | 12:00–12:55 | CC313 Mini Project | Project supervision | BS, BKP |
| P5 | 13:25–14:20 | CC313 Mini Project | Project supervision | PK, RV, SC |
| P6 | 14:20–15:15 | No class shown | — | — |

# Wednesday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | MDC302 | Theory | RV |
| P2 | 10:10–11:05 | CC312 | Theory | SC |
| P3 | 11:05–12:00 | CC310 | Theory | PK |
| P4 | 12:00–12:55 | CC310 | Practical | PK |
| P5 | 13:25–14:20 | No class shown | — | — |
| P6 | 14:20–15:15 | No class shown | — | — |

# Thursday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | MDC302 | Theory | BS |
| P2 | 10:10–11:05 | CC311 | Theory | BKP |
| P3 | 11:05–12:00 | CC310 | Theory | PK |
| P4 | 12:00–12:55 | CC310 | Practical | PK |
| P5 | 13:25–14:20 | No class shown | — | — |
| P6 | 14:20–15:15 | No class shown | — | — |

# Friday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | MDC302 | Theory | RV |
| P2 | 10:10–11:05 | `CC301` in source | Theory | PK |
| P3 | 11:05–12:00 | CC312 | Theory | SC |
| P4 | 12:00–12:55 | CC311 | Theory | BKP |
| P5 | 13:25–14:20 | No class shown | — | — |
| P6 | 14:20–15:15 | No class shown | — | — |

Friday P2 remains blocked until the `CC301`/`CC310` source conflict is resolved.

# Saturday

| Period | Time | Subject/Activity | Type | Teacher(s) |
|---|---|---|---|---|
| P1 | 09:15–10:10 | No class shown | — | — |
| P2 | 10:10–11:05 | No class shown | — | — |
| P3 | 11:05–12:00 | CC313 Mini Project | Project supervision | BS, SC |
| P4 | 12:00–12:55 | CC313 Mini Project | Project supervision | PK, BKP |
| P5 | 13:25–14:20 | No class shown | — | — |
| P6 | 14:20–15:15 | No class shown | — | — |

---

# 9. Multi-Teacher Class Support

The timetable contains classes supervised by multiple Teachers.

Examples:

```text
Monday MCA III P5: BS, PK, BKP
Monday MCA III P6: SC, RV
Tuesday MCA III P4: BS, BKP
Tuesday MCA III P5: PK, RV, SC
Saturday MCA III P3: BS, SC
Saturday MCA III P4: PK, BKP
Saturday MCA I Coding Lab and Personality Development: multiple Teachers
```

A single `teacher_id` column on Timetable Rule is insufficient.

Create or verify:

```text
timetable_rule_teachers
```

Fields:

```text
id
timetable_rule_id
teacher_account_id
teacher_role
is_primary
can_start_attendance
can_close_attendance
can_view_live_attendance
effective_from
effective_to nullable
created_at
updated_at
```

Suggested roles:

```text
PRIMARY
CO_TEACHER
PROJECT_SUPERVISOR
LAB_INSTRUCTOR
SUPPORTING_FACULTY
```

Unique constraint:

```text
UNIQUE(timetable_rule_id, teacher_account_id)
```

For multi-teacher classes, define exactly which Teachers can start and close Attendance.

Do not allow every listed supporting Teacher to independently create duplicate Attendance Sessions.

Recommended rule:

```text
One Scheduled Class
One Attendance Session
Multiple authorised Teachers
Exactly one opening action
Exactly one final closure
```

---

# 10. Teacher Assignment Creation

The timetable is official operational evidence of Teacher-to-Subject allocation, but imports must still pass Admin review.

Import flow:

```text
Parse timetable row
→ Resolve Teacher alias
→ Resolve Subject code
→ Resolve Semester and Section
→ Compare existing Teacher Assignment
→ Show preview
→ Flag identity/title/code conflicts
→ Admin confirms
→ Create or update Teacher Assignment
→ Create Timetable Rule
→ Audit the source
```

Do not automatically activate assignments with unresolved Teacher identity or Subject-code conflicts.

## 10.1 Richa Verma Cross-Department Assignment

Richa Verma was previously supplied under Computer Science.

Her MCA timetable entries must be represented as approved cross-department Teacher Assignments.

Do not change her primary Department to MCA solely because she appears in this timetable.

Create:

```text
primary_department: Computer Science
approved_assignment_department: Department of Computer Applications
assignment_source: PWC/CSA/TT-01/26
```

---

# 11. Timetable Rule Data Model

Each active cell becomes a Timetable Rule.

Required fields:

```text
id
course_offering_id nullable until Course Offering exists
subject_offering_id
section_id
day_of_week
period_code
local_start_time
local_end_time
class_type
effective_from
effective_until nullable
source_document_code
source_cell_reference
source_text
status
created_by_admin_id
approved_by_admin_id nullable
approved_at nullable
created_at
updated_at
```

Status values:

```text
DRAFT
VALIDATION_REQUIRED
ACTIVE
SUSPENDED
SUPERSEDED
ARCHIVED
```

Use `effective_from = 2026-07-01`.

Do not assume the timetable is valid forever. It must support a later replacement timetable without deleting history.

---

# 12. Academic Calendar Integration

The timetable does not override the Academic Calendar.

Scheduled Classes are generated from:

```text
Active Timetable Rule
+ Semester teaching boundaries
+ Official Academic Calendar eligibility
+ Course Offering validity
+ Teacher/Section/Room conflict validation
```

Examples:

- A Monday timetable rule does not generate a class when that Monday is an applicable Holiday.
- No Attendance Session may start during Vacation.
- An applicable Semester examination blocks normal classes.
- A Special Working Day may allow a replacement class.
- A College event that does not block classes leaves the timetable active.
- A cancelled or rescheduled class overrides the recurring timetable occurrence.

Required generation logic:

```text
for every recurring timetable occurrence:
    ask CalendarEligibilityService
    if blocked:
        do not create normal Scheduled Class
    else:
        create Scheduled Class idempotently
```

Never mark Students Absent because a recurring timetable occurrence falls on a Holiday, Vacation, examination block, or cancelled class.

---

# 13. Timetable Conflict Detection

Before activation, test:

- Teacher double booking
- Section double booking
- Room double booking, when room is supplied
- Same Course Offering duplicated in one period
- Teacher assigned outside effective dates
- Teacher account incomplete
- Subject not mapped to Semester
- Invalid Curriculum code
- Overlapping time
- Calendar block
- Duplicate rule
- Multi-teacher duplicate assignment
- Course Offering missing
- Cross-department approval missing

The current source intentionally includes Teachers across MCA I, MCA III, PGDCA and Others. Conflict detection must consider all active assignments, even though FaceAttend initially imports only MCA I and MCA III.

If PGDCA/Others are not in FaceAttend, display:

```text
External timetable conflict cannot be fully verified because non-MCA rows
have not been imported.
```

Do not falsely claim zero Teacher conflicts.

---

# 14. Backend APIs

Implement:

```text
GET    /api/v1/teacher-aliases
POST   /api/v1/teacher-aliases
PATCH  /api/v1/teacher-aliases/:id
POST   /api/v1/teacher-aliases/:id/verify

GET    /api/v1/timetable-periods
POST   /api/v1/timetable-periods
PATCH  /api/v1/timetable-periods/:id

POST   /api/v1/timetables/import
GET    /api/v1/timetables/import/:jobId/preview
PATCH  /api/v1/timetables/import/:jobId/rows/:rowId
POST   /api/v1/timetables/import/:jobId/commit
GET    /api/v1/timetables/import/:jobId/result

GET    /api/v1/timetable-rules
POST   /api/v1/timetable-rules
GET    /api/v1/timetable-rules/:id
PATCH  /api/v1/timetable-rules/:id
POST   /api/v1/timetable-rules/:id/activate
POST   /api/v1/timetable-rules/:id/suspend
POST   /api/v1/timetable-rules/:id/supersede

GET    /api/v1/timetable-rules/:id/teachers
POST   /api/v1/timetable-rules/:id/teachers
PATCH  /api/v1/timetable-rule-teachers/:id
DELETE /api/v1/timetable-rule-teachers/:id

GET    /api/v1/timetables/conflicts
POST   /api/v1/timetables/validate
POST   /api/v1/timetables/generate-scheduled-classes
```

Every endpoint requires:

- Real Prisma operations
- DTOs
- Validation
- RBAC
- Institutional scope
- Audit logs
- Swagger
- Unit tests
- Integration tests

---

# 15. Admin Frontend Requirements

## 15.1 Timetable Views

Provide:

- Week grid
- Day list
- Teacher view
- Section view
- Subject view
- Conflict view
- Source-import preview

Filters:

- Academic Session
- Batch
- Academic Year
- Semester
- Section
- Teacher
- Subject
- Delivery Type
- Status

## 15.2 Source Cell Display

Each imported rule must preserve:

```text
Source: PWC/CSA/TT-01/26
Effective: 01 July 2026
Source text: CC101(T) RV
Resolved Subject: Software Engineering
Resolved Teacher: Richa Verma
```

## 15.3 Teacher Code Legend

Display a legend:

```text
PK
RV
BKP
SC
BS
```

The legend should use canonical Admin-confirmed names.

## 15.4 Validation Queue

Show:

- Unresolved alias
- Unconfirmed title
- Spelling mismatch
- Invalid Subject code
- Cross-department assignment
- Non-curriculum activity
- Missing room
- Timetable conflict
- Calendar conflict

---

# 16. Teacher Frontend Integration

Teacher sees:

- Weekly timetable
- Today’s classes
- Next class
- Co-teachers
- Project supervision slots
- Cancelled/rescheduled classes
- Calendar-blocked dates

Teacher may start Attendance only when:

```text
Teacher is authorised for the Timetable Rule
Scheduled Class exists
Calendar eligibility allows it
Attendance Session is not already open/closed
Teacher permission can_start_attendance = true
```

---

# 17. Student Frontend Integration

Student sees only her:

- Semester
- Section
- Weekly timetable
- Scheduled Classes
- Teacher display names
- Theory/practical/project type
- Holiday/cancellation/reschedule state

Do not show Teacher phone, email, employee ID, security state, or internal alias-validation notes.

---

# 18. Seed and Import Strategy

Do not hardcode the timetable directly inside a public seed with unresolved conflicts.

Use:

```text
seed:demo
```

for fictional sample Timetable Rules.

Use:

```text
import:pwc-timetable-private
```

for the supplied official timetable.

Store the source as structured private import data, for example:

```text
/private-seed/pwc-mca-timetable-2026.json
```

The file must be gitignored when it contains real personal or institutional operational data.

The import must show a preview before commit.

---

# 19. Required Tests

Test:

```text
Teacher aliases resolve correctly
Alias is not treated as employee ID
MCA I maps to Semester I
MCA III maps to Semester III
Lunch never generates a Scheduled Class
Holiday blocks recurring timetable occurrence
Vacation blocks Attendance Session
Applicable examination blocks normal class
Information event does not block class
Multi-teacher Project class creates one Scheduled Class
Multi-teacher Project class creates one Attendance Session
Supporting Teacher cannot open duplicate session
Richa Verma remains primarily in Computer Science
Cross-department MCA assignment requires approval
CC301 Friday conflict remains blocked
Coding Lab does not become a fake curriculum Subject
Personality Development does not become a fake curriculum Subject
Empty timetable cells generate no records
Timetable replacement preserves historical rules
```

Specific timetable tests:

```text
Monday MCA I P1 resolves to CC101 + RV
Monday MCA III P5 resolves to CC313 + BS/PK/BKP
Tuesday MCA I P5 resolves to CC104 practical + BKP
Wednesday MCA I P6 resolves to SEC101 theory + BS
Friday MCA III P2 returns ADMIN_REVIEW_REQUIRED
Saturday MCA III P3 resolves to CC313 + BS/SC
```

---

# 20. Definition of Done

Do not consider the timetable integration complete until:

- The source reference is stored.
- Effective date is `2026-07-01`.
- MCA I and MCA III are mapped to Semesters I and III.
- All applicable timetable cells are structured.
- Teacher aliases resolve through a dedicated alias model.
- Identity/title/spelling conflicts remain reviewable.
- Curriculum codes resolve correctly.
- `CC301` is not silently changed.
- Coding Lab and Personality Development remain non-curriculum until approved.
- Multi-teacher classes are supported.
- Richa Verma uses an approved cross-department assignment.
- Timetable Rules generate Scheduled Classes through the Academic Calendar.
- Holidays, Vacations and examinations block normal attendance.
- Real APIs return the weekly timetable.
- Conflict validation works.
- Swagger is complete.
- Unit and integration tests pass.
- Phase 2 uses the real timetable APIs.

---

# 21. Final Reply to Antigravity

```text
Add the attached PWC MCA July 2026 timetable to the approved Phase 1 work.

Treat document PWC/CSA/TT-01/26, effective 01 July 2026, as an official
operational timetable source for MCA Semester I and MCA Semester III.

Convert every applicable MCA I and MCA III cell into structured Timetable Rules.
Do not import PGDCA or Others as MCA records.

Create Teacher timetable aliases for PK, RV, BKP, SC and BS. These are source
aliases, not employee IDs or canonical identities.

Do not silently overwrite identity differences:
- Praveen Kumar title requires confirmation.
- Sushmita Chakraborty title requires confirmation.
- Braj Kishor/Kishore spelling requires confirmation.
- Bhawna Sinha's HOD status remains a separate Administrative Role.
- Richa Verma retains Computer Science as her primary Department and receives
  only an approved cross-department MCA assignment.

Support multi-Teacher Mini Project, Coding Lab and Personality Development slots
through a join model. Generate one Scheduled Class and one Attendance Session
per slot, not one per Teacher.

Do not silently change Friday MCA III P2 from CC301 to CC310. Flag it for Admin
review.

Do not create fake curriculum Subjects for Coding Lab or Personality
Development. Keep them as non-curriculum scheduled activities until approved.

Integrate timetable generation with the Academic Calendar. Holidays, Vacations,
applicable examinations, cancellations and weekly-off rules must prevent normal
Scheduled Class and Attendance Session creation.

Implement real Prisma services, DTOs, RBAC, scope checks, audit logs, Swagger,
unit tests and integration tests. Do not use placeholder services or dto:any.

Proceed without waiting for another confirmation.
```

# VeriSync — Full-System Integration Audit, Data Consistency & Bulletproof Connection Plan

## CRITICAL INSTRUCTION — READ BEFORE CHANGING ANY CODE

The VeriSync project is now at the stage where the Admin, Teacher, and Student sides are largely implemented.

However, I am finding small but important integration problems across the system.

For example:

* A newly registered student exists, but their name does not appear in Teacher → Attendance → Attendance Sheets.
* Student data may exist in one part of the application but not appear in another.
* Some pages may still contain static/mock data.
* Some frontend pages may be connected to different APIs or outdated database fields.
* Some relationships between Student → Course → Section → Teacher → Attendance Session → Attendance Record may not be fully synchronized.
* Some pages may display correct-looking UI but not be connected to the actual source of truth.
* There may be missing relationships, stale API responses, incorrect IDs, inconsistent naming, missing refreshes, or frontend assumptions.

I do NOT want individual fixes or random patches.

I want a **complete system-wide diagnosis first**.

---

# PHASE 0 — ABSOLUTE RULE: DO NOT CHANGE CODE

Before making ANY code modification:

**STOP and perform a complete read-only audit of the entire system.**

Do NOT:

* modify frontend code
* modify backend code
* modify Prisma schema
* modify database records
* rename fields
* create migrations
* change APIs
* delete mock data
* "fix" anything
* refactor anything

during the diagnosis phase.

The first deliverable must be a **full diagnostic report and bulletproof implementation plan**.

Only after the diagnosis and plan are complete should implementation begin.

---

# 1. Understand the Entire Existing System First

Inspect the complete repository.

Do not only inspect the currently active Student or Teacher page.

Inspect:

```text
Frontend
Backend
Prisma schema
Database relationships
API routes
Services
Controllers
DTOs
Authentication
Authorization
Hooks
Contexts
State management
API clients
Types/interfaces
Routing
Teacher pages
Student pages
Admin pages
Attendance pages
Course pages
Schedule pages
Profile pages
Settings
Audit logs
QR logic
Face verification
Registration
Login
```

Determine exactly how every side currently communicates.

Create a complete architecture map.

---

# 2. Build a System Data Flow Map

Before touching anything, document the complete data lifecycle.

For example:

```text
STUDENT REGISTRATION
        ↓
Auth
        ↓
User
        ↓
Student
        ↓
Program / Year / Semester
        ↓
Batch
        ↓
Section
        ↓
Course Enrollment
        ↓
Course
        ↓
Teacher Assignment
        ↓
Timetable
        ↓
Attendance Session
        ↓
Attendance Record
        ↓
Student Dashboard
        ↓
Teacher Attendance Sheet
        ↓
Admin Reports
```

Verify that this chain actually exists in the current implementation.

Do not assume it exists just because the UI displays the information.

---

# 3. Identify the Single Source of Truth

For every important entity, determine:

```text
Entity
↓
Database table/model
↓
Backend service
↓
Controller/API
↓
Frontend API service
↓
Frontend page/component
```

Create a table like:

| Data               | Database Source | Backend API | Student UI | Teacher UI | Admin UI |
| ------------------ | ---------------- | ----------- | ---------- | ---------- | -------- |
| Student Name       | ?                 | ?           | ?          | ?          | ?        |
| Student Roll No     | ?                | ?           | ?          | ?          | ?        |
| Course              | ?                | ?           | ?          | ?          | ?        |
| Teacher             | ?                | ?           | ?          | ?          | ?        |
| Section             | ?                | ?           | ?          | ?          | ?        |
| Attendance          | ?                | ?           | ?          | ?          | ?        |
| Timetable           | ?                | ?           | ?          | ?          | ?        |
| Attendance Session  | ?                | ?           | ?          | ?          | ?        |
| Correction Request  | ?                | ?           | ?          | ?          | ?        |

Find every place where the same information is stored separately or hardcoded.

---

# 4. Student Identity Audit

This is extremely important.

Trace the complete lifecycle:

```text
Student registers
        ↓
User account created
        ↓
Student record created
        ↓
Student ID generated
        ↓
Roll number
        ↓
Semester
        ↓
Batch
        ↓
Section
        ↓
Course enrollment
        ↓
Teacher relationship
```

Verify that the SAME student identity is used everywhere.

For example, determine whether the system accidentally uses:

```text
user.id
student.id
rollNumber
email
registrationNumber
```

interchangeably.

There must be a clearly defined relationship.

Example:

```text
User
  │
  └── Student
        │
        ├── Student ID
        ├── Roll Number
        ├── Section
        └── Enrollments
```

Do not allow frontend pages to invent their own student identity.

---

# 5. Authentication Audit

Trace:

```text
Register
↓
Login
↓
JWT/session
↓
AuthContext
↓
Authenticated API request
↓
Backend user
↓
Student/Teacher/Admin
```

Verify:

* Who is the authenticated user?
* How is their ID stored?
* How does the backend identify them?
* How is the role determined?
* How is the Student record resolved?
* How is the Teacher record resolved?
* How is the Admin identity resolved?

Verify that the frontend does NOT simply trust:

```text
studentId
teacherId
adminId
role
```

sent from the client.

The backend must be the authority.

---

# 6. Authorization Audit

Test every role:

```text
STUDENT
TEACHER
ADMIN
```

Create a matrix:

| Resource                 | Student                 | Teacher                   | Admin |
| ------------------------- | ------------------------ | --------------------------- | ----- |
| Own profile                | Allow                    | -                            | Allow |
| Other student profile      | Reject                   | Limited                     | Allow |
| Own attendance             | Allow                    | -                            | Allow |
| Course attendance          | -                        | Allow if assigned           | Allow |
| Start attendance session   | Reject                   | Allow                        | Allow |
| Close attendance session   | Reject                   | Owner/authorized teacher     | Allow |
| Student enrollment         | Self-registration only  | Appropriate access           | Allow |
| Teacher management         | Reject                   | Reject                       | Allow |
| System logs                | Reject                   | Limited                     | Allow |

Verify backend enforcement, not just frontend route hiding.

---

# 7. Student → Teacher Connection Audit

This is one of the main areas where the current problem may exist.

Trace:

```text
Student
 ↓
Section
 ↓
Course Enrollment
 ↓
Course
 ↓
Teacher Assignment
```

Then verify Teacher pages.

For example:

```text
Teacher
 ↓
My Courses
 ↓
Course
 ↓
Enrolled Students
 ↓
Student Records
```

If a newly registered student is assigned to Semester 3, they MUST automatically appear wherever that section/course enrollment is expected.

Specifically inspect:

```text
Teacher
→ Attendance
→ Attendance Sheets
```

Verify why the student's name is missing.

Determine whether the problem is:

* registration
* section assignment
* course enrollment
* teacher-course mapping
* API query
* Prisma relation
* frontend filtering
* stale data
* incorrect student ID
* incorrect section ID
* hardcoded student list
* missing refresh
* caching
* wrong endpoint

Do NOT simply add the student manually to the teacher page.

Fix the underlying data flow.

---

# 8. Student → Course Connection Audit

Trace:

```text
Student
 ↓
Section
 ↓
Courses
```

Verify:

* Newly registered student gets correct section.
* Correct Semester is assigned.
* Correct courses are returned.
* Course names are not hardcoded.
* Course codes are not hardcoded.
* Student course list comes from database.
* Teacher mapping comes from database.

A student should automatically see the correct courses after registration.

---

# 9. Course → Teacher Connection Audit

Verify:

```text
Course
 ↓
Teacher Assignment
```

Determine exactly where this relationship is stored.

For every course verify:

```text
Course ID
Course Code
Course Name
Teacher ID
Teacher Name
Section
Semester
```

The same teacher/course relationship must be used by:

* Student Courses
* Student Dashboard
* Student Timetable
* Teacher Dashboard
* Teacher Attendance
* Teacher Attendance Sheets
* Admin Course Management
* Admin Reports

There must not be separate hardcoded mappings in different pages.

---

# 10. Attendance System Audit

This must be treated as the most critical subsystem.

Trace:

```text
Teacher
 ↓
Starts Session
 ↓
Attendance Session
 ↓
Course
 ↓
Section
 ↓
Eligible Students
 ↓
Face / QR / Manual Verification
 ↓
Attendance Record
 ↓
Student Attendance History
 ↓
Student Analytics
 ↓
Teacher Attendance Sheet
 ↓
Admin Reports
```

Verify every relationship.

---

# 11. Attendance Session Audit

For every attendance session determine:

```text
sessionId
teacherId
courseId
sectionId
date
startTime
endTime
status
verificationMethod
```

Verify:

```text
Teacher owns/is authorized for session
        ↓
Course belongs to teacher
        ↓
Section/course relationship is valid
        ↓
Students eligible for session are correct
```

A teacher must never accidentally start attendance for students from another section/course.

---

# 12. Attendance Record Audit

Every attendance record should have a reliable relationship to:

```text
AttendanceRecord
       │
       ├── Student
       ├── Session
       ├── Course (directly or through Session)
       ├── Teacher (through Session)
       └── Verification Method
```

Verify that attendance is NOT stored only as a frontend boolean.

Database must be the source of truth.

---

# 13. Duplicate Attendance Audit

Verify database-level protection:

```text
UNIQUE(sessionId, studentId)
```

or the equivalent schema constraint.

Do not rely only on:

```text
if (!alreadyExists)
```

in application code.

Test simultaneous/repeated requests.

---

# 14. Student Attendance History Audit

When attendance is marked:

```text
Teacher marks attendance
        ↓
AttendanceRecord created
        ↓
Student History updates
        ↓
Student Analytics updates
        ↓
Teacher Attendance Sheet updates
        ↓
Admin reports update
```

Verify that all of these are reading the SAME attendance records.

There should not be:

```text
Teacher attendance data
Student attendance data
Admin attendance data
```

stored independently.

They should all derive from the same source.

---

# 15. Attendance Analytics Audit

Verify calculations.

For a student:

```text
Attendance %
=
Present Sessions / Applicable Sessions × 100
```

Define exactly what counts as:

* Present
* Absent
* Excused
* Pending correction
* Cancelled class

For a new student:

```text
Total = 0
Present = 0
Absent = 0
Percentage = 0%
```

Never return:

```text
NaN
Infinity
undefined
```

---

# 16. Correction Request Audit

Trace:

```text
Student
 ↓
Correction Request
 ↓
Attendance Record
 ↓
Teacher/Admin review
 ↓
Approve/Reject
 ↓
Attendance Record updated
 ↓
Student History updated
 ↓
Analytics recalculated
 ↓
Teacher sheet updated
 ↓
Admin report updated
```

Verify that correcting attendance in one place automatically affects all other views.

Do NOT maintain separate attendance totals that need manual synchronization.

---

# 17. Timetable Audit

Verify:

```text
Academic Calendar
        ↓
Semester
        ↓
Section
        ↓
Course
        ↓
Teacher
        ↓
Timetable
```

Student Daily Timetable and Teacher Timetable must be generated from compatible underlying records.

Check:

* Day
* Date
* Start time
* End time
* Course
* Teacher
* Section
* Room

Do not hardcode today's classes.

---

# 18. Academic Calendar Audit

Verify:

```text
Academic Calendar
Holidays
Breaks
Working Days
Semester Dates
```

are consistent across the system.

If a day is marked as a holiday, determine how it affects:

* Timetable
* Attendance sessions
* Student calendar
* Teacher calendar
* Admin calendar

---

# 19. Admin Side Audit

The Admin portal should act as the system-wide visibility/control layer.

Verify that Admin can correctly see:

```text
Students
Teachers
Courses
Sections
Enrollments
Attendance Sessions
Attendance Records
Correction Requests
Timetable
Academic Calendar
Audit Logs
```

Most importantly:

A newly registered student should automatically become visible to Admin wherever appropriate.

A newly assigned course should appear correctly.

A new teacher should appear in teacher mappings.

A new attendance record should appear in reports.

---

# 20. Newly Registered Student End-to-End Test

Create a fresh test student.

Example:

```text
Student:
Name: Test Student
Email: unique test email
Roll No: unique test roll number
```

Then trace EVERYTHING.

```text
REGISTER
 ↓
USER CREATED?
 ↓
STUDENT CREATED?
 ↓
CORRECT ROLE?
 ↓
CORRECT PROGRAM?
 ↓
CORRECT YEAR?
 ↓
CORRECT SEMESTER?
 ↓
CORRECT SECTION?
 ↓
CORRECT COURSE ENROLLMENTS?
 ↓
CORRECT TEACHER MAPPINGS?
 ↓
FACE EMBEDDING?
 ↓
LOGIN?
 ↓
STUDENT DASHBOARD?
 ↓
STUDENT COURSES?
 ↓
STUDENT TIMETABLE?
 ↓
TEACHER COURSE LIST?
 ↓
TEACHER ENROLLED STUDENTS?
 ↓
TEACHER ATTENDANCE SHEET?
 ↓
ADMIN STUDENT LIST?
```

Every step must work without manually editing the database.

---

# 21. Cross-Portal Consistency Test

Use one test student and one test teacher.

Verify:

### Student side

Student sees:

```text
Name
Roll number
Courses
Teachers
Schedule
Attendance
```

### Teacher side

Teacher sees the SAME student under the correct course/section.

### Admin side

Admin sees the SAME student, course and enrollment.

There must be no mismatch.

For example:

```text
Student Portal:
CC310 → Dr. Praveen Kumar

Teacher Portal:
CC310 → Dr. Praveen Kumar

Admin Portal:
CC310 → Dr. Praveen Kumar
```

All three must originate from the same database relationship.

---

# 22. Find ALL Static/Mock Data

Search the entire frontend for:

```text
82%
41
50
9
Student names
Teacher names
Course names
Course codes
Hardcoded schedules
Hardcoded attendance
Hardcoded dates
Fake notifications
Mock students
Mock teachers
Mock courses
```

Do not only search the dashboard.

Search every Student, Teacher and Admin page.

Create a report:

```text
File
Line/component
Static data
What database/API should provide it
Recommended fix
```

Do not remove anything during diagnosis.

---

# 23. Find ALL API Mismatches

Audit every frontend API call.

For each:

```text
Frontend endpoint
HTTP method
Request payload
Backend route
DTO
Controller
Service
Database query
Response structure
Frontend expected structure
```

Check for mismatches such as:

```text
Frontend expects:
student.name

Backend returns:
student.fullName
```

or:

```text
Frontend calls:
GET /students/dashboard

Backend exposes:
GET /students/me/dashboard
```

or:

```text
Frontend sends:
sectionId

Backend expects:
section_id
```

These small inconsistencies are exactly the type of problem we are trying to eliminate.

---

# 24. Find ALL Broken Prisma Relationships

Inspect the Prisma schema and verify relationships between:

```text
User
Student
Teacher
Admin
Course
Section
Enrollment
AttendanceSession
AttendanceRecord
FaceEmbedding
CorrectionRequest
Timetable
AcademicCalendar
AuditLog
```

Identify:

* Missing relations
* Incorrect foreign keys
* Optional relationships that should be required
* Duplicate sources of truth
* Missing unique constraints
* Missing indexes
* Incorrect cascade behavior
* Orphan records

Do not modify the schema during diagnosis.

---

# 25. Orphan Data Audit

Identify whether the database can contain:

```text
Student without User
Student without Section
Enrollment without Student
Enrollment without Course
Course without Teacher mapping
Attendance without Student
Attendance without Session
Session without Teacher
Session without Course
Correction request without Attendance
FaceEmbedding without Student
```

Document each possibility.

---

# 26. Data Loss Audit

This is a critical requirement.

Identify every operation that could accidentally delete or overwrite data.

Check:

```text
Registration
Profile updates
Course enrollment
Attendance marking
Attendance correction
Teacher manual attendance
Session closing
Student deletion
Teacher deletion
Course deletion
Section deletion
```

Determine:

* Is data deleted permanently?
* Is soft deletion needed?
* Are foreign keys protected?
* Are audit logs created?
* Can historical attendance disappear if a course is deleted?
* Can deleting a student destroy historical attendance records?

Attendance history must be treated as historical data and must not disappear accidentally.

---

# 27. Cache / Refresh / Stale Data Audit

Investigate cases where:

```text
Database is correct
BUT
Frontend shows old data
```

Check:

* React state
* Context
* React Query/SWR if used
* Browser cache
* API caching
* polling
* stale closures
* missing refetch
* missing invalidation
* page navigation
* logout/login transitions

For example:

```text
Teacher marks student Present
        ↓
Teacher UI updates
        ↓
Student dashboard should eventually show updated attendance
```

Determine the appropriate refresh/invalidation mechanism.

Do not introduce unnecessary real-time infrastructure if normal refetching is sufficient.

---

# 28. Error Handling Audit

Every API should have clear behavior for:

```text
200 / success
400 / validation error
401 / unauthenticated
403 / unauthorized
404 / not found
409 / conflict
500 / server error
```

Frontend should not silently fail.

For example, if a student cannot load attendance:

```text
Unable to load attendance.

[Retry]
```

not a blank page.

---

# 29. Registration Consistency Test

A newly registered student must automatically receive all required relationships.

The registration process should NOT depend on the frontend manually creating:

```text
Student
Section
Enrollment
Course mapping
```

where these relationships can be determined by the backend.

The backend should perform the required transaction safely.

Conceptually:

```text
BEGIN TRANSACTION

Create User
Create Student
Assign Program/Year/Semester
Assign Section
Create required Enrollment relationships
Create FaceEmbedding if provided
Create AuditLog

COMMIT
```

If any critical step fails:

```text
ROLLBACK
```

Do not leave half-created students.

---

# 30. Transaction / Atomicity Audit

Identify operations that must be atomic.

Especially:

```text
Student registration
Attendance marking
Attendance correction
Course enrollment
Session creation
Session closure
```

For each operation determine whether Prisma transactions are required.

---

# 31. Audit Log Audit

Verify that AuditLog is actually useful.

Important events should include:

```text
USER_REGISTERED
LOGIN_SUCCESS
LOGIN_FAILED
STUDENT_CREATED
SESSION_STARTED
SESSION_CLOSED
ATTENDANCE_MARKED
ATTENDANCE_CORRECTION_REQUESTED
ATTENDANCE_CORRECTION_APPROVED
ATTENDANCE_CORRECTION_REJECTED
MANUAL_ATTENDANCE_CHANGED
```

Do not log passwords, tokens, or sensitive biometric data.

---

# 32. Face Data Audit

Verify:

```text
Registration
 ↓
Face detection
 ↓
Embedding
 ↓
Student association
 ↓
Storage
 ↓
Verification
```

Make sure the face embedding is tied to the correct Student record and not merely the User record unless that is explicitly how the schema is designed.

Do not expose face embeddings to:

```text
Student frontend
Teacher frontend
Admin frontend
```

unless absolutely necessary.

---

# 33. QR Data Audit

Verify:

```text
Static QR
Dynamic QR
Session
Student
Teacher
Expiration
Replay protection
```

Make sure a QR cannot be used:

```text
outside its session
after expiration
by an unauthorized user
multiple times where replay should be prevented
```

---

# 34. Frontend Type Consistency

Search all TypeScript interfaces/types.

Check that:

```text
Student
Teacher
Course
Attendance
Session
Schedule
CorrectionRequest
```

have consistent definitions.

Do not have:

```text
Student interface A
Student interface B
Student interface C
```

with different field names for the same backend entity.

Create shared types where appropriate.

---

# 35. API Response Consistency

For every important entity, define a predictable response format.

For example:

```text
Student
{
  id,
  name,
  rollNumber,
  email,
  section,
  semester
}
```

Do not make one API return:

```text
fullName
```

and another return:

```text
name
```

unless there is a deliberate DTO reason.

---

# 36. Performance Audit

Check for inefficient queries such as:

```text
N+1 queries
```

especially:

```text
Teacher
 ↓
Courses
 ↓
Students
 ↓
Attendance
```

and:

```text
Student
 ↓
Courses
 ↓
Teachers
 ↓
Timetable
 ↓
Attendance
```

Use appropriate Prisma `include`, `select`, joins/relations, pagination, and indexes.

Do not fetch huge datasets when only summary data is required.

---

# 37. Database Index Audit

Identify fields frequently queried:

```text
userId
studentId
teacherId
courseId
sectionId
sessionId
email
rollNumber
```

Determine whether appropriate indexes/unique constraints exist.

Do not change them during diagnosis; simply report what is needed.

---

# 38. Produce a COMPLETE DIAGNOSTIC REPORT

Before changing any code, provide a report with these sections:

```text
1. Current Architecture
2. Current Database Architecture
3. Authentication Flow
4. Authorization Flow
5. Student Data Flow
6. Teacher Data Flow
7. Admin Data Flow
8. Course/Section/Enrollment Flow
9. Attendance Data Flow
10. Timetable Data Flow
11. Correction Request Flow
12. Face Verification Flow
13. QR Flow
14. API Inventory
15. Frontend API Mapping
16. Prisma Relationship Audit
17. Static/Mock Data Audit
18. Missing Connections
19. Broken Connections
20. Duplicate Sources of Truth
21. Data Loss Risks
22. Security Risks
23. Stale Data/Refresh Risks
24. Performance Risks
25. Orphan Data Risks
26. Required Database Changes
27. Required Backend Changes
28. Required Frontend Changes
29. Testing Strategy
30. Migration/Deployment Strategy
```

---

# 39. Create a Connection Matrix

This is mandatory.

Create a final matrix like:

| Entity              | DB | Backend | Student | Teacher | Admin      | Status |
| -------------------- | -- | ------- | ------- | ------- | ---------- | ------ |
| Student              | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Teacher              | ✓  | ✓       | -       | ✓       | ✓          |        |
| Course               | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Section              | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Enrollment           | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Timetable            | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Attendance Session   | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Attendance Record    | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Correction Request   | ✓  | ✓       | ✓       | ✓       | ✓          |        |
| Face Embedding       | ✓  | ✓       | -       | -       | restricted |        |
| Audit Log            | ✓  | ✓       | -       | -       | ✓          |        |

Mark each as:

```text
CONNECTED
PARTIAL
BROKEN
MISSING
DUPLICATED
UNSAFE
```

---

# 40. Create a Dependency Graph

For each major feature, show its dependencies.

Example:

```text
Student Dashboard
│
├── Authentication
├── Student
├── Section
├── Courses
├── Teacher Assignment
├── Attendance
├── Timetable
└── Notifications
```

Teacher Attendance:

```text
Teacher Attendance
│
├── Authentication
├── Teacher
├── Course
├── Section
├── Enrollment
├── Student
├── Attendance Session
├── Face/QR verification
└── Attendance Record
```

Admin Reports:

```text
Admin Reports
│
├── Students
├── Teachers
├── Courses
├── Sections
├── Attendance Sessions
├── Attendance Records
└── Audit Logs
```

This should reveal missing dependencies.

---

# 41. Define the Correct Source of Truth

The final architecture must follow:

```text
                    PostgreSQL
                         │
                         │
                  Prisma / Backend
                         │
             ┌───────────┼───────────┐
             │           │           │
          Student      Teacher      Admin
          Frontend     Frontend     Frontend
```

NOT:

```text
Student frontend
   ↓
own data

Teacher frontend
   ↓
different data

Admin frontend
   ↓
different data
```

All three portals must derive their information from the same backend/database truth.

---

# 42. No Silent Data Duplication

If the same information is already stored in the database, do not create another copy in:

```text
React constants
localStorage
sessionStorage
mock JSON
hardcoded arrays
frontend configuration
```

unless it is genuinely static configuration.

For example:

```text
Course → Teacher
```

must not be separately hardcoded in:

```text
StudentCourses.tsx
TeacherCourses.tsx
AdminCourses.tsx
```

---

# 43. Final Bulletproof Implementation Plan

After diagnosis, create a phased plan.

Do NOT immediately fix everything.

Prioritize:

### Phase 1 — Critical Data Integrity

```text
Student identity
Relationships
Enrollment
Course mapping
Teacher mapping
Database constraints
Transactions
```

### Phase 2 — Backend/API Consistency

```text
Controllers
Services
DTOs
Authentication
Authorization
API responses
```

### Phase 3 — Student Portal

```text
Dashboard
Courses
Attendance
Analytics
Schedule
Profile
```

### Phase 4 — Teacher Portal

```text
Courses
Students
Attendance sessions
Attendance sheets
Manual attendance
QR
Face
```

### Phase 5 — Admin Portal

```text
Students
Teachers
Courses
Attendance
Reports
Logs
```

### Phase 6 — Cross-Portal Synchronization

Test:

```text
Student → Teacher
Student → Admin
Teacher → Student
Teacher → Admin
Admin → Student
Admin → Teacher
```

### Phase 7 — Security & Reliability

```text
Authorization
Data isolation
Duplicate prevention
Transactions
Audit logs
Error handling
```

### Phase 8 — Final E2E Testing

Perform complete real-world workflows.

---

# 44. Mandatory End-to-End Test

Use a brand-new student.

```text
REGISTER STUDENT
      ↓
LOGIN
      ↓
STUDENT DASHBOARD
      ↓
VERIFY COURSES
      ↓
VERIFY TEACHERS
      ↓
VERIFY TIMETABLE
      ↓
TEACHER LOGIN
      ↓
OPEN COURSE
      ↓
VERIFY STUDENT APPEARS
      ↓
START ATTENDANCE
      ↓
MARK STUDENT PRESENT
      ↓
VERIFY TEACHER ATTENDANCE SHEET
      ↓
STUDENT LOGIN/REFRESH
      ↓
VERIFY ATTENDANCE HISTORY
      ↓
VERIFY ATTENDANCE ANALYTICS
      ↓
ADMIN LOGIN
      ↓
VERIFY STUDENT
      ↓
VERIFY COURSE
      ↓
VERIFY ATTENDANCE
      ↓
VERIFY AUDIT LOG
```

Then test:

```text
Student A
Student B
Teacher A
Teacher B
```

to ensure there is no cross-account data leakage.

---

# 45. Final Success Criteria

Do not consider the system integrated until ALL of these are true:

```text
✓ New registration automatically creates complete valid relationships

✓ Student appears everywhere they should appear

✓ Student does not appear where they should not appear

✓ Teacher sees correct enrolled students

✓ Student sees correct courses

✓ Teacher mappings are consistent

✓ Admin sees the same underlying data

✓ Attendance is stored once and read everywhere

✓ Attendance history updates correctly

✓ Attendance analytics updates correctly

✓ Correction requests affect the actual attendance record

✓ Timetable is consistent across portals

✓ No important production data is hardcoded

✓ No duplicate sources of truth exist

✓ No orphan records are created

✓ Database constraints prevent invalid relationships

✓ Transactions prevent partial registration/attendance operations

✓ Authentication correctly identifies the current user

✓ Authorization prevents cross-user access

✓ APIs return consistent DTOs

✓ Frontend handles loading/error/empty states

✓ Refreshing the page does not lose data

✓ Logging out and logging back in loads the correct account

✓ New students work without manually modifying the database

✓ Existing students continue to work

✓ Teacher-side attendance sheets automatically reflect registered/enrolled students

✓ Admin reports reflect the same attendance records as Student and Teacher portals

✓ Audit logs correctly record critical operations
```

---

# FINAL INSTRUCTION

**Do not make any code changes during this diagnostic stage.**

First inspect the entire existing implementation and produce the complete diagnostic report, connection matrix, dependency graph, list of all issues, severity ranking, root cause of each issue, and the final phased implementation plan.

For every issue, explain:

```text
WHAT IS BROKEN
        ↓
WHY IT IS BROKEN
        ↓
WHERE IT IS BROKEN
        ↓
WHAT DEPENDS ON IT
        ↓
HOW IT SHOULD BE FIXED
        ↓
HOW WE WILL TEST IT
```

Prioritize **root-cause fixes over individual UI fixes**.

For example, if a newly registered student does not appear in:

```text
Teacher → Attendance → Attendance Sheets
```

do NOT simply modify `AttendanceSheets.tsx`.

Trace the complete relationship:

```text
Registration
→ Student
→ Section
→ Enrollment
→ Course
→ Teacher Assignment
→ Attendance Eligibility
→ Attendance Sheet API
→ Frontend
```

Find the actual broken link and fix the underlying architecture.

The ultimate goal is:

> **One Student + One Teacher + One Admin system, backed by one consistent database source of truth, where every valid change automatically propagates to every authorized portal that depends on that data.**

Do not optimize for "making the UI look correct."

Optimize for **correct data, correct relationships, correct authorization, zero unintended data loss, and reliable synchronization across the entire VeriSync system.**

Again: **DIAGNOSE FIRST. DO NOT CHANGE CODE UNTIL THE FULL REPORT AND BULLETPROOF PLAN ARE PRODUCED.**

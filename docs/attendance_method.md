# VeriSync Attendance Methods

## Purpose

VeriSync supports five attendance methods:

1. Face Verification Attendance
2. OTP Email Attendance
3. QR Code Attendance
4. Dynamic QR Attendance
5. Manual Roll Call

Each attendance session uses **exactly one** method selected by the teacher when the session starts. Students cannot switch to another method for an already-running session.

The selected method is stored against the `AttendanceSession` and determines how the student is verified before an `AttendanceRecord` is created.

---

# 1. Face Verification Attendance

## Overview

The teacher starts a Face Verification session and opens the device camera. Students come one by one in front of the camera.

The system compares the captured face with the student's previously registered face embedding.

## Student Identity Mapping

The face must not be mapped only to a student's name.

```text
Camera Image
    ↓
Face Detection
    ↓
Face Embedding
    ↓
Face Matching
    ↓
StudentProfile ID
    ↓
Student
    ↓
Name / Roll Number / Email / Section / Semester / Programme
```

The database student identity is the source of truth.

## Teacher Flow

```text
Teacher Dashboard
    ↓
Start Attendance
    ↓
Select Course / Session
    ↓
Select "Face Verification"
    ↓
Start Session
    ↓
Teacher Camera Opens
```

The teacher sees the camera and attendance count.

## Student Flow

Students appear one by one.

The system:

1. Captures the face.
2. Detects the face.
3. Generates/uses the face embedding.
4. Compares it against registered face data.
5. Identifies the student.
6. Verifies that the student belongs to the current session.
7. Checks whether attendance has already been marked.
8. Creates the attendance record if valid.

Example success:

```text
Rahul Kumar
MCA001

Attendance Marked Successfully
```

If already marked:

```text
Attendance already marked.
```

No duplicate record should be created.

---

# 2. OTP Email Attendance

## Overview

OTP attendance is a session-wide verification method.

When the teacher selects OTP attendance, the system generates one 6-digit OTP for the attendance session.

The OTP is sent to the registered email addresses of all eligible students in that session.

This method does **not** mix Face Verification and OTP. If the teacher selects OTP, all students use OTP for that session.

## Teacher Flow

```text
Teacher Dashboard
    ↓
Start Attendance
    ↓
Select "OTP Email"
    ↓
Start Session
    ↓
Generate 6-digit OTP
    ↓
Send OTP to eligible students
```

Example:

```text
OTP: 847291
```

## Student Flow

The student logs into the main VeriSync website.

```text
Attendance Session

Subject:
Database Management System

Semester:
I

Section:
A

OTP has been sent to your registered email.

Enter 6-digit OTP:

[ _ _ _ _ _ _ ]

[ Verify & Mark Attendance ]
```

The backend verifies:

```text
OTP exists
+
OTP belongs to this attendance session
+
OTP is not expired
+
Student is authenticated
+
Student belongs to this session
+
Attendance has not already been marked
```

If valid:

```text
Attendance Marked Successfully
```

The OTP identifies the session; the authenticated student account identifies which student receives the attendance record.

---

# 3. QR Code Attendance

## Overview

QR Code Attendance uses a student's permanent, unique QR identity.

Each registered student receives one unique QR code mapped to their student identity.

The QR should preferably contain an opaque identifier or signed token instead of exposing sensitive student information directly.

## Student QR Identity

```text
Student
    ↓
Student ID
    ↓
Unique QR Identity
    ↓
Permanent Student QR Code
```

Example:

```text
Student: Rahul Kumar
Roll: MCA001
Student ID: stu_8f72...
QR Identity: QR-9X72A81...
```

The backend maps the QR identity to the student's database record.

## Teacher Flow

```text
Teacher Dashboard
    ↓
Start Attendance
    ↓
Select "QR Code Attendance"
    ↓
Start Session
    ↓
Teacher Camera Opens
    ↓
QR Scanner Opens
```

Students come one by one and show their unique QR code.

The backend performs:

```text
QR Code
    ↓
Unique Student Identifier
    ↓
StudentProfile
    ↓
Session Eligibility Check
    ↓
Duplicate Check
    ↓
Attendance Record
```

If already marked:

```text
Attendance already marked.
```

No duplicate record should be created.

---

# 4. Dynamic QR Attendance

## Overview

Dynamic QR Attendance is different from the student's permanent QR code.

The teacher's device displays a QR code that changes periodically.

Example:

```text
QR Rotation: 30 seconds

00:00 → QR #1
00:30 → QR #2
01:00 → QR #3
01:30 → QR #4
```

The rotation period should be configurable from the appropriate VeriSync settings.

## Teacher Flow

```text
Teacher Dashboard
    ↓
Start Attendance
    ↓
Select "Dynamic QR Attendance"
    ↓
Configure/Use QR Rotation
    ↓
Start Session
    ↓
Dynamic QR Display
```

The dynamic QR should contain a short-lived session token and must not contain sensitive student information.

## Student Scanning

Students may scan using:

- VeriSync built-in scanner
- Phone camera
- Google Lens
- Another standard QR scanner

The QR directs the student to the VeriSync attendance portal.

Conceptually:

```text
https://verisync.example/attendance/join/<temporary-token>
```

## Student Login

If not logged in:

```text
Attendance Login

Email
[________________]

Password
[________________]

[ Login ]
```

Incorrect credentials:

```text
Invalid email or password.
```

Unregistered student:

```text
Student account not found.
```

Attendance must not be marked.

## Already Logged-In Student

Skip login and open the ongoing attendance page:

```text
ONGOING ATTENDANCE

Subject:
Database Management System

Semester:
I

Section:
A

Name:
Rahul Kumar

Roll Number:
MCA001

Email:
student@example.com

Attendance Method:
Dynamic QR

QR expires in:
17 seconds

[ MARK ATTENDANCE ]
```

The backend verifies:

```text
Authenticated Student
+
Valid Attendance Session
+
Valid Dynamic QR Token
+
Token Not Expired
+
Student Belongs To Session
+
Attendance Not Already Marked
```

Only then is an `AttendanceRecord` created.

## QR Expiration

With a 30-second rotation:

```text
QR #17
Valid: 10:00:00 → 10:00:30
```

If the student submits before 10:00:30, it succeeds.

After expiration:

```text
This QR code has expired.

Please scan the latest QR code.
```

The student must scan the new QR.

## Critical Rule

The frontend countdown is only visual feedback. The backend is the final authority.

The backend must validate the token expiration and session binding. Dynamic tokens should also use a unique nonce/version so old QR codes cannot be reused after expiration.

---

# 5. Manual Roll Call

## Overview

Manual Roll Call allows the teacher to manually mark students Present or Absent.

## Teacher Flow

```text
Teacher Dashboard
    ↓
Start Attendance
    ↓
Select "Manual Roll Call"
    ↓
Start Session
    ↓
Student List Appears
```

Example:

```text
MANUAL ATTENDANCE

Roll No    Student          Status
MCA001     Rahul Kumar      PRESENT
MCA002     Aman Kumar       ABSENT
MCA003     Priya Sharma     PRESENT
MCA004     Neha Singh       ABSENT

[ Save Attendance ]
```

The teacher can change status before saving.

## Backend

When saving:

1. Validate teacher authorization.
2. Validate attendance session.
3. Validate student membership.
4. Prevent duplicate records.
5. Create/update attendance records.
6. Store verification method as `MANUAL`.

---

# Attendance Method Values

Recommended database values:

```text
FACE
OTP
STATIC_QR
DYNAMIC_QR
MANUAL
```

These values allow the Admin portal to identify how an attendance record was created.

---

# Attendance Record Identity

Every attendance record should reference the actual student database identity.

```text
AttendanceRecord
│
├── attendanceSessionId
├── studentId
├── status
├── markedAt
├── verificationMethod
└── referenceNumber
```

The student identity resolves to:

```text
Student
│
├── Student ID
├── Name
├── Roll Number
├── Email
├── Programme
├── Semester
└── Section
```

Attendance must therefore be connected to the actual student rather than only to a name, QR string, email address, or roll number.

---

# Common Attendance Validation

Before creating attendance, the backend should validate:

```text
1. Is the attendance session active?
2. Is the student authenticated/identified correctly?
3. Does the student belong to the session?
4. Is the selected verification method correct?
5. Has attendance already been marked?
6. Is the OTP/QR/token still valid where applicable?
7. Is the teacher/session authorized?
8. Can the attendance record be created safely?
```

If a required validation fails, no attendance record should be created.

---

# One Session = One Verification Method

This is mandatory.

Example:

```text
Teacher starts:
Subject: DBMS
Section: A
Method: OTP
```

All eligible students use OTP.

They cannot use:

```text
Face
Static QR
Dynamic QR
Manual
```

for that same session.

Similarly:

```text
Method = FACE
```

means students must use the Face Verification workflow.

---

# Student Registration / Initial Data Collection

The attendance system depends on students already having valid identities in VeriSync.

Student information should be collected through the VeriSync student registration/data-collection process.

The student provides their own:

- Name
- Roll Number
- Email
- Required academic information
- Other required profile details
- Face data/face enrollment where applicable

The system creates the student's database identity from this information.

For the initial mini-project, the system can be tested with approximately 10 students and later expanded to approximately 50.

Student data must not be invented by the system.

---

# Overall Attendance Architecture

```text
                         TEACHER
                            │
                            ▼
                    Start Attendance
                            │
                            ▼
                  Select ONE Method
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
      FACE                 OTP                  QR
        │                   │                   │
        │                   │          ┌────────┴────────┐
        │                   │          │                 │
        │                   │          ▼                 ▼
        │                   │      STATIC QR        DYNAMIC QR
        │                   │          │                 │
        │                   │          │                 ▼
        │                   │          │           Student Login
        │                   │          │                 │
        │                   │          │                 ▼
        │                   │          │         Mark Attendance
        │                   │          │
        ▼                   ▼          ▼
                 ATTENDANCE RECORD
                         │
                         ▼
                    PostgreSQL
```

---

# Implementation Principles

## Backend is the source of truth

Do not trust frontend:

- timers
- student IDs
- attendance status
- QR data
- OTP input

All important validation must happen on the backend.

## QR Security

Do not place unnecessary sensitive student information directly inside QR codes.

Use opaque identifiers or signed tokens.

## Duplicate Protection

Prevent duplicate attendance using both:

- Service-level duplicate checks
- Database-level uniqueness protection where appropriate

## Keep Methods Independent

Do not allow a student to choose another verification method after the teacher starts the session.

## Preserve Student Identity

The final flow should always resolve to:

```text
Verification
    ↓
Student ID
    ↓
Attendance Session
    ↓
Attendance Record
```

## Mini-Project Scope

The current goal is a fully working, efficient mini-project rather than a production/deployment-grade enterprise platform.

However, all five attendance methods must work end-to-end through:

```text
Frontend
   ↓
Backend API
   ↓
Prisma
   ↓
PostgreSQL
```

The actual attendance workflow must not depend on fake or static attendance data.

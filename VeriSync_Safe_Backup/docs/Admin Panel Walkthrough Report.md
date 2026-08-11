# VaultID — Complete Admin Panel Walkthrough Report

## Privacy-Preserving Multi-Factor Smart Attendance and Academic Course Management System

### Initial Deployment Scope

* **Institution:** Patna Women’s College
* **Department:** MCA
* **Academic Year:** Second Year
* **Initial capacity:** 36 students
* **Configured capacity:** Up to 50 students per section
* **Future scope:** Multiple departments, courses, years, sections and the entire college
* **Primary users:** Admin, teachers and students
* **Authentication method:** Email verification, password authentication and role-based access
* **Student attendance verification:** Face recognition, dynamic QR code and device/browser integrity verification

---

# 1. Purpose of the Admin Panel

The Admin Panel is the central control system of VaultID. It manages all institutional, academic and technical information required by the Teacher and Student portals.

The Admin Panel will control:

* College configuration
* Departments and academic programmes
* Academic sessions
* Years, semesters and sections
* Subjects and subject codes
* Student records
* Teacher records
* Teacher-subject assignments
* Course creation authorisation
* Course registrations
* Academic calendars
* Holidays and non-working days
* Attendance settings
* Attendance corrections
* Monthly attendance sheets
* Announcements and documents
* Verification requests
* Security monitoring
* Reports and data exports
* System settings and audit logs

Teachers and students must not be allowed to create institutional master data independently. They can only use the records configured and approved by the admin.

---

# 2. Recommended Application Separation

VaultID should be divided into three independent portals:

1. **Admin Portal**
2. **Teacher Portal**
3. **Student Portal**

Each portal should have:

* A different login page
* A different dashboard
* Different navigation menus
* Different permissions
* Separate frontend routing
* Separate protected backend modules
* Separate API access rules
* Independent session and authentication checks

A common database can be used, but every request must be protected through role-based access control.

### Suggested portal structure

* `admin.vaultid.com`
* `teacher.vaultid.com`
* `student.vaultid.com`

For a college project, these can initially be implemented as:

* `/admin`
* `/teacher`
* `/student`

However, their frontend layouts, authentication guards and backend permissions must remain completely separate.

---

# 3. Admin Panel Navigation Structure

The Admin Panel sidebar should contain the following pages:

1. Dashboard
2. College Configuration
3. Departments
4. Programmes
5. Academic Sessions
6. Academic Structure
7. Subjects
8. Teachers
9. Teacher Assignments
10. Students
11. Student Verification
12. Course Authorisations
13. Active Courses
14. Course Registrations
15. Timetable and Class Schedule
16. Academic Calendar
17. Holidays
18. Attendance Management
19. Attendance Corrections
20. Attendance Sheets
21. Reports and Analytics
22. Announcements
23. Documents and Resources
24. Notifications
25. Security Centre
26. Audit Logs
27. Data Import and Export
28. System Settings
29. Admin Management
30. Help and Support

---

# 4. Admin Dashboard

## 4.1 Purpose

The Admin Dashboard provides a complete overview of the institution’s current academic and attendance activities.

## 4.2 Dashboard header

The header should contain:

* VaultID logo
* College name
* Current academic session
* Current semester
* Search bar
* Notifications icon
* Help icon
* Admin profile picture
* Admin name
* Logout option

## 4.3 Summary cards

The dashboard should display:

* Total registered students
* Verified students
* Pending student verifications
* Total teachers
* Verified teachers
* Active courses
* Courses awaiting approval
* Classes scheduled today
* Attendance sessions conducted today
* Students present today
* Students absent today
* Average attendance percentage
* Attendance correction requests
* Upcoming holidays
* Security alerts

## 4.4 Dashboard charts

The admin should see:

* Daily attendance percentage
* Weekly attendance trend
* Monthly attendance trend
* Subject-wise attendance
* Teacher-wise class completion
* Student attendance distribution
* Low-attendance student count
* Course registration status
* Verification status distribution

## 4.5 Quick actions

The dashboard should provide buttons such as:

* Add Teacher
* Add Student
* Create Session
* Add Subject
* Assign Subject
* Generate Course Code
* Add Holiday
* View Today’s Attendance
* Export Monthly Sheet
* Publish Announcement

## 4.6 Recent activity section

It should show:

* Teacher registrations
* Student registrations
* Course creation attempts
* Course approvals
* Attendance sessions started
* Attendance edits
* Admin actions
* Failed login attempts
* Suspicious verification attempts

---

# 5. College Configuration Page

This page stores the primary institutional information.

## 5.1 College details

The admin can configure:

* College name
* College code
* Institution type
* University affiliation
* College email
* Official phone number
* College address
* Website
* Logo
* Attendance policy
* Minimum attendance percentage
* Time zone
* Working days
* Default class duration

For the initial version:

* College: Patna Women’s College
* Department: MCA
* Programme: Master of Computer Applications
* Target group: Second-year students
* Maximum section capacity: 50

## 5.2 Future expansion settings

The admin should be able to enable:

* Multiple departments
* Multiple programmes
* Multiple campuses
* Multiple academic years
* Multiple sections
* Undergraduate and postgraduate programmes

---

# 6. Departments Page

## 6.1 Purpose

This page manages all departments available in the institution.

## 6.2 Department list

The table should contain:

* Department name
* Department code
* Head of department
* Official email
* Total programmes
* Total teachers
* Total students
* Status
* Actions

## 6.3 Admin actions

The admin can:

* Add a department
* Edit department information
* Activate or deactivate a department
* Assign a department head
* View department teachers
* View department students
* Delete a department only when it has no dependent academic data

## 6.4 Initial department

* Department name: Computer Applications
* Department code: MCA or CA
* Programme: Master of Computer Applications

---

# 7. Programmes Page

A programme represents an academic course such as MCA, BCA or B.Sc.

## 7.1 Programme information

The admin enters:

* Programme name
* Programme short name
* Programme code
* Department
* Programme duration
* Total years
* Total semesters
* Admission capacity
* Section capacity
* Programme status

## 7.2 Initial programme configuration

* Programme: Master of Computer Applications
* Short name: MCA
* Year: Second Year
* Applicable semesters: Third and Fourth semester, depending on the college structure
* Maximum students: 50

---

# 8. Academic Sessions Page

## 8.1 Purpose

An academic session must be created before students, subjects or courses can be assigned.

Examples:

* 2025–2027
* 2026–2028
* 2026–2027

## 8.2 Session fields

* Session name
* Session code
* Programme
* Session start date
* Session end date
* Admission year
* Graduation year
* Current year
* Current semester
* Status
* Registration opening date
* Registration closing date

## 8.3 Session states

* Upcoming
* Registration Open
* Active
* Completed
* Archived

## 8.4 Mid-month session handling

A semester may start in the middle of a month. Therefore, the system must not automatically assume attendance begins on the first day of the month.

The admin must configure:

* Semester start date
* Teaching start date
* Attendance start date
* Semester end date
* Examination period
* Vacation period

For example, when attendance starts on 15 July:

* Dates from 1–14 July will not be counted as absence.
* They will be marked as **Not Applicable**.
* Percentage calculations will begin from 15 July.
* Only actual working or scheduled class days will be considered.

---

# 9. Academic Structure Page

This page defines the academic hierarchy.

The structure should be:

**College → Department → Programme → Session → Year → Semester → Section**

## 9.1 Admin-configurable fields

* College
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Class strength
* Class coordinator
* Start date
* End date
* Status

## 9.2 Example

* College: Patna Women’s College
* Department: Computer Applications
* Programme: MCA
* Session: 2025–2027
* Year: Second Year
* Semester: Fourth Semester
* Section: A
* Maximum students: 50

All dropdown values used by teachers must come from this configuration.

---

# 10. Subjects Page

## 10.1 Purpose

The Subjects Page contains the official subject master list.

Teachers must not be allowed to freely type an unapproved subject name or course code.

## 10.2 Subject fields

* Subject name
* Subject code
* Department
* Programme
* Session applicability
* Year
* Semester
* Subject type
* Credit value
* Weekly classes
* Theory or practical
* Subject description
* Syllabus document
* Status

## 10.3 Subject types

* Core
* Elective
* Laboratory
* Project
* Seminar
* Skill course
* Audit course

## 10.4 Subject actions

The admin can:

* Add a subject
* Edit a subject
* Activate or deactivate it
* Upload the syllabus
* Assign it to one or more semesters
* View teachers qualified to teach it
* Archive old subjects
* Prevent duplicate subject codes

---

# 11. Teachers Page

## 11.1 Purpose

This page manages teacher accounts and profiles.

## 11.2 Teacher table

The teacher list should contain:

* Profile picture
* Teacher name
* Employee ID
* Verified email
* Phone number
* Department
* Designation
* Assigned subjects
* Active courses
* Verification status
* Account status
* Last login
* Actions

## 11.3 Add Teacher form

The admin should enter:

* Full name
* Employee ID
* Official email address
* Phone number
* Department
* Designation
* Qualification
* Specialisation
* Subjects the teacher can teach
* Profile picture
* Joining date
* Account status

## 11.4 Teacher email verification

Recommended process:

1. Admin creates or pre-authorises the teacher record.
2. The teacher receives an invitation email.
3. Teacher opens the secure registration link.
4. Teacher verifies the email using an OTP or verification link.
5. Teacher creates a password.
6. Teacher uploads a profile picture.
7. Admin reviews the profile.
8. Account becomes active after approval.

Only official or admin-approved email addresses should be accepted.

## 11.5 Edit Teacher

The admin can edit:

* Teacher name
* Profile picture
* Phone number
* Department
* Designation
* Qualification
* Subject eligibility
* Account status

Changing the verified email should require:

* Admin confirmation
* New email verification
* Security log entry

## 11.6 Remove Teacher

A teacher should not be permanently deleted when academic records exist.

The admin should:

1. Open the teacher profile.
2. Click **Deactivate Teacher**.
3. Select a reason.
4. Choose whether active courses should be reassigned.
5. Assign another teacher where required.
6. Confirm deactivation.

Historical attendance and course records must remain preserved.

## 11.7 Teacher profile view

The detailed page should show:

* Personal information
* Academic information
* Assigned subjects
* Active courses
* Previous courses
* Course creation authorisations
* Class schedule
* Attendance performance
* Uploaded documents
* Announcements posted
* Login history
* Account status

---

# 12. Teacher Assignments Page

## 12.1 Purpose

This page allows the admin to specify which subjects a teacher is authorised to teach.

A teacher should be registered once and then assigned multiple subjects. Registering the same teacher separately for each subject is not recommended because it creates duplicate accounts.

## 12.2 Recommended many-to-many assignment

One teacher can teach multiple subjects, and one subject can have more than one eligible teacher.

Example:

**Teacher:** Dr. Jagadeesha R. B.

Authorised subjects:

* 5G Networks
* Wireless Communication
* Mobile Communication

## 12.3 Assignment form

The admin selects:

* Teacher
* Department
* Programme
* Academic session
* Year
* Semester
* One or more subjects
* Section
* Assignment type
* Effective date
* Expiry date

## 12.4 Assignment types

* Primary teacher
* Co-teacher
* Substitute teacher
* Laboratory instructor
* Course coordinator

## 12.5 Validation

The system must check:

* Teacher account is verified.
* Subject belongs to the selected department.
* Subject belongs to the selected programme and semester.
* Teacher has not been assigned conflicting classes.
* The same assignment does not already exist.
* The academic session is active.

---

# 13. Students Page

## 13.1 Student list

The student table should contain:

* Student profile picture
* Full name
* Roll number
* Registration number
* Email
* Phone number
* Department
* Programme
* Session
* Year
* Semester
* Section
* Face verification status
* Course registration status
* Attendance percentage
* Account status
* Actions

## 13.2 Add Student

Students can be added through:

* Individual entry
* Bulk Excel or CSV upload
* Student self-registration with admin approval

## 13.3 Student data fields

* Full name
* Roll number
* Registration number
* Email
* Phone number
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Password setup status
* Face verification status
* Account status

## 13.4 Student registration workflow

1. Admin uploads or creates the authorised student list.
2. Student opens the Student Registration page.
3. Student enters the required details.
4. The system matches the roll number and email with the authorised list.
5. Student verifies the email.
6. Student creates a password.
7. Student completes face enrolment.
8. The registration enters admin review.
9. Admin approves or rejects the account.
10. Approved courses become visible after course registration.

## 13.5 Edit Student

The admin can update:

* Phone number
* Section
* Semester
* Session
* Academic status
* Course registration
* Account status

Roll number or verified email changes should require stronger confirmation.

## 13.6 Remove Student

Students should be:

* Deactivated
* Marked as withdrawn
* Marked as graduated
* Marked as transferred
* Archived

Attendance records must not be deleted.

---

# 14. Student Verification Page

## 14.1 Purpose

This page handles identity and face verification.

## 14.2 Verification queue

The admin can see:

* Student name
* Roll number
* Registration email
* Submitted photograph
* Face enrolment image
* Match confidence
* Submission time
* Verification status
* Risk indicators

## 14.3 Admin actions

* Approve
* Reject
* Request resubmission
* Temporarily suspend
* Reset face data
* Add review comments

## 14.4 Face data privacy

The system should preferably store:

* Encrypted facial embeddings
* Verification metadata
* Consent record
* Enrolment date

Raw images should be protected and retained only according to institutional policy.

---

# 15. Course Authorisations Page

This is one of the most important security pages.

## 15.1 Purpose

The admin creates a secure authorisation that allows an assigned teacher to create a particular course.

The teacher cannot create the course merely by knowing the subject name. The teacher must possess a valid course authorisation code.

## 15.2 Course authorisation fields

* Teacher name
* Teacher verified email
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Subject name
* Subject code
* Authorisation code
* Code expiry date
* Maximum uses
* Status
* Created by
* Created date

## 15.3 Course authorisation code

The admin can click:

**Generate Secure Code**

The system creates a random code, such as:

`qmb28GHy9K`

Recommended minimum:

* 10–12 characters
* Uppercase letters
* Lowercase letters
* Numbers
* Cryptographically secure random generation

## 15.4 Code security rules

The code should be:

* Connected to one teacher
* Connected to one subject
* Connected to one session
* Connected to one semester
* Connected to one section
* Single-use by default
* Time-limited
* Stored in hashed form
* Invalid after course creation
* Regenerable only by an authorised admin

## 15.5 Course creation validation

When the teacher creates a course, the backend verifies:

* Teacher email matches the assignment.
* Teacher account is active.
* Subject is assigned to that teacher.
* Department matches.
* Session matches.
* Semester matches.
* Section matches.
* Authorisation code is correct.
* Code is unused.
* Code is not expired.
* Course does not already exist.

The course should not be created when any validation fails.

## 15.6 Code states

* Generated
* Delivered
* Used
* Expired
* Revoked
* Regenerated

## 15.7 Admin actions

The admin can:

* Generate a code
* Copy the code
* Send it through verified email
* Revoke it
* Extend its expiry
* Regenerate it
* View usage history
* View failed attempts

---

# 16. Active Courses Page

## 16.1 Purpose

This page displays all course classrooms created by teachers.

## 16.2 Course card appearance

The admin can view course cards similar to Google Classroom, containing:

* Course banner
* Subject name
* Subject code
* Teacher name and photograph
* Session
* Semester
* Section
* Enrolled student count
* Course status

## 16.3 Course details page

It should contain:

* Course name
* Course code
* Teacher
* Co-teachers
* Department
* Programme
* Session
* Year
* Semester
* Section
* Enrolled students
* Course schedule
* Attendance summary
* Announcements
* Uploaded files
* Messages
* Creation authorisation
* Activity history

## 16.4 Admin controls

The admin can:

* Approve a course
* Suspend a course
* Change teacher
* Add a co-teacher
* Change course banner
* Lock course registration
* Archive the course
* View course activity
* Export the course roster
* Disable course messaging

---

# 17. Course Registrations Page

## 17.1 Purpose

This page controls which students are enrolled in which courses.

## 17.2 Registration methods

### Automatic registration

Students are automatically enrolled based on:

* Department
* Programme
* Session
* Year
* Semester
* Section
* Subject curriculum

This is the recommended method for compulsory subjects.

### Admin-controlled registration

The admin manually selects students for:

* Elective courses
* Repeat courses
* Backlog subjects
* Special classes
* Optional workshops

### Student request with approval

Students request course enrolment, and the admin or teacher approves it.

## 17.3 Course registration table

* Student name
* Roll number
* Course
* Course code
* Teacher
* Semester
* Section
* Registration method
* Approval status
* Registration date
* Actions

## 17.4 Course enrolment validation

The system should prevent:

* Duplicate enrolment
* Enrolment into another semester without permission
* Enrolment into an inactive course
* Registration after the deadline
* Registration beyond section capacity
* Registration into a course from another programme unless specially approved

---

# 18. Timetable and Class Schedule Page

## 18.1 Purpose

Attendance should be connected to scheduled classes rather than blindly marking every calendar day.

## 18.2 Schedule fields

* Course
* Teacher
* Day
* Start time
* End time
* Classroom
* Class type
* Effective start date
* Effective end date
* Recurrence
* Attendance method

## 18.3 Class types

* Theory
* Practical
* Tutorial
* Seminar
* Extra class
* Replacement class
* Online class

## 18.4 Conflict detection

The system should warn about:

* Teacher time conflict
* Section time conflict
* Classroom conflict
* Duplicate schedule
* Holiday conflict

---

# 19. Academic Calendar Page

## 19.1 Purpose

The academic calendar determines which dates are working, non-working, examination or vacation days.

## 19.2 Calendar event types

* Working day
* Holiday
* College event
* Examination
* Vacation
* Semester break
* Admission activity
* Teacher training
* Restricted holiday
* Special working day
* Cancelled class day

## 19.3 Calendar behaviour

Attendance calculations should include only:

* Scheduled classes
* Official working days
* Extra classes approved by the admin

Attendance calculations should exclude:

* Holidays
* Sundays or configured weekly offs
* Vacations
* Examination breaks
* Dates before the semester starts
* Dates after the semester ends
* Cancelled classes

---

# 20. Holidays Page

## 20.1 Recommended holiday system

The admin should not manually alter every attendance sheet after adding a holiday. Holidays should be centrally managed and automatically reflected everywhere.

## 20.2 Holiday fields

* Holiday name
* Date
* End date
* Holiday type
* Applicable department
* Applicable programme
* Applicable session
* Applicable section
* Description
* Recurring annually
* Status

## 20.3 Holiday types

* National holiday
* State holiday
* College holiday
* Department holiday
* Emergency closure
* Vacation
* Examination break

## 20.4 Attendance-sheet representation

A holiday should be represented as:

* `H` for Holiday

It must not be represented as:

* `0` for Absent

It must not reduce the student’s attendance percentage.

## 20.5 Special working day

When a Sunday or normal holiday is declared a working day, the admin can mark it as:

* Special Working Day

The system will allow attendance for that date.

## 20.6 Class-specific cancellation

A holiday is institution-wide or group-wide. A single cancelled lecture should be handled separately as:

* Class Cancelled

It should be marked as:

* `C`

It must not be included in the attendance denominator.

---

# 21. Attendance Management Page

## 21.1 Purpose

This is the central monitoring page for all attendance activity.

## 21.2 Attendance table

The admin can filter by:

* Date
* Department
* Programme
* Session
* Year
* Semester
* Section
* Teacher
* Course
* Subject
* Attendance status
* Verification method

## 21.3 Attendance statuses

* Present: `1`
* Absent: `0`
* Holiday: `H`
* Class cancelled: `C`
* Not applicable: `NA`
* Excused absence: `E`
* Pending review: `P`
* Manually corrected: `M`

For numerical totals:

* Present contributes `1`
* Absent contributes `0`
* Holiday is excluded
* Cancelled class is excluded
* Not applicable is excluded
* Excused absence should follow college policy

## 21.4 Attendance methods

The admin can configure:

* Face verification
* Dynamic QR code
* Face plus QR
* Face plus QR plus browser/device verification
* Teacher manual attendance for emergencies

## 21.5 Live session monitoring

The admin should be able to see:

* Course
* Teacher
* Class start time
* Attendance window
* Number of enrolled students
* Number marked present
* Number absent
* Duplicate attempts
* Face mismatch attempts
* Invalid QR attempts
* Suspicious device activity

## 21.6 Manual attendance restriction

Manual attendance should be allowed only when:

* The attendance system fails.
* The teacher provides a reason.
* The correction is approved by an admin.
* The change is recorded in the audit log.

---

# 22. Attendance Correction Page

## 22.1 Correction request information

* Student
* Roll number
* Course
* Date
* Existing status
* Requested status
* Reason
* Supporting document
* Submitted by
* Teacher recommendation
* Admin decision

## 22.2 Correction workflow

1. Student or teacher submits a correction request.
2. The teacher reviews it.
3. The admin receives the recommendation.
4. Admin approves or rejects it.
5. Attendance is updated.
6. The change is added to the audit log.
7. The student and teacher receive a notification.

## 22.3 Correction controls

The admin can:

* Approve
* Reject
* Request additional evidence
* Change attendance status
* Add remarks
* Undo a correction
* View correction history

No attendance record should be silently overwritten.

---

# 23. Attendance Sheets Page

## 23.1 Recommended sheet structure

The most practical format is:

* **Rows:** Students
* **Columns:** Dates

This makes one student’s monthly attendance easy to understand.

### Example columns

| Roll No. | Student Name | 01 | 02 | 03 | 04 |  … | 30 | Present | Conducted | Attendance % |
| -------- | ------------ | -: | -: | -: | -: | -: | -: | ------: | --------: | -----------: |
| MCA001   | Student A    |  1 |  1 |  H |  0 |  … |  1 |      27 |        29 |       93.10% |
| MCA002   | Student B    |  1 |  0 |  H |  1 |  … |  1 |      25 |        29 |       86.21% |

## 23.2 Sheet grouping

Separate sheets should be generated based on:

* Course
* Subject
* Section
* Month
* Semester
* Teacher

Recommended workbook:

* Summary
* Subject 1
* Subject 2
* Subject 3
* Low Attendance
* Holiday List
* Correction History

## 23.3 Attendance percentage formula

[
\text{Attendance Percentage}
============================

\frac{\text{Classes Present}}
{\text{Classes Conducted}}
\times 100
]

Example:

* Present: 30
* Conducted classes: 30
* Attendance: 100%

When there are 4 holidays:

* Present: 26
* Conducted classes: 26
* Attendance: 100%

The holidays must not be counted in the denominator.

## 23.4 Daily versus subject-wise attendance

For higher accuracy, attendance should be subject-wise and class-wise rather than only day-wise.

A student may:

* Attend the first lecture.
* Miss the second lecture.
* Attend the third lecture.

Therefore, VaultID should maintain:

* A detailed class-level attendance record
* A simplified monthly export sheet

## 23.5 Mid-month start

When a semester starts on 15 July:

* Dates 1–14 are marked `NA`.
* Those dates are excluded from attendance calculations.
* Dates from 15 July onward are included when classes are conducted.

## 23.6 Month length

The system must support:

* 28 days
* 29 days
* 30 days
* 31 days

It must not permanently assume that every month contains 30 days.

## 23.7 Teacher download permissions

Teachers can download sheets only for:

* Their assigned courses
* Their assigned sections
* Authorised academic sessions

## 23.8 Admin download permissions

Admin can download:

* Individual student report
* Course report
* Subject report
* Section report
* Teacher report
* Monthly report
* Semester report
* College-level report

Formats:

* Excel
* CSV
* PDF
* Printable report

---

# 24. Reports and Analytics Page

## 24.1 Student reports

* Daily attendance
* Weekly attendance
* Monthly attendance
* Subject-wise attendance
* Semester attendance
* Low-attendance report
* Absence streak
* Attendance correction history

## 24.2 Teacher reports

* Total classes scheduled
* Total classes conducted
* Cancelled classes
* Attendance sessions completed
* Average student attendance
* Manual attendance frequency
* Pending correction requests

## 24.3 Course reports

* Enrolled students
* Average attendance
* Total lectures
* Completed lectures
* Low-attendance students
* Highest attendance
* Attendance trend
* Course activity

## 24.4 Administrative reports

* Student verification status
* Teacher verification status
* Active accounts
* Suspended accounts
* Failed login attempts
* Face mismatch attempts
* QR misuse attempts
* Data export history

## 24.5 Attendance thresholds

The admin should configure:

* Safe attendance: 75% or above
* Warning: 65%–74.99%
* Critical: below 65%

These values should remain configurable according to college rules.

---

# 25. Announcements Page

## 25.1 Purpose

The admin can publish institutional or academic announcements.

## 25.2 Announcement fields

* Title
* Message
* Audience
* Department
* Programme
* Session
* Semester
* Section
* Course
* Attachment
* Publish date
* Expiry date
* Priority

## 25.3 Audience options

* All users
* All teachers
* All students
* Selected department
* Selected session
* Selected semester
* Selected section
* Selected course
* Individual user

## 25.4 Moderation

Course-level announcements posted by teachers can be:

* Automatically published
* Held for admin review
* Flagged by students
* Removed by admin

---

# 26. Documents and Resources Page

## 26.1 Document categories

* Syllabus
* Timetable
* Academic calendar
* Attendance policy
* Course material
* Assignment
* Notes
* Circular
* Examination notice
* Administrative form

## 26.2 Admin controls

The admin can:

* Upload files
* Edit file information
* Replace files
* Restrict access
* Assign documents to courses
* Set expiry dates
* Archive files
* View download counts

## 26.3 File security

The system should validate:

* File type
* File size
* Malware scan status
* Uploading user
* Access permission

---

# 27. Notifications Page

The admin can manage:

* Email notifications
* In-application notifications
* Attendance shortage warnings
* Course approval alerts
* Verification alerts
* Attendance correction alerts
* Holiday notifications
* Class cancellation notices
* Registration reminders

## 27.1 Automated notifications

Examples:

* Attendance falls below 75%.
* Teacher course code is about to expire.
* Student verification is pending.
* Course registration deadline is approaching.
* Attendance correction is approved.
* A suspicious login is detected.

---

# 28. Security Centre

## 28.1 Purpose

The Security Centre protects the system from unauthorised access and attendance fraud.

## 28.2 Security dashboard

It should show:

* Failed login attempts
* Locked accounts
* Repeated face mismatches
* Multiple accounts using one device
* QR reuse attempts
* Expired QR attempts
* Unusual location attempts
* Course-code failures
* Suspicious attendance corrections
* Unusual data exports

## 28.3 Admin controls

The admin can:

* Lock an account
* Unlock an account
* Force password reset
* Revoke active sessions
* Reset face enrolment
* Disable attendance access
* Block a device
* Mark an alert as resolved
* Add security remarks

## 28.4 QR security

Attendance QR codes should be:

* Dynamic
* Time-limited
* Course-specific
* Class-specific
* Session-specific
* Regenerated automatically
* Invalid after the attendance window

A screenshot of an old QR code must not work.

## 28.5 Device/browser verification

The system can record:

* Browser fingerprint
* Device identifier
* Login session
* IP information
* Attendance timestamp
* QR validation result
* Face match result

These checks should support fraud detection rather than becoming the sole attendance decision.

---

# 29. Audit Logs Page

Every sensitive action must be recorded.

## 29.1 Logged actions

* Teacher added
* Teacher edited
* Teacher deactivated
* Student added
* Student edited
* Face data reset
* Subject assigned
* Course code generated
* Course code revoked
* Course created
* Attendance edited
* Correction approved
* Report downloaded
* Holiday added
* Account locked
* Settings changed

## 29.2 Audit entry fields

* User
* Role
* Action
* Target record
* Old value
* New value
* Date and time
* IP address
* Device details
* Reason
* Result

Audit records should not be editable by normal administrators.

---

# 30. Data Import and Export Page

## 30.1 Bulk import

The admin can import:

* Students
* Teachers
* Subjects
* Academic sessions
* Course mappings
* Timetables
* Holidays

Supported formats:

* Excel
* CSV

## 30.2 Import validation

Before saving, the system should display:

* Valid records
* Duplicate records
* Missing fields
* Invalid emails
* Duplicate roll numbers
* Invalid subject codes
* Unknown departments
* Incorrect semesters

The admin should confirm the preview before import.

## 30.3 Export history

The system should record:

* Who exported the data
* Type of report
* Filters used
* Export time
* File format
* Number of records

---

# 31. System Settings Page

## 31.1 Attendance settings

* Minimum attendance percentage
* Attendance opening time
* Attendance closing time
* Late attendance policy
* Face match threshold
* QR validity duration
* Manual attendance permission
* Correction request deadline
* Excused absence policy

## 31.2 Account settings

* Password length
* Password complexity
* OTP expiry
* Failed login limit
* Account lock duration
* Session timeout
* Email verification expiry
* Multi-factor authentication

## 31.3 Course settings

* Course authorisation code length
* Code expiry duration
* Maximum code attempts
* Course approval requirement
* Maximum students per course
* Student messaging permission
* Announcement moderation

## 31.4 Data settings

* Data retention duration
* Backup schedule
* Export permission
* Face-image retention
* Log retention
* Archive policy

---

# 32. Admin Management Page

The system may eventually contain more than one admin.

## 32.1 Admin roles

* Super Admin
* College Admin
* Department Admin
* Attendance Admin
* Academic Coordinator
* Read-only Auditor

## 32.2 Permission examples

### Super Admin

* Full system access
* Manage other admins
* Change security settings
* View all audit logs

### Department Admin

* Manage teachers and students within the department
* Manage department courses
* View department attendance

### Attendance Admin

* Review attendance
* Approve corrections
* Generate reports

### Auditor

* View data and reports
* Cannot edit or delete information

---

# 33. Recommended Admin Workflows

## 33.1 Initial system setup

1. Add college information.
2. Create the department.
3. Create the MCA programme.
4. Create the academic session.
5. Configure year and semester.
6. Create the section.
7. Configure semester dates.
8. Add subjects and subject codes.
9. Add teachers.
10. Assign subjects to teachers.
11. Add or import students.
12. Verify student accounts.
13. Configure timetable.
14. Configure holidays.
15. Generate course authorisation codes.
16. Allow teachers to create courses.
17. Approve active courses.
18. Register students into courses.
19. Begin attendance operations.

## 33.2 Teacher onboarding

1. Admin creates a teacher record.
2. Admin enters the official email.
3. Teacher receives an invitation.
4. Teacher verifies the email.
5. Teacher completes the profile.
6. Admin approves the account.
7. Admin assigns one or more subjects.
8. Admin creates a course authorisation.
9. Secure code is sent to the teacher.
10. Teacher creates the authorised course.
11. Admin reviews the created course.

## 33.3 Subject assignment and code generation

1. Open **Teacher Assignments**.
2. Select the teacher.
3. Select department, programme and session.
4. Select year and semester.
5. Select multiple authorised subjects.
6. Save the assignment.
7. Open **Course Authorisations**.
8. Select one assigned subject.
9. Select section and validity.
10. Generate the secure code.
11. Send the code to the teacher’s verified email.
12. Track whether the code is used, expired or revoked.

## 33.4 Student onboarding

1. Upload authorised student records.
2. Student self-registers.
3. Email and roll number are matched.
4. Student verifies the email.
5. Student completes face enrolment.
6. Admin reviews the registration.
7. Admin approves the student.
8. Courses are automatically assigned.
9. Student sees enrolled course cards.

---

# 34. Additional Essential Features

## 34.1 Search and filtering

Every major table should provide:

* Search
* Sorting
* Filters
* Pagination
* Column selection
* Export
* Saved filter views

## 34.2 Soft deletion

Teachers, students, courses and attendance records should not be permanently deleted when they are connected to historical data.

Use:

* Active
* Inactive
* Suspended
* Archived
* Withdrawn
* Completed

## 34.3 Confirmation system

Sensitive actions should require:

* Confirmation dialogue
* Admin password
* OTP for highly sensitive changes
* Reason entry
* Audit logging

## 34.4 Backup and recovery

The admin should have access to:

* Last backup time
* Backup status
* Restore request
* Database health
* Storage usage

Restoration should be restricted to the Super Admin.

## 34.5 Accessibility

The Admin Panel should support:

* Keyboard navigation
* Responsive design
* Clear labels
* Readable contrast
* Error descriptions
* Loading indicators
* Empty states
* Confirmation messages

---

# 35. Recommended Admin Panel Design

The Admin Panel should not look exactly like Google Classroom because an administrator requires more management tables and analytics.

A suitable layout would contain:

### Left sidebar

* Dashboard
* Academic Setup
* Users
* Courses
* Attendance
* Communication
* Reports
* Security
* Settings

Expandable groups can keep the menu organised.

### Top header

* College and session selector
* Global search
* Notifications
* Quick-add button
* Admin profile

### Main workspace

Use:

* Dashboard cards
* Data tables
* Charts
* Form drawers
* Confirmation modals
* Course cards
* Calendar views
* Attendance matrices

### Quick-add menu

The `+` button can contain:

* Add Teacher
* Add Student
* Add Subject
* Create Session
* Generate Course Code
* Add Holiday
* Publish Announcement

---

# 36. Final Admin-Side Page Grouping

For a cleaner interface, the 30 pages can be organised into eight sidebar groups.

## Dashboard

* Dashboard

## Academic Setup

* College Configuration
* Departments
* Programmes
* Academic Sessions
* Academic Structure
* Subjects
* Timetable
* Academic Calendar
* Holidays

## User Management

* Teachers
* Teacher Assignments
* Students
* Student Verification
* Admin Management

## Course Management

* Course Authorisations
* Active Courses
* Course Registrations

## Attendance

* Attendance Management
* Attendance Corrections
* Attendance Sheets

## Communication

* Announcements
* Documents
* Notifications

## Reports and Security

* Reports and Analytics
* Security Centre
* Audit Logs
* Data Import and Export

## Settings

* System Settings
* Help and Support

---

# 37. Final Administrative Control Principle

VaultID should follow this rule:

> The admin creates and controls institutional data, the teacher operates authorised courses and attendance, and the student accesses only their enrolled courses, attendance analytics and permitted communication features.

The teacher cannot:

* Create an unapproved subject.
* Change a subject code.
* Add an unauthorised session.
* Create a course without a valid authorisation code.
* Access another teacher’s attendance data.
* Permanently alter attendance without review.

The student cannot:

* Change their roll number.
* Change academic session independently.
* Enrol in unauthorised courses.
* View another student’s attendance.
* Alter attendance data.
* Post content outside enrolled courses.

The admin remains responsible for:

* Academic master data
* User verification
* Subject allocation
* Course authorisation
* Attendance governance
* Holiday configuration
* Security monitoring
* Data reporting
* Institutional expansion

This structure makes the Admin Panel complete for the first deployment at Patna Women’s College while keeping VaultID ready for future college-wide implementation.

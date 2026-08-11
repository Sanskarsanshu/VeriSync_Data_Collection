# VaultID — Complete Student Panel Walkthrough Report

## Privacy-Preserving Multi-Factor Smart Attendance and Academic Course Management System

### Student Portal Deployment Scope

* **Institution:** Patna Women’s College
* **Department:** Computer Applications
* **Programme:** MCA
* **Target group:** MCA second-year students
* **Initial student count:** 36 students
* **Maximum supported strength:** 50 students per section
* **Future scope:** All programmes, departments, sessions, semesters and students of the college
* **Primary purpose:** Secure attendance, enrolled-course access, academic communication and attendance analytics

---

# 1. Purpose of the Student Panel

The Student Panel provides every verified MCA student with a secure personal academic workspace.

The Student Panel allows a student to:

* Register through an approved college record
* Verify their email address
* Complete face enrolment
* Log in securely
* View enrolled courses
* Access course classrooms
* Scan dynamic attendance QR codes
* Complete face verification
* View attendance status
* View daily, weekly and monthly analytics
* View subject-wise attendance
* Receive attendance-shortage warnings
* Read teacher announcements
* Download study materials
* View assignments
* Submit assignment work
* Ask questions in course discussions
* Send private academic messages
* Submit attendance correction requests
* View their correction-request status
* View class schedules and holidays
* Manage profile and security settings

Students must not be able to modify official academic data or view another student’s personal attendance.

---

# 2. Student Portal Separation

The Student Portal must remain completely separate from the Admin and Teacher portals.

It should have:

* A separate student registration page
* A separate student login page
* A separate frontend design
* Separate student routes
* Student-specific backend APIs
* Role-based access control
* Protected student sessions
* Course-level access checks
* Personal-data access restrictions

### Suggested route

* `/student`

Future production structure:

* `student.vaultid.com`

A student must not gain Teacher or Admin access merely by changing the website URL.

---

# 3. Student Panel Navigation Structure

The Student Portal sidebar should contain:

1. Home
2. My Profile
3. Enrolled Courses
4. Class Schedule
5. Attendance
6. Attendance Analytics
7. Attendance History
8. Correction Requests
9. Announcements
10. Study Materials
11. Assignments
12. Messages and Discussions
13. Notifications
14. Academic Calendar
15. Holidays
16. Security and Login Activity
17. Settings
18. Help and Support

The Enrolled Courses section should display course shortcuts similar to Google Classroom.

---

# 4. Student Account Eligibility

Students should not be allowed to create an account using arbitrary details.

Before registration, the admin must add or import the authorised student list containing:

* Full name
* Roll number
* Registration number
* Approved email address
* Department
* Programme
* Academic session
* Year
* Semester
* Section

The student’s registration details must match the approved record.

---

# 5. Student Registration Page

## 5.1 Registration form

The Student Registration Page should contain:

* Full name
* Roll number
* Registration number
* Email address
* Phone number
* Department
* Programme or course
* Academic session
* Year
* Semester
* Section
* Password
* Confirm password
* Face enrolment
* Privacy and biometric consent
* Terms and conditions agreement

---

## 5.2 Field behaviour

### Full name

The student enters their official college-record name.

After verification, name changes should require admin approval.

### Roll number

The roll number must:

* Match the admin-imported student record
* Be unique
* Belong to the selected session and programme
* Not already be connected to another account

### Email address

The email must:

* Match the approved record or approved domain
* Be verified through OTP or secure link
* Be unique
* Not be connected to another student account

### Phone number

The phone number should be:

* Verified through OTP when required
* Used for account recovery and important alerts
* Hidden from other students

### Department, programme, session, semester and section

These fields should not be unrestricted text fields.

They should be:

* Auto-filled after matching the student record, or
* Selected from admin-created dropdown values

For the first implementation:

* College: Patna Women’s College
* Department: Computer Applications
* Programme: MCA
* Year: Second Year
* Semester: Based on active academic configuration
* Section: A or the section assigned by the admin
* Capacity: Maximum 50 students

---

## 5.3 Student registration workflow

1. Admin uploads or adds the official student record.
2. Student opens the registration page.
3. Student enters roll number and approved email.
4. System checks the official student database.
5. Matching academic details are displayed.
6. Student verifies the email using OTP or verification link.
7. Student verifies the phone number when enabled.
8. Student creates a password.
9. Student completes face enrolment.
10. Student accepts biometric-data consent.
11. Registration is submitted.
12. Admin reviews the student record and face enrolment.
13. Admin approves or rejects the account.
14. Approved courses are assigned.
15. Student receives account-activation confirmation.
16. Student logs in to the Student Portal.

---

# 6. Face Enrolment During Registration

## 6.1 Purpose

Face enrolment connects the student’s verified identity with future attendance sessions.

## 6.2 Face enrolment process

1. Student grants camera permission.
2. System displays face-position guidance.
3. Student looks directly at the camera.
4. System captures images from required angles.
5. System checks lighting and image quality.
6. System checks whether only one face is visible.
7. Duplicate-face checking is performed where legally and institutionally allowed.
8. Facial features are converted into an encrypted embedding.
9. Student confirms the enrolment.
10. Record is submitted for verification.

## 6.3 Quality checks

The system should reject enrolment when:

* Face is not clearly visible
* Image is too dark
* Multiple faces are detected
* Face is covered
* Camera quality is insufficient
* The same face appears connected to another account
* A printed photograph or screen presentation is suspected

## 6.4 Privacy protection

The student should be informed:

* Why face data is collected
* How it is used
* How long it is retained
* Who can access it
* How re-enrolment works
* How a deletion request is handled after course completion

The system should preferably store encrypted face embeddings rather than exposing raw facial photographs.

---

# 7. Student Login Page

## 7.1 Login fields

* Verified email or roll number
* Password
* Remember me
* Forgot password
* Login button
* Email verification help
* Contact administrator

## 7.2 Login checks

The backend verifies:

* Account exists
* Email is verified
* Account is approved
* Student record is active
* Academic session is valid
* Password is correct
* Account is not suspended
* Device is not blocked

## 7.3 Optional additional security

* Email OTP
* Phone OTP
* Authenticator application
* Trusted-device management
* Unusual-login detection

---

# 8. Account Statuses

A student account can have these statuses:

* Pre-registered by Admin
* Email Verification Pending
* Face Enrolment Pending
* Registration Incomplete
* Pending Admin Approval
* Active
* Temporarily Suspended
* Withdrawn
* Transferred
* Graduated
* Deactivated
* Archived

The system should show a clear explanation when the student cannot log in.

---

# 9. Student Dashboard

## 9.1 Purpose

The Student Dashboard provides a complete overview of the student’s courses, schedule, attendance and academic activities.

## 9.2 Dashboard header

The header should contain:

* VaultID logo
* Student Portal label
* College name
* Current session
* Current semester
* Global search
* Notifications
* Student profile picture
* Student name
* Logout option

## 9.3 Student identity card

The dashboard should display:

* Profile photograph
* Full name
* Roll number
* Registration number
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Face verification status

## 9.4 Summary cards

The dashboard should show:

* Total enrolled courses
* Classes scheduled today
* Classes attended today
* Current overall attendance
* Subjects below attendance requirement
* Pending assignments
* New announcements
* Unread messages
* Pending correction requests
* Upcoming holidays

## 9.5 Today’s schedule

Example:

| Time        | Subject                | Teacher              | Room     | Status    |
| ----------- | ---------------------- | -------------------- | -------- | --------- |
| 10:00–11:00 | 5G Networks            | Dr. Jagadeesha R. B. | Room 204 | Upcoming  |
| 12:00–01:00 | Wireless Communication | Dr. Jagadeesha R. B. | Lab 2    | Completed |

Student actions:

* Open Course
* View Class Details
* Mark Attendance when session is active
* View Material
* View Announcement

## 9.6 Quick actions

The Student Dashboard can provide:

* Scan Attendance QR
* View Attendance
* Open Enrolled Courses
* View Today’s Classes
* Submit Correction Request
* View Assignments
* Ask Teacher
* View Announcements

## 9.7 Dashboard analytics

The student should see:

* Overall attendance percentage
* Weekly attendance chart
* Monthly attendance chart
* Subject-wise attendance chart
* Present-versus-absent distribution
* Attendance trend
* Required classes to reach minimum percentage

---

# 10. My Profile Page

## 10.1 Profile information

The Student Profile Page should contain:

* Profile photograph
* Full name
* Roll number
* Registration number
* Verified email
* Verified phone number
* College
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Face-verification status
* Account status

## 10.2 Editable information

The student may edit:

* Profile photograph
* Phone number
* Address, if collected
* Emergency contact, if required
* Notification preferences
* Password
* Recovery details

## 10.3 Restricted information

The student cannot directly change:

* Full name
* Roll number
* Registration number
* Verified email
* Department
* Programme
* Academic session
* Year
* Semester
* Section
* Face-verification approval status

A change request must be submitted to the admin.

## 10.4 Face re-enrolment

The student can request face re-enrolment when:

* Appearance has significantly changed
* Enrolment was incorrect
* Camera quality was poor
* Repeated verification failures occur

The admin must approve the request before old biometric data is replaced.

---

# 11. Enrolled Courses Page

## 11.1 Google Classroom-style appearance

The Enrolled Courses Page should resemble the course-card layout shown in the Google Classroom references while using VaultID branding.

Each course card should display:

* Course banner
* Subject name
* Subject code
* Teacher name
* Teacher profile picture
* Session
* Semester
* Section
* Next class
* Attendance percentage
* New announcement indicator
* Pending assignment indicator

## 11.2 Course card actions

Each course card can provide:

* Open Course
* View Stream
* View Materials
* View Assignments
* View Attendance
* Message Teacher
* Open Course Folder

## 11.3 Course card example

**5G Networks: Theory and Practice**

* Subject code: EC202
* Teacher: Dr. Jagadeesha R. B.
* Programme: MCA
* Semester: IV
* Section: A
* Attendance: 86%
* Next class: Monday, 10:00 AM

## 11.4 Course filters

Students can filter by:

* Current courses
* Previous semester
* Core subjects
* Elective subjects
* Practical courses
* Completed courses
* Archived courses

---

# 12. Student Course Enrolment

## 12.1 Recommended enrolment method

For compulsory subjects, students should be automatically enrolled using:

* Department
* Programme
* Session
* Year
* Semester
* Section
* Approved curriculum

Students should not need to manually enter a teacher’s secure course-authorisation code.

That code belongs to the teacher-side course-creation process.

## 12.2 Elective-course enrolment

For electives:

1. Admin opens elective registration.
2. Eligible subjects appear in the student portal.
3. Student selects the preferred subject.
4. Capacity and eligibility are checked.
5. Request is submitted.
6. Admin or academic coordinator approves it.
7. Course appears in Enrolled Courses.

## 12.3 Course-join request

Where required, a course may have a separate student join code, different from the teacher authorisation code.

The join code should be:

* Course-specific
* Section-specific
* Time-limited
* Controlled by the teacher or admin
* Valid only for eligible students

Even with a valid join code, the system must check academic eligibility.

## 12.4 Enrolment restrictions

Students must not be able to:

* Join another semester without approval
* Join another section without approval
* Join an inactive course
* Join a course outside their programme
* Exceed elective limits
* Join the same course twice
* Use another student’s invitation

---

# 13. Individual Course Classroom

Each enrolled course should have its own classroom page.

Recommended tabs:

1. Stream
2. Classwork
3. Attendance
4. Materials
5. Assignments
6. People
7. Discussions
8. Course Information

The student should only see course data for courses in which they are enrolled.

---

# 14. Course Stream

## 14.1 Purpose

The Course Stream acts as the main communication space.

It displays:

* Teacher announcements
* Class reminders
* Uploaded documents
* Assignment notifications
* Attendance reminders
* Class cancellations
* Timetable updates
* Approved student questions
* Teacher replies

## 14.2 Stream post appearance

Each post should show:

* Teacher or student profile picture
* Name
* Role
* Date and time
* Message
* Attachments
* Replies
* Pin status
* Edited indicator

## 14.3 Student post submission

The student can:

* Ask a course-related question
* Attach a permitted document
* Select a topic
* Submit the message for approval

## 14.4 Student-post moderation workflow

1. Student writes a message.
2. Student clicks **Submit to Course**.
3. Message enters Pending Teacher Approval.
4. Teacher reviews the message.
5. Teacher approves, rejects or sends a private reply.
6. Approved message becomes visible to all enrolled students.
7. Students and the teacher can reply.
8. Teacher may close the discussion.

## 14.5 Message statuses

* Draft
* Pending Approval
* Approved
* Published
* Rejected
* Closed
* Removed

## 14.6 Student restrictions

Students cannot:

* Publish directly without approval when moderation is enabled
* Delete another student’s message
* Post in an unenrolled course
* Send executable or dangerous files
* Post private student information publicly
* Bypass discussion closure

---

# 15. Classwork Page

## 15.1 Purpose

The Classwork Page organises all learning activities by topic.

Possible topics:

* Unit 1
* Unit 2
* Unit 3
* Lecture Notes
* Practical Work
* Assignments
* Question Bank
* Previous Year Questions
* Examination Preparation
* Reference Materials

## 15.2 Student actions

The student can:

* Open study material
* Download permitted files
* View assignments
* View submission deadlines
* Open reference links
* Mark content as completed
* Ask a related question
* Search by topic

---

# 16. Class Schedule Page

## 16.1 Schedule views

The student should have:

* Daily view
* Weekly view
* Monthly view
* Course-wise view

## 16.2 Schedule details

Each class should display:

* Course name
* Subject code
* Teacher name
* Date
* Start time
* End time
* Classroom
* Class type
* Attendance status
* Class status

## 16.3 Class statuses

* Upcoming
* Attendance Open
* Ongoing
* Completed
* Cancelled
* Rescheduled
* Holiday
* Extra Class

## 16.4 Student actions

The student can:

* Open course
* View class details
* Start attendance verification when allowed
* Add the class to a personal reminder
* View teacher instructions
* Report a schedule issue

---

# 17. Attendance Page

## 17.1 Purpose

The Attendance Page is the central area for marking and viewing student attendance.

It should contain:

* Current active attendance session
* QR scanning option
* Face verification option
* Today’s attendance
* Recent attendance records
* Overall percentage
* Subject-wise summary
* Correction-request shortcut

## 17.2 Active attendance session card

When a teacher starts attendance, the student sees:

* Course name
* Teacher name
* Classroom
* Attendance closing time
* Countdown
* Scan QR button
* Camera permission status
* Face verification status
* Device-verification status

---

# 18. Student Attendance Verification Workflow

The recommended multi-factor attendance process is:

1. Teacher starts the attendance session.
2. Dynamic QR code appears in the classroom.
3. Student opens VaultID.
4. Student selects the active class.
5. Student scans the QR code.
6. Backend validates QR authenticity.
7. Student camera opens.
8. Live face verification is performed.
9. Liveness or anti-spoofing checks are performed.
10. Device/browser verification is performed.
11. Class, course, student and timing details are checked.
12. Attendance is recorded.
13. Student receives success or review status.
14. Teacher sees the student in the live attendance list.

---

# 19. Dynamic QR Verification

## 19.1 QR-code requirements

The QR code should be:

* Generated for one class
* Connected to one course
* Connected to one teacher
* Valid for a limited time
* Frequently refreshed
* Invalid after attendance closes
* Protected from replay
* Unusable in another class

## 19.2 QR scan results

The student may see:

* QR Verified
* QR Expired
* Invalid QR
* Wrong Course
* Attendance Session Closed
* Already Marked
* Verification Required
* Suspicious Attempt Detected

## 19.3 Repeated scanning

When attendance is already successfully recorded, scanning again should display:

> Your attendance for this class has already been recorded.

It should not create duplicate entries.

---

# 20. Face Verification During Attendance

## 20.1 Verification conditions

The student should:

* Face the camera directly
* Remain in adequate lighting
* Keep the face uncovered
* Follow liveness instructions
* Ensure only one face is visible

## 20.2 Possible verification results

* Face Verified
* Low Confidence
* Face Not Matched
* Multiple Faces Detected
* Poor Lighting
* Liveness Check Failed
* Camera Permission Denied
* Manual Review Required

## 20.3 Failure handling

When face verification fails:

1. Student receives a clear reason.
2. Student can retry within the active attendance window.
3. Number of retries is limited.
4. Repeated failure creates a review record.
5. Teacher sees a pending or failed status.
6. Student may submit a technical issue request.
7. Manual correction requires teacher recommendation and admin approval.

---

# 21. Device and Browser Verification

## 21.1 Purpose

Device and browser verification reduces proxy attendance and QR sharing.

The system may evaluate:

* Login session
* Device identifier
* Browser details
* IP information
* Attendance timestamp
* QR validation
* Face result
* Repeated account switching
* Suspicious device reuse

## 21.2 Student privacy

Device information should be limited to security purposes.

The system should not collect unnecessary personal data.

## 21.3 Suspicious conditions

Examples:

* Multiple student accounts using one device simultaneously
* Attendance submitted from an unusual session
* QR used after expiry
* Face verified from a different active account
* Extremely rapid switching between accounts
* Repeated failed face attempts

Suspicious cases should be marked for review instead of automatically accusing the student.

---

# 22. Attendance Confirmation

After successful attendance, the student should see:

* Attendance marked successfully
* Course name
* Date
* Class time
* Teacher
* Verification time
* Present status
* Attendance reference number

The student may receive:

* In-application confirmation
* Optional email confirmation
* Updated attendance percentage

---

# 23. Attendance Statuses

VaultID should use the following statuses:

* Present: `1`
* Absent: `0`
* Holiday: `H`
* Class Cancelled: `C`
* Not Applicable: `NA`
* Excused Absence: `E`
* Pending Review: `P`
* Manually Corrected: `M`
* Late, when the college policy supports it: `L`

## Numerical behaviour

* Present contributes `1`
* Absent contributes `0`
* Holiday is excluded
* Cancelled class is excluded
* Not Applicable is excluded
* Excused absence follows college policy
* Pending is not final until reviewed

---

# 24. Attendance History Page

## 24.1 Attendance table

The student can view:

| Date   | Course      | Teacher        | Status  | Verification | Time  | Correction |
| ------ | ----------- | -------------- | ------- | ------------ | ----- | ---------- |
| 05 Aug | 5G Networks | Dr. Jagadeesha | Present | Face + QR    | 10:03 | —          |
| 06 Aug | 5G Networks | Dr. Jagadeesha | Absent  | Not verified | —     | Request    |

## 24.2 Filters

Students can filter by:

* Date
* Week
* Month
* Course
* Subject
* Status
* Teacher
* Correction status

## 24.3 Record details

Opening a record should show:

* Course
* Subject code
* Date
* Scheduled time
* Attendance status
* Verification method
* Marking time
* Correction history
* Teacher remarks
* Admin decision

Students should not see sensitive technical security data.

---

# 25. Attendance Analytics Page

## 25.1 Purpose

Students should view their attendance through clear charts rather than raw institutional sheets alone.

The page should include:

* Daily analytics
* Weekly analytics
* Monthly analytics
* Subject-wise analytics
* Semester analytics
* Attendance trend
* Shortage warnings

---

## 25.2 Daily attendance analytics

The daily view should show:

* Total classes scheduled
* Classes attended
* Classes missed
* Cancelled classes
* Pending attendance
* Daily attendance percentage

Example:

* Scheduled classes: 5
* Conducted classes: 4
* Present: 3
* Absent: 1
* Cancelled: 1
* Daily attendance: 75%

---

## 25.3 Weekly attendance analytics

The weekly chart should display:

* Monday to Saturday
* Classes conducted each day
* Classes attended
* Attendance percentage
* Missed classes
* Weekly average

Recommended chart:

* Bar chart for present and absent classes
* Line chart for attendance percentage

---

## 25.4 Monthly attendance analytics

The monthly view should show:

* Month selector
* Total conducted classes
* Total attended classes
* Total absences
* Holidays
* Cancelled classes
* Overall monthly percentage
* Attendance calendar heatmap

## 25.5 Subject-wise analytics

For each subject, display:

* Subject name
* Subject code
* Teacher
* Conducted classes
* Present classes
* Absent classes
* Percentage
* Attendance status
* Classes required to reach threshold

Example:

| Subject         | Conducted | Present | Percentage | Status   |
| --------------- | --------: | ------: | ---------: | -------- |
| 5G Networks     |        20 |      17 |        85% | Good     |
| Cloud Computing |        18 |      12 |     66.67% | Warning  |
| Industrial IoT  |        16 |       9 |     56.25% | Critical |

---

# 26. Attendance Percentage Calculation

The correct formula is:

[
\text{Attendance Percentage}
============================

\frac{\text{Classes Attended}}
{\text{Classes Conducted}}
\times 100
]

## Example 1

* Classes conducted: 30
* Student present: 30

[
\frac{30}{30}\times100=100%
]

## Example 2: Holidays

* Calendar days: 30
* Holidays: 4
* Classes conducted: 26
* Student present: 26

[
\frac{26}{26}\times100=100%
]

Holidays must not be counted as absence.

## Example 3: Cancelled class

* Scheduled classes: 20
* Cancelled classes: 2
* Conducted classes: 18
* Present classes: 15

[
\frac{15}{18}\times100=83.33%
]

---

# 27. Mid-Month Semester Handling

A semester may begin in the middle of a month.

Example:

* Semester teaching starts on 15 July
* Dates 1–14 July are outside the active teaching period

The system should mark those dates:

`NA`

They must not be marked absent.

## Monthly display

| Date Range     | Status                                               |
| -------------- | ---------------------------------------------------- |
| 1–14 July      | Not Applicable                                       |
| 15 July onward | Attendance calculated according to conducted classes |

The student’s percentage must begin from the actual teaching-start date.

---

# 28. Holiday Handling

## 28.1 Official holidays

Official holidays are configured by the admin.

They should automatically appear in:

* Student calendar
* Class schedule
* Attendance history
* Monthly attendance chart
* Notifications

## 28.2 Holiday status

Holiday should be represented as:

`H`

Holiday must not be represented as:

`0`

Holiday must not reduce attendance percentage.

## 28.3 Special working day

When a Sunday or holiday becomes a working day:

* It appears as Special Working Day.
* Scheduled classes become visible.
* Attendance can be conducted normally.

## 28.4 Class cancellation

A cancelled class should be marked:

`C`

It should be excluded from the denominator.

---

# 29. Attendance Shortage Warning

## 29.1 Threshold categories

The admin determines the official attendance threshold.

Suggested display:

* **Good:** 75% and above
* **Warning:** 65%–74.99%
* **Critical:** Below 65%

## 29.2 Warning card

The student should see:

* Current percentage
* Required percentage
* Number of classes attended
* Number of classes conducted
* Classes needed to reach the requirement
* Risk of falling below the threshold

## 29.3 Future attendance calculation

The system can estimate how many consecutive classes the student must attend.

For example:

* Present: 12
* Conducted: 18
* Current attendance: 66.67%
* Target: 75%

The system can show:

> Attend the next 6 consecutive classes to reach 75%.

The calculation must update after every class.

---

# 30. Attendance Correction Requests

## 30.1 Purpose

Students may report incorrect attendance without directly modifying records.

## 30.2 Correction button

An eligible attendance record should contain:

**Request Correction**

## 30.3 Correction form

The form should include:

* Course
* Subject code
* Date
* Scheduled class time
* Current attendance status
* Requested attendance status
* Reason
* Supporting document
* Additional comments

## 30.4 Common correction reasons

* Face verification failed
* Camera problem
* QR code did not scan
* Network failure
* Attendance marked incorrectly
* Student was present but record shows absent
* Approved college activity
* Medical reason
* Teacher requested manual review
* Duplicate record
* Wrong class record

## 30.5 Correction workflow

1. Student opens the attendance record.
2. Student clicks **Request Correction**.
3. Student enters the reason.
4. Student uploads evidence where required.
5. Request is submitted.
6. Assigned teacher reviews it.
7. Teacher recommends approval or rejection.
8. Admin makes the final decision.
9. Attendance record is updated when approved.
10. Student receives a notification.
11. Complete history remains visible.

## 30.6 Correction statuses

* Draft
* Submitted
* Under Teacher Review
* Recommended for Approval
* Recommended for Rejection
* Under Admin Review
* Approved
* Rejected
* More Information Required
* Closed

## 30.7 Submission deadline

The admin should configure a correction deadline, such as:

* Within 24 hours
* Within 48 hours
* Within 3 working days

Expired requests should require special admin permission.

---

# 31. Announcements Page

## 31.1 Announcement sources

Students may receive announcements from:

* College admin
* Department admin
* Course teacher
* Academic coordinator
* Examination department

## 31.2 Announcement types

* General notice
* Class reminder
* Class cancellation
* Timetable change
* Assignment notice
* Examination notice
* Attendance warning
* Holiday notice
* Material upload
* Emergency notice

## 31.3 Announcement card

Each announcement should display:

* Title
* Sender
* Sender role
* Course
* Date
* Message
* Attachment
* Priority
* Expiry date

## 31.4 Student actions

The student can:

* Open announcement
* Download attachment
* Mark as read
* Save announcement
* Add personal reminder
* Reply when allowed

---

# 32. Study Materials Page

## 32.1 Material categories

* Lecture notes
* Presentations
* PDF files
* Syllabus
* Video links
* Practical files
* Reference materials
* Question banks
* Previous-year questions
* Examination resources

## 32.2 Material details

Each material should show:

* Title
* Course
* Teacher
* Topic
* Upload date
* File type
* File size
* Description
* Download permission

## 32.3 Student actions

The student can:

* Preview material
* Download allowed files
* Save to favourites
* Search by topic
* Filter by course
* Mark as completed
* Ask a question

Students cannot modify or remove teacher materials.

---

# 33. Assignments Page

## 33.1 Assignment card

Each assignment should show:

* Assignment title
* Course
* Teacher
* Instructions
* Published date
* Due date
* Total marks
* Submission status
* Remaining time

## 33.2 Assignment statuses

* Not Started
* In Progress
* Submitted
* Submitted Late
* Returned
* Resubmission Required
* Graded
* Missing

## 33.3 Assignment submission

The student can:

* Upload a file
* Add text response
* Add external link
* Save as draft
* Submit assignment
* Unsubmit before deadline when allowed
* Resubmit when permitted

## 33.4 Submission confirmation

After submission, display:

* Submission date and time
* Submitted file
* Submission status
* Confirmation reference
* Late indicator
* Teacher feedback when available

Assignment management may be introduced after the primary attendance system is complete.

---

# 34. Messages and Discussions Page

## 34.1 Public course questions

Students can ask questions related to:

* Course concepts
* Class schedule
* Study material
* Assignment instructions
* Examination preparation

The post becomes public only after teacher approval.

## 34.2 Private academic message

Students may privately contact the assigned teacher for:

* Personal academic difficulty
* Attendance clarification
* Assignment issue
* Technical issue
* Correction-request discussion

Private messages should be visible only to:

* The student
* The assigned teacher
* Admin when reported or officially required

## 34.3 Messaging features

* Text message
* Approved attachments
* Reply
* Read status
* Report message
* Close conversation
* Search messages

## 34.4 Messaging restrictions

Students should not be allowed to:

* Send messages to unrelated teachers
* Spam the course
* Upload unsafe files
* Share another student’s personal information
* Edit messages after the permitted time
* Delete audit history

---

# 35. People Page

The People tab inside a course should show limited information.

## Teacher information

* Teacher profile picture
* Teacher name
* Designation
* Department
* Office hours
* Course role

## Student information

For privacy, students may see:

* Names of enrolled classmates
* Profile pictures when enabled
* Course membership

They should not see:

* Phone numbers
* Personal email addresses
* Attendance percentages
* Face-verification data
* Login activity
* Correction requests

The admin should be able to disable the student list when required.

---

# 36. Academic Calendar Page

The calendar should contain:

* Scheduled classes
* Holidays
* Examinations
* Assignment deadlines
* College events
* Extra classes
* Cancelled classes
* Attendance deadlines
* Correction deadlines

## Calendar views

* Day
* Week
* Month
* Agenda

## Student actions

* Open event details
* Add reminder
* Filter by course
* Download schedule
* View teacher instructions

---

# 37. Notifications Page

Students should receive notifications for:

* Account approval
* Face verification status
* Course enrolment
* New announcement
* New study material
* Assignment published
* Assignment deadline
* Attendance session started
* Attendance recorded
* Attendance verification failed
* Low-attendance warning
* Correction request update
* Class cancelled
* Class rescheduled
* Holiday declared
* New teacher reply
* Security alert

## Notification actions

* Mark as read
* Mark all as read
* Open related page
* Mute selected notification category
* View notification history

Critical attendance and security notifications should not be fully disabled.

---

# 38. Security and Login Activity Page

## 38.1 Security information

The student can view:

* Last login
* Recent devices
* Active sessions
* Login locations
* Password-update date
* Failed login attempts
* Two-factor authentication status

## 38.2 Student security actions

The student can:

* Change password
* Enable two-factor authentication
* Logout from all devices
* Revoke an unknown session
* Report suspicious login
* Update recovery phone number
* Request account support

## 38.3 Face-data controls

The student can:

* View face-enrolment status
* View last verification date
* Request face re-enrolment
* Read biometric privacy information
* Contact admin for correction or deletion requests

The student must not be able to download facial embeddings.

---

# 39. Student Settings Page

## 39.1 Profile settings

* Profile photograph
* Phone number
* Recovery information

## 39.2 Notification settings

* Email notifications
* Attendance alerts
* Assignment reminders
* Course announcements
* Teacher replies
* Holiday updates

## 39.3 Display settings

* Light mode
* Dark mode
* Text size
* Language preference
* Reduced animation

## 39.4 Privacy settings

* Classmate profile visibility
* Message-request preference
* Activity visibility

Privacy settings should not override institutional requirements.

---

# 40. Help and Support Page

The Student Help Page should contain:

* How to register
* How to complete face enrolment
* How to scan attendance QR
* How to solve camera-permission problems
* What to do when face verification fails
* How attendance percentage is calculated
* How holidays are handled
* How to request attendance correction
* How to access materials
* Frequently asked questions
* Contact teacher
* Contact administrator
* Report technical issue
* Privacy and data policy

---

# 41. Recommended Student Portal Design

## 41.1 Left sidebar

### Home

* Dashboard
* Enrolled Courses
* Class Schedule

### Attendance

* Mark Attendance
* Attendance History
* Analytics
* Correction Requests

### Academic

* Announcements
* Study Materials
* Assignments
* Discussions

### Calendar

* Academic Calendar
* Holidays

### Account

* Profile
* Notifications
* Security
* Settings
* Help

## 41.2 Top navigation

The top navigation should include:

* VaultID logo
* Current session
* Search
* Notification icon
* Student profile picture
* Account menu

## 41.3 Responsive design

The interface must work on:

* Desktop
* Laptop
* Tablet
* Mobile phone

The QR scanner and face-verification interface should be especially optimised for mobile devices.

---

# 42. Course Classroom Design

The individual classroom should look similar to the provided Google Classroom reference, while adapting it for VaultID.

## Classroom header

* Course banner
* Subject name
* Subject code
* Semester
* Section
* Teacher name
* Teacher photograph
* Student’s current attendance percentage

## Main tabs

* Stream
* Classwork
* Attendance
* Materials
* Assignments
* People

## Upcoming card

The left side may show:

* Next class
* Assignment due
* Attendance shortage
* Upcoming test
* View all

## Stream area

The main content can show:

* Teacher announcements
* Material uploads
* Assignment posts
* Approved student messages
* Attendance notices

---

# 43. Student Attendance Sheet View

Students should not necessarily receive the complete class sheet containing all student names.

They should receive a personal attendance sheet containing only their data.

Example:

| Date   | 01 | 02 | 03 | 04 | 05 | 06 | Total Present | Conducted | Percentage |
| ------ | -: | -: | -- | -: | -: | -: | ------------: | --------: | ---------: |
| Status |  1 |  0 | H  |  1 |  C |  1 |             3 |         4 |        75% |

## Subject summary

| Subject         | Present | Conducted | Percentage |
| --------------- | ------: | --------: | ---------: |
| 5G Networks     |      17 |        20 |        85% |
| Cloud Computing |      12 |        18 |     66.67% |

Students should be able to download their personal report in:

* PDF
* Printable format

Excel access may be enabled only when approved by the college.

---

# 44. Student Privacy Rules

Students must only access their own sensitive information.

They must not be able to view:

* Another student’s attendance
* Another student’s correction request
* Another student’s phone number
* Another student’s email
* Another student’s face data
* Another student’s login activity
* Teacher security information
* Admin records
* Complete institutional attendance sheets

Public course discussions may show student names according to college policy.

---

# 45. Student Permissions

A student can:

* Register through an approved record
* Verify email and phone
* Complete face enrolment
* View enrolled courses
* View course announcements
* Download authorised materials
* View assignments
* Submit assignments
* Scan dynamic QR codes
* Complete face verification
* View personal attendance
* View daily, weekly and monthly analytics
* View subject-wise attendance
* Submit correction requests
* Ask course questions
* Send private academic messages
* Manage personal security settings

---

# 46. Student Restrictions

A student cannot:

* Access the Admin Panel
* Access the Teacher Panel
* Change official roll number
* Change department independently
* Change session or semester independently
* Create an official course
* Use a teacher’s authorisation code
* Add themselves to an unauthorised course
* Modify attendance records
* Mark attendance after the window closes
* Mark attendance for another student
* View another student’s analytics
* View facial embeddings
* Alter holidays
* Change attendance thresholds
* Approve their own correction request
* Publish public messages without required approval
* Modify teacher materials

---

# 47. Student Backend Modules

The Student Portal should use protected student-specific backend modules.

Recommended modules:

* Student Authentication Service
* Student Registration Service
* Email and Phone Verification Service
* Student Profile Service
* Face Enrolment Service
* Course Enrolment Service
* Enrolled Course Service
* Course Stream Service
* Course Material Service
* Assignment Submission Service
* Schedule Service
* Dynamic QR Validation Service
* Face Verification Service
* Device Integrity Service
* Attendance Record Service
* Attendance Analytics Service
* Attendance Correction Service
* Messaging Service
* Notification Service
* Security and Session Service
* Student Report Service

Every backend request should validate:

* Authentication token
* Student role
* Active account status
* Student ownership of requested data
* Course enrolment
* Academic-session validity
* Requested-action permission

---

# 48. Complete Student Onboarding Workflow

1. Admin imports the official student list.
2. Student opens the VaultID Student Registration Page.
3. Student enters roll number and approved email.
4. System matches the official record.
5. Academic information is displayed.
6. Student verifies the email.
7. Student verifies the phone number when required.
8. Student creates a password.
9. Student completes face enrolment.
10. Student accepts biometric consent.
11. Registration is submitted.
12. Admin reviews the account.
13. Admin approves the student.
14. Compulsory courses are automatically assigned.
15. Elective registration becomes available when applicable.
16. Student receives activation confirmation.
17. Student logs in.
18. Enrolled course cards appear on the dashboard.

---

# 49. Complete Student Attendance Workflow

1. Student logs in to VaultID.
2. Student opens the dashboard.
3. Active attendance notification appears.
4. Student opens the scheduled class.
5. Student clicks **Mark Attendance**.
6. QR scanner opens.
7. Student scans the teacher’s dynamic QR.
8. QR is validated.
9. Face-verification camera opens.
10. Student completes liveness instructions.
11. Face is compared with the enrolled identity.
12. Device and session checks are performed.
13. Attendance is marked Present.
14. Student receives confirmation.
15. Attendance analytics update.
16. Teacher sees the student in the live list.
17. Failed verification is placed under review.
18. Student may submit a correction request when necessary.

---

# 50. Student Error and Empty States

The system should provide meaningful messages.

## Examples

### No courses

> No courses are currently assigned to your account. Contact your department administrator if this appears incorrect.

### No active attendance

> There is no active attendance session for your enrolled courses.

### Face verification failed

> Your face could not be verified clearly. Improve the lighting and try again before the attendance window closes.

### QR expired

> This QR code has expired. Scan the latest QR displayed by the teacher.

### Account pending

> Your registration is under administrator review. You will be notified after approval.

### No attendance records

> Attendance records will appear after your first conducted class.

---

# 51. Additional Essential Student Features

## 51.1 Search

Students should be able to search:

* Courses
* Announcements
* Materials
* Assignments
* Messages

## 51.2 Personal reminders

Students can add reminders for:

* Class time
* Assignment due date
* Attendance correction deadline
* Examination
* Important announcement

## 51.3 Download centre

A Student Download Centre can contain:

* Personal attendance report
* Course documents
* Assignment files
* Timetable
* Academic calendar
* Syllabus

## 51.4 Accessibility

The portal should support:

* Keyboard navigation
* Clear text labels
* High contrast
* Camera instructions
* Screen-reader compatibility
* Loading indicators
* Accessible error messages
* Mobile responsiveness

## 51.5 Network-failure handling

When a student experiences a network issue:

* The app should show connection status.
* An incomplete request must not create duplicate attendance.
* The student should be able to retry.
* The server timestamp should determine final attendance time.
* Technical-failure logs should support later review.

---

# 52. Final Student-Side Page Grouping

## Dashboard

* Home
* My Profile
* Notifications

## Courses

* Enrolled Courses
* Course Stream
* Classwork
* Study Materials
* Assignments
* Discussions

## Attendance

* Mark Attendance
* Attendance History
* Attendance Analytics
* Correction Requests
* Personal Attendance Report

## Schedule

* Class Schedule
* Academic Calendar
* Holidays

## Account

* Security and Login Activity
* Settings
* Help and Support

---

# 53. Final Student-Side Control Principle

The Student Panel should follow this rule:

> A student can securely access only their own academic identity, enrolled courses, attendance information, learning resources and permitted course communication.

The admin controls:

* Official student records
* Department and programme data
* Academic session
* Semester and section
* Account approval
* Course enrolment rules
* Holidays
* Attendance policy
* Final attendance corrections
* Biometric administration

The teacher controls:

* Course classroom
* Attendance session
* Announcements
* Study materials
* Assignments
* Student-message approval
* Initial correction review

The student controls:

* Personal login and security
* Face-attendance participation
* Access to enrolled courses
* Personal attendance analytics
* Course-related questions
* Assignment submissions
* Attendance correction requests
* Notification and display preferences

This structure provides Patna Women’s College MCA students with a secure, clear and Google Classroom-inspired academic experience while keeping attendance records private, verified and scalable for future college-wide implementation.

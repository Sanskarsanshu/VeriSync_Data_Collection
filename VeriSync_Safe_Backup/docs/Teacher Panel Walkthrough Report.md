# VaultID — Complete Teacher Panel Walkthrough Report

## Privacy-Preserving Multi-Factor Smart Attendance and Academic Course Management System

### Teacher Portal Deployment Scope

* **Institution:** Patna Women’s College
* **Department:** MCA
* **Primary users:** MCA faculty members
* **Initial student capacity:** 36 students
* **Maximum section capacity:** 50 students
* **Current scope:** MCA second-year students
* **Future scope:** All departments, programmes, semesters and sections of the college

---

# 1. Purpose of the Teacher Panel

The Teacher Panel allows verified faculty members to manage their assigned courses, students, classes, attendance, announcements, study materials and academic communication.

The teacher can operate only those subjects and sections officially assigned by the admin.

The Teacher Panel will allow a teacher to:

* Complete teacher registration and email verification
* Maintain a professional faculty profile
* View assigned subjects
* Create authorised course classrooms
* View enrolled students
* Schedule classes
* Start secure attendance sessions
* Monitor live attendance
* Review attendance records
* Submit attendance corrections
* Download attendance sheets
* View student attendance analytics
* Publish announcements
* Upload notes and documents
* Create assignments
* Communicate with enrolled students
* Approve student posts
* Manage course information
* View notifications
* Report technical or attendance issues

The teacher must not be able to create institutional data independently.

---

# 2. Teacher Portal Separation

The Teacher Portal must remain completely separate from the Admin and Student portals.

It should have:

* Separate teacher login page
* Separate registration page
* Separate dashboard
* Separate frontend routes
* Separate backend teacher APIs
* Teacher-specific role permissions
* Protected course access
* Independent authentication checks

### Suggested route

* `/teacher`

or, in future:

* `teacher.vaultid.com`

A teacher account must never be able to access the Admin Panel by changing the URL.

---

# 3. Teacher Panel Navigation Structure

The Teacher Panel sidebar should contain:

1. Dashboard
2. My Profile
3. Assigned Subjects
4. My Courses
5. Create Course
6. Class Schedule
7. Attendance
8. Live Attendance
9. Attendance Records
10. Attendance Corrections
11. Attendance Sheets
12. Students
13. Announcements
14. Course Stream
15. Study Materials
16. Assignments
17. Messages and Discussions
18. Reports and Analytics
19. Notifications
20. Security and Login Activity
21. Settings
22. Help and Support

The menu can be divided into expandable groups to keep it clean.

---

# 4. Teacher Registration and Login

## 4.1 Teacher account eligibility

A teacher should not be able to register freely using any email address.

Before registration, the admin must create or pre-authorise the teacher using:

* Full name
* Employee ID
* Official email address
* Department
* Designation
* Subjects the teacher can teach

Only an email already approved by the admin should be accepted.

---

## 4.2 Teacher Registration Page

The registration form should contain:

* Full name
* Employee ID
* Official email address
* Phone number
* Department
* Designation
* Qualification
* Specialisation
* Profile photograph
* Password
* Confirm password
* Terms and privacy consent

The department field should come from admin-created data.

The teacher should not be allowed to manually enter an unknown department.

---

## 4.3 Registration workflow

1. Admin creates the authorised teacher record.
2. Teacher receives an invitation email.
3. Teacher opens the registration link.
4. Teacher enters the approved email address.
5. The system checks whether the email exists in the admin-approved teacher list.
6. OTP or verification link is sent.
7. Teacher verifies the email.
8. Teacher completes the profile.
9. Teacher creates a password.
10. Registration is submitted for admin approval.
11. Admin approves the account.
12. Teacher receives account activation confirmation.
13. Teacher can log in.

---

## 4.4 Teacher Login Page

The login page should contain:

* Official email address
* Password
* Remember me
* Forgot password
* Login button
* Email verification status
* Help link

Optional future security:

* Email OTP
* Authenticator application
* Device verification
* Two-factor authentication

---

## 4.5 Account statuses

A teacher account can have the following statuses:

* Invitation Sent
* Email Not Verified
* Registration Incomplete
* Pending Admin Approval
* Active
* Temporarily Suspended
* Deactivated
* Archived

The teacher should see a clear message when the account is not active.

---

# 5. Teacher Dashboard

## 5.1 Purpose

The Teacher Dashboard gives a complete overview of the teacher’s daily academic work.

---

## 5.2 Dashboard header

The header should contain:

* VaultID logo
* Teacher portal label
* College name
* Current academic session
* Current semester
* Search bar
* Quick create button
* Notifications
* Teacher profile picture
* Teacher name
* Logout option

---

## 5.3 Teacher information card

The dashboard should display:

* Teacher photograph
* Full name
* Employee ID
* Designation
* Department
* Official email
* Assigned subjects
* Active courses
* Verification status

---

## 5.4 Dashboard summary cards

The dashboard should show:

* Total assigned subjects
* Total active courses
* Total enrolled students
* Classes scheduled today
* Attendance sessions today
* Pending attendance sessions
* Pending correction requests
* Low-attendance students
* Upcoming classes
* Unread student messages
* Pending student posts
* Recent announcements

---

## 5.5 Today’s schedule

The teacher should see:

| Time        | Course                 | Section  | Room     | Status    |
| ----------- | ---------------------- | -------- | -------- | --------- |
| 10:00–11:00 | 5G Networks            | MCA-II A | Room 204 | Upcoming  |
| 12:00–01:00 | Wireless Communication | MCA-II A | Lab 2    | Completed |

Actions should include:

* View Course
* Start Attendance
* Cancel Class
* Reschedule
* Add Class Note

---

## 5.6 Quick actions

The dashboard should provide:

* Create Course
* Start Attendance
* Add Announcement
* Upload Material
* Create Assignment
* View Students
* Download Attendance
* Review Correction Request
* Report an Issue

---

## 5.7 Dashboard charts

The teacher can see:

* Course-wise attendance percentage
* Weekly class completion
* Monthly attendance trend
* Student attendance distribution
* Low-attendance student count
* Classes conducted versus scheduled
* Attendance method usage

---

# 6. My Profile Page

## 6.1 Profile information

The page should contain:

* Profile photograph
* Full name
* Employee ID
* Official email
* Phone number
* Department
* Designation
* Qualification
* Specialisation
* Subjects authorised to teach
* Date of joining
* Account status

---

## 6.2 Editable information

The teacher can edit:

* Profile picture
* Phone number
* Qualification
* Specialisation
* Short professional biography
* Office hours
* Preferred notification settings

---

## 6.3 Restricted information

The teacher cannot directly change:

* Employee ID
* Verified email
* Department
* Assigned subjects
* Designation
* Account status

Changes to these fields require an admin request.

---

## 6.4 Profile appearance in courses

The following information should appear on course cards:

* Teacher photograph
* Teacher name
* Department
* Course taught
* Designation

---

# 7. Assigned Subjects Page

## 7.1 Purpose

This page shows all subjects the admin has authorised the teacher to teach.

---

## 7.2 Subject table

The table should contain:

* Subject name
* Subject code
* Department
* Programme
* Session
* Year
* Semester
* Subject type
* Assigned section
* Assignment role
* Status
* Course creation status

---

## 7.3 Subject assignment roles

A teacher can be assigned as:

* Primary teacher
* Co-teacher
* Substitute teacher
* Laboratory instructor
* Course coordinator

---

## 7.4 Teacher actions

The teacher can:

* View subject details
* View syllabus
* View assigned section
* Request course authorisation
* Create a course when authorised
* Report an incorrect assignment

The teacher cannot:

* Add a new official subject
* Change a subject code
* Change the semester
* Assign the subject to themselves
* Modify another teacher’s assignment

---

# 8. My Courses Page

## 8.1 Google Classroom-style course cards

The course page should visually resemble Google Classroom while being customised for VaultID.

Each course card should contain:

* Course banner
* Subject name
* Subject code
* Session
* Semester
* Section
* Teacher photograph
* Teacher name
* Number of enrolled students
* Next class
* Course status

---

## 8.2 Course card actions

The course card should provide:

* Open Course
* Start Attendance
* View Students
* Upload Material
* Post Announcement
* Download Attendance
* Course Settings

---

## 8.3 Course statuses

* Draft
* Pending Admin Approval
* Active
* Temporarily Suspended
* Completed
* Archived

---

## 8.4 Course filtering

Teachers should be able to filter by:

* Active courses
* Current semester
* Previous semester
* Session
* Section
* Subject
* Archived courses

---

# 9. Create Course Page

## 9.1 Purpose

The teacher creates a course classroom only after the admin has assigned the subject and issued a secure course authorisation code.

---

## 9.2 Course creation form

The form should contain:

### Academic information

* Academic session
* Department
* Programme
* Year
* Semester
* Section

### Subject information

* Subject name
* Subject code
* Subject type
* Credits

### Teacher information

* Teacher name
* Teacher email
* Department
* Assignment role

### Course settings

* Course display name
* Course description
* Course banner
* Classroom location
* Student posting permission
* Announcement permission
* Course start date
* Course end date

### Security information

* Course authorisation code

---

## 9.3 Filtered dropdown behaviour

The teacher should first select:

1. Academic session
2. Department
3. Programme
4. Year
5. Semester
6. Section

After these filters are selected, the Subject dropdown should display only subjects that:

* Exist in the admin database
* Match the selected semester
* Match the selected programme
* Are assigned to the logged-in teacher
* Have valid course authorisation

When a subject is selected:

* Subject code auto-fills
* Credits auto-fill
* Subject type auto-fills
* Department auto-fills

The teacher must not manually modify these values.

---

## 9.4 Course authorisation code

Example:

`qmb28GHy9K`

The teacher enters this code before clicking **Create Course**.

---

## 9.5 Backend validation

The system must confirm:

* Teacher email is verified.
* Teacher account is active.
* Teacher is assigned to the selected subject.
* Session matches the admin assignment.
* Programme matches.
* Semester matches.
* Section matches.
* Course code is valid.
* Authorisation code is not expired.
* Authorisation code is unused.
* Authorisation code belongs to that teacher.
* The course has not already been created.

If any condition fails, the course should not be created.

---

## 9.6 Successful creation

After validation:

1. Course is created.
2. Authorisation code becomes used.
3. Course appears as Pending Approval or Active, depending on admin settings.
4. Admin receives a notification.
5. Eligible students are enrolled automatically or placed in the registration queue.
6. The teacher receives confirmation.

---

# 10. Individual Course Classroom

Each course should have its own dedicated area.

Recommended tabs:

1. Stream
2. Classwork
3. Attendance
4. Students
5. Materials
6. Assignments
7. Analytics
8. Settings

---

# 11. Course Stream

## 11.1 Purpose

The Stream is the main communication area, similar to Google Classroom.

It should display:

* Teacher announcements
* Uploaded documents
* Assignment notifications
* Class reminders
* Schedule changes
* Student questions
* Teacher replies
* Attendance alerts

---

## 11.2 Teacher post form

The teacher can:

* Write a message
* Add a title
* Attach PDF, image or document
* Add external links
* Select the target section
* Schedule publication
* Pin important posts
* Disable comments
* Set an expiry date

---

## 11.3 Student posts

Students can submit messages or questions.

Recommended workflow:

1. Student writes a message.
2. Message is submitted for teacher approval.
3. Teacher reviews it.
4. Teacher approves, rejects or privately replies.
5. When approved, it becomes visible to all enrolled students.
6. Other students can view the discussion.
7. Teacher can close the discussion.

This prevents spam and inappropriate content.

---

## 11.4 Post statuses

* Draft
* Pending Approval
* Published
* Rejected
* Scheduled
* Archived
* Removed

---

## 11.5 Teacher moderation controls

The teacher can:

* Approve student posts
* Reject posts
* Edit their own announcements
* Delete inappropriate comments
* Pin announcements
* Disable replies
* Lock discussions
* Report serious content to the admin

---

# 12. Classwork Page

## 12.1 Purpose

This page organises academic content into topics.

---

## 12.2 Topic examples

* Unit 1
* Unit 2
* Unit 3
* Notes
* Assignments
* Practical Work
* Reference Material
* Previous Year Questions
* Examination Preparation

---

## 12.3 Teacher actions

The teacher can:

* Create a topic
* Upload material
* Create an assignment
* Add a question
* Add a link
* Schedule content
* Reorder topics
* Archive old material

---

# 13. Class Schedule Page

## 13.1 Purpose

The teacher can view all scheduled lectures.

The teacher should not create an official timetable independently unless allowed by the admin.

---

## 13.2 Schedule views

* Daily view
* Weekly view
* Monthly view
* Course-wise view

---

## 13.3 Schedule details

* Date
* Start time
* End time
* Subject
* Section
* Room
* Class type
* Attendance method
* Status

---

## 13.4 Class statuses

* Upcoming
* Ongoing
* Completed
* Cancelled
* Rescheduled
* Holiday
* Attendance Pending

---

## 13.5 Teacher actions

The teacher can:

* View class details
* Start attendance
* Request rescheduling
* Cancel a class with a reason
* Create an extra class
* Add class notes
* Mark class completed

Cancellation or extra classes may require admin approval.

---

# 14. Attendance Dashboard

## 14.1 Purpose

The Attendance Dashboard provides a complete view of attendance for the teacher’s courses.

---

## 14.2 Attendance summary cards

* Classes scheduled
* Classes conducted
* Attendance sessions completed
* Total enrolled students
* Average attendance
* Students below threshold
* Pending correction requests
* Manual attendance changes
* Attendance anomalies

---

## 14.3 Filters

* Course
* Subject
* Date
* Week
* Month
* Session
* Semester
* Section
* Attendance status

---

# 15. Start Attendance Page

## 15.1 Attendance session creation

The teacher selects:

* Course
* Scheduled class
* Date
* Start time
* Attendance duration
* Attendance method
* Classroom
* Optional instructions

Most information should auto-fill from the timetable.

---

## 15.2 Attendance methods

VaultID should support:

1. Face recognition
2. Dynamic QR verification
3. Browser or device integrity verification

Recommended attendance method:

> Face verification + dynamic QR code + device/browser validation

---

## 15.3 Dynamic QR workflow

1. Teacher opens the scheduled class.
2. Teacher clicks **Start Attendance**.
3. System generates a dynamic QR code.
4. QR code is shown on the classroom screen.
5. Student scans the QR code.
6. Student completes face verification.
7. Device and browser checks are performed.
8. Attendance is recorded.
9. QR code expires automatically.

---

## 15.4 QR security rules

The QR code must be:

* Class-specific
* Course-specific
* Teacher-specific
* Time-limited
* Frequently refreshed
* Invalid after session closure
* Protected from reuse

A screenshot of an old QR code should not work.

---

## 15.5 Attendance window

The teacher can use an admin-approved duration such as:

* 2 minutes
* 5 minutes
* 10 minutes

The teacher should not be able to keep an attendance session active indefinitely.

---

# 16. Live Attendance Page

## 16.1 Live session information

The teacher should see:

* Course name
* Subject code
* Date and time
* Attendance method
* Session countdown
* Total students
* Present students
* Pending students
* Failed attempts
* Suspicious attempts

---

## 16.2 Student list during attendance

| Roll No. | Student Name | Face     | QR    | Device | Status  | Time  |
| -------- | ------------ | -------- | ----- | ------ | ------- | ----- |
| MCA001   | Student A    | Verified | Valid | Valid  | Present | 10:02 |
| MCA002   | Student B    | Failed   | Valid | Valid  | Review  | 10:04 |

---

## 16.3 Status indicators

* Present
* Pending
* Face mismatch
* Invalid QR
* Duplicate attempt
* Device warning
* Late
* Absent
* Manual review

---

## 16.4 Teacher controls

The teacher can:

* Pause attendance
* Extend the session within limits
* Close attendance
* View failed attempts
* Mark an issue for review
* Add an emergency manual entry
* Download the current list

Manual entry should require a reason.

---

# 17. Attendance Completion

When the attendance session closes:

1. Students verified successfully are marked Present.
2. Remaining enrolled students are marked Absent.
3. Suspicious attempts remain Pending Review.
4. Teacher receives a summary.
5. Attendance data is saved.
6. Students receive updated analytics.
7. Admin can view the session.
8. Audit records are created.

---

# 18. Attendance Records Page

## 18.1 Attendance table

The teacher can view:

* Date
* Course
* Student
* Roll number
* Attendance status
* Face verification
* QR verification
* Device verification
* Marked time
* Correction status
* Remarks

---

## 18.2 Attendance statuses

* Present: `1`
* Absent: `0`
* Holiday: `H`
* Cancelled Class: `C`
* Not Applicable: `NA`
* Excused: `E`
* Pending Review: `P`
* Manually Corrected: `M`

---

## 18.3 Attendance filters

The teacher can filter by:

* Student
* Roll number
* Course
* Date
* Week
* Month
* Attendance status
* Verification method
* Correction status

---

## 18.4 Manual editing restriction

Teachers should not directly overwrite completed attendance.

Recommended workflow:

1. Teacher selects the attendance record.
2. Teacher clicks **Request Correction**.
3. Teacher enters the reason.
4. Teacher attaches evidence when required.
5. Request goes to the admin.
6. Admin approves or rejects it.
7. Change is recorded in the audit log.

---

# 19. Attendance Correction Page

## 19.1 Types of correction

* Absent to Present
* Present to Absent
* Pending to Present
* Incorrect student
* Technical failure
* Approved medical absence
* Duplicate record
* Class cancellation
* Wrong attendance session

---

## 19.2 Correction form

* Student
* Course
* Date
* Current status
* Requested status
* Reason
* Supporting document
* Teacher remarks

---

## 19.3 Teacher review of student requests

A student may submit an attendance correction request.

The teacher can:

* View student reason
* View supporting document
* Recommend approval
* Recommend rejection
* Request more information
* Add remarks
* Forward to admin

Final approval should remain with the admin for strong data integrity.

---

# 20. Attendance Sheets Page

## 20.1 Sheet format

The teacher should see a monthly sheet containing:

| Roll No. | Student Name | 01 | 02 | 03 | 04 |  … | 30 | Present | Conducted | Percentage |
| -------- | ------------ | -: | -: | -: | -: | -: | -: | ------: | --------: | ---------: |
| MCA001   | Student A    |  1 |  1 |  H |  0 |  … |  1 |      27 |        29 |     93.10% |

---

## 20.2 Sheet rules

* Present = `1`
* Absent = `0`
* Holiday = `H`
* Cancelled class = `C`
* Not applicable = `NA`
* Excused = `E`

Only conducted classes should be included in the percentage denominator.

---

## 20.3 Attendance calculation

[
\text{Attendance Percentage}
============================

\frac{\text{Total Classes Present}}
{\text{Total Classes Conducted}}
\times 100
]

Example:

* Classes conducted: 30
* Student present: 30
* Percentage: 100%

When four dates are holidays:

* Available working classes: 26
* Student present: 26
* Percentage: 100%

---

## 20.4 Mid-month semester handling

When the semester begins on the 15th:

* Dates 1–14 display `NA`.
* These dates do not count as absence.
* Attendance calculation begins from the actual teaching start date.

---

## 20.5 Different month lengths

The system should automatically support:

* 28 days
* 29 days
* 30 days
* 31 days

---

## 20.6 Teacher download options

The teacher can download attendance only for assigned courses.

Formats:

* Excel
* CSV
* PDF
* Printable sheet

Download options:

* Daily attendance
* Weekly attendance
* Monthly attendance
* Student-wise attendance
* Subject-wise attendance
* Low-attendance report
* Semester attendance

---

# 21. Holiday and Cancelled Class Handling

## 21.1 Official holidays

Official holidays are configured by the admin and automatically appear in the teacher calendar.

Teachers cannot mark attendance on an official holiday unless it is declared a special working day.

---

## 21.2 Holiday representation

A holiday should be marked:

`H`

It should not be marked:

`0`

It should not reduce the student’s attendance.

---

## 21.3 Cancelled class

When the teacher cancels a class:

1. Teacher selects the class.
2. Teacher provides a reason.
3. Request is submitted.
4. Admin approval may be required.
5. Students receive a notification.
6. The date is marked `C`.
7. The cancelled class is excluded from attendance percentage.

---

## 21.4 Extra or replacement class

The teacher can request:

* Extra class
* Makeup class
* Replacement lecture
* Online class

The system should verify:

* No timetable conflict
* Student section availability
* Teacher availability
* Classroom availability
* Admin approval, where required

---

# 22. Students Page

## 22.1 Purpose

Teachers can view students enrolled in their courses.

They cannot view students from unrelated courses.

---

## 22.2 Student list

* Profile photograph
* Full name
* Roll number
* Email
* Phone number, when permitted
* Programme
* Session
* Semester
* Section
* Course registration status
* Face verification status
* Attendance percentage
* Account status

---

## 22.3 Student profile view

The teacher can view:

* Basic academic details
* Enrolled course
* Attendance summary
* Weekly attendance
* Monthly attendance
* Subject attendance
* Absence history
* Correction requests
* Submitted assignments
* Course messages

Sensitive personal or security data should remain hidden.

---

## 22.4 Teacher actions

The teacher can:

* View student attendance
* Send course-related notification
* Flag low attendance
* Recommend attendance correction
* View submitted work
* Report a student account issue

The teacher cannot:

* Change the student’s roll number
* Change the student’s department
* Reset face data directly
* Delete a student
* Access another course’s data

---

# 23. Announcements Page

## 23.1 Announcement form

The teacher can enter:

* Title
* Message
* Course
* Section
* Attachment
* Priority
* Publish date
* Expiry date
* Allow comments
* Schedule publication

---

## 23.2 Announcement types

* General announcement
* Class reminder
* Schedule change
* Examination notice
* Assignment reminder
* Material uploaded
* Attendance warning
* Emergency notice

---

## 23.3 Target audience

The teacher can send announcements to:

* One course
* One section
* Multiple assigned courses
* Selected students
* Students below attendance threshold

---

# 24. Study Materials Page

## 24.1 Material categories

* Lecture notes
* Presentation
* PDF
* Syllabus
* Reference book
* Video link
* Practical file
* Previous year paper
* Question bank
* External resource

---

## 24.2 Upload form

* Material title
* Description
* Course
* Topic
* File
* Link
* Publish date
* Visibility
* Download permission

---

## 24.3 Teacher controls

The teacher can:

* Upload
* Edit
* Replace
* Delete their own material
* Schedule publication
* Organise by topic
* View download count
* Archive old material

---

# 25. Assignments Page

## 25.1 Assignment creation

The teacher can enter:

* Assignment title
* Instructions
* Course
* Topic
* Attachment
* Total marks
* Due date
* Submission format
* Late submission permission
* Visibility date

---

## 25.2 Assignment statuses

* Draft
* Scheduled
* Published
* Submission Open
* Closed
* Graded
* Archived

---

## 25.3 Submission management

The teacher can:

* View submitted students
* View pending students
* Download submissions
* Give marks
* Add feedback
* Return submissions
* Allow resubmission
* Export marks

Assignment functionality can be considered an academic enhancement if the first version focuses mainly on attendance.

---

# 26. Messages and Discussions Page

## 26.1 Communication types

* Course discussion
* Student question
* Teacher reply
* Private academic message
* Announcement comment
* Technical issue report

---

## 26.2 Public course discussion

Approved messages are visible to all students enrolled in that course.

Recommended process:

1. Student submits a message.
2. Teacher receives a pending post notification.
3. Teacher reviews the message.
4. Teacher approves or rejects it.
5. Approved message becomes visible to the course.
6. Teacher and students can reply.
7. Teacher can close the discussion.

---

## 26.3 Private communication

For personal academic issues, the student can send a private message.

Private messages should be visible only to:

* The concerned student
* The assigned teacher
* Admin, when reported or required

---

## 26.4 Messaging safety

The system should support:

* Report message
* Block attachments
* File-size restrictions
* Message deletion history
* Moderation records
* Admin escalation

---

# 27. Reports and Analytics Page

## 27.1 Course analytics

The teacher can view:

* Total enrolled students
* Average attendance
* Total scheduled classes
* Total completed classes
* Cancelled classes
* Low-attendance students
* Attendance trend
* Most absent dates

---

## 27.2 Student analytics

For each student:

* Daily attendance
* Weekly attendance
* Monthly attendance
* Subject-wise percentage
* Attendance trend
* Continuous absence streak
* Classes required to reach the threshold

---

## 27.3 Attendance threshold categories

Suggested defaults:

* Good: 75% and above
* Warning: 65%–74.99%
* Critical: Below 65%

The admin should control the actual threshold.

---

## 27.4 Teacher performance information

The teacher may see:

* Classes assigned
* Classes conducted
* Attendance sessions completed
* Attendance completion rate
* Correction requests
* Course activity

This information should be used for administrative understanding, not public ranking.

---

# 28. Notifications Page

The teacher should receive notifications for:

* Account approval
* Subject assignment
* Course authorisation code
* Code expiry
* Course approval
* New student enrolment
* Attendance session reminder
* Student correction request
* Student post awaiting approval
* New private message
* Low-attendance alert
* Timetable change
* Holiday announcement
* Admin instruction
* Security alert

---

## 28.1 Notification actions

The teacher can:

* Mark as read
* Mark all as read
* Open related course
* Open attendance request
* Mute selected notification categories
* View notification history

---

# 29. Security and Login Activity Page

## 29.1 Security information

The teacher can view:

* Last login
* Recent login devices
* Login locations
* Active sessions
* Password update date
* Failed login attempts
* Two-factor authentication status

---

## 29.2 Teacher security actions

The teacher can:

* Change password
* Enable two-factor authentication
* Logout from all devices
* Report an unknown login
* Revoke an active session
* Update recovery information

---

## 29.3 Course-code security

The teacher should never be able to:

* Reuse an expired course code
* Transfer a code to another teacher
* Use the same code for another section
* View another teacher’s course code
* Regenerate the code independently

---

# 30. Teacher Settings Page

## 30.1 Profile settings

* Profile picture
* Phone number
* Biography
* Office hours

---

## 30.2 Notification settings

* Email notifications
* Course notifications
* Attendance alerts
* Student message alerts
* Announcement reminders

---

## 30.3 Course preferences

* Default post-comment permission
* Default attendance duration
* Default material visibility
* Discussion approval setting

All settings must remain within limits defined by the admin.

---

# 31. Help and Support Page

The teacher can access:

* Teacher user guide
* How to create a course
* How to start attendance
* How to handle face mismatch
* How to download attendance
* Frequently asked questions
* Report technical problem
* Contact administrator
* Privacy and data policy

---

# 32. Recommended Teacher Portal Design

## 32.1 Left sidebar

Suggested structure:

### Home

* Dashboard

### Academic

* Assigned Subjects
* My Courses
* Class Schedule

### Attendance

* Start Attendance
* Live Attendance
* Attendance Records
* Corrections
* Attendance Sheets

### Course Management

* Students
* Stream
* Materials
* Assignments
* Discussions

### Reports

* Analytics
* Downloads

### Account

* Notifications
* Security
* Settings
* Help

---

## 32.2 Course card design

Course cards should resemble the Google Classroom reference while using VaultID branding.

Each card should display:

* Course banner
* Course name
* Subject code
* Session and semester
* Section
* Student count
* Teacher photograph
* Quick attendance icon
* Course folder icon
* More-options menu

---

## 32.3 Individual classroom layout

The classroom header should show:

* Course name
* Subject code
* Semester
* Section
* Teacher name
* Course banner

Tabs:

* Stream
* Classwork
* Students
* Attendance
* Analytics

---

# 33. Complete Teacher Course Creation Workflow

1. Teacher logs in with verified email.
2. Teacher opens **Assigned Subjects**.
3. Teacher checks the assigned subject.
4. Admin generates a secure authorisation code.
5. Teacher receives the code through verified email or notification.
6. Teacher opens **Create Course**.
7. Teacher selects session.
8. Teacher selects department.
9. Teacher selects programme.
10. Teacher selects year.
11. Teacher selects semester.
12. Teacher selects section.
13. System displays only assigned subjects.
14. Teacher selects the subject.
15. Subject code auto-fills.
16. Teacher enters the authorisation code.
17. Backend validates all data.
18. Teacher adds course description and banner.
19. Teacher clicks **Create Course**.
20. Course is created.
21. Authorisation code becomes invalid for reuse.
22. Admin receives a notification.
23. Eligible students are enrolled.
24. Course appears on the teacher and student dashboards.

---

# 34. Complete Attendance Workflow

1. Teacher opens the scheduled class.
2. Teacher clicks **Start Attendance**.
3. Course and class details auto-fill.
4. Teacher selects an authorised attendance duration.
5. System generates a dynamic QR code.
6. Students scan the QR code.
7. Student face verification is performed.
8. Browser and device integrity checks are completed.
9. Verified students appear live as Present.
10. Failed attempts appear for review.
11. Teacher closes the attendance session.
12. Remaining students are marked Absent.
13. Attendance records are saved.
14. Student analytics update.
15. Teacher receives a session summary.
16. Admin can monitor the record.
17. Any correction follows the approval workflow.

---

# 35. Teacher Permissions

The teacher can:

* View assigned subjects
* Create authorised courses
* Manage their courses
* View enrolled students
* Start attendance
* View attendance records
* Download authorised sheets
* Publish announcements
* Upload course materials
* Create assignments
* Moderate course discussions
* Recommend corrections
* View course analytics

---

# 36. Teacher Restrictions

The teacher cannot:

* Access the Admin Panel
* Create unapproved subjects
* Change subject codes
* Create a course without authorisation
* Reuse a course creation code
* Assign themselves a subject
* Change institutional sessions
* Add or remove official holidays
* View unrelated students
* Modify another teacher’s course
* Permanently delete attendance
* Approve their own major attendance changes
* Reset student face data directly
* View sensitive face embeddings
* Change attendance policy
* Change minimum attendance percentage

---

# 37. Backend Teacher Modules

Although the portals may use a common database, the teacher backend should have separate protected modules.

Recommended modules:

* Teacher Authentication Service
* Teacher Profile Service
* Subject Assignment Service
* Course Authorisation Validation Service
* Course Management Service
* Course Student Service
* Schedule Service
* Attendance Session Service
* Face Verification Status Service
* QR Verification Service
* Attendance Record Service
* Correction Request Service
* Attendance Export Service
* Announcement Service
* Material Service
* Assignment Service
* Messaging and Moderation Service
* Analytics Service
* Notification Service
* Security Log Service

Every API request must verify:

* Authentication token
* Teacher role
* Account status
* Course ownership
* Subject assignment
* Session validity
* Requested-action permission

---

# 38. Additional Essential Teacher Features

## 38.1 Search and filters

The teacher should be able to search by:

* Student name
* Roll number
* Course
* Subject
* Date
* Semester
* Section
* Attendance status

---

## 38.2 Empty states

Examples:

* No course created yet
* No class scheduled today
* No correction requests
* No announcements
* No study materials uploaded

Each empty state should provide a relevant action button.

---

## 38.3 Confirmation dialogues

Confirmation should be required before:

* Closing attendance
* Cancelling a class
* Deleting material
* Rejecting a student post
* Submitting an attendance correction
* Archiving a course

---

## 38.4 Activity history

Each course should show:

* Course created
* Announcement posted
* Attendance started
* Attendance closed
* Material uploaded
* Student added
* Correction submitted
* Course archived

---

## 38.5 Mobile responsiveness

The Teacher Panel should work on:

* Desktop
* Laptop
* Tablet
* Mobile browser

Attendance controls should remain simple and clear on smaller screens.

---

# 39. Final Teacher-Side Page Grouping

## Dashboard

* Dashboard
* My Profile

## Academic Work

* Assigned Subjects
* My Courses
* Create Course
* Class Schedule

## Attendance

* Attendance Dashboard
* Start Attendance
* Live Attendance
* Attendance Records
* Attendance Corrections
* Attendance Sheets

## Course Classroom

* Stream
* Classwork
* Students
* Announcements
* Study Materials
* Assignments
* Messages and Discussions

## Insights

* Reports and Analytics
* Downloads

## Account

* Notifications
* Security and Login Activity
* Settings
* Help and Support

---

# 40. Final Teacher-Side Control Principle

The Teacher Panel should follow this rule:

> A teacher can operate only the academic subjects, courses, sections and student records officially assigned by the administrator.

The admin controls:

* Teacher account approval
* Department information
* Academic sessions
* Subjects and subject codes
* Teacher-subject assignments
* Course authorisation codes
* Student master records
* Holidays
* Attendance policies
* Final attendance corrections

The teacher controls:

* Authorised course classrooms
* Course announcements
* Study materials
* Assignments
* Course discussions
* Scheduled attendance sessions
* Attendance review
* Correction recommendations
* Course-level analytics

The student receives:

* Enrolled course access
* Teacher announcements
* Uploaded materials
* Attendance analytics
* Assignment access
* Approved course discussions

This structure makes the Teacher Panel secure, easy to operate and fully integrated with the VaultID Admin and Student systems while remaining scalable for future college-wide deployment.

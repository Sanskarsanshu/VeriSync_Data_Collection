# FaceAttend — PWC Teacher Master Data Integration Addendum

> **Purpose:** Add the supplied Patna Women’s College faculty information to the approved FaceAttend Phase 1 and Phase 2 scope in a privacy-safe, attendance-only form.  
> **Applies to:** Admin Backend, Admin Frontend, Teacher Backend, Teacher Frontend, Student course views, seed/import workflows, RBAC, audit logs, and data privacy.  
> **Important:** This addendum does not convert FaceAttend into a faculty-CV, research-profile, publication, or college-website system.

---

# 1. Final Product Decision

The supplied faculty details contain two different kinds of information:

## A. Attendance-relevant institutional information

This belongs in FaceAttend:

- Teacher name
- Salutation/title
- Gender, when institutionally required
- Employee ID
- Official email
- Official phone, when required
- Department
- Designation
- Administrative role, such as HOD or Programme Coordinator
- Employment type
- Account status
- Joining date
- Highest qualification or short qualification summary
- Short expertise summary
- Vidwan ID/profile URL
- ORCID ID
- Profile photograph
- Subjects the Teacher is eligible to teach
- Actual subject assignments
- Active Course Offerings
- Timetable and Scheduled Classes
- Attendance-session permissions
- Login/security state

## B. Full professional-CV information

This does **not** belong as a complete internal module in FaceAttend:

- Complete publication lists
- Conference proceedings
- Books and chapters
- Awards and honours history
- Professional-body memberships
- Committee memberships
- Full employment history
- Training and FDP history
- Patents
- Research-project lists
- Co-curricular activities
- Detailed home address
- Long biographies

FaceAttend is an attendance-management product. Do not create:

- Publication tables
- Award tables
- Book tables
- Membership tables
- Research-paper pages
- Faculty-CV pages
- Resume upload
- Faculty document upload
- Research-profile feed

Instead, retain concise professional identifiers and link to approved external profiles such as Vidwan and ORCID.

---

# 2. Faculty Data Normalisation Rules

## 2.1 Standard Department Name

The supplied details use:

- MCA
- Computer Applications (MCA)
- Department of MCA
- Department of Computer Applications
- Computer Science

For the PWC MCA deployment, use the official configured entity:

```text
Department name: Department of Computer Applications
Department short name: MCA
Department code: PWC-MCA
Programme: Master of Computer Applications
Programme short name: MCA
```

Do not store “MCA” as both a Department and a Programme without distinction.

Ms. Richa Verma is supplied under **Department: Computer Science**. Do not automatically place her in the MCA Department. Store or import her against the configured Computer Science Department unless an authorised Admin confirms a cross-department MCA assignment.

## 2.2 Names and Administrative Roles

Do not store administrative roles inside the Teacher’s legal/display name.

Correct:

```text
full_name: Bhawna Sinha
salutation: Dr.
designation: Assistant Professor
department_role: Head of Department
```

Incorrect:

```text
full_name: Dr. Bhawna Sinha (HOD)
```

Likewise:

```text
full_name: Sushmita Chakraborty
department_role: Programme Coordinator
role_scope: PGDCA
```

## 2.3 Missing Information

Do not invent:

- Employee IDs
- Official email addresses
- Phone numbers
- Joining dates
- Designations
- Subject assignments
- Employment status
- Profile photographs

Where information is missing:

```text
record_status = INCOMPLETE
account_status = PRE_AUTHORISED
login_enabled = false
```

Activation requires the official minimum fields.

## 2.4 Source Confidence

Every imported field must support:

```text
source_type
source_reference
source_received_at
verified_by_admin_id
verified_at
verification_status
```

Suggested verification statuses:

```text
UNVERIFIED
OWNER_SUPPLIED
ADMIN_VERIFIED
INSTITUTION_VERIFIED
REJECTED
```

---

# 3. Teacher Activation Requirements

A Teacher must not receive an active login until all mandatory identity fields are present.

Required before activation:

```text
full_name
employee_id
official_email
department_id
designation
employment_status
account_status
email verification
Admin approval
```

Recommended before activation:

```text
profile photo
phone
joining date
highest qualification
```

Optional professional fields:

```text
expertise summary
Vidwan ID
Vidwan profile URL
ORCID ID
```

A Vidwan ID or ORCID ID is not a substitute for institutional identity verification.

---

# 4. Required Data Model

## 4.1 `teachers`

Required fields:

```text
id
organisation_id
college_id
primary_department_id

employee_id nullable until confirmed
salutation
full_name
display_name
gender nullable

official_email nullable until confirmed
official_phone nullable
profile_photo_url nullable

designation nullable
employment_type nullable
employment_status
joining_date nullable
leaving_date nullable

highest_qualification nullable
qualification_summary nullable
expertise_summary nullable

vidwan_id nullable
vidwan_profile_url nullable
orcid_id nullable

profile_completion_status
identity_verification_status
email_verified_at nullable
admin_approved_at nullable
admin_approved_by nullable

account_status
login_enabled

source_type
source_reference nullable
source_payload jsonb nullable

created_at
updated_at
deleted_at nullable
```

Suggested `employment_type` values:

```text
PERMANENT
CONTRACT
VISITING
GUEST
ADJUNCT
ACADEMIC_COUNSELLOR
OTHER
```

Suggested `employment_status` values:

```text
ACTIVE
ON_LEAVE
INACTIVE
LEFT_INSTITUTION
RETIRED
PENDING_CONFIRMATION
```

Suggested `account_status` values:

```text
PRE_AUTHORISED
INVITATION_SENT
EMAIL_NOT_VERIFIED
REGISTRATION_INCOMPLETE
PENDING_ADMIN_APPROVAL
ACTIVE
TEMPORARILY_SUSPENDED
DEACTIVATED
ARCHIVED
```

## 4.2 `teacher_department_memberships`

Use this table because one Teacher may have a primary Department and approved responsibilities in another Department.

```text
id
teacher_id
department_id
membership_type
is_primary
effective_from
effective_to nullable
status
approved_by_admin_id
created_at
updated_at
```

Membership types:

```text
FACULTY
HEAD_OF_DEPARTMENT
PROGRAMME_COORDINATOR
COURSE_COORDINATOR
VISITING_FACULTY
GUEST_FACULTY
ACADEMIC_COUNSELLOR
```

## 4.3 `teacher_administrative_roles`

Administrative responsibility must be separate from designation.

```text
id
teacher_id
role_type
college_id
department_id nullable
programme_id nullable
effective_from
effective_to nullable
status
approved_by_admin_id
created_at
updated_at
```

Role types:

```text
HEAD_OF_DEPARTMENT
PROGRAMME_COORDINATOR
COURSE_COORDINATOR
CLASS_COORDINATOR
ACADEMIC_COORDINATOR
EXAM_COORDINATOR
OTHER
```

These roles do not automatically grant full Admin access. Application permissions remain controlled through RBAC.

## 4.4 `teacher_qualifications`

A lightweight structured list may be stored when the College wants it.

```text
id
teacher_id
qualification_name
specialisation nullable
institution nullable
completion_year nullable
status
display_order
created_at
updated_at
```

Do not require scanned certificates or document uploads.

## 4.5 `teacher_external_profiles`

```text
id
teacher_id
profile_type
external_id nullable
profile_url nullable
is_verified
verified_by_admin_id nullable
verified_at nullable
created_at
updated_at
```

Profile types:

```text
VIDWAN
ORCID
INSTITUTIONAL_PROFILE
OTHER_APPROVED
```

## 4.6 Do Not Create CV Subsystems

Do not create tables for:

```text
teacher_publications
teacher_awards
teacher_books
teacher_patents
teacher_memberships
teacher_committee_history
teacher_training_history
teacher_full_work_history
```

If a future College website needs these features, build them as a separate faculty-profile service, not inside FaceAttend.

---

# 5. Privacy and Visibility Matrix

| Field | Super/College Admin | Department Admin | Teacher Self | Other Teacher | Student |
|---|---|---|---|---|---|
| Name | Yes | Yes | Yes | Limited | Yes |
| Photo | Yes | Yes | Yes | Limited | Yes |
| Employee ID | Yes | Yes | Yes | No | No |
| Official email | Yes | Yes | Yes | No by default | No |
| Official phone | Yes | Scoped | Yes | No | No |
| Gender | Yes | Scoped | Yes | No | No |
| Department | Yes | Yes | Yes | Yes | Yes |
| Designation | Yes | Yes | Yes | Yes | Yes |
| Administrative role | Yes | Yes | Yes | Yes | Relevant only |
| Qualification summary | Yes | Yes | Yes | Optional | Optional |
| Expertise | Yes | Yes | Yes | Optional | Optional |
| Vidwan/ORCID | Yes | Yes | Yes | Optional | Optional |
| Login history | Yes | Scoped | Own only | No | No |
| Security events | Yes | Scoped | Own only | No | No |
| Subject assignments | Yes | Yes | Own | Relevant only | Assigned-course only |
| Attendance performance | Yes | Scoped | Own courses | No | No |
| Personal address | Do not store | No | No | No | No |
| Full CV/publications | External link only | External link only | External link only | No | No |

Students need only:

```text
Teacher name
Profile photo
Designation
Department
Assigned Subject
Course Offering
```

Do not expose Teacher phone numbers, personal addresses, login activity, or private identifiers to Students.

---

# 6. Secure Seed and Import Policy

The supplied information contains real personal data.

Use two seed modes.

## 6.1 Public Demo Seed

Command example:

```text
npm run seed:demo
```

Rules:

- Use fictional email addresses
- Use masked phone numbers
- Do not include personal phone numbers
- Do not include private addresses
- Clearly label records as demo data

## 6.2 Private PWC Seed / Import

Command example:

```text
npm run seed:pwc-private
```

Rules:

- Read from a secure, gitignored JSON/CSV file
- Never commit real phone numbers or private contact data
- Validate every record before commit
- Show an Admin import preview
- Require final Admin confirmation
- Encrypt sensitive fields as required
- Audit who imported the records
- Produce a result report

Suggested file:

```text
/private-seed/pwc-teachers.private.json
```

Required `.gitignore` entry:

```text
/private-seed/*
```

Do not log full phone numbers or sensitive imported values.

---

# 7. Supplied Faculty Master Records

# 7.1 Dr. Bhawna Sinha

## Normalised institutional profile

```text
salutation: Dr.
full_name: Bhawna Sinha
display_name: Dr. Bhawna Sinha
gender: Female

primary_department:
Department of Computer Applications

department_short_name:
MCA

designation:
Assistant Professor

administrative_role:
Head of Department

role_scope:
Department of Computer Applications / MCA

official_email:
bhawna.mca@patnawomenscollege.in

official_phone:
9973261668

location:
Patna, Bihar, India

office/institution:
Patna Women’s College, Bailey Road, Patna

expertise_summary:
Computer Science, Software Engineering and Applications

vidwan_id:
339988

vidwan_profile_url:
https://vidwan.inflibnet.ac.in/profile/339988

orcid_id:
0000-0002-5460-3945

employment_start_year:
1997

employment_status:
ACTIVE, subject to Admin confirmation

employee_id:
MISSING — must be supplied before login activation
```

## Qualification summary

```text
Ph.D. — Babasaheb Bhimrao Ambedkar Bihar University — 2016
MCA — Sikkim Manipal University — 2008
MBA — Symbiosis Centre for Management Studies — 2000
```

## FaceAttend decision

- Create as a pre-authorised PWC MCA Teacher record.
- Create a Department membership.
- Create a separate HOD administrative role.
- Do not store “HOD” in the name.
- Do not import the complete publication, award, membership, committee, conference or book lists into FaceAttend.
- Use Vidwan and ORCID as external professional references.
- Require official employee ID confirmation.
- Verify official email before account activation.
- Phone remains Admin-only and must not be committed to public seed data.

---

# 7.2 Sushmita Chakraborty

## Normalised institutional profile

```text
salutation:
Ms. or Dr. not confirmed — do not invent

full_name:
Sushmita Chakraborty

display_name:
Sushmita Chakraborty

gender:
Female

primary_department:
Department of Computer Applications

department_short_name:
MCA

qualification_summary:
MCA, DBMS

administrative_role:
Programme Coordinator

role_scope:
PGDCA

vidwan_id:
356156

orcid_id:
0009-0003-1922-1305

PWC teaching start:
27 September 1999 for UG teaching

MCA teaching start:
2014

employment_status:
ACTIVE, subject to official confirmation

official_email:
MISSING

official_phone:
MISSING

employee_id:
MISSING

designation:
MISSING / requires official confirmation
```

## FaceAttend decision

- Import as a pre-authorised incomplete Teacher record.
- Associate with the Department of Computer Applications.
- Store Programme Coordinator as a separate administrative role scoped to PGDCA.
- Do not automatically assign MCA Subjects because the supplied text does not identify current official Subject allocations.
- Block login invitation until official email, employee ID and designation are confirmed.
- Do not store full publications, awards, committees, workshops or book history.
- Retain Vidwan and ORCID identifiers.
- Qualification text “MCA, DBMS” should be reviewed because DBMS may represent expertise rather than a degree.

---

# 7.3 Mr. Praveen Kumar

## Normalised institutional profile

```text
salutation:
Mr.

full_name:
Praveen Kumar

display_name:
Mr. Praveen Kumar

gender:
Male

primary_department:
Department of Computer Applications

department_short_name:
MCA

qualification_summary:
M.Tech, MCA

designation:
Assistant Professor

PWC employment start:
December 2013

employment_status:
ACTIVE, subject to Admin confirmation

vidwan_id:
349263

orcid_id:
0000-0003-4055-6436

official_email:
MISSING

official_phone:
MISSING

employee_id:
MISSING

expertise_summary:
Software development, networking, security and information technology
```

## FaceAttend decision

- Import as a pre-authorised incomplete Teacher record.
- Do not infer employee ID or official email.
- Require Admin confirmation of exact joining date and active status.
- Do not create Subject assignments from training/publication topics.
- Do not import complete employment history, publications, training or achievements.
- Retain short qualification, experience summary, Vidwan and ORCID.

---

# 7.4 Braj Kishor Prasad

## Normalised institutional profile

```text
salutation:
Mr.

full_name:
Braj Kishor Prasad

display_name:
Mr. Braj Kishor Prasad

gender:
Male

department supplied:
Computer Applications (MCA)

qualification_summary:
M.Tech, MCA

vidwan_id:
356332

orcid_id:
0009-0003-5258-0625

employment_status:
PENDING_CONFIRMATION

official PWC designation:
MISSING

official PWC employment relationship:
MISSING / requires confirmation

official_email:
MISSING

official_phone:
MISSING

employee_id:
MISSING
```

## FaceAttend decision

- Do not automatically activate this record.
- The supplied work history identifies Academic Counsellor and several visiting/faculty roles, but it does not clearly establish the current official PWC employment designation.
- Import as `PRE_AUTHORISED` and `PENDING_CONFIRMATION`.
- Require an Admin to confirm whether the role is permanent, visiting, guest, Academic Counsellor or another type.
- Do not create Subject Assignments until official allocation is supplied.
- Retain Vidwan and ORCID.
- Do not import scholarship or complete historical employment details into FaceAttend.

---

# 7.5 Ms. Richa Verma

## Normalised institutional profile

```text
salutation:
Ms.

full_name:
Richa Verma

display_name:
Ms. Richa Verma

gender:
Female

department supplied:
Computer Science

qualification_summary:
MCA, M.Phil., B.LIS, Ph.D. pursuing

employment_status:
PENDING_CONFIRMATION

official PWC designation:
MISSING

official PWC email:
MISSING

official phone:
MISSING

employee_id:
MISSING

vidwan_id:
MISSING

orcid_id:
MISSING

expertise_summary:
Information technology, artificial intelligence, cloud computing,
blockchain, data science, machine learning and cybersecurity
```

## FaceAttend decision

- Do not automatically map Ms. Richa Verma to the MCA Department.
- The supplied record states Department: Computer Science.
- Import only after the official PWC Department and current employment relationship are confirmed.
- If she teaches an MCA Subject, use a cross-department Teacher Assignment without changing her primary Department.
- Do not derive a current PWC designation from historical employment records.
- Do not import the complete work history, publications, patents, books, presentations, achievements or activities into FaceAttend.
- Employee ID, official email and current designation are mandatory before login activation.

---

# 8. Faculty Record Completion Matrix

Create an Admin page or import preview showing:

| Teacher | Department | Employee ID | Official Email | Designation | Employment Confirmed | External IDs | Ready for Invitation |
|---|---|---|---|---|---|---|---|
| Dr. Bhawna Sinha | Computer Applications | Missing | Available | Available | Requires confirmation | Vidwan + ORCID | No |
| Sushmita Chakraborty | Computer Applications | Missing | Missing | Missing | Requires confirmation | Vidwan + ORCID | No |
| Praveen Kumar | Computer Applications | Missing | Missing | Available | Requires confirmation | Vidwan + ORCID | No |
| Braj Kishor Prasad | Computer Applications | Missing | Missing | Missing | Not established | Vidwan + ORCID | No |
| Richa Verma | Computer Science | Missing | Missing | Missing | Not established | Missing | No |

“Ready for Invitation” becomes Yes only after all mandatory activation fields pass validation.

---

# 9. Teacher Import Workflow

Implement:

```text
Select private PWC Teacher file
→ Parse records
→ Normalise Department names
→ Detect duplicates
→ Validate ORCID
→ Validate Vidwan ID/URL
→ Identify missing employee IDs
→ Identify missing official emails
→ Identify missing designation/employment status
→ Display field-level preview
→ Admin edits or confirms
→ Commit verified records
→ Create audit log
→ Optionally send invitations only to complete records
```

The import must not automatically send invitations.

## Duplicate detection

Check:

```text
employee_id
official_email
normalised full_name + department
ORCID ID
Vidwan ID
```

Possible duplicate matches must be presented to the Admin. Do not automatically merge real people.

---

# 10. Teacher Onboarding Workflow

```text
Admin imports or creates Teacher
→ Record remains PRE_AUTHORISED
→ Admin completes missing institutional fields
→ Admin confirms Department and employment
→ Admin confirms employee ID and official email
→ Admin assigns designation
→ Admin optionally adds external profiles
→ Admin sends secure invitation
→ Teacher verifies email
→ Teacher creates password
→ Teacher uploads profile photo
→ Teacher reviews allowed profile fields
→ Admin approves
→ Account becomes ACTIVE
→ Subject assignments may be created
→ Course Authorisation may be issued
```

No Teacher can self-select a Department, Semester or Subject.

---

# 11. Subject Assignment Rules

The supplied professional expertise and publications must not create assignments automatically.

Subject assignments require a separate official dataset containing:

```text
teacher_id
subject_id
curriculum_id
academic_session_id
batch_id
academic_year_id
semester_id
section_id
assignment_type
effective_from
effective_to
```

Until this mapping is supplied:

```text
assigned_subjects = none
course_authorisation_eligible = false
```

HOD status does not automatically assign all Department Subjects.

Programme Coordinator status does not automatically assign all Programme Subjects.

---

# 12. Admin Frontend Requirements

## 12.1 Teacher List

Columns:

```text
Teacher
Employee ID
Department
Designation
Administrative Role
Official Email
Profile Completion
Verification
Assigned Subjects
Active Courses
Account Status
Last Login
```

Do not show phone by default.

## 12.2 Teacher Detail

Tabs:

```text
Overview
Department Memberships
Administrative Roles
Qualifications
External Profiles
Subject Assignments
Course Offerings
Attendance Activity
Security
Audit History
```

Do not add:

```text
Publications
Awards
Books
Patents
Uploaded Documents
Announcements
Messages
```

## 12.3 Profile Completion Panel

Show:

- Missing employee ID
- Missing official email
- Missing designation
- Employment confirmation pending
- Email not verified
- Admin approval pending
- No Subject assignment
- No profile photo

## 12.4 External Profile Links

Show approved links as outbound actions:

```text
Open Vidwan Profile
Open ORCID Profile
```

Use `rel="noopener noreferrer"` and open in a new tab.

## 12.5 Administrative Role UI

Administrative roles require:

- Role type
- Scope
- Effective dates
- Approval
- Audit history

Do not edit the Teacher’s name to add or remove a role.

---

# 13. Teacher Frontend Requirements

Teacher may view and edit only approved self-service fields.

Editable:

```text
profile photo
official phone, subject to policy
qualification summary, subject to review
expertise summary
external-profile links, subject to verification
password
MFA
notification preferences
```

Restricted:

```text
employee ID
official email
primary Department
designation
administrative roles
employment status
Subject assignments
Course Offerings
account status
```

No publication-management or CV-upload module.

---

# 14. Student View Requirements

Student Course Overview may show:

```text
Teacher name
Teacher photo
Designation
Department
Assigned Subject
Course Offering
```

Optional, only if institution approves:

```text
Short qualification summary
Short expertise summary
Vidwan/ORCID outbound links
```

Do not show:

```text
Phone
Email
Address
Employee ID
Login history
Security status
Full CV
Awards
Publications
Books
Committee membership
```

---

# 15. Required APIs

Implement domain APIs rather than exposing raw tables.

```text
GET    /api/v1/teachers
POST   /api/v1/teachers
GET    /api/v1/teachers/:id
PATCH  /api/v1/teachers/:id
POST   /api/v1/teachers/:id/complete-record
POST   /api/v1/teachers/:id/send-invitation
POST   /api/v1/teachers/:id/approve
POST   /api/v1/teachers/:id/suspend
POST   /api/v1/teachers/:id/deactivate
POST   /api/v1/teachers/:id/archive

GET    /api/v1/teachers/:id/profile-completion
GET    /api/v1/teachers/:id/department-memberships
POST   /api/v1/teachers/:id/department-memberships
PATCH  /api/v1/teacher-department-memberships/:id
POST   /api/v1/teacher-department-memberships/:id/end

GET    /api/v1/teachers/:id/administrative-roles
POST   /api/v1/teachers/:id/administrative-roles
PATCH  /api/v1/teacher-administrative-roles/:id
POST   /api/v1/teacher-administrative-roles/:id/end

GET    /api/v1/teachers/:id/qualifications
POST   /api/v1/teachers/:id/qualifications
PATCH  /api/v1/teacher-qualifications/:id
DELETE /api/v1/teacher-qualifications/:id

GET    /api/v1/teachers/:id/external-profiles
POST   /api/v1/teachers/:id/external-profiles
PATCH  /api/v1/teacher-external-profiles/:id
POST   /api/v1/teacher-external-profiles/:id/verify

POST   /api/v1/teachers/import
GET    /api/v1/teachers/import/:jobId/preview
PATCH  /api/v1/teachers/import/:jobId/rows/:rowId
POST   /api/v1/teachers/import/:jobId/commit
GET    /api/v1/teachers/import/:jobId/result
```

No endpoint may return personal phone, private contact data or security fields unless the caller has explicit permission.

---

# 16. Validation Rules

## Names

- Trim and normalise whitespace.
- Preserve correct case.
- Store salutation separately.
- Do not append HOD or coordinator status to the name.

## Official Email

- Must be unique.
- Must use an Admin-approved domain or be explicitly approved.
- Must be verified before login activation.

## ORCID

Validate canonical format:

```text
0000-0000-0000-0000
```

Use checksum validation where practical.

## Vidwan

- Store ID separately from URL.
- Normalise duplicate slashes in URL.
- Allow Admin verification.
- Do not scrape or import full profiles automatically.

## Phone

- Store in canonical E.164 format where possible.
- Mask in UI.
- Do not expose to Students.
- Do not write full value to logs.

## Department

- Must reference a real Department row.
- Do not accept free-text Department during final commit.

---

# 17. Required Permissions

Suggested permissions:

```text
teachers.read
teachers.create
teachers.update
teachers.invite
teachers.approve
teachers.suspend
teachers.deactivate
teachers.import
teachers.view_contact
teachers.manage_department_membership
teachers.manage_administrative_roles
teachers.manage_qualifications
teachers.manage_external_profiles
teachers.verify_external_profiles
teachers.view_security
teachers.view_audit
```

Department Admin permissions must be restricted to their Department unless a cross-department role is explicitly granted.

---

# 18. Audit Requirements

Audit:

- Teacher created
- Import source and job
- Field corrected
- Department changed
- Designation changed
- Employee ID added or changed
- Official email changed
- Email verified
- Phone viewed by a privileged Admin, if policy requires access logging
- Administrative role assigned or ended
- Department membership assigned or ended
- External profile added or verified
- Invitation sent
- Account approved
- Account suspended/deactivated
- Subject assignment added or removed

Do not store secrets or full phone numbers in audit payloads.

---

# 19. Required Tests

Test at minimum:

```text
HOD is stored as an administrative role, not inside full_name
Programme Coordinator is stored separately from designation
Teacher without employee ID cannot be activated
Teacher without official email cannot receive invitation
Duplicate ORCID is flagged for review
Duplicate Vidwan ID is flagged for review
Richa Verma is not automatically mapped from Computer Science to MCA
Cross-department Teacher Assignment preserves primary Department
HOD does not automatically receive all Subjects
Publication history is not imported into attendance-domain tables
Student API cannot see Teacher phone or official email
Department Admin cannot view another Department's private contacts
Teacher can edit allowed fields but cannot change Department
Private PWC seed is excluded from version control
Public demo seed contains no real personal phone numbers
Deactivated Teacher retains historical Course and Attendance records
```

Seed-specific tests:

```text
Bhawna Sinha imports with HOD role and incomplete employee ID
Sushmita Chakraborty imports as incomplete and invitation-blocked
Praveen Kumar imports as incomplete and invitation-blocked
Braj Kishor Prasad imports as pending employment confirmation
Richa Verma imports against Computer Science or remains pending Department confirmation
No supplied Teacher receives an automatic Subject assignment
```

---

# 20. Definition of Done

Do not consider PWC Teacher integration complete until:

- All supplied faculty records appear in a validation preview.
- Department names are normalised.
- Administrative roles are separate from names and designations.
- Missing employee IDs and emails remain clearly marked.
- No missing value is invented.
- No Teacher is activated prematurely.
- Private contact information is protected.
- Real phone numbers are excluded from public/demo seed.
- Vidwan and ORCID values are structured and validated.
- Richa Verma is not silently assigned to MCA.
- Braj Kishor Prasad’s employment relationship is confirmed before activation.
- Full publications, awards, books, patents and CV history are not added as FaceAttend modules.
- Subject assignments are created only from official allocations.
- Admin Teacher pages use real APIs.
- Teacher self-service permissions are enforced.
- Student views expose only appropriate professional information.
- Swagger is accurate.
- RBAC tests pass.
- Import tests pass.
- Audit logging passes.
- Build, lint, migrations and seed validation pass.

---

# 21. Final Instruction to Antigravity

```text
Add the supplied PWC faculty records to FaceAttend through the Teacher Master
Data workflow defined in this addendum.

Do not copy the complete CVs, publications, awards, books, patents, committee
memberships or training histories into FaceAttend. This is an attendance system,
not a faculty research-profile portal.

Store HOD, Programme Coordinator and other administrative responsibilities as
scoped roles, not as part of a Teacher's name.

Do not invent employee IDs, official emails, phone numbers, designations,
employment statuses, joining dates or Subject assignments. Records missing
mandatory activation data must remain PRE_AUTHORISED and login-disabled.

Use a secure private PWC import/seed file for real personal data and exclude it
from version control. Keep the public demo seed fictional and privacy-safe.

Dr. Bhawna Sinha may be imported as a pre-authorised MCA faculty record with a
separate HOD role, but activation remains blocked until her official employee ID
and all mandatory institutional checks are complete.

Sushmita Chakraborty, Praveen Kumar and Braj Kishor Prasad must remain incomplete
until their missing official institutional fields are confirmed.

Ms. Richa Verma is supplied under the Computer Science Department. Do not assign
her to MCA unless an authorised Admin confirms a cross-department assignment.

Do not infer Subject assignments from expertise, qualifications, publications or
work history. Wait for the official Teacher-to-Subject allocation.

Implement the data model, import preview, completion checks, privacy controls,
APIs, UI, RBAC, audit logs and tests defined above.

Proceed without waiting for another confirmation.
```

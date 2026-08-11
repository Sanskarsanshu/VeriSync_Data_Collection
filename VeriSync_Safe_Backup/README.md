# VeriSync — Attendance-Only Frontend MVP

VeriSync is a professional, responsive, SaaS-style frontend prototype for Patna Women's College MCA second-year attendance operations.

The codebase uses only:

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage` for demo persistence
- Canvas APIs for charts

No framework, build tool, package installation or external icon library is required.

## Product scope

This MVP is intentionally limited to attendance-related functions:

- Separate Admin, Teacher and Student portals
- Separate login pages
- Teacher and student registration pages
- College, session, semester and teaching-start configuration
- Official subject master
- Teacher and student records
- Teacher-to-subject assignments
- Secure course-authorisation code generation
- Authorised teacher course creation
- Google Classroom-inspired attendance course cards
- Class schedule
- Dynamic attendance-session frontend
- QR-like token display and validation simulation
- Face and liveness verification UI simulation
- Device-integrity workflow simulation
- Attendance records
- Monthly attendance matrices
- `1`, `0`, `H`, `C` and `NA` status logic
- Mid-month semester-start handling
- Holiday and vacation handling
- Daily, weekly, monthly and subject-wise analytics
- Attendance-shortage warnings
- Teacher recommendation and admin approval for corrections
- CSV exports
- Security and audit screens
- Light and dark appearance
- Responsive desktop, tablet and mobile layouts

It does not contain course chat, teacher-student messaging, study-material uploads, academic assignment creation, assignment submission or student-post approval.

## Start the project

### Recommended method

Open a terminal inside the project folder and run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You may also open `index.html` directly, but a local web server gives more consistent browser behaviour.

## Demo credentials

### Admin

- Email: `admin@pwc.edu.in`
- Password: `admin123`

### Teacher

- Email: `teacher@pwc.edu.in`
- Password: `teacher123`

### Student

- Email: `student@pwc.edu.in`
- Password: `student123`

## Demo course-authorisation code

The seeded teacher account can create the Wireless Communication course using:

```text
Wc7P2kLm9Q
```

The code is bound to:

- Teacher: Dr. Jagadeesha R. B.
- Subject: Wireless Communication
- Session: 2025–2027
- Semester: IV
- Section: A

After successful use, its status becomes `Used`.

## Project structure

```text
verisync-mvp/
├── index.html
├── admin-login.html
├── teacher-login.html
├── teacher-register.html
├── student-login.html
├── student-register.html
├── admin.html
├── teacher.html
├── student.html
├── css/
│   └── styles.css
├── js/
│   ├── core.js
│   ├── auth.js
│   ├── admin.js
│   ├── teacher.js
│   └── student.js
└── README.md
```

## Important frontend limitation

This is a frontend MVP. The following are visual or local-browser simulations and are not secure production implementations:

- Authentication
- Email OTP verification
- Face recognition
- Liveness detection
- Camera capture
- Device fingerprinting
- Dynamic QR encoding and scanning
- Authorisation-code hashing
- Role security
- Database storage
- Audit immutability
- File imports

A production system must implement these on a secure backend. Client-side role checks and `localStorage` must never be treated as real security.

## Suggested backend replacement points

The demo database and operations are located in `js/core.js`.

Replace these functions with API calls:

- `VeriSync.login()`
- `VeriSync.getDB()`
- `VeriSync.updateDB()`
- `VeriSync.setSession()`
- `VeriSync.requireRole()`
- attendance-session creation
- QR token generation and validation
- face-verification result handling
- correction approval workflows
- CSV/report generation when server-signed reports are required

Recommended production API groups:

```text
/api/admin/*
/api/teacher/*
/api/student/*
/api/auth/*
/api/attendance/*
/api/verification/*
/api/reports/*
```

## Reset demo data

Open the Admin Portal and navigate to:

```text
System Settings → Demo data controls → Reset all demo data
```

This restores the initial sample records in the current browser.

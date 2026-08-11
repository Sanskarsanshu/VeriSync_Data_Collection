# VeriSync Attendance System — GitHub References

> Reference repositories for implementing **Face Recognition**, **QR Code**, and **OTP-based student attendance** in VeriSync.
>
> Last verified: **31 July 2026**

---

## 1. Face Recognition Attendance

### 1.1 SmartAttend

- **Repository:** [mitraboga/SmartAttend](https://github.com/mitraboga/SmartAttend)
- **Clone URL:** `https://github.com/mitraboga/SmartAttend.git`
- **Category:** Face recognition and liveness detection
- **Licence:** MIT
- **Technology:** Python, Streamlit, OpenCV, TensorFlow/Keras, SQLite/PostgreSQL and S3-compatible storage

#### Important features

- Student face enrolment
- CNN-based face recognition
- Liveness and anti-spoofing verification
- Session-based attendance
- Admin and faculty roles
- Attendance-attempt logging
- Suspicious-scan and exception review
- SQLite for local development
- PostgreSQL for deployment
- Docker and GitHub Actions support

#### Recommended use in VeriSync

Use this repository as a reference for:

- Face enrolment workflow
- Face-image preprocessing
- Face-recognition pipeline
- Liveness detection
- Spoof-attempt logging
- Attendance-session validation

Do not directly use its Streamlit interface as the final VeriSync frontend. Integrate the recognition logic into the existing FastAPI backend and React frontend.

#### Clone command

```bash
git clone https://github.com/mitraboga/SmartAttend.git
```

---

### 1.2 AttendAI

- **Repository:** [menaceXnadin/Ai-Attendance-Management-System](https://github.com/menaceXnadin/Ai-Attendance-Management-System)
- **Clone URL:** `https://github.com/menaceXnadin/Ai-Attendance-Management-System.git`
- **Category:** Full-stack face-recognition attendance
- **Licence:** No standard open-source licence found in the repository root
- **Technology:** React, Vite, TypeScript, Tailwind CSS, FastAPI, InsightFace, OpenCV, PostgreSQL, SQLAlchemy and Alembic

#### Important features

- InsightFace-based face recognition
- React and TypeScript frontend
- FastAPI REST backend
- PostgreSQL database
- JWT authentication
- Admin and student roles
- Attendance analytics
- Docker support

#### Recommended use in VeriSync

Use this repository as an architecture reference for:

- React-to-FastAPI integration
- Face-recognition API endpoints
- PostgreSQL attendance storage
- JWT-protected attendance operations
- Frontend camera and verification screens

> **Licence warning:** Study the implementation, but do not copy or redistribute its source code unless the owner provides permission or adds a suitable licence.

#### Clone command

```bash
git clone https://github.com/menaceXnadin/Ai-Attendance-Management-System.git
```

---

## 2. QR Code Attendance

### 2.1 QRSMS-V1

- **Repository:** [hassan11196/QRSMS-V1](https://github.com/hassan11196/QRSMS-V1)
- **Clone URL:** `https://github.com/hassan11196/QRSMS-V1.git`
- **Category:** Complete QR-based student attendance system
- **Licence:** Apache License 2.0
- **Technology:** React, Django, Django REST Framework, PostgreSQL, SQLite and Flutter

#### Important features

- Separate teacher, student and faculty/admin portals
- QR-code attendance marking
- Django REST API architecture
- PostgreSQL production database
- SQLite development database
- Flutter student application
- Teacher and student workflows
- CI configuration and GitHub Actions

#### Related repositories

- **Teacher portal:** [hassan11196/QRSMS-Teacher](https://github.com/hassan11196/QRSMS-Teacher)
- **Student portal:** [hassan11196/QRSMS-Student](https://github.com/hassan11196/QRSMS-Student)
- **Flutter application:** [hassan11196/QRSMSApp](https://github.com/hassan11196/QRSMSApp)

#### Recommended use in VeriSync

Use this repository as the main reference for:

- Teacher-generated QR attendance sessions
- Student QR scanning
- QR payload structure
- Teacher, student and admin portal separation
- Attendance API and database design
- Mobile attendance workflow

Because it has an Apache 2.0 licence, its code may be modified and reused while following the licence requirements.

#### Clone command

```bash
git clone https://github.com/hassan11196/QRSMS-V1.git
```

---

### 2.2 SAMS — QR and Geolocation Attendance

- **Repository:** [Hariharanpugazh/SAMS](https://github.com/Hariharanpugazh/SAMS)
- **Clone URL:** `https://github.com/Hariharanpugazh/SAMS.git`
- **Category:** Dynamic QR code with geolocation verification
- **Licence:** Educational-purpose statement; no standard open-source licence found
- **Technology:** React, Tailwind CSS, Django REST Framework and MongoDB

#### Important features

- Dynamic QR-code generation
- QR expiration time
- QR validation
- GPS location capture
- Configurable geofence radius
- Haversine distance calculation
- Admin and student dashboards
- Attendance history and statistics

#### Recommended use in VeriSync

Use this repository as a reference for:

- Time-limited QR codes
- GPS-based attendance validation
- Classroom geofencing
- QR scan validation endpoints
- Location-error handling

> **Licence warning:** The project describes itself as an academic prototype. Recreate its ideas in VeriSync rather than directly copying the source code without permission.

#### Clone command

```bash
git clone https://github.com/Hariharanpugazh/SAMS.git
```

---

## 3. OTP Attendance

### 3.1 Class Ping

- **Repository:** [mdmourao/class-ping](https://github.com/mdmourao/class-ping)
- **Clone URL:** `https://github.com/mdmourao/class-ping.git`
- **Category:** Dynamic classroom OTP attendance
- **Licence:** No standard open-source licence found
- **Technology:** Django, Django Ninja API and Bootstrap

#### Important features

- Professor-generated dynamic OTP
- OTP displayed in the classroom
- Automatic OTP refresh
- Student OTP submission
- Attendance-session management
- Teacher double-confirmation system
- Manual student verification after OTP entry

#### Recommended use in VeriSync

Use this repository as a reference for:

- Six-digit OTP generation
- OTP expiration and refresh
- Student OTP submission
- Server-side OTP verification
- Teacher confirmation workflow
- Attendance-session lifecycle

> **Licence warning:** Use it for learning and architecture reference. Do not directly copy or redistribute its code without permission.

#### Clone command

```bash
git clone https://github.com/mdmourao/class-ping.git
```

---

## 4. Combined QR, OTP and Anti-Proxy Security

### 4.1 Zero Proxy

- **Repository:** [cybergeek-007/zero-proxy](https://github.com/cybergeek-007/zero-proxy)
- **Clone URL:** `https://github.com/cybergeek-007/zero-proxy.git`
- **Category:** Zero-trust classroom attendance
- **Licence:** Educational-purpose statement; no standard open-source licence found
- **Technology:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Hono, tRPC, Drizzle ORM and MySQL

#### Important features

- Live QR-code scanning
- Six-digit time-based OTP/TOTP
- OTP and QR refresh every 15 seconds
- GPS geofencing
- Haversine distance verification
- Device fingerprinting
- One-device-per-student binding
- Rate limiting
- Server-side token verification
- Student, faculty and administrator dashboards
- Manual faculty override
- Attendance reports and analytics

#### Recommended use in VeriSync

Use this repository as the main security-design reference for:

- Rotating QR tokens
- TOTP verification
- Geofence enforcement
- Registered-device validation
- Rate limiting
- Replay-attack prevention
- Proxy-attendance detection
- Manual teacher override

> **Licence warning:** The repository states that it is for educational purposes. Reimplement its security concepts in the VeriSync codebase instead of copying the source directly.

#### Clone command

```bash
git clone https://github.com/cybergeek-007/zero-proxy.git
```

---

## 5. Repository Comparison

| Attendance method | Recommended repository | Best reference for | Code-reuse status |
|---|---|---|---|
| Face recognition | [SmartAttend](https://github.com/mitraboga/SmartAttend) | Face recognition, liveness and spoof logging | MIT licence |
| Face full stack | [AttendAI](https://github.com/menaceXnadin/Ai-Attendance-Management-System) | React, FastAPI and InsightFace architecture | Permission required |
| QR attendance | [QRSMS-V1](https://github.com/hassan11196/QRSMS-V1) | Complete QR attendance workflow | Apache 2.0 licence |
| QR with GPS | [SAMS](https://github.com/Hariharanpugazh/SAMS) | Dynamic QR, expiry and geofencing | Educational reference |
| OTP attendance | [Class Ping](https://github.com/mdmourao/class-ping) | Dynamic OTP and teacher confirmation | Permission required |
| QR + OTP security | [Zero Proxy](https://github.com/cybergeek-007/zero-proxy) | Device binding, GPS, TOTP and rate limiting | Educational reference |

---

## 6. Recommended VeriSync Implementation

VeriSync should not depend on a single attendance-verification method. The recommended verification flow is:

```text
Teacher creates an Attendance Session
                ↓
Backend generates a rotating QR code and six-digit OTP
                ↓
Student scans the QR code or enters the OTP
                ↓
Backend validates:
    1. Logged-in student account
    2. Active attendance session
    3. Correct class, course and subject
    4. Student enrolment in the class
    5. QR or OTP expiration
    6. GPS location and geofence
    7. Registered device or device fingerprint
    8. Face recognition and liveness, when required
                ↓
Attendance is recorded with verification evidence
                ↓
Teacher dashboard updates in real time
```

### Recommended combination

- Use **SmartAttend** for face recognition and liveness concepts.
- Use **QRSMS-V1** for the QR attendance workflow.
- Use **Class Ping** for OTP session behaviour.
- Use **SAMS** for geolocation and geofencing.
- Use **Zero Proxy** for device binding, rotating tokens and anti-proxy rules.
- Use **AttendAI** for React, FastAPI, InsightFace and PostgreSQL integration ideas.

---

## 7. Security Requirements for VeriSync

The production system should implement the following controls:

1. Generate cryptographically secure random OTPs.
2. Store OTP hashes instead of plain OTP values.
3. Apply a short validity period to QR codes and OTPs.
4. Verify QR and OTP values only on the backend.
5. Prevent the same student from marking attendance twice in one session.
6. Bind every attendance record to the student, session, device and timestamp.
7. Add rate limiting to QR and OTP verification endpoints.
8. Record failed, expired and suspicious verification attempts.
9. Use server time as the source of truth.
10. Keep manual teacher override actions in an audit log.
11. Treat GPS as supporting evidence because browser location can be manipulated.
12. Use face liveness or teacher review for high-security attendance sessions.

---

## 8. Important Licence Note

A public GitHub repository is not automatically free to copy.

- Repositories with an **MIT** or **Apache 2.0** licence may generally be reused according to their licence conditions.
- Repositories without a recognised licence should be treated as **reference-only**.
- Keep licence and copyright notices when reusing licensed code.
- Obtain permission from the repository owner before copying code from an unlicensed project.


<div align="center">
  <img src="docs/images/logo.png" alt="VeriSync Logo" width="120" />
  <h1>VeriSync Attendance Management</h1>
  <p><strong>A modern, full-stack attendance management system with role-based portals for Admins, Teachers, and Students.</strong></p>

  <!-- Replace these badges with real ones if needed -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" />
</div>

<br />

## 📸 Screenshots
> **📸 ADDING YOUR PICTURES:**
> 1. Create a `images` folder inside your `docs` folder if it doesn't exist (`docs/images/`).
> 2. Paste your project screenshots in that folder.
> 3. Update the file names in the `![Alt Text](./docs/images/your_picture_name.png)` links below to match your actual image file names!

<details open>
<summary><b>1. Admin Dashboard</b> <i>(Click to expand/collapse)</i></summary>
<br/>

<!-- ADD ADMIN DASHBOARD PICTURE HERE by updating the filename -->
![Admin Dashboard Overview](./docs/images/admin_dashboard.png)
*Overview of the administrative interface with analytics and system management.*

</details>

<details>
<summary><b>2. Teacher Portal</b> <i>(Click to expand/collapse)</i></summary>
<br/>

<!-- ADD TEACHER PORTAL PICTURE HERE by updating the filename -->
![Teacher Portal View](./docs/images/teacher_portal.png)
*Teacher dashboard showing assigned courses, schedules, and live attendance tracking.*

</details>

<details>
<summary><b>3. Student Portal</b> <i>(Click to expand/collapse)</i></summary>
<br/>

<!-- ADD STUDENT PORTAL PICTURE HERE by updating the filename -->
![Student Portal View](./docs/images/student_portal.png)
*Student view for checking attendance records and joining sessions securely.*

</details>

<details>
<summary><b>4. Live Verification / QR Flow</b> <i>(Click to expand/collapse)</i></summary>
<br/>

<!-- ADD VERIFICATION / QR PICTURE HERE by updating the filename -->
![Verification Flow](./docs/images/verification_flow.png)
*Live attendance verification process via OTP/QR capabilities.*

</details>

## 🚀 Overview

VeriSync is a comprehensive attendance tracking and management system tailored for modern educational institutions. It brings reliability, security, and a premium "Aurora" user experience to the academic workflow.

### ✨ Key Features
- **Role-Based Access Control:** Distinct, fully-featured portals for Admins, Teachers, and Students.
- **Advanced Authentication:** Features secure OTP/QR verification workflows for attendance tracking.
- **Dynamic Dashboards:** Real-time metrics and charts powered by Recharts.
- **Premium UI/UX:** Built with React, Tailwind CSS, and a sleek glassmorphism aesthetic supporting Light/Dark themes.
- **Robust Backend:** Scalable API built on NestJS and Prisma ORM.

## 🏗️ Project Structure

This project follows a clean monorepo-style structure separating concerns:

```text
VeriSync_Attendance/
├── frontend_v2/      # The main React application (Vite, TS, Tailwind, Zustand)
├── backend/          # The NestJS API server (Prisma, Database Models, Services)
├── docs/             # Technical documentation and guides (and images!)
└── my_mvp/           # Legacy HTML/CSS/JS frontend prototype
```

## ⚙️ Getting Started

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` variables for the database connection.
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run start:dev
   ```

### 2. Frontend Setup

1. Open a new terminal and navigate to the modern frontend directory:
   ```bash
   cd frontend_v2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173`.

## 🔐 Default Demo Accounts

If database seeding is enabled, use the following default credentials to explore the portals:

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Admin   | `admin@pwc.edu.in`     | `admin123` |
| Teacher | `teacher@pwc.edu.in`   | `teacher123`|
| Student | `student@pwc.edu.in`   | `student123`|

---
<div align="center">
  <i>Built with modern web technologies to ensure scalable and secure operations.</i>
</div>

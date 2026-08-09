# Universal Student Portal Rules

This document outlines the strict business logic rules that must be followed when building, modifying, or querying the Student Portal for VeriSync.

## 1. No Mock Data (Real Analytics Only)
- **Rule:** Every registered student must be treated as a real entity.
- **Enforcement:** 
  - **No hardcoded statistics** (e.g., hardcoded "82% attendance", "41 classes attended", etc.) are allowed in the student dashboard or any other UI component.
  - **Zero Default:** If a student has no attendance records marked yet, all metrics (Percentage, Classes Attended, Missed, etc.) MUST display `0` or `0%`.
  - **Dynamic Fetching:** All metrics, recent history, and alert notifications must be dynamically fetched from the database for the currently logged-in student.

## 2. Universal "2nd Year - III Semester" Mapping
- **Rule:** All newly registered students must automatically and universally be mapped to the **3rd Semester (2nd Year)** cohort.
- **Enforcement:**
  - **Backend Assignment:** During registration (`enrollment/submit`), the backend must explicitly assign the student to the Semester 3 section. It should not rely blindly on frontend dropdown selections if they deviate from this.
  - **Subjects & Courses:** All courses displayed in `StudentCourses.tsx`, `StudentDashboard.tsx`, and the Schedule must exactly match the predefined 3rd Semester subjects (e.g., CC310, CC311, CC312, CC313, MDC302, MAEC302, SEC303).
  - **Teacher Mapping:** The teacher names displayed in the student schedule or course list must accurately reflect the real teachers assigned to the 3rd Semester Section A subjects (e.g., Dr. Praveen Kumar, Richa Verma, Sushmita Chakraborty, Braj Kishore Prasad) as defined in the database.

## 3. UI Alignment
- **Rule:** The entire student portal interface, including the dashboard, courses view, and schedule view, must be completely aligned with the above two rules.
- **Enforcement:** The frontend should be designed to gracefully handle "empty states" (e.g., when a student has 0% attendance) without crashing or looking incomplete.

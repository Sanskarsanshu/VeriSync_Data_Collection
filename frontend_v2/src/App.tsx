import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { ToastNotification } from '@/components/ui/toast-notification';
import LoginPage from '@/pages/LoginPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import StudentEnrollmentAdmin from '@/pages/admin/StudentEnrollmentAdmin';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminTeachers from '@/pages/admin/AdminTeachers';
import AdminSubjects from '@/pages/admin/AdminSubjects';
import AdminCollege from '@/pages/admin/AdminCollege';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminAssignments from '@/pages/admin/AdminAssignments';
import AdminAuthorizations from '@/pages/admin/AdminAuthorizations';
import AdminHolidays from '@/pages/admin/AdminHolidays';
import AdminAcademicCalendar from '@/pages/admin/AdminAcademicCalendar';
import AdminTimeTable from '@/pages/admin/AdminTimeTable';
import AdminAttendanceMonitor from '@/pages/admin/AdminAttendanceMonitor';
import AdminCorrections from '@/pages/admin/AdminCorrections';
import AdminSheets from '@/pages/admin/AdminSheets';
import AdminReports from '@/pages/admin/AdminReports';
import AdminSecurity from '@/pages/admin/AdminSecurity';
import AdminSettings from '@/pages/admin/AdminSettings';
import AdminProfile from '@/pages/admin/AdminProfile';
import AdminTeacherProfile from '@/pages/admin/AdminTeacherProfile';

// Teacher pages
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import TeacherAssignedSubjects from '@/pages/teacher/TeacherAssignedSubjects';
import TeacherMyCourses from '@/pages/teacher/TeacherMyCourses';
import TeacherCreateCourse from '@/pages/teacher/TeacherCreateCourse';
import TeacherClassSchedule from '@/pages/teacher/TeacherClassSchedule';
import TeacherStartAttendance from '@/pages/teacher/TeacherStartAttendance';
import TeacherLiveAttendance from '@/pages/teacher/TeacherLiveAttendance';
import TeacherAttendanceRecords from '@/pages/teacher/TeacherAttendanceRecords';
import TeacherCorrectionRequests from '@/pages/teacher/TeacherCorrectionRequests';
import TeacherAttendanceSheets from '@/pages/teacher/TeacherAttendanceSheets';
import TeacherReportsAnalytics from '@/pages/teacher/TeacherReportsAnalytics';
import TeacherMyProfile from '@/pages/teacher/TeacherMyProfile';
import TeacherSecurity from '@/pages/teacher/TeacherSecurity';
import TeacherSettings from '@/pages/teacher/TeacherSettings';
import TeacherHolidays from '@/pages/teacher/TeacherHolidays';
import TeacherAcademicCalendar from '@/pages/teacher/TeacherAcademicCalendar';
import TeacherTimeTable from '@/pages/teacher/TeacherTimeTable';

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentMockJoin from '@/pages/student/StudentMockJoin';
import StudentCourses from '@/pages/student/StudentCourses';
import StudentSchedule from '@/pages/student/StudentSchedule';
import StudentMarkAttendance from '@/pages/student/StudentMarkAttendance';
import StudentAttendanceHistory from '@/pages/student/StudentAttendanceHistory';
import StudentAnalytics from '@/pages/student/StudentAnalytics';
import StudentCorrections from '@/pages/student/StudentCorrections';
import StudentHolidays from '@/pages/student/StudentHolidays';
import StudentAcademicCalendar from '@/pages/student/StudentAcademicCalendar';
import StudentTimeTable from '@/pages/student/StudentTimeTable';
import StudentProfile from '@/pages/student/StudentProfile';
import StudentSecurity from '@/pages/student/StudentSecurity';
import StudentSettings from '@/pages/student/StudentSettings';

import RegisterPage from '@/pages/RegisterPage';

/**
 * AdminGuard / TeacherGuard — thin wrappers so we don't repeat requiredRole
 * on every single route definition.
 */
function AdminGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
}

function TeacherGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="teacher">{children}</ProtectedRoute>;
}

function StudentGuard({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>;
}

function App() {
  return (
    <Router>
      <ToastNotification />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ────────────────────────────────────────────────────────────
            ADMIN ROUTES — every route is wrapped in AdminGuard.
            Typing /admin directly in the browser triggers a call to
            GET /api/auth/me. If the cookie is missing or the role is
            not ADMIN, the user is redirected to /login immediately.
        ──────────────────────────────────────────────────────────── */}
        <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
        <Route path="/admin/students" element={<AdminGuard><AdminStudents /></AdminGuard>} />
        <Route path="/admin/teachers" element={<AdminGuard><AdminTeachers /></AdminGuard>} />
        <Route path="/admin/teachers/:id" element={<AdminGuard><AdminTeacherProfile /></AdminGuard>} />
        <Route path="/admin/subjects" element={<AdminGuard><AdminSubjects /></AdminGuard>} />
        <Route path="/admin/college" element={<AdminGuard><AdminCollege /></AdminGuard>} />
        <Route path="/admin/courses" element={<AdminGuard><AdminCourses /></AdminGuard>} />
        <Route path="/admin/assignments" element={<AdminGuard><AdminAssignments /></AdminGuard>} />
        <Route path="/admin/authorizations" element={<AdminGuard><AdminAuthorizations /></AdminGuard>} />
        <Route path="/admin/holidays" element={<AdminGuard><AdminHolidays /></AdminGuard>} />
        <Route path="/admin/academic-calendar" element={<AdminGuard><AdminAcademicCalendar /></AdminGuard>} />
        <Route path="/admin/time-table" element={<AdminGuard><AdminTimeTable /></AdminGuard>} />
        <Route path="/admin/attendance-monitor" element={<AdminGuard><AdminAttendanceMonitor /></AdminGuard>} />
        <Route path="/admin/corrections" element={<AdminGuard><AdminCorrections /></AdminGuard>} />
        <Route path="/admin/sheets" element={<AdminGuard><AdminSheets /></AdminGuard>} />
        <Route path="/admin/reports" element={<AdminGuard><AdminReports /></AdminGuard>} />
        <Route path="/admin/security" element={<AdminGuard><AdminSecurity /></AdminGuard>} />
        <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />
        <Route path="/admin/profile" element={<AdminGuard><AdminProfile /></AdminGuard>} />
        <Route path="/admin/student-enrollment" element={<AdminGuard><StudentEnrollmentAdmin /></AdminGuard>} />

        {/* ────────────────────────────────────────────────────────────
            TEACHER ROUTES — wrapped in TeacherGuard.
            A teacher cannot access /admin routes and vice-versa.
        ──────────────────────────────────────────────────────────── */}
        <Route path="/teacher" element={<TeacherGuard><TeacherDashboard /></TeacherGuard>} />
        <Route path="/teacher/academic/subjects" element={<TeacherGuard><TeacherAssignedSubjects /></TeacherGuard>} />
        <Route path="/teacher/academic/courses" element={<TeacherGuard><TeacherMyCourses /></TeacherGuard>} />
        <Route path="/teacher/academic/create-course" element={<TeacherGuard><TeacherCreateCourse /></TeacherGuard>} />
        <Route path="/teacher/academic/schedule" element={<TeacherGuard><TeacherClassSchedule /></TeacherGuard>} />
        
        <Route path="/teacher/attendance/start" element={<TeacherGuard><TeacherStartAttendance /></TeacherGuard>} />
        <Route path="/teacher/attendance/live" element={<TeacherGuard><TeacherLiveAttendance /></TeacherGuard>} />
        <Route path="/teacher/attendance/records" element={<TeacherGuard><TeacherAttendanceRecords /></TeacherGuard>} />
        <Route path="/teacher/attendance/corrections" element={<TeacherGuard><TeacherCorrectionRequests /></TeacherGuard>} />
        <Route path="/teacher/attendance/sheets" element={<TeacherGuard><TeacherAttendanceSheets /></TeacherGuard>} />
        
        <Route path="/teacher/insights/reports" element={<TeacherGuard><TeacherReportsAnalytics /></TeacherGuard>} />
        
        <Route path="/teacher/holidays" element={<TeacherGuard><TeacherHolidays /></TeacherGuard>} />
        <Route path="/teacher/academic-calendar" element={<TeacherGuard><TeacherAcademicCalendar /></TeacherGuard>} />
        <Route path="/teacher/time-table" element={<TeacherGuard><TeacherTimeTable /></TeacherGuard>} />

        <Route path="/teacher/account/profile" element={<TeacherGuard><TeacherMyProfile /></TeacherGuard>} />
        <Route path="/teacher/account/security" element={<TeacherGuard><TeacherSecurity /></TeacherGuard>} />
        <Route path="/teacher/account/settings" element={<TeacherGuard><TeacherSettings /></TeacherGuard>} />

        {/* ────────────────────────────────────────────────────────────
            STUDENT ROUTES — wrapped in StudentGuard.
        ──────────────────────────────────────────────────────────── */}
        <Route path="/student" element={<StudentGuard><StudentDashboard /></StudentGuard>} />
        <Route path="/student/courses" element={<StudentGuard><StudentCourses /></StudentGuard>} />
        <Route path="/student/schedule" element={<StudentGuard><StudentSchedule /></StudentGuard>} />
        
        <Route path="/student/attendance/mark" element={<StudentGuard><StudentMarkAttendance /></StudentGuard>} />
        <Route path="/student/attendance/history" element={<StudentGuard><StudentAttendanceHistory /></StudentGuard>} />
        <Route path="/student/attendance/analytics" element={<StudentGuard><StudentAnalytics /></StudentGuard>} />
        <Route path="/student/attendance/corrections" element={<StudentGuard><StudentCorrections /></StudentGuard>} />
        
        <Route path="/student/calendar/holidays" element={<StudentGuard><StudentHolidays /></StudentGuard>} />
        <Route path="/student/calendar/academic" element={<StudentGuard><StudentAcademicCalendar /></StudentGuard>} />
        <Route path="/student/calendar/timetable" element={<StudentGuard><StudentTimeTable /></StudentGuard>} />
        
        <Route path="/student/account/profile" element={<StudentGuard><StudentProfile /></StudentGuard>} />
        <Route path="/student/account/security" element={<StudentGuard><StudentSecurity /></StudentGuard>} />
        <Route path="/student/account/settings" element={<StudentGuard><StudentSettings /></StudentGuard>} />

        <Route path="/student/mock-join" element={<StudentMockJoin />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

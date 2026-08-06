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

// Student pages
import StudentDashboard from '@/pages/student/StudentDashboard';
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

        {/* Student routes (no guard yet — add StudentGuard when ready) */}
        <Route path="/student" element={<StudentDashboard />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

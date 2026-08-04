import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import { ToastNotification } from '@/components/ui/toast-notification';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentEnrollmentAdmin from '@/pages/admin/StudentEnrollmentAdmin';
import RegisterPage from '@/pages/RegisterPage';
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

function App() {
  return (
    <Router>
      <ToastNotification />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/teachers" element={<AdminTeachers />} />
        <Route path="/admin/teachers/:id" element={<AdminTeacherProfile />} />
        <Route path="/admin/subjects" element={<AdminSubjects />} />
        <Route path="/admin/college" element={<AdminCollege />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/assignments" element={<AdminAssignments />} />
        <Route path="/admin/authorizations" element={<AdminAuthorizations />} />
        <Route path="/admin/holidays" element={<AdminHolidays />} />
        <Route path="/admin/academic-calendar" element={<AdminAcademicCalendar />} />
        <Route path="/admin/time-table" element={<AdminTimeTable />} />
        <Route path="/admin/attendance-monitor" element={<AdminAttendanceMonitor />} />
        <Route path="/admin/corrections" element={<AdminCorrections />} />
        <Route path="/admin/sheets" element={<AdminSheets />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/security" element={<AdminSecurity />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/student-enrollment" element={<StudentEnrollmentAdmin />} />
        
        {/* Placeholder Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        
        {/* Placeholder Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

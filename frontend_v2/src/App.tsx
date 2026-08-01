import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentEnrollmentAdmin from '@/pages/admin/StudentEnrollmentAdmin';
import EnrollmentFlow from '@/pages/student/EnrollmentFlow';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Placeholder Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/student-enrollment" element={<StudentEnrollmentAdmin />} />
        
        {/* Placeholder Teacher Routes */}
        <Route path="/teacher" element={<TeacherDashboard />} />
        
        {/* Placeholder Student Routes */}
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/enroll/:token" element={<EnrollmentFlow />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

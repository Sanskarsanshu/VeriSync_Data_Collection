const fs = require('fs');
const path = require('path');

const dir = __dirname;
const pages = [
  { name: 'StudentCourses', title: 'Enrolled Courses' },
  { name: 'StudentSchedule', title: 'Class Schedule' },
  { name: 'StudentMarkAttendance', title: 'Mark Attendance' },
  { name: 'StudentAttendanceHistory', title: 'Attendance History' },
  { name: 'StudentAnalytics', title: 'Attendance Analytics' },
  { name: 'StudentCorrections', title: 'Correction Requests' },
  { name: 'StudentHolidays', title: 'Holidays & Breaks' },
  { name: 'StudentAcademicCalendar', title: 'Academic Calendar' },
  { name: 'StudentTimeTable', title: 'Daily Time Table' },
  { name: 'StudentProfile', title: 'My Profile' },
  { name: 'StudentSecurity', title: 'Security' },
  { name: 'StudentSettings', title: 'Settings' }
];

pages.forEach(p => {
  const content = `import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ${p.name}() {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">${p.title}</h1>
          <p className="text-muted-foreground mt-1">This page is under construction.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
`;
  fs.writeFileSync(path.join(dir, p.name + '.tsx'), content);
});
console.log('Pages generated successfully!');

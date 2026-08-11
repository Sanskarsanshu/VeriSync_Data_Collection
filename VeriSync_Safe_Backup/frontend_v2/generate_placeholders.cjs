const fs = require('fs');
const path = require('path');

const files = [
  'TeacherMyCourses.tsx', 
  'TeacherAssignedSubjects.tsx', 
  'TeacherClassSchedule.tsx', 
  'TeacherStartAttendance.tsx', 
  'TeacherLiveAttendance.tsx', 
  'TeacherAttendanceRecords.tsx', 
  'TeacherCorrectionRequests.tsx', 
  'TeacherAttendanceSheets.tsx', 
  'TeacherReportsAnalytics.tsx', 
  'TeacherMyProfile.tsx', 
  'TeacherSecurity.tsx', 
  'TeacherSettings.tsx', 
  'TeacherCreateCourse.tsx'
];

files.forEach(f => { 
  const name = f.replace('.tsx', ''); 
  const content = `import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function ${name}() {
  return (
    <DashboardLayout role="teacher">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">${name.replace('Teacher', '')}</h1>
          <p className="text-muted-foreground mt-1">This page is under construction.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}`;
  fs.writeFileSync(path.join('src/pages/teacher', f), content); 
});
console.log('Done!');

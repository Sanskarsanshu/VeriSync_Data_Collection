import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, UserCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface CourseData {
  id: string;
  code: string;
  name: string;
  credits: number;
  isPractical: boolean;
  teacherName: string;
}

export default function StudentCourses() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mocking the specific Semester III data requested by the user
    const mockCourses: CourseData[] = [
      { id: '1', code: 'CC310', name: 'Advanced Web Designing using J2EE', credits: 4, isPractical: false, teacherName: 'Dr. Praveen Kumar' },
      { id: '2', code: 'CC311', name: 'Cloud Computing', credits: 4, isPractical: false, teacherName: 'Braj Kishor Prasad' },
      { id: '3', code: 'CC312', name: 'Big Data Analytics', credits: 4, isPractical: false, teacherName: 'Dr. Sushmita Chakraborty' },
      { id: '4', code: 'CC313', name: 'Mini Project II (Lab)', credits: 2, isPractical: true, teacherName: 'Dr. Praveen Kumar, Richa Verma, Braj Kishor Prasad, Dr. Sushmita Chakraborty, Bhawna Sinha' },
      { id: '5', code: 'MDC302', name: 'Digital Marketing and E-Commerce', credits: 3, isPractical: false, teacherName: 'Bhawna Sinha, Richa Verma' },
    ];
    
    setCourses(mockCourses);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-student-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse text-muted-foreground">Loading your courses...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 p-6 text-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">Error</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-student-500/10 flex items-center justify-center border border-student-500/20 shadow-inner">
                <BookOpen className="w-5 h-5 text-student-600 dark:text-student-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Enrolled Courses</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Overview of all active subjects for the current semester that you are enrolled in.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
           <div className="p-12 border border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center text-center bg-card/50">
             <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
             <h3 className="text-lg font-bold text-foreground">No Courses Found</h3>
             <p className="text-sm text-muted-foreground mt-2 max-w-sm">You are not currently enrolled in any courses for this semester.</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden hover:shadow-md transition-shadow group">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
                            {course.code}
                          </span>
                          <span className="text-xs font-bold text-muted-foreground">
                            {course.credits} Credits
                          </span>
                          {course.isPractical && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                              Practical
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-student-500 transition-colors">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground font-medium">
                          <UserCircle2 className="w-4 h-4" />
                          {course.teacherName}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

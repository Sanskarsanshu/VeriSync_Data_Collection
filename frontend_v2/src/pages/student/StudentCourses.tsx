import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, UserCircle2, ArrowRight, Book, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const MOCK_COURSES = [
  {
    id: 1,
    name: "Advanced Database Management System",
    code: "MCA102",
    faculty: "Dr. Praveen Kumar",
    credits: 4,
    attended: 42,
    total: 50,
    status: "good"
  },
  {
    id: 2,
    name: "Software Engineering",
    code: "MCA104",
    faculty: "Richa Verma",
    credits: 3,
    attended: 31,
    total: 35,
    status: "good"
  },
  {
    id: 3,
    name: "Design & Analysis of Algorithms",
    code: "MCA106",
    faculty: "Bhawna Sinha",
    credits: 4,
    attended: 28,
    total: 42,
    status: "warning" // < 75%
  },
  {
    id: 4,
    name: "Web Technologies",
    code: "MCA108",
    faculty: "Susmita",
    credits: 3,
    attended: 25,
    total: 30,
    status: "good"
  }
];

export default function StudentCourses() {
  const user = useAppStore(state => state.user);

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Enrolled Courses</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Overview of all active subjects for the current semester and your attendance standing in each.
            </p>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MOCK_COURSES.map((course) => {
            const percentage = Math.round((course.attended / course.total) * 100);
            const isWarning = percentage < 75;
            
            return (
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
                        </div>
                        <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-violet-500 transition-colors">
                          {course.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground font-medium">
                          <UserCircle2 className="w-4 h-4" />
                          {course.faculty}
                        </div>
                      </div>
                      
                      <div className={`shrink-0 p-3 rounded-full ${isWarning ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {isWarning ? <AlertCircle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex items-end justify-between mb-2">
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance</span>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-3xl font-extrabold ${isWarning ? 'text-rose-500' : 'text-foreground'}`}>
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                          {course.attended} / {course.total} classes
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isWarning ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isWarning && (
                        <p className="text-xs font-medium text-rose-500 mt-2">
                          ⚠ Warning: You are below the required 75% attendance threshold.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/30 border-t border-border/50 p-3 flex justify-end">
                    <Button variant="ghost" className="text-violet-600 hover:text-violet-700 hover:bg-violet-500/10 gap-2 h-9">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </DashboardLayout>
  );
}

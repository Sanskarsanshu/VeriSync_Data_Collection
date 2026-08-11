import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Clock, User, Award, Layers, Hash } from 'lucide-react';

const semester3Subjects = [
  {
    id: 'CC310',
    code: 'CC310',
    name: 'Advanced Web Designing using J2EE',
    type: 'Core',
    credits: 4,
    teacher: 'Dr. Praveen Kumar',
    teacherImg: '/features/praveen.png',
    color: 'emerald'
  },
  {
    id: 'CC311',
    code: 'CC311',
    name: 'Cloud Computing',
    type: 'Core',
    credits: 4,
    teacher: 'Braj Kishor Prasad',
    teacherImg: '/features/brajesh.png', // Assuming this matches
    color: 'blue'
  },
  {
    id: 'CC312',
    code: 'CC312',
    name: 'Big Data Analytics',
    type: 'Core',
    credits: 4,
    teacher: 'Dr. Sushmita Chakraborty',
    teacherImg: '/features/susmita.png',
    color: 'student'
  },
  {
    id: 'CC313',
    code: 'CC313',
    name: 'Mini Project II (Lab)',
    type: 'Practical',
    credits: 2,
    teacher: 'Dr. Praveen Kumar, Richa Verma, Braj Kishor Prasad, Dr. Sushmita Chakraborty, Bhawna Sinha',
    teacherImg: '/features/praveen.png', // Main coordinator
    color: 'orange'
  },
  {
    id: 'MDC302',
    code: 'MDC302',
    name: 'Digital Marketing and E-Commerce',
    type: 'Core',
    credits: 3,
    teacher: 'Bhawna Sinha, Richa Verma',
    teacherImg: '/features/Bhawnasinha.png', // Main coordinator
    color: 'rose'
  }
];

export default function StudentClassSchedule() {
  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-2 sm:p-6 font-sans">
        
        {/* Header Section with Aurora Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 pb-10">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-student-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-student-500/10 text-student-500 text-xs font-semibold mb-4 border border-student-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-student-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-student-500"></span>
                </span>
                2nd Year • Semester III
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Enrolled Courses
              </h1>
              <p className="text-muted-foreground max-w-2xl text-lg">
                View all subjects, assigned faculty, and credit details for your current active semester.
              </p>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {semester3Subjects.map((subject, index) => {
            // Dynamically assign shadow and border colors based on the predefined color property
            const colorClasses: Record<string, string> = {
              emerald: 'group-hover:border-emerald-500/30 group-hover:shadow-emerald-500/10',
              blue: 'group-hover:border-blue-500/30 group-hover:shadow-blue-500/10',
              student: 'group-hover:border-student-500/30 group-hover:shadow-student-500/10',
              orange: 'group-hover:border-orange-500/30 group-hover:shadow-orange-500/10',
              rose: 'group-hover:border-rose-500/30 group-hover:shadow-rose-500/10',
              indigo: 'group-hover:border-indigo-500/30 group-hover:shadow-indigo-500/10',
            };
            
            const badgeClasses: Record<string, string> = {
              emerald: 'bg-emerald-500/10 text-emerald-500',
              blue: 'bg-blue-500/10 text-blue-500',
              student: 'bg-student-500/10 text-student-500',
              orange: 'bg-orange-500/10 text-orange-500',
              rose: 'bg-rose-500/10 text-rose-500',
              indigo: 'bg-indigo-500/10 text-indigo-500',
            };

            return (
              <Card key={subject.id} className={`group relative bg-card border-border border transition-all duration-300 hover:shadow-lg rounded-3xl overflow-hidden ${colorClasses[subject.color]}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full bg-${subject.color}-500 transition-opacity group-hover:opacity-40 pointer-events-none`} />
                
                <CardContent className="p-6 relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClasses[subject.color]}`}>
                      {subject.type}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm font-semibold">
                      <Hash size={14} />
                      {subject.code}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-4 leading-snug line-clamp-2">
                    {subject.name}
                  </h3>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border shadow-sm shrink-0">
                          <img 
                            src={subject.teacherImg} 
                            alt={subject.teacher}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(subject.teacher)}&background=random`;
                            }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Faculty</span>
                          <span className="text-sm font-semibold text-foreground truncate">{subject.teacher}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-muted/40 p-3 rounded-2xl">
                      <div className="flex items-center gap-2">
                        <Award size={16} className="text-student-500" />
                        <span className="text-sm font-bold">{subject.credits} Credits</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Layers size={16} />
                        <span className="text-xs font-medium">Sem III</span>
                      </div>
                    </div>
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

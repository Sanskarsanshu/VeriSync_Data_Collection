import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { 
  TrendingUp, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, 
  AlertCircle, BookOpen, UserCircle2, BellRing, Activity
} from 'lucide-react';

export default function StudentDashboard() {
  const user = useAppStore(state => state.user);
  
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 p-8 sm:p-10 text-white shadow-xl shadow-violet-500/20">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Good Morning, {firstName} 👋
            </h1>
            <p className="text-violet-100 max-w-xl text-sm sm:text-base leading-relaxed">
              Here is your academic and attendance overview for today. You have 3 classes scheduled.
            </p>
          </div>
          
          {/* Decorative glass circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-32 -mb-20 w-48 h-48 rounded-full bg-white/10 blur-2xl"></div>
        </div>

        {/* Attendance Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-violet-500/10 rounded-xl">
                  <Activity className="w-5 h-5 text-violet-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">82%</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Overall Attendance</p>
            </CardContent>
          </Card>
          
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">41</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Classes Attended</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-blue-500/10 rounded-xl">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">50</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Total Classes</p>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-rose-500/10 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground">9</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">Classes Missed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Schedule & Notifications */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Today's Schedule */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-fuchsia-500" />
                  <CardTitle className="text-lg">Today's Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  
                  {/* Class Item */}
                  <div className="p-4 sm:p-6 hover:bg-muted/5 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-xs text-center leading-tight">
                          09:00<br/>AM
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base group-hover:text-violet-500 transition-colors">Advanced DBMS</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> Dr. Praveen Kumar</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Room B-204</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20 self-start sm:self-auto">
                      Attended
                    </div>
                  </div>

                  {/* Class Item */}
                  <div className="p-4 sm:p-6 hover:bg-muted/5 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 border border-violet-500/20">
                        <span className="font-bold text-violet-600 dark:text-violet-400 text-xs text-center leading-tight">
                          11:00<br/>AM
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base group-hover:text-violet-500 transition-colors">Software Engineering</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> Richa Verma</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Room B-204</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-violet-500 text-white shadow-sm shadow-violet-500/30 text-xs font-bold self-start sm:self-auto animate-pulse">
                      Ongoing
                    </div>
                  </div>

                  {/* Class Item */}
                  <div className="p-4 sm:p-6 hover:bg-muted/5 transition-colors group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 border border-border/50 text-muted-foreground">
                        <span className="font-bold text-xs text-center leading-tight">
                          02:00<br/>PM
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-base group-hover:text-violet-500 transition-colors">Algorithms (DAA)</h4>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><UserCircle2 className="w-3.5 h-3.5" /> Bhawna</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Lab 3</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border/50 self-start sm:self-auto">
                      Upcoming
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Recent Activity & Alerts */}
          <div className="space-y-8">
            
            {/* Notifications */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <BellRing className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-lg text-amber-700 dark:text-amber-500">Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-rose-600 dark:text-rose-400">Attendance Warning</h5>
                      <p className="text-xs text-muted-foreground mt-1">Your attendance in DAA has dropped below 75%. Please ensure you attend the next class.</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-blue-600 dark:text-blue-400">Correction Approved</h5>
                      <p className="text-xs text-muted-foreground mt-1">Dr. Praveen approved your attendance correction request for Aug 5th.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Attendance */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-violet-500" />
                  Recent History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Advanced DBMS</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Aug 08</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Present</span>
                </div>
                <div className="h-px w-full bg-border/50" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Software Eng.</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Aug 07</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">Present</span>
                </div>
                <div className="h-px w-full bg-border/50" />

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-foreground">Algorithms</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Aug 06</p>
                  </div>
                  <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded-md">Absent</span>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

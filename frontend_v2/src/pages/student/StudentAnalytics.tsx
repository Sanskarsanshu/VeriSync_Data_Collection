import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectorsDonut } from '@/components/ui/sectors-donut';
import { BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';

const ATTENDANCE_SECTORS = [
  { label: "Present", pct: 82.0 },
  { label: "Absent", pct: 15.0 },
  { label: "Late / Excused", pct: 3.0 },
];

const ATTENDANCE_COLORS = ["#10b981", "#f43f5e", "#f59e0b"]; // Emerald, Rose, Amber

export default function StudentAnalytics() {
  return (
    <DashboardLayout role="student">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <BarChart2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Attendance Analytics</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Visual insights and trends of your academic attendance across the current semester.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Donut Chart Card */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-500" />
                <CardTitle className="text-lg">Overall Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
              <SectorsDonut 
                symbol="82%" 
                caption="Total Attendance" 
                sectors={ATTENDANCE_SECTORS} 
                colors={ATTENDANCE_COLORS}
                className="scale-125 transform-gpu"
              />
            </CardContent>
          </Card>

          {/* Risk Factors & Course Breakdown */}
          <div className="space-y-8">
            <Card className="border-rose-500/30 shadow-sm rounded-2xl bg-rose-500/5 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <CardTitle className="text-lg text-rose-600 dark:text-rose-400">Attendance Risk</CardTitle>
                </div>
                <CardDescription className="text-rose-600/80">Subjects below the required 75% threshold</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-card border border-rose-500/20 rounded-xl p-4 flex justify-between items-center mt-2">
                  <div>
                    <h4 className="font-bold text-foreground">Design & Analysis of Algorithms</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">MCA106 • Bhawna Sinha</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-rose-500">68%</span>
                    <p className="text-xs text-rose-500/80 mt-0.5">Required: 75%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <CardTitle className="text-lg">Course-wise Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-foreground">Software Engineering</span>
                    <span className="text-sm font-bold text-emerald-500">91%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '91%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-foreground">Advanced DBMS</span>
                    <span className="text-sm font-bold text-emerald-500">84%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-foreground">Web Technologies</span>
                    <span className="text-sm font-bold text-emerald-500">80%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

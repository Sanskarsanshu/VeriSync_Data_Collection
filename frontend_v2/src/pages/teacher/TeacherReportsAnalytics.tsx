import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SectorsDonut } from '@/components/ui/sectors-donut';
import { 
  TrendingUp, Users, AlertTriangle, FileDown, Calendar, 
  ChevronDown, Filter, Presentation, Laptop, ShieldCheck 
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock Data
const TREND_DATA = [
  { date: 'Mon 13', attendance: 88, average: 85 },
  { date: 'Tue 14', attendance: 92, average: 85 },
  { date: 'Wed 15', attendance: 85, average: 85 },
  { date: 'Thu 16', attendance: 95, average: 85 },
  { date: 'Fri 17', attendance: 89, average: 85 },
  { date: 'Mon 20', attendance: 94, average: 85 },
  { date: 'Tue 21', attendance: 96, average: 85 },
];

const COURSE_DATA = [
  { name: 'MCA004', rate: 92, fill: '#3b82f6' },
  { name: 'EC202', rate: 85, fill: '#10b981' },
  { name: 'CS101', rate: 78, fill: '#f59e0b' },
  { name: 'IT305', rate: 95, fill: '#8b5cf6' },
];

const METHOD_DATA = [
  { name: 'Face Scan', value: 65, color: '#10b981' }, // emerald
  { name: 'Dynamic QR', value: 25, color: '#3b82f6' }, // blue
  { name: 'OTP', value: 7, color: '#f59e0b' },         // amber
  { name: 'Manual', value: 3, color: '#f43f5e' },      // rose
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-xl flex flex-col gap-1">
        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm font-medium">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-foreground">{entry.name}:</span>
            <span className="text-foreground font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TeacherReportsAnalytics() {
  const [timeRange, setTimeRange] = useState('7days');
  const [courseFilter, setCourseFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Reports & Analytics</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Gain deep insights into your classroom attendance patterns. Export detailed logs for administration or monitor biometric performance.
            </p>
          </div>
          
          <div className="flex gap-3 relative z-20">
            <Button 
              variant="outline" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="rounded-xl border-border/50 bg-card hover:bg-muted/50 gap-2 font-medium"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>

            <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all font-semibold gap-2">
              <FileDown className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>

            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-xl p-4 min-w-[280px] animate-in fade-in slide-in-from-top-2 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Course</label>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger className="w-full bg-background rounded-lg border-border/50">
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      <SelectItem value="MCA004">MCA004</SelectItem>
                      <SelectItem value="EC202">EC202</SelectItem>
                      <SelectItem value="CS101">CS101</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Time Range</label>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full bg-background rounded-lg border-border/50">
                      <SelectValue placeholder="Last 7 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="semester">This Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { title: 'Average Attendance', value: '89.4%', trend: '+2.1%', up: true, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Total Classes Held', value: '42', trend: 'This term', up: true, icon: Presentation, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { title: 'Biometric Success Rate', value: '96.8%', trend: '+0.5%', up: true, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { title: 'Low Attendance Alerts', value: '14', trend: '-3', up: true, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="border border-border shadow-sm rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${metric.up ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                      {metric.trend}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">{metric.title}</p>
                    <h3 className="text-3xl font-black text-foreground tracking-tight">{metric.value}</h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Trend Line */}
          <Card className="lg:col-span-2 border border-border shadow-sm rounded-2xl bg-card flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold text-foreground">Attendance Trends</CardTitle>
              <p className="text-sm text-muted-foreground">Overall attendance percentage across all courses.</p>
            </CardHeader>
            <CardContent className="p-6 flex-grow min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                    domain={[0, 100]}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }} />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    name="Attendance"
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAttendance)" 
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="average" 
                    name="Target Avg"
                    stroke="#10b981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Verification Methods Donut */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold text-foreground">Verification Methods</CardTitle>
              <p className="text-sm text-muted-foreground">Distribution of how students mark presence.</p>
            </CardHeader>
            <CardContent className="p-6 flex-grow min-h-[300px] flex items-center justify-center">
              <SectorsDonut 
                symbol="Methods"
                caption="active sessions"
                sectors={METHOD_DATA.map(m => ({ label: m.name, pct: m.value }))}
                colors={METHOD_DATA.map(m => m.color)}
              />
            </CardContent>
          </Card>

        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border border-border shadow-sm rounded-2xl bg-card flex flex-col">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg font-bold text-foreground">Course Performance Comparison</CardTitle>
              <p className="text-sm text-muted-foreground">Average attendance rate broken down by course code.</p>
            </CardHeader>
            <CardContent className="p-6 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COURSE_DATA} margin={{ top: 20, right: 0, left: -20, bottom: 0 }} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/20" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'currentColor' }} 
                    className="text-muted-foreground"
                    domain={[0, 100]}
                  />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} />
                  <Bar dataKey="rate" name="Avg Rate" radius={[6, 6, 0, 0]}>
                    {COURSE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
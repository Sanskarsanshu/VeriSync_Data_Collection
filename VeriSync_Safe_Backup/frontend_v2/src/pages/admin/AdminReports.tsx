import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  PieChart, Download, Calendar, Users, Target, Filter, TrendingUp, TrendingDown,
  BarChart3, FileText, AlertTriangle, CheckCircle2, Clock, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDataStore } from '@/store/useDataStore';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RePieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

// --- Mock attendance data for reports ---
const studentAttendanceData = [
  { name: 'Ananya Kumari', rollNo: 'MCA2026001', sem: 1, attended: 68, total: 90, pct: 75.6 },
  { name: 'Priya Sharma', rollNo: 'MCA2026002', sem: 1, attended: 55, total: 90, pct: 61.1 },
  { name: 'Ritu Singh', rollNo: 'MCA2026003', sem: 1, attended: 82, total: 90, pct: 91.1 },
  { name: 'Sneha Das', rollNo: 'MCA2026004', sem: 1, attended: 60, total: 90, pct: 66.7 },
  { name: 'Kajal Verma', rollNo: 'MCA2026005', sem: 1, attended: 78, total: 90, pct: 86.7 },
  { name: 'Pooja Gupta', rollNo: 'MCA2026006', sem: 1, attended: 50, total: 90, pct: 55.6 },
  { name: 'Neha Rani', rollNo: 'MCA2026007', sem: 1, attended: 85, total: 90, pct: 94.4 },
  { name: 'Suman Devi', rollNo: 'MCA2026008', sem: 1, attended: 72, total: 90, pct: 80.0 },
  { name: 'Deepika Roy', rollNo: 'MCA2026009', sem: 1, attended: 62, total: 90, pct: 68.9 },
  { name: 'Ankita Jha', rollNo: 'MCA2026010', sem: 1, attended: 88, total: 90, pct: 97.8 },
  { name: 'Shweta Prasad', rollNo: 'MCA2026011', sem: 3, attended: 70, total: 85, pct: 82.4 },
  { name: 'Pallavi Mishra', rollNo: 'MCA2026012', sem: 3, attended: 48, total: 85, pct: 56.5 },
  { name: 'Roshni Kumar', rollNo: 'MCA2026013', sem: 3, attended: 80, total: 85, pct: 94.1 },
  { name: 'Manju Kumari', rollNo: 'MCA2026014', sem: 3, attended: 60, total: 85, pct: 70.6 },
  { name: 'Kavita Singh', rollNo: 'MCA2026015', sem: 3, attended: 75, total: 85, pct: 88.2 },
];

const monthlyTrend = [
  { month: 'Jul', avgAttendance: 88, classes: 22 },
  { month: 'Aug', avgAttendance: 82, classes: 24 },
  { month: 'Sep', avgAttendance: 79, classes: 20 },
  { month: 'Oct', avgAttendance: 74, classes: 18 },
  { month: 'Nov', avgAttendance: 85, classes: 21 },
  { month: 'Dec', avgAttendance: 90, classes: 15 },
];

const biometricData = [
  { name: 'Verified', value: 1842, color: '#10b981' },
  { name: 'Spoofing Blocked', value: 23, color: '#ef4444' },
  { name: 'Retry Required', value: 67, color: '#f59e0b' },
  { name: 'Manual Override', value: 12, color: '#6366f1' },
];

const teacherComplianceData = [
  { teacher: 'Richa Verma', scheduled: 48, conducted: 45, pct: 93.8 },
  { teacher: 'Dr. Praveen Kumar', scheduled: 52, conducted: 50, pct: 96.2 },
  { teacher: 'Dr. Sushmita C.', scheduled: 46, conducted: 42, pct: 91.3 },
  { teacher: 'Braj Kishor Prasad', scheduled: 44, conducted: 44, pct: 100 },
  { teacher: 'Dr. Bhawna Sinha', scheduled: 50, conducted: 48, pct: 96.0 },
];

type ReportTab = 'overview' | 'defaulters' | 'biometric' | 'compliance';

export default function AdminReports() {
  const { subjects, teachers } = useDataStore();
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [semFilter, setSemFilter] = useState<string>('all');

  const defaulters = useMemo(() =>
    studentAttendanceData.filter(s => s.pct < 75 && (semFilter === 'all' || s.sem.toString() === semFilter)),
    [semFilter]
  );

  const filteredStudents = useMemo(() =>
    studentAttendanceData.filter(s => semFilter === 'all' || s.sem.toString() === semFilter),
    [semFilter]
  );

  const avgAttendance = useMemo(() => {
    const data = filteredStudents;
    if (data.length === 0) return 0;
    return +(data.reduce((sum, s) => sum + s.pct, 0) / data.length).toFixed(1);
  }, [filteredStudents]);

  const tabs: { id: ReportTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'defaulters', label: 'Defaulter Report', icon: <Target size={16} /> },
    { id: 'biometric', label: 'Biometric Audit', icon: <PieChart size={16} /> },
    { id: 'compliance', label: 'Faculty Compliance', icon: <Users size={16} /> },
  ];

  const handleDownload = (reportName: string) => {
    const blob = new Blob([`VeriSync Report: ${reportName}\nGenerated: ${new Date().toLocaleString()}\n\nThis is a mock report file.`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-xs font-semibold mb-3 border border-indigo-500/20">
              <PieChart size={14} /> Insights
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Generate comprehensive institutional reports and view deep analytics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border rounded-lg px-3 py-1 shadow-sm">
              <Filter size={16} className="text-muted-foreground" />
              <select value={semFilter} onChange={e => setSemFilter(e.target.value)} className="bg-transparent border-0 text-sm font-medium focus:outline-none">
                <option value="all">All Semesters</option>
                <option value="1">Semester 1</option>
                <option value="3">Semester 3</option>
              </select>
            </div>
            <Button onClick={() => handleDownload(activeTab === 'overview' ? 'Full_Analytics' : tabs.find(t=>t.id===activeTab)?.label || 'Report')} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 gap-2">
              <Download size={16} /> Export
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Average Attendance" value={`${avgAttendance}%`} icon={<TrendingUp size={20} />} color="emerald" trend="+2.3%" />
              <StatCard label="Total Students" value={filteredStudents.length.toString()} icon={<Users size={20} />} color="blue" />
              <StatCard label="Defaulters (<75%)" value={defaulters.length.toString()} icon={<AlertTriangle size={20} />} color="rose" trend={defaulters.length > 3 ? "High" : "Low"} trendDown={defaulters.length > 3} />
              <StatCard label="Biometric Success" value="94.7%" icon={<CheckCircle2 size={20} />} color="violet" trend="+1.1%" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-foreground mb-4">Monthly Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="avgAttendance" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} name="Avg Attendance %" />
                    <Line type="monotone" dataKey="classes" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981', r: 4 }} name="Classes Held" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Biometric Pie */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-foreground mb-4">Biometric Verification Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RePieChart>
                    <Pie data={biometricData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {biometricData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Faculty Bar Chart */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-foreground mb-4">Faculty Class Compliance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teacherComplianceData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="teacher" stroke="#888" fontSize={11} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                  <Bar dataKey="scheduled" fill="#6366f1" radius={[6, 6, 0, 0]} name="Scheduled" />
                  <Bar dataKey="conducted" fill="#10b981" radius={[6, 6, 0, 0]} name="Conducted" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* DEFAULTER TAB */}
        {activeTab === 'defaulters' && (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Defaulter Watchlist</h3>
                <p className="text-sm text-muted-foreground mt-1">Students below the mandatory 75% attendance threshold.</p>
              </div>
              <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-lg px-4 py-1">{defaulters.length} students</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Roll No</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Semester</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Attended</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Total</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Attendance %</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {defaulters.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">No defaulters found for the selected semester.</td></tr>
                  ) : defaulters.map((s, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{s.name}</td>
                      <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{s.rollNo}</td>
                      <td className="px-6 py-4 text-center"><Badge variant="outline">Sem {s.sem}</Badge></td>
                      <td className="px-6 py-4 text-center text-foreground">{s.attended}</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">{s.total}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`font-bold ${s.pct < 65 ? 'text-red-500' : 'text-amber-500'}`}>{s.pct}%</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge className={s.pct < 65 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} variant="outline">
                          {s.pct < 65 ? 'Critical' : 'Warning'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BIOMETRIC TAB */}
        {activeTab === 'biometric' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {biometricData.map((item, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{item.value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{((item.value / biometricData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)}% of total</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-foreground mb-4">Verification Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RePieChart>
                  <Pie data={biometricData} cx="50%" cy="50%" innerRadius={70} outerRadius={130} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {biometricData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* COMPLIANCE TAB */}
        {activeTab === 'compliance' && (
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-lg text-foreground">Teacher Class Compliance</h3>
              <p className="text-sm text-muted-foreground mt-1">Scheduled vs conducted classes for each faculty member.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Faculty</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Scheduled</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Conducted</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Missed</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Compliance %</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {teacherComplianceData.map((t, i) => (
                    <tr key={i} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{t.teacher}</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">{t.scheduled}</td>
                      <td className="px-6 py-4 text-center text-foreground font-semibold">{t.conducted}</td>
                      <td className="px-6 py-4 text-center text-amber-500">{t.scheduled - t.conducted}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${t.pct}%` }} />
                          </div>
                          <span className="font-bold text-emerald-500">{t.pct}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className={t.pct >= 95 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}>
                          {t.pct >= 95 ? 'Excellent' : 'Good'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon, color, trend, trendDown }: { label: string; value: string; icon: React.ReactNode; color: string; trend?: string; trendDown?: boolean }) {
  const colorMap: Record<string, { iconBg: string; iconText: string }> = {
    emerald: { iconBg: 'bg-emerald-500/10', iconText: 'text-emerald-500' },
    blue: { iconBg: 'bg-blue-500/10', iconText: 'text-blue-500' },
    rose: { iconBg: 'bg-rose-500/10', iconText: 'text-rose-500' },
    violet: { iconBg: 'bg-violet-500/10', iconText: 'text-violet-500' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.iconBg} ${c.iconText}`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendDown ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

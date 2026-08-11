import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { 
  Users, Activity, ShieldAlert, MonitorPlay, 
  TrendingUp, ArrowRight, BookOpen, AlertCircle,
  FileEdit
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { AttendanceTrendFan } from '@/components/ui/attendance-trend-fan';

const attendanceDataThisWeek = [
  { name: 'Mon', attendance: 88, proxies: 12 },
  { name: 'Tue', attendance: 92, proxies: 8 },
  { name: 'Wed', attendance: 95, proxies: 5 },
  { name: 'Thu', attendance: 89, proxies: 15 },
  { name: 'Fri', attendance: 94, proxies: 6 },
  { name: 'Sat', attendance: 96, proxies: 3 },
];

const attendanceDataLastWeek = [
  { name: 'Mon', attendance: 85, proxies: 15 },
  { name: 'Tue', attendance: 88, proxies: 12 },
  { name: 'Wed', attendance: 90, proxies: 10 },
  { name: 'Thu', attendance: 86, proxies: 18 },
  { name: 'Fri', attendance: 91, proxies: 9 },
  { name: 'Sat', attendance: 93, proxies: 5 },
];

const attendanceDataThisMonth = [
  { name: 'Week 1', attendance: 89, proxies: 11 },
  { name: 'Week 2', attendance: 91, proxies: 9 },
  { name: 'Week 3', attendance: 94, proxies: 6 },
  { name: 'Week 4', attendance: 92, proxies: 8 },
];

const verificationData = [
  { name: 'Biometric Success', value: 75, color: '#10B981' }, // Emerald
  { name: 'OTP Fallback', value: 15, color: '#F59E0B' }, // Amber
  { name: 'Manual Override', value: 7, color: '#6366F1' }, // Indigo
  { name: 'Proxy Denied', value: 3, color: '#EF4444' }, // Red
];

// Recharts Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('This Week');

  const getAttendanceData = () => {
    switch (timeRange) {
      case 'Last Week': return attendanceDataLastWeek;
      case 'This Month': return attendanceDataThisMonth;
      case 'This Week':
      default: return attendanceDataThisWeek;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section with Aurora Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 pb-10">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-4 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Operational
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
                Executive Overview
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Real-time insights into institutional attendance, verification health, and academic operations.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link to="/admin/reports" className="px-4 py-2 rounded-xl bg-card border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors flex items-center gap-2">
                <BookOpen size={16} />
                Generate Report
              </Link>
              <Link to="/admin/attendance-monitor" className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                <MonitorPlay size={16} />
                Live Monitor
              </Link>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value="1,248" 
            trend="+12 this month" 
            icon={<Users size={24} className="text-blue-500" />}
            colorClass="bg-blue-500/10 border-blue-500/20"
          />
          <StatCard 
            title="Today's Attendance" 
            value="92.4%" 
            trend="↑ 2.1% from yesterday" 
            icon={<Activity size={24} className="text-emerald-500" />}
            colorClass="bg-emerald-500/10 border-emerald-500/20"
            trendUp
          />
          <StatCard 
            title="Active Classes" 
            value="42" 
            trend="14 concluding soon" 
            icon={<MonitorPlay size={24} className="text-indigo-500" />}
            colorClass="bg-indigo-500/10 border-indigo-500/20"
          />
          <StatCard 
            title="Proxy Attempts" 
            value="24" 
            trend="↓ 12% from last week" 
            icon={<ShieldAlert size={24} className="text-amber-500" />}
            colorClass="bg-amber-500/10 border-amber-500/20"
            trendUp={true} // Decreasing bad things is a good trend
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Attendance Trends</h2>
                <p className="text-sm text-muted-foreground">Weekly aggregate vs Proxy flags</p>
              </div>
            </div>
            
            <div className="w-full flex-1 flex items-center justify-center pb-2">
              <AttendanceTrendFan />
            </div>
          </div>

          {/* Verification Methods Donut Chart */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Verification Health</h2>
              <p className="text-sm text-muted-foreground">Methods used today</p>
            </div>
            
            <div className="h-[240px] w-full mt-4 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={verificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {verificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-foreground">98%</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Verified</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border/50">
              {verificationData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium truncate" title={item.name}>{item.name}</span>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Recent Alerts / Quick Actions */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Recent Alerts</h2>
            <Link to="/admin/corrections" className="text-sm text-emerald-500 font-medium hover:text-emerald-400 flex items-center gap-1 transition-colors">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="space-y-4">
            <AlertRow 
              title="Suspicious Activity Detected" 
              desc="Multiple manual overrides requested in MCA Semester I within 5 minutes." 
              time="10 min ago" 
              type="warning" 
            />
            <AlertRow 
              title="Attendance Shortage" 
              desc="45 students have fallen below the 75% threshold this week." 
              time="2 hours ago" 
              type="info" 
            />
            <AlertRow 
              title="Correction Request Pending" 
              desc="Dr. Sharma recommended attendance correction for 3 students." 
              time="5 hours ago" 
              type="action" 
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// ------------------------- Components -------------------------

function StatCard({ title, value, trend, icon, colorClass, trendUp }: any) {
  return (
    <div className="bg-card border border-border rounded-3xl p-5 shadow-sm group hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClass} transition-transform group-hover:scale-110 duration-500`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-muted-foreground font-medium text-sm mb-1">{title}</h3>
        <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      </div>
    </div>
  );
}

function AlertRow({ title, desc, time, type }: any) {
  const isWarning = type === 'warning';
  const isAction = type === 'action';
  
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 hover:bg-background transition-colors border border-transparent hover:border-border/50 cursor-pointer">
      <div className={`mt-0.5 p-2 rounded-full shrink-0 ${isWarning ? 'bg-amber-500/10 text-amber-500' : isAction ? 'bg-indigo-500/10 text-indigo-500' : 'bg-blue-500/10 text-blue-500'}`}>
        {isWarning ? <AlertCircle size={18} /> : isAction ? <FileEdit size={18} /> : <Activity size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-0.5 truncate">{desc}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap ml-4 font-medium">{time}</span>
    </div>
  );
}

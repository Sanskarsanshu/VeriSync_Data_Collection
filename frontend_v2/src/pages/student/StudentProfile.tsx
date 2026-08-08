import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { User, Mail, GraduationCap, Building, Key, Fingerprint, MapPin, Calendar, Clock, Edit2 } from 'lucide-react';

export default function StudentProfile() {
  const user = useAppStore(state => state.user);

  // Fallbacks if backend doesn't provide them yet
  const name = user?.name || "Student Name";
  const email = user?.email || "student@college.edu";
  const rollNumber = user?.rollNumber || "Not Assigned";
  
  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My Profile</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              View and manage your academic profile. Sensitive information is managed by the administration.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Identity Card (Left Col) */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
              <CardContent className="px-6 pb-6 pt-0 flex flex-col items-center text-center relative">
                
                <div className="w-24 h-24 rounded-full bg-card border-4 border-card -mt-12 overflow-hidden flex items-center justify-center shadow-lg relative group">
                   <div className="w-full h-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-500 text-3xl font-bold">
                     {name.charAt(0)}
                   </div>
                   <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                     <Edit2 className="w-5 h-5 text-white" />
                   </div>
                </div>

                <h2 className="text-xl font-bold text-foreground mt-4">{name}</h2>
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mt-1">
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-sm font-semibold">{rollNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground mt-2 text-sm">
                  <Mail className="w-4 h-4" />
                  {email}
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Academic Information (Right Col) */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-fuchsia-500" />
                  <CardTitle className="text-lg">Academic Details</CardTitle>
                </div>
                <CardDescription>Your current institutional enrollment status.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> Department
                    </label>
                    <p className="text-sm font-medium text-foreground">Computer Applications</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Program
                    </label>
                    <p className="text-sm font-medium text-foreground">Master of Computer Applications (MCA)</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Semester
                    </label>
                    <p className="text-sm font-medium text-foreground">Semester 1</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Enrollment Year
                    </label>
                    <p className="text-sm font-medium text-foreground">2026</p>
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

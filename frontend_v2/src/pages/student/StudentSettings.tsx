import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Bell, Moon, Sun, Monitor, Save, MessageSquare, Mail, Smartphone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';

export default function StudentSettings() {
  const { toggleTheme } = useAppStore();
  
  // Local state for UI theme binding (mirroring the teacher portal fix)
  const [localTheme, setLocalTheme] = useState<'light' | 'dark' | 'system'>('system');
  
  // Load initial theme from localStorage safely
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      setLocalTheme(saved);
    }
  }, []);

  const handleThemeChange = (val: 'light' | 'dark' | 'system') => {
    setLocalTheme(val);
    if (val === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.removeItem('theme');
    } else {
      if (val === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', val);
    }
    // Also trigger the Zustand store sync if necessary
    if (val !== 'system') {
      useAppStore.setState({ theme: val });
    }
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <Settings2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">App Settings</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Customize your portal experience, appearance, and notification preferences.
            </p>
          </div>
          <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all gap-2">
            <Save className="w-4 h-4" /> Save Preferences
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Appearance Settings */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-violet-500" />
                <CardTitle className="text-lg">Appearance</CardTitle>
              </div>
              <CardDescription>Customize the look and feel of the VeriSync platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-3">
                <Label className="text-sm font-semibold">Theme Mode</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => handleThemeChange('light')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${localTheme === 'light' ? 'border-violet-500 bg-violet-500/5' : 'border-border bg-card hover:border-violet-500/30'}`}
                  >
                    <Sun className={`w-6 h-6 ${localTheme === 'light' ? 'text-violet-500' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-bold ${localTheme === 'light' ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'}`}>Light</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('dark')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${localTheme === 'dark' ? 'border-violet-500 bg-violet-500/5' : 'border-border bg-card hover:border-violet-500/30'}`}
                  >
                    <Moon className={`w-6 h-6 ${localTheme === 'dark' ? 'text-violet-500' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-bold ${localTheme === 'dark' ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'}`}>Dark</span>
                  </button>
                  <button 
                    onClick={() => handleThemeChange('system')}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${localTheme === 'system' ? 'border-violet-500 bg-violet-500/5' : 'border-border bg-card hover:border-violet-500/30'}`}
                  >
                    <Monitor className={`w-6 h-6 ${localTheme === 'system' ? 'text-violet-500' : 'text-muted-foreground'}`} />
                    <span className={`text-xs font-bold ${localTheme === 'system' ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'}`}>System</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold">Default Landing Page</Label>
                <Select defaultValue="dashboard">
                  <SelectTrigger className="rounded-xl border-border/50">
                    <SelectValue placeholder="Select landing page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Overview (Dashboard)</SelectItem>
                    <SelectItem value="mark-attendance">Mark Attendance</SelectItem>
                    <SelectItem value="courses">Enrolled Courses</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">The page you see immediately after logging in.</p>
              </div>

            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-fuchsia-500" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </div>
              <CardDescription>Control how and when you are alerted about academic updates.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg shrink-0">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold block mb-1">Email Alerts</Label>
                      <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">Receive daily attendance summaries and critical warnings via email.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold block mb-1">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">Live alerts in your browser when an attendance session starts.</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-6 flex items-center justify-between opacity-60">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold block mb-1">SMS Alerts</Label>
                      <p className="text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">Get text messages for highly critical administration alerts.</p>
                    </div>
                  </div>
                  <Switch disabled />
                </div>

              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

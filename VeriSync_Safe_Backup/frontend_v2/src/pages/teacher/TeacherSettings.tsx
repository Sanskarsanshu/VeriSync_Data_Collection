import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings2, Bell, Moon, Sun, Monitor, Globe, Clock, 
  Smartphone, Mail, MessageSquare, MonitorPlay, Save
} from 'lucide-react';

export default function TeacherSettings() {
  // Theme state mock
  const [theme, setTheme] = useState('system');
  
  // Notification states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  
  // Preferences
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('ist');

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">App Settings</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Customize your experience. Adjust your notification preferences, theme, and language.
            </p>
          </div>
          
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 transition-all font-semibold gap-2">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Save Changes</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left Col) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Appearance */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <MonitorPlay className="w-5 h-5 text-fuchsia-500" />
                  <CardTitle className="text-lg">Appearance</CardTitle>
                </div>
                <CardDescription>Select your preferred color theme for the portal.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Light Theme */}
                  <div 
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${
                      theme === 'light' ? 'border-fuchsia-500 bg-fuchsia-500/5' : 'border-border/50 hover:border-border bg-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Sun className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Light Mode</span>
                  </div>

                  {/* Dark Theme */}
                  <div 
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${
                      theme === 'dark' ? 'border-fuchsia-500 bg-fuchsia-500/5' : 'border-border/50 hover:border-border bg-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                      <Moon className="w-5 h-5 text-slate-300" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">Dark Mode</span>
                  </div>

                  {/* System Theme */}
                  <div 
                    onClick={() => setTheme('system')}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${
                      theme === 'system' ? 'border-fuchsia-500 bg-fuchsia-500/5' : 'border-border/50 hover:border-border bg-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-sm font-semibold text-foreground">System Match</span>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-rose-500" />
                  <CardTitle className="text-lg">Notifications</CardTitle>
                </div>
                <CardDescription>Choose how you want to be alerted about classroom events.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl mt-0.5">
                    <Mail className="w-5 h-5 text-rose-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Email Summaries</h4>
                      <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} className="data-[state=checked]:bg-rose-500" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      Receive a daily email summary detailing which students were marked absent or late across all your assigned courses.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl mt-0.5">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Push Notifications</h4>
                      <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} className="data-[state=checked]:bg-blue-500" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      Get browser push notifications when a student submits a new Correction Request or when an Admin approves a dispute.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl mt-0.5">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">SMS Alerts</h4>
                      <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} className="data-[state=checked]:bg-emerald-500" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      Receive critical alerts directly on your registered mobile number. (Standard messaging rates may apply).
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* Sidebar Area (Right Col) */}
          <div className="space-y-8">
            
            {/* System Preferences */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  System Preferences
                </CardTitle>
                <CardDescription className="text-xs">Language and localization settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Display Language
                  </label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full bg-background rounded-xl border-border/50 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="es">Español (ES)</SelectItem>
                      <SelectItem value="hi">Hindi (IN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Timezone
                  </label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="w-full bg-background rounded-xl border-border/50 focus:ring-cyan-500">
                      <SelectValue placeholder="Select Timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                      <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                      <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[10px] text-muted-foreground mt-1">This affects the timestamps on your attendance sheets.</p>
                </div>

              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
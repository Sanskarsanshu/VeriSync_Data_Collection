import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, KeyRound, Smartphone, Laptop, Globe, 
  History, ScanFace, QrCode, AlertCircle, Fingerprint, Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TeacherSecurity() {
  const [livenessStrict, setLivenessStrict] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [notifyLogin, setNotifyLogin] = useState(true);

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Security Settings</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage your password, active sessions, and strictness levels for classroom biometric verifications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left Col) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Account Protection */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-500" />
                  <CardTitle className="text-lg">Account Protection</CardTitle>
                </div>
                <CardDescription>Update your password and multi-factor authentication.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" className="rounded-xl border-border/50 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" className="rounded-xl border-border/50 focus:border-blue-500" />
                  </div>
                  <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium mt-2">
                    Update Password
                  </Button>
                </div>

                <div className="h-px w-full bg-border/50 my-6" />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-sm text-muted-foreground">Require an OTP sent to your phone on login.</p>
                  </div>
                  <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                </div>
              </CardContent>
            </Card>

            {/* Classroom Security Policies */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-500" />
                  <CardTitle className="text-lg">Classroom Security</CardTitle>
                </div>
                <CardDescription>Configure how strictly student attendance is verified in your classes.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl mt-0.5">
                    <ScanFace className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Strict Liveness Detection</h4>
                      <Switch checked={livenessStrict} onCheckedChange={setLivenessStrict} className="data-[state=checked]:bg-amber-500" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      When enabled, students must perform a random challenge (like smiling or turning their head) during face scans to prevent spoofing with photos.
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl mt-0.5">
                    <QrCode className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Dynamic QR Rotation Speed</h4>
                      <Badge variant="outline" className="text-blue-500 border-blue-500/20 bg-blue-500/5">30 Seconds</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pr-8">
                      QR codes displayed on your projector will automatically refresh every 30 seconds to prevent students from sharing pictures of the code. (Managed by Admin).
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>

          </div>

          {/* Sidebar Area (Right Col) */}
          <div className="space-y-8">
            
            {/* Active Sessions */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  Active Sessions
                </CardTitle>
                <CardDescription className="text-xs">Devices currently logged into your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="flex items-start gap-3 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
                  <Laptop className="w-8 h-8 text-emerald-600 p-1.5 bg-emerald-500/20 rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground leading-none">Windows PC</p>
                      <Badge className="bg-emerald-500 text-[9px] uppercase px-1.5 py-0">Current</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Chrome • New Delhi, India</p>
                    <p className="text-[10px] font-medium text-emerald-600">Active right now</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-border bg-muted/30">
                  <Smartphone className="w-8 h-8 text-muted-foreground p-1.5 bg-muted rounded-lg shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-semibold text-foreground leading-none">iPhone 14 Pro</p>
                    <p className="text-xs text-muted-foreground">Safari • Delhi, India</p>
                    <p className="text-[10px] text-muted-foreground">Last active: 2 hours ago</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full rounded-xl text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 border-rose-500/20">
                  Revoke All Other Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Audit & Logs */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="w-4 h-4 text-purple-500" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0.5 mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-foreground">Login Notifications</h4>
                    <Switch checked={notifyLogin} onCheckedChange={setNotifyLogin} className="data-[state=checked]:bg-purple-500" />
                  </div>
                  <p className="text-xs text-muted-foreground">Get an email for new unrecognized logins.</p>
                </div>
                
                <div className="flex items-start gap-3 pt-4 border-t border-border/50">
                  <div className="p-1.5 bg-rose-500/10 rounded-md shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Failed Login Attempt</p>
                    <p className="text-[10px] text-muted-foreground">Someone tried to login with incorrect password from IP 192.168.1.5</p>
                    <p className="text-[9px] text-muted-foreground mt-1">Yesterday, 14:32 PM</p>
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
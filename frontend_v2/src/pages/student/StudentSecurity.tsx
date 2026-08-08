import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, KeyRound, Smartphone, Laptop, Globe, History, Lock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StudentSecurity() {
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                <ShieldCheck className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Security</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Manage your account password, active sessions, and multi-factor authentication.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Security Options */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Password Management */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-violet-500" />
                  <CardTitle className="text-lg">Change Password</CardTitle>
                </div>
                <CardDescription>Ensure your account is using a long, random password to stay secure.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={password.current}
                    onChange={(e) => setPassword({...password, current: e.target.value})}
                    className="rounded-xl border-border/50 focus-visible:ring-violet-500" 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={password.new}
                      onChange={(e) => setPassword({...password, new: e.target.value})}
                      className="rounded-xl border-border/50 focus-visible:ring-violet-500" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={password.confirm}
                      onChange={(e) => setPassword({...password, confirm: e.target.value})}
                      className="rounded-xl border-border/50 focus-visible:ring-violet-500" 
                    />
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <Button className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-violet-500" />
                    <CardTitle className="text-lg">Active Sessions</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-rose-500 border-rose-500/20 hover:bg-rose-500/10">
                    Revoke All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg shrink-0">
                      <Laptop className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground">Windows • Chrome</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Globe className="w-3.5 h-3.5" /> 192.168.1.45
                      </div>
                    </div>
                    <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10 rounded-full font-bold">
                      Current Session
                    </Badge>
                  </div>
                  
                  <div className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg shrink-0">
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-foreground">iPhone 14 Pro • Safari</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Globe className="w-3.5 h-3.5" /> 117.202.45.12
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Last active: 2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600">
                      Revoke
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Additional Settings (Right Col) */}
          <div className="space-y-8">
            <Card className="border border-border shadow-sm rounded-2xl bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-fuchsia-500" />
                  <CardTitle className="text-lg">Two-Factor Auth</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add an extra layer of security to your account by requiring a verification code upon login.
                </p>
                <div className="p-4 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-bold text-sm text-foreground">Authenticator App</h5>
                    <p className="text-xs text-muted-foreground">Not configured</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-lg">Setup</Button>
                </div>
                
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex gap-2 items-start mt-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs font-medium text-amber-600 dark:text-amber-500">
                    We highly recommend enabling 2FA to protect your academic records.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

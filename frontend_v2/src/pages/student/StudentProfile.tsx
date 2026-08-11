import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, Droplet, Users, BookOpen, GraduationCap, Building2, Hash, Loader2, AlertCircle, Pencil, Camera } from 'lucide-react';
import { RobotHero } from '@/components/ui/robot-hero';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileData {
  name: string;
  rollNumber: string;
  email: string;
  mobileNumber: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  photoUrl: string | null;
  admissionYear: number;
  expectedGraduationYear: number;
  batch: string;
  semester: string;
  section: string;
}

export default function StudentProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpdate = async () => {
    if (!newPhotoUrl.trim()) return;
    setUploading(true);
    try {
      const token = sessionStorage.getItem('verisync_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/students/me/profile/photo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ photoUrl: newPhotoUrl.trim() })
      });
      if (!response.ok) throw new Error('Failed to update photo');
      const data = await response.json();
      setProfile(prev => prev ? { ...prev, photoUrl: data.photoUrl } : null);
      setIsEditingPhoto(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update photo');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('verisync_token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/students/me/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const json = await response.json();
        setProfile(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching your profile.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-student-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse text-muted-foreground">Loading your identity profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profile) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 p-6 text-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">Error</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      {/* 3D Hero Banner */}
      <div className="w-full px-2 sm:px-6 pt-4">
        <RobotHero 
          backgroundText={profile.name.split(' ')[0].toUpperCase()}
          ctaText="Contact Admin"
          contactText="Settings"
          contactHref="/student/settings"
        />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6 mt-8">
        
        {/* Profile Header Card */}
        <Card className="border border-border shadow-sm rounded-3xl bg-card overflow-hidden relative">
          <div className="h-32 bg-gradient-to-r from-student-600/20 via-student-600/20 to-student-600/20 absolute top-0 left-0 right-0" />
          <CardContent className="p-8 pt-16 relative flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-4 border-background bg-muted shadow-xl overflow-hidden relative">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&q=80" 
                    alt="Default Avatar" 
                    className="w-full h-full object-cover" 
                  />
                )}
                
                <Dialog open={isEditingPhoto} onOpenChange={setIsEditingPhoto}>
                  <DialogTrigger asChild>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Profile Picture</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Upload Image File</Label>
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileUpload} 
                          className="file:text-student-600 file:bg-student-50 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-semibold hover:file:bg-student-100"
                        />
                      </div>
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-muted"></div>
                        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase font-semibold">Or</span>
                        <div className="flex-grow border-t border-muted"></div>
                      </div>
                      <div className="space-y-2">
                        <Label>Paste Image URL</Label>
                        <Input 
                          placeholder="https://example.com/my-photo.jpg" 
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                        />
                      </div>
                      {newPhotoUrl && (
                        <div className="pt-2 flex justify-center">
                          <img src={newPhotoUrl} alt="Preview" className="w-24 h-24 rounded-xl object-cover border-2 border-muted shadow-sm" />
                        </div>
                      )}
                      <Button 
                        className="w-full bg-student-600 hover:bg-student-700" 
                        onClick={handlePhotoUpdate}
                        disabled={uploading || !newPhotoUrl.trim()}
                      >
                        {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Pencil className="w-4 h-4 mr-2" />}
                        {uploading ? 'Updating...' : 'Save Picture'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-background shadow-sm pointer-events-none z-10">
                Active
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <h1 className="text-3xl font-black text-foreground tracking-tight">{profile.name}</h1>
                <Badge variant="outline" className="bg-student-500/10 text-student-600 border-student-500/20">
                  {profile.rollNumber}
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium">{profile.email}</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Academic Profile */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-student-500" />
                <CardTitle className="text-lg">Academic Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Building2 className="w-4 h-4" /> Batch
                  </div>
                  <p className="font-semibold text-foreground">{profile.batch}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <BookOpen className="w-4 h-4" /> Semester
                  </div>
                  <p className="font-semibold text-foreground">{profile.semester}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="w-4 h-4" /> Section
                  </div>
                  <p className="font-semibold text-foreground">{profile.section}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Hash className="w-4 h-4" /> Admission Year
                  </div>
                  <p className="font-semibold text-foreground">{profile.admissionYear}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/50">
                <div className="flex justify-between items-center bg-student-500/5 p-4 rounded-xl border border-student-500/10">
                  <span className="font-medium text-student-700 dark:text-student-400">Expected Graduation</span>
                  <Badge className="bg-student-600 hover:bg-student-700">{profile.expectedGraduationYear}</Badge>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className="border border-border shadow-sm rounded-2xl bg-card">
            <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-student-500" />
                <CardTitle className="text-lg">Personal Details</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-student-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-student-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Email Address</p>
                  <p className="font-medium text-foreground">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Mobile Number</p>
                  <p className="font-medium text-foreground">{profile.mobileNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Date of Birth</p>
                  <p className="font-medium text-foreground">{profile.dob}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                  <Droplet className="w-5 h-5 text-rose-500" />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Blood Group</p>
                    <p className="font-medium text-foreground">{profile.bloodGroup}</p>
                  </div>
                  <Badge variant="outline" className="border-rose-200 text-rose-600 bg-rose-50">
                    {profile.gender}
                  </Badge>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}

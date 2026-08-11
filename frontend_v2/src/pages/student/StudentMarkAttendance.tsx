import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanFace, QrCode, CheckCircle2, AlertCircle, Camera, RefreshCw, Loader2, FileX } from 'lucide-react';

interface ActiveSession {
  sessionId: string;
  courseName: string;
  teacherName: string;
  room: string;
  verificationMethod: string;
  alreadyMarked: boolean;
}

export default function StudentMarkAttendance() {
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

  useEffect(() => {
    fetchActiveSession();
  }, []);

  const fetchActiveSession = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/students/me/active-session`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch active session');
      
      const json = await response.json();
      setActiveSession(json ? json : null);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching the active session.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartScan = async () => {
    if (!activeSession) return;
    
    setIsScanning(true);
    setVerificationStatus('verifying');
    
    // Simulate camera/scanning UI delay
    setTimeout(async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/students/me/mark-attendance/${activeSession.sessionId}`, {
          method: 'POST',
          credentials: 'include'
        });
        
        if (!response.ok) throw new Error('Failed to mark attendance');
        
        const result = await response.json();
        
        setIsScanning(false);
        if (result.success) {
          setVerificationStatus('success');
          // Update local state to show already marked
          setActiveSession(prev => prev ? { ...prev, alreadyMarked: true } : null);
        } else {
          setVerificationStatus('failed');
        }
      } catch (err) {
        setIsScanning(false);
        setVerificationStatus('failed');
      }
    }, 3000);
  };

  if (loading) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 text-student-500">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="font-medium animate-pulse text-muted-foreground">Checking for active sessions...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="student">
        <div className="flex h-[80vh] items-center justify-center flex-col gap-4 p-6 text-center">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-foreground mt-2">Error</h2>
          <p className="text-muted-foreground max-w-md">{error}</p>
          <Button onClick={fetchActiveSession} variant="outline" className="mt-4">Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  // No active session state
  if (!activeSession) {
    return (
      <DashboardLayout role="student">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 p-4">
          <div className="bg-card border border-border rounded-2xl p-16 text-center shadow-sm flex flex-col items-center justify-center mt-12">
            <div className="bg-muted/50 p-6 rounded-full mb-6">
              <FileX size={48} className="text-muted-foreground/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Active Sessions</h3>
            <p className="text-muted-foreground max-w-md">
              There are currently no LIVE classes for your section. Please wait until your professor initiates the attendance session.
            </p>
            <Button onClick={fetchActiveSession} className="mt-6 gap-2 bg-student-600 hover:bg-student-700">
              <RefreshCw className="w-4 h-4" /> Refresh Status
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isFace = activeSession.verificationMethod === 'FACE';

  return (
    <DashboardLayout role="student">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-student-500/10 flex items-center justify-center border border-student-500/20 shadow-inner">
                {isFace ? (
                  <ScanFace className="w-5 h-5 text-student-600 dark:text-student-400" />
                ) : (
                  <QrCode className="w-5 h-5 text-student-600 dark:text-student-400" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Mark Attendance</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Authenticate yourself to mark attendance for the currently active session.
            </p>
          </div>
        </div>

        <Card className="border border-border shadow-sm rounded-2xl bg-card overflow-hidden">
          <div className="bg-muted/20 border-b border-border/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{activeSession.courseName}</h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">{activeSession.teacherName} • Room {activeSession.room}</p>
            </div>
            <div className="px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SESSION ACTIVE
            </div>
          </div>

          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            
            {activeSession.alreadyMarked ? (
              <div className="text-center space-y-6 max-w-md w-full animate-in zoom-in duration-500">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 relative">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <div className="absolute inset-0 rounded-full border border-emerald-500 opacity-50"></div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Attendance Already Marked!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Your attendance for {activeSession.courseName} has been recorded successfully.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {verificationStatus === 'idle' && (
                  <div className="text-center space-y-6 max-w-md w-full">
                    <div className="w-24 h-24 rounded-full bg-student-500/10 flex items-center justify-center mx-auto mb-6">
                      {isFace ? (
                        <ScanFace className="w-12 h-12 text-student-500" />
                      ) : (
                        <QrCode className="w-12 h-12 text-student-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {isFace ? 'Face Verification Required' : 'QR Scan Required'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {isFace 
                          ? "Please position your face clearly in the camera frame to verify your identity."
                          : "Please scan the dynamic QR code displayed on the projector."}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleStartScan}
                      className="w-full h-14 text-base font-bold rounded-xl bg-student-600 hover:bg-student-700 text-white shadow-lg shadow-student-500/20 transition-all gap-2"
                    >
                      <Camera className="w-5 h-5" />
                      {isFace ? 'Open Camera (Simulate)' : 'Scan QR Code (Simulate)'}
                    </Button>
                  </div>
                )}

                {verificationStatus === 'verifying' && (
                  <div className="text-center space-y-6 w-full max-w-md">
                    <div className="w-full aspect-[4/3] rounded-2xl bg-black relative overflow-hidden flex items-center justify-center border-4 border-student-500/50">
                      <div className="absolute inset-0 bg-gradient-to-t from-student-500/20 to-transparent"></div>
                      
                      <div className="w-48 h-48 border-2 border-dashed border-student-400 rounded-lg relative">
                         <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-student-500 -mt-1 -ml-1"></div>
                         <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-student-500 -mt-1 -mr-1"></div>
                         <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-student-500 -mb-1 -ml-1"></div>
                         <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-student-500 -mb-1 -mr-1"></div>
                      </div>
                      
                      <div className="absolute top-0 left-0 right-0 h-1 bg-student-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-3 text-student-500 font-semibold">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Contacting VeriSync Neural Engine...
                    </div>
                  </div>
                )}

                {verificationStatus === 'success' && (
                  <div className="text-center space-y-6 max-w-md w-full animate-in zoom-in duration-500">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 relative">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                      <div className="absolute inset-0 rounded-full border border-emerald-500 animate-ping"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Attendance Marked!
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Your attendance has been securely verified and recorded in the database.
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline"
                      onClick={() => setVerificationStatus('idle')}
                      className="w-full h-12 text-sm font-bold rounded-xl border-border hover:bg-muted"
                    >
                      Return
                    </Button>
                  </div>
                )}

                {verificationStatus === 'failed' && (
                  <div className="text-center space-y-6 max-w-md w-full">
                    <div className="w-24 h-24 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-6">
                      <AlertCircle className="w-12 h-12 text-rose-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        Verification Failed
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        The verification token expired or network issue occurred.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => setVerificationStatus('idle')}
                      className="w-full h-14 text-base font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20 transition-all gap-2"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Try Again
                    </Button>
                  </div>
                )}
              </>
            )}

          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}

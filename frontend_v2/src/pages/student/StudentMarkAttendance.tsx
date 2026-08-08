import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScanFace, QrCode, CheckCircle2, AlertCircle, Camera, RefreshCw } from 'lucide-react';

export default function StudentMarkAttendance() {
  // Mock states for UI demonstration
  const [sessionActive] = useState(true);
  const [verificationMethod] = useState<'face' | 'qr'>('face');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');

  const handleStartScan = () => {
    setIsScanning(true);
    setVerificationStatus('verifying');
    
    // Simulate a scan delay
    setTimeout(() => {
      setIsScanning(false);
      setVerificationStatus('success');
    }, 3000);
  };

  return (
    <DashboardLayout role="student">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-2 sm:p-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-inner">
                {verificationMethod === 'face' ? (
                  <ScanFace className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                ) : (
                  <QrCode className="w-5 h-5 text-violet-600 dark:text-violet-400" />
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
              <h2 className="text-xl font-bold text-foreground">Advanced DBMS</h2>
              <p className="text-sm font-medium text-muted-foreground mt-1">Dr. Praveen Kumar • Room B-204</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${sessionActive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {sessionActive ? 'SESSION ACTIVE' : 'SESSION CLOSED'}
            </div>
          </div>

          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            
            {verificationStatus === 'idle' && (
              <div className="text-center space-y-6 max-w-md w-full">
                <div className="w-24 h-24 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6">
                  {verificationMethod === 'face' ? (
                    <ScanFace className="w-12 h-12 text-violet-500" />
                  ) : (
                    <QrCode className="w-12 h-12 text-violet-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {verificationMethod === 'face' ? 'Face Verification Required' : 'QR Scan Required'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {verificationMethod === 'face' 
                      ? "Please position your face clearly in the camera frame to verify your identity and mark your attendance."
                      : "Please scan the dynamic QR code displayed on the projector to mark your attendance."}
                  </p>
                </div>
                
                <Button 
                  onClick={handleStartScan}
                  className="w-full h-14 text-base font-bold rounded-xl bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/20 transition-all gap-2"
                >
                  <Camera className="w-5 h-5" />
                  {verificationMethod === 'face' ? 'Open Camera' : 'Scan QR Code'}
                </Button>
              </div>
            )}

            {verificationStatus === 'verifying' && (
              <div className="text-center space-y-6 w-full max-w-md">
                {/* Mock Camera Viewfinder */}
                <div className="w-full aspect-[4/3] rounded-2xl bg-black relative overflow-hidden flex items-center justify-center border-4 border-violet-500/50">
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-500/20 to-transparent"></div>
                  
                  {/* Scanning Reticle */}
                  <div className="w-48 h-48 border-2 border-dashed border-violet-400 rounded-lg relative">
                     <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-violet-500 -mt-1 -ml-1"></div>
                     <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-violet-500 -mt-1 -mr-1"></div>
                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-violet-500 -mb-1 -ml-1"></div>
                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-violet-500 -mb-1 -mr-1"></div>
                  </div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                
                <div className="flex items-center justify-center gap-3 text-violet-500 font-semibold">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying Identity...
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
                    Your attendance for Advanced DBMS has been securely verified and recorded.
                  </p>
                </div>
                
                <Button 
                  variant="outline"
                  onClick={() => setVerificationStatus('idle')}
                  className="w-full h-12 text-sm font-bold rounded-xl border-border hover:bg-muted"
                >
                  Return to Dashboard
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
                    We couldn't verify your identity. Please ensure you are in a well-lit area and try again.
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

          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}

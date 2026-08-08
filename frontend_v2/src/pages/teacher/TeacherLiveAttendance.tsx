import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, MonitorPlay, QrCode, Smartphone } from 'lucide-react';
import { useDataStore, fetchWithAuth } from '@/store/useDataStore';

// Fallback actual data from the project if store is empty
const RAW_STUDENTS = [
  {name:'Ananya Singh',  roll:'MCA030', verification:'Verified',     time:'09:02 AM'},
  {name:'Garima Gupta',  roll:'MCA031', verification:'Not verified', time:'—'},
  {name:'Harshita Jha',  roll:'MCA032', verification:'Verified',     time:'09:05 AM'},
  {name:'Komal Kumari',  roll:'MCA033', verification:'Not verified', time:'—'},
  {name:'Mahi Verma',    roll:'MCA034', verification:'Verified',     time:'08:58 AM'},
  {name:'Neha Sinha',    roll:'MCA035', verification:'Not verified', time:'—'},
  {name:'Pallavi Roy',   roll:'MCA036', verification:'Not verified', time:'—'},
  {name:'Pooja Sharma',  roll:'MCA037', verification:'Verified',     time:'09:11 AM'},
  {name:'Riya Kumari',   roll:'MCA038', verification:'Not verified', time:'—'},
];

function initials(name: string){
  return name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
}

const StatusIndicator = ({ type, active }: { type: 'Face' | 'QR' | 'Device', active: boolean }) => {
  if (type === 'Face' && active) {
    return (
      <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Verified
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border/50">
      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
      Valid
    </div>
  );
};

const TeacherLiveAttendance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');
  const courseId = searchParams.get('courseId');
  const method = searchParams.get('method') || 'FACE';
  const otp = searchParams.get('otp');

  const { students: storeStudents, fetchStudents, courseInstances } = useDataStore();
  
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const activeCourse = useMemo(() => {
    if (!courseId || !courseInstances) return null;
    return courseInstances.find(c => c.id === courseId);
  }, [courseId, courseInstances]);

  const [liveRecords, setLiveRecords] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [qrToken, setQrToken] = useState<string>('');

  const toggleManualStatus = (roll: string) => {
    if (method !== 'MANUAL') return;
    setManualOverrides(prev => ({
      ...prev,
      [roll]: !prev[roll]
    }));
  };

  // Polling for live stats
  useEffect(() => {
    if (!sessionId) return;
    
    const fetchStats = async () => {
      try {
        const data = await fetchWithAuth(`/attendance/sessions/${sessionId}/stats`, {
          method: 'GET'
        });
        if (data.success && data.records) {
          setLiveRecords(data.records);
        }
      } catch (e) {
        console.error("Error polling live stats:", e);
      }
    };

    fetchStats(); // Initial fetch
    const interval = setInterval(fetchStats, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  // Dynamic QR Token Rotation
  useEffect(() => {
    if (!sessionId || method !== 'DYNAMIC_QR') return;
    
    const rotateQr = async () => {
      try {
        const data = await fetchWithAuth(`/attendance/sessions/${sessionId}/qr/rotate`, {
          method: 'POST',
          body: JSON.stringify({ teacherId: 'TCH_001' }) // Mock teacher ID for now
        });
        if (data.success && data.token) {
          setQrToken(data.token);
        }
      } catch (e) {
        console.error("Error rotating QR:", e);
      }
    };

    rotateQr(); // Initial fetch
    const interval = setInterval(rotateQr, 30000); // Rotate every 30 seconds
    return () => clearInterval(interval);
  }, [sessionId, method]);

  // Countdown timer
  useEffect(() => {
    if (!sessionId) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const activeStudents = useMemo(() => {
    const source = storeStudents.length > 0 ? storeStudents : RAW_STUDENTS;
    return source.map((s: any) => {
      const roll = s.rollNumber || s.roll;
      const record = liveRecords.find(r => r.rollNumber === roll);
      const isManualPresent = manualOverrides[roll];
      
      const isVerified = (record || s.verification === 'Verified' || s.faceEnrolled || isManualPresent);
      
      return {
        id: roll,
        name: s.name,
        initials: initials(s.name),
        faceVerified: isVerified,
        qrValid: true, // Assuming valid for demonstration
        deviceValid: true,
        status: isVerified ? 'Present' : 'Pending',
        time: record ? new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (isVerified ? '09:00 AM' : '—')
      };
    });
  }, [storeStudents, liveRecords]);

  const presentCount = activeStudents.filter(s => s.status === 'Present').length;
  const pendingCount = activeStudents.filter(s => s.status === 'Pending').length;
  const warningsCount = 1; // Mock warning count for demo

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraHeight, setCameraHeight] = useState(300);

  // Prevent navigation when session is active
  useEffect(() => {
    if (!sessionId) return;
    
    // Prevent closing the tab/window
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Intercept clicks on sidebar and header in the capture phase
    const handleNavigation = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('aside') || target.closest('header')) {
        e.preventDefault();
        e.stopPropagation();
        alert("Action Blocked: Please explicitly close the active attendance session first before navigating away.");
      }
    };
    
    document.addEventListener('click', handleNavigation, { capture: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleNavigation, { capture: true });
    };
  }, [sessionId]);

  const handleCloseSession = async () => {
    if (window.confirm("Are you sure you want to end this attendance session? All pending scans will be discarded.")) {
      try {
        await fetchWithAuth(`/attendance/sessions/${sessionId}/close`, {
          method: 'POST',
          body: JSON.stringify({ teacherId: 'TCH_001' })
        });
        navigate('/teacher/attendance/records');
      } catch (e) {
        console.error("Failed to close session:", e);
        alert("Failed to close session on server.");
      }
    }
  };

  const handleSaveManual = async () => {
    if (!sessionId || method !== 'MANUAL') return;
    setIsSavingManual(true);
    try {
      await fetchWithAuth(`/attendance/sessions/${sessionId}/manual`, {
        method: 'POST',
        body: JSON.stringify({ overrides: manualOverrides, teacherId: 'TCH_001' })
      });
      alert('Manual attendance saved successfully.');
    } catch (e) {
      console.error("Failed to save manual attendance:", e);
      alert("Failed to save manual attendance.");
    } finally {
      setIsSavingManual(false);
    }
  };

  // If no session ID is provided, show empty state
  if (!sessionId) {
    return (
      <DashboardLayout role="teacher">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-500 font-sans p-6">
          <Card className="max-w-md w-full border border-border shadow-[0_2px_20px_-5px_rgba(0,0,0,0.1)] bg-card p-10 text-center rounded-3xl flex flex-col items-center">
            <div className="w-20 h-20 bg-muted border border-border/50 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <AlertCircle size={36} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">No Active Session</h2>
            <p className="text-sm text-muted-foreground mb-10 leading-relaxed max-w-sm">
              There is currently no live attendance session running. You need to configure and start a session first.
            </p>
            <Link to="/teacher/attendance/start" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-sm font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
                <MonitorPlay size={18} />
                Start Attendance Session
              </Button>
            </Link>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Initialize webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam", err);
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Update animation boundary based on container
  useEffect(() => {
    if (containerRef.current) {
      setCameraHeight(containerRef.current.offsetHeight);
    }
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) {
        setCameraHeight(entries[0].contentRect.height);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1 tracking-tight">Live Attendance</h1>
            <p className="text-sm text-muted-foreground font-medium">
              {activeCourse ? `${activeCourse.displayName} · ${activeCourse.subjectCode}` : 'Live Session'}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={handleCloseSession}
            className="rounded-xl px-6 font-semibold shadow-sm transition-all duration-200"
          >
            Close Session
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Face Verification */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="rounded-2xl border border-border shadow-sm overflow-hidden bg-card h-full flex flex-col">
              <CardContent className="p-8 flex flex-col items-center flex-grow">
                
                {method === 'FACE' && (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">Face Verification</h2>
                    <p className="text-sm text-muted-foreground mb-6">Scanning for enrolled faces</p>
                    
                    <div ref={containerRef} className="relative w-full aspect-[3/4] max-w-[320px] rounded-xl overflow-hidden bg-slate-900 border border-border/50 shadow-inner">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover mirror"
                        style={{ transform: 'scaleX(-1)' }}
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700/50 via-slate-900 to-slate-900 -z-10 flex items-center justify-center">
                        <span className="text-slate-500 text-sm font-medium">Camera Feed</span>
                      </div>
                      <motion.div
                        animate={{ y: [0, cameraHeight, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 z-10"
                        style={{ boxShadow: '0 0 12px 2px rgba(52,211,153,0.6)' }}
                      />
                    </div>
                  </>
                )}

                {method === 'OTP' && (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">OTP Verification</h2>
                    <p className="text-sm text-muted-foreground mb-6">Students check emails for the PIN</p>
                    <div className="w-full aspect-[3/4] max-w-[320px] rounded-xl overflow-hidden bg-emerald-500/5 border border-emerald-500/20 shadow-inner flex flex-col items-center justify-center p-6 text-center">
                      <Smartphone size={48} className="text-emerald-500 mb-6 opacity-80" />
                      <p className="text-sm font-medium text-muted-foreground mb-2">Session PIN</p>
                      <div className="text-5xl font-black text-emerald-600 tracking-[0.2em] font-mono">{otp || '------'}</div>
                    </div>
                  </>
                )}

                {(method === 'STATIC_QR' || method === 'DYNAMIC_QR') && (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">{method === 'DYNAMIC_QR' ? 'Dynamic QR' : 'Static QR'} Verification</h2>
                    <p className="text-sm text-muted-foreground mb-6">Scan using the student app</p>
                    <div className="w-full aspect-[3/4] max-w-[320px] rounded-xl overflow-hidden bg-white border border-border shadow-inner flex flex-col items-center justify-center p-8">
                      <QrCode size={200} className="text-slate-900 mb-4" />
                      {method === 'DYNAMIC_QR' && (
                        <>
                          <p className="text-xs font-bold text-emerald-600 animate-pulse bg-emerald-500/10 px-3 py-1 rounded-full mb-2">Refreshing automatically...</p>
                          <div className="w-full text-center break-all text-[10px] text-muted-foreground font-mono bg-muted/30 p-2 rounded">{qrToken || 'Loading token...'}</div>
                        </>
                      )}
                    </div>
                  </>
                )}

                {method === 'MANUAL' && (
                  <>
                    <h2 className="text-lg font-bold text-foreground mb-1">Manual Roll Call</h2>
                    <p className="text-sm text-muted-foreground mb-6">Call names from the list</p>
                    <div className="w-full aspect-[3/4] max-w-[320px] rounded-xl overflow-hidden bg-background border border-border/50 border-dashed shadow-inner flex flex-col items-center justify-center p-6 text-center">
                      <AlertCircle size={48} className="text-muted-foreground mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground mb-6">Mark attendance manually from the table on the right.</p>
                      <Button onClick={handleSaveManual} disabled={isSavingManual} className="bg-emerald-600 hover:bg-emerald-700 w-full text-white">
                        {isSavingManual ? 'Saving...' : 'Save Attendance'}
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-auto pt-8">
                  <p className="text-sm text-muted-foreground font-medium">
                    Session closes in <span className="text-foreground font-bold">{formatTime(timeLeft)}</span>
                  </p>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Column - Verification List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Card className="rounded-2xl border border-border shadow-sm bg-card h-full">
              <CardContent className="p-6 sm:p-8">
                
                {/* List Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-1">Live verification list</h2>
                    <p className="text-sm text-muted-foreground">{presentCount} of {activeStudents.length} students verified</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">Present</p>
                    <p className="text-2xl font-bold text-foreground">{presentCount}</p>
                  </div>
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">Pending</p>
                    <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                  </div>
                  <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wide">Warnings</p>
                    <p className="text-2xl font-bold text-foreground">{warningsCount}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="pb-4 pl-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                        <th className="pb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Face</th>
                        <th className="pb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">QR</th>
                        <th className="pb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Device</th>
                        <th className="pb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                        <th className="pb-4 pr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {activeStudents.map((student, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                          <td className="py-4 pl-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-700/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm font-bold border border-emerald-500/20 shadow-sm">
                                {student.initials}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center align-middle">
                            <div className="flex justify-center">
                              <StatusIndicator type="Face" active={student.faceVerified} />
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center align-middle">
                            <div className="flex justify-center">
                              <StatusIndicator type="QR" active={student.qrValid} />
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center align-middle">
                            <div className="flex justify-center">
                              <StatusIndicator type="Device" active={student.deviceValid} />
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center align-middle">
                            <div className="flex justify-center">
                              {method === 'MANUAL' ? (
                                <button
                                  onClick={() => toggleManualStatus(student.id)}
                                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    student.status === 'Present'
                                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 scale-105'
                                      : 'bg-muted hover:bg-muted-foreground/20 text-muted-foreground'
                                  }`}
                                >
                                  {student.status === 'Present' ? 'PRESENT' : 'MARK'}
                                </button>
                              ) : student.status === 'Present' ? (
                                <Badge className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 font-semibold shadow-none">
                                  {student.status}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted/30 text-muted-foreground border-border px-3 font-semibold shadow-none">
                                  {student.status}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 pr-2 text-right align-middle">
                            <span className="text-sm font-medium text-muted-foreground">{student.time}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherLiveAttendance;
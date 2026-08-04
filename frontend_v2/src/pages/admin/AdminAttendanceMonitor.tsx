import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Activity, Radio, Fingerprint, MapPin, StopCircle, Play, AlertTriangle, Users } from 'lucide-react';
import { useLiveStore } from '@/store/useLiveStore';
import { useDataStore } from '@/store/useDataStore';
import { Button } from '@/components/ui/button';

export default function AdminAttendanceMonitor() {
  const { activeSessions, liveFeed, startSession, endSession, logScan, logAnomaly } = useLiveStore();
  const { teachers, subjects } = useDataStore();
  
  const [now, setNow] = useState(Date.now());

  // Tick every minute to update "Elapsed time"
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsed = (startTime: number) => {
    const diffMins = Math.floor((now - startTime) / 60000);
    if (diffMins === 0) return 'Just now';
    return `${diffMins} min${diffMins > 1 ? 's' : ''}`;
  };

  const formatFeedTime = (timestamp: number) => {
    const diffSecs = Math.floor((now - timestamp) / 1000);
    if (diffSecs < 60) return 'Just now';
    const diffMins = Math.floor(diffSecs / 60);
    return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  };

  // --- SIMULATION ENGINE ---
  const handleSimulateStartClass = () => {
    // Pick a random teacher who has subjects
    const teachersWithSubjects = teachers.filter(t => t.semesterSubjects && Object.keys(t.semesterSubjects).length > 0);
    if (teachersWithSubjects.length === 0) return;
    
    const randomTeacher = teachersWithSubjects[Math.floor(Math.random() * teachersWithSubjects.length)];
    const semKeys = Object.keys(randomTeacher.semesterSubjects!);
    const randomSem = semKeys[Math.floor(Math.random() * semKeys.length)];
    const subCodes = randomTeacher.semesterSubjects![Number(randomSem)];
    const randomSubCode = subCodes[Math.floor(Math.random() * subCodes.length)];
    const subject = subjects.find(s => s.code === randomSubCode);

    if (subject) {
      startSession({
        course: `${subject.code} - ${subject.name}`,
        teacher: randomTeacher.name,
        section: `MCA Sem-${randomSem}`,
        type: Math.random() > 0.5 ? 'FACE + QR' : 'FACE + OTP',
        total: randomSem === '1' ? 60 : 50,
      });
    }
  };

  const handleSimulateScan = () => {
    if (activeSessions.length === 0) return;
    // Pick random active session
    const session = activeSessions[Math.floor(Math.random() * activeSessions.length)];
    if (session.present >= session.total) return; // Full

    const mockNames = ['Aarav Sharma', 'Priya Patel', 'Rohan Gupta', 'Neha Singh', 'Vikram Malhotra', 'Sneha Kapoor'];
    const name = mockNames[Math.floor(Math.random() * mockNames.length)];
    const type = Math.random() > 0.3 ? 'verified' : 'otp';
    
    logScan(session.id, name, type as 'verified' | 'otp');
  };

  const handleSimulateAnomaly = () => {
    const anomalies = ['Proxy Attempt Detected', 'Spoofing Detected', 'Multiple Faces Detected'];
    const event = anomalies[Math.floor(Math.random() * anomalies.length)];
    logAnomaly('Unknown Identity', event);
  };
  // -------------------------

  return (
    <DashboardLayout role="admin">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-semibold mb-3 border border-emerald-500/20">
              <Radio size={14} className="animate-pulse" /> Live Monitoring
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Attendance Monitor</h1>
            <p className="text-muted-foreground mt-1">Real-time view of ongoing classes and verification events.</p>
          </div>
        </div>

        {/* Simulation Control Panel */}
        <div className="bg-muted/30 border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="text-sm font-semibold text-muted-foreground flex items-center gap-2 mr-4">
             <Activity size={16} /> Simulation Engine
          </div>
          <Button onClick={handleSimulateStartClass} variant="outline" className="border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-500">
            <Play size={14} className="mr-2" /> Start Random Class
          </Button>
          <Button onClick={handleSimulateScan} variant="outline" className="border-blue-500/50 hover:bg-blue-500/10 text-blue-500" disabled={activeSessions.length === 0}>
            <Fingerprint size={14} className="mr-2" /> Simulate Verification
          </Button>
          <Button onClick={handleSimulateAnomaly} variant="outline" className="border-red-500/50 hover:bg-red-500/10 text-red-500">
            <AlertTriangle size={14} className="mr-2" /> Trigger Proxy Alert
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Activity className="text-emerald-500" /> Active Sessions ({activeSessions.length})
            </h2>
            
            {activeSessions.length === 0 ? (
              <div className="bg-card border border-border border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <Users size={48} className="text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">No Active Classes</h3>
                <p className="text-muted-foreground text-sm max-w-md">There are currently no ongoing classes. Use the simulation engine above to start a random class session.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSessions.map((session) => (
                  <div key={session.id} className="bg-card border border-emerald-500/20 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{session.course}</h3>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded flex items-center gap-1">
                          <Radio size={12} className="animate-pulse" /> LIVE
                        </span>
                        <button 
                          onClick={() => endSession(session.id)}
                          className="text-xs text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        >
                          <StopCircle size={14} /> End
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {session.teacher} • {session.section}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Fingerprint size={12}/> Mode</p>
                        <p className="font-semibold text-sm">{session.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><StopCircle size={12}/> Elapsed</p>
                        <p className="font-semibold text-sm">{formatElapsed(session.startTime)}</p>
                      </div>
                      <div className="col-span-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Attendance Progress</span>
                          <span className="font-bold text-emerald-500">{session.present}/{session.total} Present</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(session.present/session.total)*100}%`}} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
             <h2 className="text-lg font-bold text-foreground">Live Feed</h2>
             <div className="bg-card border border-border rounded-2xl shadow-sm p-4 h-[400px] overflow-y-auto space-y-3 flex flex-col">
                {liveFeed.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground italic">
                    Waiting for events...
                  </div>
                ) : (
                  liveFeed.map(feed => (
                    <FeedItem 
                      key={feed.id}
                      name={feed.name} 
                      event={feed.event} 
                      time={formatFeedTime(feed.timestamp)} 
                      icon={feed.iconType === 'anomaly' ? <MapPin size={14}/> : feed.iconType === 'otp' ? <StopCircle size={14}/> : <Fingerprint size={14}/>} 
                      color={feed.color} 
                    />
                  ))
                )}
             </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}

function FeedItem({ name, event, time, icon, color }: any) {
  const isRed = color === 'red';
  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isRed ? 'bg-red-500/5 border-red-500/20' : 'bg-background border-border/50'}`}>
      <div className={`p-2 rounded-full mt-0.5 shrink-0 ${isRed ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{name}</p>
        <p className={`text-xs ${isRed ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>{event}</p>
      </div>
      <span className="ml-auto text-[10px] text-muted-foreground mt-1 shrink-0">{time}</span>
    </div>
  );
}

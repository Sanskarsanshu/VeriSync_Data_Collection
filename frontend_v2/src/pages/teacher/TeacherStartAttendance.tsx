import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  QrCode, CheckCircle2, ShieldCheck, Clock, Calendar, MapPin, 
  Settings2, Fingerprint, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';

export default function TeacherStartAttendance() {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const { teachers, subjects, courseInstances } = useDataStore();
  
  // Get teacher's courses
  const currentTeacher = useMemo(() => {
    if (!teachers || teachers.length === 0) return null;
    if (!user) return teachers[0];
    return teachers.find(t => t.email.toLowerCase() === user.email?.toLowerCase()) || teachers[0];
  }, [user, teachers]);

  const myActiveInstances = useMemo(() => {
    if (!currentTeacher || !courseInstances) return [];
    return courseInstances.filter(c => c.teacherId === currentTeacher.id);
  }, [currentTeacher, courseInstances]);

  const [selectedCourse, setSelectedCourse] = useState('');

  React.useEffect(() => {
    if (myActiveInstances.length > 0 && !selectedCourse) {
      setSelectedCourse(myActiveInstances[0].id);
    }
  }, [myActiveInstances, selectedCourse]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(new Date().toTimeString().slice(0,5));
  const [window, setWindow] = useState('10');
  const [room, setRoom] = useState('Room 204');
  const [verification, setVerification] = useState('face');

  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    if (!selectedCourse) return;
    setIsStarting(true);
    
    // Map the dropdown value to the backend enum
    let method = 'MANUAL';
    if (verification === 'face') method = 'FACE';
    if (verification === 'otp') method = 'OTP';
    if (verification === 'qr') method = 'STATIC_QR';
    if (verification === 'dynamic_qr') method = 'DYNAMIC_QR';

    try {
      const token = sessionStorage.getItem('verisync_token');
      const res = await fetch('http://localhost:3001/attendance/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId: selectedCourse,
          verificationMethod: method,
          windowMinutes: parseInt(window)
        })
      });
      
      const data = await res.json();
      if (data.success) {
        navigate(`/teacher/attendance/live?sessionId=${data.sessionId}&method=${method}&otp=${data.otp || ''}`);
      } else {
        alert('Failed to start session: ' + data.message);
      }
    } catch (e) {
      console.error(e);
      alert('Network error starting session');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Start Attendance</h1>
          <p className="text-muted-foreground mt-1 text-lg">Create a time-limited class session with dynamic QR and face verification.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden relative">
              {/* Subtle top gradient */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
              
              <div className="p-6 sm:p-8 border-b border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <Settings2 size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Session Configuration</h2>
                </div>
                <p className="text-sm text-muted-foreground ml-11">Course and teacher information is validated automatically</p>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                
                {/* Course Selection */}
                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold text-foreground">Course</label>
                  <select 
                    value={selectedCourse}
                    onChange={e => setSelectedCourse(e.target.value)}
                    className="w-full bg-background border border-border text-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 appearance-none shadow-sm transition-all"
                  >
                    {myActiveInstances.length === 0 && <option value="">No active courses found</option>}
                    {myActiveInstances.map(c => (
                      <option key={c.id} value={c.id}>{c.displayName} - {c.subjectCode}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-10 pointer-events-none text-muted-foreground text-xs">▼</div>
                </div>

                {/* Date and Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="date" 
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Start Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="time" 
                        value={startTime}
                        onChange={e => setStartTime(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Window and Room Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Attendance Window</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                      <select 
                        value={window}
                        onChange={e => setWindow(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 appearance-none shadow-sm transition-all"
                      >
                        <option value="5">5 Minutes</option>
                        <option value="10">10 Minutes</option>
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">▼</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Room</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input 
                        type="text" 
                        value={room}
                        onChange={e => setRoom(e.target.value)}
                        className="w-full bg-background border border-border text-foreground rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Verification Method */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Verification Method</label>
                  <div className="relative">
                    <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                    <select 
                      value={verification}
                      onChange={e => setVerification(e.target.value)}
                      className="w-full bg-emerald-500/5 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 appearance-none shadow-sm transition-all font-semibold"
                    >
                      <option value="face">Attendance Through Face Verification</option>
                      <option value="otp">Attendance Through OTP Email</option>
                      <option value="qr">QR Code Attendance</option>
                      <option value="dynamic_qr">Dynamic QR Attendance</option>
                      <option value="manual">Manual Roll Call Only</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500 text-xs">▼</div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    onClick={handleStart}
                    disabled={!selectedCourse || isStarting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 h-14 rounded-xl text-lg font-bold gap-3 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    <QrCode size={24} />
                    {isStarting ? 'Starting Session...' : 'Start Attendance Session'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Security info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card/50 border border-border rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <h2 className="text-xl font-bold text-foreground">Session Security</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-11 mb-8">Frontend representation of production controls</p>

              <div className="space-y-4 flex-1">
                <SecurityItem 
                  title="Course-specific" 
                  desc="Token is strictly bound to one authorised course."
                />
                <SecurityItem 
                  title="Time-limited" 
                  desc="Session strictly expires after the selected window."
                />
                <SecurityItem 
                  title="Dynamic refresh" 
                  desc="QR representation refreshes securely every 15 seconds."
                />
                <SecurityItem 
                  title="Face and device checks" 
                  desc="Required locally before Present is recorded."
                />
              </div>

              <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex gap-3 shadow-sm">
                <Smartphone className="text-blue-500 shrink-0 mt-0.5" size={18} />
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium leading-relaxed">
                  Students must scan the generated QR code using the official student application. Scanning with a generic camera app will not record attendance.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function SecurityItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow group">
      <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-1 mt-0.5 shrink-0 group-hover:bg-emerald-500/20 transition-colors">
        <CheckCircle2 size={16} className="fill-emerald-500 text-background" />
      </div>
      <div>
        <h4 className="font-bold text-foreground text-sm leading-tight">{title}</h4>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{desc}</p>
      </div>
    </div>
  );
}
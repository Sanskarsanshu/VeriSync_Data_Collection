import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';

export default function StudentMockJoin() {
  const [searchParams] = useSearchParams();
  const initialSessionId = searchParams.get('sessionId') || '';
  
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [studentId, setStudentId] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [message, setMessage] = useState('');

  // Let's get a real student ID to use by default from the data store
  const { students, fetchStudents } = useDataStore();
  
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  useEffect(() => {
    if (students && students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [students, studentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId || !studentId) return;
    
    setStatus('LOADING');
    try {
      const authToken = sessionStorage.getItem('verisync_token');
      const res = await fetch('http://localhost:3001/attendance/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ sessionId, studentId, otp, token })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('SUCCESS');
        setMessage(data.message);
      } else {
        setStatus('ERROR');
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
      setMessage('Network error while marking attendance.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Student Simulator</h1>
          <p className="text-slate-400 text-sm">Test marking attendance on the live backend</p>
        </div>

        {status === 'SUCCESS' ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500 w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-white">Attendance Marked!</h2>
            <p className="text-emerald-400 text-center">{message}</p>
            <Button className="mt-4 w-full bg-slate-800 hover:bg-slate-700" onClick={() => setStatus('IDLE')}>
              Mark Another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'ERROR' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-500 animate-in shake">
                <XCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">Session ID</label>
              <input 
                value={sessionId}
                onChange={e => setSessionId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                placeholder="Enter Session ID"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">Student Database ID</label>
              <select 
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none"
                required
              >
                <option value="">Select a student...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">OTP (If Applicable)</label>
              <input 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                placeholder="6-digit OTP"
                maxLength={6}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 ml-1">Dynamic QR Token (If Applicable)</label>
              <input 
                value={token}
                onChange={e => setToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                placeholder="Token string"
              />
            </div>

            <Button 
              type="submit" 
              disabled={status === 'LOADING'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              {status === 'LOADING' ? <Loader2 className="animate-spin" /> : 'Simulate Attendance'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

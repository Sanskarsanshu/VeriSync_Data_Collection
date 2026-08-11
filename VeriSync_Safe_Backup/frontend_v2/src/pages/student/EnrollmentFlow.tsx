import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadModels, detectFace, drawFaceGuidance } from '@/lib/face-api';

export default function EnrollmentFlow() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  // Metadata
  const [metadata, setMetadata] = useState<any>({ batches: [], semesters: [], sections: [] });

  // Form State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '', rollNumber: '', universityRegistrationNumber: '',
    gender: 'MALE', dob: '', mobileNumber: '', email: '', bloodGroup: '',
    password: '', confirmPassword: ''
  });
  
  const [academicInfo, setAcademicInfo] = useState({
    batchId: '', sectionId: '', admissionYear: '2026', expectedGraduationYear: '2030'
  });

  const [faceEmbedding, setFaceEmbedding] = useState<number[] | null>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [captureStatus, setCaptureStatus] = useState('Initialize Camera');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!token) {
      // If no token is provided, just bypass the strict token lock for testing/direct access.
      setLoading(false);
      
      // Still try to fetch metadata for dropdowns
      fetch(`${API_URL}/enrollment/metadata`)
        .then(res => res.json())
        .then(data => {
          if (data.batches) setMetadata(data);
          if (data.batches?.length > 0) setAcademicInfo(a => ({ ...a, batchId: data.batches[0].id }));
          if (data.sections?.length > 0) setAcademicInfo(a => ({ ...a, sectionId: data.sections[0].id }));
        })
        .catch(err => console.error("Could not fetch metadata:", err));
      return;
    }

    // Verify Token
    fetch(`${API_URL}/enrollment/verify-token/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Invalid or expired token');
        return res.json();
      })
      .then(data => {
        if (data.targetRollNumber) setPersonalInfo(p => ({ ...p, rollNumber: data.targetRollNumber }));
        if (data.targetName) setPersonalInfo(p => ({ ...p, fullName: data.targetName }));
        
        // Fetch Metadata
        return fetch(`${API_URL}/enrollment/metadata`);
      })
      .then(res => res.json())
      .then(data => {
        setMetadata(data);
        if (data.batches?.length > 0) setAcademicInfo(a => ({ ...a, batchId: data.batches[0].id }));
        if (data.sections?.length > 0) setAcademicInfo(a => ({ ...a, sectionId: data.sections[0].id }));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  // Step 3: Face Capture logic
  const startCamera = async () => {
    setCaptureStatus('Loading AI Models...');
    await loadModels('/models');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCaptureStatus('Align face in the oval');
        
        // Start detection loop
        const interval = setInterval(async () => {
          if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
            const detections = await detectFace(videoRef.current);
            const isGood = drawFaceGuidance(canvasRef.current, videoRef.current, detections);
            
            if (isGood && detections) {
              setCaptureStatus('Capturing...');
              clearInterval(interval);
              
              // Simulate collecting frames and generating embedding
              setTimeout(() => {
                setFaceEmbedding(Array.from(detections.descriptor));
                setCaptureStatus('Face captured successfully!');
                
                // Stop camera
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
                setCameraActive(false);
              }, 1500);
            }
          }
        }, 200);
      }
    } catch (err) {
      setCaptureStatus('Camera access denied or failed.');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/enrollment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token || "Bypass", personalInfo, academicInfo, faceEmbedding
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');
      
      setSuccessData(data);
      setStep(5); // Success step
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const validateAndNext = () => {
    if (step === 1) {
      if (personalInfo.password !== personalInfo.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (personalInfo.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    setError('');
    handleNext();
  };

  if (loading) return <div className="p-8 text-center">Validating Secure Link...</div>;
  if (error && step !== 5) return <div className="p-8 text-center text-red-500 font-medium bg-red-50">{error}</div>;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl overflow-hidden relative">
        
        {/* Progress Bar */}
        {step < 5 && (
          <div className="h-2 bg-muted w-full">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold">VeriSync Student Enrollment</h1>
            {step < 5 && <p className="text-muted-foreground text-sm mt-1">Step {step} of 4</p>}
          </header>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Roll Number *</Label>
                  <Input value={personalInfo.rollNumber} onChange={e => setPersonalInfo({...personalInfo, rollNumber: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address *</Label>
                  <Input type="email" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number *</Label>
                  <Input value={personalInfo.mobileNumber} onChange={e => setPersonalInfo({...personalInfo, mobileNumber: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" value={personalInfo.dob} onChange={e => setPersonalInfo({...personalInfo, dob: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={personalInfo.gender} 
                    onChange={e => setPersonalInfo({...personalInfo, gender: e.target.value})}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>University Registration No. *</Label>
                  <Input value={personalInfo.universityRegistrationNumber} onChange={e => setPersonalInfo({...personalInfo, universityRegistrationNumber: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Set Password *</Label>
                  <Input type="password" value={personalInfo.password} onChange={e => setPersonalInfo({...personalInfo, password: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password *</Label>
                  <Input type="password" value={personalInfo.confirmPassword} onChange={e => setPersonalInfo({...personalInfo, confirmPassword: e.target.value})} required />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Academic Info */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-semibold border-b pb-2">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={academicInfo.batchId} 
                    onChange={e => setAcademicInfo({...academicInfo, batchId: e.target.value})}
                  >
                    {metadata.batches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Section *</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={academicInfo.sectionId} 
                    onChange={e => setAcademicInfo({...academicInfo, sectionId: e.target.value})}
                  >
                    {metadata.sections.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Admission Year</Label>
                  <Input value={academicInfo.admissionYear} onChange={e => setAcademicInfo({...academicInfo, admissionYear: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Expected Graduation</Label>
                  <Input value={academicInfo.expectedGraduationYear} onChange={e => setAcademicInfo({...academicInfo, expectedGraduationYear: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Face Capture */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-semibold border-b pb-2">Biometric Enrollment</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-64 h-64 bg-muted rounded-full overflow-hidden border-4 border-primary/20 flex items-center justify-center">
                  {!cameraActive && !faceEmbedding && (
                    <Button onClick={startCamera}>Open Camera</Button>
                  )}
                  {cameraActive && (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
                      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full transform -scale-x-100" />
                    </>
                  )}
                  {faceEmbedding && (
                    <div className="text-emerald-500 font-bold bg-emerald-50 px-4 py-2 rounded-full absolute">✓ Captured</div>
                  )}
                </div>
                <p className="text-sm font-medium text-center h-6">{captureStatus}</p>
                {faceEmbedding && (
                  <Button variant="outline" onClick={() => setFaceEmbedding(null)}>Retake</Button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-lg font-semibold border-b pb-2">Review & Submit</h2>
              
              <div className="space-y-4 text-sm bg-muted/30 p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-1 flex justify-between">Personal Info <button onClick={() => setStep(1)} className="text-primary text-xs hover:underline">Edit</button></h3>
                  <p><span className="text-muted-foreground">Name:</span> {personalInfo.fullName}</p>
                  <p><span className="text-muted-foreground">Roll No:</span> {personalInfo.rollNumber}</p>
                  <p><span className="text-muted-foreground">Email:</span> {personalInfo.email}</p>
                </div>
                <hr className="border-border" />
                <div>
                  <h3 className="font-semibold mb-1 flex justify-between">Biometric <button onClick={() => setStep(3)} className="text-primary text-xs hover:underline">Edit</button></h3>
                  <p><span className="text-muted-foreground">Status:</span> {faceEmbedding ? <span className="text-emerald-500 font-medium">128D Embedding Captured</span> : <span className="text-red-500">Missing</span>}</p>
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && successData && (
            <div className="text-center space-y-6 animate-in zoom-in-95">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-emerald-600">Enrollment Successful!</h2>
              <p className="text-muted-foreground">Your account has been created and biometrics registered.</p>
              
              <div className="bg-muted p-6 rounded-xl border border-border text-left space-y-3 max-w-sm mx-auto">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Student ID</p>
                  <p className="font-mono text-lg font-semibold">{successData.studentId}</p>
                </div>
                <p className="text-xs text-emerald-600 font-medium mt-2">You can now log in with your email and the password you set during registration.</p>
              </div>
              
              <Button className="w-full max-w-sm mx-auto" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-4 border-t border-border">
              <Button variant="outline" onClick={handlePrev} disabled={step === 1 || submitting}>
                Back
              </Button>
              
              {step < 4 ? (
                <Button onClick={validateAndNext}>Next Step</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!faceEmbedding || submitting}>
                  {submitting ? 'Submitting...' : 'Finish Enrollment'}
                </Button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

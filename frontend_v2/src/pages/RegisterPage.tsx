import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loadModels, detectFace, drawFaceGuidance } from '@/lib/face-api';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  BookOpenIcon,
  CameraIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  Fingerprint,
  MailIcon,
  RefreshCwIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

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

  // Camera & Liveness State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [captureStatus, setCaptureStatus] = useState('Initialize Camera');
  const [cameraTimeLeft, setCameraTimeLeft] = useState(40);
  const [livenessStep, setLivenessStep] = useState<'center' | 'right' | 'left' | 'done'>('center');
  const streamRef = useRef<MediaStream | null>(null);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState<string[]>(['', '', '', '', '', '']);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // We simulate loading metadata and resolving it so UI can be seen instantly
    setLoading(false);
  }, []);

  // Liveness Timer Effect
  useEffect(() => {
    let timer: any;
    if (cameraActive && cameraTimeLeft > 0) {
      timer = setInterval(() => {
        setCameraTimeLeft(prev => {
          if (prev <= 1) {
            stopCamera(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cameraActive, cameraTimeLeft]);

  const stopCamera = (failed = false) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    if (failed) {
      setCaptureStatus('Time expired. Please try again.');
      setLivenessStep('center');
      setFaceEmbedding(null);
    }
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!personalInfo.fullName || !personalInfo.rollNumber || !personalInfo.email || !personalInfo.mobileNumber || !personalInfo.dob || !personalInfo.universityRegistrationNumber) {
        setError('Please fill out all required fields marked with *');
        return;
      }
      if (personalInfo.password !== personalInfo.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (personalInfo.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    if (step === 2) {
      if (!academicInfo.batchId || !academicInfo.sectionId) {
        setError('Please select a valid Batch and Section.');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };
  
  const handlePrev = () => {
    setError('');
    if (cameraActive) stopCamera(false);
    setStep(s => Math.max(s - 1, 1));
  };

  // Step 3: Face Capture & Liveness
  const startCamera = async () => {
    try {
      setFaceEmbedding(null);
      setCameraTimeLeft(40);
      setLivenessStep('center');
      
      setCaptureStatus('Loading AI Models...');
      await loadModels('/models');
      
      setCaptureStatus('Requesting Camera Access...');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        setCaptureStatus('Align face in the center');
        
        let currentLiveness = 'center';
        
        // Start detection loop
        const interval = setInterval(async () => {
          if (!streamRef.current || !videoRef.current) {
            clearInterval(interval);
            return;
          }

          if (videoRef.current && canvasRef.current && videoRef.current.readyState === 4) {
            try {
              const detections = await detectFace(videoRef.current);
              const isGood = drawFaceGuidance(canvasRef.current, videoRef.current, detections);
              
              if (detections && isGood) {
                // Get box and center X relative to display size
                const box = detections.detection.box;
                const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                const centerX = box.x + box.width / 2;
                const centerPoint = displaySize.width / 2;
                
                if (currentLiveness === 'center') {
                  currentLiveness = 'right';
                  setLivenessStep('right');
                  setCaptureStatus('Move face slightly RIGHT');
                } else if (currentLiveness === 'right') {
                  // In a mirrored video, moving head right physically moves it left on screen (lower X)
                  if (centerX < centerPoint - 30) {
                    currentLiveness = 'left';
                    setLivenessStep('left');
                    setCaptureStatus('Now move face slightly LEFT');
                  }
                } else if (currentLiveness === 'left') {
                  // In a mirrored video, moving head left physically moves it right on screen (higher X)
                  if (centerX > centerPoint + 30) {
                    currentLiveness = 'done';
                    setLivenessStep('done');
                    setCaptureStatus('Liveness verified! Capturing...');
                    clearInterval(interval);
                    
                    setTimeout(() => {
                      setFaceEmbedding(Array.from(detections.descriptor));
                      setCaptureStatus('Face captured successfully!');
                      stopCamera(false);
                    }, 1000);
                  }
                }
              }
            } catch (detectErr) {
              console.error("Face detection error:", detectErr);
            }
          }
        }, 150);
      }
    } catch (err: any) {
      console.error("Camera/Model Error:", err);
      setCaptureStatus(`Error: ${err.message || 'Access denied'}`);
      stopCamera(true);
    }
  };

  // OTP Handlers
  const sendOtp = () => {
    setOtpSent(true);
    setOtpValue(['', '', '', '', '', '']);
    // In future: await fetch('/api/send-otp', { email })
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otpValue];
    newOtp[index] = value;
    setOtpValue(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const verifyOtp = () => {
    const code = otpValue.join('');
    if (code.length !== 6) return setError('Please enter a valid 6-digit OTP.');
    
    setVerifyingOtp(true);
    setError('');
    
    // Mock API verification
    setTimeout(() => {
      setVerifyingOtp(false);
      setEmailVerified(true);
      setOtpSent(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!emailVerified) {
      setError("Please verify your email address before submitting.");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/enrollment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalInfo, academicInfo, faceEmbedding })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Enrollment failed');
      
      setSuccessData(data);
      setStep(5);
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative">
        <Fingerprint className="size-12 text-emerald-500 animate-pulse mb-4" />
        <div className="text-xl font-semibold text-muted-foreground">Initializing Enrollment Systems...</div>
      </div>
    );
  }

  const stepsList = [
    { num: 1, name: 'Personal', icon: <UserIcon className="size-4" /> },
    { num: 2, name: 'Academic', icon: <BookOpenIcon className="size-4" /> },
    { num: 3, name: 'Biometric', icon: <CameraIcon className="size-4" /> },
    { num: 4, name: 'Review', icon: <ShieldCheckIcon className="size-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
        <div className="absolute top-0 right-0 h-[800px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <Button variant="ghost" className="absolute top-6 left-6 hover:bg-muted/50 rounded-full px-4 z-20" asChild>
        <Link to="/login">
          <ChevronLeftIcon className='size-4 me-2' /> Back to Login
        </Link>
      </Button>

      <div className="w-full max-w-4xl bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl relative z-10 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Progress */}
        {step < 5 && (
          <div className="w-full md:w-1/3 bg-muted/30 border-r border-border/50 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-12">
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Fingerprint className="size-6 text-emerald-500" />
              </div>
              <p className="text-xl font-bold tracking-tight">VeriSync</p>
            </div>
            
            <h2 className="text-lg font-bold mb-6">Student Registration</h2>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/50 before:to-transparent">
              {stepsList.map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center w-full">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 z-10 transition-colors duration-300",
                        isActive ? "bg-emerald-500 border-emerald-500 text-white shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]" : 
                        isPassed ? "bg-background border-emerald-500 text-emerald-500" : "bg-background border-border text-muted-foreground"
                      )}>
                        {isPassed ? <CheckCircle2Icon className="size-5" /> : s.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className={cn("font-medium", isActive ? "text-foreground" : isPassed ? "text-foreground/80" : "text-muted-foreground")}>{s.name}</h4>
                        <span className="text-xs text-muted-foreground">Step {s.num}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-10 flex flex-col min-h-[500px]">
          {error && step !== 5 && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>{error}
            </div>
          )}

          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Personal Details</h2>
                  <p className="text-sm text-muted-foreground">Provide your accurate personal information for university records.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm">Full Name <span className="text-destructive">*</span></Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.fullName} onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})} placeholder="e.g. John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Roll Number <span className="text-destructive">*</span></Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.rollNumber} onChange={e => setPersonalInfo({...personalInfo, rollNumber: e.target.value})} placeholder="e.g. CS2022001" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email Address <span className="text-destructive">*</span></Label>
                    <Input type="email" className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} placeholder="john.doe@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Mobile Number <span className="text-destructive">*</span></Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.mobileNumber} onChange={e => setPersonalInfo({...personalInfo, mobileNumber: e.target.value})} placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Date of Birth <span className="text-destructive">*</span></Label>
                    <Input type="date" className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.dob} onChange={e => setPersonalInfo({...personalInfo, dob: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Gender <span className="text-destructive">*</span></Label>
                    <select 
                      className="flex h-11 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                      value={personalInfo.gender} 
                      onChange={e => setPersonalInfo({...personalInfo, gender: e.target.value})}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm">University Registration No. <span className="text-destructive">*</span></Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.universityRegistrationNumber} onChange={e => setPersonalInfo({...personalInfo, universityRegistrationNumber: e.target.value})} placeholder="e.g. REG-2022-998811" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Set Password <span className="text-destructive">*</span></Label>
                    <Input type="password" className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.password} onChange={e => setPersonalInfo({...personalInfo, password: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Confirm Password <span className="text-destructive">*</span></Label>
                    <Input type="password" className="h-11 bg-background/50 border-border/50 focus:bg-background" value={personalInfo.confirmPassword} onChange={e => setPersonalInfo({...personalInfo, confirmPassword: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Academic Assignment</h2>
                  <p className="text-sm text-muted-foreground">Select your enrolled batch and section.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-sm">Enrolled Batch <span className="text-destructive">*</span></Label>
                    <select className="flex h-11 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" value={academicInfo.batchId} onChange={e => setAcademicInfo({...academicInfo, batchId: e.target.value})}>
                      <option value="" disabled>Select Batch</option>
                      <option value="1st year(i sem)">1st year(i sem)</option>
                      <option value="1st year(ii sem)">1st year(ii sem)</option>
                      <option value="2nd year (iii sem)">2nd year (iii sem)</option>
                      <option value="2nd year (iv sem)">2nd year (iv sem)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Section Assignment <span className="text-destructive">*</span></Label>
                    <select className="flex h-11 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 text-sm focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors" value={academicInfo.sectionId} onChange={e => setAcademicInfo({...academicInfo, sectionId: e.target.value})}>
                      <option value="" disabled>Select Section</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Admission Year</Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={academicInfo.admissionYear} onChange={e => setAcademicInfo({...academicInfo, admissionYear: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Expected Graduation</Label>
                    <Input className="h-11 bg-background/50 border-border/50 focus:bg-background" value={academicInfo.expectedGraduationYear} onChange={e => setAcademicInfo({...academicInfo, expectedGraduationYear: e.target.value})} />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Biometric Enrollment</h2>
                  <p className="text-sm text-muted-foreground">Capture your facial signature with liveness verification.</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-4">
                  <div className={cn(
                    "relative w-72 h-72 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500",
                    faceEmbedding ? "border-4 border-emerald-500 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] bg-emerald-500/10" : "bg-background border-4 border-border/50 shadow-inner"
                  )}>
                    {!cameraActive && !faceEmbedding && (
                      <div className="text-center p-6 flex flex-col items-center gap-4">
                        <CameraIcon className="size-10 text-muted-foreground/50" />
                        <Button onClick={startCamera} size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
                          Initialize Camera
                        </Button>
                      </div>
                    )}
                    {cameraActive && (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform -scale-x-100" />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full transform -scale-x-100 mix-blend-screen" />
                        
                        {/* Liveness Guide Overlay */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center flex-col z-10 p-4 text-center">
                           <div className="absolute inset-0 border-[40px] border-background/80 rounded-full" />
                           {livenessStep === 'right' && (
                              <div className="animate-pulse flex items-center gap-2 bg-background/90 px-4 py-2 rounded-full mt-40 shadow-lg text-emerald-500 font-bold border border-emerald-500/30">
                                Move Right <ChevronRightIcon className="size-4 animate-bounce" />
                              </div>
                           )}
                           {livenessStep === 'left' && (
                              <div className="animate-pulse flex items-center gap-2 bg-background/90 px-4 py-2 rounded-full mt-40 shadow-lg text-emerald-500 font-bold border border-emerald-500/30">
                                <ChevronLeftIcon className="size-4 animate-bounce" /> Move Left
                              </div>
                           )}
                        </div>
                      </>
                    )}
                    {faceEmbedding && (
                      <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex flex-col items-center justify-center animate-in zoom-in duration-300">
                        <div className="bg-background/90 p-3 rounded-full mb-2">
                          <CheckCircle2Icon className="size-10 text-emerald-500" />
                        </div>
                        <span className="font-bold text-foreground">Verified</span>
                      </div>
                    )}
                  </div>
                  
                  {cameraActive && (
                    <div className="w-full max-w-[200px] space-y-2 animate-in fade-in duration-300">
                       <div className="flex justify-between text-xs text-muted-foreground font-medium">
                         <span>Verification Time</span>
                         <span className={cameraTimeLeft < 10 ? "text-destructive font-bold" : ""}>{cameraTimeLeft}s</span>
                       </div>
                       <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                         <div 
                           className={cn("h-full transition-all duration-1000 ease-linear", cameraTimeLeft < 10 ? "bg-destructive" : "bg-emerald-500")}
                           style={{ width: `${(cameraTimeLeft / 40) * 100}%` }}
                         />
                       </div>
                    </div>
                  )}

                  <div className="h-10 flex items-center justify-center">
                    <p className={cn("text-sm font-medium px-4 py-2 rounded-full", 
                      faceEmbedding ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-foreground"
                    )}>
                      {captureStatus}
                    </p>
                  </div>
                  
                  {faceEmbedding && (
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground" onClick={() => setFaceEmbedding(null)}>
                      Retake Photo
                    </Button>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight mb-1">Review & Verify</h2>
                  <p className="text-sm text-muted-foreground">Verify your email and details before finalizing enrollment.</p>
                </div>
                
                <div className="space-y-5">
                  <div className="bg-background/50 border border-border/50 p-5 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />
                    <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2"><UserIcon className="size-4 text-emerald-500"/> Personal Info</h3>
                      <button onClick={() => setStep(1)} className="text-emerald-500 text-xs font-medium hover:underline">Edit</button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 text-sm">
                      <div><span className="text-muted-foreground block text-xs mb-0.5">Full Name</span> <span className="font-medium">{personalInfo.fullName}</span></div>
                      <div><span className="text-muted-foreground block text-xs mb-0.5">Roll Number</span> <span className="font-medium">{personalInfo.rollNumber}</span></div>
                      
                      {/* Email Verification Section */}
                      <div className="col-span-2 bg-background border border-border/50 p-4 rounded-xl shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                             <div className={cn("p-2 rounded-full shrink-0", emailVerified ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                               <MailIcon className="size-4" />
                             </div>
                             <div className="min-w-0">
                               <span className="text-muted-foreground block text-xs mb-0.5">Registered Email Address</span> 
                               <span className="font-medium block truncate max-w-[200px] sm:max-w-xs">{personalInfo.email}</span>
                             </div>
                          </div>
                          {!emailVerified && !otpSent && (
                             <Button onClick={sendOtp} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 w-full sm:w-auto">Verify Email</Button>
                          )}
                          {emailVerified && (
                             <span className="text-emerald-500 font-bold text-xs flex items-center justify-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full w-full sm:w-auto"><CheckCircle2Icon className="size-4"/> Verified</span>
                          )}
                        </div>

                        {/* OTP Verification UI */}
                        {otpSent && !emailVerified && (
                          <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2 duration-300">
                            <p className="text-xs text-muted-foreground mb-3 font-medium">Enter the 6-digit security code sent to your email.</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex items-center gap-2">
                                {otpValue.map((v, i) => (
                                  <Input 
                                    key={i} id={`otp-${i}`}
                                    value={v} maxLength={1}
                                    onChange={e => handleOtpChange(i, e.target.value)}
                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                    className="w-10 h-12 text-center text-lg font-bold bg-background focus:border-emerald-500 focus:ring-emerald-500/20 transition-all shadow-inner px-1"
                                  />
                                ))}
                              </div>
                              <div className="flex gap-2 w-full sm:w-auto">
                                <Button size="sm" onClick={verifyOtp} disabled={verifyingOtp} className="w-full sm:w-auto bg-foreground text-background hover:bg-foreground/90">
                                  {verifyingOtp ? 'Verifying...' : 'Confirm Code'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={sendOtp} className="w-full sm:w-auto">
                                  <RefreshCwIcon className="size-4 mr-1" /> Resend
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-background/50 border border-border/50 p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-border/50 pb-2">
                      <h3 className="font-semibold text-foreground flex items-center gap-2"><ShieldCheckIcon className="size-4 text-emerald-500"/> Biometric Status</h3>
                      <button onClick={() => setStep(3)} className="text-emerald-500 text-xs font-medium hover:underline">Edit</button>
                    </div>
                    <div className="flex items-center gap-3">
                      {faceEmbedding ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2Icon className="size-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="font-medium text-emerald-500">128D AI Embedding Captured</p>
                            <p className="text-xs text-muted-foreground">Liveness confirmed & ready for verification</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-destructive font-medium text-sm">Biometric profile missing. Please capture your face.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && successData && (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in zoom-in-95 duration-500 py-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full" />
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center relative z-10">
                    <CheckCircle2Icon className="size-10 text-emerald-500" />
                  </div>
                </div>
                
                <div>
                  <h2 className="text-3xl font-bold tracking-tight mb-2">Enrollment Successful!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">Your VeriSync account has been created and your biometric signature is registered securely.</p>
                </div>
                
                <div className="bg-background/50 p-6 rounded-2xl border border-border/50 text-left space-y-4 w-full max-w-sm shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Student ID</p>
                    <p className="font-mono text-xl font-bold tracking-tight">{successData.studentId}</p>
                  </div>
                  <p className="text-xs text-emerald-500/90 font-medium mt-3 bg-emerald-500/10 p-2 rounded flex items-center gap-2">
                    <ShieldCheckIcon className="size-4" /> You can now log in with your email and password.
                  </p>
                </div>
                
                <Button size="lg" className="w-full max-w-sm mx-auto h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 text-base font-semibold transition-all mt-4" onClick={() => navigate('/login')}>
                  Continue to Login <ChevronRightIcon className="size-5 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {step < 5 && (
            <div className="flex justify-between mt-auto pt-6 border-t border-border/50">
              <Button 
                variant="ghost" 
                size="lg"
                onClick={handlePrev} 
                disabled={step === 1 || submitting}
                className={cn("rounded-xl px-6", step === 1 ? "opacity-0 pointer-events-none" : "opacity-100")}
              >
                <ChevronLeftIcon className="size-4 mr-2" /> Back
              </Button>
              
              {step < 4 ? (
                <Button size="lg" onClick={handleNext} className="rounded-xl px-8 bg-foreground text-background hover:bg-foreground/90 font-semibold shadow-md">
                  Next Step <ChevronRightIcon className="size-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  onClick={handleSubmit} 
                  disabled={!faceEmbedding || !emailVerified || submitting}
                  className={cn("rounded-xl px-8 shadow-lg font-semibold transition-all", 
                     (!faceEmbedding || !emailVerified) ? "bg-muted text-muted-foreground" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  )}
                >
                  {submitting ? 'Submitting...' : 'Finish Enrollment'} 
                  {!submitting && <CheckCircle2Icon className="size-4 ml-2" />}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

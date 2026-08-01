import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Fingerprint, Camera, KeyRound, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Navbar Placeholder */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <Fingerprint className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">VeriSync</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            AI-Powered Attendance is Live
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Frictionless Attendance for Modern Education.
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Replace manual roll calls with seamless face recognition, QR codes, and end-to-end verification. The intelligent OS for your institution's time and attendance.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12 px-8 text-base">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              View Documentation
            </Button>
          </div>
        </motion.div>

        {/* Feature Grid / Attendance Methods */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mt-32"
        >
          {[
            { icon: Camera, title: 'Face Recognition', desc: 'Live camera verification with AI anti-spoofing.' },
            { icon: Fingerprint, title: 'E2E Verification', desc: 'Secure institutional scope and boundary checking.' },
            { icon: KeyRound, title: 'OTP Attendance', desc: 'Time-bound one-time passwords for large halls.' },
            { icon: Clock, title: 'Real-time Tracking', desc: 'Instant insights for teachers and administrators.' }
          ].map((feature, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm text-left hover:border-primary/50 transition-colors">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Decorative Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
    </div>
  );
}

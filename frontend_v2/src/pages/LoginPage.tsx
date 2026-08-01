import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AtSignIcon,
  ChevronLeftIcon,
  Fingerprint,
  LockIcon,
  UserPlusIcon,
  LogInIcon
} from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/${role}`);
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2 bg-background">
      {/* LEFT COLUMN - BRANDING (Hidden on Mobile) */}
      <div className="bg-muted/30 relative hidden h-full flex-col border-r border-border/50 p-12 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Fingerprint className="size-8 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold tracking-tight">VeriSync</p>
        </div>
        <div className="z-10 mt-auto mb-12">
          <blockquote className="space-y-4">
            <p className="text-2xl font-medium leading-relaxed tracking-tight text-foreground/90">
              &ldquo;VeriSync has completely transformed our campus operations. Attendance is now automated, highly secure, and instantly actionable.&rdquo;
            </p>
            <footer className="flex flex-col">
              <span className="font-semibold text-foreground">Dr. Bhawna Sinha(HOD)</span>
              <span className="font-mono text-sm text-emerald-500">Ph.D, M.Phil, MCA, MBA</span>
            </footer>
          </blockquote>
        </div>
        <FloatingPaths />
      </div>

      {/* RIGHT COLUMN - LOGIN FORM */}
      <div className="relative flex min-h-screen flex-col justify-center p-6 md:p-12">
        {/* Background Gradients */}
        <div aria-hidden className="absolute inset-0 isolate contain-strict -z-10 opacity-60">
          <div className="absolute top-0 right-0 h-[800px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full bg-emerald-500/5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 rounded-full bg-primary/5 blur-[120px]" />
        </div>
        
        <Button variant="ghost" className="absolute top-8 left-8 hover:bg-muted/50 rounded-full px-4" asChild>
          <Link to="/">
            <ChevronLeftIcon className='size-4 me-2' />
            Home
          </Link>
        </Button>
        
        <div className="mx-auto w-full max-w-[420px] space-y-8 mt-12 md:mt-0">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="p-2 bg-emerald-500/10 rounded-xl">
              <Fingerprint className="size-6 text-emerald-500" />
            </div>
            <p className="text-xl font-bold tracking-tight">VeriSync</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {role === 'student' ? 'Student Portal' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {role === 'student' 
                ? 'Sign in or create your student account.' 
                : 'Sign in to access your administrative dashboard.'}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1.5 bg-muted/50 rounded-xl border border-border/50">
            {(['admin', 'teacher', 'student'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 ${
                  role === r 
                    ? 'bg-background shadow-md text-foreground ring-1 ring-border/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  placeholder={`your.${role}@institution.edu`}
                  className="peer ps-10 h-12 rounded-xl bg-background/50 border-border/50 focus:bg-background transition-colors"
                  type="email"
                  required
                />
                <div className="text-muted-foreground absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 peer-focus:text-foreground transition-colors">
                  <AtSignIcon className="size-5" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <a href="#" className="text-sm text-muted-foreground hover:text-emerald-500 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  className="peer ps-10 h-12 rounded-xl bg-background/50 border-border/50 focus:bg-background transition-colors"
                  type="password"
                  required
                />
                <div className="text-muted-foreground absolute inset-y-0 start-0 flex items-center justify-center ps-3.5 peer-focus:text-foreground transition-colors">
                  <LockIcon className="size-5" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Button type="submit" size="lg" className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 text-base font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
                <LogInIcon className="size-4 me-2" />
                Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
              
              {role === 'student' && (
                <Link to="/register" className="w-full block">
                  <Button type="button" variant="outline" size="lg" className="w-full h-12 rounded-xl border-border/50 bg-background/30 hover:bg-muted text-base font-semibold transition-all">
                    <UserPlusIcon className="size-4 me-2" />
                    Register New Account
                  </Button>
                </Link>
              )}
            </div>
          </form>

          {role === 'student' && (
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>
          )}

          {role === 'student' && (
            <Button type="button" variant="outline" size="lg" className="w-full h-12 rounded-xl border-border/50 bg-background/50 hover:bg-muted text-base font-medium transition-all">
              <GoogleIcon className='size-5 me-2' />
              Google
            </Button>
          )}

          <p className="text-muted-foreground text-sm text-center leading-relaxed pb-8">
            By continuing, you agree to our{' '}
            <a href="#" className="hover:text-emerald-500 underline underline-offset-4 font-medium transition-colors">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="hover:text-emerald-500 underline underline-offset-4 font-medium transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

// ---------------- BACKGROUND ANIMATION ----------------
function FloatingPaths() {
  // Pure CSS animation for 60fps buttery smooth performance without React state overhead
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 8} -${189 + i * 10}C-${
      380 - i * 8
    } -${189 + i * 10} -${312 - i * 8} ${216 - i * 10} ${
      152 - i * 8
    } ${343 - i * 10}C${616 - i * 8} ${470 - i * 10} ${
      684 - i * 8
    } ${875 - i * 10} ${684 - i * 8} ${875 - i * 10}`,
    width: 0.5 + i * 0.04,
    opacity: 0.05 + i * 0.02,
    dashArray: 1000 + i * 50,
    duration: 15 + Math.random() * 20,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes dashFlow {
          0% { stroke-dashoffset: 2000; }
          100% { stroke-dashoffset: 0; }
        }
        .path-flow {
          animation: dashFlow linear infinite;
        }
      `}</style>
      <svg
        className="h-full w-full text-foreground"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            strokeDasharray={path.dashArray}
            className="path-flow"
            style={{ animationDuration: `${path.duration}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <g>
      <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
    </g>
  </svg>
);

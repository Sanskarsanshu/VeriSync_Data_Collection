import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Fingerprint } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('admin');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login redirect based on role
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-card/60 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Fingerprint className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome Back</h2>
          <p className="text-sm text-muted-foreground">
            Sign in to access your VeriSync dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg mb-6">
          {(['admin', 'teacher', 'student'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`text-sm font-medium py-2 rounded-md transition-all ${
                role === r 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder={`Enter your ${role} email`} 
              required 
              className="bg-background/50 h-11"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Forgot password?
              </a>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="bg-background/50 h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 mt-2">
            Sign In
          </Button>
        </form>

        {role === 'student' && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}

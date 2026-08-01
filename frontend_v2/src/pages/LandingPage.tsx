import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Fingerprint, Camera, KeyRound, Clock, 
  ShieldCheck, Zap, Users, LayoutDashboard, ChevronDown, 
  CheckCircle2, Github, Twitter, Linkedin
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      
      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <Fingerprint className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight">VeriSync</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-foreground text-background hover:bg-foreground/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center justify-center text-center relative z-10">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center rounded-full border border-border bg-background/50 backdrop-blur-md px-3 py-1 text-sm mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            VeriSync AI Engine v2.0 is Live
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Frictionless Attendance for Modern Education.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Replace manual roll calls with seamless face recognition, dynamic QR codes, and end-to-end verification. The intelligent OS for your institution.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/login">
              <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/5">
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
              Book a Demo
            </Button>
          </div>
        </motion.div>

        {/* ---------------- DASHBOARD PREVIEW ---------------- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full mt-24 rounded-2xl md:rounded-[32px] border border-border/50 bg-card/30 p-2 md:p-4 backdrop-blur-xl shadow-2xl"
        >
          <div className="rounded-xl md:rounded-[24px] overflow-hidden border border-border/50 bg-background flex flex-col aspect-[16/9] md:aspect-[21/9]">
            {/* Mock Window Header */}
            <div className="h-12 border-b border-border/50 flex items-center px-4 gap-2 bg-muted/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto bg-background border border-border rounded-md px-32 py-1 text-xs text-muted-foreground shadow-sm">
                admin.verisync.edu
              </div>
            </div>
            {/* Mock Dashboard Content */}
            <div className="flex-1 p-6 flex gap-6 bg-muted/10">
              {/* Mock Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-2">
                <div className="h-8 rounded bg-border/50 w-full mb-4" />
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 rounded bg-border/30 w-3/4" />
                ))}
              </div>
              {/* Mock Main Content */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="h-8 rounded bg-border/50 w-48" />
                  <div className="h-8 rounded bg-emerald-500/20 w-32" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 rounded-xl border border-border/50 bg-background shadow-sm p-4 flex flex-col justify-between">
                      <div className="h-4 w-1/2 bg-border/50 rounded" />
                      <div className="h-8 w-1/3 bg-foreground/10 rounded mt-2" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded-xl border border-border/50 bg-background shadow-sm mt-4" />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="w-full py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The VeriSync Workflow</h2>
            <p className="text-muted-foreground text-lg">A seamless pipeline from student enrollment to automated daily reporting.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enrollment', desc: 'Secure facial data extraction and identity verification mapped to institutional records.' },
              { step: '02', title: 'Capture', desc: 'Teachers launch AI sessions. Students are marked present instantly via Edge AI processing.' },
              { step: '03', title: 'Analytics', desc: 'Real-time synchronization with Admin dashboards for actionable attendance insights.' }
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-all">
                <div className="text-5xl font-bold text-muted/50 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ATTENDANCE METHODS (FEATURES) ---------------- */}
      <section id="features" className="w-full py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Omnichannel Attendance</h2>
            <p className="text-lg text-muted-foreground">
              VeriSync adapts to your infrastructure. Whether you have IoT cameras, smartboards, or just smartphones, we have a secure method for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Camera, title: 'Face Recognition', desc: 'Sub-second AI face matching with robust anti-spoofing and liveness detection.', color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { icon: LayoutDashboard, title: 'Dynamic QR', desc: 'Time-rotating QR codes projected on smartboards to prevent proxy scanning.', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { icon: KeyRound, title: 'Secure OTP', desc: 'Location-bound One Time Passwords for massive lecture halls with 500+ students.', color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { icon: Fingerprint, title: 'Manual Override', desc: 'Granular control for faculty to adjust attendance for exceptions and late arrivals.', color: 'text-amber-500', bg: 'bg-amber-500/10' }
            ].map((feature, idx) => (
              <div key={idx} className="group p-6 rounded-3xl border border-border bg-card hover:bg-muted/20 transition-all cursor-default">
                <div className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- BENTO GRID (MORE FEATURES) ---------------- */}
      <section className="w-full py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card */}
            <div className="md:col-span-2 rounded-3xl border border-border bg-background p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-md">
                <ShieldCheck className="h-8 w-8 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Enterprise-Grade Security</h3>
                <p className="text-muted-foreground">SOC2 compliant architecture with AES-256 encryption for all biometric data. Strict RBAC for Admin, Teacher, and Student roles.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-colors" />
            </div>
            
            {/* Small Card */}
            <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between">
              <div>
                <Zap className="h-8 w-8 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
                <p className="text-muted-foreground text-sm">Offline-first architecture that syncs the moment network is restored.</p>
              </div>
            </div>

            {/* Small Card */}
            <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between">
              <div>
                <Clock className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Automated Reports</h3>
                <p className="text-muted-foreground text-sm">Daily, weekly, and semester-end PDF/CSV exports directly to your inbox.</p>
              </div>
            </div>

            {/* Large Card */}
            <div className="md:col-span-2 rounded-3xl border border-border bg-background p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-md">
                <Users className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Leave Management</h3>
                <p className="text-muted-foreground">Integrated workflow for students to request leaves with document attachments, and instant approval streams for faculty.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section id="testimonials" className="w-full py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by Institutions</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "VeriSync eliminated proxy attendance completely. Our faculty saves 15 minutes every lecture.", author: "Dr. A. Kumar", role: "Dean of Academics" },
              { quote: "The face recognition accuracy is astounding, even in poorly lit lecture halls. Highly recommended.", author: "Prof. S. Sharma", role: "Head of Computer Science" },
              { quote: "Setup took just two days. The integration with our existing student database was flawless.", author: "R. Verma", role: "IT Administrator" }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-3xl border border-border bg-card">
                <div className="flex gap-1 text-amber-500 mb-6">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-lg mb-6 leading-relaxed">"{t.quote}"</p>
                <div>
                  <p className="font-semibold">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section id="pricing" className="w-full py-24 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground">Tailored plans for institutions of all sizes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-3xl border border-border bg-background flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Department</h3>
              <p className="text-muted-foreground text-sm mb-6">Perfect for single departments.</p>
              <div className="mb-6"><span className="text-4xl font-bold">$99</span><span className="text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Up to 500 Students', 'Face & QR Attendance', 'Basic Analytics', 'Email Support'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3" />{feature}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>
            
            {/* Pro */}
            <div className="p-8 rounded-3xl border-2 border-primary bg-background flex flex-col relative shadow-xl shadow-primary/10 scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Institution</h3>
              <p className="text-muted-foreground text-sm mb-6">Full campus deployment.</p>
              <div className="mb-6"><span className="text-4xl font-bold">$299</span><span className="text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Up to 5,000 Students', 'All Attendance Methods', 'Advanced Analytics & Exports', 'Custom Roles (RBAC)', 'Priority Support'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-primary mr-3" />{feature}</li>
                ))}
              </ul>
              <Button className="w-full">Start Free Trial</Button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl border border-border bg-background flex flex-col">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-muted-foreground text-sm mb-6">For universities & multi-campus.</p>
              <div className="mb-6"><span className="text-4xl font-bold">Custom</span></div>
              <ul className="space-y-3 mb-8 flex-1">
                {['Unlimited Students', 'API Access', 'Dedicated Success Manager', 'Custom Integrations (ERP)', 'SLA Guarantee'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3" />{feature}</li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="w-full py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How does the AI face recognition handle identical twins?", a: "Our AI model utilizes 3D depth mapping and micro-expression analysis to differentiate between extremely similar facial structures with 99.8% accuracy." },
              { q: "What hardware is required?", a: "No proprietary hardware is needed. Faculty can use their existing smartphones or tablets, or use standard webcams installed in lecture halls." },
              { q: "Is the student data secure?", a: "Yes. Face encodings are hashed and encrypted. We do not store actual images of students after the encoding is generated, ensuring complete privacy compliance." },
              { q: "Can we integrate with our existing ERP?", a: "VeriSync offers robust REST APIs and webhooks on the Enterprise plan to sync seamlessly with systems like Banner, Workday, or custom ERPs." }
            ].map((faq, i) => (
              <details key={i} className="group p-6 rounded-2xl border border-border bg-card cursor-pointer">
                <summary className="font-semibold text-lg flex justify-between items-center list-none">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA / FOOTER ---------------- */}
      <footer className="w-full border-t border-border/50 bg-muted/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to upgrade your institution?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join the next generation of academic administration.</p>
          <Link to="/login">
            <Button size="lg" className="h-12 px-8 text-base bg-foreground text-background hover:bg-foreground/90">
              Get Started Now
            </Button>
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Fingerprint className="h-5 w-5 text-emerald-500" />
              <span className="text-lg font-bold">VeriSync</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Building the future of academic operations.</p>
            <div className="flex gap-4 text-muted-foreground">
              <Twitter className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Github className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 hover:text-foreground cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Features</a></li>
              <li><a href="#" className="hover:text-foreground">Integrations</a></li>
              <li><a href="#" className="hover:text-foreground">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="hover:text-foreground">API Reference</a></li>
              <li><a href="#" className="hover:text-foreground">Blog</a></li>
              <li><a href="#" className="hover:text-foreground">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground">Data Processing</a></li>
              <li><a href="#" className="hover:text-foreground">Security</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© 2026 VeriSync Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>System Status: <span className="text-emerald-500 font-medium">All systems operational</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

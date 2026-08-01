
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Fingerprint, Clock, 
  ShieldCheck, Zap, Users, ChevronDown, 
  Globe, Mail, Sun, Moon, Menu, X
} from 'lucide-react';
import { CinematicAttendanceSection } from '@/components/ui/cinematic-attendance-scroll-section';
import { Footer } from '@/components/ui/modem-animated-footer';
import { TeamSection } from '@/components/ui/team-section';
import { useState, useEffect } from 'react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('theme') === 'dark' || 
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const teamMembers = [
    {
      name: "Sanskriti Kumari",
      designation: "25MCA02811",
      imageSrc: "/features/sanskriti.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Muskan Kumari",
      designation: "25MCA02799",
      imageSrc: "/features/muskan.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Richa Kumari",
      designation: "25MCA02806",
      imageSrc: "/features/richa.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Mansi Pandey",
      designation: "25MCA02797",
      imageSrc: "/features/mansi.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Ayushi Sharma",
      designation: "25MCA02791",
      imageSrc: "/features/ayushi.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Tannu Kumari",
      designation: "25MCA02819",
      imageSrc: "/features/tannu.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    },
    {
      name: "Komal Kumari",
      designation: "25MCA02796",
      imageSrc: "/features/komal.png",
      socialLinks: [{ icon: Globe, href: "#" }, { icon: Mail, href: "#" }],
    }
  ];

  const coordinator = {
    name: "Ms. Richa Verma",
    designation: "MCA, M.Phil, B.LIS, Ph.D.(Pursuing)",
    imageSrc: "/features/richa_verma.png",
    rolePrefix: "Mentored by"
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      
      {/* ---------------- NAVIGATION ---------------- */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between relative">
            <div className="flex items-center gap-2 cursor-pointer">
              <Fingerprint className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold tracking-tight">VeriSync</span>
            </div>
            
            <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full">
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
              </Button>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">Student Registration</Button>
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full">
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-700" />}
              </Button>
              <button
                type="button"
                className="text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 animate-in slide-in-from-top-4 duration-300 ease-out">
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">Sign In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-start bg-foreground text-background hover:bg-foreground/90">Student Registration</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ---------------- HERO SECTION ---------------- */}
      <main 
        className="flex-1 w-full max-w-7xl mx-auto px-6 pt-32 md:pt-40 pb-20 flex flex-col items-center justify-start text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out"
      >
        <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-sm max-w-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
          <span className="text-xs text-center whitespace-nowrap text-muted-foreground">
            VeriSync Phase 2 is now live!
          </span>
          <a
            href="#features"
            className="flex items-center gap-1 text-xs hover:text-foreground transition-all active:scale-95 whitespace-nowrap text-muted-foreground font-medium"
          >
            Read more
            <ArrowRight size={12} />
          </a>
        </aside>

        <h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-center max-w-4xl px-6 leading-[1.1] mb-6 tracking-tighter"
          style={{
            background: "linear-gradient(to bottom, hsl(var(--foreground)), hsl(var(--foreground)), hsl(var(--foreground) / 0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Smart Attendance <br />for Your Institution
        </h1>

        <p className="text-sm md:text-lg text-center max-w-2xl px-6 mb-10 text-muted-foreground leading-relaxed">
          Replace manual roll calls with seamless face recognition, dynamic QR codes, and secure OTP verification. Designed for modern classrooms.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-16 md:mb-24">
          <Link to="/register">
            <Button size="lg" className="rounded-lg flex items-center justify-center h-12 px-8 bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20">
              Get started
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="rounded-lg flex items-center justify-center h-12 px-8 bg-background/50 backdrop-blur-sm">
              Faculty Login
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-5xl relative pb-20">
          <div
            className="absolute left-1/2 w-[120%] md:w-[90%] pointer-events-none z-0"
            style={{
              top: "-23%",
              transform: "translateX(-50%)"
            }}
            aria-hidden="true"
          >
            <img
              src="https://i.postimg.cc/Ss6yShGy/glows.png"
              alt=""
              className="w-full h-auto opacity-70 dark:opacity-100 mix-blend-screen"
              loading="eager"
            />
          </div>
          
          <div className="relative z-10 rounded-xl md:rounded-[24px] border border-border/50 bg-card/30 p-2 md:p-4 backdrop-blur-xl shadow-2xl">
            <div className="rounded-lg md:rounded-2xl overflow-hidden border border-border/50 bg-background">
              <img
                src="/features/dashbord image.png"
                alt="Dashboard preview showing analytics and metrics interface"
                className="w-full h-auto"
                loading="eager"
              />
            </div>
          </div>
        </div>
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
              { step: '02', title: 'Capture', desc: 'Teachers launch sessions. Students are marked present instantly via face recognition, QR, or OTP.' },
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
      <CinematicAttendanceSection />

      {/* ---------------- BENTO GRID (MORE FEATURES) ---------------- */}
      <section className="w-full py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card */}
            <div className="md:col-span-2 rounded-3xl border border-border bg-background p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-md">
                <ShieldCheck className="h-8 w-8 text-emerald-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Secure & Reliable</h3>
                <p className="text-muted-foreground">Strict Role-Based Access Control (RBAC) ensuring Admin, Teacher, and Student profiles only access authorized data.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full group-hover:bg-emerald-500/30 transition-colors" />
            </div>
            
            {/* Small Card */}
            <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between">
              <div>
                <Zap className="h-8 w-8 text-amber-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Real-Time Sync</h3>
                <p className="text-muted-foreground text-sm">Attendance data is synchronized instantly across the platform for live reporting.</p>
              </div>
            </div>

            {/* Small Card */}
            <div className="rounded-3xl border border-border bg-background p-8 flex flex-col justify-between">
              <div>
                <Clock className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Detailed Reports</h3>
                <p className="text-muted-foreground text-sm">Comprehensive attendance tracking, shortage alerts, and detailed student metrics.</p>
              </div>
            </div>

            {/* Large Card */}
            <div className="md:col-span-2 rounded-3xl border border-border bg-background p-8 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-md">
                <Users className="h-8 w-8 text-purple-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Correction Workflow</h3>
                <p className="text-muted-foreground">Integrated workflow for students to request attendance corrections, and instant approval streams for faculty and admins.</p>
              </div>
              <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TEAM SECTION ---------------- */}
      <TeamSection
        title="TEAM"
        description="Meet the minds behind VeriSync. Our team is dedicated to building secure, modern, and reliable attendance solutions."
        members={teamMembers}
        coordinator={coordinator}
      />

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="w-full py-32">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How do students register their biometric data?", a: "Students use the dedicated registration portal to securely capture their facial features, which is then mapped to their institutional roll number." },
              { q: "Can teachers edit attendance after a session?", a: "Yes, faculty members have granular control to update, correct, or manually mark attendance through their dashboard." },
              { q: "What happens if a student misses a class by mistake?", a: "Students can submit a formal attendance correction request through their portal, which is then reviewed by the respective faculty or administrator." },
              { q: "Are the QR codes and OTPs secure?", a: "Both QR codes and OTPs are time-bound and generated dynamically for each session to prevent proxy attendance." }
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
      <Footer
        brandName="VeriSync"
        brandDescription="Smart Attendance for modern institutions. Replacing manual roll calls with seamless biometric and cryptographic verification."
        socialLinks={[
          { icon: <Globe className="w-6 h-6" />, href: "#", label: "Website" },
          { icon: <Mail className="w-6 h-6" />, href: "mailto:contact@verisync.com", label: "Email" },
        ]}
        navLinks={[
          { label: "Features", href: "#features" },
          { label: "How it Works", href: "#how-it-works" },
          { label: "FAQ", href: "#faq" },
          { label: "Login", href: "/login" },
        ]}
        creatorName="VeriSync Team"
        creatorUrl="#"
        brandIcon={<Fingerprint className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />}
      />
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, Users, BookOpen, Clock, 
  Calendar, ShieldCheck, Settings, Fingerprint 
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'teacher' | 'student';
}

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();

  const navItems = {
    admin: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Student Enrollment', href: '/admin/student-enrollment', icon: Users },
      { name: 'Departments', href: '/admin/departments', icon: BookOpen },
      { name: 'Timetable', href: '/admin/timetable', icon: Calendar },
      { name: 'Attendance', href: '/admin/attendance', icon: Clock },
      { name: 'Security', href: '/admin/security', icon: ShieldCheck },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
    teacher: [
      { name: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
      { name: 'My Classes', href: '/teacher/classes', icon: BookOpen },
      { name: 'Take Attendance', href: '/teacher/attendance', icon: Clock },
      { name: 'Students', href: '/teacher/students', icon: Users },
      { name: 'Settings', href: '/teacher/settings', icon: Settings },
    ],
    student: [
      { name: 'Dashboard', href: '/student', icon: LayoutDashboard },
      { name: 'My Attendance', href: '/student/attendance', icon: Clock },
      { name: 'Timetable', href: '/student/timetable', icon: Calendar },
      { name: 'Settings', href: '/student/settings', icon: Settings },
    ]
  };

  const links = navItems[role] || navItems.student;
  const { isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => toggleSidebar()}
        />
      )}
      <aside className={`h-screen z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'fixed inset-y-0 left-0 w-64' : 'hidden md:flex w-64'} border-r border-border bg-card/50 backdrop-blur-md flex-col sticky top-0`}>
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Fingerprint className="h-6 w-6 text-emerald-500 mr-2" />
        <span className="font-bold tracking-tight text-lg">VeriSync</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {role} Menu
        </div>
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <span className="text-emerald-500 font-bold text-xs">{role[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm font-medium leading-none mb-1 capitalize">{role} User</p>
            <p className="text-xs text-muted-foreground">Demo Account</p>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}

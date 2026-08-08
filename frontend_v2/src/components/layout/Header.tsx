import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from '@/store/useAppStore';
import { teacherProfilesData } from '@/data/teacherProfiles';

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " yrs ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " mos ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hrs ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}

export function Header() {
  const { notifications, markAllNotificationsRead, toggleSidebar, user } = useAppStore();
  const unreadCount = notifications.filter(n => !n.read).length;

  let teacherAvatar = '';
  let teacherTitle = 'TEACHER';
  
  if (user?.role === 'teacher') {
    const profile = Object.values(teacherProfilesData).find(
      (t) => t.email.toLowerCase() === user.email?.toLowerCase()
    );
    if (profile) {
      teacherAvatar = profile.image || '';
      teacherTitle = profile.designation.split('/')[0].trim().toUpperCase() || 'TEACHER';
    } else {
      teacherAvatar = '/features/praveen.png'; // fallback
    }
  }

  // Convert the global user state into the Profile format expected by ProfileDropdown
  const profileData = user ? {
    name: user.name,
    email: user.email || '',
    title: user.role === 'admin' ? 'HOD' : teacherTitle,
    avatar: user.role === 'admin' ? '/features/Bhawnasinha.png' : 
            user.role === 'teacher' ? teacherAvatar : 
            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=10b981&color=fff`
  } : undefined;

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 w-full max-w-md">
        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search students, courses..." 
            className="w-full pl-9 bg-muted/30 border-border/50 h-9" 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu onOpenChange={(open) => { if(!open) markAllNotificationsRead(); }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-emerald-500 border border-background"></span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 bg-card border-border rounded-xl shadow-lg mt-2">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Recent Alerts {unreadCount > 0 && `(${unreadCount})`}</h3>
              <Link to="/admin/corrections" className="text-xs text-emerald-500 hover:underline">View All</Link>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No new notifications
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className={`p-4 border-b border-border/50 focus:bg-muted cursor-pointer flex flex-col items-start gap-1 ${!notif.read ? 'bg-muted/20' : ''}`}>
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-semibold text-sm ${
                        notif.type === 'success' ? 'text-emerald-500' :
                        notif.type === 'warning' ? 'text-amber-500' :
                        notif.type === 'error' ? 'text-red-500' : 'text-blue-500'
                      }`}>
                        {notif.title}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatTimeAgo(notif.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="h-6 w-px bg-border mx-2"></div>
        <ProfileDropdown data={profileData} />
      </div>
    </header>
  );
}

import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4 w-full max-w-md">
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
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-emerald-500 border border-background"></span>
        </Button>
      </div>
    </header>
  );
}

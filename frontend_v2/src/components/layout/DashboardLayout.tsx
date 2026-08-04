import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TwoLevelSidebar } from './TwoLevelSidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'admin' | 'teacher' | 'student';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {role === 'admin' ? <TwoLevelSidebar /> : <Sidebar role={role} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

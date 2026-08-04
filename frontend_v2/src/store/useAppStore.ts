import { create } from 'zustand';

export type NotificationType = 'success' | 'warning' | 'info' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
}

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  user: {
    id: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
  } | null;
  setUser: (user: AppState['user']) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllNotificationsRead: () => void;
  latestNotification: AppNotification | null;
  clearLatestNotification: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  user: null,
  setUser: (user) => set({ user }),
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 
         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  notifications: [
    {
      id: 'mock-1',
      title: 'Suspicious Activity Detected',
      message: 'Multiple manual overrides requested in MCA Semester I within 5 minutes.',
      type: 'warning',
      timestamp: new Date(Date.now() - 10 * 60000), // 10 mins ago
      read: false
    },
    {
      id: 'mock-2',
      title: 'Attendance Shortage',
      message: '45 students have fallen below the 75% threshold this week.',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      read: false
    }
  ],
  latestNotification: null,
  addNotification: (notif) => set((state) => {
    const newNotif = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      read: false
    };
    return {
      notifications: [newNotif, ...state.notifications],
      latestNotification: newNotif
    };
  }),
  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearLatestNotification: () => set({ latestNotification: null }),
}));

// Initialize theme on load
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

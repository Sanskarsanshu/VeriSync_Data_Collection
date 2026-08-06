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
    email?: string;
  } | null;
  setUser: (user: AppState['user']) => void;
  logout: () => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllNotificationsRead: () => void;
  latestNotification: AppNotification | null;
  clearLatestNotification: () => void;
}

// Rehydrate user from sessionStorage for immediate UI render on hard refresh.
// The ProtectedRoute still verifies with /api/auth/me on every mount for true security.
const persistedUser = (() => {
  try {
    const raw = sessionStorage.getItem('verisync_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  user: persistedUser,
  setUser: (user) => {
    // Persist to sessionStorage so role survives F5 refresh while tab is open
    if (user) {
      sessionStorage.setItem('verisync_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('verisync_user');
    }
    set({ user });
  },
  logout: async () => {
    try {
      // Tell backend to clear the HttpOnly cookie
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      sessionStorage.removeItem('verisync_user');
      set({ user: null });
    }
  },
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
      timestamp: new Date(Date.now() - 10 * 60000),
      read: false
    },
    {
      id: 'mock-2',
      title: 'Attendance Shortage',
      message: '45 students have fallen below the 75% threshold this week.',
      type: 'info',
      timestamp: new Date(Date.now() - 2 * 3600000),
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

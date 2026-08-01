import { create } from 'zustand';

interface AppState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  user: {
    id: string;
    role: 'admin' | 'teacher' | 'student';
    name: string;
  } | null;
  setUser: (user: AppState['user']) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  user: null,
  setUser: (user) => set({ user }),
}));

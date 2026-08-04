import { create } from 'zustand';

export type LiveSession = {
  id: string;
  course: string;
  teacher: string;
  section: string;
  type: string;
  startTime: number; // timestamp
  present: number;
  total: number;
};

export type FeedEvent = {
  id: string;
  name: string;
  event: string;
  timestamp: number;
  iconType: 'verified' | 'otp' | 'anomaly';
  color: 'emerald' | 'red';
};

interface LiveState {
  activeSessions: LiveSession[];
  liveFeed: FeedEvent[];

  startSession: (session: Omit<LiveSession, 'id' | 'startTime' | 'present'>) => void;
  endSession: (id: string) => void;
  logScan: (sessionId: string, studentName: string, type: 'verified' | 'otp') => void;
  logAnomaly: (studentName: string, eventDetails: string) => void;
}

export const useLiveStore = create<LiveState>()((set) => ({
  activeSessions: [],
  liveFeed: [],

  startSession: (sessionData) => set((state) => {
    const newSession: LiveSession = {
      ...sessionData,
      id: `SES-${Date.now()}`,
      startTime: Date.now(),
      present: 0,
    };
    return { activeSessions: [newSession, ...state.activeSessions] };
  }),

  endSession: (id) => set((state) => ({
    activeSessions: state.activeSessions.filter(s => s.id !== id)
  })),

  logScan: (sessionId, studentName, type) => set((state) => {
    // Increment present count for the session
    const updatedSessions = state.activeSessions.map(s => {
      if (s.id === sessionId) {
        return { ...s, present: Math.min(s.present + 1, s.total) };
      }
      return s;
    });

    // Add feed event
    const newEvent: FeedEvent = {
      id: `EVT-${Date.now()}-${Math.random()}`,
      name: studentName,
      event: type === 'verified' ? 'Face Verified' : 'OTP Verified',
      timestamp: Date.now(),
      iconType: type,
      color: 'emerald'
    };

    // Keep only last 50 events to avoid memory bloat
    const updatedFeed = [newEvent, ...state.liveFeed].slice(0, 50);

    return { activeSessions: updatedSessions, liveFeed: updatedFeed };
  }),

  logAnomaly: (studentName, eventDetails) => set((state) => {
    const newEvent: FeedEvent = {
      id: `EVT-${Date.now()}-${Math.random()}`,
      name: studentName,
      event: eventDetails,
      timestamp: Date.now(),
      iconType: 'anomaly',
      color: 'red'
    };
    return { liveFeed: [newEvent, ...state.liveFeed].slice(0, 50) };
  }),
}));

/**
 * ProtectedRoute.tsx
 *
 * This component is the frontend's security gate for any route that requires
 * authentication. It works in tandem with the backend's HttpOnly cookie strategy:
 *
 * Flow:
 *  1. Component mounts → calls GET /api/auth/me (browser auto-sends the
 *     'verisync_session' HttpOnly cookie — JS code cannot read or forge it).
 *  2. Backend validates the JWT inside the cookie:
 *       - Valid cookie + correct role → renders children ✅
 *       - Missing/expired cookie → 401 → redirect to /login ❌
 *       - Valid cookie but wrong role → redirect to /login with an error ❌
 *  3. Zustand store is re-hydrated with fresh user data (name, role, email)
 *     so all child components always have accurate session info.
 *
 * Why this is secure:
 *  - Typing /admin in the address bar sends the request to this component first.
 *  - It does NOT rely on localStorage / JS-accessible tokens (XSS-safe).
 *  - The backend is the single source of truth — the frontend cannot "fake" auth.
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Fingerprint } from 'lucide-react';

type AllowedRole = 'admin' | 'teacher' | 'student';

interface ProtectedRouteProps {
  /** The role that is allowed to view this route */
  requiredRole: AllowedRole;
  children: React.ReactNode;
}

type AuthStatus = 'checking' | 'authorized' | 'unauthorized' | 'wrong-role';

export default function ProtectedRoute({ requiredRole, children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<AuthStatus>('checking');
  const { setUser } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '/api';
        const token = sessionStorage.getItem('verisync_token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include', // sends the HttpOnly cookie automatically
          headers,
        });

        if (cancelled) return;

        if (res.status === 401) {
          // Cookie missing or expired
          setStatus('unauthorized');
          return;
        }

        if (!res.ok) {
          setStatus('unauthorized');
          return;
        }

        const data = await res.json();
        const backendRole = (data.role as string).toLowerCase() as AllowedRole;

        if (backendRole !== requiredRole) {
          // Authenticated but wrong role (e.g. teacher trying to access /admin)
          setStatus('wrong-role');
          return;
        }

        // ✅ Valid session + correct role — hydrate the store
        setUser({
          id: data.id,
          role: backendRole,
          name: data.name,
          email: data.email,
        });

        setStatus('authorized');
      } catch {
        if (!cancelled) setStatus('unauthorized');
      }
    }

    verifySession();
    return () => { cancelled = true; };
  }, [requiredRole, setUser]);

  // --- Render states ---

  if (status === 'checking') {
    return <AuthLoadingScreen />;
  }

  if (status === 'unauthorized') {
    // Redirect to login, preserving the attempted URL so we can redirect back after login
    return <Navigate to="/login" state={{ from: location, reason: 'unauthenticated' }} replace />;
  }

  if (status === 'wrong-role') {
    // Redirect to login with a reason — the login page can display a message
    return <Navigate to="/login" state={{ from: location, reason: 'forbidden' }} replace />;
  }

  // status === 'authorized'
  return <>{children}</>;
}

// ---- Full-page loading screen shown during the /me check ----
function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background gap-4">
      {/* Pulsing logo */}
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-emerald-500/20" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/30">
          <Fingerprint className="h-7 w-7 text-emerald-500" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground tracking-wide animate-pulse">
        Verifying session…
      </p>
    </div>
  );
}

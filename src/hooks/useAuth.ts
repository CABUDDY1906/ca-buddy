import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '@/services/authService';
import { StaffService } from '@/services/staffService';
import type { Staff } from '@/types/staff';

interface AuthState {
  session: unknown;
  user: { id: string; email?: string } | null;
  staff: Staff | null;
  loading: boolean;
  isAdmin: boolean;
}

export function useAuth(): AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
} {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    staff: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    AuthService.getSession().then(async (session) => {
      if (session) {
        const staff = await StaffService.getCurrentStaff();
        setState({
          session,
          user: session.user,
          staff,
          loading: false,
          isAdmin: staff?.role === 'Admin',
        });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    });

    const { data: { subscription } } = AuthService.onAuthStateChange(
      async (_event: string, session: unknown) => {
        const s = session as { user: { id: string; email?: string } } | null;
        if (s) {
          const staff = await StaffService.getCurrentStaff();
          setState({
            session: s,
            user: s.user,
            staff,
            loading: false,
            isAdmin: staff?.role === 'Admin',
          });
        } else {
          setState({
            session: null,
            user: null,
            staff: null,
            loading: false,
            isAdmin: false,
          });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    await AuthService.signIn(email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    await AuthService.signUp(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await AuthService.signOut();
  }, []);

  return { ...state, signIn, signUp, signOut };
}

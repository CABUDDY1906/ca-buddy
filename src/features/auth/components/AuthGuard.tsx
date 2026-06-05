import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard() {
  const { session, staff, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!staff) {
    return <Navigate to="/onboarding" replace />;
  }

  // If password change is required, redirect to /change-password unless already there.
  if (staff.must_change_password) {
    if (location.pathname !== '/change-password') {
      return <Navigate to="/change-password" replace />;
    }
  } else {
    // If password change is completed, don't allow access to /change-password.
    if (location.pathname === '/change-password') {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/shell/AppShell';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage';
import { OnboardingPage } from '@/features/auth/OnboardingPage';
import { ClientsPage } from '@/features/clients/ClientsPage';
import { ClientDetailPage } from '@/features/clients/ClientDetailPage';
import { StaffPage } from '@/features/staff/StaffPage';
import { ComingSoon } from '@/components/shared/ComingSoon';
import { ChangePasswordPage } from '@/features/auth/ChangePasswordPage';

export const router = createBrowserRouter([
  // Public routes
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/onboarding', element: <OnboardingPage /> },

  // Protected routes
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      { path: 'change-password', element: <ChangePasswordPage /> },
      {
        element: <AppShell />,
        children: [
          { index: true, element: <ComingSoon /> },
          { path: 'clients', element: <ClientsPage /> },
          { path: 'clients/:id', element: <ClientDetailPage /> },
          { path: 'staff', element: <StaffPage /> },
          { path: 'tasks', element: <ComingSoon /> },
          { path: 'files', element: <ComingSoon /> },
          { path: 'service-requests', element: <ComingSoon /> },
          { path: 'invoices', element: <ComingSoon /> },
          { path: 'gst', element: <ComingSoon /> },
          { path: 'audits', element: <ComingSoon /> },
          { path: 'reminders', element: <ComingSoon /> },
          { path: 'whatsapp', element: <ComingSoon /> },
          { path: 'bulletin', element: <ComingSoon /> },
          { path: 'settings', element: <ComingSoon /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);

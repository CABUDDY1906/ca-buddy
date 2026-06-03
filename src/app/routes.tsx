import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/shell/AppShell';
import { ComingSoon } from '@/components/shared/ComingSoon';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ComingSoon /> },
      { path: 'clients', element: <ComingSoon /> },
      { path: 'staff', element: <ComingSoon /> },
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
      { path: '*', element: <ComingSoon /> },
    ],
  },
]);

import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const routeNames: Record<string, string> = {
  '/': 'Dashboard',
  '/clients': 'Clients',
  '/staff': 'Staff',
  '/tasks': 'Tasks',
  '/files': 'Files',
  '/service-requests': 'Service Requests',
  '/invoices': 'Invoices',
  '/gst': 'GST Filing',
  '/audits': 'Audits',
  '/reminders': 'Reminders',
  '/whatsapp': 'WhatsApp',
  '/bulletin': 'Bulletin',
  '/settings': 'Settings',
};

export function ComingSoon() {
  const location = useLocation();
  const moduleName = routeNames[location.pathname] || 'Module';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50">
          <Construction className="h-10 w-10 text-primary-500" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-neutral-800">{moduleName}</h1>
          <Badge variant="secondary" className="bg-accent-500/10 text-accent-600 hover:bg-accent-500/10">
            Coming Soon
          </Badge>
        </div>

        {/* Description */}
        <p className="max-w-md text-sm text-neutral-500">
          This module is currently under development and will be available in a future update.
          Stay tuned for exciting new features!
        </p>

        {/* Decorative dots */}
        <div className="flex gap-1.5 pt-4">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-300" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-400 [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

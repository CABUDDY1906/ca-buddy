import { Bell } from 'lucide-react';

export function NotificationsBell() {
  return (
    <button
      type="button"
      className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
      aria-label="View notifications"
    >
      <Bell className="h-5 w-5" />
      {/* Notification dot */}
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger ring-2 ring-white" />
    </button>
  );
}

import type { Staff } from '@/types/staff';

const roleStyles: Record<string, string> = {
  'Admin': 'bg-primary-100 text-primary-700',
  'Manager': 'bg-accent-500/10 text-accent-600',
  'Article Assistant': 'bg-success/10 text-success',
  'Junior Auditor': 'bg-neutral-100 text-neutral-600',
};

interface StaffRoleBadgeProps {
  role: Staff['role'];
}

export function StaffRoleBadge({ role }: StaffRoleBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[role]}`}>
      {role}
    </span>
  );
}

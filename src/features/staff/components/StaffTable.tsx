import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { StaffService } from '@/services/staffService';
import { StaffRoleBadge } from './StaffRoleBadge';
import { STAFF_ROLES } from '@/lib/constants';
import type { Staff } from '@/types/staff';

interface StaffTableProps {
  staff: Staff[];
  loading: boolean;
}

export function StaffTable({ staff, loading }: StaffTableProps) {
  const queryClient = useQueryClient();

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: Staff['role'] }) =>
      StaffService.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const activeMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      StaffService.setActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  if (loading) {
    return <div className="flex h-40 items-center justify-center text-neutral-400">Loading staff...</div>;
  }

  if (staff.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16">
        <Users className="mb-4 h-12 w-12 text-neutral-300" />
        <p className="mb-1 text-lg font-medium text-neutral-600">No staff members</p>
        <p className="text-sm text-neutral-400">Add your first staff member to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
            <th className="hidden px-4 py-3 font-medium text-neutral-600 md:table-cell">Email</th>
            <th className="hidden px-4 py-3 font-medium text-neutral-600 lg:table-cell">Phone</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Role</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
              <td className="px-4 py-3 font-medium text-neutral-900">{member.full_name}</td>
              <td className="hidden px-4 py-3 text-neutral-600 md:table-cell">{member.email}</td>
              <td className="hidden px-4 py-3 text-neutral-600 lg:table-cell">{member.phone_number || '—'}</td>
              <td className="px-4 py-3">
                <select
                  value={member.role}
                  onChange={(e) => roleMutation.mutate({ id: member.id, role: e.target.value as Staff['role'] })}
                  className="rounded border border-neutral-200 bg-transparent px-2 py-1 text-xs outline-none focus:border-accent-500"
                >
                  {STAFF_ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={member.is_active}
                    onChange={(e) => activeMutation.mutate({ id: member.id, isActive: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="peer h-5 w-9 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-success peer-checked:after:translate-x-full" />
                  <span className="ml-2 text-xs text-neutral-500">
                    {member.is_active ? 'Active' : 'Inactive'}
                  </span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

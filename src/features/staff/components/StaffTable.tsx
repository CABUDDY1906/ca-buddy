import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, MoreVertical, Trash2, Ban, CheckCircle, AlertTriangle } from 'lucide-react';
import { StaffService } from '@/services/staffService';
import { useAuth } from '@/hooks/useAuth';
import { STAFF_ROLES } from '@/lib/constants';
import type { Staff } from '@/types/staff';

interface StaffTableProps {
  staff: Staff[];
  loading: boolean;
}

export function StaffTable({ staff, loading }: StaffTableProps) {
  const queryClient = useQueryClient();
  const { staff: currentStaff } = useAuth();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState<Staff | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => StaffService.deleteStaffMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setDeleteConfirmMember(null);
    },
    onError: (err) => {
      alert(err instanceof Error ? err.message : 'Failed to delete staff member');
      setDeleteConfirmMember(null);
    }
  });

  const getCanManage = (targetRole: Staff['role'], targetId: string) => {
    if (!currentStaff) return false;
    // Cannot manage self
    if (targetId === currentStaff.id) return false;
    if (currentStaff.role === 'Admin') return true;
    if (currentStaff.role === 'Manager') {
      return targetRole === 'Article Assistant' || targetRole === 'Junior Auditor';
    }
    return false;
  };

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
    <>
      {/* Dropdown Backdrop to close menu on click outside */}
      {activeMenuId && (
        <div className="fixed inset-0 z-30 bg-transparent" onClick={() => setActiveMenuId(null)} />
      )}

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th className="px-4 py-3 font-medium text-neutral-600">Name</th>
              <th className="hidden px-4 py-3 font-medium text-neutral-600 md:table-cell">Email</th>
              <th className="hidden px-4 py-3 font-medium text-neutral-600 lg:table-cell">Phone</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Role</th>
              <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
              <th className="px-4 py-3 font-medium text-neutral-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => {
              const canManage = getCanManage(member.role, member.id);
              return (
                <tr key={member.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{member.full_name}</td>
                  <td className="hidden px-4 py-3 text-neutral-600 md:table-cell">{member.email}</td>
                  <td className="hidden px-4 py-3 text-neutral-600 lg:table-cell">{member.phone_number || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={member.role}
                      disabled={!canManage}
                      onChange={(e) => roleMutation.mutate({ id: member.id, role: e.target.value as Staff['role'] })}
                      className="rounded border border-neutral-200 bg-transparent px-2 py-1 text-xs outline-none focus:border-accent-500 disabled:opacity-75"
                    >
                      {STAFF_ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <label className={`relative inline-flex items-center ${canManage ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                      <input
                        type="checkbox"
                        checked={member.is_active}
                        disabled={!canManage}
                        onChange={(e) => activeMutation.mutate({ id: member.id, isActive: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="peer h-5 w-9 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-success peer-checked:after:translate-x-full peer-disabled:opacity-75" />
                      <span className="ml-2 text-xs text-neutral-500">
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </label>
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    {canManage && (
                      <div className="inline-block text-left">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                          className="rounded p-1 hover:bg-neutral-100 text-neutral-500"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {activeMenuId === member.id && (
                          <div className="absolute right-4 mt-1 z-40 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-dropdown">
                            <button
                              onClick={() => {
                                activeMutation.mutate({ id: member.id, isActive: !member.is_active });
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50"
                            >
                              {member.is_active ? (
                                <>
                                  <Ban className="h-3.5 w-3.5 text-neutral-400" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 text-neutral-400" />
                                  Activate
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmMember(member);
                                setActiveMenuId(null);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-danger hover:bg-danger/5"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-dropdown">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-danger/10 p-2 text-danger shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Delete Staff Member</h3>
                <p className="mt-2 text-xs text-neutral-500">
                  Are you sure you want to permanently delete <strong>{deleteConfirmMember.full_name}</strong>?
                  This will remove their staff record and delete their login account. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={() => setDeleteConfirmMember(null)}
                className="rounded-lg border border-neutral-200 px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteConfirmMember.id)}
                disabled={deleteMutation.isPending}
                className="rounded-lg bg-danger px-3.5 py-1.5 text-xs font-medium text-white hover:bg-danger-hover disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { staffSchema, type StaffFormData } from '@/lib/validations';
import { StaffService } from '@/services/staffService';
import { STAFF_ROLES } from '@/lib/constants';

interface InviteStaffModalProps {
  onClose: () => void;
}

export function InviteStaffModal({ onClose }: InviteStaffModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: 'Article Assistant' },
  });

  const mutation = useMutation({
    mutationFn: (data: StaffFormData) => {
      return StaffService.invite({ ...data, is_active: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white shadow-dropdown">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Add Staff Member</h2>
          <button onClick={onClose} className="rounded p-1 text-neutral-400 hover:text-neutral-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="px-6 py-4">
          {mutation.error && (
            <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              {mutation.error instanceof Error
                ? mutation.error.message
                : mutation.error && typeof mutation.error === 'object' && 'message' in mutation.error
                  ? String((mutation.error as any).message)
                  : 'Failed to add staff'}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Full Name *</label>
              <Input {...register('full_name')} placeholder="Staff member name" />
              {errors.full_name && <p className="mt-1 text-xs text-danger">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email *</label>
              <Input {...register('email')} type="email" placeholder="staff@example.com" />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Phone</label>
              <Input {...register('phone_number')} placeholder="9876543210" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Role *</label>
              <select
                {...register('role')}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-accent-500"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-2 rounded-lg bg-info/5 p-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
              <p className="text-xs text-info">
                Staff member will receive an email to set up their login (coming soon).
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-accent-500 text-white hover:bg-accent-600">
              {mutation.isPending ? 'Adding...' : 'Add Staff Member'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

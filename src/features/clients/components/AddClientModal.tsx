import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { clientSchema, type ClientFormData } from '@/lib/validations';
import { ClientsService } from '@/services/clientsService';
import { INDIAN_STATES, CLIENT_STATUSES } from '@/lib/constants';

interface AddClientModalProps {
  onClose: () => void;
}

export function AddClientModal({ onClose }: AddClientModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: { client_status: 'active' },
  });

  const mutation = useMutation({
    mutationFn: (data: ClientFormData) => ClientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-xl border border-neutral-200 bg-white shadow-dropdown">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Add Client</h2>
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
                  : 'Failed to create client'}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Company Name *</label>
              <Input {...register('company_name')} placeholder="Company or individual name" />
              {errors.company_name && <p className="mt-1 text-xs text-danger">{errors.company_name.message}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Contact Person</label>
                <Input {...register('contact_person')} placeholder="Contact name" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Email *</label>
                <Input {...register('email')} type="email" placeholder="client@example.com" />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Phone</label>
                <Input {...register('phone_number')} placeholder="9876543210" />
                {errors.phone_number && <p className="mt-1 text-xs text-danger">{errors.phone_number.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">PAN Number</label>
                <Input {...register('pan_number')} placeholder="AAAAA9999A" className="uppercase" />
                {errors.pan_number && <p className="mt-1 text-xs text-danger">{errors.pan_number.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">GSTIN</label>
                <Input {...register('gstin')} placeholder="22AAAAA0000A1Z5" className="uppercase" />
                {errors.gstin && <p className="mt-1 text-xs text-danger">{errors.gstin.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">State</label>
                <select
                  {...register('state_code')}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-accent-500"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Status</label>
              <select
                {...register('client_status')}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-accent-500"
              >
                {CLIENT_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Address</label>
              <textarea
                {...register('address')}
                rows={2}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                placeholder="Full address"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-accent-500 text-white hover:bg-accent-600">
              {mutation.isPending ? 'Saving...' : 'Save Client'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

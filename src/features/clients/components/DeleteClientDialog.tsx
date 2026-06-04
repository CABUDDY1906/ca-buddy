import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Client } from '@/types/client';

interface DeleteClientDialogProps {
  client: Client;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteClientDialog({ client, loading, onConfirm, onClose }: DeleteClientDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-dropdown">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle className="h-5 w-5 text-danger" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">Delete Client</h3>
        </div>

        <p className="mb-2 text-sm text-neutral-600">
          Are you sure you want to delete <strong>{client.company_name}</strong>?
        </p>
        <p className="mb-6 text-xs text-neutral-400">
          This will also delete all associated tasks, files, and records. This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-danger text-white hover:bg-danger/90">
            {loading ? 'Deleting...' : 'Delete Client'}
          </Button>
        </div>
      </div>
    </div>
  );
}

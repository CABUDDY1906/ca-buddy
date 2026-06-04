import { Pencil, Trash2, Users } from 'lucide-react';
import type { Client } from '@/types/client';

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

const statusStyles: Record<string, string> = {
  active: 'border-success/20 bg-success/10 text-success',
  inactive: 'border-neutral-200 bg-neutral-100 text-neutral-500',
  onboarding: 'border-warning/20 bg-warning/10 text-warning',
};

export function ClientsTable({ clients, loading, onEdit, onDelete }: ClientsTableProps) {
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-neutral-400">
        Loading clients...
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16">
        <Users className="mb-4 h-12 w-12 text-neutral-300" />
        <p className="mb-1 text-lg font-medium text-neutral-600">No clients yet</p>
        <p className="text-sm text-neutral-400">Add your first client to get started</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th className="px-4 py-3 font-medium text-neutral-600">Company Name</th>
            <th className="hidden px-4 py-3 font-medium text-neutral-600 md:table-cell">Contact</th>
            <th className="hidden px-4 py-3 font-medium text-neutral-600 lg:table-cell">Email</th>
            <th className="hidden px-4 py-3 font-medium text-neutral-600 xl:table-cell">PAN</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Status</th>
            <th className="px-4 py-3 text-right font-medium text-neutral-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
              <td className="px-4 py-3 font-medium text-neutral-900">{client.company_name}</td>
              <td className="hidden px-4 py-3 text-neutral-600 md:table-cell">{client.contact_person || '—'}</td>
              <td className="hidden px-4 py-3 text-neutral-600 lg:table-cell">{client.email}</td>
              <td className="hidden px-4 py-3 font-mono text-xs text-neutral-500 xl:table-cell">{client.pan_number || '—'}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[client.client_status]}`}>
                  {client.client_status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(client); }}
                    className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(client); }}
                    className="rounded p-1.5 text-neutral-400 hover:bg-danger/10 hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

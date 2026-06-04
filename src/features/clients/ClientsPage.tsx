import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Users, UserCheck, UserX, UserPlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientsService } from '@/services/clientsService';
import { ClientsTable } from './components/ClientsTable';
import { AddClientModal } from './components/AddClientModal';
import { EditClientModal } from './components/EditClientModal';
import { DeleteClientDialog } from './components/DeleteClientDialog';
import { CLIENT_STATUSES } from '@/lib/constants';
import type { Client } from '@/types/client';

export function ClientsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [deleteClient, setDeleteClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients', search, statusFilter],
    queryFn: () => ClientsService.list({ search: search || undefined, status: statusFilter || undefined }),
  });

  const { data: stats } = useQuery({
    queryKey: ['client-stats'],
    queryFn: () => ClientsService.getStats(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ClientsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });
      setDeleteClient(null);
    },
  });

  const statCards = [
    { label: 'Total Clients', value: stats?.total ?? 0, icon: Users, color: 'text-primary-600' },
    { label: 'Active', value: stats?.active ?? 0, icon: UserCheck, color: 'text-success' },
    { label: 'Inactive', value: stats?.inactive ?? 0, icon: UserX, color: 'text-neutral-500' },
    { label: 'Onboarding', value: stats?.onboarding ?? 0, icon: UserPlus2, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Clients</h1>
        <Button onClick={() => setShowAdd(true)} className="bg-accent-500 text-white hover:bg-accent-600">
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{s.label}</p>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-1 text-2xl font-bold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none focus:border-accent-500"
        >
          <option value="">All Statuses</option>
          {CLIENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <ClientsTable
        clients={clients}
        loading={isLoading}
        onEdit={setEditClient}
        onDelete={setDeleteClient}
      />

      {/* Modals */}
      {showAdd && <AddClientModal onClose={() => setShowAdd(false)} />}
      {editClient && <EditClientModal client={editClient} onClose={() => setEditClient(null)} />}
      {deleteClient && (
        <DeleteClientDialog
          client={deleteClient}
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deleteClient.id)}
          onClose={() => setDeleteClient(null)}
        />
      )}
    </div>
  );
}

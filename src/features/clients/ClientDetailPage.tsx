import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientsService } from '@/services/clientsService';
import { INDIAN_STATES } from '@/lib/constants';

const statusStyles: Record<string, string> = {
  active: 'border-success/20 bg-success/10 text-success',
  inactive: 'border-neutral-200 bg-neutral-100 text-neutral-500',
  onboarding: 'border-warning/20 bg-warning/10 text-warning',
};

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: () => ClientsService.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <p className="text-neutral-500">Client not found</p>
        <Link to="/clients" className="mt-2 text-sm text-accent-500 hover:text-accent-600">
          ← Back to Clients
        </Link>
      </div>
    );
  }

  const stateName = INDIAN_STATES.find(s => s.code === client.state_code)?.name;

  const fields = [
    { label: 'Contact Person', value: client.contact_person },
    { label: 'Email', value: client.email },
    { label: 'Phone', value: client.phone_number },
    { label: 'PAN Number', value: client.pan_number },
    { label: 'GSTIN', value: client.gstin },
    { label: 'State', value: stateName },
    { label: 'Address', value: client.address },
    { label: 'Created', value: new Date(client.created_at).toLocaleDateString('en-IN') },
  ];

  return (
    <div className="space-y-6">
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700">
        <ArrowLeft className="h-4 w-4" /> Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{client.company_name}</h1>
          <span className={`mt-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[client.client_status]}`}>
            {client.client_status}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      {/* Info Grid */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fields.map((f) => (
            <div key={f.label}>
              <p className="text-xs font-medium text-neutral-400">{f.label}</p>
              <p className="mt-0.5 text-sm text-neutral-800">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs placeholder */}
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm text-neutral-400">Tasks, Files & Invoices tabs coming in Phase 2/3</p>
      </div>
    </div>
  );
}

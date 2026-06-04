import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { StaffService } from '@/services/staffService';
import { StaffTable } from './components/StaffTable';
import { InviteStaffModal } from './components/InviteStaffModal';

export function StaffPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/');
  }, [isAdmin, navigate]);

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => StaffService.list(),
  });

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Staff</h1>
        <Button onClick={() => setShowInvite(true)} className="bg-accent-500 text-white hover:bg-accent-600">
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <StaffTable staff={staff} loading={isLoading} />

      {showInvite && <InviteStaffModal onClose={() => setShowInvite(false)} />}
    </div>
  );
}

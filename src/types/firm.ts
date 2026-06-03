export interface Firm {
  id: string;
  firm_name: string;
  firm_email: string;
  firm_phone: string | null;
  firm_address: string | null;
  gstin: string | null;
  subscription_plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'suspended' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export type FirmInput = Omit<Firm, 'id' | 'created_at' | 'updated_at'>;

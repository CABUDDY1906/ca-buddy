export interface Firm {
  id: string;
  firm_name: string;
  firm_email: string;
  firm_phone?: string;
  firm_address?: string;
  gstin?: string;
  subscription_plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'suspended' | 'cancelled';
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface FirmInput {
  firm_name: string;
  firm_email: string;
  firm_phone?: string;
  firm_address?: string;
  gstin?: string;
  contact_name?: string;
}

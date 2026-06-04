export interface Client {
  id: string;
  firm_id: string;
  company_name: string;
  contact_person?: string;
  email: string;
  phone_number?: string;
  pan_number?: string;
  gstin?: string;
  address?: string;
  state_code?: string;
  client_status: 'active' | 'inactive' | 'onboarding';
  created_at: string;
  updated_at: string;
}

export type ClientInput = Omit<Client, 'id' | 'firm_id' | 'created_at' | 'updated_at'>;

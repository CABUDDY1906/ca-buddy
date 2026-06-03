export interface Client {
  id: string;
  firm_id: string;
  company_name: string;
  contact_person: string | null;
  email: string;
  phone_number: string | null;
  pan_number: string | null;
  gstin: string | null;
  address: string | null;
  state_code: string | null;
  client_status: 'active' | 'inactive' | 'onboarding';
  created_at: string;
  updated_at: string;
}

export type ClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

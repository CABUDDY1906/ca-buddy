export interface Staff {
  id: string;
  firm_id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  phone_number: string | null;
  role: 'Admin' | 'Manager' | 'Article Assistant' | 'Junior Auditor';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type StaffInput = Omit<Staff, 'id' | 'created_at' | 'updated_at'>;

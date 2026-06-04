import { supabase } from './supabaseClient';
import type { Firm, FirmInput } from '@/types/firm';

export const FirmsService = {
  async create(input: FirmInput, authUserId: string): Promise<Firm> {
    const { data: firm, error: firmError } = await supabase
      .from('firms')
      .insert({
        firm_name: input.firm_name,
        firm_email: input.firm_email,
        firm_phone: input.firm_phone || null,
        firm_address: input.firm_address || null,
        gstin: input.gstin || null,
        onboarding_complete: true,
      })
      .select()
      .single();
    if (firmError) throw firmError;

    const { error: staffError } = await supabase
      .from('staff')
      .insert({
        firm_id: firm.id,
        auth_user_id: authUserId,
        full_name: input.contact_name || 'Admin',
        email: input.firm_email,
        role: 'Admin',
        is_active: true,
      });
    if (staffError) throw staffError;

    return firm;
  },
  async getCurrent(): Promise<Firm | null> {
    const { data, error } = await supabase
      .from('firms').select('*').single();
    if (error) return null;
    return data;
  },
  async update(id: string, input: Partial<FirmInput>): Promise<Firm> {
    const { data, error } = await supabase
      .from('firms').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
};

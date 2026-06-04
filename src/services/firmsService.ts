import { supabase } from './supabaseClient';
import type { Firm, FirmInput } from '@/types/firm';

export const FirmsService = {
  async create(input: FirmInput, authUserId: string): Promise<Firm> {
    const { data: firm, error } = await supabase.rpc('create_firm_onboarding', {
      p_firm_name: input.firm_name,
      p_firm_email: input.firm_email,
      p_firm_phone: input.firm_phone || null,
      p_firm_address: input.firm_address || null,
      p_gstin: input.gstin || null,
      p_contact_name: input.contact_name || 'Admin',
      p_auth_user_id: authUserId,
    });
    if (error) throw error;
    return firm as Firm;
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

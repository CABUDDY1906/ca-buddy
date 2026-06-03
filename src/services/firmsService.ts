import { supabase } from './supabaseClient';
import type { Firm, FirmInput } from '@/types/firm';

export const FirmsService = {
  async list(): Promise<Firm[]> {
    const { data, error } = await supabase
      .from('firms').select('*').order('firm_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Firm | null> {
    const { data, error } = await supabase
      .from('firms').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: FirmInput): Promise<Firm> {
    const { data, error } = await supabase
      .from('firms').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<FirmInput>): Promise<Firm> {
    const { data, error } = await supabase
      .from('firms').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('firms').delete().eq('id', id);
    if (error) throw error;
  },
};

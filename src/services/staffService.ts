import { supabase } from './supabaseClient';
import type { Staff, StaffInput } from '@/types/staff';

export const StaffService = {
  async list(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff').select('*').order('full_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Staff | null> {
    const { data, error } = await supabase
      .from('staff').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: StaffInput): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<StaffInput>): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('staff').delete().eq('id', id);
    if (error) throw error;
  },
};

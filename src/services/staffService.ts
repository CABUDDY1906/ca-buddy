import { supabase } from './supabaseClient';
import type { Staff, StaffInput } from '@/types/staff';

export const StaffService = {
  async list(): Promise<Staff[]> {
    const { data, error } = await supabase
      .from('staff').select('*').order('full_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async getCurrentStaff(): Promise<Staff | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from('staff').select('*').eq('auth_user_id', user.id).single();
    if (error) return null;
    return data;
  },
  async invite(input: StaffInput): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').insert({ ...input, is_active: true }).select().single();
    if (error) throw error;
    return data;
  },
  async updateRole(id: string, role: Staff['role']): Promise<Staff> {
    const { data, error } = await supabase
      .from('staff').update({ role }).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async setActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('staff').update({ is_active: isActive }).eq('id', id);
    if (error) throw error;
  },
};

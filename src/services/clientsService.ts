import { supabase } from './supabaseClient';
import type { Client, ClientInput } from '@/types/client';

export const ClientsService = {
  async list(filters?: { status?: string; search?: string }): Promise<Client[]> {
    let query = supabase.from('clients').select('*').order('company_name');
    if (filters?.status) query = query.eq('client_status', filters.status);
    if (filters?.search) {
      query = query.or(
        `company_name.ilike.%${filters.search}%,` +
        `contact_person.ilike.%${filters.search}%,` +
        `pan_number.ilike.%${filters.search}%,` +
        `gstin.ilike.%${filters.search}%`
      );
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Client> {
    const { data, error } = await supabase
      .from('clients').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: ClientInput): Promise<Client> {
    const { data, error } = await supabase
      .from('clients').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<ClientInput>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) throw error;
  },
  async getStats() {
    const { data, error } = await supabase.from('clients').select('client_status');
    if (error) throw error;
    return {
      total: data.length,
      active: data.filter(c => c.client_status === 'active').length,
      inactive: data.filter(c => c.client_status === 'inactive').length,
      onboarding: data.filter(c => c.client_status === 'onboarding').length,
    };
  },
};

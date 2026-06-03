import { supabase } from './supabaseClient';
import type { Client, ClientInput } from '@/types/client';

export const ClientsService = {
  async list(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients').select('*').order('company_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Client | null> {
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
};

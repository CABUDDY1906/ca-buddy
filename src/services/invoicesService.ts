import { supabase } from './supabaseClient';
import type { Invoice, InvoiceInput } from '@/types/invoice';

export const InvoicesService = {
  async list(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices').select('*').order('invoice_date', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: InvoiceInput): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<InvoiceInput>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
  },
};

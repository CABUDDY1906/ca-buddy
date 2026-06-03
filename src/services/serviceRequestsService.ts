import { supabase } from './supabaseClient';
import type { ServiceRequest, ServiceRequestInput } from '@/types/serviceRequest';

export const ServiceRequestsService = {
  async list(): Promise<ServiceRequest[]> {
    const { data, error } = await supabase
      .from('service_requests').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<ServiceRequest | null> {
    const { data, error } = await supabase
      .from('service_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: ServiceRequestInput): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<ServiceRequestInput>): Promise<ServiceRequest> {
    const { data, error } = await supabase
      .from('service_requests').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('service_requests').delete().eq('id', id);
    if (error) throw error;
  },
};

import { supabase } from './supabaseClient';
import type { FileRecord, FileRecordInput } from '@/types/file';

export const FilesService = {
  async list(): Promise<FileRecord[]> {
    const { data, error } = await supabase
      .from('file_records').select('*').order('file_name');
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<FileRecord | null> {
    const { data, error } = await supabase
      .from('file_records').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: FileRecordInput): Promise<FileRecord> {
    const { data, error } = await supabase
      .from('file_records').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<FileRecordInput>): Promise<FileRecord> {
    const { data, error } = await supabase
      .from('file_records').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('file_records').delete().eq('id', id);
    if (error) throw error;
  },
};

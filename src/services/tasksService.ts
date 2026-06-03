import { supabase } from './supabaseClient';
import type { Task, TaskInput } from '@/types/task';

export const TasksService = {
  async list(): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  async getById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async create(input: TaskInput): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks').insert(input).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, input: Partial<TaskInput>): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks').update(input).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
};

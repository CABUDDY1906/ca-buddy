export interface Task {
  id: string;
  firm_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New SR' | 'Pending' | 'In Progress' | 'Extended' | 'Completed';
  client_id: string | null;
  assigned_to: string | null;
  created_by: string | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>;

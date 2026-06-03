export interface FileRecord {
  id: string;
  firm_id: string;
  client_id: string | null;
  parent_folder_id: string | null;
  file_name: string;
  storage_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  is_folder: boolean;
  folder_category: string | null;
  financial_year: string | null;
  uploaded_by_staff: string | null;
  uploaded_at: string;
}

export type FileRecordInput = Omit<FileRecord, 'id' | 'uploaded_at'>;

export interface ServiceRequest {
  id: string;
  firm_id: string;
  client_id: string;
  source: 'Portal' | 'WhatsApp' | 'Email' | 'Phone';
  category: string | null;
  subject: string | null;
  request_details: string;
  is_chargeable: boolean;
  linked_task_id: string | null;
  created_at: string;
}

export type ServiceRequestInput = Omit<ServiceRequest, 'id' | 'created_at'>;

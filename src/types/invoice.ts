export interface Invoice {
  id: string;
  firm_id: string;
  invoice_number: string;
  client_id: string;
  service_request_id: string | null;
  invoice_date: string;
  due_date: string | null;
  taxable_amount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
  payment_status: 'Unpaid' | 'Paid' | 'Partially Paid' | 'Cancelled';
  paid_amount: number;
  paid_at: string | null;
  created_at: string;
}

export type InvoiceInput = Omit<Invoice, 'id' | 'created_at'>;

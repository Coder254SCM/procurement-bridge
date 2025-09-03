import { supabase } from '@/integrations/supabase/client';

export interface PaymentSchedule {
  id: string;
  contract_id: string;
  milestone_id?: string;
  payment_method?: string;
  amount: number;
  due_date: string;
  currency?: string;
  status?: 'pending' | 'approved' | 'paid' | 'overdue' | 'cancelled';
  reference_number?: string;
  paid_date?: string;
  payment_number: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export class PaymentService {
  private static instance: PaymentService;

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentSchedule(paymentData: Omit<PaymentSchedule, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('payment_schedules')
      .insert([paymentData])
      .select()
      .single();

    return { data, error };
  }

  async getPaymentSchedules(contractId?: string) {
    let query = supabase
      .from('payment_schedules')
      .select('*')
      .order('due_date', { ascending: true });

    if (contractId) {
      query = query.eq('contract_id', contractId);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    const { data, error } = await supabase
      .from('payment_schedules')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    return { data, error };
  }

  async getPaymentsByContract(contractId: string) {
    const { data, error } = await supabase
      .from('payment_schedules')
      .select('*')
      .eq('contract_id', contractId);

    return { data, error };
  }
}

export const paymentService = PaymentService.getInstance();
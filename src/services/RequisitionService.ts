import { supabase } from '@/integrations/supabase/client';

export interface RequisitionItem {
  id?: string;
  catalog_item_id?: string;
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  specifications?: Record<string, any>;
}

export interface PurchaseRequisition {
  id: string;
  requisition_number: string;
  requester_id: string;
  department: string;
  title: string;
  description?: string;
  justification: string;
  budget_code?: string;
  estimated_value: number;
  currency: string;
  required_date: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  approval_status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  items: RequisitionItem[];
  approvers: Array<{
    user_id: string;
    role: string;
    step: number;
    approved_at?: string;
    comments?: string;
  }>;
  approval_workflow: Record<string, any>;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string };
}

export class RequisitionService {
  private static instance: RequisitionService;

  public static getInstance(): RequisitionService {
    if (!RequisitionService.instance) {
      RequisitionService.instance = new RequisitionService();
    }
    return RequisitionService.instance;
  }

  async createRequisition(requisitionData: Partial<PurchaseRequisition>) {
    const { data, error } = await supabase.functions.invoke('requisition-management', {
      body: {
        action: 'create_requisition',
        data: requisitionData
      }
    });

    return { data, error };
  }

  async getRequisitions(filters?: {
    user_id?: string;
    status?: string;
    department?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('requisition-management', {
      body: {
        action: 'list_requisitions',
        data: filters
      }
    });

    return { data, error };
  }

  async getRequisitionById(id: string) {
    const { data, error } = await supabase.functions.invoke('requisition-management', {
      body: {
        action: 'get_requisition',
        data: { requisition_id: id }
      }
    });

    return { data, error };
  }

  async updateRequisition(id: string, updateData: Partial<PurchaseRequisition>) {
    const { data, error } = await supabase.functions.invoke('requisition-management', {
      body: {
        action: 'update_requisition',
        data: { id, ...updateData }
      }
    });

    return { data, error };
  }

  async submitForApproval(requisitionId: string) {
    const { data, error } = await supabase.functions.invoke('requisition-management', {
      body: {
        action: 'submit_for_approval',
        data: { requisition_id: requisitionId }
      }
    });

    return { data, error };
  }

  async getUserRequisitions(userId: string) {
    return this.getRequisitions({ user_id: userId });
  }

  async getDepartmentRequisitions(department: string) {
    return this.getRequisitions({ department });
  }

  async getRequisitionsByStatus(status: string) {
    return this.getRequisitions({ status });
  }
}

export const requisitionService = RequisitionService.getInstance();
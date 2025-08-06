import { supabase } from '@/integrations/supabase/client';

export interface QualificationData {
  id?: string;
  supplier_id: string;
  category_id: string;
  qualification_level: 'basic' | 'standard' | 'preferred' | 'strategic';
  certification_documents: any[];
  financial_capacity: number;
  technical_capacity: Record<string, any>;
  quality_rating: number;
  compliance_score: number;
  valid_until?: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
}

export class SupplierQualificationService {
  async submitQualification(data: Omit<QualificationData, 'id'>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('supplier-qualification-management', {
      body: { action: 'submit_qualification', data, supplierId: data.supplier_id, categoryId: data.category_id }
    });

    if (error) throw error;
    return result;
  }

  async updateQualification(id: string, data: Partial<QualificationData>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('supplier-qualification-management', {
      body: { action: 'update_qualification', data: { id, ...data } }
    });

    if (error) throw error;
    return result;
  }

  async getQualifications(supplierId?: string, categoryId?: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('supplier-qualification-management', {
      body: { action: 'get_qualifications', supplierId, categoryId }
    });

    if (error) throw error;
    return result;
  }

  async approveQualification(id: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('supplier-qualification-management', {
      body: { action: 'approve_qualification', data: { id } }
    });

    if (error) throw error;
    return result;
  }

  async calculateScore(qualificationData: Partial<QualificationData>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('supplier-qualification-management', {
      body: { action: 'calculate_score', data: qualificationData }
    });

    if (error) throw error;
    return result;
  }

  async getQualificationsBySupplier(supplierId: string): Promise<QualificationData[]> {
    const result = await this.getQualifications(supplierId);
    return result.data || [];
  }

  async getQualificationsByCategory(categoryId: string): Promise<QualificationData[]> {
    const result = await this.getQualifications(undefined, categoryId);
    return result.data || [];
  }

  async checkQualificationValidity(supplierId: string, categoryId: string): Promise<boolean> {
    const qualifications = await this.getQualifications(supplierId, categoryId);
    if (!qualifications.data || qualifications.data.length === 0) return false;

    const activeQualification = qualifications.data.find(q => 
      q.status === 'approved' && 
      new Date(q.valid_until) > new Date()
    );

    return !!activeQualification;
  }
}

export const supplierQualificationService = new SupplierQualificationService();
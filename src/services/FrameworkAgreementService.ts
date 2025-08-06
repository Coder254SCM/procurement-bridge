import { supabase } from '@/integrations/supabase/client';

export interface FrameworkAgreement {
  id?: string;
  agreement_number?: string;
  title: string;
  description?: string;
  buyer_organization: string;
  category_id: string;
  start_date: string;
  end_date: string;
  max_value?: number;
  currency: string;
  terms_conditions: Record<string, any>;
  evaluation_criteria: any[];
  suppliers: any[];
  status: 'draft' | 'published' | 'active' | 'expired' | 'cancelled';
}

export class FrameworkAgreementService {
  async createAgreement(data: Omit<FrameworkAgreement, 'id' | 'agreement_number'>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { action: 'create_agreement', data }
    });

    if (error) throw error;
    return result;
  }

  async getAgreements(categoryId?: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { action: 'get_agreements', categoryId }
    });

    if (error) throw error;
    return result;
  }

  async publishAgreement(agreementId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { action: 'publish_agreement', agreementId }
    });

    if (error) throw error;
    return result;
  }

  async addSupplier(agreementId: string, supplierId: string, qualificationScore: number): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { 
        action: 'add_supplier', 
        agreementId,
        data: { supplier_id: supplierId, qualification_score: qualificationScore }
      }
    });

    if (error) throw error;
    return result;
  }

  async removeSupplier(agreementId: string, supplierId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { 
        action: 'remove_supplier', 
        agreementId,
        data: { supplier_id: supplierId }
      }
    });

    if (error) throw error;
    return result;
  }

  async checkEligibility(agreementId: string, supplierId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { 
        action: 'check_eligibility', 
        agreementId,
        data: { supplier_id: supplierId }
      }
    });

    if (error) throw error;
    return result;
  }

  async activateAgreement(agreementId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { action: 'activate_agreement', agreementId }
    });

    if (error) throw error;
    return result;
  }

  async getActiveAgreements(): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('framework-agreement-management', {
      body: { action: 'get_active_agreements' }
    });

    if (error) throw error;
    return result;
  }

  async getAgreementsByCategory(categoryId: string): Promise<FrameworkAgreement[]> {
    const result = await this.getAgreements(categoryId);
    return result.data || [];
  }

  async getEligibleSuppliers(agreementId: string): Promise<any[]> {
    const agreements = await this.getAgreements();
    const agreement = agreements.data?.find(a => a.id === agreementId);
    return agreement?.suppliers?.filter(s => s.status === 'active') || [];
  }

  async isSupplierEligible(agreementId: string, supplierId: string): Promise<boolean> {
    const eligibility = await this.checkEligibility(agreementId, supplierId);
    return eligibility.data?.isEligible || false;
  }

  async getAgreementsByStatus(status: string): Promise<FrameworkAgreement[]> {
    const agreements = await this.getAgreements();
    return agreements.data?.filter(a => a.status === status) || [];
  }
}

export const frameworkAgreementService = new FrameworkAgreementService();
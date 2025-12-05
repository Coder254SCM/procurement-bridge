import { supabase } from '@/integrations/supabase/client';

export interface ConsortiumMember {
  member_user_id: string;
  member_role: 'lead' | 'partner' | 'subcontractor';
  percentage_share: number;
  responsibilities: string[];
  documents_submitted: Record<string, string>;
  financial_capacity?: number;
}

export interface ConsortiumRegistration {
  id?: string;
  tender_id: string;
  lead_partner_id: string;
  consortium_name: string;
  total_members: number;
  combined_turnover: number;
  joint_liability_accepted: boolean;
  status: 'draft' | 'submitted' | 'verified' | 'rejected';
}

export interface ConsortiumValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  memberValidations: {
    memberId: string;
    isComplete: boolean;
    missingDocuments: string[];
    missingFields: string[];
  }[];
}

export class ConsortiumService {
  private static instance: ConsortiumService;
  
  private readonly requiredDocuments = [
    'certificate_of_incorporation',
    'tax_compliance_certificate', 
    'consortium_agreement',
    'power_of_attorney',
    'financial_statements',
    'professional_indemnity_insurance'
  ];

  public static getInstance(): ConsortiumService {
    if (!ConsortiumService.instance) {
      ConsortiumService.instance = new ConsortiumService();
    }
    return ConsortiumService.instance;
  }

  async createConsortium(data: ConsortiumRegistration): Promise<{ id: string; error?: string }> {
    try {
      const { data: consortium, error } = await supabase
        .from('consortium_registrations')
        .insert({
          tender_id: data.tender_id,
          lead_partner_id: data.lead_partner_id,
          consortium_name: data.consortium_name,
          total_members: data.total_members,
          combined_turnover: data.combined_turnover,
          joint_liability_accepted: data.joint_liability_accepted,
          status: 'draft'
        } as any)
        .select('id')
        .single();

      if (error) throw error;
      return { id: consortium.id };
    } catch (error: any) {
      console.error('Create consortium error:', error);
      return { id: '', error: error.message };
    }
  }

  async addMember(consortiumId: string, member: ConsortiumMember): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('consortium_members')
        .insert({
          consortium_id: consortiumId,
          member_user_id: member.member_user_id,
          member_role: member.member_role,
          percentage_share: member.percentage_share,
          responsibilities: member.responsibilities,
          documents_submitted: member.documents_submitted,
          financial_capacity: member.financial_capacity
        } as any);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Add consortium member error:', error);
      return { success: false, error: error.message };
    }
  }

  async validateConsortium(consortiumId: string): Promise<ConsortiumValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const memberValidations: ConsortiumValidationResult['memberValidations'] = [];

    try {
      // Fetch consortium with members
      const { data: consortium, error } = await supabase
        .from('consortium_registrations')
        .select('*, consortium_members(*)')
        .eq('id', consortiumId)
        .single();

      if (error || !consortium) {
        return { isValid: false, errors: ['Consortium not found'], warnings: [], memberValidations: [] };
      }

      const members = (consortium as any).consortium_members || [];

      // Validate minimum members
      if (members.length < 2) {
        errors.push('Consortium must have at least 2 members');
      }

      // Validate percentage shares total 100%
      const totalShares = members.reduce((sum: number, m: any) => sum + (m.percentage_share || 0), 0);
      if (totalShares !== 100) {
        errors.push(`Percentage shares must total 100% (currently ${totalShares}%)`);
      }

      // Validate joint liability acceptance
      if (!consortium.joint_liability_accepted) {
        errors.push('Joint liability agreement must be accepted');
      }

      // Validate each member
      for (const member of members) {
        const missingDocuments: string[] = [];
        const missingFields: string[] = [];
        const docs = member.documents_submitted || {};

        // Check required documents
        for (const doc of this.requiredDocuments) {
          if (!docs[doc]) {
            missingDocuments.push(doc);
          }
        }

        // Check required fields
        if (!member.percentage_share || member.percentage_share <= 0) {
          missingFields.push('percentage_share');
        }
        if (!member.accepted_terms) {
          missingFields.push('terms_acceptance');
        }

        memberValidations.push({
          memberId: member.member_user_id,
          isComplete: missingDocuments.length === 0 && missingFields.length === 0,
          missingDocuments,
          missingFields
        });

        if (missingDocuments.length > 0) {
          warnings.push(`Member ${member.member_user_id} missing documents: ${missingDocuments.join(', ')}`);
        }
      }

      // Validate lead partner exists
      const hasLead = members.some((m: any) => m.member_role === 'lead');
      if (!hasLead) {
        errors.push('Consortium must have a designated lead partner');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        memberValidations
      };
    } catch (error: any) {
      console.error('Validate consortium error:', error);
      return { isValid: false, errors: [error.message], warnings: [], memberValidations: [] };
    }
  }

  async submitConsortium(consortiumId: string): Promise<{ success: boolean; error?: string }> {
    const validation = await this.validateConsortium(consortiumId);
    
    if (!validation.isValid) {
      return { 
        success: false, 
        error: `Cannot submit: ${validation.errors.join('; ')}` 
      };
    }

    try {
      const { error } = await supabase
        .from('consortium_registrations')
        .update({ status: 'submitted', updated_at: new Date().toISOString() })
        .eq('id', consortiumId);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Submit consortium error:', error);
      return { success: false, error: error.message };
    }
  }

  async getConsortiumsForTender(tenderId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('consortium_registrations')
        .select('*, consortium_members(*)')
        .eq('tender_id', tenderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get consortiums error:', error);
      return [];
    }
  }
}

export const consortiumService = ConsortiumService.getInstance();

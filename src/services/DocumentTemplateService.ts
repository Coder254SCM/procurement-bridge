import { supabase } from '@/integrations/supabase/client';

export interface DocumentTemplate {
  id: string;
  template_name: string;
  template_type: string;
  category: string;
  template_content: Record<string, any>;
  is_active: boolean;
  created_by: string;
  version: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplateRequest {
  template_name: string;
  template_type: string;
  category: string;
  template_content: Record<string, any>;
  version?: string;
}

export class DocumentTemplateService {
  private static instance: DocumentTemplateService;

  public static getInstance(): DocumentTemplateService {
    if (!DocumentTemplateService.instance) {
      DocumentTemplateService.instance = new DocumentTemplateService();
    }
    return DocumentTemplateService.instance;
  }

  async createTemplate(templateData: DocumentTemplateRequest) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const { data, error } = await supabase
      .from('document_templates')
      .insert([{
        ...templateData,
        created_by: user.user.id
      }])
      .select()
      .single();

    return { data, error };
  }

  async getTemplates(category?: string, templateType?: string) {
    let query = supabase
      .from('document_templates')
      .select('*')
      .eq('is_active', true)
      .order('template_name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (templateType) {
      query = query.eq('template_type', templateType);
    }

    const { data, error } = await query;
    return { data, error };
  }

  async getTemplateById(id: string) {
    const { data, error } = await supabase
      .from('document_templates')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  }

  async updateTemplate(id: string, updateData: Partial<DocumentTemplateRequest>) {
    const { data, error } = await supabase
      .from('document_templates')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deactivateTemplate(id: string) {
    const { data, error } = await supabase
      .from('document_templates')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async duplicateTemplate(id: string, newName: string) {
    const { data: original, error: fetchError } = await this.getTemplateById(id);
    
    if (fetchError || !original) {
      return { data: null, error: fetchError };
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { data: null, error: { message: 'User not authenticated' } };
    }

    const duplicateData = {
      template_name: newName,
      template_type: original.template_type,
      category: original.category,
      template_content: original.template_content,
      created_by: user.user.id,
      version: '1.0'
    };

    const { data, error } = await supabase
      .from('document_templates')
      .insert([duplicateData])
      .select()
      .single();

    return { data, error };
  }

  async getTemplatesByCategory() {
    const { data, error } = await supabase
      .from('document_templates')
      .select('category, template_type')
      .eq('is_active', true);

    if (error || !data) {
      return { data: null, error };
    }

    const grouped = data.reduce((acc: Record<string, any[]>, template: any) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    }, {});

    return { data: grouped, error: null };
  }

  // World-class templates inspired by Denmark & Singapore standards
  getDefaultTemplateContent(templateType: string, category: string) {
    const templates: Record<string, Record<string, any>> = {
      'tender_notice': {
        'construction': {
          sections: [
            { id: 'header', title: 'Tender Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nTENDER NOTICE NO: {{tender_number}}\n\nINVITATION TO TENDER FOR {{project_name}}' },
            { id: 'project_info', title: 'Project Information', content: 'Project: {{project_name}}\nLocation: {{project_location}}\nEstimated Value: KES {{budget_amount}}\nContract Duration: {{contract_duration}}\nProcurement Method: {{procurement_method}}' },
            { id: 'eligibility', title: 'Eligibility Criteria', content: '1. NCA Registration Category {{nca_category}}\n2. Valid Tax Compliance Certificate\n3. Certificate of Incorporation\n4. Audited Financial Statements ({{financial_years}} years)\n5. {{additional_requirements}}' },
            { id: 'sustainability', title: 'Sustainability Requirements', content: 'Environmental: {{environmental_requirements}}\nSocial: {{social_requirements}}\nGovernance: {{governance_requirements}}' },
            { id: 'submission', title: 'Submission Details', content: 'Deadline: {{submission_deadline}}\nLocation: {{submission_address}}\nOpening: {{opening_date}}' }
          ],
          variables: ['organization_name', 'tender_number', 'project_name', 'project_location', 'budget_amount', 'contract_duration', 'procurement_method', 'nca_category', 'financial_years', 'additional_requirements', 'environmental_requirements', 'social_requirements', 'governance_requirements', 'submission_deadline', 'submission_address', 'opening_date']
        },
        'ngo_development': {
          sections: [
            { id: 'header', title: 'NGO Development Project RFP', content: '{{organization_name}}\nRFP NO: {{rfp_number}}\n\n{{project_title}}' },
            { id: 'background', title: 'Background & Context', content: 'Development Context: {{development_context}}\nProblem Statement: {{problem_statement}}\nTarget Beneficiaries: {{target_beneficiaries}}' },
            { id: 'objectives', title: 'Project Objectives', content: 'Overall Objective: {{overall_objective}}\nSpecific Objectives: {{specific_objectives}}\nExpected Outcomes: {{expected_outcomes}}' },
            { id: 'sustainability', title: 'Sustainability & Safeguards', content: 'Environmental Safeguards: {{environmental_safeguards}}\nSocial Safeguards: {{social_safeguards}}\nChild Protection: {{child_protection}}' },
            { id: 'evaluation', title: 'Evaluation Criteria', content: 'Technical Evaluation: {{tech_weight}}%\nFinancial Evaluation: {{financial_weight}}%\nMinimum Score: {{min_score}} points' }
          ],
          variables: ['organization_name', 'rfp_number', 'project_title', 'development_context', 'problem_statement', 'target_beneficiaries', 'overall_objective', 'specific_objectives', 'expected_outcomes', 'environmental_safeguards', 'social_safeguards', 'child_protection', 'tech_weight', 'financial_weight', 'min_score']
        },
        'supplies': {
          sections: [
            { id: 'header', title: 'Supply Tender Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nSUPPLY TENDER NO: {{tender_number}}' },
            { id: 'specifications', title: 'Technical Specifications', content: 'Item: {{item_description}}\nQuantity: {{quantity}}\nSpecs: {{specifications}}\nStandards: {{quality_standards}}' },
            { id: 'delivery', title: 'Delivery Requirements', content: 'Location: {{delivery_location}}\nSchedule: {{delivery_schedule}}\nTerms: {{delivery_terms}}' },
            { id: 'sustainability', title: 'Sustainability Requirements', content: 'Local Content: {{local_content}}%\nEnvironmental Standards: {{env_standards}}\nEthical Sourcing: {{ethical_requirements}}' }
          ],
          variables: ['organization_name', 'tender_number', 'item_description', 'quantity', 'specifications', 'quality_standards', 'delivery_location', 'delivery_schedule', 'delivery_terms', 'local_content', 'env_standards', 'ethical_requirements']
        }
      },
      'contract_agreement': {
        'construction': {
          sections: [
            { id: 'parties', title: 'Contract Parties', content: 'EMPLOYER: {{buyer_name}}\nCONTRACTOR: {{contractor_name}}\nNCA Registration: {{nca_registration}}' },
            { id: 'works', title: 'Scope of Works', content: 'Description: {{works_description}}\nLocation: {{works_location}}\nCompletion: {{completion_date}}' },
            { id: 'financial', title: 'Financial Terms', content: 'Contract Sum: KES {{contract_sum}}\nPayment Terms: {{payment_terms}}\nPerformance Security: {{performance_security}}%' },
            { id: 'conditions', title: 'General Conditions', content: 'Defects Period: {{defects_period}} months\nLiquidated Damages: {{liquidated_damages}}%\nVariations: {{variation_limits}}%' }
          ],
          variables: ['buyer_name', 'contractor_name', 'nca_registration', 'works_description', 'works_location', 'completion_date', 'contract_sum', 'payment_terms', 'performance_security', 'defects_period', 'liquidated_damages', 'variation_limits']
        }
      },
      'evaluation_criteria': {
        'technical': {
          sections: [
            { id: 'framework', title: 'Evaluation Framework', content: 'Approach: {{evaluation_approach}}\nCommittee: {{evaluation_committee}}\nMinimum Score: {{min_score}} points' },
            { id: 'technical', title: 'Technical Criteria', content: 'Methodology: {{methodology_weight}} points\nExperience: {{experience_weight}} points\nPersonnel: {{personnel_weight}} points' },
            { id: 'scoring', title: 'Scoring Method', content: 'Excellent (90-100%): {{excellent_criteria}}\nGood (70-89%): {{good_criteria}}\nSatisfactory (60-69%): {{satisfactory_criteria}}' }
          ],
          variables: ['evaluation_approach', 'evaluation_committee', 'min_score', 'methodology_weight', 'experience_weight', 'personnel_weight', 'excellent_criteria', 'good_criteria', 'satisfactory_criteria']
        }
      }
    };

    return templates[templateType]?.[category] || {
      sections: [
        { id: 'content', title: 'Document Content', content: 'Please customize this template according to your requirements.' }
      ],
      variables: []
    };
  }

  async createDefaultTemplates() {
    const defaultTemplates = [
      // World-Class Templates
      {
        template_name: 'World-Class Construction Tender - Denmark Standard',
        template_type: 'tender_notice',
        category: 'construction',
        template_content: this.getDefaultTemplateContent('tender_notice', 'construction')
      },
      {
        template_name: 'NGO Development Project RFP - International Standard',
        template_type: 'tender_notice',
        category: 'ngo_development',
        template_content: this.getDefaultTemplateContent('tender_notice', 'ngo_development')
      },
      {
        template_name: 'Advanced Supply Procurement - Singapore Model',
        template_type: 'tender_notice',
        category: 'supplies',
        template_content: this.getDefaultTemplateContent('tender_notice', 'supplies')
      },
      {
        template_name: 'Construction Contract Agreement - Advanced',
        template_type: 'contract_agreement',
        category: 'construction',
        template_content: this.getDefaultTemplateContent('contract_agreement', 'construction')
      },
      {
        template_name: 'Comprehensive Technical Evaluation - World Standard',
        template_type: 'evaluation_criteria',
        category: 'technical',
        template_content: this.getDefaultTemplateContent('evaluation_criteria', 'technical')
      }
    ];

    const results = [];
    for (const template of defaultTemplates) {
      const result = await this.createTemplate(template);
      results.push(result);
    }

    return results;
  }
}

export const documentTemplateService = DocumentTemplateService.getInstance();
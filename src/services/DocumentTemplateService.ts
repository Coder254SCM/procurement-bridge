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

  // Pre-defined template contents for common document types
  getDefaultTemplateContent(templateType: string, category: string) {
    const templates: Record<string, Record<string, any>> = {
      'tender_notice': {
        'construction': {
          sections: [
            { id: 'header', title: 'Tender Notice', content: '{{organization_name}}\nTender Notice No: {{tender_number}}' },
            { id: 'project_info', title: 'Project Information', content: 'Project: {{project_name}}\nLocation: {{project_location}}\nEstimated Value: {{budget_amount}}' },
            { id: 'requirements', title: 'Requirements', content: 'Eligibility: {{eligibility_criteria}}\nDocuments: {{required_documents}}' },
            { id: 'deadlines', title: 'Important Dates', content: 'Submission Deadline: {{submission_deadline}}\nOpening Date: {{opening_date}}' }
          ],
          variables: ['organization_name', 'tender_number', 'project_name', 'project_location', 'budget_amount', 'eligibility_criteria', 'required_documents', 'submission_deadline', 'opening_date']
        },
        'supplies': {
          sections: [
            { id: 'header', title: 'Supply Tender Notice', content: '{{organization_name}}\nSupply Tender No: {{tender_number}}' },
            { id: 'items', title: 'Items Required', content: 'Description: {{item_description}}\nQuantity: {{quantity}}\nSpecifications: {{specifications}}' },
            { id: 'delivery', title: 'Delivery Requirements', content: 'Delivery Location: {{delivery_location}}\nDelivery Date: {{delivery_date}}' }
          ],
          variables: ['organization_name', 'tender_number', 'item_description', 'quantity', 'specifications', 'delivery_location', 'delivery_date']
        }
      },
      'contract_agreement': {
        'general': {
          sections: [
            { id: 'parties', title: 'Parties', content: 'Between: {{buyer_name}}\nAnd: {{supplier_name}}' },
            { id: 'scope', title: 'Scope of Work', content: '{{scope_description}}' },
            { id: 'terms', title: 'Terms and Conditions', content: 'Duration: {{contract_duration}}\nValue: {{contract_value}}\nPayment Terms: {{payment_terms}}' },
            { id: 'signatures', title: 'Signatures', content: 'Buyer: ________________\nSupplier: ________________\nDate: {{signature_date}}' }
          ],
          variables: ['buyer_name', 'supplier_name', 'scope_description', 'contract_duration', 'contract_value', 'payment_terms', 'signature_date']
        }
      },
      'evaluation_criteria': {
        'technical': {
          sections: [
            { id: 'technical_criteria', title: 'Technical Evaluation', content: 'Technical Approach: {{technical_weight}}%\nExperience: {{experience_weight}}%\nMethodology: {{methodology_weight}}%' },
            { id: 'scoring', title: 'Scoring Method', content: 'Total Technical Score: 70%\nMinimum Pass Mark: {{pass_mark}}%' }
          ],
          variables: ['technical_weight', 'experience_weight', 'methodology_weight', 'pass_mark']
        },
        'financial': {
          sections: [
            { id: 'financial_criteria', title: 'Financial Evaluation', content: 'Price: {{price_weight}}%\nFinancial Capacity: {{capacity_weight}}%' },
            { id: 'calculations', title: 'Price Calculation', content: 'Lowest Evaluated Price Method\nAbnormally Low Bids: {{low_bid_threshold}}%' }
          ],
          variables: ['price_weight', 'capacity_weight', 'low_bid_threshold']
        }
      }
    };

    return templates[templateType]?.[category] || {
      sections: [
        { id: 'content', title: 'Document Content', content: 'Please add your content here.' }
      ],
      variables: []
    };
  }

  async createDefaultTemplates() {
    const defaultTemplates = [
      {
        template_name: 'Standard Tender Notice - Construction',
        template_type: 'tender_notice',
        category: 'construction',
        template_content: this.getDefaultTemplateContent('tender_notice', 'construction')
      },
      {
        template_name: 'Supply Tender Notice',
        template_type: 'tender_notice',
        category: 'supplies',
        template_content: this.getDefaultTemplateContent('tender_notice', 'supplies')
      },
      {
        template_name: 'General Contract Agreement',
        template_type: 'contract_agreement',
        category: 'general',
        template_content: this.getDefaultTemplateContent('contract_agreement', 'general')
      },
      {
        template_name: 'Technical Evaluation Criteria',
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
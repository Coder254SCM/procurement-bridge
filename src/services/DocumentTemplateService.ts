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

  // Enhanced template contents with Kenya-specific templates
  getDefaultTemplateContent(templateType: string, category: string) {
    const templates: Record<string, Record<string, any>> = {
      'tender_notice': {
        'construction': {
          sections: [
            { id: 'header', title: 'Tender Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nTENDER NOTICE NO: {{tender_number}}\n\nINVITATION TO TENDER FOR {{project_name}}' },
            { id: 'project_info', title: 'Project Information', content: 'Project Title: {{project_name}}\nProject Location: {{project_location}}\nEstimated Contract Value: KES {{budget_amount}}\nContract Duration: {{contract_duration}}\nProcurement Method: {{procurement_method}}' },
            { id: 'eligibility', title: 'Eligibility Criteria', content: '1. Must be registered with National Construction Authority (NCA) Category {{nca_category}}\n2. Must have valid Tax Compliance Certificate from KRA\n3. Certificate of Incorporation/Registration\n4. Audited Financial Statements for the last {{financial_years}} years\n5. {{additional_requirements}}' },
            { id: 'documents', title: 'Required Documents', content: '• Completed Form of Tender\n• Tender Security of KES {{tender_security}} or {{security_percentage}}% of tender price\n• Valid Tax Compliance Certificate\n• Certificate of Incorporation\n• NCA Registration Certificate Category {{nca_category}}\n• Audited Financial Statements ({{financial_years}} years)\n• {{additional_documents}}' },
            { id: 'submission', title: 'Submission Requirements', content: 'Tender Submission Deadline: {{submission_deadline}}\nTender Opening Date: {{opening_date}}\nSubmission Address: {{submission_address}}\nTender Validity Period: {{validity_period}} days' },
            { id: 'procurement_entity', title: 'Procuring Entity Details', content: 'Name: {{organization_name}}\nContact Person: {{contact_person}}\nTelephone: {{contact_phone}}\nEmail: {{contact_email}}\nPhysical Address: {{organization_address}}' }
          ],
          variables: ['organization_name', 'tender_number', 'project_name', 'project_location', 'budget_amount', 'contract_duration', 'procurement_method', 'nca_category', 'financial_years', 'additional_requirements', 'tender_security', 'security_percentage', 'additional_documents', 'submission_deadline', 'opening_date', 'submission_address', 'validity_period', 'contact_person', 'contact_phone', 'contact_email', 'organization_address']
        },
        'supplies': {
          sections: [
            { id: 'header', title: 'Supply Tender Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nTENDER NO: {{tender_number}}\n\nINVITATION TO TENDER FOR SUPPLY OF {{item_description}}' },
            { id: 'scope', title: 'Scope of Supply', content: 'Description: {{item_description}}\nQuantity: {{quantity}} {{unit_of_measure}}\nTechnical Specifications: {{specifications}}\nDelivery Period: {{delivery_period}}\nWarranty Period: {{warranty_period}}' },
            { id: 'eligibility', title: 'Eligibility Requirements', content: '1. Must be registered for VAT with KRA\n2. Valid Tax Compliance Certificate\n3. Certificate of Incorporation/Business Permit\n4. {{supplier_specific_requirements}}\n5. Experience in supply of similar items for {{experience_years}} years' },
            { id: 'delivery', title: 'Delivery Requirements', content: 'Delivery Location: {{delivery_location}}\nDelivery Schedule: {{delivery_schedule}}\nInspection and Acceptance: {{inspection_criteria}}\nPackaging Requirements: {{packaging_requirements}}' },
            { id: 'evaluation', title: 'Evaluation Criteria', content: 'Technical Compliance: Pass/Fail\nFinancial Evaluation: Lowest Evaluated Responsive Tender\nDelivery Period: {{max_delivery_period}} days maximum\nAfter Sales Service: {{service_requirements}}' }
          ],
          variables: ['organization_name', 'tender_number', 'item_description', 'quantity', 'unit_of_measure', 'specifications', 'delivery_period', 'warranty_period', 'supplier_specific_requirements', 'experience_years', 'delivery_location', 'delivery_schedule', 'inspection_criteria', 'packaging_requirements', 'max_delivery_period', 'service_requirements']
        },
        'services': {
          sections: [
            { id: 'header', title: 'Services Tender Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nTENDER NO: {{tender_number}}\n\nINVITATION TO TENDER FOR {{service_description}}' },
            { id: 'scope', title: 'Scope of Services', content: 'Service Description: {{service_description}}\nService Location: {{service_location}}\nDuration: {{service_duration}}\nCommencement Date: {{commencement_date}}\nExpected Outcomes: {{expected_outcomes}}' },
            { id: 'qualifications', title: 'Qualification Requirements', content: '1. Professional Registration with {{professional_body}}\n2. Minimum {{experience_years}} years experience\n3. Academic Qualifications: {{academic_requirements}}\n4. Previous Similar Projects: {{similar_projects}} projects\n5. Key Personnel Qualifications: {{personnel_requirements}}' },
            { id: 'evaluation', title: 'Evaluation Method', content: 'Technical Proposal: {{technical_weight}}% (Minimum {{technical_threshold}}%)\nFinancial Proposal: {{financial_weight}}%\nEvaluation Method: {{evaluation_method}}\nQuality Cost Based Selection (QCBS)' }
          ],
          variables: ['organization_name', 'tender_number', 'service_description', 'service_location', 'service_duration', 'commencement_date', 'expected_outcomes', 'professional_body', 'experience_years', 'academic_requirements', 'similar_projects', 'personnel_requirements', 'technical_weight', 'technical_threshold', 'financial_weight', 'evaluation_method']
        },
        'consultancy': {
          sections: [
            { id: 'header', title: 'Consultancy Services Notice', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nRFP NO: {{rfp_number}}\n\nREQUEST FOR PROPOSALS FOR {{consultancy_title}}' },
            { id: 'background', title: 'Background', content: 'Project Background: {{project_background}}\nObjective: {{project_objective}}\nExpected Duration: {{duration}}\nBudget Estimate: KES {{budget_estimate}}' },
            { id: 'scope', title: 'Scope of Services', content: 'Terms of Reference:\n{{terms_of_reference}}\n\nKey Deliverables:\n{{deliverables}}\n\nReporting Requirements:\n{{reporting_requirements}}' },
            { id: 'consultant_qualifications', title: 'Consultant Qualifications', content: 'Lead Consultant: {{lead_qualifications}}\nTeam Composition: {{team_composition}}\nMinimum Experience: {{minimum_experience}} years\nSimilar Assignments: {{similar_assignments}} completed\nLanguage Requirements: {{language_requirements}}' }
          ],
          variables: ['organization_name', 'rfp_number', 'consultancy_title', 'project_background', 'project_objective', 'duration', 'budget_estimate', 'terms_of_reference', 'deliverables', 'reporting_requirements', 'lead_qualifications', 'team_composition', 'minimum_experience', 'similar_assignments', 'language_requirements']
        }
      },
      'contract_agreement': {
        'construction': {
          sections: [
            { id: 'parties', title: 'Parties to the Contract', content: 'THIS AGREEMENT is made this {{contract_date}} day of {{contract_month}}, {{contract_year}}\n\nBETWEEN:\n{{buyer_name}} (Employer)\nof {{buyer_address}}\n\nAND:\n{{contractor_name}} (Contractor)\nof {{contractor_address}}\nNCA Registration No: {{nca_registration}}' },
            { id: 'recitals', title: 'Recitals', content: 'WHEREAS the Employer invited tenders for {{project_description}} and has accepted the tender submitted by the Contractor for the sum of KES {{contract_sum}};\n\nWHEREAS the Contractor has agreed to execute and complete the works in accordance with the Contract Documents;' },
            { id: 'works', title: 'The Works', content: 'The Works comprise: {{works_description}}\nLocation: {{works_location}}\nCommencement Date: {{commencement_date}}\nCompletion Date: {{completion_date}}\nDefects Liability Period: {{defects_period}} months' },
            { id: 'contract_price', title: 'Contract Price and Payment', content: 'Contract Price: KES {{contract_sum}}\nPayment Terms: {{payment_terms}}\nAdvance Payment: {{advance_payment}}% of contract price\nRetention: {{retention_percentage}}% until completion\nPerformance Security: {{performance_security}}% of contract price' },
            { id: 'conditions', title: 'Conditions of Contract', content: 'This Contract shall be governed by:\n• The General Conditions of Contract for Works\n• The Special Conditions of Contract\n• The Technical Specifications\n• The Drawings\n• The Bill of Quantities\n• {{additional_documents}}' }
          ],
          variables: ['contract_date', 'contract_month', 'contract_year', 'buyer_name', 'buyer_address', 'contractor_name', 'contractor_address', 'nca_registration', 'project_description', 'contract_sum', 'works_description', 'works_location', 'commencement_date', 'completion_date', 'defects_period', 'payment_terms', 'advance_payment', 'retention_percentage', 'performance_security', 'additional_documents']
        },
        'supplies': {
          sections: [
            { id: 'parties', title: 'Supply Agreement Parties', content: 'SUPPLY AGREEMENT dated {{contract_date}}\n\nBETWEEN:\n{{buyer_name}} (Purchaser)\nof {{buyer_address}}\n\nAND:\n{{supplier_name}} (Supplier)\nof {{supplier_address}}\nVAT Registration No: {{vat_number}}' },
            { id: 'goods', title: 'Goods and Services', content: 'Description: {{goods_description}}\nQuantity: {{quantity}} {{unit_measure}}\nSpecifications: As per Schedule A\nDelivery Terms: {{delivery_terms}}\nIncoterms: {{incoterms}}' },
            { id: 'price_payment', title: 'Price and Payment', content: 'Total Contract Price: KES {{total_price}} (inclusive of VAT)\nPayment Terms: {{payment_terms}}\nPayment Method: {{payment_method}}\nCurrency: Kenya Shillings (KES)\nWith-holding Tax: As per Kenya Tax Laws' },
            { id: 'delivery', title: 'Delivery and Acceptance', content: 'Delivery Location: {{delivery_location}}\nDelivery Period: {{delivery_period}} days\nAcceptance Criteria: {{acceptance_criteria}}\nTitle and Risk: Pass upon delivery and acceptance\nWarranty Period: {{warranty_period}}' }
          ],
          variables: ['contract_date', 'buyer_name', 'buyer_address', 'supplier_name', 'supplier_address', 'vat_number', 'goods_description', 'quantity', 'unit_measure', 'delivery_terms', 'incoterms', 'total_price', 'payment_terms', 'payment_method', 'delivery_location', 'delivery_period', 'acceptance_criteria', 'warranty_period']
        }
      },
      'evaluation_criteria': {
        'technical_construction': {
          sections: [
            { id: 'technical_approach', title: 'Technical Evaluation - Construction', content: 'Work Methodology ({{methodology_weight}}%): {{methodology_weight}} marks\nConstruction Program ({{program_weight}}%): {{program_weight}} marks\nQuality Assurance Plan ({{quality_weight}}%): {{quality_weight}} marks\nHealth & Safety Plan ({{safety_weight}}%): {{safety_weight}} marks\nEnvironmental Management ({{environment_weight}}%): {{environment_weight}} marks' },
            { id: 'experience', title: 'Experience and Personnel', content: 'Company Experience ({{company_exp_weight}}%): Similar projects in last {{years}} years\nKey Personnel Qualifications ({{personnel_weight}}%): Project Manager, Site Engineers\nEquipment and Plant ({{equipment_weight}}%): Availability and adequacy\nPast Performance ({{performance_weight}}%): Client references and project outcomes' },
            { id: 'scoring', title: 'Technical Scoring', content: 'Maximum Technical Score: {{max_technical_score}} marks\nMinimum Pass Mark: {{min_pass_mark}} marks ({{pass_percentage}}%)\nScoring Scale:\nExcellent (90-100%): {{excellent_criteria}}\nGood (70-89%): {{good_criteria}}\nSatisfactory (60-69%): {{satisfactory_criteria}}\nBelow 60%: Technically non-responsive' }
          ],
          variables: ['methodology_weight', 'program_weight', 'quality_weight', 'safety_weight', 'environment_weight', 'company_exp_weight', 'years', 'personnel_weight', 'equipment_weight', 'performance_weight', 'max_technical_score', 'min_pass_mark', 'pass_percentage', 'excellent_criteria', 'good_criteria', 'satisfactory_criteria']
        },
        'financial': {
          sections: [
            { id: 'price_evaluation', title: 'Financial Evaluation', content: 'Evaluation Method: Lowest Evaluated Responsive Tender\nPrice Adjustment: {{price_adjustment_method}}\nCurrency Conversion: Central Bank of Kenya rates on {{rate_date}}\nTax Treatment: As per Kenya Tax Laws\nLife Cycle Cost: {{lifecycle_assessment}}' },
            { id: 'financial_capacity', title: 'Financial Capacity Assessment', content: 'Annual Turnover: Minimum KES {{min_turnover}} for last {{assessment_years}} years\nLiquidity Ratio: Minimum {{min_liquidity_ratio}}\nCredit Facilities: Available credit of KES {{min_credit}}\nAudited Accounts: {{required_years}} years of audited financial statements\nFinancial Ratios: {{required_ratios}}' },
            { id: 'abnormal_bids', title: 'Abnormally Low Bids', content: 'Threshold: Bids {{threshold_percentage}}% below average will be investigated\nJustification Required: Written explanation for low pricing\nDocumentation: Detailed cost breakdown\nRisk Assessment: Financial and technical capacity verification\nRejection Criteria: {{rejection_criteria}}' }
          ],
          variables: ['price_adjustment_method', 'rate_date', 'lifecycle_assessment', 'min_turnover', 'assessment_years', 'min_liquidity_ratio', 'min_credit', 'required_years', 'required_ratios', 'threshold_percentage', 'rejection_criteria']
        }
      },
      'rfq_template': {
        'general': {
          sections: [
            { id: 'header', title: 'Request for Quotations', content: 'REPUBLIC OF KENYA\n{{organization_name}}\nREQUEST FOR QUOTATIONS NO: {{rfq_number}}\n\nDate: {{issue_date}}' },
            { id: 'invitation', title: 'Invitation', content: 'You are invited to submit your most competitive quotation for {{item_description}}.\n\nDelivery Period: {{delivery_period}}\nQuotation Validity: {{validity_period}} days\nDelivery Location: {{delivery_location}}' },
            { id: 'specifications', title: 'Specifications', content: 'Item Description: {{detailed_description}}\nQuantity: {{quantity}} {{unit}}\nTechnical Specifications: {{technical_specs}}\nQuality Standards: {{quality_standards}}\nPackaging: {{packaging_requirements}}' },
            { id: 'terms', title: 'Terms and Conditions', content: 'Payment Terms: {{payment_terms}}\nWarranty: {{warranty_period}}\nDelivery Terms: {{delivery_terms}}\nTax: All prices inclusive of applicable taxes\nCurrency: Kenya Shillings (KES)' }
          ],
          variables: ['organization_name', 'rfq_number', 'issue_date', 'item_description', 'delivery_period', 'validity_period', 'delivery_location', 'detailed_description', 'quantity', 'unit', 'technical_specs', 'quality_standards', 'packaging_requirements', 'payment_terms', 'warranty_period', 'delivery_terms']
        }
      },
      'framework_agreement': {
        'multi_supplier': {
          sections: [
            { id: 'framework_header', title: 'Framework Agreement', content: 'FRAMEWORK AGREEMENT FOR {{service_category}}\nFramework Reference: {{framework_ref}}\nDuration: {{framework_duration}} years\nMaximum Value: KES {{max_value}}' },
            { id: 'suppliers', title: 'Framework Suppliers', content: 'Selected Suppliers:\n{{supplier_list}}\n\nRanking Methodology: {{ranking_method}}\nCall-off Procedure: {{calloff_procedure}}\nMinimum Order Value: KES {{min_order}}' },
            { id: 'terms', title: 'Framework Terms', content: 'Pricing Mechanism: {{pricing_mechanism}}\nPrice Review: {{price_review_frequency}}\nPerformance Monitoring: {{performance_kpis}}\nTermination Clause: {{termination_conditions}}\nVariation Procedure: {{variation_process}}' }
          ],
          variables: ['service_category', 'framework_ref', 'framework_duration', 'max_value', 'supplier_list', 'ranking_method', 'calloff_procedure', 'min_order', 'pricing_mechanism', 'price_review_frequency', 'performance_kpis', 'termination_conditions', 'variation_process']
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
      // Construction Templates
      {
        template_name: 'Kenya Standard Construction Tender Notice',
        template_type: 'tender_notice',
        category: 'construction',
        template_content: this.getDefaultTemplateContent('tender_notice', 'construction')
      },
      {
        template_name: 'Construction Contract Agreement - NCA Compliant',
        template_type: 'contract_agreement',
        category: 'construction',
        template_content: this.getDefaultTemplateContent('contract_agreement', 'construction')
      },
      {
        template_name: 'Technical Evaluation Criteria - Construction',
        template_type: 'evaluation_criteria',
        category: 'technical_construction',
        template_content: this.getDefaultTemplateContent('evaluation_criteria', 'technical_construction')
      },
      
      // Supply Templates
      {
        template_name: 'Standard Supply Tender Notice',
        template_type: 'tender_notice',
        category: 'supplies',
        template_content: this.getDefaultTemplateContent('tender_notice', 'supplies')
      },
      {
        template_name: 'Supply Agreement Template',
        template_type: 'contract_agreement',
        category: 'supplies',
        template_content: this.getDefaultTemplateContent('contract_agreement', 'supplies')
      },
      
      // Services Templates
      {
        template_name: 'Professional Services Tender Notice',
        template_type: 'tender_notice',
        category: 'services',
        template_content: this.getDefaultTemplateContent('tender_notice', 'services')
      },
      
      // Consultancy Templates
      {
        template_name: 'Consultancy Services RFP Template',
        template_type: 'tender_notice',
        category: 'consultancy',
        template_content: this.getDefaultTemplateContent('tender_notice', 'consultancy')
      },
      
      // RFQ Templates
      {
        template_name: 'Standard Request for Quotations',
        template_type: 'rfq_template',
        category: 'general',
        template_content: this.getDefaultTemplateContent('rfq_template', 'general')
      },
      
      // Framework Agreement Templates
      {
        template_name: 'Multi-Supplier Framework Agreement',
        template_type: 'framework_agreement',
        category: 'multi_supplier',
        template_content: this.getDefaultTemplateContent('framework_agreement', 'multi_supplier')
      },
      
      // Financial Evaluation
      {
        template_name: 'Financial Evaluation Criteria - Kenya Standard',
        template_type: 'evaluation_criteria',
        category: 'financial',
        template_content: this.getDefaultTemplateContent('evaluation_criteria', 'financial')
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
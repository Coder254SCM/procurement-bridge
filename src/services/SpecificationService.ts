import { supabase } from '@/integrations/supabase/client';

export interface SpecificationItem {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
}

export interface SpecificationTemplate {
  id: string;
  category: string;
  template_name: string;
  specifications: SpecificationItem[];
  mandatory_documents: string[];
  min_specifications: number;
}

export interface TenderSpecification {
  id?: string;
  tender_id: string;
  category: string;
  specification_type: string;
  specification_key: string;
  specification_value: string;
  unit_of_measure?: string;
  is_mandatory: boolean;
  tolerance_range?: string;
}

export interface SpecificationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completeness: number;
  missingMandatory: string[];
  missingDocuments: string[];
}

export class SpecificationService {
  private static instance: SpecificationService;

  public static getInstance(): SpecificationService {
    if (!SpecificationService.instance) {
      SpecificationService.instance = new SpecificationService();
    }
    return SpecificationService.instance;
  }

  async getTemplates(): Promise<SpecificationTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('specification_templates')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      return (data || []).map(this.mapTemplate);
    } catch (error) {
      console.error('Get templates error:', error);
      return [];
    }
  }

  async getTemplateForCategory(category: string): Promise<SpecificationTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('specification_templates')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .single();

      if (error) return null;
      return this.mapTemplate(data);
    } catch (error) {
      console.error('Get template for category error:', error);
      return null;
    }
  }

  async saveSpecifications(tenderId: string, specifications: TenderSpecification[]): Promise<{ success: boolean; error?: string }> {
    try {
      // Delete existing specifications
      await supabase
        .from('tender_specifications')
        .delete()
        .eq('tender_id', tenderId);

      // Insert new specifications
      const { error } = await supabase
        .from('tender_specifications')
        .insert(specifications.map(spec => ({
          tender_id: tenderId,
          category: spec.category,
          specification_type: spec.specification_type,
          specification_key: spec.specification_key,
          specification_value: spec.specification_value,
          unit_of_measure: spec.unit_of_measure,
          is_mandatory: spec.is_mandatory,
          tolerance_range: spec.tolerance_range
        })) as any);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Save specifications error:', error);
      return { success: false, error: error.message };
    }
  }

  async getSpecifications(tenderId: string): Promise<TenderSpecification[]> {
    try {
      const { data, error } = await supabase
        .from('tender_specifications')
        .select('*')
        .eq('tender_id', tenderId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get specifications error:', error);
      return [];
    }
  }

  async validateSpecifications(tenderId: string, category: string): Promise<SpecificationValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const missingMandatory: string[] = [];
    const missingDocuments: string[] = [];

    try {
      // Get template for category
      const template = await this.getTemplateForCategory(category);
      if (!template) {
        warnings.push(`No specification template found for category: ${category}`);
        return { isValid: true, errors, warnings, completeness: 0, missingMandatory, missingDocuments };
      }

      // Get tender specifications
      const specs = await this.getSpecifications(tenderId);
      const specKeys = new Set(specs.map(s => s.specification_key));

      // Check required specifications
      const requiredSpecs = template.specifications.filter(s => s.required);
      for (const required of requiredSpecs) {
        if (!specKeys.has(required.key)) {
          missingMandatory.push(required.label);
          errors.push(`Missing required specification: ${required.label}`);
        }
      }

      // Check minimum specifications count
      if (specs.length < template.min_specifications) {
        errors.push(`Minimum ${template.min_specifications} specifications required (${specs.length} provided)`);
      }

      // Calculate completeness
      const totalRequired = requiredSpecs.length;
      const providedRequired = requiredSpecs.filter(r => specKeys.has(r.key)).length;
      const completeness = totalRequired > 0 ? Math.round((providedRequired / totalRequired) * 100) : 100;

      // Check mandatory documents (would need tender documents to validate)
      for (const doc of template.mandatory_documents) {
        missingDocuments.push(doc); // Placeholder - would check against actual tender documents
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        completeness,
        missingMandatory,
        missingDocuments
      };
    } catch (error: any) {
      console.error('Validate specifications error:', error);
      return { isValid: false, errors: [error.message], warnings, completeness: 0, missingMandatory, missingDocuments };
    }
  }

  async enforceMinimumSpecifications(tenderId: string, category: string): Promise<{ canPublish: boolean; reasons: string[] }> {
    const validation = await this.validateSpecifications(tenderId, category);
    
    if (!validation.isValid) {
      return {
        canPublish: false,
        reasons: validation.errors
      };
    }

    if (validation.completeness < 80) {
      return {
        canPublish: false,
        reasons: [`Specification completeness is ${validation.completeness}%. Minimum 80% required.`]
      };
    }

    return { canPublish: true, reasons: [] };
  }

  private mapTemplate(data: any): SpecificationTemplate {
    return {
      id: data.id,
      category: data.category,
      template_name: data.template_name,
      specifications: data.specifications || [],
      mandatory_documents: data.mandatory_documents || [],
      min_specifications: data.min_specifications || 5
    };
  }
}

export const specificationService = SpecificationService.getInstance();

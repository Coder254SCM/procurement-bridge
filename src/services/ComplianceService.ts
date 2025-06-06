
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFramework, ComplianceCheck } from '@/types/database.types';

export interface ComplianceValidationResult {
  isCompliant: boolean;
  violations: string[];
  warnings: string[];
  score: number;
  framework: string;
}

export class ComplianceService {
  private static instance: ComplianceService;
  private frameworks: ComplianceFramework[] = [];

  public static getInstance(): ComplianceService {
    if (!ComplianceService.instance) {
      ComplianceService.instance = new ComplianceService();
    }
    return ComplianceService.instance;
  }

  async loadFrameworks(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('compliance_frameworks')
        .select('*')
        .eq('active', true);

      if (error) throw error;
      
      // Type assertion to handle Json to Record<string, any> conversion
      this.frameworks = (data || []).map(framework => ({
        ...framework,
        requirements: framework.requirements as Record<string, any>,
        validation_rules: framework.validation_rules as Record<string, any>,
        penalties: framework.penalties as Record<string, any> | null
      }));
    } catch (error) {
      console.error('Load frameworks error:', error);
      throw error;
    }
  }

  async validateEthicsCompliance(data: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'ethics_act');
    if (!framework) {
      throw new Error('Ethics framework not found');
    }

    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check conflict of interest
    if (data.has_conflict_of_interest) {
      violations.push('Conflict of interest declared - requires disclosure');
      score -= 30;
    }

    // Check gift policy compliance
    if (data.gifts_received && data.gifts_received.length > 0) {
      const maxGiftValue = framework.validation_rules.max_gift_value;
      const totalGifts = data.gifts_received.reduce((sum: number, gift: any) => sum + gift.value, 0);
      
      if (totalGifts > maxGiftValue) {
        violations.push(`Total gifts exceed allowed limit of ${maxGiftValue}`);
        score -= 25;
      }
    }

    // Check transparency requirements
    if (data.requires_disclosure && !data.disclosure_submitted) {
      violations.push('Required disclosure not submitted');
      score -= 20;
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings,
      score: Math.max(0, score),
      framework: framework.name
    };
  }

  async validateProcurementCompliance(tenderData: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'procurement_law');
    if (!framework) {
      throw new Error('Procurement framework not found');
    }

    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check minimum bid period
    const submissionDate = new Date(tenderData.submission_deadline);
    const publishDate = new Date(tenderData.created_at);
    const bidPeriodDays = Math.floor((submissionDate.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (bidPeriodDays < framework.validation_rules.minimum_bid_period) {
      violations.push(`Bid period of ${bidPeriodDays} days is below minimum of ${framework.validation_rules.minimum_bid_period} days`);
      score -= 30;
    }

    // Check evaluation criteria
    if (!tenderData.evaluation_criteria || Object.keys(tenderData.evaluation_criteria).length === 0) {
      violations.push('Evaluation criteria not defined');
      score -= 25;
    }

    // Check required documents
    if (!tenderData.required_documents || tenderData.required_documents.length === 0) {
      warnings.push('No required documents specified');
      score -= 10;
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings,
      score: Math.max(0, score),
      framework: framework.name
    };
  }

  async validateFinancialCompliance(data: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'finance_law');
    if (!framework) {
      throw new Error('Financial framework not found');
    }

    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check approval levels
    const amount = data.budget_amount || data.contract_value || 0;
    const approvalLevels = framework.validation_rules.approval_levels;

    let requiredApproval = '';
    if (amount < 1000000) {
      requiredApproval = 'department';
    } else if (amount <= 10000000) {
      requiredApproval = 'accounting_officer';
    } else {
      requiredApproval = 'treasury';
    }

    if (!data.approval_level || data.approval_level !== requiredApproval) {
      violations.push(`Amount of ${amount} requires ${requiredApproval} approval`);
      score -= 40;
    }

    // Check budget availability
    if (!data.budget_confirmed) {
      warnings.push('Budget availability not confirmed');
      score -= 15;
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings,
      score: Math.max(0, score),
      framework: framework.name
    };
  }

  async validateConstructionCompliance(data: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'construction_law');
    if (!framework) {
      throw new Error('Construction framework not found');
    }

    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check building permits
    if (data.requires_building_permit && !data.building_permit_submitted) {
      violations.push('Building permit required but not submitted');
      score -= 35;
    }

    // Check safety standards
    if (!data.safety_compliance_confirmed) {
      violations.push('Safety standards compliance not confirmed');
      score -= 30;
    }

    // Check environmental compliance
    if (data.requires_environmental_impact_assessment && !data.eia_submitted) {
      violations.push('Environmental Impact Assessment required');
      score -= 25;
    }

    return {
      isCompliant: violations.length === 0,
      violations,
      warnings,
      score: Math.max(0, score),
      framework: framework.name
    };
  }

  async runComplianceCheck(
    userId: string,
    checkType: string,
    data: any
  ): Promise<ComplianceCheck> {
    try {
      let validationResult: ComplianceValidationResult;

      switch (checkType) {
        case 'ethics_act':
          validationResult = await this.validateEthicsCompliance(data);
          break;
        case 'procurement_law':
          validationResult = await this.validateProcurementCompliance(data);
          break;
        case 'finance_law':
          validationResult = await this.validateFinancialCompliance(data);
          break;
        case 'construction_law':
          validationResult = await this.validateConstructionCompliance(data);
          break;
        default:
          throw new Error(`Unknown compliance check type: ${checkType}`);
      }

      const { data: complianceCheck, error } = await supabase
        .from('compliance_checks')
        .insert({
          user_id: userId,
          check_type: checkType,
          status: validationResult.isCompliant ? 'verified' : 'flagged',
          result_data: validationResult as any
        })
        .select()
        .single();

      if (error) throw error;
      
      // Type assertion for the returned data
      return {
        ...complianceCheck,
        result_data: complianceCheck.result_data as Record<string, any> | null
      };
    } catch (error) {
      console.error('Compliance check error:', error);
      throw error;
    }
  }
}

export const complianceService = ComplianceService.getInstance();

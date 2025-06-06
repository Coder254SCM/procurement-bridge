
import { supabase } from '@/integrations/supabase/client';
import { ComplianceFramework, ComplianceCheck } from '@/types/database.types';
import { EthicsComplianceValidator } from './compliance/EthicsComplianceValidator';
import { ProcurementComplianceValidator } from './compliance/ProcurementComplianceValidator';
import { FinancialComplianceValidator } from './compliance/FinancialComplianceValidator';
import { ConstructionComplianceValidator } from './compliance/ConstructionComplianceValidator';

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
    return EthicsComplianceValidator.validate(data, framework);
  }

  async validateProcurementCompliance(tenderData: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'procurement_law');
    if (!framework) {
      throw new Error('Procurement framework not found');
    }
    return ProcurementComplianceValidator.validate(tenderData, framework);
  }

  async validateFinancialCompliance(data: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'finance_law');
    if (!framework) {
      throw new Error('Financial framework not found');
    }
    return FinancialComplianceValidator.validate(data, framework);
  }

  async validateConstructionCompliance(data: any): Promise<ComplianceValidationResult> {
    const framework = this.frameworks.find(f => f.type === 'construction_law');
    if (!framework) {
      throw new Error('Construction framework not found');
    }
    return ConstructionComplianceValidator.validate(data, framework);
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

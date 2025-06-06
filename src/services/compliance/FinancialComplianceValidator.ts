
import { ComplianceValidationResult } from '../ComplianceService';

export class FinancialComplianceValidator {
  static validate(data: any, framework: any): ComplianceValidationResult {
    const violations: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Check approval levels
    const amount = data.budget_amount || data.contract_value || 0;
    
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
}

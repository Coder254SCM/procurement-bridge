
import { ComplianceValidationResult } from '../ComplianceService';

export class ConstructionComplianceValidator {
  static validate(data: any, framework: any): ComplianceValidationResult {
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
}

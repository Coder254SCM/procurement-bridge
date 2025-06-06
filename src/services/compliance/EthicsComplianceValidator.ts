
import { ComplianceValidationResult } from '../ComplianceService';

export class EthicsComplianceValidator {
  static validate(data: any, framework: any): ComplianceValidationResult {
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
}

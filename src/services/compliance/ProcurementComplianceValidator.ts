
import { ComplianceValidationResult } from '../ComplianceService';

export class ProcurementComplianceValidator {
  static validate(tenderData: any, framework: any): ComplianceValidationResult {
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
}

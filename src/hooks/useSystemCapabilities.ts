
import { useMemo } from 'react';
import { UserRole, ProcurementMethod, EvaluationCriteriaCategory, VerificationLevel, TenderTemplateType } from '@/types/enums';

interface SystemCapabilities {
  userRoles: UserRole[];
  procurementMethods: ProcurementMethod[];
  evaluationCategories: EvaluationCriteriaCategory[];
  verificationLevels: VerificationLevel[];
  tenderTemplates: TenderTemplateType[];
  complianceFrameworks: string[];
  blockchainFeatures: string[];
  supportedIntegrations: string[];
}

export function useSystemCapabilities(): SystemCapabilities {
  return useMemo(() => ({
    userRoles: [
      UserRole.BUYER,
      UserRole.SUPPLIER,
      UserRole.ADMIN,
      UserRole.EVALUATOR_FINANCE,
      UserRole.EVALUATOR_FINANCIAL,
      UserRole.EVALUATOR_TECHNICAL,
      UserRole.EVALUATOR_PROCUREMENT,
      UserRole.EVALUATOR_ENGINEERING,
      UserRole.EVALUATOR_LEGAL,
      UserRole.EVALUATOR_ACCOUNTING,
      UserRole.SUPPLY_CHAIN_PROFESSIONAL,
      UserRole.AUDITOR
    ],
    
    procurementMethods: [
      ProcurementMethod.OPEN_TENDER,
      ProcurementMethod.RESTRICTED_TENDER,
      ProcurementMethod.DIRECT_PROCUREMENT,
      ProcurementMethod.REQUEST_FOR_PROPOSAL,
      ProcurementMethod.REQUEST_FOR_QUOTATION,
      ProcurementMethod.FRAMEWORK_AGREEMENT,
      ProcurementMethod.DESIGN_COMPETITION,
      ProcurementMethod.TWO_STAGE_TENDERING,
      ProcurementMethod.ELECTRONIC_REVERSE_AUCTION,
      ProcurementMethod.FORWARD_AUCTION,
      ProcurementMethod.DUTCH_AUCTION,
      ProcurementMethod.DESIGN_CONTEST,
      ProcurementMethod.COMPETITIVE_DIALOGUE,
      ProcurementMethod.INNOVATION_PARTNERSHIP
    ],
    
    evaluationCategories: [
      // Financial (5)
      EvaluationCriteriaCategory.PRICE_COMPETITIVENESS,
      EvaluationCriteriaCategory.FINANCIAL_STABILITY,
      EvaluationCriteriaCategory.COST_EFFECTIVENESS,
      EvaluationCriteriaCategory.LIFECYCLE_COSTS,
      EvaluationCriteriaCategory.PAYMENT_TERMS,
      
      // Technical (5)
      EvaluationCriteriaCategory.TECHNICAL_CAPABILITY,
      EvaluationCriteriaCategory.METHODOLOGY,
      EvaluationCriteriaCategory.INNOVATION,
      EvaluationCriteriaCategory.QUALITY_STANDARDS,
      EvaluationCriteriaCategory.TECHNICAL_COMPLIANCE,
      
      // Experience (6)
      EvaluationCriteriaCategory.RELEVANT_EXPERIENCE,
      EvaluationCriteriaCategory.PAST_PERFORMANCE,
      EvaluationCriteriaCategory.QUALIFICATIONS,
      EvaluationCriteriaCategory.INDUSTRY_EXPERTISE,
      EvaluationCriteriaCategory.KEY_PERSONNEL,
      EvaluationCriteriaCategory.PROJECT_MANAGEMENT,
      
      // Operational (5)
      EvaluationCriteriaCategory.DELIVERY_TIMEFRAME,
      EvaluationCriteriaCategory.IMPLEMENTATION_PLAN,
      EvaluationCriteriaCategory.OPERATIONAL_CAPACITY,
      EvaluationCriteriaCategory.QUALITY_ASSURANCE,
      EvaluationCriteriaCategory.SERVICE_LEVEL_AGREEMENTS,
      
      // Compliance (5)
      EvaluationCriteriaCategory.LEGAL_COMPLIANCE,
      EvaluationCriteriaCategory.REGULATORY_COMPLIANCE,
      EvaluationCriteriaCategory.RISK_MANAGEMENT,
      EvaluationCriteriaCategory.INSURANCE_COVERAGE,
      EvaluationCriteriaCategory.SECURITY_MEASURES,
      
      // Sustainability (5)
      EvaluationCriteriaCategory.ENVIRONMENTAL_SUSTAINABILITY,
      EvaluationCriteriaCategory.SOCIAL_RESPONSIBILITY,
      EvaluationCriteriaCategory.LOCAL_CONTENT,
      EvaluationCriteriaCategory.DIVERSITY_INCLUSION,
      EvaluationCriteriaCategory.COMMUNITY_IMPACT,
      
      // Contract (5)
      EvaluationCriteriaCategory.WARRANTY_GUARANTEE_TERMS,
      EvaluationCriteriaCategory.AFTER_SALES_SERVICE,
      EvaluationCriteriaCategory.MAINTENANCE_SUPPORT,
      EvaluationCriteriaCategory.INTELLECTUAL_PROPERTY_RIGHTS_COMPLIANCE,
      EvaluationCriteriaCategory.FLEXIBILITY_IN_CONTRACT_TERMS
    ],
    
    verificationLevels: [
      VerificationLevel.NONE,
      VerificationLevel.BASIC,
      VerificationLevel.INTERMEDIATE,
      VerificationLevel.ADVANCED
    ],
    
    tenderTemplates: [
      TenderTemplateType.STANDARD,
      TenderTemplateType.CONSTRUCTION,
      TenderTemplateType.IT_SERVICES,
      TenderTemplateType.CONSULTING,
      TenderTemplateType.SUPPLIES,
      TenderTemplateType.MEDICAL,
      TenderTemplateType.CUSTOM
    ],
    
    complianceFrameworks: [
      'KYC (Know Your Customer)',
      'AML (Anti-Money Laundering)',
      'Tax Compliance (KRA)',
      'PPRA Regulations',
      'Construction Compliance',
      'Financial Compliance',
      'Ethics Compliance',
      'Procurement Compliance',
      'Environmental Compliance',
      'Safety Standards',
      'Quality Management (ISO 9001)',
      'Information Security (ISO 27001)'
    ],
    
    blockchainFeatures: [
      'Hyperledger Fabric Network',
      'Immutable Document Storage',
      'Smart Contract Automation',
      'Cryptographic Hash Verification',
      'Blockchain Certificate Issuance',
      'Audit Trail Recording',
      'Transaction Transparency',
      'Private Data Collections',
      'Multi-Organization Network',
      'Certificate Authority Integration',
      'Chaincode Deployment',
      'Real-time Blockchain Monitoring'
    ],
    
    supportedIntegrations: [
      'Kenya Revenue Authority (KRA)',
      'Public Procurement Information Portal (PPIP)',
      'Supabase Database & Authentication',
      'Resend Email Service',
      'Hyperledger Fabric Blockchain',
      'Advanced Encryption Services',
      'Real-time Notification System',
      'Document Storage & Verification',
      'Behavior Analysis Engine',
      'Compliance Monitoring System',
      'Audit Logging Service',
      'API Gateway & Management'
    ]
  }), []);
}

export default useSystemCapabilities;

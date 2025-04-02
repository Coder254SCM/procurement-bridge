
export enum UserRole {
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  EVALUATOR_FINANCE = 'evaluator_finance',
  EVALUATOR_TECHNICAL = 'evaluator_technical',
  EVALUATOR_PROCUREMENT = 'evaluator_procurement',
  EVALUATOR_ENGINEERING = 'evaluator_engineering',
  EVALUATOR_LEGAL = 'evaluator_legal',
  EVALUATOR_ACCOUNTING = 'evaluator_accounting',
  SUPPLY_CHAIN_PROFESSIONAL = 'supply_chain_professional'
}

export enum KycStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVIEW = 'under_review'
}

export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced'
}

export enum BusinessType {
  LIMITED_COMPANY = 'limited_company',
  PARTNERSHIP = 'partnership',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  SOCIAL_ENTERPRISE = 'social_enterprise',
  NON_PROFIT = 'non_profit'
}

export enum ProcurementMethod {
  OPEN_TENDER = 'open_tender',
  RESTRICTED_TENDER = 'restricted_tender',
  DIRECT_PROCUREMENT = 'direct_procurement',
  REQUEST_FOR_PROPOSAL = 'request_for_proposal',
  REQUEST_FOR_QUOTATION = 'request_for_quotation',
  FRAMEWORK_AGREEMENT = 'framework_agreement',
  DESIGN_COMPETITION = 'design_competition'
}

export enum EvaluationCriteriaCategory {
  // Financial
  PRICE_COMPETITIVENESS = 'price_competitiveness',
  FINANCIAL_STABILITY = 'financial_stability',
  COST_EFFECTIVENESS = 'cost_effectiveness',
  LIFECYCLE_COSTS = 'lifecycle_costs',
  PAYMENT_TERMS = 'payment_terms',
  
  // Technical
  TECHNICAL_CAPABILITY = 'technical_capability',
  METHODOLOGY = 'methodology',
  INNOVATION = 'innovation',
  QUALITY_STANDARDS = 'quality_standards',
  TECHNICAL_COMPLIANCE = 'technical_compliance',
  
  // Experience
  RELEVANT_EXPERIENCE = 'relevant_experience',
  PAST_PERFORMANCE = 'past_performance',
  QUALIFICATIONS = 'qualifications',
  INDUSTRY_EXPERTISE = 'industry_expertise',
  KEY_PERSONNEL = 'key_personnel',
  PROJECT_MANAGEMENT = 'project_management',
  
  // Operational
  DELIVERY_TIMEFRAME = 'delivery_timeframe',
  IMPLEMENTATION_PLAN = 'implementation_plan',
  OPERATIONAL_CAPACITY = 'operational_capacity',
  QUALITY_ASSURANCE = 'quality_assurance',
  SERVICE_LEVEL_AGREEMENTS = 'service_level_agreements',
  
  // Compliance
  LEGAL_COMPLIANCE = 'legal_compliance',
  REGULATORY_COMPLIANCE = 'regulatory_compliance',
  RISK_MANAGEMENT = 'risk_management',
  INSURANCE_COVERAGE = 'insurance_coverage',
  SECURITY_MEASURES = 'security_measures',
  
  // Sustainability
  ENVIRONMENTAL_SUSTAINABILITY = 'environmental_sustainability',
  SOCIAL_RESPONSIBILITY = 'social_responsibility',
  LOCAL_CONTENT = 'local_content',
  DIVERSITY_INCLUSION = 'diversity_inclusion',
  COMMUNITY_IMPACT = 'community_impact',
  
  // Contract
  WARRANTY_TERMS = 'warranty_terms',
  AFTER_SALES_SUPPORT = 'after_sales_support',
  MAINTENANCE_CAPABILITY = 'maintenance_capability',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  CONTRACT_TERMS_ACCEPTANCE = 'contract_terms_acceptance'
}

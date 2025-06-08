
export enum UserRole {
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  EVALUATOR_FINANCE = 'evaluator_finance',
  EVALUATOR_FINANCIAL = 'evaluator_financial',
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
  UNDER_REVIEW = 'under_review',
  SUBMITTED = 'submitted'
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  FLAGGED = 'flagged'
}

export enum VerificationType {
  BUSINESS = 'business',
  IDENTITY = 'identity',
  FINANCIAL = 'financial',
  REGULATORY = 'regulatory',
  OPERATIONAL = 'operational',
  BUSINESS_REGISTRY = 'business_registry',
  TAX_COMPLIANCE = 'tax_compliance',
  BLOCKCHAIN_VERIFICATION = 'blockchain_verification'
}

export enum ComplianceCheckType {
  KYC = 'kyc',
  AML = 'aml',
  TAX = 'tax',
  REGULATORY = 'regulatory',
  SANCTIONS = 'sanctions',
  PEP_CHECK = 'pep_check',
  SANCTIONS_LIST = 'sanctions_list',
  SHELL_COMPANY_CHECK = 'shell_company_check',
  DISBARRED_ENTITIES = 'disbarred_entities'
}

export enum BehaviorAnalysisType {
  FRAUD_DETECTION = 'fraud_detection',
  PATTERN_MATCHING = 'pattern_matching',
  ANOMALY_DETECTION = 'anomaly_detection',
  RISK_ASSESSMENT = 'risk_assessment',
  PRICING_ANALYSIS = 'pricing_analysis',
  TIMING_ANALYSIS = 'timing_analysis'
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
  DESIGN_COMPETITION = 'design_competition',
  TWO_STAGE_TENDERING = 'two_stage_tendering',
  ELECTRONIC_REVERSE_AUCTION = 'electronic_reverse_auction',
  FORWARD_AUCTION = 'forward_auction',
  DUTCH_AUCTION = 'dutch_auction',
  DESIGN_CONTEST = 'design_contest',
  COMPETITIVE_DIALOGUE = 'competitive_dialogue',
  INNOVATION_PARTNERSHIP = 'innovation_partnership'
}

export enum TenderTemplateType {
  STANDARD = 'standard',
  CONSTRUCTION = 'construction',
  IT_SERVICES = 'it_services',
  CONSULTING = 'consulting',
  SUPPLIES = 'supplies',
  MEDICAL = 'medical',
  CUSTOM = 'custom'
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

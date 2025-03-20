export enum UserRole {
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  ADMIN = 'admin',
  EVALUATOR_FINANCE = 'evaluator_finance',
  EVALUATOR_TECHNICAL = 'evaluator_technical',
  EVALUATOR_PROCUREMENT = 'evaluator_procurement',
  EVALUATOR_ENGINEERING = 'evaluator_engineering',
  EVALUATOR_LEGAL = 'evaluator_legal',
  EVALUATOR_ACCOUNTING = 'evaluator_accounting'
}

export enum TenderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  UNDER_REVIEW = 'under_review',
  AWARDED = 'awarded',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum BidStatus {
  SUBMITTED = 'submitted',
  UNDER_EVALUATION = 'under_evaluation',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn'
}

export enum KycStatus {
  PENDING = 'pending',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum VerificationLevel {
  NONE = 'none',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  FULL = 'full'
}

export enum BusinessType {
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  PARTNERSHIP = 'partnership',
  LIMITED_COMPANY = 'limited_company',
  CORPORATION = 'corporation',
  COOPERATIVE = 'cooperative',
  NGO = 'ngo',
  GOVERNMENT_ENTITY = 'government_entity',
  OTHER = 'other'
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

export enum EvaluationCriteriaWeight {
  TECHNICAL = 'technical',
  FINANCIAL = 'financial',
  COMPLIANCE = 'compliance',
  EXPERIENCE = 'experience',
  QUALITY = 'quality',
  DELIVERY = 'delivery',
  SUSTAINABILITY = 'sustainability'
}

// Enhanced procurement methods based on international standards
export enum ProcurementMethod {
  OPEN_TENDER = 'open_tender',
  RESTRICTED_TENDER = 'restricted_tender',
  DIRECT_PROCUREMENT = 'direct_procurement',
  REQUEST_FOR_QUOTATION = 'request_for_quotation',
  REQUEST_FOR_PROPOSAL = 'request_for_proposal',
  TWO_STAGE_TENDERING = 'two_stage_tendering',
  FRAMEWORK_AGREEMENT = 'framework_agreement',
  ELECTRONIC_REVERSE_AUCTION = 'electronic_reverse_auction',
  DESIGN_CONTEST = 'design_contest',
  COMPETITIVE_DIALOGUE = 'competitive_dialogue',
  INNOVATION_PARTNERSHIP = 'innovation_partnership'
}

// Enhanced evaluation criteria categories based on comprehensive research
export enum EvaluationCriteriaCategory {
  // Financial Criteria
  PRICE_COMPETITIVENESS = 'price_competitiveness',
  FINANCIAL_STABILITY = 'financial_stability',
  COST_EFFECTIVENESS = 'cost_effectiveness',
  LIFECYCLE_COSTS = 'lifecycle_costs',
  PAYMENT_TERMS = 'payment_terms',
  
  // Technical Criteria
  TECHNICAL_CAPABILITY = 'technical_capability',
  METHODOLOGY = 'methodology',
  INNOVATION = 'innovation',
  QUALITY_STANDARDS = 'quality_standards',
  TECHNICAL_COMPLIANCE = 'technical_compliance',
  
  // Experience and Capability
  RELEVANT_EXPERIENCE = 'relevant_experience',
  PAST_PERFORMANCE = 'past_performance',
  QUALIFICATIONS = 'qualifications',
  INDUSTRY_EXPERTISE = 'industry_expertise',
  KEY_PERSONNEL = 'key_personnel',
  PROJECT_MANAGEMENT = 'project_management',
  
  // Operational Criteria
  DELIVERY_TIMEFRAME = 'delivery_timeframe',
  IMPLEMENTATION_PLAN = 'implementation_plan',
  OPERATIONAL_CAPACITY = 'operational_capacity',
  QUALITY_ASSURANCE = 'quality_assurance',
  SERVICE_LEVEL_AGREEMENTS = 'service_level_agreements',
  
  // Compliance and Risk
  LEGAL_COMPLIANCE = 'legal_compliance',
  REGULATORY_COMPLIANCE = 'regulatory_compliance',
  RISK_MANAGEMENT = 'risk_management',
  INSURANCE_COVERAGE = 'insurance_coverage',
  SECURITY_MEASURES = 'security_measures',
  
  // Sustainability and Social Value
  ENVIRONMENTAL_SUSTAINABILITY = 'environmental_sustainability',
  SOCIAL_RESPONSIBILITY = 'social_responsibility',
  LOCAL_CONTENT = 'local_content',
  DIVERSITY_INCLUSION = 'diversity_inclusion',
  COMMUNITY_IMPACT = 'community_impact',
  
  // Contract Management
  WARRANTY_TERMS = 'warranty_terms',
  AFTER_SALES_SUPPORT = 'after_sales_support',
  MAINTENANCE_CAPABILITY = 'maintenance_capability',
  INTELLECTUAL_PROPERTY = 'intellectual_property',
  CONTRACT_TERMS_ACCEPTANCE = 'contract_terms_acceptance'
}

// Digital Identity Verification Enums
export enum VerificationType {
  BUSINESS_REGISTRY = 'business_registry',
  TAX_COMPLIANCE = 'tax_compliance',
  IDENTITY_DOCUMENT = 'identity_document',
  BLOCKCHAIN_VERIFICATION = 'blockchain_verification',
  DIGITAL_SIGNATURE = 'digital_signature',
  BIOMETRIC = 'biometric',
  ADDRESS_VERIFICATION = 'address_verification',
  SOCIAL_VERIFICATION = 'social_verification'
}

export enum ComplianceCheckType {
  PEP_CHECK = 'pep_check',
  SANCTIONS_LIST = 'sanctions_list',
  ADVERSE_MEDIA = 'adverse_media',
  SHELL_COMPANY_CHECK = 'shell_company_check',
  FRAUD_DATABASE_CHECK = 'fraud_database_check',
  DISBARRED_ENTITIES = 'disbarred_entities'
}

export enum BehaviorAnalysisType {
  BID_PATTERN = 'bid_pattern',
  PRICING_ANALYSIS = 'pricing_analysis',
  TIMING_ANALYSIS = 'timing_analysis',
  DOCUMENT_AUTHENTICITY = 'document_authenticity',
  COLLUSION_DETECTION = 'collusion_detection',
  UNUSUAL_ACTIVITY = 'unusual_activity'
}

export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  FLAGGED = 'flagged'
}

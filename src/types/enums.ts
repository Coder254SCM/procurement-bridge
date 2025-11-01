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
  SUPPLY_CHAIN_PROFESSIONAL = 'supply_chain_professional',
  AUDITOR = 'auditor'
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
  // Financial (27 criteria)
  PRICE_COMPETITIVENESS = 'price_competitiveness',
  FINANCIAL_STABILITY = 'financial_stability',
  COST_EFFECTIVENESS = 'cost_effectiveness',
  LIFECYCLE_COSTS = 'lifecycle_costs',
  PAYMENT_TERMS = 'payment_terms',
  BUDGET_ADHERENCE = 'budget_adherence',
  PRICING_STRUCTURE_TRANSPARENCY = 'pricing_structure_transparency',
  INFLATION_ADJUSTMENT_MECHANISM = 'inflation_adjustment_mechanism',
  CREDIT_TERMS = 'credit_terms',
  FINANCIAL_REPORTING_ACCURACY = 'financial_reporting_accuracy',
  PROFIT_MARGIN = 'profit_margin',
  TAX_COMPLIANCE = 'tax_compliance',
  TOTAL_COST_OF_OWNERSHIP = 'total_cost_of_ownership',
  DISCOUNT_INCENTIVE_TERMS = 'discount_incentive_terms',
  CURRENCY_RISK_MANAGEMENT = 'currency_risk_management',
  FINANCIAL_HEALTH_INDICATORS = 'financial_health_indicators',
  CREDITWORTHINESS = 'creditworthiness',
  CASH_FLOW_STABILITY = 'cash_flow_stability',
  BONDING_CAPACITY = 'bonding_capacity',
  WARRANTY_GUARANTEE_TERMS = 'warranty_guarantee_terms',
  COST_ESCALATION_POLICIES = 'cost_escalation_policies',
  PRICE_ADJUSTMENT_FLEXIBILITY = 'price_adjustment_flexibility',
  FINANCING_AVAILABILITY = 'financing_availability',
  INVOICE_ACCURACY = 'invoice_accuracy',
  AUDIT_REPORTING_TRANSPARENCY = 'audit_reporting_transparency',
  CONTRACTUAL_PENALTY_TERMS = 'contractual_penalty_terms',
  VALUE_FOR_MONEY_ANALYSIS = 'value_for_money_analysis',
  
  // Technical (27 criteria)
  TECHNICAL_CAPABILITY = 'technical_capability',
  METHODOLOGY = 'methodology',
  INNOVATION = 'innovation',
  QUALITY_STANDARDS = 'quality_standards',
  TECHNICAL_COMPLIANCE = 'technical_compliance',
  TECHNICAL_DOCUMENTATION_QUALITY = 'technical_documentation_quality',
  SYSTEM_INTEGRATION_CAPABILITY = 'system_integration_capability',
  PROTOTYPING_TESTING_APPROACH = 'prototyping_testing_approach',
  SCALABILITY = 'scalability',
  MAINTENANCE_SUPPORT = 'maintenance_support',
  TECHNOLOGY_MATURITY = 'technology_maturity',
  COMPLIANCE_WITH_TECHNICAL_STANDARDS = 'compliance_with_technical_standards',
  PRODUCT_RELIABILITY = 'product_reliability',
  PRODUCT_PERFORMANCE = 'product_performance',
  DESIGN_FUNCTIONALITY = 'design_functionality',
  TECHNICAL_SUPPORT_HELPDESK = 'technical_support_helpdesk',
  TECHNOLOGY_ROADMAP = 'technology_roadmap',
  SOFTWARE_COMPATIBILITY = 'software_compatibility',
  PRODUCT_CERTIFICATION = 'product_certification',
  USABILITY_USER_EXPERIENCE = 'usability_user_experience',
  CUSTOMIZATION_FLEXIBILITY = 'customization_flexibility',
  TRAINING_PROVISION = 'training_provision',
  TECHNICAL_WARRANTY_TERMS = 'technical_warranty_terms',
  RESEARCH_DEVELOPMENT_FOCUS = 'research_development_focus',
  ENVIRONMENTAL_COMPLIANCE_TECHNICAL = 'environmental_compliance_technical',
  DATA_SECURITY_CONTROLS = 'data_security_controls',
  PRODUCT_SAFETY_STANDARDS = 'product_safety_standards',
  
  // Experience (21 criteria)
  RELEVANT_EXPERIENCE = 'relevant_experience',
  PAST_PERFORMANCE = 'past_performance',
  QUALIFICATIONS = 'qualifications',
  INDUSTRY_EXPERTISE = 'industry_expertise',
  KEY_PERSONNEL = 'key_personnel',
  PROJECT_MANAGEMENT = 'project_management',
  CLIENT_REFERENCES = 'client_references',
  CONTRACT_DISPUTE_HISTORY = 'contract_dispute_history',
  INDUSTRY_AWARDS_RECOGNITIONS = 'industry_awards_recognitions',
  REPEAT_BUSINESS_RATE = 'repeat_business_rate',
  TRAINING_DEVELOPMENT_PROGRAMS = 'training_development_programs',
  SUBCONTRACTOR_MANAGEMENT = 'subcontractor_management',
  RELEVANT_CERTIFICATIONS = 'relevant_certifications',
  CROSS_INDUSTRY_EXPERIENCE = 'cross_industry_experience',
  SUPPLIER_STABILITY_LONGEVITY = 'supplier_stability_longevity',
  MARKET_REPUTATION = 'market_reputation',
  TRACK_RECORD_ON_TIME_DELIVERY = 'track_record_on_time_delivery',
  INNOVATION_EXPERIENCE = 'innovation_experience',
  CRISIS_MANAGEMENT_EXPERIENCE = 'crisis_management_experience',
  RELATIONSHIP_MANAGEMENT = 'relationship_management',
  SCALABILITY_EXPERIENCE = 'scalability_experience',
  
  // Operational (21 criteria)
  DELIVERY_TIMEFRAME = 'delivery_timeframe',
  IMPLEMENTATION_PLAN = 'implementation_plan',
  OPERATIONAL_CAPACITY = 'operational_capacity',
  QUALITY_ASSURANCE = 'quality_assurance',
  SERVICE_LEVEL_AGREEMENTS = 'service_level_agreements',
  RESOURCE_AVAILABILITY = 'resource_availability',
  SUPPLY_CHAIN_ROBUSTNESS = 'supply_chain_robustness',
  CONTINGENCY_PLANNING = 'contingency_planning',
  AFTER_SALES_SERVICE = 'after_sales_service',
  CUSTOMER_SUPPORT_RESPONSIVENESS = 'customer_support_responsiveness',
  TRAINING_KNOWLEDGE_TRANSFER = 'training_knowledge_transfer',
  DISASTER_RECOVERY_PLAN = 'disaster_recovery_plan',
  INVENTORY_MANAGEMENT = 'inventory_management',
  LOGISTICS_TRANSPORTATION_CAPABILITY = 'logistics_transportation_capability',
  TECHNOLOGY_INFRASTRUCTURE = 'technology_infrastructure',
  WORKSITE_SAFETY_PROTOCOLS = 'worksite_safety_protocols',
  COMMUNICATION_TRANSPARENCY = 'communication_transparency',
  FLEXIBILITY_ADAPTABILITY = 'flexibility_adaptability',
  CAPACITY_TO_SCALE = 'capacity_to_scale',
  BUSINESS_CONTINUITY_PLANNING = 'business_continuity_planning',
  ENVIRONMENTAL_MANAGEMENT_SYSTEMS = 'environmental_management_systems',
  
  // Compliance (23 criteria)
  LEGAL_COMPLIANCE = 'legal_compliance',
  REGULATORY_COMPLIANCE = 'regulatory_compliance',
  RISK_MANAGEMENT = 'risk_management',
  INSURANCE_COVERAGE = 'insurance_coverage',
  SECURITY_MEASURES = 'security_measures',
  DATA_PRIVACY_COMPLIANCE = 'data_privacy_compliance',
  ETHICAL_SOURCING = 'ethical_sourcing',
  ANTI_CORRUPTION_MEASURES = 'anti_corruption_measures',
  HEALTH_SAFETY_RECORD = 'health_safety_record',
  LABOR_STANDARDS_COMPLIANCE = 'labor_standards_compliance',
  INTELLECTUAL_PROPERTY_RIGHTS_COMPLIANCE = 'intellectual_property_rights_compliance',
  TRANSPARENCY_DISCLOSURE = 'transparency_disclosure',
  AUDIT_INSPECTION_READINESS = 'audit_inspection_readiness',
  ENVIRONMENTAL_REGULATIONS_COMPLIANCE = 'environmental_regulations_compliance',
  TRADE_COMPLIANCE = 'trade_compliance',
  EXPORT_IMPORT_CONTROLS = 'export_import_controls',
  CONFLICT_OF_INTEREST_POLICIES = 'conflict_of_interest_policies',
  PUBLIC_PROCUREMENT_RULES_ADHERENCE = 'public_procurement_rules_adherence',
  SOCIAL_RESPONSIBILITY_COMPLIANCE = 'social_responsibility_compliance',
  ANTI_BRIBERY_POLICIES = 'anti_bribery_policies',
  WHISTLEBLOWER_PROTECTIONS = 'whistleblower_protections',
  COMPLIANCE_TRAINING_PROGRAMS = 'compliance_training_programs',
  DISASTER_EMERGENCY_COMPLIANCE = 'disaster_emergency_compliance',
  
  // Sustainability (26 criteria)
  ENVIRONMENTAL_SUSTAINABILITY = 'environmental_sustainability',
  SOCIAL_RESPONSIBILITY = 'social_responsibility',
  LOCAL_CONTENT = 'local_content',
  DIVERSITY_INCLUSION = 'diversity_inclusion',
  COMMUNITY_IMPACT = 'community_impact',
  CARBON_FOOTPRINT_REDUCTION = 'carbon_footprint_reduction',
  WASTE_MANAGEMENT_STRATEGY = 'waste_management_strategy',
  ENERGY_EFFICIENCY = 'energy_efficiency',
  WATER_USAGE_MANAGEMENT = 'water_usage_management',
  CIRCULAR_ECONOMY_PRACTICES = 'circular_economy_practices',
  SUSTAINABLE_PROCUREMENT_POLICIES = 'sustainable_procurement_policies',
  SOCIAL_EQUITY_CONTRIBUTION = 'social_equity_contribution',
  CLIMATE_RISK_MANAGEMENT = 'climate_risk_management',
  SUSTAINABILITY_CERTIFICATIONS = 'sustainability_certifications',
  RENEWABLE_ENERGY_USAGE = 'renewable_energy_usage',
  EMISSIONS_MONITORING = 'emissions_monitoring',
  RESOURCE_CONSERVATION_MEASURES = 'resource_conservation_measures',
  STAKEHOLDER_ENGAGEMENT = 'stakeholder_engagement',
  LABOR_RIGHTS_FAIR_TRADE = 'labor_rights_fair_trade',
  SUPPLIER_DIVERSITY_PROGRAMS = 'supplier_diversity_programs',
  GREEN_PRODUCT_INNOVATION = 'green_product_innovation',
  ECOLOGICAL_IMPACT_ASSESSMENT = 'ecological_impact_assessment',
  LONG_TERM_SUSTAINABILITY_GOALS = 'long_term_sustainability_goals',
  ENVIRONMENTAL_REPORTING_AUDIT = 'environmental_reporting_audit',
  ENVIRONMENTAL_RISK_MITIGATION = 'environmental_risk_mitigation',
  CLIMATE_ADAPTATION_PLANNING = 'climate_adaptation_planning',
  
  // Risk Mitigation (8 criteria)
  RISK_IDENTIFICATION_ASSESSMENT = 'risk_identification_assessment',
  RISK_RESPONSE_PLANNING = 'risk_response_planning',
  FINANCIAL_RISK_CONTROLS = 'financial_risk_controls',
  SUPPLY_CHAIN_RISK_MANAGEMENT = 'supply_chain_risk_management',
  MARKET_RISK_ANALYSIS = 'market_risk_analysis',
  TECHNICAL_RISK_MITIGATION = 'technical_risk_mitigation',
  ENVIRONMENTAL_RISK_MANAGEMENT_PLAN = 'environmental_risk_management_plan',
  SOCIAL_RISK_MANAGEMENT = 'social_risk_management',
  
  // Preliminary/Mandatory Checks (7 criteria)
  BID_COMPLETENESS_DOCUMENTATION = 'bid_completeness_documentation',
  MANDATORY_QUALIFICATION_COMPLIANCE = 'mandatory_qualification_compliance',
  BIDDER_REGISTRATION_VALIDATION = 'bidder_registration_validation',
  PROOF_OF_LICENSES_PERMITS = 'proof_of_licenses_permits',
  EVIDENCE_OF_TAX_COMPLIANCE = 'evidence_of_tax_compliance',
  SUBMISSION_TIMELINESS = 'submission_timeliness',
  ADHERENCE_TO_BID_FORMAT = 'adherence_to_bid_format',
  
  // Health, Safety, Environment, Community (8 criteria)
  SITE_ACCESS_CONDITIONS_COMPLIANCE = 'site_access_conditions_compliance',
  HEALTH_SAFETY_POLICIES_RECORDS = 'health_safety_policies_records',
  ENVIRONMENTAL_MANAGEMENT_PLANS = 'environmental_management_plans',
  COMMUNITY_ENGAGEMENT_APPROACHES = 'community_engagement_approaches',
  IMPACT_MITIGATION_PLANS = 'impact_mitigation_plans',
  EMERGENCY_RESPONSE_PLANS = 'emergency_response_plans',
  OCCUPATIONAL_HEALTH_TRAINING = 'occupational_health_training',
  WORKER_SAFETY_EQUIPMENT_PROTOCOLS = 'worker_safety_equipment_protocols',
  
  // Supplier Ethical Practices (9 criteria)
  FAIR_LABOR_PRACTICES_CERTIFICATION = 'fair_labor_practices_certification',
  CONFLICT_OF_INTEREST_DECLARATIONS = 'conflict_of_interest_declarations',
  ANTI_BRIBERY_CORRUPTION_POLICIES = 'anti_bribery_corruption_policies',
  WHISTLEBLOWER_PROTECTION_MECHANISMS = 'whistleblower_protection_mechanisms',
  CORPORATE_GOVERNANCE_STANDARDS = 'corporate_governance_standards',
  HUMAN_RIGHTS_COMPLIANCE = 'human_rights_compliance',
  TRANSPARENCY_IN_SUPPLY_CHAIN = 'transparency_in_supply_chain',
  ETHICAL_SOURCING_VERIFICATION = 'ethical_sourcing_verification',
  SUPPLIER_CODE_OF_CONDUCT = 'supplier_code_of_conduct',
  
  // Adaptability & Flexibility (8 criteria)
  CHANGE_MANAGEMENT_CAPACITY = 'change_management_capacity',
  SUPPLIER_INNOVATION_CAPACITY = 'supplier_innovation_capacity',
  RESPONSIVENESS_TO_SCOPE_CHANGES = 'responsiveness_to_scope_changes',
  ABILITY_TO_MANAGE_TECHNOLOGY_CHANGES = 'ability_to_manage_technology_changes',
  FLEXIBILITY_IN_CONTRACT_TERMS = 'flexibility_in_contract_terms',
  SCALABILITY_OF_SERVICES_PRODUCTS = 'scalability_of_services_products',
  CUSTOMIZATION_OPTIONS = 'customization_options',
  ABILITY_TO_FAST_TRACK_DELIVERY = 'ability_to_fast_track_delivery',
  
  // Contract Management & Performance Monitoring (8 criteria)
  KPI_DEFINITION_MEASUREMENT = 'kpi_definition_measurement',
  CONTRACT_ADMINISTRATION_EXPERIENCE = 'contract_administration_experience',
  REPORTING_COMMUNICATION_PLANS = 'reporting_communication_plans',
  CONTINUOUS_IMPROVEMENT_PLANS = 'continuous_improvement_plans',
  DISPUTE_RESOLUTION_MECHANISMS = 'dispute_resolution_mechanisms',
  PERFORMANCE_INCENTIVES = 'performance_incentives',
  ISSUE_ESCALATION_PROCEDURES = 'issue_escalation_procedures',
  POST_CONTRACT_SUPPORT = 'post_contract_support',
  
  // Social and Economic Objectives (8 criteria)
  LOCAL_CONTENT_EMPLOYMENT_CREATION = 'local_content_employment_creation',
  SUPPORT_FOR_SMES = 'support_for_smes',
  EMPOWERMENT_OF_DISADVANTAGED_GROUPS = 'empowerment_of_disadvantaged_groups',
  ADVANCEMENT_OF_GENDER_EQUALITY = 'advancement_of_gender_equality',
  REGIONAL_ECONOMIC_DEVELOPMENT_IMPACT = 'regional_economic_development_impact',
  CONTRIBUTION_TO_SOCIAL_INFRASTRUCTURE = 'contribution_to_social_infrastructure',
  SUPPLIER_DIVERSITY_INITIATIVES = 'supplier_diversity_initiatives',
  COMMUNITY_DEVELOPMENT_PROGRAMS = 'community_development_programs',
  
  // Market and Competitive Dynamics (8 criteria)
  MARKET_POSITION_SHARE = 'market_position_share',
  COLLABORATIVE_PARTNERSHIP_POTENTIAL = 'collaborative_partnership_potential',
  CO_INNOVATION_POSSIBILITIES = 'co_innovation_possibilities',
  SUPPLY_BASE_DIVERSITY = 'supply_base_diversity',
  LONG_TERM_RELATIONSHIP_POTENTIAL = 'long_term_relationship_potential',
  COMPETITIVE_ADVANTAGE_CONTRIBUTIONS = 'competitive_advantage_contributions',
  TECHNOLOGY_LEADERSHIP = 'technology_leadership',
  INDUSTRY_INFLUENCE_LEADERSHIP = 'industry_influence_leadership'
}


import { UserRole, KycStatus, VerificationLevel, BusinessType, ProcurementMethod, EvaluationCriteriaCategory } from './enums';

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  position: string | null;
  industry: string | null;
  verified: boolean;
  verification_level: VerificationLevel;
  business_type: BusinessType | null;
  business_registration_number: string | null;
  tax_pin: string | null;
  kyc_status: KycStatus;
  kyc_documents: any | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Tender {
  id: string;
  title: string;
  description: string;
  buyer_id: string;
  category: string;
  budget_amount: number | null;
  budget_currency: string;
  submission_deadline: string;
  evaluation_criteria: any;
  status: string;
  blockchain_hash: string | null;
  documents: any | null;
  created_at: string;
  updated_at: string;
  template_type: string | null;
  digital_signature: string | null;
  signature_timestamp: string | null;
  procurement_method: ProcurementMethod | null;
}

export interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  documents: any | null;
  technical_details: any | null;
  blockchain_hash: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  bid_id: string;
  evaluator_id: string;
  evaluation_type: UserRole;
  score: number;
  comments: string | null;
  blockchain_hash: string | null;
  created_at: string;
  updated_at: string;
  recommendation: string | null;
  criteria_scores: EvaluationCriteriaScores | null;
  justification: string | null;
}

// Blockchain specific interfaces
export interface BlockchainTransaction {
  id: string;
  transaction_type: 'tender_creation' | 'bid_submission' | 'evaluation' | 'award';
  entity_id: string;
  hash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  metadata: any;
}

export interface TenderAward {
  id: string;
  tender_id: string;
  winning_bid_id: string;
  awarded_by: string;
  award_date: string;
  contract_details: any;
  blockchain_hash: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface KycVerification {
  id: string;
  user_id: string;
  business_name: string;
  business_type: BusinessType;
  registration_number: string;
  tax_pin: string;
  address: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  documents: any;
  verification_level: VerificationLevel;
  status: KycStatus;
  reviewer_id: string | null;
  review_comments: string | null;
  blockchain_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenderTemplate {
  id: string;
  name: string;
  description: string;
  template_type: string;
  content: any;
  evaluation_criteria: any;
  created_by: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  procurement_method: ProcurementMethod | null;
}

// Define a more flexible evaluation criteria type to allow for dynamic criteria
export interface EvaluationCriteria {
  [key: string]: number;
}

// Define a structure for detailed evaluation scoring across multiple criteria
export interface EvaluationCriteriaScores {
  [EvaluationCriteriaCategory.PRICE_COMPETITIVENESS]?: number;
  [EvaluationCriteriaCategory.FINANCIAL_STABILITY]?: number;
  [EvaluationCriteriaCategory.COST_EFFECTIVENESS]?: number;
  [EvaluationCriteriaCategory.LIFECYCLE_COSTS]?: number;
  [EvaluationCriteriaCategory.PAYMENT_TERMS]?: number;
  
  [EvaluationCriteriaCategory.TECHNICAL_CAPABILITY]?: number;
  [EvaluationCriteriaCategory.METHODOLOGY]?: number;
  [EvaluationCriteriaCategory.INNOVATION]?: number;
  [EvaluationCriteriaCategory.QUALITY_STANDARDS]?: number;
  [EvaluationCriteriaCategory.TECHNICAL_COMPLIANCE]?: number;
  
  [EvaluationCriteriaCategory.RELEVANT_EXPERIENCE]?: number;
  [EvaluationCriteriaCategory.PAST_PERFORMANCE]?: number;
  [EvaluationCriteriaCategory.QUALIFICATIONS]?: number;
  [EvaluationCriteriaCategory.INDUSTRY_EXPERTISE]?: number;
  [EvaluationCriteriaCategory.KEY_PERSONNEL]?: number;
  [EvaluationCriteriaCategory.PROJECT_MANAGEMENT]?: number;
  
  [EvaluationCriteriaCategory.DELIVERY_TIMEFRAME]?: number;
  [EvaluationCriteriaCategory.IMPLEMENTATION_PLAN]?: number;
  [EvaluationCriteriaCategory.OPERATIONAL_CAPACITY]?: number;
  [EvaluationCriteriaCategory.QUALITY_ASSURANCE]?: number;
  [EvaluationCriteriaCategory.SERVICE_LEVEL_AGREEMENTS]?: number;
  
  [EvaluationCriteriaCategory.LEGAL_COMPLIANCE]?: number;
  [EvaluationCriteriaCategory.REGULATORY_COMPLIANCE]?: number;
  [EvaluationCriteriaCategory.RISK_MANAGEMENT]?: number;
  [EvaluationCriteriaCategory.INSURANCE_COVERAGE]?: number;
  [EvaluationCriteriaCategory.SECURITY_MEASURES]?: number;
  
  [EvaluationCriteriaCategory.ENVIRONMENTAL_SUSTAINABILITY]?: number;
  [EvaluationCriteriaCategory.SOCIAL_RESPONSIBILITY]?: number;
  [EvaluationCriteriaCategory.LOCAL_CONTENT]?: number;
  [EvaluationCriteriaCategory.DIVERSITY_INCLUSION]?: number;
  [EvaluationCriteriaCategory.COMMUNITY_IMPACT]?: number;
  
  [EvaluationCriteriaCategory.WARRANTY_TERMS]?: number;
  [EvaluationCriteriaCategory.AFTER_SALES_SUPPORT]?: number;
  [EvaluationCriteriaCategory.MAINTENANCE_CAPABILITY]?: number;
  [EvaluationCriteriaCategory.INTELLECTUAL_PROPERTY]?: number;
  [EvaluationCriteriaCategory.CONTRACT_TERMS_ACCEPTANCE]?: number;
  
  [key: string]: number | undefined;
}

// Define standardized procurement templates based on method
export interface ProcurementMethodTemplate {
  method: ProcurementMethod;
  name: string;
  description: string;
  defaultCriteria: EvaluationCriteria;
  suitableFor: string[];
  regulatoryBasis: string;
}

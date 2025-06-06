
export interface Profile {
  id: string;
  created_at: string;
  full_name: string;
  avatar_url: string;
  updated_at: string;
  email: string;
  company_name: string;
  website: string;
  phone_number: string;
  address: string;
  city: string;
  country: string;
  postal_code: string;
  bio: string;
  position: string;
  industry: string;
  verified: boolean;
  kyc_status: string;
  kyc_documents: Record<string, any>;
  verification_level: string;
  verification_status: string;
  business_type: string | null;
  business_registration_number: string | null;
  tax_pin: string | null;
  documents_uploaded: Record<string, any>;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Tender {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  submission_deadline: string;
  buyer_id: string;
  status: string;
  template_type: string;
  blockchain_hash: string;
  procurement_method: string;
  evaluation_criteria: EvaluationCriteria;
  digital_signature: string;
  signature_timestamp: string;
  required_documents: string[];
  supply_chain_reviewer_id: string;
  uploaded_documents: any[];
}

export interface Bid {
  id: string;
  created_at: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  technical_details: Record<string, any>;
  documents: string[];
  status: string;
  tender?: Partial<Tender>;
  supplier?: Partial<Profile>;
  blockchain_hash?: string;
  updated_at?: string | null;
  uploaded_documents: any[];
}

export interface Evaluation {
  id: string;
  created_at: string;
  bid_id: string;
  evaluator_id: string;
  score: number;
  comments: string | null;
  recommendation: string | null;
  criteria_scores: EvaluationCriteriaScores;
  justification: string | null;
  blockchain_hash: string | null;
  updated_at: string;
  evaluation_type: string;
}

export interface EvaluationCriteria {
  technical: number;
  financial: number;
  experience: number;
  compliance: number;
  delivery: number;
  quality?: number;
  innovation?: number;
  support?: number;
  [key: string]: number | undefined;
}

export interface EvaluationCriteriaScores {
  technical: number;
  financial: number;
  experience: number;
  compliance: number;
  delivery: number;
  quality?: number;
  innovation?: number;
  support?: number;
  [key: string]: number | undefined;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: 'statutory' | 'technical' | 'financial' | 'experience' | 'compliance';
}

export interface TenderReview {
  id: string;
  created_at: string;
  tender_id: string;
  supply_chain_reviewer_id: string;
  supply_chain_status: string;
  supply_chain_remarks: string;
  updated_at: string;
}

export interface BehaviorAnalysis {
  id: string;
  entity_id: string;
  entity_type: string;
  analysis_type: string;
  risk_score: number;
  analysis_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DigitalIdentityVerification {
  id: string;
  user_id: string;
  verification_status: string;
  verification_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  verified_by: string | null;
  verification_date: string | null;
  business_id: string;
  verification_type: string;
  blockchain_hash: string | null;
}

export interface ComplianceCheck {
  id: string;
  user_id: string;
  status: string;
  result_data: Record<string, any> | null;
  check_date: string;
  next_check_date: string | null;
  created_at: string;
  updated_at: string;
  check_type: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  data: Record<string, any> | null;
  timestamp: string;
}

// New interfaces for the added tables
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contract {
  id: string;
  tender_id: string;
  winning_bid_id: string;
  buyer_id: string;
  supplier_id: string;
  contract_value: number;
  contract_currency: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  terms_conditions: Record<string, any> | null;
  milestones: Record<string, any> | null;
  documents: Record<string, any> | null;
  blockchain_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_values: Record<string, any> | null;
  new_values: Record<string, any> | null;
  ip_address: string | null;
  user_agent: string | null;
  compliance_flags: Record<string, any> | null;
  created_at: string;
}

export interface SupplierList {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  suppliers: any[];
  criteria: Record<string, any> | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ExternalIntegration {
  id: string;
  name: string;
  type: string;
  endpoint_url: string;
  api_key_name: string | null;
  configuration: Record<string, any> | null;
  status: string;
  last_sync: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  type: string;
  version: string;
  requirements: Record<string, any>;
  validation_rules: Record<string, any>;
  penalties: Record<string, any> | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  EVALUATOR_TECHNICAL = 'evaluator_technical',
  EVALUATOR_FINANCIAL = 'evaluator_financial',
  EVALUATOR_FINANCE = 'evaluator_finance',
  EVALUATOR_LEGAL = 'evaluator_legal',
  EVALUATOR_PROCUREMENT = 'evaluator_procurement',
  EVALUATOR_ENGINEERING = 'evaluator_engineering',
  EVALUATOR_ACCOUNTING = 'evaluator_accounting',
  SUPPLY_CHAIN_PROFESSIONAL = 'supply_chain_professional',
  AUDITOR = 'auditor'
}

export enum TenderStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
  EVALUATION = 'evaluation',
  AWARDED = 'awarded',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ProcurementMethod {
  OPEN_TENDER = 'open_tender',
  RESTRICTED_TENDER = 'restricted_tender',
  REQUEST_FOR_PROPOSAL = 'request_for_proposal',
  REQUEST_FOR_QUOTATION = 'request_for_quotation',
  DIRECT_PROCUREMENT = 'direct_procurement',
  FRAMEWORK_AGREEMENT = 'framework_agreement',
  TWO_STAGE_TENDERING = 'two_stage_tendering',
  DESIGN_COMPETITION = 'design_competition',
  ELECTRONIC_REVERSE_AUCTION = 'electronic_reverse_auction',
  FORWARD_AUCTION = 'forward_auction',
  DUTCH_AUCTION = 'dutch_auction',
  LOW_VALUE_PROCUREMENT = 'low_value_procurement',
  FORCE_ACCOUNT = 'force_account',
  SPECIALLY_PERMITTED_PROCUREMENT = 'specially_permitted_procurement',
  INNOVATION_PARTNERSHIP = 'innovation_partnership'
}

export enum TenderTemplateType {
  STANDARD = 'standard',
  CONSTRUCTION = 'construction',
  IT_SERVICES = 'it_services',
  CONSULTING = 'consulting',
  SUPPLIES = 'supplies',
  MEDICAL = 'medical',
  CUSTOM = 'custom',
}

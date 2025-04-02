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
}

export interface Bid {
  id: string;
  created_at: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  technical_details: string;
  documents: string[];
  status: string;
  tender?: Tender;
  supplier?: Profile;
}

export interface Evaluation {
  id: string;
  created_at: string;
  bid_id: string;
  evaluator_id: string;
  score: number;
  comments: string;
  recommendation: string;
  criteria_scores: EvaluationCriteriaScores;
  justification: string;
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

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  EVALUATOR_TECHNICAL = 'evaluator_technical',
  EVALUATOR_FINANCIAL = 'evaluator_financial',
  EVALUATOR_LEGAL = 'evaluator_legal',
  SUPPLY_CHAIN_PROFESSIONAL = 'supply_chain_professional',
  AUDITOR = 'auditor'
}

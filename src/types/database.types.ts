
import { UserRole } from './enums';

export interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  position: string | null;
  industry: string | null;
  verified: boolean;
  kyc_status: string;
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

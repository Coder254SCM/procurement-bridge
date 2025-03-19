
export interface Transaction {
  id?: string;
  transaction_type: 'tender_creation' | 'bid_submission' | 'evaluation' | 'award';
  entity_id: string;
  hash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  metadata?: any;
  created_at?: string;
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

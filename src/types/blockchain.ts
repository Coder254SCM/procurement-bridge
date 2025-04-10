
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

export interface BlockchainEndorsement {
  endorser: string;
  signature: string;
  status: string;
}

export interface BlockchainResponse {
  txId: string;
  timestamp: string;
  channelName: string;
  chaincodeName: string;
  endorsementStatus: string;
  blockNumber: number;
  contentHash: string;
  network: string;
  endorsements: BlockchainEndorsement[];
  consensus: boolean;
  verificationNodes?: string[];
}

export interface SmartContractFunction {
  function: string;
  description: string;
  args?: string[];
}


// Hyperledger Fabric network configuration
export const blockchainConfig = {
  networkName: 'ProcureChain',
  channelName: 'procurechannel',
  chaincodeName: 'procurechaincode',
  gatewayUrl: import.meta.env.VITE_FABRIC_GATEWAY_URL || '',
  orgMSPID: 'ProcureChainOrgMSP',
  endorsingPeers: ['peer0.procurechain.org', 'peer1.procurechain.org'],
  chaincodeContracts: {
    tenderContract: 'tender',
    bidContract: 'bid',
    evaluationContract: 'evaluation',
    awardContract: 'award'
  }
};

// Transaction type enumeration
export enum TransactionType {
  TENDER_CREATION = 'tender_creation',
  BID_SUBMISSION = 'bid_submission',
  EVALUATION = 'evaluation',
  AWARD = 'award'
}

// Helper function to format transaction ID for display
export const formatTransactionId = (txId: string): string => {
  if (!txId) return '';
  return `${txId.substring(0, 8)}...${txId.substring(txId.length - 6)}`;
};

// Smart contract function mapping
export const chaincodeOperations = {
  [TransactionType.TENDER_CREATION]: {
    function: 'createTender',
    description: 'Create a new tender record'
  },
  [TransactionType.BID_SUBMISSION]: {
    function: 'submitBid',
    description: 'Submit a new bid for a tender'
  },
  [TransactionType.EVALUATION]: {
    function: 'evaluateBid',
    description: 'Record a bid evaluation'
  },
  [TransactionType.AWARD]: {
    function: 'awardTender',
    description: 'Record a tender award decision'
  }
};

// Blockchain verification status codes
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  FAILED = 'failed',
  TAMPERED = 'tampered'
}

// Calculate hash for content verification
export async function calculateContentHash(content: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(content));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

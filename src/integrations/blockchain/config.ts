
// Hyperledger Fabric network configuration
export const blockchainConfig = {
  networkName: 'ProcureChain',
  channelName: 'procurement-channel',
  chaincodeName: 'procurechaincode',
  connectionProfilePath: '/connection-profile.json', // Will be loaded from server
  walletPath: '/wallet', // Will be managed server-side
  contracts: {
    tenderContract: 'tender',
    bidContract: 'bid',
    evaluationContract: 'evaluation'
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

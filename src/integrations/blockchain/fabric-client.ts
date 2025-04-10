
import { supabase } from '@/integrations/supabase/client';
import { blockchainConfig, TransactionType, chaincodeOperations, calculateContentHash } from './config';
import { Transaction } from '@/types/blockchain';

// Interface for blockchain transaction results
interface TransactionResult {
  success: boolean;
  txId?: string;
  timestamp?: string;
  error?: string;
  blockNumber?: number;
  endorsementStatus?: string;
}

// Main client for Hyperledger Fabric operations
export const fabricClient = {
  // Submit a tender to the blockchain
  async submitTender(tenderId: string, tenderData: any): Promise<TransactionResult> {
    try {
      // Calculate content hash for verification
      const contentHash = await calculateContentHash(tenderData);
      
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.TENDER_CREATION,
          payload: {
            id: tenderId,
            contentHash,
            chaincodeFn: chaincodeOperations[TransactionType.TENDER_CREATION].function,
            ...tenderData
          }
        }
      });
      
      if (error) throw error;
      return { 
        success: true, 
        txId: data.txId, 
        timestamp: data.timestamp,
        blockNumber: data.blockchainResponse?.blockNumber,
        endorsementStatus: data.blockchainResponse?.endorsementStatus
      };
    } catch (error) {
      console.error('Error submitting tender to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit a bid to the blockchain
  async submitBid(bidId: string, bidData: any): Promise<TransactionResult> {
    try {
      // Calculate content hash for verification
      const contentHash = await calculateContentHash(bidData);
      
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.BID_SUBMISSION,
          payload: {
            id: bidId,
            contentHash,
            chaincodeFn: chaincodeOperations[TransactionType.BID_SUBMISSION].function,
            ...bidData
          }
        }
      });
      
      if (error) throw error;
      return { 
        success: true, 
        txId: data.txId, 
        timestamp: data.timestamp,
        blockNumber: data.blockchainResponse?.blockNumber,
        endorsementStatus: data.blockchainResponse?.endorsementStatus
      };
    } catch (error) {
      console.error('Error submitting bid to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit an evaluation to the blockchain
  async submitEvaluation(evaluationId: string, evaluationData: any): Promise<TransactionResult> {
    try {
      // Calculate content hash for verification
      const contentHash = await calculateContentHash(evaluationData);
      
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.EVALUATION,
          payload: {
            id: evaluationId,
            contentHash,
            chaincodeFn: chaincodeOperations[TransactionType.EVALUATION].function,
            ...evaluationData
          }
        }
      });
      
      if (error) throw error;
      return { 
        success: true, 
        txId: data.txId, 
        timestamp: data.timestamp,
        blockNumber: data.blockchainResponse?.blockNumber,
        endorsementStatus: data.blockchainResponse?.endorsementStatus
      };
    } catch (error) {
      console.error('Error submitting evaluation to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit a tender award to the blockchain
  async submitAward(awardId: string, awardData: any): Promise<TransactionResult> {
    try {
      // Calculate content hash for verification
      const contentHash = await calculateContentHash(awardData);
      
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.AWARD,
          payload: {
            id: awardId,
            contentHash,
            chaincodeFn: chaincodeOperations[TransactionType.AWARD].function,
            ...awardData
          }
        }
      });
      
      if (error) throw error;
      return { 
        success: true, 
        txId: data.txId, 
        timestamp: data.timestamp,
        blockNumber: data.blockchainResponse?.blockNumber,
        endorsementStatus: data.blockchainResponse?.endorsementStatus  
      };
    } catch (error) {
      console.error('Error submitting award to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get transaction details from the database
  async getTransaction(txId: string): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('hash', txId)
        .single();
        
      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  },
  
  // Get all transactions for an entity (tender, bid, etc.)
  async getEntityTransactions(entityId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('entity_id', entityId)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      return data as Transaction[] || [];
    } catch (error) {
      console.error('Error fetching entity transactions:', error);
      return [];
    }
  },
  
  // Verify content hash against blockchain record
  async verifyContentHash(entityId: string, content: any): Promise<boolean> {
    try {
      // Get the latest transaction for this entity
      const transactions = await this.getEntityTransactions(entityId);
      if (!transactions || transactions.length === 0) return false;
      
      // Calculate hash of the current content
      const currentHash = await calculateContentHash(content);
      
      // Get stored hash from the blockchain record
      const storedHash = transactions[0]?.metadata?.content_hash;
      
      // Compare hashes
      return currentHash === storedHash;
    } catch (error) {
      console.error('Error verifying content hash:', error);
      return false;
    }
  }
};

// Hook that provides blockchain verification capabilities
export const useBlockchainVerification = () => {
  // Verify a tender is on the blockchain
  const verifyTender = async (tenderId: string): Promise<boolean> => {
    try {
      const transactions = await fabricClient.getEntityTransactions(tenderId);
      return transactions.some(tx => tx.transaction_type === TransactionType.TENDER_CREATION);
    } catch (error) {
      console.error('Error verifying tender:', error);
      return false;
    }
  };
  
  // Verify a bid is on the blockchain
  const verifyBid = async (bidId: string): Promise<boolean> => {
    try {
      const transactions = await fabricClient.getEntityTransactions(bidId);
      return transactions.some(tx => tx.transaction_type === TransactionType.BID_SUBMISSION);
    } catch (error) {
      console.error('Error verifying bid:', error);
      return false;
    }
  };
  
  // Verify content integrity with blockchain record
  const verifyContentIntegrity = async (entityId: string, content: any): Promise<boolean> => {
    return fabricClient.verifyContentHash(entityId, content);
  };
  
  return { verifyTender, verifyBid, verifyContentIntegrity };
};

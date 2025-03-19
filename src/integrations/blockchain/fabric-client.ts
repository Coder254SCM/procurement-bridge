
import { supabase } from '@/integrations/supabase/client';
import { blockchainConfig, TransactionType } from './config';

// Interface for blockchain transaction results
interface TransactionResult {
  success: boolean;
  txId?: string;
  timestamp?: string;
  error?: string;
}

// Main client for Hyperledger Fabric operations
export const fabricClient = {
  // Submit a tender to the blockchain
  async submitTender(tenderId: string, tenderData: any): Promise<TransactionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.TENDER_CREATION,
          payload: {
            id: tenderId,
            ...tenderData
          }
        }
      });
      
      if (error) throw error;
      return { success: true, txId: data.txId, timestamp: data.timestamp };
    } catch (error) {
      console.error('Error submitting tender to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit a bid to the blockchain
  async submitBid(bidId: string, bidData: any): Promise<TransactionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.BID_SUBMISSION,
          payload: {
            id: bidId,
            ...bidData
          }
        }
      });
      
      if (error) throw error;
      return { success: true, txId: data.txId, timestamp: data.timestamp };
    } catch (error) {
      console.error('Error submitting bid to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit an evaluation to the blockchain
  async submitEvaluation(evaluationId: string, evaluationData: any): Promise<TransactionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.EVALUATION,
          payload: {
            id: evaluationId,
            ...evaluationData
          }
        }
      });
      
      if (error) throw error;
      return { success: true, txId: data.txId, timestamp: data.timestamp };
    } catch (error) {
      console.error('Error submitting evaluation to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Submit a tender award to the blockchain
  async submitAward(awardId: string, awardData: any): Promise<TransactionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('fabric-gateway', {
        body: {
          operation: TransactionType.AWARD,
          payload: {
            id: awardId,
            ...awardData
          }
        }
      });
      
      if (error) throw error;
      return { success: true, txId: data.txId, timestamp: data.timestamp };
    } catch (error) {
      console.error('Error submitting award to blockchain:', error);
      return { success: false, error: error.message };
    }
  },
  
  // Get transaction details from the database
  async getTransaction(txId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('hash', txId)
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  },
  
  // Get all transactions for an entity (tender, bid, etc.)
  async getEntityTransactions(entityId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('entity_id', entityId)
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching entity transactions:', error);
      return [];
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
  
  return { verifyTender, verifyBid };
};

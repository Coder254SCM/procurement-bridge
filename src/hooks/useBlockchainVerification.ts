
import { useState, useCallback } from 'react';
import { 
  blockchainVerificationService, 
  VerificationData, 
  VerificationLevel 
} from '@/services/BlockchainVerificationService';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/blockchain';
import { fabricClient } from '@/integrations/blockchain/fabric-client';

interface UseBlockchainVerificationProps {
  onVerificationComplete?: (verification: any) => void;
}

export function useBlockchainVerification({ onVerificationComplete }: UseBlockchainVerificationProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const { toast } = useToast();

  // Verify a supplier's identity on the blockchain
  const verifySupplier = useCallback(async (
    supplierId: string,
    businessName: string,
    level: VerificationLevel = VerificationLevel.STANDARD,
    documentHash?: string
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      // Show processing toast
      toast({
        title: "Verification Started",
        description: "Starting verification process. This may take a moment...",
        variant: "default"
      });
      
      // Run verification process through service
      const result = await blockchainVerificationService.verifySupplier(
        supplierId,
        businessName,
        level,
        documentHash
      );
      
      setVerificationData(result);
      
      // Handle verification outcome
      if (result.status === 'verified') {
        toast({
          title: "Verification Complete",
          description: `Verification was successful with score ${result.overallScore}/100`,
          variant: "default"
        });
        
        // Fetch the transaction history after successful verification
        if (result.blockchainTxId) {
          fetchTransactionHistory(supplierId);
        }
        
        // Call the completion callback if provided
        if (onVerificationComplete) {
          onVerificationComplete({
            status: 'verified',
            level: level,
            lastVerified: result.lastVerified,
            blockchainTxId: result.blockchainTxId,
            verificationScore: result.overallScore
          });
        }
      } else {
        setError(`Verification failed with score ${result.overallScore}/100. Minimum required score is 70/100.`);
        
        toast({
          title: "Verification Failed",
          description: `Verification process failed with score ${result.overallScore}/100`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown verification error";
      setError(errorMessage);
      
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, onVerificationComplete]);
  
  // Fetch transaction history for a supplier
  const fetchTransactionHistory = useCallback(async (entityId: string) => {
    try {
      const transactions = await fabricClient.getEntityTransactions(entityId);
      setTransactionHistory(transactions);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }, []);
  
  // Verify document authenticity
  const verifyDocument = useCallback(async (documentHash: string) => {
    try {
      setIsProcessing(true);
      
      // Simulate document verification on blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isValid = Math.random() > 0.1; // 90% chance of success for demo
      
      if (isValid) {
        toast({
          title: "Document Verified",
          description: "The document's authenticity has been verified on the blockchain",
          variant: "default"
        });
      } else {
        toast({
          title: "Document Verification Failed",
          description: "The document could not be verified. It may have been tampered with.",
          variant: "destructive"
        });
      }
      
      return isValid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Document verification error";
      toast({
        title: "Verification Error",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);
  
  const resetVerification = useCallback(() => {
    setVerificationData(null);
    setError(null);
  }, []);
  
  return {
    verifySupplier,
    verifyDocument,
    fetchTransactionHistory,
    resetVerification,
    isProcessing,
    verificationData,
    error,
    transactionHistory
  };
}

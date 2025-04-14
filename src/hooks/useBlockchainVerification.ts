
import { useState, useCallback, useEffect } from 'react';
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

// Status enum for tracking the verification state
export enum VerificationStatus {
  IDLE = 'idle',
  PROCESSING = 'processing',
  VERIFYING = 'verifying',
  SUBMITTING = 'submitting',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export function useBlockchainVerification({ onVerificationComplete }: UseBlockchainVerificationProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const [currentStatus, setCurrentStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [transactionDetails, setTransactionDetails] = useState<{
    txId?: string;
    timestamp?: string;
    attemptCount: number;
    lastAttempt?: Date;
  }>({
    attemptCount: 0
  });
  const { toast } = useToast();

  // Clear error when status changes to avoid stale errors
  useEffect(() => {
    if (currentStatus !== VerificationStatus.FAILED && error) {
      setError(null);
    }
  }, [currentStatus, error]);

  // Update transaction stats for UI tracking
  const updateTransactionStats = useCallback((txId?: string, attempt: number = 1) => {
    setTransactionDetails(prev => ({
      ...prev,
      txId: txId || prev.txId,
      attemptCount: attempt,
      lastAttempt: new Date()
    }));
  }, []);
  
  // Fetch transaction history for a supplier with enhanced error handling
  const fetchTransactionHistory = useCallback(async (entityId: string) => {
    try {
      const transactions = await fabricClient.getEntityTransactions(entityId);
      setTransactionHistory(transactions);
      
      // Notify about transaction history
      if (transactions.length > 0) {
        toast({
          title: "Transaction History Retrieved",
          description: `Found ${transactions.length} blockchain transactions for this entity.`,
          variant: "default"
        });
      }
      
      return transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      toast({
        title: "Transaction History Error",
        description: "Could not retrieve blockchain transaction history.",
        variant: "destructive"
      });
      return [];
    }
  }, [toast]);

  // Verify a supplier's identity on the blockchain with enhanced status tracking
  const verifySupplier = useCallback(async (
    supplierId: string,
    businessName: string,
    level: VerificationLevel = VerificationLevel.STANDARD,
    documentHash?: string
  ) => {
    try {
      setIsProcessing(true);
      setError(null);
      setCurrentStatus(VerificationStatus.PROCESSING);
      
      // Show detailed processing toast
      toast({
        title: "Verification Started",
        description: "Starting identity verification process. This may take a moment...",
        variant: "default"
      });
      
      // Update status to verifying phase
      setCurrentStatus(VerificationStatus.VERIFYING);
      
      // Run verification process through service
      const result = await blockchainVerificationService.verifySupplier(
        supplierId,
        businessName,
        level,
        documentHash
      );
      
      setVerificationData(result);
      
      // Update status based on verification outcome
      if (result.status === 'verified') {
        setCurrentStatus(VerificationStatus.CONFIRMED);
        
        // Show success toast with more details
        toast({
          title: "Verification Complete",
          description: `Verification was successful with score ${result.overallScore}/100. Transaction recorded on blockchain.`,
          variant: "default"
        });
        
        // Fetch the transaction history after successful verification
        if (result.blockchainTxId) {
          updateTransactionStats(result.blockchainTxId);
          await fetchTransactionHistory(supplierId);
          setCurrentStatus(VerificationStatus.COMPLETED);
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
        setCurrentStatus(VerificationStatus.FAILED);
        setError(`Verification failed with score ${result.overallScore}/100. Minimum required score is 70/100.`);
        
        // Show detailed failure toast
        toast({
          title: "Verification Failed",
          description: `Verification process failed with score ${result.overallScore}/100. Please check requirements and try again.`,
          variant: "destructive"
        });
      }
      
    } catch (error) {
      setCurrentStatus(VerificationStatus.FAILED);
      const errorMessage = error instanceof Error ? error.message : "Unknown verification error";
      setError(errorMessage);
      
      // Show detailed error toast
      toast({
        title: "Verification Error",
        description: `Error: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast, onVerificationComplete, updateTransactionStats, fetchTransactionHistory]);
  
  // Verify document authenticity with enhanced status tracking
  const verifyDocument = useCallback(async (documentHash: string) => {
    try {
      setIsProcessing(true);
      setCurrentStatus(VerificationStatus.VERIFYING);
      
      // Show processing toast
      toast({
        title: "Document Verification",
        description: "Verifying document authenticity on blockchain...",
        variant: "default"
      });
      
      // Simulate document verification on blockchain
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isValid = Math.random() > 0.1; // 90% chance of success for demo
      
      if (isValid) {
        setCurrentStatus(VerificationStatus.CONFIRMED);
        toast({
          title: "Document Verified",
          description: "The document's authenticity has been verified on the blockchain",
          variant: "default"
        });
      } else {
        setCurrentStatus(VerificationStatus.FAILED);
        toast({
          title: "Document Verification Failed",
          description: "The document could not be verified. It may have been tampered with.",
          variant: "destructive"
        });
      }
      
      return isValid;
    } catch (error) {
      setCurrentStatus(VerificationStatus.FAILED);
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
  
  // Reset verification state
  const resetVerification = useCallback(() => {
    setVerificationData(null);
    setError(null);
    setCurrentStatus(VerificationStatus.IDLE);
    setTransactionDetails({
      attemptCount: 0
    });
  }, []);
  
  // Retry verification with the same parameters
  const retryVerification = useCallback(async (
    supplierId?: string,
    businessName?: string,
    level?: VerificationLevel,
    documentHash?: string
  ) => {
    if (!supplierId || !businessName || !level) {
      toast({
        title: "Retry Failed",
        description: "Missing required verification parameters",
        variant: "destructive"
      });
      return;
    }
    
    // Increment attempt counter
    updateTransactionStats(undefined, transactionDetails.attemptCount + 1);
    
    // Reset error state
    setError(null);
    
    // Retry verification
    await verifySupplier(supplierId, businessName, level, documentHash);
  }, [verifySupplier, toast, transactionDetails.attemptCount, updateTransactionStats]);
  
  return {
    verifySupplier,
    verifyDocument,
    fetchTransactionHistory,
    resetVerification,
    retryVerification,
    isProcessing,
    verificationData,
    error,
    transactionHistory,
    currentStatus,
    transactionDetails
  };
}

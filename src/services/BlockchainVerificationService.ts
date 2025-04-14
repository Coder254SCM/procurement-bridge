import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { toast } from '@/components/ui/use-toast';

// Define verification levels with required checks
export enum VerificationLevel {
  BASIC = 'basic',
  STANDARD = 'standard',
  ADVANCED = 'advanced'
}

// Verification check types
export enum VerificationCheckType {
  BUSINESS_REGISTRY = 'business_registry',
  TAX_COMPLIANCE = 'tax_compliance',
  OWNERSHIP = 'ownership_structure',
  FINANCIAL = 'financial_statements',
  PERFORMANCE = 'past_performance',
  IDENTITY = 'identity_verification'
}

// Verification check result
export interface VerificationCheckResult {
  type: VerificationCheckType;
  passed: boolean;
  score: number; // 0-100
  details?: string;
  timestamp: string;
}

// Verification data structure
export interface VerificationData {
  supplierId: string;
  businessName: string;
  verificationLevel: VerificationLevel;
  checks: VerificationCheckResult[];
  overallScore: number;
  documentHash?: string;
  blockchainTxId?: string;
  lastVerified?: string;
  status: 'unverified' | 'in_progress' | 'verified' | 'failed';
}

// Transaction queue interface
interface TransactionQueueItem {
  id: string;
  data: any;
  attempts: number;
  lastAttempt?: Date;
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Service for handling blockchain verification processes
 */
class BlockchainVerificationService {
  private transactionQueue: TransactionQueueItem[] = [];
  private isProcessing = false;
  private maxRetries = 3;
  private retryDelay = 2000; // Initial delay in ms
  
  // Verification process with multiple validation steps
  async verifySupplier(
    supplierId: string, 
    businessName: string,
    level: VerificationLevel = VerificationLevel.STANDARD,
    documentHash?: string
  ): Promise<VerificationData> {
    try {
      // Initialize verification data
      const verificationData: VerificationData = {
        supplierId,
        businessName,
        verificationLevel: level,
        checks: [],
        overallScore: 0,
        documentHash,
        status: 'in_progress'
      };
      
      // Determine which checks to perform based on level
      const checksToPerform = this.getChecksForLevel(level);
      let totalScore = 0;
      
      // Perform each verification check
      for (const checkType of checksToPerform) {
        const checkResult = await this.performVerificationCheck(supplierId, checkType);
        verificationData.checks.push(checkResult);
        totalScore += checkResult.score;
      }
      
      // Calculate overall score
      verificationData.overallScore = Math.round(totalScore / checksToPerform.length);
      
      // Record on blockchain if all checks passed minimum threshold
      if (verificationData.overallScore >= 70) {
        // Submit to blockchain with queue
        const blockchainResult = await this.queueBlockchainTransaction(supplierId, {
          entityType: 'supplier',
          verificationDetails: verificationData,
          timestamp: new Date().toISOString(),
          verifiedBy: 'system', // In a real app, this would be the user's ID
          action: 'supplier_verification'
        });
        
        if (blockchainResult?.success) {
          verificationData.blockchainTxId = blockchainResult.txId;
          verificationData.lastVerified = new Date().toISOString();
          verificationData.status = 'verified';
        } else {
          verificationData.status = 'failed';
        }
      } else {
        verificationData.status = 'failed';
      }
      
      return verificationData;
      
    } catch (error) {
      console.error('Error during supplier verification:', error);
      toast({
        title: "Verification Error",
        description: "Failed to complete the verification process. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    }
  }
  
  // Queue a blockchain transaction with retry mechanism
  async queueBlockchainTransaction(id: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Add to queue
      this.transactionQueue.push({
        id,
        data,
        attempts: 0,
        onSuccess: resolve,
        onError: reject
      });
      
      // Start processing if not already
      if (!this.isProcessing) {
        this.processTransactionQueue();
      }
    });
  }
  
  // Process transaction queue with backoff strategy
  private async processTransactionQueue() {
    if (this.transactionQueue.length === 0) {
      this.isProcessing = false;
      return;
    }
    
    this.isProcessing = true;
    const transaction = this.transactionQueue[0];
    transaction.attempts++;
    transaction.lastAttempt = new Date();
    
    try {
      // Submit to blockchain
      const result = await fabricClient.submitEvaluation(transaction.id, transaction.data);
      
      if (result.success) {
        // Success - remove from queue and call success callback
        this.transactionQueue.shift();
        if (transaction.onSuccess) {
          transaction.onSuccess(result);
        }
      } else {
        throw new Error(result.error || "Transaction failed without specific reason");
      }
    } catch (error) {
      console.error(`Transaction attempt ${transaction.attempts} failed:`, error);
      
      if (transaction.attempts >= this.maxRetries) {
        // Max retries reached - remove from queue and call error callback
        this.transactionQueue.shift();
        if (transaction.onError) {
          transaction.onError(error);
        }
      } else {
        // Calculate exponential backoff delay
        const delay = this.retryDelay * Math.pow(2, transaction.attempts - 1);
        
        toast({
          title: "Blockchain Transaction Retry",
          description: `Retrying transaction in ${Math.round(delay / 1000)} seconds...`,
          variant: "default"
        });
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // Process next transaction
    setTimeout(() => this.processTransactionQueue(), 100);
  }
  
  // Determine which checks to perform based on verification level
  private getChecksForLevel(level: VerificationLevel): VerificationCheckType[] {
    switch (level) {
      case VerificationLevel.BASIC:
        return [
          VerificationCheckType.IDENTITY,
          VerificationCheckType.BUSINESS_REGISTRY
        ];
      case VerificationLevel.STANDARD:
        return [
          VerificationCheckType.IDENTITY,
          VerificationCheckType.BUSINESS_REGISTRY,
          VerificationCheckType.TAX_COMPLIANCE
        ];
      case VerificationLevel.ADVANCED:
        return [
          VerificationCheckType.IDENTITY,
          VerificationCheckType.BUSINESS_REGISTRY,
          VerificationCheckType.TAX_COMPLIANCE,
          VerificationCheckType.OWNERSHIP,
          VerificationCheckType.FINANCIAL,
          VerificationCheckType.PERFORMANCE
        ];
      default:
        return [VerificationCheckType.IDENTITY, VerificationCheckType.BUSINESS_REGISTRY];
    }
  }
  
  // Perform individual verification check
  private async performVerificationCheck(supplierId: string, checkType: VerificationCheckType): Promise<VerificationCheckResult> {
    // This would typically involve API calls to actual verification services
    // For demonstration, we'll simulate with random scores weighted by check type
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let baseScore = 75 + Math.floor(Math.random() * 20); // Base score between 75-95
    
    // Adjust score based on check type (simulated for demo)
    switch (checkType) {
      case VerificationCheckType.IDENTITY:
        baseScore = Math.min(baseScore + 5, 100); // Identity checks more likely to pass
        break;
      case VerificationCheckType.FINANCIAL:
        baseScore = Math.max(baseScore - 15, 0) + Math.floor(Math.random() * 30); // Financial more variable
        break;
      case VerificationCheckType.PERFORMANCE:
        baseScore = Math.max(baseScore - 10, 0) + Math.floor(Math.random() * 25); // Performance more variable
        break;
      default:
        // Keep base score for other checks
    }
    
    // Ensure score is between 0-100
    const score = Math.min(Math.max(baseScore, 0), 100);
    
    return {
      type: checkType,
      passed: score >= 70,
      score,
      details: `Verification ${score >= 70 ? 'passed' : 'failed'} with score ${score}/100`,
      timestamp: new Date().toISOString()
    };
  }
}

export const blockchainVerificationService = new BlockchainVerificationService();


import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { VerificationStatus } from '@/hooks/useBlockchainVerification';

interface VerificationResultProps {
  verificationData: any;
  currentStatus: VerificationStatus;
  transactionDetails: {
    attemptCount: number;
  };
  error: string | null;
  handleRetry: () => void;
  isProcessing: boolean;
}

export const VerificationResult = ({
  verificationData,
  currentStatus,
  transactionDetails,
  error,
  handleRetry,
  isProcessing
}: VerificationResultProps) => {
  return (
    <>
      {/* Success confirmation */}
      {verificationData && verificationData.status === 'verified' && (
        <Alert variant="default" className="bg-green-50 border-green-200 mt-4">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle>Verification Successful</AlertTitle>
          <AlertDescription>
            <p>Supplier verified with score: {verificationData.overallScore}/100</p>
            <p className="text-xs mt-1 font-mono">TX: {verificationData.blockchainTxId?.substring(0, 10)}...</p>
            <p className="text-xs mt-1 text-green-600">All credentials cryptographically verified</p>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            {error}
            {transactionDetails.attemptCount > 0 && (
              <div className="text-xs mt-1">Attempt: {transactionDetails.attemptCount}</div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Failure with retry option */}
      {currentStatus === VerificationStatus.FAILED && transactionDetails.attemptCount > 0 && (
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRetry}
            className="text-xs"
            disabled={isProcessing}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry Verification
          </Button>
        </div>
      )}
    </>
  );
};

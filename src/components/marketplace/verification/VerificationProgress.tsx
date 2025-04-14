
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { VerificationSteps } from './VerificationSteps';
import { VerificationStatus } from '@/hooks/useBlockchainVerification';
import { Database, Network, Shield, RefreshCw } from 'lucide-react';

interface VerificationProgressProps {
  currentStatus: VerificationStatus;
  currentStep: number;
  steps: string[];
  transactionDetails: {
    txId?: string;
    timestamp?: string;
    attemptCount: number;
    lastAttempt?: Date;
  };
  getProgressPercentage: () => number;
}

export const VerificationProgress = ({
  currentStatus,
  currentStep,
  steps,
  transactionDetails,
  getProgressPercentage
}: VerificationProgressProps) => {
  return (
    <div className="border rounded-md p-3 mt-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Verification Progress</h4>
      </div>
      
      {/* Progress bar */}
      <div className="mb-3">
        <Progress value={getProgressPercentage()} className="h-2" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Initializing</span>
          <span>{getProgressPercentage()}%</span>
          <span>Complete</span>
        </div>
      </div>
      
      <VerificationSteps steps={steps} currentStep={currentStep} />
      
      {/* Transaction details */}
      {transactionDetails.txId && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <h5 className="text-xs font-medium mb-2">Transaction Details</h5>
          <div className="grid grid-cols-2 gap-y-1 text-xs">
            <div className="text-muted-foreground flex items-center">
              <Database className="h-3 w-3 mr-1" /> TX ID:
            </div>
            <div className="font-mono truncate">
              {transactionDetails.txId.substring(0, 10)}...
            </div>
            
            <div className="text-muted-foreground flex items-center">
              <Network className="h-3 w-3 mr-1" /> Network:
            </div>
            <div>Hyperledger Fabric</div>
            
            <div className="text-muted-foreground flex items-center">
              <Shield className="h-3 w-3 mr-1" /> Status:
            </div>
            <div>
              {currentStatus === VerificationStatus.COMPLETED ? (
                <span className="text-green-600">Confirmed</span>
              ) : (
                <span className="text-amber-600">Pending</span>
              )}
            </div>
            
            {transactionDetails.attemptCount > 0 && (
              <>
                <div className="text-muted-foreground flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" /> Attempts:
                </div>
                <div>{transactionDetails.attemptCount}</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Loader2, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SupplierProps } from './SupplierCard';
import { VerificationDetails } from './SupplierVerificationBadge';
import { 
  useBlockchainVerification,
  VerificationStatus
} from '@/hooks/useBlockchainVerification';
import { VerificationLevel } from '@/services/BlockchainVerificationService';

// Import the new components
import { VerificationForm } from './verification/VerificationForm';
import { VerificationProgress } from './verification/VerificationProgress';
import { VerificationStatusBadge } from './verification/VerificationStatusBadge';
import { VerificationResult } from './verification/VerificationResult';
import { calculateDummyHash, getLevelDescription } from './verification/utils';

interface SupplierVerificationDialogProps {
  supplier: SupplierProps;
  onVerificationComplete?: (verification: VerificationDetails) => void;
  isDisabled?: boolean;
}

const SupplierVerificationDialog = ({ 
  supplier, 
  onVerificationComplete, 
  isDisabled = false 
}: SupplierVerificationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [documentHash, setDocumentHash] = useState("");
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>(VerificationLevel.STANDARD);
  const { toast } = useToast();
  
  // Use our blockchain verification hook with expanded features
  const { 
    verifySupplier, 
    isProcessing, 
    verificationData, 
    error, 
    resetVerification,
    retryVerification,
    currentStatus,
    transactionDetails
  } = useBlockchainVerification({
    onVerificationComplete
  });
  
  // Verification steps tracking with dynamic progress calculation
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Validating business credentials",
    "Verifying tax compliance",
    "Checking past performance records",
    "Validating digital identity",
    "Recording verification on blockchain"
  ];

  // Use effect to auto-advance steps based on status changes
  useEffect(() => {
    if (isProcessing) {
      // Calculate the appropriate step based on status
      switch (currentStatus) {
        case VerificationStatus.PROCESSING:
          setCurrentStep(0);
          break;
        case VerificationStatus.VERIFYING:
          setCurrentStep(Math.min(2, steps.length - 1));
          break;
        case VerificationStatus.SUBMITTING:
          setCurrentStep(3);
          break;
        case VerificationStatus.CONFIRMED:
          setCurrentStep(4);
          break;
        case VerificationStatus.COMPLETED:
          setCurrentStep(steps.length - 1);
          break;
      }
    }
  }, [currentStatus, isProcessing, steps.length]);
  
  const handleVerification = async () => {
    // Reset step tracker
    setCurrentStep(0);
    
    try {
      // Call verification process
      await verifySupplier(
        supplier.id, 
        supplier.name,
        verificationLevel,
        documentHash || undefined
      );
      
      // If successful, close the dialog after a delay
      if (!error && currentStatus === VerificationStatus.COMPLETED) {
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Verification process error:', error);
    }
  };
  
  const handleRetry = async () => {
    await retryVerification(
      supplier.id,
      supplier.name,
      verificationLevel,
      documentHash || undefined
    );
  };
  
  const resetAndClose = () => {
    resetVerification();
    setCurrentStep(0);
    setIsOpen(false);
  };
  
  // Generate document hash if empty
  const handleGenerateHash = () => {
    const generatedHash = calculateDummyHash(supplier.id + new Date().toISOString());
    setDocumentHash(generatedHash);
    
    toast({
      title: "Hash Generated",
      description: "A document hash has been generated based on supplier credentials",
      variant: "default"
    });
  };
  
  // Calculate progress percentage for verification process
  const getProgressPercentage = () => {
    if (currentStatus === VerificationStatus.COMPLETED) return 100;
    if (currentStatus === VerificationStatus.FAILED) return 0;
    
    // Calculate based on current step
    return Math.min(Math.round((currentStep / (steps.length - 1)) * 100), 100);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open || !isProcessing) {
        setIsOpen(open);
        if (!open) resetVerification();
      }
    }}>
      <DialogTrigger asChild>
        <Button disabled={isDisabled} onClick={() => setIsOpen(true)}>
          {isDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Verify on Blockchain'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Blockchain Verification</DialogTitle>
            <VerificationStatusBadge currentStatus={currentStatus} />
          </div>
          <DialogDescription>
            Verify supplier credentials and record them on the blockchain for immutable proof.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <VerificationResult 
            verificationData={verificationData}
            currentStatus={currentStatus}
            transactionDetails={transactionDetails}
            error={error}
            handleRetry={handleRetry}
            isProcessing={isProcessing}
          />
          
          <VerificationForm
            supplierName={supplier.name}
            verificationLevel={verificationLevel}
            setVerificationLevel={setVerificationLevel}
            documentHash={documentHash}
            setDocumentHash={setDocumentHash}
            handleGenerateHash={handleGenerateHash}
            isProcessing={isProcessing}
            getLevelDescription={getLevelDescription}
          />
          
          {isProcessing && (
            <VerificationProgress
              currentStatus={currentStatus}
              currentStep={currentStep}
              steps={steps}
              transactionDetails={transactionDetails}
              getProgressPercentage={getProgressPercentage}
            />
          )}
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={resetAndClose}
            disabled={isProcessing}
          >
            {verificationData?.status === 'verified' ? "Close" : "Cancel"}
          </Button>
          {verificationData?.status !== 'verified' && currentStatus !== VerificationStatus.PROCESSING && (
            <Button 
              onClick={handleVerification}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : currentStatus === VerificationStatus.FAILED ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Verification
                </>
              ) : (
                'Start Verification'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierVerificationDialog;


import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Loader2, 
  Info, 
  FileText, 
  AlertTriangle, 
  RefreshCw,
  Network,
  Shield,
  Database,
  Clock
} from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SupplierProps } from './SupplierCard';
import { VerificationDetails } from './SupplierVerificationBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  useBlockchainVerification,
  VerificationStatus
} from '@/hooks/useBlockchainVerification';
import { 
  VerificationLevel 
} from '@/services/BlockchainVerificationService';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface SupplierVerificationDialogProps {
  supplier: SupplierProps;
  onVerificationComplete?: (verification: VerificationDetails) => void;
  isDisabled?: boolean;
}

const SupplierVerificationDialog = ({ supplier, onVerificationComplete, isDisabled = false }: SupplierVerificationDialogProps) => {
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
  
  // Helper function to generate a deterministic hash for demo purposes
  const calculateDummyHash = (text: string) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
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
  
  const getLevelDescription = (level: VerificationLevel) => {
    switch (level) {
      case VerificationLevel.BASIC:
        return 'Basic identity and business registry checks';
      case VerificationLevel.STANDARD:
        return 'Standard verification including tax compliance';
      case VerificationLevel.ADVANCED:
        return 'Advanced verification with financial and performance history';
      default:
        return '';
    }
  };
  
  // Get status badge based on current verification status
  const renderStatusBadge = () => {
    switch (currentStatus) {
      case VerificationStatus.PROCESSING:
      case VerificationStatus.VERIFYING:
      case VerificationStatus.SUBMITTING:
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
            <span>Processing</span>
          </Badge>
        );
      case VerificationStatus.CONFIRMED:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span>Confirming</span>
          </Badge>
        );
      case VerificationStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
            <span>Completed</span>
          </Badge>
        );
      case VerificationStatus.FAILED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Info className="h-3.5 w-3.5 mr-1.5" />
            <span>Ready</span>
          </Badge>
        );
    }
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
            {renderStatusBadge()}
          </div>
          <DialogDescription>
            Verify supplier credentials and record them on the blockchain for immutable proof.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
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
          
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Supplier</label>
            <Input value={supplier.name} disabled />
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Verification Level</label>
            <Select
              value={verificationLevel}
              onValueChange={(value) => setVerificationLevel(value as VerificationLevel)}
              disabled={isProcessing}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select verification level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VerificationLevel.BASIC}>
                  <div className="flex flex-col">
                    <span>Basic</span>
                    <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.BASIC)}</span>
                  </div>
                </SelectItem>
                <SelectItem value={VerificationLevel.STANDARD}>
                  <div className="flex flex-col">
                    <span>Standard</span>
                    <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.STANDARD)}</span>
                  </div>
                </SelectItem>
                <SelectItem value={VerificationLevel.ADVANCED}>
                  <div className="flex flex-col">
                    <span>Advanced</span>
                    <span className="text-xs text-muted-foreground mt-1">{getLevelDescription(VerificationLevel.ADVANCED)}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              Higher verification levels require more comprehensive checks
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Document Hash</label>
              <Button
                variant="outline" 
                size="sm"
                className="h-7 text-xs"
                onClick={handleGenerateHash}
                disabled={isProcessing}
              >
                <FileText className="h-3 w-3 mr-1" />
                Generate
              </Button>
            </div>
            <Input 
              placeholder="Enter document hash or generate one" 
              value={documentHash}
              onChange={(e) => setDocumentHash(e.target.value)}
              disabled={isProcessing}
            />
            <p className="text-xs text-muted-foreground mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              The hash represents the cryptographic fingerprint of supplier documents
            </p>
          </div>
          
          {isProcessing && (
            <div className="border rounded-md p-3 mt-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Verification Progress</h4>
                {renderStatusBadge()}
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
              
              <div className="space-y-2 mt-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                    )}
                    <span className={`text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              
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
          )}
          
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


import React, { useState } from 'react';
import { CheckCircle, Loader2, Info, FileText, AlertTriangle } from 'lucide-react';
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
  useBlockchainVerification 
} from '@/hooks/useBlockchainVerification';
import { 
  VerificationLevel 
} from '@/services/BlockchainVerificationService';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  
  // Use our new blockchain verification hook
  const { 
    verifySupplier, 
    isProcessing, 
    verificationData, 
    error, 
    resetVerification 
  } = useBlockchainVerification({
    onVerificationComplete
  });
  
  // Verification steps tracking
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Validating business credentials",
    "Verifying tax compliance",
    "Checking past performance records",
    "Validating digital identity",
    "Recording verification on blockchain"
  ];
  
  const handleVerification = async () => {
    // Reset step tracker
    setCurrentStep(0);
    
    // Start tracking steps
    const stepInterval = setInterval(() => {
      setCurrentStep(current => {
        // Don't go beyond number of steps
        if (current < steps.length - 1) {
          return current + 1;
        }
        return current;
      });
    }, 1500);
    
    try {
      // Call verification process
      await verifySupplier(
        supplier.id, 
        supplier.name,
        verificationLevel,
        documentHash || undefined
      );
      
      // If successful, close the dialog after a delay
      if (!error) {
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } finally {
      // Clear interval regardless of outcome
      clearInterval(stepInterval);
    }
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
          <DialogTitle>Blockchain Verification</DialogTitle>
          <DialogDescription>
            Verify supplier credentials and record them on the blockchain for immutable proof.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Verification Progress</h4>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                  Processing
                </Badge>
              </div>
              <div className="space-y-2">
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
            </div>
          )}
          
          {verificationData && verificationData.status === 'verified' && (
            <Alert variant="default" className="bg-green-50 border-green-200 mt-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Verification Successful</AlertTitle>
              <AlertDescription>
                <p>Supplier verified with score: {verificationData.overallScore}/100</p>
                <p className="text-xs mt-1 font-mono">TX: {verificationData.blockchainTxId?.substring(0, 10)}...</p>
              </AlertDescription>
            </Alert>
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
          {verificationData?.status !== 'verified' && (
            <Button 
              onClick={handleVerification}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : error ? (
                'Retry Verification'
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

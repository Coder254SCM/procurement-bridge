
import React, { useState } from 'react';
import { CheckCircle, Loader2, Info } from 'lucide-react';
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
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { useToast } from '@/hooks/use-toast';
import { SupplierProps } from './SupplierCard';
import { VerificationDetails } from './SupplierVerificationBadge';

interface SupplierVerificationDialogProps {
  supplier: SupplierProps;
  onVerificationComplete?: (verification: VerificationDetails) => void;
}

const SupplierVerificationDialog = ({ supplier, onVerificationComplete }: SupplierVerificationDialogProps) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [documentHash, setDocumentHash] = useState("");
  const { toast } = useToast();
  
  // Verification steps tracking
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Validating business credentials",
    "Verifying tax compliance",
    "Checking past performance records",
    "Validating digital identity",
    "Recording verification on blockchain"
  ];
  
  const simulateVerification = async () => {
    setIsVerifying(true);
    setCurrentStep(0);
    
    // Simulate step-by-step verification with delays
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentStep(i + 1);
    }
    
    try {
      // Submit verification to blockchain
      const verificationData = {
        id: `verification_${supplier.id}`,
        supplierId: supplier.id,
        name: supplier.name,
        documentHash: documentHash || calculateDummyHash(supplier.id),
        verificationDate: new Date().toISOString(),
        verificationLevel: supplier.verification?.level || 'standard'
      };
      
      const blockchainResult = await fabricClient.submitTender(`verification_${supplier.id}`, verificationData);
      
      if (blockchainResult.success) {
        const newVerification: VerificationDetails = {
          status: 'verified',
          level: supplier.verification?.level || 'standard',
          lastVerified: new Date().toISOString(),
          blockchainTxId: blockchainResult.txId,
          verificationScore: Math.round(supplier.rating * 20),
          completedProjects: supplier.completedProjects,
          performanceRating: supplier.rating
        };
        
        if (onVerificationComplete) {
          onVerificationComplete(newVerification);
        }
        
        toast({
          title: "Verification Complete",
          description: "Supplier has been successfully verified on the blockchain.",
          variant: "default"
        });
        
        setTimeout(() => {
          setIsOpen(false);
          setIsVerifying(false);
        }, 1000);
      } else {
        throw new Error("Blockchain verification failed");
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "There was an error during the verification process.",
        variant: "destructive"
      });
      setIsVerifying(false);
    }
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
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Verify on Blockchain</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Blockchain Verification</DialogTitle>
          <DialogDescription>
            Verify supplier credentials and record them on the blockchain for immutable proof.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Supplier</label>
            <Input value={supplier.name} disabled />
          </div>
          
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Document Hash (optional)</label>
            <Input 
              placeholder="Enter document hash or leave empty to generate" 
              value={documentHash}
              onChange={(e) => setDocumentHash(e.target.value)}
              disabled={isVerifying}
            />
            <p className="text-xs text-muted-foreground mt-1">
              <Info className="h-3 w-3 inline mr-1" />
              If left empty, a hash will be generated based on supplier credentials
            </p>
          </div>
          
          {isVerifying && (
            <div className="border rounded-md p-3 mt-6">
              <h4 className="text-sm font-medium mb-2">Verification Progress</h4>
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
        </div>
        
        <DialogFooter className="flex space-x-2 sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isVerifying}
          >
            Cancel
          </Button>
          <Button 
            onClick={simulateVerification}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Start Verification'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierVerificationDialog;

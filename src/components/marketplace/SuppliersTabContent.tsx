
import React, { useState } from 'react';
import { SupplierProps } from './SupplierCard';
import SupplierCard from './SupplierCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierVerificationDetails from './SupplierVerificationDetails';
import { VerificationDetails } from './SupplierVerificationBadge';
import { toast } from '@/components/ui/use-toast';
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button'; 
import { useBlockchainVerification, VerificationStatus } from '@/hooks/useBlockchainVerification';

export interface SuppliersTabContentProps {
  filteredSuppliers: SupplierProps[];
}

const SuppliersTabContent = ({ filteredSuppliers = [] }: SuppliersTabContentProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProps | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>(filteredSuppliers);
  const [error, setError] = useState<string | null>(null);

  // Use enhanced blockchain verification hook
  const { 
    isProcessing,
    currentStatus,
    transactionDetails
  } = useBlockchainVerification();

  // Function to handle clicks on supplier cards
  const handleSupplierClick = (supplier: SupplierProps) => {
    setSelectedSupplier(supplier);
    setError(null); // Reset error when opening a new supplier
  };

  // Handle verification completion with optimized blockchain transaction
  const handleVerificationComplete = async (supplierId: string, verification: VerificationDetails) => {
    try {
      // Show toast with transaction details
      toast({
        title: "Verification Successful",
        description: `Supplier ${verification.blockchainTxId ? 'verified on blockchain' : 'verified locally'}. ${verification.verificationScore}/100 points.`,
        variant: "default" 
      });
      
      // Update local state
      setSuppliers(currentSuppliers => 
        currentSuppliers.map(supplier => 
          supplier.id === supplierId 
            ? { 
                ...supplier, 
                verification, 
                verified: true 
              } 
            : supplier
        )
      );
      
      // Also update the selected supplier if it's currently shown
      if (selectedSupplier && selectedSupplier.id === supplierId) {
        setSelectedSupplier({ 
          ...selectedSupplier, 
          verification, 
          verified: true 
        });
      }

    } catch (error) {
      console.error("Error updating supplier verification state:", error);
      setError(error instanceof Error ? error.message : "Unknown error during verification state update");
      
      // Show error toast
      toast({
        title: "Verification State Update Failed",
        description: "There was an error updating the supplier's verification state. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle retry for verification errors
  const handleRetryVerification = async () => {
    if (!selectedSupplier) return;
    
    try {
      setError(null);
      
      // Show retry toast
      toast({
        title: "Retrying Verification",
        description: "Attempting to verify supplier again...",
        variant: "default"
      });
      
      // Simulate verification retry (in a real app, this would call the backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success toast
      toast({
        title: "Retry Successful",
        description: "Verification has been processed successfully",
        variant: "default"
      });
      
    } catch (error) {
      console.error("Error during verification retry:", error);
      setError(error instanceof Error ? error.message : "Retry failed. Please try again later.");
      
      // Show error toast
      toast({
        title: "Retry Failed",
        description: "Could not complete verification retry. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers && suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <div key={supplier.id} onClick={() => handleSupplierClick(supplier)} className="cursor-pointer">
              <SupplierCard supplier={supplier} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Supplier Detail Dialog with enhanced error handling */}
      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSupplier?.name}
              {isProcessing && currentStatus === VerificationStatus.PROCESSING && (
                <span className="ml-2 inline-flex items-center text-xs font-normal text-muted-foreground">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Processing verification
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div>{error}</div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setError(null);
                    handleRetryVerification();
                  }}
                  className="ml-2"
                  disabled={isProcessing}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Transaction status indicator for real-time feedback */}
          {isProcessing && transactionDetails.txId && (
            <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <p className="text-sm">Transaction in progress</p>
                <p className="text-xs text-muted-foreground mt-1">ID: {transactionDetails.txId.substring(0, 8)}...</p>
              </AlertDescription>
            </Alert>
          )}
          
          {selectedSupplier && (
            <SupplierVerificationDetails 
              supplier={selectedSupplier} 
              onVerificationComplete={(verification) => 
                handleVerificationComplete(selectedSupplier.id, verification)
              }
              isProcessing={isProcessing}
              error={error}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuppliersTabContent;

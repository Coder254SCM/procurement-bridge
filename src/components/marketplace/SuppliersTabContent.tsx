
import React, { useState } from 'react';
import { SupplierProps } from './SupplierCard';
import SupplierCard from './SupplierCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierVerificationDetails from './SupplierVerificationDetails';
import { VerificationDetails } from './SupplierVerificationBadge';
import { toast } from '@/components/ui/use-toast';
import { fabricClient } from '@/integrations/blockchain/fabric-client';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface SuppliersTabContentProps {
  filteredSuppliers: SupplierProps[];
}

const SuppliersTabContent = ({ filteredSuppliers = [] }: SuppliersTabContentProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProps | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>(filteredSuppliers);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Function to handle clicks on supplier cards
  const handleSupplierClick = (supplier: SupplierProps) => {
    setSelectedSupplier(supplier);
    setError(null); // Reset error when opening a new supplier
  };

  // Handle verification completion with retry logic
  const handleVerificationComplete = async (supplierId: string, verification: VerificationDetails) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Submit to blockchain with retry logic
      let result = null;
      let currentRetry = 0;
      
      while (currentRetry <= retryCount && !result?.success) {
        try {
          result = await fabricClient.submitEvaluation(supplierId, {
            entityType: 'supplier',
            verificationDetails: verification,
            timestamp: new Date().toISOString(),
            verifiedBy: 'system', // In a real app, this would be the user's ID
            action: 'supplier_verification'
          });
          
          if (result.success) break;
          
          // If not successful but no explicit error thrown, create an error
          if (!result.success) {
            throw new Error(result.error || "Verification failed without specific error");
          }
        } catch (retryError) {
          console.error(`Attempt ${currentRetry + 1} failed:`, retryError);
          currentRetry++;
          
          // Only show toast for final retry
          if (currentRetry > retryCount) {
            throw retryError; // Re-throw to be caught by outer try/catch
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, currentRetry) * 500));
        }
      }

      if (result?.success) {
        // Update local state
        setSuppliers(currentSuppliers => 
          currentSuppliers.map(supplier => 
            supplier.id === supplierId 
              ? { 
                  ...supplier, 
                  verification: {
                    ...verification,
                    blockchainTxId: result.txId,
                    lastVerified: new Date().toISOString()
                  }, 
                  verified: true 
                } 
              : supplier
          )
        );
        
        // Also update the selected supplier if it's currently shown
        if (selectedSupplier && selectedSupplier.id === supplierId) {
          setSelectedSupplier({ 
            ...selectedSupplier, 
            verification: {
              ...verification,
              blockchainTxId: result.txId,
              lastVerified: new Date().toISOString()
            }, 
            verified: true 
          });
        }

        // Reset retry count on success
        setRetryCount(0);

        // Show success notification
        toast({
          title: "Verification Successful",
          description: `Supplier verification recorded on blockchain. Transaction: ${result.txId?.substring(0, 8)}...`,
          variant: "default" // Changed from "success" to "default"
        });
      } else {
        throw new Error(result?.error || "Verification failed after multiple attempts");
      }
    } catch (error) {
      console.error("Error during blockchain verification:", error);
      
      // Determine if we should retry
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prevCount => prevCount + 1);
        
        toast({
          title: "Verification Retry",
          description: `Retrying verification (${retryCount + 1}/${MAX_RETRIES})...`,
          variant: "default"
        });
        
        // Retry after a delay
        setTimeout(() => {
          handleVerificationComplete(supplierId, verification);
        }, 2000);
      } else {
        // Set error for display
        setError(error.message || "Unknown error during verification");
        
        // Reset retry count after max retries
        setRetryCount(0);
        
        // Show error notification
        toast({
          title: "Verification Error",
          description: "There was an error recording the verification on the blockchain.",
          variant: "destructive"
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers && suppliers.length > 0 ? (
          suppliers.map((supplier) => (
            <div key={supplier.id} onClick={() => handleSupplierClick(supplier)} className="cursor-pointer">
              <SupplierCard key={supplier.id} supplier={supplier} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No suppliers found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Supplier Detail Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedSupplier?.name}</DialogTitle>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setError(null);
                      if (selectedSupplier) {
                        setRetryCount(0);
                        toast({
                          title: "Retrying Verification",
                          description: "Preparing to retry verification process...",
                          variant: "default"
                        });
                      }
                    }}
                  >
                    Retry Verification
                  </Button>
                </div>
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

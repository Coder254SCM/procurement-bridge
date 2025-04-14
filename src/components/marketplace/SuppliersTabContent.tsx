
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
import { Button } from '@/components/ui/button'; 
import { useBlockchainVerification } from '@/hooks/useBlockchainVerification';

export interface SuppliersTabContentProps {
  filteredSuppliers: SupplierProps[];
}

const SuppliersTabContent = ({ filteredSuppliers = [] }: SuppliersTabContentProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProps | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>(filteredSuppliers);
  const [error, setError] = useState<string | null>(null);

  // Instead of direct implementation, we use our blockchain verification hook
  const { 
    isProcessing
  } = useBlockchainVerification();

  // Function to handle clicks on supplier cards
  const handleSupplierClick = (supplier: SupplierProps) => {
    setSelectedSupplier(supplier);
    setError(null); // Reset error when opening a new supplier
  };

  // Handle verification completion with optimized blockchain transaction
  const handleVerificationComplete = async (supplierId: string, verification: VerificationDetails) => {
    try {
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

      // Show success notification
      toast({
        title: "Verification Successful",
        description: `Supplier verification recorded on blockchain. Transaction: ${verification.blockchainTxId?.substring(0, 8)}...`,
        variant: "default" 
      });
    } catch (error) {
      console.error("Error updating supplier verification state:", error);
      setError(error instanceof Error ? error.message : "Unknown error during verification state update");
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
                    onClick={() => setError(null)}
                  >
                    Dismiss
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

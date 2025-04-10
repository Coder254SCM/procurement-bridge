
import React, { useState } from 'react';
import { SupplierProps } from './SupplierCard';
import SupplierCard from './SupplierCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SupplierVerificationDetails from './SupplierVerificationDetails';
import { VerificationDetails } from './SupplierVerificationBadge';

export interface SuppliersTabContentProps {
  filteredSuppliers: SupplierProps[];
}

const SuppliersTabContent = ({ filteredSuppliers = [] }: SuppliersTabContentProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProps | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>(filteredSuppliers);

  // Function to handle clicks on supplier cards
  const handleSupplierClick = (supplier: SupplierProps) => {
    setSelectedSupplier(supplier);
  };

  // Handle verification completion
  const handleVerificationComplete = (supplierId: string, verification: VerificationDetails) => {
    setSuppliers(currentSuppliers => 
      currentSuppliers.map(supplier => 
        supplier.id === supplierId 
          ? { ...supplier, verification, verified: true } 
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
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuppliers && filteredSuppliers.length > 0 ? (
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
          
          {selectedSupplier && (
            <SupplierVerificationDetails 
              supplier={selectedSupplier} 
              onVerificationComplete={(verification) => 
                handleVerificationComplete(selectedSupplier.id, verification)
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuppliersTabContent;

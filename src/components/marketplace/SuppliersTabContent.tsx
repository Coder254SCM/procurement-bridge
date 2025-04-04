
import React from 'react';
import { SupplierProps } from './SupplierCard';
import SupplierCard from './SupplierCard';

interface SuppliersTabContentProps {
  filteredSuppliers: SupplierProps[];
}

const SuppliersTabContent = ({ filteredSuppliers }: SuppliersTabContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredSuppliers.length > 0 ? (
        filteredSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-xl font-medium mb-2">No suppliers found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default SuppliersTabContent;


import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import custom components and hooks
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import TendersCard from '@/components/marketplace/TendersCard';
import TendersTabContent from '@/components/marketplace/TendersTabContent';
import SuppliersCard from '@/components/marketplace/SuppliersCard';
import SuppliersTabContent from '@/components/marketplace/SuppliersTabContent';
import { useTenders } from '@/hooks/useTenders';
import { useSuppliers } from '@/hooks/useSuppliers';

const Marketplace = () => {
  const { toast } = useToast();
  const { tenders, loading } = useTenders();
  const { suppliers } = useSuppliers();
  
  // Tenders state
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Suppliers state
  const [supplierSearchTerm, setSupplierSearchTerm] = useState('');
  const [supplierCategory, setSupplierCategory] = useState('all');
  const [supplierFilterOpen, setSupplierFilterOpen] = useState(false);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('tenders');

  // Filter tenders based on search term and category
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || tender.category.toLowerCase().includes(category.toLowerCase());
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    } else {
      return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
    }
  });

  // Filter suppliers based on search term and category
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch = supplier.name.toLowerCase().includes(supplierSearchTerm.toLowerCase()) ||
                          supplier.description.toLowerCase().includes(supplierSearchTerm.toLowerCase());
    const matchesCategory = supplierCategory === 'all' || supplier.category.toLowerCase().includes(supplierCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-6 px-4 md:px-6">
      <MarketplaceHeader />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="tenders">Discover Tenders</TabsTrigger>
          <TabsTrigger value="suppliers">Find Suppliers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenders" className="mt-0">
          <TendersCard 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            category={category}
            setCategory={setCategory}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
          />
          
          <TendersTabContent 
            filteredTenders={filteredTenders}
            loading={loading}
          />
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-0">
          <SuppliersCard 
            supplierSearchTerm={supplierSearchTerm}
            setSupplierSearchTerm={setSupplierSearchTerm}
            supplierCategory={supplierCategory}
            setSupplierCategory={setSupplierCategory}
            supplierFilterOpen={supplierFilterOpen}
            setSupplierFilterOpen={setSupplierFilterOpen}
          />
          
          <SuppliersTabContent 
            filteredSuppliers={filteredSuppliers}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketplace;

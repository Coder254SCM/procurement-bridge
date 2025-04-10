
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers, BookOpen } from 'lucide-react';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import TendersTabContent from '@/components/marketplace/TendersTabContent';
import SuppliersTabContent from '@/components/marketplace/SuppliersTabContent';
import ChaincodeExplorer from '@/components/blockchain/ChaincodeExplorer';

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState<string>('tenders');
  
  return (
    <div className="container mx-auto py-6 px-4">
      <MarketplaceHeader />
      
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                <CardTitle>Blockchain-Powered Procurement</CardTitle>
              </div>
              <Badge variant="outline" className="ml-2">Hyperledger Fabric</Badge>
            </div>
            <CardDescription>
              Our procurement platform is powered by Hyperledger Fabric blockchain technology, 
              ensuring transparency, security and immutability for all procurement activities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                Every tender, bid, evaluation and award is recorded on the blockchain, 
                creating an immutable audit trail that prevents fraud and ensures fair competition.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Explore our smart contracts below to understand how the blockchain secures the procurement process.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="tenders">Tenders</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="blockchain">Smart Contracts</TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-6">
          <TabsContent value="tenders" className="mt-0">
            <TendersTabContent />
          </TabsContent>
          
          <TabsContent value="suppliers" className="mt-0">
            <SuppliersTabContent />
          </TabsContent>
          
          <TabsContent value="blockchain" className="mt-0">
            <ChaincodeExplorer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Marketplace;

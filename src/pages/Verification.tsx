
import React from 'react';
import VerificationDashboard from '@/components/verification/VerificationDashboard';
import TenderTimeline from '@/components/tenders/TenderTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Verification = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Verification & Procurement Process</h1>
      
      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="verification">Verification Dashboard</TabsTrigger>
          <TabsTrigger value="timeline">Tender Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="verification">
          <VerificationDashboard />
        </TabsContent>
        
        <TabsContent value="timeline">
          <TenderTimeline />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Verification;

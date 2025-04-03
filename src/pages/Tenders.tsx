
import React from 'react';
import TendersList from '@/components/tenders/TendersList';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Tenders = () => {
  const { user } = useAuth();
  
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Tender Management</h1>
        <p className="text-muted-foreground mt-1">
          {user ? "Create, manage and respond to tenders" : "View and respond to open tenders"}
        </p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">About Tender Management</CardTitle>
          <CardDescription>
            Unlike the public Marketplace, this section allows you to track your own tender activities whether you're a buyer or supplier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Buyers can create and manage tenders, while suppliers can track submitted proposals and applications.
            For public browsing of all available opportunities, visit the Marketplace.
          </p>
        </CardContent>
      </Card>
      
      <TendersList />
    </div>
  );
};

export default Tenders;

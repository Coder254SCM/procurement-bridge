import React from 'react';
import { Helmet } from 'react-helmet-async';
import { RequisitionManagement } from '@/components/requisitions/RequisitionManagement';

const Requisitions = () => {
  return (
    <div className="container py-6 px-4 md:px-6">
      <Helmet>
        <title>Purchase Requisitions | ProcureChain</title>
        <meta name="description" content="Create and manage purchase requisitions with approval workflows." />
      </Helmet>
      <RequisitionManagement />
    </div>
  );
};

export default Requisitions;

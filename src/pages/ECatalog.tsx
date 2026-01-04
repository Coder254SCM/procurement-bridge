import React from 'react';
import { Helmet } from 'react-helmet-async';
import { CatalogManagement } from '@/components/catalog/CatalogManagement';

const ECatalog = () => {
  return (
    <div className="container py-6 px-4 md:px-6">
      <Helmet>
        <title>E-Catalog | ProcureChain</title>
        <meta name="description" content="Browse and manage product catalog items and categories for procurement." />
      </Helmet>
      <CatalogManagement />
    </div>
  );
};

export default ECatalog;

import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import PredictiveAnalyticsDashboard from '@/components/analytics/PredictiveAnalyticsDashboard';

const PredictiveAnalytics: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Predictive Analytics | ProcureChain</title>
        <meta name="description" content="ML-powered predictions for procurement risk analysis, churn prediction, and bid success forecasting." />
      </Helmet>
      <div className="container py-8 px-4 md:px-6 mt-16">
        <PredictiveAnalyticsDashboard />
      </div>
    </Layout>
  );
};

export default PredictiveAnalytics;

import React from 'react';
import FraudDetectionDashboard from '@/components/fraud/FraudDetectionDashboard';
import Layout from '@/components/layout/Layout';

const FraudDetection: React.FC = () => {
  return (
    <Layout>
      <div className="container py-8 px-4 md:px-6 mt-16">
        <FraudDetectionDashboard />
      </div>
    </Layout>
  );
};

export default FraudDetection;

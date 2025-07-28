import React from 'react';
import Layout from '@/components/layout/Layout';
import PasswordResetForm from '@/components/auth/PasswordResetForm';

const ResetPassword = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <PasswordResetForm />
      </div>
    </Layout>
  );
};

export default ResetPassword;
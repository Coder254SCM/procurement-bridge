import React from 'react';
import Layout from '@/components/layout/Layout';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

const UpdatePassword = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <UpdatePasswordForm />
      </div>
    </Layout>
  );
};

export default UpdatePassword;
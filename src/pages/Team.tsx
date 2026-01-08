import React from 'react';
import { Helmet } from 'react-helmet-async';
import TeamManagement from '@/components/team/TeamManagement';

const Team: React.FC = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>Team Management | ProcureChain</title>
        <meta name="description" content="Manage your organization's team members and their roles" />
        <link rel="canonical" href="/team" />
      </Helmet>
      
      <TeamManagement />
    </div>
  );
};

export default Team;

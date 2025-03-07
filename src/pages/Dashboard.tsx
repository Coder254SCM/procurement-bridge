
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto max-w-7xl">
        <h1 className="mb-8">Dashboard</h1>
        <div className="glass-card p-8 rounded-xl">
          <p className="text-xl">
            This is a placeholder dashboard. The full dashboard would include tender listings, 
            analytics, and marketplace features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

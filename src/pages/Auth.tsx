
import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-2xl font-medium mb-4">Welcome to ProcureChain</h1>
          <p className="text-base text-muted-foreground mb-6">
            Join ProcureChain to access blockchain-secured procurement services for transparency and compliance.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16.5 9.4 7.55 4.24"></path><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>
              </div>
              <div>
                <h3 className="text-base font-normal">Blockchain Verification</h3>
                <p className="text-sm text-muted-foreground">All procurement activities are verified and timestamped on blockchain</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
              </div>
              <div>
                <h3 className="text-base font-normal">End-to-End Encryption</h3>
                <p className="text-sm text-muted-foreground">Your data is secured with advanced encryption techniques</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
              </div>
              <div>
                <h3 className="text-base font-normal">Regulatory Compliance</h3>
                <p className="text-sm text-muted-foreground">Compliant with PPADA 2015 and other procurement regulations</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Auth;


import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CreateTender from '@/pages/CreateTender';
import Evaluations from '@/pages/Evaluations';
import EvaluationForm from '@/pages/EvaluationForm';
import NotFound from '@/pages/NotFound';
import Verification from '@/pages/Verification';
import Marketplace from '@/pages/Marketplace';
import TenderDetail from '@/pages/TenderDetail';
import Layout from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

function App() {
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tenders/create" element={<CreateTender />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/evaluations/:bidId" element={<EvaluationForm />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/tender/:id" element={<TenderDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;

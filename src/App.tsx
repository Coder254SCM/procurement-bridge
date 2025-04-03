
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
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
import Tenders from '@/pages/Tenders';
import Analytics from '@/pages/Analytics';
import Auth from '@/pages/Auth';
import Layout from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/tenders/create" element={
                <ProtectedRoute>
                  <CreateTender />
                </ProtectedRoute>
              } />
              <Route path="/evaluations" element={
                <ProtectedRoute>
                  <Evaluations />
                </ProtectedRoute>
              } />
              <Route path="/evaluations/:bidId" element={
                <ProtectedRoute>
                  <EvaluationForm />
                </ProtectedRoute>
              } />
              <Route path="/verification" element={
                <ProtectedRoute>
                  <Verification />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/tender/:id" element={<TenderDetail />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

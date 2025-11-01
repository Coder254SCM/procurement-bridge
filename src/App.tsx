
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import CreateTender from '@/pages/CreateTender';
import ECatalog from '@/pages/ECatalog';
import Requisitions from '@/pages/Requisitions';
import Evaluations from '@/pages/Evaluations';
import EvaluationForm from '@/pages/EvaluationForm';
import NotFound from '@/pages/NotFound';
import Verification from '@/pages/Verification';
import VerificationGuide from '@/pages/VerificationGuide';
import Marketplace from '@/pages/Marketplace';
import TenderDetail from '@/pages/TenderDetail';
import Tenders from '@/pages/Tenders';
import Analytics from '@/pages/Analytics';
import Auth from '@/pages/Auth';
import SupplierDashboard from '@/pages/SupplierDashboard';
import BuyerDashboard from '@/pages/BuyerDashboard';
import EvaluatorDashboard from '@/pages/EvaluatorDashboard';
import Documentation from '@/pages/Documentation';
import Contracts from '@/pages/Contracts';
import Pricing from '@/pages/Pricing';
import Guides from '@/pages/Guides';
import Privacy from '@/pages/Privacy';
import TermsOfService from '@/pages/TermsOfService';
import CookiePolicy from '@/pages/CookiePolicy';
import EnterpriseServices from '@/pages/EnterpriseServices';
import ResetPassword from '@/pages/ResetPassword';
import UpdatePassword from '@/pages/UpdatePassword';
import Budgets from '@/pages/Budgets';
import Qualifications from '@/pages/Qualifications';
import FrameworkAgreements from '@/pages/FrameworkAgreements';
import ContractPerformance from '@/pages/ContractPerformance';
import Layout from '@/components/layout/Layout';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <BrowserRouter>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/update-password" element={<UpdatePassword />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/enterprise" element={<EnterpriseServices />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/supplier-dashboard" element={
                  <ProtectedRoute>
                    <SupplierDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/buyer-dashboard" element={
                  <ProtectedRoute>
                    <BuyerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/evaluator-dashboard" element={
                  <ProtectedRoute>
                    <EvaluatorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/catalog" element={
                  <ProtectedRoute>
                    <ECatalog />
                  </ProtectedRoute>
                } />
                <Route path="/requisitions" element={
                  <ProtectedRoute>
                    <Requisitions />
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
                <Route path="/contracts" element={
                  <ProtectedRoute>
                    <Contracts />
                  </ProtectedRoute>
                } />
                <Route path="/verification" element={
                  <ProtectedRoute>
                    <Verification />
                  </ProtectedRoute>
                } />
                <Route path="/verification-guide" element={<VerificationGuide />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/tender/:id" element={<TenderDetail />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/budgets" element={
                  <ProtectedRoute>
                    <Budgets />
                  </ProtectedRoute>
                } />
                <Route path="/qualifications" element={
                  <ProtectedRoute>
                    <Qualifications />
                  </ProtectedRoute>
                } />
                <Route path="/framework-agreements" element={
                  <ProtectedRoute>
                    <FrameworkAgreements />
                  </ProtectedRoute>
                } />
                <Route path="/contract-performance" element={
                  <ProtectedRoute>
                    <ContractPerformance />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;

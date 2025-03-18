
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CreateTender from "./pages/CreateTender";
import Evaluations from "./pages/Evaluations";
import EvaluationForm from "./pages/EvaluationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* User profile and procurement system routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-tender" element={<CreateTender />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/evaluation/:bidId" element={<EvaluationForm />} />
          <Route path="/tenders" element={<NotFound />} />
          <Route path="/tenders/:id" element={<NotFound />} />
          <Route path="/supplier-marketplace" element={<NotFound />} />
          <Route path="/blockchain-explorer" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

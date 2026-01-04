import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database.types';

// Types for analytics data
export interface MarketTrend {
  category: string;
  tenderCount: number;
  averageBudget: number;
}

export interface SupplierPerformance {
  performance_score: number;
  breakdown: {
    winRate: number;
    avgEvaluationScore: number;
    totalBids: number;
    awardedBids: number;
  };
}

export interface RiskAssessment {
  risk_score: number;
  risk_factors: { factor: string; value: string | number; risk: number }[];
}

export interface DashboardKPIs {
  activeTenders: number;
  activeTendersChange: number;
  suppliers: number;
  suppliersChange: number;
  avgEvalTime: string;
  avgEvalTimeChange: number;
  costSavings: number;
  costSavingsChange: number;
  complianceRate: number;
  complianceRateChange: number;
  eTenderingRate: number;
  eTenderingRateChange: number;
}

export interface TenderStatusData {
  name: string;
  value: number;
  color: string;
}

export interface ProcurementTrendData {
  month: string;
  tenders: number;
  value: number;
}

export interface ComplianceRiskData {
  name: string;
  value: number;
  color: string;
}

export interface BiddingAnalytics {
  biddingCompetition: { tenderCategory: string; avgBids: number }[];
  priceVariance: { name: string; highestBid: number; lowestBid: number; averageBid: number }[];
}

export interface SupplyChainAnalytics {
  leadTimeData: { month: string; average: number }[];
  documentProcessingData: { stage: string; time: number }[];
}

// Fetcher function
const invokeFunction = async <T>(name: string, body: object): Promise<T> => {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) throw error;
  return data as T;
};

// Dashboard KPIs
export const useDashboardKPIs = () => {
  return useQuery<DashboardKPIs>({
    queryKey: ['analytics', 'dashboard-kpis'],
    queryFn: () => invokeFunction<DashboardKPIs>('procurement-intelligence', { type: 'dashboard-kpis' }),
  });
};

// Tender status distribution
export const useTenderStatusDistribution = () => {
  return useQuery<TenderStatusData[]>({
    queryKey: ['analytics', 'tender-status-distribution'],
    queryFn: () => invokeFunction<TenderStatusData[]>('procurement-intelligence', { type: 'tender-status-distribution' }),
  });
};

// Procurement trends
export const useProcurementTrends = () => {
  return useQuery<ProcurementTrendData[]>({
    queryKey: ['analytics', 'procurement-trends'],
    queryFn: () => invokeFunction<ProcurementTrendData[]>('procurement-intelligence', { type: 'procurement-trends' }),
  });
};

// Compliance risk
export const useComplianceRisk = () => {
  return useQuery<ComplianceRiskData[]>({
    queryKey: ['analytics', 'compliance-risk'],
    queryFn: () => invokeFunction<ComplianceRiskData[]>('procurement-intelligence', { type: 'compliance-risk' }),
  });
};

// Bidding analytics
export const useBiddingAnalytics = () => {
  return useQuery<BiddingAnalytics>({
    queryKey: ['analytics', 'bidding-analytics'],
    queryFn: () => invokeFunction<BiddingAnalytics>('procurement-intelligence', { type: 'bidding-analytics' }),
  });
};

// Supply chain analytics
export const useSupplyChainAnalytics = () => {
  return useQuery<SupplyChainAnalytics>({
    queryKey: ['analytics', 'supply-chain-analytics'],
    queryFn: () => invokeFunction<SupplyChainAnalytics>('procurement-intelligence', { type: 'supply-chain-analytics' }),
  });
};

// Market trends
export const useMarketTrends = () => {
  return useQuery<{ trends: MarketTrend[] }>({
    queryKey: ['analytics', 'market-trends'],
    queryFn: () => invokeFunction('procurement-intelligence', { type: 'market-trends' }),
  });
};

// Supplier performance
export const useSupplierPerformance = (supplierId?: string) => {
  return useQuery<SupplierPerformance>({
    queryKey: ['analytics', 'supplier-performance', supplierId],
    queryFn: () => invokeFunction('procurement-intelligence', { type: 'supplier-performance', payload: { supplierId } }),
    enabled: !!supplierId,
  });
};

// Risk assessment
export const useRiskAssessment = (supplierId?: string) => {
  return useQuery<RiskAssessment>({
    queryKey: ['analytics', 'risk-assessment', supplierId],
    queryFn: () => invokeFunction('procurement-intelligence', { type: 'risk-assessment', payload: { supplierId } }),
    enabled: !!supplierId,
  });
};

// Suppliers list
export const useSuppliers = () => {
  return useQuery<Pick<Profile, 'id' | 'company_name'>[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'supplier');

      if (rolesError) throw rolesError;

      const supplierIds = userRoles.map(r => r.user_id);

      if (supplierIds.length === 0) return [];

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, company_name')
        .in('id', supplierIds)
        .not('company_name', 'is', null);

      if (profilesError) throw profilesError;
      
      return profiles.filter(p => p.company_name).map(p => ({ id: p.id, company_name: p.company_name! }));
    }
  });
};


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

// Fetcher function
const invokeFunction = async (name: string, body: object) => {
    const { data, error } = await supabase.functions.invoke(name, { body });
    if (error) throw error;
    return data;
};

// Hooks
export const useMarketTrends = () => {
    return useQuery<{ trends: MarketTrend[] }>({
        queryKey: ['analytics', 'market-trends'],
        queryFn: () => invokeFunction('procurement-intelligence', { type: 'market-trends' }),
    });
};

export const useSupplierPerformance = (supplierId?: string) => {
    return useQuery<SupplierPerformance>({
        queryKey: ['analytics', 'supplier-performance', supplierId],
        queryFn: () => invokeFunction('procurement-intelligence', { type: 'supplier-performance', payload: { supplierId } }),
        enabled: !!supplierId,
    });
};

export const useRiskAssessment = (supplierId?: string) => {
    return useQuery<RiskAssessment>({
        queryKey: ['analytics', 'risk-assessment', supplierId],
        queryFn: () => invokeFunction('procurement-intelligence', { type: 'risk-assessment', payload: { supplierId } }),
        enabled: !!supplierId,
    });
};

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

            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, company_name')
                .in('id', supplierIds)
                .not('company_name', 'is', null);

            if (profilesError) throw profilesError;
            
            // make sure company_name is not null
            return profiles.filter(p => p.company_name).map(p => ({ id: p.id, company_name: p.company_name! }));
        }
    });
}

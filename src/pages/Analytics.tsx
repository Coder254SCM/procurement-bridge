import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { 
  useMarketTrends, 
  useSuppliers, 
  useSupplierPerformance, 
  useRiskAssessment,
  useDashboardKPIs,
  useTenderStatusDistribution,
  useProcurementTrends,
  useComplianceRisk,
  useBiddingAnalytics,
  useSupplyChainAnalytics
} from '@/hooks/useAnalytics';

import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import KpiCards, { KpiMetric } from '@/components/analytics/KpiCards';
import OverviewTab from '@/components/analytics/OverviewTab';
import SupplierAnalyticsTab from '@/components/analytics/SupplierAnalyticsTab';
import SupplyChainTab from '@/components/analytics/SupplyChainTab';
import BiddingAnalyticsTab from '@/components/analytics/BiddingAnalyticsTab';

const Analytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>();
  
  // Real data hooks
  const { data: dashboardKPIs, isLoading: isLoadingKPIs } = useDashboardKPIs();
  const { data: marketTrends, isLoading: isLoadingTrends } = useMarketTrends();
  const { data: tenderStatusData, isLoading: isLoadingTenderStatus } = useTenderStatusDistribution();
  const { data: procurementTrendsData, isLoading: isLoadingProcurementTrends } = useProcurementTrends();
  const { data: complianceRiskData, isLoading: isLoadingComplianceRisk } = useComplianceRisk();
  const { data: biddingAnalytics, isLoading: isLoadingBidding } = useBiddingAnalytics();
  const { data: supplyChainAnalytics, isLoading: isLoadingSupplyChain } = useSupplyChainAnalytics();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: supplierPerformance, isLoading: isLoadingPerformance } = useSupplierPerformance(selectedSupplier);
  const { data: riskAssessment, isLoading: isLoadingRisk } = useRiskAssessment(selectedSupplier);

  // Format KPIs from real data
  const kpiMetrics: KpiMetric[] = useMemo(() => {
    if (!dashboardKPIs) {
      return [
        { id: 1, name: 'Active Tenders', value: 0, change: 0, status: 'neutral' as const },
        { id: 2, name: 'Suppliers', value: 0, change: 0, status: 'neutral' as const },
        { id: 3, name: 'Avg Evaluation Time', value: '0 days', change: 0, status: 'neutral' as const },
        { id: 4, name: 'Cost Savings', value: 'KES 0', change: 0, status: 'neutral' as const },
        { id: 5, name: 'Compliance Rate', value: '0%', change: 0, status: 'neutral' as const },
        { id: 6, name: 'E-Tendering Rate', value: '0%', change: 0, status: 'neutral' as const }
      ];
    }

    const formatCurrency = (value: number) => {
      if (value >= 1000000) return `KES ${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `KES ${(value / 1000).toFixed(1)}K`;
      return `KES ${value}`;
    };

    return [
      { 
        id: 1, 
        name: 'Active Tenders', 
        value: dashboardKPIs.activeTenders, 
        change: Math.abs(dashboardKPIs.activeTendersChange), 
        status: dashboardKPIs.activeTendersChange >= 0 ? 'increase' as const : 'decrease' as const 
      },
      { 
        id: 2, 
        name: 'Suppliers', 
        value: dashboardKPIs.suppliers, 
        change: Math.abs(dashboardKPIs.suppliersChange), 
        status: dashboardKPIs.suppliersChange >= 0 ? 'increase' as const : 'decrease' as const 
      },
      { 
        id: 3, 
        name: 'Avg Evaluation Time', 
        value: `${dashboardKPIs.avgEvalTime} days`, 
        change: Math.abs(dashboardKPIs.avgEvalTimeChange), 
        status: dashboardKPIs.avgEvalTimeChange <= 0 ? 'decrease' as const : 'increase' as const 
      },
      { 
        id: 4, 
        name: 'Cost Savings', 
        value: formatCurrency(dashboardKPIs.costSavings), 
        change: Math.abs(dashboardKPIs.costSavingsChange), 
        status: dashboardKPIs.costSavingsChange >= 0 ? 'increase' as const : 'decrease' as const 
      },
      { 
        id: 5, 
        name: 'Compliance Rate', 
        value: `${dashboardKPIs.complianceRate}%`, 
        change: Math.abs(dashboardKPIs.complianceRateChange), 
        status: dashboardKPIs.complianceRateChange >= 0 ? 'increase' as const : 'decrease' as const 
      },
      { 
        id: 6, 
        name: 'E-Tendering Rate', 
        value: `${dashboardKPIs.eTenderingRate}%`, 
        change: Math.abs(dashboardKPIs.eTenderingRateChange), 
        status: dashboardKPIs.eTenderingRateChange >= 0 ? 'increase' as const : 'decrease' as const 
      }
    ];
  }, [dashboardKPIs]);

  const procurementByDepartmentData = useMemo(() => {
    if (!marketTrends?.trends) return [];
    return marketTrends.trends.map(t => ({ name: t.category, value: t.tenderCount, budget: t.averageBudget }));
  }, [marketTrends]);

  const supplierPerformanceBreakdown = useMemo(() => {
    if (!supplierPerformance) return [];
    const { winRate, avgEvaluationScore, totalBids, awardedBids } = supplierPerformance.breakdown;
    return [
      { name: 'Win Rate', value: `${(winRate * 100).toFixed(1)}%` },
      { name: 'Avg. Eval Score', value: avgEvaluationScore.toFixed(1) },
      { name: 'Total Bids', value: totalBids },
      { name: 'Awarded Contracts', value: awardedBids },
    ];
  }, [supplierPerformance]);

  return (
    <div className="container py-8 px-4 md:px-6">
      <Helmet>
        <title>Analytics | ProcureChain</title>
        <meta name="description" content="View procurement analytics, supplier performance metrics, and market trends." />
      </Helmet>
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />
      
      <KpiCards metrics={kpiMetrics} isLoading={isLoadingKPIs} />
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Analytics</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="bidding">Bidding Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <OverviewTab 
            procurementByDepartmentData={procurementByDepartmentData}
            isLoadingTrends={isLoadingTrends}
            tenderStatusData={tenderStatusData}
            isLoadingTenderStatus={isLoadingTenderStatus}
            procurementTrendsData={procurementTrendsData}
            isLoadingProcurementTrends={isLoadingProcurementTrends}
            complianceRiskData={complianceRiskData}
            isLoadingComplianceRisk={isLoadingComplianceRisk}
          />
        </TabsContent>
        
        <TabsContent value="supplier">
          <SupplierAnalyticsTab
            suppliers={suppliers}
            isLoadingSuppliers={isLoadingSuppliers}
            selectedSupplier={selectedSupplier}
            onSupplierChange={setSelectedSupplier}
            supplierPerformance={supplierPerformance}
            isLoadingPerformance={isLoadingPerformance}
            riskAssessment={riskAssessment}
            isLoadingRisk={isLoadingRisk}
            supplierPerformanceBreakdown={supplierPerformanceBreakdown}
          />
        </TabsContent>
        
        <TabsContent value="supply-chain">
          <SupplyChainTab 
            data={supplyChainAnalytics}
            isLoading={isLoadingSupplyChain}
          />
        </TabsContent>
        
        <TabsContent value="bidding">
          <BiddingAnalyticsTab 
            data={biddingAnalytics}
            isLoading={isLoadingBidding}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

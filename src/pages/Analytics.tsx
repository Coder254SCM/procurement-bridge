
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketTrends, useSuppliers, useSupplierPerformance, useRiskAssessment } from '@/hooks/useAnalytics';

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
  
  const { data: marketTrends, isLoading: isLoadingTrends } = useMarketTrends();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: supplierPerformance, isLoading: isLoadingPerformance } = useSupplierPerformance(selectedSupplier);
  const { data: riskAssessment, isLoading: isLoadingRisk } = useRiskAssessment(selectedSupplier);

  const kpiMetrics: KpiMetric[] = [
    { id: 1, name: 'Active Tenders', value: 42, change: 12, status: 'increase' },
    { id: 2, name: 'Suppliers', value: 156, change: 8, status: 'increase' },
    { id: 3, name: 'Avg Evaluation Time', value: '5.2 days', change: 1.2, status: 'decrease' },
    { id: 4, name: 'Cost Savings', value: 'KES 25.8M', change: 15, status: 'increase' },
    { id: 5, name: 'Compliance Rate', value: '94%', change: 3, status: 'increase' },
    { id: 6, name: 'E-Tendering Rate', value: '87%', change: 5, status: 'increase' }
  ];

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
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />
      
      <KpiCards metrics={kpiMetrics} />
      
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
          <SupplyChainTab />
        </TabsContent>
        
        <TabsContent value="bidding">
          <BiddingAnalyticsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

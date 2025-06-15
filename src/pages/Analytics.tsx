import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  ArrowUp, ArrowDown, Download, BarChart2, 
  PieChart as PieChartIcon, TrendingUp, Calendar, 
  Filter, Users, DollarSign, Activity, FileText, Award, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketTrends, useSuppliers, useSupplierPerformance, useRiskAssessment } from '@/hooks/useAnalytics';
import { Skeleton } from '@/components/ui/skeleton';

const Analytics = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [department, setDepartment] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string | undefined>();
  
  const { data: marketTrends, isLoading: isLoadingTrends } = useMarketTrends();
  const { data: suppliers, isLoading: isLoadingSuppliers } = useSuppliers();
  const { data: supplierPerformance, isLoading: isLoadingPerformance } = useSupplierPerformance(selectedSupplier);
  const { data: riskAssessment, isLoading: isLoadingRisk } = useRiskAssessment(selectedSupplier);

  // Sample data for demonstration (will be replaced as APIs become available)
  const tenderStatusData = [
    { name: 'Open', value: 15, color: '#7C3AED' },
    { name: 'Under Evaluation', value: 8, color: '#F59E0B' },
    { name: 'Awarded', value: 12, color: '#10B981' },
    { name: 'Closed', value: 6, color: '#6B7280' }
  ];
  
  const procurementTrendsData = [
    { month: 'Jan', tenders: 5, value: 12 },
    { month: 'Feb', tenders: 8, value: 19 },
    { month: 'Mar', tenders: 10, value: 22 },
    { month: 'Apr', tenders: 12, value: 25 },
    { month: 'May', tenders: 15, value: 32 },
    { month: 'Jun', tenders: 18, value: 38 },
    { month: 'Jul', tenders: 20, value: 42 },
    { month: 'Aug', tenders: 22, value: 45 },
    { month: 'Sep', tenders: 19, value: 40 },
    { month: 'Oct', tenders: 16, value: 35 },
    { month: 'Nov', tenders: 12, value: 28 },
    { month: 'Dec', tenders: 10, value: 24 }
  ];
  
  const complianceRiskData = [
    { name: 'High Risk', value: 5, color: '#EF4444' },
    { name: 'Medium Risk', value: 12, color: '#F59E0B' },
    { name: 'Low Risk', value: 35, color: '#10B981' }
  ];
  
  const costSavingsData = [
    { month: 'Jan', target: 5, actual: 7 },
    { month: 'Feb', target: 8, actual: 9 },
    { month: 'Mar', target: 10, actual: 12 },
    { month: 'Apr', target: 12, actual: 10 },
    { month: 'May', target: 15, actual: 18 },
    { month: 'Jun', target: 18, actual: 22 }
  ];
  
  // Supply chain data
  const leadTimeData = [
    { month: 'Jan', average: 25 },
    { month: 'Feb', average: 23 },
    { month: 'Mar', average: 20 },
    { month: 'Apr', average: 22 },
    { month: 'May', average: 19 },
    { month: 'Jun', average: 18 }
  ];
  
  const supplierDiversityData = [
    { name: 'Women-Owned', value: 25, color: '#8B5CF6' },
    { name: 'Youth-Owned', value: 20, color: '#3B82F6' },
    { name: 'PWD-Owned', value: 15, color: '#EC4899' },
    { name: 'Others', value: 40, color: '#6B7280' }
  ];
  
  // Bidding analytics
  const biddingCompetitionData = [
    { tenderCategory: 'IT', avgBids: 15 },
    { tenderCategory: 'Construction', avgBids: 12 },
    { tenderCategory: 'Medical', avgBids: 8 },
    { tenderCategory: 'Education', avgBids: 6 },
    { tenderCategory: 'Agriculture', avgBids: 10 }
  ];
  
  const priceVarianceData = [
    { name: 'Tender 1', highestBid: 120, lowestBid: 80, averageBid: 95 },
    { name: 'Tender 2', highestBid: 110, lowestBid: 70, averageBid: 85 },
    { name: 'Tender 3', highestBid: 130, lowestBid: 85, averageBid: 105 },
    { name: 'Tender 4', highestBid: 125, lowestBid: 90, averageBid: 110 },
    { name: 'Tender 5', highestBid: 115, lowestBid: 75, averageBid: 90 }
  ];
  
  // KPI metrics
  const kpiMetrics = [
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive procurement insights and performance metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {kpiMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center mt-1">
                {metric.status === 'increase' ? (
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${metric.status === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                  {metric.change}% {metric.status === 'increase' ? 'increase' : 'decrease'}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="supplier">Supplier Analytics</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="bidding">Bidding Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <BarChart2 className="h-5 w-5 mr-2" /> Tender Status Distribution
                </CardTitle>
                <CardDescription>Current status of all procurement tenders</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tenderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {tenderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <TrendingUp className="h-5 w-5 mr-2" /> Procurement Trends
                </CardTitle>
                <CardDescription>Monthly tender count and value</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={procurementTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="tenders" stroke="#8884d8" activeDot={{ r: 8 }} name="Tenders" />
                    <Line yAxisId="right" type="monotone" dataKey="value" stroke="#82ca9d" name="Value (M KES)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <PieChartIcon className="h-5 w-5 mr-2" /> Procurement by Department
                </CardTitle>
                <CardDescription>Tender distribution across different categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingTrends ? <Skeleton className="w-full h-full" /> : 
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={procurementByDepartmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [value, name === 'value' ? 'Tender Count' : name]}/>
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Tender Count" />
                  </BarChart>
                </ResponsiveContainer>
                }
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Activity className="h-5 w-5 mr-2" /> Compliance & Risk Assessment
                </CardTitle>
                <CardDescription>Risk distribution across tenders</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={complianceRiskData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, value}) => `${name}: ${value}`}
                    >
                      {complianceRiskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="supplier">
           <div className="mb-6 flex justify-end">
            <Select onValueChange={setSelectedSupplier} value={selectedSupplier}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSuppliers ? (
                  <SelectItem value="loading" disabled>Loading suppliers...</SelectItem>
                ) : (
                  suppliers?.map(s => <SelectItem key={s.id} value={s.id}>{s.company_name}</SelectItem>)
                )}
              </SelectContent>
            </Select>
          </div>

          {!selectedSupplier ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground bg-muted/50 rounded-lg h-96">
                <Users className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Select a Supplier</h3>
                <p>Choose a supplier from the dropdown to view their detailed analytics.</p>
            </div>
           ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Award className="h-5 w-5 mr-2" /> Supplier Performance
                </CardTitle>
                <CardDescription>Overall score and breakdown for the selected supplier</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingPerformance ? <Skeleton className="w-full h-full" /> : supplierPerformance && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center">
                       <p className="text-muted-foreground text-sm">Overall Score</p>
                       <p className="text-6xl font-bold text-primary">{supplierPerformance.performance_score}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      {supplierPerformanceBreakdown.map(item => (
                        <div key={item.name}>
                          <p className="text-muted-foreground text-sm">{item.name}</p>
                          <p className="font-semibold text-lg">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" /> Supplier Risk Assessment
                </CardTitle>
                <CardDescription>Risk analysis for the selected supplier</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoadingRisk ? <Skeleton className="w-full h-full" /> : riskAssessment && (
                  <div className="flex flex-col h-full">
                     <div className="flex-1 flex flex-col items-center justify-center">
                       <p className="text-muted-foreground text-sm">Risk Score</p>
                       <p className="text-6xl font-bold text-destructive">{riskAssessment.risk_score}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Risk Factors:</h4>
                      <ul className="space-y-1 text-sm">
                        {riskAssessment.risk_factors.map((factor, i) => (
                           <li key={i} className="flex justify-between">
                             <span>{factor.factor}: <span className="text-muted-foreground">{factor.value}</span></span>
                             <span className="font-mono text-destructive">+{factor.risk}</span>
                           </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="h-5 w-5 mr-2" /> Cost Savings Analysis
                </CardTitle>
                <CardDescription>Target vs actual procurement savings (Static Demo)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="target" stackId="1" stroke="#8884d8" fill="#8884d8" name="Target (M KES)" />
                    <Area type="monotone" dataKey="actual" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Actual (M KES)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
          </div>
          )}
        </TabsContent>
        
        <TabsContent value="supply-chain">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Calendar className="h-5 w-5 mr-2" /> Lead Time Trends
                </CardTitle>
                <CardDescription>Average procurement lead time in days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg. Lead Time (days)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileText className="h-5 w-5 mr-2" /> Document Processing Time
                </CardTitle>
                <CardDescription>Average time to process tender documents</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { stage: 'Document Preparation', time: 5 },
                    { stage: 'Review', time: 3 },
                    { stage: 'Approval', time: 2 },
                    { stage: 'Publishing', time: 1 },
                    { stage: 'Clarification', time: 4 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="time" fill="#82ca9d" name="Time (days)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bidding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Users className="h-5 w-5 mr-2" /> Bidding Competition
                </CardTitle>
                <CardDescription>Average number of bids per tender category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={biddingCompetitionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tenderCategory" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avgBids" fill="#8884d8" name="Avg. Bids" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <DollarSign className="h-5 w-5 mr-2" /> Bid Price Variance
                </CardTitle>
                <CardDescription>Price range across different tenders (in %)</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceVarianceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="highestBid" stroke="#ef4444" name="Highest Bid" />
                    <Line type="monotone" dataKey="lowestBid" stroke="#22c55e" name="Lowest Bid" />
                    <Line type="monotone" dataKey="averageBid" stroke="#3b82f6" name="Average Bid" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

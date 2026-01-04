import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  BarChart2, PieChart as PieChartIcon, TrendingUp, Activity 
} from 'lucide-react';
import { TenderStatusData, ProcurementTrendData, ComplianceRiskData } from '@/hooks/useAnalytics';

interface OverviewTabProps {
  procurementByDepartmentData: { name: string; value: number; budget: number }[];
  isLoadingTrends: boolean;
  tenderStatusData?: TenderStatusData[];
  isLoadingTenderStatus: boolean;
  procurementTrendsData?: ProcurementTrendData[];
  isLoadingProcurementTrends: boolean;
  complianceRiskData?: ComplianceRiskData[];
  isLoadingComplianceRisk: boolean;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  procurementByDepartmentData, 
  isLoadingTrends,
  tenderStatusData = [],
  isLoadingTenderStatus,
  procurementTrendsData = [],
  isLoadingProcurementTrends,
  complianceRiskData = [],
  isLoadingComplianceRisk
}) => {
  const hasNoData = (data: any[]) => !data || data.length === 0;

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center h-full text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <BarChart2 className="h-5 w-5 mr-2" /> Tender Status Distribution
          </CardTitle>
          <CardDescription>Current status of all procurement tenders</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoadingTenderStatus ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(tenderStatusData) ? (
            <EmptyState message="No tender data available. Create tenders to see status distribution." />
          ) : (
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
          )}
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
          {isLoadingProcurementTrends ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(procurementTrendsData) || procurementTrendsData.every(d => d.tenders === 0) ? (
            <EmptyState message="No procurement trends data. Tenders created will appear here." />
          ) : (
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <PieChartIcon className="h-5 w-5 mr-2" /> Procurement by Department
          </CardTitle>
          <CardDescription>Tender distribution across different categories</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoadingTrends ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(procurementByDepartmentData) ? (
            <EmptyState message="No department data. Categorize tenders to see distribution." />
          ) : (
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
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <Activity className="h-5 w-5 mr-2" /> Compliance & Risk Assessment
          </CardTitle>
          <CardDescription>Risk distribution across suppliers</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoadingComplianceRisk ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(complianceRiskData) ? (
            <EmptyState message="No risk data available. Supplier verifications will appear here." />
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;

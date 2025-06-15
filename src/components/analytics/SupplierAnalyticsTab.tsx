
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Award, AlertTriangle } from 'lucide-react';
import { SupplierPerformance, RiskAssessment } from '@/hooks/useAnalytics';
import { Profile } from '@/types/database.types';

interface SupplierAnalyticsTabProps {
  suppliers: Pick<Profile, 'id' | 'company_name'>[] | undefined;
  isLoadingSuppliers: boolean;
  selectedSupplier: string | undefined;
  onSupplierChange: (supplierId: string) => void;
  supplierPerformance: SupplierPerformance | undefined;
  isLoadingPerformance: boolean;
  riskAssessment: RiskAssessment | undefined;
  isLoadingRisk: boolean;
  supplierPerformanceBreakdown: { name: string; value: string | number }[];
}

const costSavingsData = [
  { month: 'Jan', target: 5, actual: 7 },
  { month: 'Feb', target: 8, actual: 9 },
  { month: 'Mar', target: 10, actual: 12 },
  { month: 'Apr', target: 12, actual: 10 },
  { month: 'May', target: 15, actual: 18 },
  { month: 'Jun', target: 18, actual: 22 }
];

const SupplierAnalyticsTab: React.FC<SupplierAnalyticsTabProps> = ({
  suppliers,
  isLoadingSuppliers,
  selectedSupplier,
  onSupplierChange,
  supplierPerformance,
  isLoadingPerformance,
  riskAssessment,
  isLoadingRisk,
  supplierPerformanceBreakdown,
}) => {
  return (
    <>
      <div className="mb-6 flex justify-end">
        <Select onValueChange={onSupplierChange} value={selectedSupplier}>
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
    </>
  );
};

export default SupplierAnalyticsTab;

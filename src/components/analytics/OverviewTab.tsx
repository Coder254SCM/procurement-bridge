
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

interface OverviewTabProps {
  procurementByDepartmentData: { name: string; value: number; budget: number }[];
  isLoadingTrends: boolean;
}

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

const OverviewTab: React.FC<OverviewTabProps> = ({ procurementByDepartmentData, isLoadingTrends }) => {
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
  );
};

export default OverviewTab;

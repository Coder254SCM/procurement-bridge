import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, FileText } from 'lucide-react';
import { SupplyChainAnalytics } from '@/hooks/useAnalytics';

interface SupplyChainTabProps {
  data?: SupplyChainAnalytics;
  isLoading: boolean;
}

const SupplyChainTab: React.FC<SupplyChainTabProps> = ({ data, isLoading }) => {
  const hasNoData = (arr: any[] | undefined) => !arr || arr.length === 0 || arr.every(d => d.average === 0 || d.time === 0);

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
            <Calendar className="h-5 w-5 mr-2" /> Lead Time Trends
          </CardTitle>
          <CardDescription>Average procurement lead time in days</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(data?.leadTimeData) ? (
            <EmptyState message="No lead time data. Complete contracts to track lead times." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.leadTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="#8884d8" activeDot={{ r: 8 }} name="Avg. Lead Time (days)" />
              </LineChart>
            </ResponsiveContainer>
          )}
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
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(data?.documentProcessingData) ? (
            <EmptyState message="No document processing data available." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.documentProcessingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="time" fill="#82ca9d" name="Time (days)" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainTab;

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, DollarSign } from 'lucide-react';
import { BiddingAnalytics } from '@/hooks/useAnalytics';

interface BiddingAnalyticsTabProps {
  data?: BiddingAnalytics;
  isLoading: boolean;
}

const BiddingAnalyticsTab: React.FC<BiddingAnalyticsTabProps> = ({ data, isLoading }) => {
  const hasNoData = (arr: any[] | undefined) => !arr || arr.length === 0;

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
            <Users className="h-5 w-5 mr-2" /> Bidding Competition
          </CardTitle>
          <CardDescription>Average number of bids per tender category</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(data?.biddingCompetition) ? (
            <EmptyState message="No bidding data. Suppliers submitting bids will appear here." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.biddingCompetition}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tenderCategory" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgBids" fill="#8884d8" name="Avg. Bids" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <DollarSign className="h-5 w-5 mr-2" /> Bid Price Variance
          </CardTitle>
          <CardDescription>Price range across different tenders</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : hasNoData(data?.priceVariance) ? (
            <EmptyState message="No price variance data. Multiple bids per tender will show here." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.priceVariance}>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BiddingAnalyticsTab;

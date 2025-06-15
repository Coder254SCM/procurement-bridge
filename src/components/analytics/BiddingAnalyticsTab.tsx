
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Users, DollarSign } from 'lucide-react';

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

const BiddingAnalyticsTab = () => {
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
  );
};

export default BiddingAnalyticsTab;

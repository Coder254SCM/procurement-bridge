
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Calendar, FileText } from 'lucide-react';

const leadTimeData = [
  { month: 'Jan', average: 25 },
  { month: 'Feb', average: 23 },
  { month: 'Mar', average: 20 },
  { month: 'Apr', average: 22 },
  { month: 'May', average: 19 },
  { month: 'Jun', average: 18 }
];

const documentProcessingData = [
  { stage: 'Document Preparation', time: 5 },
  { stage: 'Review', time: 3 },
  { stage: 'Approval', time: 2 },
  { stage: 'Publishing', time: 1 },
  { stage: 'Clarification', time: 4 }
];

const SupplyChainTab = () => {
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
            <BarChart data={documentProcessingData}>
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
  );
};

export default SupplyChainTab;

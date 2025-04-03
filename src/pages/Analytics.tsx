
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartConfig } from '@/components/ui/chart';

// Sample data for demonstration
const tenderData = [
  { month: 'Jan', tenders: 13, bids: 42 },
  { month: 'Feb', tenders: 18, bids: 55 },
  { month: 'Mar', tenders: 22, bids: 67 },
  { month: 'Apr', tenders: 27, bids: 81 },
  { month: 'May', tenders: 15, bids: 47 },
  { month: 'Jun', tenders: 31, bids: 93 },
];

const categoryData = [
  { name: 'IT Services', value: 35 },
  { name: 'Construction', value: 25 },
  { name: 'Medical', value: 15 },
  { name: 'Education', value: 10 },
  { name: 'Agriculture', value: 15 },
];

const statusData = [
  { name: 'Open', value: 45 },
  { name: 'Under Evaluation', value: 20 },
  { name: 'Awarded', value: 25 },
  { name: 'Closed', value: 10 },
];

const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#f43f5e'];

const Analytics = () => {
  return (
    <div className="container py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Procurement Analytics</h1>
      
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid grid-cols-4 w-full max-w-lg mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tenders">Tenders</TabsTrigger>
          <TabsTrigger value="bids">Bids</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tender & Bid Activity</CardTitle>
                <CardDescription>Monthly breakdown of procurement activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tenderData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tenders" fill="#3b82f6" name="Tenders" />
                      <Bar dataKey="bids" fill="#10b981" name="Bids" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tender Categories</CardTitle>
                <CardDescription>Distribution by sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tender Status</CardTitle>
                <CardDescription>Current tender processing status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Procurement performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Active Tenders</p>
                    <h3 className="text-3xl font-bold">65</h3>
                    <p className="text-xs text-green-500">↑ 12% from last month</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Blockchain Verified</p>
                    <h3 className="text-3xl font-bold">124</h3>
                    <p className="text-xs text-blue-500">All transactions secured</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Avg. Bids per Tender</p>
                    <h3 className="text-3xl font-bold">4.3</h3>
                    <p className="text-xs text-green-500">↑ 0.8 from last month</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Awarding Time</p>
                    <h3 className="text-3xl font-bold">18d</h3>
                    <p className="text-xs text-green-500">↓ 2 days faster</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tenders Tab */}
        <TabsContent value="tenders">
          <Card>
            <CardHeader>
              <CardTitle>Tender Analytics</CardTitle>
              <CardDescription>Detailed tender statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">More detailed tender analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Bids Tab */}
        <TabsContent value="bids">
          <Card>
            <CardHeader>
              <CardTitle>Bid Analytics</CardTitle>
              <CardDescription>Detailed bid statistics and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">More detailed bid analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Blockchain Tab */}
        <TabsContent value="blockchain">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Analytics</CardTitle>
              <CardDescription>Transaction and verification metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Blockchain transaction metrics coming soon</p>
                <p className="mt-2 text-sm text-primary">Powered by Hyperledger Fabric</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;


import React, { useState } from 'react';
import { 
  Briefcase, FileText, ShoppingBag, Users, Calendar, 
  BarChart, TrendingUp, AlertCircle, ChevronRight, ExternalLink,
  Phone, Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [userType, setUserType] = useState<'buyer' | 'supplier'>('buyer');

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back, let's manage your procurement processes.</p>
        </div>
        
        <div className="mt-3 md:mt-0">
          <Tabs defaultValue={userType} onValueChange={(value) => setUserType(value as 'buyer' | 'supplier')} className="w-[300px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">Buyer View</TabsTrigger>
              <TabsTrigger value="supplier">Supplier View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <Card className="hover-lift">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Active Tenders</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{userType === 'buyer' ? '12' : '5'}</div>
              <Briefcase className="h-7 w-7 text-primary/60" />
            </div>
            <Progress value={userType === 'buyer' ? 60 : 40} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {userType === 'buyer' ? 'Pending Evaluation' : 'Submissions'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{userType === 'buyer' ? '8' : '12'}</div>
              <FileText className="h-7 w-7 text-orange-400/60" />
            </div>
            <Progress value={userType === 'buyer' ? 75 : 65} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {userType === 'buyer' ? 'Active Suppliers' : 'Marketplace Items'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{userType === 'buyer' ? '42' : '31'}</div>
              {userType === 'buyer' ? (
                <Users className="h-7 w-7 text-blue-400/60" />
              ) : (
                <ShoppingBag className="h-7 w-7 text-blue-400/60" />
              )}
            </div>
            <Progress value={userType === 'buyer' ? 42 : 62} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{userType === 'buyer' ? '94%' : '98%'}</div>
              <BarChart className="h-7 w-7 text-green-500/60" />
            </div>
            <Progress value={userType === 'buyer' ? 94 : 98} className="h-1 mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="col-span-1 lg:col-span-2 hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Tenders</CardTitle>
            <CardDescription className="text-xs">Track and manage your recent tenders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-md mr-3">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">
                        {userType === 'buyer' 
                          ? `Supply of Office Equipment #${1000 + item}` 
                          : `Tender for IT Infrastructure #${2000 + item}`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {userType === 'buyer' 
                          ? `${item * 3} submissions • Closing in ${item * 2} days` 
                          : `Posted 3 days ago • Closing in ${item * 2} days`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={item % 2 === 0 ? "outline" : "default"} className="text-xs">
                      {item % 2 === 0 ? 'Draft' : 'Published'}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full text-xs">View All Tenders</Button>
          </CardFooter>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {userType === 'buyer' ? 'Alerts & Notifications' : 'Opportunities'}
            </CardTitle>
            <CardDescription className="text-xs">
              {userType === 'buyer' 
                ? 'Important updates and alerts' 
                : 'Tenders matching your profile'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="p-2 bg-secondary/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    {userType === 'buyer' ? (
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    ) : (
                      <ExternalLink className="h-4 w-4 text-primary mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium leading-tight">
                        {userType === 'buyer' 
                          ? `Tender #${1025 + item} compliance review required` 
                          : `New tender: ${['Office Supplies', 'IT Services', 'Construction'][item - 1]}`}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {userType === 'buyer' 
                          ? `${item} hour${item > 1 ? 's' : ''} ago` 
                          : `Match score: ${95 - (item * 5)}% • ${item + 1} days ago`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full text-xs">View All</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="hover-lift lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {userType === 'buyer' ? 'Procurement Timeline' : 'Submission Timeline'}
            </CardTitle>
            <CardDescription className="text-xs">
              {userType === 'buyer' 
                ? 'Track your procurement process stages' 
                : 'Track your tender submissions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: userType === 'buyer' ? 'Tender Published' : 'Document Submission',
                  description: userType === 'buyer' 
                    ? 'Tender for IT Equipment successfully published'
                    : 'Submitted all required documents for Tender #2034',
                  date: '12 Jun 2023',
                  status: 'complete'
                },
                {
                  title: userType === 'buyer' ? 'Evaluation Process' : 'Technical Evaluation',
                  description: userType === 'buyer'
                    ? 'Technical evaluation of submitted proposals'
                    : 'Your submission is under technical evaluation',
                  date: '18 Jun 2023',
                  status: 'in-progress'
                },
                {
                  title: userType === 'buyer' ? 'Award Decision' : 'Financial Evaluation',
                  description: userType === 'buyer'
                    ? 'Final award decision and notification'
                    : 'Financial evaluation pending',
                  date: '25 Jun 2023',
                  status: 'upcoming'
                }
              ].map((item, index) => (
                <div key={index} className="relative pl-5 pb-4 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border">
                  <div className={`absolute left-0 top-1 h-3 w-3 -translate-x-1.5 rounded-full ${
                    item.status === 'complete' 
                      ? 'bg-green-500' 
                      : item.status === 'in-progress' 
                        ? 'bg-primary'
                        : 'bg-muted-foreground'
                  }`}></div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                    <span className="text-xs font-medium mt-1">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Contact Information
            </CardTitle>
            <CardDescription className="text-xs">Need assistance? Get in touch with us</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="flex-shrink-0 h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone Support</p>
                  <p className="text-xs text-muted-foreground">+254115852616</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="flex-shrink-0 h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email Contact</p>
                  <p className="text-xs text-muted-foreground break-all">procurechain@tenderzville-portal.co.ke</p>
                </div>
              </div>
              <div className="mt-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activities</CardTitle>
            <CardDescription className="text-xs">Latest activities on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  icon: userType === 'buyer' ? <FileText className="h-4 w-4" /> : <Briefcase className="h-4 w-4" />,
                  title: userType === 'buyer' 
                    ? 'New tender template created'
                    : 'Applied to new tender',
                  time: '2 hours ago',
                },
                {
                  icon: userType === 'buyer' ? <Users className="h-4 w-4" /> : <FileText className="h-4 w-4" />,
                  title: userType === 'buyer'
                    ? 'New supplier registered'
                    : 'Document approved',
                  time: '5 hours ago',
                },
                {
                  icon: <BarChart className="h-4 w-4" />,
                  title: userType === 'buyer'
                    ? 'Evaluation criteria updated'
                    : 'Profile verification completed',
                  time: '1 day ago',
                },
                {
                  icon: userType === 'buyer' ? <ShoppingBag className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />,
                  title: userType === 'buyer'
                    ? 'New marketplace item approved'
                    : 'Added new product to marketplace',
                  time: '2 days ago',
                }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-2">
                  <div className="flex-shrink-0 h-7 w-7 bg-secondary rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

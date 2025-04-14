
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FileText, 
  ClipboardCheck, 
  Users, 
  BarChart, 
  Plus, 
  Calendar,
  AlertTriangle,
  Filter,
  ChevronRight,
  CheckCircle2,
  Clock,
  PenTool
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TenderData {
  id: string;
  title: string;
  status: string;
  submission_deadline: string;
  category: string;
  bids_count?: number;
}

const BuyerDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('tenders')
          .select('*')
          .eq('buyer_id', await getCurrentUserId());
        
        if (error) throw error;
        
        // Simulate adding bid counts for demonstration
        const tendersWithBidCounts = data ? data.map(tender => ({
          ...tender,
          bids_count: Math.floor(Math.random() * 10), // In a real app, this would be from a join query
        })) : [];
        
        setTenders(tendersWithBidCounts);
      } catch (error) {
        console.error('Error fetching tenders:', error);
        toast({
          title: "Error fetching tenders",
          description: "There was a problem loading your tenders",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTenders();
  }, [toast]);
  
  // Helper function to get the current user ID
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || '';
  };

  const getTenderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Draft</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Published</Badge>;
      case 'evaluation':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Evaluation</Badge>;
      case 'awarded':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Awarded</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredTenders = tenders.filter(tender => {
    if (activeTab === 'active') {
      return ['published', 'evaluation'].includes(tender.status.toLowerCase());
    } else if (activeTab === 'drafts') {
      return tender.status.toLowerCase() === 'draft';
    } else if (activeTab === 'closed') {
      return ['awarded', 'closed'].includes(tender.status.toLowerCase());
    }
    return true;
  });

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Buyer Dashboard</h1>
        <Button className="flex items-center gap-2" asChild>
          <Link to="/tenders/create">
            <Plus size={16} />
            <span>New Tender</span>
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {tenders.filter(tender => ['published', 'evaluation'].includes(tender.status.toLowerCase())).length}
              </div>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Pending Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {tenders.filter(tender => tender.status.toLowerCase() === 'evaluation').length}
              </div>
              <ClipboardCheck className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Verified Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">24</div>
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">98%</div>
              <BarChart className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Tenders</CardTitle>
          <CardDescription>Manage your procurement tenders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="closed">Closed</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter size={14} />
              <span>Filter</span>
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTenders.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No tenders found</AlertTitle>
              <AlertDescription>
                You don't have any {activeTab} tenders at the moment. 
                {activeTab === 'drafts' && (
                  <Link to="/tenders/create" className="ml-1 text-primary hover:underline">
                    Create a new tender
                  </Link>
                )}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {filteredTenders.map((tender) => (
                <Card key={tender.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{tender.title}</h3>
                          {getTenderStatusBadge(tender.status)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-2">
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Deadline: {new Date(tender.submission_deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Users size={14} />
                            <span>Bids: {tender.bids_count || 0}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Category: {tender.category}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tender.status.toLowerCase() === 'draft' && (
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/tenders/edit/${tender.id}`}>
                              <PenTool size={14} className="mr-1" />
                              Edit
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="flex items-center" asChild>
                          <Link to={`/tender/${tender.id}`}>
                            <span>Details</span>
                            <ChevronRight size={14} className="ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Important tender deadlines to track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative pl-6 pb-3 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-amber-500"></div>
                <h4 className="font-medium text-sm">Office Equipment Tender</h4>
                <p className="text-xs text-muted-foreground">Submission deadline in 2 days</p>
              </div>
              <div className="relative pl-6 pb-3 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-blue-500"></div>
                <h4 className="font-medium text-sm">IT Services Bid Evaluation</h4>
                <p className="text-xs text-muted-foreground">Evaluation due in 5 days</p>
              </div>
              <div className="relative pl-6 pb-3 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
                <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-green-500"></div>
                <h4 className="font-medium text-sm">Contract Finalization</h4>
                <p className="text-xs text-muted-foreground">Contract signing in 9 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <CardDescription>Highest rated verified suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Acme Supplies Ltd</h4>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-xs text-muted-foreground">Advanced Verification</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                    <Link to={`/supplier/123`}>
                      <ChevronRight size={16} />
                    </Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/marketplace">Browse Supplier Marketplace</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;

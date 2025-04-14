
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Briefcase, Clock, FileCheck, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BidData {
  id: string;
  tender_title: string;
  tender_id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  evaluation_score?: number;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<BidData[]>([]);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        
        // In a real implementation this would join with the tenders table to get tender titles
        const { data, error } = await supabase
          .from('bids')
          .select('*')
          .eq('supplier_id', await getCurrentUserId());
        
        if (error) throw error;
        
        // Simulating joining with tenders table for demonstration
        const bidsWithTenderInfo = data ? data.map(bid => ({
          ...bid,
          tender_title: `Tender #${Math.floor(Math.random() * 1000)}`, // In real app, get from tenders table
        })) : [];
        
        setBids(bidsWithTenderInfo);
      } catch (error) {
        console.error('Error fetching bids:', error);
        toast({
          title: "Error fetching bids",
          description: "There was a problem loading your bids",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBids();
  }, [toast]);
  
  // Helper function to get the current user ID
  const getCurrentUserId = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || '';
  };
  
  const getBidStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Submitted</Badge>;
      case 'under_evaluation':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700">Under Evaluation</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Rejected</Badge>;
      case 'awarded':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Awarded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredBids = bids.filter(bid => {
    if (activeTab === 'active') {
      return ['submitted', 'under_evaluation'].includes(bid.status.toLowerCase());
    } else if (activeTab === 'awarded') {
      return bid.status.toLowerCase() === 'awarded';
    } else if (activeTab === 'rejected') {
      return bid.status.toLowerCase() === 'rejected';
    }
    return true;
  });

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Supplier Dashboard</h1>
        <Button asChild className="flex items-center gap-2">
          <Link to="/tenders">
            <Search size={16} />
            <span>Browse Tenders</span>
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {bids.filter(bid => ['submitted', 'under_evaluation'].includes(bid.status.toLowerCase())).length}
              </div>
              <Briefcase className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Awarded Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">
                {bids.filter(bid => bid.status.toLowerCase() === 'awarded').length}
              </div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-amber-600">Pending Advanced Verification</div>
              <FileCheck className="h-5 w-5 text-amber-500" />
            </div>
            <Link to="/verification" className="text-xs text-primary hover:underline block mt-2">
              Complete verification
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Bid History</CardTitle>
          <CardDescription>Track all your tender submissions and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="awarded">Awarded</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All Bids</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredBids.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No bids found</AlertTitle>
                  <AlertDescription>
                    You don't have any {activeTab} bids at the moment.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {filteredBids.map((bid) => (
                    <Card key={bid.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4 flex flex-col md:flex-row justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{bid.tender_title}</h3>
                              {getBidStatusBadge(bid.status)}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock size={14} />
                              <span>Submitted on {new Date(bid.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Bid Amount:</span> KES {bid.bid_amount.toLocaleString()}
                            </div>
                            {bid.evaluation_score && (
                              <div className="mt-1 text-sm">
                                <span className="font-medium">Evaluation Score:</span> {bid.evaluation_score}/100
                              </div>
                            )}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/bid/${bid.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Complete your profile verification to increase your chances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
                  <span>Basic Verification</span>
                </div>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Complete</Badge>
                  <span>Business Registration</span>
                </div>
                <CheckCircle className="text-green-500 h-5 w-5" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                  <span>Tax Compliance</span>
                </div>
                <Clock className="text-yellow-500 h-5 w-5" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Started</Badge>
                  <span>Advanced Verification</span>
                </div>
                <AlertTriangle className="text-gray-400 h-5 w-5" />
              </div>
              
              <Button className="w-full mt-4" asChild>
                <Link to="/verification">Continue Verification</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recommended Tenders</CardTitle>
            <CardDescription>Tenders that match your business profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                  <div>
                    <h4 className="font-medium">Supply of Office Equipment</h4>
                    <p className="text-sm text-muted-foreground">Deadline: 15 May 2025 • Match: 92%</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/tender/123">View</Link>
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link to="/tenders">View All Tenders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;

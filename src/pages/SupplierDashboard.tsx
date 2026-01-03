import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Clock, FileCheck, AlertTriangle, CheckCircle, Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BidData {
  id: string;
  tender_id: string;
  tender_title: string;
  bid_amount: number;
  status: string;
  created_at: string;
  evaluation_score?: number;
}

interface TenderMatch {
  id: string;
  title: string;
  deadline: string;
  budget: string;
  match_score: number;
}

const SupplierDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState<BidData[]>([]);
  const [recommendedTenders, setRecommendedTenders] = useState<TenderMatch[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [stats, setStats] = useState({
    activeBids: 0,
    awardedContracts: 0,
    totalBidValue: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's bids with tender information
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          id,
          tender_id,
          bid_amount,
          status,
          created_at,
          tenders (
            title
          )
        `)
        .eq('supplier_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (bidsError) throw bidsError;

      // Transform bids data
      const formattedBids = (bidsData || []).map(bid => ({
        id: bid.id,
        tender_id: bid.tender_id,
        tender_title: (bid.tenders as any)?.title || 'Untitled Tender',
        bid_amount: bid.bid_amount,
        status: bid.status,
        created_at: bid.created_at
      }));

      setBids(formattedBids);

      // Calculate stats
      const activeBids = formattedBids.filter(
        b => ['submitted', 'under_evaluation'].includes(b.status.toLowerCase())
      ).length;
      
      const awardedContracts = formattedBids.filter(
        b => b.status.toLowerCase() === 'awarded'
      ).length;

      const totalBidValue = formattedBids.reduce((sum, bid) => sum + (bid.bid_amount || 0), 0);

      setStats({ activeBids, awardedContracts, totalBidValue });

      // Fetch user profile for verification status
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Fetch recommended tenders (published tenders the user hasn't bid on)
      const existingTenderIds = formattedBids.map(b => b.tender_id);
      
      const { data: tendersData } = await supabase
        .from('tenders')
        .select('id, title, submission_deadline, budget_amount, budget_currency, category')
        .eq('status', 'published')
        .gt('submission_deadline', new Date().toISOString())
        .not('id', 'in', existingTenderIds.length > 0 ? `(${existingTenderIds.join(',')})` : '()')
        .order('submission_deadline', { ascending: true })
        .limit(5);

      const recommended = (tendersData || []).map(tender => ({
        id: tender.id,
        title: tender.title,
        deadline: new Date(tender.submission_deadline).toLocaleDateString(),
        budget: `${tender.budget_currency || 'KES'} ${(tender.budget_amount || 0).toLocaleString()}`,
        match_score: Math.floor(Math.random() * 20) + 80 // Calculate based on profile match in production
      }));

      setRecommendedTenders(recommended);

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const getVerificationProgress = () => {
    if (!profile) return 0;
    let progress = 0;
    if (profile.kyc_status === 'verified') progress += 25;
    if (profile.company_name) progress += 25;
    if (profile.tax_id) progress += 25;
    if (profile.verification_level === 'advanced') progress += 25;
    return progress;
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Supplier Dashboard</h1>
        <Button onClick={() => navigate('/tenders')} className="flex items-center gap-2">
          <Search size={16} />
          <span>Browse Tenders</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{stats.activeBids}</div>
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
              <div className="text-2xl font-bold">{stats.awardedContracts}</div>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium capitalize">
                {profile?.verification_level || 'basic'} Level
              </div>
              <FileCheck className={`h-5 w-5 ${profile?.kyc_status === 'verified' ? 'text-green-500' : 'text-amber-500'}`} />
            </div>
            <Progress value={getVerificationProgress()} className="h-2" />
            <Button variant="link" className="p-0 h-auto mt-2 text-xs" onClick={() => navigate('/verification')}>
              {getVerificationProgress() < 100 ? 'Complete verification' : 'View status'}
            </Button>
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
              <TabsTrigger value="active">Active ({bids.filter(b => ['submitted', 'under_evaluation'].includes(b.status.toLowerCase())).length})</TabsTrigger>
              <TabsTrigger value="awarded">Awarded ({bids.filter(b => b.status.toLowerCase() === 'awarded').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({bids.filter(b => b.status.toLowerCase() === 'rejected').length})</TabsTrigger>
              <TabsTrigger value="all">All ({bids.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              {filteredBids.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No bids found</AlertTitle>
                  <AlertDescription>
                    You don't have any {activeTab} bids.
                    <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => navigate('/tenders')}>
                      Browse available tenders
                    </Button>
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
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigate(`/tender/${bid.tender_id}`)}>
                            View Tender
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
            <CardTitle>Verification Progress</CardTitle>
            <CardDescription>Complete your profile verification to increase bid success</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={profile?.kyc_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {profile?.kyc_status === 'verified' ? 'Complete' : 'Pending'}
                  </Badge>
                  <span>KYC Verification</span>
                </div>
                {profile?.kyc_status === 'verified' 
                  ? <CheckCircle className="text-green-500 h-5 w-5" />
                  : <Clock className="text-yellow-500 h-5 w-5" />
                }
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={profile?.company_name ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {profile?.company_name ? 'Complete' : 'Not Started'}
                  </Badge>
                  <span>Business Registration</span>
                </div>
                {profile?.company_name 
                  ? <CheckCircle className="text-green-500 h-5 w-5" />
                  : <AlertTriangle className="text-gray-400 h-5 w-5" />
                }
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={profile?.tax_id ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {profile?.tax_id ? 'Complete' : 'Pending'}
                  </Badge>
                  <span>Tax Compliance</span>
                </div>
                {profile?.tax_id 
                  ? <CheckCircle className="text-green-500 h-5 w-5" />
                  : <Clock className="text-yellow-500 h-5 w-5" />
                }
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge className={profile?.verification_level === 'advanced' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {profile?.verification_level === 'advanced' ? 'Complete' : 'Not Started'}
                  </Badge>
                  <span>Advanced Verification</span>
                </div>
                {profile?.verification_level === 'advanced' 
                  ? <CheckCircle className="text-green-500 h-5 w-5" />
                  : <AlertTriangle className="text-gray-400 h-5 w-5" />
                }
              </div>
              
              <Button className="w-full mt-4" onClick={() => navigate('/verification')}>
                {getVerificationProgress() < 100 ? 'Continue Verification' : 'View Verification'}
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
            {recommendedTenders.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recommended tenders available</p>
            ) : (
              <div className="space-y-3">
                {recommendedTenders.map((tender) => (
                  <div key={tender.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                    <div>
                      <h4 className="font-medium text-sm">{tender.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {tender.deadline} • {tender.budget}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/tender/${tender.id}`)}>
                      View
                    </Button>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/tenders')}>
                  View All Tenders
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupplierDashboard;

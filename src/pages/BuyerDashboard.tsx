import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  FileText, ClipboardCheck, Users, BarChart, Plus, Calendar,
  AlertTriangle, Filter, ChevronRight, CheckCircle2, Clock, PenTool, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TenderData {
  id: string;
  title: string;
  status: string;
  submission_deadline: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  bids_count: number;
}

interface SupplierData {
  id: string;
  company_name: string;
  verification_level: string;
  performance_score: number;
}

const BuyerDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tenders, setTenders] = useState<TenderData[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [stats, setStats] = useState({
    activeTenders: 0,
    pendingEvaluations: 0,
    verifiedSuppliers: 0,
    complianceRate: 0
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's tenders with bid counts
      const { data: tendersData, error: tendersError } = await supabase
        .from('tenders')
        .select(`
          id,
          title,
          status,
          submission_deadline,
          category,
          budget_amount,
          budget_currency
        `)
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (tendersError) throw tendersError;

      // Get bid counts for each tender
      const tendersWithBids = await Promise.all(
        (tendersData || []).map(async (tender) => {
          const { count } = await supabase
            .from('bids')
            .select('*', { count: 'exact', head: true })
            .eq('tender_id', tender.id);
          
          return { ...tender, bids_count: count || 0 };
        })
      );

      setTenders(tendersWithBids);

      // Calculate stats
      const activeTenders = tendersWithBids.filter(
        t => ['published', 'evaluation'].includes(t.status.toLowerCase())
      ).length;
      
      const pendingEvaluations = tendersWithBids.filter(
        t => t.status.toLowerCase() === 'evaluation'
      ).length;

      // Fetch verified suppliers count
      const { count: suppliersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'verified');

      // Fetch top suppliers
      const { data: suppliersData } = await supabase
        .from('profiles')
        .select('id, company_name, verification_level, performance_score')
        .eq('kyc_status', 'verified')
        .order('performance_score', { ascending: false })
        .limit(5);

      setSuppliers(suppliersData || []);

      // Calculate compliance rate from completed evaluations
      const { data: evaluationsData } = await supabase
        .from('evaluations')
        .select('score')
        .gte('score', 70);
      
      const { count: totalEvaluations } = await supabase
        .from('evaluations')
        .select('*', { count: 'exact', head: true });

      const complianceRate = totalEvaluations && totalEvaluations > 0 
        ? Math.round(((evaluationsData?.length || 0) / totalEvaluations) * 100)
        : 0;

      setStats({
        activeTenders,
        pendingEvaluations,
        verifiedSuppliers: suppliersCount || 0,
        complianceRate: complianceRate || 98
      });

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

  // Get upcoming deadlines from real tender data
  const upcomingDeadlines = tenders
    .filter(t => new Date(t.submission_deadline) > new Date())
    .sort((a, b) => new Date(a.submission_deadline).getTime() - new Date(b.submission_deadline).getTime())
    .slice(0, 3);

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Buyer Dashboard</h1>
        <Button className="flex items-center gap-2" onClick={() => navigate('/tenders/create')}>
          <Plus size={16} />
          <span>New Tender</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Tenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{stats.activeTenders}</div>
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
              <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
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
              <div className="text-2xl font-bold">{stats.verifiedSuppliers}</div>
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
              <div className="text-2xl font-bold">{stats.complianceRate}%</div>
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
          </div>
          
          {filteredTenders.length === 0 ? (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>No tenders found</AlertTitle>
              <AlertDescription>
                You don't have any {activeTab} tenders. 
                <Button variant="link" className="p-0 ml-1 h-auto" onClick={() => navigate('/tenders/create')}>
                  Create your first tender
                </Button>
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
                            <span>Bids: {tender.bids_count}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Budget: {tender.budget_currency || 'KES'} {(tender.budget_amount || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {tender.status.toLowerCase() === 'draft' && (
                          <Button variant="outline" size="sm" onClick={() => navigate(`/tenders/create?edit=${tender.id}`)}>
                            <PenTool size={14} className="mr-1" />
                            Edit
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => navigate(`/tender/${tender.id}`)}>
                          <span>Details</span>
                          <ChevronRight size={14} className="ml-1" />
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
            {upcomingDeadlines.length === 0 ? (
              <p className="text-muted-foreground text-sm">No upcoming deadlines</p>
            ) : (
              <div className="space-y-4">
                {upcomingDeadlines.map((tender, index) => {
                  const daysLeft = Math.ceil(
                    (new Date(tender.submission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const color = daysLeft <= 2 ? 'bg-red-500' : daysLeft <= 5 ? 'bg-amber-500' : 'bg-green-500';
                  
                  return (
                    <div key={tender.id} className="relative pl-6 pb-3 before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
                      <div className={`absolute left-0 top-1 h-4 w-4 rounded-full ${color}`}></div>
                      <h4 className="font-medium text-sm">{tender.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {daysLeft === 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `Due in ${daysLeft} days`}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
            <CardDescription>Highest rated verified suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            {suppliers.length === 0 ? (
              <p className="text-muted-foreground text-sm">No verified suppliers yet</p>
            ) : (
              <div className="space-y-3">
                {suppliers.map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{supplier.company_name || 'Unnamed Supplier'}</h4>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span className="text-xs text-muted-foreground capitalize">
                            {supplier.verification_level || 'basic'} Verification
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate(`/marketplace`)}>
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" onClick={() => navigate('/marketplace')}>
                  Browse Supplier Marketplace
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/enums';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  submission_deadline: string;
  status: string;
  created_at: string;
  buyer_id: string;
  buyer_name?: string;
}

interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  supplier_name?: string;
  tender_title?: string;
}

const Evaluations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [pendingEvaluations, setPendingEvaluations] = useState<Bid[]>([]);
  const [completedEvaluations, setCompletedEvaluations] = useState<Bid[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Not Authenticated",
          description: "Please log in to view evaluations",
        });
        navigate('/');
        return;
      }
      
      setSession(data.session);
      
      // Check user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
        
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify your permissions",
        });
      } else if (rolesData) {
        const roles = rolesData.map((r: { role: string }) => r.role);
        setUserRoles(roles);
        
        // Check if user has any evaluator role
        const isEvaluator = roles.some(role => role.includes('evaluator_'));
        
        if (!isEvaluator) {
          toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Only evaluators can access this page",
          });
          navigate('/dashboard');
          return;
        }
        
        // Fetch pending evaluations
        fetchEvaluations(data.session.user.id, roles);
      }
      
      setLoading(false);
    };
    
    checkSession();
  }, [navigate, toast]);

  const fetchEvaluations = async (userId: string, roles: string[]) => {
    try {
      setLoading(true);
      
      // Get the evaluation types for this user
      const evaluationTypes = roles.filter(role => role.includes('evaluator_'));
      
      // Fetch bids that need evaluation from this user type and don't have evaluations yet
      // This is a more complex query that would ideally be handled with a stored procedure
      // For this example, we'll simulate by fetching all bids under review
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          tenders(title, buyer_id)
        `)
        .eq('status', 'under_evaluation');
        
      if (bidsError) throw bidsError;
      
      // Fetch evaluations done by this user
      const { data: evaluationsData, error: evaluationsError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('evaluator_id', userId);
        
      if (evaluationsError) throw evaluationsError;
      
      // Format the bids data
      const formattedBids = bidsData.map((bid: any) => ({
        id: bid.id,
        tender_id: bid.tender_id,
        supplier_id: bid.supplier_id,
        bid_amount: bid.bid_amount,
        status: bid.status,
        created_at: bid.created_at,
        tender_title: bid.tenders?.title
      }));
      
      // Filter out bids that have already been evaluated by this user
      const evaluatedBidIds = evaluationsData.map((eval: any) => eval.bid_id);
      
      const pending = formattedBids.filter((bid: any) => !evaluatedBidIds.includes(bid.id));
      const completed = formattedBids.filter((bid: any) => evaluatedBidIds.includes(bid.id));
      
      setPendingEvaluations(pending);
      setCompletedEvaluations(completed);
      
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load evaluations",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (bidId: string) => {
    navigate(`/evaluations/${bidId}`);
  };

  const filteredPendingEvaluations = pendingEvaluations.filter(bid => {
    if (searchQuery && !bid.tender_title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    if (selectedFilter !== 'all' && !bid.tender_id.includes(selectedFilter)) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Bid Evaluations</h1>
          <p className="text-muted-foreground mt-2">
            Review and evaluate supplier bids based on your expertise.
          </p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by tender title..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="it">IT Services</SelectItem>
              <SelectItem value="supplies">Office Supplies</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="pending">
          <TabsList className="mb-8">
            <TabsTrigger value="pending">
              Pending Evaluations
              {pendingEvaluations.length > 0 && (
                <Badge variant="secondary" className="ml-2">{pendingEvaluations.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Evaluations
              {completedEvaluations.length > 0 && (
                <Badge variant="secondary" className="ml-2">{completedEvaluations.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {filteredPendingEvaluations.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-lg text-muted-foreground">No pending evaluations found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery || selectedFilter !== 'all' ? 
                    "Try changing your search or filter" : 
                    "All assigned evaluations are complete"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPendingEvaluations.map((bid) => (
                  <Card key={bid.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.tender_title}</CardTitle>
                          <CardDescription>Bid #{bid.id.slice(0, 8)}</CardDescription>
                        </div>
                        <Badge>{bid.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bid Amount</p>
                          <p className="font-medium">{bid.bid_amount} KES</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-medium">{new Date(bid.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Supplier ID</p>
                          <p className="font-medium">{bid.supplier_id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end bg-muted/50 pt-3">
                      <Button onClick={() => handleEvaluate(bid.id)}>
                        Evaluate Bid
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedEvaluations.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-lg text-muted-foreground">No completed evaluations</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Evaluations you complete will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedEvaluations.map((bid) => (
                  <Card key={bid.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{bid.tender_title}</CardTitle>
                          <CardDescription>Bid #{bid.id.slice(0, 8)}</CardDescription>
                        </div>
                        <Badge variant="outline">Evaluated</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bid Amount</p>
                          <p className="font-medium">{bid.bid_amount} KES</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Evaluated On</p>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Supplier ID</p>
                          <p className="font-medium">{bid.supplier_id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end bg-muted/50 pt-3">
                      <Button variant="outline" onClick={() => handleEvaluate(bid.id)}>
                        View Evaluation
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Evaluations;

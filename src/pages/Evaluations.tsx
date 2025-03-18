import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SearchX, Clock, CheckCircle2, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDateRangePicker } from '@/components/evaluations/DateRangePicker';
import { DateRange } from 'react-day-picker';

// Types
interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  tender?: {
    title: string;
    category: string;
  };
  supplier?: {
    full_name: string | null;
    company_name: string | null;
  };
}

const Evaluations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingBids, setPendingBids] = useState<Bid[]>([]);
  const [evaluatedBids, setEvaluatedBids] = useState<Bid[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [userRoles, setUserRoles] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to view evaluations",
        });
        navigate('/');
        return;
      }
      
      // Check user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
      
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        return;
      }
      
      if (rolesData) {
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
      }
      
      fetchBids(data.session.user.id);
    };
    
    fetchSession();
  }, [navigate, toast]);
  
  const fetchBids = async (userId: string) => {
    try {
      setLoading(true);
      
      // Update query to properly join with profiles table
      const { data: pendingData, error: pendingError } = await supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(title, category),
          supplier:supplier_id(profiles!supplier_id(
            full_name,
            company_name
          ))
        `)
        .eq('status', 'under_evaluation')
        .not('id', 'in', `(
          select bid_id from evaluations 
          where evaluator_id = '${userId}'
        )`);
      
      if (pendingError) throw pendingError;
      
      // Process pending bids with safe type handling
      const safePendingBids = pendingData.map((bid: any) => ({
        ...bid,
        supplier: {
          full_name: bid.supplier?.profiles?.[0]?.full_name || 'Unknown',
          company_name: bid.supplier?.profiles?.[0]?.company_name || 'Unknown Company'
        }
      }));
      
      setPendingBids(safePendingBids);
      
      // Similar update for evaluated bids
      const { data: evaluatedData, error: evaluatedError } = await supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(title, category),
          supplier:supplier_id(profiles!supplier_id(
            full_name,
            company_name
          ))
        `)
        .in('id', `(
          select bid_id from evaluations 
          where evaluator_id = '${userId}'
        )`);
      
      if (evaluatedError) throw evaluatedError;
      
      const safeEvaluatedBids = evaluatedData.map((bid: any) => ({
        ...bid,
        supplier: {
          full_name: bid.supplier?.profiles?.[0]?.full_name || 'Unknown',
          company_name: bid.supplier?.profiles?.[0]?.company_name || 'Unknown Company'
        }
      }));
      
      setEvaluatedBids(safeEvaluatedBids);
      
    } catch (error) {
      console.error('Error fetching bids:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load evaluation data",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter bids based on selected category and date range
  const filterBids = (bids: Bid[]) => {
    let filtered = [...bids];
    
    // Apply category filter if not 'all'
    if (category !== 'all') {
      filtered = filtered.filter(bid => bid.tender?.category === category);
    }
    
    // Apply date range filter if selected
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      filtered = filtered.filter(bid => {
        const bidDate = new Date(bid.created_at);
        return bidDate >= fromDate;
      });
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999); // End of the day
        filtered = filtered.filter(bid => {
          const bidDate = new Date(bid.created_at);
          return bidDate <= toDate;
        });
      }
    }
    
    return filtered;
  };
  
  // Get unique categories from all bids
  const getCategories = () => {
    const categories = new Set<string>();
    [...pendingBids, ...evaluatedBids].forEach(bid => {
      if (bid.tender?.category) {
        categories.add(bid.tender.category);
      }
    });
    return Array.from(categories);
  };
  
  const filteredPendingBids = filterBids(pendingBids);
  const filteredEvaluatedBids = filterBids(evaluatedBids);
  const categories = getCategories();
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
          <p className="text-muted-foreground mt-2">
            Review and evaluate procurement bids
          </p>
        </div>
        
        <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <CalendarDateRangePicker 
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
          
          {category !== 'all' || dateRange?.from ? (
            <Button 
              variant="ghost" 
              onClick={() => {
                setCategory('all');
                setDateRange(undefined);
              }}
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
        
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Pending Evaluation
              {pendingBids.length > 0 && (
                <Badge className="ml-2">{filteredPendingBids.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="evaluated" className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Evaluated
              {evaluatedBids.length > 0 && (
                <Badge className="ml-2">{filteredEvaluatedBids.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Evaluations</CardTitle>
                <CardDescription>
                  Bids requiring your evaluation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredPendingBids.length === 0 ? (
                  <div className="text-center py-8">
                    <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No pending evaluations</h3>
                    <p className="text-muted-foreground mt-1">
                      {category !== 'all' || dateRange?.from 
                        ? 'Try changing your filters' 
                        : 'All bids have been evaluated'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tender</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Bid Amount</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingBids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">
                            {bid.tender?.title || 'Unknown Tender'}
                          </TableCell>
                          <TableCell>{bid.supplier?.company_name || 'Unknown'}</TableCell>
                          <TableCell>{bid.tender?.category || 'Uncategorized'}</TableCell>
                          <TableCell>{bid.bid_amount.toLocaleString()} KES</TableCell>
                          <TableCell>{new Date(bid.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button asChild>
                              <Link to={`/evaluation/${bid.id}`}>Evaluate</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="evaluated">
            <Card>
              <CardHeader>
                <CardTitle>Evaluated Bids</CardTitle>
                <CardDescription>
                  Bids you have already evaluated
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredEvaluatedBids.length === 0 ? (
                  <div className="text-center py-8">
                    <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No evaluated bids</h3>
                    <p className="text-muted-foreground mt-1">
                      {category !== 'all' || dateRange?.from 
                        ? 'Try changing your filters' 
                        : 'You have not evaluated any bids yet'}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tender</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Bid Amount</TableHead>
                        <TableHead>Evaluation Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvaluatedBids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">
                            {bid.tender?.title || 'Unknown Tender'}
                          </TableCell>
                          <TableCell>{bid.supplier?.company_name || 'Unknown'}</TableCell>
                          <TableCell>{bid.tender?.category || 'Uncategorized'}</TableCell>
                          <TableCell>{bid.bid_amount.toLocaleString()} KES</TableCell>
                          <TableCell>{new Date(bid.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="outline" asChild>
                              <Link to={`/evaluation/${bid.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Evaluations;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import FilterSection from '@/components/evaluations/FilterSection';
import BidList from '@/components/evaluations/BidList';

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
      
      // Get pending bids
      const { data: pendingData, error: pendingError } = await supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(title, category)
        `)
        .eq('status', 'under_evaluation')
        .not('bid_id', 'in', (subquery) => {
          return subquery
            .from('evaluations')
            .select('bid_id')
            .eq('evaluator_id', userId);
        });
      
      if (pendingError) throw pendingError;

      // Fetch supplier profiles for pending bids
      const pendingBidsWithSuppliers = await Promise.all(
        (pendingData || []).map(async (bid) => {
          const { data: supplierData } = await supabase
            .from('profiles')
            .select('full_name, company_name')
            .eq('id', bid.supplier_id)
            .single();
          
          return {
            ...bid,
            supplier: supplierData || {
              full_name: 'Unknown',
              company_name: 'Unknown Company'
            }
          };
        })
      );
      
      setPendingBids(pendingBidsWithSuppliers);
      
      // Get evaluated bids
      const evaluatedBidsQuery = supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(title, category)
        `);

      const evaluationsSubquery = await supabase
        .from('evaluations')
        .select('bid_id')
        .eq('evaluator_id', userId);

      if (evaluationsSubquery.data && evaluationsSubquery.data.length > 0) {
        const bidIds = evaluationsSubquery.data.map(evaluation => evaluation.bid_id);
        const { data: evaluatedData, error: evaluatedError } = await evaluatedBidsQuery
          .in('id', bidIds);
        
        if (evaluatedError) throw evaluatedError;
        
        // Fetch supplier profiles for evaluated bids
        const evaluatedBidsWithSuppliers = await Promise.all(
          (evaluatedData || []).map(async (bid) => {
            const { data: supplierData } = await supabase
              .from('profiles')
              .select('full_name, company_name')
              .eq('id', bid.supplier_id)
              .single();
            
            return {
              ...bid,
              supplier: supplierData || {
                full_name: 'Unknown',
                company_name: 'Unknown Company'
              }
            };
          })
        );
        
        setEvaluatedBids(evaluatedBidsWithSuppliers);
      } else {
        setEvaluatedBids([]);
      }
      
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
    
    if (category !== 'all') {
      filtered = filtered.filter(bid => bid.tender?.category === category);
    }
    
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      filtered = filtered.filter(bid => {
        const bidDate = new Date(bid.created_at);
        return bidDate >= fromDate;
      });
      
      if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
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
  const showClearFilters = category !== 'all' || dateRange?.from !== undefined;
  
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Evaluations</h1>
          <p className="text-muted-foreground mt-2">
            Review and evaluate procurement bids
          </p>
        </div>
        
        <FilterSection
          category={category}
          categories={categories}
          dateRange={dateRange}
          onCategoryChange={setCategory}
          onDateChange={setDateRange}
          onClearFilters={() => {
            setCategory('all');
            setDateRange(undefined);
          }}
          showClearButton={showClearFilters}
        />
        
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
                <BidList
                  bids={filteredPendingBids}
                  loading={loading}
                  showFilterMessage={showClearFilters}
                />
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
                <BidList
                  bids={filteredEvaluatedBids}
                  loading={loading}
                  isEvaluated={true}
                  showFilterMessage={showClearFilters}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Evaluations;

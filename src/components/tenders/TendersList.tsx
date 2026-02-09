import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, Plus, ArrowUpDown, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TenderCard, { TenderProps } from './TenderCard';

const TendersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [tenders, setTenders] = useState<TenderProps[]>([]);
  const [myTenders, setMyTenders] = useState<TenderProps[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTenders();
  }, [user]);

  const fetchTenders = async () => {
    setLoading(true);
    try {
      // Fetch all published tenders
      const { data: allTenders, error: allError } = await supabase
        .from('tenders')
        .select(`
          id,
          title,
          description,
          category,
          budget_amount,
          budget_currency,
          submission_deadline,
          status,
          procurement_method,
          buyer_id,
          created_at
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (allError) throw allError;

      // Transform to TenderProps
      const formattedTenders = (allTenders || []).map(tender => {
        const deadline = new Date(tender.submission_deadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        return {
          id: tender.id,
          title: tender.title,
          organization: 'Government Entity',
          location: 'Kenya',
          category: tender.category || 'General',
          description: tender.description || '',
          deadline: deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          daysLeft: Math.max(0, daysLeft),
          submissions: 0,
          value: `${tender.budget_currency || 'KES'} ${(tender.budget_amount || 0).toLocaleString()}`,
          status: daysLeft > 0 ? 'open' : 'evaluation'
        } as TenderProps;
      });

      setTenders(formattedTenders);

      // Fetch user's own tenders if logged in
      if (user) {
        const { data: userTenders, error: userError } = await supabase
          .from('tenders')
          .select('*')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (!userError && userTenders) {
          const formattedMyTenders = userTenders.map(tender => {
            const deadline = new Date(tender.submission_deadline);
            const today = new Date();
            const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            return {
              id: tender.id,
              title: tender.title,
              organization: 'My Organization',
              location: 'Kenya',
              category: tender.category || 'General',
              description: tender.description || '',
              deadline: deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
              daysLeft: Math.max(0, daysLeft),
              submissions: 0,
              value: `${tender.budget_currency || 'KES'} ${(tender.budget_amount || 0).toLocaleString()}`,
              status: tender.status as TenderProps['status']
            } as TenderProps;
          });
          setMyTenders(formattedMyTenders);
        }
      }
    } catch (error: any) {
      console.error('Error fetching tenders:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tenders",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tender.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || tender.category.toLowerCase().includes(category.toLowerCase());
    const matchesStatus = status === 'all' || tender.status === status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading tenders...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-semibold">Tenders</h1>
        <Button className="ml-auto" onClick={() => navigate('/tenders/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Tender
        </Button>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full max-w-md mb-6">
            <TabsTrigger value="browse" className="flex-1">Browse Tenders</TabsTrigger>
            <TabsTrigger value="my-tenders" className="flex-1">My Tenders ({myTenders.length})</TabsTrigger>
            <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tenders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-shrink-0"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <Button variant="ghost" className="flex-shrink-0">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-secondary/30 animate-fade-in">
                <div>
                  <label className="text-sm font-medium block mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="it">IT & Telecommunications</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="agriculture">Agriculture</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Status</label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="evaluation">Under Evaluation</SelectItem>
                      <SelectItem value="awarded">Awarded</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="nairobi">Nairobi County</SelectItem>
                      <SelectItem value="mombasa">Mombasa County</SelectItem>
                      <SelectItem value="kisumu">Kisumu County</SelectItem>
                      <SelectItem value="nakuru">Nakuru County</SelectItem>
                      <SelectItem value="kiambu">Kiambu County</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Value Range</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Value</SelectItem>
                      <SelectItem value="0-10m">0 - 10M KES</SelectItem>
                      <SelectItem value="10m-50m">10M - 50M KES</SelectItem>
                      <SelectItem value="50m-100m">50M - 100M KES</SelectItem>
                      <SelectItem value="100m+">Above 100M KES</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTenders.length > 0 ? (
                filteredTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No tenders found</h3>
                  <p className="text-muted-foreground mb-4">
                    {tenders.length === 0 
                      ? "No tenders have been published yet. Be the first to create one!"
                      : "Try adjusting your search or filters"
                    }
                  </p>
                  <Button onClick={() => navigate('/tenders/create')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Tender
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="my-tenders">
            {myTenders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTenders.map(tender => (
                  <TenderCard key={tender.id} tender={tender} />
                ))}
              </div>
            ) : (
              <div className="bg-secondary/30 rounded-lg p-8 text-center">
                <h3 className="text-xl font-medium mb-2">No Tenders Yet</h3>
                <p className="text-muted-foreground mb-4">
                  {user ? "You haven't created any tenders yet" : "Sign in to create and manage your tenders"}
                </p>
                <Button onClick={() => user ? navigate('/tenders/create') : navigate('/auth')}>
                  {user ? 'Create Your First Tender' : 'Sign In'}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="bg-secondary/30 rounded-lg p-8 text-center">
              <h3 className="text-xl font-medium mb-2">Saved Tenders</h3>
              <p className="text-muted-foreground mb-4">
                {user ? "You haven't saved any tenders yet" : "Sign in to save tenders for later"}
              </p>
              <Button onClick={() => navigate(user ? '/marketplace' : '/auth')}>
                {user ? 'Browse Marketplace' : 'Sign In'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TendersList;

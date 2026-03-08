import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { contractService } from '@/services/ContractService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft, Loader2, FileText, Calendar, DollarSign, User,
  CheckCircle, Clock, AlertTriangle, ShieldCheck, Download,
  Check, TrendingUp
} from 'lucide-react';

interface ContractData {
  id: string;
  tender_id: string;
  winning_bid_id: string;
  buyer_id: string;
  supplier_id: string;
  contract_value: number;
  contract_currency: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  milestones: any;
  terms_conditions: any;
  documents: any;
  blockchain_hash: string | null;
  created_at: string;
  updated_at: string;
}

interface MilestoneData {
  id: string;
  milestone_name: string;
  description: string | null;
  due_date: string;
  status: string;
  payment_percentage: number | null;
  completion_date: string | null;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [contract, setContract] = useState<ContractData | null>(null);
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [tenderTitle, setTenderTitle] = useState('');
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [supplierProfile, setSupplierProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) fetchContract();
  }, [id, user]);

  const fetchContract = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setContract(data as ContractData);

      // Parallel fetches
      const [tenderRes, buyerRes, supplierRes, milestonesRes] = await Promise.all([
        supabase.from('tenders').select('title').eq('id', data.tender_id).single(),
        supabase.from('profiles').select('full_name, company_name').eq('id', data.buyer_id).single(),
        supabase.from('profiles').select('full_name, company_name').eq('id', data.supplier_id).single(),
        supabase.from('contract_milestones').select('*').eq('contract_id', id).order('due_date'),
      ]);

      if (tenderRes.data) setTenderTitle(tenderRes.data.title);
      if (buyerRes.data) setBuyerProfile(buyerRes.data);
      if (supplierRes.data) setSupplierProfile(supplierRes.data);
      if (milestonesRes.data) setMilestones(milestonesRes.data as MilestoneData[]);
    } catch (error) {
      console.error('Error fetching contract:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load contract' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!contract || !user) return;
    try {
      await contractService.updateContractStatus(contract.id, newStatus, user.id);
      toast({ title: 'Updated', description: `Contract status updated to ${newStatus}` });
      fetchContract();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const handleMilestoneComplete = async (milestoneId: string) => {
    if (!contract) return;
    try {
      await contractService.updateMilestone(contract.id, milestoneId, 'completed');
      toast({ title: 'Milestone Completed', description: 'Milestone marked as completed' });
      fetchContract();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      draft: 'bg-muted text-muted-foreground',
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return map[status] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading contract...</span>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Contract Not Found</h1>
        <Button asChild><Link to="/contracts">Back to Contracts</Link></Button>
      </div>
    );
  }

  const isBuyer = user?.id === contract.buyer_id;
  const isSupplier = user?.id === contract.supplier_id;
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const milestoneProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Contract #{contract.id.slice(0, 8)} | ProcureChain</title>
        <meta name="description" content={`Contract details for tender: ${tenderTitle}`} />
      </Helmet>

      <Button variant="ghost" asChild className="mb-6">
        <Link to="/contracts"><ArrowLeft className="mr-2 h-4 w-4" />Back to Contracts</Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contract #{contract.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">For tender: {tenderTitle}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
          {contract.blockchain_hash && (
            <Badge variant="outline" className="text-green-600">
              <ShieldCheck className="h-3 w-3 mr-1" /> Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" /> Contract Value
            </div>
            <p className="text-xl font-bold">{formatCurrency(contract.contract_value, contract.contract_currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" /> Start Date
            </div>
            <p className="text-xl font-bold">{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'TBD'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" /> End Date
            </div>
            <p className="text-xl font-bold">{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'TBD'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" /> Progress
            </div>
            <p className="text-xl font-bold">{Math.round(milestoneProgress)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({totalMilestones})</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Contract Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Tender</h3>
                <Link to={`/tender/${contract.tender_id}`} className="text-primary hover:underline">{tenderTitle}</Link>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Created</h3>
                  <p>{new Date(contract.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Last Updated</h3>
                  <p>{new Date(contract.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
              {contract.terms_conditions && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-1">Terms & Conditions</h3>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-secondary/30 p-3 rounded">
                      {JSON.stringify(contract.terms_conditions, null, 2)}
                    </pre>
                  </div>
                </>
              )}
              {contract.blockchain_hash && (
                <>
                  <Separator />
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-400">Blockchain Record</h4>
                        <p className="text-xs text-blue-700 dark:text-blue-400 font-mono break-all">{contract.blockchain_hash}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Contract Milestones</CardTitle>
              <CardDescription>
                {completedMilestones} of {totalMilestones} milestones completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalMilestones > 0 && (
                <Progress value={milestoneProgress} className="h-2 mb-6" />
              )}
              {milestones.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No milestones defined for this contract yet.</p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((m) => (
                    <div key={m.id} className={`p-4 rounded-lg border ${m.status === 'completed' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : 'border-border'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {m.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : m.status === 'overdue' ? (
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <h4 className="font-medium">{m.milestone_name}</h4>
                        </div>
                        <Badge variant="outline" className="capitalize">{m.status}</Badge>
                      </div>
                      {m.description && <p className="text-sm text-muted-foreground mb-2">{m.description}</p>}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due: {new Date(m.due_date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          {m.payment_percentage && (
                            <Badge variant="outline">{m.payment_percentage}% payment</Badge>
                          )}
                          {m.status !== 'completed' && (isBuyer || isSupplier) && (
                            <Button size="sm" variant="outline" onClick={() => handleMilestoneComplete(m.id)}>
                              <Check className="h-3 w-3 mr-1" /> Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Buyer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{buyerProfile?.company_name || buyerProfile?.full_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">ID: {contract.buyer_id.slice(0, 8)}...</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Supplier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{supplierProfile?.company_name || supplierProfile?.full_name || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground">ID: {contract.supplier_id.slice(0, 8)}...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Contract Actions</CardTitle>
              <CardDescription>Manage contract status and lifecycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contract.status === 'draft' && isBuyer && (
                <Button onClick={() => handleStatusUpdate('active')} className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" /> Activate Contract
                </Button>
              )}
              {contract.status === 'active' && isBuyer && (
                <Button onClick={() => handleStatusUpdate('completed')} className="w-full" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
                </Button>
              )}
              <Button variant="outline" className="w-full" asChild>
                <Link to="/contract-performance">
                  <TrendingUp className="h-4 w-4 mr-2" /> View Performance Dashboard
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/tender/${contract.tender_id}`}>
                  <FileText className="h-4 w-4 mr-2" /> View Original Tender
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractDetail;

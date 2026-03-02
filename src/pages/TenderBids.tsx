import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { contractService } from '@/services/ContractService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft, Loader2, Award, FileText, DollarSign, User,
  CheckCircle, Clock, AlertTriangle, Star, TrendingUp, Shield
} from 'lucide-react';

interface BidWithDetails {
  id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  supplier_id: string;
  technical_details: Record<string, any> | null;
  documents: any;
  blockchain_hash: string | null;
  supplier?: {
    full_name: string | null;
    company_name: string | null;
    verification_level: string | null;
    performance_score: number | null;
    kyc_status: string | null;
  };
  evaluations?: {
    id: string;
    score: number;
    evaluation_type: string;
    recommendation: string | null;
    comments: string | null;
    evaluator_id: string;
  }[];
  avg_score?: number;
}

interface TenderInfo {
  id: string;
  title: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  status: string;
  submission_deadline: string;
  buyer_id: string;
  procurement_method: string;
}

const TenderBids = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tender, setTender] = useState<TenderInfo | null>(null);
  const [bids, setBids] = useState<BidWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<BidWithDetails | null>(null);
  const [awarding, setAwarding] = useState(false);
  const [contractDetails, setContractDetails] = useState({
    start_date: '',
    end_date: '',
    remarks: ''
  });

  useEffect(() => {
    if (id && user) fetchData();
  }, [id, user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch tender
      const { data: tenderData, error: tenderError } = await supabase
        .from('tenders')
        .select('id, title, category, budget_amount, budget_currency, status, submission_deadline, buyer_id, procurement_method')
        .eq('id', id)
        .single();

      if (tenderError) throw tenderError;

      // Verify ownership
      if (tenderData.buyer_id !== user?.id) {
        toast({ title: 'Access Denied', description: 'You can only manage bids on your own tenders.', variant: 'destructive' });
        navigate('/buyer-dashboard');
        return;
      }

      setTender(tenderData);

      // Fetch bids with evaluations
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          id, bid_amount, status, created_at, supplier_id, technical_details, documents, blockchain_hash
        `)
        .eq('tender_id', id)
        .order('created_at', { ascending: false });

      if (bidsError) throw bidsError;

      // Enrich bids with supplier profiles and evaluations
      const enrichedBids = await Promise.all(
        (bidsData || []).map(async (bid) => {
          // Supplier profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, company_name, verification_level, performance_score, kyc_status')
            .eq('id', bid.supplier_id)
            .single();

          // Evaluations for this bid
          const { data: evals } = await supabase
            .from('evaluations')
            .select('id, score, evaluation_type, recommendation, comments, evaluator_id')
            .eq('bid_id', bid.id);

          const avgScore = evals && evals.length > 0
            ? Math.round(evals.reduce((sum, e) => sum + e.score, 0) / evals.length)
            : 0;

          return {
            ...bid,
            supplier: profile || { full_name: 'Unknown', company_name: 'Unknown', verification_level: null, performance_score: null, kyc_status: null },
            evaluations: evals || [],
            avg_score: avgScore,
          } as BidWithDetails;
        })
      );

      // Sort by average score descending
      enrichedBids.sort((a, b) => (b.avg_score || 0) - (a.avg_score || 0));
      setBids(enrichedBids);
    } catch (error: any) {
      console.error('Error loading tender bids:', error);
      toast({ title: 'Error', description: error.message || 'Failed to load bids', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleAwardContract = async () => {
    if (!selectedBid || !tender || !user) return;

    try {
      setAwarding(true);

      // Create contract
      await contractService.createContract({
        tender_id: tender.id,
        winning_bid_id: selectedBid.id,
        buyer_id: user.id,
        supplier_id: selectedBid.supplier_id,
        contract_value: selectedBid.bid_amount,
        contract_currency: tender.budget_currency || 'KES',
        start_date: contractDetails.start_date || undefined,
        end_date: contractDetails.end_date || undefined,
        terms_conditions: contractDetails.remarks ? { remarks: contractDetails.remarks } : undefined,
      });

      // Update tender status to awarded
      await supabase
        .from('tenders')
        .update({ status: 'awarded' })
        .eq('id', tender.id);

      // Update winning bid status
      await supabase
        .from('bids')
        .update({ status: 'awarded' })
        .eq('id', selectedBid.id);

      // Update other bids to rejected
      await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('tender_id', tender.id)
        .neq('id', selectedBid.id);

      toast({ title: 'Contract Awarded!', description: `Contract awarded to ${selectedBid.supplier?.company_name || selectedBid.supplier?.full_name}` });
      setAwardDialogOpen(false);
      navigate('/contracts');
    } catch (error: any) {
      console.error('Award error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to award contract', variant: 'destructive' });
    } finally {
      setAwarding(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { className: string; label: string }> = {
      submitted: { className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Submitted' },
      under_evaluation: { className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: 'Under Evaluation' },
      awarded: { className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Awarded' },
      rejected: { className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
    };
    const s = map[status] || { className: 'bg-muted text-muted-foreground', label: status };
    return <Badge className={s.className}>{s.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading bids...</span>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tender Not Found</h1>
        <Button asChild><Link to="/buyer-dashboard">Back to Dashboard</Link></Button>
      </div>
    );
  }

  const isAwarded = tender.status === 'awarded';

  return (
    <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
      <Helmet>
        <title>Bids for {tender.title} | ProcureChain</title>
        <meta name="description" content={`View and manage bids for tender: ${tender.title}`} />
      </Helmet>

      <Button variant="ghost" asChild className="mb-6">
        <Link to="/buyer-dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Tender Summary */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-xl">{tender.title}</CardTitle>
              <CardDescription>{tender.category} • {tender.procurement_method?.replace(/_/g, ' ')}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">{tender.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Budget</span>
              <p className="font-semibold">{formatCurrency(tender.budget_amount, tender.budget_currency)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline</span>
              <p className="font-semibold">{new Date(tender.submission_deadline).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total Bids</span>
              <p className="font-semibold">{bids.length}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Evaluated</span>
              <p className="font-semibold">{bids.filter(b => b.evaluations && b.evaluations.length > 0).length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isAwarded && (
        <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/10 dark:border-green-800">
          <CardContent className="py-4 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 dark:text-green-400 font-medium">This tender has been awarded. View the contract in <Link to="/contracts" className="underline">Contract Management</Link>.</p>
          </CardContent>
        </Card>
      )}

      {/* Bids List */}
      <h2 className="text-lg font-semibold mb-4">Bids ({bids.length})</h2>
      {bids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bids have been submitted for this tender yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bids.map((bid, index) => (
            <Card key={bid.id} className={`${index === 0 && !isAwarded ? 'ring-2 ring-primary/30' : ''} ${bid.status === 'awarded' ? 'ring-2 ring-green-500/50' : ''}`}>
              <CardContent className="py-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bid.supplier?.company_name || bid.supplier?.full_name || 'Unknown Supplier'}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {bid.supplier?.kyc_status === 'verified' && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Shield className="h-3 w-3" /> Verified
                            </span>
                          )}
                          {bid.supplier?.performance_score != null && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3" /> Score: {bid.supplier.performance_score}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground text-xs">Bid Amount</span>
                        <p className="font-semibold">{formatCurrency(bid.bid_amount, tender.budget_currency)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Avg. Eval Score</span>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{bid.avg_score || 'N/A'}{bid.avg_score ? '/100' : ''}</p>
                          {bid.avg_score != null && bid.avg_score > 0 && (
                            <Progress value={bid.avg_score} className="h-1.5 w-16" />
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Evaluations</span>
                        <p className="font-semibold">{bid.evaluations?.length || 0}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">Submitted</span>
                        <p className="font-semibold">{new Date(bid.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Evaluation breakdown */}
                    {bid.evaluations && bid.evaluations.length > 0 && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Evaluation Breakdown:</p>
                        <div className="flex flex-wrap gap-2">
                          {bid.evaluations.map((ev) => (
                            <Badge key={ev.id} variant="outline" className="text-xs">
                              {ev.evaluation_type.replace('evaluator_', '').replace('_', ' ')}: {ev.score}/100
                              {ev.recommendation && ` • ${ev.recommendation}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(bid.status)}
                    {!isAwarded && bid.status !== 'rejected' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBid(bid);
                          setAwardDialogOpen(true);
                        }}
                      >
                        <Award className="h-4 w-4 mr-1" />
                        Award Contract
                      </Button>
                    )}
                    {bid.blockchain_hash && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Blockchain verified
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Award Contract Dialog */}
      <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Award Contract
            </DialogTitle>
            <DialogDescription>
              You are about to award this contract to <strong>{selectedBid?.supplier?.company_name || selectedBid?.supplier?.full_name}</strong> for{' '}
              <strong>{selectedBid ? formatCurrency(selectedBid.bid_amount, tender?.budget_currency) : ''}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Contract Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={contractDetails.start_date}
                  onChange={(e) => setContractDetails(p => ({ ...p, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end_date">Contract End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={contractDetails.end_date}
                  onChange={(e) => setContractDetails(p => ({ ...p, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="remarks">Remarks / Terms</Label>
              <Textarea
                id="remarks"
                placeholder="Any additional contract terms or remarks..."
                value={contractDetails.remarks}
                onChange={(e) => setContractDetails(p => ({ ...p, remarks: e.target.value }))}
              />
            </div>

            <Separator />

            <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded text-sm text-amber-800 dark:text-amber-400 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>This action will create a contract, update the tender status to "Awarded", and notify both parties. This cannot be undone.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAwardDialogOpen(false)} disabled={awarding}>
              Cancel
            </Button>
            <Button onClick={handleAwardContract} disabled={awarding}>
              {awarding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Award className="h-4 w-4 mr-2" />}
              Confirm Award
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenderBids;

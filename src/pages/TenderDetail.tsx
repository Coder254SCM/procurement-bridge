import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, AlertTriangle, Share2, Download, FileText, Users, ShieldCheck, Loader2, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import BlockchainVerificationDetails from '@/components/verification/BlockchainVerificationDetails';
import TenderTimeline from '@/components/tenders/TenderTimeline';

interface TenderData {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  submission_deadline: string;
  status: string;
  buyer_id: string;
  procurement_method: string;
  blockchain_hash: string | null;
  created_at: string;
  required_documents: string[] | null;
  evaluation_criteria: Record<string, any> | null;
}

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tender, setTender] = useState<TenderData | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<{ full_name: string | null; company_name: string | null } | null>(null);
  const [bidsCount, setBidsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const isBuyer = user && tender && user.id === tender.buyer_id;

  useEffect(() => {
    if (id) fetchTender();
  }, [id]);

  const fetchTender = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('id, title, description, category, budget_amount, budget_currency, submission_deadline, status, buyer_id, procurement_method, blockchain_hash, created_at, required_documents, evaluation_criteria')
        .eq('id', id)
        .single();

      if (error) throw error;

      setTender({
        ...data,
        evaluation_criteria: data.evaluation_criteria as Record<string, any> | null,
      });

      // Fetch buyer profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, company_name')
        .eq('id', data.buyer_id)
        .single();
      setBuyerProfile(profile);

      // Fetch bids count
      const { count } = await supabase
        .from('bids')
        .select('*', { count: 'exact', head: true })
        .eq('tender_id', id);
      setBidsCount(count || 0);
    } catch (error) {
      console.error('Error fetching tender:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load tender details' });
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    setInviteLink(`${baseUrl}/tender/${id}?ref=invitation`);
    setInviteDialog(true);
  };

  const shareOnPlatform = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(tender?.title || 'Tender Opportunity');
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title}%20${url}`,
    };
    if (urls[platform]) window.open(urls[platform], '_blank');
    toast({ title: 'Link shared', description: `Sharing tender on ${platform}` });
  };

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tender...</span>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container py-6 px-4 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-6">Tender Not Found</h1>
        <p className="text-muted-foreground mb-6">The tender you're looking for doesn't exist or has been removed.</p>
        <Button asChild><Link to="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  const deadline = new Date(tender.submission_deadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const formatCurrency = (amount: number, currency: string = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      published: 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400',
      evaluation: 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400',
      awarded: 'bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-400',
      closed: 'bg-muted text-muted-foreground',
      draft: 'bg-muted text-muted-foreground',
    };
    return map[status] || 'bg-muted text-muted-foreground';
  };

  const progressValue = tender.status === 'published' ? 25 : tender.status === 'evaluation' ? 50 : tender.status === 'awarded' ? 75 : tender.status === 'closed' ? 100 : 10;

  return (
    <div className="container py-6 px-4 md:px-6">
      <Button variant="ghost" asChild className="mb-6">
        <Link to="/marketplace"><ArrowLeft className="mr-2 h-4 w-4" />Back to Marketplace</Link>
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tender.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline">{tender.category || 'General'}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{buyerProfile?.company_name || buyerProfile?.full_name || 'Organization'}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground capitalize">{tender.procurement_method?.replace(/_/g, ' ')}</span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Share2 className="h-4 w-4 mr-2" />Share</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => shareOnPlatform('twitter')}>Share on Twitter</DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnPlatform('linkedin')}>Share on LinkedIn</DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareOnPlatform('whatsapp')}>Share on WhatsApp</DropdownMenuItem>
              <DropdownMenuItem onClick={generateInviteLink}>Generate Invite Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isBuyer && bidsCount > 0 && (
            <Button onClick={() => navigate(`/tender/${tender.id}/bids`)}>
              <Award className="h-4 w-4 mr-2" />
              View Bids ({bidsCount})
            </Button>
          )}

          {!isBuyer && tender.status === 'published' && daysLeft > 0 && (
            <Button onClick={() => navigate(user ? `/tenders` : '/auth')}>Apply for Tender</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tender Details</CardTitle>
              <CardDescription>Reference: {tender.id.slice(0, 8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getStatusColor(tender.status)}>{tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}</Badge>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Published: {new Date(tender.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{tender.description || 'No description provided.'}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Budget</h3>
                  <p className="text-2xl font-bold">{formatCurrency(tender.budget_amount, tender.budget_currency)}</p>
                  <p className="text-sm text-muted-foreground">Maximum allocated budget</p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Deadline</h3>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {daysLeft > 0 ? (
                    <p className="text-sm text-green-600 dark:text-green-400">{daysLeft} days remaining</p>
                  ) : (
                    <p className="text-sm text-destructive">Submission closed</p>
                  )}
                </div>
              </div>

              {/* Evaluation Criteria */}
              {tender.evaluation_criteria && Object.keys(tender.evaluation_criteria).length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Evaluation Criteria</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(tender.evaluation_criteria).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-secondary/30 rounded text-sm">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{String(value)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>This tender is secured using Hyperledger Fabric blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockchainVerificationDetails hash={tender.blockchain_hash || 'pending'} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Tender Status</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{progressValue}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">{bidsCount}</p>
                    <p className="text-xs text-muted-foreground">Submissions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{daysLeft}</p>
                    <p className="text-xs text-muted-foreground">Days Left</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Issued By</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${buyerProfile?.company_name || 'Org'}`} />
                  <AvatarFallback>{(buyerProfile?.company_name || 'O').charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{buyerProfile?.company_name || buyerProfile?.full_name || 'Organization'}</p>
                  <p className="text-sm text-muted-foreground">Kenya</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified Organization</span>
              </div>
            </CardContent>
          </Card>

          {isBuyer && (
            <Card>
              <CardHeader>
                <CardTitle>Invite Suppliers</CardTitle>
                <CardDescription>Share this opportunity with qualified suppliers</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={generateInviteLink}>
                  <Users className="mr-2 h-4 w-4" />Invite Suppliers
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Tabs defaultValue="timeline" className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="timeline">Procurement Timeline</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="submission">Submission Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Procurement Process Timeline</CardTitle>
              <CardDescription>Track the progress of this tender</CardDescription>
            </CardHeader>
            <CardContent><TenderTimeline /></CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
              <CardDescription>Key eligibility criteria and required documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {tender.required_documents && tender.required_documents.length > 0 ? (
                <div>
                  <h3 className="font-medium mb-2">Required Documents</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {tender.required_documents.map((doc, i) => <li key={i}>{doc}</li>)}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">No specific document requirements listed.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>How to Submit Your Bid</CardTitle>
              <CardDescription>Follow these guidelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Register an account if you don't have one</li>
                <li>Click "Apply for Tender" at the top of this page</li>
                <li>Complete all required forms and upload requested documents</li>
                <li>Submit before the deadline: {deadline.toLocaleDateString()}</li>
              </ol>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-400">Blockchain Verification</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">All submissions are cryptographically timestamped using Hyperledger Fabric.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Suppliers</DialogTitle>
            <DialogDescription>Share this link with qualified suppliers.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-2 bg-secondary rounded-md"><code className="text-sm break-all">{inviteLink}</code></div>
            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => shareOnPlatform('twitter')} variant="outline">Twitter</Button>
              <Button onClick={() => shareOnPlatform('linkedin')} variant="outline">LinkedIn</Button>
              <Button onClick={() => shareOnPlatform('whatsapp')} variant="outline">WhatsApp</Button>
            </div>
            <Button className="w-full" onClick={() => {
              navigator.clipboard.writeText(inviteLink);
              toast({ title: 'Link copied', description: 'Copied to clipboard.' });
            }}>Copy to Clipboard</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenderDetail;

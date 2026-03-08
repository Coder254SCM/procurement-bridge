
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { reverseAuctionService } from '@/services/ReverseAuctionService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Gavel, Plus, Eye, Play, Square, Clock, CheckCircle, Activity, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

const AuctionManagement: React.FC = () => {
  const { user } = useAuth();
  const { isBuyer } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState<any[]>([]);
  const [tenders, setTenders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Create form state
  const [formData, setFormData] = useState({
    tender_id: '',
    auction_name: '',
    end_time: '',
    reserve_price: '',
    minimum_bid_decrement: '1000',
    bid_extension_time: '5',
  });

  useEffect(() => {
    fetchAuctions();
    if (isBuyer) fetchMyTenders();
  }, [isBuyer]);

  const fetchAuctions = async () => {
    const { data } = await reverseAuctionService.getAuctions(
      statusFilter !== 'all' ? { status: statusFilter } : undefined
    );
    if (data) setAuctions(data);
    setLoading(false);
  };

  const fetchMyTenders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('tenders')
      .select('id, title')
      .eq('buyer_id', user.id)
      .in('status', ['published', 'active'])
      .order('created_at', { ascending: false });
    if (data) setTenders(data);
  };

  const handleCreate = async () => {
    if (!formData.tender_id || !formData.auction_name || !formData.end_time) {
      toast({ variant: 'destructive', title: 'Missing fields', description: 'Fill all required fields.' });
      return;
    }
    setCreating(true);
    const { error } = await reverseAuctionService.createAuction({
      tender_id: formData.tender_id,
      auction_name: formData.auction_name,
      end_time: new Date(formData.end_time).toISOString(),
      reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : undefined,
      minimum_bid_decrement: parseFloat(formData.minimum_bid_decrement) || 1000,
      bid_extension_time: parseInt(formData.bid_extension_time) || 5,
      status: 'scheduled',
      settings: {},
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create auction.' });
    } else {
      toast({ title: 'Auction Created', description: 'Your auction has been scheduled.' });
      setCreateOpen(false);
      setFormData({ tender_id: '', auction_name: '', end_time: '', reserve_price: '', minimum_bid_decrement: '1000', bid_extension_time: '5' });
      fetchAuctions();
    }
    setCreating(false);
  };

  useEffect(() => { fetchAuctions(); }, [statusFilter]);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'scheduled': return <Clock className="h-4 w-4 text-yellow-600" />;
      default: return <Square className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Gavel className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Auction Management</h1>
            <p className="text-muted-foreground">Create, manage, and monitor procurement auctions</p>
          </div>
        </div>
        {isBuyer && (
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Create Auction</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Auction</DialogTitle>
                <DialogDescription>Set up a reverse auction for a tender</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Linked Tender *</Label>
                  <Select value={formData.tender_id} onValueChange={(v) => setFormData(p => ({...p, tender_id: v}))}>
                    <SelectTrigger><SelectValue placeholder="Select a tender" /></SelectTrigger>
                    <SelectContent>
                      {tenders.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Auction Name *</Label>
                  <Input value={formData.auction_name} onChange={(e) => setFormData(p => ({...p, auction_name: e.target.value}))} placeholder="e.g., Office Equipment Reverse Auction" />
                </div>
                <div>
                  <Label>End Time *</Label>
                  <Input type="datetime-local" value={formData.end_time} onChange={(e) => setFormData(p => ({...p, end_time: e.target.value}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reserve Price (KES)</Label>
                    <Input type="number" value={formData.reserve_price} onChange={(e) => setFormData(p => ({...p, reserve_price: e.target.value}))} placeholder="Optional" />
                  </div>
                  <div>
                    <Label>Min Bid Decrement (KES)</Label>
                    <Input type="number" value={formData.minimum_bid_decrement} onChange={(e) => setFormData(p => ({...p, minimum_bid_decrement: e.target.value}))} />
                  </div>
                </div>
                <div>
                  <Label>Bid Extension Time (minutes)</Label>
                  <Input type="number" value={formData.bid_extension_time} onChange={(e) => setFormData(p => ({...p, bid_extension_time: e.target.value}))} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating...' : 'Create Auction'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filter Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Auctions Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-10">
              <Gavel className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-muted-foreground">No auctions found</p>
              {isBuyer && <p className="text-sm text-muted-foreground mt-1">Create your first auction to get started</p>}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Auction</TableHead>
                  <TableHead>Tender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Lowest Bid</TableHead>
                  <TableHead>Bids</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auctions.map((auction: any) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-medium">{auction.auction_name}</TableCell>
                    <TableCell className="text-muted-foreground">{auction.tenders?.title || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={auction.status === 'active' ? 'default' : 'outline'} className="gap-1">
                        {statusIcon(auction.status)} {auction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {auction.current_lowest_bid ? `KES ${auction.current_lowest_bid.toLocaleString()}` : '—'}
                    </TableCell>
                    <TableCell>{auction.total_bids || 0}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {auction.end_time ? format(new Date(auction.end_time), 'PPp') : '—'}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/auction/${auction.id}`)}>
                        <Eye className="h-4 w-4 mr-1" /> Enter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionManagement;

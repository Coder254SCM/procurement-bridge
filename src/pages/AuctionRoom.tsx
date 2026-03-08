
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { reverseAuctionService, ReverseAuction, AuctionBid } from '@/services/ReverseAuctionService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Gavel, Timer, TrendingDown, Users, DollarSign, ArrowDown, 
  Shield, Clock, AlertTriangle, CheckCircle, Activity, Award
} from 'lucide-react';
import { format, differenceInSeconds, addMinutes } from 'date-fns';

const AuctionRoom: React.FC = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { user } = useAuth();
  const { isBuyer, isSupplier } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [myBids, setMyBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const fetchAuction = useCallback(async () => {
    if (!auctionId) return;
    const { data, error } = await reverseAuctionService.getAuctionDetails(auctionId);
    if (!error && data) {
      setAuction(data);
      setBids(data.auction_bids || []);
    }
    setLoading(false);
  }, [auctionId]);

  const fetchMyBids = useCallback(async () => {
    if (!auctionId || !user) return;
    const { data } = await reverseAuctionService.getBidderBids(auctionId, user.id);
    if (data) setMyBids(data);
  }, [auctionId, user]);

  useEffect(() => {
    fetchAuction();
    if (user) fetchMyBids();
  }, [fetchAuction, fetchMyBids, user]);

  // Real-time subscription
  useEffect(() => {
    if (!auctionId) return;
    const channel = supabase
      .channel(`auction_live_${auctionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'auction_bids',
        filter: `auction_id=eq.${auctionId}`
      }, () => {
        fetchAuction();
        if (user) fetchMyBids();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [auctionId, fetchAuction, fetchMyBids, user]);

  // Countdown timer
  useEffect(() => {
    if (!auction?.end_time || auction?.status !== 'active') return;
    const interval = setInterval(() => {
      const remaining = differenceInSeconds(new Date(auction.end_time), new Date());
      setTimeLeft(Math.max(0, remaining));
      if (remaining <= 0) {
        clearInterval(interval);
        fetchAuction();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [auction, fetchAuction]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = async () => {
    if (!user || !auctionId || !bidAmount) return;
    const amount = parseFloat(bidAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid bid', description: 'Enter a valid positive amount.' });
      return;
    }

    if (auction?.current_lowest_bid && amount >= auction.current_lowest_bid) {
      toast({ variant: 'destructive', title: 'Bid too high', description: `Bid must be lower than current lowest: KES ${auction.current_lowest_bid.toLocaleString()}` });
      return;
    }

    if (auction?.minimum_bid_decrement && auction.current_lowest_bid) {
      const minBid = auction.current_lowest_bid - auction.minimum_bid_decrement;
      if (amount > minBid) {
        toast({ variant: 'destructive', title: 'Minimum decrement not met', description: `Bid must be ≤ KES ${minBid.toLocaleString()} (min decrement: ${auction.minimum_bid_decrement})` });
        return;
      }
    }

    setPlacing(true);
    const { error } = await reverseAuctionService.placeBid(auctionId, user.id, amount);
    if (error) {
      toast({ variant: 'destructive', title: 'Bid failed', description: typeof error === 'string' ? error : 'Failed to place bid' });
    } else {
      toast({ title: 'Bid placed!', description: `Your bid of KES ${amount.toLocaleString()} has been submitted.` });
      setBidAmount('');
      fetchAuction();
      fetchMyBids();
    }
    setPlacing(false);
  };

  const handleStartAuction = async () => {
    if (!auctionId) return;
    const { error } = await reverseAuctionService.startAuction(auctionId);
    if (!error) {
      toast({ title: 'Auction Started', description: 'The auction is now live!' });
      fetchAuction();
    }
  };

  const handleEndAuction = async () => {
    if (!auctionId) return;
    const { error } = await reverseAuctionService.endAuction(auctionId);
    if (!error) {
      toast({ title: 'Auction Ended', description: 'The auction has been completed.' });
      fetchAuction();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold text-foreground">Auction Not Found</h1>
        <Button onClick={() => navigate('/auctions')} className="mt-4">Back to Auctions</Button>
      </div>
    );
  }

  const isActive = auction.status === 'active';
  const isScheduled = auction.status === 'scheduled';
  const isCompleted = auction.status === 'completed';
  const savings = auction.reserve_price && auction.current_lowest_bid 
    ? ((auction.reserve_price - auction.current_lowest_bid) / auction.reserve_price * 100).toFixed(1)
    : null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Gavel className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{auction.auction_name || 'Auction Room'}</h1>
              <p className="text-muted-foreground">
                {auction.tenders?.title || 'Procurement Auction'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'} className="text-sm px-3 py-1">
            {isActive && <Activity className="h-3 w-3 mr-1 animate-pulse" />}
            {auction.status?.toUpperCase()}
          </Badge>
          {isBuyer && isScheduled && (
            <Button onClick={handleStartAuction} className="bg-green-600 hover:bg-green-700">
              Start Auction
            </Button>
          )}
          {isBuyer && isActive && (
            <Button variant="destructive" onClick={handleEndAuction}>
              End Auction
            </Button>
          )}
        </div>
      </div>

      {/* Live Timer + Stats */}
      {isActive && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Timer className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Time Remaining</span>
                </div>
                <p className={`text-3xl font-mono font-bold ${timeLeft < 300 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-muted-foreground">Current Lowest</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  KES {auction.current_lowest_bid?.toLocaleString() || '—'}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Total Bids</span>
                </div>
                <p className="text-3xl font-bold text-foreground">{auction.total_bids || 0}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm text-muted-foreground">Reserve Price</span>
                </div>
                <p className="text-3xl font-bold text-muted-foreground">
                  KES {auction.reserve_price?.toLocaleString() || '—'}
                </p>
              </div>
            </div>
            {savings && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <ArrowDown className="h-3 w-3 mr-1" /> {savings}% savings from reserve price
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Completed Summary */}
      {isCompleted && (
        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
              <div>
                <h3 className="text-lg font-bold text-foreground">Auction Completed</h3>
                <p className="text-muted-foreground">
                  Winning bid: <span className="font-bold text-green-600">KES {auction.current_lowest_bid?.toLocaleString()}</span>
                  {' · '}{auction.total_bids} total bids
                  {savings && ` · ${savings}% savings`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bid Placement (Suppliers) */}
        {isSupplier && isActive && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                Place Your Bid
              </CardTitle>
              <CardDescription>
                Enter an amount lower than the current lowest bid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bid Amount (KES)</label>
                <Input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={auction.current_lowest_bid 
                    ? `Max: ${(auction.current_lowest_bid - (auction.minimum_bid_decrement || 1)).toLocaleString()}`
                    : 'Enter your bid'
                  }
                  min="0"
                  step="0.01"
                />
              </div>
              
              {auction.minimum_bid_decrement > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  Min decrement: KES {auction.minimum_bid_decrement.toLocaleString()}
                </div>
              )}

              <Button 
                onClick={handlePlaceBid} 
                disabled={placing || !bidAmount}
                className="w-full"
                size="lg"
              >
                {placing ? 'Placing Bid...' : 'Submit Bid'}
              </Button>

              <Separator />

              <div>
                <h4 className="font-medium text-foreground mb-2">Your Bid History</h4>
                {myBids.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No bids placed yet</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {myBids.map((bid: any) => (
                      <div key={bid.id} className="flex justify-between items-center text-sm p-2 rounded bg-muted/50">
                        <span className="font-medium">KES {bid.bid_amount?.toLocaleString()}</span>
                        <span className="text-muted-foreground">
                          {bid.bid_time ? format(new Date(bid.bid_time), 'HH:mm:ss') : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bid History Table */}
        <Card className={isSupplier && isActive ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Bid Feed
            </CardTitle>
            <CardDescription>
              {isBuyer ? 'All bids are visible to you as the buyer' : 'Bid rankings are anonymized during the auction'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bids.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Gavel className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>No bids have been placed yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    {isBuyer && <TableHead>Bidder</TableHead>}
                    <TableHead>Bid Amount</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...bids]
                    .sort((a, b) => a.bid_amount - b.bid_amount)
                    .map((bid: any, index: number) => (
                    <TableRow key={bid.id} className={index === 0 ? 'bg-green-50 dark:bg-green-950/20' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          <span className="font-medium">#{index + 1}</span>
                        </div>
                      </TableCell>
                      {isBuyer && (
                        <TableCell className="text-muted-foreground">
                          {bid.profiles?.full_name || `Bidder ${bid.bidder_id?.substring(0, 8)}`}
                        </TableCell>
                      )}
                      <TableCell className="font-bold">KES {bid.bid_amount?.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {bid.bid_time ? format(new Date(bid.bid_time), 'HH:mm:ss') : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={bid.is_automatic ? 'secondary' : 'outline'} className="text-xs">
                          {bid.is_automatic ? 'Auto' : 'Manual'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Auction Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Auction Rules & Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Timing</h4>
              <p className="text-sm text-muted-foreground">
                Start: {auction.start_time ? format(new Date(auction.start_time), 'PPp') : 'Not started'}
              </p>
              <p className="text-sm text-muted-foreground">
                End: {auction.end_time ? format(new Date(auction.end_time), 'PPp') : 'TBD'}
              </p>
              <p className="text-sm text-muted-foreground">
                Extension: {auction.bid_extension_time || 0} minutes on new bid
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Bidding Rules</h4>
              <p className="text-sm text-muted-foreground">
                Min decrement: KES {auction.minimum_bid_decrement?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-muted-foreground">
                Reserve price: {auction.reserve_price ? `KES ${auction.reserve_price.toLocaleString()}` : 'Not set'}
              </p>
              <p className="text-sm text-muted-foreground">
                Type: Reverse Auction (lowest bid wins)
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Blockchain Verification</h4>
              <p className="text-sm text-muted-foreground">
                All bids are recorded on the blockchain for immutable audit trails.
              </p>
              <Badge variant="outline" className="mt-1">
                <Shield className="h-3 w-3 mr-1" /> Tamper-proof
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuctionRoom;

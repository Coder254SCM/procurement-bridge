import { supabase } from '@/integrations/supabase/client';

export interface ReverseAuction {
  id: string;
  tender_id: string;
  auction_name: string;
  start_time: string;
  end_time: string;
  reserve_price?: number;
  minimum_bid_decrement: number;
  bid_extension_time: number;
  current_lowest_bid?: number;
  current_leader_id?: string;
  total_bids: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
  tenders?: {
    title: string;
    buyer_id: string;
    profiles?: { full_name: string };
  };
}

export interface AuctionBid {
  id: string;
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  bid_time: string;
  is_automatic: boolean;
  rank_at_time?: number;
  created_at: string;
  profiles?: { full_name: string };
}

export class ReverseAuctionService {
  private static instance: ReverseAuctionService;

  public static getInstance(): ReverseAuctionService {
    if (!ReverseAuctionService.instance) {
      ReverseAuctionService.instance = new ReverseAuctionService();
    }
    return ReverseAuctionService.instance;
  }

  async createAuction(auctionData: Partial<ReverseAuction>) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'create_auction',
        data: auctionData
      }
    });

    return { data, error };
  }

  async getAuctions(filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'list_auctions',
        data: filters
      }
    });

    return { data, error };
  }

  async getAuctionDetails(auctionId: string) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'get_auction_details',
        data: { auction_id: auctionId }
      }
    });

    return { data, error };
  }

  async startAuction(auctionId: string) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'start_auction',
        data: { auction_id: auctionId }
      }
    });

    return { data, error };
  }

  async placeBid(auctionId: string, bidderId: string, bidAmount: number) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'place_bid',
        data: {
          auction_id: auctionId,
          bidder_id: bidderId,
          bid_amount: bidAmount
        }
      }
    });

    return { data, error };
  }

  async getBidderBids(auctionId: string, bidderId: string) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'get_bidder_bids',
        data: {
          auction_id: auctionId,
          bidder_id: bidderId
        }
      }
    });

    return { data, error };
  }

  async endAuction(auctionId: string) {
    const { data, error } = await supabase.functions.invoke('reverse-auction', {
      body: {
        action: 'end_auction',
        data: { auction_id: auctionId }
      }
    });

    return { data, error };
  }

  async subscribeToAuctionUpdates(auctionId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`auction_${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auction_bids',
          filter: `auction_id=eq.${auctionId}`
        },
        callback
      )
      .subscribe();
  }
}

export const reverseAuctionService = ReverseAuctionService.getInstance();
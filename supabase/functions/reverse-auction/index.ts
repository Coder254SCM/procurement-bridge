import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()

    switch (action) {
      case 'create_auction':
        const { data: auction, error: auctionError } = await supabase
          .from('reverse_auctions')
          .insert(data)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: auction, error: auctionError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'list_auctions':
        const { status, limit = 50, offset = 0 } = data || {}
        let query = supabase
          .from('reverse_auctions')
          .select(`
            *,
            tenders(title, buyer_id, profiles!buyer_id(full_name))
          `)
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (status) {
          query = query.eq('status', status)
        }

        const { data: auctions, error: listError } = await query
        
        return new Response(JSON.stringify({ data: auctions, error: listError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'start_auction':
        const { auction_id } = data
        const { data: updatedAuction, error: startError } = await supabase
          .from('reverse_auctions')
          .update({ 
            status: 'active',
            start_time: new Date().toISOString()
          })
          .eq('id', auction_id)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updatedAuction, error: startError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'place_bid':
        const { auction_id: bidAuctionId, bidder_id, bid_amount } = data
        
        // Check if auction is active
        const { data: auctionData, error: checkError } = await supabase
          .from('reverse_auctions')
          .select('*')
          .eq('id', bidAuctionId)
          .single()

        if (checkError || auctionData.status !== 'active') {
          return new Response(JSON.stringify({ error: 'Auction not active' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Check if bid is lower than current lowest
        if (auctionData.current_lowest_bid && bid_amount >= auctionData.current_lowest_bid) {
          return new Response(JSON.stringify({ error: 'Bid must be lower than current lowest bid' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        // Place the bid
        const { data: bid, error: bidError } = await supabase
          .from('auction_bids')
          .insert({
            auction_id: bidAuctionId,
            bidder_id,
            bid_amount,
            rank_at_time: 1 // Will be updated by trigger
          })
          .select()
          .single()

        // Update auction with new lowest bid
        const { error: updateAuctionError } = await supabase
          .from('reverse_auctions')
          .update({
            current_lowest_bid: bid_amount,
            current_leader_id: bidder_id,
            total_bids: auctionData.total_bids + 1
          })
          .eq('id', bidAuctionId)

        return new Response(JSON.stringify({ 
          data: bid, 
          error: bidError || updateAuctionError 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_auction_details':
        const { auction_id: detailAuctionId } = data
        const { data: auctionDetails, error: detailError } = await supabase
          .from('reverse_auctions')
          .select(`
            *,
            tenders(title, description, budget_amount, profiles!buyer_id(full_name)),
            auction_bids(
              id, bid_amount, bid_time, rank_at_time,
              profiles!bidder_id(full_name)
            )
          `)
          .eq('id', detailAuctionId)
          .single()
        
        return new Response(JSON.stringify({ data: auctionDetails, error: detailError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'get_bidder_bids':
        const { auction_id: bidderAuctionId, bidder_id: bidderId } = data
        const { data: bidderBids, error: bidderError } = await supabase
          .from('auction_bids')
          .select('*')
          .eq('auction_id', bidderAuctionId)
          .eq('bidder_id', bidderId)
          .order('bid_time', { ascending: false })
        
        return new Response(JSON.stringify({ data: bidderBids, error: bidderError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'end_auction':
        const { auction_id: endAuctionId } = data
        const { data: endedAuction, error: endError } = await supabase
          .from('reverse_auctions')
          .update({ 
            status: 'completed',
            end_time: new Date().toISOString()
          })
          .eq('id', endAuctionId)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: endedAuction, error: endError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Reverse auction error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
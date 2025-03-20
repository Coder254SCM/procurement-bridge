
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bid } from '@/types/database.types';
import { ProcurementMethod } from '@/types/enums';

interface BidDataResult {
  loading: boolean;
  bid: Bid | null;
  fetchBidData: (bidId: string, userId: string) => Promise<void>;
}

export function useBidData(): BidDataResult {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [bid, setBid] = useState<Bid | null>(null);

  const fetchBidData = async (bidId: string, userId: string) => {
    try {
      setLoading(true);
      
      // Get the bid data first
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('id', bidId)
        .single();
        
      if (bidError) throw bidError;

      // Define the completed bid object we'll build
      let completeBid: Bid = {
        ...bidData,
        tender: {
          title: 'Untitled Tender',
          description: '',
          category: 'General',
          budget_amount: 0,
          budget_currency: 'KES',
          procurement_method: null
        },
        supplier: {
          full_name: 'Unknown',
          company_name: 'Unknown Company'
        }
      };

      // Separate query to get tender details
      try {
        const { data: tenderData, error: tenderError } = await supabase
          .from('tenders')
          .select('title, description, category, budget_amount, budget_currency, procurement_method')
          .eq('id', bidData.tender_id)
          .single();
          
        if (!tenderError && tenderData) {
          // Handle procurement method typing issue
          const procMethod = tenderData.procurement_method as ProcurementMethod | null;
          
          // Update tender details in the completeBid
          completeBid.tender = {
            title: tenderData.title || 'Untitled',
            description: tenderData.description || '',
            category: tenderData.category || 'General',
            budget_amount: tenderData.budget_amount || 0,
            budget_currency: tenderData.budget_currency || 'KES',
            procurement_method: procMethod || ProcurementMethod.OPEN_TENDER
          };
        }
      } catch (tenderError) {
        console.error('Error fetching tender data:', tenderError);
        // Continue with default tender values
      }

      // Separate query to get supplier profile
      try {
        const { data: supplierData, error: supplierError } = await supabase
          .from('profiles')
          .select('full_name, company_name')
          .eq('id', bidData.supplier_id)
          .single();
          
        if (!supplierError && supplierData) {
          completeBid.supplier = {
            full_name: supplierData.full_name || 'Unknown',
            company_name: supplierData.company_name || 'Unknown Company'
          };
        }
      } catch (supplierError) {
        console.error('Error fetching supplier data:', supplierError);
        // Continue with default supplier values
      }
      
      setBid(completeBid);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching bid data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bid data",
      });
      navigate('/evaluations');
    }
  };

  return {
    loading,
    bid,
    fetchBidData
  };
}

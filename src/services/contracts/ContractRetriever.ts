
import { supabase } from '@/integrations/supabase/client';
import { Contract } from '@/types/database.types';

export class ContractRetriever {
  static async getUserContracts(userId: string): Promise<Contract[]> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          tenders(title, category),
          bids(bid_amount)
        `)
        .or(`buyer_id.eq.${userId},supplier_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type conversion for JSONB fields
      return (data || []).map(contract => ({
        ...contract,
        terms_conditions: contract.terms_conditions as Record<string, any> | null,
        milestones: contract.milestones as Record<string, any> | null,
        documents: contract.documents as Record<string, any> | null
      }));
    } catch (error) {
      console.error('Get user contracts error:', error);
      throw error;
    }
  }
}

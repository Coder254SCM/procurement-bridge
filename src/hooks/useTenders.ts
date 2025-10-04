
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { TenderProps } from '@/components/tenders/TenderCard';

export function useTenders() {
  const { toast } = useToast();
  const [tenders, setTenders] = useState<TenderProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        
        // Fetch real tenders from Supabase
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: tendersData, error } = await supabase
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
            profiles!tenders_buyer_id_fkey(company_name)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform Supabase data to TenderProps format
        const formattedTenders: TenderProps[] = (tendersData || []).map(tender => {
          const deadline = new Date(tender.submission_deadline);
          const today = new Date();
          const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          return {
            id: tender.id,
            title: tender.title,
            organization: (tender.profiles as any)?.company_name || 'Government Entity',
            location: 'Kenya', // Can be added to database if needed
            category: tender.category,
            description: tender.description,
            deadline: deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            daysLeft: Math.max(0, daysLeft),
            submissions: 0, // Can be calculated from bids table
            value: `${tender.budget_currency} ${tender.budget_amount?.toLocaleString()}`,
            status: (daysLeft > 0 ? 'open' : 'evaluation') as 'open' | 'closed' | 'evaluation' | 'awarded'
          };
        });

        setTenders(formattedTenders);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenders:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load marketplace tenders",
        });
        setLoading(false);
      }
    };

    fetchTenders();
  }, [toast]);

  return { tenders, loading };
}

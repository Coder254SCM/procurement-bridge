
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BehaviorAnalysis } from '@/types/database.types';

interface UseBehaviorAnalysisProps {
  entityId?: string;
  entityType?: string;
}

export function useBehaviorAnalysis({ entityId, entityType }: UseBehaviorAnalysisProps = {}) {
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<BehaviorAnalysis[]>([]);
  const [analysisResults, setAnalysisResults] = useState<BehaviorAnalysis[]>([]); // Added to match component expectation
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchAnalysisResults = async (uid: string, entityType: string) => {
    if (!uid || !entityType) return;
      
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('behavior_analysis')
        .select('*')
        .eq('entity_id', uid)
        .eq('entity_type', entityType)
        .order('created_at', { ascending: false });
          
      if (error) throw error;
      
      if (data) {
        setAnalyses(data as BehaviorAnalysis[]);
        setAnalysisResults(data as BehaviorAnalysis[]);
        
        // Set the most recent risk score
        if (data.length > 0) {
          setRiskScore(data[0].risk_score);
        }
      }
        
    } catch (error) {
      console.error('Error fetching behavior analyses:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch risk analysis data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (entityId && entityType) {
      fetchAnalysisResults(entityId, entityType);
    }
  }, [entityId, entityType, toast]);

  return {
    loading,
    analyses,
    analysisResults,
    riskScore,
    fetchAnalysisResults
  };
}

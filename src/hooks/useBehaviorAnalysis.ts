
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BehaviorAnalysis } from '@/types/database.types';
import { BehaviorAnalysisType } from '@/types/enums';

export function useBehaviorAnalysis() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<BehaviorAnalysis[]>([]);

  const fetchAnalysisResults = async (entityId: string, entityType: 'tender' | 'bid' | 'user') => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('behavior_analysis')
        .select('*')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType);

      if (error) throw error;
      setAnalysisResults(data || []);
    } catch (error) {
      console.error('Error fetching behavior analysis:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load behavior analysis data",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async (
    entityId: string, 
    entityType: 'tender' | 'bid' | 'user',
    analysisType: BehaviorAnalysisType
  ) => {
    setLoading(true);
    try {
      // In a real application, this would perform complex analysis
      // For demonstration, we'll simulate analysis results
      const analysisResult = await simulateAnalysis(entityId, entityType, analysisType);
      
      // Store the analysis result
      const { error } = await supabase
        .from('behavior_analysis')
        .insert({
          entity_id: entityId,
          entity_type: entityType,
          analysis_type: analysisType,
          risk_score: analysisResult.riskScore,
          analysis_data: analysisResult.data
        });

      if (error) throw error;
      
      toast({
        title: "Analysis Complete",
        description: `${analysisType} analysis completed with risk score: ${analysisResult.riskScore}`,
      });
      
      // Refetch data to update state
      await fetchAnalysisResults(entityId, entityType);
      
    } catch (error) {
      console.error('Error running behavior analysis:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not complete behavior analysis",
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate analysis - in a real application, this would be complex analysis logic
  const simulateAnalysis = async (
    entityId: string, 
    entityType: 'tender' | 'bid' | 'user',
    analysisType: BehaviorAnalysisType
  ) => {
    // This is a simplified simulation for demonstration
    let data: any = {};
    let riskScore = 0;
    
    // Fetch entity data based on type
    if (entityType === 'bid') {
      const { data: bidData } = await supabase
        .from('bids')
        .select('*, tender:tender_id(*)')
        .eq('id', entityId)
        .single();
        
      if (bidData) {
        data = {
          bid_amount: bidData.bid_amount,
          submission_time: bidData.created_at,
          tender_budget: bidData.tender?.budget_amount
        };
        
        // Example analysis logic
        if (analysisType === BehaviorAnalysisType.PRICING_ANALYSIS) {
          const budgetAmount = bidData.tender?.budget_amount || 0;
          if (budgetAmount > 0) {
            const bidRatio = bidData.bid_amount / budgetAmount;
            
            // Assign risk based on bid amount compared to budget
            if (bidRatio < 0.5) {
              riskScore = 70; // Unusually low bid
              data.flags = ["Bid significantly below budget"];
            } else if (bidRatio > 0.95 && bidRatio < 1) {
              riskScore = 50; // Just below budget - possible insider knowledge
              data.flags = ["Bid suspiciously close to budget"];
            } else {
              riskScore = 10; // Normal bid
              data.flags = [];
            }
          }
        }
      }
    } else if (entityType === 'tender') {
      const { data: tenderData } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', entityId)
        .single();
        
      if (tenderData) {
        data = {
          title: tenderData.title,
          budget: tenderData.budget_amount,
          deadline: tenderData.submission_deadline
        };
        
        // Example analysis logic
        if (analysisType === BehaviorAnalysisType.TIMING_ANALYSIS) {
          const deadline = new Date(tenderData.submission_deadline);
          const created = new Date(tenderData.created_at);
          const timeWindow = deadline.getTime() - created.getTime();
          const daysOpen = timeWindow / (1000 * 60 * 60 * 24);
          
          // Assign risk based on how long the tender is open for bids
          if (daysOpen < 7) {
            riskScore = 80; // Very short window
            data.flags = ["Unusually short bidding window"];
          } else if (daysOpen < 14) {
            riskScore = 40; // Short but not extreme
            data.flags = ["Short bidding window"];
          } else {
            riskScore = 10; // Normal window
            data.flags = [];
          }
        }
      }
    }
    
    return { riskScore, data };
  };

  return {
    loading,
    analysisResults,
    fetchAnalysisResults,
    runAnalysis
  };
}

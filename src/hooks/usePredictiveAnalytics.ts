import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContributingFactor {
  factor: string;
  weight: number;
  value: string | number;
}

export interface PredictionResult {
  prediction_type: string;
  probability: number;
  risk_level: 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  contributing_factors: ContributingFactor[];
  recommendations: string[];
  model_version: string;
}

export interface PredictionsResponse {
  predictions: PredictionResult[];
  generated_at: string;
}

export type PredictionType = 
  | 'supplier_churn' 
  | 'buyer_churn' 
  | 'bid_success' 
  | 'payment_delay' 
  | 'contract_completion' 
  | 'fraud_risk' 
  | 'all';

export function usePredictiveAnalytics() {
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPredictions = useCallback(async (
    type: PredictionType = 'all',
    entityId?: string,
    entityType?: 'supplier' | 'buyer' | 'tender' | 'bid' | 'contract'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('predictive-analytics', {
        body: { type, entity_id: entityId, entity_type: entityType }
      });

      if (fnError) throw fnError;

      const response = data as PredictionsResponse;
      setPredictions(response.predictions);
      return response;

    } catch (err: any) {
      const message = err.message || 'Failed to fetch predictions';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: message
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPredictionByType = useCallback((type: string) => {
    return predictions.find(p => p.prediction_type === type);
  }, [predictions]);

  return {
    loading,
    predictions,
    error,
    fetchPredictions,
    getPredictionByType
  };
}

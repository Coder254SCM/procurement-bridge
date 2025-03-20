
import { useState, useEffect } from 'react';
import { useEvaluationSession } from '@/hooks/useEvaluationSession';
import { useBidData } from '@/hooks/useBidData';
import { useEvaluationForm } from '@/hooks/useEvaluationForm';
import { Bid, Evaluation, EvaluationCriteriaScores } from '@/types/database.types';

interface EvaluationData {
  loading: boolean;
  submitting: boolean;
  session: any;
  userRoles: string[];
  bid: Bid | null;
  existingEvaluation: Evaluation | null;
  score: number;
  comments: string;
  recommendation: string;
  criteriaScores: EvaluationCriteriaScores;
  justification: string;
  handleCriteriaScoreChange: (category: string, value: number) => void;
  handleSubmitEvaluation: () => Promise<void>;
  setScore: (value: number) => void;
  setComments: (value: string) => void;
  setRecommendation: (value: string) => void;
  setJustification: (value: string) => void;
}

export function useEvaluationData(bidId: string | undefined): EvaluationData {
  const [loading, setLoading] = useState(true);
  
  // Use the separated hooks
  const { 
    session, 
    userRoles, 
    loading: sessionLoading 
  } = useEvaluationSession();
  
  const { 
    bid, 
    fetchBidData, 
    loading: bidLoading 
  } = useBidData();
  
  const {
    submitting,
    existingEvaluation,
    score,
    comments,
    recommendation,
    criteriaScores,
    justification,
    fetchExistingEvaluation,
    setScore,
    setComments,
    setRecommendation,
    setJustification,
    handleCriteriaScoreChange,
    handleSubmitEvaluation: submitEvaluation
  } = useEvaluationForm();

  useEffect(() => {
    // When session is loaded and we have a bidId, fetch the data
    if (!sessionLoading && session && bidId) {
      const loadData = async () => {
        await fetchBidData(bidId, session.user.id);
        await fetchExistingEvaluation(bidId, session.user.id);
        setLoading(false);
      };
      
      loadData();
    }
  }, [sessionLoading, session, bidId]);

  // Wrapper for the submit function that provides the necessary arguments
  const handleSubmitEvaluation = async () => {
    if (bid && session) {
      await submitEvaluation(bid.id, session, userRoles);
    }
  };

  return {
    loading: loading || sessionLoading || bidLoading,
    submitting,
    session,
    userRoles,
    bid,
    existingEvaluation,
    score,
    comments,
    recommendation,
    criteriaScores,
    justification,
    setScore,
    setComments,
    setRecommendation,
    setJustification,
    handleCriteriaScoreChange,
    handleSubmitEvaluation
  };
}

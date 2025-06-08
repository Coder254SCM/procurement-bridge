
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Evaluation, EvaluationCriteriaScores } from '@/types/database.types';

interface EvaluationFormData {
  submitting: boolean;
  existingEvaluation: Evaluation | null;
  score: number;
  comments: string;
  recommendation: string;
  criteriaScores: EvaluationCriteriaScores;
  justification: string;
  fetchExistingEvaluation: (bidId: string, userId: string) => Promise<void>;
  setScore: (value: number) => void;
  setComments: (value: string) => void;
  setRecommendation: (value: string) => void;
  setJustification: (value: string) => void;
  handleCriteriaScoreChange: (category: string, value: number) => void;
  handleSubmitEvaluation: (
    bidId: string, 
    session: any, 
    userRoles: string[]
  ) => Promise<void>;
}

export function useEvaluationForm(): EvaluationFormData {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [existingEvaluation, setExistingEvaluation] = useState<Evaluation | null>(null);
  const [score, setScore] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [criteriaScores, setCriteriaScores] = useState<EvaluationCriteriaScores>({
    technical: 0,
    financial: 0,
    experience: 0,
    compliance: 0,
    delivery: 0
  });
  const [justification, setJustification] = useState('');

  const fetchExistingEvaluation = async (bidId: string, userId: string) => {
    try {
      // Check if user has already evaluated this bid
      const { data: evaluationData, error: evaluationError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('bid_id', bidId)
        .eq('evaluator_id', userId)
        .maybeSingle();
        
      if (evaluationError) throw evaluationError;
      
      if (evaluationData) {
        // Create a complete Evaluation object with all needed fields
        const typedEvaluation: Evaluation = {
          id: evaluationData.id,
          bid_id: evaluationData.bid_id,
          evaluator_id: evaluationData.evaluator_id,
          evaluation_type: evaluationData.evaluation_type,
          score: evaluationData.score,
          comments: evaluationData.comments || null,
          recommendation: evaluationData.recommendation || null,
          blockchain_hash: evaluationData.blockchain_hash || null,
          created_at: evaluationData.created_at,
          updated_at: evaluationData.updated_at,
          criteria_scores: evaluationData.criteria_scores ? evaluationData.criteria_scores as EvaluationCriteriaScores : {
            technical: 0,
            financial: 0,
            experience: 0,
            compliance: 0,
            delivery: 0
          },
          justification: evaluationData.justification || null
        };
        
        setExistingEvaluation(typedEvaluation);
        setScore(evaluationData.score || 0);
        setComments(evaluationData.comments || '');
        setRecommendation(evaluationData.recommendation || '');
        
        // Set criteria scores if available
        if (evaluationData.criteria_scores) {
          const convertedScores = evaluationData.criteria_scores as Record<string, number>;
          setCriteriaScores({
            technical: convertedScores.technical || 0,
            financial: convertedScores.financial || 0,
            experience: convertedScores.experience || 0,
            compliance: convertedScores.compliance || 0,
            delivery: convertedScores.delivery || 0,
            ...(convertedScores.quality !== undefined ? { quality: convertedScores.quality } : {}),
            ...(convertedScores.innovation !== undefined ? { innovation: convertedScores.innovation } : {}),
            ...(convertedScores.support !== undefined ? { support: convertedScores.support } : {})
          });
        }
        
        // Set justification if available
        if (evaluationData.justification) {
          setJustification(evaluationData.justification);
        }
      }
    } catch (error) {
      console.error('Error fetching existing evaluation:', error);
    }
  };

  const handleCriteriaScoreChange = (category: string, value: number) => {
    setCriteriaScores(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmitEvaluation = async (
    bidId: string, 
    session: any, 
    userRoles: string[]
  ) => {
    if (!session || !bidId) return;
    
    try {
      setSubmitting(true);
      
      // Find the evaluator role from user roles
      const evaluatorType = userRoles.find(role => role.includes('evaluator_')) || '';
      
      if (!evaluatorType) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not determine evaluator type",
        });
        return;
      }
      
      // Convert the evaluatorType to match database expected values
      // The database expects specific string values, so we use the string directly
      const evaluatorRole = evaluatorType as string;
      
      if (existingEvaluation) {
        // Update existing evaluation
        const { error } = await supabase
          .from('evaluations')
          .update({
            score: score,
            comments: comments,
            recommendation: recommendation,
            criteria_scores: criteriaScores as any, // Use type assertion for JSON compatibility
            justification: justification,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEvaluation.id);
          
        if (error) throw error;
        
        toast({
          title: "Evaluation Updated",
          description: "Your evaluation has been successfully updated.",
        });
      } else {
        // Create new evaluation
        const { error } = await supabase
          .from('evaluations')
          .insert({
            bid_id: bidId,
            evaluator_id: session.user.id,
            evaluation_type: evaluatorRole as any, // Use type assertion to handle the string/enum mismatch
            score: score,
            comments: comments,
            recommendation: recommendation,
            criteria_scores: criteriaScores as any, // Use type assertion for JSON compatibility
            justification: justification
          });
          
        if (error) throw error;
        
        toast({
          title: "Evaluation Submitted",
          description: "Your evaluation has been successfully submitted.",
        });
      }
      
      // Navigate back to evaluations list
      navigate('/evaluations');
      
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit evaluation",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
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
    handleSubmitEvaluation
  };
}

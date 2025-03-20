
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Bid, Evaluation, EvaluationCriteriaScores } from '@/types/database.types';
import { ProcurementMethod } from '@/types/enums';

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
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [bid, setBid] = useState<Bid | null>(null);
  const [existingEvaluation, setExistingEvaluation] = useState<Evaluation | null>(null);
  const [score, setScore] = useState<number>(0);
  const [comments, setComments] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [criteriaScores, setCriteriaScores] = useState<EvaluationCriteriaScores>({});
  const [justification, setJustification] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        toast({
          variant: "destructive",
          title: "Not Authenticated",
          description: "Please log in to evaluate bids",
        });
        navigate('/');
        return;
      }
      
      setSession(data.session);
      
      // Check user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.session.user.id);
        
      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not verify your permissions",
        });
      } else if (rolesData) {
        const roles = rolesData.map((r: { role: string }) => r.role);
        setUserRoles(roles);
        
        // Check if user has any evaluator role
        const isEvaluator = roles.some(role => role.includes('evaluator_'));
        
        if (!isEvaluator) {
          toast({
            variant: "destructive",
            title: "Permission Denied",
            description: "Only evaluators can access this page",
          });
          navigate('/dashboard');
          return;
        }
        
        // Fetch bid data and check for existing evaluation
        if (bidId) {
          fetchBidData(bidId, data.session.user.id, roles);
        }
      }
    };
    
    checkSession();
  }, [bidId, navigate, toast]);

  const fetchBidData = async (bidId: string, userId: string, roles: string[]) => {
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
          criteria_scores: evaluationData.criteria_scores || {},
          justification: evaluationData.justification || null
        };
        
        setExistingEvaluation(typedEvaluation);
        setScore(evaluationData.score || 0);
        setComments(evaluationData.comments || '');
        setRecommendation(evaluationData.recommendation || '');
        
        // Set criteria scores if available
        if (evaluationData.criteria_scores) {
          setCriteriaScores(evaluationData.criteria_scores as EvaluationCriteriaScores);
        }
        
        // Set justification if available
        if (evaluationData.justification) {
          setJustification(evaluationData.justification);
        }
      }
      
    } catch (error) {
      console.error('Error fetching bid data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load bid data",
      });
      navigate('/evaluations');
    } finally {
      setLoading(false);
    }
  };

  const handleCriteriaScoreChange = (category: string, value: number) => {
    setCriteriaScores(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmitEvaluation = async () => {
    if (!session || !bid) return;
    
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
      
      if (existingEvaluation) {
        // Update existing evaluation
        const { error } = await supabase
          .from('evaluations')
          .update({
            score: score,
            comments: comments,
            recommendation: recommendation,
            criteria_scores: criteriaScores,
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
            bid_id: bid.id,
            evaluator_id: session.user.id,
            evaluation_type: evaluatorType,
            score: score,
            comments: comments,
            recommendation: recommendation,
            criteria_scores: criteriaScores,
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
    loading,
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

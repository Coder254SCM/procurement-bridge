
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, ProcurementMethod } from '@/types/enums';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our components
import EvaluationHeader from '@/components/evaluations/EvaluationHeader';
import BidSummaryCards from '@/components/evaluations/BidSummaryCards';
import TenderDetailCards from '@/components/evaluations/TenderDetailCards';
import EvaluationFormComponent from '@/components/evaluations/EvaluationForm';
import ProcurementMethodInfo from '@/components/evaluations/ProcurementMethodInfo';
import { Bid, Evaluation, EvaluationCriteriaScores } from '@/types/database.types';

const EvaluationForm = () => {
  const { bidId } = useParams<{ bidId: string }>();
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
  const [activeTab, setActiveTab] = useState('evaluation');

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
      
      // Simplified query to get bid and related data
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(
            title,
            description,
            category,
            budget_amount,
            budget_currency,
            procurement_method
          )
        `)
        .eq('id', bidId)
        .single();
        
      if (bidError) throw bidError;

      // Separate query to get supplier profile
      const { data: supplierData, error: supplierError } = await supabase
        .from('profiles')
        .select('full_name, company_name')
        .eq('id', bidData.supplier_id)
        .single();
      
      if (supplierError) {
        console.error('Error fetching supplier data:', supplierError);
      }
      
      // Create a complete bid object with defaults if data is missing
      const completeBid: Bid = {
        ...bidData,
        tender: bidData.tender ? {
          title: bidData.tender.title || 'Untitled',
          description: bidData.tender.description || '',
          category: bidData.tender.category || 'General',
          budget_amount: bidData.tender.budget_amount || 0,
          budget_currency: bidData.tender.budget_currency || 'KES',
          procurement_method: bidData.tender.procurement_method || null
        } : {
          title: 'Untitled',
          description: '',
          category: 'General',
          budget_amount: 0,
          budget_currency: 'KES',
          procurement_method: null
        },
        supplier: supplierData ? {
          full_name: supplierData.full_name || 'Unknown',
          company_name: supplierData.company_name || 'Unknown Company'
        } : {
          full_name: 'Unknown',
          company_name: 'Unknown Company'
        }
      };
      
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
        // Convert string evaluation_type to UserRole enum and ensure we have all needed fields
        const typedEvaluation: Evaluation = {
          ...evaluationData,
          evaluation_type: evaluationData.evaluation_type as UserRole,
          criteria_scores: evaluationData.criteria_scores || null,
          justification: evaluationData.justification || null
        };
        
        setExistingEvaluation(typedEvaluation);
        setScore(evaluationData.score);
        setComments(evaluationData.comments || '');
        setRecommendation(evaluationData.recommendation || '');
        
        // Set criteria scores if available
        if (evaluationData.criteria_scores) {
          setCriteriaScores(evaluationData.criteria_scores);
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
      
      const evaluatorType = userRoles.find(role => role.includes('evaluator_'));
      
      if (!evaluatorType) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not determine evaluator type",
        });
        return;
      }
      
      // Convert the evaluation type string to the correct enum format
      let evaluationType: UserRole;
      
      switch (evaluatorType) {
        case 'evaluator_finance':
          evaluationType = UserRole.EVALUATOR_FINANCE;
          break;
        case 'evaluator_technical':
          evaluationType = UserRole.EVALUATOR_TECHNICAL;
          break;
        case 'evaluator_procurement':
          evaluationType = UserRole.EVALUATOR_PROCUREMENT;
          break;
        case 'evaluator_engineering':
          evaluationType = UserRole.EVALUATOR_ENGINEERING;
          break;
        case 'evaluator_legal':
          evaluationType = UserRole.EVALUATOR_LEGAL;
          break;
        case 'evaluator_accounting':
          evaluationType = UserRole.EVALUATOR_ACCOUNTING;
          break;
        default:
          // Default to finance evaluator if something goes wrong
          evaluationType = UserRole.EVALUATOR_FINANCE;
      }
      
      // Prepare the evaluation data that matches the database schema
      const evaluationData = {
        score,
        comments,
        recommendation,
        criteria_scores: Object.keys(criteriaScores).length > 0 ? criteriaScores : null,
        justification: justification || null
      };
      
      if (existingEvaluation) {
        // Update existing evaluation
        const { error } = await supabase
          .from('evaluations')
          .update({
            ...evaluationData,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingEvaluation.id);
          
        if (error) throw error;
        
        toast({
          title: "Evaluation Updated",
          description: "Your evaluation has been successfully updated.",
        });
      } else {
        // Create new evaluation with only the fields that are in the database schema
        const { error } = await supabase
          .from('evaluations')
          .insert({
            bid_id: bid.id,
            evaluator_id: session.user.id,
            evaluation_type: evaluatorType, // Use the string value directly as it's in the enum
            ...evaluationData
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

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bid) {
    return (
      <div className="min-h-screen p-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-2xl font-bold mb-4">Bid Not Found</h1>
          <p className="mb-8">The bid you're looking for could not be found.</p>
          <Button asChild>
            <Link to="/evaluations">Back to Evaluations</Link>
          </Button>
        </div>
      </div>
    );
  }

  const evaluatorType = userRoles.find(role => role.includes('evaluator_'))?.replace('evaluator_', '') || '';
  const isReadOnly = !!existingEvaluation;
  const procurementMethod = bid.tender?.procurement_method as ProcurementMethod || ProcurementMethod.OPEN_TENDER;

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <EvaluationHeader 
          title={bid.tender?.title || 'Untitled Tender'} 
          bidId={bid.id} 
          createdAt={bid.created_at} 
          isEvaluated={!!existingEvaluation}
        />
        
        <BidSummaryCards 
          bidAmount={bid.bid_amount}
          budgetAmount={bid.tender?.budget_amount || 0}
          budgetCurrency={bid.tender?.budget_currency || 'KES'}
          supplierName={bid.supplier?.full_name || 'Unknown'}
          supplierCompany={bid.supplier?.company_name || 'Unknown Company'}
          category={bid.tender?.category || 'Unknown'}
          evaluatorType={evaluatorType}
        />

        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evaluation">Evaluation Form</TabsTrigger>
              <TabsTrigger value="details">Tender Details</TabsTrigger>
              <TabsTrigger value="method">Procurement Method</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluation" className="mt-6">
              <EvaluationFormComponent 
                score={score}
                comments={comments}
                recommendation={recommendation}
                isReadOnly={isReadOnly}
                submitting={submitting}
                existingEvaluation={existingEvaluation}
                criteriaScores={criteriaScores}
                justification={justification}
                onScoreChange={setScore}
                onCommentsChange={setComments}
                onRecommendationChange={setRecommendation}
                onCriteriaScoreChange={handleCriteriaScoreChange}
                onJustificationChange={setJustification}
                onSubmit={handleSubmitEvaluation}
              />
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <TenderDetailCards 
                description={bid.tender?.description}
                technicalDetails={bid.technical_details}
                documents={bid.documents}
              />
            </TabsContent>
            
            <TabsContent value="method" className="mt-6">
              <ProcurementMethodInfo method={procurementMethod} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;

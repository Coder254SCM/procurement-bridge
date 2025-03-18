import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/enums';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  status: string;
  documents: any;
  technical_details: any;
  created_at: string;
  tender?: {
    title: string;
    description: string;
    category: string;
    budget_amount: number;
    budget_currency: string;
  };
  supplier?: {
    full_name: string | null;
    company_name: string | null;
  };
}

interface Evaluation {
  id: string;
  bid_id: string;
  evaluator_id: string;
  evaluation_type: UserRole;
  score: number;
  comments: string | null;
  recommendation: string | null;
  created_at: string;
  updated_at?: string;
}

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
      
      // Fetch bid with tender and supplier details
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select(`
          *,
          tender:tender_id(
            title,
            description,
            category,
            budget_amount,
            budget_currency
          ),
          supplier:supplier_id(
            full_name,
            company_name
          )
        `)
        .eq('id', bidId)
        .single();
        
      if (bidError) throw bidError;
      
      // Create a safe bid object with proper type handling
      let supplierData = {
        full_name: 'Unknown',
        company_name: 'Unknown Company'
      };
      
      // Only assign if supplier data is valid (not an error object)
      if (bidData.supplier && typeof bidData.supplier === 'object' && !('error' in bidData.supplier)) {
        supplierData = {
          full_name: bidData.supplier.full_name || 'Unknown',
          company_name: bidData.supplier.company_name || 'Unknown Company'
        };
      }
      
      const safeBid: Bid = {
        ...bidData,
        supplier: supplierData
      };
      
      setBid(safeBid);
      
      // Check if user has already evaluated this bid
      const { data: evaluationData, error: evaluationError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('bid_id', bidId)
        .eq('evaluator_id', userId)
        .maybeSingle();
        
      if (evaluationError) throw evaluationError;
      
      if (evaluationData) {
        setExistingEvaluation(evaluationData);
        setScore(evaluationData.score);
        setComments(evaluationData.comments || '');
        setRecommendation(evaluationData.recommendation || '');
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
        default:
          throw new Error('Invalid evaluator type');
      }
      
      if (existingEvaluation) {
        // Update existing evaluation
        const { error } = await supabase
          .from('evaluations')
          .update({
            score,
            comments,
            recommendation,
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
            evaluation_type: evaluationType,
            score,
            comments,
            recommendation
            // In a real implementation, we'd add blockchain hash here
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

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/evaluations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Evaluations
          </Link>
        </Button>
      </div>
      
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{bid.tender?.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-muted-foreground">
              Bid #{bid.id.slice(0, 8)} • {new Date(bid.created_at).toLocaleDateString()}
            </p>
            {existingEvaluation && (
              <Badge variant="secondary" className="ml-2">Previously Evaluated</Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{bid.bid_amount} {bid.tender?.budget_currency || 'KES'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Budget: {bid.tender?.budget_amount} {bid.tender?.budget_currency || 'KES'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{bid.supplier?.company_name || 'Unknown Company'}</p>
              <p className="text-sm text-muted-foreground mt-1">{bid.supplier?.full_name || 'Unknown Supplier'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{bid.tender?.category || 'Uncategorized'}</p>
              <p className="text-sm text-muted-foreground mt-1">Your role: {evaluatorType.toUpperCase()} Evaluator</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Tender Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{bid.tender?.description || 'No description available'}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              {bid.technical_details ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm whitespace-pre-wrap">
                  {JSON.stringify(bid.technical_details, null, 2)}
                </pre>
              ) : (
                <p className="text-muted-foreground">No technical details provided</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {bid.documents && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Attached Documents</CardTitle>
              <CardDescription>
                Review these documents before submitting your evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(bid.documents || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{key}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>{isReadOnly ? 'Your Evaluation' : 'Submit Your Evaluation'}</CardTitle>
            <CardDescription>
              {isReadOnly 
                ? 'You have already evaluated this bid' 
                : `Evaluate this bid based on your ${evaluatorType} expertise`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">Score (1-10)</h3>
              <div className="flex items-center gap-4">
                <Slider
                  defaultValue={[score]}
                  max={10}
                  step={1}
                  onValueChange={(value) => setScore(value[0])}
                  disabled={isReadOnly}
                  className="flex-1"
                />
                <span className="font-bold text-lg min-w-10 text-center">{score}/10</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Comments</h3>
              <Textarea
                placeholder="Provide your professional assessment of this bid..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={isReadOnly}
                className="min-h-32"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Recommendation</h3>
              <RadioGroup 
                value={recommendation} 
                onValueChange={setRecommendation}
                disabled={isReadOnly}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accept" id="accept" />
                  <Label htmlFor="accept">Accept</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject">Reject</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="request_more_info" id="request_more_info" />
                  <Label htmlFor="request_more_info">Request More Information</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            {isReadOnly ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Evaluation submitted on {new Date(existingEvaluation?.created_at || '').toLocaleDateString()}</span>
              </div>
            ) : (
              <Button 
                onClick={handleSubmitEvaluation} 
                disabled={submitting || score === 0 || !recommendation}
                className="ml-auto"
              >
                {submitting ? 'Submitting...' : 'Submit Evaluation'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EvaluationForm;

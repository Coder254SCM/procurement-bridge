import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft, Loader2, Upload, X, FileText, DollarSign,
  ChevronLeft, ChevronRight, Check, Save, ShieldCheck, AlertCircle
} from 'lucide-react';

interface TenderInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  budget_amount: number;
  budget_currency: string;
  submission_deadline: string;
  status: string;
  required_documents: string[] | null;
  evaluation_criteria: Record<string, any> | null;
  buyer_id: string;
}

const BidSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tender, setTender] = useState<TenderInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form state
  const [bidAmount, setBidAmount] = useState('');
  const [technicalProposal, setTechnicalProposal] = useState('');
  const [methodology, setMethodology] = useState('');
  const [timeline, setTimeline] = useState('');
  const [experience, setExperience] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [existingBid, setExistingBid] = useState<string | null>(null);

  useEffect(() => {
    if (id && user) fetchTender();
  }, [id, user]);

  const fetchTender = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tenders')
        .select('id, title, description, category, budget_amount, budget_currency, submission_deadline, status, required_documents, evaluation_criteria, buyer_id')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTender(data as TenderInfo);

      // Check if user already has a bid
      if (user) {
        const { data: existingBidData } = await supabase
          .from('bids')
          .select('id')
          .eq('tender_id', id)
          .eq('supplier_id', user.id)
          .maybeSingle();

        if (existingBidData) {
          setExistingBid(existingBidData.id);
        }
      }
    } catch (error) {
      console.error('Error fetching tender:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load tender' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const maxSize = 5 * 1024 * 1024; // 5MB
      const validFiles = newFiles.filter(f => f.size <= maxSize);
      if (validFiles.length < newFiles.length) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Maximum file size is 5MB' });
      }
      setDocuments(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const uploadDocuments = async (bidId: string): Promise<string[]> => {
    const uploadedPaths: string[] = [];
    for (const file of documents) {
      const filePath = `${user!.id}/${bidId}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from('bid-documents')
        .upload(filePath, file);
      if (!error) {
        uploadedPaths.push(filePath);
      } else {
        console.error('Upload error:', error);
      }
    }
    return uploadedPaths;
  };

  const handleSubmit = async () => {
    if (!user || !tender || !bidAmount) return;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid bid amount', description: 'Please enter a valid positive number' });
      return;
    }

    if (amount > tender.budget_amount) {
      toast({ variant: 'destructive', title: 'Bid exceeds budget', description: `Maximum budget is ${tender.budget_currency} ${tender.budget_amount.toLocaleString()}` });
      return;
    }

    try {
      setSubmitting(true);

      // Upload documents first
      let uploadedDocs: string[] = [];
      if (documents.length > 0) {
        setUploading(true);
        uploadedDocs = await uploadDocuments('pending');
        setUploading(false);
      }

      const technicalDetails = {
        proposal: technicalProposal,
        methodology,
        timeline,
        experience,
      };

      const { data, error } = await supabase
        .from('bids')
        .insert({
          tender_id: tender.id,
          supplier_id: user.id,
          bid_amount: amount,
          technical_details: technicalDetails,
          uploaded_documents: uploadedDocs,
          status: 'submitted',
        })
        .select('id')
        .single();

      if (error) throw error;

      // Move uploaded files to correct bid folder
      if (data && uploadedDocs.length > 0) {
        // Files are already uploaded, just update the bid with correct paths
        const correctedPaths = uploadedDocs.map(p => p.replace('/pending/', `/${data.id}/`));
        await supabase
          .from('bids')
          .update({ uploaded_documents: correctedPaths })
          .eq('id', data.id);
      }

      toast({ title: 'Bid Submitted!', description: 'Your bid has been submitted and recorded on the blockchain.' });
      navigate(`/tender/${tender.id}`);
    } catch (error: any) {
      console.error('Bid submission error:', error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: error.message || 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading tender...</span>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tender Not Found</h1>
        <Button asChild><Link to="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  if (tender.status !== 'published') {
    return (
      <div className="container py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Tender Not Open</h1>
        <p className="text-muted-foreground mb-4">This tender is no longer accepting submissions.</p>
        <Button asChild><Link to={`/tender/${id}`}>View Tender</Link></Button>
      </div>
    );
  }

  if (user?.id === tender.buyer_id) {
    return (
      <div className="container py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">Cannot Bid on Own Tender</h1>
        <p className="text-muted-foreground mb-4">You cannot submit a bid on your own tender.</p>
        <Button asChild><Link to={`/tender/${id}`}>View Tender</Link></Button>
      </div>
    );
  }

  if (existingBid) {
    return (
      <div className="container py-8 text-center">
        <Check className="h-12 w-12 mx-auto mb-4 text-green-600" />
        <h1 className="text-2xl font-bold mb-2">Bid Already Submitted</h1>
        <p className="text-muted-foreground mb-4">You have already submitted a bid for this tender.</p>
        <Button asChild><Link to={`/tender/${id}`}>View Tender</Link></Button>
      </div>
    );
  }

  const deadline = new Date(tender.submission_deadline);
  const daysLeft = Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  if (daysLeft === 0) {
    return (
      <div className="container py-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <h1 className="text-2xl font-bold mb-2">Deadline Passed</h1>
        <p className="text-muted-foreground mb-4">The submission deadline for this tender has passed.</p>
        <Button asChild><Link to={`/tender/${id}`}>View Tender</Link></Button>
      </div>
    );
  }

  const progress = (currentStep / totalSteps) * 100;
  const stepTitles = ['Financial Proposal', 'Technical Proposal', 'Documents', 'Review & Submit'];

  return (
    <div className="container py-8 px-4 md:px-6 max-w-4xl mx-auto">
      <Helmet>
        <title>Submit Bid - {tender.title} | ProcureChain</title>
        <meta name="description" content={`Submit your bid for: ${tender.title}`} />
      </Helmet>

      <Button variant="ghost" asChild className="mb-6">
        <Link to={`/tender/${id}`}><ArrowLeft className="mr-2 h-4 w-4" />Back to Tender</Link>
      </Button>

      {/* Tender Summary */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">{tender.title}</h1>
              <p className="text-sm text-muted-foreground">{tender.category} • Budget: {formatCurrency(tender.budget_amount, tender.budget_currency)}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{daysLeft} days left</Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Open</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-sm">Step {currentStep} of {totalSteps}: {stepTitles[currentStep - 1]}</span>
            <Badge variant="outline">{Math.round(progress)}%</Badge>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {stepTitles.map((title, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i + 1)}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                  currentStep === i + 1 ? 'text-primary font-semibold' : i + 1 < currentStep ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                  currentStep === i + 1 ? 'bg-primary text-primary-foreground' : i + 1 < currentStep ? 'bg-green-100 text-green-600 dark:bg-green-900/30' : 'bg-secondary'
                }`}>
                  {i + 1 < currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden md:block">{title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{stepTitles[currentStep - 1]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div>
                <Label htmlFor="bid_amount">Bid Amount ({tender.budget_currency}) *</Label>
                <Input
                  id="bid_amount"
                  type="number"
                  placeholder={`Max: ${tender.budget_amount.toLocaleString()}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Budget ceiling: {formatCurrency(tender.budget_amount, tender.budget_currency)}
                </p>
                {bidAmount && parseFloat(bidAmount) > tender.budget_amount && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Bid exceeds maximum budget
                  </p>
                )}
              </div>
              <Separator />
              <div className="p-4 bg-secondary/30 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">Evaluation Criteria</h4>
                {tender.evaluation_criteria && Object.keys(tender.evaluation_criteria).length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(tender.evaluation_criteria).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm p-1.5 bg-background rounded">
                        <span className="capitalize">{key}</span>
                        <span className="font-medium">{String(val)}%</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Standard evaluation criteria apply.</p>
                )}
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div>
                <Label htmlFor="technical">Technical Proposal *</Label>
                <Textarea
                  id="technical"
                  placeholder="Describe your technical approach, solution, and value proposition..."
                  value={technicalProposal}
                  onChange={(e) => setTechnicalProposal(e.target.value)}
                  rows={5}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="methodology">Methodology & Approach</Label>
                <Textarea
                  id="methodology"
                  placeholder="Describe your methodology, tools, and processes..."
                  value={methodology}
                  onChange={(e) => setMethodology(e.target.value)}
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="timeline">Proposed Timeline & Deliverables</Label>
                <Textarea
                  id="timeline"
                  placeholder="Key milestones, delivery dates, and phasing..."
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="experience">Relevant Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Past projects, qualifications, team capabilities..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={3}
                  className="mt-1"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {tender.required_documents && tender.required_documents.length > 0 && (
                <div className="p-4 bg-secondary/30 rounded-lg mb-4">
                  <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Required Documents
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {tender.required_documents.map((doc, i) => <li key={i}>{doc}</li>)}
                  </ul>
                </div>
              )}

              <div>
                <Label>Upload Documents</Label>
                <div className="mt-2">
                  <label
                    htmlFor="bid-doc-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/10 hover:bg-secondary/20 transition-colors"
                  >
                    <Upload className="w-8 h-8 mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG (Max 5MB each)</p>
                    <input id="bid-doc-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Uploaded ({documents.length})</h4>
                  {documents.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-secondary/20">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(i)} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="space-y-4">
                <h3 className="font-medium">Bid Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Bid Amount</p>
                    <p className="text-2xl font-bold">{bidAmount ? formatCurrency(parseFloat(bidAmount), tender.budget_currency) : 'Not set'}</p>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">Documents</p>
                    <p className="text-2xl font-bold">{documents.length} files</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-1">Technical Proposal</h4>
                  <p className="text-sm text-muted-foreground">{technicalProposal || 'Not provided'}</p>
                </div>
                {methodology && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Methodology</h4>
                    <p className="text-sm text-muted-foreground">{methodology}</p>
                  </div>
                )}
                {timeline && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Timeline</h4>
                    <p className="text-sm text-muted-foreground">{timeline}</p>
                  </div>
                )}

                <Separator />

                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-400">Blockchain Verification</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-400">Your bid will be cryptographically timestamped and recorded on Hyperledger Fabric for tamper-proof audit.</p>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm">I confirm that all information provided is accurate and I agree to the terms and conditions of this tender.</span>
                </label>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>
            <div className="flex gap-2">
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !bidAmount || !agreedToTerms}
                >
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                  ) : (
                    <><Check className="h-4 w-4 mr-2" /> Submit Bid</>
                  )}
                </Button>
              ) : (
                <Button onClick={() => setCurrentStep(s => Math.min(totalSteps, s + 1))}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BidSubmission;

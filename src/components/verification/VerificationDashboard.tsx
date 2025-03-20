
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDigitalIdentity } from '@/hooks/useDigitalIdentity';
import { useBehaviorAnalysis } from '@/hooks/useBehaviorAnalysis';
import { 
  VerificationType, 
  ComplianceCheckType, 
  BehaviorAnalysisType,
  VerificationStatus 
} from '@/types/enums';
import { ShieldCheck, AlertTriangle, FileCheck, Clock, Info } from 'lucide-react';

const VerificationDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const {
    verificationData,
    complianceChecks,
    verificationStatus,
    fetchVerificationData,
    submitBusinessVerification,
    runComplianceCheck
  } = useDigitalIdentity();
  
  const {
    analysisResults,
    fetchAnalysisResults
  } = useBehaviorAnalysis();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data.user) {
          setUser(data.user);
          await fetchVerificationData(data.user.id);
          await fetchAnalysisResults(data.user.id, 'user');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate, toast]);
  
  const getVerificationProgress = () => {
    // Calculate verification progress based on completed checks
    const totalChecks = 4; // Business, Tax, ID, PEP
    const completedChecks = verificationData.length + complianceChecks.length;
    return Math.min(Math.round((completedChecks / totalChecks) * 100), 100);
  };
  
  const getStatusBadge = (status: VerificationStatus) => {
    switch(status) {
      case VerificationStatus.VERIFIED:
        return <Badge className="bg-green-500">Verified</Badge>;
      case VerificationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case VerificationStatus.FLAGGED:
        return <Badge className="bg-amber-500">Flagged</Badge>;
      case VerificationStatus.REJECTED:
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-500">Pending</Badge>;
    }
  };
  
  const handleRunComplianceCheck = async (checkType: ComplianceCheckType) => {
    if (!user) return;
    await runComplianceCheck(user.id, checkType);
  };
  
  const handleSubmitVerification = async (verificationType: VerificationType) => {
    if (!user) return;
    
    // In a real app, this would include the actual business ID and verification data
    const mockBusinessId = `BUS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const mockVerificationData = {
      name: "Acme Corporation",
      registrationNumber: mockBusinessId,
      registrationDate: new Date().toISOString().split('T')[0],
      status: "Active"
    };
    
    await submitBusinessVerification(
      user.id, 
      mockBusinessId, 
      verificationType, 
      mockVerificationData
    );
  };
  
  if (loading) {
    return (
      <div className="container py-10">
        <p>Loading verification data...</p>
      </div>
    );
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Digital Identity Verification</h1>
      
      <div className="mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>
              Your current identity verification progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Overall Status:</span>
                {getStatusBadge(verificationStatus)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verification Progress</span>
                  <span>{getVerificationProgress()}%</span>
                </div>
                <Progress value={getVerificationProgress()} className="h-2" />
              </div>
              
              {verificationStatus === VerificationStatus.FLAGGED && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Verification Issue Detected</AlertTitle>
                  <AlertDescription>
                    We've detected potential issues with your verification. Please review the compliance section for details.
                  </AlertDescription>
                </Alert>
              )}
              
              {verificationStatus === VerificationStatus.VERIFIED && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  <AlertTitle>Fully Verified</AlertTitle>
                  <AlertDescription>
                    Your identity has been fully verified. You have full access to the platform.
                  </AlertDescription>
                </Alert>
              )}
              
              {verificationStatus === VerificationStatus.IN_PROGRESS && (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertTitle>Verification In Progress</AlertTitle>
                  <AlertDescription>
                    Your verification is being processed. This typically takes 1-2 business days.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="identity">
        <TabsList className="mb-6">
          <TabsTrigger value="identity">Business Identity</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checks</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="identity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Registry Verification</CardTitle>
                <CardDescription>
                  Verify your business with official registry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This verification checks your business against official government registries to confirm it is a legitimate entity.
                </p>
                
                {verificationData.some(v => v.verification_type === VerificationType.BUSINESS_REGISTRY) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Verification Submitted</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your business registry verification is {
                        verificationData.find(v => v.verification_type === VerificationType.BUSINESS_REGISTRY)?.verification_status
                      }
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleSubmitVerification(VerificationType.BUSINESS_REGISTRY)}
                    className="w-full"
                  >
                    Verify Business Registry
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tax Compliance Verification</CardTitle>
                <CardDescription>
                  Verify your tax compliance status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This verification checks your business against tax authority records to confirm your tax compliance status.
                </p>
                
                {verificationData.some(v => v.verification_type === VerificationType.TAX_COMPLIANCE) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Verification Submitted</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your tax compliance verification is {
                        verificationData.find(v => v.verification_type === VerificationType.TAX_COMPLIANCE)?.verification_status
                      }
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleSubmitVerification(VerificationType.TAX_COMPLIANCE)}
                    className="w-full"
                  >
                    Verify Tax Compliance
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Digital Identity</CardTitle>
                <CardDescription>
                  Blockchain-based digital identity verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This verification creates a secure, tamper-proof digital identity for your business on the blockchain.
                </p>
                
                {verificationData.some(v => v.verification_type === VerificationType.BLOCKCHAIN_VERIFICATION) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileCheck className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Verification Submitted</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your blockchain identity verification is {
                        verificationData.find(v => v.verification_type === VerificationType.BLOCKCHAIN_VERIFICATION)?.verification_status
                      }
                    </p>
                    <p className="text-xs mt-2 font-mono break-all">
                      Hash: {verificationData.find(v => v.verification_type === VerificationType.BLOCKCHAIN_VERIFICATION)?.blockchain_hash || 'N/A'}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleSubmitVerification(VerificationType.BLOCKCHAIN_VERIFICATION)}
                    className="w-full"
                  >
                    Create Digital Identity
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Benefits of Verification</CardTitle>
                <CardDescription>
                  Why verification matters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-1 text-green-500" />
                    <span className="text-sm">Builds trust with buyers and procurement agencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-1 text-green-500" />
                    <span className="text-sm">Unlocks higher-value procurement opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-1 text-green-500" />
                    <span className="text-sm">Streamlines future bidding processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-1 text-green-500" />
                    <span className="text-sm">Protects against impersonation and fraud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 mt-1 text-green-500" />
                    <span className="text-sm">Creates immutable proof of your business credentials</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PEP Check</CardTitle>
                <CardDescription>
                  Politically Exposed Persons verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Checks if company directors or beneficial owners are politically exposed persons, which may require enhanced due diligence.
                </p>
                
                {complianceChecks.some(c => c.check_type === ComplianceCheckType.PEP_CHECK) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Check Completed</span>
                      </div>
                      {getStatusBadge(complianceChecks.find(c => c.check_type === ComplianceCheckType.PEP_CHECK)?.status || VerificationStatus.PENDING)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.PEP_CHECK)?.check_date || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      Next check due: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.PEP_CHECK)?.next_check_date || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleRunComplianceCheck(ComplianceCheckType.PEP_CHECK)}
                    className="w-full"
                  >
                    Run PEP Check
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sanctions List Check</CardTitle>
                <CardDescription>
                  Check against international sanctions lists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Verifies that your company and directors are not on international sanctions lists or barred entity lists.
                </p>
                
                {complianceChecks.some(c => c.check_type === ComplianceCheckType.SANCTIONS_LIST) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Check Completed</span>
                      </div>
                      {getStatusBadge(complianceChecks.find(c => c.check_type === ComplianceCheckType.SANCTIONS_LIST)?.status || VerificationStatus.PENDING)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.SANCTIONS_LIST)?.check_date || Date.now()).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-2">
                      Next check due: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.SANCTIONS_LIST)?.next_check_date || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleRunComplianceCheck(ComplianceCheckType.SANCTIONS_LIST)}
                    className="w-full"
                  >
                    Run Sanctions Check
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shell Company Check</CardTitle>
                <CardDescription>
                  Verify business legitimacy and operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Analyzes company structure, history, and activities to identify potential shell company risk factors.
                </p>
                
                {complianceChecks.some(c => c.check_type === ComplianceCheckType.SHELL_COMPANY_CHECK) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Check Completed</span>
                      </div>
                      {getStatusBadge(complianceChecks.find(c => c.check_type === ComplianceCheckType.SHELL_COMPANY_CHECK)?.status || VerificationStatus.PENDING)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.SHELL_COMPANY_CHECK)?.check_date || Date.now()).toLocaleDateString()}
                    </p>
                    
                    {complianceChecks.find(c => c.check_type === ComplianceCheckType.SHELL_COMPANY_CHECK)?.status === VerificationStatus.FLAGGED && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Potential Risk Identified</AlertTitle>
                        <AlertDescription>
                          Our analysis detected potential shell company indicators. Please provide additional business documentation.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleRunComplianceCheck(ComplianceCheckType.SHELL_COMPANY_CHECK)}
                    className="w-full"
                  >
                    Run Shell Company Check
                  </Button>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Barred Entity Check</CardTitle>
                <CardDescription>
                  Check against procurement exclusion lists
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Verifies that your company is not on any disbarred or excluded entity lists for government procurement.
                </p>
                
                {complianceChecks.some(c => c.check_type === ComplianceCheckType.DISBARRED_ENTITIES) ? (
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Check Completed</span>
                      </div>
                      {getStatusBadge(complianceChecks.find(c => c.check_type === ComplianceCheckType.DISBARRED_ENTITIES)?.status || VerificationStatus.PENDING)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last checked: {new Date(complianceChecks.find(c => c.check_type === ComplianceCheckType.DISBARRED_ENTITIES)?.check_date || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleRunComplianceCheck(ComplianceCheckType.DISBARRED_ENTITIES)}
                    className="w-full"
                  >
                    Run Barred Entity Check
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavioral">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Behavioral Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of tender and bidding patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Our system uses advanced AI to analyze patterns in procurement activities to detect potential fraud, 
                collusion, or other irregularities. These algorithms improve with more data and help maintain the 
                integrity of the procurement process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Bid Pattern Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Detects suspicious patterns in bidding behavior, such as rotation schemes or cover bidding.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Pricing Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifies unusual pricing patterns that may indicate price fixing or other anti-competitive practices.
                  </p>
                </div>
                
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-2">Document Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Checks for similarities in bid documents that may indicate collusion or document fraud.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Score History</CardTitle>
                <CardDescription>
                  History of behavioral analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResults.length > 0 ? (
                  <div className="space-y-4">
                    {analysisResults.map((result) => (
                      <div key={result.id} className="bg-muted p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">{result.analysis_type.replace('_', ' ')}</span>
                          <div className={`px-2 py-0.5 rounded-full text-xs ${
                            result.risk_score > 50 ? 'bg-red-100 text-red-800' : 
                            result.risk_score > 30 ? 'bg-amber-100 text-amber-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            Risk Score: {result.risk_score}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(result.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      No behavioral analysis results available. Analysis is performed automatically when you participate in tenders and bidding activities.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enhancing Trust & Transparency</CardTitle>
                <CardDescription>
                  How our behavioral analysis works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Our behavioral analysis system leverages blockchain technology and AI to enhance trust and transparency in procurement:
                  </p>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Blockchain Advantage</h3>
                    <p className="text-sm text-muted-foreground">
                      All verification results and compliance checks are recorded on blockchain, creating an immutable 
                      audit trail that cannot be altered or tampered with. This provides cryptographic proof of all 
                      verification activities.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Pattern Recognition</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI models analyze thousands of procurement activities to learn normal patterns and identify anomalies 
                      that may indicate fraud, collusion, or corruption.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Risk Scoring</h3>
                    <p className="text-sm text-muted-foreground">
                      Each entity and transaction receives a risk score based on multiple factors. This score helps 
                      procurement officials prioritize which activities need further scrutiny.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Privacy Preserving</h3>
                    <p className="text-sm text-muted-foreground">
                      Our system uses zero-knowledge proofs where appropriate to validate credentials without 
                      exposing sensitive business information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationDashboard;

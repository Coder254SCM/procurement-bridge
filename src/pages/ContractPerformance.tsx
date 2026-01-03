import React, { useMemo, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { contractPerformanceService, ContractMilestone } from "@/services/ContractPerformanceService";
import { useRTHConsensus } from "@/hooks/useRTHConsensus";
import { RTHVerificationDashboard } from "@/components/rth/RTHVerificationDashboard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Loader2, Search, CheckCircle, Clock, AlertTriangle, 
  Waves, Shield, DollarSign, Calendar 
} from "lucide-react";

const ContractPerformance: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<{ score: number; status: string } | null>(null);
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [rthSession, setRthSession] = useState<any>(null);
  const [rthVerifications, setRthVerifications] = useState<any[]>([]);
  
  const { 
    loading: rthLoading, 
    createSession, 
    submitVerification, 
    calculateConsensus,
    fetchSession,
    fetchVerifications 
  } = useRTHConsensus();

  useEffect(() => {
    if (user) {
      loadUserContracts();
    }
  }, [user]);

  const loadUserContracts = async () => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          id,
          contract_value,
          contract_currency,
          status,
          start_date,
          end_date,
          buyer_id,
          supplier_id,
          created_at
        `)
        .or(`buyer_id.eq.${user?.id},supplier_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  const loadContractPerformance = async (id: string) => {
    if (!id) {
      toast({ title: "Select a contract", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      setContractId(id);
      
      // Get contract details
      const { data: contractData } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();
      
      setSelectedContract(contractData);
      
      // Calculate health
      const h = await contractPerformanceService.calculateContractHealth(id);
      setHealth(h);
      
      // Get milestones
      const upcoming = await contractPerformanceService.getUpcomingMilestones(id, 60);
      setMilestones(upcoming);
      
      // Check for existing RTH sessions
      const { data: sessions } = await supabase
        .from('rth_verification_sessions')
        .select('*')
        .eq('contract_id', id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (sessions && sessions.length > 0) {
        setRthSession(sessions[0]);
        const verifications = await fetchVerifications(sessions[0].id);
        setRthVerifications(verifications || []);
      }
    } catch (e: any) {
      toast({ 
        title: "Failed to load performance", 
        description: e?.message || "Unknown error", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartRTHVerification = async (milestoneId?: string) => {
    if (!contractId) {
      toast({ title: "Select a contract first", variant: "destructive" });
      return;
    }
    
    try {
      const session = await createSession(contractId, milestoneId);
      setRthSession(session);
    } catch (error) {
      console.error('RTH session creation failed:', error);
    }
  };

  const handleSubmitVerification = async () => {
    if (!rthSession || !user) return;
    
    try {
      // Get verifier ID
      const { data: verifier } = await supabase
        .from('rth_verifiers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!verifier) {
        toast({ 
          title: "Not a registered verifier", 
          description: "You need to be a registered RTH verifier",
          variant: "destructive" 
        });
        return;
      }
      
      // Submit verification with the contract value as verified value
      await submitVerification(
        rthSession.id,
        verifier.id,
        selectedContract?.contract_value || 0,
        { verified_at: new Date().toISOString() },
        "Milestone verified successfully"
      );
      
      // Refresh session and verifications
      const updatedSession = await fetchSession(rthSession.id);
      const verifications = await fetchVerifications(rthSession.id);
      setRthSession(updatedSession);
      setRthVerifications(verifications || []);
    } catch (error) {
      console.error('Verification submission failed:', error);
    }
  };

  const handleCalculateConsensus = async () => {
    if (!rthSession) return;
    
    try {
      const result = await calculateConsensus(rthSession.id);
      const updatedSession = await fetchSession(rthSession.id);
      setRthSession(updatedSession);
    } catch (error) {
      console.error('Consensus calculation failed:', error);
    }
  };

  const statusColor = useMemo(() => {
    if (!health) return "";
    switch (health.status) {
      case "excellent": return "text-green-600";
      case "good": return "text-emerald-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  }, [health]);

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>Contract Performance | ProcureChain</title>
        <meta name="description" content="Monitor contract health, milestones, and RTH verification consensus." />
        <link rel="canonical" href="/contract-performance" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Contract Performance</h1>
        <p className="text-muted-foreground">
          Monitor contract health, track milestones, and run RTH consensus verification.
        </p>
      </header>

      {/* Contract Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Contract</CardTitle>
          <CardDescription>Choose a contract to view performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <p className="text-muted-foreground">No contracts found. Contracts are created after tender awards.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contracts.map((contract) => (
                <Card 
                  key={contract.id} 
                  className={`cursor-pointer transition-all hover:border-primary ${
                    contractId === contract.id ? 'border-primary ring-2 ring-primary/20' : ''
                  }`}
                  onClick={() => loadContractPerformance(contract.id)}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{contract.id.slice(0, 8)}</span>
                      <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {contract.contract_currency || 'KES'} {(contract.contract_value || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {contract.start_date && new Date(contract.start_date).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading performance data...</span>
        </div>
      )}

      {selectedContract && !loading && (
        <Tabs defaultValue="health" className="space-y-6">
          <TabsList>
            <TabsTrigger value="health">Health & Progress</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="rth">RTH Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="health" className="space-y-4">
            {health && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Overall Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-2xl font-semibold ${statusColor}`}>
                        {health.status.toUpperCase()}
                      </div>
                      <div className="text-4xl font-bold">{health.score}</div>
                    </div>
                    <Progress value={health.score} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-3">
                      Contract health is calculated based on milestone completion, payment status, and verification results.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedContract.contract_currency || 'KES'} {(selectedContract.contract_value || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedContract.start_date 
                          ? new Date(selectedContract.start_date).toLocaleDateString() 
                          : 'Start TBD'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedContract.end_date 
                          ? new Date(selectedContract.end_date).toLocaleDateString() 
                          : 'End TBD'
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Milestones (60 days)</CardTitle>
              </CardHeader>
              <CardContent>
                {milestones.length === 0 ? (
                  <p className="text-muted-foreground">No upcoming milestones found.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {milestones.map((milestone) => (
                      <Card key={milestone.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{milestone.milestone_name}</span>
                            <Badge variant={
                              milestone.status === 'completed' ? 'default' :
                              milestone.status === 'in_progress' ? 'secondary' : 'outline'
                            }>
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Due: {new Date(milestone.due_date).toLocaleDateString()}
                          </p>
                          {milestone.status !== 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStartRTHVerification(milestone.id)}
                              disabled={rthLoading}
                            >
                              <Waves className="h-4 w-4 mr-2" />
                              Start RTH Verification
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rth" className="space-y-4">
            {!rthSession ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5" />
                    RTH Consensus Verification
                  </CardTitle>
                  <CardDescription>
                    Start a new verification session to validate contract milestones using wave-based multi-party consensus.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleStartRTHVerification()}
                    disabled={rthLoading}
                  >
                    {rthLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    <Waves className="h-4 w-4 mr-2" />
                    Start New RTH Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <RTHVerificationDashboard
                  session={{
                    id: rthSession.id,
                    status: rthSession.status,
                    confidence_score: rthSession.confidence_score,
                    average_phase: rthSession.average_phase,
                    circular_variance: rthSession.circular_variance,
                    decision: rthSession.decision,
                    outlier_detected: rthSession.outlier_detected,
                    outlier_confidence: rthSession.outlier_confidence,
                    current_verifiers: rthSession.current_verifiers || 0,
                    required_verifiers: rthSession.required_verifiers || 4
                  }}
                  verifications={rthVerifications}
                />
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSubmitVerification}
                    disabled={rthLoading || rthSession.status === 'consensus_reached'}
                  >
                    {rthLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Submit My Verification
                  </Button>
                  
                  {(rthSession.current_verifiers || 0) >= 4 && rthSession.status === 'pending' && (
                    <Button 
                      variant="secondary"
                      onClick={handleCalculateConsensus}
                      disabled={rthLoading}
                    >
                      Calculate Consensus
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ContractPerformance;

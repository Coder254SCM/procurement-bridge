import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface RTHSession {
  id: string;
  status: string;
  confidence_score?: number;
  average_phase?: number;
  circular_variance?: number;
  decision?: string;
  outlier_detected?: boolean;
  outlier_confidence?: number;
  current_verifiers: number;
  required_verifiers: number;
}

export const useRTHConsensus = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSession = async (contractId: string, milestoneId?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rth_verification_sessions')
        .insert({
          contract_id: contractId,
          milestone_id: milestoneId,
          verification_type: 'milestone_completion',
          required_verifiers: 4,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "RTH Session Created",
        description: "Verification session initialized. Awaiting minimum 4 verifiers.",
      });

      return data;
    } catch (error) {
      console.error('Create session error:', error);
      toast({
        title: "Session Creation Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitVerification = async (
    sessionId: string,
    verifierId: string,
    verifiedValue: number,
    verificationData: any,
    comments?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rth-consensus', {
        body: {
          action: 'submit_verification',
          sessionId,
          verifierId,
          verifiedValue,
          verificationData,
          comments
        }
      });

      if (error) throw error;

      toast({
        title: "Verification Submitted",
        description: `${data.currentCount}/${data.requiredCount} verifications received.${
          data.canCalculateConsensus ? ' Consensus can now be calculated.' : ''
        }`,
      });

      return data;
    } catch (error) {
      console.error('Submit verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const calculateConsensus = async (sessionId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rth-consensus', {
        body: {
          action: 'calculate_consensus',
          sessionId
        }
      });

      if (error) throw error;

      const decision = data.consensus.decision;
      
      toast({
        title: `Consensus: ${decision}`,
        description: data.message,
        variant: decision === 'AUTHORIZE' ? 'default' : 'destructive',
      });

      return data;
    } catch (error) {
      console.error('Calculate consensus error:', error);
      toast({
        title: "Consensus Calculation Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('rth_verification_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data as RTHSession;
    } catch (error) {
      console.error('Fetch session error:', error);
      throw error;
    }
  };

  const fetchVerifications = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('rth_verifications')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Fetch verifications error:', error);
      throw error;
    }
  };

  const fetchPhaseMatrix = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('rth_phase_matrix')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Fetch phase matrix error:', error);
      throw error;
    }
  };

  return {
    loading,
    createSession,
    submitVerification,
    calculateConsensus,
    fetchSession,
    fetchVerifications,
    fetchPhaseMatrix
  };
};

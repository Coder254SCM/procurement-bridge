
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  DigitalIdentityVerification, 
  ComplianceCheck, 
  VerificationResult 
} from '@/types/database.types';
import { 
  VerificationType, 
  ComplianceCheckType, 
  VerificationStatus 
} from '@/types/enums';

export function useDigitalIdentity() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<DigitalIdentityVerification[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(VerificationStatus.PENDING);

  const fetchVerificationData = async (userId: string) => {
    setLoading(true);
    try {
      // Fetch identity verification data
      const { data: identityData, error: identityError } = await supabase
        .from('digital_identity_verification')
        .select('*')
        .eq('user_id', userId);

      if (identityError) throw identityError;
      setVerificationData(identityData || []);

      // Fetch compliance checks
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('user_id', userId);

      if (complianceError) throw complianceError;
      setComplianceChecks(complianceData || []);

      // Determine overall verification status
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('verification_status')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setVerificationStatus(profileData?.verification_status || VerificationStatus.PENDING);

    } catch (error) {
      console.error('Error fetching verification data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load verification data",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitBusinessVerification = async (
    userId: string,
    businessId: string,
    verificationType: VerificationType,
    verificationData: any
  ) => {
    setLoading(true);
    try {
      // Create a blockchain hash (simulated for now)
      const blockchainHash = await generateBlockchainHash(businessId, verificationData);

      // Insert verification record
      const { error } = await supabase
        .from('digital_identity_verification')
        .insert({
          user_id: userId,
          business_id: businessId,
          verification_type: verificationType,
          verification_status: VerificationStatus.IN_PROGRESS,
          verification_data: verificationData,
          blockchain_hash: blockchainHash
        });

      if (error) throw error;

      // Update profile verification status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ verification_status: VerificationStatus.IN_PROGRESS })
        .eq('id', userId);

      if (profileError) throw profileError;

      setVerificationStatus(VerificationStatus.IN_PROGRESS);
      
      toast({
        title: "Verification Submitted",
        description: "Your business verification has been submitted for review",
      });

      // Refetch data to update state
      await fetchVerificationData(userId);

    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit verification data",
      });
    } finally {
      setLoading(false);
    }
  };

  const runComplianceCheck = async (
    userId: string,
    checkType: ComplianceCheckType
  ) => {
    setLoading(true);
    try {
      // Get user profile data for the check
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Simulate a compliance check result (in a real app, this would call an external API)
      const checkResult = await simulateComplianceCheck(checkType, profileData);

      // Insert compliance check record
      const { error } = await supabase
        .from('compliance_checks')
        .insert({
          user_id: userId,
          check_type: checkType,
          status: checkResult.passed ? VerificationStatus.VERIFIED : VerificationStatus.FLAGGED,
          result_data: checkResult,
          next_check_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
        });

      if (error) throw error;

      // Update profile risk score if needed
      if (!checkResult.passed) {
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ 
            risk_score: profileData.risk_score ? profileData.risk_score + checkResult.score : checkResult.score 
          })
          .eq('id', userId);

        if (profileUpdateError) throw profileUpdateError;
      }

      toast({
        title: "Compliance Check Complete",
        description: checkResult.passed 
          ? "No issues found in the compliance check" 
          : "Compliance check completed with flags",
        variant: checkResult.passed ? "default" : "destructive"
      });

      // Refetch data to update state
      await fetchVerificationData(userId);

    } catch (error) {
      console.error('Error running compliance check:', error);
      toast({
        variant: "destructive",
        title: "Check Failed",
        description: "Could not complete compliance check",
      });
    } finally {
      setLoading(false);
    }
  };

  // Simulate generating a blockchain hash - in a real application, this would interact with a blockchain
  const generateBlockchainHash = async (businessId: string, data: any): Promise<string> => {
    // This is a simplified simulation for demonstration
    const timestamp = new Date().toISOString();
    const dataString = JSON.stringify({ businessId, data, timestamp });
    
    // Simple hash function for demonstration only - use a proper crypto library in production
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  };

  // Simulate a compliance check - in a real application, this would call external APIs
  const simulateComplianceCheck = async (
    checkType: ComplianceCheckType, 
    profileData: any
  ): Promise<VerificationResult> => {
    // This is a simplified simulation for demonstration
    // In a real application, this would call PEP list APIs, sanctions databases, etc.
    
    // Random result for demo purposes
    const passed = Math.random() > 0.3; // 70% chance of passing
    const score = passed ? 0 : Math.floor(Math.random() * 60) + 20; // Risk score between 20-80 if failed
    
    const result: VerificationResult = {
      passed,
      score,
      details: passed 
        ? `No issues found in ${checkType} check` 
        : `Potential issues identified in ${checkType} check`,
      flags: passed ? [] : [`Sample flag for ${checkType}`],
      timestamp: new Date().toISOString()
    };
    
    return result;
  };

  return {
    loading,
    verificationData,
    complianceChecks,
    verificationStatus,
    fetchVerificationData,
    submitBusinessVerification,
    runComplianceCheck
  };
}

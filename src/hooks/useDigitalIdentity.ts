
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DigitalIdentityVerification, ComplianceCheck, VerificationResult } from '@/types/database.types';
import { VerificationStatus, VerificationType, ComplianceCheckType } from '@/types/enums';

interface UseDigitalIdentityProps {
  userId?: string;
}

export function useDigitalIdentity({ userId }: UseDigitalIdentityProps = {}) {
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<DigitalIdentityVerification[]>([]);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [verificationLevel, setVerificationLevel] = useState<string>('none');
  const [verificationStatus, setVerificationStatus] = useState<string>(VerificationStatus.PENDING);
  // Rename to match what VerificationDashboard expects
  const [verificationData, setVerificationData] = useState<DigitalIdentityVerification[]>([]);
  const { toast } = useToast();

  const fetchVerificationData = async (uid: string) => {
    if (!uid) return;
      
    try {
      setLoading(true);
      
      // Fetch verifications
      const { data: verificationData, error: verificationError } = await supabase
        .from('digital_identity_verification')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });
        
      if (verificationError) throw verificationError;
      
      if (verificationData) {
        setVerifications(verificationData as DigitalIdentityVerification[]);
        setVerificationData(verificationData as DigitalIdentityVerification[]);
      }
      
      // Fetch compliance checks
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_checks')
        .select('*')
        .eq('user_id', uid)
        .order('check_date', { ascending: false });
        
      if (complianceError) throw complianceError;
      
      if (complianceData) {
        setComplianceChecks(complianceData as ComplianceCheck[]);
      }
      
      // Fetch user profile to get verification level
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('verification_level, verification_status')
        .eq('id', uid)
        .single();
        
      if (profileError) throw profileError;
      
      if (profileData) {
        setVerificationLevel(profileData.verification_level || 'none');
        if (profileData.verification_status) {
          setVerificationStatus(profileData.verification_status);
        }
      }
      
    } catch (error) {
      console.error('Error fetching digital identity data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch verification data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchVerificationData(userId);
    }
  }, [userId, toast]);

  const verifyIdentity = async (verificationType: VerificationType, data: any): Promise<VerificationResult> => {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Create a verification record
      const { data: verificationData, error } = await supabase
        .from('digital_identity_verification')
        .insert({
          user_id: userId,
          verification_status: VerificationStatus.PENDING,
          verification_type: verificationType,
          verification_data: data,
          business_id: data.business_id || ''
        })
        .select('id')
        .single();
        
      if (error) throw error;

      // Refresh verification data
      await fetchVerificationData(userId);
      
      return {
        success: true,
        message: 'Verification initiated successfully',
        data: { verificationId: verificationData.id },
        timestamp: new Date().toISOString()
      };
      
    } catch (error: any) {
      console.error('Error initiating verification:', error);
      return {
        success: false,
        message: error.message || 'Failed to initiate verification',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  };

  const submitBusinessVerification = async (uid: string, businessId: string, verificationType: VerificationType, data: any): Promise<VerificationResult> => {
    try {
      // Create a verification record
      const { data: verificationData, error } = await supabase
        .from('digital_identity_verification')
        .insert({
          user_id: uid,
          verification_status: VerificationStatus.PENDING,
          verification_type: verificationType,
          verification_data: data,
          business_id: businessId
        })
        .select('id')
        .single();
        
      if (error) throw error;

      // Refresh verification data
      await fetchVerificationData(uid);
      
      return {
        success: true,
        message: 'Business verification submitted successfully',
        data: { verificationId: verificationData.id },
        timestamp: new Date().toISOString()
      };
      
    } catch (error: any) {
      console.error('Error submitting business verification:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit business verification',
        data: null,
        timestamp: new Date().toISOString()
      };
    }
  };

  const runComplianceCheck = async (uid: string, checkType: ComplianceCheckType): Promise<boolean> => {
    try {
      // Create a compliance check record
      const { error } = await supabase
        .from('compliance_checks')
        .insert({
          user_id: uid,
          status: VerificationStatus.PENDING,
          check_type: checkType,
          check_date: new Date().toISOString(),
          next_check_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),  // 30 days later
          result_data: {}
        });
        
      if (error) throw error;

      // Refresh verification data
      await fetchVerificationData(uid);
      
      toast({
        title: "Compliance Check Initiated",
        description: `${checkType} check has been initiated successfully`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error running compliance check:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || 'Failed to run compliance check',
      });
      return false;
    }
  };

  return {
    loading,
    verifications,
    complianceChecks,
    verificationLevel,
    verificationStatus,
    verificationData,
    fetchVerificationData,
    verifyIdentity,
    submitBusinessVerification,
    runComplianceCheck
  };
}

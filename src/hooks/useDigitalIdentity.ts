
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchIdentityData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // Fetch verifications
        const { data: verificationData, error: verificationError } = await supabase
          .from('digital_identity_verification')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (verificationError) throw verificationError;
        
        if (verificationData) {
          setVerifications(verificationData as DigitalIdentityVerification[]);
        }
        
        // Fetch compliance checks
        const { data: complianceData, error: complianceError } = await supabase
          .from('compliance_checks')
          .select('*')
          .eq('user_id', userId)
          .order('check_date', { ascending: false });
          
        if (complianceError) throw complianceError;
        
        if (complianceData) {
          setComplianceChecks(complianceData as ComplianceCheck[]);
        }
        
        // Fetch user profile to get verification level
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('verification_level')
          .eq('id', userId)
          .single();
          
        if (profileError) throw profileError;
        
        if (profileData) {
          setVerificationLevel(profileData.verification_level || 'none');
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
    
    fetchIdentityData();
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

  return {
    loading,
    verifications,
    complianceChecks,
    verificationLevel,
    verifyIdentity
  };
}

import { useState, useEffect } from 'react';
import { secureApiClient } from '@/services/SecureApiClient';
import { useToast } from '@/hooks/use-toast';

export type TrialType = 'tender_creation' | 'bid_submission' | 'evaluation';

interface TrialModeState {
  isTrialMode: boolean;
  eligibility: Record<TrialType, boolean>;
  hasActiveSubscription: boolean;
  loading: boolean;
  usedTrials: Array<{ trial_type: string; used_at: string }>;
}

export function useTrialMode() {
  const [state, setState] = useState<TrialModeState>({
    isTrialMode: false,
    eligibility: {
      tender_creation: false,
      bid_submission: false,
      evaluation: false
    },
    hasActiveSubscription: false,
    loading: true,
    usedTrials: []
  });

  const { toast } = useToast();

  useEffect(() => {
    checkTrialStatus();
  }, []);

  const checkTrialStatus = async () => {
    try {
      const [trialResponse, subscriptionResponse] = await Promise.all([
        secureApiClient.checkTrialEligibility(),
        secureApiClient.getSubscriptionStatus()
      ]);

      if (trialResponse.error || subscriptionResponse.error) {
        throw new Error(trialResponse.error || subscriptionResponse.error);
      }

      setState({
        isTrialMode: false,
        eligibility: trialResponse.data?.eligibility || {
          tender_creation: false,
          bid_submission: false,
          evaluation: false
        },
        hasActiveSubscription: subscriptionResponse.data?.hasActiveSubscription || false,
        loading: false,
        usedTrials: trialResponse.data?.usedTrials || []
      });
    } catch (error) {
      console.error('Error checking trial status:', error);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const startTrial = (trialType: TrialType) => {
    if (!state.eligibility[trialType]) {
      toast({
        variant: "destructive",
        title: "Trial Not Available",
        description: `You have already used your ${trialType.replace('_', ' ')} trial.`,
      });
      return false;
    }

    setState(prev => ({ ...prev, isTrialMode: true }));
    
    toast({
      title: "Trial Mode Activated",
      description: `You are now in trial mode for ${trialType.replace('_', ' ')}.`,
    });
    
    return true;
  };

  const endTrial = () => {
    setState(prev => ({ ...prev, isTrialMode: false }));
  };

  const refreshTrialStatus = () => {
    setState(prev => ({ ...prev, loading: true }));
    checkTrialStatus();
  };

  const requiresSubscription = () => {
    return !state.hasActiveSubscription && !state.isTrialMode;
  };

  const canAccessFeature = (trialType: TrialType) => {
    return state.hasActiveSubscription || state.eligibility[trialType];
  };

  const getTrialMessage = (trialType: TrialType) => {
    if (state.hasActiveSubscription) {
      return null;
    }

    if (state.eligibility[trialType]) {
      return `Free trial available for ${trialType.replace('_', ' ')}`;
    }

    return `Trial already used for ${trialType.replace('_', ' ')}. Subscription required.`;
  };

  return {
    ...state,
    startTrial,
    endTrial,
    refreshTrialStatus,
    requiresSubscription,
    canAccessFeature,
    getTrialMessage
  };
}
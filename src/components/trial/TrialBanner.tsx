import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Sparkles, Clock, CheckCircle } from 'lucide-react';
import { secureApiClient } from '@/services/SecureApiClient';
import { useToast } from '@/hooks/use-toast';

interface TrialBannerProps {
  onStartTrial?: (trialType: 'tender_creation' | 'bid_submission' | 'evaluation') => void;
  className?: string;
}

export function TrialBanner({ onStartTrial, className }: TrialBannerProps) {
  const [trialStatus, setTrialStatus] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrialStatus();
  }, []);

  const fetchTrialStatus = async () => {
    try {
      const [trialResponse, subscriptionResponse] = await Promise.all([
        secureApiClient.checkTrialEligibility(),
        secureApiClient.getSubscriptionStatus()
      ]);

      if (trialResponse.error) {
        console.error('Trial status error:', trialResponse.error);
        return;
      }

      if (subscriptionResponse.error) {
        console.error('Subscription status error:', subscriptionResponse.error);
        return;
      }

      setTrialStatus(trialResponse);
      setSubscriptionStatus(subscriptionResponse);
    } catch (error) {
      console.error('Error fetching trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTrial = (trialType: 'tender_creation' | 'bid_submission' | 'evaluation') => {
    if (onStartTrial) {
      onStartTrial(trialType);
    } else {
      toast({
        title: "Trial Available",
        description: `Start your free ${trialType.replace('_', ' ')} trial to experience our platform!`,
      });
    }
  };

  const handleUpgrade = () => {
    window.open('/pricing', '_blank');
  };

  if (loading) {
    return (
      <Card className={`border-primary/20 ${className}`}>
        <CardContent className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-muted h-10 w-10"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't show banner if user has active subscription
  if (subscriptionStatus?.hasActiveSubscription) {
    return null;
  }

  const availableTrials = trialStatus?.eligibility ? 
    Object.entries(trialStatus.eligibility).filter(([_, eligible]) => eligible) : [];

  const usedTrials = trialStatus?.usedTrials || [];

  // If no trials available and no subscription
  if (availableTrials.length === 0 && !subscriptionStatus?.hasActiveSubscription) {
    return (
      <Card className={`border-warning/50 bg-warning/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-warning-foreground">Trial Period Expired</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You've used all available trials. Upgrade to continue using our procurement platform.
              </p>
              <div className="mt-3 flex space-x-2">
                <Button onClick={handleUpgrade} size="sm">
                  View Pricing Plans
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show available trials
  if (availableTrials.length > 0) {
    return (
      <Card className={`border-primary/50 bg-primary/5 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-primary-foreground">Free Trial Available</h3>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Limited Time
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Try our procurement platform for free! Experience the full process before subscribing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                {[
                  { type: 'tender_creation', label: 'Create Tender', icon: Clock },
                  { type: 'bid_submission', label: 'Submit Bid', icon: Clock },
                  { type: 'evaluation', label: 'Evaluate Bids', icon: Clock }
                ].map(({ type, label, icon: Icon }) => {
                  const isEligible = trialStatus?.eligibility?.[type];
                  const isUsed = usedTrials.some(trial => trial.trial_type === type);

                  return (
                    <div
                      key={type}
                      className={`flex items-center justify-between p-2 rounded-md border ${
                        isEligible ? 'border-primary/30 bg-primary/10' : 'border-muted bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {isUsed ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <Icon className={`h-4 w-4 ${isEligible ? 'text-primary' : 'text-muted-foreground'}`} />
                        )}
                        <span className={`text-xs font-medium ${
                          isEligible ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}>
                          {label}
                        </span>
                      </div>
                      {isUsed ? (
                        <Badge variant="secondary" className="text-xs">Used</Badge>
                      ) : isEligible ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 px-2 text-xs"
                          onClick={() => handleStartTrial(type as any)}
                        >
                          Try Now
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs">Unavailable</Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleUpgrade} variant="outline" size="sm">
                  View Plans
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
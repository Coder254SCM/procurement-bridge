import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Check, 
  AlertCircle,
  FileText,
  ClipboardList,
  Settings,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WizardStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  isComplete: boolean;
  isValid: boolean;
}

interface SubmissionWizardProps {
  entityType: 'tender' | 'bid' | 'requisition';
  totalSteps: number;
  children: (currentStep: number, goToStep: (step: number) => void) => React.ReactNode;
  onComplete: () => void;
  initialStepData?: Record<number, any>;
  stepTitles?: string[];
  stepDescriptions?: string[];
  stepValidators?: ((stepData: any) => boolean)[];
}

const defaultStepIcons = [
  <FileText className="h-5 w-5" />,
  <ClipboardList className="h-5 w-5" />,
  <Settings className="h-5 w-5" />,
  <Eye className="h-5 w-5" />
];

const SubmissionWizard: React.FC<SubmissionWizardProps> = ({
  entityType,
  totalSteps,
  children,
  onComplete,
  initialStepData = {},
  stepTitles = ['Basic Details', 'Documents', 'Configuration', 'Review'],
  stepDescriptions = [
    'Enter basic information',
    'Upload required documents',
    'Configure settings',
    'Review and submit'
  ],
  stepValidators = []
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<Record<number, any>>(initialStepData);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize wizard steps
  const [steps, setSteps] = useState<WizardStep[]>(() =>
    Array.from({ length: totalSteps }, (_, i) => ({
      id: i + 1,
      title: stepTitles[i] || `Step ${i + 1}`,
      description: stepDescriptions[i] || '',
      icon: defaultStepIcons[i] || <FileText className="h-5 w-5" />,
      isComplete: false,
      isValid: true
    }))
  );

  // Load saved progress on mount
  useEffect(() => {
    loadSavedProgress();
  }, []);

  const loadSavedProgress = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('submission_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('entity_type', entityType)
        .eq('is_draft', true)
        .order('last_saved_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        setProgressId(data.id);
        setCurrentStep(data.current_step);
        setStepData(data.step_data as Record<number, any>);
        
        toast({
          title: 'Draft Restored',
          description: 'Your previous progress has been restored'
        });
      }
    } catch (error) {
      console.error('Error loading saved progress:', error);
    }
  };

  const saveProgress = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const progressData = {
        user_id: user.id,
        entity_type: entityType,
        current_step: currentStep,
        total_steps: totalSteps,
        step_data: stepData,
        is_draft: true,
        last_saved_at: new Date().toISOString()
      };

      if (progressId) {
        await supabase
          .from('submission_progress')
          .update(progressData)
          .eq('id', progressId);
      } else {
        const { data } = await supabase
          .from('submission_progress')
          .insert(progressData)
          .select('id')
          .single();

        if (data) {
          setProgressId(data.id);
        }
      }

      toast({
        title: 'Progress Saved',
        description: 'Your progress has been saved as draft'
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save progress'
      });
    } finally {
      setSaving(false);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Mark current step as complete
      setSteps(prev => prev.map(s => 
        s.id === currentStep ? { ...s, isComplete: true } : s
      ));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    // Mark submission as complete (not draft)
    if (progressId) {
      await supabase
        .from('submission_progress')
        .update({ is_draft: false })
        .eq('id', progressId);
    }
    
    onComplete();
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">
                Step {currentStep} of {totalSteps}: {steps[currentStep - 1]?.title}
              </h3>
              <Badge variant={currentStep === totalSteps ? 'default' : 'outline'}>
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className={`flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === step.id
                    ? 'bg-primary/10 text-primary'
                    : step.isComplete
                    ? 'text-green-600'
                    : 'text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  currentStep === step.id
                    ? 'bg-primary text-primary-foreground'
                    : step.isComplete
                    ? 'bg-green-100 text-green-600'
                    : 'bg-secondary'
                }`}>
                  {step.isComplete ? <Check className="h-5 w-5" /> : step.icon}
                </div>
                <span className="text-xs font-medium hidden md:block">{step.title}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
          <CardDescription>{steps[currentStep - 1]?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {children(currentStep, goToStep)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={saveProgress}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>

              {currentStep === totalSteps ? (
                <Button onClick={handleComplete}>
                  <Check className="h-4 w-4 mr-2" />
                  Complete Submission
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionWizard;

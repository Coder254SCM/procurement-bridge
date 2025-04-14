
import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';

interface VerificationStepsProps {
  steps: string[];
  currentStep: number;
}

export const VerificationSteps = ({ steps, currentStep }: VerificationStepsProps) => {
  return (
    <div className="space-y-2 mt-3">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {index < currentStep ? (
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          ) : index === currentStep ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
          )}
          <span className={`text-sm ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};

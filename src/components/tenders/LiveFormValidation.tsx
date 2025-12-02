import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ValidationRule {
  field: string;
  label: string;
  validate: (formData: any) => { isValid: boolean; message?: string };
}

interface LiveFormValidationProps {
  form: UseFormReturn<any>;
  rules: ValidationRule[];
}

const LiveFormValidation: React.FC<LiveFormValidationProps> = ({ form, rules }) => {
  const formValues = form.watch();

  const getValidationStatus = (rule: ValidationRule) => {
    const result = rule.validate(formValues);
    return result;
  };

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Form Validation Status
      </h4>
      <div className="space-y-1.5">
        {rules.map((rule) => {
          const status = getValidationStatus(rule);
          return (
            <div
              key={rule.field}
              className={cn(
                "flex items-center gap-2 text-sm p-2 rounded-md transition-colors",
                status.isValid
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              )}
            >
              {status.isValid ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span className="flex-1">{rule.label}</span>
              {!status.isValid && status.message && (
                <span className="text-xs opacity-75">{status.message}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveFormValidation;

// Common validation rules for tender forms
export const tenderFormValidationRules: ValidationRule[] = [
  {
    field: 'title',
    label: 'Title (minimum 5 characters)',
    validate: (data) => ({
      isValid: !!data.title && data.title.length >= 5,
      message: data.title ? `${data.title.length}/5 characters` : 'Required'
    })
  },
  {
    field: 'description',
    label: 'Description (minimum 20 characters)',
    validate: (data) => ({
      isValid: !!data.description && data.description.length >= 20,
      message: data.description ? `${data.description.length}/20 characters` : 'Required'
    })
  },
  {
    field: 'category',
    label: 'Category selected',
    validate: (data) => ({
      isValid: !!data.category && data.category.length > 0,
      message: 'Select a category'
    })
  },
  {
    field: 'budget_amount',
    label: 'Budget amount (positive number)',
    validate: (data) => ({
      isValid: !!data.budget_amount && data.budget_amount > 0,
      message: 'Enter valid amount'
    })
  },
  {
    field: 'submission_deadline',
    label: 'Submission deadline (future date)',
    validate: (data) => {
      if (!data.submission_deadline) {
        return { isValid: false, message: 'Select deadline' };
      }
      const deadline = new Date(data.submission_deadline);
      const now = new Date();
      return {
        isValid: deadline > now,
        message: deadline <= now ? 'Must be future date' : undefined
      };
    }
  },
  {
    field: 'evaluation_criteria',
    label: 'Evaluation criteria total 100%',
    validate: (data) => {
      if (!data.evaluation_criteria) {
        return { isValid: false, message: 'Set criteria weights' };
      }
      const total = Object.values(data.evaluation_criteria as Record<string, number>)
        .reduce((sum, val) => sum + val, 0);
      return {
        isValid: total === 100,
        message: `Current: ${total}%`
      };
    }
  }
];

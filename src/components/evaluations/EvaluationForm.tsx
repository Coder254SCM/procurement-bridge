
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EvaluationCriteriaCategory } from '@/types/enums';
import { EvaluationCriteriaScores, Evaluation } from '@/types/database.types';

interface EvaluationFormProps {
  score: number;
  comments: string;
  recommendation: string;
  isReadOnly: boolean;
  submitting: boolean;
  existingEvaluation: Evaluation | null;
  criteriaScores?: EvaluationCriteriaScores;
  justification?: string;
  onScoreChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
  onRecommendationChange: (value: string) => void;
  onCriteriaScoreChange?: (category: string, value: number) => void;
  onJustificationChange?: (value: string) => void;
  onSubmit: () => void;
}

// Group evaluation criteria by category for better organization
const criteriaGroups = {
  financial: [
    { key: EvaluationCriteriaCategory.PRICE_COMPETITIVENESS, label: 'Price Competitiveness' },
    { key: EvaluationCriteriaCategory.FINANCIAL_STABILITY, label: 'Financial Stability' },
    { key: EvaluationCriteriaCategory.COST_EFFECTIVENESS, label: 'Cost Effectiveness' },
    { key: EvaluationCriteriaCategory.LIFECYCLE_COSTS, label: 'Lifecycle Costs' },
    { key: EvaluationCriteriaCategory.PAYMENT_TERMS, label: 'Payment Terms' },
  ],
  technical: [
    { key: EvaluationCriteriaCategory.TECHNICAL_CAPABILITY, label: 'Technical Capability' },
    { key: EvaluationCriteriaCategory.METHODOLOGY, label: 'Methodology' },
    { key: EvaluationCriteriaCategory.INNOVATION, label: 'Innovation' },
    { key: EvaluationCriteriaCategory.QUALITY_STANDARDS, label: 'Quality Standards' },
    { key: EvaluationCriteriaCategory.TECHNICAL_COMPLIANCE, label: 'Technical Compliance' },
  ],
  experience: [
    { key: EvaluationCriteriaCategory.RELEVANT_EXPERIENCE, label: 'Relevant Experience' },
    { key: EvaluationCriteriaCategory.PAST_PERFORMANCE, label: 'Past Performance' },
    { key: EvaluationCriteriaCategory.QUALIFICATIONS, label: 'Qualifications' },
    { key: EvaluationCriteriaCategory.INDUSTRY_EXPERTISE, label: 'Industry Expertise' },
    { key: EvaluationCriteriaCategory.KEY_PERSONNEL, label: 'Key Personnel' },
    { key: EvaluationCriteriaCategory.PROJECT_MANAGEMENT, label: 'Project Management' },
  ],
  operational: [
    { key: EvaluationCriteriaCategory.DELIVERY_TIMEFRAME, label: 'Delivery Timeframe' },
    { key: EvaluationCriteriaCategory.IMPLEMENTATION_PLAN, label: 'Implementation Plan' },
    { key: EvaluationCriteriaCategory.OPERATIONAL_CAPACITY, label: 'Operational Capacity' },
    { key: EvaluationCriteriaCategory.QUALITY_ASSURANCE, label: 'Quality Assurance' },
    { key: EvaluationCriteriaCategory.SERVICE_LEVEL_AGREEMENTS, label: 'Service Level Agreements' },
  ],
  compliance: [
    { key: EvaluationCriteriaCategory.LEGAL_COMPLIANCE, label: 'Legal Compliance' },
    { key: EvaluationCriteriaCategory.REGULATORY_COMPLIANCE, label: 'Regulatory Compliance' },
    { key: EvaluationCriteriaCategory.RISK_MANAGEMENT, label: 'Risk Management' },
    { key: EvaluationCriteriaCategory.INSURANCE_COVERAGE, label: 'Insurance Coverage' },
    { key: EvaluationCriteriaCategory.SECURITY_MEASURES, label: 'Security Measures' },
  ],
  sustainability: [
    { key: EvaluationCriteriaCategory.ENVIRONMENTAL_SUSTAINABILITY, label: 'Environmental Sustainability' },
    { key: EvaluationCriteriaCategory.SOCIAL_RESPONSIBILITY, label: 'Social Responsibility' },
    { key: EvaluationCriteriaCategory.LOCAL_CONTENT, label: 'Local Content' },
    { key: EvaluationCriteriaCategory.DIVERSITY_INCLUSION, label: 'Diversity & Inclusion' },
    { key: EvaluationCriteriaCategory.COMMUNITY_IMPACT, label: 'Community Impact' },
  ],
  contract: [
    { key: EvaluationCriteriaCategory.WARRANTY_TERMS, label: 'Warranty Terms' },
    { key: EvaluationCriteriaCategory.AFTER_SALES_SUPPORT, label: 'After-Sales Support' },
    { key: EvaluationCriteriaCategory.MAINTENANCE_CAPABILITY, label: 'Maintenance Capability' },
    { key: EvaluationCriteriaCategory.INTELLECTUAL_PROPERTY, label: 'Intellectual Property' },
    { key: EvaluationCriteriaCategory.CONTRACT_TERMS_ACCEPTANCE, label: 'Contract Terms Acceptance' },
  ],
};

const EvaluationFormComponent: React.FC<EvaluationFormProps> = ({
  score,
  comments,
  recommendation,
  isReadOnly,
  submitting,
  existingEvaluation,
  criteriaScores = {},
  justification = '',
  onScoreChange,
  onCommentsChange,
  onRecommendationChange,
  onCriteriaScoreChange = () => {},
  onJustificationChange = () => {},
  onSubmit
}) => {
  const [showDetailedCriteria, setShowDetailedCriteria] = useState(false);

  // Calculate average score from criteria if available
  const calculateAverageScore = () => {
    if (!criteriaScores || Object.keys(criteriaScores).length === 0) return score;
    
    const values = Object.values(criteriaScores).filter(value => typeof value === 'number') as number[];
    if (values.length === 0) return score;
    
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isReadOnly ? 'Your Evaluation' : 'Submit Your Evaluation'}</CardTitle>
        <CardDescription>
          {isReadOnly 
            ? 'You have already evaluated this bid' 
            : 'Evaluate this bid based on your expertise'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium">Overall Score (1-10)</h3>
          <div className="flex items-center gap-4">
            <Slider
              defaultValue={[score]}
              max={10}
              step={1}
              onValueChange={(value) => onScoreChange(value[0])}
              disabled={isReadOnly}
              className="flex-1"
            />
            <span className="font-bold text-lg min-w-10 text-center">{score}/10</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setShowDetailedCriteria(!showDetailedCriteria)}
          disabled={isReadOnly}
        >
          <span>Detailed Evaluation Criteria</span>
          {showDetailedCriteria ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showDetailedCriteria && (
          <Accordion type="multiple" className="w-full">
            {Object.entries(criteriaGroups).map(([groupKey, criteria]) => (
              <AccordionItem value={groupKey} key={groupKey}>
                <AccordionTrigger className="capitalize font-medium">
                  {groupKey} Criteria
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    {criteria.map((criterion) => (
                      <div key={criterion.key} className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor={criterion.key}>{criterion.label}</Label>
                          <span className="text-sm font-medium">
                            {criteriaScores[criterion.key as keyof typeof criteriaScores] || 0}/10
                          </span>
                        </div>
                        <Slider
                          id={criterion.key}
                          defaultValue={[criteriaScores[criterion.key as keyof typeof criteriaScores] || 0]}
                          max={10}
                          step={1}
                          onValueChange={(value) => onCriteriaScoreChange(criterion.key, value[0])}
                          disabled={isReadOnly}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
        
        <div className="space-y-2">
          <h3 className="font-medium">Justification for Scores</h3>
          <Textarea
            placeholder="Explain your reasoning for the scores given..."
            value={justification}
            onChange={(e) => onJustificationChange(e.target.value)}
            disabled={isReadOnly}
            className="min-h-24"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Detailed Comments</h3>
          <Textarea
            placeholder="Provide your professional assessment of this bid..."
            value={comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            disabled={isReadOnly}
            className="min-h-32"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Recommendation</h3>
          <RadioGroup 
            value={recommendation} 
            onValueChange={onRecommendationChange}
            disabled={isReadOnly}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="accept" id="accept" />
              <Label htmlFor="accept">Accept</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reject" id="reject" />
              <Label htmlFor="reject">Reject</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="request_more_info" id="request_more_info" />
              <Label htmlFor="request_more_info">Request More Information</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shortlist" id="shortlist" />
              <Label htmlFor="shortlist">Shortlist for Further Consideration</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        {isReadOnly ? (
          <div className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Evaluation submitted on {new Date(existingEvaluation?.created_at || '').toLocaleDateString()}</span>
          </div>
        ) : (
          <Button 
            onClick={onSubmit} 
            disabled={submitting || score === 0 || !recommendation}
            className="ml-auto"
          >
            {submitting ? 'Submitting...' : 'Submit Evaluation'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EvaluationFormComponent;

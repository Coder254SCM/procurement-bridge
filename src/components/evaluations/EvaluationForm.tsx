
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface EvaluationFormProps {
  score: number;
  comments: string;
  recommendation: string;
  isReadOnly: boolean;
  submitting: boolean;
  existingEvaluation: any;
  onScoreChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
  onRecommendationChange: (value: string) => void;
  onSubmit: () => void;
}

const EvaluationFormComponent: React.FC<EvaluationFormProps> = ({
  score,
  comments,
  recommendation,
  isReadOnly,
  submitting,
  existingEvaluation,
  onScoreChange,
  onCommentsChange,
  onRecommendationChange,
  onSubmit
}) => {
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
          <h3 className="font-medium">Score (1-10)</h3>
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
        
        <div className="space-y-2">
          <h3 className="font-medium">Comments</h3>
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

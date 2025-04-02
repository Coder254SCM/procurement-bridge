
import React from 'react';
import { ListFilter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EvaluationCriteria } from '@/types/database.types';

interface EvaluationCriteriaFormProps {
  evaluationCriteria: EvaluationCriteria;
  onCriteriaChange: (criterion: string, value: number) => void;
}

const EvaluationCriteriaForm = ({ 
  evaluationCriteria, 
  onCriteriaChange 
}: EvaluationCriteriaFormProps) => {
  const totalWeight = Object.values(evaluationCriteria).reduce((a, b) => a + b, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListFilter className="mr-2 h-5 w-5" />
          Evaluation Criteria
        </CardTitle>
        <CardDescription>
          Define how bids will be evaluated by allocating percentage weights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm mb-4">
            Total allocation must equal 100%. Adjust the sliders to set the importance of each criterion.
          </p>
          
          {Object.entries(evaluationCriteria).map(([criterion, weight]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium capitalize">{criterion}</label>
                <span className="text-sm">{weight}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weight} 
                onChange={(e) => onCriteriaChange(criterion, parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          ))}
          
          <div className="flex justify-between pt-4 border-t">
            <span className="font-medium">Total:</span>
            <span className={
              totalWeight === 100 
                ? "font-medium" 
                : "font-medium text-destructive"
            }>
              {totalWeight}%
            </span>
          </div>
          
          {totalWeight !== 100 && (
            <p className="text-sm text-destructive">
              Criteria weights must sum to exactly 100%.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCriteriaForm;

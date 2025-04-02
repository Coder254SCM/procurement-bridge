
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10">
            <ListFilter className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Evaluation Criteria</CardTitle>
            <CardDescription>
              Define how bids will be evaluated by allocating percentage weights
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm mb-4 p-3 bg-secondary/30 rounded-md">
            Total allocation must equal 100%. Adjust the sliders to set the importance of each criterion.
          </p>
          
          {Object.entries(evaluationCriteria).map(([criterion, weight]) => (
            <div key={criterion} className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium capitalize">{criterion}</label>
                <span className="text-sm font-semibold">{weight}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={weight} 
                onChange={(e) => onCriteriaChange(criterion, parseInt(e.target.value))}
                className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
          
          <div className="flex justify-between pt-4 mt-4 border-t">
            <span className="font-medium">Total:</span>
            <span className={
              totalWeight === 100 
                ? "font-medium text-green-600" 
                : "font-medium text-destructive"
            }>
              {totalWeight}%
            </span>
          </div>
          
          {totalWeight !== 100 && (
            <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md mt-2">
              Criteria weights must sum to exactly 100%.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCriteriaForm;


import React, { useState } from 'react';
import { ListFilter, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EvaluationCriteria } from '@/types/database.types';
import { criteriaGroups } from '@/utils/evaluationCriteria';
import CriteriaGroupSection from './CriteriaGroupSection';

interface EvaluationCriteriaFormProps {
  evaluationCriteria: EvaluationCriteria;
  onCriteriaChange: (criterion: string, value: number) => void;
}

const EvaluationCriteriaForm = ({ 
  evaluationCriteria, 
  onCriteriaChange 
}: EvaluationCriteriaFormProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const totalWeight = Object.values(evaluationCriteria).reduce((a, b) => a + (b || 0), 0);
  
  const filteredGroups = criteriaGroups.map(group => ({
    ...group,
    criteria: group.criteria.filter(criterion =>
      criterion.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(group => group.criteria.length > 0);

  const clearAllCriteria = () => {
    Object.keys(evaluationCriteria).forEach(key => {
      onCriteriaChange(key, 0);
    });
  };

  const distributeEqually = () => {
    const allCriteria = criteriaGroups.flatMap(g => g.criteria);
    const equalValue = Math.floor(100 / allCriteria.length * 10) / 10;
    
    allCriteria.forEach(criterion => {
      onCriteriaChange(criterion.value, equalValue);
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <ListFilter className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Evaluation Criteria</CardTitle>
              <CardDescription>
                Define how bids will be evaluated by allocating percentage weights across ~200 criteria
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearAllCriteria}
            >
              Clear All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={distributeEqually}
            >
              Equal Distribution
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total allocation must equal 100%. Use category sections to organize and allocate weights efficiently.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Total:</span>
                <span className={`text-lg font-bold ${
                  Math.abs(totalWeight - 100) < 0.1
                    ? "text-green-600" 
                    : "text-destructive"
                }`}>
                  {totalWeight.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {Math.abs(totalWeight - 100) >= 0.1 && (
              <p className="text-sm text-destructive p-2 bg-destructive/10 rounded-md">
                ⚠ Criteria weights must sum to exactly 100%. Current total: {totalWeight.toFixed(1)}%
              </p>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search criteria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="space-y-3">
            {filteredGroups.map((group) => (
              <CriteriaGroupSection
                key={group.key}
                group={group}
                values={evaluationCriteria}
                onValueChange={onCriteriaChange}
              />
            ))}
          </div>

          {filteredGroups.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No criteria found matching "{searchQuery}"
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationCriteriaForm;

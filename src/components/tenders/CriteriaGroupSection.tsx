import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CriteriaGroup } from '@/utils/evaluationCriteria';

interface CriteriaGroupSectionProps {
  group: CriteriaGroup;
  values: Record<string, number>;
  onValueChange: (criterion: string, value: number) => void;
}

const CriteriaGroupSection: React.FC<CriteriaGroupSectionProps> = ({
  group,
  values,
  onValueChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const groupTotal = group.criteria.reduce((sum, criterion) => {
    return sum + (values[criterion.value] || 0);
  }, 0);

  const setAllInGroup = (value: number) => {
    group.criteria.forEach(criterion => {
      onValueChange(criterion.value, value);
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg">
      <div className="flex items-center justify-between p-4 bg-muted/30">
        <div className="flex items-center gap-4 flex-1">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <div className="flex-1">
            <h3 className="font-semibold text-base">{group.name}</h3>
            <p className="text-sm text-muted-foreground">{group.criteria.length} criteria</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-semibold text-sm ${groupTotal > 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              Total: {groupTotal.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setAllInGroup(0)}
            className="text-xs h-7"
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const equalValue = Math.floor(100 / group.criteria.length * 10) / 10;
              setAllInGroup(equalValue);
            }}
            className="text-xs h-7"
          >
            Equal Split
          </Button>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 space-y-4 border-t">
          {group.criteria.map((criterion) => (
            <div key={criterion.value} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-foreground/90">
                  {criterion.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={values[criterion.value] || 0}
                    onChange={(e) => onValueChange(criterion.value, parseFloat(e.target.value) || 0)}
                    className="w-16 h-8 text-sm text-center border rounded px-2"
                  />
                  <span className="text-sm font-semibold w-6">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={values[criterion.value] || 0}
                onChange={(e) => onValueChange(criterion.value, parseFloat(e.target.value))}
                className="w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CriteriaGroupSection;

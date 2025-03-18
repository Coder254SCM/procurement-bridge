
import React from 'react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDateRangePicker } from '@/components/evaluations/DateRangePicker';

interface FilterSectionProps {
  category: string;
  categories: string[];
  dateRange?: DateRange;
  onCategoryChange: (value: string) => void;
  onDateChange: (date: DateRange | undefined) => void;
  onClearFilters: () => void;
  showClearButton: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  category,
  categories,
  dateRange,
  onCategoryChange,
  onDateChange,
  onClearFilters,
  showClearButton
}) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <CalendarDateRangePicker 
          date={dateRange}
          onDateChange={onDateChange}
        />
      </div>
      
      {showClearButton && (
        <Button 
          variant="ghost" 
          onClick={onClearFilters}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterSection;

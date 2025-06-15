
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface AnalyticsHeaderProps {
  period: string;
  onPeriodChange: (value: string) => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ period, onPeriodChange }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
      <div>
        <h1 className="text-3xl font-semibold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive procurement insights and performance metrics</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsHeader;

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface KpiMetric {
  id: number;
  name: string;
  value: string | number;
  change: number;
  status: 'increase' | 'decrease' | 'neutral';
}

interface KpiCardsProps {
  metrics: KpiMetric[];
  isLoading?: boolean;
}

const KpiCards: React.FC<KpiCardsProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2 pt-4">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pb-4">
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center mt-1">
              {metric.status === 'increase' ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : metric.status === 'decrease' ? (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <Minus className="h-4 w-4 text-muted-foreground mr-1" />
              )}
              <span className={`text-xs ${
                metric.status === 'increase' ? 'text-green-500' : 
                metric.status === 'decrease' ? 'text-red-500' : 
                'text-muted-foreground'
              }`}>
                {metric.change}% {metric.status === 'neutral' ? 'no change' : metric.status}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

export interface KpiMetric {
  id: number;
  name: string;
  value: string | number;
  change: number;
  status: 'increase' | 'decrease';
}

interface KpiCardsProps {
  metrics: KpiMetric[];
}

const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
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
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs ${metric.status === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change}% {metric.status === 'increase' ? 'increase' : 'decrease'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;

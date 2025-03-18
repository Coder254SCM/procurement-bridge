
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EvaluationHeaderProps {
  title: string;
  bidId: string;
  createdAt: string;
  isEvaluated: boolean;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  title,
  bidId,
  createdAt,
  isEvaluated
}) => {
  return (
    <>
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/evaluations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Evaluations
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-muted-foreground">
            Bid #{bidId.slice(0, 8)} • {new Date(createdAt).toLocaleDateString()}
          </p>
          {isEvaluated && (
            <Badge variant="secondary" className="ml-2">Previously Evaluated</Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default EvaluationHeader;

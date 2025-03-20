
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EvaluationNotFound: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Bid Not Found</h1>
        <p className="mb-8">The bid you're looking for could not be found.</p>
        <Button asChild>
          <Link to="/evaluations">Back to Evaluations</Link>
        </Button>
      </div>
    </div>
  );
};

export default EvaluationNotFound;

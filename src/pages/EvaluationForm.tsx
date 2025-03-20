
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEvaluationData } from '@/hooks/useEvaluationData';
import EvaluationLoader from '@/components/evaluations/EvaluationLoader';
import EvaluationNotFound from '@/components/evaluations/EvaluationNotFound';
import EvaluationContent from '@/components/evaluations/EvaluationContent';

const EvaluationForm: React.FC = () => {
  const { bidId } = useParams<{ bidId: string }>();
  const {
    loading,
    submitting,
    userRoles,
    bid,
    existingEvaluation,
    score,
    comments,
    recommendation,
    criteriaScores,
    justification,
    setScore,
    setComments,
    setRecommendation,
    setJustification,
    handleCriteriaScoreChange,
    handleSubmitEvaluation
  } = useEvaluationData(bidId);

  if (loading) {
    return <EvaluationLoader />;
  }

  if (!bid) {
    return <EvaluationNotFound />;
  }

  return (
    <EvaluationContent
      bid={bid}
      userRoles={userRoles}
      existingEvaluation={existingEvaluation}
      submitting={submitting}
      score={score}
      comments={comments}
      recommendation={recommendation}
      criteriaScores={criteriaScores}
      justification={justification}
      onScoreChange={setScore}
      onCommentsChange={setComments}
      onRecommendationChange={setRecommendation}
      onCriteriaScoreChange={handleCriteriaScoreChange}
      onJustificationChange={setJustification}
      onSubmit={handleSubmitEvaluation}
    />
  );
};

export default EvaluationForm;

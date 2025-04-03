
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bid, Evaluation, EvaluationCriteriaScores } from '@/types/database.types';
import { ProcurementMethod } from '@/types/enums';
import EvaluationHeader from '@/components/evaluations/EvaluationHeader';
import BidSummaryCards from '@/components/evaluations/BidSummaryCards';
import TenderDetailCards from '@/components/evaluations/TenderDetailCards';
import EvaluationFormComponent from '@/components/evaluations/EvaluationForm';
import ProcurementMethodInfo from '@/components/evaluations/ProcurementMethodInfo';

interface EvaluationContentProps {
  bid: Bid;
  userRoles: string[];
  existingEvaluation: Evaluation | null;
  submitting: boolean;
  score: number;
  comments: string;
  recommendation: string;
  criteriaScores: EvaluationCriteriaScores;
  justification: string;
  onScoreChange: (value: number) => void;
  onCommentsChange: (value: string) => void;
  onRecommendationChange: (value: string) => void;
  onCriteriaScoreChange: (category: string, value: number) => void;
  onJustificationChange: (value: string) => void;
  onSubmit: () => void;
}

const EvaluationContent: React.FC<EvaluationContentProps> = ({
  bid,
  userRoles,
  existingEvaluation,
  submitting,
  score,
  comments,
  recommendation,
  criteriaScores,
  justification,
  onScoreChange,
  onCommentsChange,
  onRecommendationChange,
  onCriteriaScoreChange,
  onJustificationChange,
  onSubmit
}) => {
  const [activeTab, setActiveTab] = useState('evaluation');
  const evaluatorType = userRoles.find(role => role.includes('evaluator_'))?.replace('evaluator_', '') || '';
  const procurementMethod = bid.tender?.procurement_method || ProcurementMethod.OPEN_TENDER;
  
  // Determine risk level based on procurement method
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  if (procurementMethod === ProcurementMethod.OPEN_TENDER) {
    riskLevel = 'low';
  } else if (procurementMethod === ProcurementMethod.DIRECT_PROCUREMENT) {
    riskLevel = 'high';
  }

  // Generate description based on procurement method
  const methodDescription = `This procurement follows the ${procurementMethod.replace(/_/g, ' ')} methodology as defined in the procurement policy.`;

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <EvaluationHeader 
          title={bid?.tender?.title || 'Untitled Tender'} 
          bidId={bid?.id || ''} 
          createdAt={bid?.created_at || ''} 
          isEvaluated={!!existingEvaluation}
        />
        
        <BidSummaryCards 
          bidAmount={bid?.bid_amount || 0}
          budgetAmount={bid?.tender?.budget_amount || 0}
          budgetCurrency={bid?.tender?.budget_currency || 'KES'}
          supplierName={bid?.supplier?.full_name || 'Unknown'}
          supplierCompany={bid?.supplier?.company_name || 'Unknown Company'}
          category={bid?.tender?.category || 'Unknown'}
          evaluatorType={evaluatorType}
        />

        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="evaluation">Evaluation Form</TabsTrigger>
              <TabsTrigger value="details">Tender Details</TabsTrigger>
              <TabsTrigger value="method">Procurement Method</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluation" className="mt-6">
              <EvaluationFormComponent 
                score={score}
                comments={comments}
                recommendation={recommendation}
                isReadOnly={!!existingEvaluation}
                submitting={submitting}
                existingEvaluation={existingEvaluation}
                criteriaScores={criteriaScores}
                justification={justification}
                onScoreChange={onScoreChange}
                onCommentsChange={onCommentsChange}
                onRecommendationChange={onRecommendationChange}
                onCriteriaScoreChange={onCriteriaScoreChange}
                onJustificationChange={onJustificationChange}
                onSubmit={onSubmit}
              />
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <TenderDetailCards 
                description={bid?.tender?.description}
                technicalDetails={bid?.technical_details}
                documents={bid?.documents}
              />
            </TabsContent>
            
            <TabsContent value="method" className="mt-6">
              <ProcurementMethodInfo 
                method={procurementMethod} 
                description={methodDescription}
                riskLevel={riskLevel}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EvaluationContent;

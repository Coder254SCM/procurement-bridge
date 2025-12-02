import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface FairnessMetrics {
  supplierAccessibility: number;
  requirementClarity: number;
  timelineAdequacy: number;
  evaluationTransparency: number;
  budgetRealism: number;
  overallFairness: number;
}

interface TenderFairnessAnalyzerProps {
  tenderData: {
    title: string;
    description: string;
    budget_amount: number;
    submission_deadline: Date;
    evaluation_criteria: Record<string, number>;
    required_documents: string[];
  };
}

const TenderFairnessAnalyzer: React.FC<TenderFairnessAnalyzerProps> = ({ tenderData }) => {
  // Calculate fairness metrics
  const calculateFairnessMetrics = (): FairnessMetrics => {
    const now = new Date();
    const deadline = new Date(tenderData.submission_deadline);
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Supplier Accessibility (based on requirements complexity)
    const supplierAccessibility = Math.min(100, 100 - (tenderData.required_documents.length * 3));
    
    // Requirement Clarity (based on description length and detail)
    const requirementClarity = Math.min(100, (tenderData.description.length / 20));
    
    // Timeline Adequacy (based on days until deadline and complexity)
    const timelineAdequacy = Math.min(100, Math.max(0, (daysUntilDeadline / 30) * 100));
    
    // Evaluation Transparency (based on criteria clarity)
    const criteriaCount = Object.keys(tenderData.evaluation_criteria).length;
    const evaluationTransparency = Math.min(100, criteriaCount * 15);
    
    // Budget Realism (basic check - can be enhanced with market data)
    const budgetRealism = tenderData.budget_amount > 0 ? 85 : 0;
    
    // Overall Fairness Score
    const overallFairness = Math.round(
      (supplierAccessibility + requirementClarity + timelineAdequacy + evaluationTransparency + budgetRealism) / 5
    );
    
    return {
      supplierAccessibility,
      requirementClarity,
      timelineAdequacy,
      evaluationTransparency,
      budgetRealism,
      overallFairness
    };
  };

  const metrics = calculateFairnessMetrics();

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): JSX.Element => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if (metrics.supplierAccessibility < 70) {
      recommendations.push("Consider reducing the number of required documents to increase supplier participation");
    }
    if (metrics.requirementClarity < 70) {
      recommendations.push("Add more detailed descriptions and specifications to improve clarity");
    }
    if (metrics.timelineAdequacy < 70) {
      recommendations.push("Extend the submission deadline to give suppliers adequate preparation time");
    }
    if (metrics.evaluationTransparency < 70) {
      recommendations.push("Add more specific evaluation criteria to improve transparency");
    }
    if (metrics.budgetRealism < 70) {
      recommendations.push("Review budget allocation to ensure it's realistic for market conditions");
    }
    
    if (recommendations.length === 0) {
      recommendations.push("This tender meets high fairness standards for both buyers and suppliers");
    }
    
    return recommendations;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Tender Fairness Analysis
        </CardTitle>
        <CardDescription>
          Real-time analysis to ensure fairness for both buyers and suppliers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="p-4 bg-secondary/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">Overall Fairness Score</h3>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(metrics.overallFairness)}`}>
                {metrics.overallFairness}%
              </span>
              {getScoreBadge(metrics.overallFairness)}
            </div>
          </div>
          <Progress value={metrics.overallFairness} className="h-2" />
        </div>

        {/* Individual Metrics */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Supplier Accessibility</span>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.supplierAccessibility)}`}>
                {metrics.supplierAccessibility}%
              </span>
            </div>
            <Progress value={metrics.supplierAccessibility} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Measures ease of participation for suppliers
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Requirement Clarity</span>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.requirementClarity)}`}>
                {metrics.requirementClarity}%
              </span>
            </div>
            <Progress value={metrics.requirementClarity} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Clarity and completeness of specifications
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Timeline Adequacy</span>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.timelineAdequacy)}`}>
                {metrics.timelineAdequacy}%
              </span>
            </div>
            <Progress value={metrics.timelineAdequacy} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Sufficient time for quality bid preparation
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Evaluation Transparency</span>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.evaluationTransparency)}`}>
                {metrics.evaluationTransparency}%
              </span>
            </div>
            <Progress value={metrics.evaluationTransparency} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Clear and objective evaluation criteria
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Budget Realism</span>
              <span className={`text-sm font-semibold ${getScoreColor(metrics.budgetRealism)}`}>
                {metrics.budgetRealism}%
              </span>
            </div>
            <Progress value={metrics.budgetRealism} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              Realistic budget for market conditions
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Recommendations
          </h4>
          {getRecommendations().map((recommendation, index) => (
            <Alert key={index} className="py-2">
              {metrics.overallFairness >= 80 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <AlertDescription className="text-sm ml-2">
                {recommendation}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TenderFairnessAnalyzer;

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  Users,
  FileText,
  CreditCard,
  Shield,
  Target,
  RefreshCw,
  Lightbulb,
  BarChart3
} from 'lucide-react';
import { usePredictiveAnalytics, PredictionResult } from '@/hooks/usePredictiveAnalytics';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

const PredictiveAnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { isBuyer, isSupplier } = useUserRole();
  const { loading, predictions, fetchPredictions } = usePredictiveAnalytics();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchPredictions('all', user.id, isBuyer ? 'buyer' : 'supplier');
    }
  }, [user, isBuyer]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'very_low': return 'bg-green-100 text-green-800 border-green-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'very_high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'very_low':
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'high':
      case 'very_high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'supplier_churn':
      case 'buyer_churn':
        return <Users className="h-6 w-6" />;
      case 'bid_success':
        return <Target className="h-6 w-6" />;
      case 'payment_delay':
        return <CreditCard className="h-6 w-6" />;
      case 'contract_completion':
        return <FileText className="h-6 w-6" />;
      case 'fraud_risk':
        return <Shield className="h-6 w-6" />;
      default:
        return <Brain className="h-6 w-6" />;
    }
  };

  const getPredictionTitle = (type: string) => {
    switch (type) {
      case 'supplier_churn': return 'Supplier Churn Risk';
      case 'buyer_churn': return 'Buyer Churn Risk';
      case 'bid_success': return 'Bid Success Probability';
      case 'payment_delay': return 'Payment Delay Risk';
      case 'contract_completion': return 'Contract Completion';
      case 'fraud_risk': return 'Fraud Risk Assessment';
      default: return type;
    }
  };

  const renderPredictionCard = (prediction: PredictionResult) => {
    const isPositiveMetric = ['bid_success', 'contract_completion'].includes(prediction.prediction_type);
    const displayProbability = prediction.probability * 100;
    
    return (
      <Card key={prediction.prediction_type} className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                {getPredictionIcon(prediction.prediction_type)}
              </div>
              <div>
                <CardTitle className="text-base">{getPredictionTitle(prediction.prediction_type)}</CardTitle>
                <CardDescription className="text-xs">
                  Confidence: {(prediction.confidence * 100).toFixed(0)}%
                </CardDescription>
              </div>
            </div>
            <Badge className={`${getRiskColor(prediction.risk_level)} border`}>
              {prediction.risk_level.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Probability Meter */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">
                  {isPositiveMetric ? 'Success Probability' : 'Risk Probability'}
                </span>
                <span className={`text-lg font-bold ${
                  isPositiveMetric 
                    ? displayProbability > 50 ? 'text-green-600' : 'text-amber-600'
                    : displayProbability > 50 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {displayProbability.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={displayProbability} 
                className={`h-2 ${
                  isPositiveMetric 
                    ? displayProbability > 50 ? '[&>div]:bg-green-500' : '[&>div]:bg-amber-500'
                    : displayProbability > 50 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'
                }`}
              />
            </div>

            {/* Top Contributing Factors */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Key Factors
              </h4>
              <div className="space-y-2">
                {prediction.contributing_factors.slice(0, 3).map((factor, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{factor.factor}</span>
                    <span className="font-medium">{factor.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {prediction.recommendations.length > 0 && (
              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Recommendations
                </h4>
                <ul className="space-y-1">
                  {prediction.recommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                      <span className="text-primary mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate overall risk score
  const overallRiskScore = predictions.length > 0
    ? predictions.reduce((sum, p) => {
        const isRisk = !['bid_success', 'contract_completion'].includes(p.prediction_type);
        return sum + (isRisk ? p.probability : 1 - p.probability);
      }, 0) / predictions.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            Predictive Analytics
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            ML-powered predictions for procurement risk and opportunity analysis
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => fetchPredictions('all', user?.id, isBuyer ? 'buyer' : 'supplier')}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                <p className={`text-2xl font-bold ${
                  overallRiskScore < 0.3 ? 'text-green-600' : 
                  overallRiskScore < 0.6 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {(overallRiskScore * 100).toFixed(0)}%
                </p>
              </div>
              {overallRiskScore < 0.3 ? (
                <TrendingDown className="h-8 w-8 text-green-500 opacity-50" />
              ) : (
                <TrendingUp className="h-8 w-8 text-red-500 opacity-50" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predictions Generated</p>
                <p className="text-2xl font-bold">{predictions.length}</p>
              </div>
              <Brain className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {predictions.filter(p => ['high', 'very_high'].includes(p.risk_level)).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">
                  {predictions.length > 0 
                    ? (predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length * 100).toFixed(0)
                    : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">All Predictions</TabsTrigger>
          <TabsTrigger value="churn">Churn Analysis</TabsTrigger>
          <TabsTrigger value="success">Success Predictions</TabsTrigger>
          <TabsTrigger value="risk">Risk Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Generating predictions...</p>
            </div>
          ) : predictions.length === 0 ? (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertTitle>No Predictions Available</AlertTitle>
              <AlertDescription>
                Click refresh to generate ML-powered predictions for your account.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map(renderPredictionCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="churn" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions
              .filter(p => p.prediction_type.includes('churn'))
              .map(renderPredictionCard)}
          </div>
          {predictions.filter(p => p.prediction_type.includes('churn')).length === 0 && (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle>No Churn Predictions</AlertTitle>
              <AlertDescription>
                Churn predictions help identify users at risk of leaving the platform.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="success" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions
              .filter(p => ['bid_success', 'contract_completion'].includes(p.prediction_type))
              .map(renderPredictionCard)}
          </div>
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions
              .filter(p => ['high', 'very_high'].includes(p.risk_level))
              .map(renderPredictionCard)}
          </div>
          {predictions.filter(p => ['high', 'very_high'].includes(p.risk_level)).length === 0 && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">All Clear</AlertTitle>
              <AlertDescription className="text-green-700">
                No high-risk predictions at this time. Keep up the good work!
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Model Information */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-sm">About Predictive Analytics</h4>
              <p className="text-xs text-muted-foreground">
                Our ML models use logistic regression with domain-specific feature engineering 
                (inspired by IBM's HR Analytics approach) to predict procurement outcomes. 
                Model version: {predictions[0]?.model_version || '1.0.0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;

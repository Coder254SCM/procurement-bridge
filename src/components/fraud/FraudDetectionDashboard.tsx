import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText,
  Activity,
  Eye,
  AlertCircle
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  entity_type: string;
  entity_id: string;
  description: string;
  detected_at: string;
  status: string;
}

interface RiskMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  highRiskEntities: number;
  averageRiskScore: number;
  trendsUp: boolean;
}

const FraudDetectionDashboard: React.FC = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [metrics, setMetrics] = useState<RiskMetrics>({
    totalAlerts: 0,
    criticalAlerts: 0,
    highRiskEntities: 0,
    averageRiskScore: 0,
    trendsUp: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFraudData();
  }, []);

  const loadFraudData = async () => {
    setLoading(true);
    try {
      // Fetch behavior analysis data for fraud patterns
      const { data: behaviorData, error: behaviorError } = await supabase
        .from('behavior_analysis')
        .select('*')
        .gte('risk_score', 50)
        .order('created_at', { ascending: false })
        .limit(50);

      if (behaviorError) throw behaviorError;

      // Transform behavior data into fraud alerts
      const fraudAlerts: FraudAlert[] = (behaviorData || []).map(item => ({
        id: item.id,
        type: item.analysis_type,
        severity: getSeverityFromRiskScore(item.risk_score),
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        description: generateAlertDescription(item),
        detected_at: item.created_at,
        status: 'active'
      }));

      setAlerts(fraudAlerts);

      // Calculate metrics
      const criticalCount = fraudAlerts.filter(a => a.severity === 'critical').length;
      const totalRisk = (behaviorData || []).reduce((sum, item) => sum + item.risk_score, 0);
      const avgRisk = behaviorData && behaviorData.length > 0 ? totalRisk / behaviorData.length : 0;

      setMetrics({
        totalAlerts: fraudAlerts.length,
        criticalAlerts: criticalCount,
        highRiskEntities: fraudAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length,
        averageRiskScore: avgRisk,
        trendsUp: avgRisk > 50
      });

    } catch (error) {
      console.error('Error loading fraud detection data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityFromRiskScore = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score >= 80) return 'critical';
    if (score >= 65) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  };

  const generateAlertDescription = (item: any): string => {
    const analysisData = item.analysis_data || {};
    const type = item.analysis_type;

    if (type.includes('bid')) {
      return `Suspicious bidding pattern detected with risk score ${item.risk_score}/100`;
    } else if (type.includes('supplier')) {
      return `Supplier anomaly detected in ${item.entity_type} with elevated risk indicators`;
    } else if (type.includes('pattern')) {
      return `Unusual pattern detected requiring investigation`;
    }

    return `Fraud risk detected: Score ${item.risk_score}/100`;
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: string): JSX.Element => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <Eye className="h-5 w-5 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading fraud detection data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Fraud Detection & Risk Monitoring
        </h2>
        <p className="text-muted-foreground mt-1">
          AI-powered fraud detection with real-time risk monitoring and pattern analysis
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold">{metrics.totalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">{metrics.criticalAlerts}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Entities</p>
                <p className="text-3xl font-bold text-orange-600">{metrics.highRiskEntities}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                <p className="text-3xl font-bold">{metrics.averageRiskScore.toFixed(1)}</p>
              </div>
              <TrendingUp className={`h-8 w-8 opacity-50 ${metrics.trendsUp ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="high">High Priority</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Fraud Alerts</CardTitle>
              <CardDescription>
                Comprehensive view of all detected fraud risks and anomalies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-green-600 opacity-50" />
                  <p className="text-muted-foreground">No fraud alerts detected</p>
                  <p className="text-sm text-muted-foreground">The system is monitoring all activities</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} border`}>
                      <div className="flex items-start gap-3">
                        {getSeverityIcon(alert.severity)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-sm">
                              {alert.entity_type.toUpperCase()} Alert
                            </h4>
                            <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <AlertDescription className="text-sm">
                            {alert.description}
                          </AlertDescription>
                          <p className="text-xs mt-2 opacity-75">
                            Detected: {new Date(alert.detected_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Critical Alerts</CardTitle>
              <CardDescription>
                Immediate action required - High-risk fraud indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(a => a.severity === 'critical').map(alert => (
                  <Alert key={alert.id} className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-red-900">
                        {alert.entity_type.toUpperCase()} - CRITICAL
                      </h4>
                      <AlertDescription className="text-sm text-red-800">
                        {alert.description}
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
                {alerts.filter(a => a.severity === 'critical').length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No critical alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="high" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">High Priority Alerts</CardTitle>
              <CardDescription>
                Elevated risk requiring investigation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(a => a.severity === 'high').map(alert => (
                  <Alert key={alert.id} className="bg-orange-50 border-orange-200">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <div className="ml-3">
                      <h4 className="font-semibold text-sm text-orange-900">
                        {alert.entity_type.toUpperCase()} - HIGH RISK
                      </h4>
                      <AlertDescription className="text-sm text-orange-800">
                        {alert.description}
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
                {alerts.filter(a => a.severity === 'high').length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No high priority alerts</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pattern Analysis</CardTitle>
              <CardDescription>
                AI-detected patterns and anomalies in procurement activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Bidding Pattern Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitoring for collusion, bid rigging, and coordinated bidding activities
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Monitoring Active</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Supplier Behavior Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyzing supplier actions for suspicious patterns and anomalies
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Monitoring Active</Badge>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Document Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Blockchain-based verification of all submitted documents
                  </p>
                  <Badge className="mt-2 bg-green-100 text-green-800">Blockchain Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FraudDetectionDashboard;

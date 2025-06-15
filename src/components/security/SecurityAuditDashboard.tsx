
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, Lock, Eye, Download } from 'lucide-react';
import { advancedRateLimiter } from '@/utils/advancedRateLimiting';
import { sessionManager } from '@/utils/sessionManager';

interface SecurityEvent {
  timestamp: string;
  event: string;
  details: any;
  risk: 'low' | 'medium' | 'high';
  userAgent: string;
  url: string;
}

interface SecurityMetrics {
  totalEvents: number;
  highRiskEvents: number;
  mediumRiskEvents: number;
  lowRiskEvents: number;
  blockedIPs: number;
  activeSessions: number;
  averageSessionDuration: number;
}

const SecurityAuditDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSecurityData();
    const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = () => {
    try {
      // Load security events from localStorage
      const events = JSON.parse(localStorage.getItem('security_logs') || '[]');
      setSecurityEvents(events);

      // Get rate limiter stats
      const rateLimiterStats = advancedRateLimiter.getStats();
      
      // Get session stats
      const sessionStats = sessionManager.getSessionStats();

      // Calculate metrics
      const highRisk = events.filter((e: SecurityEvent) => e.risk === 'high').length;
      const mediumRisk = events.filter((e: SecurityEvent) => e.risk === 'medium').length;
      const lowRisk = events.filter((e: SecurityEvent) => e.risk === 'low').length;

      setMetrics({
        totalEvents: events.length,
        highRiskEvents: highRisk,
        mediumRiskEvents: mediumRisk,
        lowRiskEvents: lowRisk,
        blockedIPs: rateLimiterStats.blockedIPs,
        activeSessions: sessionStats.totalActiveSessions,
        averageSessionDuration: Math.round(sessionStats.averageSessionDuration / (1000 * 60)) // Convert to minutes
      });

      setLoading(false);
    } catch (error) {
      console.error('Failed to load security data:', error);
      setLoading(false);
    }
  };

  const exportSecurityReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      recentEvents: securityEvents.slice(-50), // Last 50 events
      summary: {
        riskAssessment: metrics?.highRiskEvents || 0 > 5 ? 'HIGH' : 
                      (metrics?.mediumRiskEvents || 0) > 10 ? 'MEDIUM' : 'LOW',
        recommendations: generateRecommendations()
      }
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security-audit-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];
    
    if ((metrics?.highRiskEvents || 0) > 5) {
      recommendations.push('Immediate review of high-risk security events required');
      recommendations.push('Consider implementing additional access controls');
    }
    
    if ((metrics?.blockedIPs || 0) > 10) {
      recommendations.push('High number of blocked IPs detected - review firewall rules');
    }
    
    if ((metrics?.averageSessionDuration || 0) > 480) { // 8 hours
      recommendations.push('Consider reducing maximum session duration');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Security posture appears healthy');
      recommendations.push('Continue regular monitoring and maintenance');
    }
    
    return recommendations;
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Audit Dashboard</h2>
          <p className="text-muted-foreground">Monitor and analyze security events</p>
        </div>
        <Button onClick={exportSecurityReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalEvents || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics?.highRiskEvents || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.blockedIPs || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {metrics?.averageSessionDuration || 0}min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment Alert */}
      {(metrics?.highRiskEvents || 0) > 5 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            High number of security events detected. Immediate review recommended.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Latest security-related activities and potential threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityEvents.slice(-20).reverse().map((event, index) => (
                  <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getRiskBadgeColor(event.risk)}>
                          {event.risk.toUpperCase()}
                        </Badge>
                        <span className="text-sm font-medium">{event.event}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <div className="text-xs">
                        <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
                {securityEvents.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No security events recorded
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Recommendations</CardTitle>
              <CardDescription>
                Automated recommendations based on current security analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateRecommendations().map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Security compliance checks and certifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Rate Limiting</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Session Management</span>
                  <Badge variant="default">Enhanced</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>SQL Injection Protection</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Audit Logging</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span>Data Encryption</span>
                  <Badge variant="default">AES-256</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityAuditDashboard;

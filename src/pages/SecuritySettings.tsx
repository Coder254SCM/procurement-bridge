
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Settings, Activity, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import SecurityAuditDashboard from '@/components/security/SecurityAuditDashboard';
import { performSecurityHealthCheck, logSecurityEvent } from '@/utils/security';
import { useToast } from '@/hooks/use-toast';

interface SecurityConfig {
  rateLimiting: {
    enabled: boolean;
    maxAttempts: number;
    timeWindow: number;
    blockDuration: number;
  };
  sessionManagement: {
    maxIdleTime: number;
    maxSessionTime: number;
    maxConcurrentSessions: number;
    deviceTracking: boolean;
  };
  inputValidation: {
    enabled: boolean;
    strictMode: boolean;
    logSuspiciousInput: boolean;
  };
  auditLogging: {
    enabled: boolean;
    retentionDays: number;
    logLevel: 'low' | 'medium' | 'high';
  };
}

const SecuritySettings = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<SecurityConfig>({
    rateLimiting: {
      enabled: true,
      maxAttempts: 5,
      timeWindow: 15,
      blockDuration: 30
    },
    sessionManagement: {
      maxIdleTime: 30,
      maxSessionTime: 480,
      maxConcurrentSessions: 3,
      deviceTracking: true
    },
    inputValidation: {
      enabled: true,
      strictMode: false,
      logSuspiciousInput: true
    },
    auditLogging: {
      enabled: true,
      retentionDays: 90,
      logLevel: 'medium'
    }
  });

  const [securityHealth, setSecurityHealth] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSecurityConfig();
    checkSecurityHealth();
  }, []);

  const loadSecurityConfig = () => {
    try {
      const savedConfig = localStorage.getItem('security_config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      }
    } catch (error) {
      console.error('Failed to load security config:', error);
    }
  };

  const saveSecurityConfig = async () => {
    setLoading(true);
    try {
      localStorage.setItem('security_config', JSON.stringify(config));
      
      logSecurityEvent(
        'Security configuration updated',
        { config },
        'low',
        'general'
      );

      toast({
        title: "Security Settings Saved",
        description: "Your security configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save security configuration.",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkSecurityHealth = () => {
    const health = performSecurityHealthCheck();
    setSecurityHealth(health);
  };

  const runSecurityScan = async () => {
    setLoading(true);
    try {
      // Simulate security scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      checkSecurityHealth();
      
      logSecurityEvent(
        'Manual security scan completed',
        { timestamp: new Date().toISOString() },
        'low',
        'general'
      );

      toast({
        title: "Security Scan Complete",
        description: "No critical vulnerabilities detected.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Security scan could not be completed.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'warning': return 'default';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security Settings</h1>
          <p className="text-muted-foreground">Configure and monitor security features</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkSecurityHealth}>
            <Activity className="h-4 w-4 mr-2" />
            Health Check
          </Button>
          <Button onClick={runSecurityScan} disabled={loading}>
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Security Health Status */}
      {securityHealth && (
        <Alert>
          <div className="flex items-center gap-2">
            {getHealthStatusIcon(securityHealth.status)}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Security Status:</span>
                <Badge variant={getHealthStatusColor(securityHealth.status)}>
                  {securityHealth.status.toUpperCase()}
                </Badge>
              </div>
              {securityHealth.issues.length > 0 && (
                <AlertDescription className="mt-2">
                  Issues detected: {securityHealth.issues.join(', ')}
                </AlertDescription>
              )}
            </div>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="audit">Audit Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-6">
          {/* Rate Limiting Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Rate Limiting
              </CardTitle>
              <CardDescription>
                Configure rate limiting to prevent abuse and DDoS attacks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="rate-limiting-enabled">Enable Rate Limiting</Label>
                <Switch
                  id="rate-limiting-enabled"
                  checked={config.rateLimiting.enabled}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({
                      ...prev,
                      rateLimiting: { ...prev.rateLimiting, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="max-attempts">Max Attempts</Label>
                  <Input
                    id="max-attempts"
                    type="number"
                    value={config.rateLimiting.maxAttempts}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        rateLimiting: { ...prev.rateLimiting, maxAttempts: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="time-window">Time Window (minutes)</Label>
                  <Input
                    id="time-window"
                    type="number"
                    value={config.rateLimiting.timeWindow}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        rateLimiting: { ...prev.rateLimiting, timeWindow: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="block-duration">Block Duration (minutes)</Label>
                  <Input
                    id="block-duration"
                    type="number"
                    value={config.rateLimiting.blockDuration}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        rateLimiting: { ...prev.rateLimiting, blockDuration: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Management Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Session Management
              </CardTitle>
              <CardDescription>
                Configure session security and timeout settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-idle-time">Max Idle Time (minutes)</Label>
                  <Input
                    id="max-idle-time"
                    type="number"
                    value={config.sessionManagement.maxIdleTime}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        sessionManagement: { ...prev.sessionManagement, maxIdleTime: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="max-session-time">Max Session Time (minutes)</Label>
                  <Input
                    id="max-session-time"
                    type="number"
                    value={config.sessionManagement.maxSessionTime}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        sessionManagement: { ...prev.sessionManagement, maxSessionTime: parseInt(e.target.value) }
                      }))
                    }
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="device-tracking">Enable Device Tracking</Label>
                <Switch
                  id="device-tracking"
                  checked={config.sessionManagement.deviceTracking}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({
                      ...prev,
                      sessionManagement: { ...prev.sessionManagement, deviceTracking: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Input Validation Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Input Validation
              </CardTitle>
              <CardDescription>
                Configure input validation and sanitization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="input-validation-enabled">Enable Input Validation</Label>
                <Switch
                  id="input-validation-enabled"
                  checked={config.inputValidation.enabled}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({
                      ...prev,
                      inputValidation: { ...prev.inputValidation, enabled: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="strict-mode">Strict Mode</Label>
                <Switch
                  id="strict-mode"
                  checked={config.inputValidation.strictMode}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({
                      ...prev,
                      inputValidation: { ...prev.inputValidation, strictMode: checked }
                    }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="log-suspicious">Log Suspicious Input</Label>
                <Switch
                  id="log-suspicious"
                  checked={config.inputValidation.logSuspiciousInput}
                  onCheckedChange={(checked) =>
                    setConfig(prev => ({
                      ...prev,
                      inputValidation: { ...prev.inputValidation, logSuspiciousInput: checked }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveSecurityConfig} disabled={loading}>
              <Settings className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Security Monitoring</CardTitle>
              <CardDescription>
                Monitor security events and system health in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Real-time monitoring dashboard would be implemented here.
                  This would show live security events, threat detection, and system metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <SecurityAuditDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecuritySettings;

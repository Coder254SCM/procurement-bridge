/**
 * Real-time Security Monitoring and Threat Detection
 * Monitors for suspicious activities and security violations
 */

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'authentication' | 'authorization' | 'input_validation' | 'rate_limit' | 'csp_violation' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  details: Record<string, any>;
  userAgent?: string;
  url?: string;
}

export interface ThreatIndicator {
  type: string;
  score: number;
  lastSeen: number;
  count: number;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private threatIndicators: Map<string, ThreatIndicator> = new Map();
  private readonly maxEvents = 1000;
  private readonly threatThreshold = 10;
  
  constructor() {
    this.initializeCSPReporting();
    this.initializeErrorMonitoring();
    this.loadPersistedEvents();
  }

  /**
   * Log a security event
   */
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.events.unshift(fullEvent);
    
    // Trim to max events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Update threat indicators
    this.updateThreatIndicator(event.type, event.severity);

    // Persist events
    this.persistEvents();

    // Check for threat escalation
    if (event.severity === 'critical' || this.checkThreatEscalation()) {
      this.triggerAlert(fullEvent);
    }

    // Console logging for monitoring
    const logMethod = event.severity === 'critical' ? 'error' : 
                      event.severity === 'high' ? 'warn' : 'log';
    console[logMethod](`[Security ${event.severity.toUpperCase()}]`, event.description, event.details);
  }

  /**
   * Log authentication event
   */
  logAuthEvent(success: boolean, details: Record<string, any>): void {
    this.logEvent({
      type: 'authentication',
      severity: success ? 'low' : 'medium',
      description: success ? 'Successful authentication' : 'Failed authentication attempt',
      details
    });
  }

  /**
   * Log authorization violation
   */
  logAuthzViolation(resource: string, action: string, details: Record<string, any>): void {
    this.logEvent({
      type: 'authorization',
      severity: 'high',
      description: `Unauthorized ${action} attempt on ${resource}`,
      details
    });
  }

  /**
   * Log input validation failure
   */
  logInputViolation(field: string, reason: string, details: Record<string, any>): void {
    this.logEvent({
      type: 'input_validation',
      severity: details.isMalicious ? 'high' : 'low',
      description: `Input validation failed: ${reason}`,
      details: { field, ...details }
    });
  }

  /**
   * Log rate limit event
   */
  logRateLimit(endpoint: string, remainingAttempts: number): void {
    this.logEvent({
      type: 'rate_limit',
      severity: remainingAttempts === 0 ? 'high' : 'medium',
      description: `Rate limit ${remainingAttempts === 0 ? 'exceeded' : 'approaching'} for ${endpoint}`,
      details: { endpoint, remainingAttempts }
    });
  }

  /**
   * Log suspicious activity
   */
  logSuspiciousActivity(activity: string, details: Record<string, any>): void {
    this.logEvent({
      type: 'suspicious_activity',
      severity: 'high',
      description: activity,
      details
    });
  }

  /**
   * Get recent events
   */
  getRecentEvents(count: number = 50, severity?: SecurityEvent['severity']): SecurityEvent[] {
    let filtered = this.events;
    if (severity) {
      filtered = this.events.filter(e => e.severity === severity);
    }
    return filtered.slice(0, count);
  }

  /**
   * Get security metrics
   */
  getMetrics(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySeverity: Record<string, number>;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    recentHighSeverity: number;
  } {
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > last24h);

    const eventsByType: Record<string, number> = {};
    const eventsBySeverity: Record<string, number> = {};

    for (const event of recentEvents) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    }

    const recentHighSeverity = recentEvents.filter(
      e => e.severity === 'high' || e.severity === 'critical'
    ).length;

    let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (recentHighSeverity > 20) threatLevel = 'critical';
    else if (recentHighSeverity > 10) threatLevel = 'high';
    else if (recentHighSeverity > 5) threatLevel = 'medium';

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      threatLevel,
      recentHighSeverity
    };
  }

  /**
   * Clear all events (for testing/reset)
   */
  clearEvents(): void {
    this.events = [];
    this.persistEvents();
  }

  /**
   * Export events for audit
   */
  exportEvents(): string {
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      totalEvents: this.events.length,
      events: this.events
    }, null, 2);
  }

  // Private methods

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateThreatIndicator(type: string, severity: string): void {
    const existing = this.threatIndicators.get(type) || {
      type,
      score: 0,
      lastSeen: 0,
      count: 0
    };

    const severityScore = { low: 1, medium: 2, high: 5, critical: 10 };
    existing.score += severityScore[severity as keyof typeof severityScore] || 1;
    existing.lastSeen = Date.now();
    existing.count += 1;

    this.threatIndicators.set(type, existing);
  }

  private checkThreatEscalation(): boolean {
    let totalScore = 0;
    const recentThreshold = Date.now() - 5 * 60 * 1000; // Last 5 minutes

    for (const indicator of this.threatIndicators.values()) {
      if (indicator.lastSeen > recentThreshold) {
        totalScore += indicator.score;
      }
    }

    return totalScore >= this.threatThreshold;
  }

  private triggerAlert(event: SecurityEvent): void {
    // In production, this would send to a security operations center
    console.error('[SECURITY ALERT]', event);
    
    // Store alert for dashboard
    try {
      const alerts = JSON.parse(localStorage.getItem('security_alerts') || '[]');
      alerts.unshift(event);
      localStorage.setItem('security_alerts', JSON.stringify(alerts.slice(0, 100)));
    } catch {
      // Ignore storage errors
    }
  }

  private persistEvents(): void {
    try {
      // Store only last 200 events to avoid localStorage limits
      const toStore = this.events.slice(0, 200);
      localStorage.setItem('security_events', JSON.stringify(toStore));
    } catch {
      // Ignore storage errors
    }
  }

  private loadPersistedEvents(): void {
    try {
      const stored = localStorage.getItem('security_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch {
      this.events = [];
    }
  }

  private initializeCSPReporting(): void {
    // Listen for CSP violations
    document.addEventListener('securitypolicyviolation', (e) => {
      this.logEvent({
        type: 'csp_violation',
        severity: 'high',
        description: `CSP violation: ${e.violatedDirective}`,
        details: {
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          originalPolicy: e.originalPolicy,
          disposition: e.disposition
        }
      });
    });
  }

  private initializeErrorMonitoring(): void {
    // Monitor for potential security-related errors
    window.addEventListener('error', (e) => {
      if (e.message?.includes('script') || e.message?.includes('CORS')) {
        this.logEvent({
          type: 'suspicious_activity',
          severity: 'medium',
          description: 'Potential security-related error detected',
          details: {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
          }
        });
      }
    });
  }
}

// Singleton instance
export const securityMonitor = new SecurityMonitor();

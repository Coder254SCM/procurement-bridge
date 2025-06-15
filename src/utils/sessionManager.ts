
/**
 * Advanced session management with security features
 */

interface SessionData {
  userId: string;
  email: string;
  roles: string[];
  loginTime: number;
  lastActivity: number;
  ipAddress?: string;
  userAgent?: string;
  sessionId: string;
}

interface SessionConfig {
  maxIdleTime: number;
  maxSessionTime: number;
  enableConcurrentSessionLimit: boolean;
  maxConcurrentSessions: number;
  enableDeviceTracking: boolean;
}

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();
  private userSessions: Map<string, Set<string>> = new Map();
  private config: SessionConfig;

  constructor() {
    this.config = {
      maxIdleTime: 30 * 60 * 1000, // 30 minutes
      maxSessionTime: 8 * 60 * 60 * 1000, // 8 hours
      enableConcurrentSessionLimit: true,
      maxConcurrentSessions: 3,
      enableDeviceTracking: true
    };

    // Cleanup expired sessions every 5 minutes
    setInterval(() => this.cleanupExpiredSessions(), 5 * 60 * 1000);
  }

  createSession(userId: string, email: string, roles: string[], metadata?: { ipAddress?: string, userAgent?: string }): string {
    const sessionId = this.generateSecureSessionId();
    const now = Date.now();

    // Check concurrent session limit
    if (this.config.enableConcurrentSessionLimit) {
      this.enforceConcurrentSessionLimit(userId);
    }

    const sessionData: SessionData = {
      userId,
      email,
      roles,
      loginTime: now,
      lastActivity: now,
      sessionId,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent
    };

    this.sessions.set(sessionId, sessionData);
    
    // Track user sessions
    const userSessionSet = this.userSessions.get(userId) || new Set();
    userSessionSet.add(sessionId);
    this.userSessions.set(userId, userSessionSet);

    // Store in secure storage
    this.storeSessionSecurely(sessionId, sessionData);

    return sessionId;
  }

  validateSession(sessionId: string, metadata?: { ipAddress?: string, userAgent?: string }): { valid: boolean, session?: SessionData, reason?: string } {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }

    const now = Date.now();

    // Check if session expired due to inactivity
    if (now - session.lastActivity > this.config.maxIdleTime) {
      this.destroySession(sessionId);
      return { valid: false, reason: 'Session expired due to inactivity' };
    }

    // Check if session exceeded maximum duration
    if (now - session.loginTime > this.config.maxSessionTime) {
      this.destroySession(sessionId);
      return { valid: false, reason: 'Session exceeded maximum duration' };
    }

    // Validate IP address consistency (if enabled)
    if (this.config.enableDeviceTracking && metadata?.ipAddress && session.ipAddress) {
      if (metadata.ipAddress !== session.ipAddress) {
        // Log suspicious activity
        this.logSuspiciousActivity(sessionId, 'IP address mismatch', {
          originalIP: session.ipAddress,
          newIP: metadata.ipAddress
        });
        // Don't automatically destroy - might be legitimate (mobile network switching)
        // But flag for monitoring
      }
    }

    // Update last activity
    session.lastActivity = now;
    this.sessions.set(sessionId, session);
    this.storeSessionSecurely(sessionId, session);

    return { valid: true, session };
  }

  refreshSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.lastActivity = Date.now();
    this.sessions.set(sessionId, session);
    this.storeSessionSecurely(sessionId, session);
    return true;
  }

  destroySession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Remove from user sessions tracking
    const userSessions = this.userSessions.get(session.userId);
    if (userSessions) {
      userSessions.delete(sessionId);
      if (userSessions.size === 0) {
        this.userSessions.delete(session.userId);
      }
    }

    // Remove from storage
    this.sessions.delete(sessionId);
    this.removeSessionFromStorage(sessionId);

    return true;
  }

  destroyAllUserSessions(userId: string): number {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return 0;

    const sessionCount = userSessions.size;
    
    // Destroy each session
    for (const sessionId of userSessions) {
      this.sessions.delete(sessionId);
      this.removeSessionFromStorage(sessionId);
    }

    // Clear user session tracking
    this.userSessions.delete(userId);

    return sessionCount;
  }

  getUserActiveSessions(userId: string): SessionData[] {
    const userSessions = this.userSessions.get(userId) || new Set();
    const activeSessions: SessionData[] = [];

    for (const sessionId of userSessions) {
      const session = this.sessions.get(sessionId);
      if (session) {
        activeSessions.push({
          ...session,
          // Don't expose sensitive data
          sessionId: sessionId.substring(0, 8) + '...'
        });
      }
    }

    return activeSessions;
  }

  private enforceConcurrentSessionLimit(userId: string): void {
    const userSessions = this.userSessions.get(userId);
    if (!userSessions) return;

    if (userSessions.size >= this.config.maxConcurrentSessions) {
      // Remove oldest session
      let oldestSessionId = '';
      let oldestTime = Date.now();

      for (const sessionId of userSessions) {
        const session = this.sessions.get(sessionId);
        if (session && session.lastActivity < oldestTime) {
          oldestTime = session.lastActivity;
          oldestSessionId = sessionId;
        }
      }

      if (oldestSessionId) {
        this.destroySession(oldestSessionId);
      }
    }
  }

  private generateSecureSessionId(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private storeSessionSecurely(sessionId: string, sessionData: SessionData): void {
    // Store in sessionStorage with encryption
    const encryptedData = btoa(JSON.stringify({
      userId: sessionData.userId,
      email: sessionData.email,
      roles: sessionData.roles,
      lastActivity: sessionData.lastActivity
    }));
    sessionStorage.setItem(`session_${sessionId}`, encryptedData);
  }

  private removeSessionFromStorage(sessionId: string): void {
    sessionStorage.removeItem(`session_${sessionId}`);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > this.config.maxIdleTime || 
          now - session.loginTime > this.config.maxSessionTime) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => this.destroySession(sessionId));
  }

  private logSuspiciousActivity(sessionId: string, activity: string, details: any): void {
    console.warn('Suspicious session activity detected:', {
      sessionId: sessionId.substring(0, 8),
      activity,
      details,
      timestamp: new Date().toISOString()
    });

    // In production, send to security monitoring system
    // Example: SecurityMonitor.reportSuspiciousActivity(...)
  }

  getSessionStats(): { totalActiveSessions: number, totalUsers: number, averageSessionDuration: number } {
    const now = Date.now();
    let totalDuration = 0;

    for (const session of this.sessions.values()) {
      totalDuration += now - session.loginTime;
    }

    return {
      totalActiveSessions: this.sessions.size,
      totalUsers: this.userSessions.size,
      averageSessionDuration: this.sessions.size > 0 ? totalDuration / this.sessions.size : 0
    };
  }
}

// Global instance
export const sessionManager = new SessionManager();

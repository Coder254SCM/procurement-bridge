/**
 * React hook for comprehensive security protection
 * Provides XSS protection, input sanitization, and security monitoring
 */

import { useEffect, useCallback, useRef } from 'react';
import { securityMonitor } from '@/utils/securityMonitor';
import { initializeSecurity, sanitizeHTML, sanitizeURL, safeJSONParse } from '@/utils/contentSecurityPolicy';
import { SQLInjectionProtector } from '@/utils/sqlInjectionProtection';
import { advancedRateLimiter } from '@/utils/advancedRateLimiting';

export interface SecurityOptions {
  enableCSP?: boolean;
  enableXSSProtection?: boolean;
  enableClickjackingProtection?: boolean;
  logSecurityEvents?: boolean;
}

const defaultOptions: SecurityOptions = {
  enableCSP: true,
  enableXSSProtection: true,
  enableClickjackingProtection: true,
  logSecurityEvents: true
};

export function useSecurityProtection(options: SecurityOptions = defaultOptions) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (options.enableCSP) {
      initializeSecurity();
    }

    if (options.enableClickjackingProtection) {
      // Prevent framing attacks
      if (window.self !== window.top) {
        securityMonitor.logSuspiciousActivity('Clickjacking attempt detected', {
          parentOrigin: document.referrer
        });
        // Optionally break out of frame
        // window.top.location = window.self.location;
      }
    }

    // Log initialization
    securityMonitor.logEvent({
      type: 'authentication',
      severity: 'low',
      description: 'Security protection initialized',
      details: { options }
    });
  }, [options]);

  /**
   * Validate and sanitize user input
   */
  const validateInput = useCallback((
    input: string,
    context: 'query' | 'user_input' | 'file_name' = 'user_input'
  ) => {
    const result = SQLInjectionProtector.validateInput(input, context);
    
    if (!result.isValid && options.logSecurityEvents) {
      securityMonitor.logInputViolation('user_input', result.issues.join(', '), {
        input: input.substring(0, 100), // Truncate for logging
        risk: result.risk,
        isMalicious: result.risk === 'high'
      });
    }

    return {
      isValid: result.isValid,
      sanitized: result.sanitized || SQLInjectionProtector.sanitizeInput(input),
      risk: result.risk,
      issues: result.issues
    };
  }, [options.logSecurityEvents]);

  /**
   * Check rate limiting for an action
   */
  const checkRateLimit = useCallback((
    action: string,
    type: 'login' | 'api' | 'sensitive' = 'api'
  ) => {
    const result = advancedRateLimiter.attempt(action, type);
    
    if (!result.allowed && options.logSecurityEvents) {
      securityMonitor.logRateLimit(action, result.remainingAttempts);
    }

    return result;
  }, [options.logSecurityEvents]);

  /**
   * Sanitize HTML content
   */
  const sanitize = useCallback((content: string) => {
    return sanitizeHTML(content);
  }, []);

  /**
   * Sanitize URLs
   */
  const sanitizeUrl = useCallback((url: string) => {
    const result = sanitizeURL(url);
    
    if (!result && options.logSecurityEvents) {
      securityMonitor.logInputViolation('url', 'Unsafe URL blocked', {
        url: url.substring(0, 100),
        isMalicious: true
      });
    }

    return result;
  }, [options.logSecurityEvents]);

  /**
   * Safe JSON parsing
   */
  const parseJSON = useCallback(<T>(json: string, defaultValue: T): T => {
    return safeJSONParse(json, defaultValue);
  }, []);

  /**
   * Get current security metrics
   */
  const getSecurityMetrics = useCallback(() => {
    return securityMonitor.getMetrics();
  }, []);

  /**
   * Get recent security events
   */
  const getRecentEvents = useCallback((count?: number) => {
    return securityMonitor.getRecentEvents(count);
  }, []);

  /**
   * Log a custom security event
   */
  const logSecurityEvent = useCallback((
    description: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    details: Record<string, any>
  ) => {
    securityMonitor.logEvent({
      type: 'suspicious_activity',
      severity,
      description,
      details
    });
  }, []);

  return {
    validateInput,
    checkRateLimit,
    sanitize,
    sanitizeUrl,
    parseJSON,
    getSecurityMetrics,
    getRecentEvents,
    logSecurityEvent
  };
}

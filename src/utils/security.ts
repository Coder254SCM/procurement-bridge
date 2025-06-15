/**
 * Enhanced security utility functions for protecting the application against common attacks
 */

import { advancedRateLimiter } from './advancedRateLimiting';
import { sessionManager } from './sessionManager';
import { SQLInjectionProtector } from './sqlInjectionProtection';

// Sanitize input to prevent XSS attacks
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate input against a regex pattern
export function validateInput(input: string, pattern: RegExp): boolean {
  return pattern.test(input);
}

// Common validation patterns
export const ValidationPatterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  phoneNumber: /^\+?[0-9]{10,15}$/,
  name: /^[a-zA-Z\s'-]{2,50}$/,
  alphanumeric: /^[a-zA-Z0-9\s-_]+$/,
  safeText: /^[a-zA-Z0-9\s.,;:'"()[\]{}!?@#$%^&*+=|\\/<>_-]+$/
};

// Rate limiting for sensitive operations
export class RateLimiter {
  private attempts: Map<string, { count: number, timestamp: number }> = new Map();
  private maxAttempts: number;
  private timeWindowMs: number;

  constructor(maxAttempts = 5, timeWindowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.timeWindowMs = timeWindowMs;
  }

  attempt(key: string): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (now - record.timestamp > this.timeWindowMs) {
      // Reset if outside time window
      this.attempts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (record.count >= this.maxAttempts) {
      return false; // Rate limited
    }

    // Increment attempt count
    record.count += 1;
    this.attempts.set(key, record);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Enhanced CSRF token protection with expiration
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Store with timestamp for expiration
  const tokenData = {
    token,
    expires: Date.now() + (60 * 60 * 1000) // 1 hour expiration
  };
  
  sessionStorage.setItem('csrfTokenData', JSON.stringify(tokenData));
  return token;
}

export function validateCSRFToken(token: string): boolean {
  try {
    const tokenDataStr = sessionStorage.getItem('csrfTokenData');
    if (!tokenDataStr) return false;
    
    const tokenData = JSON.parse(tokenDataStr);
    
    // Check expiration
    if (Date.now() > tokenData.expires) {
      sessionStorage.removeItem('csrfTokenData');
      return false;
    }
    
    return token === tokenData.token;
  } catch {
    return false;
  }
}

// Enhanced secure headers with additional security measures
export function createSecureHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': 'no-store, no-cache, must-revalidate, private'
  };

  // Add CSRF token if available
  try {
    const tokenDataStr = sessionStorage.getItem('csrfTokenData');
    if (tokenDataStr) {
      const tokenData = JSON.parse(tokenDataStr);
      if (Date.now() < tokenData.expires) {
        headers['X-CSRF-Token'] = tokenData.token;
      }
    }
  } catch {
    // Ignore CSRF token errors
  }

  const authToken = getSecureToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

// Enhanced secure fetch with comprehensive protection
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Rate limiting check
  const userIP = await getUserIP();
  const rateLimitResult = advancedRateLimiter.attempt(url, 'api', userIP);
  
  if (!rateLimitResult.allowed) {
    SQLInjectionProtector.logSecurityEvent(
      'Rate limit exceeded',
      { url, remainingAttempts: rateLimitResult.remainingAttempts },
      'medium'
    );
    throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimitResult.retryAfter || 0) / 1000)} seconds.`);
  }

  // Input validation for query parameters
  if (options.body && typeof options.body === 'string') {
    try {
      const bodyData = JSON.parse(options.body);
      for (const [key, value] of Object.entries(bodyData)) {
        if (typeof value === 'string') {
          const validation = SQLInjectionProtector.validateInput(value);
          if (!validation.isValid) {
            SQLInjectionProtector.logSecurityEvent(
              'Malicious input detected in request body',
              { key, value, issues: validation.issues },
              validation.risk
            );
            throw new Error('Request blocked for security reasons');
          }
        }
      }
    } catch (parseError) {
      // If it's not JSON, treat as string and validate
      const validation = SQLInjectionProtector.validateInput(options.body);
      if (!validation.isValid) {
        throw new Error('Request blocked for security reasons');
      }
    }
  }

  // Merge default secure headers with any provided headers
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...createSecureHeaders(),
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, secureOptions);
    
    // Log successful requests for monitoring
    if (response.ok) {
      SQLInjectionProtector.logSecurityEvent(
        'Secure request completed',
        { url, status: response.status },
        'low'
      );
    } else {
      SQLInjectionProtector.logSecurityEvent(
        'Request failed',
        { url, status: response.status },
        'medium'
      );
    }
    
    return response;
  } catch (error) {
    SQLInjectionProtector.logSecurityEvent(
      'Request error',
      { url, error: error instanceof Error ? error.message : 'Unknown error' },
      'medium'
    );
    throw error;
  }
}

// Get user IP (simplified - in production use proper IP detection)
async function getUserIP(): Promise<string> {
  try {
    // In a real application, this would be handled server-side
    // This is a simplified client-side approach for demonstration
    return 'client-side-detection';
  } catch {
    return 'unknown';
  }
}

// Enhanced secure token management
export function securelyStoreToken(token: string, metadata?: { expiresIn?: number }): void {
  const tokenData = {
    token,
    timestamp: Date.now(),
    expires: metadata?.expiresIn ? Date.now() + metadata.expiresIn : Date.now() + (8 * 60 * 60 * 1000) // 8 hours default
  };
  
  // Store in sessionStorage with expiration data
  sessionStorage.setItem('authTokenData', JSON.stringify(tokenData));
  
  // Create session in session manager
  try {
    const userEmail = 'current-user@example.com'; // This would come from auth context
    const userId = 'current-user-id'; // This would come from auth context
    const roles = ['user']; // This would come from auth context
    
    sessionManager.createSession(userId, userEmail, roles, {
      ipAddress: 'client-ip',
      userAgent: navigator.userAgent
    });
  } catch (error) {
    console.warn('Failed to create session:', error);
  }
}

export function getSecureToken(): string | null {
  try {
    const tokenDataStr = sessionStorage.getItem('authTokenData');
    if (!tokenDataStr) return null;
    
    const tokenData = JSON.parse(tokenDataStr);
    
    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      sessionStorage.removeItem('authTokenData');
      return null;
    }
    
    return tokenData.token;
  } catch {
    return null;
  }
}

// Security event logging with categorization
export function logSecurityEvent(
  event: string, 
  details: any, 
  risk: 'low' | 'medium' | 'high' = 'low',
  category: 'auth' | 'input' | 'rate_limit' | 'session' | 'general' = 'general'
): void {
  SQLInjectionProtector.logSecurityEvent(event, { ...details, category }, risk);
}

// Security health check
export function performSecurityHealthCheck(): {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Check CSRF token
  const csrfTokenData = sessionStorage.getItem('csrfTokenData');
  if (!csrfTokenData) {
    issues.push('CSRF token not found');
    recommendations.push('Generate new CSRF token');
  }
  
  // Check auth token
  const authToken = getSecureToken();
  if (!authToken) {
    issues.push('Authentication token missing or expired');
    recommendations.push('Re-authenticate user');
  }
  
  // Check for recent security events
  try {
    const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    const recentHighRisk = securityLogs.filter((log: any) => 
      log.risk === 'high' && 
      Date.now() - new Date(log.timestamp).getTime() < 60 * 60 * 1000 // Last hour
    );
    
    if (recentHighRisk.length > 5) {
      issues.push('Multiple high-risk security events detected');
      recommendations.push('Review security logs and consider additional protection');
    }
  } catch {
    // Ignore localStorage errors
  }
  
  const status = issues.length === 0 ? 'healthy' : issues.length < 3 ? 'warning' : 'critical';
  
  return { status, issues, recommendations };
}

// Export enhanced utilities
export {
  advancedRateLimiter,
  sessionManager,
  SQLInjectionProtector
};

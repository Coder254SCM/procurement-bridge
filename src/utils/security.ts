
/**
 * Security utility functions for protecting the application against common attacks
 */

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

// Implement CSRF token protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function storeCSRFToken(token: string): void {
  sessionStorage.setItem('csrfToken', token);
}

export function validateCSRFToken(token: string): boolean {
  return token === sessionStorage.getItem('csrfToken');
}

// Securely store authentication tokens
export function securelyStoreToken(token: string): void {
  // Store in sessionStorage rather than localStorage for better security
  // For production, consider using HttpOnly cookies set by the server instead
  sessionStorage.setItem('authToken', token);
}

export function getSecureToken(): string | null {
  return sessionStorage.getItem('authToken');
}

// Helper to set secure headers in fetch requests
export function createSecureHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  };

  const csrfToken = sessionStorage.getItem('csrfToken');
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  const authToken = getSecureToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  return headers;
}

// Create a secure fetch wrapper with proper headers and CSRF protection
export async function secureFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Merge default secure headers with any provided headers
  const secureOptions: RequestInit = {
    ...options,
    headers: {
      ...createSecureHeaders(),
      ...(options.headers || {})
    }
  };

  return fetch(url, secureOptions);
}

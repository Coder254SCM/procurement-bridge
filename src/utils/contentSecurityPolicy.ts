/**
 * Content Security Policy and Security Headers Manager
 * Provides comprehensive protection against XSS, clickjacking, and other attacks
 */

export interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
  'frame-ancestors': string[];
  'form-action': string[];
  'base-uri': string[];
  'upgrade-insecure-requests'?: boolean;
}

export const defaultCSPDirectives: CSPDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"], // Required for React
  'style-src': ["'self'", "'unsafe-inline'"], // Required for Tailwind
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://*.supabase.co', 'wss://*.supabase.co'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'frame-src': ["'none'"],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
  'upgrade-insecure-requests': true
};

export function buildCSPString(directives: CSPDirectives): string {
  const parts: string[] = [];
  
  for (const [key, value] of Object.entries(directives)) {
    if (key === 'upgrade-insecure-requests' && value === true) {
      parts.push('upgrade-insecure-requests');
    } else if (Array.isArray(value)) {
      parts.push(`${key} ${value.join(' ')}`);
    }
  }
  
  return parts.join('; ');
}

/**
 * Security Headers Configuration
 */
export const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  // Strict referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // Disable dangerous features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  // Force HTTPS
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  // Cross-Origin policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin'
};

/**
 * Apply security meta tags to document head
 */
export function applySecurityMetaTags(): void {
  // CSP meta tag
  const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  if (!existingCSP) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = buildCSPString(defaultCSPDirectives);
    document.head.appendChild(cspMeta);
  }

  // X-UA-Compatible for older browsers
  const existingUA = document.querySelector('meta[http-equiv="X-UA-Compatible"]');
  if (!existingUA) {
    const uaMeta = document.createElement('meta');
    uaMeta.httpEquiv = 'X-UA-Compatible';
    uaMeta.content = 'IE=edge';
    document.head.appendChild(uaMeta);
  }
}

/**
 * Nonce generator for inline scripts (when needed)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}

/**
 * Subresource Integrity (SRI) hash generator
 */
export async function generateSRIHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-384', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64Hash = btoa(String.fromCharCode(...hashArray));
  return `sha384-${base64Hash}`;
}

/**
 * DOM Purification for safe HTML rendering
 */
export function sanitizeHTML(dirty: string): string {
  const element = document.createElement('div');
  element.textContent = dirty;
  return element.innerHTML;
}

/**
 * Safe JSON parsing with prototype pollution protection
 */
export function safeJSONParse<T>(json: string, defaultValue: T): T {
  try {
    const parsed = JSON.parse(json);
    
    // Protect against prototype pollution
    if (typeof parsed === 'object' && parsed !== null) {
      const forbidden = ['__proto__', 'constructor', 'prototype'];
      const checkObject = (obj: any): boolean => {
        for (const key of Object.keys(obj)) {
          if (forbidden.includes(key)) {
            throw new Error('Prototype pollution attempt detected');
          }
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            checkObject(obj[key]);
          }
        }
        return true;
      };
      checkObject(parsed);
    }
    
    return parsed as T;
  } catch (error) {
    console.error('Safe JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * URL sanitization to prevent javascript: and data: attacks
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Only allow safe protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      console.warn('Blocked unsafe URL protocol:', parsed.protocol);
      return null;
    }
    
    return parsed.href;
  } catch {
    return null;
  }
}

/**
 * Initialize all security measures
 */
export function initializeSecurity(): void {
  applySecurityMetaTags();
  
  // Disable right-click context menu on sensitive forms (optional)
  // document.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Log security initialization
  console.log('[Security] Content Security Policy initialized');
}

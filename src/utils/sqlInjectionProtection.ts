/**
 * SQL Injection protection utilities
 * Additional layer on top of Supabase's built-in protection
 */

interface QueryValidationResult {
  isValid: boolean;
  risk: 'low' | 'medium' | 'high';
  issues: string[];
  sanitized?: string;
}

export class SQLInjectionProtector {
  private static readonly DANGEROUS_PATTERNS = [
    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION\s+(ALL\s+)?SELECT)/gi,
    /((\'|\")(\s)*(OR|AND)(\s)*(\'))/gi,
    /(--|\#|\/\*)/g,
    /(\bOR\b.*=.*\bOR\b)/gi,
    /(\bAND\b.*=.*\bAND\b)/gi,
    /(1\s*=\s*1|true|false)/gi,
    /(xp_|sp_|sys\.)/gi,
    /(information_schema|pg_)/gi,
    /(\bCAST\b|\bCONVERT\b)/gi,
    /(WAITFOR\s+DELAY)/gi,
    /(BENCHMARK\s*\()/gi
  ];

  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi
  ];

  private static readonly SUSPICIOUS_CHARS = [
    '\x00', '\x08', '\x09', '\x0a', '\x0d', '\x1a', '\x22', '\x27', '\x5c'
  ];

  static validateInput(input: string, context: 'query' | 'user_input' | 'file_name' = 'user_input'): QueryValidationResult {
    if (!input || typeof input !== 'string') {
      return { isValid: true, risk: 'low', issues: [] };
    }

    const issues: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';

    // Check for SQL injection patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(input)) {
        issues.push(`Potential SQL injection pattern detected: ${pattern.source}`);
        risk = 'high';
      }
    }

    // Check for XSS patterns
    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(input)) {
        issues.push(`Potential XSS pattern detected: ${pattern.source}`);
        risk = risk === 'high' ? 'high' : 'medium';
      }
    }

    // Check for suspicious characters
    for (const char of this.SUSPICIOUS_CHARS) {
      if (input.includes(char)) {
        issues.push(`Suspicious character detected: ${char.charCodeAt(0).toString(16)}`);
        risk = risk === 'high' ? 'high' : 'medium';
      }
    }

    // Context-specific validation
    if (context === 'query') {
      // More strict validation for query parameters
      if (input.length > 1000) {
        issues.push('Query parameter too long');
        risk = 'medium';
      }
    }

    if (context === 'file_name') {
      // File name specific validation
      const fileNamePattern = /^[a-zA-Z0-9._-]+$/;
      if (!fileNamePattern.test(input)) {
        issues.push('Invalid file name characters');
        risk = 'medium';
      }
    }

    const isValid = risk === 'low';
    const sanitized = isValid ? input : this.sanitizeInput(input);

    return {
      isValid,
      risk,
      issues,
      sanitized
    };
  }

  static sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';

    let sanitized = input;

    // Remove dangerous SQL patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      sanitized = sanitized.replace(pattern, '');
    }

    // Remove XSS patterns
    for (const pattern of this.XSS_PATTERNS) {
      sanitized = sanitized.replace(pattern, '');
    }

    // Remove suspicious characters
    for (const char of this.SUSPICIOUS_CHARS) {
      sanitized = sanitized.replace(new RegExp(char, 'g'), '');
    }

    // Additional sanitization
    sanitized = sanitized
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/['"]/g, '') // Remove quotes
      .replace(/[\\]/g, '') // Remove backslashes
      .trim()
      .substring(0, 1000); // Limit length

    return sanitized;
  }

  static validateSupabaseQuery(tableName: string, operation: string, filters?: any): QueryValidationResult {
    const issues: string[] = [];
    let risk: 'low' | 'medium' | 'high' = 'low';

    // Validate table name
    const tableValidation = this.validateInput(tableName, 'query');
    if (!tableValidation.isValid) {
      issues.push(...tableValidation.issues.map(issue => `Table name: ${issue}`));
      risk = 'high';
    }

    // Validate operation
    const allowedOperations = ['select', 'insert', 'update', 'delete', 'upsert'];
    if (!allowedOperations.includes(operation.toLowerCase())) {
      issues.push(`Invalid operation: ${operation}`);
      risk = 'high';
    }

    // Validate filters
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        const keyValidation = this.validateInput(key, 'query');
        if (!keyValidation.isValid) {
          issues.push(...keyValidation.issues.map(issue => `Filter key ${key}: ${issue}`));
          risk = 'high';
        }

        if (typeof value === 'string') {
          const valueValidation = this.validateInput(value, 'query');
          if (!valueValidation.isValid) {
            issues.push(...valueValidation.issues.map(issue => `Filter value ${key}: ${issue}`));
            risk = risk === 'high' ? 'high' : 'medium';
          }
        }
      }
    }

    return {
      isValid: risk === 'low',
      risk,
      issues
    };
  }

  static logSecurityEvent(event: string, details: any, risk: 'low' | 'medium' | 'high'): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      risk,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log locally
    console.warn('Security event detected:', logEntry);

    // In production, send to security monitoring system
    if (risk === 'high') {
      // Send immediate alert for high-risk events
      // SecurityMonitor.sendAlert(logEntry);
    }

    // Store for audit
    try {
      const securityLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      securityLogs.push(logEntry);
      
      // Keep only last 100 entries
      if (securityLogs.length > 100) {
        securityLogs.splice(0, securityLogs.length - 100);
      }
      
      localStorage.setItem('security_logs', JSON.stringify(securityLogs));
    } catch (error) {
      console.error('Failed to store security log:', error);
    }
  }
}

// Enhanced secure fetch wrapper
export async function secureSupabaseQuery(
  operation: string,
  tableName: string,
  options?: any
): Promise<{ data: any; error: any; securityWarnings?: string[] }> {
  // Validate the query first
  const validation = SQLInjectionProtector.validateSupabaseQuery(tableName, operation, options);
  
  if (!validation.isValid) {
    SQLInjectionProtector.logSecurityEvent(
      'Blocked potentially malicious query',
      { operation, tableName, options, issues: validation.issues },
      validation.risk
    );
    
    return {
      data: null,
      error: new Error('Query blocked for security reasons'),
      securityWarnings: validation.issues
    };
  }

  // If medium risk, log but allow
  if (validation.risk === 'medium') {
    SQLInjectionProtector.logSecurityEvent(
      'Suspicious query detected but allowed',
      { operation, tableName, options, issues: validation.issues },
      validation.risk
    );
  }

  // Proceed with the query (this would be handled by Supabase client)
  return {
    data: null, // Placeholder - actual implementation would use Supabase client
    error: null,
    securityWarnings: validation.risk === 'medium' ? validation.issues : undefined
  };
}

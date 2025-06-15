/**
 * Advanced rate limiting with multiple strategies and attack detection
 */

interface RateLimitConfig {
  maxAttempts: number;
  timeWindowMs: number;
  blockDurationMs: number;
  enableProgressiveDelay: boolean;
}

interface AttackPattern {
  suspiciousIPs: Set<string>;
  blockedIPs: Map<string, number>;
  attemptPatterns: Map<string, number[]>;
}

export class AdvancedRateLimiter {
  private attempts: Map<string, { count: number, timestamp: number, blocked: boolean }> = new Map();
  private attackPatterns: AttackPattern = {
    suspiciousIPs: new Set(),
    blockedIPs: new Map(),
    attemptPatterns: new Map()
  };
  
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    // Different rate limits for different operations
    this.configs.set('login', {
      maxAttempts: 5,
      timeWindowMs: 15 * 60 * 1000, // 15 minutes
      blockDurationMs: 30 * 60 * 1000, // 30 minutes
      enableProgressiveDelay: true
    });

    this.configs.set('api', {
      maxAttempts: 100,
      timeWindowMs: 60 * 1000, // 1 minute
      blockDurationMs: 5 * 60 * 1000, // 5 minutes
      enableProgressiveDelay: false
    });

    this.configs.set('sensitive', {
      maxAttempts: 3,
      timeWindowMs: 60 * 1000, // 1 minute
      blockDurationMs: 60 * 60 * 1000, // 1 hour
      enableProgressiveDelay: true
    });

    // Clean up old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  attempt(key: string, operation: string = 'api', userIP?: string): { allowed: boolean, remainingAttempts: number, retryAfter?: number } {
    const config = this.configs.get(operation) || this.configs.get('api')!;
    const now = Date.now();
    
    // Check if IP is blocked
    if (userIP && this.attackPatterns.blockedIPs.has(userIP)) {
      const blockExpiry = this.attackPatterns.blockedIPs.get(userIP)!;
      if (now < blockExpiry) {
        return { allowed: false, remainingAttempts: 0, retryAfter: blockExpiry - now };
      } else {
        this.attackPatterns.blockedIPs.delete(userIP);
      }
    }

    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, timestamp: now, blocked: false });
      this.trackAttemptPattern(userIP, now);
      return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
    }

    // Reset if outside time window
    if (now - record.timestamp > config.timeWindowMs) {
      this.attempts.set(key, { count: 1, timestamp: now, blocked: false });
      return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
    }

    // Check if already blocked
    if (record.blocked && now - record.timestamp < config.blockDurationMs) {
      return { 
        allowed: false, 
        remainingAttempts: 0, 
        retryAfter: config.blockDurationMs - (now - record.timestamp) 
      };
    }

    // Increment attempt count
    record.count += 1;
    this.trackAttemptPattern(userIP, now);

    if (record.count > config.maxAttempts) {
      record.blocked = true;
      record.timestamp = now;
      
      // Block IP if suspicious pattern detected
      if (userIP && this.detectSuspiciousActivity(userIP)) {
        this.attackPatterns.blockedIPs.set(userIP, now + config.blockDurationMs);
        this.attackPatterns.suspiciousIPs.add(userIP);
      }

      return { 
        allowed: false, 
        remainingAttempts: 0, 
        retryAfter: config.blockDurationMs 
      };
    }

    // Progressive delay for sensitive operations
    if (config.enableProgressiveDelay && record.count > config.maxAttempts / 2) {
      const delay = Math.pow(2, record.count - Math.floor(config.maxAttempts / 2)) * 1000;
      return { 
        allowed: true, 
        remainingAttempts: config.maxAttempts - record.count,
        retryAfter: delay
      };
    }

    return { 
      allowed: true, 
      remainingAttempts: config.maxAttempts - record.count 
    };
  }

  private trackAttemptPattern(userIP?: string, timestamp?: number): void {
    if (!userIP || !timestamp) return;

    const patterns = this.attackPatterns.attemptPatterns.get(userIP) || [];
    patterns.push(timestamp);
    
    // Keep only last 20 attempts
    if (patterns.length > 20) {
      patterns.shift();
    }
    
    this.attackPatterns.attemptPatterns.set(userIP, patterns);
  }

  private detectSuspiciousActivity(userIP: string): boolean {
    const patterns = this.attackPatterns.attemptPatterns.get(userIP) || [];
    if (patterns.length < 10) return false;

    const now = Date.now();
    const recentAttempts = patterns.filter(timestamp => now - timestamp < 60 * 1000); // Last minute
    
    // More than 10 attempts in last minute
    if (recentAttempts.length > 10) return true;

    // Check for rapid succession (less than 100ms between attempts)
    for (let i = 1; i < patterns.length; i++) {
      if (patterns[i] - patterns[i-1] < 100) return true;
    }

    return false;
  }

  private cleanup(): void {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    // Cleanup rate limit records
    for (const [key, record] of this.attempts.entries()) {
      if (now - record.timestamp > maxAge) {
        this.attempts.delete(key);
      }
    }

    // Cleanup blocked IPs
    for (const [ip, blockExpiry] of this.attackPatterns.blockedIPs.entries()) {
      if (now > blockExpiry) {
        this.attackPatterns.blockedIPs.delete(ip);
      }
    }

    // Cleanup attempt patterns
    for (const [ip, patterns] of this.attackPatterns.attemptPatterns.entries()) {
      const filteredPatterns = patterns.filter(timestamp => now - timestamp < maxAge);
      if (filteredPatterns.length === 0) {
        this.attackPatterns.attemptPatterns.delete(ip);
      } else {
        this.attackPatterns.attemptPatterns.set(ip, filteredPatterns);
      }
    }
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  getStats(): { totalAttempts: number, blockedIPs: number, suspiciousIPs: number } {
    return {
      totalAttempts: this.attempts.size,
      blockedIPs: this.attackPatterns.blockedIPs.size,
      suspiciousIPs: this.attackPatterns.suspiciousIPs.size
    };
  }

  isIPBlocked(ip: string): boolean {
    const blockExpiry = this.attackPatterns.blockedIPs.get(ip);
    if (!blockExpiry) return false;
    return Date.now() < blockExpiry;
  }
}

// Global instance
export const advancedRateLimiter = new AdvancedRateLimiter();

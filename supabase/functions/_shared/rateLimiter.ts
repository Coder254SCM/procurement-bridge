import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export interface RateLimitConfig {
  requestsPerHour: number;
  burstLimit?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  limit: number;
}

// Rate limit configurations per plan
export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'Starter': { requestsPerHour: 50, burstLimit: 10 },
  'Professional': { requestsPerHour: 100, burstLimit: 20 },
  'Enterprise': { requestsPerHour: 1000, burstLimit: 100 },
  'Government': { requestsPerHour: 5000, burstLimit: 500 },
  'None': { requestsPerHour: 10, burstLimit: 5 }
};

export async function checkRateLimit(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string,
  planName: string = 'None'
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[planName] || RATE_LIMITS['None'];
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const resetTime = new Date(Math.ceil(now.getTime() / (60 * 60 * 1000)) * (60 * 60 * 1000));

  // Get request count in the last hour
  const { data: recentRequests, error } = await supabase
    .from('rate_limit_tracking')
    .select('id')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('created_at', oneHourAgo.toISOString());

  if (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request but log it
    return {
      allowed: true,
      remaining: config.requestsPerHour,
      resetTime,
      limit: config.requestsPerHour
    };
  }

  const requestCount = recentRequests?.length || 0;
  const remaining = Math.max(0, config.requestsPerHour - requestCount);
  const allowed = requestCount < config.requestsPerHour;

  return {
    allowed,
    remaining,
    resetTime,
    limit: config.requestsPerHour
  };
}

export async function recordRateLimit(
  supabase: SupabaseClient,
  userId: string,
  endpoint: string,
  ipAddress: string | null,
  allowed: boolean
): Promise<void> {
  try {
    await supabase.from('rate_limit_tracking').insert({
      user_id: userId,
      endpoint,
      ip_address: ipAddress,
      allowed
    });
  } catch (error) {
    console.error('Failed to record rate limit:', error);
  }
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.floor(result.resetTime.getTime() / 1000).toString(),
    'Retry-After': Math.ceil((result.resetTime.getTime() - Date.now()) / 1000).toString()
  };
}

export async function cleanupOldRateLimits(supabase: SupabaseClient): Promise<void> {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  try {
    await supabase
      .from('rate_limit_tracking')
      .delete()
      .lt('created_at', sevenDaysAgo.toISOString());
  } catch (error) {
    console.error('Failed to cleanup old rate limits:', error);
  }
}

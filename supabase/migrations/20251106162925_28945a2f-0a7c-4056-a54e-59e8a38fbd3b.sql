-- Create rate_limit_tracking table for API rate limiting
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  ip_address INET,
  allowed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_user_endpoint ON public.rate_limit_tracking(user_id, endpoint, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limit_created_at ON public.rate_limit_tracking(created_at);

-- Enable RLS
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all rate limit records
CREATE POLICY "Admins can view all rate limits"
ON public.rate_limit_tracking
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Policy: Users can view their own rate limit records
CREATE POLICY "Users can view their own rate limits"
ON public.rate_limit_tracking
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Service role can insert rate limit records
CREATE POLICY "Service role can insert rate limits"
ON public.rate_limit_tracking
FOR INSERT
TO service_role
WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.rate_limit_tracking IS 'Tracks API rate limit requests per user and endpoint for subscription-based throttling';
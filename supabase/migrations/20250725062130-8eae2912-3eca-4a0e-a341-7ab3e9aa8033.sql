-- Create trial tracking table
CREATE TABLE public.user_trials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trial_type TEXT NOT NULL, -- 'tender_creation', 'bid_submission', 'evaluation'
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  trial_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own trials" 
ON public.user_trials 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage trials" 
ON public.user_trials 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price_monthly NUMERIC,
  price_yearly NUMERIC,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  trial_included BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, trial_included) VALUES
('Free Trial', 'One-time trial of procurement process', 0, 0, '["1 tender creation", "1 bid submission", "1 evaluation", "Basic blockchain verification"]'::jsonb, true),
('Starter', 'For small businesses', 29.99, 299.99, '["Up to 10 tenders/month", "Unlimited bids", "Basic analytics", "Email support", "Blockchain verification"]'::jsonb, false),
('Professional', 'For growing companies', 99.99, 999.99, '["Unlimited tenders", "Advanced analytics", "Priority support", "Advanced blockchain features", "Compliance automation"]'::jsonb, false),
('Enterprise', 'For large organizations', 299.99, 2999.99, '["Everything in Professional", "Custom integrations", "Dedicated support", "Advanced security", "Custom compliance frameworks"]'::jsonb, false);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing plans
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (active = true);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'trial'
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own subscriptions" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions" 
ON public.user_subscriptions 
FOR ALL 
USING (auth.role() = 'service_role'::text);

-- Create API access logs table for monitoring
CREATE TABLE public.api_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  request_data JSONB,
  response_status INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.api_access_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view logs
CREATE POLICY "Admins can view API logs" 
ON public.api_access_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create function to check trial eligibility
CREATE OR REPLACE FUNCTION public.check_trial_eligibility(
  user_id_param UUID,
  trial_type_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has already used this trial type
  RETURN NOT EXISTS (
    SELECT 1 
    FROM public.user_trials 
    WHERE user_id = user_id_param 
    AND trial_type = trial_type_param
  );
END;
$$;

-- Create function to check user subscription status
CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_id_param UUID)
RETURNS TABLE(
  has_active_subscription BOOLEAN,
  plan_name TEXT,
  status TEXT,
  trial_available BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN us.status = 'active' AND us.current_period_end > now() THEN true
      ELSE false
    END as has_active_subscription,
    sp.name as plan_name,
    COALESCE(us.status, 'none') as status,
    CASE 
      WHEN us.id IS NULL THEN true -- No subscription = trial available
      ELSE false
    END as trial_available
  FROM public.user_subscriptions us
  RIGHT JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id_param OR us.user_id IS NULL
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$;
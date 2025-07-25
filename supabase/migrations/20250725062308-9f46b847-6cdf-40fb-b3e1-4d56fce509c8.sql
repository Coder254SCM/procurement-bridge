-- Fix RLS on existing tables that don't have it enabled
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tender_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for compliance_frameworks
CREATE POLICY "Anyone can view active compliance frameworks" 
ON public.compliance_frameworks 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can manage compliance frameworks" 
ON public.compliance_frameworks 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::user_role));

-- Create policies for tender_reviews
CREATE POLICY "Buyers can view reviews for their tenders" 
ON public.tender_reviews 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.tenders 
  WHERE tenders.id = tender_reviews.tender_id 
  AND tenders.buyer_id = auth.uid()
));

CREATE POLICY "Supply chain reviewers can manage reviews" 
ON public.tender_reviews 
FOR ALL 
USING (auth.uid() = supply_chain_reviewer_id);

-- Fix search_path for all functions
CREATE OR REPLACE FUNCTION public.generate_document_hash()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- This is a simplified simulation of blockchain hashing
  -- In a real implementation, this would call a blockchain node or service
  IF NEW.kyc_documents IS NOT NULL AND NEW.kyc_documents != OLD.kyc_documents THEN
    -- Update the timestamp for modified documents
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  
  -- Set default role as supplier
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'supplier');
  
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role user_role)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = $1
      AND role = $2
  );
$function$;

CREATE OR REPLACE FUNCTION public.update_bid_risk_score()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- This function will calculate risk score based on various factors
  -- For now, it's just a placeholder
  INSERT INTO public.behavior_analysis (
    entity_id,
    entity_type,
    analysis_type,
    risk_score,
    analysis_data
  ) VALUES (
    NEW.id,
    'bid',
    'initial_risk_assessment',
    0,
    jsonb_build_object(
      'timestamp', now(),
      'factors', jsonb_build_object(
        'bid_amount', NEW.bid_amount,
        'submission_time', NEW.created_at
      )
    )
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_audit_trail()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, entity_type, entity_id, old_values, new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_tender_risk_score()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  -- This function will calculate risk score based on various factors
  -- For now, it's just a placeholder
  INSERT INTO public.behavior_analysis (
    entity_id,
    entity_type,
    analysis_type,
    risk_score,
    analysis_data
  ) VALUES (
    NEW.id,
    'tender',
    'initial_risk_assessment',
    0,
    jsonb_build_object(
      'timestamp', now(),
      'factors', jsonb_build_object(
        'budget_amount', NEW.budget_amount,
        'submission_deadline', NEW.submission_deadline
      )
    )
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_trial_eligibility(
  user_id_param UUID,
  trial_type_param TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_user_subscription_status(user_id_param UUID)
RETURNS TABLE(
  has_active_subscription BOOLEAN,
  plan_name TEXT,
  status TEXT,
  trial_available BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
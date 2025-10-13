-- Fix security warning: Set search_path for calculate_payment_delay_days function
ALTER FUNCTION public.calculate_payment_delay_days(timestamp with time zone, timestamp with time zone) 
SET search_path = public;
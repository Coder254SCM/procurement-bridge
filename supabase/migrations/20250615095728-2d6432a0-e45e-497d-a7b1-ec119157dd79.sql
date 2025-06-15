
ALTER TABLE public.profiles
ADD COLUMN performance_score NUMERIC DEFAULT 0;

COMMENT ON COLUMN public.profiles.performance_score IS 'A calculated score representing supplier performance based on various metrics.';

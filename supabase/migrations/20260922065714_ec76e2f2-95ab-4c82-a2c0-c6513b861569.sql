CREATE TYPE public.lead_status AS ENUM ('NEW','CONTACTED','QUALIFIED','IN_PROGRESS','CONVERTED','CLOSED');
CREATE TYPE public.lead_cta_type AS ENUM ('WHATSAPP','QUICK_FORM','LONG_FORM','CHATBOT');

CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  requirement TEXT,
  challenge TEXT,
  current_challenge TEXT,
  desired_outcome TEXT,
  current_tools TEXT,
  existing_ai_usage TEXT,
  project_scope TEXT,
  budget_range TEXT,
  preferred_contact_time TEXT,
  message TEXT,
  source TEXT,
  cta_type public.lead_cta_type NOT NULL DEFAULT 'QUICK_FORM',
  page TEXT,
  status public.lead_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lead_submission_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX lead_submission_log_client_key_created_at_idx ON public.lead_submission_log (client_key, created_at DESC);

GRANT ALL ON public.lead_submission_log TO service_role;
ALTER TABLE public.lead_submission_log ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
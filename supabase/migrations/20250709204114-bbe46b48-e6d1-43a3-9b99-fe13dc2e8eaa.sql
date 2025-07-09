-- Create table for N8N credentials
CREATE TABLE public.n8n_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  base_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for N8N agents/workflows configuration
CREATE TABLE public.n8n_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  credential_id UUID NOT NULL REFERENCES public.n8n_credentials(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  workflow_id TEXT NOT NULL,
  webhook_url TEXT,
  status TEXT NOT NULL DEFAULT 'paused' CHECK (status IN ('running', 'paused', 'error')),
  last_triggered TIMESTAMP WITH TIME ZONE,
  messages_handled INTEGER NOT NULL DEFAULT 0,
  tools JSONB DEFAULT '[]'::jsonb,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.n8n_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for n8n_credentials
CREATE POLICY "Users can view their own N8N credentials" 
ON public.n8n_credentials 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own N8N credentials" 
ON public.n8n_credentials 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own N8N credentials" 
ON public.n8n_credentials 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own N8N credentials" 
ON public.n8n_credentials 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for n8n_agents
CREATE POLICY "Users can view their own N8N agents" 
ON public.n8n_agents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own N8N agents" 
ON public.n8n_agents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own N8N agents" 
ON public.n8n_agents 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own N8N agents" 
ON public.n8n_agents 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_n8n_credentials_updated_at
    BEFORE UPDATE ON public.n8n_credentials
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_n8n_agents_updated_at
    BEFORE UPDATE ON public.n8n_agents
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_n8n_credentials_user_id ON public.n8n_credentials(user_id);
CREATE INDEX idx_n8n_agents_user_id ON public.n8n_agents(user_id);
CREATE INDEX idx_n8n_agents_credential_id ON public.n8n_agents(credential_id);
CREATE INDEX idx_n8n_agents_status ON public.n8n_agents(status);
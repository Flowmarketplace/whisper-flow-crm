-- Temporarily disable RLS for demo purposes
-- Modify existing policies to allow public access for agents table
DROP POLICY IF EXISTS "Users can view their own N8N agents" ON public.n8n_agents;
DROP POLICY IF EXISTS "Users can create their own N8N agents" ON public.n8n_agents;
DROP POLICY IF EXISTS "Users can update their own N8N agents" ON public.n8n_agents;
DROP POLICY IF EXISTS "Users can delete their own N8N agents" ON public.n8n_agents;

-- Create temporary public access policies
CREATE POLICY "Temporary public access to N8N agents" 
ON public.n8n_agents 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Do the same for credentials table
DROP POLICY IF EXISTS "Users can view their own N8N credentials" ON public.n8n_credentials;
DROP POLICY IF EXISTS "Users can create their own N8N credentials" ON public.n8n_credentials;
DROP POLICY IF EXISTS "Users can update their own N8N credentials" ON public.n8n_credentials;
DROP POLICY IF EXISTS "Users can delete their own N8N credentials" ON public.n8n_credentials;

CREATE POLICY "Temporary public access to N8N credentials" 
ON public.n8n_credentials 
FOR ALL 
USING (true)
WITH CHECK (true);
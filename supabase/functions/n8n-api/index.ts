import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, credentialId, workflowId, data } = await req.json();

    // Get user's N8N credentials
    const { data: credential, error: credError } = await supabaseClient
      .from('n8n_credentials')
      .select('*')
      .eq('id', credentialId)
      .eq('is_active', true)
      .single();

    if (credError || !credential) {
      console.error('Credential error:', credError);
      return new Response(JSON.stringify({ error: 'Invalid or inactive credentials' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const n8nHeaders = {
      'X-N8N-API-KEY': credential.api_key,
      'Content-Type': 'application/json',
    };

    let response;
    let result;

    switch (action) {
      case 'get_workflows':
        response = await fetch(`${credential.base_url}/api/v1/workflows`, {
          headers: n8nHeaders,
        });
        result = await response.json();
        break;

      case 'get_workflow':
        response = await fetch(`${credential.base_url}/api/v1/workflows/${workflowId}`, {
          headers: n8nHeaders,
        });
        result = await response.json();
        break;

      case 'execute_workflow':
        response = await fetch(`${credential.base_url}/api/v1/workflows/${workflowId}/execute`, {
          method: 'POST',
          headers: n8nHeaders,
          body: JSON.stringify(data || {}),
        });
        result = await response.json();
        
        // Update agent stats
        if (response.ok) {
          await supabaseClient
            .from('n8n_agents')
            .update({ 
              last_triggered: new Date().toISOString(),
              messages_handled: supabaseClient.sql`messages_handled + 1`
            })
            .eq('workflow_id', workflowId);
        }
        break;

      case 'activate_workflow':
        response = await fetch(`${credential.base_url}/api/v1/workflows/${workflowId}/activate`, {
          method: 'POST',
          headers: n8nHeaders,
        });
        result = await response.json();
        break;

      case 'deactivate_workflow':
        response = await fetch(`${credential.base_url}/api/v1/workflows/${workflowId}/activate`, {
          method: 'DELETE',
          headers: n8nHeaders,
        });
        result = await response.json();
        break;

      case 'test_webhook':
        response = await fetch(`${credential.base_url}/api/v1/webhooks-test/${workflowId}`, {
          method: 'POST',
          headers: n8nHeaders,
          body: JSON.stringify(data || { test: true }),
        });
        result = await response.json();
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    console.log(`N8N API ${action} result:`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in n8n-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
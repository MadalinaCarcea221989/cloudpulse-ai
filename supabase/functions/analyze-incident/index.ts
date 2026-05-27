import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Validate Authorization (Security Hardening)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 3. Process Request
    const { incident, includeRemediation } = await req.json()

    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY secret')
    }

    const provider = (incident.provider || 'aws').toLowerCase()
    const cliTool = provider === 'aws' ? 'aws' : provider === 'azure' ? 'az' : 'curl'

    // 4. AI Persona & Prompting (Defense Ready)
    let systemPrompt = `You are a Senior SRE and Data Engineer at CloudPulse. 
    You are analyzing a production incident captured via our StatusPage/TimescaleDB ingestion pipeline.
    Analyze the incident and return a structured JSON response.
    
    Expected JSON format:
    {
      "whatBroke": "1-2 sentences explaining what failed based on the incident context.",
      "userImpact": "1-2 sentences on user-facing impact.",
      "whatToMonitor": "1-2 sentences on what metrics to watch.",
      "revenueLossEstimate": "Estimate loss in USD (e.g. '$150/hr') based on affected requests if data suggests it, otherwise 'Minimal'."
    `

    if (includeRemediation) {
      systemPrompt += `,
      "immediateActions": [
        {"cmd": "Executable CLI command using ${cliTool}", "time": "est. time to run, e.g. 2 min"},
        {"cmd": "Another CLI command", "time": "est. time"}
      ],
      "shortTerm": ["Process or config change 1", "Process or config change 2"],
      "longTerm": ["Architectural improvement 1", "Architectural improvement 2"]
      `
    }

    systemPrompt += `\n}
    Return ONLY raw JSON, no markdown formatting. Be technical, concise, and professional.`

    const userPrompt = `
      Incident ID: ${incident.incident_id || incident.id}
      Title: ${incident.title}
      Provider: ${incident.provider}
      Service: ${incident.service}
      Region: ${incident.region}
      Started At: ${incident.started_at || incident.created_at}
      Raw Telemetry Data: ${JSON.stringify(incident.raw_json)}
    `

    // 5. Anthropic API Call
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Anthropic API error: ${errorData.error?.message || response.statusText}`)
    }

    const data = await response.json()
    const result = JSON.parse(data.content[0].text)

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Analyze-Incident Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

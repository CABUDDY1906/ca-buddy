import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get Auth Header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get DB and Service Role Key from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Missing environment configuration' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client using Service Role Key
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey)
    
    // Get the caller's auth user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user: callerUser }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Query caller's role and firm_id from staff table
    const { data: callerStaff, error: callerStaffError } = await supabaseClient
      .from('staff')
      .select('role, firm_id')
      .eq('auth_user_id', callerUser.id)
      .single()

    if (callerStaffError || !callerStaff) {
      return new Response(JSON.stringify({ error: 'Caller staff profile not found' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify caller is an Admin
    if (callerStaff.role !== 'Admin') {
      return new Response(JSON.stringify({ error: 'Access denied: Admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const body = await req.json()
    const { staff_id, email, password, full_name } = body

    if (!staff_id || !email || !password || !full_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields: staff_id, email, password, full_name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters long' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Query the target staff member
    const { data: targetStaff, error: targetStaffError } = await supabaseClient
      .from('staff')
      .select('firm_id, auth_user_id')
      .eq('id', staff_id)
      .single()

    if (targetStaffError || !targetStaff) {
      return new Response(JSON.stringify({ error: 'Target staff member not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify target staff belongs to the same firm_id as the caller
    if (targetStaff.firm_id !== callerStaff.firm_id) {
      return new Response(JSON.stringify({ error: 'Access denied: Target staff belongs to a different firm' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify target staff does not already have auth_user_id set
    if (targetStaff.auth_user_id) {
      return new Response(JSON.stringify({ error: 'Staff member already has an authentication user assigned' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create the user in Supabase Auth using admin client
    const { data: newAuthUser, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (createUserError || !newAuthUser.user) {
      return new Response(JSON.stringify({ error: createUserError?.message || 'Failed to create auth user' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const newUserId = newAuthUser.user.id

    // Update the staff row
    const { error: updateStaffError } = await supabaseClient
      .from('staff')
      .update({ auth_user_id: newUserId })
      .eq('id', staff_id)

    if (updateStaffError) {
      // Rollback: delete the created auth user
      await supabaseClient.auth.admin.deleteUser(newUserId)
      return new Response(JSON.stringify({ error: 'Failed to link staff member to auth user: ' + updateStaffError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, user_id: newUserId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

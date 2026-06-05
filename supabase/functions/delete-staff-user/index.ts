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

    // Initialize Supabase client
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

    // Query caller's details from staff table
    const { data: callerStaff, error: callerStaffError } = await supabaseClient
      .from('staff')
      .select('id, role, firm_id')
      .eq('auth_user_id', callerUser.id)
      .single()

    if (callerStaffError || !callerStaff) {
      return new Response(JSON.stringify({ error: 'Caller staff profile not found' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const body = await req.json()
    const { staff_id } = body

    if (!staff_id) {
      return new Response(JSON.stringify({ error: 'Missing required field: staff_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Guard: Prevent self-deletion
    if (staff_id === callerStaff.id) {
      return new Response(JSON.stringify({ error: 'You cannot delete your own account.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Query the target staff member
    const { data: targetStaff, error: targetStaffError } = await supabaseClient
      .from('staff')
      .select('id, role, firm_id, auth_user_id')
      .eq('id', staff_id)
      .single()

    if (targetStaffError || !targetStaff) {
      return new Response(JSON.stringify({ error: 'Target staff member not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify target staff belongs to the same firm_id as caller
    if (targetStaff.firm_id !== callerStaff.firm_id) {
      return new Response(JSON.stringify({ error: 'Access denied: Target staff belongs to a different firm' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Verify caller's role permission
    if (callerStaff.role === 'Admin') {
      // Admins can delete anyone (except themselves, which is guarded above)
    } else if (callerStaff.role === 'Manager') {
      // Managers can only delete Article Assistants and Junior Auditors
      const allowedRoles = ['Article Assistant', 'Junior Auditor']
      if (!allowedRoles.includes(targetStaff.role)) {
        return new Response(JSON.stringify({ error: 'Access denied: Managers can only delete Article Assistants and Junior Auditors' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else {
      // Article Assistants and Junior Auditors cannot delete anyone
      return new Response(JSON.stringify({ error: 'Access denied: Insufficient permissions to delete staff members' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Permanently delete the Auth user if present
    if (targetStaff.auth_user_id) {
      const { error: deleteAuthError } = await supabaseClient.auth.admin.deleteUser(targetStaff.auth_user_id)
      if (deleteAuthError) {
        return new Response(JSON.stringify({ error: 'Failed to delete auth user: ' + deleteAuthError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    // Permanently delete the staff record
    const { error: deleteStaffError } = await supabaseClient
      .from('staff')
      .delete()
      .eq('id', staff_id)

    if (deleteStaffError) {
      return new Response(JSON.stringify({ error: 'Failed to delete staff record: ' + deleteStaffError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
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

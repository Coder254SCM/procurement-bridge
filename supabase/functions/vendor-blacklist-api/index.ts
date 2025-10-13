import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, ...params } = await req.json();

    console.log(`[vendor-blacklist-api] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'check':
        return await checkBlacklist(supabaseClient, params);
      case 'list':
        return await listBlacklist(supabaseClient, user, params);
      case 'add':
        return await addToBlacklist(supabaseClient, user, params);
      case 'update':
        return await updateBlacklist(supabaseClient, user, params);
      case 'remove':
        return await removeFromBlacklist(supabaseClient, user, params);
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('[vendor-blacklist-api] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function checkBlacklist(client: any, params: any) {
  const { supplier_id } = params;

  if (!supplier_id) {
    return new Response(JSON.stringify({ error: 'supplier_id required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await client
    .from('vendor_blacklist')
    .select('*')
    .eq('supplier_id', supplier_id)
    .eq('is_active', true)
    .gte('expiry_date', new Date().toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return new Response(JSON.stringify({
    is_blacklisted: !!data,
    blacklist_entry: data || null,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function listBlacklist(client: any, user: any, params: any) {
  const { active_only = true, limit = 100, offset = 0 } = params;

  let query = client
    .from('vendor_blacklist')
    .select(`
      *,
      supplier:profiles!supplier_id(id, company_name),
      blacklisted_by_user:profiles!blacklisted_by(id, full_name)
    `)
    .order('blacklist_date', { ascending: false })
    .range(offset, offset + limit - 1);

  if (active_only) {
    query = query.eq('is_active', true);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return new Response(JSON.stringify({
    blacklist: data,
    total: count,
    limit,
    offset,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function addToBlacklist(client: any, user: any, params: any) {
  const { supplier_id, blacklist_reason, expiry_date, supporting_documents } = params;

  if (!supplier_id || !blacklist_reason) {
    return new Response(JSON.stringify({ error: 'supplier_id and blacklist_reason required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check if user is admin
  const { data: roles } = await client
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const isAdmin = roles?.some((r: any) => r.role === 'admin');

  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Only admins can blacklist suppliers' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await client
    .from('vendor_blacklist')
    .insert({
      supplier_id,
      blacklisted_by: user.id,
      blacklist_reason,
      expiry_date: expiry_date || null,
      supporting_documents: supporting_documents || [],
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;

  console.log(`[vendor-blacklist-api] Supplier ${supplier_id} blacklisted by ${user.id}`);

  return new Response(JSON.stringify({ blacklist_entry: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function updateBlacklist(client: any, user: any, params: any) {
  const { blacklist_id, updates } = params;

  if (!blacklist_id) {
    return new Response(JSON.stringify({ error: 'blacklist_id required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await client
    .from('vendor_blacklist')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', blacklist_id)
    .select()
    .single();

  if (error) throw error;

  console.log(`[vendor-blacklist-api] Blacklist entry ${blacklist_id} updated by ${user.id}`);

  return new Response(JSON.stringify({ blacklist_entry: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function removeFromBlacklist(client: any, user: any, params: any) {
  const { blacklist_id } = params;

  if (!blacklist_id) {
    return new Response(JSON.stringify({ error: 'blacklist_id required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await client
    .from('vendor_blacklist')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', blacklist_id)
    .select()
    .single();

  if (error) throw error;

  console.log(`[vendor-blacklist-api] Blacklist entry ${blacklist_id} deactivated by ${user.id}`);

  return new Response(JSON.stringify({ blacklist_entry: data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
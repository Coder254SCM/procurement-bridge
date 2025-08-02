import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()

    switch (action) {
      case 'create_category':
        const { data: category, error: catError } = await supabase
          .from('product_categories')
          .insert(data)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: category, error: catError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'create_catalog_item':
        const { data: item, error: itemError } = await supabase
          .from('catalog_items')
          .insert(data)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: item, error: itemError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'list_categories':
        const { data: categories, error: listCatError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('active', true)
          .order('name')
        
        return new Response(JSON.stringify({ data: categories, error: listCatError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'list_catalog_items':
        const { category_id, supplier_id, limit = 50, offset = 0 } = data || {}
        let query = supabase
          .from('catalog_items')
          .select(`
            *,
            product_categories(name, code),
            profiles(full_name)
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (category_id) {
          query = query.eq('category_id', category_id)
        }
        if (supplier_id) {
          query = query.eq('supplier_id', supplier_id)
        }

        const { data: items, error: listItemError } = await query
        
        return new Response(JSON.stringify({ data: items, error: listItemError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'update_catalog_item':
        const { id, ...updateData } = data
        const { data: updatedItem, error: updateError } = await supabase
          .from('catalog_items')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        return new Response(JSON.stringify({ data: updatedItem, error: updateError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      case 'search_catalog':
        const { search_term, filters = {} } = data
        let searchQuery = supabase
          .from('catalog_items')
          .select(`
            *,
            product_categories(name, code)
          `)
          .eq('status', 'active')

        if (search_term) {
          searchQuery = searchQuery.or(`name.ilike.%${search_term}%,description.ilike.%${search_term}%,sku.ilike.%${search_term}%`)
        }

        if (filters.category_id) {
          searchQuery = searchQuery.eq('category_id', filters.category_id)
        }
        if (filters.price_min) {
          searchQuery = searchQuery.gte('base_price', filters.price_min)
        }
        if (filters.price_max) {
          searchQuery = searchQuery.lte('base_price', filters.price_max)
        }

        const { data: searchResults, error: searchError } = await searchQuery
          .order('name')
          .limit(100)

        return new Response(JSON.stringify({ data: searchResults, error: searchError }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Catalog management error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
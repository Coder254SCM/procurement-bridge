
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch data from Kenya PPIP API
async function fetchTendersFromPPIP(fiscalYear: string): Promise<any> {
  try {
    console.log(`Fetching tenders from PPIP API for fiscal year ${fiscalYear}`);
    const response = await fetch(`https://tenders.go.ke/api/ocds/tenders?fy=${fiscalYear}`);
    
    if (!response.ok) {
      throw new Error(`PPIP API returned ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching PPIP data: ${error.message}`);
    throw new Error(`Failed to fetch data from PPIP API: ${error.message}`);
  }
}

// Fetch supplier details from PPIP
async function fetchSupplierDetails(): Promise<any> {
  try {
    console.log('Fetching supplier details from PPIP');
    const response = await fetch('https://tenders.go.ke/suppliersdisplay');
    
    if (!response.ok) {
      throw new Error(`PPIP API returned ${response.status}: ${response.statusText}`);
    }
    
    // This endpoint might return HTML, so we'll need to scrape it
    // For now, we'll return the raw response
    return await response.text();
  } catch (error) {
    console.error(`Error fetching PPIP supplier data: ${error.message}`);
    throw new Error(`Failed to fetch supplier data from PPIP: ${error.message}`);
  }
}

// Simple HTML scraper for supplier data
function scrapeSupplierDataFromHTML(html: string): any[] {
  // This is a simplified example, in a real implementation, you would use 
  // a proper HTML parser library to extract structured data
  
  // For demonstration purposes, we'll extract some basic patterns
  // This is not a robust implementation, just a demonstration
  
  const suppliers = [];
  
  // Match table rows (this pattern will need to be adjusted based on the actual HTML)
  const rowPattern = /<tr\s+class="grid_item">(.+?)<\/tr>/gs;
  let match;
  
  while ((match = rowPattern.exec(html)) !== null) {
    const rowContent = match[1];
    
    // Extract data cells (adjust based on actual HTML)
    const nameMatch = /<td.*?>(.+?)<\/td>/i.exec(rowContent);
    const addressMatch = /<td.*?>(.+?)<\/td>/i.exec(rowContent.substring(nameMatch.index + nameMatch[0].length));
    
    if (nameMatch && addressMatch) {
      suppliers.push({
        name: nameMatch[1].trim().replace(/<[^>]*>/g, ''),
        address: addressMatch[1].trim().replace(/<[^>]*>/g, '')
      });
    }
  }
  
  return suppliers;
}

// Cross-reference supplier data with our database
async function crossReferenceSuppliers(
  supabaseClient: any,
  ppipSuppliers: any[]
): Promise<any> {
  // Get our supplier profiles
  const { data: profiles, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .not('company_name', 'is', null);
  
  if (error) {
    console.error('Error fetching supplier profiles:', error);
    throw error;
  }
  
  const matches = [];
  const irregularities = [];
  
  // For each of our suppliers, check if they exist in the PPIP data
  for (const profile of profiles) {
    if (!profile.company_name) continue;
    
    // Look for matches
    const matchedSuppliers = ppipSuppliers.filter(supplier => {
      // Case-insensitive partial match
      return supplier.name.toLowerCase().includes(profile.company_name.toLowerCase()) ||
             profile.company_name.toLowerCase().includes(supplier.name.toLowerCase());
    });
    
    if (matchedSuppliers.length > 0) {
      matches.push({
        profile_id: profile.id,
        company_name: profile.company_name,
        matches: matchedSuppliers
      });
    } else {
      // Supplier not found in PPIP data
      irregularities.push({
        type: 'supplier_not_in_ppip',
        profile_id: profile.id,
        company_name: profile.company_name,
        severity: 'medium',
        description: 'Supplier not found in public procurement database'
      });
    }
  }
  
  return {
    matches,
    irregularities
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Check if user has admin role to run this cross-reference
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    
    const isAdmin = userRoles && userRoles.some(r => r.role === 'admin');
    
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'This operation requires admin privileges' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    // Get request parameters
    const { operation, fiscalYear = '2023-2024' } = await req.json();
    
    if (!operation) {
      return new Response(
        JSON.stringify({ error: 'Operation type is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    let result;
    
    switch (operation) {
      case 'fetch_tenders':
        result = await fetchTendersFromPPIP(fiscalYear);
        break;
        
      case 'fetch_suppliers':
        const suppliersHTML = await fetchSupplierDetails();
        const suppliersData = scrapeSupplierDataFromHTML(suppliersHTML);
        result = { suppliers: suppliersData };
        break;
        
      case 'cross_reference_suppliers':
        const supplierHTML = await fetchSupplierDetails();
        const supplierData = scrapeSupplierDataFromHTML(supplierHTML);
        result = await crossReferenceSuppliers(supabaseClient, supplierData);
        
        // Record irregularities in behavior analysis
        if (result.irregularities && result.irregularities.length > 0) {
          for (const irregularity of result.irregularities) {
            await supabaseClient
              .from('behavior_analysis')
              .insert({
                entity_id: irregularity.profile_id,
                entity_type: 'user',
                analysis_type: 'ppip_cross_reference',
                risk_score: irregularity.severity === 'high' ? 70 : 35,
                analysis_data: {
                  irregularity_type: irregularity.type,
                  description: irregularity.description,
                  timestamp: new Date().toISOString()
                }
              });
          }
        }
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unsupported operation' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        operation,
        result
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in PPIP integration:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

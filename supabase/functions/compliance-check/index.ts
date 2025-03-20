
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock PEP and sanctions data for demonstration
const mockPepData = [
  { name: "John Smith", position: "Minister of Finance", country: "Exampleland", risk: "high" },
  { name: "Maria Rodriguez", position: "Deputy Minister", country: "Samplestan", risk: "medium" },
  { name: "Ahmed Khan", position: "Provincial Governor", country: "Testland", risk: "medium" },
  { name: "Li Wei", position: "Mayor", country: "Demoville", risk: "low" },
];

const mockSanctionedEntities = [
  { name: "Blacklisted Corp", country: "Restrictistan", reason: "Export violations", date: "2022-05-15" },
  { name: "Embargoed Industries Ltd", country: "Sanctionia", reason: "Financial violations", date: "2023-01-10" },
  { name: "Prohibited Enterprises", country: "Restrictland", reason: "Procurement fraud", date: "2021-11-23" },
];

// Simple string similarity check (Levenshtein distance)
function similarity(s1: string, s2: string): number {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  
  // Convert to a similarity percentage
  const maxLength = Math.max(s1.length, s2.length);
  if (maxLength === 0) return 100; // Both strings are empty
  
  const distance = costs[s2.length];
  return Math.round((1 - distance / maxLength) * 100);
}

async function performComplianceCheck(type: string, entityData: any) {
  console.log(`Running ${type} check for`, entityData);
  
  // Simulate a delay to mimic actual API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const results = {
    type,
    timestamp: new Date().toISOString(),
    status: "completed",
    passed: true,
    score: 0,
    matches: [],
    flags: [],
  };
  
  if (type === "pep_check") {
    // Check entity name and directors against mock PEP list
    const nameToCheck = entityData.company_name || "";
    const directorsToCheck = entityData.directors || [];
    
    let highestScore = 0;
    let highestMatch = null;
    
    // Check company name
    for (const pep of mockPepData) {
      const similarityScore = similarity(nameToCheck, pep.name);
      if (similarityScore > 80) {
        results.matches.push({
          type: "company",
          name: nameToCheck,
          matched_with: pep.name,
          position: pep.position,
          country: pep.country,
          similarity: similarityScore,
          risk: pep.risk
        });
        
        highestScore = Math.max(highestScore, similarityScore);
        highestMatch = pep;
      }
    }
    
    // Check directors
    for (const director of directorsToCheck) {
      for (const pep of mockPepData) {
        const similarityScore = similarity(director, pep.name);
        if (similarityScore > 80) {
          results.matches.push({
            type: "director",
            name: director,
            matched_with: pep.name,
            position: pep.position,
            country: pep.country,
            similarity: similarityScore,
            risk: pep.risk
          });
          
          if (similarityScore > highestScore) {
            highestScore = similarityScore;
            highestMatch = pep;
          }
        }
      }
    }
    
    // Set pass/fail based on matches
    if (results.matches.length > 0) {
      results.passed = false;
      results.score = highestMatch?.risk === "high" ? 80 : 
                      highestMatch?.risk === "medium" ? 50 : 30;
      results.flags.push(`Potential PEP match found: ${highestMatch?.name}`);
    }
  }
  else if (type === "sanctions_list") {
    // Check entity name against mock sanctions list
    const nameToCheck = entityData.company_name || "";
    
    for (const entity of mockSanctionedEntities) {
      const similarityScore = similarity(nameToCheck, entity.name);
      if (similarityScore > 75) {
        results.matches.push({
          name: nameToCheck,
          matched_with: entity.name,
          country: entity.country,
          reason: entity.reason,
          date: entity.date,
          similarity: similarityScore
        });
      }
    }
    
    // Set pass/fail based on matches
    if (results.matches.length > 0) {
      results.passed = false;
      results.score = 90; // High risk score for sanctions match
      results.flags.push(`Potential sanctions list match found: ${results.matches[0].matched_with}`);
    }
  }
  else if (type === "shell_company_check") {
    // Check for shell company indicators
    const indicators = [];
    
    // Check company age
    if (!entityData.established_date || new Date(entityData.established_date) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)) {
      indicators.push("Recently established company");
    }
    
    // Check for registered address patterns
    if (entityData.address && (
      entityData.address.toLowerCase().includes("virtual") || 
      entityData.address.toLowerCase().includes("registered office") ||
      entityData.address.toLowerCase().includes("mailbox")
    )) {
      indicators.push("Virtual office or mailbox address");
    }
    
    // Check for minimal capitalization
    if (entityData.capital && parseFloat(entityData.capital) < 5000) {
      indicators.push("Minimal capitalization");
    }
    
    // Add indicators to results
    if (indicators.length > 0) {
      results.flags = indicators;
      results.passed = false;
      results.score = Math.min(indicators.length * 25, 90);
    }
  }
  else if (type === "disbarred_entities") {
    // Simulate disbarred entities check (random for demo)
    const isDisbarred = Math.random() < 0.1; // 10% chance of being disbarred in this demo
    
    if (isDisbarred) {
      results.passed = false;
      results.score = 100;
      results.flags.push("Entity appears on disbarred list");
      results.matches.push({
        list: "Government Procurement Exclusion List",
        reason: "Previous contract violations",
        date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }
  
  return results;
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
    
    // Get request body
    const { checkType, entityData } = await req.json();
    
    if (!checkType) {
      return new Response(
        JSON.stringify({ error: 'Check type is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // If entityData is not provided, get profile data
    let dataToCheck = entityData;
    if (!dataToCheck) {
      const { data: profileData, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch profile data' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
      
      dataToCheck = profileData;
    }
    
    // Perform the compliance check
    const results = await performComplianceCheck(checkType, dataToCheck);
    
    // Store results in the database
    await supabaseClient
      .from('compliance_checks')
      .insert({
        user_id: user.id,
        check_type: checkType,
        status: results.passed ? 'verified' : 'flagged',
        result_data: results,
        next_check_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      });
    
    // Update profile risk score if check failed
    if (!results.passed) {
      await supabaseClient
        .from('profiles')
        .update({ 
          risk_score: results.score,
          verification_status: results.score > 70 ? 'flagged' : 'in_progress'
        })
        .eq('id', user.id);
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error processing compliance check:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

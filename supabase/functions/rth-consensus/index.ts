import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// RTH Consensus Service implementation
class RTHConsensusService {
  calculatePhaseAngle(valueA: number, valueB: number, k = 900): number {
    if (Math.max(valueA, valueB) === 0) return 0;
    const variance = Math.abs(valueA - valueB) / Math.max(valueA, valueB);
    return Math.min(180, variance * k);
  }

  buildPhaseMatrix(verifications: any[]) {
    const matrix: any = {};
    
    for (let i = 0; i < verifications.length; i++) {
      for (let j = i + 1; j < verifications.length; j++) {
        const phase = this.calculatePhaseAngle(
          verifications[i].verified_value,
          verifications[j].verified_value
        );
        
        const interferenceType = 
          phase < 45 ? 'constructive' : 
          phase < 90 ? 'partial' : 'destructive';
        
        matrix[`${i}-${j}`] = { phase, interferenceType };
      }
    }
    
    return matrix;
  }

  calculateVerifierAveragePhase(
    verifierIndex: number,
    phaseMatrix: any,
    totalVerifiers: number
  ): number {
    let sumPhase = 0;
    let count = 0;
    
    for (let j = 0; j < totalVerifiers; j++) {
      if (j !== verifierIndex) {
        const key = verifierIndex < j ? `${verifierIndex}-${j}` : `${j}-${verifierIndex}`;
        if (phaseMatrix[key]) {
          sumPhase += phaseMatrix[key].phase;
          count++;
        }
      }
    }
    
    return count > 0 ? sumPhase / count : 0;
  }

  calculateConsensus(verifications: any[], phaseMatrix: any) {
    const verifierPhases = verifications.map((_, idx) => 
      this.calculateVerifierAveragePhase(idx, phaseMatrix, verifications.length)
    );
    
    let sumX = 0;
    let sumY = 0;
    let sumAmplitudes = 0;
    
    for (let i = 0; i < verifications.length; i++) {
      const v = verifications[i];
      const phase = verifierPhases[i];
      const radians = (phase * Math.PI) / 180;
      
      sumX += v.amplitude * Math.cos(radians);
      sumY += v.amplitude * Math.sin(radians);
      sumAmplitudes += v.amplitude;
    }
    
    const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
    const avgPhaseRad = Math.atan2(sumY, sumX);
    const avgPhase = Math.abs(avgPhaseRad * (180 / Math.PI));
    
    const rNormalized = magnitude / sumAmplitudes;
    const circularVariance = 1 - rNormalized;
    
    const confidence = (1 - avgPhase / 180) * rNormalized * 100;
    
    let decision: string;
    if (confidence >= 75 && circularVariance < 0.3) {
      decision = 'AUTHORIZE';
    } else if (confidence >= 50 && circularVariance < 0.5) {
      decision = 'CAUTION';
    } else {
      decision = 'BLOCK';
    }
    
    const phaseStability = (1 - circularVariance) * 100;
    
    return {
      magnitude,
      avgPhase,
      confidence,
      circularVariance,
      decision,
      phaseStability
    };
  }

  identifyOutlier(verifications: any[], phaseMatrix: any) {
    const discordScores: Record<number, number> = {};
    
    for (let i = 0; i < verifications.length; i++) {
      discordScores[i] = 0;
      
      for (let j = 0; j < verifications.length; j++) {
        if (i !== j) {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (phaseMatrix[key] && phaseMatrix[key].phase > 90) {
            discordScores[i]++;
          }
        }
      }
    }
    
    const outlierIdx = Object.keys(discordScores).reduce((a, b) => 
      discordScores[Number(a)] > discordScores[Number(b)] ? a : b
    );
    
    const maxDiscord = discordScores[Number(outlierIdx)];
    
    if (maxDiscord >= verifications.length / 2) {
      return {
        outlierId: verifications[Number(outlierIdx)].verifier_id,
        confidence: (maxDiscord / (verifications.length - 1)) * 100,
        discordScore: maxDiscord,
        reason: `High phase discrepancy with ${maxDiscord} of ${verifications.length - 1} other verifiers`
      };
    }
    
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { sessionId, action } = await req.json();
    const rthService = new RTHConsensusService();

    if (action === 'calculate_consensus') {
      // Fetch all verifications for session
      const { data: verifications, error: verifyError } = await supabase
        .from('rth_verifications')
        .select('*')
        .eq('session_id', sessionId);

      if (verifyError) throw verifyError;

      // Require minimum 4 verifiers (tetrahedral quorum)
      if (!verifications || verifications.length < 4) {
        return new Response(JSON.stringify({
          error: 'Minimum 4 verifiers required for RTH consensus (tetrahedral quorum)',
          currentCount: verifications?.length || 0,
          requiredCount: 4
        }), { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Build phase matrix
      const phaseMatrix = rthService.buildPhaseMatrix(verifications);

      // Save phase matrix to database
      const phaseMatrixEntries = Object.entries(phaseMatrix).map(([key, value]: [string, any]) => {
        const [i, j] = key.split('-').map(Number);
        return {
          session_id: sessionId,
          verifier_i: verifications[i].verifier_id,
          verifier_j: verifications[j].verifier_id,
          phase_angle: value.phase,
          interference_type: value.interferenceType
        };
      });

      await supabase.from('rth_phase_matrix').insert(phaseMatrixEntries);

      // Calculate consensus
      const consensus = rthService.calculateConsensus(verifications, phaseMatrix);

      // Identify outlier if consensus weak
      let outlier = null;
      if (consensus.decision !== 'AUTHORIZE') {
        outlier = rthService.identifyOutlier(verifications, phaseMatrix);
      }

      // Update session with results
      await supabase
        .from('rth_verification_sessions')
        .update({
          status: consensus.decision === 'BLOCK' ? 'no_consensus' : 
                  consensus.decision === 'AUTHORIZE' ? 'consensus_reached' : 'in_progress',
          confidence_score: consensus.confidence,
          average_phase: consensus.avgPhase,
          circular_variance: consensus.circularVariance,
          consensus_result: { consensus, phaseMatrix: Object.keys(phaseMatrix).length },
          outlier_detected: !!outlier,
          outlier_verifier_id: outlier?.outlierId || null,
          outlier_confidence: outlier?.confidence || null,
          decision: consensus.decision,
          completed_at: new Date().toISOString(),
          current_verifiers: verifications.length
        })
        .eq('id', sessionId);

      // Record on blockchain if authorized
      if (consensus.decision === 'AUTHORIZE') {
        try {
          await supabase.functions.invoke('blockchain-verification', {
            body: {
              transactionType: 'rth_consensus',
              entityId: sessionId,
              metadata: {
                confidence: consensus.confidence,
                verifierCount: verifications.length,
                decision: consensus.decision,
                timestamp: new Date().toISOString()
              }
            }
          });
        } catch (blockchainError) {
          console.error('Blockchain recording failed:', blockchainError);
          // Continue even if blockchain fails
        }
      }

      return new Response(JSON.stringify({
        consensus,
        outlier,
        phaseMatrixSize: Object.keys(phaseMatrix).length,
        verificationCount: verifications.length,
        message: consensus.decision === 'AUTHORIZE' ? 
          'Strong consensus reached - payment authorized' :
          consensus.decision === 'CAUTION' ? 
          'Weak consensus - additional verification recommended' :
          'No consensus - payment blocked, investigation required'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'submit_verification') {
      const { verifierId, sessionId: sid, verifiedValue, verificationData, comments } = await req.json();

      // Get verifier info
      const { data: verifier } = await supabase
        .from('rth_verifiers')
        .select('*')
        .eq('id', verifierId)
        .single();

      if (!verifier) {
        return new Response(JSON.stringify({ error: 'Verifier not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Calculate response time
      const { data: session } = await supabase
        .from('rth_verification_sessions')
        .select('created_at')
        .eq('id', sid)
        .single();

      const responseTimeSeconds = session ? 
        Math.floor((new Date().getTime() - new Date(session.created_at).getTime()) / 1000) : 0;

      // Insert verification
      const { data: newVerification, error: insertError } = await supabase
        .from('rth_verifications')
        .insert({
          session_id: sid,
          verifier_id: verifierId,
          verified_value: verifiedValue,
          verification_data: verificationData,
          amplitude: verifier.reputation_amplitude,
          frequency: 1 / (responseTimeSeconds / 3600), // Hz
          wavelength: verifier.consistency_period,
          response_time_seconds: responseTimeSeconds,
          comments
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Check if we have enough verifications to calculate consensus
      const { count } = await supabase
        .from('rth_verifications')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sid);

      return new Response(JSON.stringify({
        verification: newVerification,
        canCalculateConsensus: (count || 0) >= 4,
        currentCount: count || 0,
        requiredCount: 4
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('RTH consensus error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

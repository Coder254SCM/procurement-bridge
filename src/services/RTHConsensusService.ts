/**
 * RTH (Resonant Tender Harmonics) Consensus Service
 * Implementation of wave-based multi-party verification using circular statistics
 * 
 * Based on patent: Wave-based multi-party consensus system for blockchain procurement
 */

export interface Verification {
  id: string;
  verifier_id: string;
  verified_value: number;
  amplitude: number;
  frequency: number;
  wavelength: number;
  timestamp: string;
}

export interface PhaseMatrix {
  [key: string]: {
    phase: number;
    interferenceType: 'constructive' | 'partial' | 'destructive';
  };
}

export interface ConsensusResult {
  magnitude: number;
  avgPhase: number;
  confidence: number;
  circularVariance: number;
  decision: 'AUTHORIZE' | 'CAUTION' | 'BLOCK';
  phaseStability: number;
}

export interface OutlierResult {
  outlierId: string;
  confidence: number;
  discordScore: number;
  reason: string;
}

export interface DualFieldResult {
  fieldPhase: number;
  fraudLikelihood: number;
  interferenceType: 'constructive' | 'partial' | 'destructive';
}

export interface RiskPressureResult {
  totalPressure: number;
  riskState: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  verificationFrequency: string;
  paymentTerms: string;
}

export class RTHConsensusService {
  /**
   * Core algorithm: Calculate phase angle between two values
   * Phase angle quantifies agreement using normalized variance metric
   * 
   * @param valueA First verification value
   * @param valueB Second verification value
   * @param k Calibration constant (default 900° for 10% variance → 90° phase)
   * @returns Phase angle in degrees (0-180)
   */
  calculatePhaseAngle(valueA: number, valueB: number, k = 900): number {
    if (Math.max(valueA, valueB) === 0) return 0;
    const variance = Math.abs(valueA - valueB) / Math.max(valueA, valueB);
    return Math.min(180, variance * k);
  }

  /**
   * Build NxN phase matrix for all verifier pairs
   * Calculates phase angles between all verification combinations
   * 
   * @param verifications Array of verifications
   * @returns Phase matrix with pairwise comparisons
   */
  buildPhaseMatrix(verifications: Verification[]): PhaseMatrix {
    const matrix: PhaseMatrix = {};
    
    for (let i = 0; i < verifications.length; i++) {
      for (let j = i + 1; j < verifications.length; j++) {
        const phase = this.calculatePhaseAngle(
          verifications[i].verified_value,
          verifications[j].verified_value
        );
        
        const interferenceType: 'constructive' | 'partial' | 'destructive' = 
          phase < 45 ? 'constructive' : 
          phase < 90 ? 'partial' : 'destructive';
        
        matrix[`${i}-${j}`] = { phase, interferenceType };
      }
    }
    
    return matrix;
  }

  /**
   * Calculate average phase angle for a single verifier against all others
   * 
   * @param verifierIndex Index of the verifier
   * @param phaseMatrix Phase matrix
   * @param totalVerifiers Total number of verifiers
   * @returns Average phase angle
   */
  private calculateVerifierAveragePhase(
    verifierIndex: number, 
    phaseMatrix: PhaseMatrix,
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

  /**
   * Calculate consensus at tetrahedral center using vector summation
   * Implements the core RTH algorithm with circular statistics
   * 
   * @param verifications Array of verifications
   * @param phaseMatrix Phase matrix
   * @returns Consensus result with confidence score and decision
   */
  async calculateConsensus(
    verifications: Verification[],
    phaseMatrix: PhaseMatrix
  ): Promise<ConsensusResult> {
    // Calculate average phase for each verifier
    const verifierPhases = verifications.map((_, idx) => 
      this.calculateVerifierAveragePhase(idx, phaseMatrix, verifications.length)
    );
    
    // Vector summation in phase space
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
    
    // Resultant vector
    const magnitude = Math.sqrt(sumX * sumX + sumY * sumY);
    const avgPhaseRad = Math.atan2(sumY, sumX);
    const avgPhase = Math.abs(avgPhaseRad * (180 / Math.PI));
    
    // Circular variance (phase stability)
    const rNormalized = magnitude / sumAmplitudes;
    const circularVariance = 1 - rNormalized;
    
    // Confidence score (0-100%)
    const confidence = (1 - avgPhase / 180) * rNormalized * 100;
    
    // Decision logic based on patent thresholds
    let decision: 'AUTHORIZE' | 'CAUTION' | 'BLOCK';
    if (confidence >= 75 && circularVariance < 0.3) {
      decision = 'AUTHORIZE';
    } else if (confidence >= 50 && circularVariance < 0.5) {
      decision = 'CAUTION';
    } else {
      decision = 'BLOCK';
    }
    
    // Phase stability (inverse of circular variance)
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

  /**
   * Identify outlier verifier causing destructive interference
   * Uses discord score = number of high-phase (>90°) relationships
   * 
   * @param verifications Array of verifications
   * @param phaseMatrix Phase matrix
   * @returns Outlier result or null if no clear outlier
   */
  async identifyOutlier(
    verifications: Verification[],
    phaseMatrix: PhaseMatrix
  ): Promise<OutlierResult | null> {
    const discordScores: Record<number, number> = {};
    
    // Count high-phase relationships for each verifier
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
    
    // Find verifier with highest discord
    const outlierIdx = Object.keys(discordScores).reduce((a, b) => 
      discordScores[Number(a)] > discordScores[Number(b)] ? a : b
    );
    
    const maxDiscord = discordScores[Number(outlierIdx)];
    
    // Flag only if isolated from majority (>50% high-phase relationships)
    if (maxDiscord >= verifications.length / 2) {
      return {
        outlierId: verifications[Number(outlierIdx)].verifier_id,
        confidence: (maxDiscord / (verifications.length - 1)) * 100,
        discordScore: maxDiscord,
        reason: `High phase discrepancy with ${maxDiscord} of ${verifications.length - 1} other verifiers (${((maxDiscord / (verifications.length - 1)) * 100).toFixed(1)}% discord)`
      };
    }
    
    return null;
  }

  /**
   * Dual-field validation: Compare objective vs subjective data
   * Detects fraud by analyzing phase difference between sensor and human reports
   * 
   * @param objectiveValue Value from IoT sensor/GPS/API
   * @param subjectiveValue Value from human verifier report
   * @returns Dual-field result with fraud likelihood
   */
  async validateDualFields(
    objectiveValue: number,
    subjectiveValue: number
  ): Promise<DualFieldResult> {
    const fieldPhase = this.calculatePhaseAngle(objectiveValue, subjectiveValue);
    
    // Fraud likelihood based on phase angle
    const fraudLikelihood = fieldPhase >= 90 ? 100 : (fieldPhase / 90) * 100;
    
    // Interference classification
    const interferenceType: 'constructive' | 'partial' | 'destructive' = 
      fieldPhase < 45 ? 'constructive' :
      fieldPhase < 90 ? 'partial' : 'destructive';
    
    return {
      fieldPhase,
      fraudLikelihood,
      interferenceType
    };
  }

  /**
   * Calculate risk pressure from multi-source data
   * Aggregates tax, credit, regulatory, and performance scores
   * 
   * @param scores Risk component scores (0-100 scale)
   * @returns Risk pressure result with state and frequency
   */
  async calculateRiskPressure(scores: {
    taxCompliance: number;
    creditScore: number;
    regulatoryCompliance: number;
    performanceScore: number;
  }): Promise<RiskPressureResult> {
    // Default weights from patent
    const weights = {
      tax: 0.35,
      credit: 0.20,
      regulatory: 0.30,
      performance: 0.15
    };
    
    // Multi-source risk aggregation
    const totalPressure = 
      weights.tax * (100 - scores.taxCompliance) +
      weights.credit * (100 - scores.creditScore) +
      weights.regulatory * (100 - scores.regulatoryCompliance) +
      weights.performance * (100 - scores.performanceScore);
    
    // State determination
    let riskState: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    let verificationFrequency: string;
    let paymentTerms: string;
    
    if (totalPressure <= 30) {
      riskState = 'LOW';
      verificationFrequency = 'monthly';
      paymentTerms = 'Net 30 days';
    } else if (totalPressure <= 60) {
      riskState = 'MODERATE';
      verificationFrequency = 'bi-weekly';
      paymentTerms = 'Net 15 days';
    } else if (totalPressure <= 85) {
      riskState = 'HIGH';
      verificationFrequency = 'weekly';
      paymentTerms = 'Payment on delivery';
    } else {
      riskState = 'CRITICAL';
      verificationFrequency = 'daily';
      paymentTerms = 'BLOCKED - Payment suspended';
    }
    
    return {
      totalPressure,
      riskState,
      verificationFrequency,
      paymentTerms
    };
  }

  /**
   * Tetrahedral quorum validation
   * Ensures minimum 4 verifiers (tetrahedral minimum)
   * 
   * @param verificationCount Number of verifications
   * @returns True if quorum is met
   */
  validateTetrahedralQuorum(verificationCount: number): boolean {
    return verificationCount >= 4;
  }

  /**
   * Update verifier reputation based on consensus result
   * Uses exponential moving average
   * 
   * @param currentAmplitude Current reputation (0-1)
   * @param wasCorrect Whether verification matched consensus
   * @param weight Weight factor (1.0 normal, 2.0 for high-value contracts)
   * @returns New reputation amplitude
   */
  updateVerifierReputation(
    currentAmplitude: number,
    wasCorrect: boolean,
    weight: number = 1.0
  ): number {
    const delta = wasCorrect ? 0.10 * weight : -0.25 * weight;
    const newAmplitude = currentAmplitude + delta;
    
    // Clamp between 0 and 1
    return Math.max(0, Math.min(1, newAmplitude));
  }
}

export const rthService = new RTHConsensusService();

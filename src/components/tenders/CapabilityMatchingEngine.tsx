import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Target, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupplierMatch {
  id: string;
  company_name: string;
  verification_level: string;
  performance_score: number;
  matchScore: number;
  matchReasons: string[];
}

interface CapabilityMatchingEngineProps {
  tenderCategory: string;
  budgetAmount: number;
  evaluationCriteria: Record<string, number>;
  onInviteSuppliers?: (supplierIds: string[]) => void;
}

const CapabilityMatchingEngine: React.FC<CapabilityMatchingEngineProps> = ({
  tenderCategory,
  budgetAmount,
  evaluationCriteria,
  onInviteSuppliers
}) => {
  const [matches, setMatches] = useState<SupplierMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    findMatchingSuppliers();
  }, [tenderCategory, budgetAmount]);

  const findMatchingSuppliers = async () => {
    setLoading(true);
    try {
      // Fetch suppliers with qualifications
      const { data: qualifications, error } = await supabase
        .from('supplier_qualifications')
        .select(`
          *,
          profiles:supplier_id (
            id,
            company_name,
            verification_level,
            performance_score,
            industry
          )
        `)
        .eq('status', 'approved');

      if (error) throw error;

      if (qualifications && qualifications.length > 0) {
        const matchedSuppliers = qualifications
          .map((qual: any) => {
            const supplier = qual.profiles;
            if (!supplier) return null;

            const matchScore = calculateMatchScore(qual, supplier);
            const matchReasons = getMatchReasons(qual, supplier);

            return {
              id: supplier.id,
              company_name: supplier.company_name || 'Unknown Company',
              verification_level: supplier.verification_level || 'none',
              performance_score: supplier.performance_score || 0,
              matchScore,
              matchReasons
            };
          })
          .filter((match): match is SupplierMatch => match !== null)
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 10); // Top 10 matches

        setMatches(matchedSuppliers);
      }
    } catch (error) {
      console.error('Error finding matching suppliers:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to find matching suppliers'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (qualification: any, supplier: any): number => {
    let score = 0;

    // Category match (40 points)
    if (supplier.industry && supplier.industry.toLowerCase().includes(tenderCategory.toLowerCase())) {
      score += 40;
    }

    // Financial capacity (25 points)
    const financialCapacity = qualification.financial_capacity || 0;
    if (financialCapacity >= budgetAmount * 1.5) {
      score += 25;
    } else if (financialCapacity >= budgetAmount) {
      score += 15;
    }

    // Quality rating (15 points)
    const qualityRating = qualification.quality_rating || 0;
    score += Math.min(15, qualityRating * 15 / 100);

    // Compliance score (10 points)
    const complianceScore = qualification.compliance_score || 0;
    score += Math.min(10, complianceScore * 10 / 100);

    // Verification level (10 points)
    const verificationPoints: Record<string, number> = {
      'advanced': 10,
      'intermediate': 7,
      'basic': 4,
      'none': 0
    };
    score += verificationPoints[supplier.verification_level] || 0;

    return Math.round(score);
  };

  const getMatchReasons = (qualification: any, supplier: any): string[] => {
    const reasons: string[] = [];

    if (supplier.industry && supplier.industry.toLowerCase().includes(tenderCategory.toLowerCase())) {
      reasons.push('Industry expertise match');
    }

    const financialCapacity = qualification.financial_capacity || 0;
    if (financialCapacity >= budgetAmount * 1.5) {
      reasons.push('Strong financial capacity');
    }

    if (qualification.quality_rating >= 80) {
      reasons.push('Excellent quality rating');
    }

    if (supplier.verification_level === 'advanced') {
      reasons.push('Advanced verification level');
    }

    if (supplier.performance_score >= 80) {
      reasons.push('High performance score');
    }

    return reasons;
  };

  const getMatchColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getMatchBadge = (score: number): JSX.Element => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent Match</Badge>;
    if (score >= 60) return <Badge className="bg-blue-100 text-blue-800">Good Match</Badge>;
    if (score >= 40) return <Badge className="bg-yellow-100 text-yellow-800">Fair Match</Badge>;
    return <Badge className="bg-gray-100 text-gray-800">Low Match</Badge>;
  };

  const toggleSupplierSelection = (supplierId: string) => {
    setSelectedSuppliers(prev =>
      prev.includes(supplierId)
        ? prev.filter(id => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleInviteSelected = () => {
    if (onInviteSuppliers && selectedSuppliers.length > 0) {
      onInviteSuppliers(selectedSuppliers);
      toast({
        title: 'Invitations Sent',
        description: `${selectedSuppliers.length} supplier(s) have been invited to bid`
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading matching suppliers...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          AI-Powered Capability Matching
        </CardTitle>
        <CardDescription>
          Intelligent matching of suppliers based on tender requirements and historical performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No matching suppliers found for this tender</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {matches.length} matching suppliers found
                </span>
              </div>
              {selectedSuppliers.length > 0 && (
                <Button size="sm" onClick={handleInviteSelected}>
                  Invite {selectedSuppliers.length} Selected
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className={`p-4 border rounded-lg hover:bg-secondary/20 transition-colors cursor-pointer ${
                    selectedSuppliers.includes(match.id) ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => toggleSupplierSelection(match.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{match.company_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {match.verification_level}
                        </Badge>
                        {getMatchBadge(match.matchScore)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getMatchColor(match.matchScore)}`}>
                        {match.matchScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                  </div>

                  <Progress value={match.matchScore} className="h-1.5 mb-3" />

                  <div className="space-y-1">
                    {match.matchReasons.map((reason, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        {reason}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CapabilityMatchingEngine;

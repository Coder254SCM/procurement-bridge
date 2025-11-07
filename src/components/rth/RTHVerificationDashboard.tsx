import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Shield, TrendingUp, Users, Waves } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RTHVerificationDashboardProps {
  session: {
    id: string;
    status: string;
    confidence_score?: number;
    average_phase?: number;
    circular_variance?: number;
    decision?: string;
    outlier_detected?: boolean;
    outlier_confidence?: number;
    current_verifiers: number;
    required_verifiers: number;
  };
  verifications: any[];
  phaseMatrix?: any;
}

export const RTHVerificationDashboard = ({
  session,
  verifications,
  phaseMatrix
}: RTHVerificationDashboardProps) => {
  const getDecisionColor = (decision?: string) => {
    switch (decision) {
      case 'AUTHORIZE':
        return 'bg-green-500';
      case 'CAUTION':
        return 'bg-yellow-500';
      case 'BLOCK':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'consensus_reached':
        return <Badge className="bg-green-500">Consensus Reached</Badge>;
      case 'no_consensus':
        return <Badge className="bg-red-500">No Consensus</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'blocked':
        return <Badge className="bg-red-600">Blocked</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getInterferenceColor = (type: string) => {
    switch (type) {
      case 'constructive':
        return 'text-green-500';
      case 'partial':
        return 'text-yellow-500';
      case 'destructive':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-6 w-6" />
                RTH Verification Session
              </CardTitle>
              <CardDescription>
                Wave-based multi-party consensus using circular statistics
              </CardDescription>
            </div>
            {getStatusBadge(session.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Verifiers</div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-2xl font-bold">
                  {session.current_verifiers}/{session.required_verifiers}
                </span>
              </div>
              <Progress 
                value={(session.current_verifiers / session.required_verifiers) * 100} 
                className="h-2"
              />
            </div>

            {session.confidence_score !== undefined && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Confidence Score</div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-2xl font-bold">
                    {session.confidence_score.toFixed(1)}%
                  </span>
                </div>
                <Progress 
                  value={session.confidence_score} 
                  className={`h-2 ${
                    session.confidence_score >= 75 ? 'bg-green-100' :
                    session.confidence_score >= 50 ? 'bg-yellow-100' : 'bg-red-100'
                  }`}
                />
              </div>
            )}

            {session.average_phase !== undefined && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Average Phase</div>
                <div className="text-2xl font-bold">{session.average_phase.toFixed(1)}°</div>
                <div className="text-xs text-muted-foreground">
                  {session.average_phase < 45 ? 'Strong alignment' :
                   session.average_phase < 90 ? 'Moderate discord' : 'High discord'}
                </div>
              </div>
            )}

            {session.circular_variance !== undefined && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phase Stability</div>
                <div className="text-2xl font-bold">
                  {((1 - session.circular_variance) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {session.circular_variance < 0.3 ? 'Very stable' :
                   session.circular_variance < 0.5 ? 'Moderately stable' : 'Unstable'}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Decision Alert */}
      {session.decision && (
        <Alert className={session.decision === 'AUTHORIZE' ? 'border-green-500' : 
                         session.decision === 'CAUTION' ? 'border-yellow-500' : 'border-red-500'}>
          <div className="flex items-start gap-3">
            {session.decision === 'AUTHORIZE' ? (
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            ) : session.decision === 'CAUTION' ? (
              <Shield className="h-5 w-5 text-yellow-500 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold mb-1">
                {session.decision === 'AUTHORIZE' ? 'Payment Authorized' :
                 session.decision === 'CAUTION' ? 'Additional Verification Recommended' :
                 'Payment Blocked'}
              </h4>
              <AlertDescription>
                {session.decision === 'AUTHORIZE' 
                  ? `Strong consensus reached with ${session.confidence_score?.toFixed(1)}% confidence. All verifiers are in phase alignment.`
                  : session.decision === 'CAUTION'
                  ? `Weak consensus detected with ${session.confidence_score?.toFixed(1)}% confidence. Consider additional verification before proceeding.`
                  : `No consensus reached (${session.confidence_score?.toFixed(1)}% confidence). Significant phase discrepancy detected. Payment has been blocked pending investigation.`}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      )}

      {/* Outlier Alert */}
      {session.outlier_detected && (
        <Alert className="border-orange-500">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <AlertDescription>
            <strong>Outlier Detected:</strong> One verifier shows destructive interference with the consensus.
            Confidence: {session.outlier_confidence?.toFixed(1)}%. Investigation recommended.
          </AlertDescription>
        </Alert>
      )}

      {/* Verifications Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Verifications</CardTitle>
          <CardDescription>
            Each verification represented as a wave in phase space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifications.map((v, idx) => (
              <Card key={v.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Verifier {idx + 1}</CardTitle>
                    <Badge variant="outline">
                      Phase: {v.phase_angle ? v.phase_angle.toFixed(1) : 'N/A'}°
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-semibold">{v.verified_value}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reputation:</span>
                    <span className="font-semibold">{(v.amplitude * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response:</span>
                    <span className="font-semibold">{v.response_time_seconds}s</span>
                  </div>
                  {v.comments && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">{v.comments}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tetrahedral Quorum Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tetrahedral Quorum Geometry</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            RTH uses tetrahedral geometry (4 vertices minimum) to ensure stable 3D consensus.
            All verifiers are equidistant from the consensus center point, ensuring democratic validation.
          </p>
          {session.current_verifiers < 4 && (
            <Alert className="mt-4 border-yellow-500">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertDescription>
                <strong>Quorum Not Met:</strong> Need {4 - session.current_verifiers} more verifier(s)
                to reach tetrahedral minimum.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, Info, AlertTriangle, Clock } from 'lucide-react';
import { VerificationStatus } from '@/hooks/useBlockchainVerification';

interface VerificationStatusBadgeProps {
  currentStatus: VerificationStatus;
}

export const VerificationStatusBadge = ({ currentStatus }: VerificationStatusBadgeProps) => {
  switch (currentStatus) {
    case VerificationStatus.PROCESSING:
    case VerificationStatus.VERIFYING:
    case VerificationStatus.SUBMITTING:
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          <span>Processing</span>
        </Badge>
      );
    case VerificationStatus.CONFIRMED:
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>Confirming</span>
        </Badge>
      );
    case VerificationStatus.COMPLETED:
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          <span>Completed</span>
        </Badge>
      );
    case VerificationStatus.FAILED:
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
          <span>Failed</span>
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          <Info className="h-3.5 w-3.5 mr-1.5" />
          <span>Ready</span>
        </Badge>
      );
  }
};

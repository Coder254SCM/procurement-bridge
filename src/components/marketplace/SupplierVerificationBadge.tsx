
import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export type VerificationStatus = 'verified' | 'pending' | 'unverified' | 'rejected';
export type VerificationLevel = 'basic' | 'standard' | 'advanced';

export interface VerificationDetails {
  status: VerificationStatus;
  level: VerificationLevel;
  lastVerified?: string;
  blockchainTxId?: string;
  verificationScore?: number;
  completedProjects?: number;
  performanceRating?: number;
}

interface SupplierVerificationBadgeProps {
  verification: VerificationDetails;
  showDetails?: boolean;
}

const SupplierVerificationBadge = ({ 
  verification, 
  showDetails = false 
}: SupplierVerificationBadgeProps) => {
  const { status, level, lastVerified, blockchainTxId, verificationScore } = verification;
  
  const getBadgeColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'unverified':
        return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case 'pending':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'unverified':
        return <Shield className="h-3.5 w-3.5 mr-1" />;
      case 'rejected':
        return <AlertTriangle className="h-3.5 w-3.5 mr-1" />;
      default:
        return <Shield className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  const getLevelLabel = () => {
    switch (level) {
      case 'basic':
        return 'Basic';
      case 'standard':
        return 'Standard';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const truncateTxId = (txId?: string) => {
    if (!txId) return 'N/A';
    return `${txId.substring(0, 8)}...${txId.substring(txId.length - 6)}`;
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`flex items-center ${getBadgeColor()}`}>
            {getIcon()}
            <span>
              {status === 'verified' ? 'Blockchain Verified' : status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="w-80 p-0">
          <div className="p-3">
            <h4 className="font-medium mb-2">Supplier Verification</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Status:</div>
              <div className="font-medium">{status.charAt(0).toUpperCase() + status.slice(1)}</div>
              
              <div>Level:</div>
              <div className="font-medium">{getLevelLabel()}</div>
              
              <div>Last Verified:</div>
              <div className="font-medium">{formatDate(lastVerified)}</div>
              
              {blockchainTxId && (
                <>
                  <div>Blockchain TX:</div>
                  <div className="font-medium">{truncateTxId(blockchainTxId)}</div>
                </>
              )}
              
              {verificationScore !== undefined && (
                <>
                  <div>Trust Score:</div>
                  <div className="font-medium">{verificationScore}/100</div>
                </>
              )}
            </div>
            
            {status === 'verified' && (
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <span>Credentials verified on blockchain</span>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SupplierVerificationBadge;

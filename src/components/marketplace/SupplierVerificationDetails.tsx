
import React from 'react';
import { CheckCircle2, ShieldCheck, ExternalLink, Info, AlertTriangle, Loader2, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SupplierProps } from './SupplierCard';
import { VerificationDetails, VerificationLevel } from './SupplierVerificationBadge';
import SupplierVerificationDialog from './SupplierVerificationDialog';
import { useBlockchainVerification, VerificationStatus } from '@/hooks/useBlockchainVerification';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface SupplierVerificationDetailsProps {
  supplier: SupplierProps;
  onVerificationComplete?: (verification: VerificationDetails) => void;
  isProcessing?: boolean;
  error?: string | null;
}

const SupplierVerificationDetails = ({ 
  supplier, 
  onVerificationComplete, 
  isProcessing = false, 
  error = null 
}: SupplierVerificationDetailsProps) => {
  const verification = supplier.verification || {
    status: 'unverified',
    level: 'basic',
    lastVerified: undefined
  };
  
  // Get status from blockchain hook for enhanced state tracking
  const { currentStatus, transactionDetails } = useBlockchainVerification();
  
  const getLevelDescription = (level: VerificationLevel) => {
    switch (level) {
      case 'basic':
        return 'Email and phone verification';
      case 'standard':
        return 'Business registration and tax compliance';
      case 'advanced':
        return 'Full KYC, business registration, tax compliance, and performance history';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (verification.status) {
      case 'verified':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not verified yet';
    return new Date(dateString).toLocaleString();
  };

  const truncateTxId = (txId?: string) => {
    if (!txId) return 'Not available';
    return `${txId.substring(0, 10)}...${txId.substring(txId.length - 8)}`;
  };
  
  // Get status badge with enhanced visual indicators
  const getStatusBadge = () => {
    if (isProcessing) {
      switch (currentStatus) {
        case VerificationStatus.PROCESSING:
        case VerificationStatus.VERIFYING:
          return (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              <span>Processing</span>
            </Badge>
          );
        case VerificationStatus.SUBMITTING:
        case VerificationStatus.CONFIRMED:
          return (
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Confirming</span>
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              <span>Processing</span>
            </Badge>
          );
      }
    }
    
    if (verification.status === 'verified') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
          <span>Blockchain Verified</span>
        </Badge>
      );
    } else if (verification.status === 'pending') {
      return (
        <Badge variant="outline" className="bg-amber-100 text-amber-800">
          <Info className="h-3.5 w-3.5 mr-1.5" />
          <span>Pending</span>
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
          <span>Not Verified</span>
        </Badge>
      );
    }
  };
  
  // Function to view transaction details
  const handleViewTransactionDetails = () => {
    // In a real app, this would open a blockchain explorer or modal
    // For this example, we'll show a toast with transaction info
    if (verification.blockchainTxId) {
      toast({
        title: "Transaction Details",
        description: `Transaction ID: ${truncateTxId(verification.blockchainTxId)}`,
        variant: "default"
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Blockchain Verification</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Verification Status</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <div className="text-muted-foreground">Status:</div>
              <div className={getStatusColor()}>
                {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                {isProcessing && (
                  <Loader2 className="h-3.5 w-3.5 ml-2 inline-block animate-spin text-blue-600" />
                )}
              </div>
              
              <div className="text-muted-foreground">Level:</div>
              <div>{verification.level.charAt(0).toUpperCase() + verification.level.slice(1)}</div>
              
              <div className="text-muted-foreground">Last Verified:</div>
              <div>{formatDate(verification.lastVerified)}</div>
              
              <div className="text-muted-foreground">Verification Score:</div>
              <div className="flex items-center">
                {verification.verificationScore ? (
                  <>
                    <span className="mr-2">{verification.verificationScore}/100</span>
                    <Progress 
                      value={verification.verificationScore} 
                      className="h-1.5 w-16" 
                      style={{
                        background: verification.verificationScore > 80 ? '#22c55e' :
                                  verification.verificationScore > 60 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </>
                ) : (
                  'N/A'
                )}
              </div>
            </div>
          </div>
          
          <Separator />
          
          {verification.status === 'verified' && verification.blockchainTxId && (
            <div>
              <h3 className="text-sm font-medium mb-2">Blockchain Record</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Transaction ID:</div>
                <div className="flex items-center">
                  {truncateTxId(verification.blockchainTxId)}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 ml-1"
                    onClick={handleViewTransactionDetails}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
                
                <div className="text-muted-foreground">Verification Date:</div>
                <div>{formatDate(verification.lastVerified)}</div>
                
                <div className="text-muted-foreground">Network:</div>
                <div>Hyperledger Fabric</div>
                
                <div className="text-muted-foreground">Consensus:</div>
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> 
                  Validated
                </div>
                
                {transactionDetails && transactionDetails.attemptCount > 1 && (
                  <>
                    <div className="text-muted-foreground">Attempts:</div>
                    <div className="flex items-center">
                      <RefreshCw className="h-3.5 w-3.5 mr-1 text-blue-600" /> 
                      {transactionDetails.attemptCount}
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-3 text-xs flex items-center text-green-600 bg-green-50 p-2 rounded">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>This supplier's credentials are cryptographically verified on the blockchain</span>
              </div>
            </div>
          )}
          
          {verification.status !== 'verified' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Verification Required</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This supplier needs to be verified on the blockchain to ensure credential authenticity and build trust.
              </p>
              <div className="text-xs text-muted-foreground mb-4">
                <h4 className="font-medium mb-1">Verification Level: {verification.level.charAt(0).toUpperCase() + verification.level.slice(1)}</h4>
                <p>{getLevelDescription(verification.level)}</p>
              </div>
              
              {error && (
                <div className="mt-3 mb-3 text-xs flex items-center text-red-600 bg-red-50 p-2 rounded">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  <span>Error: {error}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="pt-2">
            <SupplierVerificationDialog 
              supplier={supplier} 
              onVerificationComplete={onVerificationComplete}
              isDisabled={isProcessing}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplierVerificationDetails;

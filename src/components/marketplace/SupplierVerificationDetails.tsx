
import React from 'react';
import { CheckCircle2, ShieldCheck, ExternalLink, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SupplierProps } from './SupplierCard';
import { VerificationDetails, VerificationLevel } from './SupplierVerificationBadge';
import SupplierVerificationDialog from './SupplierVerificationDialog';

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Blockchain Verification</CardTitle>
          {isProcessing ? (
            <Badge variant="outline" className="bg-blue-100 text-blue-800 animate-pulse">
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              <span>Processing</span>
            </Badge>
          ) : (
            <Badge 
              variant={verification.status === 'verified' ? 'default' : 'outline'}
              className={verification.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
            >
              {verification.status === 'verified' ? (
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              ) : verification.status === 'pending' ? (
                <Info className="h-3.5 w-3.5 mr-1.5" />
              ) : (
                <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              )}
              <span>{verification.status === 'verified' ? 'Blockchain Verified' : 'Not Verified'}</span>
            </Badge>
          )}
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
              </div>
              
              <div className="text-muted-foreground">Level:</div>
              <div>{verification.level.charAt(0).toUpperCase() + verification.level.slice(1)}</div>
              
              <div className="text-muted-foreground">Last Verified:</div>
              <div>{formatDate(verification.lastVerified)}</div>
              
              <div className="text-muted-foreground">Verification Score:</div>
              <div>{verification.verificationScore || 'N/A'}/100</div>
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
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">
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

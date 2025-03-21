
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Database, 
  Lock, 
  Network, 
  FileCheck
} from 'lucide-react';

interface BlockchainVerificationProps {
  hash: string;
  transactionId?: string;
}

const BlockchainVerificationDetails: React.FC<BlockchainVerificationProps> = ({ 
  hash, 
  transactionId 
}) => {
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [zkProofVisible, setZkProofVisible] = useState(false);
  
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        
        // First, try to fetch by transaction ID if provided
        if (transactionId) {
          const { data, error } = await supabase
            .from('blockchain_transactions')
            .select('*')
            .eq('id', transactionId)
            .single();
            
          if (!error && data) {
            setTransaction(data);
            return;
          }
        }
        
        // If no transaction ID or not found, try by hash
        if (hash) {
          const { data, error } = await supabase
            .from('blockchain_transactions')
            .select('*')
            .eq('hash', hash)
            .single();
            
          if (error) throw error;
          setTransaction(data);
        }
      } catch (error) {
        console.error('Error fetching blockchain transaction:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load blockchain transaction data",
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (hash || transactionId) {
      fetchTransactionDetails();
    }
  }, [hash, transactionId, toast]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const formatHash = (hash: string) => {
    if (!hash) return '';
    return hash.length > 20 
      ? `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
      : hash;
  };
  
  if (loading) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 animate-spin" />
          <span>Loading blockchain data...</span>
        </div>
      </div>
    );
  }
  
  if (!transaction) {
    return (
      <div className="p-4 bg-muted rounded-md">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Database className="h-4 w-4" />
          <span>No blockchain data found for this verification</span>
        </div>
      </div>
    );
  }
  
  const metadata = transaction.metadata || {};
  const blockchainResponse = metadata.blockchain_response || {};
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Blockchain Verification</CardTitle>
          <Badge className="bg-blue-500">Hyperledger Fabric</Badge>
        </div>
        <CardDescription>
          Secured with Immutable Cryptographic Proof
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge className={transaction.status === 'confirmed' ? 'bg-green-500' : 'bg-amber-500'}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center gap-2 bg-muted p-2 rounded-md font-mono text-xs overflow-hidden">
                <Lock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="truncate" title={transaction.hash}>
                  {formatHash(transaction.hash)}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Transaction Type</span>
              <div className="bg-muted p-2 rounded-md text-xs">
                {transaction.transaction_type.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Network Information</span>
            <div className="bg-muted p-2 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Network className="h-3 w-3 text-blue-500" />
                <span className="text-xs">{blockchainResponse.network || 'Hyperledger Fabric Network'}</span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-3 w-3 text-blue-500" />
                <span className="text-xs">
                  Block #{blockchainResponse.blockNumber || 'N/A'}
                </span>
              </div>
              
              {blockchainResponse.verificationNodes && blockchainResponse.verificationNodes.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  Validated by {blockchainResponse.verificationNodes.length} nodes
                </div>
              )}
            </div>
          </div>
          
          {metadata.zk_proof && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Zero-Knowledge Proof</span>
              <div className="bg-muted p-2 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                    <span className="text-xs">Identity Verified with ZK-Proof</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-6 px-2"
                    onClick={() => setZkProofVisible(!zkProofVisible)}
                  >
                    {zkProofVisible ? 'Hide' : 'Show'}
                  </Button>
                </div>
                
                {zkProofVisible && (
                  <div className="mt-2 font-mono text-xs break-all">
                    {metadata.zk_proof}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Timestamp</span>
            <div className="bg-muted p-2 rounded-md text-xs">
              {formatDate(transaction.timestamp)}
            </div>
          </div>
          
          {metadata.risk_score !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Risk Assessment</span>
                <span className="font-medium">{metadata.risk_score}/100</span>
              </div>
              
              <Progress 
                value={100 - metadata.risk_score} 
                className="h-2" 
                style={{ 
                  background: metadata.risk_score > 70 ? '#ef4444' : 
                               metadata.risk_score > 40 ? '#f59e0b' : '#22c55e' 
                }}
              />
              
              {metadata.risk_score > 40 && (
                <Alert variant={metadata.risk_score > 70 ? "destructive" : "default"} className="mt-2 py-2">
                  <AlertTriangle className="h-3 w-3" />
                  <AlertTitle className="text-xs">Risk Factors Detected</AlertTitle>
                  <AlertDescription className="text-xs">
                    This verification contains potential risk factors that require review.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCheck className="h-3 w-3" />
              <span>Verification data cryptographically secured on blockchain</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainVerificationDetails;

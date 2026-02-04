import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatTransactionId, blockchainConfig } from '@/integrations/blockchain/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Shield, CheckCircle, Clock, XCircle, Database, Server, Link, Copy, ExternalLink } from 'lucide-react';
import { Transaction, TransactionStatus } from '@/types/blockchain';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface BlockchainStats {
  totalTransactions: number;
  confirmedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

const BlockchainExplorer = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<BlockchainStats>({
    totalTransactions: 0,
    confirmedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0
  });

  // Load recent transactions and stats
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blockchain_transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(20);
        
        if (error) throw error;
        setTransactions(data as Transaction[]);

        // Calculate stats
        const { count: total } = await supabase
          .from('blockchain_transactions')
          .select('*', { count: 'exact', head: true });

        const { count: confirmed } = await supabase
          .from('blockchain_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'confirmed');

        const { count: pending } = await supabase
          .from('blockchain_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        const { count: failed } = await supabase
          .from('blockchain_transactions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'failed');

        setStats({
          totalTransactions: total || 0,
          confirmedTransactions: confirmed || 0,
          pendingTransactions: pending || 0,
          failedTransactions: failed || 0
        });
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Failed to load blockchain data",
          description: "There was an error fetching the transaction history.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTransactions();
  }, [toast]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .or(`hash.ilike.%${searchQuery}%,entity_id.ilike.%${searchQuery}%`)
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      setSearchResults(data as Transaction[]);
      
      toast({
        title: `Found ${data?.length || 0} results`,
        description: data?.length ? "Matching transactions displayed" : "No matching transactions found"
      });
    } catch (error) {
      console.error('Error searching transactions:', error);
      toast({
        title: "Search Failed",
        description: "There was an error performing your search.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  // Get badge variant based on transaction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return { variant: "default" as const, icon: <CheckCircle className="h-3 w-3 mr-1" />, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" };
      case TransactionStatus.PENDING:
        return { variant: "secondary" as const, icon: <Clock className="h-3 w-3 mr-1" />, color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" };
      case TransactionStatus.FAILED:
        return { variant: "destructive" as const, icon: <XCircle className="h-3 w-3 mr-1" />, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" };
      default:
        return { variant: "outline" as const, icon: null, color: "" };
    }
  };

  // Format the transaction type for display
  const formatTransactionType = (type: string) => {
    return type.replace('_', ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Get transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'tender_creation':
        return <Database className="h-4 w-4 text-blue-500" />;
      case 'bid_submission':
        return <Server className="h-4 w-4 text-purple-500" />;
      case 'evaluation':
        return <Shield className="h-4 w-4 text-amber-500" />;
      case 'award':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Link className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Render a transaction card
  const renderTransactionCard = (transaction: Transaction) => {
    const statusBadge = getStatusBadge(transaction.status);
    
    return (
      <Card key={transaction.id} className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {getTransactionIcon(transaction.transaction_type)}
              <div>
                <CardTitle className="text-lg">{formatTransactionType(transaction.transaction_type)}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                    {formatTransactionId(transaction.hash)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(transaction.hash)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </CardDescription>
              </div>
            </div>
            <Badge className={statusBadge.color}>
              {statusBadge.icon}
              {transaction.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Entity ID:</span>
                <div className="font-mono text-xs bg-muted/50 px-2 py-1 rounded mt-1 break-all">
                  {transaction.entity_id}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Timestamp:</span>
                <div className="font-medium">{formatDate(transaction.timestamp)}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Network:</span>
                <div className="font-medium">{blockchainConfig.networkName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Channel:</span>
                <div className="font-medium">{blockchainConfig.channelName}</div>
              </div>
            </div>
          </div>
          
          {transaction.metadata && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-muted-foreground text-sm mb-2">Blockchain Metadata</div>
              <div className="bg-muted/30 rounded p-3 font-mono text-xs overflow-x-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-2">
        <img 
          src="/lovable-uploads/c08e5583-71a0-475d-ba45-b7e39e7dc377.png" 
          alt="ProcureChain Logo" 
          className="h-10 w-auto" 
        />
        <h1 className="text-3xl font-bold">Blockchain Explorer</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Explore transactions recorded on the <strong>Hyperledger Fabric</strong> private blockchain network for complete transparency
        and auditability of the procurement process.
      </p>

      {/* Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <Database className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmedTransactions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedTransactions}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Info Banner */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Network:</span>
              <span className="font-medium">{blockchainConfig.networkName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Channel:</span>
              <span className="font-medium">{blockchainConfig.channelName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Chaincode:</span>
              <span className="font-medium">{blockchainConfig.chaincodeName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">MSP:</span>
              <span className="font-medium">{blockchainConfig.orgMSPID}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Search by transaction hash or entity ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Recent Transactions ({transactions.length})</TabsTrigger>
          <TabsTrigger value="search">Search Results ({searchResults.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : transactions.length > 0 ? (
            <div>
              {transactions.map(renderTransactionCard)}
            </div>
          ) : (
            <Card className="py-12">
              <CardContent className="text-center">
                <Database className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Blockchain transactions are automatically recorded when tenders are created, 
                  bids are submitted, evaluations are made, or contracts are awarded.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="search">
          {searchQuery ? (
            searchResults.length > 0 ? (
              <div>
                {searchResults.map(renderTransactionCard)}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Matching Transactions</h3>
                  <p className="text-muted-foreground">
                    Try searching with a different hash or entity ID.
                  </p>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="py-12">
              <CardContent className="text-center">
                <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Search the Blockchain</h3>
                <p className="text-muted-foreground">
                  Enter a transaction hash or entity ID to search the blockchain ledger.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Hyperledger Info */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            About Hyperledger Fabric
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            Unlike public blockchains (Ethereum, Bitcoin), <strong>Hyperledger Fabric</strong> is a private, 
            permissioned blockchain designed for enterprise use. This means:
          </p>
          <ul>
            <li><strong>No Public Explorer:</strong> Transactions are not visible on public sites like Etherscan or Polygonscan</li>
            <li><strong>No Gas Fees:</strong> All transactions are free within the network</li>
            <li><strong>Access Controlled:</strong> Only authorized participants can view and verify transactions</li>
            <li><strong>Immutable Records:</strong> Once confirmed, transactions cannot be altered or deleted</li>
            <li><strong>Enterprise Grade:</strong> Suitable for government and regulated industries</li>
          </ul>
          <p className="text-muted-foreground">
            All blockchain records shown here are stored on our Hyperledger Fabric network and serve as 
            immutable proof of procurement activities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockchainExplorer;
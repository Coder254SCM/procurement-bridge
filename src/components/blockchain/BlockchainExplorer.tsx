
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Link, Clock, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatTransactionId } from '@/integrations/blockchain/config';

interface Transaction {
  id: string;
  transaction_type: string;
  entity_id: string;
  hash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
  metadata: any;
}

const BlockchainExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  const fetchRecentTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTransaction = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // Search by hash or entity_id
      const { data, error } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .or(`hash.eq.${searchQuery},entity_id.eq.${searchQuery}`);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error searching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewTransactionDetails = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'tender_creation':
        return <FileText className="h-4 w-4 mr-2" />;
      case 'bid_submission':
        return <Link className="h-4 w-4 mr-2" />;
      case 'evaluation':
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'award':
        return <CheckCircle className="h-4 w-4 mr-2" fill="currentColor" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Search by transaction hash or entity ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={searchTransaction}>
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </div>
      
      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          {currentTransaction && (
            <TabsTrigger value="details">Transaction Details</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>
                View recent transactions recorded on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-4">Loading transactions...</div>
              ) : transactions.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No transactions found
                </div>
              ) : (
                <div className="grid gap-2">
                  {transactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      className="border rounded-md p-3 flex justify-between items-center hover:bg-accent cursor-pointer"
                      onClick={() => viewTransactionDetails(tx)}
                    >
                      <div className="flex items-center">
                        {getTransactionTypeIcon(tx.transaction_type)}
                        <div>
                          <div className="font-medium">{formatTransactionId(tx.hash)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatTimestamp(tx.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{tx.transaction_type}</Badge>
                        {getStatusBadge(tx.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {currentTransaction && (
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
                <CardDescription>
                  Detailed information about the selected transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Transaction Hash</h3>
                      <p className="font-mono">{currentTransaction.hash}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                      <Badge variant="outline" className="mt-1">{currentTransaction.transaction_type}</Badge>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="mt-1">{getStatusBadge(currentTransaction.status)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
                    <p>{formatTimestamp(currentTransaction.timestamp)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Entity ID</h3>
                    <p className="font-mono">{currentTransaction.entity_id}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Metadata</h3>
                    <pre className="bg-muted p-4 rounded-md overflow-auto text-xs mt-2">
                      {JSON.stringify(currentTransaction.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default BlockchainExplorer;

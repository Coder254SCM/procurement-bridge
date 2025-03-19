import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatTransactionId, blockchainConfig } from '@/integrations/blockchain/config';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Transaction, TransactionStatus } from '@/types/blockchain';
import { useToast } from '@/hooks/use-toast';

const BlockchainExplorer = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load recent transactions
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('blockchain_transactions')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(10);
        
        if (error) throw error;
        setTransactions(data as Transaction[]);
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

  // Get badge variant based on transaction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case TransactionStatus.CONFIRMED:
        return "success";
      case TransactionStatus.PENDING:
        return "default";
      case TransactionStatus.FAILED:
        return "destructive";
      default:
        return "secondary";
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

  // Render a transaction card
  const renderTransactionCard = (transaction: Transaction) => (
    <Card key={transaction.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{formatTransactionType(transaction.transaction_type)}</CardTitle>
            <CardDescription>
              Transaction ID: {formatTransactionId(transaction.hash)}
            </CardDescription>
          </div>
          <Badge variant={getStatusBadge(transaction.status) as "default" | "secondary" | "destructive" | "outline"}>
            {transaction.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Entity ID:</span> {transaction.entity_id}
          </div>
          <div>
            <span className="font-medium">Timestamp:</span> {formatDate(transaction.timestamp)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => window.open(`${blockchainConfig.chaincodeName}/transaction/${transaction.hash}`, '_blank')}>
          View on Blockchain
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blockchain Explorer</h1>
      <p className="text-gray-600 mb-8">
        Explore transactions recorded on the Hyperledger Fabric blockchain for complete transparency
        and auditability of the procurement process.
      </p>

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
          <TabsTrigger value="recent">Recent Transactions</TabsTrigger>
          <TabsTrigger value="search">Search Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent">
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : transactions.length > 0 ? (
            <div>
              {transactions.map(renderTransactionCard)}
            </div>
          ) : (
            <div className="text-center py-8">No transactions found.</div>
          )}
        </TabsContent>
        
        <TabsContent value="search">
          {searchQuery ? (
            searchResults.length > 0 ? (
              <div>
                {searchResults.map(renderTransactionCard)}
              </div>
            ) : (
              <div className="text-center py-8">No matching transactions found.</div>
            )
          ) : (
            <div className="text-center py-8">
              Enter a transaction hash or entity ID to search.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockchainExplorer;

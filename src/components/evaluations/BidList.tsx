
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  status: string;
  created_at: string;
  tender?: {
    title: string;
    category: string;
  };
  supplier?: {
    full_name: string | null;
    company_name: string | null;
  };
}

interface BidListProps {
  bids: Bid[];
  loading: boolean;
  isEvaluated?: boolean;
  showFilterMessage?: boolean;
}

const BidList: React.FC<BidListProps> = ({ bids, loading, isEvaluated = false, showFilterMessage = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <SearchX className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">
          {isEvaluated ? 'No evaluated bids' : 'No pending evaluations'}
        </h3>
        <p className="text-muted-foreground mt-1">
          {showFilterMessage 
            ? 'Try changing your filters' 
            : isEvaluated 
              ? 'You have not evaluated any bids yet'
              : 'All bids have been evaluated'}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tender</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Bid Amount</TableHead>
          <TableHead>{isEvaluated ? 'Evaluation Date' : 'Submission Date'}</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bids.map((bid) => (
          <TableRow key={bid.id}>
            <TableCell className="font-medium">
              {bid.tender?.title || 'Unknown Tender'}
            </TableCell>
            <TableCell>{bid.supplier?.company_name || 'Unknown'}</TableCell>
            <TableCell>{bid.tender?.category || 'Uncategorized'}</TableCell>
            <TableCell>{bid.bid_amount.toLocaleString()} KES</TableCell>
            <TableCell>{new Date(bid.created_at).toLocaleDateString()}</TableCell>
            <TableCell>
              <Button variant={isEvaluated ? "outline" : "default"} asChild>
                <Link to={`/evaluation/${bid.id}`}>
                  {isEvaluated ? 'View' : 'Evaluate'}
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BidList;

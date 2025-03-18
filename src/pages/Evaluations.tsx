
// Imports
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

// Interfaces
interface Bid {
  id: string;
  tender_id: string;
  supplier_id: string;
  bid_amount: number;
  status: string;
  documents: any;
  technical_details: any;
  created_at: string;
  tender?: {
    title: string;
    description: string;
    category: string;
    budget_amount: number;
    budget_currency: string;
  };
  supplier?: {
    full_name: string | null;
    company_name: string | null;
  };
}

interface Evaluation {
  id: string;
  bid_id: string;
  evaluator_id: string;
  evaluation_type: string;
  score: number;
  comments: string | null;
  recommendation: string | null;
  created_at: string;
}

const Evaluations = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        setLoading(true);

        // Fetch all bids with tender and supplier details
        const { data: bidsData, error: bidsError } = await supabase
          .from('bids')
          .select(`
            *,
            tender:tender_id(
              title,
              description,
              category,
              budget_amount,
              budget_currency
            ),
            supplier:supplier_id(
              full_name,
              company_name
            )
          `);

        if (bidsError) throw bidsError;
        
        // Make sure all bids have supplier property with required fields
        const safelyTypedBids = (bidsData || []).map(bid => {
          // Ensure we have a properly structured supplier object
          return {
            ...bid,
            supplier: {
              full_name: bid.supplier?.full_name || null,
              company_name: bid.supplier?.company_name || null
            }
          } as Bid;
        });

        // Fetch all evaluations
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from('evaluations')
          .select('*');

        if (evaluationsError) throw evaluationsError;
        setEvaluations(evaluationsData || []);

        // Extract bid IDs that have already been evaluated
        const evaluatedBidIds = evaluationsData?.map((evaluation: any) => evaluation.bid_id) || [];

        // Filter bids to only show those that haven't been evaluated
        const filteredBids = safelyTypedBids.filter(bid => !evaluatedBidIds.includes(bid.id)) || [];
        setBids(filteredBids);

      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load evaluations",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluations();
  }, [toast]);

  const filteredBids = bids.filter(bid => {
    const searchTermLower = searchTerm.toLowerCase();
    const titleMatch = bid.tender?.title?.toLowerCase().includes(searchTermLower);
    const supplierMatch = bid.supplier?.company_name?.toLowerCase().includes(searchTermLower);
    return titleMatch || supplierMatch;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bids for Evaluation</h1>
        <Input
          type="search"
          placeholder="Search by tender title or supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Displaying bids that require evaluation.
        </p>
      </div>

      <div className="mb-4">
        <CalendarDateRangePicker date={dateRange} onDateChange={setDateRange} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBids.length > 0 ? (
        <div className="mx-auto">
          <Table>
            <TableCaption>A list of bids that require evaluation.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Bid Amount</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">{bid.tender?.title}</TableCell>
                  <TableCell>{bid.supplier?.company_name || 'Unknown'}</TableCell>
                  <TableCell>{bid.bid_amount} {bid.tender?.budget_currency}</TableCell>
                  <TableCell>{formatDate(bid.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" asChild>
                      <Link to={`/evaluation/${bid.id}`}>Evaluate</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {filteredBids.length} bids awaiting evaluation
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <Card className="text-center">
          <CardHeader>
            <CardTitle>No Bids Available</CardTitle>
            <CardDescription>
              There are no bids currently available for evaluation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Evaluations;

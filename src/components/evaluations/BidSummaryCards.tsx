
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BidSummaryCardsProps {
  bidAmount: number;
  budgetAmount?: number | null;
  budgetCurrency?: string;
  supplierName: string;
  supplierCompany: string;
  category?: string;
  evaluatorType: string;
}

const BidSummaryCards: React.FC<BidSummaryCardsProps> = ({
  bidAmount,
  budgetAmount,
  budgetCurrency = 'KES',
  supplierName,
  supplierCompany,
  category = 'Uncategorized',
  evaluatorType
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Bid Amount</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{bidAmount} {budgetCurrency}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Budget: {budgetAmount || 'Not specified'} {budgetCurrency}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{supplierCompany}</p>
          <p className="text-sm text-muted-foreground mt-1">{supplierName}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">{category}</p>
          <p className="text-sm text-muted-foreground mt-1">Your role: {evaluatorType.toUpperCase()} Evaluator</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BidSummaryCards;

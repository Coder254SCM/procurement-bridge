
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Gavel, Timer, DollarSign, TrendingDown, Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuctionSettingsFormProps {
  form: UseFormReturn<any>;
  procurementMethod: string;
}

const AuctionSettingsForm: React.FC<AuctionSettingsFormProps> = ({ form, procurementMethod }) => {
  const isReverse = procurementMethod === 'electronic_reverse_auction';
  const isForward = procurementMethod === 'forward_auction';
  const isDutch = procurementMethod === 'dutch_auction';
  const isAuction = isReverse || isForward || isDutch;

  if (!isAuction) return null;

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center">
          <div className="p-2 mr-3 rounded-full bg-primary/10">
            <Gavel className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>
              {isReverse && 'Reverse Auction Settings'}
              {isForward && 'Forward Auction Settings'}
              {isDutch && 'Dutch Auction Settings'}
            </CardTitle>
            <CardDescription>
              {isReverse && 'Configure your reverse auction where suppliers compete by offering the lowest price'}
              {isForward && 'Configure your forward auction where buyers compete by offering the highest price'}
              {isDutch && 'Configure your Dutch auction where the price starts high and decreases until a buyer accepts'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {isReverse && 'In a reverse auction, suppliers submit decreasingly lower bids. The lowest bid wins. An auction room will be created automatically when the tender is published.'}
            {isForward && 'In a forward auction, bidders submit increasingly higher bids. The highest bid wins.'}
            {isDutch && 'In a Dutch auction, the price starts at the reserve price and decreases at intervals. The first bidder to accept wins.'}
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="auction_reserve_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {isReverse ? 'Reserve (Maximum) Price (KES)' : 'Starting Price (KES)'}
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5000000" {...field} />
                </FormControl>
                <FormDescription>
                  {isReverse ? 'Bids must start below this amount' : 'The auction starts at this price'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auction_min_decrement"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  {isReverse ? 'Minimum Bid Decrement (KES)' : isDutch ? 'Price Decrement Step (KES)' : 'Minimum Bid Increment (KES)'}
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10000" {...field} />
                </FormControl>
                <FormDescription>
                  {isReverse ? 'Each new bid must be at least this much lower' : isDutch ? 'Price drops by this amount each interval' : 'Each new bid must be at least this much higher'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auction_duration_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Auction Duration (hours)
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 4" min="1" max="72" {...field} />
                </FormControl>
                <FormDescription>
                  How long the auction will run once started
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="auction_extension_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Auto-Extension (minutes)
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 5" min="0" max="30" {...field} />
                </FormControl>
                <FormDescription>
                  Extend auction by this many minutes when a bid is placed near the end
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isDutch && (
          <FormField
            control={form.control}
            name="auction_interval_seconds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Drop Interval (seconds)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 30" min="10" max="300" {...field} />
                </FormControl>
                <FormDescription>
                  How often the price decreases in the Dutch auction
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AuctionSettingsForm;

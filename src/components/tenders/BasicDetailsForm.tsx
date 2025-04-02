
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ProcurementMethod } from '@/types/enums';
import { UseFormReturn } from 'react-hook-form';

export interface SupplyChainReviewer {
  id: string;
  name: string;
}

interface BasicDetailsFormProps {
  form: UseFormReturn<any>;
  categoryOptions: string[];
  supplyChainReviewers: SupplyChainReviewer[];
  templateContent: string;
}

// Procurement method options (including auctions)
const procurementMethodOptions = [
  { value: ProcurementMethod.OPEN_TENDER, label: "Open Tender" },
  { value: ProcurementMethod.REQUEST_FOR_PROPOSAL, label: "Request for Proposal (RFP)" },
  { value: ProcurementMethod.REQUEST_FOR_QUOTATION, label: "Request for Quotation (RFQ)" },
  { value: ProcurementMethod.DIRECT_PROCUREMENT, label: "Direct Procurement" },
  { value: ProcurementMethod.FRAMEWORK_AGREEMENT, label: "Framework Agreement" },
  { value: ProcurementMethod.TWO_STAGE_TENDERING, label: "Two-Stage Tendering" },
  { value: ProcurementMethod.DESIGN_COMPETITION, label: "Design Competition" },
  { value: ProcurementMethod.ELECTRONIC_REVERSE_AUCTION, label: "Electronic Reverse Auction" },
  { value: ProcurementMethod.FORWARD_AUCTION, label: "Forward Auction" },
  { value: ProcurementMethod.DUTCH_AUCTION, label: "Dutch Auction" },
];

const BasicDetailsForm = ({ form, categoryOptions, supplyChainReviewers, templateContent }: BasicDetailsFormProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tender Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Supply of Office Equipment" {...field} />
              </FormControl>
              <FormDescription>
                A clear and concise title for your tender request.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categoryOptions.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the category that best describes your tender.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="procurement_method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Procurement Method</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a procurement method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {procurementMethodOptions.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the procurement method according to Kenya procurement laws.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="budget_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Amount</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="budget_currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="KES" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="submission_deadline"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Submission Deadline</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              The deadline for suppliers to submit their bids.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supply_chain_reviewer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supply Chain Professional</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Assign a supply chain professional" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {supplyChainReviewers.map((reviewer) => (
                  <SelectItem key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Assign a supply chain professional to review this tender (recommended for compliance).
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a detailed description of the goods or services required..." 
                  className="min-h-[150px]" 
                  value={templateContent ? `${templateContent}\n\n${field.value}` : field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Include specifications, requirements, delivery terms, and any other relevant details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default BasicDetailsForm;

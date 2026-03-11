import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, FileText, DollarSign, BookOpen, Hash } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ProcurementMethod } from '@/types/enums';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const procurementMethodOptions = [
  { value: ProcurementMethod.OPEN_TENDER, label: "Open Tender (National)" },
  { value: 'open_tender_intl', label: "Open Tender (International)" },
  { value: ProcurementMethod.RESTRICTED_TENDER, label: "Restricted Tender" },
  { value: ProcurementMethod.REQUEST_FOR_PROPOSAL, label: "Request for Proposal (RFP)" },
  { value: ProcurementMethod.REQUEST_FOR_QUOTATION, label: "Request for Quotation (RFQ)" },
  { value: ProcurementMethod.DIRECT_PROCUREMENT, label: "Direct Procurement" },
  { value: ProcurementMethod.FRAMEWORK_AGREEMENT, label: "Framework Agreement" },
  { value: ProcurementMethod.TWO_STAGE_TENDERING, label: "Two-Stage Tendering" },
  { value: ProcurementMethod.DESIGN_COMPETITION, label: "Design Competition" },
  { value: ProcurementMethod.DESIGN_CONTEST, label: "Design Contest" },
  { value: ProcurementMethod.ELECTRONIC_REVERSE_AUCTION, label: "Electronic Reverse Auction" },
  { value: ProcurementMethod.FORWARD_AUCTION, label: "Forward Auction" },
  { value: ProcurementMethod.DUTCH_AUCTION, label: "Dutch Auction" },
  { value: ProcurementMethod.COMPETITIVE_DIALOGUE, label: "Competitive Dialogue" },
  { value: ProcurementMethod.INNOVATION_PARTNERSHIP, label: "Innovation Partnership" },
];

const procurementCategoryOptions = [
  { value: 'goods', label: 'Goods' },
  { value: 'services', label: 'Services' },
  { value: 'works', label: 'Works' },
  { value: 'goods_services', label: 'Goods & Services' },
  { value: 'consultancy', label: 'Consultancy Services' },
];

const BasicDetailsForm = ({ form, categoryOptions, supplyChainReviewers, templateContent }: BasicDetailsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Tender Identification */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <Hash className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Tender Identification</CardTitle>
              <CardDescription>Basic identification and classification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Supply of Office Equipment for FY 2025-26" {...field} />
                    </FormControl>
                    <FormDescription>A clear and concise title for your tender request.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tender_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tender / RFQ Number <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. ORG/933/RFQ/0048/2025-26" {...field} />
                  </FormControl>
                  <FormDescription>Unique reference number for this tender.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="financial_year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2025-26" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="procurement_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procurement Method <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select procurement method" />
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
                  <FormDescription>Select the applicable procurement method</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="procurement_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category of Procurement <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {procurementCategoryOptions.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry Sector <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry sector" />
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
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                          </span>
                          <Input type="number" min="0" step="0.01" className="pl-9" {...field} />
                        </div>
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

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tender Description <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <Textarea
                          placeholder="Brief description of what is being procured..."
                          className="min-h-[120px] pl-9"
                          value={templateContent ? `${templateContent}\n\n${field.value}` : field.value}
                          onChange={field.onChange}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Include specifications, requirements, delivery terms, and any other relevant details.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AGPO Reservation */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Reservation / Preference (AGPO)</CardTitle>
          <CardDescription>
            Access to Government Procurement Opportunities for Youth, Women, and PWDs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="agpo_reservation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Is this tender reserved?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || 'none'}
                    className="flex flex-wrap gap-3"
                  >
                    {[
                      { value: 'none', label: 'No Reservation' },
                      { value: 'youth', label: 'Youth (AGPO)' },
                      { value: 'women', label: 'Women (AGPO)' },
                      { value: 'pwd', label: 'PWD (AGPO)' },
                    ].map((opt) => (
                      <Label
                        key={opt.value}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                          (field.value || 'none') === opt.value
                            ? 'border-primary bg-primary/5 text-primary font-medium'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <RadioGroupItem value={opt.value} />
                        {opt.label}
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Key Dates */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Key Dates</CardTitle>
              <CardDescription>Critical timeline dates for this tender</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="issue_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of Issue <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="submission_deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Submission Deadline <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="opening_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Opening Date <span className="text-destructive">*</span></FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="earliest_delivery_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Earliest Delivery Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="latest_delivery_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Latest Delivery Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="validity_period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validity Period (days) <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="91" {...field} />
                  </FormControl>
                  <FormDescription>Default 91 days per PPADA</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supply Chain Reviewer */}
      {supplyChainReviewers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Supply Chain Professional</CardTitle>
            <CardDescription>Assign a supply chain professional for compliance review</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="supply_chain_reviewer"
              render={({ field }) => (
                <FormItem>
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
                  <FormDescription>Recommended for compliance with PPADA oversight requirements.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BasicDetailsForm;

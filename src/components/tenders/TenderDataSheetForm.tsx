import React from 'react';
import { Settings2, Info } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UseFormReturn } from 'react-hook-form';

interface TenderDataSheetFormProps {
  form: UseFormReturn<any>;
}

const TenderDataSheetForm = ({ form }: TenderDataSheetFormProps) => {
  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          The Tender Data Sheet (TDS) overrides default Instructions to Tenderers (ITT) clauses. Fill only what differs from the standard.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <Settings2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Key TDS Settings</CardTitle>
              <CardDescription>Currency, lots, award criteria and special conditions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tds_foreign_currency_allowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foreign Currency Allowed?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || 'not_allowed'}
                      className="flex flex-wrap gap-3"
                    >
                      {[
                        { value: 'not_allowed', label: 'Not Allowed' },
                        { value: 'allowed', label: 'Allowed' },
                      ].map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            (field.value || 'not_allowed') === opt.value
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

            <FormField
              control={form.control}
              name="tds_alternative_tenders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternative Tenders Allowed?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || 'not_allowed'}
                      className="flex flex-wrap gap-3"
                    >
                      {[
                        { value: 'not_allowed', label: 'Shall Not Be' },
                        { value: 'allowed', label: 'Shall Be' },
                      ].map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            (field.value || 'not_allowed') === opt.value
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

            <FormField
              control={form.control}
              name="tds_number_of_lots"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Lots</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || 'one'}
                      className="flex flex-wrap gap-3"
                    >
                      {[
                        { value: 'one', label: 'One Lot' },
                        { value: 'multiple', label: 'Multiple Lots' },
                      ].map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            (field.value || 'one') === opt.value
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

            {form.watch('tds_number_of_lots') === 'multiple' && (
              <FormField
                control={form.control}
                name="tds_lot_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How Many Lots?</FormLabel>
                    <FormControl>
                      <Input type="number" min="2" placeholder="e.g. 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="tds_award_criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Award Criteria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'lowest_evaluated'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lowest_evaluated">Lowest Evaluated Price (technically compliant)</SelectItem>
                      <SelectItem value="lowest_price">Lowest Price</SelectItem>
                      <SelectItem value="best_value">Best Value for Money (scored)</SelectItem>
                      <SelectItem value="quality_cost">Quality-Cost Based Selection (QCBS)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Determines how winning bid is selected per PPADA S.86
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tds_bid_security_required"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Security Required?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value || 'no'}
                      className="flex flex-wrap gap-3"
                    >
                      {[
                        { value: 'no', label: 'No (Tender-Securing Declaration)' },
                        { value: 'yes', label: 'Yes (Bank Guarantee)' },
                      ].map((opt) => (
                        <Label
                          key={opt.value}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                            (field.value || 'no') === opt.value
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
          </div>

          {form.watch('tds_bid_security_required') === 'yes' && (
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tds_bid_security_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bid Security Amount (KES)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 100000" {...field} />
                    </FormControl>
                    <FormDescription>1-2% of tender value per PPADA S.78</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tds_bid_security_validity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Validity (days beyond bid validity)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            control={form.control}
            name="tds_special_conditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Conditions / SCC Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="e.g. Contract shall be governed by Laws of Kenya. Language of quotation: English. Delivery point: Nairobi..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Governing law, language requirements, delivery terms, insurance, and any special conditions
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Alert className="border-primary/30 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              ✔ Standard 0.03% Capacity Building Levy of tender sum (exclusive of taxes) applies automatically per ITT 12.2
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderDataSheetForm;

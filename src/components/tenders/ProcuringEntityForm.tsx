import React from 'react';
import { Building2, User, Mail } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProcuringEntityFormProps {
  form: UseFormReturn<any>;
}

const ProcuringEntityForm = ({ form }: ProcuringEntityFormProps) => {
  const submissionMethod = form.watch('submission_method');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Procuring Entity Details</CardTitle>
              <CardDescription>Organisation information and contact details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="pe_organisation_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisation Name <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Kenya Deposit Insurance Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="pe_physical_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Address <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 17th Floor, UAP Old Mutual Towers" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pe_town"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Town / City <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Nairobi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pe_po_box"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>P.O. Box</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 45983-00100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pe_telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="+254 XXX XXX XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pe_procurement_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Procurement Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. procurement@org.go.ke" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pe_website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. www.org.go.ke" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Authorised Contact Person</CardTitle>
              <CardDescription>Primary contact for tender enquiries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="contact_person_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person_designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CEO / Head of Procurement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_person_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@org.go.ke" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <div className="p-2 mr-3 rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Submission Method</CardTitle>
              <CardDescription>How should quotations/bids be submitted?</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="submission_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Submission Method <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-wrap gap-3"
                  >
                    {[
                      { value: 'electronic', label: 'Electronic (Platform)' },
                      { value: 'physical', label: 'Physical / Sealed' },
                      { value: 'both', label: 'Both' },
                    ].map((opt) => (
                      <Label
                        key={opt.value}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                          field.value === opt.value
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

          {submissionMethod === 'physical' || submissionMethod === 'both' ? (
            <FormField
              control={form.control}
              name="physical_submission_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Physical Submission Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Address where sealed bids should be delivered..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcuringEntityForm;

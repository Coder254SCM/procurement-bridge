import React from 'react';
import { Microscope, Plus, Trash2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

export interface TechnicalSpec {
  id: string;
  description: string;
  required_standard: string;
  compliance_type: 'mandatory' | 'desirable';
}

interface TechnicalSpecificationsFormProps {
  form: UseFormReturn<any>;
  specs: TechnicalSpec[];
  onSpecsChange: (specs: TechnicalSpec[]) => void;
}

const TechnicalSpecificationsForm = ({ form, specs, onSpecsChange }: TechnicalSpecificationsFormProps) => {
  const addSpec = () => {
    onSpecsChange([
      ...specs,
      {
        id: crypto.randomUUID(),
        description: '',
        required_standard: '',
        compliance_type: 'mandatory',
      },
    ]);
  };

  const removeSpec = (id: string) => {
    onSpecsChange(specs.filter((s) => s.id !== id));
  };

  const updateSpec = (id: string, field: keyof TechnicalSpec, value: string) => {
    onSpecsChange(
      specs.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="space-y-6">
      <Alert className="border-amber-200 bg-amber-50 text-amber-800">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Define technical specifications for each item. Tenderers will respond to each specification line during bid submission.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 mr-3 rounded-full bg-primary/10">
                <Microscope className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Detailed specifications tenderers must meet</CardDescription>
              </div>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addSpec}>
              <Plus className="h-4 w-4 mr-1" /> Add Specification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead className="min-w-[280px]">Specification Description</TableHead>
                  <TableHead className="min-w-[200px]">Required Standard / Measurement</TableHead>
                  <TableHead className="w-[130px]">Type</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {specs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No specifications added yet. Click "Add Specification" to begin.
                    </TableCell>
                  </TableRow>
                )}
                {specs.map((spec, idx) => (
                  <TableRow key={spec.id}>
                    <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <Textarea
                        value={spec.description}
                        onChange={(e) => updateSpec(spec.id, 'description', e.target.value)}
                        placeholder="e.g. Branded speaker's backdrop measuring up to 2 metres..."
                        className="min-h-[60px] text-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={spec.required_standard}
                        onChange={(e) => updateSpec(spec.id, 'required_standard', e.target.value)}
                        placeholder="e.g. Minimum 2m width, branded"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Label
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                          spec.compliance_type === 'mandatory'
                            ? 'bg-destructive/10 text-destructive border border-destructive/30'
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                        onClick={() =>
                          updateSpec(
                            spec.id,
                            'compliance_type',
                            spec.compliance_type === 'mandatory' ? 'desirable' : 'mandatory'
                          )
                        }
                      >
                        {spec.compliance_type === 'mandatory' ? 'Mandatory' : 'Desirable'}
                      </Label>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => removeSpec(spec.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {specs.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 border-dashed border-primary/50 text-primary hover:bg-primary/5"
              onClick={addSpec}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Another Specification
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Technical Evaluation Method</CardTitle>
          <CardDescription>How will technical evaluation be conducted?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="tech_eval_method"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || 'pass_fail'}
                    className="flex flex-wrap gap-3"
                  >
                    {[
                      { value: 'pass_fail', label: 'Pass/Fail (Compliant / Non-compliant)', desc: 'Each spec is either met or not met' },
                      { value: 'scored', label: 'Scored (Weighted Criteria)', desc: 'Each spec is scored and weighted' },
                    ].map((opt) => (
                      <Label
                        key={opt.value}
                        className={`flex flex-col gap-1 px-4 py-3 rounded-lg border cursor-pointer transition-colors flex-1 ${
                          (field.value || 'pass_fail') === opt.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-background hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value={opt.value} />
                          <span className="font-medium text-sm">{opt.label}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-6">{opt.desc}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('tech_eval_method') === 'scored' && (
            <FormField
              control={form.control}
              name="tech_min_score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Technical Score (%)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" max="100" placeholder="e.g. 70" {...field} />
                  </FormControl>
                  <FormDescription>
                    Tenderers scoring below this threshold on technical evaluation will not proceed to financial evaluation
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="tech_eval_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Evaluation Notes <span className="text-muted-foreground text-xs">(optional)</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any specific instructions for technical evaluation..."
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalSpecificationsForm;

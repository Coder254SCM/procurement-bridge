
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { 
  FileText, Shield, Target, Handshake, ShoppingCart, Award, PenTool, 
  Gavel, Users, Lightbulb, Palette, MessageSquare, Scale, Info, 
  AlertTriangle, CheckCircle, Clock, DollarSign, ListChecks, BookOpen
} from 'lucide-react';
import { ProcurementMethod } from '@/types/enums';

interface ProcurementMethodSettingsProps {
  form: UseFormReturn<any>;
  procurementMethod: string;
}

const ProcurementMethodSettings: React.FC<ProcurementMethodSettingsProps> = ({ form, procurementMethod }) => {
  if (!procurementMethod) return null;

  const renderOpenTender = () => (
    <Card className="mb-6 border-blue-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-500/10">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Open Tender Configuration</CardTitle>
              <Badge variant="outline" className="text-xs">Default Method</Badge>
            </div>
            <CardDescription>
              Open competitive tendering — the default and preferred procurement method
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertTitle>Legal Framework</AlertTitle>
          <AlertDescription>
            Open tendering must be used unless justification exists for alternative methods. 
            Tenders must be advertised for at least <strong>14 days</strong> (national) or <strong>21 days</strong> (international) in newspapers of national circulation and the procuring entity's website.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_advertising_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Advertising Period (days)
                </FormLabel>
                <FormControl>
                  <Input type="number" min="14" placeholder="14" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum 14 days (national) or 21 days (international)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_tender_scope"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tender Scope</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'national'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="national">National (14-day minimum)</SelectItem>
                    <SelectItem value="international">International (21-day minimum)</SelectItem>
                    <SelectItem value="county">County Level</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  International tenders require longer advertising periods
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_bid_security_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Bid Security Required</FormLabel>
                  <FormDescription>
                    Typically 1-2% of tender value
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_bid_security_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Bid Security Amount
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 100000" {...field} />
                </FormControl>
                <FormDescription>
                  1-2% of tender value as bank guarantee or insurance bond
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_pre_bid_conference"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Pre-Bid Conference</FormLabel>
                  <FormDescription>
                    Schedule a pre-bid meeting for prospective bidders
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_site_visit_required"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mandatory Site Visit</FormLabel>
                  <FormDescription>
                    Require bidders to attend a site visit before submission
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Mandatory Requirements Checklist
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              'Advertisement in 2+ national newspapers',
              'Posted on procurement portal',
              'Posted on entity website',
              'Standard Tender Document (STD) used',
              'Tender opening committee formed (min 3 members)',
              'Evaluation committee appointed',
              'Budget confirmation obtained',
              'Procurement plan line-item linked',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded bg-muted/30">
                <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderRestrictedTender = () => (
    <Card className="mb-6 border-amber-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-500/10">
            <Target className="h-6 w-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Restricted Tender Configuration</CardTitle>
              <Badge variant="outline" className="text-xs">Restricted Use</Badge>
            </div>
            <CardDescription>
              Limited to pre-qualified or registered suppliers — requires justification
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Justification Required</AlertTitle>
          <AlertDescription>
            Restricted tendering may only be used when: (a) goods/services are available from a limited number of suppliers; 
            (b) time/cost of evaluating many tenders is disproportionate; or (c) a pre-qualification has been conducted. 
            Regulatory approval may be required.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_restriction_justification"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Justification for Restriction *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide detailed legal justification for using restricted tendering. Reference the specific grounds that apply..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This justification will be recorded in the audit trail and may be reviewed by the regulator
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_restriction_reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grounds for Restriction</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select grounds" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="limited_suppliers">Limited number of qualified suppliers</SelectItem>
                    <SelectItem value="disproportionate_cost">Cost of open evaluation disproportionate</SelectItem>
                    <SelectItem value="pre_qualification">Pre-qualification already conducted</SelectItem>
                    <SelectItem value="national_security">National security considerations</SelectItem>
                    <SelectItem value="specialized_nature">Highly specialized goods/services</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_min_invited_suppliers"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Minimum Suppliers to Invite
                </FormLabel>
                <FormControl>
                  <Input type="number" min="5" placeholder="5" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum 5 suppliers must be invited
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_ppra_approval_ref"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulatory Approval Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., APPROVAL/RES/2026/0001" {...field} />
                </FormControl>
                <FormDescription>
                  Reference number from regulatory approval for restricted tendering
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_pre_qualification_ref"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pre-Qualification Reference (if applicable)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., PQ-2026-001" {...field} />
                </FormControl>
                <FormDescription>
                  Reference to the pre-qualification exercise if this tender follows one
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <ListChecks className="h-4 w-4" /> Invited Suppliers
          </h4>
          <FormField
            control={form.control}
            name="method_invited_suppliers"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="List supplier names/IDs to invite (one per line). At least 5 suppliers required.&#10;&#10;Example:&#10;Supplier ABC Ltd - REG-001&#10;XYZ Solutions - REG-002"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  These suppliers will receive direct invitations. Must include at least 5.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderRFP = () => (
    <Card className="mb-6 border-purple-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/10">
            <PenTool className="h-6 w-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Request for Proposal (RFP) Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Two-Envelope</Badge>
            </div>
            <CardDescription>
              Two-envelope system for complex procurements requiring innovative solutions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Two-Envelope Evaluation</AlertTitle>
          <AlertDescription>
            RFPs use a two-envelope system: <strong>Technical proposals</strong> are opened and evaluated first. 
            Only proposals meeting the minimum technical score proceed to <strong>financial evaluation</strong>. 
            This prevents price from biasing technical assessment.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_technical_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technical Evaluation Weight (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="60" max="90" placeholder="80" {...field} />
                </FormControl>
                <FormDescription>
                  Typically 70-80% for RFPs. Minimum recommended: 60%
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_financial_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Financial Evaluation Weight (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="10" max="40" placeholder="20" {...field} />
                </FormControl>
                <FormDescription>
                  Remaining percentage after technical weight
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_min_technical_score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Technical Score (%)</FormLabel>
                <FormControl>
                  <Input type="number" min="50" max="85" placeholder="70" {...field} />
                </FormControl>
                <FormDescription>
                  Proposals below this threshold are rejected before financial opening
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_negotiation_allowed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Post-Award Negotiation</FormLabel>
                  <FormDescription>
                    Allow price negotiation with highest-ranked proposer
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_proposal_validity_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposal Validity Period (days)</FormLabel>
                <FormControl>
                  <Input type="number" min="30" placeholder="90" {...field} />
                </FormControl>
                <FormDescription>
                  How long proposals remain valid after submission deadline
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_clarification_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clarification Period (days before deadline)</FormLabel>
                <FormControl>
                  <Input type="number" min="5" placeholder="7" {...field} />
                </FormControl>
                <FormDescription>
                  Last date for bidders to seek clarifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_rfp_scope_of_services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detailed Scope of Services / Terms of Reference</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Define the detailed scope of services, deliverables, timelines, and key performance indicators (KPIs) that proposers must address in their technical proposals..."
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This forms the basis of technical evaluation. Be specific about outcomes, not just activities.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderRFQ = () => (
    <Card className="mb-6 border-green-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-500/10">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Request for Quotation (RFQ) Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Simplified Method</Badge>
            </div>
            <CardDescription>
              Simplified procurement for readily available goods/services below prescribed thresholds
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Low-Value Procurement</AlertTitle>
          <AlertDescription>
            RFQ may be used for procurement of goods/services that are readily available and where the estimated value does not 
            exceed prescribed thresholds. Minimum <strong>3 quotations</strong> must be obtained from different suppliers.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_min_quotations"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Minimum Quotations Required
                </FormLabel>
                <FormControl>
                  <Input type="number" min="3" placeholder="3" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum 3 quotations required by law
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_quotation_validity_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quotation Validity (days)</FormLabel>
                <FormControl>
                  <Input type="number" min="7" placeholder="30" {...field} />
                </FormControl>
                <FormDescription>
                  Period during which quoted prices must remain valid
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_delivery_period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Delivery Period (days)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="14" {...field} />
                </FormControl>
                <FormDescription>
                  Expected delivery timeline for the goods/services
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || '30_days'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select payment terms" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="on_delivery">On Delivery</SelectItem>
                    <SelectItem value="7_days">Net 7 Days</SelectItem>
                    <SelectItem value="14_days">Net 14 Days</SelectItem>
                    <SelectItem value="30_days">Net 30 Days</SelectItem>
                    <SelectItem value="lpo">Against LPO</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_evaluation_basis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Evaluation Basis</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'lowest_price'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select basis" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lowest_price">Lowest Evaluated Price</SelectItem>
                    <SelectItem value="best_value">Best Value for Money</SelectItem>
                    <SelectItem value="total_cost">Total Cost of Ownership</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  RFQs typically use lowest evaluated price
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_specifications_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specifications Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'detailed'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="detailed">Detailed Specifications</SelectItem>
                    <SelectItem value="performance">Performance-Based</SelectItem>
                    <SelectItem value="brand_equivalent">Brand Name or Equivalent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_item_specifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Specifications / Bill of Quantities</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List items with detailed specifications:&#10;&#10;1. Item: Desktop Computer&#10;   Qty: 50&#10;   Specs: Intel i7, 16GB RAM, 512GB SSD, 24&quot; Monitor&#10;&#10;2. Item: Laser Printer&#10;   Qty: 10&#10;   Specs: Color, A3/A4, Duplex, Network-ready"
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Detailed specifications help suppliers provide accurate quotations
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderDirectProcurement = () => (
    <Card className="mb-6 border-red-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-500/10">
            <Handshake className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Direct Procurement Settings</CardTitle>
              <Badge variant="destructive" className="text-xs">Restricted Use</Badge>
            </div>
            <CardDescription>
              Single-source procurement — only permitted under strict legal grounds with regulatory approval
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>⚠️ Highest Risk Procurement Method</AlertTitle>
          <AlertDescription>
            Direct procurement bypasses competition. It is only permitted when: (a) there is only one supplier;
            (b) urgent need caused by unforeseen events; (c) additional deliveries from original supplier for standardization;
            (d) purchase from another public entity. <strong>All direct procurements are subject to regulatory audit.</strong>
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_direct_justification"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="flex items-center gap-2 text-red-600">
                  <Scale className="h-4 w-4" />
                  Legal Justification for Direct Procurement *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide comprehensive legal justification. Include:&#10;- Why competitive methods cannot be used&#10;- Market research conducted&#10;- Value for money assessment&#10;- Risk of not proceeding with direct procurement"
                    className="min-h-[150px] border-red-200"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This justification is legally binding and will be submitted for regulatory review
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_direct_grounds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grounds for Direct Procurement</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select legal grounds" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sole_supplier">Sole Supplier / Proprietary Rights</SelectItem>
                    <SelectItem value="extreme_urgency">Extreme Urgency (unforeseen events)</SelectItem>
                    <SelectItem value="standardization">Standardization / Compatibility</SelectItem>
                    <SelectItem value="public_entity">Purchase from Public Entity</SelectItem>
                    <SelectItem value="research_development">Research or Experimentation</SelectItem>
                    <SelectItem value="national_security">National Security</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_direct_supplier_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proposed Supplier Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full legal name of the supplier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_direct_supplier_reg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier Registration / Tax PIN</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Tax PIN, Company Reg No." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_direct_ppra_approval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regulatory Approval Reference</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., REG/DP/2026/0001" {...field} />
                </FormControl>
                <FormDescription>
                  Accounting Officer must seek regulatory approval before proceeding
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_direct_market_survey"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Market Survey Report</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Summarize the market survey conducted to confirm sole-source or urgency justification. Include sources consulted, alternatives considered, and pricing comparisons..."
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderFrameworkAgreement = () => (
    <Card className="mb-6 border-indigo-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-indigo-500/10">
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Framework Agreement Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Long-Term</Badge>
            </div>
            <CardDescription>
              Long-term agreement with pre-qualified suppliers for recurring procurement needs
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Framework Agreement Structure</AlertTitle>
          <AlertDescription>
            Framework agreements establish terms for future call-off orders without commitment to purchase specific quantities. 
            Maximum duration is <strong>3 years</strong>. Can be single-supplier or multi-supplier (min 3).
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_framework_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Framework Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'multi'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single">Single Supplier</SelectItem>
                    <SelectItem value="multi">Multi-Supplier (min 3)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Multi-supplier frameworks enable mini-competition for each call-off
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_framework_duration_years"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agreement Duration (years)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="3" placeholder="3" {...field} />
                </FormControl>
                <FormDescription>
                  Maximum 3 years
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_framework_max_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Maximum Framework Value
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000000" {...field} />
                </FormControl>
                <FormDescription>
                  Total estimated value of all call-off orders over the agreement period
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_framework_calloff_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call-Off Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'mini_competition'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="direct">Direct Award (single-supplier)</SelectItem>
                    <SelectItem value="rotation">Rotation Among Suppliers</SelectItem>
                    <SelectItem value="mini_competition">Mini-Competition</SelectItem>
                    <SelectItem value="cascading">Cascading (ranked suppliers)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_framework_price_adjustment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Price Adjustment Mechanism</FormLabel>
                  <FormDescription>
                    Allow indexed price adjustments (CPI, exchange rate)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_framework_min_suppliers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Number of Suppliers</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="5" {...field} />
                </FormControl>
                <FormDescription>
                  Multi-supplier frameworks require minimum 3 suppliers
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_framework_categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product/Service Categories Covered</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="List the categories of goods/services covered by this framework:&#10;&#10;Lot 1: Office Stationery & Supplies&#10;Lot 2: Computer Equipment & Peripherals&#10;Lot 3: Printing & Publishing Services"
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderTwoStage = () => (
    <Card className="mb-6 border-cyan-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-cyan-500/10">
            <ListChecks className="h-6 w-6 text-cyan-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Two-Stage Tendering Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Multi-Phase</Badge>
            </div>
            <CardDescription>
              Stage 1: Technical proposals without prices → Stage 2: Priced bids from qualified bidders
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Two-Stage Process</AlertTitle>
          <AlertDescription>
            Used when the procuring entity cannot fully define technical requirements. <strong>Stage 1:</strong> Unpriced technical proposals 
            are invited, discussed, and used to finalize specifications. <strong>Stage 2:</strong> Finalized specifications are issued 
            and priced bids are invited from all Stage 1 participants.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_stage1_deadline_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage 1 Submission Period (days)</FormLabel>
                <FormControl>
                  <Input type="number" min="14" placeholder="21" {...field} />
                </FormControl>
                <FormDescription>
                  Period for submission of unpriced technical proposals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_stage2_deadline_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage 2 Submission Period (days)</FormLabel>
                <FormControl>
                  <Input type="number" min="14" placeholder="14" {...field} />
                </FormControl>
                <FormDescription>
                  Period for submission of priced bids after specs finalization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_technical_discussions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Technical Discussions</FormLabel>
                  <FormDescription>
                    Schedule discussions with Stage 1 respondents to refine specs
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_allow_stage1_elimination"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Stage 1 Elimination</FormLabel>
                  <FormDescription>
                    Eliminate unresponsive suppliers before Stage 2
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_stage1_requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage 1 Technical Requirements (Preliminary)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the broad technical requirements for Stage 1 proposals. These will be refined based on received proposals.&#10;&#10;Include:&#10;- Functional requirements&#10;- Performance standards needed&#10;- Key constraints or conditions&#10;- Areas where innovation is welcomed"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderDesignCompetition = () => (
    <Card className="mb-6 border-pink-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-pink-500/10">
            <Palette className="h-6 w-6 text-pink-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Design Competition / Contest Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Jury-Based</Badge>
            </div>
            <CardDescription>
              Competition to select architectural, engineering, or creative designs through a jury panel
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Anonymous Evaluation</AlertTitle>
          <AlertDescription>
            Design competitions require <strong>anonymized submissions</strong> evaluated by an independent jury panel. 
            The jury must have relevant professional qualifications. Winners may be awarded the design contract directly 
            or invited to negotiate.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_jury_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jury Panel Size
                </FormLabel>
                <FormControl>
                  <Input type="number" min="3" placeholder="5" {...field} />
                </FormControl>
                <FormDescription>
                  Minimum 3 jurors with relevant professional qualifications
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_prize_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Prize Money / Honorarium
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 500000" {...field} />
                </FormControl>
                <FormDescription>
                  Prize for the winning design (and runners-up if applicable)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_anonymized_submission"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Anonymized Submissions</FormLabel>
                  <FormDescription>
                    Remove identifying information before jury review
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_ip_ownership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP / Copyright Ownership</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'procuring_entity'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select ownership" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="procuring_entity">Procuring Entity (full transfer)</SelectItem>
                    <SelectItem value="designer">Designer (licensed use)</SelectItem>
                    <SelectItem value="joint">Joint Ownership</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_award_contract_to_winner"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Direct Contract Award to Winner</FormLabel>
                  <FormDescription>
                    Award implementation contract directly to the design winner
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_number_of_prizes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Prizes</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || '3'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1st Place Only</SelectItem>
                    <SelectItem value="2">1st and 2nd Place</SelectItem>
                    <SelectItem value="3">1st, 2nd, and 3rd Place</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_design_brief"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Design Brief</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide the design brief including:&#10;&#10;- Project context and objectives&#10;- Site/space constraints&#10;- Functional requirements&#10;- Aesthetic guidelines&#10;- Budget parameters&#10;- Sustainability requirements&#10;- Submission format (drawings, models, digital)"
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  const renderCompetitiveDialogue = () => (
    <Card className="mb-6 border-violet-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-violet-500/10">
            <MessageSquare className="h-6 w-6 text-violet-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Competitive Dialogue Settings</CardTitle>
              <Badge variant="outline" className="text-xs">Complex Procurement</Badge>
            </div>
            <CardDescription>
              Multi-round dialogue with pre-selected participants to develop solutions for complex procurement
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Structured Dialogue Process</AlertTitle>
          <AlertDescription>
            Used for exceptionally complex contracts where open/restricted procedures cannot identify solutions. 
            The process involves: (1) <strong>Pre-selection</strong> of at least 3 participants; (2) <strong>Dialogue rounds</strong> to develop 
            solutions; (3) <strong>Final tender</strong> submission based on identified solutions. Each dialogue round must maintain 
            equal treatment and confidentiality of solutions.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_dialogue_rounds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Planned Dialogue Rounds</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="10" placeholder="3" {...field} />
                </FormControl>
                <FormDescription>
                  Number of structured dialogue sessions planned
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_min_dialogue_participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Minimum Participants
                </FormLabel>
                <FormControl>
                  <Input type="number" min="3" placeholder="3" {...field} />
                </FormControl>
                <FormDescription>
                  At least 3 participants required
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_dialogue_confidentiality"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Solution Confidentiality</FormLabel>
                  <FormDescription>
                    Keep each participant's solutions confidential from others
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_dialogue_reduction"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Progressive Reduction</FormLabel>
                  <FormDescription>
                    Reduce number of participants after each round
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_complexity_justification"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Justification for Complexity *
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Explain why this procurement is exceptionally complex and why standard methods cannot identify solutions:&#10;&#10;- Technical complexity&#10;- Legal/financial structuring needs&#10;- Innovation requirements&#10;- Risk allocation considerations"
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Required justification for using competitive dialogue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_dialogue_topics"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Dialogue Agenda / Topics</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Outline the key topics for each dialogue round:&#10;&#10;Round 1: Problem definition and solution concepts&#10;Round 2: Technical deep-dive and feasibility&#10;Round 3: Commercial terms and risk allocation&#10;Round 4: Final solution refinement"
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderInnovationPartnership = () => (
    <Card className="mb-6 border-emerald-500/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-emerald-500/10">
            <Lightbulb className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle>Innovation Partnership Settings</CardTitle>
              <Badge variant="outline" className="text-xs">R&D + Procurement</Badge>
            </div>
            <CardDescription>
              Long-term partnership for developing innovative products/services not yet available on the market
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>R&D + Procurement Combined</AlertTitle>
          <AlertDescription>
            Innovation partnerships combine research & development with subsequent commercial acquisition in a single procedure. 
            The partnership proceeds through <strong>successive phases</strong>: (1) R&D phase with milestones, (2) Prototype/testing phase, 
            (3) Commercial supply phase. Partners can be eliminated after each phase based on performance. Budget must cover 
            both R&D and potential commercial acquisition.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="method_innovation_phases"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Phases</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || '3'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select phases" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="2">2 Phases (R&D → Commercial)</SelectItem>
                    <SelectItem value="3">3 Phases (R&D → Prototype → Commercial)</SelectItem>
                    <SelectItem value="4">4 Phases (Research → Dev → Pilot → Commercial)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_innovation_partners"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Initial Partners to Select
                </FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="10" placeholder="3" {...field} />
                </FormControl>
                <FormDescription>
                  Number of partners to start the R&D phase
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_rd_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  R&D Phase Budget
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 10000000" {...field} />
                </FormControl>
                <FormDescription>
                  Budget allocated for research and development activities
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_commercial_budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Commercial Phase Budget
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000000" {...field} />
                </FormControl>
                <FormDescription>
                  Estimated budget for commercial acquisition if R&D succeeds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_ip_rights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intellectual Property Rights</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || 'shared'}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select IP arrangement" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="procuring_entity">Full IP Transfer to Procuring Entity</SelectItem>
                    <SelectItem value="partner">Partner Retains IP (licensed use)</SelectItem>
                    <SelectItem value="shared">Shared / Joint IP Rights</SelectItem>
                    <SelectItem value="negotiated">To Be Negotiated Per Phase</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Define how intellectual property from R&D will be owned
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="method_phase_gate_criteria"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Phase Gate Reviews</FormLabel>
                  <FormDescription>
                    Formal review/elimination at each phase transition
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="method_innovation_challenge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Innovation Challenge Statement</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe the innovation challenge that existing market solutions cannot address:&#10;&#10;- Current problem/gap&#10;- Desired outcomes&#10;- Performance targets&#10;- Constraints (regulatory, budget, timeline)&#10;- What makes this an innovation need vs. standard procurement"
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This forms the basis of partner selection and R&D direction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method_phase_milestones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phase Milestones & Deliverables</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Define key milestones for each phase:&#10;&#10;Phase 1 (R&D - 6 months):&#10;  M1: Concept paper and feasibility study&#10;  M2: Proof of concept&#10;  M3: Technical specification document&#10;&#10;Phase 2 (Prototype - 4 months):&#10;  M4: Working prototype&#10;  M5: User testing results&#10;&#10;Phase 3 (Commercial - 12 months):&#10;  M6: Production-ready product&#10;  M7: Initial deployment"
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );

  // Render based on selected method
  switch (procurementMethod) {
    case ProcurementMethod.OPEN_TENDER:
      return renderOpenTender();
    case ProcurementMethod.RESTRICTED_TENDER:
      return renderRestrictedTender();
    case ProcurementMethod.REQUEST_FOR_PROPOSAL:
      return renderRFP();
    case ProcurementMethod.REQUEST_FOR_QUOTATION:
      return renderRFQ();
    case ProcurementMethod.DIRECT_PROCUREMENT:
      return renderDirectProcurement();
    case ProcurementMethod.FRAMEWORK_AGREEMENT:
      return renderFrameworkAgreement();
    case ProcurementMethod.TWO_STAGE_TENDERING:
      return renderTwoStage();
    case ProcurementMethod.DESIGN_COMPETITION:
    case ProcurementMethod.DESIGN_CONTEST:
      return renderDesignCompetition();
    case ProcurementMethod.COMPETITIVE_DIALOGUE:
      return renderCompetitiveDialogue();
    case ProcurementMethod.INNOVATION_PARTNERSHIP:
      return renderInnovationPartnership();
    // Auction methods are handled by AuctionSettingsForm
    case ProcurementMethod.ELECTRONIC_REVERSE_AUCTION:
    case ProcurementMethod.FORWARD_AUCTION:
    case ProcurementMethod.DUTCH_AUCTION:
      return null; // Handled by AuctionSettingsForm
    default:
      return null;
  }
};

export default ProcurementMethodSettings;

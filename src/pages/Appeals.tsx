import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, FileText, Clock, CheckCircle, XCircle, 
  Scale, Upload, MessageSquare, ArrowRight, AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Appeals = () => {
  const [activeTab, setActiveTab] = useState('my-appeals');

  // Mock data - in production this would come from appealService
  const myAppeals = [
    {
      id: '1',
      tender_title: 'Supply of IT Equipment',
      appeal_type: 'bid_evaluation',
      status: 'under_review',
      appeal_date: '2025-12-01',
      response_deadline: '2025-12-22',
    },
    {
      id: '2',
      tender_title: 'Construction of Office Block',
      appeal_type: 'disqualification',
      status: 'decided',
      decision: 'dismissed',
      appeal_date: '2025-11-15',
      decision_date: '2025-12-01',
    },
  ];

  const getStatusBadge = (status: string, decision?: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      submitted: { variant: 'outline', label: 'Submitted' },
      under_review: { variant: 'secondary', label: 'Under Review' },
      awaiting_response: { variant: 'outline', label: 'Awaiting Response' },
      decided: { variant: decision === 'upheld' ? 'default' : 'destructive', label: decision === 'upheld' ? 'Upheld' : decision === 'partially_upheld' ? 'Partially Upheld' : 'Dismissed' },
      escalated: { variant: 'destructive', label: 'Escalated to PPARB' },
      closed: { variant: 'secondary', label: 'Closed' },
    };
    const config = statusConfig[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleFileAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Appeal Submitted",
      description: "Your appeal has been filed. Response deadline is 21 days per PPRA regulations.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scale className="h-8 w-8 text-primary" />
            Procurement Appeals
          </h1>
          <p className="text-muted-foreground mt-1">
            File and track appeals per PPRA 2015 Part XIII - Review and Complaints
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">14</p>
                <p className="text-sm text-muted-foreground">Days Standstill Period</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">21</p>
                <p className="text-sm text-muted-foreground">Days Response Deadline</p>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{myAppeals.filter(a => a.status === 'under_review').length}</p>
                <p className="text-sm text-muted-foreground">Active Appeals</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{myAppeals.filter(a => a.decision === 'upheld').length}</p>
                <p className="text-sm text-muted-foreground">Appeals Upheld</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="my-appeals">My Appeals</TabsTrigger>
          <TabsTrigger value="file-appeal">File New Appeal</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
        </TabsList>

        <TabsContent value="my-appeals">
          <Card>
            <CardHeader>
              <CardTitle>Appeal History</CardTitle>
              <CardDescription>Track the status of your procurement appeals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tender</TableHead>
                    <TableHead>Appeal Type</TableHead>
                    <TableHead>Filed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline/Decision</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAppeals.map((appeal) => (
                    <TableRow key={appeal.id}>
                      <TableCell className="font-medium">{appeal.tender_title}</TableCell>
                      <TableCell className="capitalize">{appeal.appeal_type.replace('_', ' ')}</TableCell>
                      <TableCell>{new Date(appeal.appeal_date).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(appeal.status, appeal.decision)}</TableCell>
                      <TableCell>
                        {appeal.decision_date 
                          ? new Date(appeal.decision_date).toLocaleDateString()
                          : appeal.response_deadline 
                            ? `Due: ${new Date(appeal.response_deadline).toLocaleDateString()}`
                            : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file-appeal">
          <Card>
            <CardHeader>
              <CardTitle>File a Procurement Appeal</CardTitle>
              <CardDescription>
                Submit an appeal against a procurement decision. Appeals must be filed within 14 days of the decision.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFileAppeal} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tender">Tender Reference</Label>
                    <Input id="tender" placeholder="Enter tender reference number" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appeal-type">Appeal Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select appeal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bid_evaluation">Bid Evaluation</SelectItem>
                        <SelectItem value="award_decision">Award Decision</SelectItem>
                        <SelectItem value="tender_cancellation">Tender Cancellation</SelectItem>
                        <SelectItem value="disqualification">Disqualification</SelectItem>
                        <SelectItem value="specification_dispute">Specification Dispute</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grounds">Grounds for Appeal</Label>
                  <Textarea 
                    id="grounds" 
                    placeholder="Provide detailed grounds for your appeal, including specific violations of procurement law or regulations..."
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supporting Evidence</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, DOC, DOCX up to 10MB each
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Notice</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Filing an appeal triggers a standstill period. The procuring entity cannot proceed with 
                        contract signing until the appeal is resolved. False or frivolous appeals may result in penalties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline">Save as Draft</Button>
                  <Button type="submit">
                    Submit Appeal
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Appeal Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">File Appeal</p>
                    <p className="text-sm text-muted-foreground">Submit within 14 days of the decision you're appealing</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Standstill Triggered</p>
                    <p className="text-sm text-muted-foreground">Contract signing is suspended pending resolution</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Procuring Entity Response</p>
                    <p className="text-sm text-muted-foreground">Response within 21 days per PPRA regulations</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium">Decision</p>
                    <p className="text-sm text-muted-foreground">Appeal upheld, dismissed, or partially upheld</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <p className="font-medium">Escalate to PPARB (Optional)</p>
                    <p className="text-sm text-muted-foreground">If unsatisfied, escalate to Public Procurement Administrative Review Board</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Grounds for Appeal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Per PPRA 2015 Section 167, valid grounds for appeal include:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Breach of procurement procedures or regulations</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unfair or discriminatory evaluation criteria</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Errors in calculation or evaluation scoring</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Conflict of interest by evaluation committee</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Wrongful disqualification</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="line-through text-muted-foreground">Dissatisfaction with outcome alone</span>
                  </li>
                  <li className="flex gap-2">
                    <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="line-through text-muted-foreground">Price competitiveness of winning bid</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Appeals;

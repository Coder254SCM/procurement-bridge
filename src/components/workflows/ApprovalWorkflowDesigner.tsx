import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  GitBranch, Plus, Trash2, ArrowDown, Users, 
  CheckCircle, Clock, AlertCircle, Save, Play
} from "lucide-react";

interface WorkflowStep {
  id: string;
  step_number: number;
  name: string;
  approver_role: string;
  approver_count: number;
  approval_type: 'any' | 'all' | 'majority';
  timeout_hours: number;
  escalation_role?: string;
  conditions?: Record<string, any>;
}

interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'between';
  value: string | number;
}

const ENTITY_TYPES = [
  { value: 'tender', label: 'Tenders' },
  { value: 'requisition', label: 'Purchase Requisitions' },
  { value: 'contract', label: 'Contracts' },
  { value: 'budget', label: 'Budget Allocations' },
  { value: 'payment', label: 'Payments' },
];

const APPROVER_ROLES = [
  { value: 'buyer', label: 'Procurement Officer' },
  { value: 'evaluator_lead', label: 'Evaluation Lead' },
  { value: 'evaluator_finance', label: 'Finance Officer' },
  { value: 'evaluator_technical', label: 'Technical Expert' },
  { value: 'admin', label: 'Administrator' },
];

export function ApprovalWorkflowDesigner() {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [entityType, setEntityType] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [conditions, setConditions] = useState<WorkflowCondition[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step_${Date.now()}`,
      step_number: steps.length + 1,
      name: `Step ${steps.length + 1}`,
      approver_role: '',
      approver_count: 1,
      approval_type: 'any',
      timeout_hours: 48
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(s => s.id !== id).map((s, i) => ({ ...s, step_number: i + 1 })));
  };

  const updateStep = (id: string, field: keyof WorkflowStep, value: any) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addCondition = () => {
    setConditions([...conditions, { field: 'amount', operator: 'greater_than', value: 0 }]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!workflowName || !entityType || steps.length === 0) {
      toast.error('Please complete all required fields and add at least one step');
      return;
    }

    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        description: workflowDescription,
        entity_type: entityType,
        active: isActive,
        conditions: conditions.reduce((acc, c) => ({ ...acc, [c.field]: { operator: c.operator, value: c.value } }), {}),
        steps: steps.map(s => ({
          step_number: s.step_number,
          name: s.name,
          approver_role: s.approver_role,
          approver_count: s.approver_count,
          approval_type: s.approval_type,
          timeout_hours: s.timeout_hours,
          escalation_role: s.escalation_role
        }))
      };

      const { error } = await supabase
        .from('approval_workflows')
        .insert(workflowData as any);

      if (error) throw error;
      toast.success('Workflow saved successfully');
      
      // Reset form
      setWorkflowName('');
      setWorkflowDescription('');
      setEntityType('');
      setSteps([]);
      setConditions([]);
    } catch (error) {
      console.error('Save workflow error:', error);
      toast.error('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Approval Workflow Designer
          </CardTitle>
          <CardDescription>
            Create custom approval workflows for procurement processes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Workflow Name *</Label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g., High Value Tender Approval"
              />
            </div>
            <div className="space-y-2">
              <Label>Entity Type *</Label>
              <Select value={entityType} onValueChange={setEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type..." />
                </SelectTrigger>
                <SelectContent>
                  {ENTITY_TYPES.map(e => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe when this workflow should be used..."
              rows={2}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Workflow Active</Label>
          </div>

          {/* Trigger Conditions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Trigger Conditions</Label>
                <p className="text-sm text-muted-foreground">When should this workflow apply?</p>
              </div>
              <Button variant="outline" size="sm" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </div>

            {conditions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No conditions set. Workflow will apply to all {entityType || 'entities'}.
              </p>
            ) : (
              <div className="space-y-2">
                {conditions.map((condition, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <Select 
                          value={condition.field}
                          onValueChange={(v) => {
                            const updated = [...conditions];
                            updated[index].field = v;
                            setConditions(updated);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">Amount</SelectItem>
                            <SelectItem value="department">Department</SelectItem>
                            <SelectItem value="category">Category</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select 
                          value={condition.operator}
                          onValueChange={(v) => {
                            const updated = [...conditions];
                            updated[index].operator = v as any;
                            setConditions(updated);
                          }}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="greater_than">Greater Than</SelectItem>
                            <SelectItem value="less_than">Less Than</SelectItem>
                          </SelectContent>
                        </Select>

                        <Input
                          value={condition.value}
                          onChange={(e) => {
                            const updated = [...conditions];
                            updated[index].value = e.target.value;
                            setConditions(updated);
                          }}
                          placeholder="Value"
                          className="w-32"
                        />

                        <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Approval Steps</Label>
                <p className="text-sm text-muted-foreground">Define the approval chain</p>
              </div>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>

            {steps.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No approval steps defined</p>
                <Button variant="outline" size="sm" onClick={addStep} className="mt-3">
                  Add First Step
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step.id}>
                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Step {step.step_number}</Badge>
                            <Input
                              value={step.name}
                              onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                              className="h-8 w-48"
                            />
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="space-y-2">
                            <Label className="text-xs">Approver Role</Label>
                            <Select 
                              value={step.approver_role}
                              onValueChange={(v) => updateStep(step.id, 'approver_role', v)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="Select role..." />
                              </SelectTrigger>
                              <SelectContent>
                                {APPROVER_ROLES.map(r => (
                                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Approval Type</Label>
                            <Select 
                              value={step.approval_type}
                              onValueChange={(v) => updateStep(step.id, 'approval_type', v as any)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="any">Any Approver</SelectItem>
                                <SelectItem value="all">All Approvers</SelectItem>
                                <SelectItem value="majority">Majority</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Approvers Needed</Label>
                            <Input
                              type="number"
                              min="1"
                              value={step.approver_count}
                              onChange={(e) => updateStep(step.id, 'approver_count', parseInt(e.target.value) || 1)}
                              className="h-9"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Timeout (hours)</Label>
                            <Input
                              type="number"
                              min="1"
                              value={step.timeout_hours}
                              onChange={(e) => updateStep(step.id, 'timeout_hours', parseInt(e.target.value) || 48)}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ArrowDown className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {/* End indicator */}
                <div className="flex justify-center py-4">
                  <Badge variant="secondary" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approved / Rejected
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Preview Summary */}
          {steps.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Workflow Summary</h4>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Steps:</span>
                    <span className="font-medium">{steps.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Max Duration:</span>
                    <span className="font-medium">
                      {steps.reduce((sum, s) => sum + s.timeout_hours, 0)} hours
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trigger Conditions:</span>
                    <span className="font-medium">{conditions.length || 'None (applies to all)'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Workflow'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
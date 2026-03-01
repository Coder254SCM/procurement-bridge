import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, FileText, AlertTriangle, CheckCircle2, Clock, Send, 
  ChevronRight, Trash2, Edit, Eye, Download, Building2, Calculator,
  Shield, Users
} from 'lucide-react';

interface ProcurementPlan {
  id: string;
  financial_year: string;
  plan_type: string;
  plan_reference: string;
  plan_name: string;
  department: string;
  total_budget_allocation: number;
  total_planned_expenditure: number;
  budget_currency: string;
  agpo_reserved_percentage: number;
  agpo_reserved_amount: number;
  status: string;
  ppra_submission_date: string | null;
  ppra_submission_reference: string | null;
  treasury_submission_date: string | null;
  treasury_submission_reference: string | null;
  approval_date: string | null;
  approval_remarks: string | null;
  multi_year_start: string | null;
  multi_year_end: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PlanItem {
  id: string;
  plan_id: string;
  item_number: number;
  item_description: string;
  category: string;
  quantity: number;
  unit_of_measure: string;
  unit_cost: number;
  estimated_contract_value: number;
  currency: string;
  procurement_method: string;
  is_agpo_reserved: boolean;
  agpo_category: string | null;
  min_responsive_suppliers: number;
  planned_start_date: string | null;
  planned_end_date: string | null;
  delivery_schedule: string | null;
  budget_line_item: string | null;
  funding_source: string | null;
  status: string;
  tender_id: string | null;
  contract_id: string | null;
  actual_expenditure: number | null;
  splitting_flag: boolean;
  splitting_reason: string | null;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-blue-100 text-blue-800',
  submitted_ppra: 'bg-purple-100 text-purple-800',
  submitted_treasury: 'bg-indigo-100 text-indigo-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  revised: 'bg-orange-100 text-orange-800',
};

const itemStatusColors: Record<string, string> = {
  planned: 'bg-muted text-muted-foreground',
  in_progress: 'bg-blue-100 text-blue-800',
  tendered: 'bg-purple-100 text-purple-800',
  awarded: 'bg-green-100 text-green-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  deferred: 'bg-orange-100 text-orange-800',
};

const procurementMethodLabels: Record<string, string> = {
  open_tender: 'Open Tender',
  restricted_tender: 'Restricted Tender',
  request_for_proposal: 'Request for Proposal',
  request_for_quotation: 'Request for Quotation',
  direct_procurement: 'Direct Procurement',
  framework_agreement: 'Framework Agreement',
  two_stage_tendering: 'Two-Stage Tendering',
  design_competition: 'Design Competition',
  electronic_reverse_auction: 'Electronic Reverse Auction',
  low_value_procurement: 'Low Value Procurement',
  force_account: 'Force Account',
  specially_permitted_procurement: 'Specially Permitted',
  innovation_partnership: 'Innovation Partnership',
};

const minSuppliersPerMethod: Record<string, number> = {
  open_tender: 5,
  restricted_tender: 10,
  request_for_proposal: 3,
  request_for_quotation: 3,
  direct_procurement: 1,
  framework_agreement: 3,
  two_stage_tendering: 5,
  design_competition: 3,
  electronic_reverse_auction: 3,
  low_value_procurement: 3,
  force_account: 1,
  specially_permitted_procurement: 1,
  innovation_partnership: 3,
};

const ProcurementPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<ProcurementPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProcurementPlan | null>(null);
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  // Form state for new plan
  const [newPlan, setNewPlan] = useState({
    financial_year: '2025/2026',
    plan_type: 'annual',
    plan_reference: '',
    plan_name: '',
    department: '',
    total_budget_allocation: 0,
    budget_currency: 'KES',
    agpo_reserved_percentage: 30,
    notes: '',
  });

  // Form state for new item
  const [newItem, setNewItem] = useState({
    item_description: '',
    category: '',
    quantity: 1,
    unit_of_measure: 'unit',
    unit_cost: 0,
    procurement_method: 'open_tender',
    is_agpo_reserved: false,
    agpo_category: '',
    planned_start_date: '',
    planned_end_date: '',
    delivery_schedule: '',
    budget_line_item: '',
    funding_source: 'government',
    notes: '',
  });

  useEffect(() => {
    if (user) fetchPlans();
  }, [user]);

  useEffect(() => {
    if (selectedPlan) fetchPlanItems(selectedPlan.id);
  }, [selectedPlan]);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('procurement_plans')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching plans', description: error.message, variant: 'destructive' });
    } else {
      setPlans((data as unknown as ProcurementPlan[]) || []);
    }
    setLoading(false);
  };

  const fetchPlanItems = async (planId: string) => {
    const { data, error } = await supabase
      .from('procurement_plan_items')
      .select('*')
      .eq('plan_id', planId)
      .order('item_number', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching plan items', description: error.message, variant: 'destructive' });
    } else {
      setPlanItems((data as unknown as PlanItem[]) || []);
    }
  };

  const createPlan = async () => {
    if (!user) return;
    const agpoAmount = (newPlan.total_budget_allocation * newPlan.agpo_reserved_percentage) / 100;
    const planRef = `PP-${newPlan.financial_year.replace('/', '')}-${Date.now().toString(36).toUpperCase()}`;

    const { data, error } = await supabase
      .from('procurement_plans')
      .insert({
        created_by: user.id,
        financial_year: newPlan.financial_year,
        plan_type: newPlan.plan_type,
        plan_reference: newPlan.plan_reference || planRef,
        plan_name: newPlan.plan_name,
        department: newPlan.department,
        total_budget_allocation: newPlan.total_budget_allocation,
        total_planned_expenditure: 0,
        budget_currency: newPlan.budget_currency,
        agpo_reserved_percentage: newPlan.agpo_reserved_percentage,
        agpo_reserved_amount: agpoAmount,
        notes: newPlan.notes || null,
      } as any)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating plan', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Plan created', description: `${newPlan.plan_name} created successfully` });
      setShowCreatePlan(false);
      setNewPlan({ financial_year: '2025/2026', plan_type: 'annual', plan_reference: '', plan_name: '', department: '', total_budget_allocation: 0, budget_currency: 'KES', agpo_reserved_percentage: 30, notes: '' });
      fetchPlans();
    }
  };

  const addPlanItem = async () => {
    if (!selectedPlan) return;
    const estimatedValue = newItem.quantity * newItem.unit_cost;
    const minSuppliers = minSuppliersPerMethod[newItem.procurement_method] || 3;
    const nextItemNumber = planItems.length + 1;

    // Contract splitting detection
    const similarItems = planItems.filter(
      item => item.category === newItem.category && item.procurement_method === newItem.procurement_method
    );
    const totalCategoryValue = similarItems.reduce((sum, item) => sum + item.estimated_contract_value, 0) + estimatedValue;
    const splittingFlag = similarItems.length >= 2 && estimatedValue < 500000;

    const { error } = await supabase
      .from('procurement_plan_items')
      .insert({
        plan_id: selectedPlan.id,
        item_number: nextItemNumber,
        item_description: newItem.item_description,
        category: newItem.category,
        quantity: newItem.quantity,
        unit_of_measure: newItem.unit_of_measure,
        unit_cost: newItem.unit_cost,
        estimated_contract_value: estimatedValue,
        procurement_method: newItem.procurement_method,
        is_agpo_reserved: newItem.is_agpo_reserved,
        agpo_category: newItem.agpo_category || null,
        min_responsive_suppliers: minSuppliers,
        planned_start_date: newItem.planned_start_date || null,
        planned_end_date: newItem.planned_end_date || null,
        delivery_schedule: newItem.delivery_schedule || null,
        budget_line_item: newItem.budget_line_item || null,
        funding_source: newItem.funding_source,
        splitting_flag: splittingFlag,
        splitting_reason: splittingFlag ? `${similarItems.length + 1} similar items in category "${newItem.category}" detected — possible contract splitting (PPADA S.54(1))` : null,
        notes: newItem.notes || null,
      } as any);

    if (error) {
      toast({ title: 'Error adding item', description: error.message, variant: 'destructive' });
    } else {
      if (splittingFlag) {
        toast({ title: '⚠️ Contract Splitting Warning', description: 'Multiple similar low-value items detected. Review for PPADA S.54(1) compliance.', variant: 'destructive' });
      } else {
        toast({ title: 'Item added', description: `Item #${nextItemNumber} added to plan` });
      }
      // Update plan's total_planned_expenditure
      const newTotal = planItems.reduce((sum, item) => sum + item.estimated_contract_value, 0) + estimatedValue;
      await supabase.from('procurement_plans').update({ total_planned_expenditure: newTotal } as any).eq('id', selectedPlan.id);

      setShowAddItem(false);
      setNewItem({ item_description: '', category: '', quantity: 1, unit_of_measure: 'unit', unit_cost: 0, procurement_method: 'open_tender', is_agpo_reserved: false, agpo_category: '', planned_start_date: '', planned_end_date: '', delivery_schedule: '', budget_line_item: '', funding_source: 'government', notes: '' });
      fetchPlanItems(selectedPlan.id);
      fetchPlans();
    }
  };

  const updatePlanStatus = async (planId: string, newStatus: string) => {
    const updates: any = { status: newStatus };
    if (newStatus === 'submitted_ppra') {
      updates.ppra_submission_date = new Date().toISOString();
    } else if (newStatus === 'submitted_treasury') {
      updates.treasury_submission_date = new Date().toISOString();
    } else if (newStatus === 'approved') {
      updates.approval_date = new Date().toISOString();
    }

    const { error } = await supabase.from('procurement_plans').update(updates).eq('id', planId);
    if (error) {
      toast({ title: 'Error updating status', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Status updated', description: `Plan status changed to ${newStatus.replace(/_/g, ' ')}` });
      fetchPlans();
      if (selectedPlan?.id === planId) {
        setSelectedPlan(prev => prev ? { ...prev, status: newStatus, ...updates } : null);
      }
    }
  };

  const deletePlanItem = async (itemId: string) => {
    const { error } = await supabase.from('procurement_plan_items').delete().eq('id', itemId);
    if (error) {
      toast({ title: 'Error deleting item', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Item removed' });
      if (selectedPlan) fetchPlanItems(selectedPlan.id);
    }
  };

  const formatCurrency = (amount: number, currency = 'KES') =>
    new Intl.NumberFormat('en-KE', { style: 'currency', currency }).format(amount);

  // Compute stats
  const totalPlannedExpenditure = selectedPlan ? planItems.reduce((s, i) => s + i.estimated_contract_value, 0) : 0;
  const agpoItems = selectedPlan ? planItems.filter(i => i.is_agpo_reserved) : [];
  const agpoTotal = agpoItems.reduce((s, i) => s + i.estimated_contract_value, 0);
  const agpoPercentage = totalPlannedExpenditure > 0 ? (agpoTotal / totalPlannedExpenditure) * 100 : 0;
  const splittingAlerts = planItems.filter(i => i.splitting_flag);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Annual Procurement Plans
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            PPADA 2015 S.53 • PFM Regulations 2015 Reg 51(5)
          </p>
        </div>
        <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> New Procurement Plan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Procurement Plan</DialogTitle>
              <DialogDescription>Annual procurement plan per PPADA 2015 S.53</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Financial Year</Label>
                  <Select value={newPlan.financial_year} onValueChange={v => setNewPlan(p => ({ ...p, financial_year: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024/2025">2024/2025</SelectItem>
                      <SelectItem value="2025/2026">2025/2026</SelectItem>
                      <SelectItem value="2026/2027">2026/2027</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Plan Type</Label>
                  <Select value={newPlan.plan_type} onValueChange={v => setNewPlan(p => ({ ...p, plan_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="multi_year">Multi-Year</SelectItem>
                      <SelectItem value="supplementary">Supplementary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Plan Name</Label>
                <Input value={newPlan.plan_name} onChange={e => setNewPlan(p => ({ ...p, plan_name: e.target.value }))} placeholder="e.g. FY 2025/26 Annual Procurement Plan" />
              </div>
              <div>
                <Label>Department</Label>
                <Input value={newPlan.department} onChange={e => setNewPlan(p => ({ ...p, department: e.target.value }))} placeholder="e.g. Ministry of Health" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Total Budget Allocation (KES)</Label>
                  <Input type="number" value={newPlan.total_budget_allocation} onChange={e => setNewPlan(p => ({ ...p, total_budget_allocation: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>AGPO Reserved % (min 30%)</Label>
                  <Input type="number" min={30} max={100} value={newPlan.agpo_reserved_percentage} onChange={e => setNewPlan(p => ({ ...p, agpo_reserved_percentage: Math.max(30, Number(e.target.value)) }))} />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea value={newPlan.notes} onChange={e => setNewPlan(p => ({ ...p, notes: e.target.value }))} placeholder="Additional plan notes..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreatePlan(false)}>Cancel</Button>
              <Button onClick={createPlan} disabled={!newPlan.plan_name || !newPlan.department}>Create Plan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plans">All Plans</TabsTrigger>
          {selectedPlan && <TabsTrigger value="detail">Plan Detail</TabsTrigger>}
          {selectedPlan && <TabsTrigger value="items">Line Items ({planItems.length})</TabsTrigger>}
          {selectedPlan && <TabsTrigger value="compliance">Compliance</TabsTrigger>}
        </TabsList>

        {/* ALL PLANS TAB */}
        <TabsContent value="plans" className="space-y-4">
          {loading ? (
            <Card><CardContent className="p-8 text-center text-muted-foreground">Loading plans...</CardContent></Card>
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg">No Procurement Plans</h3>
                <p className="text-muted-foreground mt-1">Create your first annual procurement plan per PPADA 2015 S.53</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {plans.map(plan => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedPlan(plan); setActiveTab('detail'); }}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{plan.plan_name}</h3>
                          <Badge className={statusColors[plan.status]}>{plan.status.replace(/_/g, ' ')}</Badge>
                          <Badge variant="outline">{plan.plan_type}</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>FY: {plan.financial_year}</span>
                          <span>Dept: {plan.department}</span>
                          <span>Budget: {formatCurrency(plan.total_budget_allocation)}</span>
                          <span>Planned: {formatCurrency(plan.total_planned_expenditure)}</span>
                          <span>AGPO: {plan.agpo_reserved_percentage}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* PLAN DETAIL TAB */}
        <TabsContent value="detail" className="space-y-4">
          {selectedPlan && (
            <>
              <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => { setSelectedPlan(null); setActiveTab('plans'); }}>← Back to Plans</Button>
                <div className="flex gap-2">
                  {selectedPlan.status === 'draft' && (
                    <Button onClick={() => updatePlanStatus(selectedPlan.id, 'pending_approval')} variant="outline">
                      <Send className="mr-2 h-4 w-4" /> Submit for Approval
                    </Button>
                  )}
                  {selectedPlan.status === 'approved' && (
                    <Button onClick={() => updatePlanStatus(selectedPlan.id, 'submitted_ppra')}>
                      <Send className="mr-2 h-4 w-4" /> Submit to PPRA
                    </Button>
                  )}
                  {selectedPlan.status === 'submitted_ppra' && (
                    <Button onClick={() => updatePlanStatus(selectedPlan.id, 'submitted_treasury')}>
                      <Send className="mr-2 h-4 w-4" /> Submit to Treasury
                    </Button>
                  )}
                  {selectedPlan.status === 'pending_approval' && (
                    <Button onClick={() => updatePlanStatus(selectedPlan.id, 'approved')} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Plan
                    </Button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <p className="text-xl font-bold">{formatCurrency(selectedPlan.total_budget_allocation)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Planned Expenditure</p>
                    <p className="text-xl font-bold">{formatCurrency(totalPlannedExpenditure)}</p>
                    <Progress value={selectedPlan.total_budget_allocation > 0 ? (totalPlannedExpenditure / selectedPlan.total_budget_allocation) * 100 : 0} className="mt-2 h-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> AGPO Reserved
                    </p>
                    <p className="text-xl font-bold">{agpoPercentage.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Min 30% required (PPADA S.53(6))</p>
                    {agpoPercentage < 30 && totalPlannedExpenditure > 0 && (
                      <Badge variant="destructive" className="mt-1">Below minimum</Badge>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Line Items</p>
                    <p className="text-xl font-bold">{planItems.length}</p>
                    {splittingAlerts.length > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        <AlertTriangle className="h-3 w-3 mr-1" /> {splittingAlerts.length} splitting alert(s)
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Plan Info */}
              <Card>
                <CardHeader>
                  <CardTitle>{selectedPlan.plan_name}</CardTitle>
                  <CardDescription>Ref: {selectedPlan.plan_reference} • FY {selectedPlan.financial_year} • {selectedPlan.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge className={statusColors[selectedPlan.status]}>{selectedPlan.status.replace(/_/g, ' ')}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">PPRA Submitted</p>
                      <p>{selectedPlan.ppra_submission_date ? new Date(selectedPlan.ppra_submission_date).toLocaleDateString() : '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Treasury Submitted</p>
                      <p>{selectedPlan.treasury_submission_date ? new Date(selectedPlan.treasury_submission_date).toLocaleDateString() : '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Approval Date</p>
                      <p>{selectedPlan.approval_date ? new Date(selectedPlan.approval_date).toLocaleDateString() : '—'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* LINE ITEMS TAB */}
        <TabsContent value="items" className="space-y-4">
          {selectedPlan && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Line Items — {selectedPlan.plan_name}</h3>
                <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add Plan Item</DialogTitle>
                      <DialogDescription>PFM Reg 51(4) — description, unit cost, estimated value, procurement method, delivery schedule</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label>Item Description *</Label>
                        <Textarea value={newItem.item_description} onChange={e => setNewItem(p => ({ ...p, item_description: e.target.value }))} placeholder="Detailed description of goods/services/works" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Category *</Label>
                          <Select value={newItem.category} onValueChange={v => setNewItem(p => ({ ...p, category: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="goods">Goods</SelectItem>
                              <SelectItem value="services">Services</SelectItem>
                              <SelectItem value="works">Works</SelectItem>
                              <SelectItem value="consulting">Consulting Services</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Procurement Method *</Label>
                          <Select value={newItem.procurement_method} onValueChange={v => setNewItem(p => ({ ...p, procurement_method: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {Object.entries(procurementMethodLabels).map(([k, v]) => (
                                <SelectItem key={k} value={k}>{v}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Min responsive suppliers: {minSuppliersPerMethod[newItem.procurement_method] || 3}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Quantity</Label>
                          <Input type="number" min={1} value={newItem.quantity} onChange={e => setNewItem(p => ({ ...p, quantity: Number(e.target.value) }))} />
                        </div>
                        <div>
                          <Label>Unit of Measure</Label>
                          <Input value={newItem.unit_of_measure} onChange={e => setNewItem(p => ({ ...p, unit_of_measure: e.target.value }))} />
                        </div>
                        <div>
                          <Label>Unit Cost (KES)</Label>
                          <Input type="number" min={0} value={newItem.unit_cost} onChange={e => setNewItem(p => ({ ...p, unit_cost: Number(e.target.value) }))} />
                        </div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded">
                        <p className="text-sm font-medium">Estimated Contract Value: {formatCurrency(newItem.quantity * newItem.unit_cost)}</p>
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Planned Start Date</Label>
                          <Input type="date" value={newItem.planned_start_date} onChange={e => setNewItem(p => ({ ...p, planned_start_date: e.target.value }))} />
                        </div>
                        <div>
                          <Label>Planned End Date</Label>
                          <Input type="date" value={newItem.planned_end_date} onChange={e => setNewItem(p => ({ ...p, planned_end_date: e.target.value }))} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Budget Line Item</Label>
                          <Input value={newItem.budget_line_item} onChange={e => setNewItem(p => ({ ...p, budget_line_item: e.target.value }))} placeholder="e.g. 2211-001" />
                        </div>
                        <div>
                          <Label>Funding Source</Label>
                          <Select value={newItem.funding_source} onValueChange={v => setNewItem(p => ({ ...p, funding_source: v }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="donor">Donor</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                              <SelectItem value="loan">Loan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="agpo" checked={newItem.is_agpo_reserved} onChange={e => setNewItem(p => ({ ...p, is_agpo_reserved: e.target.checked }))} />
                          <Label htmlFor="agpo">AGPO Reserved (PPADA S.53(6))</Label>
                        </div>
                        {newItem.is_agpo_reserved && (
                          <Select value={newItem.agpo_category} onValueChange={v => setNewItem(p => ({ ...p, agpo_category: v }))}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="AGPO Category" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youth">Youth</SelectItem>
                              <SelectItem value="women">Women</SelectItem>
                              <SelectItem value="pwd">PWD</SelectItem>
                              <SelectItem value="msme">MSME</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddItem(false)}>Cancel</Button>
                      <Button onClick={addPlanItem} disabled={!newItem.item_description || !newItem.category}>Add Item</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {planItems.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground">
                    No line items yet. Add your first procurement item.
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead className="text-right">Est. Value</TableHead>
                          <TableHead className="text-center">Min Suppliers</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-center">Flags</TableHead>
                          <TableHead className="w-12" />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {planItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono">{item.item_number}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{item.item_description}</TableCell>
                            <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                            <TableCell className="text-xs">{procurementMethodLabels[item.procurement_method] || item.procurement_method}</TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(item.estimated_contract_value)}</TableCell>
                            <TableCell className="text-center">{item.min_responsive_suppliers}</TableCell>
                            <TableCell><Badge className={itemStatusColors[item.status]}>{item.status}</Badge></TableCell>
                            <TableCell className="text-center">
                              {item.is_agpo_reserved && <Badge variant="secondary" className="mr-1">AGPO</Badge>}
                              {item.splitting_flag && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="h-3 w-3 mr-1" /> Split
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" onClick={() => deletePlanItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-4">
          {selectedPlan && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Legal Compliance Check
                  </CardTitle>
                  <CardDescription>Automated compliance verification against PPADA 2015 & PFM Regulations 2015</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AGPO Check */}
                  <div className="flex items-start gap-3 p-3 rounded border">
                    {agpoPercentage >= 30 || totalPlannedExpenditure === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">AGPO Reservation — PPADA S.53(6)</p>
                      <p className="text-sm text-muted-foreground">Minimum 30% of procurement value must be reserved for Youth, Women, PWDs, and MSMEs.</p>
                      <p className="text-sm mt-1">Current: <strong>{agpoPercentage.toFixed(1)}%</strong> ({formatCurrency(agpoTotal)})</p>
                    </div>
                  </div>

                  {/* Budget vs Planned */}
                  <div className="flex items-start gap-3 p-3 rounded border">
                    {totalPlannedExpenditure <= selectedPlan.total_budget_allocation ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Budget Ceiling — PFM Reg 51(3)</p>
                      <p className="text-sm text-muted-foreground">Planned expenditure must not exceed approved budget allocation.</p>
                      <p className="text-sm mt-1">Budget: {formatCurrency(selectedPlan.total_budget_allocation)} | Planned: {formatCurrency(totalPlannedExpenditure)}</p>
                    </div>
                  </div>

                  {/* PPRA Submission */}
                  <div className="flex items-start gap-3 p-3 rounded border">
                    {selectedPlan.ppra_submission_date ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">PPRA Submission — PPADA S.44(c)(i)</p>
                      <p className="text-sm text-muted-foreground">Plan must be submitted to PPRA within 60 days of financial year start.</p>
                      <p className="text-sm mt-1">{selectedPlan.ppra_submission_date ? `Submitted: ${new Date(selectedPlan.ppra_submission_date).toLocaleDateString()}` : 'Pending'}</p>
                    </div>
                  </div>

                  {/* Contract Splitting */}
                  <div className="flex items-start gap-3 p-3 rounded border">
                    {splittingAlerts.length === 0 ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">Contract Splitting — PPADA S.54(1)</p>
                      <p className="text-sm text-muted-foreground">Splitting procurement to avoid thresholds is prohibited.</p>
                      {splittingAlerts.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {splittingAlerts.map(alert => (
                            <p key={alert.id} className="text-sm text-destructive">
                              ⚠ Item #{alert.item_number}: {alert.splitting_reason}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm mt-1 text-green-700">No splitting detected.</p>
                      )}
                    </div>
                  </div>

                  {/* Responsive Suppliers */}
                  <div className="flex items-start gap-3 p-3 rounded border">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Minimum Responsive Suppliers</p>
                      <p className="text-sm text-muted-foreground">Each procurement method has minimum bidder requirements per PPADA Regulations.</p>
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                        {planItems.map(item => (
                          <span key={item.id}>
                            #{item.item_number} — {procurementMethodLabels[item.procurement_method]}: <strong>{item.min_responsive_suppliers}</strong> min
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcurementPlans;

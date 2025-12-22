import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { budgetService, BudgetAllocation } from "@/services/BudgetService";
import { 
  Wallet, Plus, TrendingUp, TrendingDown, AlertTriangle,
  DollarSign, PieChart, RefreshCw, Filter, Download
} from "lucide-react";

const DEPARTMENTS = [
  'Finance', 'Procurement', 'IT', 'Operations', 'HR', 'Marketing', 'Legal', 'Administration'
];

const FINANCIAL_YEARS = ['2024/2025', '2025/2026', '2026/2027'];

export function BudgetAllocationInterface() {
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('2024/2025');
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // New budget form
  const [newBudget, setNewBudget] = useState({
    budget_code: '',
    budget_name: '',
    department: '',
    total_allocation: 0,
    currency: 'KES'
  });

  useEffect(() => {
    loadBudgets();
  }, [filterDepartment, filterYear]);

  const loadBudgets = async () => {
    setIsLoading(true);
    try {
      const filters: any = { financialYear: filterYear };
      if (filterDepartment !== 'all') {
        filters.department = filterDepartment;
      }
      const result = await budgetService.getBudgets(filters);
      setBudgets(result.data || []);
    } catch (error) {
      console.error('Load budgets error:', error);
      toast.error('Failed to load budgets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBudget = async () => {
    if (!newBudget.budget_code || !newBudget.budget_name || !newBudget.department) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await budgetService.createBudget({
        budget_code: newBudget.budget_code,
        budget_name: newBudget.budget_name,
        department: newBudget.department,
        financial_year: filterYear,
        total_allocation: newBudget.total_allocation,
        committed_amount: 0,
        spent_amount: 0,
        currency: newBudget.currency,
        status: 'active'
      });
      toast.success('Budget created successfully');
      setShowAddDialog(false);
      setNewBudget({ budget_code: '', budget_name: '', department: '', total_allocation: 0, currency: 'KES' });
      loadBudgets();
    } catch (error) {
      console.error('Create budget error:', error);
      toast.error('Failed to create budget');
    }
  };

  const getUtilization = (budget: BudgetAllocation) => {
    const utilized = budget.committed_amount + budget.spent_amount;
    return Math.round((utilized / budget.total_allocation) * 100);
  };

  const getStatusColor = (utilization: number) => {
    if (utilization >= 90) return 'text-destructive';
    if (utilization >= 70) return 'text-amber-500';
    return 'text-green-500';
  };

  const totals = budgets.reduce((acc, b) => ({
    allocated: acc.allocated + b.total_allocation,
    committed: acc.committed + b.committed_amount,
    spent: acc.spent + b.spent_amount,
    available: acc.available + b.available_amount
  }), { allocated: 0, committed: 0, spent: 0, available: 0 });

  const overallUtilization = totals.allocated > 0 
    ? Math.round(((totals.committed + totals.spent) / totals.allocated) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            Budget Allocation
          </h2>
          <p className="text-muted-foreground">Manage and track departmental budget allocations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadBudgets}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Budget Allocation</DialogTitle>
                <DialogDescription>Add a new budget line for {filterYear}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Budget Code *</Label>
                    <Input
                      value={newBudget.budget_code}
                      onChange={(e) => setNewBudget({ ...newBudget, budget_code: e.target.value })}
                      placeholder="e.g., BUD-2024-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Name *</Label>
                    <Input
                      value={newBudget.budget_name}
                      onChange={(e) => setNewBudget({ ...newBudget, budget_name: e.target.value })}
                      placeholder="e.g., IT Equipment"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Department *</Label>
                    <Select 
                      value={newBudget.department} 
                      onValueChange={(v) => setNewBudget({ ...newBudget, department: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Allocation (KES) *</Label>
                    <Input
                      type="number"
                      value={newBudget.total_allocation}
                      onChange={(e) => setNewBudget({ ...newBudget, total_allocation: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateBudget} className="w-full">
                  Create Budget
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Allocated</p>
                <p className="text-2xl font-bold">KES {(totals.allocated / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Committed</p>
                <p className="text-2xl font-bold text-amber-500">KES {(totals.committed / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Spent</p>
                <p className="text-2xl font-bold text-green-500">KES {(totals.spent / 1000000).toFixed(1)}M</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={overallUtilization >= 90 ? 'border-destructive' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className={`text-2xl font-bold ${getStatusColor(overallUtilization)}`}>{overallUtilization}%</p>
              </div>
              <PieChart className={`h-8 w-8 ${getStatusColor(overallUtilization)}`} />
            </div>
            <Progress value={overallUtilization} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FINANCIAL_YEARS.map(fy => (
                  <SelectItem key={fy} value={fy}>{fy}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Lines</CardTitle>
          <CardDescription>{budgets.length} budget allocations for {filterYear}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading budgets...</div>
          ) : budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No budget allocations found. Create your first budget allocation.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Allocated</TableHead>
                  <TableHead className="text-right">Committed</TableHead>
                  <TableHead className="text-right">Spent</TableHead>
                  <TableHead className="text-right">Available</TableHead>
                  <TableHead className="text-center">Utilization</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => {
                  const utilization = getUtilization(budget);
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-mono text-sm">{budget.budget_code}</TableCell>
                      <TableCell className="font-medium">{budget.budget_name}</TableCell>
                      <TableCell>{budget.department}</TableCell>
                      <TableCell className="text-right">
                        {budget.currency} {budget.total_allocation.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-amber-600">
                        {budget.committed_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {budget.spent_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {budget.available_amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={utilization} className="h-2 w-20" />
                          <span className={`text-sm ${getStatusColor(utilization)}`}>
                            {utilization}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={budget.status === 'active' ? 'default' : 'secondary'}>
                          {budget.status}
                        </Badge>
                        {utilization >= 90 && (
                          <AlertTriangle className="h-4 w-4 text-destructive inline ml-2" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
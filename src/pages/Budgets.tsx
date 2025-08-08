import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { budgetService, BudgetAllocation } from "@/services/BudgetService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, Plus } from "lucide-react";

const Budgets: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [financialYear, setFinancialYear] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await budgetService.getBudgets({ department: department || undefined, financialYear: financialYear || undefined });
      setBudgets(res.data || []);
    } catch (e: any) {
      toast({ title: "Failed to load budgets", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return budgets.filter(b =>
      (!department || b.department === department) &&
      (!financialYear || b.financial_year === financialYear) &&
      (!s || b.budget_code.toLowerCase().includes(s) || b.budget_name.toLowerCase().includes(s))
    );
  }, [budgets, department, financialYear, search]);

  const totals = useMemo(() => {
    const total_allocation = filtered.reduce((acc, b) => acc + (b.total_allocation || 0), 0);
    const committed = filtered.reduce((acc, b) => acc + (b.committed_amount || 0), 0);
    const spent = filtered.reduce((acc, b) => acc + (b.spent_amount || 0), 0);
    const available = filtered.reduce((acc, b) => acc + (b.available_amount || 0), 0);
    const utilization = total_allocation ? Math.round((spent / total_allocation) * 100) : 0;
    return { total_allocation, committed, spent, available, utilization };
  }, [filtered]);

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>Budgets Dashboard | ProcureChain</title>
        <meta name="description" content="Budget allocation dashboard: utilization, commitments, and availability across departments." />
        <link rel="canonical" href="/budgets" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Budget Allocation Dashboard</h1>
        <p className="text-muted-foreground">Track allocation, commitments, spending and availability.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="hover-lift"><CardHeader><CardTitle>Total Allocation</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-2xl font-semibold">{totals.total_allocation.toLocaleString()}</div><p className="text-sm text-muted-foreground">All filtered budgets</p></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Committed</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-2xl font-semibold">{totals.committed.toLocaleString()}</div><Progress value={Math.min(100, Math.round((totals.committed / (totals.total_allocation || 1)) * 100))} /></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Spent</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-2xl font-semibold">{totals.spent.toLocaleString()}</div><Progress value={totals.utilization} /></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Available</CardTitle></CardHeader><CardContent className="space-y-2"><div className="text-2xl font-semibold">{totals.available.toLocaleString()}</div><p className="text-sm text-muted-foreground">Remaining funds</p></CardContent></Card>
      </section>

      <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Search</label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or name" />
        </div>
        <div className="w-full md:w-56">
          <label className="text-sm text-muted-foreground">Department</label>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Procurement">Procurement</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-56">
          <label className="text-sm text-muted-foreground">Financial Year</label>
          <Select value={financialYear} onValueChange={setFinancialYear}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="2024/2025">2024/2025</SelectItem>
              <SelectItem value="2023/2024">2023/2024</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}Refresh
          </Button>
          <Button variant="default"><Plus className="h-4 w-4 mr-2" />New Budget</Button>
        </div>
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading budgets…</div>
        ) : (
          filtered.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No budgets found for the selected filters.</CardContent></Card>
          ) : (
            filtered.map(b => (
              <Card key={b.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{b.budget_code} — {b.budget_name}</CardTitle>
                    <span className="text-sm text-muted-foreground">{b.department} • {b.financial_year}</span>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-semibold">{b.total_allocation.toLocaleString()} {b.currency}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Committed</div>
                    <div className="text-xl font-semibold">{b.committed_amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Spent</div>
                    <div className="text-xl font-semibold">{b.spent_amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Available</div>
                    <div className="text-xl font-semibold">{b.available_amount.toLocaleString()}</div>
                    <Progress className="mt-2" value={Math.min(100, Math.round((b.spent_amount / (b.total_allocation || 1)) * 100))} />
                  </div>
                </CardContent>
              </Card>
            ))
          )
        )}
      </section>
    </div>
  );
};

export default Budgets;

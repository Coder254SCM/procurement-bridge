import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend
} from 'recharts';
import { 
  Loader2, Users, FileText, Gavel, ShieldCheck, TrendingUp, TrendingDown,
  AlertTriangle, DollarSign, Activity, Database, Clock, CheckCircle2,
  XCircle, Eye, RefreshCw, BarChart3, Globe, Lock, Cpu, Zap
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2, 160 60% 45%))', 'hsl(var(--chart-3, 30 80% 55%))', 'hsl(var(--chart-4, 280 65% 60%))', 'hsl(var(--chart-5, 340 75% 55%))'];

// ── Platform KPIs ──────────────────────────────────────────────
const usePlatformKPIs = () => useQuery({
  queryKey: ['admin', 'platform-kpis'],
  queryFn: async () => {
    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30).toISOString();
    const sixtyDaysAgo = subDays(now, 60).toISOString();

    const [
      { count: totalUsers },
      { count: newUsersThisMonth },
      { count: newUsersPrevMonth },
      { count: totalTenders },
      { count: activeTenders },
      { count: tendersThisMonth },
      { count: tendersPrevMonth },
      { count: totalBids },
      { count: bidsThisMonth },
      { count: bidsPrevMonth },
      { count: totalContracts },
      { data: contractValues },
      { count: totalEvaluations },
      { count: fraudAlerts },
      { count: openFraud },
      { count: verifiedUsers },
      { count: totalBlockchainTx },
      { count: pendingBlockchainTx },
      { count: appeals },
      { count: openAppeals },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
      supabase.from('tenders').select('*', { count: 'exact', head: true }),
      supabase.from('tenders').select('*', { count: 'exact', head: true }).in('status', ['published', 'evaluation']),
      supabase.from('tenders').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('tenders').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
      supabase.from('bids').select('*', { count: 'exact', head: true }),
      supabase.from('bids').select('*', { count: 'exact', head: true }).gte('created_at', thirtyDaysAgo),
      supabase.from('bids').select('*', { count: 'exact', head: true }).gte('created_at', sixtyDaysAgo).lt('created_at', thirtyDaysAgo),
      supabase.from('contracts').select('*', { count: 'exact', head: true }),
      supabase.from('contracts').select('contract_value'),
      supabase.from('evaluations').select('*', { count: 'exact', head: true }),
      supabase.from('fraud_alerts').select('*', { count: 'exact', head: true }),
      supabase.from('fraud_alerts').select('*', { count: 'exact', head: true }).in('status', ['open', 'investigating']),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('kyc_status', 'verified'),
      supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }),
      supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('procurement_appeals').select('*', { count: 'exact', head: true }),
      supabase.from('procurement_appeals').select('*', { count: 'exact', head: true }).in('status', ['submitted', 'under_review']),
    ]);

    const totalContractValue = (contractValues || []).reduce((sum, c) => sum + (c.contract_value || 0), 0);
    const pctChange = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100);

    return {
      totalUsers: totalUsers || 0,
      newUsersThisMonth: newUsersThisMonth || 0,
      usersChange: pctChange(newUsersThisMonth || 0, newUsersPrevMonth || 0),
      verifiedUsers: verifiedUsers || 0,
      verificationRate: totalUsers ? Math.round(((verifiedUsers || 0) / totalUsers) * 100) : 0,
      totalTenders: totalTenders || 0,
      activeTenders: activeTenders || 0,
      tendersChange: pctChange(tendersThisMonth || 0, tendersPrevMonth || 0),
      totalBids: totalBids || 0,
      bidsChange: pctChange(bidsThisMonth || 0, bidsPrevMonth || 0),
      avgBidsPerTender: totalTenders ? parseFloat(((totalBids || 0) / totalTenders).toFixed(1)) : 0,
      totalContracts: totalContracts || 0,
      totalContractValue,
      totalEvaluations: totalEvaluations || 0,
      fraudAlerts: fraudAlerts || 0,
      openFraud: openFraud || 0,
      totalBlockchainTx: totalBlockchainTx || 0,
      pendingBlockchainTx: pendingBlockchainTx || 0,
      appeals: appeals || 0,
      openAppeals: openAppeals || 0,
    };
  },
});

// ── Role Distribution ──────────────────────────────────────────
const useRoleDistribution = () => useQuery({
  queryKey: ['admin', 'role-distribution'],
  queryFn: async () => {
    const { data } = await supabase.from('user_roles').select('role');
    const counts: Record<string, number> = {};
    (data || []).forEach(r => { counts[r.role] = (counts[r.role] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
  },
});

// ── Tender Status Distribution ─────────────────────────────────
const useTenderStatusDist = () => useQuery({
  queryKey: ['admin', 'tender-status-dist'],
  queryFn: async () => {
    const { data } = await supabase.from('tenders').select('status');
    const counts: Record<string, number> = {};
    (data || []).forEach(t => { counts[t.status] = (counts[t.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  },
});

// ── Monthly Activity Trend ─────────────────────────────────────
const useMonthlyActivity = () => useQuery({
  queryKey: ['admin', 'monthly-activity'],
  queryFn: async () => {
    const months: { month: string; tenders: number; bids: number; contracts: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = startOfMonth(d).toISOString();
      const end = endOfMonth(d).toISOString();
      const label = format(d, 'MMM yyyy');
      const [{ count: t }, { count: b }, { count: c }] = await Promise.all([
        supabase.from('tenders').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
        supabase.from('bids').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
        supabase.from('contracts').select('*', { count: 'exact', head: true }).gte('created_at', start).lte('created_at', end),
      ]);
      months.push({ month: label, tenders: t || 0, bids: b || 0, contracts: c || 0 });
    }
    return months;
  },
});

// ── Recent Audit Logs ──────────────────────────────────────────
const useRecentAuditLogs = () => useQuery({
  queryKey: ['admin', 'audit-logs'],
  queryFn: async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('id, action, entity_type, entity_id, created_at, user_id')
      .order('created_at', { ascending: false })
      .limit(20);
    return data || [];
  },
});

// ── Recent Fraud Alerts ────────────────────────────────────────
const useRecentFraudAlerts = () => useQuery({
  queryKey: ['admin', 'fraud-alerts'],
  queryFn: async () => {
    const { data } = await supabase
      .from('fraud_alerts')
      .select('id, type, severity, status, description, detected_at, entity_type')
      .order('detected_at', { ascending: false })
      .limit(10);
    return data || [];
  },
});

// ── Budget Utilization ─────────────────────────────────────────
const useBudgetUtilization = () => useQuery({
  queryKey: ['admin', 'budget-utilization'],
  queryFn: async () => {
    const { data } = await supabase
      .from('budget_allocations')
      .select('budget_name, department, total_allocation, spent_amount, committed_amount, available_amount, status')
      .order('total_allocation', { ascending: false })
      .limit(10);
    return data || [];
  },
});

// ── Compliance Checks Summary ──────────────────────────────────
const useComplianceSummary = () => useQuery({
  queryKey: ['admin', 'compliance-summary'],
  queryFn: async () => {
    const { data } = await supabase.from('compliance_checks').select('status, check_type');
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    (data || []).forEach(c => {
      byStatus[c.status] = (byStatus[c.status] || 0) + 1;
      byType[c.check_type] = (byType[c.check_type] || 0) + 1;
    });
    return {
      byStatus: Object.entries(byStatus).map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] })),
      byType: Object.entries(byType).map(([name, value]) => ({ name, value })),
      total: data?.length || 0,
      passed: (data || []).filter(c => c.status === 'verified' || (c.status as string) === 'passed').length,
    };
  },
});

// ── Component ──────────────────────────────────────────────────
const AdminDashboard = () => {
  const { data: kpis, isLoading: kpisLoading } = usePlatformKPIs();
  const { data: roles } = useRoleDistribution();
  const { data: tenderStatus } = useTenderStatusDist();
  const { data: monthlyActivity } = useMonthlyActivity();
  const { data: auditLogs } = useRecentAuditLogs();
  const { data: fraudAlerts } = useRecentFraudAlerts();
  const { data: budgets } = useBudgetUtilization();
  const { data: compliance } = useComplianceSummary();

  if (kpisLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading admin dashboard…</span>
      </div>
    );
  }

  const KpiCard = ({ title, value, icon: Icon, change, suffix, sub }: { title: string; value: number | string; icon: any; change?: number; suffix?: string; sub?: string }) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}{suffix}</div>
            {change !== undefined && (
              <div className={`flex items-center text-xs mt-1 ${change >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {change >= 0 ? '+' : ''}{change}% vs prev 30d
              </div>
            )}
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container py-8 px-4 md:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform-wide analytics and operations</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Activity className="h-3 w-3 mr-1" /> Live Data
        </Badge>
      </div>

      {/* ─── Primary KPI Grid ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard title="Total Users" value={kpis?.totalUsers || 0} icon={Users} change={kpis?.usersChange} sub={`${kpis?.verifiedUsers} verified`} />
        <KpiCard title="Active Tenders" value={kpis?.activeTenders || 0} icon={FileText} change={kpis?.tendersChange} sub={`${kpis?.totalTenders} total`} />
        <KpiCard title="Total Bids" value={kpis?.totalBids || 0} icon={Gavel} change={kpis?.bidsChange} sub={`${kpis?.avgBidsPerTender} avg/tender`} />
        <KpiCard title="Contract Value" value={`KES ${((kpis?.totalContractValue || 0) / 1e6).toFixed(1)}M`} icon={DollarSign} sub={`${kpis?.totalContracts} contracts`} />
        <KpiCard title="Fraud Alerts" value={kpis?.openFraud || 0} icon={AlertTriangle} sub={`${kpis?.fraudAlerts} total`} />
        <KpiCard title="Blockchain Tx" value={kpis?.totalBlockchainTx || 0} icon={Lock} sub={`${kpis?.pendingBlockchainTx} pending`} />
      </div>

      {/* ─── Secondary KPI Row ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Verification Rate" value={kpis?.verificationRate || 0} icon={ShieldCheck} suffix="%" />
        <KpiCard title="Evaluations" value={kpis?.totalEvaluations || 0} icon={CheckCircle2} />
        <KpiCard title="Open Appeals" value={kpis?.openAppeals || 0} icon={Eye} sub={`${kpis?.appeals} total`} />
        <KpiCard title="Compliance Rate" value={compliance?.total ? Math.round((compliance.passed / compliance.total) * 100) : 0} icon={ShieldCheck} suffix="%" sub={`${compliance?.passed}/${compliance?.total} passed`} />
      </div>

      {/* ─── Tabs ─── */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="procurement">Procurement</TabsTrigger>
          <TabsTrigger value="security">Security & Fraud</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* ─── OVERVIEW ─── */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>Platform activity over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyActivity || []}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="tenders" stackId="1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} name="Tenders" />
                      <Area type="monotone" dataKey="bids" stackId="1" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.3} name="Bids" />
                      <Area type="monotone" dataKey="contracts" stackId="1" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} fillOpacity={0.3} name="Contracts" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Tender Status */}
            <Card>
              <CardHeader>
                <CardTitle>Tender Status Distribution</CardTitle>
                <CardDescription>Current status of all tenders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={tenderStatus || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                        {(tenderStatus || []).map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Utilization */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
              <CardDescription>Department budget allocation and spend</CardDescription>
            </CardHeader>
            <CardContent>
              {(budgets || []).length === 0 ? (
                <p className="text-muted-foreground text-sm">No budget allocations configured yet.</p>
              ) : (
                <div className="space-y-4">
                  {(budgets || []).map((b: any) => {
                    const utilization = b.total_allocation > 0 ? Math.round(((b.spent_amount || 0) / b.total_allocation) * 100) : 0;
                    return (
                      <div key={b.budget_name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{b.budget_name}</span>
                          <span className="text-muted-foreground">{b.department} — {utilization}% utilized</span>
                        </div>
                        <Progress value={utilization} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Spent: KES {((b.spent_amount || 0) / 1e6).toFixed(1)}M</span>
                          <span>Total: KES {((b.total_allocation || 0) / 1e6).toFixed(1)}M</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── USERS & ROLES ─── */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>Users by role across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roles || []} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis dataKey="name" type="category" width={120} className="text-xs capitalize" />
                      <Tooltip />
                      <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} name="Users" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Verification</CardTitle>
                <CardDescription>KYC and identity verification metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold">{kpis?.verificationRate}%</div>
                  <p className="text-sm text-muted-foreground mt-1">Overall Verification Rate</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{kpis?.verifiedUsers}</div>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/30 rounded-lg">
                    <div className="text-2xl font-bold text-destructive">{(kpis?.totalUsers || 0) - (kpis?.verifiedUsers || 0)}</div>
                    <p className="text-xs text-muted-foreground">Unverified</p>
                  </div>
                </div>
                <Progress value={kpis?.verificationRate || 0} className="h-3" />
              </CardContent>
            </Card>
          </div>

          {/* Compliance Checks */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checks</CardTitle>
              <CardDescription>Status of all compliance checks across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {(compliance?.byStatus || []).length === 0 ? (
                <p className="text-muted-foreground text-sm">No compliance checks recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={compliance?.byStatus || []} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {(compliance?.byStatus || []).map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {(compliance?.byType || []).map((t: any) => (
                      <div key={t.name} className="flex justify-between items-center p-3 bg-secondary/20 rounded-md">
                        <span className="text-sm font-medium capitalize">{t.name.replace(/_/g, ' ')}</span>
                        <Badge variant="secondary">{t.value}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── PROCUREMENT ─── */}
        <TabsContent value="procurement" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-3xl font-bold">{kpis?.totalTenders}</div>
              <p className="text-xs text-muted-foreground">Total Tenders</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold">{kpis?.avgBidsPerTender}</div>
              <p className="text-xs text-muted-foreground">Avg Bids/Tender</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold">{kpis?.totalContracts}</div>
              <p className="text-xs text-muted-foreground">Contracts Awarded</p>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold">KES {((kpis?.totalContractValue || 0) / 1e6).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">Total Contract Value</p>
            </Card>
          </div>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Procurement Pipeline</CardTitle>
              <CardDescription>Monthly tender-to-contract conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyActivity || []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tenders" fill={CHART_COLORS[0]} name="Tenders" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="bids" fill={CHART_COLORS[1]} name="Bids" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="contracts" fill={CHART_COLORS[2]} name="Contracts" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── SECURITY & FRAUD ─── */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard title="Total Alerts" value={kpis?.fraudAlerts || 0} icon={AlertTriangle} />
            <KpiCard title="Open/Investigating" value={kpis?.openFraud || 0} icon={Eye} />
            <KpiCard title="Blockchain Integrity" value={kpis?.totalBlockchainTx || 0} icon={Lock} sub={`${kpis?.pendingBlockchainTx} pending`} />
            <KpiCard title="Open Appeals" value={kpis?.openAppeals || 0} icon={Gavel} sub={`${kpis?.appeals} total`} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Fraud Alerts</CardTitle>
              <CardDescription>Latest detected anomalies and security events</CardDescription>
            </CardHeader>
            <CardContent>
              {(fraudAlerts || []).length === 0 ? (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>No fraud alerts detected — system integrity is healthy.</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Detected</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(fraudAlerts || []).map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium capitalize">{alert.type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell>
                          <Badge variant={alert.severity === 'critical' ? 'destructive' : alert.severity === 'high' ? 'destructive' : 'secondary'} className="capitalize">
                            {alert.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{alert.status}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground capitalize">{alert.entity_type}</TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(alert.detected_at), 'dd MMM yyyy HH:mm')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── AUDIT TRAIL ─── */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>Complete audit trail of platform operations</CardDescription>
            </CardHeader>
            <CardContent>
              {(auditLogs || []).length === 0 ? (
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertDescription>No audit logs recorded yet. All user actions will be tracked here.</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity Type</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(auditLogs || []).map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium capitalize">{log.action?.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="capitalize">{log.entity_type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{log.entity_id?.slice(0, 8)}…</TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(log.created_at), 'dd MMM yyyy HH:mm')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

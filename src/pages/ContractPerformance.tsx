import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { contractPerformanceService, ContractMilestone } from "@/services/ContractPerformanceService";
import { Loader2, Search } from "lucide-react";

const ContractPerformance: React.FC = () => {
  const { toast } = useToast();
  const [contractId, setContractId] = useState("");
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<{ score: number; status: string } | null>(null);
  const [milestones, setMilestones] = useState<ContractMilestone[]>([]);

  const load = async () => {
    if (!contractId) {
      toast({ title: "Enter a contract ID", variant: "destructive" });
      return;
    }
    try {
      setLoading(true);
      const h = await contractPerformanceService.calculateContractHealth(contractId);
      setHealth(h);
      const upcoming = await contractPerformanceService.getUpcomingMilestones(contractId, 60);
      setMilestones(upcoming);
    } catch (e: any) {
      toast({ title: "Failed to load performance", description: e?.message || "Unknown error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = useMemo(() => {
    if (!health) return "";
    switch (health.status) {
      case "excellent": return "text-green-600";
      case "good": return "text-emerald-600";
      case "fair": return "text-yellow-600";
      case "poor": return "text-destructive";
      default: return "text-muted-foreground";
    }
  }, [health]);

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>Contract Performance | ProcureChain</title>
        <meta name="description" content="Monitor contract health and milestones with real-time status and upcoming deadlines." />
        <link rel="canonical" href="/contract-performance" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Contract Performance</h1>
        <p className="text-muted-foreground">Enter a contract ID to view its health and upcoming milestones.</p>
      </header>

      <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Contract ID</label>
          <Input value={contractId} onChange={(e) => setContractId(e.target.value)} placeholder="e.g. contract_123" />
        </div>
        <div>
          <Button onClick={load}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}Load
          </Button>
        </div>
      </section>

      <Separator />

      {health && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover-lift md:col-span-2">
            <CardHeader><CardTitle>Overall Health</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className={`text-2xl font-semibold ${statusColor}`}>{health.status.toUpperCase()}</div>
                <div className="text-3xl font-bold">{health.score}</div>
              </div>
              <Progress className="mt-4" value={health.score} />
            </CardContent>
          </Card>
          <Card className="hover-lift">
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">View Detailed Report</Button>
              <Button variant="secondary" className="w-full">Schedule Review</Button>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4">
        <Card className="hover-lift">
          <CardHeader><CardTitle>Upcoming Milestones (60 days)</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…</div>
            ) : milestones.length === 0 ? (
              <div className="text-muted-foreground">No upcoming milestones.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {milestones.map(m => (
                  <div key={m.id} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{m.milestone_name}</div>
                      <span className="text-xs text-muted-foreground">{m.due_date}</span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">Status: {m.status}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ContractPerformance;

import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supplierQualificationService, QualificationData } from "@/services/SupplierQualificationService";
import { Loader2, RefreshCw } from "lucide-react";

const Qualifications: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [qualifications, setQualifications] = useState<QualificationData[]>([]);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await supplierQualificationService.getQualifications();
      setQualifications(res.data || []);
    } catch (e: any) {
      toast({ title: "Failed to load qualifications", description: e?.message || "Unknown error", variant: "destructive" });
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
    return qualifications.filter(q =>
      (!status || q.status === status) &&
      (!s || q.supplier_id.toLowerCase().includes(s) || q.category_id.toLowerCase().includes(s))
    );
  }, [qualifications, status, search]);

  const counts = useMemo(() => {
    const total = qualifications.length;
    const byStatus: Record<string, number> = { approved: 0, pending: 0, rejected: 0, expired: 0 };
    qualifications.forEach(q => { byStatus[q.status] = (byStatus[q.status] || 0) + 1; });
    return { total, ...byStatus } as any;
  }, [qualifications]);

  const statusBadge = (s: QualificationData["status"]) => {
    const variants: Record<string, string> = {
      approved: "bg-green-500/10 text-green-700",
      pending: "bg-yellow-500/10 text-yellow-700",
      rejected: "bg-destructive/10 text-destructive",
      expired: "bg-muted text-muted-foreground",
    };
    return <span className={`px-2 py-1 rounded text-xs ${variants[s] || "bg-muted"}`}>{s}</span>;
  };

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>Supplier Qualifications | ProcureChain</title>
        <meta name="description" content="Supplier qualification dashboard with status tracking, scores and validity." />
        <link rel="canonical" href="/qualifications" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Supplier Qualification Dashboard</h1>
        <p className="text-muted-foreground">Monitor qualification status, scores and validity.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-4">
        <Card className="hover-lift"><CardHeader><CardTitle>Total Qualified</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.total}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Approved</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.approved || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.pending || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Rejected/Expired</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{(counts.rejected || 0) + (counts.expired || 0)}</div></CardContent></Card>
      </section>

      <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Search</label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Supplier ID or Category ID" />
        </div>
        <div className="w-full md:w-56">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button onClick={load} variant="outline">{loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}Refresh</Button>
        </div>
      </section>

      <Separator />

      <section className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading qualifications…</div>
        ) : (
          filtered.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No qualifications match your filters.</CardContent></Card>
          ) : (
            filtered.map(q => (
              <Card key={q.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Supplier {q.supplier_id}</CardTitle>
                    {statusBadge(q.status)}
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Category</div>
                    <div className="text-xl font-semibold">{q.category_id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Qualification</div>
                    <Badge variant="secondary" className="text-sm">{q.qualification_level}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Quality Rating</div>
                    <div className="text-xl font-semibold">{q.quality_rating}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Compliance Score</div>
                    <div className="text-xl font-semibold">{q.compliance_score}</div>
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

export default Qualifications;

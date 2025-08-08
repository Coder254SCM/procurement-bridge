import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { frameworkAgreementService, FrameworkAgreement } from "@/services/FrameworkAgreementService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";

const FrameworkAgreements: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agreements, setAgreements] = useState<FrameworkAgreement[]>([]);
  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await frameworkAgreementService.getAgreements();
      setAgreements(res.data || []);
    } catch (e: any) {
      toast({ title: "Failed to load agreements", description: e?.message || "Unknown error", variant: "destructive" });
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
    return agreements.filter(a =>
      (!status || a.status === status) &&
      (!s || a.title.toLowerCase().includes(s) || (a.agreement_number || '').toLowerCase().includes(s))
    );
  }, [agreements, status, search]);

  const counts = useMemo(() => {
    const byStatus: Record<string, number> = { draft: 0, published: 0, active: 0, expired: 0, cancelled: 0 };
    agreements.forEach(a => { byStatus[a.status] = (byStatus[a.status] || 0) + 1; });
    return byStatus;
  }, [agreements]);

  return (
    <div className="container py-6 space-y-6">
      <Helmet>
        <title>Framework Agreements | ProcureChain</title>
        <meta name="description" content="Framework agreements dashboard with statuses and supplier participation." />
        <link rel="canonical" href="/framework-agreements" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Framework Agreements</h1>
        <p className="text-muted-foreground">Manage and monitor framework agreements across categories.</p>
      </header>

      <section className="grid gap-4 grid-cols-1 md:grid-cols-5">
        <Card className="hover-lift"><CardHeader><CardTitle>Draft</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.draft || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Published</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.published || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.active || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Expired</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.expired || 0}</div></CardContent></Card>
        <Card className="hover-lift"><CardHeader><CardTitle>Cancelled</CardTitle></CardHeader><CardContent><div className="text-2xl font-semibold">{counts.cancelled || 0}</div></CardContent></Card>
      </section>

      <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        <div className="flex-1">
          <label className="text-sm text-muted-foreground">Search</label>
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title or agreement number" />
        </div>
        <div className="w-full md:w-56">
          <label className="text-sm text-muted-foreground">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="All" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
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
          <div className="flex items-center justify-center py-12 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading agreements…</div>
        ) : (
          filtered.length === 0 ? (
            <Card><CardContent className="py-10 text-center text-muted-foreground">No agreements found.</CardContent></Card>
          ) : (
            filtered.map(a => (
              <Card key={a.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{a.title}</CardTitle>
                    <Badge variant="secondary" className="capitalize">{a.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Agreement #</div>
                    <div className="text-xl font-semibold">{a.agreement_number || '-'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Buyer</div>
                    <div className="text-xl font-semibold">{a.buyer_organization}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Dates</div>
                    <div className="text-xl font-semibold">{a.start_date} → {a.end_date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Suppliers</div>
                    <div className="text-xl font-semibold">{(a.suppliers || []).length}</div>
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

export default FrameworkAgreements;

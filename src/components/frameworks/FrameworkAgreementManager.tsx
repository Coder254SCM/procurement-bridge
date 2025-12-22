import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { frameworkAgreementService, FrameworkAgreement } from "@/services/FrameworkAgreementService";
import { 
  FileStack, Plus, Users, Calendar, DollarSign, 
  CheckCircle2, Clock, AlertTriangle, Building, Search
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = [
  { id: 'it_equipment', name: 'IT Equipment & Software' },
  { id: 'office_supplies', name: 'Office Supplies' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'consultancy', name: 'Consultancy Services' },
  { id: 'construction', name: 'Construction' },
];

export function FrameworkAgreementManager() {
  const [agreements, setAgreements] = useState<FrameworkAgreement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  // New agreement form
  const [newAgreement, setNewAgreement] = useState({
    title: '',
    description: '',
    buyer_organization: '',
    category_id: '',
    start_date: '',
    end_date: '',
    max_value: 0,
    currency: 'KES'
  });

  useEffect(() => {
    loadAgreements();
  }, []);

  const loadAgreements = async () => {
    setIsLoading(true);
    try {
      const result = await frameworkAgreementService.getAgreements();
      setAgreements(result.data || []);
    } catch (error) {
      console.error('Load agreements error:', error);
      toast.error('Failed to load framework agreements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgreement = async () => {
    if (!newAgreement.title || !newAgreement.buyer_organization || !newAgreement.category_id) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      await frameworkAgreementService.createAgreement({
        title: newAgreement.title,
        description: newAgreement.description,
        buyer_organization: newAgreement.buyer_organization,
        category_id: newAgreement.category_id,
        start_date: newAgreement.start_date,
        end_date: newAgreement.end_date,
        max_value: newAgreement.max_value,
        currency: newAgreement.currency,
        terms_conditions: {},
        evaluation_criteria: [],
        suppliers: [],
        status: 'draft'
      });
      
      toast.success('Framework agreement created');
      setShowCreateDialog(false);
      setNewAgreement({
        title: '', description: '', buyer_organization: '', category_id: '',
        start_date: '', end_date: '', max_value: 0, currency: 'KES'
      });
      loadAgreements();
    } catch (error) {
      console.error('Create agreement error:', error);
      toast.error('Failed to create agreement');
    }
  };

  const handlePublish = async (agreementId: string) => {
    try {
      await frameworkAgreementService.publishAgreement(agreementId);
      toast.success('Agreement published');
      loadAgreements();
    } catch (error) {
      toast.error('Failed to publish agreement');
    }
  };

  const handleActivate = async (agreementId: string) => {
    try {
      await frameworkAgreementService.activateAgreement(agreementId);
      toast.success('Agreement activated');
      loadAgreements();
    } catch (error) {
      toast.error('Failed to activate agreement');
    }
  };

  const filteredAgreements = agreements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.buyer_organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      draft: { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      published: { variant: 'outline', icon: <AlertTriangle className="h-3 w-3" /> },
      active: { variant: 'default', icon: <CheckCircle2 className="h-3 w-3" /> },
      expired: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" /> },
      cancelled: { variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" /> }
    };
    const config = variants[status] || variants.draft;
    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getUtilization = (agreement: FrameworkAgreement) => {
    // This would come from actual spend data
    return Math.floor(Math.random() * 70);
  };

  const stats = {
    total: agreements.length,
    active: agreements.filter(a => a.status === 'active').length,
    expiring: agreements.filter(a => {
      const endDate = new Date(a.end_date);
      const thirtyDays = new Date();
      thirtyDays.setDate(thirtyDays.getDate() + 30);
      return endDate <= thirtyDays && a.status === 'active';
    }).length,
    totalValue: agreements.reduce((sum, a) => sum + (a.max_value || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileStack className="h-6 w-6 text-primary" />
            Framework Agreements
          </h2>
          <p className="text-muted-foreground">Manage long-term procurement agreements with pre-qualified suppliers</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Agreement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Framework Agreement</DialogTitle>
              <DialogDescription>Set up a new long-term procurement agreement</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <Label>Agreement Title *</Label>
                  <Input
                    value={newAgreement.title}
                    onChange={(e) => setNewAgreement({ ...newAgreement, title: e.target.value })}
                    placeholder="e.g., IT Equipment Supply 2024-2026"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newAgreement.description}
                    onChange={(e) => setNewAgreement({ ...newAgreement, description: e.target.value })}
                    placeholder="Describe the scope of this framework agreement..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Buyer Organization *</Label>
                  <Input
                    value={newAgreement.buyer_organization}
                    onChange={(e) => setNewAgreement({ ...newAgreement, buyer_organization: e.target.value })}
                    placeholder="e.g., Ministry of Finance"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select 
                    value={newAgreement.category_id} 
                    onValueChange={(v) => setNewAgreement({ ...newAgreement, category_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input
                    type="date"
                    value={newAgreement.start_date}
                    onChange={(e) => setNewAgreement({ ...newAgreement, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date *</Label>
                  <Input
                    type="date"
                    value={newAgreement.end_date}
                    onChange={(e) => setNewAgreement({ ...newAgreement, end_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Value (KES)</Label>
                  <Input
                    type="number"
                    value={newAgreement.max_value}
                    onChange={(e) => setNewAgreement({ ...newAgreement, max_value: parseFloat(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>
              <Button onClick={handleCreateAgreement} className="w-full">
                Create Agreement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Agreements</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileStack className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-500">{stats.active}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={stats.expiring > 0 ? 'border-amber-500' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-amber-500">{stats.expiring}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">KES {(stats.totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search agreements..."
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Agreements List */}
      <Card>
        <CardHeader>
          <CardTitle>Framework Agreements</CardTitle>
          <CardDescription>
            {filteredAgreements.length} agreement{filteredAgreements.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading agreements...</div>
          ) : filteredAgreements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No framework agreements found. Create your first agreement.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAgreements.map((agreement) => {
                const utilization = getUtilization(agreement);
                const category = CATEGORIES.find(c => c.id === agreement.category_id);
                
                return (
                  <Card key={agreement.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{agreement.title}</h4>
                                {getStatusBadge(agreement.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {agreement.agreement_number || 'Draft'}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Building className="h-4 w-4" />
                                  {agreement.buyer_organization}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {agreement.start_date} - {agreement.end_date}
                                </span>
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Users className="h-4 w-4" />
                                  {agreement.suppliers?.length || 0} suppliers
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Max Value</p>
                            <p className="font-semibold">
                              {agreement.currency} {(agreement.max_value || 0).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="w-24">
                            <p className="text-xs text-muted-foreground mb-1">Utilization</p>
                            <Progress value={utilization} className="h-2" />
                            <p className="text-xs text-right mt-1">{utilization}%</p>
                          </div>

                          <div className="flex gap-2">
                            {agreement.status === 'draft' && (
                              <Button size="sm" onClick={() => handlePublish(agreement.id!)}>
                                Publish
                              </Button>
                            )}
                            {agreement.status === 'published' && (
                              <Button size="sm" onClick={() => handleActivate(agreement.id!)}>
                                Activate
                              </Button>
                            )}
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
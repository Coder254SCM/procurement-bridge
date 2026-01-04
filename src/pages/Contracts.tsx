import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Calendar, DollarSign, User, CheckCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { Contract } from '@/types/database.types';
import { contractService } from '@/services/ContractService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contracts: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);
      const userContracts = await contractService.getUserContracts(user.id);
      setContracts(userContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contracts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContractStatus = async (contractId: string, status: string) => {
    try {
      await contractService.updateContractStatus(contractId, status, user.id);
      await loadContracts();
      
      toast({
        title: 'Contract Updated',
        description: `Contract status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating contract:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contract',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const calculateProgress = (contract: Contract) => {
    if (!contract.milestones) return 0;
    
    const milestones = Object.values(contract.milestones as any);
    const completed = milestones.filter((m: any) => m.status === 'completed').length;
    return milestones.length > 0 ? (completed / milestones.length) * 100 : 0;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  const activeContracts = contracts.filter(c => c.status === 'active');
  const draftContracts = contracts.filter(c => c.status === 'draft');
  const completedContracts = contracts.filter(c => c.status === 'completed');

  if (loading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading contracts...</span>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <Helmet>
        <title>Contract Management | ProcureChain</title>
        <meta name="description" content="Manage procurement contracts and track project milestones." />
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your contracts and track project milestones
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftContracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedContracts.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Contracts</TabsTrigger>
          <TabsTrigger value="draft">Draft Contracts</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeContracts.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No active contracts found
                </div>
              </CardContent>
            </Card>
          ) : (
            activeContracts.map((contract) => (
              <Card key={contract.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getStatusIcon(contract.status)}
                        Contract #{contract.id.slice(0, 8)}
                      </CardTitle>
                      <CardDescription>
                        Value: {formatCurrency(contract.contract_value, contract.contract_currency)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Start: {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        End: {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                  </div>
                  
                  {contract.milestones && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(calculateProgress(contract))}%
                        </span>
                      </div>
                      <Progress value={calculateProgress(contract)} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {contract.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => updateContractStatus(contract.id, 'active')}
                      >
                        Activate Contract
                      </Button>
                    )}
                    {contract.status === 'active' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateContractStatus(contract.id, 'completed')}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {draftContracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      Draft Contract #{contract.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Value: {formatCurrency(contract.contract_value, contract.contract_currency)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => updateContractStatus(contract.id, 'active')}
                  >
                    Activate Contract
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit Contract
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedContracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      Contract #{contract.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Value: {formatCurrency(contract.contract_value, contract.contract_currency)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Completed: {new Date(contract.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {getStatusIcon(contract.status)}
                      Contract #{contract.id.slice(0, 8)}
                    </CardTitle>
                    <CardDescription>
                      Value: {formatCurrency(contract.contract_value, contract.contract_currency)}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useBusiness } from '@/contexts/BusinessContext';
import BusinessService from '@/services/BusinessService';
import TeamManagement from '@/components/team/TeamManagement';
import { Building2, Loader2, Save } from 'lucide-react';

const sizes = ['1-10 employees', '11-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'];

const BusinessSettings: React.FC = () => {
  const { currentBusiness, canManage, createBusiness, refresh, loading, memberships } = useBusiness();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const wantsNew = searchParams.get('new') === '1' || (!loading && memberships.length === 0);

  const [form, setForm] = useState({
    name: '', legal_name: '', registration_number: '', tax_number: '',
    country: '', industry: '', organization_size: '', billing_email: '',
  });
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      setForm({
        name: currentBusiness.name || '',
        legal_name: currentBusiness.legal_name || '',
        registration_number: currentBusiness.registration_number || '',
        tax_number: currentBusiness.tax_number || '',
        country: currentBusiness.country || '',
        industry: currentBusiness.industry || '',
        organization_size: currentBusiness.organization_size || '',
        billing_email: currentBusiness.billing_email || '',
      });
    }
  }, [currentBusiness]);

  const handleSave = async () => {
    if (!currentBusiness) return;
    setSaving(true);
    try {
      await BusinessService.updateBusiness(currentBusiness.id, form);
      await refresh();
      toast({ title: 'Saved', description: 'Business details updated.' });
    } catch (error: any) {
      toast({ title: 'Could not save', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast({ title: 'Name required', description: 'Enter a business name.', variant: 'destructive' });
      return;
    }
    setCreating(true);
    try {
      await createBusiness({ name: newName.trim() });
      setNewName('');
      searchParams.delete('new');
      setSearchParams(searchParams);
      toast({ title: 'Business created', description: 'You are the owner of this business.' });
    } catch (error: any) {
      toast({ title: 'Could not create business', description: error.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Business</h1>
          <p className="text-muted-foreground">Your company details, people and access</p>
        </div>
      </div>

      {wantsNew && (
        <Card>
          <CardHeader>
            <CardTitle>Create a business</CardTitle>
            <CardDescription>Everything you create lives inside a business. You become its owner.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="new-business">Business name</Label>
              <Input id="new-business" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Acme Manufacturing Ltd" />
            </div>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create business
            </Button>
          </CardContent>
        </Card>
      )}

      {currentBusiness && (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="people">People</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentBusiness.name}
                  <Badge variant="secondary">{currentBusiness.status}</Badge>
                </CardTitle>
                <CardDescription>
                  {canManage ? 'Owners and admins can edit these details.' : 'Only owners and admins can edit these details.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Business name</Label>
                  <Input value={form.name} disabled={!canManage} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Registered legal name</Label>
                  <Input value={form.legal_name} disabled={!canManage} onChange={(e) => setForm({ ...form, legal_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Registration number</Label>
                  <Input value={form.registration_number} disabled={!canManage} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tax number</Label>
                  <Input value={form.tax_number} disabled={!canManage} onChange={(e) => setForm({ ...form, tax_number: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.country} disabled={!canManage} onChange={(e) => setForm({ ...form, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={form.industry} disabled={!canManage} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Organization size</Label>
                  <Select value={form.organization_size || undefined} disabled={!canManage} onValueChange={(v) => setForm({ ...form, organization_size: v })}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                      {sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Billing email</Label>
                  <Input type="email" value={form.billing_email} disabled={!canManage} onChange={(e) => setForm({ ...form, billing_email: e.target.value })} />
                </div>
                {canManage && (
                  <div className="md:col-span-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="people" className="mt-6">
            <TeamManagement />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default BusinessSettings;

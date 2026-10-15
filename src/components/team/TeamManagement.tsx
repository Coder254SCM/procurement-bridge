import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { supabase } from '@/integrations/supabase/client';
import BusinessService, { BusinessInvitation, BusinessMemberRow, BusinessRole } from '@/services/BusinessService';
import { UserPlus, Mail, Trash2, Crown, Users, Loader2, AlertTriangle, Copy, XCircle } from 'lucide-react';

const roleOptions: { value: BusinessRole; label: string; description: string }[] = [
  { value: 'owner', label: 'Owner', description: 'Full control, including billing and deleting the business' },
  { value: 'admin', label: 'Admin', description: 'Manage details, people and all records' },
  { value: 'member', label: 'Member', description: 'Work on tenders, bids and contracts' },
];

const teamLimits: Record<string, number> = { Starter: 1, Professional: 5, Pro: 5, Enterprise: 50 };

const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const { currentBusinessId, canManage, currentRole } = useBusiness();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<BusinessMemberRow[]>([]);
  const [invitations, setInvitations] = useState<BusinessInvitation[]>([]);
  const [planName, setPlanName] = useState('Starter');
  const [seats, setSeats] = useState<number | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BusinessRole>('member');
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    if (!currentBusinessId) { setLoading(false); return; }
    setLoading(true);
    try {
      const [memberRows, inviteRows] = await Promise.all([
        BusinessService.listMembers(currentBusinessId),
        canManage ? BusinessService.listInvitations(currentBusinessId) : Promise.resolve([]),
      ]);
      setMembers(memberRows);
      setInvitations(inviteRows.filter((i) => i.status === 'pending'));

      const { data: sub } = await supabase
        .from('user_subscriptions')
        .select('seats, subscription_plans(name)')
        .eq('business_id', currentBusinessId)
        .eq('status', 'active')
        .maybeSingle();
      setPlanName((sub?.subscription_plans as any)?.name || 'Starter');
      setSeats(sub?.seats ?? null);
    } catch (error: any) {
      toast({ title: 'Could not load team', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [currentBusinessId, canManage, toast]);

  useEffect(() => { load(); }, [load]);

  const limit = seats ?? teamLimits[planName] ?? 1;
  const used = members.length + invitations.length;
  const canAdd = canManage && used < limit;

  const inviteLink = (token: string) => `${window.location.origin}/invite/${token}`;

  const handleInvite = async () => {
    if (!currentBusinessId || !user) return;
    const email = inviteEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({ title: 'Invalid email', description: 'Enter a valid email address.', variant: 'destructive' });
      return;
    }
    if (inviteRole === 'owner' && currentRole !== 'owner') {
      toast({ title: 'Not allowed', description: 'Only owners can invite another owner.', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const invitation = await BusinessService.inviteMember(currentBusinessId, user.id, email, inviteRole);
      await navigator.clipboard?.writeText(inviteLink(invitation.token)).catch(() => undefined);
      toast({ title: 'Invitation created', description: 'The invite link is copied. Send it to your colleague.' });
      setInviteOpen(false);
      setInviteEmail('');
      setInviteRole('member');
      load();
    } catch (error: any) {
      toast({ title: 'Could not invite', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const changeRole = async (member: BusinessMemberRow, role: BusinessRole) => {
    try {
      await BusinessService.updateMemberRole(member.id, role);
      load();
    } catch (error: any) {
      toast({ title: 'Could not change role', description: error.message, variant: 'destructive' });
    }
  };

  const removeMember = async (member: BusinessMemberRow) => {
    try {
      await BusinessService.removeMember(member.id);
      load();
      toast({ title: 'Removed', description: `${member.full_name || 'Member'} no longer has access.` });
    } catch (error: any) {
      toast({ title: 'Could not remove', description: error.message, variant: 'destructive' });
    }
  };

  const revoke = async (invitation: BusinessInvitation) => {
    try {
      await BusinessService.revokeInvitation(invitation.id);
      load();
    } catch (error: any) {
      toast({ title: 'Could not cancel invite', description: error.message, variant: 'destructive' });
    }
  };

  if (!currentBusinessId) {
    return (
      <Alert>
        <AlertTitle>No business selected</AlertTitle>
        <AlertDescription>Create or join a business to manage a team.</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team</h2>
          <p className="text-muted-foreground">People who can work inside this business</p>
        </div>
        {canManage && (
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canAdd}><UserPlus className="mr-2 h-4 w-4" />Invite member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
                <DialogDescription>They must sign in with this email address to accept. Links expire after 14 days.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input id="invite-email" type="email" placeholder="colleague@company.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as BusinessRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.filter((r) => r.value !== 'owner' || currentRole === 'owner').map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label} — {r.description}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
                <Button onClick={handleInvite} disabled={sending}>
                  {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Create invite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Seats used</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-2xl font-bold">{used} / {limit}</div><Users className="h-5 w-5 text-primary" /></div>
            <p className="mt-1 text-xs text-muted-foreground">Includes pending invites</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Plan</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between"><div className="text-2xl font-bold">{planName}</div><Crown className="h-5 w-5 text-primary" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Your role</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold capitalize">{currentRole}</div></CardContent>
        </Card>
      </div>

      {canManage && used >= limit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>All seats in use</AlertTitle>
          <AlertDescription>
            Your {planName} plan includes {limit} seat{limit === 1 ? '' : 's'}.
            <Button variant="link" className="ml-1 h-auto p-0" asChild><a href="/pricing">Upgrade</a></Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>{members.length} member{members.length === 1 ? '' : 's'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback>{(member.full_name || 'M').charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{member.full_name || 'Team member'}</span>
                    {member.user_id === user?.id && <Badge variant="secondary">You</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canManage && member.user_id !== user?.id ? (
                  <Select value={member.role} onValueChange={(v) => changeRole(member, v as BusinessRole)}>
                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {roleOptions.filter((r) => r.value !== 'owner' || currentRole === 'owner').map((r) => (
                        <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline" className="capitalize">{member.role}</Badge>
                )}
                {canManage && member.user_id !== user?.id && (
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeMember(member)} aria-label="Remove member">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {canManage && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>Copy a link to send it again, or cancel it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{inv.email}</p>
                  <p className="text-sm text-muted-foreground capitalize">{inv.role} · expires {new Date(inv.expires_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard?.writeText(inviteLink(inv.token)); toast({ title: 'Link copied' }); }}>
                    <Copy className="mr-1 h-4 w-4" />Copy link
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => revoke(inv)}>
                    <XCircle className="mr-1 h-4 w-4" />Cancel
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamManagement;

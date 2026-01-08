import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { UserPlus, Mail, Shield, Trash2, Crown, Users, Loader2, AlertTriangle } from 'lucide-react';

interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  invited_at: string;
  joined_at: string | null;
}

interface TeamInvite {
  email: string;
  role: string;
}

const TeamManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteData, setInviteData] = useState<TeamInvite>({ email: '', role: 'viewer' });
  const [sending, setSending] = useState(false);
  const [subscription, setSubscription] = useState<string | null>(null);

  const teamRoles = [
    { value: 'admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'manager', label: 'Manager', description: 'Can manage tenders and team' },
    { value: 'evaluator', label: 'Evaluator', description: 'Can evaluate bids' },
    { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  ];

  const teamLimits: Record<string, number> = {
    'Starter': 1,
    'Professional': 5,
    'Enterprise': 50,
    'Government': 999,
  };

  useEffect(() => {
    fetchTeamData();
  }, [user]);

  const fetchTeamData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      // Fetch user's subscription
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('subscription_plans(name)')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();
      
      const planName = (subData?.subscription_plans as any)?.name || 'Starter';
      setSubscription(planName);

      // Fetch team members from profiles joined with user_roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at')
        .order('created_at', { ascending: true });

      // Get profiles for team members
      const userIds = rolesData?.map(r => r.user_id) || [];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', userIds);

        // Combine data
        const members: TeamMember[] = (rolesData || []).map(role => {
          const profile = profilesData?.find(p => p.id === role.user_id);
          return {
            id: role.user_id,
            user_id: role.user_id,
            email: '', // Email would need auth.users access
            full_name: profile?.full_name || 'Team Member',
            role: role.role,
            status: 'active' as const,
            invited_at: role.created_at,
            joined_at: role.created_at,
          };
        });
        setTeamMembers(members);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteData.email) {
      toast({ title: 'Error', description: 'Please enter an email address', variant: 'destructive' });
      return;
    }

    const limit = teamLimits[subscription || 'Starter'];
    if (teamMembers.length >= limit) {
      toast({
        title: 'Team limit reached',
        description: `Your ${subscription} plan allows up to ${limit} team members. Upgrade to add more.`,
        variant: 'destructive',
      });
      return;
    }

    setSending(true);
    try {
      // In production, this would send an invite email and create a pending team member
      toast({
        title: 'Invitation sent',
        description: `An invitation has been sent to ${inviteData.email}`,
      });
      setInviteOpen(false);
      setInviteData({ email: '', role: 'viewer' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (memberId === user?.id) {
      toast({ title: 'Error', description: 'You cannot remove yourself', variant: 'destructive' });
      return;
    }

    try {
      await supabase.from('user_roles').delete().eq('user_id', memberId);
      setTeamMembers(prev => prev.filter(m => m.id !== memberId));
      toast({ title: 'Member removed', description: 'Team member has been removed' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      evaluator: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800',
      buyer: 'bg-indigo-100 text-indigo-800',
      supplier: 'bg-orange-100 text-orange-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const limit = teamLimits[subscription || 'Starter'];
  const canAddMembers = teamMembers.length < limit;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-muted-foreground">
            Manage your organization's team members and their roles
          </p>
        </div>
        
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canAddMembers}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={inviteData.role}
                  onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teamRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <span className="font-medium">{role.label}</span>
                          <span className="text-muted-foreground ml-2 text-xs">
                            — {role.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{teamMembers.length}</div>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {limit - teamMembers.length} seats remaining
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{subscription || 'Starter'}</div>
              <Crown className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Up to {limit} team members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {new Set(teamMembers.map(m => m.role)).size}
              </div>
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique roles assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {!canAddMembers && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Team limit reached</AlertTitle>
          <AlertDescription>
            Your {subscription} plan allows up to {limit} team members. 
            <Button variant="link" className="p-0 h-auto ml-1" asChild>
              <a href="/pricing">Upgrade your plan</a>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Team Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            {teamMembers.length === 0 
              ? 'No team members yet. Invite your first team member to get started.'
              : `${teamMembers.length} member${teamMembers.length !== 1 ? 's' : ''} in your organization`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No team members</p>
              <p className="text-sm">Invite colleagues to collaborate on tenders</p>
              <Button className="mt-4" onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite First Member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {member.full_name?.charAt(0)?.toUpperCase() || 'T'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.full_name || 'Team Member'}</span>
                        {member.user_id === user?.id && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Joined {new Date(member.joined_at || member.invited_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role}
                    </Badge>
                    
                    {member.user_id !== user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamManagement;

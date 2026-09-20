import { supabase } from '@/integrations/supabase/client';

export type BusinessRole = 'owner' | 'admin' | 'member';

export interface Business {
  id: string;
  name: string;
  legal_name: string | null;
  registration_number: string | null;
  tax_number: string | null;
  country: string | null;
  industry: string | null;
  organization_size: string | null;
  logo_url: string | null;
  billing_email: string | null;
  plan_id: string | null;
  status: string;
  created_at: string;
}

export interface BusinessMembership {
  id: string;
  business_id: string;
  role: BusinessRole;
  joined_at: string;
  business: Business | null;
}

export interface BusinessMemberRow {
  id: string;
  user_id: string;
  role: BusinessRole;
  joined_at: string;
  full_name: string | null;
}

export interface BusinessInvitation {
  id: string;
  business_id: string;
  email: string;
  role: BusinessRole;
  status: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export const BusinessService = {
  async listMyMemberships(userId: string): Promise<BusinessMembership[]> {
    const { data, error } = await supabase
      .from('business_members')
      .select('id, business_id, role, joined_at, businesses(*)')
      .eq('user_id', userId)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    return (data || []).map((row: any) => ({
      id: row.id,
      business_id: row.business_id,
      role: row.role,
      joined_at: row.joined_at,
      business: row.businesses ?? null,
    }));
  },

  async createBusiness(
    userId: string,
    input: Partial<Business> & { name: string }
  ): Promise<Business> {
    const { data, error } = await supabase
      .from('businesses')
      .insert({ ...input, created_by: userId })
      .select()
      .single();

    if (error) throw error;

    const { error: memberError } = await supabase
      .from('business_members')
      .insert({ business_id: data.id, user_id: userId, role: 'owner' });

    if (memberError) throw memberError;

    return data as Business;
  },

  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<void> {
    const { error } = await supabase.from('businesses').update(updates).eq('id', businessId);
    if (error) throw error;
  },

  async listMembers(businessId: string): Promise<BusinessMemberRow[]> {
    const { data, error } = await supabase
      .from('business_members')
      .select('id, user_id, role, joined_at')
      .eq('business_id', businessId)
      .order('joined_at', { ascending: true });

    if (error) throw error;

    const ids = (data || []).map((m) => m.user_id);
    let names: Record<string, string | null> = {};
    if (ids.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', ids);
      names = Object.fromEntries((profiles || []).map((p) => [p.id, p.full_name]));
    }

    return (data || []).map((m) => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role as BusinessRole,
      joined_at: m.joined_at,
      full_name: names[m.user_id] ?? null,
    }));
  },

  async updateMemberRole(memberId: string, role: BusinessRole): Promise<void> {
    const { error } = await supabase.from('business_members').update({ role }).eq('id', memberId);
    if (error) throw error;
  },

  async removeMember(memberId: string): Promise<void> {
    const { error } = await supabase.from('business_members').delete().eq('id', memberId);
    if (error) throw error;
  },

  async listInvitations(businessId: string): Promise<BusinessInvitation[]> {
    const { data, error } = await supabase
      .from('business_invitations')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as BusinessInvitation[];
  },

  async inviteMember(
    businessId: string,
    invitedBy: string,
    email: string,
    role: BusinessRole
  ): Promise<BusinessInvitation> {
    const { data, error } = await supabase
      .from('business_invitations')
      .insert({ business_id: businessId, email: email.trim().toLowerCase(), role, invited_by: invitedBy })
      .select()
      .single();

    if (error) throw error;
    return data as BusinessInvitation;
  },

  async revokeInvitation(invitationId: string): Promise<void> {
    const { error } = await supabase
      .from('business_invitations')
      .update({ status: 'revoked' })
      .eq('id', invitationId);
    if (error) throw error;
  },

  async getInvitationByToken(token: string): Promise<BusinessInvitation | null> {
    const { data, error } = await supabase
      .from('business_invitations')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error) throw error;
    return (data as BusinessInvitation) ?? null;
  },

  async acceptInvitation(token: string, userId: string): Promise<string> {
    const invitation = await this.getInvitationByToken(token);
    if (!invitation) throw new Error('This invitation link is not valid for your account.');
    if (invitation.status !== 'pending') throw new Error('This invitation has already been used.');
    if (new Date(invitation.expires_at) < new Date()) throw new Error('This invitation has expired.');

    const { error: memberError } = await supabase
      .from('business_members')
      .insert({ business_id: invitation.business_id, user_id: userId, role: invitation.role });

    if (memberError && !memberError.message.includes('duplicate')) throw memberError;

    const { error } = await supabase
      .from('business_invitations')
      .update({ status: 'accepted', accepted_at: new Date().toISOString(), accepted_by: userId })
      .eq('id', invitation.id);

    if (error) throw error;
    return invitation.business_id;
  },
};

export default BusinessService;

import { supabase } from '@/integrations/supabase/client';
import { notificationService } from './NotificationService';

export interface TenderChange {
  field: string;
  original_value: any;
  new_value: any;
  reason: string;
}

export interface CreateAddendumData {
  tender_id: string;
  title: string;
  description: string;
  changes: TenderChange[];
  extends_deadline: boolean;
  new_deadline?: string;
  requires_acknowledgment: boolean;
}

export interface Addendum {
  id: string;
  tender_id: string;
  addendum_number: number;
  title: string;
  description: string;
  changes_summary: TenderChange[];
  original_values: Record<string, any>;
  new_values: Record<string, any>;
  extends_deadline: boolean;
  new_deadline?: string;
  issued_by: string;
  issued_at: string;
  requires_acknowledgment: boolean;
}

export class AddendumService {
  private static instance: AddendumService;

  public static getInstance(): AddendumService {
    if (!AddendumService.instance) {
      AddendumService.instance = new AddendumService();
    }
    return AddendumService.instance;
  }

  async createAddendum(data: CreateAddendumData): Promise<{ addendum?: Addendum; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current addendum count for this tender
      const { count } = await supabase
        .from('tender_addendums')
        .select('*', { count: 'exact', head: true })
        .eq('tender_id', data.tender_id);

      const addendumNumber = (count || 0) + 1;

      // Extract original and new values
      const originalValues: Record<string, any> = {};
      const newValues: Record<string, any> = {};
      
      for (const change of data.changes) {
        originalValues[change.field] = change.original_value;
        newValues[change.field] = change.new_value;
      }

      // Create the addendum
      const { data: addendum, error } = await supabase
        .from('tender_addendums')
        .insert({
          tender_id: data.tender_id,
          addendum_number: addendumNumber,
          title: data.title,
          description: data.description,
          changes_summary: data.changes as any,
          original_values: originalValues,
          new_values: newValues,
          extends_deadline: data.extends_deadline,
          new_deadline: data.new_deadline,
          issued_by: user.id,
          requires_acknowledgment: data.requires_acknowledgment
        } as any)
        .select()
        .single();

      if (error) throw error;

      // Apply changes to tender
      if (Object.keys(newValues).length > 0) {
        await this.applyChangesToTender(data.tender_id, newValues);
      }

      // Notify all interested suppliers
      await this.notifySuppliers(data.tender_id, addendum);

      return { addendum: this.mapAddendum(addendum) };
    } catch (error: any) {
      console.error('Create addendum error:', error);
      return { error: error.message };
    }
  }

  private async applyChangesToTender(tenderId: string, changes: Record<string, any>): Promise<void> {
    try {
      // Only apply safe fields
      const safeFields = ['submission_deadline', 'budget_amount', 'description', 'evaluation_criteria'];
      const safeChanges: Record<string, any> = {};
      
      for (const [key, value] of Object.entries(changes)) {
        if (safeFields.includes(key)) {
          safeChanges[key] = value;
        }
      }

      if (Object.keys(safeChanges).length > 0) {
        const { error } = await supabase
          .from('tenders')
          .update({ ...safeChanges, updated_at: new Date().toISOString() })
          .eq('id', tenderId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Apply changes to tender error:', error);
      throw error;
    }
  }

  private async notifySuppliers(tenderId: string, addendum: any): Promise<void> {
    try {
      // Get all suppliers who have interacted with this tender (viewed, bid, or saved)
      const { data: bids } = await supabase
        .from('bids')
        .select('supplier_id')
        .eq('tender_id', tenderId);

      const supplierIds = [...new Set((bids || []).map(b => b.supplier_id))];

      // Create notifications for all suppliers
      for (const supplierId of supplierIds) {
        await notificationService.createNotification({
          user_id: supplierId,
          title: `Addendum #${addendum.addendum_number} Issued`,
          message: `A new addendum "${addendum.title}" has been issued for a tender you're interested in. ${addendum.extends_deadline ? 'The deadline has been extended.' : ''}`,
          type: 'addendum',
          entity_type: 'tender',
          entity_id: tenderId
        });
      }
    } catch (error) {
      console.error('Notify suppliers error:', error);
    }
  }

  async acknowledgeAddendum(addendumId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('addendum_acknowledgments')
        .insert({
          addendum_id: addendumId,
          supplier_id: user.id
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Acknowledge addendum error:', error);
      return { success: false, error: error.message };
    }
  }

  async getAddendums(tenderId: string): Promise<Addendum[]> {
    try {
      const { data, error } = await supabase
        .from('tender_addendums')
        .select('*')
        .eq('tender_id', tenderId)
        .order('addendum_number', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapAddendum);
    } catch (error) {
      console.error('Get addendums error:', error);
      return [];
    }
  }

  async getUnacknowledgedAddendums(tenderId: string): Promise<Addendum[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: addendums } = await supabase
        .from('tender_addendums')
        .select('*, addendum_acknowledgments!left(*)')
        .eq('tender_id', tenderId)
        .eq('requires_acknowledgment', true);

      // Filter to only addendums not acknowledged by current user
      const unacknowledged = (addendums || []).filter(a => {
        const acks = (a as any).addendum_acknowledgments || [];
        return !acks.some((ack: any) => ack.supplier_id === user.id);
      });

      return unacknowledged.map(this.mapAddendum);
    } catch (error) {
      console.error('Get unacknowledged addendums error:', error);
      return [];
    }
  }

  async getAcknowledgmentStatus(addendumId: string): Promise<{ total: number; acknowledged: number; suppliers: { id: string; acknowledged: boolean }[] }> {
    try {
      const { data: addendum } = await supabase
        .from('tender_addendums')
        .select('tender_id')
        .eq('id', addendumId)
        .single();

      if (!addendum) return { total: 0, acknowledged: 0, suppliers: [] };

      // Get all bidders for this tender
      const { data: bids } = await supabase
        .from('bids')
        .select('supplier_id')
        .eq('tender_id', addendum.tender_id);

      const supplierIds = [...new Set((bids || []).map(b => b.supplier_id))];

      // Get acknowledgments
      const { data: acks } = await supabase
        .from('addendum_acknowledgments')
        .select('supplier_id')
        .eq('addendum_id', addendumId);

      const acknowledgedIds = new Set((acks || []).map(a => a.supplier_id));

      return {
        total: supplierIds.length,
        acknowledged: acknowledgedIds.size,
        suppliers: supplierIds.map(id => ({
          id,
          acknowledged: acknowledgedIds.has(id)
        }))
      };
    } catch (error) {
      console.error('Get acknowledgment status error:', error);
      return { total: 0, acknowledged: 0, suppliers: [] };
    }
  }

  private mapAddendum(data: any): Addendum {
    return {
      id: data.id,
      tender_id: data.tender_id,
      addendum_number: data.addendum_number,
      title: data.title,
      description: data.description,
      changes_summary: data.changes_summary || [],
      original_values: data.original_values || {},
      new_values: data.new_values || {},
      extends_deadline: data.extends_deadline,
      new_deadline: data.new_deadline,
      issued_by: data.issued_by,
      issued_at: data.issued_at,
      requires_acknowledgment: data.requires_acknowledgment
    };
  }
}

export const addendumService = AddendumService.getInstance();


import { supabase } from '@/integrations/supabase/client';
import { Contract } from '@/types/database.types';
import { notificationService } from '../NotificationService';

export class ContractUpdater {
  static async updateContractStatus(
    contractId: string,
    status: string,
    userId: string
  ): Promise<Contract> {
    try {
      const { data: contract, error } = await supabase
        .from('contracts')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId)
        .select()
        .single();

      if (error) throw error;

      // Type conversion for JSONB fields
      const typedContract: Contract = {
        ...contract,
        terms_conditions: contract.terms_conditions as Record<string, any> | null,
        milestones: contract.milestones as Record<string, any> | null,
        documents: contract.documents as Record<string, any> | null
      };

      // Notify the other party
      const otherParty = contract.buyer_id === userId ? contract.supplier_id : contract.buyer_id;
      
      await notificationService.createNotification({
        user_id: otherParty,
        title: 'Contract Status Updated',
        message: `Contract status has been updated to: ${status}`,
        type: 'contract',
        entity_type: 'contract',
        entity_id: contractId
      });

      return typedContract;
    } catch (error) {
      console.error('Update contract status error:', error);
      throw error;
    }
  }

  static async updateMilestone(
    contractId: string,
    milestoneId: string,
    status: string
  ): Promise<void> {
    try {
      // Get current contract to update milestones
      const { data: contract, error: fetchError } = await supabase
        .from('contracts')
        .select('milestones, buyer_id, supplier_id')
        .eq('id', contractId)
        .single();

      if (fetchError) throw fetchError;

      const milestones = contract.milestones as any;
      if (milestones && milestones[milestoneId]) {
        milestones[milestoneId].status = status;
        milestones[milestoneId].updated_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('contracts')
        .update({ 
          milestones,
          updated_at: new Date().toISOString()
        })
        .eq('id', contractId);

      if (error) throw error;

      // Notify both parties
      await notificationService.createNotification({
        user_id: contract.buyer_id,
        title: 'Milestone Updated',
        message: `Contract milestone has been updated to: ${status}`,
        type: 'milestone',
        entity_type: 'contract',
        entity_id: contractId
      });

      await notificationService.createNotification({
        user_id: contract.supplier_id,
        title: 'Milestone Updated',
        message: `Contract milestone has been updated to: ${status}`,
        type: 'milestone',
        entity_type: 'contract',
        entity_id: contractId
      });
    } catch (error) {
      console.error('Update milestone error:', error);
      throw error;
    }
  }
}

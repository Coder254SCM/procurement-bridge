
import { supabase } from '@/integrations/supabase/client';
import { Contract } from '@/types/database.types';
import { notificationService } from './NotificationService';

export interface CreateContractData {
  tender_id: string;
  winning_bid_id: string;
  buyer_id: string;
  supplier_id: string;
  contract_value: number;
  contract_currency?: string;
  start_date?: string;
  end_date?: string;
  terms_conditions?: Record<string, any>;
  milestones?: Record<string, any>;
}

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  percentage: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  amount?: number;
}

export class ContractService {
  private static instance: ContractService;

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  async createContract(data: CreateContractData): Promise<Contract> {
    try {
      const { data: contract, error } = await supabase
        .from('contracts')
        .insert({
          tender_id: data.tender_id,
          winning_bid_id: data.winning_bid_id,
          buyer_id: data.buyer_id,
          supplier_id: data.supplier_id,
          contract_value: data.contract_value,
          contract_currency: data.contract_currency || 'KES',
          start_date: data.start_date,
          end_date: data.end_date,
          terms_conditions: data.terms_conditions,
          milestones: data.milestones,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      // Notify both parties
      await notificationService.createNotification({
        user_id: data.buyer_id,
        title: 'Contract Created',
        message: 'A new contract has been created and is ready for review.',
        type: 'contract',
        entity_type: 'contract',
        entity_id: contract.id
      });

      await notificationService.createNotification({
        user_id: data.supplier_id,
        title: 'Contract Award',
        message: 'Congratulations! You have been awarded a contract.',
        type: 'contract',
        entity_type: 'contract',
        entity_id: contract.id
      });

      return contract;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  }

  async updateContractStatus(
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

      return contract;
    } catch (error) {
      console.error('Update contract status error:', error);
      throw error;
    }
  }

  async getUserContracts(userId: string): Promise<Contract[]> {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select(`
          *,
          tenders(title, category),
          bids(bid_amount)
        `)
        .or(`buyer_id.eq.${userId},supplier_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get user contracts error:', error);
      throw error;
    }
  }

  async updateMilestone(
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

export const contractService = ContractService.getInstance();

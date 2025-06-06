
import { supabase } from '@/integrations/supabase/client';
import { Contract } from '@/types/database.types';
import { notificationService } from '../NotificationService';

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

export class ContractCreator {
  static async createContract(data: CreateContractData): Promise<Contract> {
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

      // Type conversion for JSONB fields
      const typedContract: Contract = {
        ...contract,
        terms_conditions: contract.terms_conditions as Record<string, any> | null,
        milestones: contract.milestones as Record<string, any> | null,
        documents: contract.documents as Record<string, any> | null
      };

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

      return typedContract;
    } catch (error) {
      console.error('Create contract error:', error);
      throw error;
    }
  }
}

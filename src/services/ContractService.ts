import { ContractCreator, CreateContractData } from './contracts/ContractCreator';
import { ContractUpdater } from './contracts/ContractUpdater';
import { ContractRetriever } from './contracts/ContractRetriever';
import { Contract } from '@/types/database.types';

export interface ContractMilestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  percentage: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  amount?: number;
}

export type { CreateContractData };

export class ContractService {
  private static instance: ContractService;

  public static getInstance(): ContractService {
    if (!ContractService.instance) {
      ContractService.instance = new ContractService();
    }
    return ContractService.instance;
  }

  async createContract(data: CreateContractData): Promise<Contract> {
    return ContractCreator.createContract(data);
  }

  async updateContractStatus(
    contractId: string,
    status: string,
    userId: string
  ): Promise<Contract> {
    return ContractUpdater.updateContractStatus(contractId, status, userId);
  }

  async getUserContracts(userId: string): Promise<Contract[]> {
    return ContractRetriever.getUserContracts(userId);
  }

  async updateMilestone(
    contractId: string,
    milestoneId: string,
    status: string
  ): Promise<void> {
    return ContractUpdater.updateMilestone(contractId, milestoneId, status);
  }
}

export const contractService = ContractService.getInstance();

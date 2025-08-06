import { supabase } from '@/integrations/supabase/client';

export interface ContractMilestone {
  id?: string;
  contract_id: string;
  milestone_name: string;
  description?: string;
  due_date: string;
  deliverables: any[];
  payment_percentage?: number;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  completion_date?: string;
  verification_documents: any[];
}

export interface PerformanceEvaluation {
  id?: string;
  contract_id: string;
  evaluator_id: string;
  evaluation_period_start: string;
  evaluation_period_end: string;
  quality_score: number;
  timeliness_score: number;
  compliance_score: number;
  overall_score: number;
  comments?: string;
  recommendations?: string;
}

export class ContractPerformanceService {
  async createMilestone(data: Omit<ContractMilestone, 'id'>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'create_milestone', data, contractId: data.contract_id }
    });

    if (error) throw error;
    return result;
  }

  async getMilestones(contractId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'get_milestones', contractId }
    });

    if (error) throw error;
    return result;
  }

  async updateMilestoneStatus(milestoneId: string, status: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'update_milestone_status', milestoneId, data: { status } }
    });

    if (error) throw error;
    return result;
  }

  async createEvaluation(data: Omit<PerformanceEvaluation, 'id'>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'create_evaluation', data, contractId: data.contract_id }
    });

    if (error) throw error;
    return result;
  }

  async getEvaluations(contractId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'get_evaluations', contractId }
    });

    if (error) throw error;
    return result;
  }

  async getPerformanceSummary(contractId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'contract_performance_summary', contractId }
    });

    if (error) throw error;
    return result;
  }

  async checkOverdueMilestones(): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'check_overdue_milestones' }
    });

    if (error) throw error;
    return result;
  }

  async getMilestoneProgressReport(contractId: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('contract-performance-management', {
      body: { action: 'milestone_progress_report', contractId }
    });

    if (error) throw error;
    return result;
  }

  async completeMilestone(milestoneId: string, verificationDocuments?: any[]): Promise<any> {
    const updateData: any = { status: 'completed' };
    if (verificationDocuments) {
      updateData.verification_documents = verificationDocuments;
    }

    return this.updateMilestoneStatus(milestoneId, 'completed');
  }

  async getUpcomingMilestones(contractId: string, daysAhead: number = 30): Promise<ContractMilestone[]> {
    const milestones = await this.getMilestones(contractId);
    if (!milestones.data) return [];

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return milestones.data.filter(milestone => 
      milestone.status === 'pending' && 
      new Date(milestone.due_date) <= cutoffDate
    );
  }

  async calculateContractHealth(contractId: string): Promise<{ score: number; status: string }> {
    const summary = await this.getPerformanceSummary(contractId);
    if (!summary.data) return { score: 0, status: 'unknown' };

    const { completionRate, onTimeRate, averageScores } = summary.data;
    
    const healthScore = (
      (completionRate * 0.3) +
      (onTimeRate * 0.3) +
      (averageScores.overall * 0.4)
    );

    let status = 'poor';
    if (healthScore >= 80) status = 'excellent';
    else if (healthScore >= 60) status = 'good';
    else if (healthScore >= 40) status = 'fair';

    return { score: Math.round(healthScore), status };
  }
}

export const contractPerformanceService = new ContractPerformanceService();
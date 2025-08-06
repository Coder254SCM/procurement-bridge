import { supabase } from '@/integrations/supabase/client';

export interface BudgetAllocation {
  id?: string;
  budget_code: string;
  budget_name: string;
  financial_year: string;
  department: string;
  category_id?: string;
  total_allocation: number;
  committed_amount: number;
  spent_amount: number;
  available_amount: number;
  currency: string;
  status: 'active' | 'frozen' | 'cancelled';
}

export interface BudgetCheck {
  isAvailable: boolean;
  availableAmount: number;
  requestedAmount: number;
  budgetUtilization: {
    total: number;
    committed: number;
    spent: number;
    available: number;
  };
}

export class BudgetService {
  async createBudget(data: Omit<BudgetAllocation, 'id' | 'available_amount'>): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'create_budget', data }
    });

    if (error) throw error;
    return result;
  }

  async getBudgets(filters?: { department?: string; financialYear?: string; budgetCode?: string }): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'get_budgets', ...filters }
    });

    if (error) throw error;
    return result;
  }

  async checkBudgetAvailability(budgetCode: string, requestedAmount: number): Promise<BudgetCheck> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { 
        action: 'check_availability', 
        data: { budget_code: budgetCode, requested_amount: requestedAmount }
      }
    });

    if (error) throw error;
    return result.data;
  }

  async commitBudget(budgetCode: string, amount: number): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'commit_budget', data: { budget_code: budgetCode, amount } }
    });

    if (error) throw error;
    return result;
  }

  async releaseBudget(budgetCode: string, amount: number): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'release_budget', data: { budget_code: budgetCode, amount } }
    });

    if (error) throw error;
    return result;
  }

  async spendBudget(budgetCode: string, amount: number): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'spend_budget', data: { budget_code: budgetCode, amount } }
    });

    if (error) throw error;
    return result;
  }

  async getBudgetReport(financialYear?: string): Promise<any> {
    const { data: result, error } = await supabase.functions.invoke('budget-management', {
      body: { action: 'budget_report', data: { financial_year: financialYear } }
    });

    if (error) throw error;
    return result;
  }

  async getBudgetsByDepartment(department: string): Promise<BudgetAllocation[]> {
    const result = await this.getBudgets({ department });
    return result.data || [];
  }

  async getBudgetsByFinancialYear(financialYear: string): Promise<BudgetAllocation[]> {
    const result = await this.getBudgets({ financialYear });
    return result.data || [];
  }

  async validateBudgetForRequisition(budgetCode: string, amount: number): Promise<boolean> {
    const check = await this.checkBudgetAvailability(budgetCode, amount);
    return check.isAvailable;
  }

  async getBudgetUtilization(budgetCode: string): Promise<number> {
    const check = await this.checkBudgetAvailability(budgetCode, 0);
    const utilization = check.budgetUtilization;
    return (utilization.spent / utilization.total) * 100;
  }
}

export const budgetService = new BudgetService();
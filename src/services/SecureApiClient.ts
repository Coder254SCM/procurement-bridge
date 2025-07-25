import { supabase } from '@/integrations/supabase/client';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  requiresSubscription?: boolean;
  trialAvailable?: boolean;
  trialUsed?: boolean;
  message?: string;
}

export class SecureApiClient {
  private static instance: SecureApiClient;

  public static getInstance(): SecureApiClient {
    if (!SecureApiClient.instance) {
      SecureApiClient.instance = new SecureApiClient();
    }
    return SecureApiClient.instance;
  }

  async makeSecureRequest<T>(
    functionName: string,
    body: any
  ): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        throw new Error(error.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      console.error(`Secure API error (${functionName}):`, error);
      return {
        error: error.message || 'An unexpected error occurred'
      };
    }
  }

  // Tender API methods
  async createTender(data: any, trialMode = false): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-tender-api', {
      action: 'create',
      data,
      trialMode
    });
  }

  async updateTender(tenderId: string, data: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-tender-api', {
      action: 'update',
      tenderId,
      data
    });
  }

  async getTender(tenderId: string): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-tender-api', {
      action: 'get',
      tenderId
    });
  }

  async listTenders(filters?: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-tender-api', {
      action: 'list',
      filters
    });
  }

  // Bid API methods
  async createBid(tenderId: string, data: any, trialMode = false): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-bid-api', {
      action: 'create',
      tenderId,
      data,
      trialMode
    });
  }

  async updateBid(bidId: string, data: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-bid-api', {
      action: 'update',
      bidId,
      data
    });
  }

  async getBid(bidId: string): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-bid-api', {
      action: 'get',
      bidId
    });
  }

  async listBids(filters?: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-bid-api', {
      action: 'list',
      filters
    });
  }

  // Evaluation API methods
  async createEvaluation(bidId: string, data: any, trialMode = false): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-evaluation-api', {
      action: 'create',
      bidId,
      data,
      trialMode
    });
  }

  async updateEvaluation(evaluationId: string, data: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-evaluation-api', {
      action: 'update',
      evaluationId,
      data
    });
  }

  async getEvaluation(evaluationId: string): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-evaluation-api', {
      action: 'get',
      evaluationId
    });
  }

  async listEvaluations(filters?: any): Promise<ApiResponse> {
    return this.makeSecureRequest('secure-evaluation-api', {
      action: 'list',
      filters
    });
  }

  // Trial management
  async checkTrialEligibility(): Promise<ApiResponse> {
    return this.makeSecureRequest('trial-status', {
      action: 'check-eligibility'
    });
  }

  async getSubscriptionStatus(): Promise<ApiResponse> {
    return this.makeSecureRequest('trial-status', {
      action: 'subscription-status'
    });
  }
}

export const secureApiClient = SecureApiClient.getInstance();
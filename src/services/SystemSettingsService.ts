import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description?: string;
  is_public: boolean;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export class SystemSettingsService {
  private static instance: SystemSettingsService;
  private cache: Map<string, any> = new Map();

  public static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService();
    }
    return SystemSettingsService.instance;
  }

  async getSetting(key: string, useCache: boolean = true): Promise<any> {
    // Check cache first
    if (useCache && this.cache.has(key)) {
      return this.cache.get(key);
    }

    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value, setting_type')
      .eq('setting_key', key)
      .single();

    if (error) {
      console.warn(`Setting '${key}' not found:`, error);
      return null;
    }

    let value = data.setting_value;

    // Parse based on type
    switch (data.setting_type) {
      case 'number':
        value = Number(value);
        break;
      case 'boolean':
        value = Boolean(value);
        break;
      case 'object':
      case 'array':
        // JSONB values are already parsed
        break;
      default:
        value = String(value);
    }

    // Cache the value
    this.cache.set(key, value);
    return value;
  }

  async getPublicSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_key, setting_value, setting_type')
      .eq('is_public', true);

    if (error) {
      return {};
    }

    const settings: Record<string, any> = {};
    for (const setting of data) {
      let value = setting.setting_value;
      
      switch (setting.setting_type) {
        case 'number':
          value = Number(value);
          break;
        case 'boolean':
          value = Boolean(value);
          break;
      }
      
      settings[setting.setting_key] = value;
    }

    return settings;
  }

  async updateSetting(key: string, value: any, type?: SystemSetting['setting_type']) {
    const { data: user } = await supabase.auth.getUser();
    
    const updateData: any = {
      setting_value: value,
      updated_at: new Date().toISOString()
    };

    if (user.user) {
      updateData.updated_by = user.user.id;
    }

    if (type) {
      updateData.setting_type = type;
    }

    const { data, error } = await supabase
      .from('system_settings')
      .update(updateData)
      .eq('setting_key', key)
      .select()
      .single();

    if (!error) {
      // Update cache
      this.cache.set(key, value);
    }

    return { data, error };
  }

  async createSetting(
    key: string, 
    value: any, 
    type: SystemSetting['setting_type'],
    description?: string,
    isPublic: boolean = false
  ) {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('system_settings')
      .insert([{
        setting_key: key,
        setting_value: value,
        setting_type: type,
        description,
        is_public: isPublic,
        updated_by: user.user?.id
      }])
      .select()
      .single();

    if (!error) {
      // Update cache
      this.cache.set(key, value);
    }

    return { data, error };
  }

  async getAllSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');

    return { data, error };
  }

  // Predefined getters for common settings
  async getProcurementMethods(): Promise<string[]> {
    const methods = await this.getSetting('procurement_methods');
    return methods || [
      'open_tender',
      'restricted_tender',
      'direct_procurement',
      'request_for_proposal',
      'request_for_quotation',
      'framework_agreement'
    ];
  }

  async getCurrencySettings(): Promise<{ default: string; supported: string[] }> {
    const settings = await this.getSetting('currency_settings');
    return settings || { default: 'KES', supported: ['KES', 'USD', 'EUR', 'GBP'] };
  }

  async getTenderValidityDays(): Promise<number> {
    const days = await this.getSetting('tender_validity_days');
    return days || 90;
  }

  async getEvaluationWeights(): Promise<{ technical: number; financial: number }> {
    const weights = await this.getSetting('evaluation_weights');
    return weights || { technical: 0.7, financial: 0.3 };
  }

  async isStorageFallbackEnabled(): Promise<boolean> {
    const enabled = await this.getSetting('storage_fallback_enabled');
    return enabled || false;
  }

  // System configuration management
  async initializeDefaultSettings() {
    const defaultSettings = [
      {
        key: 'max_tender_duration_days',
        value: 180,
        type: 'number' as const,
        description: 'Maximum tender duration in days',
        isPublic: true
      },
      {
        key: 'min_tender_duration_days',
        value: 7,
        type: 'number' as const,
        description: 'Minimum tender duration in days',
        isPublic: true
      },
      {
        key: 'auto_extend_auctions',
        value: true,
        type: 'boolean' as const,
        description: 'Automatically extend auctions when bids are placed near closing time',
        isPublic: false
      },
      {
        key: 'auction_extension_minutes',
        value: 5,
        type: 'number' as const,
        description: 'Minutes to extend auction when late bids are placed',
        isPublic: false
      },
      {
        key: 'notification_settings',
        value: {
          email_enabled: true,
          sms_enabled: false,
          push_enabled: true,
          digest_frequency: 'daily'
        },
        type: 'object' as const,
        description: 'Global notification preferences',
        isPublic: false
      },
      {
        key: 'document_retention_days',
        value: 2555, // 7 years
        type: 'number' as const,
        description: 'Document retention period in days',
        isPublic: false
      },
      {
        key: 'supported_file_types',
        value: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'png', 'txt'],
        type: 'array' as const,
        description: 'Supported file types for uploads',
        isPublic: true
      },
      {
        key: 'max_file_size_mb',
        value: 50,
        type: 'number' as const,
        description: 'Maximum file size in MB',
        isPublic: true
      }
    ];

    const results = [];
    for (const setting of defaultSettings) {
      // Check if setting already exists
      const existing = await this.getSetting(setting.key, false);
      if (existing === null) {
        const result = await this.createSetting(
          setting.key,
          setting.value,
          setting.type,
          setting.description,
          setting.isPublic
        );
        results.push(result);
      }
    }

    return results;
  }

  // Clear cache when needed
  clearCache() {
    this.cache.clear();
  }

  // Refresh specific setting in cache
  async refreshSetting(key: string) {
    this.cache.delete(key);
    return await this.getSetting(key, false);
  }
}

export const systemSettingsService = SystemSettingsService.getInstance();
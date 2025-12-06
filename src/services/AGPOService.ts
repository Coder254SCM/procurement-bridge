import { supabase } from '@/integrations/supabase/client';

export interface AGPOCategory {
  id: string;
  category_code: string;
  category_name: string;
  description: string;
  preference_percentage: number;
  reservation_limit: number;
  is_active: boolean;
}

export interface SupplierAGPORegistration {
  id: string;
  supplier_id: string;
  agpo_category_id: string;
  certificate_number: string;
  certificate_expiry: string;
  certificate_document_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'expired';
  verified_by?: string;
  verified_at?: string;
  rejection_reason?: string;
}

export interface TenderAGPOSettings {
  id: string;
  tender_id: string;
  agpo_reserved: boolean;
  reserved_categories: string[];
  reservation_percentage: number;
  exclusive_agpo: boolean;
}

/**
 * Service for Kenya AGPO (Access to Government Procurement Opportunities)
 * Per PPRA 2015 - 30% reservation for Youth, Women, PWDs
 */
class AGPOService {
  // Get all active AGPO categories
  async getCategories(): Promise<AGPOCategory[]> {
    const { data, error } = await supabase
      .from('agpo_categories')
      .select('*')
      .eq('is_active', true)
      .order('category_name') as any;
    
    if (error) throw error;
    return data || [];
  }

  // Register supplier for AGPO category
  async registerSupplier(registration: Omit<SupplierAGPORegistration, 'id' | 'verification_status'>): Promise<SupplierAGPORegistration> {
    // Validate certificate expiry is in the future
    const expiryDate = new Date(registration.certificate_expiry);
    if (expiryDate <= new Date()) {
      throw new Error('AGPO certificate has expired. Please provide a valid certificate.');
    }

    const { data, error } = await supabase
      .from('supplier_agpo_registration')
      .insert({
        supplier_id: registration.supplier_id,
        agpo_category_id: registration.agpo_category_id,
        certificate_number: registration.certificate_number,
        certificate_expiry: registration.certificate_expiry,
        certificate_document_url: registration.certificate_document_url,
        verification_status: 'pending'
      })
      .select()
      .single() as any;
    
    if (error) throw error;
    return data;
  }

  // Get supplier's AGPO registrations
  async getSupplierRegistrations(supplierId: string): Promise<SupplierAGPORegistration[]> {
    const { data, error } = await supabase
      .from('supplier_agpo_registration')
      .select(`
        *,
        agpo_categories (
          category_code,
          category_name,
          preference_percentage
        )
      `)
      .eq('supplier_id', supplierId) as any;
    
    if (error) throw error;
    return data || [];
  }

  // Verify if supplier is AGPO eligible for a tender
  async checkSupplierEligibility(supplierId: string, tenderId: string): Promise<{
    eligible: boolean;
    categories: string[];
    preferenceApplied: number;
  }> {
    // Get tender AGPO settings
    const { data: tenderSettings, error: settingsError } = await supabase
      .from('tender_agpo_settings')
      .select('*')
      .eq('tender_id', tenderId)
      .single() as any;
    
    if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
    
    if (!tenderSettings?.agpo_reserved) {
      return { eligible: true, categories: [], preferenceApplied: 0 };
    }

    // Get supplier's verified AGPO registrations
    const { data: registrations, error: regError } = await supabase
      .from('supplier_agpo_registration')
      .select('*, agpo_categories(*)')
      .eq('supplier_id', supplierId)
      .eq('verification_status', 'verified')
      .gte('certificate_expiry', new Date().toISOString()) as any;
    
    if (regError) throw regError;
    
    const verifiedCategories = registrations?.map((r: any) => r.agpo_categories.category_code) || [];
    const matchingCategories = verifiedCategories.filter((cat: string) => 
      tenderSettings.reserved_categories.includes(cat)
    );

    if (tenderSettings.exclusive_agpo && matchingCategories.length === 0) {
      return { eligible: false, categories: [], preferenceApplied: 0 };
    }

    return {
      eligible: true,
      categories: matchingCategories,
      preferenceApplied: matchingCategories.length > 0 ? tenderSettings.reservation_percentage : 0
    };
  }

  // Set tender AGPO settings (for buyers)
  async setTenderAGPOSettings(settings: Omit<TenderAGPOSettings, 'id'>): Promise<TenderAGPOSettings> {
    const { data, error } = await supabase
      .from('tender_agpo_settings')
      .upsert({
        tender_id: settings.tender_id,
        agpo_reserved: settings.agpo_reserved,
        reserved_categories: settings.reserved_categories,
        reservation_percentage: settings.reservation_percentage,
        exclusive_agpo: settings.exclusive_agpo
      }, { onConflict: 'tender_id' })
      .select()
      .single() as any;
    
    if (error) throw error;
    return data;
  }

  // Calculate AGPO preference in bid evaluation
  calculateAGPOPreference(bidAmount: number, preferencePercentage: number): number {
    // Per PPRA regulations, AGPO bidders get margin of preference
    // E.g., 30% preference means their bid is treated as if it's 30% lower for comparison
    return bidAmount * (1 - preferencePercentage / 100);
  }

  // Verify AGPO registration (admin only)
  async verifyRegistration(
    registrationId: string, 
    verified: boolean, 
    verifierId: string,
    rejectionReason?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('supplier_agpo_registration')
      .update({
        verification_status: verified ? 'verified' : 'rejected',
        verified_by: verifierId,
        verified_at: new Date().toISOString(),
        rejection_reason: verified ? null : rejectionReason
      })
      .eq('id', registrationId) as any;
    
    if (error) throw error;
  }
}

export const agpoService = new AGPOService();

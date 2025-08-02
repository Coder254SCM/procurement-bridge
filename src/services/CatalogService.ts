import { supabase } from '@/integrations/supabase/client';

export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  code: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  category_id: string;
  sku: string;
  unit_of_measure: string;
  base_price?: number;
  currency: string;
  specifications: Record<string, any>;
  images: string[];
  supplier_id?: string;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
  product_categories?: ProductCategory;
  profiles?: { full_name: string };
}

export class CatalogService {
  private static instance: CatalogService;

  public static getInstance(): CatalogService {
    if (!CatalogService.instance) {
      CatalogService.instance = new CatalogService();
    }
    return CatalogService.instance;
  }

  async createCategory(categoryData: Partial<ProductCategory>) {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'create_category',
        data: categoryData
      }
    });

    return { data, error };
  }

  async getCategories() {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'list_categories'
      }
    });

    return { data, error };
  }

  async createCatalogItem(itemData: Partial<CatalogItem>) {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'create_catalog_item',
        data: itemData
      }
    });

    return { data, error };
  }

  async getCatalogItems(filters?: {
    category_id?: string;
    supplier_id?: string;
    limit?: number;
    offset?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'list_catalog_items',
        data: filters
      }
    });

    return { data, error };
  }

  async updateCatalogItem(id: string, updateData: Partial<CatalogItem>) {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'update_catalog_item',
        data: { id, ...updateData }
      }
    });

    return { data, error };
  }

  async searchCatalog(searchTerm: string, filters?: {
    category_id?: string;
    price_min?: number;
    price_max?: number;
  }) {
    const { data, error } = await supabase.functions.invoke('catalog-management', {
      body: {
        action: 'search_catalog',
        data: {
          search_term: searchTerm,
          filters
        }
      }
    });

    return { data, error };
  }

  async getCatalogItemById(id: string) {
    const { data, error } = await supabase
      .from('catalog_items')
      .select(`
        *,
        product_categories(name, code),
        profiles(full_name)
      `)
      .eq('id', id)
      .single();

    return { data, error };
  }
}

export const catalogService = CatalogService.getInstance();
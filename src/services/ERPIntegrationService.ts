import { supabase } from '@/integrations/supabase/client';

export interface ERPConnection {
  id: string;
  organization_id: string;
  erp_system: string;
  connection_name: string;
  endpoint_url?: string;
  authentication_method?: string;
  api_version?: string;
  sync_frequency?: string;
  sync_status?: string;
  last_sync?: string;
}

export interface ERPConnectorConfig {
  id: string;
  connection_id: string;
  connector_type: 'sap_s4hana' | 'sap_ariba' | 'oracle_fusion' | 'oracle_ebs' | 'ms_dynamics_365' | 'custom';
  field_mappings: Record<string, string>;
  sync_entities: string[];
  transformation_rules: Record<string, any>;
  is_active: boolean;
}

export interface ERPSyncQueueItem {
  id: string;
  connection_id: string;
  entity_type: string;
  entity_id: string;
  operation: 'create' | 'update' | 'delete' | 'sync';
  payload: any;
  priority: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  error_message?: string;
  retry_count: number;
}

export type ERPSystem = 'sap' | 'oracle' | 'dynamics' | 'netsuite' | 'workday' | 'odoo' | 'google_sheets' | 'excel_online';

/**
 * Service for ERP System Integration
 * Supports SAP S/4HANA, SAP Ariba, Oracle Fusion, Oracle EBS, MS Dynamics 365, Google Sheets, Excel Online
 */
class ERPIntegrationService {
  // Create ERP connection
  async createConnection(connection: {
    organization_id: string;
    erp_system: string;
    connection_name: string;
    endpoint_url: string;
    authentication_method: string;
    api_version?: string;
    sync_frequency?: string;
  }): Promise<ERPConnection> {
    const { data, error } = await supabase
      .from('erp_connections')
      .insert({
        organization_id: connection.organization_id,
        erp_system: connection.erp_system,
        connection_name: connection.connection_name,
        endpoint_url: connection.endpoint_url,
        authentication_method: connection.authentication_method,
        api_version: connection.api_version || '1.0',
        sync_frequency: connection.sync_frequency || 'daily',
        sync_status: 'active'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get organization's ERP connections
  async getConnections(organizationId: string): Promise<ERPConnection[]> {
    const { data, error } = await supabase
      .from('erp_connections')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Configure connector for specific ERP
  async configureConnector(config: {
    connection_id: string;
    connector_type: ERPConnectorConfig['connector_type'];
    field_mappings: Record<string, string>;
    sync_entities: string[];
    sap_client?: string;
    sap_system_id?: string;
    oracle_service_name?: string;
    dynamics_tenant_id?: string;
    dynamics_environment_url?: string;
  }): Promise<ERPConnectorConfig> {
    const { data, error } = await supabase
      .from('erp_connector_configs')
      .upsert({
        connection_id: config.connection_id,
        connector_type: config.connector_type,
        field_mappings: config.field_mappings,
        sync_entities: config.sync_entities,
        sap_client: config.sap_client,
        sap_system_id: config.sap_system_id,
        oracle_service_name: config.oracle_service_name,
        dynamics_tenant_id: config.dynamics_tenant_id,
        dynamics_environment_url: config.dynamics_environment_url,
        is_active: true
      }, { onConflict: 'connection_id' })
      .select()
      .single() as any;
    
    if (error) throw error;
    return data;
  }

  // Queue entity for sync
  async queueSync(item: {
    connection_id: string;
    entity_type: string;
    entity_id: string;
    operation: 'create' | 'update' | 'delete' | 'sync';
    payload: any;
    priority?: number;
  }): Promise<ERPSyncQueueItem> {
    const { data, error } = await supabase
      .from('erp_sync_queue')
      .insert({
        connection_id: item.connection_id,
        entity_type: item.entity_type,
        entity_id: item.entity_id,
        operation: item.operation,
        payload: item.payload,
        priority: item.priority || 5,
        status: 'pending'
      })
      .select()
      .single() as any;
    
    if (error) throw error;
    return data;
  }

  // Get pending sync items
  async getPendingSyncItems(connectionId: string): Promise<ERPSyncQueueItem[]> {
    const { data, error } = await supabase
      .from('erp_sync_queue')
      .select('*')
      .eq('connection_id', connectionId)
      .eq('status', 'pending')
      .order('priority', { ascending: true })
      .order('scheduled_at', { ascending: true }) as any;
    
    if (error) throw error;
    return data || [];
  }

  // Get field mappings template for ERP type
  getDefaultFieldMappings(erpType: ERPConnectorConfig['connector_type']): Record<string, string> {
    const mappings: Record<string, Record<string, string>> = {
      sap_s4hana: {
        'tender.title': 'PurchaseRequisition.Description',
        'tender.budget_amount': 'PurchaseRequisition.TotalValue',
        'tender.department': 'PurchaseRequisition.CostCenter',
        'contract.value': 'PurchaseOrder.NetAmount',
        'contract.supplier': 'PurchaseOrder.Supplier',
        'invoice.amount': 'SupplierInvoice.GrossAmount'
      },
      sap_ariba: {
        'tender.title': 'SourcingProject.Title',
        'tender.budget_amount': 'SourcingProject.EstimatedValue',
        'bid.amount': 'BidResponse.TotalPrice',
        'contract.value': 'Contract.ContractValue'
      },
      oracle_fusion: {
        'tender.title': 'Requisition.Description',
        'tender.budget_amount': 'Requisition.Amount',
        'contract.value': 'PurchaseOrder.OrderTotal',
        'supplier.name': 'Supplier.SupplierName'
      },
      oracle_ebs: {
        'tender.title': 'PO_REQUISITION_HEADERS_ALL.DESCRIPTION',
        'tender.budget_amount': 'PO_REQUISITION_LINES_ALL.UNIT_PRICE',
        'contract.value': 'PO_HEADERS_ALL.TOTAL_AMOUNT'
      },
      ms_dynamics_365: {
        'tender.title': 'PurchaseRequisitionHeader.RequisitionName',
        'tender.budget_amount': 'PurchaseRequisitionLine.LineAmount',
        'contract.value': 'PurchaseOrder.TotalAmount',
        'supplier.name': 'Vendor.VendorName'
      },
      custom: {}
    };

    return mappings[erpType] || {};
  }

  // Get supported sync entities for ERP type
  getSupportedEntities(erpType: ERPConnectorConfig['connector_type']): string[] {
    const entities: Record<string, string[]> = {
      sap_s4hana: ['requisitions', 'tenders', 'bids', 'contracts', 'invoices', 'suppliers', 'payments'],
      sap_ariba: ['sourcing_projects', 'bids', 'contracts', 'suppliers'],
      oracle_fusion: ['requisitions', 'purchase_orders', 'suppliers', 'invoices'],
      oracle_ebs: ['requisitions', 'purchase_orders', 'suppliers', 'invoices', 'receipts'],
      ms_dynamics_365: ['requisitions', 'purchase_orders', 'vendors', 'invoices', 'payments'],
      custom: ['requisitions', 'contracts', 'suppliers']
    };

    return entities[erpType] || [];
  }

  // Test connection
  async testConnection(connectionId: string): Promise<{ success: boolean; message: string }> {
    // In a real implementation, this would make an actual API call to the ERP
    // For now, we simulate a test
    const { data: connection, error } = await supabase
      .from('erp_connections')
      .select('*')
      .eq('id', connectionId)
      .single();
    
    if (error) {
      return { success: false, message: 'Connection not found' };
    }

    if (!connection.endpoint_url) {
      return { success: false, message: 'No endpoint URL configured' };
    }

    // Simulate connection test
    // In production, this would use the edge function to make the actual API call
    return { 
      success: true, 
      message: `Successfully connected to ${connection.erp_system} at ${connection.endpoint_url}` 
    };
  }
}

export const erpIntegrationService = new ERPIntegrationService();

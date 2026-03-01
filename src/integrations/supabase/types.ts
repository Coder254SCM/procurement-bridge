export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      addendum_acknowledgments: {
        Row: {
          acknowledged_at: string | null
          addendum_id: string
          id: string
          ip_address: unknown
          supplier_id: string
        }
        Insert: {
          acknowledged_at?: string | null
          addendum_id: string
          id?: string
          ip_address?: unknown
          supplier_id: string
        }
        Update: {
          acknowledged_at?: string | null
          addendum_id?: string
          id?: string
          ip_address?: unknown
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "addendum_acknowledgments_addendum_id_fkey"
            columns: ["addendum_id"]
            isOneToOne: false
            referencedRelation: "tender_addendums"
            referencedColumns: ["id"]
          },
        ]
      }
      agpo_categories: {
        Row: {
          category_code: string
          category_name: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          preference_percentage: number
          reservation_limit: number | null
        }
        Insert: {
          category_code: string
          category_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          preference_percentage?: number
          reservation_limit?: number | null
        }
        Update: {
          category_code?: string
          category_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          preference_percentage?: number
          reservation_limit?: number | null
        }
        Relationships: []
      }
      api_access_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          ip_address: unknown
          method: string
          request_data: Json | null
          response_status: number | null
          response_time_ms: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          method: string
          request_data?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: unknown
          method?: string
          request_data?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      appeal_timeline: {
        Row: {
          appeal_id: string
          documents: Json | null
          event_by: string | null
          event_date: string | null
          event_description: string
          event_type: string
          id: string
          is_public: boolean | null
        }
        Insert: {
          appeal_id: string
          documents?: Json | null
          event_by?: string | null
          event_date?: string | null
          event_description: string
          event_type: string
          id?: string
          is_public?: boolean | null
        }
        Update: {
          appeal_id?: string
          documents?: Json | null
          event_by?: string | null
          event_date?: string | null
          event_description?: string
          event_type?: string
          id?: string
          is_public?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "appeal_timeline_appeal_id_fkey"
            columns: ["appeal_id"]
            isOneToOne: false
            referencedRelation: "procurement_appeals"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_instances: {
        Row: {
          approver_actions: Json | null
          completed_at: string | null
          created_at: string | null
          current_step: number | null
          entity_id: string
          entity_type: string
          id: string
          started_at: string | null
          status: string | null
          workflow_id: string
        }
        Insert: {
          approver_actions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          entity_id: string
          entity_type: string
          id?: string
          started_at?: string | null
          status?: string | null
          workflow_id: string
        }
        Update: {
          approver_actions?: Json | null
          completed_at?: string | null
          created_at?: string | null
          current_step?: number | null
          entity_id?: string
          entity_type?: string
          id?: string
          started_at?: string | null
          status?: string | null
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_instances_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflows: {
        Row: {
          active: boolean | null
          conditions: Json
          created_at: string | null
          description: string | null
          entity_type: string
          id: string
          name: string
          steps: Json
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          conditions: Json
          created_at?: string | null
          description?: string | null
          entity_type: string
          id?: string
          name: string
          steps: Json
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          conditions?: Json
          created_at?: string | null
          description?: string | null
          entity_type?: string
          id?: string
          name?: string
          steps?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      auction_bids: {
        Row: {
          auction_id: string
          bid_amount: number
          bid_time: string | null
          bidder_id: string
          created_at: string | null
          id: string
          is_automatic: boolean | null
          rank_at_time: number | null
        }
        Insert: {
          auction_id: string
          bid_amount: number
          bid_time?: string | null
          bidder_id: string
          created_at?: string | null
          id?: string
          is_automatic?: boolean | null
          rank_at_time?: number | null
        }
        Update: {
          auction_id?: string
          bid_amount?: number
          bid_time?: string | null
          bidder_id?: string
          created_at?: string | null
          id?: string
          is_automatic?: boolean | null
          rank_at_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "reverse_auctions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          compliance_flags: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          compliance_flags?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          compliance_flags?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      behavior_analysis: {
        Row: {
          analysis_data: Json | null
          analysis_type: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          risk_score: number
          updated_at: string
        }
        Insert: {
          analysis_data?: Json | null
          analysis_type: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          risk_score?: number
          updated_at?: string
        }
        Update: {
          analysis_data?: Json | null
          analysis_type?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          risk_score?: number
          updated_at?: string
        }
        Relationships: []
      }
      bids: {
        Row: {
          bid_amount: number
          blockchain_hash: string | null
          created_at: string | null
          documents: Json | null
          id: string
          status: string | null
          supplier_id: string
          technical_details: Json | null
          tender_id: string
          updated_at: string | null
          uploaded_documents: Json | null
        }
        Insert: {
          bid_amount: number
          blockchain_hash?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          status?: string | null
          supplier_id: string
          technical_details?: Json | null
          tender_id: string
          updated_at?: string | null
          uploaded_documents?: Json | null
        }
        Update: {
          bid_amount?: number
          blockchain_hash?: string | null
          created_at?: string | null
          documents?: Json | null
          id?: string
          status?: string | null
          supplier_id?: string
          technical_details?: Json | null
          tender_id?: string
          updated_at?: string | null
          uploaded_documents?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_transactions: {
        Row: {
          created_at: string
          entity_id: string
          hash: string
          id: string
          metadata: Json | null
          status: string
          timestamp: string
          transaction_type: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          hash: string
          id?: string
          metadata?: Json | null
          status: string
          timestamp?: string
          transaction_type: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          hash?: string
          id?: string
          metadata?: Json | null
          status?: string
          timestamp?: string
          transaction_type?: string
        }
        Relationships: []
      }
      budget_allocations: {
        Row: {
          available_amount: number | null
          budget_code: string
          budget_name: string
          category_id: string | null
          committed_amount: number | null
          created_at: string | null
          currency: string | null
          department: string
          financial_year: string
          id: string
          spent_amount: number | null
          status: string | null
          total_allocation: number
          updated_at: string | null
        }
        Insert: {
          available_amount?: number | null
          budget_code: string
          budget_name: string
          category_id?: string | null
          committed_amount?: number | null
          created_at?: string | null
          currency?: string | null
          department: string
          financial_year: string
          id?: string
          spent_amount?: number | null
          status?: string | null
          total_allocation: number
          updated_at?: string | null
        }
        Update: {
          available_amount?: number | null
          budget_code?: string
          budget_name?: string
          category_id?: string | null
          committed_amount?: number | null
          created_at?: string | null
          currency?: string | null
          department?: string
          financial_year?: string
          id?: string
          spent_amount?: number | null
          status?: string | null
          total_allocation?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_allocations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      capability_matches: {
        Row: {
          created_at: string | null
          id: string
          invitation_sent: boolean | null
          invitation_sent_at: string | null
          match_reasons: Json
          match_score: number
          supplier_id: string
          tender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          match_reasons?: Json
          match_score: number
          supplier_id: string
          tender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invitation_sent?: boolean | null
          invitation_sent_at?: string | null
          match_reasons?: Json
          match_score?: number
          supplier_id?: string
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "capability_matches_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      catalog_items: {
        Row: {
          base_price: number | null
          category_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: Json | null
          name: string
          sku: string
          specifications: Json | null
          status: string | null
          supplier_id: string | null
          unit_of_measure: string
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          category_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          name: string
          sku: string
          specifications?: Json | null
          status?: string | null
          supplier_id?: string | null
          unit_of_measure: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          category_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          name?: string
          sku?: string
          specifications?: Json | null
          status?: string | null
          supplier_id?: string | null
          unit_of_measure?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_checks: {
        Row: {
          check_date: string
          check_type: string
          created_at: string
          id: string
          next_check_date: string | null
          result_data: Json | null
          status: Database["public"]["Enums"]["verification_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          check_date?: string
          check_type: string
          created_at?: string
          id?: string
          next_check_date?: string | null
          result_data?: Json | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          check_date?: string
          check_type?: string
          created_at?: string
          id?: string
          next_check_date?: string | null
          result_data?: Json | null
          status?: Database["public"]["Enums"]["verification_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          penalties: Json | null
          requirements: Json
          type: string
          updated_at: string | null
          validation_rules: Json
          version: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          penalties?: Json | null
          requirements: Json
          type: string
          updated_at?: string | null
          validation_rules: Json
          version: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          penalties?: Json | null
          requirements?: Json
          type?: string
          updated_at?: string | null
          validation_rules?: Json
          version?: string
        }
        Relationships: []
      }
      consortium_members: {
        Row: {
          accepted_at: string | null
          accepted_terms: boolean | null
          consortium_id: string
          created_at: string | null
          document_verification_status: string | null
          documents_submitted: Json | null
          financial_capacity: number | null
          id: string
          member_role: string
          member_user_id: string
          percentage_share: number
          responsibilities: Json | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_terms?: boolean | null
          consortium_id: string
          created_at?: string | null
          document_verification_status?: string | null
          documents_submitted?: Json | null
          financial_capacity?: number | null
          id?: string
          member_role?: string
          member_user_id: string
          percentage_share: number
          responsibilities?: Json | null
        }
        Update: {
          accepted_at?: string | null
          accepted_terms?: boolean | null
          consortium_id?: string
          created_at?: string | null
          document_verification_status?: string | null
          documents_submitted?: Json | null
          financial_capacity?: number | null
          id?: string
          member_role?: string
          member_user_id?: string
          percentage_share?: number
          responsibilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "consortium_members_consortium_id_fkey"
            columns: ["consortium_id"]
            isOneToOne: false
            referencedRelation: "consortium_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      consortium_registrations: {
        Row: {
          combined_turnover: number | null
          consortium_name: string
          created_at: string | null
          id: string
          joint_liability_accepted: boolean | null
          lead_partner_id: string
          registration_date: string | null
          status: string | null
          tender_id: string
          total_members: number | null
          updated_at: string | null
        }
        Insert: {
          combined_turnover?: number | null
          consortium_name: string
          created_at?: string | null
          id?: string
          joint_liability_accepted?: boolean | null
          lead_partner_id: string
          registration_date?: string | null
          status?: string | null
          tender_id: string
          total_members?: number | null
          updated_at?: string | null
        }
        Update: {
          combined_turnover?: number | null
          consortium_name?: string
          created_at?: string | null
          id?: string
          joint_liability_accepted?: boolean | null
          lead_partner_id?: string
          registration_date?: string | null
          status?: string | null
          tender_id?: string
          total_members?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consortium_registrations_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_milestones: {
        Row: {
          completion_date: string | null
          contract_id: string
          created_at: string | null
          deliverables: Json | null
          description: string | null
          due_date: string
          id: string
          milestone_name: string
          payment_method: string | null
          payment_percentage: number | null
          payment_received_date: string | null
          payment_reference: string | null
          status: string | null
          updated_at: string | null
          verification_documents: Json | null
        }
        Insert: {
          completion_date?: string | null
          contract_id: string
          created_at?: string | null
          deliverables?: Json | null
          description?: string | null
          due_date: string
          id?: string
          milestone_name: string
          payment_method?: string | null
          payment_percentage?: number | null
          payment_received_date?: string | null
          payment_reference?: string | null
          status?: string | null
          updated_at?: string | null
          verification_documents?: Json | null
        }
        Update: {
          completion_date?: string | null
          contract_id?: string
          created_at?: string | null
          deliverables?: Json | null
          description?: string | null
          due_date?: string
          id?: string
          milestone_name?: string
          payment_method?: string | null
          payment_percentage?: number | null
          payment_received_date?: string | null
          payment_reference?: string | null
          status?: string | null
          updated_at?: string | null
          verification_documents?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_milestones_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          blockchain_hash: string | null
          buyer_id: string
          contract_currency: string | null
          contract_value: number
          created_at: string | null
          documents: Json | null
          end_date: string | null
          id: string
          milestones: Json | null
          start_date: string | null
          status: string | null
          supplier_id: string
          tender_id: string
          terms_conditions: Json | null
          updated_at: string | null
          winning_bid_id: string
        }
        Insert: {
          blockchain_hash?: string | null
          buyer_id: string
          contract_currency?: string | null
          contract_value: number
          created_at?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          start_date?: string | null
          status?: string | null
          supplier_id: string
          tender_id: string
          terms_conditions?: Json | null
          updated_at?: string | null
          winning_bid_id: string
        }
        Update: {
          blockchain_hash?: string | null
          buyer_id?: string
          contract_currency?: string | null
          contract_value?: number
          created_at?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          milestones?: Json | null
          start_date?: string | null
          status?: string | null
          supplier_id?: string
          tender_id?: string
          terms_conditions?: Json | null
          updated_at?: string | null
          winning_bid_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_winning_bid_id_fkey"
            columns: ["winning_bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      data_access_logs: {
        Row: {
          access_type: string
          created_at: string | null
          data_accessed: string
          endpoint: string
          id: string
          ip_address: unknown
          query_parameters: Json | null
          record_count: number | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          access_type: string
          created_at?: string | null
          data_accessed: string
          endpoint: string
          id?: string
          ip_address?: unknown
          query_parameters?: Json | null
          record_count?: number | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          access_type?: string
          created_at?: string | null
          data_accessed?: string
          endpoint?: string
          id?: string
          ip_address?: unknown
          query_parameters?: Json | null
          record_count?: number | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_retention_schedule: {
        Row: {
          created_at: string | null
          data_category: string
          id: string
          is_active: boolean | null
          last_purge_run: string | null
          legal_basis: string
          next_purge_scheduled: string | null
          purge_method: string | null
          retention_years: number
          table_name: string
        }
        Insert: {
          created_at?: string | null
          data_category: string
          id?: string
          is_active?: boolean | null
          last_purge_run?: string | null
          legal_basis: string
          next_purge_scheduled?: string | null
          purge_method?: string | null
          retention_years?: number
          table_name: string
        }
        Update: {
          created_at?: string | null
          data_category?: string
          id?: string
          is_active?: boolean | null
          last_purge_run?: string | null
          legal_basis?: string
          next_purge_scheduled?: string | null
          purge_method?: string | null
          retention_years?: number
          table_name?: string
        }
        Relationships: []
      }
      digital_identity_verification: {
        Row: {
          blockchain_hash: string | null
          business_id: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
          verification_data: Json | null
          verification_date: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          blockchain_hash?: string | null
          business_id: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          verification_data?: Json | null
          verification_date?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          blockchain_hash?: string | null
          business_id?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          verification_data?: Json | null
          verification_date?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      dispute_resolution: {
        Row: {
          amount_disputed: number | null
          contract_id: string
          created_at: string | null
          description: string
          dispute_date: string
          dispute_type: string
          id: string
          mediator_id: string | null
          outcome: string | null
          raised_against: string
          raised_by: string
          resolution_date: string | null
          resolution_details: string | null
          resolution_method: string | null
          status: string
          supporting_documents: Json | null
          tender_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_disputed?: number | null
          contract_id: string
          created_at?: string | null
          description: string
          dispute_date?: string
          dispute_type: string
          id?: string
          mediator_id?: string | null
          outcome?: string | null
          raised_against: string
          raised_by: string
          resolution_date?: string | null
          resolution_details?: string | null
          resolution_method?: string | null
          status?: string
          supporting_documents?: Json | null
          tender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_disputed?: number | null
          contract_id?: string
          created_at?: string | null
          description?: string
          dispute_date?: string
          dispute_type?: string
          id?: string
          mediator_id?: string | null
          outcome?: string | null
          raised_against?: string
          raised_by?: string
          resolution_date?: string | null
          resolution_details?: string | null
          resolution_method?: string | null
          status?: string
          supporting_documents?: Json | null
          tender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispute_resolution_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_resolution_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          id: string
          is_active: boolean | null
          template_content: Json
          template_name: string
          template_type: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          id?: string
          is_active?: boolean | null
          template_content?: Json
          template_name: string
          template_type: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          id?: string
          is_active?: boolean | null
          template_content?: Json
          template_name?: string
          template_type?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      erp_connections: {
        Row: {
          api_version: string | null
          authentication_method: string | null
          connection_config: Json | null
          connection_name: string
          created_at: string | null
          endpoint_url: string | null
          erp_system: string
          id: string
          last_sync: string | null
          organization_id: string
          sync_frequency: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          api_version?: string | null
          authentication_method?: string | null
          connection_config?: Json | null
          connection_name: string
          created_at?: string | null
          endpoint_url?: string | null
          erp_system: string
          id?: string
          last_sync?: string | null
          organization_id: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          api_version?: string | null
          authentication_method?: string | null
          connection_config?: Json | null
          connection_name?: string
          created_at?: string | null
          endpoint_url?: string | null
          erp_system?: string
          id?: string
          last_sync?: string | null
          organization_id?: string
          sync_frequency?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      erp_connector_configs: {
        Row: {
          connection_id: string
          connector_type: string
          created_at: string | null
          dynamics_environment_url: string | null
          dynamics_tenant_id: string | null
          error_handling_config: Json | null
          field_mappings: Json
          id: string
          is_active: boolean | null
          oracle_service_name: string | null
          oracle_wallet_path: string | null
          sap_client: string | null
          sap_logon_group: string | null
          sap_system_id: string | null
          sync_entities: string[] | null
          transformation_rules: Json | null
          updated_at: string | null
        }
        Insert: {
          connection_id: string
          connector_type: string
          created_at?: string | null
          dynamics_environment_url?: string | null
          dynamics_tenant_id?: string | null
          error_handling_config?: Json | null
          field_mappings?: Json
          id?: string
          is_active?: boolean | null
          oracle_service_name?: string | null
          oracle_wallet_path?: string | null
          sap_client?: string | null
          sap_logon_group?: string | null
          sap_system_id?: string | null
          sync_entities?: string[] | null
          transformation_rules?: Json | null
          updated_at?: string | null
        }
        Update: {
          connection_id?: string
          connector_type?: string
          created_at?: string | null
          dynamics_environment_url?: string | null
          dynamics_tenant_id?: string | null
          error_handling_config?: Json | null
          field_mappings?: Json
          id?: string
          is_active?: boolean | null
          oracle_service_name?: string | null
          oracle_wallet_path?: string | null
          sap_client?: string | null
          sap_logon_group?: string | null
          sap_system_id?: string | null
          sync_entities?: string[] | null
          transformation_rules?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erp_connector_configs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "erp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_sync_logs: {
        Row: {
          completed_at: string | null
          connection_id: string
          entity_count: number | null
          entity_type: string
          error_count: number | null
          error_details: Json | null
          id: string
          started_at: string | null
          success_count: number | null
          sync_duration: unknown
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          connection_id: string
          entity_count?: number | null
          entity_type: string
          error_count?: number | null
          error_details?: Json | null
          id?: string
          started_at?: string | null
          success_count?: number | null
          sync_duration?: unknown
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          connection_id?: string
          entity_count?: number | null
          entity_type?: string
          error_count?: number | null
          error_details?: Json | null
          id?: string
          started_at?: string | null
          success_count?: number | null
          sync_duration?: unknown
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "erp_sync_logs_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "erp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_sync_queue: {
        Row: {
          connection_id: string
          created_at: string | null
          entity_id: string
          entity_type: string
          error_message: string | null
          id: string
          max_retries: number | null
          operation: string
          payload: Json
          priority: number | null
          processed_at: string | null
          retry_count: number | null
          scheduled_at: string | null
          status: string | null
        }
        Insert: {
          connection_id: string
          created_at?: string | null
          entity_id: string
          entity_type: string
          error_message?: string | null
          id?: string
          max_retries?: number | null
          operation: string
          payload: Json
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Update: {
          connection_id?: string
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          id?: string
          max_retries?: number | null
          operation?: string
          payload?: Json
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erp_sync_queue_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "erp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      evaluations: {
        Row: {
          bid_id: string
          blockchain_hash: string | null
          comments: string | null
          created_at: string | null
          criteria_scores: Json | null
          evaluation_type: Database["public"]["Enums"]["user_role"]
          evaluator_id: string
          id: string
          justification: string | null
          recommendation: string | null
          score: number
          updated_at: string | null
        }
        Insert: {
          bid_id: string
          blockchain_hash?: string | null
          comments?: string | null
          created_at?: string | null
          criteria_scores?: Json | null
          evaluation_type: Database["public"]["Enums"]["user_role"]
          evaluator_id: string
          id?: string
          justification?: string | null
          recommendation?: string | null
          score: number
          updated_at?: string | null
        }
        Update: {
          bid_id?: string
          blockchain_hash?: string | null
          comments?: string | null
          created_at?: string | null
          criteria_scores?: Json | null
          evaluation_type?: Database["public"]["Enums"]["user_role"]
          evaluator_id?: string
          id?: string
          justification?: string | null
          recommendation?: string | null
          score?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluations_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      external_integrations: {
        Row: {
          api_key_name: string | null
          configuration: Json | null
          created_at: string | null
          created_by: string
          endpoint_url: string
          id: string
          last_sync: string | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          api_key_name?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by: string
          endpoint_url: string
          id?: string
          last_sync?: string | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          api_key_name?: string | null
          configuration?: Json | null
          created_at?: string | null
          created_by?: string
          endpoint_url?: string
          id?: string
          last_sync?: string | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      framework_agreements: {
        Row: {
          agreement_number: string
          buyer_organization: string
          category_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          end_date: string
          evaluation_criteria: Json | null
          id: string
          max_value: number | null
          start_date: string
          status: string | null
          suppliers: Json | null
          terms_conditions: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agreement_number: string
          buyer_organization: string
          category_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date: string
          evaluation_criteria?: Json | null
          id?: string
          max_value?: number | null
          start_date: string
          status?: string | null
          suppliers?: Json | null
          terms_conditions?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agreement_number?: string
          buyer_organization?: string
          category_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_date?: string
          evaluation_criteria?: Json | null
          id?: string
          max_value?: number | null
          start_date?: string
          status?: string | null
          suppliers?: Json | null
          terms_conditions?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_agreements_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      fraud_alerts: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          detected_at: string
          entity_id: string
          entity_type: string
          id: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          detected_at?: string
          entity_id: string
          entity_type: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity: string
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          detected_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      generated_reports: {
        Row: {
          created_at: string | null
          error_message: string | null
          file_path: string | null
          file_size: number | null
          generated_by: string
          generation_time: unknown
          id: string
          parameters_used: Json | null
          status: string | null
          template_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_by: string
          generation_time?: unknown
          id?: string
          parameters_used?: Json | null
          status?: string | null
          template_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          file_size?: number | null
          generated_by?: string
          generation_time?: unknown
          id?: string
          parameters_used?: Json | null
          status?: string | null
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_reports_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_model_performance: {
        Row: {
          accuracy: number | null
          auc_roc: number | null
          confusion_matrix: Json | null
          correct_predictions: number
          created_at: string
          evaluation_date: string
          f1_score: number | null
          feature_importance: Json | null
          id: string
          model_type: string
          model_version: string
          precision_score: number | null
          recall_score: number | null
          total_predictions: number
        }
        Insert: {
          accuracy?: number | null
          auc_roc?: number | null
          confusion_matrix?: Json | null
          correct_predictions?: number
          created_at?: string
          evaluation_date?: string
          f1_score?: number | null
          feature_importance?: Json | null
          id?: string
          model_type: string
          model_version: string
          precision_score?: number | null
          recall_score?: number | null
          total_predictions?: number
        }
        Update: {
          accuracy?: number | null
          auc_roc?: number | null
          confusion_matrix?: Json | null
          correct_predictions?: number
          created_at?: string
          evaluation_date?: string
          f1_score?: number | null
          feature_importance?: Json | null
          id?: string
          model_type?: string
          model_version?: string
          precision_score?: number | null
          recall_score?: number | null
          total_predictions?: number
        }
        Relationships: []
      }
      ml_training_data: {
        Row: {
          entity_id: string
          entity_type: string
          features: Json
          id: string
          label: boolean
          model_type: string
          recorded_at: string
          training_batch_id: string | null
          used_in_training: boolean | null
        }
        Insert: {
          entity_id: string
          entity_type: string
          features: Json
          id?: string
          label: boolean
          model_type: string
          recorded_at?: string
          training_batch_id?: string | null
          used_in_training?: boolean | null
        }
        Update: {
          entity_id?: string
          entity_type?: string
          features?: Json
          id?: string
          label?: boolean
          model_type?: string
          recorded_at?: string
          training_batch_id?: string | null
          used_in_training?: boolean | null
        }
        Relationships: []
      }
      mobile_sessions: {
        Row: {
          app_version: string
          created_at: string | null
          device_id: string
          device_info: Json | null
          device_type: string
          id: string
          last_active: string | null
          push_token: string | null
          user_id: string
        }
        Insert: {
          app_version: string
          created_at?: string | null
          device_id: string
          device_info?: Json | null
          device_type: string
          id?: string
          last_active?: string | null
          push_token?: string | null
          user_id: string
        }
        Update: {
          app_version?: string
          created_at?: string | null
          device_id?: string
          device_info?: Json | null
          device_type?: string
          id?: string
          last_active?: string | null
          push_token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payment_schedules: {
        Row: {
          amount: number
          contract_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          due_date: string
          id: string
          milestone_id: string | null
          paid_date: string | null
          payment_method: string | null
          payment_number: number
          reference_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          contract_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date: string
          id?: string
          milestone_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_number: number
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          contract_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string
          id?: string
          milestone_id?: string | null
          paid_date?: string | null
          payment_method?: string | null
          payment_number?: number
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedules_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_schedules_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "contract_milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_evaluations: {
        Row: {
          comments: string | null
          compliance_score: number | null
          contract_id: string
          created_at: string | null
          evaluation_period_end: string
          evaluation_period_start: string
          evaluator_id: string
          id: string
          overall_score: number | null
          quality_score: number | null
          recommendations: string | null
          timeliness_score: number | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          compliance_score?: number | null
          contract_id: string
          created_at?: string | null
          evaluation_period_end: string
          evaluation_period_start: string
          evaluator_id: string
          id?: string
          overall_score?: number | null
          quality_score?: number | null
          recommendations?: string | null
          timeliness_score?: number | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          compliance_score?: number | null
          contract_id?: string
          created_at?: string | null
          evaluation_period_end?: string
          evaluation_period_start?: string
          evaluator_id?: string
          id?: string
          overall_score?: number | null
          quality_score?: number | null
          recommendations?: string | null
          timeliness_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_history: {
        Row: {
          actual_outcome: boolean | null
          confidence: number
          contributing_factors: Json
          created_at: string
          entity_id: string
          entity_type: string
          expires_at: string | null
          id: string
          model_version: string
          outcome_recorded_at: string | null
          prediction_type: string
          probability: number
          recommendations: string[] | null
          risk_level: string
        }
        Insert: {
          actual_outcome?: boolean | null
          confidence: number
          contributing_factors?: Json
          created_at?: string
          entity_id: string
          entity_type: string
          expires_at?: string | null
          id?: string
          model_version?: string
          outcome_recorded_at?: string | null
          prediction_type: string
          probability: number
          recommendations?: string[] | null
          risk_level: string
        }
        Update: {
          actual_outcome?: boolean | null
          confidence?: number
          contributing_factors?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          expires_at?: string | null
          id?: string
          model_version?: string
          outcome_recorded_at?: string | null
          prediction_type?: string
          probability?: number
          recommendations?: string[] | null
          risk_level?: string
        }
        Relationships: []
      }
      procurement_appeals: {
        Row: {
          appeal_date: string | null
          appeal_grounds: string
          appeal_type: string
          appellant_id: string
          appellant_type: string
          assigned_reviewer: string | null
          blockchain_hash: string | null
          buyer_response: string | null
          buyer_response_by: string | null
          buyer_response_date: string | null
          created_at: string | null
          decision: string | null
          decision_date: string | null
          decision_rationale: string | null
          escalated_to_pparb: boolean | null
          id: string
          pparb_decision: string | null
          pparb_decision_date: string | null
          pparb_reference_number: string | null
          remedial_actions: Json | null
          response_deadline: string | null
          review_committee_members: Json | null
          review_notes: string | null
          standstill_triggered: boolean | null
          status: string | null
          supporting_evidence: Json | null
          tender_id: string
          updated_at: string | null
        }
        Insert: {
          appeal_date?: string | null
          appeal_grounds: string
          appeal_type: string
          appellant_id: string
          appellant_type: string
          assigned_reviewer?: string | null
          blockchain_hash?: string | null
          buyer_response?: string | null
          buyer_response_by?: string | null
          buyer_response_date?: string | null
          created_at?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_rationale?: string | null
          escalated_to_pparb?: boolean | null
          id?: string
          pparb_decision?: string | null
          pparb_decision_date?: string | null
          pparb_reference_number?: string | null
          remedial_actions?: Json | null
          response_deadline?: string | null
          review_committee_members?: Json | null
          review_notes?: string | null
          standstill_triggered?: boolean | null
          status?: string | null
          supporting_evidence?: Json | null
          tender_id: string
          updated_at?: string | null
        }
        Update: {
          appeal_date?: string | null
          appeal_grounds?: string
          appeal_type?: string
          appellant_id?: string
          appellant_type?: string
          assigned_reviewer?: string | null
          blockchain_hash?: string | null
          buyer_response?: string | null
          buyer_response_by?: string | null
          buyer_response_date?: string | null
          created_at?: string | null
          decision?: string | null
          decision_date?: string | null
          decision_rationale?: string | null
          escalated_to_pparb?: boolean | null
          id?: string
          pparb_decision?: string | null
          pparb_decision_date?: string | null
          pparb_reference_number?: string | null
          remedial_actions?: Json | null
          response_deadline?: string | null
          review_committee_members?: Json | null
          review_notes?: string | null
          standstill_triggered?: boolean | null
          status?: string | null
          supporting_evidence?: Json | null
          tender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "procurement_appeals_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_plan_items: {
        Row: {
          actual_expenditure: number | null
          agpo_category: string | null
          budget_line_item: string | null
          category: string
          contract_id: string | null
          created_at: string
          currency: string
          delivery_schedule: string | null
          estimated_contract_value: number
          funding_source: string | null
          id: string
          is_agpo_reserved: boolean
          item_description: string
          item_number: number
          min_responsive_suppliers: number
          notes: string | null
          plan_id: string
          planned_end_date: string | null
          planned_start_date: string | null
          procurement_method: string
          quantity: number
          splitting_flag: boolean
          splitting_reason: string | null
          status: string
          tender_id: string | null
          unit_cost: number
          unit_of_measure: string
          updated_at: string
        }
        Insert: {
          actual_expenditure?: number | null
          agpo_category?: string | null
          budget_line_item?: string | null
          category: string
          contract_id?: string | null
          created_at?: string
          currency?: string
          delivery_schedule?: string | null
          estimated_contract_value?: number
          funding_source?: string | null
          id?: string
          is_agpo_reserved?: boolean
          item_description: string
          item_number: number
          min_responsive_suppliers?: number
          notes?: string | null
          plan_id: string
          planned_end_date?: string | null
          planned_start_date?: string | null
          procurement_method?: string
          quantity?: number
          splitting_flag?: boolean
          splitting_reason?: string | null
          status?: string
          tender_id?: string | null
          unit_cost?: number
          unit_of_measure?: string
          updated_at?: string
        }
        Update: {
          actual_expenditure?: number | null
          agpo_category?: string | null
          budget_line_item?: string | null
          category?: string
          contract_id?: string | null
          created_at?: string
          currency?: string
          delivery_schedule?: string | null
          estimated_contract_value?: number
          funding_source?: string | null
          id?: string
          is_agpo_reserved?: boolean
          item_description?: string
          item_number?: number
          min_responsive_suppliers?: number
          notes?: string | null
          plan_id?: string
          planned_end_date?: string | null
          planned_start_date?: string | null
          procurement_method?: string
          quantity?: number
          splitting_flag?: boolean
          splitting_reason?: string | null
          status?: string
          tender_id?: string | null
          unit_cost?: number
          unit_of_measure?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_plan_items_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "procurement_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      procurement_plans: {
        Row: {
          agpo_reserved_amount: number
          agpo_reserved_percentage: number
          approval_date: string | null
          approval_remarks: string | null
          approved_by: string | null
          budget_allocation_id: string | null
          budget_currency: string
          created_at: string
          created_by: string
          department: string
          financial_year: string
          id: string
          multi_year_end: string | null
          multi_year_start: string | null
          notes: string | null
          organization_id: string | null
          plan_name: string
          plan_reference: string
          plan_type: string
          ppra_submission_date: string | null
          ppra_submission_reference: string | null
          status: string
          total_budget_allocation: number
          total_planned_expenditure: number
          treasury_submission_date: string | null
          treasury_submission_reference: string | null
          updated_at: string
        }
        Insert: {
          agpo_reserved_amount?: number
          agpo_reserved_percentage?: number
          approval_date?: string | null
          approval_remarks?: string | null
          approved_by?: string | null
          budget_allocation_id?: string | null
          budget_currency?: string
          created_at?: string
          created_by: string
          department: string
          financial_year: string
          id?: string
          multi_year_end?: string | null
          multi_year_start?: string | null
          notes?: string | null
          organization_id?: string | null
          plan_name: string
          plan_reference: string
          plan_type?: string
          ppra_submission_date?: string | null
          ppra_submission_reference?: string | null
          status?: string
          total_budget_allocation?: number
          total_planned_expenditure?: number
          treasury_submission_date?: string | null
          treasury_submission_reference?: string | null
          updated_at?: string
        }
        Update: {
          agpo_reserved_amount?: number
          agpo_reserved_percentage?: number
          approval_date?: string | null
          approval_remarks?: string | null
          approved_by?: string | null
          budget_allocation_id?: string | null
          budget_currency?: string
          created_at?: string
          created_by?: string
          department?: string
          financial_year?: string
          id?: string
          multi_year_end?: string | null
          multi_year_start?: string | null
          notes?: string | null
          organization_id?: string | null
          plan_name?: string
          plan_reference?: string
          plan_type?: string
          ppra_submission_date?: string | null
          ppra_submission_reference?: string | null
          status?: string
          total_budget_allocation?: number
          total_planned_expenditure?: number
          treasury_submission_date?: string | null
          treasury_submission_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_plans_budget_allocation_id_fkey"
            columns: ["budget_allocation_id"]
            isOneToOne: false
            referencedRelation: "budget_allocations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          annual_revenue_range: string | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          documents_uploaded: Json | null
          employee_count: number | null
          full_name: string | null
          id: string
          industry: string | null
          kyc_documents: Json | null
          kyc_status: string | null
          organization_type: string | null
          performance_score: number | null
          position: string | null
          risk_score: number | null
          updated_at: string | null
          verification_level: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified: boolean | null
        }
        Insert: {
          annual_revenue_range?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          documents_uploaded?: Json | null
          employee_count?: number | null
          full_name?: string | null
          id: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          organization_type?: string | null
          performance_score?: number | null
          position?: string | null
          risk_score?: number | null
          updated_at?: string | null
          verification_level?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified?: boolean | null
        }
        Update: {
          annual_revenue_range?: string | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          documents_uploaded?: Json | null
          employee_count?: number | null
          full_name?: string | null
          id?: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
          organization_type?: string | null
          performance_score?: number | null
          position?: string | null
          risk_score?: number | null
          updated_at?: string | null
          verification_level?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified?: boolean | null
        }
        Relationships: []
      }
      purchase_requisitions: {
        Row: {
          approval_status: string | null
          approval_workflow: Json | null
          approvers: Json | null
          budget_code: string | null
          created_at: string | null
          currency: string | null
          department: string
          description: string | null
          estimated_value: number
          id: string
          items: Json | null
          justification: string
          priority: string | null
          requester_id: string
          required_date: string
          requisition_number: string
          title: string
          updated_at: string | null
        }
        Insert: {
          approval_status?: string | null
          approval_workflow?: Json | null
          approvers?: Json | null
          budget_code?: string | null
          created_at?: string | null
          currency?: string | null
          department: string
          description?: string | null
          estimated_value: number
          id?: string
          items?: Json | null
          justification: string
          priority?: string | null
          requester_id: string
          required_date: string
          requisition_number: string
          title: string
          updated_at?: string | null
        }
        Update: {
          approval_status?: string | null
          approval_workflow?: Json | null
          approvers?: Json | null
          budget_code?: string | null
          created_at?: string | null
          currency?: string | null
          department?: string
          description?: string | null
          estimated_value?: number
          id?: string
          items?: Json | null
          justification?: string
          priority?: string | null
          requester_id?: string
          required_date?: string
          requisition_number?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      push_notifications: {
        Row: {
          body: string
          created_at: string | null
          data: Json | null
          delivery_status: string | null
          error_message: string | null
          id: string
          scheduled_for: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          data?: Json | null
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          data?: Json | null
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          scheduled_for?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limit_tracking: {
        Row: {
          allowed: boolean
          created_at: string
          endpoint: string
          id: string
          ip_address: unknown
          user_id: string
        }
        Insert: {
          allowed?: boolean
          created_at?: string
          endpoint: string
          id?: string
          ip_address?: unknown
          user_id: string
        }
        Update: {
          allowed?: boolean
          created_at?: string
          endpoint?: string
          id?: string
          ip_address?: unknown
          user_id?: string
        }
        Relationships: []
      }
      report_templates: {
        Row: {
          access_roles: Json | null
          active: boolean | null
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          output_format: string | null
          parameters: Json | null
          query_template: Json
          report_type: string
          updated_at: string | null
        }
        Insert: {
          access_roles?: Json | null
          active?: boolean | null
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          output_format?: string | null
          parameters?: Json | null
          query_template: Json
          report_type: string
          updated_at?: string | null
        }
        Update: {
          access_roles?: Json | null
          active?: boolean | null
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          output_format?: string | null
          parameters?: Json | null
          query_template?: Json
          report_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reverse_auctions: {
        Row: {
          auction_name: string
          bid_extension_time: number | null
          created_at: string | null
          current_leader_id: string | null
          current_lowest_bid: number | null
          end_time: string
          id: string
          minimum_bid_decrement: number | null
          reserve_price: number | null
          settings: Json | null
          start_time: string
          status: string | null
          tender_id: string
          total_bids: number | null
          updated_at: string | null
        }
        Insert: {
          auction_name: string
          bid_extension_time?: number | null
          created_at?: string | null
          current_leader_id?: string | null
          current_lowest_bid?: number | null
          end_time: string
          id?: string
          minimum_bid_decrement?: number | null
          reserve_price?: number | null
          settings?: Json | null
          start_time: string
          status?: string | null
          tender_id: string
          total_bids?: number | null
          updated_at?: string | null
        }
        Update: {
          auction_name?: string
          bid_extension_time?: number | null
          created_at?: string | null
          current_leader_id?: string | null
          current_lowest_bid?: number | null
          end_time?: string
          id?: string
          minimum_bid_decrement?: number | null
          reserve_price?: number | null
          settings?: Json | null
          start_time?: string
          status?: string | null
          tender_id?: string
          total_bids?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reverse_auctions_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          assessment_criteria: Json
          assessment_date: string | null
          assessment_type: string
          assessor_id: string
          created_at: string | null
          findings: Json | null
          id: string
          mitigation_actions: Json | null
          next_assessment_date: string | null
          recommendations: Json | null
          risk_level: string | null
          risk_score: number | null
          supplier_id: string
          updated_at: string | null
        }
        Insert: {
          assessment_criteria: Json
          assessment_date?: string | null
          assessment_type: string
          assessor_id: string
          created_at?: string | null
          findings?: Json | null
          id?: string
          mitigation_actions?: Json | null
          next_assessment_date?: string | null
          recommendations?: Json | null
          risk_level?: string | null
          risk_score?: number | null
          supplier_id: string
          updated_at?: string | null
        }
        Update: {
          assessment_criteria?: Json
          assessment_date?: string | null
          assessment_type?: string
          assessor_id?: string
          created_at?: string | null
          findings?: Json | null
          id?: string
          mitigation_actions?: Json | null
          next_assessment_date?: string | null
          recommendations?: Json | null
          risk_level?: string | null
          risk_score?: number | null
          supplier_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rth_field_validation: {
        Row: {
          created_at: string | null
          field_name: string
          field_phase_angle: number | null
          fraud_likelihood: number | null
          id: string
          interference_classification: string | null
          objective_source: string | null
          objective_value: number | null
          session_id: string
          subjective_source: string | null
          subjective_value: number | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          field_phase_angle?: number | null
          fraud_likelihood?: number | null
          id?: string
          interference_classification?: string | null
          objective_source?: string | null
          objective_value?: number | null
          session_id: string
          subjective_source?: string | null
          subjective_value?: number | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          field_phase_angle?: number | null
          fraud_likelihood?: number | null
          id?: string
          interference_classification?: string | null
          objective_source?: string | null
          objective_value?: number | null
          session_id?: string
          subjective_source?: string | null
          subjective_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rth_field_validation_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "rth_verification_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      rth_pattern_library: {
        Row: {
          created_at: string | null
          id: string
          pattern_metadata: Json | null
          pattern_vector: Json
          success_metric: number | null
          tender_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pattern_metadata?: Json | null
          pattern_vector: Json
          success_metric?: number | null
          tender_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pattern_metadata?: Json | null
          pattern_vector?: Json
          success_metric?: number | null
          tender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rth_pattern_library_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      rth_phase_matrix: {
        Row: {
          created_at: string | null
          id: string
          interference_type: string | null
          phase_angle: number
          session_id: string
          verifier_i: string
          verifier_j: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interference_type?: string | null
          phase_angle: number
          session_id: string
          verifier_i: string
          verifier_j: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interference_type?: string | null
          phase_angle?: number
          session_id?: string
          verifier_i?: string
          verifier_j?: string
        }
        Relationships: [
          {
            foreignKeyName: "rth_phase_matrix_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "rth_verification_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rth_phase_matrix_verifier_i_fkey"
            columns: ["verifier_i"]
            isOneToOne: false
            referencedRelation: "rth_verifiers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rth_phase_matrix_verifier_j_fkey"
            columns: ["verifier_j"]
            isOneToOne: false
            referencedRelation: "rth_verifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      rth_risk_monitoring: {
        Row: {
          created_at: string | null
          credit_score: number | null
          id: string
          payment_terms: string | null
          performance_score: number | null
          regulatory_compliance_score: number | null
          risk_state: string | null
          supplier_id: string
          tax_compliance_score: number | null
          total_risk_pressure: number | null
          verification_frequency: string | null
        }
        Insert: {
          created_at?: string | null
          credit_score?: number | null
          id?: string
          payment_terms?: string | null
          performance_score?: number | null
          regulatory_compliance_score?: number | null
          risk_state?: string | null
          supplier_id: string
          tax_compliance_score?: number | null
          total_risk_pressure?: number | null
          verification_frequency?: string | null
        }
        Update: {
          created_at?: string | null
          credit_score?: number | null
          id?: string
          payment_terms?: string | null
          performance_score?: number | null
          regulatory_compliance_score?: number | null
          risk_state?: string | null
          supplier_id?: string
          tax_compliance_score?: number | null
          total_risk_pressure?: number | null
          verification_frequency?: string | null
        }
        Relationships: []
      }
      rth_verification_sessions: {
        Row: {
          average_phase: number | null
          blockchain_hash: string | null
          circular_variance: number | null
          completed_at: string | null
          confidence_score: number | null
          consensus_result: Json | null
          contract_id: string | null
          created_at: string | null
          current_verifiers: number | null
          decision: string | null
          expires_at: string | null
          id: string
          milestone_id: string | null
          outlier_confidence: number | null
          outlier_detected: boolean | null
          outlier_verifier_id: string | null
          required_verifiers: number | null
          status: string | null
          verification_type: string
        }
        Insert: {
          average_phase?: number | null
          blockchain_hash?: string | null
          circular_variance?: number | null
          completed_at?: string | null
          confidence_score?: number | null
          consensus_result?: Json | null
          contract_id?: string | null
          created_at?: string | null
          current_verifiers?: number | null
          decision?: string | null
          expires_at?: string | null
          id?: string
          milestone_id?: string | null
          outlier_confidence?: number | null
          outlier_detected?: boolean | null
          outlier_verifier_id?: string | null
          required_verifiers?: number | null
          status?: string | null
          verification_type: string
        }
        Update: {
          average_phase?: number | null
          blockchain_hash?: string | null
          circular_variance?: number | null
          completed_at?: string | null
          confidence_score?: number | null
          consensus_result?: Json | null
          contract_id?: string | null
          created_at?: string | null
          current_verifiers?: number | null
          decision?: string | null
          expires_at?: string | null
          id?: string
          milestone_id?: string | null
          outlier_confidence?: number | null
          outlier_detected?: boolean | null
          outlier_verifier_id?: string | null
          required_verifiers?: number | null
          status?: string | null
          verification_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rth_verification_sessions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rth_verification_sessions_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "contract_milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rth_verification_sessions_outlier_verifier_id_fkey"
            columns: ["outlier_verifier_id"]
            isOneToOne: false
            referencedRelation: "rth_verifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      rth_verifications: {
        Row: {
          amplitude: number
          comments: string | null
          created_at: string | null
          frequency: number | null
          id: string
          phase_angle: number | null
          response_time_seconds: number | null
          session_id: string
          supporting_documents: Json | null
          verification_data: Json
          verified_value: number
          verifier_id: string
          wavelength: number | null
        }
        Insert: {
          amplitude: number
          comments?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          phase_angle?: number | null
          response_time_seconds?: number | null
          session_id: string
          supporting_documents?: Json | null
          verification_data: Json
          verified_value: number
          verifier_id: string
          wavelength?: number | null
        }
        Update: {
          amplitude?: number
          comments?: string | null
          created_at?: string | null
          frequency?: number | null
          id?: string
          phase_angle?: number | null
          response_time_seconds?: number | null
          session_id?: string
          supporting_documents?: Json | null
          verification_data?: Json
          verified_value?: number
          verifier_id?: string
          wavelength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rth_verifications_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "rth_verification_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rth_verifications_verifier_id_fkey"
            columns: ["verifier_id"]
            isOneToOne: false
            referencedRelation: "rth_verifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      rth_verifiers: {
        Row: {
          consistency_period: number | null
          correct_verifications: number | null
          created_at: string | null
          id: string
          last_verification_at: string | null
          reputation_amplitude: number | null
          response_frequency: number | null
          total_verifications: number | null
          updated_at: string | null
          user_id: string
          verifier_type: string
        }
        Insert: {
          consistency_period?: number | null
          correct_verifications?: number | null
          created_at?: string | null
          id?: string
          last_verification_at?: string | null
          reputation_amplitude?: number | null
          response_frequency?: number | null
          total_verifications?: number | null
          updated_at?: string | null
          user_id: string
          verifier_type: string
        }
        Update: {
          consistency_period?: number | null
          correct_verifications?: number | null
          created_at?: string | null
          id?: string
          last_verification_at?: string | null
          reputation_amplitude?: number | null
          response_frequency?: number | null
          total_verifications?: number | null
          updated_at?: string | null
          user_id?: string
          verifier_type?: string
        }
        Relationships: []
      }
      specification_templates: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          mandatory_documents: string[] | null
          min_specifications: number | null
          specifications: Json
          template_name: string
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mandatory_documents?: string[] | null
          min_specifications?: number | null
          specifications?: Json
          template_name: string
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          mandatory_documents?: string[] | null
          min_specifications?: number | null
          specifications?: Json
          template_name?: string
        }
        Relationships: []
      }
      submission_progress: {
        Row: {
          created_at: string | null
          current_step: number
          entity_id: string | null
          entity_type: string
          id: string
          is_draft: boolean | null
          last_saved_at: string | null
          step_data: Json | null
          total_steps: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_step?: number
          entity_id?: string | null
          entity_type: string
          id?: string
          is_draft?: boolean | null
          last_saved_at?: string | null
          step_data?: Json | null
          total_steps: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_step?: number
          entity_id?: string | null
          entity_type?: string
          id?: string
          is_draft?: boolean | null
          last_saved_at?: string | null
          step_data?: Json | null
          total_steps?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          features: Json
          id: string
          name: string
          price_monthly: number | null
          price_yearly: number | null
          trial_included: boolean | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          trial_included?: boolean | null
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          features?: Json
          id?: string
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          trial_included?: boolean | null
        }
        Relationships: []
      }
      supplier_agpo_registration: {
        Row: {
          agpo_category_id: string
          certificate_document_url: string | null
          certificate_expiry: string
          certificate_number: string
          created_at: string | null
          id: string
          rejection_reason: string | null
          supplier_id: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          agpo_category_id: string
          certificate_document_url?: string | null
          certificate_expiry: string
          certificate_number: string
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          supplier_id: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          agpo_category_id?: string
          certificate_document_url?: string | null
          certificate_expiry?: string
          certificate_number?: string
          created_at?: string | null
          id?: string
          rejection_reason?: string | null
          supplier_id?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_agpo_registration_agpo_category_id_fkey"
            columns: ["agpo_category_id"]
            isOneToOne: false
            referencedRelation: "agpo_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_lists: {
        Row: {
          created_at: string | null
          created_by: string
          criteria: Json | null
          description: string | null
          id: string
          name: string
          status: string | null
          suppliers: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          criteria?: Json | null
          description?: string | null
          id?: string
          name: string
          status?: string | null
          suppliers?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          criteria?: Json | null
          description?: string | null
          id?: string
          name?: string
          status?: string | null
          suppliers?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      supplier_performance_history: {
        Row: {
          contract_id: string
          created_at: string | null
          delivery_score: number | null
          evaluation_notes: string | null
          evaluation_period_end: string
          evaluation_period_start: string
          evaluator_id: string
          id: string
          overall_score: number | null
          performance_data: Json | null
          quality_score: number | null
          service_score: number | null
          supplier_id: string
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          delivery_score?: number | null
          evaluation_notes?: string | null
          evaluation_period_end: string
          evaluation_period_start: string
          evaluator_id: string
          id?: string
          overall_score?: number | null
          performance_data?: Json | null
          quality_score?: number | null
          service_score?: number | null
          supplier_id: string
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          delivery_score?: number | null
          evaluation_notes?: string | null
          evaluation_period_end?: string
          evaluation_period_start?: string
          evaluator_id?: string
          id?: string
          overall_score?: number | null
          performance_data?: Json | null
          quality_score?: number | null
          service_score?: number | null
          supplier_id?: string
        }
        Relationships: []
      }
      supplier_qualifications: {
        Row: {
          category_id: string
          certification_documents: Json | null
          compliance_score: number | null
          created_at: string | null
          financial_capacity: number | null
          id: string
          qualification_level: string | null
          quality_rating: number | null
          status: string | null
          supplier_id: string
          technical_capacity: Json | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          category_id: string
          certification_documents?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          financial_capacity?: number | null
          id?: string
          qualification_level?: string | null
          quality_rating?: number | null
          status?: string | null
          supplier_id: string
          technical_capacity?: Json | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          category_id?: string
          certification_documents?: Json | null
          compliance_score?: number | null
          created_at?: string | null
          financial_capacity?: number | null
          id?: string
          qualification_level?: string | null
          quality_rating?: number | null
          status?: string | null
          supplier_id?: string
          technical_capacity?: Json | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "supplier_qualifications_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      tender_addendums: {
        Row: {
          addendum_number: number
          changes_summary: Json
          created_at: string | null
          description: string
          extends_deadline: boolean | null
          id: string
          issued_at: string | null
          issued_by: string
          new_deadline: string | null
          new_values: Json | null
          original_values: Json | null
          requires_acknowledgment: boolean | null
          tender_id: string
          title: string
        }
        Insert: {
          addendum_number: number
          changes_summary?: Json
          created_at?: string | null
          description: string
          extends_deadline?: boolean | null
          id?: string
          issued_at?: string | null
          issued_by: string
          new_deadline?: string | null
          new_values?: Json | null
          original_values?: Json | null
          requires_acknowledgment?: boolean | null
          tender_id: string
          title: string
        }
        Update: {
          addendum_number?: number
          changes_summary?: Json
          created_at?: string | null
          description?: string
          extends_deadline?: boolean | null
          id?: string
          issued_at?: string | null
          issued_by?: string
          new_deadline?: string | null
          new_values?: Json | null
          original_values?: Json | null
          requires_acknowledgment?: boolean | null
          tender_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_addendums_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_agpo_settings: {
        Row: {
          agpo_reserved: boolean | null
          created_at: string | null
          exclusive_agpo: boolean | null
          id: string
          reservation_percentage: number | null
          reserved_categories: string[] | null
          tender_id: string
        }
        Insert: {
          agpo_reserved?: boolean | null
          created_at?: string | null
          exclusive_agpo?: boolean | null
          id?: string
          reservation_percentage?: number | null
          reserved_categories?: string[] | null
          tender_id: string
        }
        Update: {
          agpo_reserved?: boolean | null
          created_at?: string | null
          exclusive_agpo?: boolean | null
          id?: string
          reservation_percentage?: number | null
          reserved_categories?: string[] | null
          tender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_agpo_settings_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: true
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_fairness_metrics: {
        Row: {
          budget_realism: number
          calculated_at: string | null
          created_at: string | null
          evaluation_transparency: number
          id: string
          overall_fairness: number
          recommendations: Json | null
          requirement_clarity: number
          supplier_accessibility: number
          tender_id: string
          timeline_adequacy: number
        }
        Insert: {
          budget_realism: number
          calculated_at?: string | null
          created_at?: string | null
          evaluation_transparency: number
          id?: string
          overall_fairness: number
          recommendations?: Json | null
          requirement_clarity: number
          supplier_accessibility: number
          tender_id: string
          timeline_adequacy: number
        }
        Update: {
          budget_realism?: number
          calculated_at?: string | null
          created_at?: string | null
          evaluation_transparency?: number
          id?: string
          overall_fairness?: number
          recommendations?: Json | null
          requirement_clarity?: number
          supplier_accessibility?: number
          tender_id?: string
          timeline_adequacy?: number
        }
        Relationships: [
          {
            foreignKeyName: "tender_fairness_metrics_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_reviews: {
        Row: {
          created_at: string
          id: string
          supply_chain_remarks: string | null
          supply_chain_reviewer_id: string | null
          supply_chain_status: string
          tender_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          supply_chain_remarks?: string | null
          supply_chain_reviewer_id?: string | null
          supply_chain_status?: string
          tender_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          supply_chain_remarks?: string | null
          supply_chain_reviewer_id?: string | null
          supply_chain_status?: string
          tender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tender_reviews_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: true
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tender_specifications: {
        Row: {
          category: string
          created_at: string | null
          id: string
          is_mandatory: boolean | null
          specification_key: string
          specification_type: string
          specification_value: string
          tender_id: string
          tolerance_range: string | null
          unit_of_measure: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          specification_key: string
          specification_type: string
          specification_value: string
          tender_id: string
          tolerance_range?: string | null
          unit_of_measure?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          is_mandatory?: boolean | null
          specification_key?: string
          specification_type?: string
          specification_value?: string
          tender_id?: string
          tolerance_range?: string | null
          unit_of_measure?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tender_specifications_tender_id_fkey"
            columns: ["tender_id"]
            isOneToOne: false
            referencedRelation: "tenders"
            referencedColumns: ["id"]
          },
        ]
      }
      tenders: {
        Row: {
          blockchain_hash: string | null
          budget_amount: number | null
          budget_currency: string | null
          buyer_id: string
          category: string
          category_code: string | null
          category_standard: string | null
          county: string | null
          created_at: string | null
          description: string
          documents: Json | null
          evaluation_criteria: Json | null
          id: string
          location_details: Json | null
          procurement_method: string | null
          region: string | null
          required_documents: string[] | null
          status: string | null
          submission_deadline: string
          supply_chain_reviewer_id: string | null
          title: string
          updated_at: string | null
          uploaded_documents: Json | null
        }
        Insert: {
          blockchain_hash?: string | null
          budget_amount?: number | null
          budget_currency?: string | null
          buyer_id: string
          category: string
          category_code?: string | null
          category_standard?: string | null
          county?: string | null
          created_at?: string | null
          description: string
          documents?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          location_details?: Json | null
          procurement_method?: string | null
          region?: string | null
          required_documents?: string[] | null
          status?: string | null
          submission_deadline: string
          supply_chain_reviewer_id?: string | null
          title: string
          updated_at?: string | null
          uploaded_documents?: Json | null
        }
        Update: {
          blockchain_hash?: string | null
          budget_amount?: number | null
          budget_currency?: string | null
          buyer_id?: string
          category?: string
          category_code?: string | null
          category_standard?: string | null
          county?: string | null
          created_at?: string | null
          description?: string
          documents?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          location_details?: Json | null
          procurement_method?: string | null
          region?: string | null
          required_documents?: string[] | null
          status?: string | null
          submission_deadline?: string
          supply_chain_reviewer_id?: string | null
          title?: string
          updated_at?: string | null
          uploaded_documents?: Json | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          context: string | null
          created_at: string | null
          id: string
          language_code: string
          translation_key: string
          translation_value: string
          updated_at: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: string
          language_code: string
          translation_key: string
          translation_value: string
          updated_at?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: string
          language_code?: string
          translation_key?: string
          translation_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_trials: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          trial_data: Json | null
          trial_type: string
          used_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          trial_data?: Json | null
          trial_type: string
          used_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          trial_data?: Json | null
          trial_type?: string
          used_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vendor_blacklist: {
        Row: {
          blacklist_date: string
          blacklist_reason: string
          blacklisted_by: string
          created_at: string | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          supplier_id: string
          supporting_documents: Json | null
          updated_at: string | null
        }
        Insert: {
          blacklist_date?: string
          blacklist_reason: string
          blacklisted_by: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          supplier_id: string
          supporting_documents?: Json | null
          updated_at?: string | null
        }
        Update: {
          blacklist_date?: string
          blacklist_reason?: string
          blacklisted_by?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          supplier_id?: string
          supporting_documents?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_blockchain_hash: { Args: { content: Json }; Returns: string }
      calculate_payment_delay_days: {
        Args: { completion_date: string; payment_date: string }
        Returns: number
      }
      check_trial_eligibility: {
        Args: { trial_type_param: string; user_id_param: string }
        Returns: boolean
      }
      get_user_subscription_status: {
        Args: { user_id_param: string }
        Returns: {
          has_active_subscription: boolean
          plan_name: string
          status: string
          trial_available: boolean
        }[]
      }
      has_role: {
        Args: {
          required_role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Returns: boolean
      }
      verify_blockchain_integrity: {
        Args: { entity_id_param: string; entity_type_param: string }
        Returns: {
          current_hash: string
          is_valid: boolean
          last_verified: string
          stored_hash: string
          verification_message: string
        }[]
      }
    }
    Enums: {
      user_role:
        | "buyer"
        | "supplier"
        | "admin"
        | "evaluator_finance"
        | "evaluator_technical"
        | "evaluator_procurement"
        | "evaluator_engineering"
        | "evaluator_legal"
        | "evaluator_accounting"
        | "supply_chain_professional"
      verification_status:
        | "pending"
        | "in_progress"
        | "verified"
        | "rejected"
        | "flagged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "buyer",
        "supplier",
        "admin",
        "evaluator_finance",
        "evaluator_technical",
        "evaluator_procurement",
        "evaluator_engineering",
        "evaluator_legal",
        "evaluator_accounting",
        "supply_chain_professional",
      ],
      verification_status: [
        "pending",
        "in_progress",
        "verified",
        "rejected",
        "flagged",
      ],
    },
  },
} as const

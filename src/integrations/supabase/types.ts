export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      api_access_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
          method?: string
          request_data?: Json | null
          response_status?: number | null
          response_time_ms?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          compliance_flags: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          documents_uploaded: Json | null
          full_name: string | null
          id: string
          industry: string | null
          kyc_documents: Json | null
          kyc_status: string | null
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
          company_name?: string | null
          created_at?: string | null
          documents_uploaded?: Json | null
          full_name?: string | null
          id: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
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
          company_name?: string | null
          created_at?: string | null
          documents_uploaded?: Json | null
          full_name?: string | null
          id?: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
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
      tenders: {
        Row: {
          blockchain_hash: string | null
          budget_amount: number | null
          budget_currency: string | null
          buyer_id: string
          category: string
          created_at: string | null
          description: string
          documents: Json | null
          evaluation_criteria: Json | null
          id: string
          procurement_method: string | null
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
          created_at?: string | null
          description: string
          documents?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          procurement_method?: string | null
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
          created_at?: string | null
          description?: string
          documents?: Json | null
          evaluation_criteria?: Json | null
          id?: string
          procurement_method?: string | null
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
          ip_address: unknown | null
          trial_data: Json | null
          trial_type: string
          used_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          trial_data?: Json | null
          trial_type: string
          used_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown | null
          trial_data?: Json | null
          trial_type?: string
          used_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_trial_eligibility: {
        Args: { user_id_param: string; trial_type_param: string }
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
          user_id: string
          required_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
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

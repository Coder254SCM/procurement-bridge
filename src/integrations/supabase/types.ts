export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
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
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          industry: string | null
          kyc_documents: Json | null
          kyc_status: string | null
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
          full_name?: string | null
          id: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
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
          full_name?: string | null
          id?: string
          industry?: string | null
          kyc_documents?: Json | null
          kyc_status?: string | null
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
          status: string | null
          submission_deadline: string
          title: string
          updated_at: string | null
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
          status?: string | null
          submission_deadline: string
          title: string
          updated_at?: string | null
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
          status?: string | null
          submission_deadline?: string
          title?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

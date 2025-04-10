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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
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

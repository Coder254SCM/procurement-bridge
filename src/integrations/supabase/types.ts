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
      evaluations: {
        Row: {
          bid_id: string
          blockchain_hash: string | null
          comments: string | null
          created_at: string | null
          evaluation_type: Database["public"]["Enums"]["user_role"]
          evaluator_id: string
          id: string
          score: number
          updated_at: string | null
        }
        Insert: {
          bid_id: string
          blockchain_hash?: string | null
          comments?: string | null
          created_at?: string | null
          evaluation_type: Database["public"]["Enums"]["user_role"]
          evaluator_id: string
          id?: string
          score: number
          updated_at?: string | null
        }
        Update: {
          bid_id?: string
          blockchain_hash?: string | null
          comments?: string | null
          created_at?: string | null
          evaluation_type?: Database["public"]["Enums"]["user_role"]
          evaluator_id?: string
          id?: string
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
          updated_at: string | null
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
          updated_at?: string | null
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
          updated_at?: string | null
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

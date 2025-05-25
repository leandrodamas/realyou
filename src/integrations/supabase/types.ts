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
      face_registrations: {
        Row: {
          confidence: number | null
          created_at: string
          face_id: string
          id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          face_id: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          face_id?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      face_search_history: {
        Row: {
          created_at: string
          id: string
          image_url: string
          matched: boolean
          matched_person_id: string | null
          search_timestamp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          matched?: boolean
          matched_person_id?: string | null
          search_timestamp?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          matched?: boolean
          matched_person_id?: string | null
          search_timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          related_entity_id: string | null
          related_user_id: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          related_entity_id?: string | null
          related_user_id?: string | null
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          related_entity_id?: string | null
          related_user_id?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          caption: string | null
          comments: number | null
          created_at: string | null
          id: string
          image_url: string
          likes: number | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url: string
          likes?: number | null
          user_id: string
        }
        Update: {
          caption?: string | null
          comments?: number | null
          created_at?: string | null
          id?: string
          image_url?: string
          likes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          created_at: string
          education: string | null
          face_registered: boolean | null
          face_registered_at: string | null
          full_name: string | null
          id: string
          profession: string | null
          skills: string[] | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          education?: string | null
          face_registered?: boolean | null
          face_registered_at?: string | null
          full_name?: string | null
          id: string
          profession?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          education?: string | null
          face_registered?: boolean | null
          face_registered_at?: string | null
          full_name?: string | null
          id?: string
          profession?: string | null
          skills?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      service_bookings: {
        Row: {
          booking_date: string
          client_id: string
          created_at: string | null
          end_time: string
          id: string
          price_paid: number
          provider_id: string
          service_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          client_id: string
          created_at?: string | null
          end_time: string
          id?: string
          price_paid: number
          provider_id: string
          service_id: string
          start_time: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          client_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          price_paid?: number
          provider_id?: string
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "service_pricing"
            referencedColumns: ["id"]
          },
        ]
      }
      service_fee_records: {
        Row: {
          amount: number
          collection_date: string | null
          destination: string
          id: string
          percentage: number
          status: string
          transaction_id: string
        }
        Insert: {
          amount: number
          collection_date?: string | null
          destination?: string
          id?: string
          percentage: number
          status?: string
          transaction_id: string
        }
        Update: {
          amount?: number
          collection_date?: string | null
          destination?: string
          id?: string
          percentage?: number
          status?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_fee_records_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_pricing: {
        Row: {
          base_price: number
          created_at: string | null
          description: string | null
          duration_minutes: number
          dynamic_pricing: boolean | null
          id: string
          off_peak_price_multiplier: number | null
          peak_price_multiplier: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          dynamic_pricing?: boolean | null
          id?: string
          off_peak_price_multiplier?: number | null
          peak_price_multiplier?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          dynamic_pricing?: boolean | null
          id?: string
          off_peak_price_multiplier?: number | null
          peak_price_multiplier?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      service_schedules: {
        Row: {
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          user_id?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string | null
          id: number
          profilepic: string | null
          username: string
          viewed: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          profilepic?: string | null
          username: string
          viewed?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          profilepic?: string | null
          username?: string
          viewed?: boolean | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          net_amount: number
          provider_id: string
          service_fee_amount: number
          service_fee_percentage: number
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          net_amount: number
          provider_id: string
          service_fee_amount: number
          service_fee_percentage: number
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          net_amount?: number
          provider_id?: string
          service_fee_amount?: number
          service_fee_percentage?: number
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      work_gallery: {
        Row: {
          comments: number | null
          created_at: string | null
          description: string | null
          id: string
          image_path: string
          likes: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          comments?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_path: string
          likes?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          comments?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_path?: string
          likes?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

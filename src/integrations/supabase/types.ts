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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      event_registrations: {
        Row: {
          event_id: string
          id: string
          registered_at: string
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          registered_at?: string
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at: string
          description: string
          event_date: string
          event_time: string | null
          id: string
          is_pinned: boolean | null
          max_capacity: number | null
          organizer: string | null
          organizer_id: string
          organizer_role: string | null
          poster_url: string | null
          registration_count: number | null
          registration_link: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at: string
          venue: string
          views: number | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          category: Database["public"]["Enums"]["event_category"]
          created_at?: string
          description: string
          event_date: string
          event_time?: string | null
          id?: string
          is_pinned?: boolean | null
          max_capacity?: number | null
          organizer?: string | null
          organizer_id: string
          organizer_role?: string | null
          poster_url?: string | null
          registration_count?: number | null
          registration_link?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          title: string
          updated_at?: string
          venue: string
          views?: number | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          category?: Database["public"]["Enums"]["event_category"]
          created_at?: string
          description?: string
          event_date?: string
          event_time?: string | null
          id?: string
          is_pinned?: boolean | null
          max_capacity?: number | null
          organizer?: string | null
          organizer_id?: string
          organizer_role?: string | null
          poster_url?: string | null
          registration_count?: number | null
          registration_link?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          title?: string
          updated_at?: string
          venue?: string
          views?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_department_id: string | null
          club_member_id: string | null
          club_name: string | null
          club_role: string | null
          club_year: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          last_login: string | null
          lead_id: string | null
          name: string
          phone_number: string | null
          profile_completed: boolean | null
          profile_picture: string | null
          staff_member_id: string | null
          staff_year: string | null
          status: string | null
          student_branch: string | null
          student_id: string | null
          student_semester: string | null
          student_year: string | null
          updated_at: string
        }
        Insert: {
          admin_department_id?: string | null
          club_member_id?: string | null
          club_name?: string | null
          club_role?: string | null
          club_year?: string | null
          created_at?: string
          department?: string | null
          email: string
          id: string
          last_login?: string | null
          lead_id?: string | null
          name: string
          phone_number?: string | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          staff_member_id?: string | null
          staff_year?: string | null
          status?: string | null
          student_branch?: string | null
          student_id?: string | null
          student_semester?: string | null
          student_year?: string | null
          updated_at?: string
        }
        Update: {
          admin_department_id?: string | null
          club_member_id?: string | null
          club_name?: string | null
          club_role?: string | null
          club_year?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          last_login?: string | null
          lead_id?: string | null
          name?: string
          phone_number?: string | null
          profile_completed?: boolean | null
          profile_picture?: string | null
          staff_member_id?: string | null
          staff_year?: string | null
          status?: string | null
          student_branch?: string | null
          student_id?: string | null
          student_semester?: string | null
          student_year?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "staff" | "admin" | "club" | "lead"
      event_category: "hackathon" | "technical" | "cultural" | "sports"
      event_status: "pending" | "approved" | "rejected"
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
      app_role: ["student", "staff", "admin", "club", "lead"],
      event_category: ["hackathon", "technical", "cultural", "sports"],
      event_status: ["pending", "approved", "rejected"],
    },
  },
} as const

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
      accounts: {
        Row: {
          account_status: string | null
          created_at: string | null
          data_status: string | null
          email: string
          group_id: string | null
          id: string
          notes: string | null
          password_encrypted: string
          phone_number: string | null
          platform: string
          profile_link: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          account_status?: string | null
          created_at?: string | null
          data_status?: string | null
          email: string
          group_id?: string | null
          id?: string
          notes?: string | null
          password_encrypted: string
          phone_number?: string | null
          platform: string
          profile_link?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          account_status?: string | null
          created_at?: string | null
          data_status?: string | null
          email?: string
          group_id?: string | null
          id?: string
          notes?: string | null
          password_encrypted?: string
          phone_number?: string | null
          platform?: string
          profile_link?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_name: string
          category: string
          condition: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          photo_url: string | null
          purchase_date: string
          purchase_price: number
          quantity: number
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          asset_name: string
          category: string
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          purchase_date: string
          purchase_price: number
          quantity?: number
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          asset_name?: string
          category?: string
          condition?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          photo_url?: string | null
          purchase_date?: string
          purchase_price?: number
          quantity?: number
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          clock_in: string
          clock_out: string | null
          created_at: string | null
          date: string
          duration_minutes: number | null
          employee_id: string
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          clock_in: string
          clock_out?: string | null
          created_at?: string | null
          date: string
          duration_minutes?: number | null
          employee_id: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          created_at?: string | null
          date?: string
          duration_minutes?: number | null
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      cashflow: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          created_by: string | null
          description: string
          group_id: string | null
          id: string
          proof_link: string | null
          transaction_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          created_by?: string | null
          description: string
          group_id?: string | null
          id?: string
          proof_link?: string | null
          transaction_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string
          group_id?: string | null
          id?: string
          proof_link?: string | null
          transaction_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cashflow_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cashflow_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      commissions: {
        Row: {
          account_id: string
          commission_date: string
          created_at: string | null
          created_by: string | null
          disbursed_commission: number | null
          disbursement_date: string | null
          gross_commission: number
          id: string
          net_commission: number
          notes: string | null
          period: string
          updated_at: string | null
        }
        Insert: {
          account_id: string
          commission_date: string
          created_at?: string | null
          created_by?: string | null
          disbursed_commission?: number | null
          disbursement_date?: string | null
          gross_commission: number
          id?: string
          net_commission: number
          notes?: string | null
          period: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          commission_date?: string
          created_at?: string | null
          created_by?: string | null
          disbursed_commission?: number | null
          disbursement_date?: string | null
          gross_commission?: number
          id?: string
          net_commission?: number
          notes?: string | null
          period?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_reports: {
        Row: {
          account_id: string
          created_at: string | null
          device_id: string
          employee_id: string
          ending_sales: number
          group_id: string
          id: string
          live_status: string
          notes: string | null
          product_category: string
          report_date: string
          shift: number
          starting_balance: number | null
          starting_sales: number
          total_sales: number | null
          updated_at: string | null
        }
        Insert: {
          account_id: string
          created_at?: string | null
          device_id: string
          employee_id: string
          ending_sales: number
          group_id: string
          id?: string
          live_status: string
          notes?: string | null
          product_category: string
          report_date: string
          shift: number
          starting_balance?: number | null
          starting_sales: number
          total_sales?: number | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          created_at?: string | null
          device_id?: string
          employee_id?: string
          ending_sales?: number
          group_id?: string
          id?: string
          live_status?: string
          notes?: string | null
          product_category?: string
          report_date?: string
          shift?: number
          starting_balance?: number | null
          starting_sales?: number
          total_sales?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_reports_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_reports_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      debt_receivable: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          paid_amount: number | null
          party_name: string
          remaining_amount: number | null
          status: string | null
          transaction_date: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_amount?: number | null
          party_name: string
          remaining_amount?: number | null
          status?: string | null
          transaction_date: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          paid_amount?: number | null
          party_name?: string
          remaining_amount?: number | null
          status?: string | null
          transaction_date?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      devices: {
        Row: {
          brand: string | null
          created_at: string | null
          device_id: string
          google_account: string | null
          group_id: string | null
          id: string
          imei: string
          model: string | null
          photo_url: string | null
          purchase_date: string | null
          purchase_price: number | null
          screenshot_link: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          device_id: string
          google_account?: string | null
          group_id?: string | null
          id?: string
          imei: string
          model?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          screenshot_link?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          device_id?: string
          google_account?: string | null
          group_id?: string | null
          id?: string
          imei?: string
          model?: string | null
          photo_url?: string | null
          purchase_date?: string | null
          purchase_price?: number | null
          screenshot_link?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      group_accounts: {
        Row: {
          account_id: string
          assigned_at: string | null
          group_id: string
          id: string
        }
        Insert: {
          account_id: string
          assigned_at?: string | null
          group_id: string
          id?: string
        }
        Update: {
          account_id?: string
          assigned_at?: string | null
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: true
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_accounts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_accounts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      group_devices: {
        Row: {
          assigned_at: string | null
          device_id: string
          group_id: string
          id: string
        }
        Insert: {
          assigned_at?: string | null
          device_id: string
          group_id: string
          id?: string
        }
        Update: {
          assigned_at?: string | null
          device_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_devices_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: true
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_devices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_devices_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      group_employees: {
        Row: {
          assigned_at: string | null
          employee_id: string
          group_id: string
          id: string
        }
        Insert: {
          assigned_at?: string | null
          employee_id: string
          group_id: string
          id?: string
        }
        Update: {
          assigned_at?: string | null
          employee_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_employees_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_employees_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content_type: string
          content_url: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content_type: string
          content_url: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content_type?: string
          content_url?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kpi_targets: {
        Row: {
          created_at: string | null
          created_by: string | null
          employee_id: string | null
          end_date: string
          group_id: string | null
          id: string
          period_type: string
          start_date: string
          target_attendance: number
          target_commission: number
          target_sales: number
          updated_at: string | null
          weight_attendance: number | null
          weight_commission: number | null
          weight_sales: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string | null
          end_date: string
          group_id?: string | null
          id?: string
          period_type: string
          start_date: string
          target_attendance: number
          target_commission: number
          target_sales: number
          updated_at?: string | null
          weight_attendance?: number | null
          weight_commission?: number | null
          weight_sales?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string | null
          end_date?: string
          group_id?: string | null
          id?: string
          period_type?: string
          start_date?: string
          target_attendance?: number
          target_commission?: number
          target_sales?: number
          updated_at?: string | null
          weight_attendance?: number | null
          weight_commission?: number | null
          weight_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_targets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_targets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          group_id: string | null
          id: string
          job_position: string | null
          phone_number: string | null
          role: string
          start_work_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          group_id?: string | null
          id: string
          job_position?: string | null
          phone_number?: string | null
          role: string
          start_work_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          group_id?: string | null
          id?: string
          job_position?: string | null
          phone_number?: string | null
          role?: string
          start_work_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_employee_performance: {
        Row: {
          full_name: string | null
          group_id: string | null
          group_name: string | null
          id: string | null
          total_attendance: number | null
          total_commission: number | null
          total_reports: number | null
          total_sales: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "view_group_performance"
            referencedColumns: ["id"]
          },
        ]
      }
      view_group_performance: {
        Row: {
          id: string | null
          name: string | null
          total_accounts: number | null
          total_commission: number | null
          total_devices: number | null
          total_employees: number | null
          total_sales: number | null
        }
        Relationships: []
      }
      view_monthly_financial: {
        Row: {
          month: string | null
          net_profit: number | null
          total_expense: number | null
          total_income: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_kpi: {
        Args: {
          p_employee_id: string
          p_end_date: string
          p_start_date: string
        }
        Returns: {
          attendance_achievement: number
          commission_achievement: number
          sales_achievement: number
          total_kpi: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

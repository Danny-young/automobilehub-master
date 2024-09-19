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
      Appointment: {
        Row: {
          appointment_date: string | null
          appointment_status: string | null
          created_at: string
          id: number
          notes: string | null
          service_category: Database["public"]["Enums"]["categories"] | null
          service_provider: string | null
          service_type: Database["public"]["Enums"]["service_types"] | null
          user_id: string | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_status?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          service_category?: Database["public"]["Enums"]["categories"] | null
          service_provider?: string | null
          service_type?: Database["public"]["Enums"]["service_types"] | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string | null
          appointment_status?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          service_category?: Database["public"]["Enums"]["categories"] | null
          service_provider?: string | null
          service_type?: Database["public"]["Enums"]["service_types"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Appointment_service_provider_fkey"
            columns: ["service_provider"]
            isOneToOne: false
            referencedRelation: "Service_Providers"
            referencedColumns: ["Provider_ID"]
          },
          {
            foreignKeyName: "Appointment_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          id: number
          image_url: string | null
          Name: string | null
          service_types: Database["public"]["Enums"]["service_types"] | null
        }
        Insert: {
          created_at?: string
          id?: number
          image_url?: string | null
          Name?: string | null
          service_types?: Database["public"]["Enums"]["service_types"] | null
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string | null
          Name?: string | null
          service_types?: Database["public"]["Enums"]["service_types"] | null
        }
        Relationships: []
      }
      Service_Providers: {
        Row: {
          address: string | null
          company_name: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          id: number
          Provider_ID: string | null
          Telephone: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: number
          Provider_ID?: string | null
          Telephone?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: number
          Provider_ID?: string | null
          Telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Service_Providers_Provider_ID_fkey"
            columns: ["Provider_ID"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Services: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration: number | null
          end_date: string | null
          id: number
          image: string | null
          name: string | null
          price: number | null
          provider_id: string | null
          quantity: number | null
          start_date: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          end_date?: string | null
          id?: number
          image?: string | null
          name?: string | null
          price?: number | null
          provider_id?: string | null
          quantity?: number | null
          start_date?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          end_date?: string | null
          id?: number
          image?: string | null
          name?: string | null
          price?: number | null
          provider_id?: string | null
          quantity?: number | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "User_Business"
            referencedColumns: ["owner"]
          },
        ]
      }
      sliders: {
        Row: {
          created_at: string
          id: number
          slides_url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          slides_url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          slides_url?: string | null
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Business: {
        Row: {
          address: string | null
          business_name: string | null
          coordinates: Json
          created_at: string
          description: string | null
          id: number
          owner: string | null
          provider_email: string | null
          telephone: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string | null
          coordinates: Json
          created_at?: string
          description?: string | null
          id?: number
          owner?: string | null
          provider_email?: string | null
          telephone?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string | null
          coordinates?: Json
          created_at?: string
          description?: string | null
          id?: number
          owner?: string | null
          provider_email?: string | null
          telephone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "User_Business_owner_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          password: string | null
          phone_number: string | null
          profileImage: string | null
          user_type: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          password?: string | null
          phone_number?: string | null
          profileImage?: string | null
          user_type?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          password?: string | null
          phone_number?: string | null
          profileImage?: string | null
          user_type?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string
          id: number
          image_url: string | null
          licence_plate: string | null
          model: string | null
          name: string | null
          owner: string | null
          year: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          licence_plate?: string | null
          model?: string | null
          name?: string | null
          owner?: string | null
          year?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          licence_plate?: string | null
          model?: string | null
          name?: string | null
          owner?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      categories:
        | "Maintenance"
        | "Repair"
        | "Cleaning and Detailing"
        | "Inspection Services"
        | "Tire Services"
        | "Rental Services"
        | "Sales and Parts"
        | "Emergency Services"
        | "Customization and Performance Services"
        | "Insurance and Warranty Services"
        | "Miscellaneous Services"
      service_types: "Appointment" | "Sales"
      user_type: "car_owner" | "service_provider"
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

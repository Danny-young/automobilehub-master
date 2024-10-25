export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Appointment: {
        Row: {
          appointment_date: string | null
          appointment_status: string | null
          appointment_type: string | null
          created_at: string
          id: number
          notes: string | null
          service_category: Database["public"]["Enums"]["categories"] | null
          service_type: Database["public"]["Enums"]["service_types"] | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_status?: string | null
          appointment_type?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          service_category?: Database["public"]["Enums"]["categories"] | null
          service_type?: Database["public"]["Enums"]["service_types"] | null
        }
        Update: {
          appointment_date?: string | null
          appointment_status?: string | null
          appointment_type?: string | null
          created_at?: string
          id?: number
          notes?: string | null
          service_category?: Database["public"]["Enums"]["categories"] | null
          service_type?: Database["public"]["Enums"]["service_types"] | null
        }
        Relationships: []
      }
      booking: {
        Row: {
          appointment_date: string | null
          appointment_time: string | null
          appointment_type: string | null
          created_at: string
          id: number
          service_category: string | null
          service_id: number | null
          service_provider: string | null
          user_id: string | null
          vehicle_type: number | null
        }
        Insert: {
          appointment_date?: string | null
          appointment_time?: string | null
          appointment_type?: string | null
          created_at?: string
          id?: number
          service_category?: string | null
          service_id?: number | null
          service_provider?: string | null
          user_id?: string | null
          vehicle_type?: number | null
        }
        Update: {
          appointment_date?: string | null
          appointment_time?: string | null
          appointment_type?: string | null
          created_at?: string
          id?: number
          service_category?: string | null
          service_id?: number | null
          service_provider?: string | null
          user_id?: string | null
          vehicle_type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_service_provider_fkey1"
            columns: ["service_provider"]
            isOneToOne: false
            referencedRelation: "User_Business"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "booking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_vehicle_type_fkey"
            columns: ["vehicle_type"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_and_detailing: {
        Row: {
          add_ons: string | null
          cleaning_package: string | null
          created_at: string
          id: number
          service_id: number | null
          type: string | null
        }
        Insert: {
          add_ons?: string | null
          cleaning_package?: string | null
          created_at?: string
          id?: number
          service_id?: number | null
          type?: string | null
        }
        Update: {
          add_ons?: string | null
          cleaning_package?: string | null
          created_at?: string
          id?: number
          service_id?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_and_detailing_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      customization_and_performance: {
        Row: {
          created_at: string
          customization_type: string | null
          id: number
          parts_material: string | null
          service_id: number | null
        }
        Insert: {
          created_at?: string
          customization_type?: string | null
          id?: number
          parts_material?: string | null
          service_id?: number | null
        }
        Update: {
          created_at?: string
          customization_type?: string | null
          id?: number
          parts_material?: string | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "customization_and_performance_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_service: {
        Row: {
          availability: string | null
          created_at: string
          emergency_type: string | null
          id: number
          response_time: string | null
          service_id: number | null
        }
        Insert: {
          availability?: string | null
          created_at?: string
          emergency_type?: string | null
          id?: number
          response_time?: string | null
          service_id?: number | null
        }
        Update: {
          availability?: string | null
          created_at?: string
          emergency_type?: string | null
          id?: number
          response_time?: string | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      inspection_service: {
        Row: {
          areas_covered: string | null
          created_at: string
          id: number
          inspection_type: string | null
          report_provided: boolean | null
          service_id: number | null
        }
        Insert: {
          areas_covered?: string | null
          created_at?: string
          id?: number
          inspection_type?: string | null
          report_provided?: boolean | null
          service_id?: number | null
        }
        Update: {
          areas_covered?: string | null
          created_at?: string
          id?: number
          inspection_type?: string | null
          report_provided?: boolean | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inspection_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_service: {
        Row: {
          created_at: string
          estimated_time: string | null
          frequency: string | null
          id: number
          required_part: string | null
          service_id: number | null
        }
        Insert: {
          created_at?: string
          estimated_time?: string | null
          frequency?: string | null
          id?: number
          required_part?: string | null
          service_id?: number | null
        }
        Update: {
          created_at?: string
          estimated_time?: string | null
          frequency?: string | null
          id?: number
          required_part?: string | null
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      miscellanous_service: {
        Row: {
          created_at: string
          id: number
          service_category: string | null
          service_id: number | null
          time_duration: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          service_category?: string | null
          service_id?: number | null
          time_duration?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          service_category?: string | null
          service_id?: number | null
          time_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "miscellanous_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_service: {
        Row: {
          created_at: string
          id: number
          rental_duration: string | null
          service_id: number | null
          vehicle_model: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          rental_duration?: string | null
          service_id?: number | null
          vehicle_model?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          rental_duration?: string | null
          service_id?: number | null
          vehicle_model?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_service: {
        Row: {
          created_at: string
          id: number
          issue_type: string | null
          parts_required: string | null
          service_id: number | null
          severity_level: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          issue_type?: string | null
          parts_required?: string | null
          service_id?: number | null
          severity_level?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          issue_type?: string | null
          parts_required?: string | null
          service_id?: number | null
          severity_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "repair_service_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_and_parts: {
        Row: {
          availability: boolean | null
          category: string | null
          created_at: string
          id: number
          service_id: number | null
          warrantyProvided: boolean | null
        }
        Insert: {
          availability?: boolean | null
          category?: string | null
          created_at?: string
          id?: number
          service_id?: number | null
          warrantyProvided?: boolean | null
        }
        Update: {
          availability?: boolean | null
          category?: string | null
          created_at?: string
          id?: number
          service_id?: number | null
          warrantyProvided?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_and_parts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
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
          category: string
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
          category: string
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
          category?: string
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
      tire_services: {
        Row: {
          created_at: string
          id: number
          service_id: number | null
          service_type: string | null
          tire_brand: string | null
          tire_type: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          service_id?: number | null
          service_type?: string | null
          tire_brand?: string | null
          tire_type?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          service_id?: number | null
          service_type?: string | null
          tire_brand?: string | null
          tire_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tire_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "Services"
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
          make: string | null
          model: string | null
          owner: string | null
          year: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          licence_plate?: string | null
          make?: string | null
          model?: string | null
          owner?: string | null
          year?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: number
          image_url?: string | null
          licence_plate?: string | null
          make?: string | null
          model?: string | null
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

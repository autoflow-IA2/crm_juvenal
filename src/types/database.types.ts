export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ClientStatus = 'active' | 'inactive' | 'archived'
export type SessionType = 'individual_therapy' | 'coaching' | 'couples_therapy' | 'group_session' | 'first_consultation' | 'follow_up'
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type TransactionType = 'income' | 'expense'
export type TransactionCategory = 'session' | 'package' | 'product' | 'rent' | 'utilities' | 'marketing' | 'software' | 'equipment' | 'other'
export type PaymentMethod = 'cash' | 'pix' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'health_insurance'
export type TransactionStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'
export type PackageStatus = 'active' | 'expired' | 'completed'

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string | null
          phone: string
          birth_date: string | null
          cpf: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          notes: string | null
          status: ClientStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email?: string | null
          phone: string
          birth_date?: string | null
          cpf?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          notes?: string | null
          status?: ClientStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string
          birth_date?: string | null
          cpf?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          notes?: string | null
          status?: ClientStatus
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          client_id: string
          date: string
          duration: number
          type: SessionType
          status: AppointmentStatus
          notes: string | null
          session_notes: string | null
          price: number
          is_paid: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          date: string
          duration?: number
          type: SessionType
          status?: AppointmentStatus
          notes?: string | null
          session_notes?: string | null
          price: number
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          date?: string
          duration?: number
          type?: SessionType
          status?: AppointmentStatus
          notes?: string | null
          session_notes?: string | null
          price?: number
          is_paid?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          client_id: string | null
          appointment_id: string | null
          type: TransactionType
          category: TransactionCategory
          description: string
          amount: number
          date: string
          payment_method: PaymentMethod | null
          status: TransactionStatus
          due_date: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id?: string | null
          appointment_id?: string | null
          type: TransactionType
          category: TransactionCategory
          description: string
          amount: number
          date: string
          payment_method?: PaymentMethod | null
          status?: TransactionStatus
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string | null
          appointment_id?: string | null
          type?: TransactionType
          category?: TransactionCategory
          description?: string
          amount?: number
          date?: string
          payment_method?: PaymentMethod | null
          status?: TransactionStatus
          due_date?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      session_packages: {
        Row: {
          id: string
          user_id: string
          name: string
          sessions: number
          price: number
          validity_days: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          sessions: number
          price: number
          validity_days?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          sessions?: number
          price?: number
          validity_days?: number
          is_active?: boolean
          created_at?: string
        }
      }
      client_session_packages: {
        Row: {
          id: string
          user_id: string
          client_id: string
          package_id: string
          sessions_used: number
          purchase_date: string
          expiration_date: string
          status: PackageStatus
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          package_id: string
          sessions_used?: number
          purchase_date?: string
          expiration_date: string
          status?: PackageStatus
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          package_id?: string
          sessions_used?: number
          purchase_date?: string
          expiration_date?: string
          status?: PackageStatus
        }
      }
      working_hours: {
        Row: {
          id: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_active?: boolean
        }
      }
      blocked_slots: {
        Row: {
          id: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          reason: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          start_time: string
          end_time: string
          reason?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          start_time?: string
          end_time?: string
          reason?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          clinic_name: string | null
          clinic_logo_url: string | null
          clinic_address: string | null
          clinic_phone: string | null
          default_session_duration: number
          default_session_price: number | null
          appointment_reminder_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clinic_name?: string | null
          clinic_logo_url?: string | null
          clinic_address?: string | null
          clinic_phone?: string | null
          default_session_duration?: number
          default_session_price?: number | null
          appointment_reminder_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clinic_name?: string | null
          clinic_logo_url?: string | null
          clinic_address?: string | null
          clinic_phone?: string | null
          default_session_duration?: number
          default_session_price?: number | null
          appointment_reminder_hours?: number
          created_at?: string
          updated_at?: string
        }
      }
      service_types: {
        Row: {
          id: string
          user_id: string
          name: string
          duration: number
          price: number
          color: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          duration?: number
          price: number
          color?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          duration?: number
          price?: number
          color?: string
          is_active?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      client_status: ClientStatus
      session_type: SessionType
      appointment_status: AppointmentStatus
      transaction_type: TransactionType
      transaction_category: TransactionCategory
      payment_method: PaymentMethod
      transaction_status: TransactionStatus
      package_status: PackageStatus
    }
  }
}

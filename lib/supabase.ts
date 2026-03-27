import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ccpmyfhgzayjkjmcbwwq.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcG15ZmhnemF5amtqbWNid3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTE3ODgsImV4cCI6MjA4ODM4Nzc4OH0.iqV8if9KV_mxxvFzOa__8ZzRLgqCbLIkD5xEffWlWv8"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          password_hash: string
          role: "Patient" | "Doctor" | "Admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          password_hash: string
          role: "Patient" | "Doctor" | "Admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          password_hash?: string
          role?: "Patient" | "Doctor" | "Admin"
          created_at?: string
          updated_at?: string
        }
      }
      patient_records: {
        Row: {
          id: string
          patient_name: string
          patient_id: string
          age: number
          gender: string
          last_scan_date: string
          risk_level: "Normal" | "Prediabetic" | "Diabetic"
          added_by: string
          added_date: string
          user_id: string | null
          created_at: string
          updated_at: string
        }
      }
      consultations: {
        Row: {
          id: string
          patient_name: string
          doctor_name: string
          date: string
          notes: string
          status: "completed" | "pending" | "cancelled"
          risk_level: "Normal" | "Prediabetic" | "Diabetic"
          patient_id: string | null
          doctor_id: string | null
          created_at: string
          updated_at: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_name: string
          doctor_name: string
          date: string
          time: string
          type: "checkup" | "followup" | "emergency" | "consultation"
          status: "scheduled" | "completed" | "cancelled"
          notes: string | null
          patient_id: string | null
          doctor_id: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Patient Records
export const savePatientRecord = async (record: any) => {
  const { data, error } = await supabase
    .from("patient_records")
    .insert([record])
    .select()
  return { data, error }
}

export const getPatientRecords = async () => {
  const { data, error } = await supabase
    .from("patient_records")
    .select("*")
    .order("created_at", { ascending: false })
  return { data, error }
}

// Consultations
export const saveConsultation = async (consultation: any) => {
  const { data, error } = await supabase
    .from("consultations")
    .insert([consultation])
    .select()
  return { data, error }
}

export const getConsultations = async () => {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("created_at", { ascending: false })
  return { data, error }
}

// Appointments
export const saveAppointment = async (appointment: any) => {
  const { data, error } = await supabase
    .from("appointments")
    .insert([appointment])
    .select()
  return { data, error }
}

export const getAppointments = async () => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("date", { ascending: true })
  return { data, error }
}

export const updateAppointment = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select()
  return { data, error }
}

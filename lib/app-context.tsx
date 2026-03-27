"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export interface GlucoseReading {
  date: string
  glucose: number
  bmi?: number
  heartRate?: number
  systolic?: number
  diastolic?: number
}

export interface ScanResult {
  riskLevel: "Normal" | "Prediabetic" | "Diabetic"
  confidence: number
  glucoseAvg: number
  bmiValue: number
  heartRate: number
  readings: GlucoseReading[]
  recommendations: string[]
  pdfContent?: string
  patientInfo?: {
    name: string
    id: string
    age: number
    gender: string
  }
}

export interface Alert {
  id: string
  type: "spike" | "hypo" | "normal" | "warning"
  title: string
  message: string
  timestamp: number
  read: boolean
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface Consultation {
  id: string
  patientName: string
  doctorName: string
  date: string
  notes: string
  status: "completed" | "pending" | "cancelled"
  riskLevel: "Normal" | "Prediabetic" | "Diabetic"
}

export interface Appointment {
  id: string
  patientName: string
  doctorName: string
  date: string
  time: string
  type: "checkup" | "followup" | "emergency" | "consultation"
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
}

export interface PatientRecord {
  id: string
  patientName: string
  patientId: string
  age: number
  gender: string
  lastScanDate: string
  riskLevel: "Normal" | "Prediabetic" | "Diabetic"
  scanResult: ScanResult
  addedBy: string
  addedDate: string
}

interface AppContextType {
  isAuthenticated: boolean
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  scanResult: ScanResult | null
  setScanResult: (result: ScanResult | null) => void
  isScanning: boolean
  setIsScanning: (v: boolean) => void
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "timestamp" | "read">) => void
  markAlertRead: (id: string) => void
  chatMessages: ChatMessage[]
  addChatMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void
  consultations: Consultation[]
  addConsultation: (c: Omit<Consultation, "id">) => void
  appointments: Appointment[]
  addAppointment: (a: Omit<Appointment, "id">) => void
  updateAppointment: (id: string, status: Appointment["status"]) => void
  patientRecords: PatientRecord[]
  addPatientRecord: (record: Omit<PatientRecord, "id" | "addedDate">) => void
  selectedPatient: PatientRecord | null
  setSelectedPatient: (patient: PatientRecord | null) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const DEMO_READINGS: GlucoseReading[] = [
  { date: "Jan 1", glucose: 95, bmi: 24.2, heartRate: 72, systolic: 118, diastolic: 76 },
  { date: "Jan 8", glucose: 102, bmi: 24.3, heartRate: 74, systolic: 120, diastolic: 78 },
  { date: "Jan 15", glucose: 110, bmi: 24.5, heartRate: 76, systolic: 122, diastolic: 79 },
  { date: "Jan 22", glucose: 118, bmi: 24.8, heartRate: 78, systolic: 126, diastolic: 82 },
  { date: "Jan 29", glucose: 130, bmi: 25.1, heartRate: 80, systolic: 130, diastolic: 84 },
  { date: "Feb 5", glucose: 142, bmi: 25.4, heartRate: 82, systolic: 134, diastolic: 86 },
  { date: "Feb 12", glucose: 155, bmi: 25.6, heartRate: 84, systolic: 138, diastolic: 88 },
  { date: "Feb 19", glucose: 148, bmi: 25.5, heartRate: 81, systolic: 132, diastolic: 85 },
  { date: "Feb 26", glucose: 160, bmi: 25.8, heartRate: 86, systolic: 140, diastolic: 90 },
  { date: "Mar 5", glucose: 145, bmi: 25.3, heartRate: 79, systolic: 128, diastolic: 83 },
  { date: "Mar 12", glucose: 138, bmi: 25.0, heartRate: 77, systolic: 124, diastolic: 80 },
  { date: "Mar 19", glucose: 128, bmi: 24.7, heartRate: 75, systolic: 121, diastolic: 78 },
]

const INITIAL_ALERTS: Alert[] = []

const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "1",
    patientName: "Demo User",
    doctorName: "Dr. Priya Sharma",
    date: "Feb 28, 2026",
    notes: "Initial diabetes screening - Prediabetic range detected",
    status: "completed",
    riskLevel: "Prediabetic",
  },
  {
    id: "2",
    patientName: "Alice Johnson",
    doctorName: "Dr. Priya Sharma",
    date: "Feb 25, 2026",
    notes: "Routine check-up - All parameters normal",
    status: "completed",
    riskLevel: "Normal",
  },
  {
    id: "3",
    patientName: "Bob Martinez",
    doctorName: "Dr. Priya Sharma",
    date: "Feb 22, 2026",
    notes: "Follow-up for diabetes management - Medication adjustment needed",
    status: "completed",
    riskLevel: "Diabetic",
  },
]

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    patientName: "Demo User",
    doctorName: "Dr. Priya Sharma",
    date: "2026-03-15",
    time: "10:00 AM",
    type: "followup",
    status: "scheduled",
    notes: "Follow-up for prediabetic management",
  },
  {
    id: "2",
    patientName: "Alice Johnson",
    doctorName: "Dr. Priya Sharma",
    date: "2026-03-20",
    time: "2:30 PM",
    type: "checkup",
    status: "scheduled",
    notes: "Annual health check-up",
  },
  {
    id: "3",
    patientName: "Bob Martinez",
    doctorName: "Dr. Priya Sharma",
    date: "2026-03-10",
    time: "11:00 AM",
    type: "consultation",
    status: "scheduled",
    notes: "Diabetes medication review",
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AppContextType["user"]>(null)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [consultations, setConsultations] = useState<Consultation[]>(INITIAL_CONSULTATIONS)
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([])
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null)

  // Load data from localStorage on mount and check Supabase session
  useEffect(() => {
    const initAuth = async () => {
      // Check Supabase session
      const { supabase } = await import("@/lib/supabase")
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setIsAuthenticated(true)
        setUser({
          name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
          email: session.user.email || "",
        })
      } else if (typeof window !== "undefined") {
        // Fallback to localStorage for backward compatibility
        const savedAuth = localStorage.getItem("glucovision_auth")
        const savedUser = localStorage.getItem("glucovision_user")
        
        if (savedAuth === "true" && savedUser) {
          setIsAuthenticated(true)
          setUser(JSON.parse(savedUser))
        }
      }
      
      // Load other data from localStorage
      if (typeof window !== "undefined") {
        const savedScanResult = localStorage.getItem("glucovision_scanResult")
        const savedAlerts = localStorage.getItem("glucovision_alerts")
        const savedConsultations = localStorage.getItem("glucovision_consultations")
        const savedAppointments = localStorage.getItem("glucovision_appointments")
        const savedPatientRecords = localStorage.getItem("glucovision_patientRecords")

        if (savedScanResult) {
          setScanResult(JSON.parse(savedScanResult))
        }
        if (savedAlerts) {
          setAlerts(JSON.parse(savedAlerts))
        } else {
          setAlerts(INITIAL_ALERTS)
        }
        if (savedConsultations) {
          setConsultations(JSON.parse(savedConsultations))
        } else {
          setConsultations(INITIAL_CONSULTATIONS)
        }
        if (savedAppointments) {
          setAppointments(JSON.parse(savedAppointments))
        } else {
          setAppointments(INITIAL_APPOINTMENTS)
        }
        if (savedPatientRecords) {
          setPatientRecords(JSON.parse(savedPatientRecords))
        }
      }
    }
    
    initAuth()
    
    // Listen for auth changes
    const setupAuthListener = async () => {
      const { supabase } = await import("@/lib/supabase")
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session?.user) {
            setIsAuthenticated(true)
            setUser({
              name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
              email: session.user.email || "",
            })
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false)
            setUser(null)
          }
        }
      )
      
      return subscription
    }
    
    let subscription: any
    setupAuthListener().then(sub => { subscription = sub })
    
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glucovision_auth", isAuthenticated.toString())
      if (user) {
        localStorage.setItem("glucovision_user", JSON.stringify(user))
      } else {
        localStorage.removeItem("glucovision_user")
      }
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (typeof window !== "undefined" && scanResult) {
      localStorage.setItem("glucovision_scanResult", JSON.stringify(scanResult))
    }
  }, [scanResult])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glucovision_alerts", JSON.stringify(alerts))
    }
  }, [alerts])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glucovision_consultations", JSON.stringify(consultations))
    }
  }, [consultations])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glucovision_appointments", JSON.stringify(appointments))
    }
  }, [appointments])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("glucovision_patientRecords", JSON.stringify(patientRecords))
    }
  }, [patientRecords])

  const login = useCallback(async (email: string, password: string) => {
    // Use Supabase authentication
    const { data, error } = await import("@/lib/supabase").then(m => m.supabase.auth.signInWithPassword({
      email,
      password,
    }))
    
    if (error) {
      throw new Error(error.message)
    }
    
    if (data.user) {
      setIsAuthenticated(true)
      setUser({ 
        name: data.user.user_metadata?.full_name || email.split("@")[0], 
        email: data.user.email || email
      })
      return true
    }
    
    throw new Error("Login failed")
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string, role: string) => {
    // Use Supabase authentication
    const { data, error } = await import("@/lib/supabase").then(m => m.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        },
      },
    }))
    
    if (error) {
      throw new Error(error.message)
    }
    
    if (data.user) {
      setIsAuthenticated(true)
      setUser({ name, email })
      return true
    }
    
    throw new Error("Signup failed")
  }, [])

  const logout = useCallback(async () => {
    // Sign out from Supabase
    await import("@/lib/supabase").then(m => m.supabase.auth.signOut())
    
    setIsAuthenticated(false)
    setUser(null)
    setScanResult(null)
    // Clear localStorage on logout
    if (typeof window !== "undefined") {
      localStorage.removeItem("glucovision_auth")
      localStorage.removeItem("glucovision_user")
      localStorage.removeItem("glucovision_scanResult")
    }
  }, [])

  const addAlert = useCallback((alert: Omit<Alert, "id" | "timestamp" | "read">) => {
    setAlerts((prev) => [
      { ...alert, id: Date.now().toString(), timestamp: Date.now(), read: false },
      ...prev,
    ])
  }, [])

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }, [])

  const addChatMessage = useCallback((msg: Omit<ChatMessage, "id" | "timestamp">) => {
    setChatMessages((prev) => [...prev, { ...msg, id: Date.now().toString(), timestamp: Date.now() }])
  }, [])

  const addConsultation = useCallback((c: Omit<Consultation, "id">) => {
    setConsultations((prev) => [{ ...c, id: Date.now().toString() }, ...prev])
  }, [])

  const addAppointment = useCallback((a: Omit<Appointment, "id">) => {
    setAppointments((prev) => [{ ...a, id: Date.now().toString() }, ...prev])
  }, [])

  const updateAppointment = useCallback((id: string, status: Appointment["status"]) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }, [])

  const addPatientRecord = useCallback((record: Omit<PatientRecord, "id" | "addedDate">) => {
    const newRecord: PatientRecord = {
      ...record,
      id: Date.now().toString(),
      addedDate: new Date().toISOString(),
    }
    setPatientRecords((prev) => {
      // Check if patient already exists, update if so
      const existingIndex = prev.findIndex(p => p.patientId === record.patientId)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = newRecord
        return updated
      }
      return [newRecord, ...prev]
    })
  }, [])

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout,
        scanResult,
        setScanResult,
        isScanning,
        setIsScanning,
        alerts,
        addAlert,
        markAlertRead,
        chatMessages,
        addChatMessage,
        consultations,
        addConsultation,
        appointments,
        addAppointment,
        updateAppointment,
        patientRecords,
        addPatientRecord,
        selectedPatient,
        setSelectedPatient,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export { DEMO_READINGS }

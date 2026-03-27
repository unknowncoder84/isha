"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppointments()
    
    // Real-time subscription
    const subscription = supabase
      .channel('appointments_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'appointments' 
      }, () => {
        loadAppointments()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .order("date", { ascending: true })
        .order("time", { ascending: true })

      if (error) throw error
      setAppointments(data || [])
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-[#7a8ba3]">Loading appointments...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#e8f0fe]">Appointments</h1>
        <p className="text-[#7a8ba3]">Manage patient appointments</p>
      </div>

      <div className="grid gap-4">
        {appointments.length > 0 ? (
          appointments.map((apt) => (
            <Card key={apt.id} className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[rgba(0,212,255,0.2)] flex items-center justify-center">
                    <User className="w-6 h-6 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#e8f0fe]">{apt.patient_name}</h3>
                    <p className="text-sm text-[#7a8ba3]">{apt.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-[#00d4ff] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{new Date(apt.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7a8ba3]">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{apt.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="glass-card p-12 border-[rgba(255,255,255,0.1)] text-center">
            <p className="text-[#7a8ba3]">No appointments scheduled</p>
          </Card>
        )}
      </div>
    </div>
  )
}

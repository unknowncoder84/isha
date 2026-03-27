"use client"

import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DoctorConsultationsPage() {
  const [consultations, setConsultations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConsultations()
    
    // Real-time subscription
    const subscription = supabase
      .channel('consultations_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'consultations' 
      }, () => {
        loadConsultations()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from("consultations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setConsultations(data || [])
    } catch (error) {
      console.error("Error loading consultations:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-[#7a8ba3]">Loading consultations...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#e8f0fe]">Consultations</h1>
        <p className="text-[#7a8ba3]">View consultation history</p>
      </div>

      <div className="grid gap-4">
        {consultations.length > 0 ? (
          consultations.map((consult) => (
            <Card key={consult.id} className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-[rgba(0,230,118,0.2)] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-[#00e676]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-[#e8f0fe]">{consult.patient_name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      consult.status === 'completed' ? 'bg-[rgba(0,230,118,0.2)] text-[#00e676]' :
                      consult.status === 'pending' ? 'bg-[rgba(255,214,0,0.2)] text-[#ffd600]' :
                      'bg-[rgba(255,76,106,0.2)] text-[#ff4c6a]'
                    }`}>
                      {consult.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#7a8ba3] mb-2">{new Date(consult.date).toLocaleDateString()}</p>
                  {consult.notes && (
                    <p className="text-sm text-[#c8d6e5]">{consult.notes}</p>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="glass-card p-12 border-[rgba(255,255,255,0.1)] text-center">
            <p className="text-[#7a8ba3]">No consultations recorded</p>
          </Card>
        )}
      </div>
    </div>
  )
}

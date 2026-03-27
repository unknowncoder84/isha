"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Bell } from "lucide-react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DoctorAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAlerts()
    
    // Real-time subscription
    const subscription = supabase
      .channel('alerts_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'alerts' 
      }, () => {
        loadAlerts()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const loadAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setAlerts(data || [])
    } catch (error) {
      console.error("Error loading alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-[#7a8ba3]">Loading alerts...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#e8f0fe]">Health Alerts</h1>
        <p className="text-[#7a8ba3]">Monitor patient health alerts</p>
      </div>

      <div className="grid gap-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id} className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                  alert.type === 'spike' ? 'bg-[rgba(255,76,106,0.2)]' :
                  alert.type === 'hypo' ? 'bg-[rgba(255,214,0,0.2)]' :
                  'bg-[rgba(0,230,118,0.2)]'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    alert.type === 'spike' ? 'text-[#ff4c6a]' :
                    alert.type === 'hypo' ? 'text-[#ffd600]' :
                    'text-[#00e676]'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#e8f0fe] mb-1">{alert.title}</h3>
                  <p className="text-sm text-[#c8d6e5] mb-2">{alert.message}</p>
                  <p className="text-xs text-[#7a8ba3]">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                {!alert.read && (
                  <Bell className="w-5 h-5 text-[#00d4ff]" />
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="glass-card p-12 border-[rgba(255,255,255,0.1)] text-center">
            <p className="text-[#7a8ba3]">No alerts at this time</p>
          </Card>
        )}
      </div>
    </div>
  )
}

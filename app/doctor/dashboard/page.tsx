"use client"

import { useEffect, useState } from "react"
import { Users, Calendar, FileText, TrendingUp, Activity, AlertCircle, UserPlus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DoctorDashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingConsultations: 0,
    criticalAlerts: 0,
  })
  const [recentPatients, setRecentPatients] = useState<any[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    
    // Set up real-time subscriptions for live updates
    const patientsSubscription = supabase
      .channel('patient_records_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patient_records' }, () => {
        loadDashboardData()
      })
      .subscribe()

    const appointmentsSubscription = supabase
      .channel('appointments_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        loadDashboardData()
      })
      .subscribe()

    const consultationsSubscription = supabase
      .channel('consultations_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'consultations' }, () => {
        loadDashboardData()
      })
      .subscribe()

    const alertsSubscription = supabase
      .channel('alerts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
        loadDashboardData()
      })
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      patientsSubscription.unsubscribe()
      appointmentsSubscription.unsubscribe()
      consultationsSubscription.unsubscribe()
      alertsSubscription.unsubscribe()
    }
  }, [])

  const loadDashboardData = async () => {
    try {
      // Get total patients
      const { data: patients, error: patientsError } = await supabase
        .from("patient_records")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (!patientsError && patients) {
        setRecentPatients(patients)
        setStats(prev => ({ ...prev, totalPatients: patients.length }))
      }

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0]
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select("*")
        .eq("date", today)
        .order("time", { ascending: true })

      if (!appointmentsError && appointments) {
        setUpcomingAppointments(appointments)
        setStats(prev => ({ ...prev, todayAppointments: appointments.length }))
      }

      // Get pending consultations
      const { data: consultations, error: consultationsError } = await supabase
        .from("consultations")
        .select("*", { count: "exact" })
        .eq("status", "pending")

      if (!consultationsError && consultations) {
        setStats(prev => ({ ...prev, pendingConsultations: consultations.length }))
      }

      // Get critical alerts
      const { data: alerts, error: alertsError } = await supabase
        .from("alerts")
        .select("*", { count: "exact" })
        .eq("type", "spike")
        .eq("read", false)

      if (!alertsError && alerts) {
        setStats(prev => ({ ...prev, criticalAlerts: alerts.length }))
      }

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "from-[#00d4ff] to-[#00b8d4]",
      bgColor: "rgba(0,212,255,0.1)",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: "from-[#00e676] to-[#00c853]",
      bgColor: "rgba(0,230,118,0.1)",
    },
    {
      title: "Pending Consultations",
      value: stats.pendingConsultations,
      icon: FileText,
      color: "from-[#ffd600] to-[#ffab00]",
      bgColor: "rgba(255,214,0,0.1)",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      icon: AlertCircle,
      color: "from-[#ff4c6a] to-[#ff1744]",
      bgColor: "rgba(255,76,106,0.1)",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#7a8ba3]">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#e8f0fe] mb-2">Doctor Dashboard</h1>
        <p className="text-[#7a8ba3]">Welcome back, Dr. Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            className="glass-card p-6 border-[rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
              </div>
              <TrendingUp className="w-5 h-5 text-[#00e676]" />
            </div>
            <h3 className="text-2xl font-bold text-[#e8f0fe] mb-1">{stat.value}</h3>
            <p className="text-sm text-[#7a8ba3]">{stat.title}</p>
          </Card>
        ))}
      </div>

      {/* Recent Patients & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl font-bold text-[#e8f0fe] mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00d4ff]" />
            Recent Patients
          </h2>
          <div className="space-y-3">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[#e8f0fe]">{patient.patient_name}</p>
                    <p className="text-sm text-[#7a8ba3]">
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.risk_level === "Diabetic"
                          ? "bg-[rgba(255,76,106,0.2)] text-[#ff4c6a]"
                          : patient.risk_level === "Prediabetic"
                          ? "bg-[rgba(255,214,0,0.2)] text-[#ffd600]"
                          : "bg-[rgba(0,230,118,0.2)] text-[#00e676]"
                      }`}
                    >
                      {patient.risk_level}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#7a8ba3] py-8">No patients yet</p>
            )}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
          <h2 className="text-xl font-bold text-[#e8f0fe] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00e676]" />
            Today's Appointments
          </h2>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <div>
                    <p className="font-medium text-[#e8f0fe]">{appointment.patient_name}</p>
                    <p className="text-sm text-[#7a8ba3]">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#00d4ff]">{appointment.time}</p>
                    <span
                      className={`text-xs ${
                        appointment.status === "scheduled"
                          ? "text-[#00e676]"
                          : appointment.status === "completed"
                          ? "text-[#7a8ba3]"
                          : "text-[#ff4c6a]"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#7a8ba3] py-8">No appointments today</p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
        <h2 className="text-xl font-bold text-[#e8f0fe] mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ffd600]" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/doctor/dashboard/add-patient'}
            className="p-4 rounded-lg bg-[rgba(0,212,255,0.1)] hover:bg-[rgba(0,212,255,0.2)] transition-colors text-center cursor-pointer"
          >
            <UserPlus className="w-6 h-6 text-[#00d4ff] mx-auto mb-2" />
            <p className="text-sm text-[#e8f0fe]">Add Patient</p>
          </button>
          <button 
            onClick={() => window.location.href = '/doctor/dashboard/appointments'}
            className="p-4 rounded-lg bg-[rgba(0,230,118,0.1)] hover:bg-[rgba(0,230,118,0.2)] transition-colors text-center cursor-pointer"
          >
            <Calendar className="w-6 h-6 text-[#00e676] mx-auto mb-2" />
            <p className="text-sm text-[#e8f0fe]">Schedule</p>
          </button>
          <button 
            onClick={() => window.location.href = '/doctor/dashboard/consultations'}
            className="p-4 rounded-lg bg-[rgba(255,214,0,0.1)] hover:bg-[rgba(255,214,0,0.2)] transition-colors text-center cursor-pointer"
          >
            <FileText className="w-6 h-6 text-[#ffd600] mx-auto mb-2" />
            <p className="text-sm text-[#e8f0fe]">Consultation</p>
          </button>
          <button 
            onClick={() => window.location.href = '/doctor/dashboard/alerts'}
            className="p-4 rounded-lg bg-[rgba(255,76,106,0.1)] hover:bg-[rgba(255,76,106,0.2)] transition-colors text-center cursor-pointer"
          >
            <AlertCircle className="w-6 h-6 text-[#ff4c6a] mx-auto mb-2" />
            <p className="text-sm text-[#e8f0fe]">View Alerts</p>
          </button>
        </div>
      </Card>
    </div>
  )
}

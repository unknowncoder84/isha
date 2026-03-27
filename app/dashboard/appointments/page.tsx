"use client"

import { useState } from "react"
import {
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const statusConfig = {
  scheduled: { icon: Clock, color: "#3b82f6", bg: "bg-blue-500/20", label: "Scheduled" },
  completed: { icon: CheckCircle2, color: "#10b981", bg: "bg-emerald-500/20", label: "Completed" },
  cancelled: { icon: XCircle, color: "#ef4444", bg: "bg-red-500/20", label: "Cancelled" },
}

const typeConfig: Record<string, { color: string; label: string; bg: string }> = {
  checkup: { color: "#3b82f6", label: "Check-up", bg: "bg-blue-500/20" },
  followup: { color: "#10b981", label: "Follow-up", bg: "bg-emerald-500/20" },
  emergency: { color: "#ef4444", label: "Emergency", bg: "bg-red-500/20" },
  consultation: { color: "#f59e0b", label: "Consultation", bg: "bg-amber-500/20" },
}

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointment, user } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [doctorName, setDoctorName] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [type, setType] = useState<"checkup" | "followup" | "emergency" | "consultation">("checkup")
  const [notes, setNotes] = useState("")

  const upcoming = appointments.filter((a) => a.status === "scheduled").sort((a, b) => a.date.localeCompare(b.date))
  const past = appointments.filter((a) => a.status !== "scheduled").sort((a, b) => b.date.localeCompare(a.date))

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!date || !time) return
    addAppointment({
      patientName: user?.name || "Patient",
      doctorName: doctorName || "Dr. Sarah Chen",
      date,
      time,
      type,
      status: "scheduled",
      notes: notes.trim() || undefined,
    })
    setDoctorName("")
    setDate("")
    setTime("")
    setType("checkup")
    setNotes("")
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-500" />
            Appointment Reminders
          </h1>
          <p className="text-sm text-gray-400">
            Set reminders for your upcoming medical appointments
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Set Reminder
        </Button>
      </div>

      {/* Reminder form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-semibold text-white">Set Appointment Reminder</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="appt-doctor" className="text-sm text-gray-400 mb-1 block font-medium">Doctor / Clinic</label>
              <input
                id="appt-doctor"
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Dr. Sarah Chen"
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="appt-type" className="text-sm text-gray-400 mb-1 block font-medium">Appointment Type</label>
              <select
                id="appt-type"
                value={type}
                onChange={(e) => setType(e.target.value as typeof type)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              >
                <option value="checkup">Check-up</option>
                <option value="followup">Follow-up</option>
                <option value="consultation">Consultation</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label htmlFor="appt-date" className="text-sm text-gray-400 mb-1 block font-medium">Date</label>
              <input
                id="appt-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="appt-time" className="text-sm text-gray-400 mb-1 block font-medium">Time</label>
              <input
                id="appt-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              />
            </div>
          </div>
          <div>
            <label htmlFor="appt-notes" className="text-sm text-gray-400 mb-1 block font-medium">Reminder Notes (optional)</label>
            <input
              id="appt-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Reason for appointment or reminder notes..."
              className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-lg">
              Set Reminder
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Upcoming */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Upcoming Reminders ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-12 text-center shadow-xl">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No upcoming reminders</p>
            <p className="text-sm text-gray-500 mt-1">Click "Set Reminder" to add your first appointment reminder</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((a) => {
              const tConf = typeConfig[a.type]
              return (
                <div key={a.id} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-5 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-blue-400">{a.date.split("-")[2]}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-medium">
                          {new Date(a.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${tConf.bg}`}
                            style={{ color: tConf.color }}
                          >
                            {tConf.label}
                          </span>
                          <span className="text-sm text-blue-400 font-semibold">{a.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Stethoscope className="w-4 h-4 text-gray-500" />
                          <span className="text-white font-medium">{a.doctorName}</span>
                        </div>
                        {a.notes && (
                          <p className="text-xs text-gray-400 mt-1">{a.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateAppointment(a.id, "completed")}
                        className="text-emerald-400 hover:bg-emerald-500/10 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateAppointment(a.id, "cancelled")}
                        className="text-red-400 hover:bg-red-500/10 text-xs"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Past */}
      {past.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Past Reminders ({past.length})
          </h2>
          <div className="space-y-3">
            {past.map((a) => {
              const sConf = statusConfig[a.status]
              const tConf = typeConfig[a.type]
              const StatusIcon = sConf.icon
              return (
                <div key={a.id} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-5 opacity-70 hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sConf.bg}`}>
                      <StatusIcon className="w-6 h-6" style={{ color: sConf.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{a.date}</span>
                        <span className="text-xs text-gray-400">{a.time}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-semibold ${tConf.bg}`}
                          style={{ color: tConf.color }}
                        >
                          {tConf.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-300">{a.doctorName}</span>
                        {a.notes && (
                          <>
                            <span className="text-gray-600">•</span>
                            <span className="text-gray-400">{a.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: sConf.color }}>
                      {sConf.label === "Completed" ? "Done" : sConf.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

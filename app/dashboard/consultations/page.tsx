"use client"

import { useState } from "react"
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const statusConfig = {
  completed: { icon: CheckCircle2, color: "#10b981", bg: "bg-emerald-500/20", label: "Completed" },
  pending: { icon: Clock, color: "#f59e0b", bg: "bg-amber-500/20", label: "Pending" },
  cancelled: { icon: XCircle, color: "#ef4444", bg: "bg-red-500/20", label: "Cancelled" },
}

const riskConfig = {
  Normal: { color: "#10b981", bg: "bg-emerald-500/20", text: "text-emerald-400" },
  Prediabetic: { color: "#f59e0b", bg: "bg-amber-500/20", text: "text-amber-400" },
  Diabetic: { color: "#ef4444", bg: "bg-red-500/20", text: "text-red-400" },
}

export default function ConsultationsPage() {
  const { consultations, addConsultation, user } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [notes, setNotes] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const [patientName, setPatientName] = useState("")
  const [riskLevel, setRiskLevel] = useState<"Normal" | "Prediabetic" | "Diabetic">("Prediabetic")

  const isDoctor = user?.role === "Doctor" || user?.role === "Admin"

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!notes.trim()) return
    addConsultation({
      patientName: isDoctor ? (patientName || "Patient") : (user?.name || "Patient"),
      doctorName: isDoctor ? (user?.name || "Doctor") : (doctorName || "Dr. Sarah Chen"),
      date: new Date().toISOString().split("T")[0],
      notes: notes.trim(),
      status: "pending",
      riskLevel,
    })
    setNotes("")
    setDoctorName("")
    setPatientName("")
    setShowForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-500" />
            Consultation Logs
          </h1>
          <p className="text-sm text-gray-400">
            Track all patient-doctor consultations and notes
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Log
        </Button>
      </div>

      {/* New consultation form */}
      {showForm && (
        <form onSubmit={handleAdd} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 space-y-4 shadow-xl">
          <h3 className="text-lg font-semibold text-white">New Consultation Log</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {isDoctor ? (
              <div>
                <label htmlFor="patient-name" className="text-sm text-gray-400 mb-1 block font-medium">Patient Name</label>
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>
            ) : (
              <div>
                <label htmlFor="doc-name" className="text-sm text-gray-400 mb-1 block font-medium">Doctor Name</label>
                <input
                  id="doc-name"
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Dr. Sarah Chen"
                  className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                />
              </div>
            )}
            <div>
              <label htmlFor="risk-select" className="text-sm text-gray-400 mb-1 block font-medium">Risk Level</label>
              <select
                id="risk-select"
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as "Normal" | "Prediabetic" | "Diabetic")}
                className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
              >
                <option value="Normal">Normal</option>
                <option value="Prediabetic">Prediabetic</option>
                <option value="Diabetic">Diabetic</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="cons-notes" className="text-sm text-gray-400 mb-1 block font-medium">Consultation Notes</label>
            <textarea
              id="cons-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Enter consultation details, observations, and recommendations..."
              className="w-full px-4 py-3 rounded-lg bg-black border border-[#2a2a2a] text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-lg">
              Save Log
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Consultation list */}
      <div className="space-y-4">
        {consultations.length === 0 ? (
          <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-12 text-center shadow-xl">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No consultation logs yet</p>
            <p className="text-sm text-gray-500 mt-1">Click "New Log" to create your first consultation record</p>
          </div>
        ) : (
          consultations.map((c) => {
            const sConf = statusConfig[c.status]
            const rConf = riskConfig[c.riskLevel]
            const StatusIcon = sConf.icon
            return (
              <div key={c.id} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${sConf.bg}`}>
                      <StatusIcon className="w-6 h-6" style={{ color: sConf.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{c.date}</p>
                      <p className="text-xs text-gray-400">{sConf.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${rConf.bg} ${rConf.text}`}
                    >
                      {c.riskLevel}
                    </span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Patient:</span>
                    <span className="text-white font-medium">{c.patientName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400">Doctor:</span>
                    <span className="text-white font-medium">{c.doctorName}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-black border border-[#2a2a2a]">
                  <p className="text-sm text-gray-300 leading-relaxed">{c.notes}</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

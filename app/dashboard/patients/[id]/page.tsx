"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Droplets,
  Activity as ActivityIcon,
  Heart,
  Zap,
  AlertTriangle,
  Calendar,
  User,
  TrendingUp,
  TrendingDown,
  Weight,
  Gauge,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Area,
} from "recharts"

function StatusBadge({ level }: { level: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    Normal: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Normal" },
    Prediabetic: { bg: "bg-amber-500/20", text: "text-amber-400", label: "Prediabetic" },
    Diabetic: { bg: "bg-red-500/20", text: "text-red-400", label: "Diabetic" },
  }
  const c = config[level] || config.Normal
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-3 shadow-xl">
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  )
}

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { patientRecords } = useApp()
  const [patient, setPatient] = useState<typeof patientRecords[0] | null>(null)

  useEffect(() => {
    const patientId = params.id as string
    const found = patientRecords.find((p) => p.id === patientId)
    if (found) {
      setPatient(found)
    } else {
      router.push("/dashboard/patients")
    }
  }, [params.id, patientRecords, router])

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ActivityIcon className="w-12 h-12 text-gray-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading patient data...</p>
        </div>
      </div>
    )
  }

  const result = patient.scanResult
  const readings = result.readings
  const latestReading = readings[readings.length - 1]

  const riskColors: Record<string, { bg: string; text: string; glow: string }> = {
    Normal: { bg: "glass-emerald", text: "#00e676", glow: "glow-green" },
    Prediabetic: { bg: "glass-amber", text: "#ffb300", glow: "" },
    Diabetic: { bg: "glass-ruby", text: "#ff4c6a", glow: "" },
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/patients")}
        className="text-gray-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Patients
      </Button>

      {/* Patient Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-lg border border-blue-500/30 p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white">
            {patient.patientName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{patient.patientName}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {patient.patientId}
              </span>
              <span>{patient.age} years</span>
              <span>{patient.gender}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Last scan: {patient.lastScanDate}
              </span>
            </div>
          </div>
          <StatusBadge level={patient.riskLevel} />
        </div>
      </div>

      {/* Risk Assessment Card */}
      <div className={`bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-8 ${riskColors[result.riskLevel]?.glow || ""}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">AI Analysis Results</h2>
            <p className="text-sm text-gray-400">Comprehensive health assessment</p>
          </div>
          <div
            className={`bg-[#0a0a0a] border border-[#2a2a2a] px-6 py-3 rounded-xl text-center`}
          >
            <p className="text-xs text-gray-400 uppercase tracking-wider">Risk Level</p>
            <p
              className="text-2xl font-bold"
              style={{ color: riskColors[result.riskLevel]?.text }}
            >
              {result.riskLevel}
            </p>
            <p className="text-xs text-gray-400">
              {(result.confidence * 100).toFixed(1)}% confidence
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Droplets, label: "Avg Glucose", value: `${result.glucoseAvg} mg/dL`, color: "#3b82f6" },
            { icon: Weight, label: "BMI", value: `${result.bmiValue} kg/m²`, color: "#10b981" },
            { icon: Heart, label: "Heart Rate", value: `${result.heartRate} BPM`, color: "#f59e0b" },
            { icon: Zap, label: "Data Points", value: `${result.readings.length}`, color: "#ef4444" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg p-4 text-center">
              <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Glucose Monitoring */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Glucose Monitoring</h3>
            <p className="text-sm text-gray-400 mt-1">Blood glucose levels with target ranges</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={readings}>
                <defs>
                  <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" domain={[70, 200]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Area type="monotone" dataKey={() => 140} fill="#10b98120" stroke="none" name="Target Max" />
                <Area type="monotone" dataKey={() => 100} fill="#00000000" stroke="none" name="Target Min" />
                <Line type="monotone" dataKey={() => 140} stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" name="Upper Limit" dot={false} />
                <Line type="monotone" dataKey={() => 100} stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" name="Lower Limit" dot={false} />
                <Area
                  type="monotone"
                  dataKey="glucose"
                  name="Glucose"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#glucoseGrad)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heart Rate */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Heart Rate Variability</h3>
            <p className="text-sm text-gray-400 mt-1">Resting heart rate measurements</p>
          </div>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="heartRate"
                  name="Heart Rate (BPM)"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 4 }}
                  activeDot={{ r: 6, fill: "#f59e0b" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BMI Tracking */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">BMI Tracking</h3>
            <p className="text-sm text-gray-400 mt-1">Body Mass Index progression</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={readings}>
                <defs>
                  <linearGradient id="bmiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" domain={[20, 30]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="bmi" name="BMI (kg/m²)" fill="url(#bmiGrad)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Blood Pressure</h3>
            <p className="text-sm text-gray-400 mt-1">Systolic and diastolic readings</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readings}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 12 }} stroke="#2a2a2a" domain={[60, 150]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="systolic" name="Systolic" stroke="#ef4444" strokeWidth={3} dot={{ fill: "#ef4444", r: 3 }} />
                <Line type="monotone" dataKey="diastolic" name="Diastolic" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          AI Recommendations
        </h3>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0a0a] hover:bg-[#111] transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => router.push("/dashboard/patients")}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Patients
        </Button>
        <Button
          onClick={() => router.push("/dashboard/appointments")}
          variant="outline"
          className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Appointment
        </Button>
        <Button
          onClick={() => router.push("/dashboard/consultations")}
          variant="outline"
          className="border-[#2a2a2a] text-white hover:bg-[#1a1a1a]"
        >
          <FileText className="w-4 h-4 mr-2" />
          Add Consultation
        </Button>
      </div>
    </div>
  )
}

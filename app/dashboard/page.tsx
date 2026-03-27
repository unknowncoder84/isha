"use client"

import {
  Activity,
  Calendar,
  Upload,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Droplets,
  Weight,
  Heart,
  Gauge,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { useApp, DEMO_READINGS } from "@/lib/app-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"

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

function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendValue,
  color,
  bgColor,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  unit: string
  trend?: "up" | "down"
  trendValue?: string
  color: string
  bgColor: string
}) {
  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 hover:border-blue-500/30 transition-all duration-300 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
            {trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trendValue}
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">
        {value}
        <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
      </p>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 shadow-xl">
      <p className="text-sm font-semibold text-white mb-1">{payload[0].name}</p>
      <p className="text-xs text-gray-400">
        Score: <span className="font-semibold text-white">{payload[0].value}%</span>
      </p>
    </div>
  )
}

export default function DashboardHome() {
  const { scanResult, user, appointments } = useApp()
  
  const riskLevel = scanResult?.riskLevel || null
  const confidence = scanResult?.confidence || 0
  
  // Get latest readings only if scan exists, otherwise show N/A
  const readings = scanResult?.readings || []
  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null

  // Calculate trends only if we have scan data
  const glucoseTrend = scanResult && readings.length > 1 
    ? ((latestReading!.glucose - readings[readings.length - 2].glucose) / readings[readings.length - 2].glucose * 100).toFixed(1)
    : "0"
  const bmiTrend = scanResult && readings.length > 1 && latestReading?.bmi && readings[readings.length - 2].bmi
    ? (((latestReading.bmi - readings[readings.length - 2].bmi!) / readings[readings.length - 2].bmi!) * 100).toFixed(1)
    : "0"

  // Create pie chart data based on scan result
  const pieData = scanResult ? [
    { name: "Health Score", value: confidence, color: "#10b981" },
    { name: "Risk Factor", value: 100 - confidence, color: "#ef4444" },
  ] : [
    { name: "No Data", value: 100, color: "#374151" },
  ]

  const COLORS = pieData.map(d => d.color)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Health Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your health and manage appointments</p>
        </div>
        {riskLevel && (
          <div className="flex items-center gap-3">
            <StatusBadge level={riskLevel} />
            <span className="text-sm text-gray-400">AI Risk Assessment</span>
          </div>
        )}
      </div>

      {/* Key Metrics - 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Droplets}
          label="Blood Glucose"
          value={latestReading?.glucose || "N/A"}
          unit={latestReading?.glucose ? "mg/dL" : ""}
          trend={scanResult && parseFloat(glucoseTrend) > 0 ? "up" : scanResult && parseFloat(glucoseTrend) < 0 ? "down" : undefined}
          trendValue={scanResult ? `${Math.abs(parseFloat(glucoseTrend))}%` : undefined}
          color="#3b82f6"
          bgColor="bg-blue-500/10"
        />
        <MetricCard
          icon={Weight}
          label="BMI Index"
          value={latestReading?.bmi?.toFixed(1) || "N/A"}
          unit={latestReading?.bmi ? "kg/m²" : ""}
          trend={scanResult && parseFloat(bmiTrend) > 0 ? "up" : scanResult && parseFloat(bmiTrend) < 0 ? "down" : undefined}
          trendValue={scanResult ? `${Math.abs(parseFloat(bmiTrend))}%` : undefined}
          color="#10b981"
          bgColor="bg-emerald-500/10"
        />
        <MetricCard
          icon={Heart}
          label="Heart Rate"
          value={latestReading?.heartRate || "N/A"}
          unit={latestReading?.heartRate ? "BPM" : ""}
          color="#f59e0b"
          bgColor="bg-amber-500/10"
        />
        <MetricCard
          icon={Gauge}
          label="Blood Pressure"
          value={latestReading ? `${latestReading.systolic}/${latestReading.diastolic}` : "N/A"}
          unit={latestReading ? "mmHg" : ""}
          color="#ef4444"
          bgColor="bg-red-500/10"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score Pie Chart */}
        <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 shadow-lg">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Health Score</h3>
            <p className="text-sm text-gray-400 mt-1">
              {scanResult ? "Based on your latest scan results" : "Upload a medical report to see your health score"}
            </p>
          </div>
          <div className="h-[320px] flex items-center justify-center">
            {scanResult ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium mb-2">No scan data available</p>
                <p className="text-sm text-gray-500 mb-4">Upload a medical report to generate your health score</p>
                <Link href="/dashboard/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all">
                    Upload Report
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {scanResult && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/20">
              <div className="flex items-start gap-3">
                {riskLevel === "Normal" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white mb-1">AI Assessment</p>
                  <p className="text-xs text-gray-300">
                    {riskLevel === "Normal" && "Your health metrics are within normal range. Keep up the good work!"}
                    {riskLevel === "Prediabetic" && "Your results show prediabetic indicators. Consider lifestyle modifications and consult your doctor."}
                    {riskLevel === "Diabetic" && "Your results indicate diabetic range. Please consult with a healthcare professional for proper management."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Appointment Reminders
            </h3>
            <Link href="/dashboard/appointments" className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Manage →
            </Link>
          </div>
          {appointments.filter((a) => a.status === "scheduled").length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400 mb-4">No upcoming appointments</p>
              <Link href="/dashboard/appointments">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white shadow-lg hover:shadow-xl transition-all">
                  Set Reminder
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments
                .filter((a) => a.status === "scheduled")
                .slice(0, 4)
                .map((a) => (
                  <div key={a.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] hover:border-blue-500/30 hover:bg-[#121212] transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex flex-col items-center justify-center border border-blue-500/20">
                      <span className="text-lg font-bold text-blue-400">{a.date.split("-")[2]}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-medium">
                        {new Date(a.date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{a.doctorName}</p>
                      <p className="text-xs text-gray-400 mt-1">{a.time} • {a.notes || a.type}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            Quick Actions
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/upload">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] hover:border-emerald-500/30 hover:bg-[#121212] transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <Upload className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Upload Report</p>
                <p className="text-xs text-gray-400 mt-1">Get AI analysis</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/chat">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] hover:border-blue-500/30 hover:bg-[#121212] transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                <MessageSquare className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">AI Consultant</p>
                <p className="text-xs text-gray-400 mt-1">Get health advice</p>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/appointments">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0f0f0f] border border-[#1a1a1a] hover:border-amber-500/30 hover:bg-[#121212] transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500/20 transition-all">
                <Calendar className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Set Reminder</p>
                <p className="text-xs text-gray-400 mt-1">Manage appointments</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Health Recommendations */}
      {scanResult && scanResult.recommendations && scanResult.recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-blue-500/5 to-emerald-500/5 rounded-xl border border-blue-500/20 p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Personalized Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {scanResult.recommendations.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-[#0a0a0a] border border-[#1a1a1a]"
              >
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-blue-400" />
                <p className="text-sm text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  ChevronRight,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function PatientsPage() {
  const router = useRouter()
  const { patientRecords } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  const filteredPatients = patientRecords.filter((patient) => {
    const matchesSearch =
      patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterRisk === "all" || patient.riskLevel === filterRisk
    return matchesSearch && matchesFilter
  })

  const handlePatientClick = (patient: typeof patientRecords[0]) => {
    router.push(`/dashboard/patients/${patient.id}`)
  }

  const riskCounts = {
    all: patientRecords.length,
    Normal: patientRecords.filter((p) => p.riskLevel === "Normal").length,
    Prediabetic: patientRecords.filter((p) => p.riskLevel === "Prediabetic").length,
    Diabetic: patientRecords.filter((p) => p.riskLevel === "Diabetic").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" />
            Patient Directory
          </h1>
          <p className="text-gray-400 mt-1">
            View and manage all patient records ({patientRecords.length} total)
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "All Patients", count: riskCounts.all, color: "blue", filter: "all" },
          { label: "Normal", count: riskCounts.Normal, color: "emerald", filter: "Normal" },
          { label: "Prediabetic", count: riskCounts.Prediabetic, color: "amber", filter: "Prediabetic" },
          { label: "Diabetic", count: riskCounts.Diabetic, color: "red", filter: "Diabetic" },
        ].map((stat) => (
          <button
            key={stat.filter}
            onClick={() => setFilterRisk(stat.filter)}
            className={`bg-[#1a1a1a] rounded-lg border p-6 text-left transition-all hover:shadow-xl ${
              filterRisk === stat.filter
                ? `border-${stat.color}-500/50 shadow-lg`
                : "border-[#2a2a2a] hover:border-${stat.color}-500/30"
            }`}
          >
            <p className="text-3xl font-bold text-white">{stat.count}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterRisk === "all" ? "default" : "outline"}
              onClick={() => setFilterRisk("all")}
              className="border-[#2a2a2a]"
            >
              All
            </Button>
            <Button
              variant={filterRisk === "Normal" ? "default" : "outline"}
              onClick={() => setFilterRisk("Normal")}
              className="border-[#2a2a2a]"
            >
              Normal
            </Button>
            <Button
              variant={filterRisk === "Prediabetic" ? "default" : "outline"}
              onClick={() => setFilterRisk("Prediabetic")}
              className="border-[#2a2a2a]"
            >
              Prediabetic
            </Button>
            <Button
              variant={filterRisk === "Diabetic" ? "default" : "outline"}
              onClick={() => setFilterRisk("Diabetic")}
              className="border-[#2a2a2a]"
            >
              Diabetic
            </Button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Patients Found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterRisk !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Upload patient reports to add them to the directory"}
          </p>
          {!searchQuery && filterRisk === "all" && (
            <Button onClick={() => router.push("/dashboard/upload")}>
              Upload Patient Report
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Patient
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Patient ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Risk Level
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Avg Glucose
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Last Scan
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider p-4">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => handlePatientClick(patient)}
                    className="border-b border-[#2a2a2a] hover:bg-[#222] transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                          {patient.patientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{patient.patientName}</p>
                          <p className="text-xs text-gray-400">
                            {patient.age} years • {patient.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-mono text-gray-300">{patient.patientId}</p>
                    </td>
                    <td className="p-4">
                      <StatusBadge level={patient.riskLevel} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {patient.scanResult.glucoseAvg} mg/dL
                        </p>
                        {patient.scanResult.glucoseAvg > 140 ? (
                          <TrendingUp className="w-4 h-4 text-red-400" />
                        ) : patient.scanResult.glucoseAvg > 100 ? (
                          <TrendingUp className="w-4 h-4 text-amber-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {patient.lastScanDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePatientClick(patient)
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        View Dashboard
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {filteredPatients.length > 0 && (
        <div className="text-sm text-gray-400 text-center">
          Showing {filteredPatients.length} of {patientRecords.length} patients
        </div>
      )}
    </div>
  )
}

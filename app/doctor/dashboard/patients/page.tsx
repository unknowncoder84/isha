"use client"

import { useEffect, useState } from "react"
import { Search, Filter, Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRisk, setFilterRisk] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPatients()
    
    // Set up real-time subscription for live updates
    const subscription = supabase
      .channel('patient_records_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patient_records' 
      }, (payload) => {
        console.log('Patient record changed:', payload)
        loadPatients() // Reload patients when any change occurs
      })
      .subscribe()

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    filterPatients()
  }, [searchTerm, filterRisk, patients])

  const loadPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patient_records")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setPatients(data || [])
    } catch (error) {
      console.error("Error loading patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    let filtered = patients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.patient_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Risk level filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((p) => p.risk_level === filterRisk)
    }

    setFilteredPatients(filtered)
  }

  const deletePatient = async (id: string) => {
    if (!confirm("Are you sure you want to delete this patient record?")) return

    try {
      const { error } = await supabase.from("patient_records").delete().eq("id", id)

      if (error) throw error
      setPatients(patients.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting patient:", error)
      alert("Failed to delete patient")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#7a8ba3]">Loading patients...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0fe]">Patients</h1>
          <p className="text-[#7a8ba3]">Manage patient records</p>
        </div>
        <Link href="/doctor/dashboard/add-patient">
          <Button className="bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a]">
            <UserPlus className="w-5 h-5 mr-2" />
            Add Patient
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="glass-card p-6 border-[rgba(255,255,255,0.1)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a8ba3]" />
            <Input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#7a8ba3]" />
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none"
            >
              <option value="all">All Risk Levels</option>
              <option value="Normal">Normal</option>
              <option value="Prediabetic">Prediabetic</option>
              <option value="Diabetic">Diabetic</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Patients Table */}
      <Card className="glass-card border-[rgba(255,255,255,0.1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[rgba(255,255,255,0.03)]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Patient ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Age/Gender
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Risk Level
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Last Scan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#e8f0fe]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[#7a8ba3]">
                      {patient.patient_id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[#e8f0fe]">
                      {patient.patient_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7a8ba3]">
                      {patient.age} • {patient.gender}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-sm text-[#7a8ba3]">
                      {new Date(patient.last_scan_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-[#ffd600] hover:bg-[rgba(255,214,0,0.1)]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deletePatient(patient.id)}
                          className="text-[#ff4c6a] hover:bg-[rgba(255,76,106,0.1)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#7a8ba3]">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card p-4 border-[rgba(255,255,255,0.1)]">
          <p className="text-sm text-[#7a8ba3] mb-1">Total Patients</p>
          <p className="text-2xl font-bold text-[#e8f0fe]">{patients.length}</p>
        </Card>
        <Card className="glass-card p-4 border-[rgba(255,255,255,0.1)]">
          <p className="text-sm text-[#7a8ba3] mb-1">Diabetic</p>
          <p className="text-2xl font-bold text-[#ff4c6a]">
            {patients.filter((p) => p.risk_level === "Diabetic").length}
          </p>
        </Card>
        <Card className="glass-card p-4 border-[rgba(255,255,255,0.1)]">
          <p className="text-sm text-[#7a8ba3] mb-1">Prediabetic</p>
          <p className="text-2xl font-bold text-[#ffd600]">
            {patients.filter((p) => p.risk_level === "Prediabetic").length}
          </p>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AddPatientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_id: "",
    age: "",
    gender: "Male",
    glucose_level: "",
    bmi: "",
    blood_pressure: "",
    risk_level: "Normal",
    last_scan_date: new Date().toISOString().split('T')[0],
    added_by: "Dr. Admin",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.from("patient_records").insert([
        {
          ...formData,
          age: parseInt(formData.age),
          glucose_level: formData.glucose_level ? parseFloat(formData.glucose_level) : null,
          bmi: formData.bmi ? parseFloat(formData.bmi) : null,
          added_date: new Date().toISOString().split('T')[0],
        },
      ])

      if (error) throw error

      alert("Patient added successfully!")
      router.push("/doctor/dashboard/patients")
    } catch (error) {
      console.error("Error adding patient:", error)
      alert("Failed to add patient. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/doctor/dashboard/patients">
          <Button variant="ghost" size="sm" className="text-[#7a8ba3]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#e8f0fe] flex items-center gap-2">
            <UserPlus className="w-8 h-8 text-[#00d4ff]" />
            Add New Patient
          </h1>
          <p className="text-[#7a8ba3]">Enter patient information</p>
        </div>
      </div>

      {/* Form */}
      <Card className="glass-card p-8 border-[rgba(255,255,255,0.1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#e8f0fe] border-b border-[rgba(255,255,255,0.1)] pb-2">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patient_name" className="text-[#e8f0fe]">
                  Patient Name *
                </Label>
                <Input
                  id="patient_name"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient_id" className="text-[#e8f0fe]">
                  Patient ID *
                </Label>
                <Input
                  id="patient_id"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  placeholder="e.g., P001"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-[#e8f0fe]">
                  Age *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-[#e8f0fe]">
                  Gender *
                </Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#e8f0fe] border-b border-[rgba(255,255,255,0.1)] pb-2">
              Health Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="glucose_level" className="text-[#e8f0fe]">
                  Glucose Level (mg/dL)
                </Label>
                <Input
                  id="glucose_level"
                  name="glucose_level"
                  type="number"
                  step="0.1"
                  value={formData.glucose_level}
                  onChange={handleChange}
                  placeholder="e.g., 120"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi" className="text-[#e8f0fe]">
                  BMI
                </Label>
                <Input
                  id="bmi"
                  name="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={handleChange}
                  placeholder="e.g., 24.5"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_pressure" className="text-[#e8f0fe]">
                  Blood Pressure
                </Label>
                <Input
                  id="blood_pressure"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleChange}
                  placeholder="e.g., 120/80"
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="risk_level" className="text-[#e8f0fe]">
                  Risk Level *
                </Label>
                <select
                  id="risk_level"
                  name="risk_level"
                  value={formData.risk_level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none"
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="Prediabetic">Prediabetic</option>
                  <option value="Diabetic">Diabetic</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_scan_date" className="text-[#e8f0fe]">
                  Last Scan Date *
                </Label>
                <Input
                  id="last_scan_date"
                  name="last_scan_date"
                  type="date"
                  value={formData.last_scan_date}
                  onChange={handleChange}
                  className="bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a] hover:opacity-90 flex-1"
            >
              <Save className="w-5 h-5 mr-2" />
              {loading ? "Saving..." : "Save Patient"}
            </Button>
            <Link href="/doctor/dashboard/patients" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full border-[rgba(255,255,255,0.1)] text-[#7a8ba3] hover:bg-[rgba(255,255,255,0.05)]"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}

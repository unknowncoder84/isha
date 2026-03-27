"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Shield,
  Bell,
  Moon,
  Globe,
  Save,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

export default function ProfilePage() {
  const { user } = useApp()
  const [saved, setSaved] = useState(false)
  const [notifications, setNotifications] = useState({
    glucoseSpike: true,
    hypoglycemia: true,
    weeklyReport: true,
    aiInsights: true,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#e8f0fe]">Profile Settings</h1>
        <p className="text-sm text-[#7a8ba3]">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center text-3xl font-bold text-[#040d1a]">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-[#e8f0fe]">{user?.name || "User"}</h2>
            <p className="text-sm text-[#7a8ba3]">{user?.email || "user@example.com"}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs">
              <Shield className="w-3 h-3 text-[#00d4ff]" />
              <span className="text-[#00d4ff] font-medium">{user?.role || "Patient"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#e8f0fe] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#00d4ff]" />
          Personal Information
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-name" className="text-sm text-[#7a8ba3] mb-1 block">Full Name</label>
            <input
              id="profile-name"
              type="text"
              defaultValue={user?.name || ""}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="profile-email" className="text-sm text-[#7a8ba3] mb-1 block">Email</label>
            <div className="relative">
              <input
                id="profile-email"
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none transition-colors pr-10"
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7a8ba3]" />
            </div>
          </div>
          <div>
            <label htmlFor="profile-age" className="text-sm text-[#7a8ba3] mb-1 block">Age</label>
            <input
              id="profile-age"
              type="number"
              defaultValue={32}
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label htmlFor="profile-blood" className="text-sm text-[#7a8ba3] mb-1 block">Blood Type</label>
            <select
              id="profile-blood"
              defaultValue="O+"
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none transition-colors appearance-none"
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                <option key={t} value={t} className="bg-[#0a192f]">{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#e8f0fe] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#ffb300]" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { key: "glucoseSpike" as const, label: "Glucose Spike Alerts", desc: "Get notified when glucose exceeds safe levels" },
            { key: "hypoglycemia" as const, label: "Hypoglycemia Warnings", desc: "Alert when glucose drops below normal" },
            { key: "weeklyReport" as const, label: "Weekly Health Report", desc: "Receive a summary of your weekly health data" },
            { key: "aiInsights" as const, label: "AI Insights", desc: "Get personalized AI-generated health tips" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg glass hover:bg-[rgba(255,255,255,0.03)] transition-colors">
              <div>
                <p className="text-sm font-medium text-[#e8f0fe]">{item.label}</p>
                <p className="text-xs text-[#7a8ba3]">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                }
                className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                  notifications[item.key] ? "bg-[#00d4ff]" : "bg-[rgba(255,255,255,0.1)]"
                }`}
                role="switch"
                aria-checked={notifications[item.key]}
                aria-label={item.label}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-[#ffffff] transition-transform duration-200 ${
                    notifications[item.key] ? "translate-x-[22px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Section */}
      <div className="glass-card p-6 border-2 border-[rgba(0,230,118,0.3)]">
        <h3 className="text-lg font-semibold text-[#e8f0fe] mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#00e676]" />
          Doctor Portal Access
        </h3>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.2)]">
            <p className="text-sm text-[#e8f0fe] mb-2">
              <strong>For Healthcare Professionals:</strong>
            </p>
            <p className="text-xs text-[#7a8ba3] mb-4">
              Access the dedicated doctor portal to manage patients, appointments, consultations, and health alerts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.location.href = '/doctor/login'}
                className="bg-gradient-to-r from-[#00e676] to-[#00c853] text-[#040d1a] font-semibold hover:opacity-90 border-0"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access Doctor Portal
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  alert('Doctor Portal Features:\n\n• Patient Management\n• Appointments Scheduling\n• Consultations Tracking\n• Health Alerts Monitoring\n• Add/Edit Patient Records\n• View Patient History\n\nLogin: admin / admin123')
                }}
                className="border-[rgba(0,230,118,0.3)] text-[#00e676] hover:bg-[rgba(0,230,118,0.1)]"
              >
                View Features
              </Button>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <p className="text-xs text-[#7a8ba3] mb-1">Default Credentials</p>
              <p className="text-sm text-[#e8f0fe] font-mono">admin / admin123</p>
            </div>
            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)]">
              <p className="text-xs text-[#7a8ba3] mb-1">Portal URL</p>
              <p className="text-sm text-[#00d4ff] font-mono">/doctor/login</p>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
            <p className="text-xs text-[#7a8ba3] mb-3">Doctor Portal Features:</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Patient Management',
                'Appointments Scheduling',
                'Consultations Tracking',
                'Health Alerts Monitoring',
                'Add/Edit Patients',
                'View Patient History'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-xs text-[#c8d6e5]">
                  <CheckCircle2 className="w-3 h-3 text-[#00e676]" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-[#e8f0fe] mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#00e676]" />
          Preferences
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pref-unit" className="text-sm text-[#7a8ba3] mb-1 block">Glucose Unit</label>
            <select
              id="pref-unit"
              defaultValue="mg/dL"
              className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] focus:border-[#00d4ff] focus:outline-none transition-colors appearance-none"
            >
              <option value="mg/dL" className="bg-[#0a192f]">mg/dL</option>
              <option value="mmol/L" className="bg-[#0a192f]">mmol/L</option>
            </select>
          </div>
          <div>
            <label htmlFor="pref-theme" className="text-sm text-[#7a8ba3] mb-1 block">Theme</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)]">
              <Moon className="w-4 h-4 text-[#00d4ff]" />
              <span className="text-sm text-[#e8f0fe]">Dark Mode (Default)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          className="bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a] font-semibold hover:opacity-90 border-0"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

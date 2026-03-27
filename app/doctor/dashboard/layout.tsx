"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserPlus,
  LogOut,
  Stethoscope,
  Activity,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DoctorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [doctorInfo, setDoctorInfo] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const auth = localStorage.getItem("doctorAuth")
    if (!auth) {
      router.push("/doctor/login")
      return
    }
    setDoctorInfo(JSON.parse(auth))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("doctorAuth")
    router.push("/doctor/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { name: "Patients", href: "/doctor/dashboard/patients", icon: Users },
    { name: "Appointments", href: "/doctor/dashboard/appointments", icon: Calendar },
    { name: "Consultations", href: "/doctor/dashboard/consultations", icon: FileText },
    { name: "Add Patient", href: "/doctor/dashboard/add-patient", icon: UserPlus },
    { name: "Alerts", href: "/doctor/dashboard/alerts", icon: Bell },
  ]

  if (!doctorInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040d1a] via-[#0a1628] to-[#040d1a]">
        <div className="text-[#7a8ba3]">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#040d1a] via-[#0a1628] to-[#040d1a]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-[rgba(255,255,255,0.1)] p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-[#040d1a]" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#e8f0fe]">Doctor Portal</h1>
            <p className="text-xs text-[#7a8ba3]">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a]"
                    : "text-[#7a8ba3] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e8f0fe]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Doctor Info & Logout */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.1)] space-y-4">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-full bg-[rgba(0,212,255,0.2)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#e8f0fe]">Dr. Admin</p>
              <p className="text-xs text-[#7a8ba3]">Administrator</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-[#ff4c6a] hover:bg-[rgba(255,76,106,0.1)] hover:text-[#ff4c6a]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Activity,
  LayoutDashboard,
  Upload,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Calendar,
} from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/upload", icon: Upload, label: "Upload & Scan" },
  { href: "/dashboard/chat", icon: MessageSquare, label: "AI Consultant" },
  { href: "/dashboard/consultations", icon: ClipboardList, label: "Consultations" },
  { href: "/dashboard/appointments", icon: Calendar, label: "Appointments" },
  { href: "/dashboard/alerts", icon: Bell, label: "Alerts" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, alerts } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const unreadAlerts = alerts.filter((a) => !a.read).length

  function handleLogout() {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        style={{
          background: "rgba(8, 20, 40, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#040d1a]" />
            </div>
            <span className="text-lg font-bold text-[#e8f0fe]">GlucoVision</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#7a8ba3]" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 pb-6">
          <div className="glass-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center text-sm font-bold text-[#040d1a]">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#e8f0fe] truncate">{user?.name || "User"}</p>
              <p className="text-xs text-[#7a8ba3]">{user?.role || "Patient"}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[rgba(0,212,255,0.12)] text-[#00d4ff] border border-[rgba(0,212,255,0.2)]"
                      : "text-[#7a8ba3] hover:text-[#e8f0fe] hover:bg-[rgba(255,255,255,0.05)] border border-transparent"
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === "Alerts" && unreadAlerts > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#ff4c6a] text-[10px] flex items-center justify-center text-[#ffffff] font-bold">
                    {unreadAlerts}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-[#7a8ba3] hover:text-[#ff4c6a] hover:bg-[rgba(255,76,106,0.1)]"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:ml-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#7a8ba3] hover:text-[#e8f0fe]"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:block" />
            <div className="flex items-center gap-3">
              <Link href="/dashboard/alerts" className="relative p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                <Bell className="w-5 h-5 text-[#7a8ba3]" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ff4c6a]" />
                )}
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center text-xs font-bold text-[#040d1a]">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Bell, AlertTriangle, CheckCircle2, Info, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

const alertIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  spike: { icon: Zap, color: "#ff4c6a", bg: "glass-ruby" },
  hypo: { icon: AlertTriangle, color: "#ff4c6a", bg: "glass-ruby" },
  warning: { icon: AlertTriangle, color: "#ffb300", bg: "glass-amber" },
  normal: { icon: CheckCircle2, color: "#00e676", bg: "glass-emerald" },
}

function timeAgo(ts: number) {
  const seconds = Math.floor((Date.now() - ts) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function AlertsPage() {
  const { alerts, markAlertRead } = useApp()
  const unreadCount = alerts.filter((a) => !a.read).length
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  function markAllRead() {
    alerts.forEach((a) => {
      if (!a.read) markAlertRead(a.id)
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f0fe] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#00d4ff]" />
            Alerts & Notifications
          </h1>
          <p className="text-sm text-[#7a8ba3]">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)]"
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Alert list */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Info className="w-10 h-10 text-[#7a8ba3] mx-auto mb-3" />
            <p className="text-[#7a8ba3]">No alerts yet. Upload a report to start monitoring.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = alertIcons[alert.type] || alertIcons.normal
            const IconComponent = config.icon
            return (
              <div
                key={alert.id}
                className={`glass-card p-4 flex items-start gap-4 transition-all duration-300 cursor-pointer hover:border-[rgba(255,255,255,0.2)] ${
                  !alert.read ? "border-l-2" : "opacity-70"
                }`}
                style={{ borderLeftColor: !alert.read ? config.color : "transparent" }}
                onClick={() => markAlertRead(alert.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") markAlertRead(alert.id)
                }}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 glass ${config.bg}`}
                >
                  <IconComponent className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-[#e8f0fe] truncate">{alert.title}</h3>
                    <span className="text-xs text-[#7a8ba3] shrink-0">
                      {mounted ? timeAgo(alert.timestamp) : ""}
                    </span>
                  </div>
                  <p className="text-sm text-[#7a8ba3] mt-1">{alert.message}</p>
                  {!alert.read && (
                    <span className="inline-block mt-2 w-2 h-2 rounded-full bg-[#00d4ff]" />
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

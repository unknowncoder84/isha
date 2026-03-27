"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DoctorLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // In-house authentication - admin/admin123
    if (username === "admin" && password === "admin123") {
      // Store session
      localStorage.setItem("doctorAuth", JSON.stringify({
        username: "admin",
        role: "doctor",
        loginTime: new Date().toISOString()
      }))
      router.push("/doctor/dashboard")
    } else {
      setError("Invalid credentials. Please try again.")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#040d1a] via-[#0a1628] to-[#040d1a] p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00e676] mb-4">
            <Stethoscope className="w-8 h-8 text-[#040d1a]" />
          </div>
          <h1 className="text-3xl font-bold text-[#e8f0fe] mb-2">Doctor Portal</h1>
          <p className="text-[#7a8ba3]">Diabetes Management System</p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#e8f0fe]">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a8ba3]" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#e8f0fe]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#7a8ba3]" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#e8f0fe]"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(255,76,106,0.1)] border border-[#ff4c6a]">
                <p className="text-sm text-[#ff4c6a]">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a] hover:opacity-90 font-semibold"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.1)]">
            <p className="text-xs text-center text-[#7a8ba3]">
              In-house authentication system
              <br />
              Contact admin for access credentials
            </p>
          </div>
        </div>

        {/* Back to main site */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-sm text-[#00d4ff] hover:underline"
          >
            ← Back to Patient Portal
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useApp()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    setError("")
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError("Google login failed. Please try again or use email/password.")
      setLoading(false)
    }
  }

  async function handleDoctorLogin() {
    setEmail("doctor1")
    setPassword("doctor01")
    setError("")
    setLoading(true)
    try {
      await login("doctor1", "doctor01")
      router.push("/dashboard")
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#0a0a0a]">
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#e5e5e5]">Diabetes Management System</span>
        </Link>

        {/* Login card */}
        <div className="glass-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#e5e5e5]">Welcome Back</h1>
            <p className="text-sm text-[#9ca3af] mt-1">Sign in to access your health dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-sm text-[#ef4444]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="text-sm text-[#9ca3af] mb-1 block">
                Email or Username
              </label>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e5e5e5] placeholder:text-[#6b7280] focus:border-[#3b82f6] focus:outline-none transition-colors"
                placeholder="you@example.com or doctor1"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-sm text-[#9ca3af] mb-1 block">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e5e5e5] placeholder:text-[#6b7280] focus:border-[#3b82f6] focus:outline-none transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#3b82f6] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#10b981] text-white font-semibold hover:opacity-90 border-0 py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
            <span className="text-xs text-[#6b7280] uppercase tracking-wider">or continue with</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]" />
          </div>

          {/* Google Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-lg font-semibold text-sm border border-[rgba(255,255,255,0.2)] text-[#e5e5e5] hover:bg-[rgba(255,255,255,0.05)] transition-colors flex items-center justify-center gap-3 disabled:opacity-50 mb-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Demo Doctor Login Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleDoctorLogin}
            className="w-full py-3 rounded-lg font-semibold text-sm border border-[#3b82f6] text-[#3b82f6] hover:bg-[rgba(59,130,246,0.1)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                Demo Doctor Login
              </>
            )}
          </button>

          <p className="text-xs text-[#6b7280] text-center mt-3">
            Username: doctor1 | Password: doctor01
          </p>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#9ca3af]">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-[#3b82f6] hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 rounded-lg bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)]">
          <p className="text-xs text-[#9ca3af] text-center">
            <span className="text-[#3b82f6] font-semibold">Demo Credentials:</span><br />
            Doctor: doctor1 / doctor01<br />
            Patient: Any email/password works
          </p>
        </div>
      </div>
    </div>
  )
}

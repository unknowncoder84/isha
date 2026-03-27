"use client"

import Link from "next/link"
import {
  Activity,
  Brain,
  FileText,
  MessageSquare,
  Shield,
  ArrowRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: FileText,
    title: "Smart Document Scanning",
    desc: "Upload medical reports and let our AI extract glucose, BMI, and vital data automatically using advanced OCR technology.",
  },
  {
    icon: Brain,
    title: "AI Predictive Analysis",
    desc: "Custom LSTM/CNN models classify your risk level as Normal, Prediabetic, or Diabetic with high accuracy.",
  },
  {
    icon: Activity,
    title: "Interactive Dashboards",
    desc: "Real-time glucose trends, heart rate variability, and BMI tracking with beautiful interactive charts.",
  },
  {
    icon: MessageSquare,
    title: "AI Health Consultant",
    desc: "24/7 AI-powered chatbot for personalized diet, lifestyle, and health management recommendations.",
  },
  {
    icon: Shield,
    title: "Real-time Alerts",
    desc: "Instant notifications for glucose spikes, hypoglycemia, and critical health events.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Diabetes Management System</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-gray-400 hover:text-blue-400 transition-colors font-medium">About</a>
            <a href="#features" className="text-sm text-gray-400 hover:text-blue-400 transition-colors font-medium">Features</a>
            <a href="#contact" className="text-sm text-gray-400 hover:text-blue-400 transition-colors font-medium">Contact</a>
            <Link href="/doctor/login" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
              Doctor Portal
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-blue-400 hover:bg-blue-500/10">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-md">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-8">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-gray-300 font-medium">Complete Health Monitoring Solution</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white">
              Your Health, Reimagined with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              Our Diabetes Management System helps you monitor and manage your health with AI-powered insights, real-time tracking,
              and personalized recommendations for better diabetes management.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap mb-16">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 text-base px-8 shadow-lg">
                  Start Free Analysis
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#about">
                <Button size="lg" variant="outline" className="border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] text-base px-8">
                  Learn More
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { label: "Accuracy Rate", value: "97.8%", color: "text-blue-400" },
                { label: "Reports Analyzed", value: "50K+", color: "text-emerald-400" },
                { label: "Active Users", value: "12K+", color: "text-amber-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We leverage advanced artificial intelligence to transform raw health data into actionable insights,
              empowering you to take control of your well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                {
                  icon: Brain,
                  title: "Deep Learning Models",
                  desc: "Our AI models analyze your health data to predict diabetes risk with high accuracy and provide personalized recommendations.",
                  color: "blue",
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  desc: "End-to-end encryption ensures your health data remains private and secure at all times.",
                  color: "emerald",
                },
                {
                  icon: Activity,
                  title: "Real-time Monitoring",
                  desc: "Continuous health tracking with instant alerts for any anomalies or concerning patterns.",
                  color: "amber",
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a] shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-lg bg-${item.color}-500/20 flex items-center justify-center shrink-0`}>
                    <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-8 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <pre className="text-xs text-gray-300 font-mono leading-relaxed bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto">
{`{
  "patient_id": "GV-2026-4821",
  "analysis": {
    "risk_level": "Prediabetic",
    "confidence": 0.934,
    "glucose_avg": 128.5,
    "bmi": 25.3,
    "recommendation": "Lifestyle modification"
  },
  "model": "DiabetesAI-v3",
  "timestamp": "2026-03-01T10:30:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to understand, manage, and improve your health in one intelligent platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 hover:border-blue-500/50 hover:shadow-md transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <f.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}

            <Link href="/auth/signup" className="block">
              <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-lg border-2 border-dashed border-blue-500/30 p-6 h-full flex flex-col items-center justify-center hover:border-blue-500/50 transition-all duration-300 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <ArrowRight className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-blue-400 font-semibold">Get Started Now</p>
                <p className="text-sm text-gray-400 mt-1">Free health analysis</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions about our Diabetes Management System? We're here to help you start your health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-white mb-6">Send us a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="contact-name" className="text-sm text-gray-400 mb-1 block font-medium">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="text-sm text-gray-400 mb-1 block font-medium">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="text-sm text-gray-400 mb-1 block font-medium">Message</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors resize-none"
                    placeholder="How can we help?"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold hover:opacity-90 shadow-md">
                  Send Message
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              {[
                { icon: Mail, label: "Email", value: "support@glucovision.com" },
                { icon: Phone, label: "Phone", value: "+1 (555) 0123-4567" },
                { icon: MapPin, label: "Address", value: "100 Health Innovation Drive\nSan Francisco, CA 94105" },
              ].map((item) => (
                <div key={item.label} className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-sm text-gray-400 whitespace-pre-line mt-1">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2a2a] py-8 bg-[#000000]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-md">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">GlucoVision</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 GlucoVision. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

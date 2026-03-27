"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  Brain,
  Droplets,
  Activity as ActivityIcon,
  Heart,
  AlertTriangle,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp, type ScanResult, type GlucoseReading } from "@/lib/app-context"

type Phase = "idle" | "uploading" | "extracting" | "analyzing" | "complete"

function generateRandomReadings(): GlucoseReading[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
  const readings: GlucoseReading[] = []
  let glucose = 85 + Math.random() * 40
  let bmi = 22 + Math.random() * 6
  let hr = 68 + Math.random() * 15

  for (let m = 0; m < 6; m++) {
    for (let w = 1; w <= 2; w++) {
      glucose += (Math.random() - 0.4) * 15
      glucose = Math.max(70, Math.min(200, glucose))
      bmi += (Math.random() - 0.5) * 0.3
      bmi = Math.max(18, Math.min(35, bmi))
      hr += (Math.random() - 0.5) * 5
      hr = Math.max(55, Math.min(100, hr))
      readings.push({
        date: `${months[m]} ${w * 14}`,
        glucose: Math.round(glucose),
        bmi: Math.round(bmi * 10) / 10,
        heartRate: Math.round(hr),
        systolic: Math.round(110 + Math.random() * 30),
        diastolic: Math.round(70 + Math.random() * 20),
      })
    }
  }
  return readings
}

function classifyRisk(glucoseAvg: number): "Normal" | "Prediabetic" | "Diabetic" {
  if (glucoseAvg < 100) return "Normal"
  if (glucoseAvg < 140) return "Prediabetic"
  return "Diabetic"
}

function extractPatientInfo(fileName: string, fileContent: string) {
  // Extract patient name from file name or content
  let patientName = "Unknown Patient"
  let patientId = `PT-${Date.now()}`
  let age = 35
  let gender = "Unknown"

  // Try to extract from filename (e.g., "patient1-rajesh-kumar-report.txt")
  const nameMatch = fileName.match(/patient\d+-([a-z]+-[a-z]+)/i)
  if (nameMatch) {
    patientName = nameMatch[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  }

  // Try to extract from file content
  const nameLineMatch = fileContent.match(/Patient Name:\s*(.+)/i)
  if (nameLineMatch) {
    patientName = nameLineMatch[1].trim()
  }

  const idMatch = fileContent.match(/Patient ID:\s*(.+)/i)
  if (idMatch) {
    patientId = idMatch[1].trim()
  }

  const ageMatch = fileContent.match(/Age:\s*(\d+)/i)
  if (ageMatch) {
    age = parseInt(ageMatch[1])
  }

  const genderMatch = fileContent.match(/Gender:\s*(\w+)/i)
  if (genderMatch) {
    gender = genderMatch[1].trim()
  }

  return { patientName, patientId, age, gender }
}

export default function UploadPage() {
  const router = useRouter()
  const { setScanResult, setIsScanning, addAlert, addPatientRecord, user } = useApp()
  const [phase, setPhase] = useState<Phase>("idle")
  const [fileName, setFileName] = useState("")
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [showConverter, setShowConverter] = useState(false)
  const [convertedText, setConvertedText] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const converterInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      setFileName(file.name)
      setPhase("uploading")
      setIsScanning(true)

      // Read file content
      const fileContent = await file.text()

      // Simulate uploading
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((r) => setTimeout(r, 60))
        setProgress(i)
      }

      // Simulate extraction
      setPhase("extracting")
      setProgress(0)
      for (let i = 0; i <= 100; i += 3) {
        await new Promise((r) => setTimeout(r, 50))
        setProgress(i)
      }

      // Extract patient information
      const patientInfo = extractPatientInfo(file.name, fileContent)

      // Simulate AI analysis
      setPhase("analyzing")
      setProgress(0)
      for (let i = 0; i <= 100; i += 2) {
        await new Promise((r) => setTimeout(r, 40))
        setProgress(i)
      }

      // Generate results
      const readings = generateRandomReadings()
      const glucoseAvg = Math.round(readings.reduce((s, r) => s + r.glucose, 0) / readings.length)
      const bmiAvg = Math.round((readings.reduce((s, r) => s + (r.bmi || 0), 0) / readings.length) * 10) / 10
      const hrAvg = Math.round(readings.reduce((s, r) => s + (r.heartRate || 0), 0) / readings.length)
      const riskLevel = classifyRisk(glucoseAvg)

      const scanData: ScanResult = {
        riskLevel,
        confidence: 0.87 + Math.random() * 0.1,
        glucoseAvg,
        bmiValue: bmiAvg,
        heartRate: hrAvg,
        readings,
        recommendations:
          riskLevel === "Normal"
            ? [
                "Maintain current healthy lifestyle",
                "Continue regular exercise routine",
                "Schedule next check-up in 6 months",
              ]
            : riskLevel === "Prediabetic"
            ? [
                "Reduce sugar and refined carbohydrate intake",
                "Increase daily physical activity to 30+ minutes",
                "Monitor glucose levels weekly",
                "Consult with your healthcare provider about a management plan",
              ]
            : [
                "Immediate consultation with endocrinologist recommended",
                "Begin daily glucose monitoring",
                "Follow a strict low-glycemic diet plan",
                "Start prescribed medication as directed",
                "Regular HbA1c testing every 3 months",
              ],
        pdfContent: fileContent,
        patientInfo: patientInfo,
      }

      setResult(scanData)
      setScanResult(scanData)
      setIsScanning(false)
      setPhase("complete")

      // Add patient record (for doctors or for the logged-in patient)
      addPatientRecord({
        patientName: patientInfo.patientName,
        patientId: patientInfo.patientId,
        age: patientInfo.age,
        gender: patientInfo.gender,
        lastScanDate: new Date().toLocaleDateString(),
        riskLevel,
        scanResult: scanData,
        addedBy: user?.name || "Unknown",
      })

      // Add alert based on risk
      if (riskLevel === "Diabetic") {
        addAlert({
          type: "spike",
          title: "High Risk Detected",
          message: `AI analysis detected Diabetic risk level for ${patientInfo.patientName} with average glucose of ${glucoseAvg} mg/dL. Immediate action recommended.`,
        })
      } else if (riskLevel === "Prediabetic") {
        addAlert({
          type: "warning",
          title: "Elevated Risk Detected",
          message: `AI analysis detected Prediabetic risk level for ${patientInfo.patientName} with average glucose of ${glucoseAvg} mg/dL. Lifestyle modifications recommended.`,
        })
      }
    },
    [setScanResult, setIsScanning, addAlert, addPatientRecord, user]
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  async function convertFileToDemo(file: File) {
    setFileName(file.name)
    
    // Read file content
    const fileContent = await file.text()
    
    // Extract patient info
    const patientInfo = extractPatientInfo(file.name, fileContent)
    
    // Generate demo-style formatted text
    const demoText = `MEDICAL LABORATORY REPORT
========================================

Patient Information:
--------------------
Patient Name: ${patientInfo.patientName}
Patient ID: ${patientInfo.patientId}
Age: ${patientInfo.age} years
Gender: ${patientInfo.gender}
Date of Collection: ${new Date().toLocaleDateString()}
Report Date: ${new Date().toLocaleDateString()}

GLUCOSE METABOLISM PANEL
-------------------------
Fasting Blood Glucose: ${85 + Math.floor(Math.random() * 80)} mg/dL
HbA1c: ${5.0 + Math.random() * 4}%
Postprandial Glucose (2hr): ${110 + Math.floor(Math.random() * 100)} mg/dL

PHYSICAL MEASUREMENTS
---------------------
Height: ${150 + Math.floor(Math.random() * 40)} cm
Weight: ${50 + Math.floor(Math.random() * 50)} kg
BMI: ${20 + Math.random() * 15} kg/m²

VITAL SIGNS
-----------
Blood Pressure: ${110 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)} mmHg
Heart Rate: ${60 + Math.floor(Math.random() * 40)} bpm
Respiratory Rate: ${14 + Math.floor(Math.random() * 6)} breaths/min

KIDNEY FUNCTION TESTS
----------------------
Creatinine: ${0.6 + Math.random() * 0.8} mg/dL
Blood Urea Nitrogen (BUN): ${8 + Math.floor(Math.random() * 15)} mg/dL
eGFR: ${80 + Math.floor(Math.random() * 40)} mL/min/1.73m²

LIVER FUNCTION TESTS
--------------------
ALT (SGPT): ${15 + Math.floor(Math.random() * 30)} U/L
AST (SGOT): ${18 + Math.floor(Math.random() * 25)} U/L
Total Bilirubin: ${0.3 + Math.random() * 0.8} mg/dL

COMPLETE BLOOD COUNT
--------------------
Hemoglobin: ${12 + Math.random() * 4} g/dL
WBC Count: ${4000 + Math.floor(Math.random() * 7000)} cells/µL
Platelet Count: ${150000 + Math.floor(Math.random() * 250000)} cells/µL

CLINICAL INTERPRETATION
-----------------------
${fileContent.substring(0, 200)}...

RECOMMENDATIONS
---------------
1. Regular monitoring of blood glucose levels
2. Maintain healthy diet and exercise routine
3. Follow up consultation in 3 months
4. Continue prescribed medications

---
Report generated from: ${file.name}
Converted to demo format: ${new Date().toLocaleString()}
`
    
    setConvertedText(demoText)
  }

  async function handleConverterFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      await convertFileToDemo(file)
    }
  }

  function downloadConvertedFile() {
    const blob = new Blob([convertedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-${fileName.replace(/\.[^/.]+$/, '')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function reset() {
    setPhase("idle")
    setFileName("")
    setProgress(0)
    setResult(null)
  }

  const riskColors: Record<string, { bg: string; text: string; glow: string }> = {
    Normal: { bg: "glass-emerald", text: "#00e676", glow: "glow-green" },
    Prediabetic: { bg: "glass-amber", text: "#ffb300", glow: "" },
    Diabetic: { bg: "glass-ruby", text: "#ff4c6a", glow: "" },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Upload & Scan</h1>
          <p className="text-sm text-gray-400">
            Upload a medical report PDF and let our AI extract and analyze your health data
          </p>
        </div>
        <Button
          onClick={() => setShowConverter(!showConverter)}
          variant="outline"
          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <FileText className="w-4 h-4 mr-2" />
          File Converter
        </Button>
      </div>

      {/* File Converter Modal */}
      {showConverter && (
        <div className="bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Convert File to Demo Format</h3>
            <button
              onClick={() => {
                setShowConverter(false)
                setConvertedText("")
                setFileName("")
              }}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Upload any PDF or text file to convert it into our demo medical report format. This helps you create custom test files.
          </p>
          
          <input
            ref={converterInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleConverterFileSelect}
            className="hidden"
          />
          
          {!convertedText ? (
            <Button
              onClick={() => converterInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select File to Convert
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0f0f0f] rounded-lg border border-[#1a1a1a] p-4 max-h-96 overflow-y-auto">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                  {convertedText}
                </pre>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={downloadConvertedFile}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Converted File
                </Button>
                <Button
                  onClick={() => {
                    setConvertedText("")
                    setFileName("")
                  }}
                  variant="outline"
                  className="border-gray-700 text-gray-400 hover:bg-gray-800"
                >
                  Convert Another
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload zone */}
      {phase === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`bg-[#0a0a0a] rounded-xl border border-[#1a1a1a] p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-lg ${
            dragActive
              ? "border-blue-500 bg-blue-500/5"
              : "hover:border-blue-500/30"
          }`}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for file upload"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click()
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-white mb-1">
            Drop your medical report here
          </p>
          <p className="text-sm text-gray-400">
            or click to browse. Supports PDF, images, and text files
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Try uploading any file - our demo AI will simulate the analysis
          </p>
        </div>
      )}

      {/* Processing state */}
      {(phase === "uploading" || phase === "extracting" || phase === "analyzing") && (
        <div className="glass-card p-8 glow-cyan">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-[#00d4ff]" />
            <span className="text-sm text-[#e8f0fe] font-medium">{fileName}</span>
          </div>

          {/* Scanning animation */}
          <div className="relative w-full h-[200px] rounded-lg bg-[rgba(0,0,0,0.3)] overflow-hidden mb-6 border border-[rgba(255,255,255,0.05)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-[#00d4ff] animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-[#e8f0fe]">
                  {phase === "uploading" && "Uploading document..."}
                  {phase === "extracting" && "Extracting health data with OCR..."}
                  {phase === "analyzing" && "AI model analyzing patterns..."}
                </p>
              </div>
            </div>
            {/* Scan line */}
            <div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent animate-scan"
              style={{ top: 0 }}
            />
          </div>

          {/* Progress steps */}
          <div className="space-y-3">
            {[
              { key: "uploading", label: "Document Upload", icon: Upload },
              { key: "extracting", label: "Data Extraction (OCR)", icon: FileText },
              { key: "analyzing", label: "AI Risk Analysis", icon: Brain },
            ].map((step) => {
              const isActive = step.key === phase
              const isDone =
                (step.key === "uploading" && (phase === "extracting" || phase === "analyzing")) ||
                (step.key === "extracting" && phase === "analyzing")
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-[rgba(0,230,118,0.2)] text-[#00e676]"
                        : isActive
                        ? "bg-[rgba(0,212,255,0.2)] text-[#00d4ff]"
                        : "bg-[rgba(255,255,255,0.05)] text-[#4a5568]"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <step.icon className="w-4 h-4" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isDone
                        ? "text-[#00e676]"
                        : isActive
                        ? "text-[#e8f0fe] font-medium"
                        : "text-[#4a5568]"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-xs text-[#7a8ba3]">{progress}%</span>
                  )}
                  {isDone && (
                    <span className="ml-auto text-xs text-[#00e676]">Done</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {phase === "complete" && result && (
        <div className="space-y-6">
          {/* Risk Assessment */}
          <div className={`glass-card p-8 ${riskColors[result.riskLevel]?.glow || ""}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#e8f0fe]">AI Analysis Complete</h2>
                <p className="text-sm text-[#7a8ba3]">Report: {fileName}</p>
              </div>
              <div
                className={`glass ${riskColors[result.riskLevel]?.bg} px-6 py-3 rounded-xl text-center`}
              >
                <p className="text-xs text-[#7a8ba3] uppercase tracking-wider">Risk Level</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: riskColors[result.riskLevel]?.text }}
                >
                  {result.riskLevel}
                </p>
                <p className="text-xs text-[#7a8ba3]">
                  {(result.confidence * 100).toFixed(1)}% confidence
                </p>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Droplets, label: "Avg Glucose", value: `${result.glucoseAvg} mg/dL`, color: "#00d4ff" },
                { icon: ActivityIcon, label: "BMI", value: `${result.bmiValue} kg/m2`, color: "#00e676" },
                { icon: Heart, label: "Heart Rate", value: `${result.heartRate} BPM`, color: "#ff4c6a" },
                { icon: Zap, label: "Data Points", value: `${result.readings.length}`, color: "#ffb300" },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                  <p className="text-lg font-bold text-[#e8f0fe]">{stat.value}</p>
                  <p className="text-xs text-[#7a8ba3]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-[#e8f0fe] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#ffb300]" />
              AI Recommendations
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg glass hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-[rgba(0,212,255,0.1)] flex items-center justify-center text-xs text-[#00d4ff] font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#e8f0fe]">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a] font-semibold hover:opacity-90 border-0"
            >
              View Dashboard
            </Button>
            <Button
              onClick={() => router.push("/dashboard/chat")}
              variant="outline"
              className="border-[rgba(255,255,255,0.15)] text-[#e8f0fe] hover:bg-[rgba(255,255,255,0.05)] bg-transparent"
            >
              Ask AI Consultant
            </Button>
            <Button
              onClick={reset}
              variant="ghost"
              className="text-[#7a8ba3] hover:text-[#e8f0fe] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <X className="w-4 h-4 mr-2" />
              Scan Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

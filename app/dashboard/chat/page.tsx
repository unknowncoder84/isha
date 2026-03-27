"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

const SUGGESTED_QUESTIONS = [
  "What does my report say?",
  "What should I eat for dinner?",
  "How can I lower my glucose levels?",
  "What exercises are best for me?",
  "Explain my scan results",
]

function getAIResponse(question: string, hasUploadedReport: boolean, riskLevel: string, glucoseAvg: number, pdfContent?: string, patientInfo?: any): string {
  const q = question.toLowerCase()

  // Check if question is diabetes-related
  const diabetesKeywords = [
    'diabetes', 'diabetic', 'glucose', 'sugar', 'blood', 'insulin', 'hba1c', 'a1c',
    'glycemic', 'carb', 'carbohydrate', 'diet', 'food', 'eat', 'meal', 'nutrition',
    'exercise', 'workout', 'weight', 'bmi', 'scan', 'report', 'test', 'result',
    'medication', 'metformin', 'hypo', 'hyper', 'symptom', 'health', 'doctor',
    'hello', 'hi', 'help', 'what', 'how', 'why', 'when', 'can', 'should', 'my'
  ]
  
  const isDiabetesRelated = diabetesKeywords.some(keyword => q.includes(keyword))
  
  // If not diabetes-related, politely decline
  if (!isDiabetesRelated) {
    return `I'm sorry, but I'm specifically designed to help with diabetes management only. I cannot answer questions about other topics.

I can help you with:
• Blood sugar management and monitoring
• Diabetic diet and nutrition advice
• Exercise recommendations for diabetes
• Understanding your diabetes scan results
• Medication guidance for diabetes
• Diabetes symptoms and prevention

Please ask me about diabetes-related concerns, and I'll be happy to help! 🩺`
  }

  // Check if asking about report/scan but no report uploaded
  if ((q.includes("report") || q.includes("pdf") || q.includes("scan") || q.includes("results") || q.includes("my")) && !hasUploadedReport) {
    return `I'd love to help you understand your medical report, but I don't see any uploaded report yet.

📄 **To get personalized advice based on your report:**
1. Go to the "Upload & Scan" page
2. Upload your medical report (PDF format)
3. Wait for the AI to analyze it
4. Come back here for personalized recommendations

Once you upload your report, I can provide:
• Detailed analysis of your results
• Personalized diet recommendations
• Exercise plans based on your health metrics
• Risk assessment and prevention strategies

**In the meantime, I can still help with:**
• General diabetes management tips
• Diet and nutrition advice
• Exercise recommendations
• Blood sugar monitoring guidance

What would you like to know about diabetes management?`
  }

  // If we have PDF content, provide context-aware responses
  let contextPrefix = ""
  if (pdfContent && patientInfo) {
    contextPrefix = `Based on ${patientInfo.name}'s medical report (Patient ID: ${patientInfo.id}, Age: ${patientInfo.age}, Gender: ${patientInfo.gender}), `
  }

  if (q.includes("eat") || q.includes("dinner") || q.includes("food") || q.includes("diet") || q.includes("meal")) {
    if (riskLevel === "Diabetic") {
      return `${contextPrefix}I recommend a carefully planned dinner:\n\n**Recommended Dinner:**\n- Grilled salmon (4-6 oz) rich in omega-3 fatty acids\n- Steamed broccoli and cauliflower (1-2 cups)\n- Small portion of quinoa (1/2 cup)\n- Side salad with olive oil and lemon dressing\n\n**Foods to Avoid:**\n- White rice, pasta, and bread\n- Sugary sauces and dressings\n- Starchy vegetables in large quantities\n\n**Key Tips:**\n- Eat dinner at least 3 hours before bedtime\n- Keep portion sizes moderate\n- Include protein with every meal to slow glucose absorption\n- Stay hydrated with water or unsweetened herbal tea\n\nWould you like me to create a full weekly meal plan?`
    }
    return `${contextPrefix}here are my dinner recommendations:\n\n**Healthy Dinner Options:**\n- Grilled chicken breast with roasted vegetables\n- Baked fish with a Mediterranean salad\n- Stir-fried tofu with mixed vegetables and brown rice\n- Lentil soup with whole grain bread\n\n**General Guidelines:**\n- Fill half your plate with non-starchy vegetables\n- Include lean protein (palm-sized portion)\n- Choose complex carbs over refined ones\n- Use healthy fats like olive oil or avocado\n\nWould you like specific recipes or a personalized meal plan?`
  }

  if (q.includes("report") || q.includes("pdf") || q.includes("scan") || q.includes("results")) {
    if (pdfContent && patientInfo) {
      // Extract key information from PDF
      const glucoseMatch = pdfContent.match(/Fasting Blood Glucose.*?Result:\s*(\d+)\s*mg\/dL/i)
      const hba1cMatch = pdfContent.match(/HbA1c.*?Result:\s*([\d.]+)%/i)
      const bmiMatch = pdfContent.match(/BMI.*?Result:\s*([\d.]+)/i)
      const bpMatch = pdfContent.match(/Blood Pressure.*?Result:\s*(\d+\/\d+)/i)

      return `${contextPrefix}here's a summary of the uploaded medical report:\n\n**Patient Information:**\n- Name: ${patientInfo.name}\n- Patient ID: ${patientInfo.id}\n- Age: ${patientInfo.age} years\n- Gender: ${patientInfo.gender}\n\n**Key Findings:**\n${glucoseMatch ? `- Fasting Glucose: ${glucoseMatch[1]} mg/dL\n` : ""}${hba1cMatch ? `- HbA1c: ${hba1cMatch[1]}%\n` : ""}${bmiMatch ? `- BMI: ${bmiMatch[1]}\n` : ""}${bpMatch ? `- Blood Pressure: ${bpMatch[1]} mmHg\n` : ""}\n**Risk Assessment:** ${riskLevel}\n**Average Glucose:** ${glucoseAvg} mg/dL\n\n**My Analysis:**\n${
        riskLevel === "Diabetic"
          ? "Your results indicate diabetes. Immediate medical attention and lifestyle changes are crucial."
          : riskLevel === "Prediabetic"
          ? "Your results show prediabetic markers. With proper diet and exercise, you can prevent progression to diabetes."
          : "Your results are within normal range. Continue your healthy lifestyle to maintain these levels."
      }\n\nWould you like specific recommendations based on these results?`
    }
    return `I can see your scan results show a ${riskLevel} risk level with an average glucose of ${glucoseAvg} mg/dL. Would you like me to explain what these numbers mean or provide specific recommendations?`
  }

  if (q.includes("exercise") || q.includes("workout") || q.includes("physical") || q.includes("activity")) {
    return `Great question! Regular exercise is one of the most effective ways to manage blood glucose levels. Based on your profile:\n\n**Recommended Exercise Plan:**\n\n1. **Walking** - 30 minutes daily, moderate pace\n   - Best done after meals to help lower blood sugar\n\n2. **Resistance Training** - 2-3 times per week\n   - Improves insulin sensitivity\n   - Focus on major muscle groups\n\n3. **Swimming or Cycling** - 2-3 times per week\n   - Low-impact cardiovascular exercise\n   - 20-45 minutes per session\n\n4. **Yoga or Stretching** - Daily\n   - Reduces stress (which affects blood sugar)\n   - Improves flexibility and balance\n\n**Important Notes:**\n- Always check your blood sugar before and after exercise\n- Carry fast-acting glucose in case of hypoglycemia\n- Start slowly and gradually increase intensity\n- Stay hydrated throughout\n\nShall I create a detailed weekly exercise schedule?`
  }

  if (q.includes("glucose") || q.includes("lower") || q.includes("sugar") || q.includes("blood")) {
    return `Here are evidence-based strategies to help lower your glucose levels (currently averaging ${glucoseAvg} mg/dL):\n\n**Immediate Actions:**\n1. **Post-meal walks** - Even 10-15 minutes helps\n2. **Hydration** - Drink 8+ glasses of water daily\n3. **Portion control** - Use smaller plates\n\n**Dietary Changes:**\n- Increase fiber intake (vegetables, legumes, whole grains)\n- Reduce refined carbohydrates and added sugars\n- Include cinnamon in your diet (may help insulin sensitivity)\n- Apple cider vinegar before meals (1 tablespoon diluted)\n\n**Lifestyle Modifications:**\n- Improve sleep quality (7-9 hours nightly)\n- Manage stress through meditation or deep breathing\n- Maintain consistent meal timing\n- Monitor carbohydrate intake (aim for 45-60g per meal)\n\n**Supplements to Discuss with Your Doctor:**\n- Chromium\n- Berberine\n- Magnesium\n- Alpha-lipoic acid\n\nWould you like more details on any of these strategies?`
  }

  if (q.includes("bmi") || q.includes("weight") || q.includes("overweight")) {
    return `Based on your scanned data, let me provide some insights about BMI management:\n\n**Understanding Your BMI:**\n- Normal range: 18.5 - 24.9\n- Overweight: 25.0 - 29.9\n- Obese: 30.0+\n\n**Strategies for Healthy Weight Management:**\n1. **Caloric awareness** - Track what you eat for 1-2 weeks\n2. **Protein priority** - Include protein in every meal\n3. **Mindful eating** - Eat slowly, avoid distractions\n4. **Regular movement** - Aim for 150 minutes of moderate activity weekly\n5. **Sleep optimization** - Poor sleep increases hunger hormones\n\n**Key Point:** Even a 5-7% reduction in body weight can significantly improve insulin sensitivity and glucose control.\n\nWould you like a personalized weight management plan?`
  }

  if (q.includes("check") || q.includes("monitor") || q.includes("how often") || q.includes("test")) {
    return `Here are monitoring recommendations based on your health profile:\n\n**Blood Sugar Testing Schedule:**\n${riskLevel === "Diabetic"
      ? "- **Fasting (morning):** Daily\n- **Before meals:** 2-3 times daily\n- **2 hours after meals:** At least once daily\n- **Before bed:** Daily\n- **Before exercise:** Always"
      : riskLevel === "Prediabetic"
      ? "- **Fasting (morning):** 3-4 times per week\n- **After meals:** 2-3 times per week\n- **Before exercise:** Recommended"
      : "- **Fasting (morning):** Once per week\n- **Random checks:** 1-2 times per week"
    }\n\n**Regular Lab Tests:**\n- HbA1c: Every 3-6 months\n- Lipid panel: Every 6-12 months\n- Kidney function: Annually\n- Eye exam: Annually\n\n**When to Test Immediately:**\n- Feeling dizzy or lightheaded\n- Excessive thirst or urination\n- Blurred vision\n- After unusual physical activity\n\nWould you like me to set up reminders for your testing schedule?`
  }

  return `Thank you for your question! Based on your health profile (${riskLevel} risk, average glucose: ${glucoseAvg} mg/dL), here's what I recommend:\n\n**General Health Tips:**\n1. Maintain a balanced diet rich in vegetables, lean proteins, and whole grains\n2. Stay physically active with at least 30 minutes of daily exercise\n3. Monitor your blood glucose levels regularly\n4. Stay hydrated and get adequate sleep\n5. Manage stress through relaxation techniques\n\n**Based on Your Risk Level (${riskLevel}):**\n${
    riskLevel === "Diabetic"
      ? "- Strict dietary management is essential\n- Regular medical check-ups every 2-3 months\n- Medication adherence is critical"
      : riskLevel === "Prediabetic"
      ? "- Focus on lifestyle modifications\n- Regular monitoring can prevent progression\n- Small changes make a big difference"
      : "- Continue your healthy habits\n- Preventive care is the best approach\n- Stay informed about diabetes risk factors"
  }\n\nFeel free to ask me anything specific about nutrition, exercise, medications, or lifestyle management!`
}

export default function ChatPage() {
  const { scanResult } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const riskLevel = scanResult?.riskLevel || "Prediabetic"
  const glucoseAvg = scanResult?.glucoseAvg || 128
  const pdfContent = scanResult?.pdfContent
  const patientInfo = scanResult?.patientInfo

  // Initialize messages on client only to avoid hydration mismatch with Date
  useEffect(() => {
    setMounted(true)
    const hasReport = !!(scanResult && patientInfo)
    
    const welcomeMessage = hasReport
      ? `Hello! I'm your AI Health Consultant. I've analyzed ${patientInfo.name}'s medical report and I'm ready to provide personalized recommendations.\n\n**Report Summary:**\n- Patient: ${patientInfo.name} (${patientInfo.age} years, ${patientInfo.gender})\n- Risk Level: ${riskLevel}\n- Average Glucose: ${glucoseAvg} mg/dL\n\nI can help you with:\n- Understanding your medical report\n- Diet and nutrition advice\n- Exercise recommendations\n- Blood sugar management strategies\n- General wellness guidance\n\nWhat would you like to know about your health?`
      : `Hello! I'm your AI Health Consultant specialized in diabetes management.\n\n⚠️ **I notice you haven't uploaded a medical report yet.**\n\nFor personalized advice based on your health data:\n1. Go to "Upload & Scan" page\n2. Upload your medical report (PDF)\n3. Return here for customized recommendations\n\n**I can still help you with:**\n- General diabetes management tips\n- Diet and nutrition advice\n- Exercise recommendations\n- Blood sugar monitoring guidance\n- Diabetes prevention strategies\n\n**Important:** I only answer questions related to diabetes management. For other health concerns, please consult your doctor.\n\nWhat would you like to know about diabetes?`

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: welcomeMessage,
        timestamp: Date.now(),
      },
    ])
  }, [scanResult, patientInfo, riskLevel, glucoseAvg])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setInput("")
      setIsTyping(true)

      // Simulate AI response delay
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1500))

      const hasUploadedReport = !!(pdfContent && patientInfo)
      const aiResponse = getAIResponse(text, hasUploadedReport, riskLevel, glucoseAvg, pdfContent, patientInfo)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    },
    [riskLevel, glucoseAvg, pdfContent, patientInfo]
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome-new",
        role: "assistant",
        content: "Chat cleared! How can I help you today?",
        timestamp: Date.now(),
      },
    ])
  }

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-[calc(100vh-130px)]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-[#00d4ff] animate-spin" />
          <span className="text-[#7a8ba3]">Loading chat...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-130px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e8f0fe] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#00d4ff]" />
            AI Health Consultant
          </h1>
          <p className="text-sm text-[#7a8ba3]">
            Powered by AI - Personalized health recommendations
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          className="text-[#7a8ba3] hover:text-[#ff4c6a] hover:bg-[rgba(255,76,106,0.1)]"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#040d1a]" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#00d4ff] to-[#00b8d4] text-[#040d1a]"
                  : "glass-card"
              }`}
            >
              <div className="whitespace-pre-wrap text-[#e8f0fe]">
                {msg.content.split("\n").map((line, i) => {
                  if (line.startsWith("**") && line.endsWith("**")) {
                    return (
                      <p key={i} className="font-bold mt-2 mb-1 text-[#e8f0fe]">
                        {line.replace(/\*\*/g, "")}
                      </p>
                    )
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <p key={i} className="ml-4 text-[#c8d6e5]">
                        {line}
                      </p>
                    )
                  }
                  if (line.match(/^\d+\./)) {
                    return (
                      <p key={i} className="ml-2 text-[#c8d6e5]">
                        {line}
                      </p>
                    )
                  }
                  return (
                    <p key={i} className={`${msg.role === "user" ? "text-[#040d1a]" : "text-[#c8d6e5]"} ${line === "" ? "h-2" : ""}`}>
                      {line}
                    </p>
                  )
                })}
              </div>
              <p className={`text-[10px] mt-2 ${msg.role === "user" ? "text-[#040d1a]/60" : "text-[#4a5568]"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#7a8ba3]" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#00e676] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-[#040d1a]" />
            </div>
            <div className="glass-card p-4 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#00d4ff] animate-spin" />
              <span className="text-sm text-[#7a8ba3]">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="glass-card px-3 py-2 text-xs text-[#00d4ff] hover:bg-[rgba(0,212,255,0.1)] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3 mt-auto pt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your health..."
          disabled={isTyping}
          className="flex-1 px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e8f0fe] placeholder:text-[#4a5568] focus:border-[#00d4ff] focus:outline-none transition-colors disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="bg-gradient-to-r from-[#00d4ff] to-[#00e676] text-[#040d1a] hover:opacity-90 border-0 px-4"
        >
          <Send className="w-5 h-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  )
}

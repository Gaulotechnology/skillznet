import { useState, useEffect, useRef, useCallback } from "react"

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api"

function getSessionId(): string {
  let id = localStorage.getItem("skillzlink_chat_session")
  if (!id) {
    id = "chat_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    localStorage.setItem("skillzlink_chat_session", id)
  }
  return id
}

interface ChatMessage {
  id: number
  session_id: string
  message: string
  sender_name: string
  sender_role: "visitor" | "admin" | "bot"
  created_at: string
}

// --- Bot knowledge base ---
interface QuickReply {
  label: string
  action: string
}

interface BotResponse {
  reply: string
  quickReplies?: QuickReply[]
  escalate?: boolean
}

function getBotResponse(text: string): BotResponse | null {
  const msg = text.toLowerCase().trim()

  // Find a professional
  if (/find|hire|need|looking for|search|plumber|electrician|cleaner|tutor|mechanic|carpenter|painter|gardener/.test(msg)) {
    return {
      reply: "You can browse our verified professionals at the link below. Filter by city, category, and budget to find the perfect match.",
      quickReplies: [
        { label: "🔍 Browse Professionals", action: "/nearby-professionals" },
        { label: "📋 Post a Request", action: "/register" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // Become a provider / join
  if (/join|register|sign up|become|provider|professional|work|offer/.test(msg)) {
    return {
      reply: "Great! You can register as a provider in a few minutes — just your name, phone number, service category, and ID for verification. Once approved, clients can find and message you directly on WhatsApp.",
      quickReplies: [
        { label: "📝 Register Now", action: "/register" },
        { label: "📖 How It Works", action: "/how-it-works" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // Pricing / cost
  if (/price|cost|rate|how much|pay|fee|charge|free/.test(msg)) {
    return {
      reply: "SkillzLink is free to browse and register. Professionals set their own rates (typically $15–$50/hr depending on the service). You negotiate directly with the professional on WhatsApp — no hidden fees from us.",
      quickReplies: [
        { label: "🏷️ View Professionals", action: "/nearby-professionals" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // How it works
  if (/how.*work|process|steps|explain|guide/.test(msg)) {
    return {
      reply: "It's simple: 1) Browse or search for professionals near you, 2) Check their profiles, ratings and verification status, 3) Click to reveal their WhatsApp number and chat directly. No app to download — it all works on WhatsApp!",
      quickReplies: [
        { label: "📖 Full Guide", action: "/how-it-works" },
        { label: "🔍 Find a Professional", action: "/nearby-professionals" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // Verification / safety
  if (/verif|id|safe|trust|background|check|scam/.test(msg)) {
    return {
      reply: "Safety is our priority. Every professional must provide their National ID for verification. Verified providers get a blue checkmark badge. We also show real client reviews and success rates so you can hire with confidence.",
      quickReplies: [
        { label: "🛡️ Trust & Safety", action: "/trust-and-safety" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // WhatsApp related
  if (/whatsapp|contact|call|message|reach/.test(msg)) {
    return {
      reply: "All communication happens on WhatsApp! Once you find a professional, click the reveal contact button to get their WhatsApp number. You can message, call, share photos, and negotiate — all in one place.",
      quickReplies: [
        { label: "🔍 Find a Professional", action: "/nearby-professionals" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // Human / agent request
  if (/human|agent|person|real|talk to|speak|support|help/.test(msg)) {
    return {
      reply: "Let me connect you with a member of our team. Please describe what you need help with and someone will get back to you shortly.",
      escalate: true,
      quickReplies: [
        { label: "🔍 Find a Professional", action: "/nearby-professionals" },
        { label: "📝 Register", action: "/register" },
      ],
    }
  }

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|yo|sup)/.test(msg)) {
    return {
      reply: `Hello! 👋 I'm the SkillzLink assistant. I can help you find professionals, become a provider, or answer questions about how we work. What would you like to know?`,
      quickReplies: [
        { label: "🔍 Find a Professional", action: "find" },
        { label: "📝 Become a Provider", action: "become" },
        { label: "💰 Pricing", action: "price" },
        { label: "📖 How It Works", action: "how" },
        { label: "💬 Chat with a human", action: "human" },
      ],
    }
  }

  // Thanks / bye
  if (/thank|thx|bye|goodbye|see you|appreciate/.test(msg)) {
    return {
      reply: "You're welcome! 😊 If you need anything else, just ask. We're here 24/7.",
      quickReplies: [
        { label: "🔍 Find a Professional", action: "/nearby-professionals" },
        { label: "📝 Register", action: "/register" },
      ],
    }
  }

  // Default / fallback
  return {
    reply: "I'm not sure I understand. Let me help you find what you need — you can browse professionals, learn how SkillzLink works, or chat with a real person.",
    quickReplies: [
      { label: "🔍 Find a Professional", action: "find" },
      { label: "📝 Become a Provider", action: "become" },
      { label: "📖 How It Works", action: "how" },
      { label: "💬 Chat with a human", action: "human" },
    ],
  }
}

let msgCounter = 1000
function makeBotMsg(text: string, escalate?: boolean): ChatMessage {
  return {
    id: ++msgCounter,
    session_id: "",
    message: text + (escalate ? "\n\n⚡ A team member will review your conversation and respond here. You'll be notified when they reply." : ""),
    sender_name: escalate ? "SkillzLink (Escalated)" : "SkillzLink Bot",
    sender_role: "bot",
    created_at: new Date().toISOString(),
  }
}

export function LiveChatWidget() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [nameSet, setNameSet] = useState(false)
  const [escalated, setEscalated] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [quickReplies, setQuickReplies] = useState<QuickReply[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [botThinking, setBotThinking] = useState(false)
  const [lastId, setLastId] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const sessionId = getSessionId()

  const scrollToBottom = () => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
  }

  // Poll for real human replies (only when escalated)
  const poll = useCallback(async () => {
    if (!escalated) return
    try {
      const res = await fetch(`${API_BASE}/chat/poll?session_id=${sessionId}&after_id=${lastId}`)
      const data = await res.json()
      const adminMsgs = (data.messages || []).filter((m: ChatMessage) => m.sender_role === "admin")
      if (adminMsgs.length) {
        setMessages(prev => [...prev, ...adminMsgs])
        setLastId(adminMsgs[adminMsgs.length - 1].id)
      }
    } catch {}
  }, [sessionId, lastId, escalated])

  useEffect(() => {
    if (escalated) {
      const interval = setInterval(poll, 3000)
      return () => clearInterval(interval)
    }
  }, [poll, escalated])

  useEffect(() => {
    if (open) {
      poll()
      scrollToBottom()
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [open])

  // Welcome + quick reply buttons
  const showWelcome = () => {
    const welcome = makeBotMsg(`Hi ${name}! 👋 I'm the SkillzLink assistant. How can I help you today?`)
    setMessages([welcome])
    setQuickReplies([
      { label: "🔍 Find a Professional", action: "find" },
      { label: "📝 Become a Provider", action: "become" },
      { label: "💰 Pricing & Cost", action: "price" },
      { label: "📖 How It Works", action: "how" },
      { label: "💬 Chat with a human", action: "human" },
    ])
  }

  useEffect(() => {
    if (nameSet && messages.length === 0) {
      showWelcome()
    }
  }, [nameSet])

  useEffect(() => {
    scrollToBottom()
  }, [messages, quickReplies])

  const handleQuickReply = (action: string) => {
    setQuickReplies([])

    // Navigation actions
    if (action.startsWith("/")) {
      window.open(action, "_blank")
      const navMsg = makeBotMsg(`Opening ${action} in a new tab. Is there anything else I can help with?`)
      setMessages(prev => [...prev, navMsg])
      setQuickReplies([
        { label: "🔍 Find a Professional", action: "find" },
        { label: "📝 Become a Provider", action: "become" },
        { label: "💬 Chat with a human", action: "human" },
      ])
      return
    }

    // Use the bot engine with the action as input
    const botResp = getBotResponse(action)
    if (botResp) {
      const userMsg: ChatMessage = {
        id: ++msgCounter,
        session_id: sessionId,
        message: action,
        sender_name: name,
        sender_role: "visitor",
        created_at: new Date().toISOString(),
      }
      setMessages(prev => [...prev, userMsg])

      setBotThinking(true)
      setTimeout(() => {
        setBotThinking(false)
        const reply = makeBotMsg(botResp.reply, botResp.escalate)
        setMessages(prev => [...prev, reply])
        setQuickReplies(botResp.quickReplies || [])
        if (botResp.escalate) {
          setEscalated(true)
          // Send escalation to backend
          fetch(`${API_BASE}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, message: `[Escalated] ${name} wants to chat with a human.`, sender_name: name }),
          }).catch(() => {})
        }
      }, 600)
    }
  }

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setInput("")
    setQuickReplies([])
    setSending(true)

    // Add user message
    const userMsg: ChatMessage = {
      id: ++msgCounter,
      session_id: sessionId,
      message: text,
      sender_name: name,
      sender_role: "visitor",
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMsg])

    // If escalated, send to backend. Bot still responds too.
    if (escalated) {
      try {
        const res = await fetch(`${API_BASE}/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, message: text, sender_name: name }),
        })
        const data = await res.json()
        if (data.message) setLastId(data.message.id)
      } catch {}
    }
    setSending(false)

    // Bot responds — first try local bot, then fall back to RAG AI
    setBotThinking(true)
    setTimeout(async () => {
      setBotThinking(false)
      const botResp = getBotResponse(text)

      if (botResp && botResp.reply !== getBotResponse("__default__")?.reply) {
        // Bot has a specific answer
        const reply = makeBotMsg(botResp.reply, botResp.escalate)
        setMessages(prev => [...prev, reply])
        setQuickReplies(botResp.quickReplies || [])
        if (botResp.escalate && !escalated) {
          setEscalated(true)
          fetch(`${API_BASE}/chat/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId, message: `[Escalated] ${name}: ${text}`, sender_name: name }),
          }).catch(() => {})
        }
      } else {
        // Fallback: query RAG AI knowledge base
        try {
          const ragRes = await fetch(`${API_BASE}/rag/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: text }),
          })
          const ragData = await ragRes.json()
          if (ragData.answer) {
            const mode = ragData.mode === "deepseek" ? "🧠 AI" : "📚 Knowledge Base"
            const reply = makeBotMsg(ragData.answer)
            reply.sender_name = `SkillzLink ${mode}`
            setMessages(prev => [...prev, reply])
          } else {
            // Ultimate fallback
            const fallback = makeBotMsg("I'm not sure about that. Let me connect you with a human agent who can help.")
            setMessages(prev => [...prev, fallback])
          }
          setQuickReplies([
            { label: "🔍 Find a Professional", action: "/nearby-professionals" },
            { label: "📖 How It Works", action: "how" },
            { label: "💬 Chat with a human", action: "human" },
          ])
        } catch {
          const fallback = makeBotMsg("I couldn't look that up right now. Try asking differently, or chat with a human agent.")
          setMessages(prev => [...prev, fallback])
          setQuickReplies([
            { label: "🔍 Find a Professional", action: "/nearby-professionals" },
            { label: "💬 Chat with a human", action: "human" },
          ])
        }
      }
    }, 600 + Math.random() * 400)

    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating chat button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent-color)] text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce"
          style={{ animationIterationCount: "3" }}
          title="Chat with us"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-[var(--border-color)] flex flex-col overflow-hidden" style={{ maxHeight: "560px" }}>
          {/* Header */}
          <div className="bg-[var(--accent-color)] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="font-semibold text-sm">SkillzLink Assistant</p>
                <p className="text-xs text-white/70">
                  {escalated ? "🟢 Human team notified" : "⚡ Instant replies · Ask anything"}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Name prompt */}
          {!nameSet ? (
            <div className="p-5 flex-1 flex flex-col justify-center">
              <p className="text-sm text-[var(--text-secondary)] mb-3">Hi! What should we call you?</p>
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && name.trim() && setNameSet(true)}
                  placeholder="Your name"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)]"
                  autoFocus
                />
                <button
                  onClick={() => name.trim() && setNameSet(true)}
                  disabled={!name.trim()}
                  className="px-4 py-2.5 bg-[var(--accent-color)] text-white rounded-xl text-sm font-medium disabled:opacity-50"
                >
                  Start
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]" style={{ minHeight: "240px", maxHeight: "320px" }}>
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_role !== "visitor" ? "justify-start" : "justify-end"}`}>
                    <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender_role === "bot"
                        ? "bg-white text-[var(--text-primary)] border border-[var(--border-color)]"
                        : msg.sender_role === "admin"
                        ? "bg-blue-50 text-[var(--text-primary)] border border-blue-100"
                        : "bg-[var(--accent-color)] text-white"
                    }`}>
                      {(msg.sender_role === "bot" || msg.sender_role === "admin") && (
                        <p className="text-[10px] font-semibold text-[var(--accent-color)] mb-0.5">{msg.sender_name}</p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className="text-[10px] mt-1 opacity-60 text-right">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Bot thinking indicator */}
                {botThinking && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[var(--border-color)] rounded-2xl px-4 py-3">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              {quickReplies.length > 0 && (
                <div className="px-3 py-2 bg-white border-t border-[var(--border-color)] flex flex-wrap gap-2">
                  {quickReplies.map(qr => (
                    <button
                      key={qr.label}
                      onClick={() => handleQuickReply(qr.action)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        qr.action === "human"
                          ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border-[var(--border-color)] bg-white text-[var(--text-primary)] hover:border-[var(--accent-color)] hover:text-[var(--accent-color)]"
                      }`}
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t border-[var(--border-color)] bg-white flex items-end gap-2 shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={escalated ? "Message the team..." : "Ask me anything..."}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] resize-none"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-xl bg-[var(--accent-color)] text-white flex items-center justify-center disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

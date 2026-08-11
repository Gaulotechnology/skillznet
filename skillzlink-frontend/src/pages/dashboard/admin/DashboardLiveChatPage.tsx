import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "../../../components/layout/DashboardLayout"
import { fetchJson } from "../../../services/api"

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:18080/api"

interface ChatSession {
  session_id: string
  visitor_name: string
  last_message: string
  total: number
  unread: number
}

interface ChatMsg {
  id: number
  message: string
  sender_name: string
  sender_role: string
  created_at: string
}

export function DashboardLiveChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [lhcAvailable, _setLhcAvailable] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchSessions = async () => {
    try {
      const data = await fetchJson<{ sessions: ChatSession[] }>(`${API}/admin/chat/sessions`)
      setSessions(data.sessions || [])
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    fetchSessions()
    const interval = setInterval(fetchSessions, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedSession) {
      fetchJson<{ messages: ChatMsg[] }>(`${API}/admin/chat/messages?session_id=${selectedSession}`)
        .then(data => setMessages(data.messages || []))
        .catch(() => {})
    }
  }, [selectedSession])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleReply = async () => {
    if (!reply.trim() || !selectedSession || sending) return
    setSending(true)
    try {
      await fetchJson(`${API}/admin/chat/reply`, {
        method: "POST",
        body: JSON.stringify({ session_id: selectedSession, message: reply }),
      })
      setReply("")
      // Refresh messages
      const data = await fetchJson<{ messages: ChatMsg[] }>(`${API}/admin/chat/messages?session_id=${selectedSession}`)
      setMessages(data.messages || [])
      fetchSessions()
    } catch {}
    setSending(false)
  }

  const handleLhcLogin = async () => {
    try {
      const data = await fetchJson<{ url: string; available: boolean }>(`${API}/admin/chat/lhc-login`)
      if (data.url) {
        window.open(data.url, "_blank")
      }
    } catch {
      // Fallback to auto-login URL
      window.open("http://localhost:18081/index.php/site_admin/user/autologinuser/bec30634d5782ed60b0927776a286b83", "_blank")
    }
  }

  const selectedSessionData = sessions.find(s => s.session_id === selectedSession)

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Live Chat</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Manage visitor conversations in real-time</p>
          </div>
          {lhcAvailable && (
            <button
              onClick={handleLhcLogin}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent-color)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <i className="lnr lnr-exit-up mr-2" />
              Open LHC Panel
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6" style={{ minHeight: "70vh" }}>
          {/* Sessions list */}
          <div className="lg:col-span-1 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--border-color)]">
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Conversations ({sessions.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-[var(--text-secondary)]">Loading...</div>
              ) : sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-3">
                    <i className="lnr lnr-bubble text-xl text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">No conversations yet</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Visitor messages will appear here</p>
                </div>
              ) : (
                sessions.map(s => (
                  <button
                    key={s.session_id}
                    onClick={() => setSelectedSession(s.session_id)}
                    className={`w-full text-left p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors ${
                      selectedSession === s.session_id ? "bg-[var(--accent-light)]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-[var(--text-primary)]">{s.visitor_name}</span>
                      {s.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[var(--accent-color)] text-white text-[10px] flex items-center justify-center font-bold">
                          {s.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {new Date(s.last_message).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-2 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
            {!selectedSession ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-4">
                    <i className="lnr lnr-bubble text-2xl text-[var(--text-secondary)]" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">Select a conversation to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">
                      {selectedSessionData?.visitor_name || "Visitor"}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      Session: {selectedSession.slice(0, 12)}...
                    </p>
                  </div>
                  <span className="text-xs text-green-600 font-medium px-2 py-0.5 bg-green-50 rounded-full">Online</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-secondary)]">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_role === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender_role === "admin"
                          ? "bg-[var(--accent-color)] text-white"
                          : "bg-white text-[var(--text-primary)] border border-[var(--border-color)]"
                      }`}>
                        {msg.sender_role !== "admin" && (
                          <p className="text-[10px] font-semibold text-[var(--accent-color)] mb-0.5">{msg.sender_name}</p>
                        )}
                        <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                        <p className="text-[10px] mt-1 opacity-60 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply input */}
                <div className="p-4 border-t border-[var(--border-color)] flex items-end gap-3">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleReply()
                      }
                    }}
                    placeholder="Type your reply..."
                    rows={2}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm outline-none focus:border-[var(--accent-color)] focus:ring-2 focus:ring-[var(--accent-light)] resize-none"
                  />
                  <button
                    onClick={handleReply}
                    disabled={!reply.trim() || sending}
                    className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

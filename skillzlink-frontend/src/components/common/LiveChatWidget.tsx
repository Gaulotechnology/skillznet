import { useState, useEffect } from "react"
import { LHC_BASE_URL } from "../../config/lhc"

export function LiveChatWidget() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const hash = localStorage.getItem("lhc_chat_hash")
      if (!hash) return
      fetch(`${LHC_BASE_URL}/index.php/chat/checkchatstatus?hash=${hash}`)
        .then(r => r.json())
        .then(d => { if (d.unread > 0) setUnread(d.unread) })
        .catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  const accentColor = "var(--accent-color, #FF385C)"

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center animate-bounce"
        style={{ animationIterationCount: "3", backgroundColor: accentColor }}
        title="Chat with us"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
        <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
      style={{ width: 400, maxWidth: "calc(100vw - 2rem)", height: 560, maxHeight: "calc(100vh - 3rem)", backgroundColor: "var(--bg-primary, #fff)" }}
    >
      <div className="text-white px-4 py-3 flex items-center justify-between shrink-0"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">💬</div>
          <div>
            <p className="font-semibold text-sm">SkillzLink Chat</p>
            <p className="text-xs text-white/70">We reply instantly</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm">
          ✕
        </button>
      </div>
      <iframe
        src={`${LHC_BASE_URL}/index.php/chat/start/(department)/1`}
        style={{ flex: 1, border: "none", width: "100%" }}
        title="Live Chat"
      />
    </div>
  )
}

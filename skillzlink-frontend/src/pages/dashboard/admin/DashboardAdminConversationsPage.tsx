import { useState, useEffect, useRef, useCallback } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi, getCurrentUser } from "../../../services/api";

const roleColor = (role: string) => {
  if (role === "provider") return "bg-blue-100 text-blue-600";
  if (role === "admin" || role === "super_admin") return "bg-purple-100 text-purple-600";
  if (role === "agent") return "bg-amber-100 text-amber-600";
  return "bg-teal-100 text-teal-600"; // seeker
};
const roleLabel = (role: string) =>
  ({ super_admin: "Super Admin", admin: "Admin", provider: "Provider", agent: "Agent", seeker: "Seeker" }[role] ?? role);

export function DashboardAdminConversationsPage() {
  const me = getCurrentUser();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [newMsgTarget, setNewMsgTarget] = useState<any>(null);
  const [newMsgText, setNewMsgText] = useState("");
  const [startingConv, setStartingConv] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchConversations = useCallback(() => {
    adminApi.getConversations()
      .then(r => setConversations(r.conversations ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const openConversation = async (conv: any) => {
    setSelected(conv);
    setMsgLoading(true);
    setText("");
    if (pollRef.current) clearInterval(pollRef.current);
    try {
      const r = await adminApi.getConversation(conv.id);
      setMessages(r.messages ?? []);
      setTimeout(scrollToBottom, 100);
    } finally {
      setMsgLoading(false);
    }
    // Poll for new messages every 4s
    pollRef.current = setInterval(async () => {
      const r = await adminApi.getConversation(conv.id);
      setMessages(r.messages ?? []);
    }, 4000);
  };

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const sendMessage = async () => {
    if (!text.trim() || !selected || sending) return;
    setSending(true);
    const optimistic = {
      id: Date.now(),
      sender_id: me?.id,
      sender_name: me?.name ?? "Admin",
      sender_role: me?.role ?? "admin",
      content: text.trim(),
      created_at: new Date().toISOString(),
      is_admin: true,
    };
    setMessages(prev => [...prev, optimistic]);
    const msgContent = text.trim();
    setText("");
    setTimeout(scrollToBottom, 50);
    try {
      await adminApi.sendMessage(selected.id, { content: msgContent });
      fetchConversations();
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setText(msgContent);
    } finally {
      setSending(false);
    }
  };

  const openNewModal = async () => {
    setShowNewModal(true);
    setNewMsgTarget(null);
    setNewMsgText("");
    setUserSearch("");
    if (users.length === 0) {
      const r = await adminApi.getUserList();
      setUsers(r.users ?? []);
    }
  };

  const startConversation = async () => {
    if (!newMsgTarget || !newMsgText.trim()) return;
    setStartingConv(true);
    try {
      const r = await adminApi.startConversation({ recipient_id: newMsgTarget.id, content: newMsgText.trim() });
      setShowNewModal(false);
      fetchConversations();
      // Open the newly created conversation
      const newConv = r.conversation;
      newConv.user_one = me ? { id: me.id, name: me.name, role: me.role } : null;
      newConv.user_two = newMsgTarget;
      await openConversation(newConv);
    } catch {
    } finally {
      setStartingConv(false);
    }
  };

  const filteredConvs = conversations.filter(c => {
    const q = search.toLowerCase();
    return (
      c.user_one?.name?.toLowerCase().includes(q) ||
      c.user_two?.name?.toLowerCase().includes(q) ||
      c.last_message?.toLowerCase().includes(q)
    );
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );



  const formatTime = (ts: string) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50">

        {/* New Conversation Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !startingConv && setShowNewModal(false)} />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">New Conversation</h3>
                <button onClick={() => setShowNewModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                  <i className="lnr lnr-cross text-xs"></i>
                </button>
              </div>
              <div className="p-4 space-y-3">
                {!newMsgTarget ? (
                  <>
                    <div className="relative">
                      <i className="lnr lnr-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search users…"
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 rounded-xl border border-slate-100">
                      {filteredUsers.length === 0 && (
                        <div className="py-8 text-center text-slate-400 text-sm">No users found</div>
                      )}
                      {filteredUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => setNewMsgTarget(u)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600 text-[11px] shrink-0">
                            {u.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">{u.name}</div>
                            <div className="text-[11px] text-slate-400">{u.email}</div>
                          </div>
                          <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleColor(u.role)}`}>
                            {roleLabel(u.role)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                        {newMsgTarget.name[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{newMsgTarget.name}</div>
                        <div className="text-[11px] text-slate-400">{newMsgTarget.email}</div>
                      </div>
                      <button onClick={() => setNewMsgTarget(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                        <i className="lnr lnr-cross text-xs"></i>
                      </button>
                    </div>
                    <textarea
                      autoFocus
                      rows={4}
                      value={newMsgText}
                      onChange={e => setNewMsgText(e.target.value)}
                      placeholder={`Message to ${newMsgTarget.name}…`}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); startConversation(); } }}
                    />
                    <button
                      onClick={startConversation}
                      disabled={!newMsgText.trim() || startingConv}
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {startingConv ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</> : <><i className="lnr lnr-paper-plane"></i> Send Message</>}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar — conversation list */}
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-800">Conversations</h2>
              <button
                onClick={openNewModal}
                className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                title="New conversation"
              >
                <i className="lnr lnr-pencil text-xs"></i>
              </button>
            </div>
            <div className="relative">
              <i className="lnr lnr-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-[13px] bg-slate-50 border-0 rounded-lg outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="w-6 h-6 border-2 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}
            {!loading && filteredConvs.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <i className="lnr lnr-bubble text-3xl block mb-2 opacity-30"></i>
                <p className="text-sm">No conversations yet</p>
              </div>
            )}
            {filteredConvs.map(conv => {
              const isActive = selected?.id === conv.id;
              const participants = [conv.user_one, conv.user_two].filter(Boolean);
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  className={`w-full flex items-start gap-3 px-4 py-3 border-b border-slate-50 transition-colors text-left ${isActive ? "bg-indigo-50 border-l-2 border-l-indigo-500" : "hover:bg-slate-50"}`}
                >
                  {/* Dual avatar for admin view */}
                  <div className="relative shrink-0 w-10 h-10">
                    <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[9px] border-2 border-white">
                      {(conv.user_two?.name ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-[9px] border-2 border-white">
                      {(conv.user_one?.name ?? "?")[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[13px] text-slate-800 truncate">
                        {participants.map(p => p?.name).join(" · ")}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">{formatTime(conv.last_message_at)}</span>
                    </div>
                    <div className="text-[12px] text-slate-500 truncate mt-0.5">{conv.last_message ?? "No messages yet"}</div>
                    <div className="flex gap-1 mt-1">
                      {participants.map(p => p && (
                        <span key={p.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleColor(p.role)}`}>
                          {roleLabel(p.role)}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat pane */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-400">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <i className="lnr lnr-bubble text-3xl text-slate-300"></i>
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-600">Select a conversation</p>
                <p className="text-sm text-slate-400 mt-1">Or start a new one to message any user</p>
              </div>
              <button
                onClick={openNewModal}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <i className="lnr lnr-pencil text-sm"></i> New Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="border-b border-slate-100 px-5 py-3 bg-white flex items-center gap-3">
                <div className="relative shrink-0 w-10 h-10">
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[9px] border-2 border-white">
                    {(selected.user_two?.name ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="absolute top-0 left-0 w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-[9px] border-2 border-white">
                    {(selected.user_one?.name ?? "?")[0].toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    {[selected.user_one, selected.user_two].filter(Boolean).map((p: any) => p?.name).join(" · ")}
                  </div>
                  <div className="flex gap-1.5">
                    {[selected.user_one, selected.user_two].filter(Boolean).map((p: any) => (
                      <span key={p.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${roleColor(p.role)}`}>
                        {roleLabel(p.role)}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="ml-auto text-[11px] text-slate-400">{selected.message_count ?? messages.length} messages</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/60">
                {msgLoading && (
                  <div className="flex justify-center py-8">
                    <div className="w-6 h-6 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                  </div>
                )}
                {!msgLoading && messages.length === 0 && (
                  <div className="text-center text-slate-400 py-12 text-sm">No messages yet — send the first one!</div>
                )}
                {messages.map(msg => {
                  const isMine = msg.sender_id === me?.id;
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 ${isMine ? "bg-gradient-to-br from-indigo-500 to-purple-600" : "bg-gradient-to-br from-slate-400 to-slate-500"}`}>
                        {(msg.sender_name ?? "?")[0].toUpperCase()}
                      </div>
                      <div className={`max-w-[72%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                        <div className={`text-[10px] font-medium ${isMine ? "text-right text-indigo-400" : "text-slate-400"}`}>
                          {msg.sender_name}
                          <span className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full ${roleColor(msg.sender_role)}`}>{roleLabel(msg.sender_role)}</span>
                        </div>
                        <div className={`px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isMine ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"}`}>
                          {msg.content}
                        </div>
                        <div className={`text-[10px] text-slate-400 ${isMine ? "text-right" : ""}`}>
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-100 bg-white px-4 py-3">
                <div className="flex items-end gap-2 bg-slate-50 rounded-2xl px-4 py-2 border border-slate-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                  <textarea
                    rows={1}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder={`Message ${[selected.user_one, selected.user_two].filter(Boolean).map((p: any) => p?.name).join(" & ")}…`}
                    className="flex-1 bg-transparent border-0 outline-none text-[13px] text-slate-800 placeholder:text-slate-400 resize-none max-h-28 leading-relaxed py-1"
                    style={{ minHeight: "28px" }}
                    onKeyDown={e => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                    }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!text.trim() || sending}
                    className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 shrink-0 mb-0.5"
                  >
                    {sending
                      ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <i className="lnr lnr-paper-plane text-xs"></i>
                    }
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Enter to send · Shift+Enter for new line</p>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

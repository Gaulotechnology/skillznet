import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../../../components/layout/DashboardLayout";
import { adminApi } from "../../../services/api";

interface Conversation {
  id: number;
  participant: { id: number; name: string; role: string };
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
  is_admin: boolean;
}

export function DashboardConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  // New conversation modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [newRecipientId, setNewRecipientId] = useState<number | null>(null);
  const [newFirstMessage, setNewFirstMessage] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [creatingConversation, setCreatingConversation] = useState(false);

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = () => {
    setLoading(true);
    adminApi.getConversations()
      .then(res => setConversations(res.conversations || []))
      .catch(() => showNotification("Failed to load conversations.", "error"))
      .finally(() => setLoading(false));
  };

  const openConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    setMessagesLoading(true);
    adminApi.getConversation(conv.id)
      .then(res => setMessages(res.messages || []))
      .catch(() => showNotification("Failed to load messages.", "error"))
      .finally(() => setMessagesLoading(false));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    setSendingMessage(true);
    try {
      await adminApi.sendMessage(activeConversation.id, { content: newMessage.trim() });
      setNewMessage("");
      // Refresh messages
      const res = await adminApi.getConversation(activeConversation.id);
      setMessages(res.messages || []);
      fetchConversations();
    } catch {
      showNotification("Failed to send message.", "error");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openNewConversation = () => {
    setShowNewModal(true);
    setNewRecipientId(null);
    setNewFirstMessage("");
    setUserSearch("");
    // Load all users for recipient selection
    adminApi.getUsers()
      .then(res => setAllUsers(res.users || []))
      .catch(() => showNotification("Failed to load users.", "error"));
  };

  const handleStartConversation = async () => {
    if (!newRecipientId || !newFirstMessage.trim()) return;
    setCreatingConversation(true);
    try {
      const res = await adminApi.startConversation({ recipient_id: newRecipientId, content: newFirstMessage.trim() });
      showNotification("Conversation started!");
      setShowNewModal(false);
      fetchConversations();
      // Open the new conversation
      if (res.conversation) {
        openConversation(res.conversation);
      }
    } catch {
      showNotification("Failed to start conversation.", "error");
    } finally {
      setCreatingConversation(false);
    }
  };

  const filteredConversations = conversations.filter(c =>
    (c.participant?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = allUsers.filter(u =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      provider: "bg-blue-50 text-blue-600 border-blue-100",
      seeker: "bg-teal-50 text-teal-600 border-teal-100",
      admin: "bg-purple-50 text-purple-600 border-purple-100",
      agent: "bg-amber-50 text-amber-600 border-amber-100",
      affiliate: "bg-pink-50 text-pink-600 border-pink-100",
    };
    return styles[role] || "bg-slate-50 text-slate-600 border-slate-100";
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-full mx-auto relative h-[calc(100vh-80px)]">

        {/* Toast */}
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-[13px] shadow-2xl transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} ${toastType === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}>
          <i className={`lnr ${toastType === 'success' ? 'lnr-checkmark-circle' : 'lnr-warning'} text-lg`}></i>
          {toastMessage}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Conversations</h2>
            <p className="text-slate-500 text-[13px] mt-0.5">Messages between platform users</p>
          </div>
          <button
            onClick={openNewConversation}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <i className="lnr lnr-plus-circle"></i> New Message
          </button>
        </div>

        {/* Main Chat Layout */}
        <div className="bg-white rounded-xl border border-slate-50 overflow-hidden shadow-sm flex h-[calc(100%-80px)]">
          
          {/* Sidebar - Conversation List */}
          <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
            {/* Search */}
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <i className="lnr lnr-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]"></i>
                <input
                  type="text"
                  placeholder="Search conversations…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Conversation items */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-3 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400 px-4 text-center">
                  <i className="lnr lnr-bubble text-3xl mb-2 opacity-30"></i>
                  <p className="font-medium text-[13px]">No conversations yet</p>
                  <p className="text-[12px] mt-1">Start a new message to begin</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => openConversation(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors flex items-start gap-3 ${activeConversation?.id === conv.id ? 'bg-indigo-50/50 border-l-2 border-l-indigo-500' : ''}`}
                  >
                    {conv.participant?.avatar ? (
                      <img src={conv.participant.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5" />
                    ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600 text-[11px] shrink-0 mt-0.5">
                      {(conv.participant?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-slate-800 text-[13px] truncate">{conv.participant?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadge(conv.participant?.role)}`}>
                          {conv.participant?.role || 'user'}
                        </span>
                      </div>
                      <p className="text-[12px] text-slate-500 truncate mt-1">{conv.last_message || 'No messages yet'}</p>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-1">
                        {conv.unread_count}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <i className="lnr lnr-bubble text-3xl opacity-40"></i>
                </div>
                <p className="font-medium text-[13px]">Select a conversation to view messages</p>
                <p className="text-[12px] mt-1">Or start a new one with the button above</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    {activeConversation.participant?.avatar ? (
                      <img src={activeConversation.participant.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-[12px]">
                      {(activeConversation.participant?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800 text-[14px]">{activeConversation.participant?.name || 'Unknown'}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRoleBadge(activeConversation.participant?.role)}`}>
                        {activeConversation.participant?.role || 'user'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="w-8 h-8 border-3 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <p className="font-medium text-[13px]">No messages in this conversation</p>
                      <p className="text-[12px] mt-1">Send the first message below</p>
                    </div>
                  ) : (
                    messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${msg.is_admin ? 'order-2' : ''}`}>
                          <div className={`rounded-2xl px-4 py-3 ${msg.is_admin ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                            {!msg.is_admin && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-[12px]">{msg.sender_name}</span>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${getRoleBadge(msg.sender_role)}`}>
                                  {msg.sender_role}
                                </span>
                              </div>
                            )}
                            <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <p className={`text-[10px] mt-1 px-2 ${msg.is_admin ? 'text-right' : ''} text-slate-400`}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message… (Enter to send)"
                      rows={1}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-[13px] hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      {sendingMessage ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <><i className="lnr lnr-location"></i> Send</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* New Conversation Modal */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => !creatingConversation && setShowNewModal(false)} />
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">New Conversation</h3>
                <button onClick={() => !creatingConversation && setShowNewModal(false)} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                  <i className="lnr lnr-cross text-[12px]"></i>
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* User Search */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Recipient</label>
                  <div className="relative">
                    <i className="lnr lnr-magnifier absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]"></i>
                    <input
                      type="text"
                      placeholder="Search users by name or email…"
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                  {/* User list */}
                  <div className="mt-2 max-h-40 overflow-y-auto border border-slate-100 rounded-xl">
                    {filteredUsers.length === 0 ? (
                      <p className="px-4 py-3 text-[12px] text-slate-400 text-center">No users found</p>
                    ) : (
                      filteredUsers.slice(0, 20).map(u => (
                        <button
                          key={u.id}
                          onClick={() => setNewRecipientId(u.id)}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${newRecipientId === u.id ? 'bg-indigo-50' : ''}`}
                        >
                          {u.avatar ? (
                            <img src={u.avatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                          ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600 text-[10px] shrink-0">
                            {(u.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-800 text-[13px] truncate block">{u.name}</span>
                            <span className="text-[11px] text-slate-400">{u.email || u.phone_number || ''}</span>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadge(u.role)}`}>
                            {u.role}
                          </span>
                          {newRecipientId === u.id && (
                            <i className="lnr lnr-checkmark-circle text-indigo-500 shrink-0"></i>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-1">Message</label>
                  <textarea
                    value={newFirstMessage}
                    onChange={e => setNewFirstMessage(e.target.value)}
                    placeholder="Type your message…"
                    rows={3}
                    className="w-full px-4 py-2.5 text-[13px] bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => !creatingConversation && setShowNewModal(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-[13px] hover:bg-slate-200 transition-colors">Cancel</button>
                  <button
                    onClick={handleStartConversation}
                    disabled={creatingConversation || !newRecipientId || !newFirstMessage.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[13px] hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {creatingConversation ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending…</> : "Send Message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

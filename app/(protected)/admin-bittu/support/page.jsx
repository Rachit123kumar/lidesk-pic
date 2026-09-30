"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Send, 
  Loader2, 
  Search, 
  MoreVertical, 
  UserCircle, 
  MessageSquareOff,
  Paperclip,
  CheckCheck,
  Circle,
  ChevronLeft
} from "lucide-react";

export default function AdminSupportPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  async function loadConversations() {
    try {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = await res.json();
      
      setConversations(data.conversations || []);
      // Auto-select first conversation only on desktop
      if (!selectedId && data.conversations?.length > 0 && window.innerWidth >= 768) {
        setSelectedId(data.conversations[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }

  async function loadConversation(id) {
    try {
      const res = await fetch(`/api/admin/support/${id}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = await res.json();
      setSelectedConversation(data.conversation);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadConversations();
    
    // Handle window resize to auto-select chat on desktop if none selected
    const handleResize = () => {
      if (window.innerWidth >= 768 && !selectedId && conversations.length > 0) {
        setSelectedId(conversations[0].id);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [conversations.length, selectedId]);

  useEffect(() => {
    if (selectedId) {
      loadConversation(selectedId);
    } else {
      setSelectedConversation(null);
    }
  }, [selectedId]);

  async function sendReply() {
    const trimmed = reply.trim();
    if (!trimmed || !selectedId || sending) return;
    
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${selectedId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send reply");

      setSelectedConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, data.message],
      }));
      setReply("");
      await loadConversations();
    } catch (error) {
      console.error(error);
      alert("Failed to send reply.");
    } finally {
      setSending(false);
    }
  }

  const filteredConversations = conversations.filter(c => 
    c.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-60px)] lg:h-screen overflow-hidden bg-[#09090b] text-slate-400">
        <aside className="hidden md:block w-[340px] shrink-0 border-r border-white/5 bg-white/[0.02] p-5">
          <div className="h-7 w-40 bg-white/5 rounded-md animate-pulse mb-6" />
          <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </aside>
        <section className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 opacity-50">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            <p className="text-xs font-medium tracking-widest uppercase text-slate-500">Decrypting Inbox</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] lg:h-screen w-full overflow-hidden bg-transparent text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar: Conversations List (Hidden on mobile when a chat is selected) */}
      <aside className={`w-full md:w-[340px] shrink-0 border-r border-white/[0.08] bg-white/[0.01] flex-col relative z-20 ${selectedId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 md:p-5 border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              Inbox
              <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {conversations.length}
              </span>
            </h1>
          </div>
          
          <div className="mt-4 md:mt-5 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] rounded-xl pl-9 pr-4 py-2.5 text-[13px] outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 transition-all placeholder:text-slate-600 shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
              <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Search className="h-5 w-5 opacity-40" />
              </div>
              <p className="text-sm">No matches found</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const lastMessage = conversation.messages?.[0];
              const isSelected = selectedId === conversation.id;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedId(conversation.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-500/10 border border-blue-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hidden md:flex"
                      : "hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold shadow-inner ${
                      isSelected 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' 
                        : 'bg-white/5 border border-white/10 text-slate-400'
                    }`}>
                      {conversation.user.name ? conversation.user.name.charAt(0).toUpperCase() : <UserCircle className="h-6 w-6" />}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#09090b]"></span>
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[14px] font-medium truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {conversation.user.name || "Unknown User"}
                      </span>
                      <span className={`text-[10px] font-medium whitespace-nowrap ml-2 ${isSelected ? 'text-blue-300' : 'text-slate-500'}`}>
                        {new Date(conversation.lastMessageAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`truncate text-[13px] leading-snug ${isSelected ? 'text-blue-200/80' : 'text-slate-500'}`}>
                      {lastMessage?.message || "No messages yet"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Main Chat Area (Hidden on mobile when NO chat is selected) */}
      <section className={`flex-1 flex-col relative min-h-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-[#09090b] to-[#09090b] ${!selectedId ? 'hidden md:flex' : 'flex'}`}>
        {!selectedConversation ? (
          <div className="flex flex-1 flex-col items-center justify-center text-slate-500 animate-in fade-in duration-700 hidden md:flex">
            <div className="h-20 w-20 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-6 border border-white/[0.05] shadow-2xl">
              <MessageSquareOff className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-xl font-medium text-slate-300 tracking-tight">Your Workspace</p>
            <p className="text-sm mt-2 text-slate-500">Select a conversation from the sidebar to begin.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between border-b border-white/[0.08] bg-[#09090b]/60 backdrop-blur-xl px-4 md:px-8 py-3 md:py-5 shrink-0 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Back Button */}
                <button 
                  onClick={() => setSelectedId(null)}
                  className="md:hidden h-10 w-10 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                
                <div className="relative">
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shadow-inner">
                    {selectedConversation.user.name ? selectedConversation.user.name.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5 md:h-6 md:w-6" />}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    {selectedConversation.user.name || "Unknown User"}
                    <span className="hidden md:flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active
                    </span>
                  </h2>
                  <p className="text-[11px] md:text-[13px] text-slate-400 mt-0.5 flex items-center gap-2 truncate max-w-[150px] md:max-w-none">
                    {selectedConversation.user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-400 transition-colors border border-transparent hover:border-white/10">
                  <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth">
              {selectedConversation.messages.map((item, index) => {
                const isAdmin = item.sender === "admin";
                const isConsecutive = index > 0 && selectedConversation.messages[index - 1].sender === item.sender;

                return (
                  <div 
                    key={item.id} 
                    className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"} ${isConsecutive ? "-mt-4" : ""} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                  >
                    <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isAdmin ? "items-end" : "items-start"}`}>
                      <div
                        className={`px-4 md:px-5 py-3 md:py-3.5 text-[14px] md:text-[15px] leading-relaxed shadow-sm ${
                          isAdmin
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl rounded-tr-sm shadow-blue-900/20 shadow-lg border border-white/10"
                            : "bg-white/[0.04] text-slate-100 rounded-2xl rounded-tl-sm border border-white/[0.08] backdrop-blur-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{item.message}</p>
                      </div>
                      
                      <div className={`flex items-center gap-1.5 mt-1.5 px-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-[10px] font-medium text-slate-500">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isAdmin && (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent shrink-0 relative z-10 pt-6 md:pt-10">
              <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#09090b] border border-white/[0.12] p-1.5 md:p-2 pl-2 md:pl-3 rounded-3xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/40 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                
                <button className="shrink-0 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 transition-colors mb-0.5">
                  <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
                </button>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  placeholder="Draft your message..."
                  rows={1}
                  className="flex-1 max-h-32 min-h-[24px] bg-transparent resize-none py-2 md:py-3 px-2 text-[14px] md:text-[15px] text-slate-100 placeholder:text-slate-500 outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 mb-0.5"
                />

                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="shrink-0 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md group mb-0.5"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5 md:h-4 md:w-4 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </button>
              </div>
              <div className="max-w-4xl mx-auto flex justify-between items-center mt-2 md:mt-3 px-2">
                <p className="text-[10px] md:text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                  <Circle className="h-1.5 w-1.5 fill-emerald-500 text-emerald-500" />
                  <span className="hidden md:inline">System fully operational</span>
                  <span className="md:hidden">Operational</span>
                </p>
                <p className="text-[10px] md:text-[11px] text-slate-500 font-medium hidden sm:block">
                  <kbd className="font-sans px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300 mr-1">Enter</kbd> 
                  to send
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Send, 
  Loader2, 
  Paperclip, 
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function HelpPage() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Smooth auto-scroll to the newest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function loadConversation(isPolling = false) {
    try {
      const res = await fetch("/api/support");
      if (!res.ok) throw new Error("Failed to load support");
      
      const data = await res.json();
      setMessages(data.conversation?.messages ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      if (!isPolling) {
        setTimeout(() => setLoading(false), 500);
      }
    }
  }

  // Initial load and 4-second background polling for new messages
  useEffect(() => {
    loadConversation();

    const intervalId = setInterval(() => {
      loadConversation(true);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  async function sendMessage() {
    const trimmed = message.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setMessages((prev) => [...prev, data.message]);
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Unable to send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  // Skeleton Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-[#09090b] px-4 py-8 flex items-center justify-center font-sans">
        <div className="flex h-[calc(100vh-4rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.01] shadow-2xl relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="border-b border-white/[0.08] px-8 py-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white/5 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/5 rounded-md animate-pulse" />
              <div className="h-3 w-48 bg-white/5 rounded-md animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1 p-8 space-y-6">
            <div className="flex justify-start"><div className="h-16 w-[60%] bg-white/[0.03] rounded-2xl rounded-tl-sm animate-pulse" /></div>
            <div className="flex justify-end"><div className="h-12 w-[40%] bg-white/[0.05] rounded-2xl rounded-tr-sm animate-pulse" /></div>
            <div className="flex justify-start"><div className="h-20 w-[70%] bg-white/[0.03] rounded-2xl rounded-tl-sm animate-pulse" /></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-6 md:py-8 flex items-center justify-center font-sans selection:bg-blue-500/30">
      
      {/* Main Chat Container */}
      <div className="flex h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#09090b]/80 shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)] relative backdrop-blur-2xl">
        
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

        {/* Premium Header with Brand Logo & Dashboard Link */}
        <header className="border-b border-white/[0.08] bg-white/[0.02] px-6 py-4 md:px-8 z-10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-4 group">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 shadow-inner overflow-hidden group-hover:border-blue-500/50 transition-colors">
                <Image src="/logo1.png" alt="LibDesk" width={26} height={26} className="object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#09090b]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                Libdesk Support
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-medium uppercase tracking-wider">Online</span>
              </h1>
              <p className="text-[13px] text-slate-400 mt-0.5">
                We are here, please stay calm, we will help you.
              </p>
            </div>
          </Link>
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full scroll-smooth relative z-10">
          
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center animate-in fade-in duration-700">
              <div className="max-w-sm text-center flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                  <div className="h-16 w-16 relative bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md">
                    <Sparkles className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
                <h2 className="text-xl font-medium text-slate-200 tracking-tight">
                  How can we help you?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-400">
                  Send us a message about any issues you're facing, and our team will get back to you shortly.
                </p>
              </div>
            </div>
          )}

          {messages.map((item, index) => {
            const isUser = item.sender === "user";
            const isConsecutive = index > 0 && messages[index - 1].sender === item.sender;

            return (
              <div
                key={item.id}
                className={`flex w-full ${isUser ? "justify-end" : "justify-start"} ${isConsecutive ? "-mt-4" : ""} animate-in slide-in-from-bottom-3 fade-in duration-400`}
              >
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-2xl rounded-tr-sm shadow-blue-900/20 shadow-lg border border-white/10"
                        : "bg-white/[0.04] text-slate-100 rounded-2xl rounded-tl-sm border border-white/[0.08] backdrop-blur-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{item.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} className="h-2" />
        </div>

        {/* Input Composer */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-[#09090b] via-[#09090b] to-transparent shrink-0 relative z-20">
          <div className="max-w-3xl mx-auto flex items-end gap-2 bg-[#09090b] border border-white/[0.12] p-2 pl-3 rounded-3xl focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500/40 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            
            <button className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full hover:bg-white/5 text-slate-400 transition-colors mb-0.5" aria-label="Attach file">
              <Paperclip className="h-5 w-5" />
            </button>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Write a message..."
              rows={1}
              className="flex-1 max-h-32 min-h-[24px] bg-transparent resize-none py-3 px-2 text-[15px] text-slate-100 placeholder:text-slate-500 outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 mb-0.5"
            />

            <button
              onClick={sendMessage}
              disabled={!message.trim() || sending}
              className="shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md group mb-0.5"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
          
          <div className="flex justify-between items-center mt-3 px-2">
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-600" />
              End-to-end encrypted
            </p>
            <p className="text-[11px] text-slate-500 font-medium hidden md:block">
              <kbd className="font-sans px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300 mr-1">Enter</kbd> 
              to send, <kbd className="font-sans px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300 ml-1 mr-1">Shift</kbd> + <kbd className="font-sans px-1.5 py-0.5 bg-white/5 rounded border border-white/10 text-slate-300 mr-1">Enter</kbd> for new line
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
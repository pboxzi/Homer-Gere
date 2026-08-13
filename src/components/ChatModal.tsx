import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Briefcase, Sparkles, Loader2, Bot } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  initialMode?: 'fan' | 'business';
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  initialMode = 'fan',
  onClose,
}) => {
  const [mode, setMode] = useState<'fan' | 'business'>(initialMode);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message from Homer
      const initialGreeting =
        mode === 'business'
          ? "Hello! Thank you for reaching out regarding professional opportunities, collaborations, or media inquiries. How can my team and I assist you today?"
          : "Hey there! Thanks so much for stopping by my website. What's on your mind today? Ask me anything about 'The Shards', acting, or storytelling!";

      setMessages([
        {
          id: 'welcome',
          sender: 'homer',
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Thank you so much for your support! I really appreciate you connecting.";

      const homerMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'homer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, homerMsg]);
    } catch (err) {
      console.error('Failed to send message:', err);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'homer',
        text: "Thanks so much for reaching out! I'm currently on set, but I've received your note and appreciate your support.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white h-full flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-editorial text-lg flex items-center justify-center">
                HG
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-[#1C1917] text-base sm:text-lg">
                  Homer Gere
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full uppercase">
                  Verified AI
                </span>
              </div>
              <p className="text-xs text-[#44403C] font-medium">
                {mode === 'business' ? 'Business & Media Inquiries' : 'Fan & Community Assistant'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#A8A29E] hover:text-[#1C1917] rounded-full hover:bg-[#EDE9E0] focus:outline-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-4 py-2 bg-[#F5F2EB] flex items-center gap-2">
          <button
            onClick={() => setMode('fan')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              mode === 'fan'
                ? 'bg-white text-blue-600'
                : 'text-[#44403C] hover:text-[#1C1917]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Fan Chat
          </button>

          <button
            onClick={() => setMode('business')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              mode === 'business'
                ? 'bg-white text-blue-600'
                : 'text-[#44403C] hover:text-[#1C1917]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Business Chat
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#F5F2EB]/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-[#1C1917] rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-[#A8A29E] mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#44403C] bg-white rounded-2xl px-4 py-3 w-fit">
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Homer is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="px-4 py-2 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar">
          {mode === 'fan' ? (
            <>
              <button
                onClick={() => setInput("Tell me about 'The Shards'!")}
                className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
              >
                🎬 Tell me about 'The Shards'!
              </button>
              <button
                onClick={() => setInput("What inspired you to start acting?")}
                className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
              >
                🌟 Acting inspiration?
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setInput("I'm inquiring about a media interview opportunity.")}
                className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
              >
                🎙️ Press & Interview inquiry
              </button>
              <button
                onClick={() => setInput("I'd like to discuss a film project collaboration.")}
                className="whitespace-nowrap px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100 transition-colors focus:outline-none cursor-pointer"
              >
                💼 Brand / Film collaboration
              </button>
            </>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'business'
                ? 'Type business or collaboration inquiry...'
                : 'Ask Homer a question or share a note...'
            }
            className="flex-1 px-4 py-2.5 bg-[#F5F2EB] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all focus:outline-none cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};

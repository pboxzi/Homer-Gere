import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Phone, Image, X, Play, Smile } from 'lucide-react';
import { ChatMessage, ChatMedia } from '../../types';
import { CHAT_SETTINGS } from '../../data/chatSettings';
import { IMAGES } from '../../data/images';

interface FanChatProps {
  onBack: () => void;
}

export const FanChat: React.FC<FanChatProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<ChatMedia | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const settings = CHAT_SETTINGS.fanChat;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'homer',
          text: "Hey, I'm glad you're here. This is my private space — no noise, just us. So tell me, what brings you here tonight?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) return;
    const url = URL.createObjectURL(file);
    setMediaPreview({ type: isImage ? 'image' : 'video', url, name: file.name });
    e.target.value = '';
  };

  const removeMediaPreview = () => {
    if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!input.trim() && !mediaPreview) || loading) return;

    const userText = input.trim();
    const attachedMedia = mediaPreview ? { ...mediaPreview } : undefined;
    setInput('');
    setMediaPreview(null);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText || (attachedMedia ? `Sent a ${attachedMedia.type}` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      media: attachedMedia,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'fan',
          messages: [...messages, userMsg].map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            text: m.text,
          })),
        }),
      });
      const data = await response.json();
      const replyText = data.reply || "That means a lot. Thanks for sharing that with me.";
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'homer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'homer',
        text: "I'm a little tied up right now, but I didn't want you to think I forgot about you. I'll be back soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const number = settings.whatsappNumber;
    const message = encodeURIComponent("Hey Homer, just wanted to say hi from your website.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  const sendSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full bg-[#FAF9F7]">
      <div className="max-w-lg mx-auto flex flex-col bg-white h-[calc(100vh-64px)] lg:h-[calc(100vh-112px)] lg:my-4 lg:rounded-2xl lg:overflow-hidden lg:shadow-[0_0_40px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-[#E8E5DF]/60">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#A6852F]/30 ring-offset-2 ring-offset-white">
                <img src={IMAGES.homerGqLifestyleStudio} alt="Homer Gere" referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[13px] font-semibold text-[#1C1917] truncate">Homer Gere</h1>
              <p className="text-[11px] text-[#16A34A] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block animate-pulse" />
                Online now
              </p>
            </div>
            {settings.whatsappEnabled && (
              <button onClick={handleOpenWhatsApp} className="w-9 h-9 rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors cursor-pointer">
                <Phone className="w-4.5 h-4.5" />
              </button>
            )}
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[#FAF9F7]/50 px-4 py-4">
          <div className="flex justify-center mb-4">
            <span className="text-[10px] text-[#57534E]/50 bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
          </div>

          <div className="space-y-0.5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mb-4">
                      <img src={IMAGES.homerGqLifestyleStudio} alt="Homer" referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" />
                    </div>
                  )}
                  <div className={`max-w-[82%] ${isUser ? 'order-1' : ''}`}>
                    {msg.media && (
                      <div className={`mb-1 ${isUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'} overflow-hidden`}>
                        {msg.media.type === 'image' ? (
                          <img src={msg.media.url} alt={msg.media.name || 'Shared image'} className="max-w-full max-h-56 object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <video src={msg.media.url} className="max-w-full max-h-56" controls preload="metadata" />
                        )}
                      </div>
                    )}
                    {msg.text && (
                      <div className={`px-3.5 py-2 text-[13px] leading-[1.45] ${
                        isUser
                          ? 'bg-[#A6852F] text-white rounded-2xl rounded-br-sm'
                          : 'bg-white text-[#1C1917] rounded-2xl rounded-bl-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                    <p className={`text-[10px] text-[#57534E]/40 mt-0.5 px-0.5 ${isUser ? 'text-right' : ''}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2 mt-0.5">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                <img src={IMAGES.homerGqLifestyleStudio} alt="Homer" referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F]/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F]/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Bottom */}
        <footer className="shrink-0 bg-white border-t border-[#E8E5DF]/60">
          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pt-3 pb-1">
              <div className="flex gap-2 overflow-x-auto">
                <button onClick={() => sendSuggestion("I've been thinking about you...")} className="whitespace-nowrap px-3 py-1.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-[11px] hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  I've been thinking...
                </button>
                <button onClick={() => sendSuggestion("You looked incredible in that last post.")} className="whitespace-nowrap px-3 py-1.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-[11px] hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  You looked incredible
                </button>
                <button onClick={() => sendSuggestion("Tell me something personal about yourself.")} className="whitespace-nowrap px-3 py-1.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-[11px] hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  Tell me something personal
                </button>
              </div>
            </div>
          )}

          {/* Media Preview */}
          {mediaPreview && (
            <div className="px-4 pt-2">
              <div className="relative inline-block">
                {mediaPreview.type === 'image' ? (
                  <img src={mediaPreview.url} alt="Preview" className="h-16 rounded-xl object-cover" />
                ) : (
                  <div className="relative h-16 w-28 rounded-xl overflow-hidden bg-black/10">
                    <video src={mediaPreview.url} className="h-full w-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                )}
                <button onClick={removeMediaPreview} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1C1917] text-white flex items-center justify-center cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-8 h-8 rounded-full flex items-center justify-center text-[#57534E] hover:text-[#A6852F] hover:bg-[#F3F1ED] transition-colors cursor-pointer shrink-0">
              <Image className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />

            <div className="flex-1 flex items-center bg-[#F3F1ED] rounded-full px-3.5 py-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Say something to me..."
                className="flex-1 bg-transparent text-[13px] text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none min-w-0"
              />
              <button type="button" className="w-6 h-6 rounded-full flex items-center justify-center text-[#57534E]/40 hover:text-[#57534E] transition-colors cursor-pointer shrink-0 ml-1">
                <Smile className="w-4 h-4" />
              </button>
            </div>

            <button
              type="submit"
              disabled={(!input.trim() && !mediaPreview) || loading}
              className="w-8 h-8 rounded-full bg-[#A6852F] hover:bg-[#B8983A] disabled:opacity-30 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, ArrowLeft, Loader2, Phone, Shield, Image, X, Play } from 'lucide-react';
import { ChatMessage, ChatMedia } from '../../types';
import { CHAT_SETTINGS } from '../../data/chatSettings';

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
  const settings = CHAT_SETTINGS.fanChat;

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'homer',
          text: "Hey there! Thanks so much for stopping by. What's on your mind today? Ask me anything about 'The Shards', acting, or storytelling!",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) return;

    const url = URL.createObjectURL(file);
    setMediaPreview({
      type: isImage ? 'image' : 'video',
      url,
      name: file.name,
    });

    e.target.value = '';
  };

  const removeMediaPreview = () => {
    if (mediaPreview?.url) {
      URL.revokeObjectURL(mediaPreview.url);
    }
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
      const replyText = data.reply || "Thank you so much for sharing! I really appreciate you connecting.";

      const homerMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'homer',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, homerMsg]);
    } catch {
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

  const handleOpenWhatsApp = () => {
    const number = settings.whatsappNumber;
    const message = encodeURIComponent("Hi Homer! I'm a fan reaching out from your official website.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <section className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#C9A84C] transition-colors duration-300 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-[#C9A84C] text-white font-editorial text-lg flex items-center justify-center">
                  HG
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] rounded-full border-2 border-[#FAF9F7]" />
              </div>
              <div>
                <h2 className="text-lg font-editorial text-[#1C1917]">Homer Gere</h2>
                <p className="text-xs text-[#57534E]">Online — Fan Chat</p>
              </div>
            </div>

            {settings.whatsappEnabled && (
              <button
                onClick={handleOpenWhatsApp}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-full hover:bg-[#25D366]/20 transition-colors duration-300 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                WhatsApp
              </button>
            )}
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden shadow-sm">
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#C9A84C] text-white rounded-br-none'
                        : 'bg-[#F3F1ED] text-[#1C1917] rounded-bl-none'
                    }`}
                  >
                    {/* Media Attachment */}
                    {msg.media && (
                      <div className="mb-2">
                        {msg.media.type === 'image' ? (
                          <img
                            src={msg.media.url}
                            alt={msg.media.name || 'Shared image'}
                            className="rounded-xl max-w-full max-h-48 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="relative rounded-xl overflow-hidden bg-black/10">
                            <video
                              src={msg.media.url}
                              className="max-w-full max-h-48"
                              controls
                              preload="metadata"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text */}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                  <span className="text-[10px] text-[#57534E] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-[#57534E] bg-[#F3F1ED] rounded-2xl px-4 py-3 w-fit">
                  <Loader2 className="w-4 h-4 text-[#C9A84C] animate-spin" />
                  <span>Homer is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Media Preview */}
            {mediaPreview && (
              <div className="px-5 py-3 border-t border-[#E8E5DF]/60 bg-[#F3F1ED]/30">
                <div className="relative inline-block">
                  {mediaPreview.type === 'image' ? (
                    <img
                      src={mediaPreview.url}
                      alt="Preview"
                      className="h-20 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="relative h-20 w-32 rounded-lg overflow-hidden bg-black/10">
                      <video
                        src={mediaPreview.url}
                        className="h-full w-full object-cover"
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white/80" />
                      </div>
                    </div>
                  )}
                  <button
                    onClick={removeMediaPreview}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="px-5 py-2.5 border-t border-[#E8E5DF]/60 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setInput("Tell me about 'The Shards'!")}
                className="whitespace-nowrap px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full text-xs hover:bg-[#C9A84C]/20 transition-colors cursor-pointer"
              >
                Tell me about The Shards!
              </button>
              <button
                onClick={() => setInput("What inspired you to start acting?")}
                className="whitespace-nowrap px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full text-xs hover:bg-[#C9A84C]/20 transition-colors cursor-pointer"
              >
                Acting inspiration?
              </button>
              <button
                onClick={() => setInput("How was working with Ryan Murphy?")}
                className="whitespace-nowrap px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full text-xs hover:bg-[#C9A84C]/20 transition-colors cursor-pointer"
              >
                Working with Ryan Murphy?
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 flex items-center gap-2">
              {/* Media Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-10 h-10 rounded-full bg-[#F3F1ED] hover:bg-[#E8E5DF] text-[#57534E] hover:text-[#C9A84C] flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                <Image className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message to Homer..."
                className="flex-1 px-4 py-2.5 bg-[#F3F1ED] rounded-full text-sm text-[#1C1917] placeholder:text-[#57534E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={(!input.trim() && !mediaPreview) || loading}
                className="w-10 h-10 rounded-full bg-[#C9A84C] hover:bg-[#B8983A] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* WhatsApp Premium Banner */}
          {settings.whatsappEnabled && (
            <div className="mt-6 p-4 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">Premium WhatsApp Access</p>
                  <p className="text-xs text-[#57534E]">Upgrade to Gold or Platinum membership to chat directly on WhatsApp.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

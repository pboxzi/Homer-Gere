import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Send, ArrowLeft, Phone, Shield, Image, X, Play } from 'lucide-react';
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
  const settings = CHAT_SETTINGS.fanChat;

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'homer',
          text: "Hey, you made it. I've been looking forward to this. Make yourself comfortable — what's on your mind?",
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
      const replyText = data.reply || "That means a lot. Thanks for sharing that with me.";

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
        text: "I'm a little tied up right now, but I didn't want you to think I forgot about you. I'll be back soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsApp = () => {
    const number = settings.whatsappNumber;
    const message = encodeURIComponent("Hey Homer, just wanted to say hi from your website.");
    window.open(`https://wa.me/${number}?text=${message}`, '_blank');
  };

  return (
    <section className="relative min-h-screen bg-[#FAF9F7] overflow-hidden">
      {/* Soft Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#A6852F]/3 via-transparent to-[#FAF9F7]" />
      <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-[#A6852F]/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#A6852F] transition-colors duration-300 mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Chat Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={IMAGES.homerGqLifestyleStudio}
                    alt="Homer Gere"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16A34A] rounded-full border-2 border-[#FAF9F7]" />
              </div>
              <div>
                <h2 className="text-lg font-editorial text-[#1C1917]">Homer Gere</h2>
                <p className="text-xs text-[#57534E]">Online now</p>
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

          {/* Messages */}
          <div className="h-[420px] overflow-y-auto p-5 space-y-4 rounded-3xl bg-white/50 backdrop-blur-sm mb-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {msg.sender === 'homer' && (
                  <div className="flex items-end gap-2 mb-1">
                    <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                      <img
                        src={IMAGES.homerGqLifestyleStudio}
                        alt="Homer"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="max-w-[75%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-[#F3F1ED] text-[#1C1917]">
                      {msg.media && (
                        <div className="mb-2">
                          {msg.media.type === 'image' ? (
                            <img src={msg.media.url} alt={msg.media.name || 'Shared image'} className="rounded-xl max-w-full max-h-48 object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <video src={msg.media.url} className="rounded-xl max-w-full max-h-48" controls preload="metadata" />
                          )}
                        </div>
                      )}
                      {msg.text && <p>{msg.text}</p>}
                    </div>
                  </div>
                )}

                {msg.sender === 'user' && (
                  <div className="max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-[#A6852F] text-white">
                    {msg.media && (
                      <div className="mb-2">
                        {msg.media.type === 'image' ? (
                          <img src={msg.media.url} alt={msg.media.name || 'Shared image'} className="rounded-xl max-w-full max-h-48 object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <video src={msg.media.url} className="rounded-xl max-w-full max-h-48" controls preload="metadata" />
                        )}
                      </div>
                    )}
                    {msg.text && <p>{msg.text}</p>}
                  </div>
                )}

                <span className="text-[10px] text-[#57534E]/60 mt-1 px-1">{msg.timestamp}</span>
              </motion.div>
            ))}

            {loading && (
              <motion.div className="flex items-center gap-2 text-xs text-[#57534E] bg-[#F3F1ED] rounded-2xl px-4 py-3 w-fit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6852F] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Homer is typing...</span>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Media Preview */}
          {mediaPreview && (
            <div className="mb-3 px-2">
              <div className="relative inline-block">
                {mediaPreview.type === 'image' ? (
                  <img src={mediaPreview.url} alt="Preview" className="h-20 rounded-xl object-cover" />
                ) : (
                  <div className="relative h-20 w-32 rounded-xl overflow-hidden bg-black/10">
                    <video src={mediaPreview.url} className="h-full w-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                )}
                <button onClick={removeMediaPreview} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#1C1917] text-white flex items-center justify-center cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Suggestions */}
          <div className="flex items-center gap-2 overflow-x-auto mb-4 px-1">
            <button onClick={() => setInput("I just wanted to say you're incredible in The Shards.")} className="whitespace-nowrap px-4 py-1.5 bg-[#A6852F]/10 text-[#A6852F] rounded-full text-xs hover:bg-[#A6852F]/20 transition-colors cursor-pointer">
              You're incredible
            </button>
            <button onClick={() => setInput("What's been the highlight of your career so far?")} className="whitespace-nowrap px-4 py-1.5 bg-[#A6852F]/10 text-[#A6852F] rounded-full text-xs hover:bg-[#A6852F]/20 transition-colors cursor-pointer">
              Career highlight?
            </button>
            <button onClick={() => setInput("Would love to grab a coffee sometime.")} className="whitespace-nowrap px-4 py-1.5 bg-[#A6852F]/10 text-[#A6852F] rounded-full text-xs hover:bg-[#A6852F]/20 transition-colors cursor-pointer">
              Coffee sometime?
            </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full bg-[#F3F1ED] hover:bg-[#E8E5DF] text-[#57534E] hover:text-[#A6852F] flex items-center justify-center shrink-0 transition-all cursor-pointer">
              <Image className="w-4 h-4" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />

            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Say something nice..." className="flex-1 px-4 py-2.5 bg-[#F3F1ED] rounded-full text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 focus:bg-white transition-all" />
            <button type="submit" disabled={(!input.trim() && !mediaPreview) || loading} className="w-10 h-10 rounded-full bg-[#A6852F] hover:bg-[#B8983A] disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-all cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* WhatsApp Premium Banner */}
          {settings.whatsappEnabled && (
            <motion.div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#25D366]/5 to-[#25D366]/10 border border-[#25D366]/20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">Want Homer's WhatsApp?</p>
                  <p className="text-xs text-[#57534E]">Upgrade to Gold or Platinum for direct access.</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

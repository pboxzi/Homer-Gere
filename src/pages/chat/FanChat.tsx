import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ArrowLeft, Phone, Image, X, Play, Smile, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { ChatMessage, ChatMedia } from '../../types';
import { CHAT_SETTINGS } from '../../data/chatSettings';
import { IMAGES } from '../../data/images';
import { useAuth } from '../../context/AuthContext';
import { fanChatRepository } from '../../lib/repositories';
import { supabase } from '../../lib/supabase';
import type { FanConversation } from '../../types/database';
import { checkRateLimit, sanitizeInput } from '../../lib/security';

function getFanConversationId(user?: { email?: string; firstName?: string; lastName?: string }): string {
  if (user?.email) return `fan-${user.email}`;
  return 'fan-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface FanChatProps {
  onBack: () => void;
}

const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 10;
const MAX_MESSAGE_LENGTH = 2000;

async function uploadChatMedia(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `fan-chat/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from('chat-media').upload(path, file, { upsert: false });
  if (error) return null;
  const { data } = supabase.storage.from('chat-media').getPublicUrl(path);
  return data?.publicUrl || null;
}

export const FanChat: React.FC<FanChatProps> = ({ onBack }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<ChatMedia | null>(null);
  const [inputError, setInputError] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageTimestampsRef = useRef<number[]>([]);
  const conversationIdRef = useRef<string | null>(null);
  const mediaFileRef = useRef<File | null>(null);
  const settings = CHAT_SETTINGS.fanChat;
  const { user } = useAuth();
  const hasMembership = user?.membershipTier === 'Gold' || user?.membershipTier === 'Platinum';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      const participantId = getFanConversationId(user);
      fanChatRepository.getConversations()
        .then((conversations) => {
          const conv = conversations.find((c) => c.participant === participantId);
          if (conv) {
            conversationIdRef.current = conv.id;
            return fanChatRepository.getMessages(conv.id);
          }
          return null;
        })
        .then((dbMessages) => {
          if (dbMessages && dbMessages.length > 0) {
            const loaded: ChatMessage[] = dbMessages.map((m, i) => ({
              id: `loaded-${i}`,
              sender: m.sender === 'admin' ? 'homer' as const : 'user' as const,
              text: m.text,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              media: m.media_type && m.media_url ? { type: m.media_type, url: m.media_url } : undefined,
            }));
            setMessages(loaded);
          } else {
            setMessages([
              {
                id: 'welcome',
                sender: 'homer',
                text: "Hey, I'm glad you're here. This is my private space — no noise, just us. So tell me, what brings you here tonight?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }
        })
        .catch(() => {
          setMessages([
            {
              id: 'welcome',
              sender: 'homer',
              text: "Hey, I'm glad you're here. This is my private space — no noise, just us. So tell me, what brings you here tonight?",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
        });
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messages.length === 0) return;
      const cid = conversationIdRef.current;
      if (!cid) return;
      fanChatRepository.getMessages(cid)
        .then((dbMessages) => {
          if (!dbMessages) return;
          const adminMsgs = dbMessages.filter((m) => m.sender === 'admin');
          const homerMsgs = messages.filter((m) => m.sender === 'homer');
          if (adminMsgs.length > homerMsgs.length) {
            const newAdminMsgs = adminMsgs.slice(homerMsgs.length);
            const newChatMsgs: ChatMessage[] = newAdminMsgs.map((m, i) => ({
              id: `admin-${Date.now()}-${i}`,
              sender: 'homer' as const,
              text: m.text,
              timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              media: m.media_type && m.media_url ? { type: m.media_type, url: m.media_url } : undefined,
            }));
            setMessages((prev) => [...prev, ...newChatMsgs]);
          }
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length, user]);

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
    mediaFileRef.current = file;
    setMediaPreview({ type: isImage ? 'image' : 'video', url, name: file.name });
    e.target.value = '';
  };

  const removeMediaPreview = () => {
    if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
    mediaFileRef.current = null;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setInputError('');

    const userText = input.trim();
    if (!userText && !mediaPreview) {
      setInputError('Please enter a message or attach media.');
      return;
    }

    if (!checkRateLimit('fan-chat', RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)) {
      setInputError('You\'re sending messages too quickly. Please wait a moment and try again.');
      return;
    }

    const sanitizedText = userText ? sanitizeInput(userText) : '';

    if (sanitizedText.length > MAX_MESSAGE_LENGTH) {
      setInputError(`Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`);
      return;
    }

    const now = Date.now();
    messageTimestampsRef.current = messageTimestampsRef.current.filter((t) => now - t < RATE_LIMIT_WINDOW);
    if (messageTimestampsRef.current.length >= RATE_LIMIT_MAX) {
      const oldestInWindow = messageTimestampsRef.current[0];
      const waitTime = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestInWindow)) / 1000);
      setRateLimited(true);
      setRateLimitCountdown(waitTime);
      const countdownInterval = setInterval(() => {
        setRateLimitCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setInputError(`You're sending messages too quickly. Please wait ${waitTime}s.`);
      return;
    }

    if (loading) return;
    messageTimestampsRef.current.push(now);

    const attachedMedia = mediaPreview ? { ...mediaPreview } : undefined;
    setInput('');
    setMediaPreview(null);

    const displayText = sanitizedText || (attachedMedia ? `Sent a ${attachedMedia.type}` : '');

    let uploadedMediaUrl: string | null = null;
    let uploadedMediaType: 'image' | 'video' | null = null;
    if (attachedMedia && mediaFileRef.current) {
      uploadedMediaUrl = await uploadChatMedia(mediaFileRef.current);
      uploadedMediaType = attachedMedia.type;
      mediaFileRef.current = null;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: displayText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      media: uploadedMediaUrl && uploadedMediaType ? { type: uploadedMediaType, url: uploadedMediaUrl } : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const participantId = getFanConversationId(user);
      const participantName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Fan Visitor';
      const email = user?.email || '';

      let conversation = conversationIdRef.current
        ? await fanChatRepository.getConversationById(conversationIdRef.current)
        : null;

      if (!conversation) {
        const conversations = await fanChatRepository.getConversations();
        conversation = conversations.find((c) => c.participant === participantId) || null;
      }

      if (!conversation) {
        conversation = await fanChatRepository.createConversation({
          participant: participantId,
          email,
          phone: null,
          membership_tier: user?.membershipTier || null,
          status: 'open',
          method: 'fan_chat',
          user_id: user?.id || null,
        });
      }

      conversationIdRef.current = conversation.id;

      await fanChatRepository.sendMessage({
        conversation_id: conversation.id,
        sender: 'user',
        text: displayText,
        media_type: uploadedMediaType,
        media_url: uploadedMediaUrl,
      });
    } catch {
      // Silently handle errors to avoid breaking UX
    }

    setLoading(false);
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
    <div className="w-full bg-[#FAF9F7] h-full">
      <div className="max-w-2xl mx-auto flex flex-col bg-white h-full lg:my-4 lg:rounded-2xl lg:shadow-[0_0_40px_rgba(0,0,0,0.04)] lg:h-[calc(100%-2rem)]">

        {/* Header - always visible at top */}
        <div className="shrink-0 bg-white border-b border-[#E8E5DF]/60 px-4 py-3 flex items-center gap-3 relative z-10">
          <button onClick={onBack} className="w-11 h-11 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-[#A6852F]/30 ring-offset-2 ring-offset-white">
              <img src={IMAGES.homerGqLifestyleStudio} alt="Homer Gere" referrerPolicy="no-referrer" className="w-full h-full object-cover object-top" loading="lazy" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#16A34A] rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-semibold text-[#1C1917] truncate">Homer Gere</h1>
            <p className="text-[11px] text-[#57534E] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block animate-pulse" />
              may reply instantly
            </p>
          </div>
          {settings.whatsappEnabled && hasMembership && (
            <button onClick={handleOpenWhatsApp} className="w-11 h-11 rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors cursor-pointer">
              <Phone className="w-4.5 h-4.5" />
            </button>
          )}
          {settings.whatsappEnabled && !hasMembership && (
            <div className="flex items-center gap-1.5 bg-[#A6852F]/8 px-2.5 py-1.5 rounded-full cursor-default" title="Unlock WhatsApp access with Gold membership or higher">
              <Phone className="w-3 h-3 text-[#A6852F]" />
              <span className="text-xs font-medium text-[#A6852F] whitespace-nowrap">Unlock WhatsApp with Gold</span>
            </div>
          )}
        </div>

        {/* Messages - scrollable middle */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain bg-[#FAF9F7]/50 px-3 sm:px-4 py-3">
          <div className="flex justify-center mb-4">
            <span className="text-xs text-[#57534E]/50 bg-white px-3 py-1 rounded-full shadow-sm">Today</span>
          </div>

          <div className="space-y-0.5">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 mb-4">
                      <img src={IMAGES.homerGqLifestyleStudio} alt="Homer" referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" loading="lazy" />
                    </div>
                  )}
                  <div className={`max-w-[88%] ${isUser ? 'order-1' : ''}`}>
                    {msg.media && (
                      <div className={`mb-1 ${isUser ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'} overflow-hidden`}>
                        {msg.media.type === 'image' ? (
                          <img src={msg.media.url} alt={msg.media.name || 'Shared image'} className="max-w-full max-h-56 object-cover" referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <video src={msg.media.url} className="max-w-full max-h-56" controls preload="metadata" />
                        )}
                      </div>
                    )}
                    {msg.text && (
                      <div className={`px-3.5 py-2 text-[13px] leading-[1.45] whitespace-pre-wrap break-words ${
                        isUser
                          ? 'bg-[#A6852F] text-white rounded-2xl rounded-br-sm'
                          : 'bg-white text-[#1C1917] rounded-2xl rounded-bl-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                      }`}>
                        {msg.text}
                      </div>
                    )}
                    <p className={`text-xs text-[#57534E]/40 mt-0.5 px-0.5 ${isUser ? 'text-right' : ''}`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {loading && (
            <div className="flex items-end gap-2 mt-0.5">
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                <img src={IMAGES.homerGqLifestyleStudio} alt="Homer" referrerPolicy="no-referrer" className="w-full h-full object-cover object-center" loading="lazy" />
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
        </div>

        {/* Footer - always visible at bottom */}
        <div className="shrink-0 bg-white border-t border-[#E8E5DF]/60 relative z-10">
          {messages.length <= 1 && (
            <div className="px-4 pt-3 pb-1">
              <div className="flex gap-2 overflow-x-auto">
                  <button onClick={() => sendSuggestion("I've been thinking about you...")} className="whitespace-nowrap px-3 py-2.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-xs hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  I've been thinking...
                </button>
                <button onClick={() => sendSuggestion("You looked incredible in that last post.")} className="whitespace-nowrap px-3 py-2.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-xs hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  You looked incredible
                </button>
                <button onClick={() => sendSuggestion("Tell me something personal about yourself.")} className="whitespace-nowrap px-3 py-2.5 bg-[#F3F1ED] text-[#57534E] rounded-full text-xs hover:bg-[#E8E5DF] transition-colors cursor-pointer">
                  Tell me something personal
                </button>
              </div>
            </div>
          )}

          {mediaPreview && (
            <div className="px-4 pt-2">
              <div className="relative inline-block">
                {mediaPreview.type === 'image' ? (
                  <img src={mediaPreview.url} alt="Preview" className="h-16 rounded-xl object-cover" loading="lazy" />
                ) : (
                  <div className="relative h-16 w-28 rounded-xl overflow-hidden bg-black/10">
                    <video src={mediaPreview.url} className="h-full w-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white/80" />
                    </div>
                  </div>
                )}
                <button onClick={removeMediaPreview} className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-full bg-[#1C1917] text-white flex items-center justify-center cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSend} className="px-4 pb-3 pt-1">
            {inputError && (
              <p className="text-[11px] text-[#DC2626] mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {inputError}
              </p>
            )}
            {input.length > MAX_MESSAGE_LENGTH * 0.9 && input.length <= MAX_MESSAGE_LENGTH && (
              <p className="text-[10px] text-[#F59E0B] mb-2">
                {MAX_MESSAGE_LENGTH - input.length} characters remaining
              </p>
            )}
            {input.length > MAX_MESSAGE_LENGTH && (
              <p className="text-[10px] text-[#DC2626] mb-2">
                {input.length - MAX_MESSAGE_LENGTH} characters over limit
              </p>
            )}
            <div className="flex items-end gap-2.5">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-11 h-11 rounded-full flex items-center justify-center text-[#57534E] hover:text-[#A6852F] hover:bg-[#F3F1ED] transition-colors cursor-pointer shrink-0 mb-0.5">
                <Image className="w-[18px] h-[18px]" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />

              <div className="flex-1 flex items-end bg-[#F3F1ED] rounded-[22px] px-4 py-2.5 min-h-[42px]">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  placeholder={rateLimited ? `Wait ${rateLimitCountdown}s...` : 'Type a message...'}
                  maxLength={MAX_MESSAGE_LENGTH + 100}
                  disabled={rateLimited}
                  className="flex-1 bg-transparent text-[14px] text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none min-w-0 leading-[1.4] disabled:opacity-50"
                />
                <button type="button" className="w-11 h-11 rounded-full flex items-center justify-center text-[#A8A29E] hover:text-[#57534E] transition-colors cursor-pointer shrink-0 ml-2 mb-px">
                  <Smile className="w-[18px] h-[18px]" />
                </button>
              </div>

              <button
                type="submit"
                disabled={(!input.trim() && !mediaPreview) || loading || rateLimited}
                className="w-11 h-11 rounded-full bg-[#A6852F] hover:bg-[#8B6F1F] disabled:bg-[#D4CFC7] text-white flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer mb-0.5 shadow-sm disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="w-[15px] h-[15px] animate-spin" />
                ) : (
                  <Send className="w-[15px] h-[15px] -translate-x-px" />
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

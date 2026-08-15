import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Search, Image as ImageIcon, X, Loader2, CheckCheck, Check, ArrowLeft, SmilePlus, Paperclip } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { FanConversation, FanMessage, MediaType } from '../../types/database';

function formatConvTime(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMsgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - msgDate.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function shouldShowDateSep(messages: FanMessage[], index: number): boolean {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].created_at);
  const curr = new Date(messages[index].created_at);
  return prev.toDateString() !== curr.toDateString();
}

export const DashboardChat: React.FC = () => {
  const { user, profile } = useAuth();
  const { logActivity } = useDashboard();
  const [conversations, setConversations] = useState<FanConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const CONV_PAGE_SIZE = 20;
  const MSG_PAGE_SIZE = 50;

  const loadConversations = useCallback(async (append = false) => {
    if (!user?.id) return;
    if (!append) setLoading(true);
    try {
      const offset = append ? conversations.length : 0;
      const { data } = await supabase
        .from('fan_conversations')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('last_message_at', { ascending: false, nullsFirst: false })
        .range(offset, offset + CONV_PAGE_SIZE - 1);
      const userConvs = (data || []) as FanConversation[];
      if (append) {
        setConversations((prev) => [...prev, ...userConvs]);
      } else {
        setConversations(userConvs);
      }
      setHasMore(userConvs.length === CONV_PAGE_SIZE);
    } catch { /* silent */ }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadMessages = useCallback(async (convId: string, append = false) => {
    try {
      const offset = append ? messages.length : 0;
      const { data } = await supabase
        .from('fan_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .range(offset, offset + MSG_PAGE_SIZE - 1);
      const msgs = (data || []) as FanMessage[];
      if (append) {
        setMessages((prev) => [...msgs, ...prev]);
      } else {
        setMessages(msgs);
      }
      setHasMoreMessages(msgs.length === MSG_PAGE_SIZE);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      supabase.from('fan_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', activeConvId)
        .eq('is_read', false)
        .neq('sender', 'member')
        .then(() => {
          supabase.from('fan_conversations').update({ unread_count: 0 }).eq('id', activeConvId);
          setConversations((prev) => prev.map((c) => c.id === activeConvId ? { ...c, unread_count: 0 } : c));
        });
    }
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activeConvId && !hasMoreMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }
  }, [activeConvId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConvId]);

  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('fan-chat-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'fan_messages' },
        (payload) => {
          const newMsg = payload.new as FanMessage;
          if (activeConvId && newMsg.conversation_id === activeConvId) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== newMsg.conversation_id) return c;
              return {
                ...c,
                last_message: newMsg.text || (newMsg.media_type ? `[${newMsg.media_type}]` : ''),
                last_message_at: newMsg.created_at,
                unread_count: newMsg.sender === 'admin' && c.id !== activeConvId
                  ? (c.unread_count || 0) + 1
                  : newMsg.sender === 'admin' && c.id === activeConvId
                    ? 0
                    : c.unread_count,
              };
            })
          );
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, activeConvId]);

  const filteredConversations = conversations.filter((c) => {
    return (
      c.participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.last_message || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from('chat-media').upload(path, file, { contentType: file.type });
    if (error) { console.error('Upload error:', error); return null; }
    const { data: urlData } = supabase.storage.from('chat-media').getPublicUrl(data.path);
    return urlData?.publicUrl || null;
  };

  const handleSend = async () => {
    if (!activeConvId || !user?.id) return;
    const hasText = newMessage.trim().length > 0;
    const hasFile = pendingFile !== null;
    if (!hasText && !hasFile) return;

    const msgText = newMessage.trim();
    setNewMessage('');
    setUploading(true);
    try {
      let mediaUrl: string | null = null;
      let mediaType: string | null = null;

      if (hasFile && pendingFile) {
        mediaUrl = await uploadFile(pendingFile);
        if (!mediaUrl) { setError('Failed to upload file.'); setUploading(false); return; }
        mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image';
      }

      const { error: sendError } = await supabase.from('fan_messages').insert({
        conversation_id: activeConvId,
        sender: 'member',
        text: msgText || '',
        media_type: mediaType || null,
        media_url: mediaUrl,
      });
      if (sendError) {
        setError(`Failed to send: ${sendError.message}`);
        setNewMessage(msgText);
        setUploading(false);
        return;
      }

      setPendingFile(null);
      setPreviewUrl(null);
      await loadMessages(activeConvId);
      await loadConversations();
    } catch { /* silent */ }
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Only images and videos are supported.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10MB.');
      return;
    }
    setError(null);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleStartChat = async () => {
    if (!user?.id || !profile) {
      setError('Profile not loaded. Please refresh the page.');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      const existingOpen = conversations.find((c) => c.status === 'open');
      if (existingOpen) {
        setActiveConvId(existingOpen.id);
        setCreating(false);
        return;
      }
      const { data: convData, error: convError } = await supabase
        .from('fan_conversations')
        .insert({
          participant: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          phone: profile.phone || null,
          membership_tier: null,
          status: 'open',
          method: 'website',
          user_id: user.id,
        })
        .select()
        .single();
      if (convError) throw convError;
      const conv = convData as FanConversation;
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
      logActivity('create', 'chat', 'New fan chat conversation started', {}).catch(() => {});
    } catch (e: any) {
      setError(e?.message || 'Failed to start conversation.');
    }
    setCreating(false);
  };

  const handleClose = async (convId: string) => {
    try {
      await supabase.from('fan_conversations').update({ status: 'closed' }).eq('id', convId);
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, status: 'closed' } : c));
    } catch { /* silent */ }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  // ── Conversation List View ──
  if (!activeConvId || !activeConv) {
    return (
      <div className="relative flex flex-col h-[calc(100dvh-12rem)] lg:h-[calc(100dvh-10rem)] bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8E5DF]/40 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-editorial text-[#1C1917] tracking-tight">Chat with Homer</h2>
            <p className="text-xs text-[#57534E] mt-0.5">Your conversations</p>
          </div>
        </div>

        {error && (
          <div className="mx-5 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Search */}
        {conversations.length > 0 && (
          <div className="px-5 py-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F3F1ED]/60 border border-transparent text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:border-[#A6852F]/30 focus:bg-white transition-all"
              />
            </div>
          </div>
        )}

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-[#A6852F] animate-spin" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-[#A6852F]/10 flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-[#A6852F]/40" />
              </div>
              <p className="text-sm font-medium text-[#1C1917] text-center">
                {searchQuery ? 'No matching conversations' : 'No conversations yet'}
              </p>
              <p className="text-xs text-[#57534E] mt-1 text-center max-w-[240px]">
                {searchQuery ? 'Try a different search term' : 'Tap the button below to start chatting with Homer'}
              </p>
            </div>
          ) : (
            <div>
              {filteredConversations.map((c) => {
                const isActive = c.id === activeConvId;
                const unread = c.unread_count || 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setActiveConvId(c.id); setError(null); }}
                    className={`w-full flex items-center gap-3.5 px-5 py-3.5 text-left transition-colors cursor-pointer border-b border-[#E8E5DF]/30 ${
                      isActive ? 'bg-[#A6852F]/8' : 'hover:bg-[#F3F1ED]/60'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm shadow-[#A6852F]/20">
                      HG
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm truncate ${unread > 0 ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#1C1917]'}`}>
                          Homer Gere
                        </span>
                        <span className={`text-[10px] shrink-0 ${unread > 0 ? 'text-[#A6852F] font-medium' : 'text-[#57534E]/60'}`}>
                          {formatConvTime(c.last_message_at || c.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <p className={`text-xs truncate ${unread > 0 ? 'text-[#1C1917] font-medium' : 'text-[#57534E]'}`}>
                          {c.last_message || 'Tap to start chatting'}
                        </p>
                        {unread > 0 && (
                          <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#A6852F] text-white text-[9px] font-bold flex items-center justify-center px-1">
                            {unread > 99 ? '99+' : unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {hasMore && filteredConversations.length > 0 && !searchQuery && (
                <button
                  onClick={() => loadConversations(true)}
                  disabled={loading}
                  className="w-full py-3.5 text-xs text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* FAB - WhatsApp style */}
        <button
          onClick={handleStartChat}
          disabled={creating}
          className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-[#A6852F] text-white flex items-center justify-center shadow-lg shadow-[#A6852F]/40 hover:bg-[#8B6F1F] hover:shadow-xl hover:shadow-[#A6852F]/50 transition-all cursor-pointer disabled:opacity-50 active:scale-95 z-10"
        >
          {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
        </button>
      </div>
    );
  }

  // ── Active Chat View ──
  return (
    <div className="flex flex-col h-[calc(100dvh-12rem)] lg:h-[calc(100dvh-10rem)] bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden shadow-sm">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b border-[#E8E5DF]/40 flex items-center gap-3 shrink-0 bg-white">
        <button
          onClick={() => { setActiveConvId(null); }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer lg:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => { setActiveConvId(null); }}
          className="hidden lg:flex w-9 h-9 rounded-full items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-sm font-semibold shadow-sm shadow-[#A6852F]/20">
          HG
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1C1917] truncate">Homer Gere</p>
          <p className="text-[11px] text-[#57534E] truncate">
            {activeConv.status === 'open' ? (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />
                Online
              </span>
            ) : (
              <span className="capitalize">{activeConv.status}</span>
            )}
          </p>
        </div>
        {activeConv.status === 'open' && (
          <button
            onClick={() => handleClose(activeConvId)}
            className="text-[11px] text-[#57534E] hover:text-[#DC2626] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-medium"
          >
            End Chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5"
        style={{ background: 'linear-gradient(180deg, #F3F1ED 0%, #FAF9F7 100%)' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full bg-[#A6852F]/10 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-[#A6852F]/30" />
            </div>
            <p className="text-xs text-[#57534E]/60">No messages yet. Say hello!</p>
          </div>
        ) : (
          <>
            {hasMoreMessages && (
              <div className="text-center py-2">
                <button
                  onClick={() => loadMessages(activeConvId, true)}
                  className="text-[11px] text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors cursor-pointer px-4 py-1.5 rounded-full bg-white/80 border border-[#E8E5DF]/60"
                >
                  Load older messages
                </button>
              </div>
            )}
            {messages.map((msg, i) => {
              const isMember = msg.sender === 'member';
              const showDate = shouldShowDateSep(messages, i);
              const prevMsg = i > 0 ? messages[i - 1] : null;
              const nextMsg = i < messages.length - 1 ? messages[i + 1] : null;
              const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender || shouldShowDateSep(messages, i);
              const isLastInGroup = !nextMsg || nextMsg.sender !== msg.sender || (nextMsg && shouldShowDateSep(messages, i + 1));

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <div className="flex items-center justify-center py-3">
                      <span className="text-[10px] text-[#57534E]/50 bg-[#E8E5DF]/60 px-3 py-1 rounded-full font-medium">
                        {formatDateSeparator(msg.created_at)}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${isMember ? 'justify-end' : 'justify-start'} ${isFirstInGroup ? 'mt-2' : 'mt-0.5'}`}>
                    <div className={`max-w-[75%] sm:max-w-[65%] ${
                      isMember
                        ? `bg-[#A6852F] text-white ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : isFirstInGroup ? 'rounded-2xl rounded-br-lg' : isLastInGroup ? 'rounded-2xl rounded-tr-lg' : 'rounded-2xl rounded-r-lg'}`
                        : `bg-white text-[#1C1917] border border-[#E8E5DF]/40 ${isFirstInGroup && isLastInGroup ? 'rounded-2xl' : isFirstInGroup ? 'rounded-2xl rounded-bl-lg' : isLastInGroup ? 'rounded-2xl rounded-tl-lg' : 'rounded-2xl rounded-l-lg'}`
                    } px-3.5 py-2 shadow-sm`}>
                      {isFirstInGroup && !isMember && (
                        <p className="text-[10px] font-semibold text-[#A6852F] mb-0.5">Homer</p>
                      )}
                      {msg.media_url && msg.media_type === 'image' && (
                        <img
                          src={msg.media_url}
                          alt="Shared image"
                          className="rounded-xl mb-1.5 max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(msg.media_url!, '_blank')}
                        />
                      )}
                      {msg.media_url && msg.media_type === 'video' && (
                        <video src={msg.media_url} controls className="rounded-xl mb-1.5 max-w-full max-h-60" />
                      )}
                      {msg.text && (
                        <p className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${isMember ? 'text-white' : 'text-[#1C1917]'}`}>
                          {msg.text}
                        </p>
                      )}
                      <div className={`flex items-center gap-1 mt-0.5 ${isMember ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[9px] ${isMember ? 'text-white/60' : 'text-[#57534E]/40'}`}>
                          {formatMsgTime(msg.created_at)}
                        </span>
                        {isMember && (
                          <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-white/80' : 'text-white/40'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {activeConv.status === 'open' ? (
        <div className="border-t border-[#E8E5DF]/40 bg-white shrink-0">
          {/* File Preview */}
          <AnimatePresence>
            {previewUrl && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pt-3 overflow-hidden"
              >
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="h-20 rounded-xl border border-[#E8E5DF] object-cover" />
                  <button
                    onClick={() => { setPreviewUrl(null); setPendingFile(null); }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer hover:bg-[#B91C1C] transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="px-4 pt-2">
              <p className="text-[11px] text-[#DC2626]">{error}</p>
            </div>
          )}

          <div className="flex items-end gap-2 p-3">
            <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !uploading) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Type a message..."
                disabled={uploading}
                className="w-full px-4 py-2.5 rounded-full bg-[#F3F1ED]/60 border border-[#E8E5DF]/40 text-sm text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:border-[#A6852F]/40 focus:bg-white transition-all disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={uploading || (!newMessage.trim() && !pendingFile)}
              className="w-10 h-10 rounded-full bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-sm shadow-[#A6852F]/30 active:scale-95"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[#E8E5DF]/40 bg-[#F3F1ED]/40 px-4 py-4 text-center shrink-0">
          <p className="text-xs text-[#57534E]">This conversation has been closed.</p>
        </div>
      )}
    </div>
  );
};

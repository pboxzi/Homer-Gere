import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Search, X, Loader2, CheckCheck, ArrowLeft, Paperclip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { FanConversation, FanMessage } from '../../types/database';

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function msgTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function dateSep(msgs: FanMessage[], i: number): boolean {
  if (i === 0) return true;
  return new Date(msgs[i - 1].created_at).toDateString() !== new Date(msgs[i].created_at).toDateString();
}

function formatDateSep(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = Math.floor((today.getTime() - msgDate.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export const DashboardChat: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<FanConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations
  const loadConvs = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const { data } = await supabase
      .from('fan_conversations')
      .select('*')
      .eq('user_id', user.id)
      .order('last_message_at', { ascending: false, nullsFirst: false });
    setConversations((data || []) as FanConversation[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadConvs(); }, [loadConvs]);

  // Load messages for active conversation
  const loadMsgs = useCallback(async (convId: string) => {
    const { data } = await supabase
      .from('fan_messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    setMessages((data || []) as FanMessage[]);
  }, []);

  useEffect(() => {
    if (activeId) {
      loadMsgs(activeId);
      // Mark admin messages as read
      supabase.from('fan_messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('conversation_id', activeId)
        .eq('is_read', false)
        .neq('sender', 'member')
        .then(() => {
          supabase.from('fan_conversations').update({ unread_count: 0 }).eq('id', activeId);
          setConversations(prev => prev.map(c => c.id === activeId ? { ...c, unread_count: 0 } : c));
        });
    }
  }, [activeId, loadMsgs]);

  // Auto-scroll
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { inputRef.current?.focus(); }, [activeId]);
  useEffect(() => { return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }; }, [previewUrl]);

  // Real-time messages
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel('dash-fan-chat')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fan_messages' }, (payload) => {
        const m = payload.new as FanMessage;
        if (activeId && m.conversation_id === activeId) {
          setMessages(prev => prev.some(x => x.id === m.id) ? prev : [...prev, m]);
        }
        setConversations(prev => prev.map(c => {
          if (c.id !== m.conversation_id) return c;
          return {
            ...c,
            last_message: m.text || (m.media_type ? `[${m.media_type}]` : ''),
            last_message_at: m.created_at,
            unread_count: m.sender === 'admin' && c.id !== activeId ? (c.unread_count || 0) + 1 : c.unread_count,
          };
        }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id, activeId]);

  // Filter
  const filtered = conversations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.participant.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.last_message || '').toLowerCase().includes(q);
  });

  const activeConv = conversations.find(c => c.id === activeId);

  // Upload
  const upload = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;
    const ext = file.name.split('.').pop() || 'jpg';
    const { data, error } = await supabase.storage.from('chat-media').upload(`${user.id}/${Date.now()}.${ext}`, file, { contentType: file.type });
    if (error) return null;
    const { data: url } = supabase.storage.from('chat-media').getPublicUrl(data.path);
    return url?.publicUrl || null;
  };

  // Send
  const handleSend = async () => {
    if (!activeId || !user?.id) return;
    const hasText = input.trim().length > 0;
    const hasFile = pendingFile !== null;
    if (!hasText && !hasFile) return;

    const text = input.trim();
    setInput('');
    setSending(true);
    setError(null);

    let mediaUrl: string | null = null;
    let mediaType: string | null = null;

    if (hasFile && pendingFile) {
      mediaUrl = await upload(pendingFile);
      if (!mediaUrl) { setError('Upload failed.'); setSending(false); return; }
      mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image';
    }

    const { error: sendErr } = await supabase.from('fan_messages').insert({
      conversation_id: activeId,
      sender: 'member',
      text: text || '',
      media_type: mediaType,
      media_url: mediaUrl,
    });

    if (sendErr) {
      setError(`Send failed: ${sendErr.message}`);
      setInput(text);
    }

    setPendingFile(null);
    setPreviewUrl(null);
    setSending(false);
    await loadMsgs(activeId);
    await loadConvs();
  };

  // Start new conversation
  const handleNew = async () => {
    if (!user?.id) return;
    const existing = conversations.find(c => c.status === 'open');
    if (existing) { setActiveId(existing.id); return; }

    const { data, error } = await supabase.from('fan_conversations').insert({
      user_id: user.id,
      participant: 'Member',
      email: user.email || '',
      status: 'open',
    }).select().single();

    if (!error && data) {
      setConversations(prev => [data as FanConversation, ...prev]);
      setActiveId(data.id);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) { setError('Only images/videos supported.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Max 10MB.'); return; }
    setError(null);
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Conversation List ──
  if (!activeId || !activeConv) {
    return (
      <div className="relative flex flex-col h-[calc(100dvh-12rem)] lg:h-[calc(100dvh-10rem)] bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-[#E8E5DF]/40 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-editorial text-[#1C1917] tracking-tight">Chat with Homer</h2>
            <p className="text-xs text-[#57534E] mt-0.5">Your conversations</p>
          </div>
        </div>

        {error && <div className="mx-5 mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5"><p className="text-xs text-red-600">{error}</p></div>}

        {conversations.length > 0 && (
          <div className="px-5 py-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/40" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F3F1ED]/60 border border-transparent text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:border-[#A6852F]/30 focus:bg-white transition-all" />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-5 h-5 text-[#A6852F] animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className="w-16 h-16 rounded-full bg-[#A6852F]/10 flex items-center justify-center mb-4"><MessageSquare className="w-7 h-7 text-[#A6852F]/40" /></div>
              <p className="text-sm font-medium text-[#1C1917] text-center">{search ? 'No matching conversations' : 'No conversations yet'}</p>
              <p className="text-xs text-[#57534E] mt-1 text-center max-w-[240px]">{search ? 'Try a different search' : 'Tap below to start chatting with Homer'}</p>
            </div>
          ) : (
            filtered.map(c => {
              const unread = c.unread_count || 0;
              return (
                <button key={c.id} onClick={() => { setActiveId(c.id); setError(null); }}
                  className="w-full flex items-center gap-3.5 px-5 py-3.5 text-left hover:bg-[#F3F1ED]/60 transition-colors cursor-pointer border-b border-[#E8E5DF]/30">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm shadow-[#A6852F]/20">HG</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${unread ? 'font-semibold text-[#1C1917]' : 'font-medium text-[#1C1917]'}`}>Homer Gere</span>
                      <span className={`text-[10px] shrink-0 ${unread ? 'text-[#A6852F] font-medium' : 'text-[#57534E]/60'}`}>{timeAgo(c.last_message_at || c.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <p className={`text-xs truncate ${unread ? 'text-[#1C1917] font-medium' : 'text-[#57534E]'}`}>{c.last_message || 'Tap to start chatting'}</p>
                      {unread > 0 && <span className="shrink-0 min-w-[18px] h-[18px] rounded-full bg-[#A6852F] text-white text-[9px] font-bold flex items-center justify-center px-1">{unread > 99 ? '99+' : unread}</span>}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <button onClick={handleNew}
          className="absolute bottom-5 right-5 w-14 h-14 rounded-full bg-[#A6852F] text-white flex items-center justify-center shadow-lg shadow-[#A6852F]/40 hover:bg-[#8B6F1F] transition-all cursor-pointer active:scale-95 z-10">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    );
  }

  // ── Active Chat ──
  return (
    <div className="flex flex-col h-[calc(100dvh-12rem)] lg:h-[calc(100dvh-10rem)] bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E8E5DF]/40 flex items-center gap-3 shrink-0 bg-white">
        <button onClick={() => setActiveId(null)} className="w-9 h-9 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A6852F] to-[#8B6F1F] flex items-center justify-center text-white text-sm font-semibold shadow-sm">HG</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1C1917] truncate">Homer Gere</p>
          <p className="text-[11px] text-[#57534E]">
            {activeConv.status === 'open' ? <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] inline-block" />Online</span> : <span className="capitalize">{activeConv.status}</span>}
          </p>
        </div>
        {activeConv.status === 'open' && (
          <button onClick={async () => { await supabase.from('fan_conversations').update({ status: 'closed' }).eq('id', activeId); setConversations(prev => prev.map(c => c.id === activeId ? { ...c, status: 'closed' } : c)); }}
            className="text-[11px] text-[#57534E] hover:text-[#DC2626] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer font-medium">End Chat</button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5" style={{ background: 'linear-gradient(180deg, #F3F1ED 0%, #FAF9F7 100%)' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-14 h-14 rounded-full bg-[#A6852F]/10 flex items-center justify-center mb-3"><MessageSquare className="w-6 h-6 text-[#A6852F]/30" /></div>
            <p className="text-xs text-[#57534E]/60">No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender === 'member';
            const showDate = dateSep(messages, i);
            const prev = i > 0 ? messages[i - 1] : null;
            const next = i < messages.length - 1 ? messages[i + 1] : null;
            const first = !prev || prev.sender !== msg.sender || showDate;
            const last = !next || next.sender !== msg.sender || dateSep(messages, i + 1);

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <div className="flex items-center justify-center py-3">
                    <span className="text-[10px] text-[#57534E]/50 bg-[#E8E5DF]/60 px-3 py-1 rounded-full font-medium">{formatDateSep(msg.created_at)}</span>
                  </div>
                )}
                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${first ? 'mt-2' : 'mt-0.5'}`}>
                  <div className={`max-w-[75%] sm:max-w-[65%] ${
                    isMe
                      ? `bg-[#A6852F] text-white ${first && last ? 'rounded-2xl' : first ? 'rounded-2xl rounded-br-lg' : last ? 'rounded-2xl rounded-tr-lg' : 'rounded-2xl rounded-r-lg'}`
                      : `bg-white text-[#1C1917] border border-[#E8E5DF]/40 ${first && last ? 'rounded-2xl' : first ? 'rounded-2xl rounded-bl-lg' : last ? 'rounded-2xl rounded-tl-lg' : 'rounded-2xl rounded-l-lg'}`
                  } px-3.5 py-2 shadow-sm`}>
                    {first && !isMe && <p className="text-[10px] font-semibold text-[#A6852F] mb-0.5">Homer</p>}
                    {msg.media_url && msg.media_type === 'image' && <img src={msg.media_url} alt="Shared" className="rounded-xl mb-1.5 max-w-full max-h-60 object-cover cursor-pointer hover:opacity-90" onClick={() => window.open(msg.media_url!, '_blank')} />}
                    {msg.media_url && msg.media_type === 'video' && <video src={msg.media_url} controls className="rounded-xl mb-1.5 max-w-full max-h-60" />}
                    {msg.text && <p className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${isMe ? 'text-white' : 'text-[#1C1917]'}`}>{msg.text}</p>}
                    <div className={`flex items-center gap-1 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className={`text-[9px] ${isMe ? 'text-white/60' : 'text-[#57534E]/40'}`}>{msgTime(msg.created_at)}</span>
                      {isMe && <CheckCheck className={`w-3.5 h-3.5 ${msg.is_read ? 'text-white/80' : 'text-white/40'}`} />}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {activeConv.status === 'open' ? (
        <div className="border-t border-[#E8E5DF]/40 bg-white shrink-0">
          <AnimatePresence>
            {previewUrl && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pt-3 overflow-hidden">
                <div className="relative inline-block">
                  <img src={previewUrl} alt="Preview" className="h-20 rounded-xl border border-[#E8E5DF] object-cover" />
                  <button onClick={() => { setPreviewUrl(null); setPendingFile(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer"><X className="w-3 h-3" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {error && <div className="px-4 pt-2"><p className="text-[11px] text-[#DC2626]">{error}</p></div>}
          <div className="flex items-end gap-2 p-3">
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={sending} className="w-10 h-10 rounded-full flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] transition-colors cursor-pointer disabled:opacity-50 shrink-0"><Paperclip className="w-5 h-5" /></button>
            <div className="flex-1">
              <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !sending) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..." disabled={sending}
                className="w-full px-4 py-2.5 rounded-full bg-[#F3F1ED]/60 border border-[#E8E5DF]/40 text-sm text-[#1C1917] placeholder:text-[#57534E]/40 focus:outline-none focus:border-[#A6852F]/40 focus:bg-white transition-all disabled:opacity-50" />
            </div>
            <button onClick={handleSend} disabled={sending || (!input.trim() && !pendingFile)}
              className="w-10 h-10 rounded-full bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-sm active:scale-95">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[#E8E5DF]/40 bg-[#F3F1ED]/40 px-4 py-4 text-center shrink-0"><p className="text-xs text-[#57534E]">This conversation has been closed.</p></div>
      )}
    </div>
  );
};

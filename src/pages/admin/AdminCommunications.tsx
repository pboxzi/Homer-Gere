import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Building2, Search, Eye, Trash2, Archive, ArrowLeft, Send, Plus, X, RotateCcw, Paperclip, Bell, CheckCheck, Check, MailOpen, MailCheck } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { getSupabaseClient } from '../../lib/repositories';
import { supabase } from '../../lib/supabase';
import { notifyService } from '../../lib/notifications';
import { formatDate } from '../../utils/formatDate';
import type { AdminSection, AdminConversation, AdminNotification } from '../../data/adminData';

interface Props { activeSection: AdminSection; }

const inputCls = 'px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 transition-colors w-full';
const badgeCls = 'text-[10px] px-2 py-0.5 rounded-full font-medium';
const STATUS_COLORS: Record<string, string> = { open: 'bg-[#16A34A]/10 text-[#16A34A]', in_progress: 'bg-[#F59E0B]/10 text-[#F59E0B]', closed: 'bg-[#57534E]/10 text-[#57534E]' };
const STATUS_LABELS: Record<string, string> = { open: 'Open', in_progress: 'In Progress', closed: 'Closed' };

function initials(name: string) { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
function hashColor(s: string) { const c = ['#A6852F', '#8B5CF6', '#3B82F6', '#16A34A', '#DC2626', '#F59E0B', '#EC4899', '#6366F1']; let h = 0; for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h); return c[Math.abs(h) % c.length]; }
function fmtTime(d: string) { try { return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }); } catch { return d; } }

export const AdminCommunications: React.FC<Props> = ({ activeSection }) => {
  const { conversations, businessEnquiries, notifications, members, updateConversation, deleteConversation, sendConversationMessage, initiateConversationForMember, updateNotification, deleteNotification, addNotification } = useAdmin();

  switch (activeSection) {
    case 'fan-chat': return <FanChat conversations={conversations} members={members} updateConversation={updateConversation} deleteConversation={deleteConversation} sendConversationMessage={sendConversationMessage} initiateConversationForMember={initiateConversationForMember} />;
    case 'business-chat': return <BizChat enquiries={businessEnquiries} updateConversation={updateConversation} deleteConversation={deleteConversation} sendConversationMessage={sendConversationMessage} />;
    case 'admin-notifications': return <Notifs notifications={notifications} updateNotification={updateNotification} deleteNotification={deleteNotification} addNotification={addNotification} />;
    default: return null;
  }
};

// ═══════════════════════════════════════════
// Fan Chat
// ═══════════════════════════════════════════
const FanChat: React.FC<{
  conversations: AdminConversation[]; members: any[];
  updateConversation: (id: string, u: Partial<AdminConversation>) => void;
  deleteConversation: (id: string) => void;
  sendConversationMessage: (id: string, sender: string, text: string, type?: 'fan' | 'business', mediaUrl?: string | null, mediaType?: string | null) => void;
  initiateConversationForMember: (userId: string, participant: string, email: string, tier: string | null, msg: string, sender: 'member' | 'admin') => Promise<void>;
}> = ({ conversations, members, updateConversation, deleteConversation, sendConversationMessage, initiateConversationForMember }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [newMsg, setNewMsg] = useState('');
  const [initiating, setInitiating] = useState(false);
  const [msgs, setMsgs] = useState<Record<string, any[]>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMsgs = useCallback(async (id: string) => {
    const { data } = await supabase.from('fan_messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true });
    setMsgs(prev => ({ ...prev, [id]: data || [] }));
  }, []);

  const upload = async (file: File): Promise<string | null> => {
    const path = `admin/${Date.now()}_${file.name}`;
    const { data, error } = await getSupabaseClient().storage.from('chat-media').upload(path, file, { contentType: file.type });
    if (error) return null;
    const { data: url } = getSupabaseClient().storage.from('chat-media').getPublicUrl(data.path);
    return url?.publicUrl || null;
  };

  const fanConvs = useMemo(() => conversations.filter(c => {
    if (c.type !== 'fan') return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) { const q = search.toLowerCase(); return c.participant.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q); }
    return true;
  }), [conversations, search, statusFilter]);

  const selected = conversations.find(c => c.id === selectedId);
  const selectedMsgs = selectedId ? (msgs[selectedId] || []) : [];

  useEffect(() => { if (selectedId) loadMsgs(selectedId); }, [selectedId, loadMsgs]);

  // Real-time for selected conversation
  useEffect(() => {
    if (!selectedId) return;
    const ch = supabase.channel(`admin-fan-${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'fan_messages', filter: `conversation_id=eq.${selectedId}` }, payload => {
        const m = payload.new as any;
        setMsgs(prev => { const existing = prev[selectedId] || []; return existing.some((x: any) => x.id === m.id) ? prev : { ...prev, [selectedId]: [...existing, m] }; });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedId]);

  const handleSendReply = async () => {
    if ((!replyText.trim() && !pendingFile) || !selectedId) return;
    setUploading(true);
    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    if (pendingFile) { mediaUrl = await upload(pendingFile); if (!mediaUrl) { setUploading(false); return; } mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image'; }
    await sendConversationMessage(selectedId, 'admin', replyText.trim(), 'fan', mediaUrl, mediaType);
    setReplyText(''); setPendingFile(null); setPreviewUrl(null);
    await loadMsgs(selectedId);
    setUploading(false);
  };

  const handleInitiate = async () => {
    if (!memberId || !newMsg.trim()) return;
    const m = members.find(x => x.id === memberId);
    if (!m) return;
    setInitiating(true);
    await initiateConversationForMember(m.id, m.name, m.email, m.membership !== 'None' ? m.membership : null, newMsg.trim(), 'admin');
    setShowNew(false); setMemberId(''); setNewMsg(''); setInitiating(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) return;
    if (f.size > 10 * 1024 * 1024) return;
    setPendingFile(f); setPreviewUrl(URL.createObjectURL(f));
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Chat View ──
  if (selected) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer"><ArrowLeft className="w-4 h-4" />Back to Fan Chat</button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Fan Chat</h1>
          <p className="text-sm text-[#57534E] mt-1">Conversation with {selected.participant}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E8E5DF]/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium" style={{ backgroundColor: hashColor(selected.participant) }}>{initials(selected.participant)}</div>
            <div className="flex-1"><p className="text-sm font-medium text-[#1C1917]">{selected.participant}</p><p className="text-[10px] text-[#57534E]">{selected.email}</p></div>
            <select value={selected.status} onChange={e => { const s = e.target.value as any; updateConversation(selected.id, { status: s }); supabase.from('fan_conversations').update({ status: s }).eq('id', selected.id); }}
              className={`${inputCls} w-auto text-[10px] px-2 py-1 rounded-lg cursor-pointer`}>
              <option value="open">Open</option><option value="in_progress">In Progress</option><option value="closed">Closed</option>
            </select>
            {selected.status === 'closed' && <button onClick={() => { updateConversation(selected.id, { status: 'open' }); supabase.from('fan_conversations').update({ status: 'open' }).eq('id', selected.id); }} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20 cursor-pointer"><RotateCcw className="w-3 h-3" />Reopen</button>}
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {selectedMsgs.length === 0 ? <p className="text-sm text-[#57534E] text-center py-8">No messages yet.</p> : selectedMsgs.map((m: any) => (
              <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${m.sender === 'admin' ? 'bg-[#A6852F]/10 text-[#1C1917]' : 'bg-[#F3F1ED] text-[#1C1917]'}`}>
                  <p className="text-[10px] font-medium text-[#A6852F] mb-1">{m.sender === 'admin' ? 'Admin' : 'Member'}</p>
                  {m.media_url && m.media_type === 'image' && <img src={m.media_url} alt="Shared" className="rounded-xl mb-2 max-w-full max-h-60 object-cover cursor-pointer" onClick={() => window.open(m.media_url!, '_blank')} />}
                  {m.media_url && m.media_type === 'video' && <video src={m.media_url} controls className="rounded-xl mb-2 max-w-full max-h-60" />}
                  {m.text && <p className="text-sm">{m.text}</p>}
                  <p className="text-[10px] text-[#57534E] mt-1">{fmtTime(m.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#E8E5DF]/40">
            {previewUrl && <div className="relative inline-block mb-2"><img src={previewUrl} alt="Preview" className="h-20 rounded-xl border border-[#E8E5DF] object-cover" /><button onClick={() => { setPreviewUrl(null); setPendingFile(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer"><X className="w-3 h-3" /></button></div>}
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-9 h-9 rounded-xl border border-[#E8E5DF]/60 flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] cursor-pointer disabled:opacity-50 shrink-0"><Paperclip className="w-4 h-4" /></button>
              <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendReply()} placeholder="Type a reply..." className={inputCls} />
              <button onClick={handleSendReply} disabled={uploading || (!replyText.trim() && !pendingFile)} className="w-9 h-9 rounded-xl bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] cursor-pointer shrink-0 disabled:opacity-50">
                {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Fan Chat</h1><p className="text-sm text-[#57534E] mt-1">Manage conversations with fans.</p></div>
          <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer"><Plus className="w-3.5 h-3.5" />New Conversation</button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/60" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inputCls} w-auto sm:w-40 cursor-pointer`}>
            <option value="all">All Status</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="closed">Closed</option>
          </select>
        </div>
        <div className="space-y-2">
          {fanConvs.length === 0 ? <p className="text-sm text-[#57534E] text-center py-8">No conversations found.</p> : fanConvs.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all shadow-sm hover:shadow-lg">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0" style={{ backgroundColor: hashColor(c.participant) }}>{initials(c.participant)}</div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-[#1C1917]">{c.participant}</p><p className="text-xs text-[#57534E] truncate">{c.lastMessage || 'No messages yet'}</p></div>
              <span className={`${badgeCls} ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
              <span className="text-[10px] text-[#57534E] shrink-0 hidden sm:block">{formatDate(c.date)}</span>
              <div className="flex items-center gap-1 shrink-0">
                {c.status === 'closed' && <button onClick={() => { updateConversation(c.id, { status: 'open' }); supabase.from('fan_conversations').update({ status: 'open' }).eq('id', c.id); }} title="Reopen" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>}
                <button onClick={() => setSelectedId(c.id)} title="View" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => { updateConversation(c.id, { status: 'closed' }); supabase.from('fan_conversations').update({ status: 'closed' }).eq('id', c.id); }} title="Archive" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><Archive className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteConversation(c.id)} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {showNew && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-[#1C1917]">Start New Conversation</h3><button onClick={() => setShowNew(false)} className="text-[#57534E] hover:text-[#1C1917] cursor-pointer"><X className="w-5 h-5" /></button></div>
            <div>
              <label className="text-xs font-medium text-[#57534E] mb-1 block">Select Member</label>
              {memberId ? (
                <div className="flex items-center gap-2 p-2 rounded-xl border border-[#E8E5DF] bg-[#F3F1ED]/50">
                  <div className="w-8 h-8 rounded-full bg-[#A6852F] flex items-center justify-center text-white text-xs font-medium">{initials(members.find(m => m.id === memberId)?.name || '')}</div>
                  <div className="flex-1"><p className="text-sm font-medium text-[#1C1917]">{members.find(m => m.id === memberId)?.name}</p><p className="text-[10px] text-[#57534E]">{members.find(m => m.id === memberId)?.email}</p></div>
                  <button onClick={() => setMemberId('')} className="text-[#57534E] hover:text-[#DC2626] cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className={inputCls} />
                  {search && members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())).slice(0, 10).map(m => (
                    <button key={m.id} onClick={() => { setMemberId(m.id); setSearch(''); }} className="w-full flex items-center gap-3 p-3 hover:bg-[#F3F1ED] text-left cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-[#A6852F] flex items-center justify-center text-white text-xs font-medium">{initials(m.name)}</div>
                      <div><p className="text-sm font-medium text-[#1C1917]">{m.name}</p><p className="text-[10px] text-[#57534E]">{m.email}</p></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div><label className="text-xs font-medium text-[#57534E] mb-1 block">First Message</label><textarea value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type your message..." rows={3} className={`${inputCls} resize-none`} /></div>
            <div className="flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 py-2 rounded-xl border border-[#E8E5DF] text-sm text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              <button onClick={handleInitiate} disabled={!memberId || !newMsg.trim() || initiating} className="flex-1 py-2 rounded-xl bg-[#A6852F] text-white text-sm font-medium hover:bg-[#8B6F1F] cursor-pointer disabled:opacity-50">{initiating ? 'Sending...' : 'Start Conversation'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════
// Business Chat
// ═══════════════════════════════════════════
const BizChat: React.FC<{
  enquiries: AdminConversation[];
  updateConversation: (id: string, u: Partial<AdminConversation>) => void;
  deleteConversation: (id: string, type?: 'fan' | 'business') => void;
  sendConversationMessage: (id: string, sender: string, text: string, type?: 'fan' | 'business', mediaUrl?: string | null, mediaType?: string | null) => void;
}> = ({ enquiries, updateConversation, deleteConversation, sendConversationMessage }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loadedMsgs, setLoadedMsgs] = useState<Record<string, any[]>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMsgs = useCallback(async (id: string) => {
    const { data } = await supabase.from('business_messages').select('*').eq('enquiry_id', id).order('created_at', { ascending: true });
    setLoadedMsgs(prev => ({ ...prev, [id]: data || [] }));
  }, []);

  const upload = async (file: File): Promise<string | null> => {
    const path = `admin/${Date.now()}_${file.name}`;
    const { data, error } = await getSupabaseClient().storage.from('chat-media').upload(path, file, { contentType: file.type });
    if (error) return null;
    const { data: url } = getSupabaseClient().storage.from('chat-media').getPublicUrl(data.path);
    return url?.publicUrl || null;
  };

  const filtered = useMemo(() => enquiries.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search) { const q = search.toLowerCase(); return c.participant.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q) || (c.company && c.company.toLowerCase().includes(q)); }
    return true;
  }), [enquiries, search, statusFilter]);

  const selected = enquiries.find(c => c.id === selectedId);
  const selectedMsgs = selectedId ? (loadedMsgs[selectedId] || []) : [];

  useEffect(() => { if (selectedId) loadMsgs(selectedId); }, [selectedId, loadMsgs]);

  useEffect(() => {
    if (!selectedId) return;
    const ch = supabase.channel(`admin-biz-${selectedId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'business_messages', filter: `enquiry_id=eq.${selectedId}` }, payload => {
        const m = payload.new as any;
        setLoadedMsgs(prev => { const existing = prev[selectedId] || []; return existing.some((x: any) => x.id === m.id) ? prev : { ...prev, [selectedId]: [...existing, m] }; });
      }).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [selectedId]);

  const handleSendReply = async () => {
    if ((!replyText.trim() && !pendingFile) || !selectedId) return;
    setUploading(true);
    let mediaUrl: string | null = null;
    let mediaType: string | null = null;
    if (pendingFile) { mediaUrl = await upload(pendingFile); if (!mediaUrl) { setUploading(false); return; } mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image'; }
    await sendConversationMessage(selectedId, 'admin', replyText.trim(), 'business', mediaUrl, mediaType);
    setReplyText(''); setPendingFile(null); setPreviewUrl(null);
    await loadMsgs(selectedId);
    setUploading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!f.type.startsWith('image/') && !f.type.startsWith('video/')) return;
    if (f.size > 10 * 1024 * 1024) return;
    setPendingFile(f); setPreviewUrl(URL.createObjectURL(f));
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Chat View ──
  if (selected) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer"><ArrowLeft className="w-4 h-4" />Back to Business Chat</button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Business Chat</h1>
          <p className="text-sm text-[#57534E] mt-1">{selected.company ? `${selected.participant} — ${selected.company}` : selected.participant}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E8E5DF]/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]"><Building2 className="w-4 h-4" /></div>
            <div className="flex-1"><p className="text-sm font-medium text-[#1C1917]">{selected.participant}</p><p className="text-[10px] text-[#57534E]">{selected.company} — {selected.email}</p></div>
            <select value={selected.status} onChange={e => { const s = e.target.value as any; updateConversation(selected.id, { status: s }); supabase.from('business_enquiries').update({ status: s }).eq('id', selected.id); }}
              className={`${inputCls} w-auto text-[10px] px-2 py-1 rounded-lg cursor-pointer`}>
              <option value="open">Open</option><option value="in_progress">In Progress</option><option value="closed">Closed</option>
            </select>
            {selected.status === 'closed' && <button onClick={() => { updateConversation(selected.id, { status: 'open' }); supabase.from('business_enquiries').update({ status: 'open' }).eq('id', selected.id); }} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20 cursor-pointer"><RotateCcw className="w-3 h-3" />Reopen</button>}
          </div>

          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {selectedMsgs.length === 0 ? <p className="text-sm text-[#57534E] text-center py-8">No messages yet.</p> : selectedMsgs.map((m: any) => (
              <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${m.sender === 'admin' ? 'bg-[#A6852F]/10 text-[#1C1917]' : 'bg-[#F3F1ED] text-[#1C1917]'}`}>
                  <p className="text-[10px] font-medium text-[#A6852F] mb-1">{m.sender === 'admin' ? 'Admin' : 'Member'}</p>
                  {m.media_url && m.media_type === 'image' && <img src={m.media_url} alt="Shared" className="rounded-xl mb-2 max-w-full max-h-60 object-cover cursor-pointer" onClick={() => window.open(m.media_url!, '_blank')} />}
                  {m.media_url && m.media_type === 'video' && <video src={m.media_url} controls className="rounded-xl mb-2 max-w-full max-h-60" />}
                  {m.text && <p className="text-sm">{m.text}</p>}
                  <p className="text-[10px] text-[#57534E] mt-1">{fmtTime(m.created_at)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#E8E5DF]/40">
            {previewUrl && <div className="relative inline-block mb-2"><img src={previewUrl} alt="Preview" className="h-20 rounded-xl border" /><button onClick={() => { setPreviewUrl(null); setPendingFile(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer"><X className="w-3 h-3" /></button></div>}
            <div className="flex items-center gap-3">
              <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="hidden" />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="w-9 h-9 rounded-xl border border-[#E8E5DF]/60 flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] cursor-pointer disabled:opacity-50 shrink-0"><Paperclip className="w-4 h-4" /></button>
              <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendReply()} placeholder="Type a reply..." className={inputCls} />
              <button onClick={handleSendReply} disabled={uploading || (!replyText.trim() && !pendingFile)} className="w-9 h-9 rounded-xl bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] cursor-pointer shrink-0 disabled:opacity-50">
                {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Business Chat</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage business enquiries.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/60" /><input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className={`${inputCls} pl-9`} /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`${inputCls} w-auto sm:w-40 cursor-pointer`}>
            <option value="all">All</option><option value="open">Open</option><option value="in_progress">In Progress</option><option value="closed">Closed</option>
          </select>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 ? <p className="text-sm text-[#57534E] text-center py-8">No enquiries found.</p> : filtered.map(c => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all shadow-sm hover:shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shrink-0"><Building2 className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-sm font-medium text-[#1C1917]">{c.participant}</p>{c.company && <span className="text-[10px] text-[#57534E]">({c.company})</span>}</div><p className="text-xs text-[#57534E] truncate">{c.lastMessage || 'No messages'}</p></div>
              <span className={`${badgeCls} ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
              <span className="text-[10px] text-[#57534E] shrink-0 hidden sm:block">{formatDate(c.date)}</span>
              <div className="flex items-center gap-1 shrink-0">
                {c.status === 'closed' && <button onClick={() => { updateConversation(c.id, { status: 'open' }); supabase.from('business_enquiries').update({ status: 'open' }).eq('id', c.id); }} title="Reopen" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 cursor-pointer"><RotateCcw className="w-3.5 h-3.5" /></button>}
                <button onClick={() => setSelectedId(c.id)} title="View" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button onClick={() => { updateConversation(c.id, { status: 'closed' }); supabase.from('business_enquiries').update({ status: 'closed' }).eq('id', c.id); }} title="Archive" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><Archive className="w-3.5 h-3.5" /></button>
                <button onClick={() => deleteConversation(c.id, 'business')} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════
// Notifications
// ═══════════════════════════════════════════
const Notifs: React.FC<{
  notifications: AdminNotification[];
  updateNotification: (id: string, u: Partial<AdminNotification>) => void;
  deleteNotification: (id: string) => void;
  addNotification: (n: Omit<AdminNotification, 'id'>) => void;
}> = ({ notifications, updateNotification, deleteNotification, addNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'unread' | 'read'>('all');

  const unread = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' || (tab === 'unread' && !n.read) || (tab === 'read' && n.read);
    return matchSearch && matchTab;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Notifications</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage system notifications.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer"><Plus className="w-3.5 h-3.5" />Create</button>
            {unread > 0 && <button onClick={() => notifications.forEach(n => { if (!n.read) updateNotification(n.id, { read: true }); })} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><CheckCheck className="w-3.5 h-3.5" />Mark All Read</button>}
          </div>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-3 pr-3 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 w-48" />
        </div>
        <div className="flex items-center gap-1 mb-4 border-b border-[#E8E5DF]/40">
          {(['all', 'unread', 'read'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-[10px] font-medium uppercase tracking-[0.05em] cursor-pointer ${tab === t ? 'text-[#A6852F] border-b-2 border-[#A6852F]' : 'text-[#57534E] hover:text-[#1C1917]'}`}>{t} ({t === 'all' ? notifications.length : t === 'unread' ? unread : notifications.length - unread})</button>
          ))}
        </div>
        {showForm && (
          <div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 space-y-3 mb-4 shadow-sm">
            <div className="flex items-center justify-between"><h3 className="text-sm font-medium text-[#1C1917]">New Notification</h3><button onClick={() => setShowForm(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-3.5 h-3.5" /></button></div>
            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
            <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowForm(false)} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer">Cancel</button>
              <button onClick={() => { if (!title.trim() || !message.trim()) return; addNotification({ title: title.trim(), message: message.trim(), date: 'Just now', read: false }); setTitle(''); setMessage(''); setShowForm(false); }} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">Create</button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {filtered.length === 0 ? <p className="text-sm text-[#57534E] text-center py-8">No notifications.</p> : filtered.map(n => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border bg-white transition-all ${!n.read ? 'border-l-4 border-l-[#A6852F] bg-[#A6852F]/[0.02]' : 'border-[#E8E5DF]/80'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-[#A6852F]/10 text-[#A6852F]' : 'bg-[#F3F1ED] text-[#57534E]'}`}><Bell className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2"><p className="text-sm font-medium text-[#1C1917]">{n.title}</p>{!n.read && <div className="w-2 h-2 rounded-full bg-[#A6852F] shrink-0" />}</div>
                <p className="text-xs text-[#57534E] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => updateNotification(n.id, { read: !n.read })} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer" title={n.read ? 'Mark unread' : 'Mark read'}>{n.read ? <MailOpen className="w-3.5 h-3.5" /> : <MailCheck className="w-3.5 h-3.5" />}</button>
                <button onClick={() => deleteNotification(n.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

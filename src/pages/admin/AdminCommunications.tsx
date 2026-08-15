import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Building2, Mail, Bell, Search, Eye, Trash2, Archive,
  ArrowLeft, Send, CheckCheck, MailOpen, MailCheck, Plus, X, Forward,
  ChevronLeft, ChevronRight, RotateCcw, Paperclip,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { fanChatRepository, businessEnquiriesRepository, getSupabaseClient } from '../../lib/repositories';
import { supabase } from '../../lib/supabase';
import { notifyService } from '../../lib/notifications';
import { formatDate } from '../../utils/formatDate';
import type { AdminSection, AdminConversation, AdminNotification } from '../../data/adminData';

interface AdminCommunicationsProps {
  activeSection: AdminSection;
}

const inputCls =
  'px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 transition-colors w-full';
const badgeCls = 'text-[10px] px-2 py-0.5 rounded-full font-medium';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-[#16A34A]/10 text-[#16A34A]',
  in_progress: 'bg-[#F59E0B]/10 text-[#F59E0B]',
  closed: 'bg-[#57534E]/10 text-[#57534E]',
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function hashColor(str: string): string {
  const colors = ['#A6852F', '#8B5CF6', '#3B82F6', '#16A34A', '#DC2626', '#F59E0B', '#EC4899', '#6366F1'];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

function formatMessageTime(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export const AdminCommunications: React.FC<AdminCommunicationsProps> = ({ activeSection }) => {
  const {
    conversations,
    businessEnquiries,
    notifications,
    members,
    updateConversation,
    deleteConversation,
    sendConversationMessage,
    initiateConversationForMember,
    updateNotification,
    deleteNotification,
    addNotification,
  } = useAdmin();

  switch (activeSection) {
    case 'fan-chat':
      return <FanChatSection conversations={conversations} members={members} updateConversation={updateConversation} deleteConversation={deleteConversation} sendConversationMessage={sendConversationMessage} initiateConversationForMember={initiateConversationForMember} />;
    case 'business-chat':
      return <BusinessChatSection businessEnquiries={businessEnquiries} updateConversation={updateConversation} deleteConversation={deleteConversation} sendConversationMessage={sendConversationMessage} />;
    case 'admin-notifications':
      return (
        <NotificationsSection
          notifications={notifications}
          updateNotification={updateNotification}
          deleteNotification={deleteNotification}
          addNotification={addNotification}
        />
      );
    default:
      return null;
  }
};

// ─────────────────────────────────────────────────────────────
// Fan Chat
// ─────────────────────────────────────────────────────────────

const FanChatSection: React.FC<{
  conversations: AdminConversation[];
  members: any[];
  updateConversation: (id: string, updates: Partial<AdminConversation>) => void;
  deleteConversation: (id: string) => void;
  sendConversationMessage: (conversationId: string, sender: string, text: string, type?: 'fan' | 'business', mediaUrl?: string | null, mediaType?: string | null) => void;
  initiateConversationForMember: (userId: string, participant: string, email: string, membershipTier: string | null, firstMessage: string, sender: 'member' | 'admin') => Promise<void>;
}> = ({ conversations, members, updateConversation, deleteConversation, sendConversationMessage, initiateConversationForMember }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [initiating, setInitiating] = useState(false);
  const [loadedMessages, setLoadedMessages] = useState<Record<string, any[]>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const { data } = await supabase.from('fan_messages').select('*').eq('conversation_id', convId).order('created_at', { ascending: true });
      setLoadedMessages((prev) => ({ ...prev, [convId]: data || [] }));
    } catch { /* silent */ }
  }, []);

  const memberSearchResults = useMemo(() => {
    if (!search && selectedMemberId) return [];
    const q = (search || selectedMemberId).toLowerCase();
    return members.filter((m) => {
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    }).slice(0, 10);
  }, [members, search, selectedMemberId]);

  const uploadFile = async (file: File): Promise<string | null> => {
    const client = getSupabaseClient();
    const path = `admin/${Date.now()}_${file.name}`;
    const { data, error } = await client.storage.from('chat-media').upload(path, file, { contentType: file.type });
    if (error) return null;
    const { data: urlData } = client.storage.from('chat-media').getPublicUrl(data.path);
    return urlData?.publicUrl || null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleInitiateConversation = async () => {
    if (!selectedMemberId || !newMessage.trim()) return;
    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;
    setInitiating(true);
    await initiateConversationForMember(member.id, member.name, member.email, member.membership !== 'None' ? member.membership : null, newMessage.trim(), 'admin');
    setShowNewConversation(false);
    setSelectedMemberId('');
    setNewMessage('');
    setInitiating(false);
  };

  const fanConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (c.type !== 'fan') return false;
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return c.participant.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q);
      }
      return true;
    });
  }, [conversations, search, statusFilter]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);
  const messages = selectedId ? (loadedMessages[selectedId] || selectedConversation?.messages || []) : [];

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  const handleArchive = (id: string) => {
    updateConversation(id, { status: 'closed' });
    supabase.from('fan_conversations').update({ status: 'closed' }).eq('id', id);
  };

  const handleReopen = (id: string) => {
    updateConversation(id, { status: 'open' });
    supabase.from('fan_conversations').update({ status: 'open' }).eq('id', id);
  };

  const handleStatusChange = (id: string, status: 'open' | 'in_progress' | 'closed') => {
    updateConversation(id, { status });
    supabase.from('fan_conversations').update({ status }).eq('id', id);
  };

  const handleView = (id: string) => {
    setSelectedId(id);
  };

  const handleSendReply = async () => {
    if ((!replyText.trim() && !pendingFile) || !selectedId) return;
    setUploading(true);
    try {
      let mediaUrl: string | null = null;
      let mediaType: string | null = null;
      if (pendingFile) {
        mediaUrl = await uploadFile(pendingFile);
        if (!mediaUrl) { setUploading(false); return; }
        mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image';
      }
      sendConversationMessage(selectedId, 'admin', replyText.trim(), 'fan', mediaUrl, mediaType);
      setReplyText('');
      setPendingFile(null);
      setPreviewUrl(null);
      setTimeout(() => loadMessages(selectedId), 500);
    } catch { /* silent */ }
    setUploading(false);
  };

  if (selectedConversation) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Fan Chat
          </button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Fan Chat</h1>
          <p className="text-sm text-[#57534E] mt-1">Conversation with {selectedConversation.participant}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
        >
          <div className="p-4 border-b border-[#E8E5DF]/40 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: hashColor(selectedConversation.participant) }}
            >
              {getInitials(selectedConversation.participant)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1917]">{selectedConversation.participant}</p>
              <p className="text-[10px] text-[#57534E]">{selectedConversation.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedConversation.status}
                onChange={(e) => handleStatusChange(selectedConversation.id, e.target.value as 'open' | 'in_progress' | 'closed')}
                className={`${inputCls} w-auto text-[10px] px-2 py-1 rounded-lg cursor-pointer`}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              {selectedConversation.status === 'closed' && (
                <button
                  onClick={() => handleReopen(selectedConversation.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reopen
                </button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-[#57534E] text-center py-8">No messages in this conversation yet.</p>
            ) : (
              messages.map((msg: any, i: number) => (
                <div key={msg.id || i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'admin'
                        ? 'bg-[#A6852F]/10 text-[#1C1917]'
                        : 'bg-[#F3F1ED] text-[#1C1917]'
                    }`}
                  >
                    <p className="text-[10px] font-medium text-[#A6852F] mb-1">
                      {msg.sender === 'admin' ? 'Admin' : 'Member'}
                    </p>
                    {msg.media_url && msg.media_type === 'image' && (
                      <img src={msg.media_url} alt="Shared" className="rounded-xl mb-2 max-w-full max-h-60 object-cover cursor-pointer" onClick={() => window.open(msg.media_url!, '_blank')} />
                    )}
                    {msg.media_url && msg.media_type === 'video' && (
                      <video src={msg.media_url} controls className="rounded-xl mb-2 max-w-full max-h-60" />
                    )}
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    <p className="text-[10px] text-[#57534E] mt-1">{formatMessageTime(msg.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#E8E5DF]/40">
            {previewUrl && (
              <div className="relative inline-block mb-2">
                <img src={previewUrl} alt="Preview" className="h-20 rounded-xl border border-[#E8E5DF] object-cover" />
                <button onClick={() => { setPreviewUrl(null); setPendingFile(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-9 h-9 rounded-xl border border-[#E8E5DF]/60 flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] transition-colors cursor-pointer disabled:opacity-50 shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="Type a reply..."
                className={inputCls}
              />
              <button
                onClick={handleSendReply}
                disabled={uploading || (!replyText.trim() && !pendingFile)}
                className="w-9 h-9 rounded-xl bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Fan Chat</h1>
            <p className="text-sm text-[#57534E] mt-1">Manage conversations with fans and supporters.</p>
          </div>
          <button
            onClick={() => setShowNewConversation(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            New Conversation
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/60" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputCls} w-auto sm:w-40 cursor-pointer`}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="space-y-2">
          {fanConversations.length === 0 ? (
            <p className="text-sm text-[#57534E] text-center py-8">No conversations found.</p>
          ) : (
            fanConversations.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all duration-500 shadow-sm hover:shadow-lg"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
                  style={{ backgroundColor: hashColor(c.participant) }}
                >
                  {getInitials(c.participant)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1917]">{c.participant}</p>
                  <p className="text-xs text-[#57534E] truncate">{c.lastMessage}</p>
                </div>
                <span className={`${badgeCls} ${STATUS_COLORS[c.status]}`}>
                  {STATUS_LABELS[c.status]}
                </span>
                <span className="text-[10px] text-[#57534E] shrink-0 hidden sm:block">{formatDate(c.date)}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status === 'closed' && (
                    <button
                      onClick={() => handleReopen(c.id)}
                      title="Reopen"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleView(c.id)}
                    title="View"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(c.id)}
                    title="Archive"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteConversation(c.id)}
                    title="Delete"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {showNewConversation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1C1917]">Start New Conversation</h3>
              <button onClick={() => setShowNewConversation(false)} className="text-[#57534E] hover:text-[#1C1917] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-[#57534E] mb-1 block">Send As</label>
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2 rounded-xl text-xs font-medium bg-[#A6852F] text-white cursor-pointer"
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#57534E] mb-1 block">Select Member</label>
              {selectedMemberId ? (
                <div className="flex items-center gap-2 p-2 rounded-xl border border-[#E8E5DF] bg-[#F3F1ED]/50">
                  <div className="w-8 h-8 rounded-full bg-[#A6852F] flex items-center justify-center text-white text-xs font-medium">
                    {getInitials(members.find((m) => m.id === selectedMemberId)?.name || '')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1C1917]">
                      {members.find((m) => m.id === selectedMemberId)?.name}
                    </p>
                    <p className="text-[10px] text-[#57534E]">{members.find((m) => m.id === selectedMemberId)?.email}</p>
                  </div>
                  <button onClick={() => setSelectedMemberId('')} className="text-[#57534E] hover:text-[#DC2626] cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={inputCls}
                  />
                  {search && memberSearchResults.length > 0 && (
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-[#E8E5DF] bg-white">
                      {memberSearchResults.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedMemberId(m.id); setSearch(''); }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#F3F1ED] transition-colors text-left cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-[#A6852F] flex items-center justify-center text-white text-xs font-medium">
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1C1917]">{m.name}</p>
                            <p className="text-[10px] text-[#57534E]">{m.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-[#57534E] mb-1 block">First Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowNewConversation(false)}
                className="flex-1 py-2 rounded-xl border border-[#E8E5DF] text-sm text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateConversation}
                disabled={!selectedMemberId || !newMessage.trim() || initiating}
                className="flex-1 py-2 rounded-xl bg-[#A6852F] text-white text-sm font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer disabled:opacity-50"
              >
                {initiating ? 'Sending...' : 'Start Conversation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Business Chat
// ─────────────────────────────────────────────────────────────

const BusinessChatSection: React.FC<{
  businessEnquiries: AdminConversation[];
  updateConversation: (id: string, updates: Partial<AdminConversation>) => void;
  deleteConversation: (id: string, type?: 'fan' | 'business') => void;
  sendConversationMessage: (conversationId: string, sender: string, text: string, type?: 'fan' | 'business', mediaUrl?: string | null, mediaType?: string | null) => void;
}> = ({ businessEnquiries, updateConversation, deleteConversation, sendConversationMessage }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [forwardedIds, setForwardedIds] = useState<Set<string>>(new Set());
  const [loadedMessages, setLoadedMessages] = useState<Record<string, any[]>>({});
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const { data } = await supabase.from('business_messages').select('*').eq('enquiry_id', convId).order('created_at', { ascending: true });
      setLoadedMessages((prev) => ({ ...prev, [convId]: data || [] }));
    } catch { /* silent */ }
  }, []);

  const uploadFile = async (file: File): Promise<string | null> => {
    const client = getSupabaseClient();
    const path = `admin/${Date.now()}_${file.name}`;
    const { data, error } = await client.storage.from('chat-media').upload(path, file, { contentType: file.type });
    if (error) return null;
    const { data: urlData } = client.storage.from('chat-media').getPublicUrl(data.path);
    return urlData?.publicUrl || null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const businessConversations = useMemo(() => {
    return businessEnquiries.filter((c) => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.participant.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [businessEnquiries, search, statusFilter]);

  const selectedConversation = businessEnquiries.find((c) => c.id === selectedId);
  const messages = selectedId ? (loadedMessages[selectedId] || selectedConversation?.messages || []) : [];

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  const handleArchive = (id: string) => {
    updateConversation(id, { status: 'closed' });
    supabase.from('business_enquiries').update({ status: 'closed' }).eq('id', id);
    const enquiry = businessEnquiries.find((c) => c.id === id);
    if (enquiry?.userId) {
      notifyService.businessEnquiryClosed(enquiry.userId, {
        email: enquiry.email,
        fullName: enquiry.participant,
      }).catch(() => {});
    }
  };

  const handleReopen = (id: string) => {
    updateConversation(id, { status: 'open' });
    supabase.from('business_enquiries').update({ status: 'open' }).eq('id', id);
  };

  const handleStatusChange = (id: string, status: 'open' | 'in_progress' | 'closed') => {
    updateConversation(id, { status });
    supabase.from('business_enquiries').update({ status }).eq('id', id);
    if (status === 'closed') {
      const enquiry = businessEnquiries.find((c) => c.id === id);
      if (enquiry?.userId) {
        notifyService.businessEnquiryClosed(enquiry.userId, {
          email: enquiry.email,
          fullName: enquiry.participant,
        }).catch(() => {});
      }
    }
  };

  const handleForward = (id: string) => {
    setForwardedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleSendReply = async () => {
    if ((!replyText.trim() && !pendingFile) || !selectedId) return;
    setUploading(true);
    try {
      let mediaUrl: string | null = null;
      let mediaType: string | null = null;
      if (pendingFile) {
        mediaUrl = await uploadFile(pendingFile);
        if (!mediaUrl) { setUploading(false); return; }
        mediaType = pendingFile.type.startsWith('video') ? 'video' : 'image';
      }
      sendConversationMessage(selectedId, 'admin', replyText.trim(), 'business', mediaUrl, mediaType);
      setReplyText('');
      setPendingFile(null);
      setPreviewUrl(null);
      setTimeout(() => loadMessages(selectedId), 500);
    } catch { /* silent */ }
    setUploading(false);
  };

  if (selectedConversation) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Business Chat
          </button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Business Chat</h1>
          <p className="text-sm text-[#57534E] mt-1">
            {selectedConversation.company
              ? `${selectedConversation.participant} — ${selectedConversation.company}`
              : selectedConversation.participant}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
        >
          <div className="p-4 border-b border-[#E8E5DF]/40 flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: hashColor(selectedConversation.participant) }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[#1C1917]">{selectedConversation.participant}</p>
                {forwardedIds.has(selectedConversation.id) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium flex items-center gap-1">
                    <Forward className="w-3 h-3" />
                    Forwarded
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[#57534E]">
                {selectedConversation.company} — {selectedConversation.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedConversation.status}
                onChange={(e) => handleStatusChange(selectedConversation.id, e.target.value as 'open' | 'in_progress' | 'closed')}
                className={`${inputCls} w-auto text-[10px] px-2 py-1 rounded-lg cursor-pointer`}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
              {selectedConversation.status === 'closed' && (
                <button
                  onClick={() => handleReopen(selectedConversation.id)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium bg-[#16A34A]/10 text-[#16A34A] hover:bg-[#16A34A]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reopen
                </button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-sm text-[#57534E] text-center py-8">No messages in this conversation yet.</p>
            ) : (
              messages.map((msg: any, i: number) => (
                <div key={msg.id || i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'admin'
                        ? 'bg-[#A6852F]/10 text-[#1C1917]'
                        : 'bg-[#F3F1ED] text-[#1C1917]'
                    }`}
                  >
                    <p className="text-[10px] font-medium text-[#A6852F] mb-1">
                      {msg.sender === 'admin' ? 'Admin' : 'Member'}
                    </p>
                    {msg.media_url && msg.media_type === 'image' && (
                      <img src={msg.media_url} alt="Shared" className="rounded-xl mb-2 max-w-full max-h-60 object-cover cursor-pointer" onClick={() => window.open(msg.media_url!, '_blank')} />
                    )}
                    {msg.media_url && msg.media_type === 'video' && (
                      <video src={msg.media_url} controls className="rounded-xl mb-2 max-w-full max-h-60" />
                    )}
                    {msg.text && <p className="text-sm">{msg.text}</p>}
                    <p className="text-[10px] text-[#57534E] mt-1">{formatMessageTime(msg.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#E8E5DF]/40">
            {previewUrl && (
              <div className="relative inline-block mb-2">
                <img src={previewUrl} alt="Preview" className="h-20 rounded-xl border border-[#E8E5DF] object-cover" />
                <button onClick={() => { setPreviewUrl(null); setPendingFile(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#DC2626] text-white flex items-center justify-center cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-9 h-9 rounded-xl border border-[#E8E5DF]/60 flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#A6852F] transition-colors cursor-pointer disabled:opacity-50 shrink-0">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                placeholder="Type a reply..."
                className={inputCls}
              />
              <button
                onClick={handleSendReply}
                disabled={uploading || (!replyText.trim() && !pendingFile)}
                className="w-9 h-9 rounded-xl bg-[#A6852F] text-white flex items-center justify-center hover:bg-[#8B6F1F] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {uploading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Business Chat</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage business enquiries and partnership conversations.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/60" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${inputCls} pl-9`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${inputCls} w-auto sm:w-40 cursor-pointer`}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="space-y-2">
          {businessConversations.length === 0 ? (
            <p className="text-sm text-[#57534E] text-center py-8">No conversations found.</p>
          ) : (
            businessConversations.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/40 transition-all duration-500 shadow-sm hover:shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1C1917]">{c.participant}</p>
                    {c.company && <span className="text-[10px] text-[#57534E]">({c.company})</span>}
                    {forwardedIds.has(c.id) && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] font-medium">Forwarded</span>
                    )}
                  </div>
                  <p className="text-xs text-[#57534E] truncate">{c.lastMessage}</p>
                </div>
                <span className={`${badgeCls} ${STATUS_COLORS[c.status]}`}>
                  {STATUS_LABELS[c.status]}
                </span>
                <span className="text-[10px] text-[#57534E] shrink-0 hidden sm:block">{formatDate(c.date)}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {c.status === 'closed' && (
                    <button
                      onClick={() => handleReopen(c.id)}
                      title="Reopen"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedId(c.id)}
                    title="View"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleForward(c.id)}
                    title="Forward"
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      forwardedIds.has(c.id) ? 'text-[#8B5CF6] bg-[#8B5CF6]/10' : 'text-[#57534E] hover:bg-[#F3F1ED]'
                    }`}
                  >
                    <Forward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleArchive(c.id)}
                    title="Archive"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteConversation(c.id, 'business')}
                    title="Delete"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Notifications
// ─────────────────────────────────────────────────────────────

const NotificationsSection: React.FC<{
  notifications: AdminNotification[];
  updateNotification: (id: string, updates: Partial<AdminNotification>) => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<AdminNotification, 'id'>) => void;
}> = ({ notifications, updateNotification, deleteNotification, addNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'read'>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    const matchesSearch = search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterTab === 'all' || (filterTab === 'unread' && !n.read) || (filterTab === 'read' && n.read);
    return matchesSearch && matchesFilter;
  });

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleToggleRead = (id: string) => {
    const n = notifications.find((n) => n.id === id);
    if (n) updateNotification(id, { read: !n.read });
  };

  const handleMarkAllRead = () => {
    notifications.forEach((n) => { if (!n.read) updateNotification(n.id, { read: true }); });
  };

  const handleCreateNotification = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    addNotification({ title: newTitle.trim(), message: newMessage.trim(), date: 'Just now', read: false });
    setNewTitle('');
    setNewMessage('');
    setShowForm(false);
  };

  const tabs = [
    { key: 'all' as const, label: 'All', count: notifications.length },
    { key: 'unread' as const, label: 'Unread', count: unreadCount },
    { key: 'read' as const, label: 'Read', count: notifications.length - unreadCount },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Notifications</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage system notifications and alerts.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Create Notification
            </button>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                <CheckCheck className="w-3.5 h-3.5" /> Mark All Read ({unreadCount})
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#57534E]" />
            <input type="text" placeholder="Search notifications..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-1.5 rounded-lg text-xs border border-[#E8E5DF]/60 bg-white text-[#1C1917] focus:outline-none focus:border-[#A6852F]/40 w-48" />
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4 border-b border-[#E8E5DF]/40">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setFilterTab(tab.key); setPage(1); }}
              className={`px-3 py-2 text-[10px] font-medium uppercase tracking-[0.05em] transition-colors cursor-pointer ${filterTab === tab.key ? 'text-[#A6852F] border-b-2 border-[#A6852F]' : 'text-[#57534E] hover:text-[#1C1917]'}`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mb-4">
              <div className="rounded-xl border border-[#A6852F]/20 bg-white p-4 space-y-3 shadow-sm hover:shadow-lg transition-all duration-500">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#1C1917]">New Notification</h3>
                  <button onClick={() => setShowForm(false)} className="w-6 h-6 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                </div>
                <input type="text" placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className={inputCls} />
                <textarea placeholder="Message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 text-xs text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">Cancel</button>
                  <button onClick={handleCreateNotification} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] transition-colors cursor-pointer">Create</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {paginated.length === 0 ? (
            <p className="text-sm text-[#57534E] text-center py-8">No notifications.</p>
          ) : paginated.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-xl border bg-white transition-all ${!n.read ? 'border-l-4 border-l-[#A6852F] bg-[#A6852F]/[0.02]' : 'border-[#E8E5DF]/80'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-[#A6852F]/10 text-[#A6852F]' : 'bg-[#F3F1ED] text-[#57534E]'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917]">{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-[#A6852F] shrink-0" />}
                </div>
                <p className="text-xs text-[#57534E] mt-0.5">{n.message}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-1">{n.date}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleToggleRead(n.id)} title={n.read ? 'Mark as Unread' : 'Mark as Read'} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                  {n.read ? <MailOpen className="w-3.5 h-3.5" /> : <MailCheck className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => deleteNotification(n.id)} title="Delete" className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-2">
            <span className="text-xs text-[#57534E]">{filtered.length} notifications · Page {page}/{totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] disabled:opacity-30 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

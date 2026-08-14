import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Send, ArrowLeft, Circle, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { businessEnquiriesRepository } from '../../lib/repositories';
import type { BusinessEnquiry, BusinessMessage } from '../../types/database';

export const DashboardMessages: React.FC = () => {
  const { user, profile } = useAuth();
  const [enquiries, setEnquiries] = useState<BusinessEnquiry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<BusinessMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [loading, setLoading] = useState(true);

  const loadEnquiries = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await businessEnquiriesRepository.getAll();
      setEnquiries(data.filter((e) => e.user_id === user.id));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadEnquiries(); }, [loadEnquiries]);

  const loadMessages = useCallback(async (enqId: string) => {
    try {
      const msgs = await businessEnquiriesRepository.getMessages(enqId);
      setMessages(msgs);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (selectedId) loadMessages(selectedId);
  }, [selectedId, loadMessages]);

  const handleSendReply = async () => {
    if (!selectedId || !replyText.trim() || !user?.id) return;
    try {
      await businessEnquiriesRepository.sendMessage(selectedId, {
        sender: 'member',
        text: replyText.trim(),
      });
      setReplyText('');
      loadMessages(selectedId);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    if (!newSubject.trim() || !newBody.trim() || !user?.id || !profile) return;
    try {
      const enq = await businessEnquiriesRepository.create({
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || null,
        company: null,
        enquiry_type: 'general',
        subject: newSubject.trim(),
        message: newBody.trim(),
        status: 'open',
        user_id: user.id,
      });
      setEnquiries((prev) => [enq, ...prev]);
      setSelectedId(enq.id);
      setNewSubject('');
      setNewBody('');
      setShowNew(false);
    } catch (e) { console.error(e); }
  };

  const selected = enquiries.find((e) => e.id === selectedId);

  if (selectedId && selected) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-4 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Back to messages
          </button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{selected.subject || 'Business Enquiry'}</h1>
          <p className="text-xs text-[#57534E] mt-1">{selected.enquiry_type} · {selected.status}</p>
        </motion.div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Inbox className="w-6 h-6 text-[#57534E]/20 mx-auto mb-2" />
              <p className="text-xs text-[#57534E]/60">No messages yet.</p>
            </div>
          ) : messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.sender === 'member' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.sender === 'member'
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-[#A6852F]/10 border border-[#A6852F]/20'
              }`}>
                {msg.sender !== 'member' && (
                  <p className="text-[10px] font-medium text-[#A6852F] mb-1">{msg.sender === 'admin' ? 'Support Team' : 'System'}</p>
                )}
                <p className={`text-sm ${msg.sender === 'member' ? 'text-white' : 'text-[#1C1917]'}`}>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'member' ? 'text-white/50' : 'text-[#57534E]/60'}`}>{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30"
          />
          <button onClick={handleSendReply} className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Messages</h1>
            <p className="text-sm text-[#57534E] mt-1">Business enquiries and support conversations.</p>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="inline-flex items-center gap-2 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer bg-[#A6852F]/10 px-3 py-1.5 rounded-xl">
            <Plus className="w-3.5 h-3.5" /> New Enquiry
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showNew && (
          <motion.div className="rounded-2xl border border-[#A6852F]/8 bg-white p-5 space-y-3 shadow-sm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" />
            <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} placeholder="Describe your enquiry..." rows={3} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 resize-none" />
            <div className="flex gap-2">
              <button onClick={handleCreate} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-all cursor-pointer">
                <Send className="w-4 h-4" /> Send
              </button>
              <button onClick={() => setShowNew(false)} className="text-sm text-[#57534E] hover:text-[#1C1917] px-4 py-2.5 cursor-pointer">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-[#57534E] text-sm">Loading...</div>
        ) : enquiries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#A6852F]/20 bg-[#A6852F]/5 p-12 text-center shadow-sm">
            <Inbox className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-[#1C1917]">No messages yet</p>
            <p className="text-xs text-[#57534E] mt-1">Start a new enquiry to begin a conversation.</p>
          </div>
        ) : (
          enquiries.map((enq, i) => (
            <motion.button
              key={enq.id}
              onClick={() => setSelectedId(enq.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-500 cursor-pointer ${
                enq.status === 'open' ? 'border-[#A6852F]/35 bg-[#A6852F]/10 shadow-sm' : 'border-[#A6852F]/20 bg-white hover:border-[#A6852F]/35 shadow-sm'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]"><Inbox className="w-4 h-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917] truncate">{enq.subject || 'Business Enquiry'}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${enq.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' : enq.status === 'in_progress' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#57534E]/10 text-[#57534E]'}`}>{enq.status}</span>
                </div>
                <p className="text-xs text-[#57534E] truncate mt-0.5">{enq.message}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-0.5">{new Date(enq.created_at).toLocaleDateString()}</p>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
};

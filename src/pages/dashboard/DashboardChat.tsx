import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, Phone, Send, Search, Trash2, Archive } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { fanChatRepository } from '../../lib/repositories';
import type { FanConversation, FanMessage } from '../../types/database';

export const DashboardChat: React.FC = () => {
  const { user, profile } = useAuth();
  const { membershipPlan, logActivity } = useDashboard();
  const canOpenWhatsApp = membershipPlan?.name === 'Gold' || membershipPlan?.name === 'Platinum';
  const [conversations, setConversations] = useState<FanConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<FanMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const allConvs = await fanChatRepository.getConversations();
      setConversations(allConvs.filter((c) => c.user_id === user.id));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadMessages = useCallback(async (convId: string) => {
    try {
      const msgs = await fanChatRepository.getMessages(convId);
      setMessages(msgs);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId);
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = conversations.filter((c) =>
    c.participant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!activeConvId || !newMessage.trim() || !user?.id) return;
    try {
      await fanChatRepository.sendMessage({
        conversation_id: activeConvId,
        sender: 'member',
        text: newMessage.trim(),
        media_type: null,
        media_url: null,
      });
      setNewMessage('');
      loadMessages(activeConvId);
    } catch (e) { console.error(e); }
  };

  const handleStartChat = async () => {
    if (!user?.id || !profile) return;
    try {
      const conv = await fanChatRepository.createConversation({
        participant: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || null,
        membership_tier: membershipPlan?.name || null,
        status: 'open',
        method: 'website',
        user_id: user.id,
      });
      setConversations((prev) => [conv, ...prev]);
      setActiveConvId(conv.id);
      logActivity('create', 'chat', 'New fan chat conversation started', { conversation_id: conv.id });
    } catch (e) { console.error(e); }
  };

  const handleClose = async (convId: string) => {
    try {
      await fanChatRepository.updateConversationStatus(convId, 'closed');
      setConversations((prev) => prev.map((c) => c.id === convId ? { ...c, status: 'closed' } : c));
    } catch (e) { console.error(e); }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  if (activeConvId && activeConv) {
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => setActiveConvId(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-3 cursor-pointer">
            ← Back to conversations
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{activeConv.participant}</h1>
              <p className="text-xs text-[#57534E]">{activeConv.email} · {activeConv.status}</p>
            </div>
            {activeConv.status === 'open' && (
              <button onClick={() => handleClose(activeConvId)} className="text-xs text-[#57534E] hover:text-[#1C1917] px-3 py-1.5 rounded-lg border border-[#E8E5DF] hover:bg-[#F3F1ED] transition-colors cursor-pointer">
                <Archive className="w-3.5 h-3.5 inline mr-1" /> Archive
              </button>
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-4 max-h-[500px] overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-6 h-6 text-[#57534E]/20 mx-auto mb-2" />
              <p className="text-xs text-[#57534E]/60">No messages yet. Start the conversation!</p>
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
                  : msg.sender === 'homer'
                    ? 'bg-[#A6852F]/10 border border-[#A6852F]/20'
                    : 'bg-[#F3F1ED] border border-[#E8E5DF]/60'
              }`}>
                {msg.sender !== 'member' && (
                  <p className="text-[10px] font-medium text-[#A6852F] mb-1">{msg.sender === 'homer' ? 'Homer Gere' : 'System'}</p>
                )}
                <p className={`text-sm ${msg.sender === 'member' ? 'text-white' : 'text-[#1C1917]'}`}>{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'member' ? 'text-white/50' : 'text-[#57534E]/60'}`}>{new Date(msg.created_at).toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply input */}
        {activeConv.status === 'open' && (
          <div className="flex items-center gap-3">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30"
            />
            <button onClick={handleSend} className="w-11 h-11 rounded-xl bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Conversation list view
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Chat with Homer</h1>
        <p className="text-sm text-[#57534E] mt-1">Your conversations and message history.</p>
      </motion.div>

      {/* New Chat */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <button onClick={handleStartChat} className="w-full flex items-center gap-4 p-5 rounded-2xl border border-dashed border-[#A6852F]/30 hover:border-[#A6852F]/60 hover:bg-[#A6852F]/5 transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-md">
          <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500"><MessageSquare className="w-5 h-5" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors">Start a New Conversation</p>
            <p className="text-xs text-[#57534E]">Send a message directly to Homer</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#A6852F]/40 group-hover:text-[#A6852F] group-hover:translate-x-1 transition-all" />
        </button>
      </motion.div>

      {/* WhatsApp */}
      {canOpenWhatsApp && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 p-5 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-500 cursor-pointer group shadow-sm hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500"><Phone className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#25D366] transition-colors">Open Official WhatsApp</p>
              <p className="text-xs text-[#57534E]">Available for {membershipPlan?.name || 'Member'} members</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#25D366]/40 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
          </a>
        </motion.div>
      )}

      {/* Search */}
      {conversations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18 }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]/40" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#A6852F]/8 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 shadow-sm" />
          </div>
        </motion.div>
      )}

      {/* Conversations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Conversation History</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-8 text-[#57534E] text-sm">Loading...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-8 text-center">
              <MessageSquare className="w-6 h-6 text-[#57534E]/30 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1C1917]">{searchQuery ? 'No matching conversations' : 'No conversations yet'}</p>
              <p className="text-xs text-[#57534E] mt-1">{searchQuery ? 'Try a different search term' : 'Start a conversation above'}</p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/20 bg-white hover:border-[#A6852F]/35 transition-all duration-500 shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10">
                <button onClick={() => setActiveConvId(c.id)} className="flex-1 flex items-center gap-4 text-left cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]"><MessageSquare className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium text-[#1C1917] truncate">{c.participant}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' : c.status === 'in_progress' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#57534E]/10 text-[#57534E]'}`}>{c.status}</span>
                    </div>
                    <p className="text-xs text-[#57534E] truncate mt-0.5">{c.email}</p>
                    <p className="text-[10px] text-[#57534E]/60 mt-0.5">{new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

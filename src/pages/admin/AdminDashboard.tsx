import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageCircle, Building2, Search, Filter, Download,
  ChevronDown, Clock, CheckCircle, AlertCircle, ArrowLeft, Eye, Trash2, Ban
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { ChatModal } from '../../components/ChatModal';
import { DetailModal } from '../../components/DetailModal';
import { ModalType, ChatConversation, ConversationStatus } from '../../types';

const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: '1',
    chatType: 'fan',
    fullName: 'Sarah Johnson',
    email: 'sarah@example.com',
    membershipTier: 'gold',
    messages: [
      { id: 'm1', sender: 'user', text: 'Hi Homer! Love your work in The Shards.', timestamp: '2026-08-10T14:30:00Z' },
    ],
    status: 'open',
    method: 'website',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-10T14:30:00Z',
  },
  {
    id: '2',
    chatType: 'business',
    fullName: 'Michael Chen',
    email: 'michael@brand.com',
    company: 'Luxe Brand Co.',
    enquiryType: 'Brand Partnership',
    messages: [
      { id: 'm2', sender: 'user', text: 'We would like to discuss a brand collaboration.', timestamp: '2026-08-09T10:00:00Z' },
    ],
    status: 'in_progress',
    method: 'email',
    createdAt: '2026-08-09T10:00:00Z',
    updatedAt: '2026-08-11T09:15:00Z',
  },
  {
    id: '3',
    chatType: 'fan',
    fullName: 'Emma Wilson',
    email: 'emma@example.com',
    messages: [
      { id: 'm3', sender: 'user', text: 'Can I get an autograph?', timestamp: '2026-08-08T16:45:00Z' },
    ],
    status: 'closed',
    method: 'website',
    createdAt: '2026-08-08T16:45:00Z',
    updatedAt: '2026-08-12T11:20:00Z',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection] = useState<string>('admin');
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatMode, setChatMode] = useState<'fan' | 'business'>('fan');

  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [filter, setFilter] = useState<'all' | 'fan' | 'business'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ConversationStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'home') navigate('/');
    else if (sectionId === 'chat') navigate('/chat');
    else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenChat = (mode: 'fan' | 'business' = 'fan') => {
    setChatMode(mode);
    setChatOpen(true);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (filter !== 'all' && conv.chatType !== filter) return false;
    if (statusFilter !== 'all' && conv.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        conv.fullName.toLowerCase().includes(q) ||
        conv.email.toLowerCase().includes(q) ||
        (conv.company && conv.company.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const updateStatus = (id: string, status: ConversationStatus) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
    );
  };

  const getStatusBadge = (status: ConversationStatus) => {
    switch (status) {
      case 'open':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />Open</span>;
      case 'in_progress':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#F59E0B] bg-[#F59E0B]/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />In Progress</span>;
      case 'closed':
        return <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6B7280] bg-[#6B7280]/10 px-2 py-0.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-[#6B7280]" />Closed</span>;
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased">
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenChat={handleOpenChat}
        onOpenSignIn={() => setActiveModal({ type: 'signin' })}
      />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#57534E] hover:text-[#C9A84C] transition-colors duration-300 mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Chat
            </button>

            <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[#57534E]">
              Manage conversations, enquiries, and communication channels.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 p-5">
              <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Total</span>
              <p className="text-2xl font-editorial text-[#1C1917] mt-1">{conversations.length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 p-5">
              <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Open</span>
              <p className="text-2xl font-editorial text-[#16A34A] mt-1">{conversations.filter((c) => c.status === 'open').length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 p-5">
              <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">In Progress</span>
              <p className="text-2xl font-editorial text-[#F59E0B] mt-1">{conversations.filter((c) => c.status === 'in_progress').length}</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#E8E5DF]/60 p-5">
              <span className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Closed</span>
              <p className="text-2xl font-editorial text-[#6B7280] mt-1">{conversations.filter((c) => c.status === 'closed').length}</p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57534E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C]/20 transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'fan', 'business'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                    filter === t
                      ? 'bg-[#1C1917] text-white'
                      : 'bg-white text-[#57534E] hover:bg-[#F3F1ED] border border-[#E8E5DF]/60'
                  }`}
                >
                  {t === 'all' ? 'All' : t === 'fan' ? 'Fan' : 'Business'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'open', 'in_progress', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#C9A84C] text-white'
                      : 'bg-white text-[#57534E] hover:bg-[#F3F1ED] border border-[#E8E5DF]/60'
                  }`}
                >
                  {s === 'all' ? 'All Status' : s === 'open' ? 'Open' : s === 'in_progress' ? 'In Progress' : 'Closed'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Conversations Table */}
          <motion.div
            className="bg-white rounded-2xl border border-[#E8E5DF]/60 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredConversations.length === 0 ? (
              <div className="p-12 text-center">
                <MessageCircle className="w-10 h-10 text-[#E8E5DF] mx-auto mb-4" />
                <p className="text-sm text-[#57534E]">No conversations found.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8E5DF]/60">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center gap-4 p-5 hover:bg-[#F3F1ED]/30 transition-colors duration-200 cursor-pointer"
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      conv.chatType === 'fan' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-[#1C1917]/10 text-[#1C1917]'
                    }`}>
                      {conv.chatType === 'fan' ? <MessageCircle className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#1C1917] truncate">{conv.fullName}</span>
                        {conv.company && <span className="text-xs text-[#57534E]">· {conv.company}</span>}
                      </div>
                      <p className="text-xs text-[#57534E] truncate">
                        {conv.messages[0]?.text || 'No messages'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(conv.status)}
                      <span className="text-[11px] text-[#57534E]">{formatDate(conv.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer onNavigate={handleNavigate} onOpenChat={handleOpenChat} />

      <ChatModal isOpen={chatOpen} initialMode={chatMode} onClose={() => setChatOpen(false)} />
      <DetailModal modal={activeModal} onClose={() => setActiveModal(null)} onOpenChat={handleOpenChat} />

      {/* Conversation Detail Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm" onClick={() => setSelectedConversation(null)} />
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] bg-[#FAF9F7] rounded-[2rem] overflow-hidden shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pt-6 pb-4 border-b border-[#E8E5DF]/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-editorial text-[#1C1917]">{selectedConversation.fullName}</h3>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="text-sm text-[#57534E] hover:text-[#1C1917] cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#57534E]">
                <span>{selectedConversation.email}</span>
                {selectedConversation.company && <span>· {selectedConversation.company}</span>}
                <span>· {selectedConversation.chatType === 'fan' ? 'Fan' : 'Business'}</span>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[50vh] p-6">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-medium text-[#57534E] uppercase">
                      {msg.sender === 'user' ? selectedConversation.fullName : 'Homer'}
                    </span>
                    <span className="text-[10px] text-[#57534E]">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#1C1917] bg-white rounded-xl p-3 border border-[#E8E5DF]/60">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[#E8E5DF]/60 flex items-center gap-3">
              <select
                value={selectedConversation.status}
                onChange={(e) => updateStatus(selectedConversation.id, e.target.value as ConversationStatus)}
                className="px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm text-[#1C1917] focus:outline-none focus:border-[#C9A84C] transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

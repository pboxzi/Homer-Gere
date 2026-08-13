import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, Phone, Send, Search, Trash2 } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardChat: React.FC = () => {
  const { conversations, membership, addConversation, closeConversation, deleteConversation, messages, addMessage, addMessageThread, markThreadRead } = useDashboard();
  const canOpenWhatsApp = membership.plan === 'Gold' || membership.plan === 'Platinum';
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thread = messages.find((t) => t.id === activeThread);

  const filteredConversations = conversations.filter((c) =>
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  const handleSend = () => {
    if (!thread || !newMessage.trim()) return;
    addMessage(thread.id, newMessage.trim());
    setNewMessage('');
  };

  const handleStartChat = () => {
    const threadId = addMessageThread('New Conversation', 'Hi Homer! I wanted to reach out.');
    setActiveThread(threadId);
  };

  // If a thread is active, show the conversation view
  if (thread) {
    return (
      <div className="space-y-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button onClick={() => setActiveThread(null)} className="flex items-center gap-2 text-sm text-[#57534E] hover:text-[#1C1917] transition-colors mb-3 cursor-pointer">
            ← Back to conversations
          </button>
          <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">{thread.subject}</h1>
        </motion.div>

        {/* Messages */}
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-4 max-h-[500px] overflow-y-auto space-y-4">
          {thread.messages.map((msg, i) => (
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
                <p className={`text-[10px] mt-1 ${msg.sender === 'member' ? 'text-white/50' : 'text-[#57534E]/60'}`}>{msg.date}</p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply input */}
        <div className="flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30"
          />
          <button onClick={handleSend} className="w-10 h-10 rounded-xl bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
            <Send className="w-4 h-4" />
          </button>
        </div>
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
        <button onClick={handleStartChat} className="w-full flex items-center gap-4 p-5 rounded-2xl border border-dashed border-[#A6852F]/30 hover:border-[#A6852F]/60 hover:bg-[#A6852F]/5 transition-all duration-300 cursor-pointer group">
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
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 p-5 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500"><Phone className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#25D366] transition-colors">Open Official WhatsApp</p>
              <p className="text-xs text-[#57534E]">Available for {membership.plan} members</p>
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
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search conversations..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" />
          </div>
        </motion.div>
      )}

      {/* Conversations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Conversation History</h3>
        <div className="space-y-3">
          {filteredConversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-8 text-center">
              <MessageSquare className="w-6 h-6 text-[#57534E]/30 mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1C1917]">{searchQuery ? 'No matching conversations' : 'No conversations yet'}</p>
              <p className="text-xs text-[#57534E] mt-1">{searchQuery ? 'Try a different search term' : 'Start a conversation above'}</p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const thread = messages.find((t) => t.subject.includes('Conversation') || t.lastMessage === c.lastMessage);
              return (
                <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 transition-all">
                  <button onClick={() => thread && setActiveThread(thread.id)} className="flex-1 flex items-center gap-4 text-left cursor-pointer">
                    <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]"><MessageSquare className="w-4 h-4" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-[#A6852F] uppercase">{c.type} Chat</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' : c.status === 'replied' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#57534E]/10 text-[#57534E]'}`}>{c.status}</span>
                      </div>
                      <p className="text-sm text-[#1C1917] truncate mt-1">{c.lastMessage}</p>
                      <p className="text-[11px] text-[#57534E] mt-0.5">{c.date}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    {c.status === 'open' && (
                      <button onClick={() => closeConversation(c.id)} className="text-[9px] text-[#57534E] hover:text-[#1C1917] px-2 py-1 rounded-lg hover:bg-[#F3F1ED] transition-colors cursor-pointer">Close</button>
                    )}
                    <button onClick={() => deleteConversation(c.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E]/30 hover:text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

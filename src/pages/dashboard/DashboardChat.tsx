import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MessageSquare, ArrowRight, Phone } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardChat: React.FC = () => {
  const navigate = useNavigate();
  const { conversations, membership } = useDashboard();
  const canOpenWhatsApp = membership.plan === 'Gold' || membership.plan === 'Platinum';

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Chat with Homer</h1>
        <p className="text-sm text-[#57534E] mt-1">Your conversations and message history.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <button onClick={() => navigate('/chat')} className="w-full flex items-center gap-4 p-5 rounded-2xl border border-dashed border-[#A6852F]/30 hover:border-[#A6852F]/60 hover:bg-[#A6852F]/5 transition-all duration-300 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500"><MessageSquare className="w-5 h-5" /></div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors">Start a New Conversation</p>
            <p className="text-xs text-[#57534E]">Send a message directly to Homer</p>
          </div>
          <ArrowRight className="w-4 h-4 text-[#A6852F]/40 group-hover:text-[#A6852F] group-hover:translate-x-1 transition-all" />
        </button>
      </motion.div>

      {canOpenWhatsApp && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <button onClick={() => {}} className="w-full flex items-center gap-4 p-5 rounded-2xl border border-[#25D366]/20 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all duration-300 cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500"><Phone className="w-5 h-5" /></div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#25D366] transition-colors">Open Official WhatsApp</p>
              <p className="text-xs text-[#57534E]">Available for {membership.plan} members</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#25D366]/40 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" />
          </button>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Conversation History</h3>
        <div className="space-y-3">
          {conversations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-8 text-center">
              <MessageSquare className="w-6 h-6 text-[#57534E]/30 mx-auto mb-2" />
              <p className="text-sm text-[#57534E]">No conversations yet.</p>
            </div>
          ) : (
            conversations.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]"><MessageSquare className="w-4 h-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-[#A6852F] uppercase">{c.type} Chat</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' : c.status === 'replied' ? 'bg-[#3B82F6]/10 text-[#3B82F6]' : 'bg-[#57534E]/10 text-[#57534E]'}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-[#1C1917] truncate mt-1">{c.lastMessage}</p>
                  <p className="text-[11px] text-[#57534E] mt-0.5">{c.date}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#57534E]/30 shrink-0" />
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

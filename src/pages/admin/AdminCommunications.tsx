import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Building2, Mail, Bell, Search, Eye, Trash2, Archive } from 'lucide-react';
import { MOCK_ADMIN_CONVERSATIONS, MOCK_ADMIN_CONTACT_MESSAGES, MOCK_ADMIN_NOTIFICATIONS } from '../../data/adminData';

export const AdminCommunications: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Communications</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage fan chat, business chat, contact messages, and notifications.</p>
      </motion.div>

      {/* Fan Chat */}
      <Section title="Fan Chat">
        <div className="space-y-2">
          {MOCK_ADMIN_CONVERSATIONS.filter((c) => c.type === 'fan').map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1C1917]">{c.participant}</p>
                <p className="text-xs text-[#57534E] truncate">{c.lastMessage}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                c.status === 'in_progress' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                'bg-[#57534E]/10 text-[#57534E]'
              }`}>{c.status}</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Archive className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Business Chat */}
      <Section title="Business Chat">
        <div className="space-y-2">
          {MOCK_ADMIN_CONVERSATIONS.filter((c) => c.type === 'business').map((c) => (
            <div key={c.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917]">{c.participant}</p>
                  {c.company && <span className="text-[10px] text-[#57534E]">({c.company})</span>}
                </div>
                <p className="text-xs text-[#57534E] truncate">{c.lastMessage}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                c.status === 'open' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                c.status === 'in_progress' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                'bg-[#57534E]/10 text-[#57534E]'
              }`}>{c.status}</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Archive className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Contact Messages */}
      <Section title="Contact Messages">
        <div className="space-y-2">
          {MOCK_ADMIN_CONTACT_MESSAGES.map((m) => (
            <div key={m.id} className={`flex items-start gap-4 p-4 rounded-2xl border bg-white hover:border-[#A6852F]/20 transition-all cursor-pointer ${!m.read ? 'border-[#A6852F]/20 bg-[#A6852F]/5' : 'border-[#E8E5DF]/60'}`}>
              <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#1C1917]">{m.name}</p>
                  {!m.read && <div className="w-2 h-2 rounded-full bg-[#A6852F]" />}
                </div>
                <p className="text-[10px] text-[#A6852F] font-medium">{m.department} — {m.subject}</p>
                <p className="text-xs text-[#57534E] truncate mt-0.5">{m.message}</p>
                <p className="text-[10px] text-[#57534E]/60 mt-1">{m.date}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <h3 className="text-sm font-medium text-[#1C1917] mb-4">{title}</h3>
    {children}
  </motion.div>
);

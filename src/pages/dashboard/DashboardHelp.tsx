import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const HELP_CATEGORIES = [
  { id: 'account', label: 'Account' },
  { id: 'membership', label: 'Membership' },
  { id: 'billing', label: 'Billing' },
  { id: 'technical', label: 'Technical' },
  { id: 'other', label: 'Other' },
] as const;

const FAQ_ITEMS = [
  { q: 'How do I upgrade my membership?', a: 'Navigate to the Membership page from the sidebar or visit /membership to view available plans and upgrade.' },
  { q: 'How do I request an experience?', a: 'Go to the Experiences page in your dashboard and select an available experience to submit a request.' },
  { q: 'How do I change my password?', a: 'Go to Security in your dashboard settings and click "Change" next to Change Password.' },
  { q: 'Can I cancel my membership?', a: 'Please contact our support team through this form or email support@homergere.com to request cancellation.' },
  { q: 'How do I enable two-factor authentication?', a: 'Go to Security in your dashboard and click "Enable" next to Two-Factor Authentication.' },
];

export const DashboardHelp: React.FC = () => {
  const { helpTickets, addHelpTicket, replyHelpTicket } = useDashboard();
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<'account' | 'membership' | 'billing' | 'technical' | 'other'>('account');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) return;
    addHelpTicket({ subject: subject.trim(), message: message.trim(), category });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setSubject(''); setMessage(''); }, 2000);
  };

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    replyHelpTicket(ticketId, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Help & Support</h1>
        <p className="text-sm text-[#57534E] mt-1">Get help with your account, membership, or platform features.</p>
      </motion.div>

      {/* FAQ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Frequently Asked Questions</h3>
        <div className="space-y-2">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-[#A6852F]/45 bg-white overflow-hidden shadow-md shadow-[#A6852F]/18 hover:shadow-lg hover:shadow-[#A6852F]/18 transition-shadow duration-500">
              <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left cursor-pointer">
                <span className="text-sm font-medium text-[#1C1917]">{faq.q}</span>
                {expandedFaq === i ? <ChevronUp className="w-4 h-4 text-[#57534E] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#57534E] shrink-0" />}
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="px-4 pb-4 text-sm text-[#57534E] leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917]">Contact Support</h3>
          <button onClick={() => setShowForm(!showForm)} className="text-xs text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">
            {showForm ? 'Cancel' : 'New Ticket'}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div className="rounded-2xl border border-[#A6852F]/38 bg-white p-5 space-y-3 mb-4 shadow-md shadow-[#A6852F]/18 hover:shadow-lg transition-shadow duration-500" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-[#16A34A]/22 flex items-center justify-center mx-auto mb-2"><Send className="w-5 h-5 text-[#16A34A]" /></div>
                  <p className="text-sm font-medium text-[#1C1917]">Ticket Submitted!</p>
                  <p className="text-xs text-[#57534E] mt-1">We'll respond within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as typeof HELP_CATEGORIES[number]['id'])} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 appearance-none">
                      {HELP_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" />
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue..." rows={4} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 resize-none" />
                  <button onClick={handleSubmit} className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/30 text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-all cursor-pointer">
                    <Send className="w-4 h-4" /> Submit Ticket
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Existing Tickets */}
      {helpTickets.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Your Tickets</h3>
          <div className="space-y-3">
            {helpTickets.map((ticket, i) => (
              <motion.div key={ticket.id} className="rounded-2xl border border-[#A6852F]/45 bg-white overflow-hidden shadow-md shadow-[#A6852F]/18 hover:shadow-lg hover:shadow-[#A6852F]/18 transition-shadow duration-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}>
                <button onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)} className="w-full flex items-center gap-4 p-4 text-left cursor-pointer">
                  <div className="w-9 h-9 rounded-xl bg-[#A6852F]/22 shadow-sm shadow-[#A6852F]/22 flex items-center justify-center text-[#A6852F] shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#1C1917] truncate">{ticket.subject}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${ticket.status === 'open' ? 'bg-[#16A34A]/22 text-[#16A34A]' : ticket.status === 'replied' ? 'bg-[#3B82F6]/15 text-[#3B82F6]' : 'bg-[#57534E]/15 text-[#57534E]'}`}>{ticket.status}</span>
                    </div>
                    <p className="text-[10px] text-[#57534E]/60 mt-0.5">{ticket.date} · {HELP_CATEGORIES.find((c) => c.id === ticket.category)?.label}</p>
                  </div>
                  {expandedTicket === ticket.id ? <ChevronUp className="w-4 h-4 text-[#57534E] shrink-0" /> : <ChevronDown className="w-4 h-4 text-[#57534E] shrink-0" />}
                </button>
                <AnimatePresence>
                  {expandedTicket === ticket.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-4 pb-4 space-y-3 border-t border-[#E8E5DF]/40">
                        <div className="pt-3">
                          <p className="text-sm text-[#57534E]">{ticket.message}</p>
                        </div>
                        {ticket.replies.map((reply) => (
                          <div key={reply.id} className={`p-3 rounded-xl ${reply.sender === 'member' ? 'bg-[#F3F1ED]/60 ml-4' : 'bg-[#A6852F]/8 mr-4'}`}>
                            <p className="text-[10px] font-medium text-[#A6852F] mb-1">{reply.sender === 'member' ? 'You' : 'Support'}</p>
                            <p className="text-sm text-[#1C1917]">{reply.text}</p>
                            <p className="text-[10px] text-[#57534E]/60 mt-1">{reply.date}</p>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1">
                          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleReply(ticket.id)} placeholder="Reply..." className="flex-1 px-4 py-2.5 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" />
                          <button onClick={() => handleReply(ticket.id)} className="w-9 h-9 rounded-xl bg-[#A6852F] hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/30 text-white flex items-center justify-center transition-colors cursor-pointer">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Calendar, Check, X, Star, Clock } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const EXPERIENCES = [
  { id: 'e1', title: 'Virtual Meet & Greet', description: 'A personal 15-minute video call with Homer.', price: '$49', duration: '15 min', category: 'Virtual', available: true, tier: 'Silver' },
  { id: 'e2', title: 'Birthday Video Message', description: 'A personalized video greeting for your special day.', price: '$29', duration: '2-3 min', category: 'Video', available: true, tier: 'All' },
  { id: 'e3', title: 'Signed Memorabilia', description: 'Receive a signed photo or item from Homer\'s collection.', price: '$35', duration: '3-5 days', category: 'Physical', available: true, tier: 'All' },
  { id: 'e4', title: 'Premiere Meet & Greet', description: 'Exclusive meet and greet at a film premiere event.', price: '$199', duration: '30 min', category: 'In-Person', available: false, tier: 'Gold' },
  { id: 'e5', title: 'Private Screening', description: 'Virtual private screening with Q&A session.', price: '$99', duration: '90 min', category: 'Virtual', available: true, tier: 'Gold' },
  { id: 'e6', title: 'Behind the Scenes Tour', description: 'Virtual tour of a current production set.', price: '$79', duration: '45 min', category: 'Virtual', available: true, tier: 'Gold' },
];

const CATEGORY_COLORS: Record<string, string> = {
  Virtual: '#3B82F6',
  Video: '#8B5CF6',
  Physical: '#16A34A',
  'In-Person': '#F59E0B',
};

export const DashboardExperiences: React.FC = () => {
  const { requests, addRequest, membership } = useDashboard();
  const [selectedExp, setSelectedExp] = useState<typeof EXPERIENCES[0] | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const experienceRequests = requests.filter((r) => r.type === 'experience');

  const canAccess = (tier: string) => {
    if (tier === 'All') return true;
    if (tier === 'Silver') return ['Silver', 'Gold', 'Platinum'].includes(membership.plan);
    if (tier === 'Gold') return ['Gold', 'Platinum'].includes(membership.plan);
    if (tier === 'Platinum') return membership.plan === 'Platinum';
    return false;
  };

  const handleSubmit = () => {
    if (!selectedExp) return;
    addRequest({
      type: 'experience',
      title: selectedExp.title,
      description: requestNote || selectedExp.description,
    });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setSelectedExp(null); setRequestNote(''); }, 2000);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Experiences</h1>
        <p className="text-sm text-[#57534E] mt-1">Browse and request exclusive experiences with Homer.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pending', count: experienceRequests.filter((r) => r.status === 'pending').length, color: '#F59E0B' },
          { label: 'Approved', count: experienceRequests.filter((r) => r.status === 'approved').length, color: '#16A34A' },
          { label: 'Completed', count: experienceRequests.filter((r) => r.status === 'completed').length, color: '#57534E' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-3 text-center" style={{ backgroundColor: `${s.color}10` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
            <p className="text-lg font-editorial" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] font-medium" style={{ color: s.color }}>{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Available Experiences */}
      <div>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Available Experiences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXPERIENCES.map((exp, i) => {
            const accessible = canAccess(exp.tier);
            const color = CATEGORY_COLORS[exp.category] || '#57534E';
            return (
              <motion.div
                key={exp.id}
                className={`rounded-2xl border bg-white p-5 transition-all ${accessible ? 'border-[#E8E5DF]/60 hover:border-[#A6852F]/30 cursor-pointer' : 'border-[#E8E5DF]/30 opacity-60'}`}
                onClick={() => accessible && setSelectedExp(exp)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{exp.category}</span>
                  <span className="text-[10px] font-medium text-[#57534E]">{exp.tier}+</span>
                </div>
                <h4 className="text-sm font-medium text-[#1C1917] mb-1">{exp.title}</h4>
                <p className="text-xs text-[#57534E] mb-3">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {exp.price}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {exp.duration}</span>
                  </div>
                  {accessible && exp.available ? (
                    <span className="text-[10px] text-[#16A34A] font-medium">Available</span>
                  ) : (
                    <span className="text-[10px] text-[#57534E]/60">{!accessible ? 'Upgrade required' : 'Unavailable'}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Requests */}
      {experienceRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Your Requests</h3>
          <div className="space-y-2">
            {experienceRequests.map((r, i) => (
              <motion.div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${r.status === 'approved' ? 'bg-[#16A34A]/10 text-[#16A34A]' : r.status === 'completed' ? 'bg-[#57534E]/10 text-[#57534E]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                  {r.status === 'approved' || r.status === 'completed' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1917]">{r.title}</p>
                  <p className="text-[10px] text-[#57534E] mt-0.5">{r.date}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${r.status === 'approved' ? 'bg-[#16A34A]/10 text-[#16A34A]' : r.status === 'completed' ? 'bg-[#57534E]/10 text-[#57534E]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>{r.status.replace('_', ' ')}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {selectedExp && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedExp(null)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-[#16A34A]" /></div>
                  <p className="text-sm font-medium text-[#1C1917]">Request Submitted!</p>
                  <p className="text-xs text-[#57534E] mt-1">We'll review your request shortly.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">{selectedExp.title}</h3>
                    <button onClick={() => setSelectedExp(null)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-[#57534E]">{selectedExp.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {selectedExp.price}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {selectedExp.duration}</span>
                  </div>
                  <textarea
                    value={requestNote}
                    onChange={(e) => setRequestNote(e.target.value)}
                    placeholder="Add a note (optional)..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 resize-none"
                  />
                  <button onClick={handleSubmit} className="w-full bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium py-3 rounded-2xl transition-all cursor-pointer">
                    Submit Request
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

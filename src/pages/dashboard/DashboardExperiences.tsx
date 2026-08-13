import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, X, Star, Clock, Trash2, Users, Heart, Mic, Briefcase, Sparkles, Video, Play } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import type { Experience } from '../../types';

const ICON_MAP: Record<string, React.ReactNode> = {
  users: <Users className="w-4 h-4" />,
  calendar: <Calendar className="w-4 h-4" />,
  heart: <Heart className="w-4 h-4" />,
  mic: <Mic className="w-4 h-4" />,
  briefcase: <Briefcase className="w-4 h-4" />,
  sparkles: <Sparkles className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  play: <Play className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  'meet-and-greet': '#F59E0B',
  'fan-event': '#3B82F6',
  'charity-appearance': '#16A34A',
  'speaking-engagement': '#8B5CF6',
  'brand-collaboration': '#EC4899',
  'private-event': '#A6852F',
  'virtual-appearance': '#3B82F6',
  'video-greeting': '#8B5CF6',
};

const TIER_ACCESS: Record<string, string[]> = {
  'meet-and-greet': ['Gold', 'Platinum'],
  'fan-event': ['Silver', 'Gold', 'Platinum'],
  'charity-appearance': ['Silver', 'Gold', 'Platinum'],
  'speaking-engagement': ['Gold', 'Platinum'],
  'brand-collaboration': ['Platinum'],
  'private-event': ['Gold', 'Platinum'],
  'virtual-appearance': ['Silver', 'Gold', 'Platinum'],
  'video-greeting': ['Silver', 'Gold', 'Platinum'],
};

export const DashboardExperiences: React.FC<{ openRequestForm?: boolean; onRequestFormOpened?: () => void }> = ({ openRequestForm, onRequestFormOpened }) => {
  const { requests, addRequest, membership, withdrawRequest } = useDashboard();
  const { experiences } = useSiteContent();
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [requestNote, setRequestNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (openRequestForm) {
      setSelectedExp(experiences[0]);
      onRequestFormOpened?.();
    }
  }, [openRequestForm, onRequestFormOpened]);

  const experienceRequests = requests.filter((r) => r.type === 'experience');

  const canAccess = (exp: Experience) => {
    const requiredTiers = TIER_ACCESS[exp.type] || ['Silver', 'Gold', 'Platinum'];
    return requiredTiers.includes(membership.plan);
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
          {experiences.map((exp, i) => {
            const accessible = canAccess(exp);
            const color = CATEGORY_COLORS[exp.type] || '#57534E';
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
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1" style={{ backgroundColor: `${color}15`, color }}>
                    {ICON_MAP[exp.iconName] || <Sparkles className="w-3 h-3" />}
                    {exp.title}
                  </span>
                  <span className="text-[10px] font-medium text-[#57534E]">{exp.availability === 'available' ? 'Available' : exp.availability === 'limited' ? 'Limited' : 'Unavailable'}</span>
                </div>
                <h4 className="text-sm font-medium text-[#1C1917] mb-1">{exp.title}</h4>
                <p className="text-xs text-[#57534E] mb-3">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {exp.price}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.duration}</span>
                  </div>
                  {accessible && exp.availability !== 'unavailable' ? (
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
                {r.status === 'pending' && (
                  <button onClick={() => withdrawRequest(r.id)} className="text-[10px] text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors cursor-pointer">Withdraw</button>
                )}
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
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedExp.duration}</span>
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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Check, X, Star, Clock, Users, Heart, Mic, Briefcase, Sparkles, Video, Play, Send, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAuth } from '../../context/AuthContext';
import { experienceRequestsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
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

type ModalStep = 'form' | 'confirm' | 'submitted';

export const DashboardExperiences: React.FC<{ openRequestForm?: boolean; onRequestFormOpened?: () => void }> = ({ openRequestForm, onRequestFormOpened }) => {
  const { user, profile } = useAuth();
  const { experienceRequests, membershipPlan, refreshExperiences, logActivity } = useDashboard();
  const { experiences } = useSiteContent();
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [submitting, setSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({
    preferredDate: '',
    location: '',
    guests: '1',
    specialRequirements: '',
    notes: '',
  });

  React.useEffect(() => {
    if (openRequestForm) {
      setSelectedExp(experiences[0]);
      setModalStep('form');
      onRequestFormOpened?.();
    }
  }, [openRequestForm, onRequestFormOpened]);

  const experienceRequestsList = experienceRequests;

  const canAccess = (exp: Experience) => {
    const requiredTiers = TIER_ACCESS[exp.type] || ['Silver', 'Gold', 'Platinum'];
    return requiredTiers.includes(membershipPlan?.name || '');
  };

  const handleSelectExperience = (exp: Experience) => {
    if (!canAccess(exp) || exp.availability === 'unavailable') return;
    setSelectedExp(exp);
    setModalStep('form');
  };

  const handleSubmit = async () => {
    if (!selectedExp || !user?.id || !profile) return;
    setModalStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    if (!selectedExp || !user?.id || !profile) return;
    setSubmitting(true);
    try {
      await experienceRequestsRepository.create({
        user_id: user.id,
        experience_type: selectedExp.type,
        full_name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        phone: profile.phone || null,
        country: profile.country || null,
        organization: null,
        event_date: requestForm.preferredDate || null,
        event_location: requestForm.location || null,
        budget: null,
        purpose: requestForm.notes || null,
        additional_details: requestForm.specialRequirements || null,
        preferred_date: requestForm.preferredDate || null,
        num_guests: parseInt(requestForm.guests) || 1,
        special_requirements: requestForm.specialRequirements || null,
        timeline: null,
        status: 'pending',
      });
      setModalStep('submitted');
      refreshExperiences();
      logActivity('create', 'experience', `Experience request submitted: ${selectedExp.type}`, { experience_type: selectedExp.type });
      await notifyService.experienceRequestSubmitted(user.id, {
        email: profile.email,
        fullName: `${profile.first_name} ${profile.last_name}`.trim(),
        experienceType: selectedExp.type,
        preferredDate: requestForm.preferredDate || 'TBD',
      });
    } catch { /* silent */ }
    setSubmitting(false);
  };

  const handleCloseModal = () => {
    setSelectedExp(null);
    setModalStep('form');
    setRequestForm({ preferredDate: '', location: '', guests: '1', specialRequirements: '', notes: '' });
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
          { label: 'Pending', count: experienceRequestsList.filter((r) => r.status === 'pending').length, color: '#F59E0B' },
          { label: 'Approved', count: experienceRequestsList.filter((r) => r.status === 'approved').length, color: '#16A34A' },
          { label: 'Completed', count: experienceRequestsList.filter((r) => r.status === 'completed').length, color: '#57534E' },
        ].map((s, i) => (
          <motion.div key={s.label} className="rounded-xl p-4 text-center border" style={{ borderColor: `${s.color}45`, background: `linear-gradient(135deg, ${s.color}22, ${s.color}0A)`, boxShadow: `0 0 35px ${s.color}35, 0 6px 20px ${s.color}25` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
            <p className="text-xl font-editorial" style={{ color: s.color }}>{s.count}</p>
            <p className="text-[10px] font-semibold mt-1" style={{ color: s.color }}>{s.label}</p>
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
            const hasActiveRequest = experienceRequestsList.some(r => r.experience_type === exp.type && r.status !== 'completed' && r.status !== 'declined');
            return (
              <motion.div
                key={exp.id}
                className={`rounded-2xl p-5 transition-all duration-500 border bg-white ${accessible && exp.availability !== 'unavailable' && !hasActiveRequest ? 'hover:scale-[1.01] cursor-pointer' : 'opacity-60'}`}
                style={{ borderColor: `${color}45`, boxShadow: `0 0 40px ${color}40, 0 8px 25px ${color}30, inset 0 1px 0 ${color}15` }}
                onClick={() => handleSelectExperience(exp)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: `${color}18`, color, boxShadow: `0 0 12px ${color}22` }}>
                    {ICON_MAP[exp.iconName] || <Sparkles className="w-3 h-3" />}
                    {exp.title}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color }}>{exp.availability === 'available' ? 'Available' : exp.availability === 'limited' ? 'Limited' : 'Unavailable'}</span>
                </div>
                <h4 className="text-sm font-medium text-[#1C1917] mb-1">{exp.title}</h4>
                <p className="text-xs text-[#57534E] mb-3">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {exp.price}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {exp.duration}</span>
                  </div>
                  {accessible && exp.availability !== 'unavailable' && !hasActiveRequest ? (
                    <span className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${color}15`, color }}>Request Experience</span>
                  ) : hasActiveRequest ? (
                    <span className="text-[10px] text-[#57534E]/60">Active request</span>
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
      {experienceRequestsList.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[#1C1917] mb-4">Your Requests</h3>
          <div className="space-y-2">
            {experienceRequestsList.map((r, i) => {
              const reqColor = r.status === 'approved' ? '#16A34A' : r.status === 'completed' ? '#57534E' : r.status === 'declined' ? '#DC2626' : '#F59E0B';
              return (
                <motion.div key={r.id} className="flex items-center gap-4 p-4 rounded-2xl border bg-white transition-all duration-500" style={{ borderColor: `${reqColor}40`, boxShadow: `0 0 30px ${reqColor}25, 0 6px 20px ${reqColor}18` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.04 }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: `${reqColor}15`, color: reqColor, boxShadow: `0 0 12px ${reqColor}1B` }}>
                    {r.status === 'approved' || r.status === 'completed' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C1917]">{r.experience_type}</p>
                    <p className="text-[10px] text-[#57534E] mt-0.5">{r.request_number} · {new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shadow-sm" style={{ backgroundColor: `${reqColor}12`, color: reqColor, boxShadow: `0 0 8px ${reqColor}0C` }}>{r.status.replace(/_/g, ' ')}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {selectedExp && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !submitting && handleCloseModal()} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>

              {/* Step: Form */}
              {modalStep === 'form' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">{selectedExp.title}</h3>
                    <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-[#57534E]">{selectedExp.description}</p>
                  <div className="flex items-center gap-4 text-xs text-[#57534E]">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {selectedExp.price}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {selectedExp.duration}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">Preferred Date</label>
                      <input type="date" value={requestForm.preferredDate} onChange={e => setRequestForm(f => ({ ...f, preferredDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#1C1917] mb-1">Guests</label>
                      <input type="number" min="1" max="20" value={requestForm.guests} onChange={e => setRequestForm(f => ({ ...f, guests: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Preferred Location</label>
                    <input value={requestForm.location} onChange={e => setRequestForm(f => ({ ...f, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="e.g. Los Angeles, CA" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Special Requirements</label>
                    <textarea value={requestForm.specialRequirements} onChange={e => setRequestForm(f => ({ ...f, specialRequirements: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]" placeholder="Accessibility needs, dietary restrictions, etc." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1C1917] mb-1">Additional Notes</label>
                    <textarea value={requestForm.notes} onChange={e => setRequestForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[60px]" placeholder="Any additional details..." />
                  </div>
                  <button onClick={handleSubmit} className="w-full bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium py-3 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" /> Review Request
                  </button>
                </>
              )}

              {/* Step: Confirm */}
              {modalStep === 'confirm' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">Confirm Request</h3>
                    <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="rounded-xl border border-[#A6852F]/20 p-4 bg-[#FAF9F7]">
                    <p className="text-sm font-medium text-[#1C1917]">{selectedExp.title}</p>
                    <div className="mt-2 space-y-1 text-xs text-[#57534E]">
                      {requestForm.preferredDate && <p>Date: {requestForm.preferredDate}</p>}
                      {requestForm.location && <p>Location: {requestForm.location}</p>}
                      <p>Guests: {requestForm.guests}</p>
                      {requestForm.specialRequirements && <p>Requirements: {requestForm.specialRequirements}</p>}
                    </div>
                  </div>

                  <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/30 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div className="text-sm text-[#1C1917]">
                        <p className="font-medium mb-1">You are about to submit this request.</p>
                        <p className="text-xs text-[#57534E]">After approval you will receive payment instructions if applicable. Our team will review your request shortly.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button onClick={handleConfirmSubmit} disabled={submitting}
                      className="flex-1 py-3 bg-[#A6852F] hover:bg-[#8B6F1F] text-white rounded-xl shadow-md shadow-[#A6852F]/25 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]">
                      {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button onClick={() => setModalStep('form')} disabled={submitting} className="px-5 py-3 bg-[#F3F1ED] text-[#57534E] rounded-xl hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50 transition-all cursor-pointer">Back</button>
                  </div>
                </>
              )}

              {/* Step: Submitted */}
              {modalStep === 'submitted' && (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-[#16A34A]/22 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#16A34A]" />
                  </div>
                  <p className="text-lg font-editorial text-[#1C1917] mb-2">Request Submitted!</p>
                  <div className="space-y-2 text-sm text-[#57534E] max-w-xs mx-auto">
                    <p>Your <strong className="text-[#1C1917]">{selectedExp.title}</strong> request has been submitted successfully.</p>
                    <p>Our team is reviewing your request. You will receive an email and dashboard notification once a decision has been made.</p>
                  </div>
                  <button onClick={handleCloseModal} className="mt-6 px-8 py-2.5 bg-[#A6852F] text-white rounded-xl text-sm font-medium hover:bg-[#8B6F1F] transition-all cursor-pointer">
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

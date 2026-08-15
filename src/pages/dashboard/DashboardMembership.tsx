import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Check, Shield, Zap, Calendar, CreditCard, Clock, Star, X, Send, AlertCircle } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAuth } from '../../context/AuthContext';
import { membershipRequestsRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { DashboardSection } from '../../data/dashboardData';
import type { MembershipTier } from '../../types';

const TIER_ICONS: Record<string, React.ReactNode> = {
  silver: <Shield className="w-4 h-4" />,
  gold: <Crown className="w-4 h-4" />,
  platinum: <Zap className="w-4 h-4" />,
};

const TIER_COLORS: Record<string, string> = {
  silver: '#9CA3AF',
  gold: '#A6852F',
  platinum: '#8B5CF6',
};

type ModalStep = 'select' | 'confirm' | 'submitted';

export const DashboardMembership: React.FC<{ onNavigate?: (section: DashboardSection) => void; initialTab?: 'overview' | 'plans' | 'history' }> = ({ onNavigate, initialTab }) => {
  const { user, profile } = useAuth();
  const { membership, membershipPlan, membershipRequests, logActivity } = useDashboard();
  const { membershipTiers } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'history'>(initialTab || 'overview');

  const [modalStep, setModalStep] = useState<ModalStep>('select');
  const [selectedPlan, setSelectedPlan] = useState<MembershipTier | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const activeRequest = membershipRequests.find((r) => !['rejected', 'membership_active'].includes(r.status));
  const pastRequests = membershipRequests.filter((r) => r.status === 'rejected' || r.status === 'membership_active');

  const daysUntilExpiry = membership?.end_date
    ? Math.ceil((new Date(membership.end_date).getTime() - Date.now()) / 86400000)
    : null;

  const handleRequestMembership = (plan: MembershipTier) => {
    setSelectedPlan(plan);
    setModalStep('confirm');
    setShowModal(true);
  };

  const handleSubmitRequest = async () => {
    if (!selectedPlan || !user?.id || !profile) return;
    setActionLoading(true);
    try {
      const requestData = {
        user_id: user.id,
        full_name: `${profile.first_name} ${profile.last_name}`.trim(),
        email: profile.email,
        phone: profile.phone || null,
        country: profile.country || null,
        membership_plan_id: selectedPlan.id,
        membership_plan_name: selectedPlan.name,
        duration: selectedPlan.period || 'monthly',
        preferred_payment_method: null,
        currency: 'USD',
        notes: null,
      };
      const created = await membershipRequestsRepository.create(requestData);
      await notifyService.membershipRequestReceived(user.id, {
        fullName: requestData.full_name,
        email: requestData.email,
        planName: requestData.membership_plan_name,
        requestNumber: created.request_number,
      });
      await logActivity('create', 'membership', `Membership request submitted: ${selectedPlan.name}`, { membership_plan_id: selectedPlan.id, request_number: created.request_number });
      setModalStep('submitted');
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalStep('select');
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your membership, view benefits, and explore plans.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#A6852F]/22 pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'plans', label: 'All Plans' },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[#A6852F] text-white shadow-md shadow-[#A6852F]/38' : 'text-[#57534E] hover:bg-[#A6852F]/22'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Membership Status */}
          <motion.div className="rounded-2xl border border-[#A6852F]/90 bg-gradient-to-br from-[#A6852F]/10 via-[#A6852F]/5 to-transparent p-6 shadow-lg shadow-[#A6852F]/22" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/20 flex items-center justify-center text-[#A6852F] shadow-lg shadow-[#A6852F]/30">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-editorial text-[#1C1917]">{membershipPlan?.name || 'Member'}</h3>
                <p className="text-xs text-[#57534E]">{membership?.status === 'active' ? 'Active Membership' : 'No Active Membership'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-xl border border-[#A6852F]/38 shadow-md shadow-[#A6852F]/22" style={{ background: 'linear-gradient(135deg, rgba(166,133,47,0.15), rgba(166,133,47,0.05))' }}>
                <Calendar className="w-4 h-4 text-[#A6852F] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.start_date ? new Date(membership.start_date).toLocaleDateString() : '—'}</p>
                <p className="text-[10px] text-[#57534E]">Start Date</p>
              </div>
              <div className="text-center p-3 rounded-xl border border-[#8B5CF6]/38 shadow-md shadow-[#8B5CF6]/15" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(139,92,246,0.05))' }}>
                <Clock className="w-4 h-4 text-[#8B5CF6] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.end_date ? new Date(membership.end_date).toLocaleDateString() : '—'}</p>
                <p className="text-[10px] text-[#57534E]">Expiry Date</p>
              </div>
              <div className="text-center p-3 rounded-xl border border-[#16A34A]/38 shadow-md shadow-[#16A34A]/15" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(22,163,74,0.05))' }}>
                <CreditCard className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.auto_renew ? 'Auto' : 'Manual'}</p>
                <p className="text-[10px] text-[#57534E]">Renewal</p>
              </div>
              <div className="text-center p-3 rounded-xl border border-[#F59E0B]/38 shadow-md shadow-[#F59E0B]/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))' }}>
                <Star className="w-4 h-4 text-[#F59E0B] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{daysUntilExpiry !== null ? `${daysUntilExpiry} days` : '—'}</p>
                <p className="text-[10px] text-[#57534E]">Until Expiry</p>
              </div>
            </div>
          </motion.div>

          {/* Benefits */}
          {membershipPlan?.features && membershipPlan.features.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h3 className="text-sm font-medium text-[#1C1917] mb-3">Your Benefits</h3>
              <div className="rounded-2xl border border-[#16A34A]/15 bg-white p-4 shadow-sm shadow-[#16A34A]/5">
                <ul className="space-y-2.5">
                  {(Array.isArray(membershipPlan.features) ? membershipPlan.features : []).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs">
                      <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                      <span className="text-[#1C1917]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Active Request */}
          {activeRequest && (
            <motion.div className="rounded-2xl border border-[#F59E0B]/38 bg-[#F59E0B]/8 p-4 shadow-sm shadow-[#F59E0B]/15" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <p className="text-xs font-medium text-[#F59E0B] mb-1">Active Request</p>
              <p className="text-sm text-[#1C1917]">{activeRequest.membership_plan_name} — {activeRequest.status.replace(/_/g, ' ')}</p>
              <button onClick={() => onNavigate?.('membership-requests')} className="text-xs text-[#A6852F] font-medium mt-2 hover:text-[#8B6F1F] cursor-pointer">View Details →</button>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => setActiveTab('plans')} className="flex-1 py-3 bg-[#A6852F] text-white rounded-2xl text-sm font-medium hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#A6852F]/38">
              <Crown className="w-4 h-4" /> {membership?.status === 'active' ? 'Upgrade Plan' : 'Get Membership'}
            </button>
            <button onClick={() => onNavigate?.('membership-card')} className="px-4 py-3 border border-[#A6852F]/45 rounded-2xl text-sm font-medium text-[#A6852F] hover:bg-[#A6852F]/8 transition-all cursor-pointer shadow-sm shadow-[#A6852F]/22">
              View Card
            </button>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membershipTiers.map((tier, i) => {
            const isCurrent = tier.name === membershipPlan?.name;
            const hasActiveRequest = !!activeRequest;
            const tierColor = TIER_COLORS[tier.name.toLowerCase()] || TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div key={tier.id} className="rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-500" style={{ background: `linear-gradient(135deg, ${tierColor}F5, ${tierColor}E8 50%, ${tierColor}D9 75%, ${tierColor}E6)`, boxShadow: `0 12px 50px ${tierColor}80, 0 0 80px ${tierColor}55, inset 0 1px 0 rgba(255,255,255,0.2)` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-25" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-25" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(-25%, 25%)' }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full opacity-10" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(-50%, -50%)' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-8 rounded-md border border-white/30 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))' }}>
                      <div className="w-6 h-4 rounded-sm bg-white/40" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCurrent && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">Current</span>}
                      {tier.isPopular && !isCurrent && tier.badge && <span className="text-[9px] px-2.5 py-1 rounded-full bg-white/25 font-bold backdrop-blur-sm border border-white/20">{tier.badge}</span>}
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-widest opacity-80 mb-1 font-medium">{tier.name}</p>
                    <p className="text-3xl font-editorial">${tier.price}<span className="text-sm font-normal opacity-70">/{tier.period}</span></p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 mb-4">
                    <p className="text-[10px] opacity-70">{tier.features.filter((f) => f.included).length} features included</p>
                    <div className="flex items-center gap-1 opacity-80">
                      {TIER_ICONS[tier.name.toLowerCase()] || TIER_ICONS[tier.id] || <Crown className="w-4 h-4" />}
                    </div>
                  </div>
                  {!isCurrent && !hasActiveRequest && (
                    <button onClick={() => handleRequestMembership(tier)} className="w-full py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20">
                      <Send className="w-3.5 h-3.5" /> Request Membership
                    </button>
                  )}
                  {isCurrent && (
                    <div className="text-center py-2 text-xs opacity-70">Your Current Plan</div>
                  )}
                  {hasActiveRequest && !isCurrent && (
                    <div className="text-center py-2 text-xs opacity-70">Active request pending</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {membershipRequests.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/30 p-12 text-center shadow-sm">
              <CreditCard className="w-8 h-8 text-[#57534E]/30 mx-auto mb-3" />
              <p className="text-sm font-medium text-[#1C1917]">No membership history</p>
              <p className="text-xs text-[#57534E] mt-1">Your membership requests will appear here.</p>
            </div>
          ) : (
            membershipRequests.map((req, i) => (
              <motion.div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/22 bg-white hover:border-[#A6852F]/45 transition-all shadow-sm shadow-[#A6852F]/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${req.status === 'membership_active' ? 'bg-[#16A34A]/22 text-[#16A34A] shadow-[#16A34A]/15' : req.status === 'rejected' ? 'bg-[#DC2626]/15 text-[#DC2626] shadow-[#DC2626]/15' : 'bg-[#F59E0B]/15 text-[#F59E0B] shadow-[#F59E0B]/15'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1917]">{req.membership_plan_name}</p>
                  <p className="text-[10px] text-[#57534E]">{req.request_number} · {req.duration} plan</p>
                  <p className="text-[10px] text-[#57534E]/60">{new Date(req.requested_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shadow-sm ${req.status === 'membership_active' ? 'bg-[#16A34A]/22 text-[#16A34A] shadow-[#16A34A]/15' : req.status === 'rejected' ? 'bg-[#DC2626]/15 text-[#DC2626] shadow-[#DC2626]/15' : 'bg-[#F59E0B]/15 text-[#F59E0B] shadow-[#F59E0B]/15'}`}>
                  {req.status.replace(/_/g, ' ')}
                </span>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Request Membership Modal */}
      <AnimatePresence>
        {showModal && selectedPlan && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !actionLoading && handleCloseModal()} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>

              {/* Step: Confirm */}
              {modalStep === 'confirm' && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">Confirm Request</h3>
                    <button onClick={handleCloseModal} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>

                  <div className="rounded-xl p-4 text-white overflow-hidden" style={{ background: `linear-gradient(135deg, ${TIER_COLORS[selectedPlan.name.toLowerCase()] || '#A6852F'}F5, ${TIER_COLORS[selectedPlan.name.toLowerCase()] || '#A6852F'}E8)` }}>
                    <div className="relative z-10">
                      <p className="text-[10px] uppercase tracking-widest opacity-70 mb-0.5">{selectedPlan.name} Plan</p>
                      <p className="text-2xl font-editorial">${selectedPlan.price}<span className="text-xs opacity-60">/{selectedPlan.period}</span></p>
                    </div>
                  </div>

                  <div className="bg-[#F59E0B]/8 border border-[#F59E0B]/30 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                      <div className="text-sm text-[#1C1917]">
                        <p className="font-medium mb-1">You are about to submit this request.</p>
                        <p className="text-xs text-[#57534E]">After approval you will receive payment instructions. No payment information is required at this time.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-1">
                    <button onClick={handleSubmitRequest} disabled={actionLoading}
                      className="flex-1 py-3 bg-[#A6852F] hover:bg-[#8B6F1F] text-white rounded-xl shadow-md shadow-[#A6852F]/25 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98]">
                      {actionLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {actionLoading ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button onClick={handleCloseModal} disabled={actionLoading} className="px-5 py-3 bg-[#F3F1ED] text-[#57534E] rounded-xl hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50 transition-all cursor-pointer">Cancel</button>
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
                    <p>Your <strong className="text-[#1C1917]">{selectedPlan.name}</strong> membership request has been submitted successfully.</p>
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

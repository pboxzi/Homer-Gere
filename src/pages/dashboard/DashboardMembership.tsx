import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Check, Shield, Zap, ArrowRight, Calendar, CreditCard, Clock, Star, X, Send } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useAuth } from '../../context/AuthContext';
import { membershipRequestsRepository, paymentMethodsRepository, profilesRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { DashboardSection } from '../../data/dashboardData';
import type { MembershipPlan, PaymentMethod, Profile } from '../../types/database';

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

export const DashboardMembership: React.FC<{ onNavigate?: (section: DashboardSection) => void; initialTab?: 'overview' | 'plans' | 'history' }> = ({ onNavigate, initialTab }) => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { membership, membershipPlan, membershipRequests, logActivity } = useDashboard();
  const { membershipTiers } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'history'>(initialTab || 'overview');

  // Request form state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [requestForm, setRequestForm] = useState({ preferredPaymentMethod: '', country: '', currency: 'USD', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const activeRequest = membershipRequests.find((r) => !['rejected', 'membership_active'].includes(r.status));
  const pastRequests = membershipRequests.filter((r) => r.status === 'rejected' || r.status === 'membership_active');

  const daysUntilExpiry = membership?.end_date
    ? Math.ceil((new Date(membership.end_date).getTime() - Date.now()) / 86400000)
    : null;

  useEffect(() => {
    paymentMethodsRepository.getActive().then(setPaymentMethods).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.id && profile?.country) {
      setRequestForm(f => ({ ...f, country: profile.country || '' }));
    }
  }, [user?.id, profile?.country]);

  const handleRequestMembership = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setSubmitted(false);
    setRequestForm(f => ({ ...f, preferredPaymentMethod: '', notes: '' }));
    setShowRequestModal(true);
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
        country: requestForm.country || profile.country || null,
        membership_plan_id: selectedPlan.id,
        membership_plan_name: selectedPlan.name,
        duration: selectedPlan.period || 'monthly',
        preferred_payment_method: requestForm.preferredPaymentMethod || null,
        currency: requestForm.currency || 'USD',
        notes: requestForm.notes || null,
      };
      const created = await membershipRequestsRepository.create(requestData);
      await notifyService.membershipRequestReceived(user.id, {
        fullName: requestData.full_name,
        email: requestData.email,
        planName: requestData.membership_plan_name,
        requestNumber: created.request_number,
      });
      await logActivity('create', 'membership', `Membership request submitted: ${selectedPlan.name}`, { membership_plan_id: selectedPlan.id, request_number: created.request_number });
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setActionLoading(false);
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
                      <span className="text-[#1C1917]">{typeof feature === 'string' ? feature : (feature as any).label || JSON.stringify(feature)}</span>
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
              <button onClick={() => navigate('/dashboard')} className="text-xs text-[#A6852F] font-medium mt-2 hover:text-[#8B6F1F] cursor-pointer">View Details →</button>
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
            const tierColor = TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div key={tier.id} className="rounded-2xl p-5 text-white relative overflow-hidden transition-all duration-500" style={{ background: `linear-gradient(135deg, ${tierColor}F5, ${tierColor}E8 50%, ${tierColor}D9 75%, ${tierColor}E6)`, boxShadow: `0 10px 36px ${tierColor}55, 0 0 50px ${tierColor}25, inset 0 1px 0 rgba(255,255,255,0.15)` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(25%, -25%)' }} />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(-25%, 25%)' }} />
                <div className="absolute top-1/2 left-1/2 w-full h-full opacity-5" style={{ background: `radial-gradient(circle, white, transparent)`, transform: 'translate(-50%, -50%)' }} />
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
                      {TIER_ICONS[tier.id] || <Crown className="w-4 h-4" />}
                    </div>
                  </div>
                  {/* Request Membership Button */}
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
        {showRequestModal && selectedPlan && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => !submitting && setShowRequestModal(false)} />
            <motion.div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-[#16A34A]/22 flex items-center justify-center mx-auto mb-3"><Check className="w-6 h-6 text-[#16A34A]" /></div>
                  <p className="text-sm font-medium text-[#1C1917]">Request Submitted!</p>
                  <p className="text-xs text-[#57534E] mt-1">Your membership request has been sent for review. You'll be notified once it's processed.</p>
                  <button onClick={() => { setShowRequestModal(false); setSelectedPlan(null); }} className="mt-4 px-6 py-2 bg-[#A6852F] text-white rounded-lg text-sm font-medium hover:bg-[#8B6F1F]">Close</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-editorial text-[#1C1917]">Request {selectedPlan.name}</h3>
                    <button onClick={() => setShowRequestModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-3 bg-[#F3F1ED]/50 rounded-lg text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1C1917]">{selectedPlan.name} Plan</span>
                      <span className="font-editorial text-lg text-[#A6852F]">${selectedPlan.price}<span className="text-xs opacity-60">/{selectedPlan.period}</span></span>
                    </div>
                    {selectedPlan.features && selectedPlan.features.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {selectedPlan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-[#57534E]">
                            <Check className="w-3 h-3 text-[#16A34A]" />
                            <span>{typeof f === 'string' ? f : (f as any).label || JSON.stringify(f)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1">Preferred Payment Method</label>
                    <select value={requestForm.preferredPaymentMethod} onChange={e => setRequestForm(f => ({ ...f, preferredPaymentMethod: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                      <option value="">Select method...</option>
                      {paymentMethods.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type.replace(/_/g, ' ')})</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-1">Country</label>
                      <input value={requestForm.country} onChange={e => setRequestForm(f => ({ ...f, country: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" placeholder="Your country" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1C1917] mb-1">Currency</label>
                      <select value={requestForm.currency} onChange={e => setRequestForm(f => ({ ...f, currency: e.target.value }))}
                        className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]">
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="NGN">NGN (₦)</option>
                        <option value="GHS">GHS (GH₵)</option>
                        <option value="KES">KES (KSh)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C1917] mb-1">Notes</label>
                    <textarea value={requestForm.notes} onChange={e => setRequestForm(f => ({ ...f, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-[#A6852F]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F] min-h-[80px]" placeholder="Any additional notes (optional)..." />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={handleSubmitRequest} disabled={actionLoading || submitting}
                      className="flex-1 py-2.5 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F1F] shadow-md shadow-[#A6852F]/20 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button onClick={() => setShowRequestModal(false)} disabled={submitting} className="flex-1 py-2.5 bg-[#F3F1ED] text-[#57534E] rounded-lg hover:bg-[#E8E5DF] text-sm font-medium disabled:opacity-50">Cancel</button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

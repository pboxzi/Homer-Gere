import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Check, X, Shield, Zap, ArrowRight, Calendar, CreditCard, Clock, Star } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';

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

export const DashboardMembership: React.FC = () => {
  const navigate = useNavigate();
  const { membership, membershipPlan, membershipRequests } = useDashboard();
  const { membershipTiers } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'history'>('overview');

  const activeRequest = membershipRequests.find((r) => !['rejected', 'membership_active'].includes(r.status));
  const pastRequests = membershipRequests.filter((r) => r.status === 'rejected' || r.status === 'membership_active');

  const daysUntilExpiry = membership?.end_date
    ? Math.ceil((new Date(membership.end_date).getTime() - Date.now()) / 86400000)
    : null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your membership, view benefits, and explore plans.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#A6852F]/15 pb-2">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'plans', label: 'All Plans' },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[#A6852F] text-white shadow-md shadow-[#A6852F]/25' : 'text-[#57534E] hover:bg-[#A6852F]/10'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Membership Status */}
          <motion.div className="rounded-2xl border border-[#A6852F]/30 bg-gradient-to-br from-[#A6852F]/5 to-transparent p-6 shadow-sm shadow-[#A6852F]/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/15 flex items-center justify-center text-[#A6852F] shadow-md shadow-[#A6852F]/15">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-editorial text-[#1C1917]">{membershipPlan?.name || 'Member'}</h3>
                <p className="text-xs text-[#57534E]">{membership?.status === 'active' ? 'Active Membership' : 'No Active Membership'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/60 shadow-sm shadow-[#A6852F]/5">
                <Calendar className="w-4 h-4 text-[#A6852F] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.start_date ? new Date(membership.start_date).toLocaleDateString() : '—'}</p>
                <p className="text-[10px] text-[#57534E]">Start Date</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 shadow-sm shadow-[#8B5CF6]/5">
                <Clock className="w-4 h-4 text-[#8B5CF6] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.end_date ? new Date(membership.end_date).toLocaleDateString() : '—'}</p>
                <p className="text-[10px] text-[#57534E]">Expiry Date</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 shadow-sm shadow-[#16A34A]/5">
                <CreditCard className="w-4 h-4 text-[#16A34A] mx-auto mb-1" />
                <p className="text-xs font-medium text-[#1C1917]">{membership?.auto_renew ? 'Auto' : 'Manual'}</p>
                <p className="text-[10px] text-[#57534E]">Renewal</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/60 shadow-sm shadow-[#F59E0B]/5">
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
            <motion.div className="rounded-2xl border border-[#F59E0B]/25 bg-[#F59E0B]/5 p-4 shadow-sm shadow-[#F59E0B]/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <p className="text-xs font-medium text-[#F59E0B] mb-1">Active Request</p>
              <p className="text-sm text-[#1C1917]">{activeRequest.membership_plan_name} — {activeRequest.status.replace(/_/g, ' ')}</p>
              <button onClick={() => navigate('/dashboard')} className="text-xs text-[#A6852F] font-medium mt-2 hover:text-[#8B6F1F] cursor-pointer">View Details →</button>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={() => navigate('/membership')} className="flex-1 py-3 bg-[#1C1917] text-white rounded-2xl text-sm font-medium hover:bg-[#292524] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-[#1C1917]/15">
              <Crown className="w-4 h-4" /> {membership?.status === 'active' ? 'Upgrade Plan' : 'Get Membership'}
            </button>
            <button onClick={() => navigate('/dashboard')} className="px-4 py-3 border border-[#A6852F]/25 rounded-2xl text-sm font-medium text-[#57534E] hover:bg-[#A6852F]/5 transition-all cursor-pointer shadow-sm shadow-[#A6852F]/5">
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
            const tierColor = TIER_COLORS[tier.id] || '#A6852F';
            return (
              <motion.div key={tier.id} className={`rounded-2xl border bg-white overflow-hidden transition-all duration-500 ${isCurrent ? 'border-[#A6852F]/50 shadow-lg ring-1 ring-[#A6852F]/25' : 'border-[#A6852F]/15 shadow-sm hover:shadow-md'}`} style={{ boxShadow: isCurrent ? undefined : `0 0 20px ${tierColor}10, 0 2px 10px ${tierColor}08` }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
                <div className="px-5 pt-5 pb-4" style={{ background: `linear-gradient(135deg, ${tierColor}10, transparent)` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: `${tierColor}18`, color: tierColor, boxShadow: `0 0 12px ${tierColor}12` }}>
                        {TIER_ICONS[tier.id] || <Crown className="w-4 h-4" />}
                      </div>
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase" style={{ color: tierColor }}>{tier.name}</span>
                    </div>
                    {isCurrent && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#A6852F]/15 text-[#A6852F] font-medium shadow-sm shadow-[#A6852F]/15">Current</span>}
                  </div>
                  <p className="text-xs text-[#57534E]">{tier.description}</p>
                </div>
                <div className="px-5 py-4 border-t border-[#E8E5DF]/30">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[13px] text-[#57534E]">{tier.currency === 'USD' ? '$' : tier.currency}</span>
                    <span className="text-3xl font-editorial text-[#1C1917]">{tier.price}</span>
                    <span className="text-[10px] text-[#57534E]">{tier.period}</span>
                  </div>
                </div>
                <div className="px-5 py-4 border-t border-[#E8E5DF]/30">
                  <ul className="space-y-2">
                    {(Array.isArray(tier.features) ? tier.features : []).slice(0, 4).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs">
                        <Check className="w-3 h-3 text-[#16A34A] mt-0.5 shrink-0" />
                        <span className="text-[#1C1917]">{typeof feature === 'string' ? feature : (feature as any).label || ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <button onClick={() => navigate('/membership')} className={`w-full py-3 rounded-2xl text-xs font-medium transition-all cursor-pointer ${isCurrent ? 'bg-[#A6852F]/10 text-[#A6852F] border border-[#A6852F]/30 shadow-sm shadow-[#A6852F]/10' : 'bg-[#1C1917] text-white hover:bg-[#292524] shadow-md shadow-[#1C1917]/15'}`}>
                    {isCurrent ? 'Current Plan' : 'Select Plan'}
                  </button>
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
              <motion.div key={req.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#A6852F]/15 bg-white hover:border-[#A6852F]/30 transition-all shadow-sm shadow-[#A6852F]/5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.04 }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${req.status === 'membership_active' ? 'bg-[#16A34A]/10 text-[#16A34A] shadow-[#16A34A]/10' : req.status === 'rejected' ? 'bg-[#DC2626]/10 text-[#DC2626] shadow-[#DC2626]/10' : 'bg-[#F59E0B]/10 text-[#F59E0B] shadow-[#F59E0B]/10'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1917]">{req.membership_plan_name}</p>
                  <p className="text-[10px] text-[#57534E]">{req.request_number} · {req.duration} plan</p>
                  <p className="text-[10px] text-[#57534E]/60">{new Date(req.requested_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize shadow-sm ${req.status === 'membership_active' ? 'bg-[#16A34A]/10 text-[#16A34A] shadow-[#16A34A]/10' : req.status === 'rejected' ? 'bg-[#DC2626]/10 text-[#DC2626] shadow-[#DC2626]/10' : 'bg-[#F59E0B]/10 text-[#F59E0B] shadow-[#F59E0B]/10'}`}>
                  {req.status.replace(/_/g, ' ')}
                </span>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

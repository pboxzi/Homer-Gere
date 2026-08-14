import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Crown, Check, ArrowRight, CreditCard, Hash, Calendar, Phone, Star, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useSiteContent } from '../../context/SiteContentContext';

export const DashboardMembership: React.FC = () => {
  const navigate = useNavigate();
  const { membership } = useDashboard();
  const { membershipTiers } = useSiteContent();
  const canUseWhatsApp = membership.plan === 'Gold' || membership.plan === 'Platinum';

  const PAYMENT_HISTORY: { id: string; plan: string; date: string; amount: string }[] = [];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Membership</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your membership plan and benefits.</p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div className="rounded-2xl border border-[#A6852F]/35 bg-gradient-to-br from-[#A6852F]/10 to-transparent p-6 sm:p-8 shadow-lg shadow-[#A6852F]/15 hover:shadow-xl hover:shadow-[#A6852F]/25 transition-shadow duration-500" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-[#A6852F]" />
              <span className="text-[11px] font-medium text-[#A6852F] uppercase tracking-[0.1em]">Current Plan</span>
            </div>
            <h2 className="text-3xl font-editorial text-[#1C1917]">{membership.plan}</h2>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-medium uppercase">{membership.status}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-[#57534E]" />
            <div>
              <p className="text-[10px] text-[#57534E] uppercase">Membership #</p>
              <p className="text-sm font-medium text-[#1C1917] font-mono">{membership.membershipNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#57534E]" />
            <div>
              <p className="text-[10px] text-[#57534E] uppercase">Active Since</p>
              <p className="text-sm font-medium text-[#1C1917]">{membership.activationDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#57534E]" />
            <div>
              <p className="text-[10px] text-[#57534E] uppercase">Next Renewal</p>
              <p className="text-sm font-medium text-[#1C1917]">{membership.renewalDate}</p>
            </div>
          </div>
          {canUseWhatsApp && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#25D366]" />
              <div>
                <p className="text-[10px] text-[#57534E] uppercase">WhatsApp Access</p>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#25D366] hover:underline">Message Homer</a>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/membership')} className="inline-flex items-center gap-2 text-sm font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer">
          Upgrade Plan <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Benefits */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Your Benefits</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           {membership.benefits && membership.benefits.length > 0 ? (
            membership.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#A6852F]/20 shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10 transition-all duration-500">
                <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span className="text-sm text-[#57534E]">{b}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#57534E]/60 col-span-2">No benefits yet. Upgrade your membership to unlock exclusive perks.</p>
          )}
          {canUseWhatsApp && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/5 border border-[#25D366]/20 shadow-sm hover:shadow-md transition-all duration-500">
              <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="text-sm text-[#1C1917]">Direct WhatsApp messaging</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Available Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">All Membership Plans</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {membershipTiers.map((tier, i) => {
            const isCurrent = tier.name === membership.plan;
            const isPopular = tier.isPopular;
            return (
              <motion.div
                key={tier.id}
                className={`rounded-2xl border bg-white p-5 transition-all duration-500 ${isCurrent ? 'border-[#A6852F]/40 shadow-lg shadow-[#A6852F]/15 ring-1 ring-[#A6852F]/20' : 'border-[#A6852F]/15 shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10 hover:border-[#A6852F]/30'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {tier.id === 'platinum' ? <Crown className="w-4 h-4 text-[#A6852F]" /> : <Star className={`w-4 h-4 ${isPopular ? 'text-[#A6852F] fill-[#A6852F]' : 'text-[#D1D5DB]'}`} />}
                    <span className={`text-[11px] font-medium tracking-[0.1em] uppercase ${isCurrent ? 'text-[#A6852F]' : 'text-[#57534E]'}`}>{tier.name}</span>
                  </div>
                  {isCurrent && <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#A6852F]/15 text-[#A6852F] font-medium">Current</span>}
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-editorial text-[#1C1917]">${tier.price}</span>
                  <span className="text-[10px] text-[#57534E] font-medium">{tier.period}</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {tier.features.filter((f) => f.included).slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <Check className="w-3.5 h-3.5 text-[#16A34A] mt-0.5 shrink-0" />
                      <span className="text-[#57534E]">{feature.label}</span>
                    </li>
                  ))}
                  {tier.features.filter((f) => !f.included).slice(0, 1).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <X className="w-3.5 h-3.5 text-[#D1D5DB] mt-0.5 shrink-0" />
                      <span className="text-[#A8A29E]">{feature.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/membership')}
                  className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all duration-300 cursor-pointer ${isCurrent ? 'bg-[#A6852F]/10 text-[#A6852F] border border-[#A6852F]/20' : 'bg-[#1C1917] text-white hover:bg-[#292524]'}`}
                >
                  {isCurrent ? 'Current Plan' : 'View Plan'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Payment History</h3>
        <div className="rounded-2xl border border-[#A6852F]/20 bg-white overflow-hidden shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10 transition-shadow duration-500">
          {PAYMENT_HISTORY.length > 0 ? (
            PAYMENT_HISTORY.map((p, i) => (
              <div key={p.id} className={`flex items-center gap-3 p-4 ${i < PAYMENT_HISTORY.length - 1 ? 'border-b border-[#E8E5DF]/40' : ''}`}>
                <CreditCard className="w-4 h-4 text-[#57534E]" />
                <div className="flex-1">
                  <p className="text-sm text-[#1C1917]">{p.plan}</p>
                  <p className="text-[11px] text-[#57534E]">{p.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[#1C1917]">{p.amount}</span>
                  <button className="text-[10px] text-[#A6852F] hover:text-[#8B6F1F] font-medium transition-colors cursor-pointer">Receipt</button>
                </div>
              </div>
            ))
          ) : (
            <p className="p-4 text-xs text-[#57534E]/60">No payment history yet.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

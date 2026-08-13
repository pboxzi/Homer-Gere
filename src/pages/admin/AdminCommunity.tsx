import React from 'react';
import { motion } from 'motion/react';
import { Users, Crown, CheckCircle, XCircle, Clock, Ban, Edit, Eye, Plus } from 'lucide-react';
import {
  MOCK_ADMIN_MEMBERS, MOCK_ADMIN_PLANS, MOCK_ADMIN_APPLICATIONS,
  MOCK_ADMIN_EXPERIENCES, MOCK_ADMIN_EXPERIENCE_REQUESTS,
} from '../../data/adminData';

export const AdminCommunity: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Community</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage members, membership plans, applications, and experiences.</p>
      </motion.div>

      {/* Members */}
      <Section title="Members" action={<button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Member</button>}>
        <div className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
          <span>Member</span><span>Membership</span><span>Status</span><span>Joined</span><span>Actions</span>
        </div>
        {MOCK_ADMIN_MEMBERS.map((m) => (
          <div key={m.id} className="grid grid-cols-[1fr_120px_100px_100px_80px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
            <div>
              <p className="text-sm text-[#1C1917]">{m.name}</p>
              <p className="text-[10px] text-[#57534E]">{m.email}</p>
            </div>
            <span className="text-xs text-[#57534E]">{m.membership}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${
              m.status === 'active' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
              m.status === 'suspended' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
              'bg-[#F59E0B]/10 text-[#F59E0B]'
            }`}>{m.status}</span>
            <span className="text-xs text-[#57534E]">{m.lastActive}</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Ban className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </Section>

      {/* Plans */}
      <Section title="Membership Plans" action={<button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Plan</button>}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_ADMIN_PLANS.map((plan) => (
            <div key={plan.id} className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">{plan.name}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  plan.status === 'active' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                }`}>{plan.status}</span>
              </div>
              <p className="text-2xl font-editorial text-[#1C1917]">${plan.price}<span className="text-xs text-[#57534E] font-body">/{plan.period}</span></p>
              <p className="text-[11px] text-[#57534E] mt-1">{plan.members} members</p>
              <div className="flex items-center gap-1 mt-3">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Applications */}
      <Section title="Applications" action={<span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] font-medium">{MOCK_ADMIN_APPLICATIONS.filter((a) => a.status === 'pending').length} pending</span>}>
        <div className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]">
          <span>Applicant</span><span>Plan</span><span>Date</span><span>Status</span><span>Actions</span>
        </div>
        {MOCK_ADMIN_APPLICATIONS.map((a) => (
          <div key={a.id} className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors">
            <div>
              <p className="text-sm text-[#1C1917]">{a.name}</p>
              <p className="text-[10px] text-[#57534E]">{a.email}</p>
            </div>
            <span className="text-xs text-[#57534E]">{a.plan}</span>
            <span className="text-xs text-[#57534E]">{a.date}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit ${
              a.status === 'approved' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
              a.status === 'declined' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
              'bg-[#F59E0B]/10 text-[#F59E0B]'
            }`}>{a.status}</span>
            <div className="flex items-center gap-1">
              {a.status === 'pending' && (
                <>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#16A34A] hover:bg-[#16A34A]/10 transition-colors cursor-pointer"><CheckCircle className="w-3.5 h-3.5" /></button>
                  <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#DC2626] hover:bg-[#DC2626]/10 transition-colors cursor-pointer"><XCircle className="w-3.5 h-3.5" /></button>
                </>
              )}
            </div>
          </div>
        ))}
      </Section>

      {/* Experiences */}
      <Section title="Experiences" action={<button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A6852F] hover:text-[#8B6F1F] transition-colors cursor-pointer"><Plus className="w-3.5 h-3.5" /> Add Experience</button>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_ADMIN_EXPERIENCES.map((exp) => (
            <div key={exp.id} className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#1C1917]">{exp.title}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  exp.availability === 'available' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                  exp.availability === 'limited' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                  'bg-[#DC2626]/10 text-[#DC2626]'
                }`}>{exp.availability}</span>
              </div>
              <p className="text-xs text-[#57534E]">{exp.price} — {exp.requests} requests</p>
              <div className="flex items-center gap-1 mt-3">
                <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] hover:text-[#1C1917] transition-colors cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ title, action, children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-[#1C1917]">{title}</h3>
      {action}
    </div>
    {children}
  </motion.div>
);

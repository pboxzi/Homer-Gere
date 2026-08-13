import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Settings, Globe, Palette, Mail, Shield, Database, Plug,
  Save, Eye, EyeOff, CheckCircle, AlertTriangle,
} from 'lucide-react';

export const AdminSystem: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">System</h1>
        <p className="text-sm text-[#57534E] mt-1">Website settings, branding, security, backups, and integrations.</p>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Website Settings', desc: 'Site name, URL, maintenance mode', icon: Globe, color: '#A6852F' },
          { title: 'Branding', desc: 'Logo, colors, fonts, favicon', icon: Palette, color: '#8B5CF6' },
          { title: 'Communication Settings', desc: 'Email, WhatsApp, Telegram config', icon: Mail, color: '#3B82F6' },
          { title: 'Email Templates', desc: 'Welcome, reset, notifications', icon: Mail, color: '#EC4899' },
          { title: 'Security', desc: 'MFA, rate limiting, CAPTCHA', icon: Shield, color: '#16A34A' },
          { title: 'Backup & Restore', desc: 'Auto backups, manual restore', icon: Database, color: '#F59E0B' },
          { title: 'Integrations', desc: 'Google, analytics, third-party', icon: Plug, color: '#6366F1' },
        ].map((item, i) => (
          <motion.button
            key={item.title}
            className="text-left p-5 rounded-2xl border border-[#E8E5DF]/60 bg-white hover:border-[#A6852F]/20 hover:bg-[#A6852F]/5 transition-all cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-500 group-hover:scale-110" style={{ backgroundColor: `${item.color}12`, color: item.color }}>
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-medium text-[#1C1917] group-hover:text-[#A6852F] transition-colors">{item.title}</h3>
            <p className="text-[11px] text-[#57534E] mt-0.5">{item.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick Settings */}
      <motion.div
        className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Quick Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Maintenance Mode</p>
              <p className="text-[11px] text-[#57534E]">Temporarily disable public access</p>
            </div>
            <Toggle />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Registration</p>
              <p className="text-[11px] text-[#57534E]">Allow new member registrations</p>
            </div>
            <Toggle defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Email Verification</p>
              <p className="text-[11px] text-[#57534E]">Require email verification for new accounts</p>
            </div>
            <Toggle defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* Backup Status */}
      <motion.div
        className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h3 className="text-sm font-medium text-[#1C1917] mb-4">Backup Status</h3>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16A34A]/5">
          <CheckCircle className="w-4 h-4 text-[#16A34A]" />
          <div>
            <p className="text-sm text-[#1C1917]">Last backup: Today, 3:00 AM</p>
            <p className="text-[11px] text-[#57534E]">Automatic daily backups are active</p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 p-3 rounded-xl bg-[#F59E0B]/5">
          <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          <div>
            <p className="text-sm text-[#1C1917]">Next scheduled backup: Tomorrow, 3:00 AM</p>
            <p className="text-[11px] text-[#57534E]">7-day retention policy</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Toggle: React.FC<{ defaultChecked?: boolean }> = ({ defaultChecked = false }) => {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className="relative cursor-pointer">
      <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${on ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${on ? 'translate-x-5' : ''}`} />
    </button>
  );
};

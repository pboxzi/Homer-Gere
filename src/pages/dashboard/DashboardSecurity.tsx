import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Monitor, Smartphone, Laptop, LogOut, Lock, Eye, EyeOff } from 'lucide-react';
import { MOCK_SESSIONS } from '../../data/dashboardData';

export const DashboardSecurity: React.FC = () => {
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) return Smartphone;
    if (device.includes('iPad') || device.includes('Tablet')) return Laptop;
    return Monitor;
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Security</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your account security and active sessions.</p>
      </motion.div>

      {/* Change Password */}
      <motion.div
        className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#57534E]" />
            Change Password
          </h3>
          <button onClick={() => setShowChangePw(!showChangePw)} className="text-xs text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">
            {showChangePw ? 'Cancel' : 'Change'}
          </button>
        </div>
        {showChangePw && (
          <div className="space-y-3">
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" placeholder="Current password" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" placeholder="New password" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer">
              Update Password
            </button>
          </div>
        )}
      </motion.div>

      {/* Two-Factor */}
      <motion.div
        className="rounded-2xl border border-[#E8E5DF]/60 bg-white p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#57534E]" />
              Two-Factor Authentication
            </h3>
            <p className="text-xs text-[#57534E] mt-1">Add an extra layer of security to your account.</p>
          </div>
          <button className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#A6852F]/10 text-[#A6852F] hover:bg-[#A6852F]/20 transition-colors cursor-pointer">
            Enable
          </button>
        </div>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917]">Active Sessions</h3>
          <button className="text-xs text-[#DC2626] font-medium hover:text-[#B91C1C] transition-colors cursor-pointer flex items-center gap-1">
            <LogOut className="w-3 h-3" />
            Sign out all devices
          </button>
        </div>
        <div className="space-y-3">
          {MOCK_SESSIONS.map((s, i) => {
            const DeviceIcon = getDeviceIcon(s.device);
            return (
              <motion.div
                key={s.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E5DF]/60 bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.current ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#F3F1ED] text-[#57534E]'}`}>
                  <DeviceIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[#1C1917]">{s.device}</p>
                    {s.current && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] font-medium">Current</span>}
                  </div>
                  <p className="text-xs text-[#57534E]">{s.browser} — {s.location}</p>
                  <p className="text-[10px] text-[#57534E]/60 mt-0.5">Last active: {s.lastActive}</p>
                </div>
                {!s.current && (
                  <button className="text-xs text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors cursor-pointer">
                    Revoke
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

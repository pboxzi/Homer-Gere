import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Shield, Monitor, Smartphone, Laptop, Lock, Eye, EyeOff, Check, Clock } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { supabase } from '../../lib/supabase';

export const DashboardSecurity: React.FC = () => {
  const { changePassword } = useDashboard();
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  // Login history from audit logs
  const [loginHistory, setLoginHistory] = useState<Array<{ id: string; ip_address: string | null; user_agent: string | null; created_at: string }>>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadLoginHistory = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('audit_logs')
        .select('id, ip_address, user_agent, created_at')
        .eq('user_id', user.id)
        .eq('action', 'login')
        .order('created_at', { ascending: false })
        .limit(10);
      setLoginHistory(data || []);
    } catch { /* silent */ }
    setLoadingHistory(false);
  }, []);

  useEffect(() => { loadLoginHistory(); }, [loadLoginHistory]);

  const getDeviceIcon = (ua: string | null) => {
    if (!ua) return Monitor;
    if (ua.includes('iPhone') || ua.includes('Android')) return Smartphone;
    if (ua.includes('iPad') || ua.includes('Tablet')) return Laptop;
    return Monitor;
  };

  const parseUA = (ua: string | null) => {
    if (!ua) return { device: 'Unknown Device', browser: 'Unknown Browser' };
    const browser = ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Other';
    const device = ua.includes('iPhone') ? 'iPhone' : ua.includes('Android') ? 'Android' : ua.includes('iPad') ? 'iPad' : ua.includes('Mac') ? 'Mac' : ua.includes('Windows') ? 'Windows' : 'Unknown';
    return { device, browser };
  };

  const handlePasswordChange = async () => {
    setPwError('');
    if (!currentPw || !newPw) { setPwError('Please fill in all fields.'); return; }
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    const result = await changePassword(currentPw, newPw);
    if (result.success) {
      setPwSaved(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => { setPwSaved(false); setShowChangePw(false); }, 2000);
    } else {
      setPwError(result.error || 'Password change failed.');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Security</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your account security and view login history.</p>
      </motion.div>

      {/* Change Password */}
      <motion.div className="rounded-2xl border border-[#A6852F]/45 bg-white p-5 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2"><Lock className="w-4 h-4 text-[#57534E]" /> Change Password</h3>
          <button onClick={() => { setShowChangePw(!showChangePw); setPwError(''); }} className="text-xs text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">{showChangePw ? 'Cancel' : 'Change'}</button>
        </div>
        {showChangePw && (
          <div className="space-y-3">
            <div className="relative">
              <input type={showCurrent ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" placeholder="Current password" />
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer">{showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <div className="relative">
              <input type={showNew ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} className="w-full px-4 py-3 pr-11 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" placeholder="New password" />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#57534E] hover:text-[#1C1917] cursor-pointer">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#F3F1ED]/60 text-sm text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30" placeholder="Confirm new password" />
            {pwError && <p className="text-xs text-[#DC2626]">{pwError}</p>}
            {pwSaved && <p className="text-xs text-[#16A34A] font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Password updated!</p>}
            <button onClick={handlePasswordChange} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium px-5 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer">Update Password</button>
          </div>
        )}
      </motion.div>

      {/* Email Verification */}
      <motion.div className="rounded-2xl border border-[#A6852F]/45 bg-white p-5 shadow-sm" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2"><Shield className="w-4 h-4 text-[#57534E]" /> Two-Factor Authentication</h3>
            <p className="text-xs text-[#57534E] mt-1">Add an extra layer of security to your account.</p>
          </div>
          <span className="text-xs font-medium px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed">
            Coming Soon
          </span>
        </div>
      </motion.div>

      {/* Login History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2"><Clock className="w-4 h-4 text-[#57534E]" /> Login History</h3>
          <button onClick={loadLoginHistory} className="text-xs text-[#A6852F] font-medium hover:text-[#8B6F1F] transition-colors cursor-pointer">Refresh</button>
        </div>
        {loadingHistory ? (
          <div className="text-center py-8 text-[#57534E] text-sm">Loading...</div>
        ) : loginHistory.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E8E5DF] bg-[#F3F1ED]/45 p-8 text-center">
            <Clock className="w-6 h-6 text-[#57534E]/30 mx-auto mb-2" />
            <p className="text-sm text-[#57534E]">No login history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {loginHistory.map((login, i) => {
              const ua = parseUA(login.user_agent);
              const DeviceIcon = getDeviceIcon(login.user_agent);
              return (
                <motion.div key={login.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#A6852F]/22 bg-white hover:border-[#A6852F]/38 transition-all shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                  <div className="w-9 h-9 rounded-lg bg-[#16A34A]/22 flex items-center justify-center text-[#16A34A]">
                    <DeviceIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1C1917]">{ua.device} · {ua.browser}</p>
                    <p className="text-[10px] text-[#57534E]/60">{login.ip_address || 'Unknown IP'} · {new Date(login.created_at).toLocaleString()}</p>
                  </div>
                  {i === 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#16A34A]/22 text-[#16A34A] font-medium">Latest</span>}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

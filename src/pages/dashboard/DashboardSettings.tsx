import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Globe, Clock, Shield } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const DashboardSettings: React.FC = () => {
  const { profile, updateProfile } = useDashboard();
  const [profileVisibility, setProfileVisibility] = useState(profile.profileVisibility);
  const [onlineStatus, setOnlineStatus] = useState(profile.showOnlineStatus);
  const [messageRequests, setMessageRequests] = useState(profile.allowMessageRequests);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({
      profileVisibility,
      showOnlineStatus: onlineStatus,
      allowMessageRequests: messageRequests,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Settings</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      {/* Privacy */}
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <h3 className="text-sm font-medium text-[#1C1917]">Privacy</h3>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white divide-y divide-[#E8E5DF]/40">
          <ToggleRow icon={<Shield className="w-4 h-4" />} label="Profile visibility" subtext={profileVisibility === 'members' ? 'Visible to members only' : 'Visible to everyone'} checked={profileVisibility === 'members'} onChange={(v) => setProfileVisibility(v ? 'members' : 'public')} />
          <ToggleRow icon={<Globe className="w-4 h-4" />} label="Show online status" subtext="Allow others to see when you're online" checked={onlineStatus} onChange={setOnlineStatus} />
          <ToggleRow icon={<Clock className="w-4 h-4" />} label="Allow message requests" subtext="Receive messages from other members" checked={messageRequests} onChange={setMessageRequests} />
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer">
          <Save className="w-4 h-4" /> Save Settings
        </button>
        {saved && <span className="text-xs text-[#16A34A] font-medium">Saved!</span>}
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{ icon: React.ReactNode; label: string; subtext?: string; checked: boolean; onChange: (v: boolean) => void }> = ({ icon, label, subtext, checked, onChange }) => (
  <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#A6852F]/20 shadow-sm shadow-[#A6852F]/5 hover:shadow-md hover:shadow-[#A6852F]/10 transition-all duration-500 cursor-pointer">
    <div className="text-[#57534E] group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <div className="flex-1">
      <span className="text-sm text-[#57534E]">{label}</span>
      {subtext && <p className="text-[10px] text-[#57534E]/60 mt-0.5">{subtext}</p>}
    </div>
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-[#A6852F] shadow-sm' : 'bg-[#E8E5DF]'}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </div>
  </label>
);

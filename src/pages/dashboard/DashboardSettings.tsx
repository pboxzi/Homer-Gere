import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Globe, Clock, Bell, Mail, Smartphone } from 'lucide-react';
import { MOCK_MEMBER } from '../../data/dashboardData';
import { LANGUAGES, TIMEZONES } from '../../data/registerData';

export const DashboardSettings: React.FC = () => {
  const [language, setLanguage] = useState(MOCK_MEMBER.language);
  const [timezone, setTimezone] = useState(MOCK_MEMBER.timezone);
  const [emailNotif, setEmailNotif] = useState(MOCK_MEMBER.emailNotifications);
  const [smsNotif, setSmsNotif] = useState(MOCK_MEMBER.smsNotifications);
  const [marketing, setMarketing] = useState(MOCK_MEMBER.marketingPreferences);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">Settings</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      {/* Preferences */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h3 className="text-sm font-medium text-[#1C1917]">Preferences</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5">
              <Globe className="w-3 h-3" /> Language
            </label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 appearance-none">
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2 flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> Timezone
            </label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 appearance-none">
              {TIMEZONES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-sm font-medium text-[#1C1917]">Notification Preferences</h3>
        <div className="space-y-3">
          <ToggleRow icon={<Mail className="w-4 h-4" />} label="Email notifications" checked={emailNotif} onChange={setEmailNotif} />
          <ToggleRow icon={<Smartphone className="w-4 h-4" />} label="SMS notifications" checked={smsNotif} onChange={setSmsNotif} />
          <ToggleRow icon={<Bell className="w-4 h-4" />} label="Marketing emails" checked={marketing} onChange={setMarketing} />
        </div>
      </motion.div>

      {/* Privacy */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-sm font-medium text-[#1C1917]">Privacy</h3>
        <div className="rounded-2xl border border-[#E8E5DF]/60 bg-white divide-y divide-[#E8E5DF]/40">
          <SettingRow label="Profile visibility" value="Members only" />
          <SettingRow label="Show online status" value="On" />
          <SettingRow label="Allow message requests" value="On" />
        </div>
      </motion.div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        {saved && <span className="text-xs text-[#16A34A] font-medium">Saved!</span>}
      </div>
    </div>
  );
};

const ToggleRow: React.FC<{ icon: React.ReactNode; label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ icon, label, checked, onChange }) => (
  <label className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E5DF]/60 cursor-pointer">
    <div className="text-[#57534E]">{icon}</div>
    <span className="flex-1 text-sm text-[#57534E]">{label}</span>
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${checked ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
    </div>
  </label>
);

const SettingRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between px-4 py-3">
    <span className="text-sm text-[#57534E]">{label}</span>
    <span className="text-sm text-[#1C1917] font-medium">{value}</span>
  </div>
);

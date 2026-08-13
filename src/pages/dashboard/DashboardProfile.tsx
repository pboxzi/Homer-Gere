import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Save } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { COUNTRIES, LANGUAGES, TIMEZONES } from '../../data/registerData';

export const DashboardProfile: React.FC = () => {
  const { profile, updateProfile } = useDashboard();
  const [formData, setFormData] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Profile</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your personal information and preferences.</p>
      </motion.div>

      <motion.div className="flex items-center gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-2xl font-editorial">
            {formData.firstName[0]}{formData.lastName[0]}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1C1917]">{formData.firstName} {formData.lastName}</p>
          <p className="text-xs text-[#57534E]">Member since {formData.memberSince}</p>
        </div>
      </motion.div>

      <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" value={formData.firstName} onChange={(v) => update('firstName', v)} />
          <Field label="Last Name" value={formData.lastName} onChange={(v) => update('lastName', v)} />
        </div>
        <Field label="Username" value={formData.username} onChange={(v) => update('username', v)} />
        <Field label="Email" value={formData.email} type="email" onChange={(v) => update('email', v)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" value={formData.phone} onChange={(v) => update('phone', v)} />
          <SelectField label="Country" value={formData.country} options={COUNTRIES} onChange={(v) => update('country', v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Language" value={formData.language} options={LANGUAGES} onChange={(v) => update('language', v)} />
          <SelectField label="Timezone" value={formData.timezone} options={TIMEZONES} onChange={(v) => update('timezone', v)} />
        </div>

        <div className="pt-2">
          <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-3">Notification Preferences</p>
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.emailNotifications} onChange={(e) => update('emailNotifications', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] accent-[#A6852F]" />
              <span className="text-sm text-[#57534E]">Email notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.smsNotifications} onChange={(e) => update('smsNotifications', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] accent-[#A6852F]" />
              <span className="text-sm text-[#57534E]">SMS notifications</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.marketingPreferences} onChange={(e) => update('marketingPreferences', e.target.checked)} className="w-4 h-4 rounded border-[#E8E5DF] text-[#A6852F] accent-[#A6852F]" />
              <span className="text-sm text-[#57534E]">Marketing emails</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer">
            <Save className="w-4 h-4" /> Save Changes
          </button>
          {saved && <span className="text-xs text-[#16A34A] font-medium">Saved!</span>}
        </div>
      </motion.div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; type?: string; onChange: (v: string) => void }> = ({ label, value, type = 'text', onChange }) => (
  <div>
    <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300" />
  </div>
);

const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void }> = ({ label, value, options, onChange }) => (
  <div>
    <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-[#E8E5DF]/60 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 transition-all duration-300 appearance-none">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

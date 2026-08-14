import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, Save, Clock } from 'lucide-react';
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

      {/* Avatar + Meta */}
      <motion.div className="flex items-center gap-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] text-2xl font-editorial overflow-hidden">
            {formData.avatar ? <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" loading="lazy" /> : <>{formData.firstName[0]}{formData.lastName[0]}</>}
          </div>
          <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { update('avatar', ev.target?.result as string); }; reader.readAsDataURL(file); } }} className="hidden" id="avatar-upload" />
          <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer">
            <Camera className="w-3.5 h-3.5" />
          </label>
        </div>
        <div>
          <p className="text-sm font-medium text-[#1C1917]">{formData.firstName} {formData.lastName}</p>
          <p className="text-xs text-[#57534E]">Member since {formData.memberSince}</p>
          <div className="flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-[#57534E]/50" />
            <p className="text-[10px] text-[#57534E]/60">Last login: {profile.lastLogin}</p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
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
        <Field label="Date of Birth" value={formData.dateOfBirth} type="date" onChange={(v) => update('dateOfBirth', v)} />

        {/* Save */}
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

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Save, Clock, User, Phone, MapPin, Globe, Check } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { COUNTRIES, LANGUAGES, TIMEZONES } from '../../data/registerData';
import { supabase } from '../../lib/supabase';

export const DashboardProfile: React.FC = () => {
  const { profile, profileLoading, updateProfile } = useDashboard();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    country: '',
    biography: '',
    city: '',
    state: '',
    timezone: '',
    preferred_language: '',
  });
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        country: profile.country || '',
        biography: profile.biography || '',
        city: profile.city || '',
        state: profile.state || '',
        timezone: profile.timezone || '',
        preferred_language: profile.preferred_language || '',
      });
    }
  }, [profile]);

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    // Preview locally
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Upload to Supabase Storage
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `avatars/${profile.id}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      if (urlData?.publicUrl) {
        await updateProfile({ avatar_url: urlData.publicUrl });
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
    }
  };

  const handleSave = async () => {
    await updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Profile completion
  const fields = [formData.first_name, formData.last_name, profile?.email, formData.phone, formData.country];
  const filled = fields.filter((f) => f && f.trim() !== '').length;
  const completionPct = Math.round((filled / fields.length) * 100);

  if (profileLoading) {
    return <div className="text-center py-12 text-[#57534E]">Loading profile...</div>;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">My Profile</h1>
        <p className="text-sm text-[#57534E] mt-1">Manage your personal information and preferences.</p>
      </motion.div>

      {/* Profile Completion */}
      <motion.div className="rounded-2xl border border-[#A6852F]/55 bg-gradient-to-r from-[#A6852F]/5 to-transparent p-4 shadow-lg shadow-[#A6852F]/22" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium text-[#1C1917]">Profile Completion</p>
          <span className="text-[10px] font-bold text-[#A6852F]">{completionPct}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#E8E5DF] rounded-full overflow-hidden">
          <motion.div className="h-full bg-[#A6852F] rounded-full" initial={{ width: 0 }} animate={{ width: `${completionPct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
      </motion.div>

      {/* Avatar + Cover */}
      <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#A6852F]/22 flex items-center justify-center text-[#A6852F] text-2xl font-editorial overflow-hidden shadow-lg shadow-[#A6852F]/22">
              {avatarPreview || profile?.avatar_url ? (
                <img src={avatarPreview || profile?.avatar_url || ''} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>{formData.first_name[0]}{formData.last_name[0]}</>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" id="avatar-upload" />
            <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-[#1C1917] text-white flex items-center justify-center hover:bg-[#292524] transition-colors cursor-pointer shadow-md shadow-[#A6852F]/22">
              <Camera className="w-3.5 h-3.5" />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1C1917]">{formData.first_name} {formData.last_name}</p>
            <p className="text-xs text-[#57534E]">{profile?.email}</p>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-[#57534E]/50" />
              <p className="text-[10px] text-[#57534E]/60">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div className="space-y-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h3 className="text-sm font-medium text-[#1C1917] flex items-center gap-2"><User className="w-4 h-4 text-[#57534E]" /> Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" value={formData.first_name} onChange={(v) => update('first_name', v)} icon={<User className="w-4 h-4" />} />
          <Field label="Last Name" value={formData.last_name} onChange={(v) => update('last_name', v)} icon={<User className="w-4 h-4" />} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" value={formData.phone} onChange={(v) => update('phone', v)} icon={<Phone className="w-4 h-4" />} />
          <SelectField label="Country" value={formData.country} options={COUNTRIES} onChange={(v) => update('country', v)} icon={<MapPin className="w-4 h-4" />} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField label="Timezone" value={formData.timezone} options={['', ...TIMEZONES]} onChange={(v) => update('timezone', v)} icon={<Globe className="w-4 h-4" />} />
          <SelectField label="Language" value={formData.preferred_language} options={['', ...LANGUAGES]} onChange={(v) => update('preferred_language', v)} icon={<Globe className="w-4 h-4" />} />
        </div>
        <Field label="City" value={formData.city} onChange={(v) => update('city', v)} icon={<MapPin className="w-4 h-4" />} />
        <div>
          <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Biography</label>
          <textarea value={formData.biography} onChange={(e) => update('biography', e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl bg-white border border-[#A6852F]/45 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 resize-none shadow-md shadow-[#A6852F]/18" placeholder="Tell us about yourself..." />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="inline-flex items-center gap-2 bg-[#A6852F] hover:bg-[#8B6F1F] active:scale-95 text-white font-medium text-sm px-6 py-2.5 rounded-2xl transition-all duration-300 cursor-pointer shadow-lg shadow-[#A6852F]/38">
            <Save className="w-4 h-4" /> Save Changes
          </button>
          {saved && <span className="text-xs text-[#16A34A] font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Saved!</span>}
        </div>
      </motion.div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: string; type?: string; onChange: (v: string) => void; icon?: React.ReactNode }> = ({ label, value, type = 'text', onChange, icon }) => (
  <div>
    <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]/40">{icon}</div>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full py-3 rounded-xl bg-white border border-[#A6852F]/38 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 shadow-sm shadow-[#A6852F]/18 ${icon ? 'pl-10 pr-4' : 'px-4'}`} />
    </div>
  </div>
);

const SelectField: React.FC<{ label: string; value: string; options: string[]; onChange: (v: string) => void; icon?: React.ReactNode }> = ({ label, value, options, onChange, icon }) => (
  <div>
    <label className="block text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#57534E]/40">{icon}</div>}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`w-full py-3 rounded-xl bg-white border border-[#A6852F]/38 text-sm text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#A6852F]/30 shadow-sm shadow-[#A6852F]/18 appearance-none ${icon ? 'pl-10 pr-4' : 'px-4'}`}>
        {options.map((o) => <option key={o} value={o}>{o || `Select ${label}`}</option>)}
      </select>
    </div>
  </div>
);

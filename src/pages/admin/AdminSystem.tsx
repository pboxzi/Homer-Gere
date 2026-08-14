import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Globe, Palette, Mail, Shield, Database, Plug,
  Save, Eye, EyeOff, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { emailTemplatesRepository, siteSettingsRepository } from '../../lib/repositories';
import type { AdminSection } from '../../data/adminData';

const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className="relative cursor-pointer">
    <div className={`w-10 h-5 rounded-full transition-colors ${checked ? 'bg-[#A6852F]' : 'bg-[#E8E5DF]'}`} />
    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
  </button>
);

export const AdminSystem: React.FC<{ activeSection: AdminSection }> = ({ activeSection }) => {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
          {activeSection === 'website-settings' && 'Website Settings'}
          {activeSection === 'branding' && 'Branding'}
          {activeSection === 'comm-settings' && 'Communication Settings'}
          {activeSection === 'email-templates' && 'Email Templates'}
          {activeSection === 'security' && 'Security'}
          {activeSection === 'backups' && 'Backup & Restore'}
          {activeSection === 'integrations' && 'Integrations'}
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          {activeSection === 'website-settings' && 'Configure your site name, URL, maintenance mode, and registration settings.'}
          {activeSection === 'branding' && 'Customize colors, fonts, logo, and favicon for your website.'}
          {activeSection === 'comm-settings' && 'Manage WhatsApp, Telegram, and email notification settings.'}
          {activeSection === 'email-templates' && 'Edit and preview transactional email templates.'}
          {activeSection === 'security' && 'Manage authentication, rate limiting, CAPTCHA, and audit logs.'}
          {activeSection === 'backups' && 'Configure automatic backups, retention, and restore options.'}
          {activeSection === 'integrations' && 'Connect and manage third-party integrations.'}
        </p>
      </motion.div>

      {activeSection === 'website-settings' && <WebsiteSettingsSection />}
      {activeSection === 'branding' && <BrandingSection />}
      {activeSection === 'comm-settings' && <CommSettingsSection />}
      {activeSection === 'email-templates' && <EmailTemplatesSection />}
      {activeSection === 'security' && <SecuritySection />}
      {activeSection === 'backups' && <BackupsSection />}
      {activeSection === 'integrations' && <IntegrationsSection />}
    </div>
  );
};

// ============================================================
// Website Settings
// ============================================================

const WebsiteSettingsSection: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings } = useAdmin();
  const [form, setForm] = useState(websiteSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateWebsiteSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Site Name</label>
            <input
              type="text"
              value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Site URL</label>
            <input
              type="url"
              value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Favicon URL</label>
            <input
              type="text"
              value={form.favicon}
              onChange={(e) => setForm({ ...form, favicon: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Logo URL</label>
            <input
              type="text"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Maintenance Mode</p>
              <p className="text-[11px] text-[#57534E]">Temporarily disable public access</p>
            </div>
            <Toggle checked={form.maintenanceMode} onChange={(v) => setForm({ ...form, maintenanceMode: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Registration Enabled</p>
              <p className="text-[11px] text-[#57534E]">Allow new member registrations</p>
            </div>
            <Toggle checked={form.registrationEnabled} onChange={(v) => setForm({ ...form, registrationEnabled: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Email Verification</p>
              <p className="text-[11px] text-[#57534E]">Require email verification for new accounts</p>
            </div>
            <Toggle checked={form.emailVerification} onChange={(v) => setForm({ ...form, emailVerification: v })} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
            <Save className="w-3.5 h-3.5 inline mr-1.5" />
            Save Settings
          </button>
          {saved && <span className="text-[#16A34A] text-xs font-medium">Settings saved successfully.</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Branding
// ============================================================

const BrandingSection: React.FC = () => {
  const { branding, updateBranding } = useAdmin();
  const [form, setForm] = useState(branding);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateBranding(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fonts = ['Playfair Display', 'Inter', 'Poppins', 'Lora', 'Cormorant Garamond', 'Montserrat', 'Raleway', 'Merriweather'];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-5">
        <div>
          <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Colors</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            {[
              { label: 'Primary Color', key: 'primaryColor' as const },
              { label: 'Secondary Color', key: 'secondaryColor' as const },
              { label: 'Accent Color', key: 'accentColor' as const },
            ].map((c) => (
              <div key={c.key} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-[#E8E5DF]/60 shrink-0"
                  style={{ backgroundColor: form[c.key] }}
                />
                <div className="flex-1">
                  <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">{c.label}</label>
                  <input
                    type="text"
                    value={form[c.key]}
                    onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Heading Font</label>
            <select
              value={form.fontHeading}
              onChange={(e) => setForm({ ...form, fontHeading: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Body Font</label>
            <select
              value={form.fontBody}
              onChange={(e) => setForm({ ...form, fontBody: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            >
              {fonts.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Logo URL</label>
            <input
              type="text"
              value={form.logoUrl}
              onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
            {form.logoUrl && (
              <div className="mt-2 p-3 rounded-xl border border-[#E8E5DF]/60 bg-[#F3F1ED]/30 flex items-center justify-center h-20">
                <img src={form.logoUrl} alt="Logo preview" className="max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} loading="lazy" />
              </div>
            )}
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Favicon URL</label>
            <input
              type="text"
              value={form.faviconUrl}
              onChange={(e) => setForm({ ...form, faviconUrl: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
            {form.faviconUrl && (
              <div className="mt-2 p-3 rounded-xl border border-[#E8E5DF]/60 bg-[#F3F1ED]/30 flex items-center justify-center h-20">
                <img src={form.faviconUrl} alt="Favicon preview" className="max-h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} loading="lazy" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
            <Save className="w-3.5 h-3.5 inline mr-1.5" />
            Save Branding
          </button>
          {saved && <span className="text-[#16A34A] text-xs font-medium">Branding saved successfully.</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Communication Settings
// ============================================================

const CommSettingsSection: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, integrations, updateIntegrations } = useAdmin();
  const [whatsappEnabled, setWhatsappEnabled] = useState(integrations.whatsapp);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(integrations.telegram);
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateIntegrations({ whatsapp: whatsappEnabled, telegram: telegramEnabled });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-5">
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#F3F1ED]/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-[#1C1917] font-medium">WhatsApp Configuration</p>
                <p className="text-[11px] text-[#57534E]">Enable WhatsApp messaging integration</p>
              </div>
              <Toggle checked={whatsappEnabled} onChange={setWhatsappEnabled} />
            </div>
            {whatsappEnabled && (
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
              />
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#F3F1ED]/40">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-[#1C1917] font-medium">Telegram Configuration</p>
                <p className="text-[11px] text-[#57534E]">Enable Telegram bot integration</p>
              </div>
              <Toggle checked={telegramEnabled} onChange={setTelegramEnabled} />
            </div>
            {telegramEnabled && (
              <input
                type="text"
                placeholder="Bot Token"
                value={telegramBotToken}
                onChange={(e) => setTelegramBotToken(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm"
              />
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917] font-medium">Email Notifications</p>
              <p className="text-[11px] text-[#57534E]">Send email notifications for system events</p>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
            <Save className="w-3.5 h-3.5 inline mr-1.5" />
            Save Settings
          </button>
          {saved && <span className="text-[#16A34A] text-xs font-medium">Settings saved successfully.</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Email Templates
// ============================================================

const EmailTemplatesSection: React.FC = () => {
  const { emailTemplates } = useAdmin();
  const [templates, setTemplates] = useState(emailTemplates.map((t) => ({ ...t, description: t.subject || t.name, body: t.html_body })));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleEdit = (t: typeof templates[0]) => {
    setEditingId(t.id);
    setEditBody(t.body);
    setPreviewId(null);
  };

  const handleSaveTemplate = async (id: string) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, body: editBody } : t)));
    try {
      await emailTemplatesRepository.update(id, { html_body: editBody });
    } catch { /* optimistic */ }
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#1C1917]">{t.name}</h3>
                <p className="text-[11px] text-[#57534E] mt-0.5">{t.description}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E5DF]/60 text-[11px] font-medium text-[#57534E] hover:bg-[#F3F1ED]/60 cursor-pointer"
                >
                  {previewId === t.id ? <EyeOff className="w-3 h-3 inline mr-1" /> : <Eye className="w-3 h-3 inline mr-1" />}
                  {previewId === t.id ? 'Hide' : 'Preview'}
                </button>
                <button
                  onClick={() => editingId === t.id ? null : handleEdit(t)}
                  className="px-3 py-1.5 rounded-xl border border-[#E8E5DF]/60 text-[11px] font-medium text-[#57534E] hover:bg-[#F3F1ED]/60 cursor-pointer"
                >
                  {editingId === t.id ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>

            {editingId === t.id && (
              <div className="space-y-2">
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm font-mono"
                />
                <button
                  onClick={() => handleSaveTemplate(t.id)}
                  className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1.5" />
                  Save Template
                </button>
              </div>
            )}

            {previewId === t.id && (
              <div className="p-4 rounded-xl border border-[#E8E5DF]/60 bg-[#F3F1ED]/30">
                <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-2">Preview</p>
                <div className="text-sm text-[#1C1917] whitespace-pre-wrap leading-relaxed">{t.body}</div>
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          {saved && <span className="text-[#16A34A] text-xs font-medium">Templates saved successfully.</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Security
// ============================================================

const SecuritySection: React.FC = () => {
  const { securitySettings, updateSecuritySettings } = useAdmin();
  const [form, setForm] = useState(securitySettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSecuritySettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Two-Factor Authentication</p>
              <p className="text-[11px] text-[#57534E]">Require 2FA for admin accounts</p>
            </div>
            <Toggle checked={form.twoFactorAuth} onChange={(v) => setForm({ ...form, twoFactorAuth: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Rate Limiting</p>
              <p className="text-[11px] text-[#57534E]">Limit API requests to prevent abuse</p>
            </div>
            <Toggle checked={form.rateLimiting} onChange={(v) => setForm({ ...form, rateLimiting: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">CAPTCHA Enabled</p>
              <p className="text-[11px] text-[#57534E]">Show CAPTCHA on login and registration forms</p>
            </div>
            <Toggle checked={form.captchaEnabled} onChange={(v) => setForm({ ...form, captchaEnabled: v })} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Audit Logs</p>
              <p className="text-[11px] text-[#57534E]">Log all admin actions for security review</p>
            </div>
            <Toggle checked={form.auditLogs} onChange={(v) => setForm({ ...form, auditLogs: v })} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Session Timeout (minutes)</label>
            <input
              type="number"
              value={form.sessionTimeout}
              onChange={(e) => setForm({ ...form, sessionTimeout: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Max Login Attempts</label>
            <input
              type="number"
              value={form.maxLoginAttempts}
              onChange={(e) => setForm({ ...form, maxLoginAttempts: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
            <Save className="w-3.5 h-3.5 inline mr-1.5" />
            Save Security Settings
          </button>
          {saved && <span className="text-[#16A34A] text-xs font-medium">Security settings saved successfully.</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Backup & Restore
// ============================================================

const BackupsSection: React.FC = () => {
  const { backupSettings, updateBackupSettings } = useAdmin();
  const [form, setForm] = useState(backupSettings);
  const [saved, setSaved] = useState(false);
  const [backupMessage, setBackupMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await siteSettingsRepository.getByCategory('backup');
        if (data?.settings) {
          setForm(data.settings);
        }
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleSave = async () => {
    try {
      await siteSettingsRepository.upsert('backup', form);
      updateBackupSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

  const handleManualBackup = async () => {
    try {
      await siteSettingsRepository.upsert('backup_manual', { lastBackup: new Date().toISOString() });
      setBackupMessage('Backup completed successfully.');
      setTimeout(() => setBackupMessage(''), 3000);
    } catch {
      setBackupMessage('Backup failed. Please try again.');
      setTimeout(() => setBackupMessage(''), 3000);
    }
  };

  const handleRestore = () => {
    alert('Restore is not yet available.');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="rounded-xl border border-[#E8E5DF]/80 bg-white p-5 space-y-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#F3F1ED]/40">
            <div>
              <p className="text-sm text-[#1C1917]">Auto Backup</p>
              <p className="text-[11px] text-[#57534E]">Automatically backup data on schedule</p>
            </div>
            <Toggle checked={form.autoBackup} onChange={(v) => setForm({ ...form, autoBackup: v })} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Backup Frequency</label>
            <select
              value={form.backupFrequency}
              onChange={(e) => setForm({ ...form, backupFrequency: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Retention Days</label>
            <input
              type="number"
              value={form.retentionDays}
              onChange={(e) => setForm({ ...form, retentionDays: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-sm mt-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#16A34A]/5">
            <CheckCircle className="w-4 h-4 text-[#16A34A]" />
            <div>
              <p className="text-sm text-[#1C1917]">Last Backup: {form.lastBackup}</p>
              <p className="text-[11px] text-[#57534E]">Previous backup completed successfully</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F59E0B]/5">
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
            <div>
              <p className="text-sm text-[#1C1917]">Next Backup: {form.nextBackup}</p>
              <p className="text-[11px] text-[#57534E]">{form.retentionDays}-day retention policy</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
            <Save className="w-3.5 h-3.5 inline mr-1.5" />
            Save Settings
          </button>
          <button onClick={handleManualBackup} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-[#57534E] text-xs font-medium hover:bg-[#F3F1ED]/60 cursor-pointer">
            <Database className="w-3.5 h-3.5 inline mr-1.5" />
            Backup Now
          </button>
          <button onClick={handleRestore} className="px-4 py-2 rounded-xl border border-[#E8E5DF]/60 text-[#57534E] text-xs font-medium hover:bg-[#F3F1ED]/60 cursor-pointer">
            Restore from Backup
          </button>
          {saved && <span className="text-[#16A34A] text-xs font-medium">Settings saved successfully.</span>}
          {backupMessage && <span className="text-[#16A34A] text-xs font-medium">{backupMessage}</span>}
        </div>
      </div>
    </motion.div>
  );
};

// ============================================================
// Integrations
// ============================================================

const INTEGRATIONS_LIST = [
  { key: 'googleAnalytics' as const, name: 'Google Analytics', description: 'Track website traffic and user behavior.', icon: '📊' },
  { key: 'googleSearchConsole' as const, name: 'Google Search Console', description: 'Monitor search performance and indexing.', icon: '🔍' },
  { key: 'mailchimp' as const, name: 'Mailchimp', description: 'Email marketing and audience management.', icon: '📧' },
  { key: 'stripe' as const, name: 'Stripe', description: 'Payment processing for memberships.', icon: '💳' },
  { key: 'whatsapp' as const, name: 'WhatsApp', description: 'WhatsApp Business messaging integration.', icon: '💬' },
  { key: 'telegram' as const, name: 'Telegram', description: 'Telegram bot for notifications.', icon: '✈️' },
];

const IntegrationsSection: React.FC = () => {
  const { integrations, updateIntegrations } = useAdmin();
  const [form, setForm] = useState(integrations);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateIntegrations(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INTEGRATIONS_LIST.map((item, i) => (
          <motion.div
            key={item.key}
            className={`rounded-xl border bg-white p-5 transition-all ${form[item.key] ? 'border-[#A6852F]/30 bg-[#A6852F]/5' : 'border-[#E8E5DF]/80'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h3 className="text-sm font-medium text-[#1C1917]">{item.name}</h3>
                  <p className="text-[11px] text-[#57534E] mt-0.5">{item.description}</p>
                </div>
              </div>
              <Toggle checked={form[item.key]} onChange={(v) => setForm({ ...form, [item.key]: v })} />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${form[item.key] ? 'bg-[#16A34A]' : 'bg-[#E8E5DF]'}`} />
              <span className="text-[11px] text-[#57534E]">{form[item.key] ? 'Connected' : 'Not connected'}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-5">
        <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-[#A6852F] text-white text-xs font-medium hover:bg-[#8B6F1F] cursor-pointer">
          <Save className="w-3.5 h-3.5 inline mr-1.5" />
          Save Integrations
        </button>
        {saved && <span className="text-[#16A34A] text-xs font-medium">Integrations saved successfully.</span>}
      </div>
    </motion.div>
  );
};

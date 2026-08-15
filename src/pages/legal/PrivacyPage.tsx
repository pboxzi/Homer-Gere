import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#A6852F] transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-6">Privacy Policy</h1>
        <p className="text-xs text-[#A8A29E] mb-8">Last updated: August 15, 2026</p>
        <div className="prose prose-sm text-[#57534E] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">1. Information We Collect</h2>
            <p className="text-sm">We collect information you provide directly, such as your name, email address, phone number, and payment information when you create an account, subscribe to membership, or request an experience. We also collect usage data including browsing behavior, pages visited, and device information.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">2. How We Use Your Information</h2>
            <p className="text-sm">We use your information to provide and improve our services, process membership and experience requests, send relevant updates and communications, ensure website security, and comply with legal obligations.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">3. Information Sharing</h2>
            <p className="text-sm">We do not sell your personal information. We may share your information with trusted service providers who assist in operating the website, processing payments, and delivering services. These providers are contractually bound to protect your data.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">4. Data Security</h2>
            <p className="text-sm">We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">5. Cookies</h2>
            <p className="text-sm">We use cookies and similar technologies to enhance your browsing experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">6. Your Rights</h2>
            <p className="text-sm">You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time. To exercise these rights, please contact us through the Contact page.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">7. Data Retention</h2>
            <p className="text-sm">We retain your personal information for as long as your account is active or as needed to provide services. We may retain certain information as required by law or for legitimate business purposes.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">8. Changes to This Policy</h2>
            <p className="text-sm">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the website constitutes acceptance of the updated policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">9. Contact</h2>
            <p className="text-sm">For privacy-related inquiries, please contact us through the <button onClick={() => navigate('/contact')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Contact page</button>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CookiesPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#A6852F] transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-6">Cookie Policy</h1>
        <p className="text-xs text-[#A8A29E] mb-8">Last updated: August 15, 2026</p>
        <div className="prose prose-sm text-[#57534E] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">1. What Are Cookies</h2>
            <p className="text-sm">Cookies are small text files stored on your device when you visit our website. They help us recognize your browser and remember certain information about your visit.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">2. How We Use Cookies</h2>
            <p className="text-sm">We use cookies to maintain your session and authentication status, remember your preferences, analyze website traffic and usage patterns, and improve our services and user experience.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">3. Types of Cookies</h2>
            <p className="text-sm"><strong>Essential cookies:</strong> Required for the website to function properly, including authentication and security features.<br/>
            <strong>Analytics cookies:</strong> Help us understand how visitors interact with our website.<br/>
            <strong>Preference cookies:</strong> Remember your settings and preferences for a personalized experience.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">4. Managing Cookies</h2>
            <p className="text-sm">You can control and manage cookies through your browser settings. Most browsers allow you to block or delete cookies. Note that disabling essential cookies may affect website functionality.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">5. Third-Party Cookies</h2>
            <p className="text-sm">Some cookies are placed by third-party services integrated into our website, such as analytics providers. These third parties may collect information about your online activities over time and across different websites.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">6. Changes to This Policy</h2>
            <p className="text-sm">We may update this Cookie Policy periodically. Changes will be posted on this page with an updated effective date.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">7. Contact</h2>
            <p className="text-sm">For questions about our use of cookies, please contact us through the <button onClick={() => navigate('/contact')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Contact page</button>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

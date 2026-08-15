import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[#57534E] hover:text-[#A6852F] transition-colors mb-8 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-6">Terms of Service</h1>
        <p className="text-xs text-[#A8A29E] mb-8">Last updated: August 15, 2026</p>
        <div className="prose prose-sm text-[#57534E] space-y-6 leading-relaxed">
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm">By accessing and using the Homer Gere official website (homergere.com), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this website.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">2. Use of the Website</h2>
            <p className="text-sm">This website is provided for informational purposes only. You may browse the site, read content, and interact with features in accordance with these terms. You agree not to misuse the website, attempt unauthorized access, or engage in any activity that disrupts the site's functionality.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">3. Membership</h2>
            <p className="text-sm">Membership accounts are subject to approval. Membership benefits, pricing, and availability may change at any time. Homer Gere reserves the right to modify or discontinue membership tiers and benefits. Members are responsible for maintaining the confidentiality of their account credentials.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">4. Experiences</h2>
            <p className="text-sm">Experiences offered through this website are subject to availability and approval. Pricing, availability, and terms may vary. All experience requests are subject to review and confirmation. Cancellation and refund policies apply as outlined at the time of booking.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">5. Intellectual Property</h2>
            <p className="text-sm">All content on this website, including text, images, logos, graphics, and media, is the property of Homer Gere or its content providers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">6. Limitation of Liability</h2>
            <p className="text-sm">This website is provided "as is" without warranties of any kind. Homer Gere shall not be liable for any damages arising from the use of or inability to use this website or any content herein.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">7. Changes to Terms</h2>
            <p className="text-sm">We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated effective date. Your continued use of the website constitutes acceptance of any changes.</p>
          </section>
          <section>
            <h2 className="text-lg font-editorial text-[#1C1917] mb-3">8. Contact</h2>
            <p className="text-sm">For questions about these Terms, please contact us through the <button onClick={() => navigate('/contact')} className="text-[#A6852F] hover:text-[#8B6F1F] font-medium cursor-pointer">Contact page</button>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

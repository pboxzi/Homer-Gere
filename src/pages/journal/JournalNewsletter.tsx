import React, { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Mail, Check, Loader2 } from 'lucide-react';

export const JournalNewsletter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isValid = name.trim().length > 0 && email.trim().includes('@') && consent;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#FAF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-[2rem] overflow-hidden bg-[#F3F1ED] border border-[#E8E5DF]"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#C9A84C]" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-editorial text-[#111827] tracking-tight">
                    Stay informed.
                  </h2>
                  <p className="text-[#52525B] leading-relaxed">
                    Subscribe to receive official updates, project announcements, and
                    verified news directly from Homer Gere's team. No spam — only
                    important updates.
                  </p>
                </div>

                {submitted ? (
                  <motion.div
                    className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Successfully subscribed</p>
                      <p className="text-xs text-emerald-600">
                        Thank you, {name.split(' ')[0]}. You'll receive updates at {email}.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div>
                      <label htmlFor="journal-name" className="block text-xs font-medium text-[#71717A] mb-1.5">
                        Name
                      </label>
                      <input
                        id="journal-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="w-full px-4 py-3 bg-white border border-[#E8E5DF] rounded-xl text-sm text-[#111827] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label htmlFor="journal-email" className="block text-xs font-medium text-[#71717A] mb-1.5">
                        Email
                      </label>
                      <input
                        id="journal-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 bg-white border border-[#E8E5DF] rounded-xl text-sm text-[#111827] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-all duration-300"
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => setConsent(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-5 h-5 rounded-md border-2 border-[#D6D3D1] peer-checked:border-[#C9A84C] peer-checked:bg-[#C9A84C] transition-all duration-300 flex items-center justify-center">
                          {consent && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="text-xs text-[#71717A] leading-relaxed">
                        I agree to receive official updates from Homer Gere's team. You can
                        unsubscribe at any time. We respect your privacy.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={!isValid || loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111827] hover:bg-[#1C1917] disabled:bg-[#D6D3D1] disabled:cursor-not-allowed text-white text-sm font-medium rounded-2xl transition-all duration-300 cursor-pointer group mt-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Subscribing...</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>Subscribe to Updates</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Decorative Image */}
            <div className="hidden lg:block relative h-full min-h-[400px]">
              <img
                src={require('../../data/images').SECTION_IMAGES.exploreMore.journal}
                alt="Homer Gere — Editorial"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F3F1ED] to-transparent" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

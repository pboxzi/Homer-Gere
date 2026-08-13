import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export const NewsletterBar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section id="newsletter" className="py-20 sm:py-24 bg-[#EDE9E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#C8A96A] uppercase">
            Stay Updated
          </span>

          <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#111827] tracking-tight">
            Never miss a story.
          </h2>

          <p className="text-sm text-[#78716C] leading-relaxed">
            Subscribe for exclusive updates, behind-the-scenes content, and early access to new projects.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[#C8A96A] font-medium text-sm py-3">
              <Check className="w-4 h-4" />
              <span>You're subscribed. Welcome to the journey.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white px-5 py-3.5 rounded-2xl text-sm text-[#111827] placeholder-[#8A8580] border border-[#E4DFD5] focus:border-[#C8A96A] focus:ring-2 focus:ring-[#C8A96A]/20 outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#C8A96A] hover:bg-[#B89A5A] text-white font-semibold text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C8A96A]/25 active:scale-95 focus:outline-none cursor-pointer"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

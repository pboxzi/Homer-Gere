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
    <section id="newsletter" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#C9A84C] uppercase">
            Stay Updated
          </span>

          <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
            Never miss a story.
          </h2>

          <p className="text-sm text-[#44403C] leading-relaxed">
            Subscribe for exclusive updates, behind-the-scenes content, and early access to new projects.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[#C9A84C] font-medium text-sm py-3">
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
                className="flex-1 bg-white px-5 py-3.5 rounded-2xl text-sm text-[#1C1917] placeholder-[#57534E] border border-[#E8E5DF] focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#B8983A] text-white font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 active:scale-95 focus:outline-none cursor-pointer"
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

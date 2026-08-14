import React, { useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { newsletterRepository } from '../lib/repositories';

export const NewsletterBar: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await newsletterRepository.subscribe(email);
      setMessage(result.message);
      setSubmitted(true);
      setEmail('');
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter" className="py-20 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
            Stay Updated
          </span>

          <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight hover-underline">
            Never miss a story.
          </h2>

          <p className="text-sm text-[#44403C] leading-relaxed">
            Subscribe for exclusive updates, behind-the-scenes content, and early access to new projects.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[#A6852F] font-medium text-sm py-3">
              <Check className="w-4 h-4" />
              <span>{message}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white px-5 py-3.5 rounded-2xl text-sm text-[#1C1917] placeholder-[#57534E] border border-[#E8E5DF] focus:border-[#A6852F] focus:ring-2 focus:ring-[#A6852F]/20 outline-none transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 bg-[#A6852F] hover:bg-[#B8983A] disabled:bg-[#A6852F]/60 text-white font-medium text-sm px-6 py-3.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 active:scale-95 focus:outline-none cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

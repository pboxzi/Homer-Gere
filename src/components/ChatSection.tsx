import React from 'react';
import { User, Briefcase, ArrowRight } from 'lucide-react';

interface ChatSectionProps {
  onStartChat: (mode: 'fan' | 'business') => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ onStartChat }) => {
  return (
    <section id="chat" className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 items-center">
          {/* Left Description */}
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-medium tracking-[0.2em] text-[#A6852F] uppercase">
              Chat with Homer
            </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial text-[#1C1917] tracking-tight leading-[1.1] hover-underline">
              Let's start a conversation.
            </h2>

            <p className="text-[#44403C] text-sm sm:text-base leading-relaxed">
              Choose how you'd like to connect with Homer. We'll guide you to the right place.
            </p>
          </div>

          {/* Right Options */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fan Chat */}
            <div
              onClick={() => onStartChat('fan')}
              className="p-4 sm:p-7 transition-all duration-500 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 text-[#A6852F] flex items-center justify-center mb-5 group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
                  <User className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">
                  Fan Chat
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  Send a message, ask a question, or share your support directly.
                </p>
              </div>

              <div className="mt-6 flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
                <span>Start Fan Chat</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>

            {/* Business Chat */}
            <div
              onClick={() => onStartChat('business')}
              className="p-4 sm:p-7 transition-all duration-500 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#A6852F]/10 text-[#A6852F] flex items-center justify-center mb-5 group-hover:bg-[#A6852F] group-hover:text-white transition-all duration-500">
                  <Briefcase className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-editorial text-[#1C1917] group-hover:text-[#A6852F] transition-colors duration-300">
                  Business Chat
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-[#44403C] leading-relaxed">
                  Media, collaborations, opportunities, and professional inquiries.
                </p>
              </div>

              <div className="mt-6 flex items-center text-xs font-medium text-[#A6852F] group-hover:translate-x-1 transition-transform duration-300">
                <span>Start Business Chat</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { User, Briefcase, ArrowRight } from 'lucide-react';

interface ChatSectionProps {
  onStartChat: (mode: 'fan' | 'business') => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ onStartChat }) => {
  return (
    <section id="chat" className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                Chat with Homer
              </span>

              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 tracking-tight">
                Let's start a conversation.
              </h2>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Choose how you'd like to connect with Homer. We'll guide you to the right place.
              </p>
            </div>

            {/* Right Interactive Option Column */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Fan Chat Block */}
              <div
                onClick={() => onStartChat('fan')}
                className="bg-white p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between hover:bg-blue-50/50"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <User className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Fan Chat
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Send a message, ask a question, or share your support directly.
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Start Fan Chat</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

              {/* Business Chat Block */}
              <div
                onClick={() => onStartChat('business')}
                className="bg-white p-6 rounded-2xl transition-all cursor-pointer group flex flex-col justify-between hover:bg-blue-50/50"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Briefcase className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-serif font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Business Chat
                  </h3>

                  <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed">
                    Media, collaborations, opportunities, and professional inquiries.
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Start Business Chat</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

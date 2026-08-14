import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Star, Shield, Clock, Heart, Users, ArrowRight } from 'lucide-react';

interface ChatLandingProps {
  onStartFanChat: () => void;
  onStartBusinessChat: () => void;
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'Direct Connection',
    description: 'Message Homer directly through our private fan chat platform.',
  },
  {
    icon: Star,
    title: 'Member Privileges',
    description: 'Gold and Platinum members unlock WhatsApp access for even closer communication.',
  },
  {
    icon: Clock,
    title: 'Response Expectations',
    description: 'Homer personally reviews messages. Response times vary based on his schedule.',
  },
  {
    icon: Shield,
    title: 'Community Guidelines',
    description: 'Respectful, genuine conversations only. This is a safe space for real connection.',
  },
];

export const ChatLanding: React.FC<ChatLandingProps> = ({ onStartFanChat, onStartBusinessChat }) => {
  return (
    <div className="min-h-[calc(100dvh-4rem)] lg:min-h-[calc(100dvh-5rem)] flex items-center justify-center bg-[#FAF9F7] p-4">
      <div className="max-w-2xl w-full">
        <motion.div
          className="text-center mb-10 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-[#A6852F]/10 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8 text-[#A6852F]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight">
            Connect with Homer
          </h1>
          <p className="text-base text-[#57534E] leading-relaxed max-w-md mx-auto">
            Choose how you'd like to connect. Fan chat is for personal conversations,
            while business enquiries are for professional matters.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-3 p-4 rounded-2xl bg-[#F3F1ED]/60 border border-[#E8E5DF]/40"
            >
              <div className="w-9 h-9 rounded-xl bg-[#A6852F]/10 flex items-center justify-center text-[#A6852F] shrink-0">
                <feature.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#1C1917] mb-0.5">{feature.title}</h3>
                <p className="text-xs text-[#57534E] leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={onStartFanChat}
            className="w-full flex items-center justify-center gap-3 bg-[#A6852F] hover:bg-[#B8983A] text-white text-sm font-medium py-4 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6852F]/25 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            Start Fan Conversation
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartBusinessChat}
            className="w-full flex items-center justify-center gap-3 bg-[#1C1917] hover:bg-[#292524] text-white text-sm font-medium py-4 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Business Enquiry
          </button>
        </motion.div>

        <motion.p
          className="text-center text-[11px] text-[#A8A29E] mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          By chatting, you agree to our community guidelines. Be respectful and genuine.
        </motion.p>
      </div>
    </div>
  );
};

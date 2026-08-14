import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Star, MessageSquare, Download, Bell, User, ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
  onNavigateToSignIn?: () => void;
  onNavigateToRegister?: () => void;
}

const BENEFITS = [
  { icon: Star, text: 'Access exclusive membership tiers' },
  { icon: MessageSquare, text: 'Connect via private fan chat' },
  { icon: Download, text: 'Download exclusive content' },
  { icon: Bell, text: 'Get personalized notifications' },
  { icon: User, text: 'Track your experience requests' },
  { icon: Shield, text: 'Secure member dashboard' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  feature,
  onNavigateToSignIn,
  onNavigateToRegister,
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    onClose();
    if (onNavigateToSignIn) {
      onNavigateToSignIn();
    } else {
      navigate('/auth/sign-in');
    }
  };

  const handleRegister = () => {
    onClose();
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate('/auth/register');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-[#1C1917]/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-[#1C1917] px-6 py-6 text-center">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="w-11 h-11 rounded-xl bg-[#A6852F]/20 flex items-center justify-center mx-auto mb-3">
                <Crown className="w-5 h-5 text-[#A6852F]" />
              </div>
              <h2 className="text-lg font-editorial text-white tracking-tight">
                {feature ? `${feature}` : 'Members Only'}
              </h2>
              <p className="text-xs text-white/60 mt-1">
                This feature is available to approved members.
              </p>
            </div>

            {/* Benefits */}
            <div className="px-5 py-4">
              <p className="text-[9px] font-bold text-[#57534E] uppercase tracking-wider mb-2.5">Member Benefits</p>
              <div className="grid grid-cols-2 gap-2">
                {BENEFITS.map((b) => (
                  <div key={b.text} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-[#A6852F]/8 flex items-center justify-center shrink-0">
                      <b.icon className="w-3 h-3 text-[#A6852F]" />
                    </div>
                    <span className="text-[11px] text-[#1C1917] leading-tight">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-5 space-y-2">
              <button
                onClick={handleSignIn}
                className="w-full bg-[#1C1917] hover:bg-[#292524] text-white text-xs font-medium py-2.5 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                Sign In
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRegister}
                className="w-full bg-[#A6852F] hover:bg-[#8B6F1F] text-white text-xs font-medium py-2.5 rounded-xl transition-all cursor-pointer"
              >
                Apply for Membership
              </button>
              <button
                onClick={onClose}
                className="w-full text-[#57534E] text-[11px] hover:text-[#1C1917] transition-colors cursor-pointer py-1.5"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

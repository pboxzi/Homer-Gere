import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Star, MessageSquare, Download, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const BENEFITS = [
  { icon: Star, text: 'Access exclusive membership tiers' },
  { icon: MessageSquare, text: 'Connect via private fan chat' },
  { icon: Download, text: 'Download exclusive content' },
  { icon: Bell, text: 'Get personalized notifications' },
  { icon: User, text: 'Track your experience requests' },
  { icon: Shield, text: 'Secure member dashboard' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, feature }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
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
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-[#1C1917] px-8 py-8 text-center">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-14 h-14 rounded-2xl bg-[#A6852F]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-[#A6852F]" />
              </div>
              <h2 className="text-xl font-editorial text-white tracking-tight">
                {feature ? `Sign in to access ${feature}` : 'Sign in to continue'}
              </h2>
              <p className="text-sm text-white/60 mt-2">
                Join the Homer Gere community to unlock exclusive features
              </p>
            </div>

            {/* Benefits */}
            <div className="px-8 py-6">
              <p className="text-[10px] font-medium text-[#57534E] uppercase tracking-wider mb-3">Member Benefits</p>
              <div className="space-y-2.5">
                {BENEFITS.map((b) => (
                  <div key={b.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#A6852F]/8 flex items-center justify-center shrink-0">
                      <b.icon className="w-4 h-4 text-[#A6852F]" />
                    </div>
                    <span className="text-sm text-[#1C1917]">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="px-8 pb-8 space-y-3">
              <button
                onClick={handleRegister}
                className="w-full bg-[#A6852F] hover:bg-[#8B6F1F] text-white text-sm font-medium py-3 rounded-2xl transition-all cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                onClick={handleLogin}
                className="w-full bg-[#F3F1ED] hover:bg-[#E8E5DF] text-[#1C1917] text-sm font-medium py-3 rounded-2xl transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={onClose}
                className="w-full text-[#57534E] text-xs hover:text-[#1C1917] transition-colors cursor-pointer py-2"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

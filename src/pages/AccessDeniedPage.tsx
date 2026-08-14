import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldX, ArrowRight } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
      <SEO title="Access Denied" />
      <motion.div
        className="w-full max-w-md text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-20 h-20 rounded-full bg-[#DC2626]/10 flex items-center justify-center mx-auto mb-8">
          <ShieldX className="w-10 h-10 text-[#DC2626]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial text-[#1C1917] tracking-tight mb-4">
          Access Denied
        </h1>
        <p className="text-[#57534E] leading-relaxed mb-10 max-w-md mx-auto">
          You don&apos;t have permission to access this page. This area is restricted to authorized administrators only.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Go to Homepage
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/admin/login')}
            className="inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            Admin Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}

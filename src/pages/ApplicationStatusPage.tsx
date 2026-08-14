import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, FileText, AlertCircle, LogOut, ArrowRight, CheckCircle } from 'lucide-react';
import { SEO } from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { registrationRepository } from '../../lib/repositories';

export default function ApplicationStatusPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [application, setApplication] = useState<{
    status: string;
    created_at: string;
    reviewed_at: string | null;
    rejection_reason: string | null;
    notes: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const apps = await registrationRepository.getAll();
        const myApp = apps.find(a => a.email === user.email);
        if (myApp) {
          setApplication({
            status: myApp.status,
            created_at: myApp.created_at,
            reviewed_at: myApp.reviewed_at,
            rejection_reason: myApp.rejection_reason,
            notes: myApp.notes || myApp.review_notes,
          });
        }
      } catch {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-[#F59E0B]',
          bg: 'bg-[#F59E0B]/10',
          label: 'Pending Review',
          description: 'Your application is being reviewed by our team.',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-[#16A34A]',
          bg: 'bg-[#16A34A]/10',
          label: 'Approved',
          description: 'Your application has been approved. You can now sign in.',
        };
      case 'rejected':
        return {
          icon: AlertCircle,
          color: 'text-[#DC2626]',
          bg: 'bg-[#DC2626]/10',
          label: 'Not Approved',
          description: 'Your application was not approved at this time.',
        };
      default:
        return {
          icon: Clock,
          color: 'text-[#57534E]',
          bg: 'bg-[#57534E]/10',
          label: 'Unknown',
          description: '',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statusConfig = application ? getStatusConfig(application.status) : null;
  const StatusIcon = statusConfig?.icon || Clock;

  return (
    <div className="min-h-screen bg-[#FAF9F7] text-[#1C1917] font-body antialiased flex items-center justify-center px-4">
      <SEO title="Application Status" />
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#E8E5DF]/60 overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8 border-b border-[#E8E5DF]/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#A6852F]" />
              </div>
              <div>
                <h1 className="text-xl font-editorial text-[#1C1917]">Application Status</h1>
                <p className="text-xs text-[#57534E]">Track your membership application</p>
              </div>
            </div>

            {statusConfig && (
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${statusConfig.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${statusConfig.color}`}>{statusConfig.label}</p>
                  <p className="text-xs text-[#57534E]">{statusConfig.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Submitted</p>
                <p className="text-sm text-[#1C1917] mt-1">
                  {application?.created_at
                    ? new Date(application.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Status</p>
                <p className="text-sm text-[#1C1917] mt-1 capitalize">{application?.status || 'Unknown'}</p>
              </div>
            </div>

            {application?.reviewed_at && (
              <div>
                <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em]">Reviewed</p>
                <p className="text-sm text-[#1C1917] mt-1">
                  {new Date(application.reviewed_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            )}

            {application?.notes && (
              <div className="p-4 rounded-xl bg-[#F3F1ED]/40">
                <p className="text-[11px] font-medium text-[#57534E] uppercase tracking-[0.05em] mb-1">Admin Notes</p>
                <p className="text-sm text-[#1C1917] leading-relaxed">{application.notes}</p>
              </div>
            )}

            {application?.rejection_reason && (
              <div className="p-4 rounded-xl bg-[#DC2626]/5 border border-[#DC2626]/10">
                <p className="text-[11px] font-medium text-[#DC2626] uppercase tracking-[0.05em] mb-1">Reason</p>
                <p className="text-sm text-[#1C1917] leading-relaxed">{application.rejection_reason}</p>
              </div>
            )}

            {application?.status === 'pending' && (
              <div className="p-4 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/10">
                <p className="text-sm text-[#57534E] leading-relaxed">
                  <span className="font-medium text-[#1C1917]">Estimated review time:</span> 1–2 business days.
                  You will receive an email once your application has been reviewed.
                </p>
              </div>
            )}

            {application?.status === 'approved' && (
              <div className="p-4 rounded-xl bg-[#16A34A]/5 border border-[#16A34A]/10">
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Your account is ready. <span className="font-medium text-[#1C1917]">Sign in</span> to access your dashboard.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3">
            {application?.status === 'approved' && (
              <button
                onClick={() => navigate('/auth/sign-in')}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#1C1917] hover:bg-[#292524] active:scale-95 text-white font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[#E8E5DF]/60 hover:bg-[#F3F1ED]/60 text-[#57534E] font-medium text-sm px-6 py-3 rounded-2xl transition-all duration-300 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

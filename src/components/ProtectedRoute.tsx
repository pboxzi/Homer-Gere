import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profilesRepository } from '../lib/repositories';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, user, loading, refreshProfile } = useAuth();
  const location = useLocation();
  const [freshRole, setFreshRole] = useState<string | null>(null);

  // Re-fetch profile from DB to get the latest role (in case admin just approved)
  useEffect(() => {
    if (!loading && isAuthenticated && user?.id) {
      profilesRepository.getById(user.id).then((profile) => {
        if (profile) {
          setFreshRole(profile.role);
          // If role changed, refresh the auth context
          if (profile.role !== user.role) {
            refreshProfile();
          }
        }
      }).catch(() => {});
    }
  }, [loading, isAuthenticated, user?.id, user?.role, refreshProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A6852F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#57534E]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (requireAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  // Use fresh role if available, otherwise fall back to cached user.role
  const effectiveRole = freshRole || user?.role;
  if (effectiveRole === 'pending') {
    if (requireAdmin) {
      return <Navigate to="/access-denied" replace />;
    }
    return <Navigate to="/application-status" replace />;
  }

  return <>{children}</>;
};

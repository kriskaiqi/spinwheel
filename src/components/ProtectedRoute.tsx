import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';

import React from 'react';
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/signin" replace />;
  return children;
}

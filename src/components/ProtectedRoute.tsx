import React, { type JSX } from 'react';
import { Navigate } from 'react-router';
import { useAppSelector } from '../hooks/reduxHooks';

export default function ProtectedRoute({ children, adminOnly = false } : { children: JSX.Element; adminOnly?: boolean }) {
  const user = useAppSelector((s) => s.auth.user);
  console.log("protectedroute",user);
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}
'use client';

import 'styles/theme.scss';
import '@nosferatu500/react-sortable-tree/style.css';
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import DashboardWrapper from './dashboard-wrapper';
import Loading from '@/components/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <Loading />;
  }

  // If no user, don't render anything (redirect is happening in useAuth hook)
  if (!user) {
    return null;
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
}

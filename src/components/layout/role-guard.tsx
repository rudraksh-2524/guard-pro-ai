import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell, type NavItem } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/common/states";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types";

export function RoleArea({
  role,
  roleLabel,
  nav,
  mobileNavCount,
  children,
}: {
  role: UserRole;
  roleLabel: string;
  nav: readonly NavItem[];
  mobileNavCount?: number;
  children: ReactNode;
}) {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const allowed = session?.user.role === role;

  useEffect(() => {
    if (loading) return;
    if (!session) {
      void navigate({ to: "/login", replace: true });
      return;
    }
    if (session.user.role !== role) {
      void navigate({
        to: session.user.role === "admin" ? "/admin/dashboard" : "/student/dashboard",
        replace: true,
      });
    }
  }, [loading, session, role, navigate]);

  if (loading || !allowed) {
    return (
      <div className="min-h-screen bg-background p-6">
        <p className="mb-3 text-sm text-muted-foreground">Checking your session…</p>
        <LoadingState />
      </div>
    );
  }

  return (
    <AppShell nav={nav} roleLabel={roleLabel} mobileNavCount={mobileNavCount}>
      {children}
    </AppShell>
  );
}
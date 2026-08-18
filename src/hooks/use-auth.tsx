import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getSession,
  signIn as svcSignIn,
  signOut as svcSignOut,
  signUp as svcSignUp,
  type AuthSession,
  type SignUpInput,
} from "@/services/auth-service";
import type { UserRole } from "@/types";

interface AuthContextValue {
  session: AuthSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthSession>;
  signUp: (input: SignUpInput) => Promise<AuthSession>;
  signOut: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getSession());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await svcSignIn(email, password);
    setSession(next);
    return next;
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const next = await svcSignUp(input);
    setSession(next);
    return next;
  }, []);

  const signOut = useCallback(async () => {
    await svcSignOut();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      signIn,
      signUp,
      signOut,
      hasRole: (role) => (session ? session.user.role === role : false),
    }),
    [session, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
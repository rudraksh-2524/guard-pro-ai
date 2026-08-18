/**
 * Demo authentication service.
 *
 * Sessions are kept client-side so the platform can be demonstrated without a
 * backend. The interface matches what a Supabase-backed implementation would
 * expose (signIn / signUp / requestPasswordReset / signOut / getSession) so it
 * can be replaced without changing any UI code.
 */
import { DEMO_CREDENTIALS } from "@/constants";
import { demoStudents } from "@/lib/demo-data";
import type { User, UserRole } from "@/types";

const STORAGE_KEY = "pga.session.v1";
const USERS_KEY = "pga.users.v1";

export interface AuthSession {
  user: User;
  student_code?: string;
  issued_at: string;
}

export interface SignUpInput {
  full_name: string;
  email: string;
  password: string;
  student_code: string;
}

interface StoredAccount {
  user: User;
  password: string;
  student_code?: string;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function seedAccounts(): StoredAccount[] {
  const primary = demoStudents[0];
  return [
    {
      password: DEMO_CREDENTIALS.student.password,
      student_code: primary ? primary.student_code : "CS21-0148",
      user: {
        id: "usr-1",
        email: DEMO_CREDENTIALS.student.email,
        full_name: primary ? primary.full_name : "Aarav Sharma",
        role: "student",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    },
    {
      password: DEMO_CREDENTIALS.admin.password,
      user: {
        id: "usr-admin",
        email: DEMO_CREDENTIALS.admin.email,
        full_name: "Dr. Neha Rao",
        role: "admin",
        is_active: true,
        created_at: new Date().toISOString(),
      },
    },
  ];
}

function readAccounts(): StoredAccount[] {
  if (!isBrowser()) return seedAccounts();
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      const seeded = seedAccounts();
      window.localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as StoredAccount[];
  } catch {
    return seedAccounts();
  }
}

function writeAccounts(accounts: StoredAccount[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(accounts));
}

export function getSession(): AuthSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthSession) : null;
  } catch {
    return null;
  }
}

function persist(session: AuthSession | null): void {
  if (!isBrowser()) return;
  if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(STORAGE_KEY);
}

export async function signIn(email: string, password: string): Promise<AuthSession> {
  const accounts = readAccounts();
  const account = accounts.find((a) => a.user.email.toLowerCase() === email.trim().toLowerCase());
  if (!account || account.password !== password) {
    throw new Error("Incorrect email or password.");
  }
  if (!account.user.is_active) {
    throw new Error("This account has been disabled. Contact your examination office.");
  }
  const session: AuthSession = {
    user: account.user,
    ...(account.student_code ? { student_code: account.student_code } : {}),
    issued_at: new Date().toISOString(),
  };
  persist(session);
  return session;
}

export async function signUp(input: SignUpInput): Promise<AuthSession> {
  const accounts = readAccounts();
  if (accounts.some((a) => a.user.email.toLowerCase() === input.email.trim().toLowerCase())) {
    throw new Error("An account with this email already exists.");
  }
  const account: StoredAccount = {
    password: input.password,
    student_code: input.student_code,
    user: {
      id: `usr-${Date.now()}`,
      email: input.email.trim(),
      full_name: input.full_name.trim(),
      role: "student",
      is_active: true,
      created_at: new Date().toISOString(),
    },
  };
  writeAccounts([...accounts, account]);
  const session: AuthSession = {
    user: account.user,
    student_code: account.student_code,
    issued_at: new Date().toISOString(),
  };
  persist(session);
  return session;
}

export async function requestPasswordReset(email: string): Promise<void> {
  const accounts = readAccounts();
  const exists = accounts.some((a) => a.user.email.toLowerCase() === email.trim().toLowerCase());
  if (!exists) {
    // Do not disclose account existence.
    return;
  }
}

export async function signOut(): Promise<void> {
  persist(null);
}

export function hasRole(session: AuthSession | null, role: UserRole): boolean {
  return session ? session.user.role === role : false;
}
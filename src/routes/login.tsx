import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/auth-layout";
import { DEMO_CREDENTIALS } from "@/constants";
import { useAuth } from "@/hooks/use-auth";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    pageHead(
      "Sign in — Proctor Guard AI",
      "Sign in to Proctor Guard AI to take a supervised assessment or to review examination sessions.",
    ),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await signIn(email.trim(), password);
      toast.success(`Signed in as ${session.user.full_name}`);
      void navigate({
        to: session.user.role === "admin" ? "/admin/dashboard" : "/student/dashboard",
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }

  function fill(role: "student" | "admin") {
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
    setError(null);
  }

  return (
    <AuthLayout
      title="Sign in"
      description="Access your candidate portal or the examination administration console."
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@institution.edu"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 border-t border-border pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Demo accounts</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fill("student")}>
            Use student demo
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => fill("admin")}>
            Use admin demo
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Demo credentials populate the form; sessions are stored locally in this browser only.
        </p>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        No account yet?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register as a student
        </Link>
      </p>
    </AuthLayout>
  );
}
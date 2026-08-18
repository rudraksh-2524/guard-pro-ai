import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/layout/auth-layout";
import { requestPasswordReset } from "@/services/auth-service";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    pageHead(
      "Reset your password — Proctor Guard AI",
      "Request a password reset link for your Proctor Guard AI candidate or administrator account.",
    ),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    await requestPasswordReset(email.trim());
    setBusy(false);
    setSent(true);
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email address linked to your account and we will send reset instructions."
    >
      {sent ? (
        <div className="space-y-4">
          <p
            role="status"
            className="rounded border border-success/40 bg-success/10 px-3 py-2 text-sm text-foreground"
          >
            If an account exists for <span className="font-medium">{email}</span>, reset instructions have been
            sent. In this demonstration build no email is delivered.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link to="/login">Back to sign in</Link>
          </Button>
        </div>
      ) : (
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
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Sending…" : "Send reset instructions"}
          </Button>
          <p className="text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
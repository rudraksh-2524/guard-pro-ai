import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/states";
import { useAuth } from "@/hooks/use-auth";
import { demoStudents } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/student/profile")({
  head: () =>
    pageHead(
      "Your profile — Proctor Guard AI",
      "Review your candidate record, contact details and account status.",
    ),
  component: StudentProfile,
});

function StudentProfile() {
  const { session } = useAuth();
  const record = demoStudents.find((s) => s.email === session?.user.email) ?? demoStudents[0];
  const [name, setName] = useState(session?.user.full_name ?? record?.full_name ?? "");
  const [email, setEmail] = useState(session?.user.email ?? record?.email ?? "");

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Your candidate record as held by the examination office." />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <form
          className="panel space-y-4 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Profile details updated");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="code">Student ID</Label>
              <Input id="code" value={session?.student_code ?? record?.student_code ?? ""} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="program">Programme</Label>
              <Input id="program" value={record?.program ?? ""} readOnly />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Student ID and programme are maintained by the examination office and cannot be edited here.
          </p>
          <Button type="submit">Save changes</Button>
        </form>

        <div className="panel p-4">
          <h2 className="text-sm font-semibold text-foreground">Account</h2>
          <dl className="mt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Role</dt>
              <dd className="text-foreground">Candidate</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="text-foreground">{record?.is_active ? "Active" : "Suspended"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Year</dt>
              <dd className="font-mono text-foreground">{record?.year ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-muted-foreground">Registered</dt>
              <dd className="font-mono text-foreground">
                {session ? formatDate(session.user.created_at) : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
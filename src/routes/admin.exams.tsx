import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/common/states";
import { DemoBadge, StatusPill } from "@/components/common/badges";
import { demoExams } from "@/lib/demo-data";
import { formatDateTime } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import type { ExamStatus } from "@/types";

export const Route = createFileRoute("/admin/exams")({
  head: () =>
    pageHead(
      "Assessment management — Proctor Guard AI",
      "Create, schedule and publish proctored assessments with per-exam monitoring settings.",
    ),
  component: AdminExams,
});

const statusTone: Record<ExamStatus, "ok" | "warn" | "neutral" | "bad"> = {
  published: "ok",
  draft: "warn",
  archived: "neutral",
  closed: "neutral",
};

function AdminExams() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessments"
        description="Scheduling, duration and proctoring configuration per assessment."
        actions={
          <>
            <DemoBadge label="Sample catalogue" />
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm">New assessment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create assessment</DialogTitle>
                  <DialogDescription>
                    Definitions are stored locally in this demonstration and persist once Cloud is connected.
                  </DialogDescription>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    toast.success("Assessment draft created");
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="exam-title">Title</Label>
                    <Input id="exam-title" required placeholder="Operating Systems — Unit Test" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-subject">Subject</Label>
                      <Input id="exam-subject" required placeholder="Operating Systems" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="exam-duration">Duration (minutes)</Label>
                      <Input id="exam-duration" type="number" min={5} defaultValue={45} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="exam-desc">Description</Label>
                    <Textarea id="exam-desc" placeholder="Topics covered and instructions for candidates." />
                  </div>
                  <div className="flex items-center justify-between rounded border border-border p-3">
                    <div>
                      <Label htmlFor="exam-proctor">Enable AI proctoring</Label>
                      <p className="text-xs text-muted-foreground">Camera monitoring and risk scoring.</p>
                    </div>
                    <Switch id="exam-proctor" defaultChecked />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Create draft</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-3 lg:grid-cols-2">
        {demoExams.map((exam) => (
          <article key={exam.id} className="panel space-y-3 p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">{exam.title}</h2>
              <StatusPill tone={statusTone[exam.status]} label={exam.status} />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{exam.description}</p>
            <dl className="grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-mono text-foreground">{exam.duration_minutes} min</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Questions</dt>
                <dd className="font-mono text-foreground">{exam.total_questions}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Proctoring</dt>
                <dd className="text-foreground">{exam.proctoring_enabled ? "Enabled" : "Off"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Answers</dt>
                <dd className="text-foreground">{exam.reveal_answers ? "Revealed" : "Withheld"}</dd>
              </div>
            </dl>
            <p className="text-xs text-muted-foreground">
              Window: {formatDateTime(exam.starts_at)} → {formatDateTime(exam.ends_at)}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.message("Editor opens in the full build")}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.success(exam.status === "published" ? "Assessment closed" : "Assessment published")
                }
              >
                {exam.status === "published" ? "Close" : "Publish"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

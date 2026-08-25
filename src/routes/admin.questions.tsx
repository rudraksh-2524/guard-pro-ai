import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, PageHeader } from "@/components/common/states";
import { DemoBadge } from "@/components/common/badges";
import { demoExams, demoOtherQuestions, demoQuestions } from "@/lib/demo-data";
import { DEMO_EXAM_ID } from "@/constants";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import type { OptionKey } from "@/types";

export const Route = createFileRoute("/admin/questions")({
  head: () =>
    pageHead(
      "Question bank — Proctor Guard AI",
      "Review multiple-choice items, marks and difficulty for each proctored assessment.",
    ),
  component: AdminQuestions,
});

const OPTIONS: OptionKey[] = ["A", "B", "C", "D"];

function AdminQuestions() {
  const [examId, setExamId] = useState(DEMO_EXAM_ID);
  const [query, setQuery] = useState("");

  const questions = useMemo(() => {
    const source =
      examId === DEMO_EXAM_ID
        ? demoQuestions
        : demoOtherQuestions.map((q, i) => ({ ...q, exam_id: examId, position: i + 1 }));
    const q = query.trim().toLowerCase();
    return q ? source.filter((item) => item.prompt.toLowerCase().includes(q)) : source;
  }, [examId, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question bank"
        description="Items are grouped by assessment; correct answers are highlighted."
        actions={
          <>
            <DemoBadge label="Sample items" />
            <Button size="sm" onClick={() => toast.message("Bulk item upload arrives with the Cloud backend")}>
              Add question
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Select value={examId} onValueChange={setExamId}>
          <SelectTrigger className="w-full sm:w-80" aria-label="Filter by assessment">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {demoExams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search question text"
          className="w-full sm:max-w-xs"
          aria-label="Search questions"
        />
      </div>

      {questions.length === 0 ? (
        <EmptyState title="No items match that search" description="Clear the search to see the full bank." />
      ) : (
        <ol className="space-y-3">
          {questions.map((q) => (
            <li key={`${q.exam_id}-${q.id}`} className="panel p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-foreground">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">Q{q.position}</span>
                  {q.prompt}
                </p>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {q.marks} mark{q.marks === 1 ? "" : "s"} · {q.difficulty}
                </span>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {OPTIONS.map((key) => {
                  const text = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[key];
                  const isCorrect = q.correct_option === key;
                  return (
                    <li
                      key={key}
                      className={cn(
                        "flex gap-2 rounded border px-3 py-2 text-sm",
                        isCorrect
                          ? "border-success/40 bg-success/10 text-foreground"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      <span className="font-mono text-xs">{key}</span>
                      <span>{text}</span>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

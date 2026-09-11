import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { questions } from "@/data/questions";
import { useAuth } from "@/hooks/useAuth";
import { practiceQuery, useProfile, useSavePractice } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/practice")({
  head: () => ({
    meta: [
      { title: "Practice questions — Shoulder Check" },
      {
        name: "description",
        content:
          "Alberta Class 5 practice questions on speed limits, right of way, signs, winter driving and test-day rules.",
      },
      { property: "og:title", content: "Practice questions — Shoulder Check" },
      {
        property: "og:description",
        content: "Alberta Class 5 practice questions with plain-English explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Practice,
});

function Practice() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: attempts = [] } = useQuery(practiceQuery(user?.id));
  const savePractice = useSavePractice(user?.id);
  const isPremium = profile?.plan === "premium";

  const pool = useMemo(
    () => (isPremium ? questions : questions.filter((q) => q.tier === "free")),
    [isPremium],
  );

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const question = pool[index % pool.length]!;

  const todayCorrect = attempts.filter((a) => a.correct).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">Practice</h1>
          <p className="text-muted-foreground mt-1">
            {pool.length} questions available on your plan · {attempts.length} answered ·{" "}
            {todayCorrect} correct
          </p>
        </div>
        {!isPremium && (
          <Button variant="secondary" asChild>
            <Link to="/plan">Unlock the full bank</Link>
          </Button>
        )}
      </div>

      <div className="surface-card p-6">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          {question.topic}
        </p>
        <h2 className="font-display mt-2 text-2xl leading-snug font-semibold">{question.question}</h2>

        <div className="mt-5 grid gap-2">
          {question.options.map((option, i) => {
            const state =
              picked === null
                ? "idle"
                : i === question.answer
                  ? "right"
                  : i === picked
                    ? "wrong"
                    : "idle";
            return (
              <button
                key={option}
                disabled={picked !== null}
                onClick={() => {
                  setPicked(i);
                  if (user) {
                    savePractice.mutate({
                      questionId: question.id,
                      topic: question.topic,
                      correct: i === question.answer,
                    });
                  }
                }}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                  state === "right"
                    ? "border-success bg-success/15"
                    : state === "wrong"
                      ? "border-destructive bg-destructive/15"
                      : "border-border hover:border-primary/60 hover:bg-secondary"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className="border-border mt-5 rounded-lg border p-4">
            <p
              className={
                picked === question.answer
                  ? "text-success text-sm font-semibold"
                  : "text-destructive text-sm font-semibold"
              }
            >
              {picked === question.answer ? "Correct." : "Not quite."}
            </p>
            <p className="mt-1 text-sm">{question.why}</p>
            <Button
              className="mt-4"
              onClick={() => {
                setPicked(null);
                setIndex((i) => i + 1);
              }}
            >
              Next question
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { scenarios } from "@/data/scenarios";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSaveMockTest } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/mock-test")({
  head: () => ({
    meta: [
      { title: "Mock road test — Shoulder Check" },
      {
        name: "description",
        content:
          "Run a full simulated Alberta Class 5 road test: scored decisions, examiner-style demerits and a mistake breakdown.",
      },
      { property: "og:title", content: "Mock road test — Shoulder Check" },
      {
        property: "og:description",
        content: "A scored, examiner-style Alberta road test simulation with mistake analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MockTest;
});

type Stage = { slug: string; title: string; prompt: string; options: string[]; answer: number; fault: string };

function MockTest() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const saveMock = useSaveMockTest(user?.id);
  const isPremium = profile?.plan === "premium";

  const stages: Stage[] = useMemo(() => {
    const pool = isPremium ? scenarios : scenarios.filter((s) => s.tier === "free");
    return pool.map((s) => ({
      slug: s.slug,
      title: s.title,
      prompt: s.quiz.question,
      options: s.quiz.options,
      answer: s.quiz.answer,
      fault: s.faults[0] ?? "Missed observation",
    }));
  }, [isPremium]);

  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<{ scenario: string; fault: string }[]>([]);
  const [done, setDone] = useState(false);

  const stage = stages[step];

  const finish = (finalMistakes: { scenario: string; fault: string }[]) => {
    const score = Math.round(((stages.length - finalMistakes.length) / stages.length) * 100);
    const passed = score >= 75 && finalMistakes.length <= 1;
    setDone(true);
    if (user) {
      saveMock.mutate(
        { score, passed, mistakes: finalMistakes },
        { onError: () => toast.error("Could not save this run") },
      );
    }
  };

  if (done) {
    const score = Math.round(((stages.length - mistakes.length) / stages.length) * 100);
    const passed = score >= 75 && mistakes.length <= 1;
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center">
        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">Result</p>
        <p
          className={`font-display mt-2 text-6xl font-semibold ${passed ? "text-success" : "text-destructive"}`}
        >
          {score}%
        </p>
        <p className="font-display mt-1 text-2xl font-semibold">
          {passed ? "Pass" : "Not a pass yet"}
        </p>
        {mistakes.length > 0 && (
          <div className="mt-6 text-left">
            <h2 className="font-display text-lg font-semibold">Where you lost marks</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {mistakes.map((m) => (
                <li key={m.scenario} className="border-border rounded-lg border p-3">
                  <p className="font-medium">{m.scenario}</p>
                  <p className="text-muted-foreground">{m.fault}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              setStep(0);
              setPicked(null);
              setMistakes([]);
              setDone(false);
            }}
          >
            Run it again
          </Button>
          <Button variant="secondary" asChild>
            <Link to="/lessons">Practise the weak spots</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!stage) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">Mock road test</h1>
        <p className="text-muted-foreground mt-1">
          Stage {step + 1} of {stages.length}
          {!isPremium && " · Premium runs the full 12-stage route"}
        </p>
        <div className="bg-secondary mt-4 h-1.5 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all"
            style={{ width: `${(step / stages.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="surface-card p-6">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">{stage.title}</p>
        <h2 className="font-display mt-2 text-2xl leading-snug font-semibold">{stage.prompt}</h2>
        <div className="mt-5 grid gap-2">
          {stage.options.map((option, i) => (
            <button
              key={option}
              disabled={picked !== null}
              onClick={() => {
                setPicked(i);
                const next =
                  i === stage.answer
                    ? mistakes
                    : [...mistakes, { scenario: stage.title, fault: stage.fault }];
                setMistakes(next);
                setTimeout(() => {
                  setPicked(null);
                  if (step + 1 >= stages.length) finish(next);
                  else setStep(step + 1);
                }, 900);
              }}
              className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                picked === null
                  ? "border-border hover:border-primary/60 hover:bg-secondary"
                  : i === stage.answer
                    ? "border-success bg-success/15"
                    : i === picked
                      ? "border-destructive bg-destructive/15"
                      : "border-border opacity-60"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {!isPremium && (
        <div className="surface-card flex flex-wrap items-center gap-3 p-5">
          <p className="text-sm">Premium unlocks the full 12-stage route and advanced scoring.</p>
          <Button variant="secondary" asChild>
            <Link to="/plan">See Premium</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

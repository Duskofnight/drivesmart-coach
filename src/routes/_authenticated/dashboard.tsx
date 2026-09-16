import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ReadinessRing } from "@/components/ReadinessRing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import {
  computeReadiness,
  mockTestsQuery,
  practiceQuery,
  scenarioProgressQuery,
  totalQuestions,
  useProfile,
  useUpdateProfile,
} from "@/lib/progress";
import { scenarios } from "@/data/scenarios";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your readiness dashboard — Shoulder Check" },
      {
        name: "description",
        content:
          "See your Alberta Class 5 road test readiness score, weakest topics and what to practise next.",
      },
      { property: "og:title", content: "Your readiness dashboard — Shoulder Check" },
      {
        property: "og:description",
        content: "Track your Alberta road test readiness score and practise what you're weakest at.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function pretty(name: string | null | undefined) {
  if (!name) return null;
  const first = name.trim().split(/[\s._-]+/)[0] ?? "";
  if (!first) return null;
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: progress = [] } = useQuery(scenarioProgressQuery(user?.id));
  const { data: practice = [] } = useQuery(practiceQuery(user?.id));
  const { data: mocks = [] } = useQuery(mockTestsQuery(user?.id));
  const updateProfile = useUpdateProfile(user?.id);
  const [nameDraft, setNameDraft] = useState("");

  const readiness = computeReadiness({ progress, practice, mocks });
  const nextScenario =
    scenarios.find((s) => !progress.some((p) => p.scenario_slug === s.slug && p.completed)) ??
    scenarios[0]!;

  const name = pretty(profile?.display_name);
  const isNew = progress.length === 0 && practice.length === 0 && mocks.length === 0;
  const greeting = name
    ? isNew
      ? `Nice to meet you, ${name}.`
      : `Welcome back, ${name}.`
    : "Nice to meet you.";

  const scenarioPct = Math.round((readiness.scenariosDone / readiness.totalScenarios) * 100);
  const questionPct = Math.min(
    100,
    Math.round((readiness.practiceCount / totalQuestions) * 100),
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Alberta Class 5 · {readiness.band}
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold sm:text-5xl">{greeting}</h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm">
          {isNew
            ? "Start with a scenario, answer a few practice questions, and your readiness score will build from there."
            : "Here's exactly where you stand and what to work on before your road test."}
        </p>
      </motion.div>

      {!profile?.display_name && (
        <div className="surface-card flex flex-wrap items-end gap-3 p-5">
          <div className="min-w-[12rem] flex-1">
            <p className="text-sm font-medium">What should we call you?</p>
            <Input
              className="mt-2"
              placeholder="Your first name"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
            />
          </div>
          <Button
            disabled={!nameDraft.trim() || updateProfile.isPending}
            onClick={() => updateProfile.mutate({ display_name: nameDraft.trim() })}
          >
            Save name
          </Button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[20rem_1fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="surface-card relative overflow-hidden p-8"
        >
          <div className="bg-primary/15 pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full blur-3xl" />
          <div className="relative flex flex-col items-center">
            <ReadinessRing score={readiness.score} band={readiness.band} />
            <p className="text-muted-foreground mt-4 text-center text-sm">
              Scenario mastery, practice accuracy and mock road tests, combined.
            </p>
            <Button className="mt-5 w-full" asChild>
              <Link to="/lessons/$slug" params={{ slug: nextScenario.slug }}>
                Continue training
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="space-y-5">
          <div className="surface-card p-6">
            <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">Do this next</p>
            <h2 className="font-display mt-2 text-2xl font-semibold">{nextScenario.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{nextScenario.subtitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/lessons/$slug" params={{ slug: nextScenario.slug }}>
                  Start scenario
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/practice">Practice questions</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/mock-test">Mock road test</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/coach" search={{ topic: undefined }}>
                  Ask the coach
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Stat
              label="Scenarios completed"
              value={`${readiness.scenariosDone} / ${readiness.totalScenarios}`}
              pct={scenarioPct}
            />
            <Stat
              label="Questions answered"
              value={`${readiness.practiceCount} / ${totalQuestions}`}
              pct={questionPct}
            />
            <Stat
              label="Practice accuracy"
              value={`${readiness.practiceAccuracy}%`}
              pct={readiness.practiceAccuracy}
            />
            <Stat
              label="Best mock road test"
              value={readiness.bestMock === null ? "—" : `${readiness.bestMock}%`}
              pct={readiness.bestMock ?? 0}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-display text-xl font-semibold">Weakest topics</h2>
          {readiness.weakest.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              Answer a few practice questions and your weak spots will show up here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {readiness.weakest.map((t) => (
                <li key={t.topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="capitalize">{t.topic}</span>
                    <span className="text-muted-foreground">{t.accuracy}%</span>
                  </div>
                  <div className="bg-secondary h-1.5 overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.accuracy}%` }}
                      transition={{ duration: 0.6 }}
                      className={t.accuracy >= 70 ? "bg-success h-full" : "bg-destructive h-full"}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-6">
          <h2 className="font-display text-xl font-semibold">Recent mock road tests</h2>
          {mocks.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              No simulations yet. A mock test scores you the way an examiner would.
            </p>
          ) : (
            <ul className="mt-4 space-y-2 text-sm">
              {mocks.slice(0, 5).map((m) => (
                <li
                  key={m.id}
                  className="border-border flex justify-between border-b pb-2 last:border-0"
                >
                  <span>{new Date(m.created_at as string).toLocaleDateString()}</span>
                  <span className={m.passed ? "text-success" : "text-destructive"}>
                    {m.score}% · {m.passed ? "Pass" : "Fail"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="surface-card p-5">
      <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">{label}</p>
      <p className="font-display mt-2 text-3xl font-semibold">{value}</p>
      <div className="bg-secondary mt-3 h-1 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          transition={{ duration: 0.6 }}
          className="bg-primary h-full"
        />
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ReadinessRing } from "@/components/ReadinessRing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  computeReadiness,
  mockTestsQuery,
  practiceQuery,
  scenarioProgressQuery,
  useProfile,
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

function Dashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: progress = [] } = useQuery(scenarioProgressQuery(user?.id));
  const { data: practice = [] } = useQuery(practiceQuery(user?.id));
  const { data: mocks = [] } = useQuery(mockTestsQuery(user?.id));

  const readiness = computeReadiness({ progress, practice, mocks });
  const nextScenario =
    scenarios.find((s) => !progress.some((p) => p.scenario_slug === s.slug && p.completed)) ??
    scenarios[0]!;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Alberta Class 5
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold">
          {profile?.display_name ? `Nice to see you, ${profile.display_name}.` : "Your training plan"}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <div className="surface-card flex flex-col items-center justify-center p-8">
          <ReadinessRing score={readiness.score} band={readiness.band} />
          <p className="text-muted-foreground mt-4 max-w-[15rem] text-center text-sm">
            Built from scenario mastery, practice accuracy and your mock road tests.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Stat
            label="Scenarios completed"
            value={`${readiness.scenariosDone} / ${readiness.totalScenarios}`}
          />
          <Stat label="Practice accuracy" value={`${readiness.practiceAccuracy}%`} />
          <Stat label="Questions answered" value={String(readiness.practiceCount)} />
          <Stat
            label="Best mock road test"
            value={readiness.bestMock === null ? "—" : `${readiness.bestMock}%`}
          />

          <div className="surface-card p-5 sm:col-span-2">
            <h2 className="font-display text-xl font-semibold">Do this next</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              {nextScenario.title} — {nextScenario.subtitle.toLowerCase()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/lessons/$slug" params={{ slug: nextScenario.slug }}>
                  Start scenario
                </Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link to="/practice">Practice questions</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/mock-test">Take a mock road test</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-display text-xl font-semibold">Weakest topics</h2>
          {readiness.weakest.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              Answer a few practice questions and your weak spots will show up here.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {readiness.weakest.map((t) => (
                <li key={t.topic}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{t.topic}</span>
                    <span className="text-muted-foreground">{t.accuracy}%</span>
                  </div>
                  <div className="bg-secondary h-1.5 overflow-hidden rounded-full">
                    <div
                      className={t.accuracy >= 70 ? "bg-success h-full" : "bg-destructive h-full"}
                      style={{ width: `${t.accuracy}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-card p-5">
          <h2 className="font-display text-xl font-semibold">Recent mock road tests</h2>
          {mocks.length === 0 ? (
            <p className="text-muted-foreground mt-2 text-sm">
              No simulations yet. A mock test scores you the way an examiner would.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {mocks.slice(0, 5).map((m) => (
                <li key={m.id} className="border-border flex justify-between border-b pb-2 last:border-0">
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-muted-foreground text-xs tracking-[0.15em] uppercase">{label}</p>
      <p className="font-display mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}

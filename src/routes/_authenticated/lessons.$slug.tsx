import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { ScenarioPlayer } from "@/components/ScenarioPlayer";
import { Button } from "@/components/ui/button";
import { scenarioBySlug } from "@/data/scenarios";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSaveScenario } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/lessons/$slug")({
  loader: ({ params }) => {
    const scenario = scenarioBySlug(params.slug);
    if (!scenario) throw notFound();
    return { title: scenario.title, subtitle: scenario.subtitle };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Scenario"} — Shoulder Check` },
      { name: "description", content: loaderData?.subtitle ?? "Alberta driving scenario lesson." },
      { property: "og:title", content: `${loaderData?.title ?? "Scenario"} — Shoulder Check` },
      { property: "og:description", content: loaderData?.subtitle ?? "Alberta driving scenario lesson." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenarioPage,
  notFoundComponent: () => (
    <div className="py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">Scenario not found</h1>
      <Button className="mt-6" asChild>
        <Link to="/lessons">Back to scenarios</Link>
      </Button>
    </div>
  ),
  errorComponent: () => (
    <div className="py-20 text-center">
      <h1 className="font-display text-3xl font-semibold">This scenario didn't load</h1>
      <Button className="mt-6" asChild>
        <Link to="/lessons">Back to scenarios</Link>
      </Button>
    </div>
  ),
});

function ScenarioPage() {
  const { slug } = Route.useParams();
  const scenario = scenarioBySlug(slug)!;
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const save = useSaveScenario(user?.id);
  const locked = scenario.tier === "premium" && profile?.plan !== "premium";

  if (locked) {
    return (
      <div className="surface-card mx-auto max-w-xl p-8 text-center">
        <h1 className="font-display text-3xl font-semibold">{scenario.title}</h1>
        <p className="text-muted-foreground mt-2">
          This scenario is part of Premium, along with full road-test simulations and unlimited
          coaching.
        </p>
        <Button className="mt-6" asChild>
          <Link to="/plan">See Premium</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link to="/lessons" className="text-muted-foreground hover:text-foreground text-sm">
          ← All scenarios
        </Link>
        <p className="text-primary mt-4 text-xs font-semibold tracking-[0.2em] uppercase">
          {scenario.topic}
        </p>
        <h1 className="font-display mt-1 text-4xl font-semibold">{scenario.title}</h1>
        <p className="text-muted-foreground mt-1">{scenario.subtitle}</p>
      </div>

      <ScenarioPlayer
        scenario={scenario}
        onFinish={(score) => {
          if (!user) return;
          save.mutate(
            { slug: scenario.slug, score },
            {
              onSuccess: () => toast.success("Progress saved"),
              onError: () => toast.error("Could not save your progress"),
            },
          );
        }}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-display text-xl font-semibold">The Alberta rule</h2>
          <p className="mt-2 text-sm leading-relaxed">{scenario.rule}</p>
          <p className="text-muted-foreground mt-3 text-xs">{scenario.ruleSource}</p>
        </div>
        <div className="surface-card p-5">
          <h2 className="font-display text-xl font-semibold">What fails people here</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {scenario.faults.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-destructive">✕</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center gap-3 p-5">
        <p className="text-sm">Still unsure about part of this? Ask the coach about it.</p>
        <Button variant="secondary" asChild>
          <Link to="/coach" search={{ topic: scenario.title }}>
            Ask about {scenario.title.toLowerCase()}
          </Link>
        </Button>
      </div>
    </div>
  );
}

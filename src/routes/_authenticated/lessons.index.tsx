import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { scenarios } from "@/data/scenarios";
import { useAuth } from "@/hooks/useAuth";
import { scenarioProgressQuery, useProfile } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/lessons/")({
  head: () => ({
    meta: [
      { title: "Driving scenarios — Shoulder Check" },
      {
        name: "description",
        content:
          "Twelve photoreal Alberta driving scenarios: four-way stops, school zones, merges, winter roads, parallel parking and more.",
      },
      { property: "og:title", content: "Driving scenarios — Shoulder Check" },
      {
        property: "og:description",
        content: "Learn how to drive real Alberta situations, step by step, with a coach in the frame.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LessonsIndex,
});

function LessonsIndex() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: progress = [] } = useQuery(scenarioProgressQuery(user?.id));
  const isPremium = profile?.plan === "premium";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">Scenarios</h1>
        <p className="text-muted-foreground mt-1">
          Real Alberta situations, taught step by step. Watch the scene, learn what the examiner
          watches, then check yourself.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => {
          const done = progress.find((p) => p.scenario_slug === s.slug);
          const locked = s.tier === "premium" && !isPremium;
          return (
            <Link
              key={s.slug}
              to={locked ? "/plan" : "/lessons/$slug"}
              params={locked ? undefined : { slug: s.slug }}
              className="group border-border bg-card hover:border-primary/60 relative overflow-hidden rounded-2xl border transition-colors"
            >
              <div className="relative aspect-16/10 overflow-hidden">
                <img
                  src={s.image}
                  alt={s.title}
                  loading="lazy"
                  width={1536}
                  height={1024}
                  className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    locked ? "opacity-45 saturate-50" : ""
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-background/85 rounded-full px-2.5 py-0.5 text-xs backdrop-blur">
                    {s.topic}
                  </span>
                  {s.tier === "premium" && (
                    <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      Premium
                    </span>
                  )}
                  {s.clip && (
                    <span className="bg-accent text-accent-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      Video
                    </span>
                  )}
                </div>
                {done?.completed && (
                  <span className="bg-success text-success-foreground absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                    {done.score}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-display text-xl font-semibold">{s.title}</h2>
                <p className="text-muted-foreground mt-1 text-sm">{s.subtitle}</p>
                <p className="text-muted-foreground mt-3 text-xs tracking-wide uppercase">
                  {locked ? "Unlock with Premium" : `${s.minutes} min · ${s.steps.length} steps`}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

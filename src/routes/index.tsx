import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ReadinessRing } from "@/components/ReadinessRing";
import heroDriver from "@/assets/hero-driver.jpg";
import scenarioFourWayStop from "@/assets/scenario-four-way-stop.jpg";
import scenarioWinter from "@/assets/scenario-winter.jpg";
import scenarioRoundabout from "@/assets/scenario-roundabout.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shoulder Check — pass your Alberta road test with confidence" },
      {
        name: "description",
        content:
          "Photoreal Alberta driving scenarios, an AI driving coach, practice questions and mock road tests — with a readiness score that tells you when you're test-ready.",
      },
      { property: "og:title", content: "Shoulder Check — Alberta Class 5 road-test prep" },
      {
        property: "og:description",
        content:
          "Learn how to actually drive real Alberta situations, not just answer questions. Free to start.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
} as const;

const features = [
  {
    title: "Photoreal scenarios",
    body: "Real Alberta intersections, school zones, merges and winter roads — animated step by step so you see exactly what to do.",
  },
  {
    title: "AI driving coach",
    body: "Ask anything and get coached on how to perform it behind the wheel, not just the textbook answer.",
  },
  {
    title: "Readiness score",
    body: "A single 0–100 score built from your scenarios, practice accuracy and mock tests. Know when you're actually ready.",
  },
  {
    title: "Mock road test",
    body: "A full examiner-style simulation with demerits, mistake analysis and a pass/fail call at the end.",
  },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="border-border/70 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <span className="font-display flex items-center gap-2 text-lg font-semibold">
            <span className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-sm tracking-tight">
              SC
            </span>
            Shoulder Check
          </span>
          <nav className="text-muted-foreground ml-auto hidden items-center gap-5 text-sm sm:flex">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#scenarios" className="hover:text-foreground transition-colors">
              Scenarios
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <Button asChild size="sm">
            <Link to="/auth">Start free</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroDriver}
            alt="Driver checking over their shoulder on an Alberta road at dusk"
            className="h-full w-full object-cover"
          />
          <div className="from-background via-background/70 to-background/30 absolute inset-0 bg-gradient-to-t" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-24 sm:pt-36">
          <motion.p
            {...fadeUp}
            className="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
          >
            Alberta Class 5 road-test prep
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display mt-4 max-w-3xl text-5xl leading-tight font-semibold sm:text-6xl"
          >
            Learn how to actually drive. Not just answer questions.
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-5 max-w-xl text-lg"
          >
            Photoreal scenarios, an AI coach and a readiness score that tells you exactly when
            you're ready to book your road test.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Button asChild size="lg">
              <Link to="/auth">Start practising free</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#scenarios">See the scenarios</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold sm:text-4xl">
          Everything between you and a pass
        </motion.h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="surface-card p-5"
            >
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scenarios preview */}
      <section id="scenarios" className="border-border/60 border-y">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold sm:text-4xl">
            Real Alberta situations, taught step by step
          </motion.h2>
          <motion.p {...fadeUp} className="text-muted-foreground mt-3 max-w-2xl">
            Each scenario pans across the real scene while the coach walks you through mirrors,
            positioning, signals and what the examiner is watching for.
          </motion.p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { img: scenarioFourWayStop, label: "Four-way stops" },
              { img: scenarioWinter, label: "Winter driving" },
              { img: scenarioRoundabout, label: "Roundabouts" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-border relative overflow-hidden rounded-2xl border"
              >
                <img
                  src={s.img}
                  alt={`${s.label} scenario in Alberta`}
                  loading="lazy"
                  className="aspect-16/10 w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="font-display absolute bottom-3 left-4 text-lg font-semibold">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp} className="mt-8">
            <Button asChild variant="secondary">
              <Link to="/auth">Unlock all 12 scenarios</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Readiness */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:grid-cols-2">
        <motion.div {...fadeUp}>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Know you're ready before you book
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Your readiness score blends scenario mastery, practice accuracy and mock-test results.
            When it says "Test ready", you can book with confidence — no guessing, no wasted
            $95 test fees.
          </p>
          <Button asChild className="mt-6">
            <Link to="/auth">Get your score</Link>
          </Button>
        </motion.div>
        <motion.div {...fadeUp} className="flex justify-center">
          <ReadinessRing score={82} band="Test ready" size={220} />
        </motion.div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-border/60 border-t">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <motion.h2 {...fadeUp} className="font-display text-3xl font-semibold sm:text-4xl">
            Free to start. Premium when you're serious.
          </motion.h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <motion.div {...fadeUp} className="surface-card p-6">
              <h3 className="font-display text-2xl font-semibold">Free</h3>
              <p className="font-display mt-2 text-4xl font-semibold">$0</p>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>4 core scenarios</li>
                <li>Starter practice questions</li>
                <li>5 AI coach questions a day</li>
                <li>Short mock road test</li>
              </ul>
              <Button asChild variant="secondary" className="mt-6 w-full">
                <Link to="/auth">Create free account</Link>
              </Button>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="surface-card border-primary shadow-glow p-6"
            >
              <h3 className="font-display text-2xl font-semibold">Premium</h3>
              <p className="font-display mt-2 text-4xl font-semibold">
                $14.99<span className="text-muted-foreground text-base font-normal">/month</span>
              </p>
              <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                <li>All 12 photoreal scenarios</li>
                <li>Full question bank &amp; unlimited AI coaching</li>
                <li>Full 12-stage road-test simulation</li>
                <li>Mistake analysis &amp; readiness prediction</li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link to="/auth">Start with Premium</Link>
              </Button>
            </motion.div>
          </div>
          <motion.p {...fadeUp} className="text-muted-foreground mt-6 text-sm">
            Driving schools: equip every student for $29 per student with instructor progress
            reports.
          </motion.p>
        </div>
      </section>

      <footer className="text-muted-foreground border-border/60 border-t px-4 py-8 text-center text-xs">
        Shoulder Check is an independent study aid. It is not affiliated with, endorsed by, or
        connected to the Government of Alberta, any registry agent, or any driver examiner. Always
        confirm current rules in the Alberta Basic Licence Driver's Handbook.
      </footer>
    </div>
  );
}

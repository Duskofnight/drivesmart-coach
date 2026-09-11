import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useSetPlan } from "@/lib/progress";

export const Route = createFileRoute("/_authenticated/plan")({
  head: () => ({
    meta: [
      { title: "Plans & pricing — Shoulder Check" },
      {
        name: "description",
        content:
          "Free basics, Premium at $14.99/month for unlimited coaching and full road-test simulations, or a $29/student driving-school plan.",
      },
      { property: "og:title", content: "Plans & pricing — Shoulder Check" },
      {
        property: "og:description",
        content: "Free, Premium and driving-school plans for Alberta Class 5 road test preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Plan,
});

function Plan() {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const setPlan = useSetPlan(user?.id);
  const isPremium = profile?.plan === "premium";

  const activateTrial = () => {
    setPlan.mutate("premium", {
      onSuccess: () => toast.success("Premium trial active. Everything is unlocked."),
      onError: () => toast.error("Could not start the trial"),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl font-semibold">Plans</h1>
        <p className="text-muted-foreground mt-1">
          Card payments aren't connected yet, so you can switch on a Premium trial to try everything.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Tier
          name="Free"
          price="$0"
          note="Get started"
          features={[
            "4 core scenarios",
            "Starter practice questions",
            "5 coach questions a day",
            "Short mock road test",
          ]}
          current={!isPremium}
        />
        <Tier
          name="Premium"
          price="$14.99"
          note="per month"
          highlight
          features={[
            "All 12 photoreal scenarios",
            "Full practice question bank",
            "Unlimited AI coaching",
            "Full 12-stage road-test simulation",
            "Mistake analysis & readiness prediction",
            "Personalised training plan",
          ]}
          current={isPremium}
          action={
            isPremium ? undefined : (
              <Button className="w-full" onClick={activateTrial} disabled={setPlan.isPending}>
                Start Premium trial
              </Button>
            )
          }
        />
        <Tier
          name="Driving schools"
          price="$29"
          note="per student"
          features={[
            "Seats for every student",
            "Instructor progress dashboard",
            "Readiness reports before test day",
            "Practice between in-car lessons",
          ]}
          action={
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => toast.info("We'll wire up school sign-ups next.")}
            >
              Talk to us
            </Button>
          }
        />
      </div>

      {isPremium && (
        <Button
          variant="outline"
          onClick={() =>
            setPlan.mutate("free", { onSuccess: () => toast.success("Back on the free plan") })
          }
        >
          Switch back to free
        </Button>
      )}
    </div>
  );
}

function Tier({
  name,
  price,
  note,
  features,
  highlight,
  current,
  action,
}: {
  name: string;
  price: string;
  note: string;
  features: string[];
  highlight?: boolean;
  current?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`surface-card flex flex-col p-6 ${highlight ? "border-primary shadow-glow" : ""}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">{name}</h2>
        {current && (
          <span className="bg-success text-success-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
            Current
          </span>
        )}
      </div>
      <p className="font-display mt-3 text-4xl font-semibold">{price}</p>
      <p className="text-muted-foreground text-sm">{note}</p>
      <ul className="mt-5 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-success">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

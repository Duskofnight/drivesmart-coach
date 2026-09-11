import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Shoulder Check AI Driving Coach" },
      {
        name: "description",
        content:
          "Sign in to Shoulder Check to track your Alberta Class 5 road test readiness, practice scenarios and coaching.",
      },
      { property: "og:title", content: "Sign in — Shoulder Check" },
      {
        property: "og:description",
        content: "Track your Alberta road test readiness with your personal AI driving coach.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.navigate({ to: "/dashboard" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) router.navigate({ to: "/dashboard" });
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created. You're in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try email instead.");
      return;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display mb-8 flex items-center gap-2 text-xl font-semibold">
          <span className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-base">
            SC
          </span>
          Shoulder Check
        </Link>

        <div className="surface-card p-6">
          <h1 className="font-display text-3xl font-semibold">
            {mode === "signup" ? "Start practising" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "signup"
              ? "Free scenarios, practice questions and a daily AI coach."
              : "Pick up where you left off."}
          </p>

          <Button variant="secondary" className="mt-6 w-full" onClick={google}>
            Continue with Google
          </Button>

          <div className="text-muted-foreground my-5 flex items-center gap-3 text-xs uppercase">
            <span className="bg-border h-px flex-1" /> or <span className="bg-border h-px flex-1" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">First name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Working…" : mode === "signup" ? "Create my account" : "Sign in"}
            </Button>
          </form>

          <button
            className="text-muted-foreground hover:text-foreground mt-5 w-full text-center text-sm"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
          >
            {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          Independent study aid. Not affiliated with the Government of Alberta.
        </p>
      </div>
    </div>
  );
}

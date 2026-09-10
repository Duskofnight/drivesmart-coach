import { Link, useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/progress";

const nav = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/lessons", label: "Scenarios" },
  { to: "/practice", label: "Practice" },
  { to: "/mock-test", label: "Road test" },
  { to: "/coach", label: "AI coach" },
  { to: "/plan", label: "Plan" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <header className="border-border/70 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/dashboard" className="font-display flex items-center gap-2 text-lg font-semibold">
            <span className="bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-sm tracking-tight">
              SC
            </span>
            Shoulder Check
          </Link>
          <nav className="order-3 flex w-full flex-wrap gap-1 md:order-none md:w-auto">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md px-3 py-1.5 text-sm transition-colors [&.active]:bg-secondary [&.active]:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span
              className={
                profile?.plan === "premium"
                  ? "bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase"
                  : "border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-xs tracking-wide uppercase"
              }
            >
              {profile?.plan === "premium" ? "Premium" : "Free"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                await signOut();
                router.navigate({ to: "/" });
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="text-muted-foreground border-border/60 mx-auto mt-12 max-w-6xl border-t px-4 py-8 text-xs">
        Shoulder Check is an independent study aid. It is not affiliated with, endorsed by, or
        connected to the Government of Alberta, any registry agent, or any driver examiner. Always
        confirm current rules in the Alberta Basic Licence Driver's Handbook.
      </footer>
    </div>
  );
}

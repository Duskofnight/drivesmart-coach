import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useServerFn } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askCoach } from "@/lib/coach.functions";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/lib/progress";

type Msg = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/_authenticated/coach")({
  validateSearch: (search: Record<string, unknown>) => ({
    topic: typeof search.topic === "string" ? search.topic : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AI driving coach — Shoulder Check" },
      {
        name: "description",
        content:
          "Ask your AI driving coach about Alberta rules, road-test manoeuvres and how to actually perform them behind the wheel.",
      },
      { property: "og:title", content: "AI driving coach — Shoulder Check" },
      {
        property: "og:description",
        content: "Ask anything about Alberta driving and get coaching on how to do it, not just the answer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Coach,
});

const starters = [
  "How do I do a shoulder check properly?",
  "Walk me through parallel parking step by step",
  "What makes examiners fail people on left turns?",
  "How should I brake on icy Alberta roads?",
];

function Coach() {
  const { topic } = Route.useSearch();
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const ask = useServerFn(askCoach);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(topic ? `Coach me through ${topic.toLowerCase()}.` : "");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: message }]);
    setBusy(true);
    try {
      const res = await ask({ data: { message } });
      if (res.limited) {
        toast.error(res.reply);
        setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch {
      toast.error("The coach is unavailable right now. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold">AI driving coach</h1>
          <p className="text-muted-foreground mt-1">
            {profile?.plan === "premium"
              ? "Unlimited coaching on your plan."
              : "Free plan: 5 questions a day."}
          </p>
        </div>
        {profile?.plan !== "premium" && (
          <Button variant="secondary" asChild>
            <Link to="/plan">Go unlimited</Link>
          </Button>
        )}
      </div>

      <div className="surface-card flex min-h-[28rem] flex-col p-5">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div>
              <p className="text-muted-foreground text-sm">
                Ask about anything from mirror habits to merging on the Deerfoot.
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="border-border hover:border-primary/60 hover:bg-secondary rounded-lg border px-4 py-3 text-left text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {m.content}
            </div>
          ))}
          {busy && <p className="text-muted-foreground text-sm">Coach is thinking…</p>}
          <div ref={endRef} />
        </div>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your coach anything…"
          />
          <Button type="submit" disabled={busy}>
            Send
          </Button>
        </form>
      </div>

      <p className="text-muted-foreground text-xs">
        Coaching is study guidance only, not official Government of Alberta instruction. Always follow
        your instructor and posted signs.
      </p>
    </div>
  );
}

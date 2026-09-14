import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Scenario } from "@/data/scenarios";

type Props = {
  scenario: Scenario;
  onFinish: (score: number) => void;
};

export function ScenarioPlayer({ scenario, onFinish }: Props) {
  const total = scenario.steps.length;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startedAt = useRef<number>(Date.now());

  const current = scenario.steps[Math.min(step, total - 1)]!;
  const hold = current.hold ?? 7200;
  const isLast = step === total - 1;

  const goTo = useCallback((next: number) => {
    setStep(Math.max(0, Math.min(next, total - 1)));
    setElapsed(0);
    startedAt.current = Date.now();
  }, [total]);

  const next = useCallback(() => {
    if (isLast) {
      setPlaying(false);
      setQuizOpen(true);
      return;
    }
    goTo(step + 1);
  }, [isLast, goTo, step]);

  // Autoplay + visible progress. One interval, always cleaned up, never
  // able to leave the controls in a stuck state.
  useEffect(() => {
    if (!playing || quizOpen) return;
    startedAt.current = Date.now() - elapsed;
    const id = setInterval(() => {
      const spent = Date.now() - startedAt.current;
      if (spent >= hold) {
        if (isLast) {
          setPlaying(false);
          setQuizOpen(true);
        } else {
          setStep((s) => Math.min(s + 1, total - 1));
          setElapsed(0);
          startedAt.current = Date.now();
        }
      } else {
        setElapsed(spent);
      }
    }, 120);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, quizOpen, step, hold, isLast, total]);

  const restart = () => {
    setQuizOpen(false);
    setPicked(null);
    goTo(0);
    setPlaying(true);
  };

  const correct = picked !== null && picked === scenario.quiz.answer;
  const stepProgress = Math.min(100, (elapsed / hold) * 100);

  return (
    <div className="space-y-5">
      <div className="border-border relative overflow-hidden rounded-2xl border bg-black">
        <div className="relative aspect-16/10 w-full">
          {scenario.clip ? (
            <video
              key={`clip-${scenario.slug}`}
              src={scenario.clip}
              poster={scenario.image}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <motion.img
              key={`img-${step}`}
              src={scenario.image}
              alt={scenario.title}
              width={1536}
              height={1024}
              initial={{ scale: 1.04, opacity: 0.5 }}
              animate={{ scale: 1.12, opacity: 1 }}
              transition={{ duration: 8, ease: "linear" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          {/* Vignette so overlays stay readable */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_35%,rgba(0,0,0,0.72)_100%)]" />

          {/* Animated focus marker */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`focus-${step}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="pointer-events-none absolute"
              style={{ left: `${current.focus.x}%`, top: `${current.focus.y}%` }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <div className="border-primary focus-ring-pulse relative size-16 rounded-full border-2">
                  <span className="bg-primary absolute top-1/2 left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                </div>
                <span className="bg-primary text-primary-foreground absolute top-1/2 left-[calc(100%+10px)] -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold whitespace-nowrap">
                  {current.focus.label}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Coach narration */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`say-${step}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="bg-background/85 border-border max-w-2xl rounded-xl border p-4 backdrop-blur-md"
              >
                <p className="text-primary text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
                  Step {step + 1} of {total}
                </p>
                <p className="mt-1.5 text-base leading-snug">{current.say}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  <span className="text-foreground font-semibold">Examiner watches: </span>
                  {current.watch}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls */}
        <div className="border-border relative z-10 flex flex-wrap items-center gap-3 border-t px-4 py-3">
          <Button size="sm" variant="outline" onClick={() => goTo(step - 1)} disabled={step === 0}>
            Back
          </Button>
          <Button
            size="sm"
            variant={playing ? "secondary" : "default"}
            onClick={() => {
              if (quizOpen) {
                restart();
                return;
              }
              setPlaying((p) => !p);
            }}
          >
            {quizOpen ? "Replay" : playing ? "Pause" : "Play"}
          </Button>

          <div className="flex min-w-32 flex-1 gap-1.5">
            {scenario.steps.map((s, i) => (
              <button
                key={s.say}
                type="button"
                aria-label={`Step ${i + 1}`}
                onClick={() => {
                  setQuizOpen(false);
                  goTo(i);
                }}
                className="bg-secondary relative h-1.5 flex-1 overflow-hidden rounded-full"
              >
                <span
                  className="bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-150"
                  style={{
                    width: i < step || quizOpen ? "100%" : i === step ? `${stepProgress}%` : "0%",
                  }}
                />
              </button>
            ))}
          </div>

          <Button size="sm" onClick={next}>
            {isLast ? "Check yourself" : "Next"}
          </Button>
        </div>
      </div>

      {quizOpen && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface-card p-5"
        >
          <h3 className="font-display text-xl font-semibold">Check yourself</h3>
          <p className="mt-1 text-sm">{scenario.quiz.question}</p>
          <div className="mt-4 grid gap-2">
            {scenario.quiz.options.map((option, i) => {
              const state =
                picked === null
                  ? "idle"
                  : i === scenario.quiz.answer
                    ? "right"
                    : i === picked
                      ? "wrong"
                      : "idle";
              return (
                <button
                  key={option}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(i);
                    onFinish(i === scenario.quiz.answer ? 100 : 60);
                  }}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    state === "right"
                      ? "border-success bg-success/15 text-foreground"
                      : state === "wrong"
                        ? "border-destructive bg-destructive/15 text-foreground"
                        : "border-border hover:border-primary/60 hover:bg-secondary"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="border-border mt-4 rounded-lg border p-4 text-sm">
              <p className={correct ? "text-success font-semibold" : "text-destructive font-semibold"}>
                {correct ? "Correct." : "Not quite."}
              </p>
              <p className="mt-1">{scenario.quiz.why}</p>
              <Button className="mt-4" variant="secondary" onClick={restart}>
                Watch it again
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

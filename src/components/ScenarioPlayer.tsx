import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import type { Scenario } from "@/data/scenarios";

type Props = {
  scenario: Scenario;
  onFinish: (score: number) => void;
};

export function ScenarioPlayer({ scenario, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState<"scene" | "quiz" | "done">("scene");
  const [picked, setPicked] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = scenario.steps[step]!;
  const isLast = step === scenario.steps.length - 1;

  useEffect(() => {
    if (phase !== "scene" || !playing) return;
    timer.current = setTimeout(() => {
      if (isLast) {
        setPlaying(false);
        setPhase("quiz");
      } else {
        setStep((s) => s + 1);
      }
    }, current.hold ?? 7200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [step, playing, phase, isLast, current.hold]);

  const correct = picked !== null && picked === scenario.quiz.answer;

  return (
    <div className="space-y-5">
      <div className="border-border relative overflow-hidden rounded-2xl border bg-black">
        <div className="relative aspect-16/10 w-full">
          {scenario.clip && step === 0 ? (
            <video
              key="clip"
              src={scenario.clip}
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
              initial={{ scale: 1.04, opacity: 0.4 }}
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
              className="absolute"
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
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`say-${step}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="bg-background/85 border-border max-w-2xl rounded-xl border p-4 backdrop-blur-md"
              >
                <p className="text-primary text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
                  Step {step + 1} of {scenario.steps.length}
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

        {/* Timeline */}
        <div className="border-border flex items-center gap-3 border-t px-4 py-3">
          <Button
            size="sm"
            variant={playing ? "secondary" : "default"}
            onClick={() => {
              if (phase !== "scene") {
                setPhase("scene");
                setStep(0);
                setPicked(null);
              }
              setPlaying((p) => !p);
            }}
          >
            {phase !== "scene" ? "Replay" : playing ? "Pause" : "Play"}
          </Button>
          <div className="flex flex-1 gap-1.5">
            {scenario.steps.map((s, i) => (
              <button
                key={s.say}
                aria-label={`Step ${i + 1}`}
                onClick={() => {
                  setPhase("scene");
                  setStep(i);
                  setPlaying(false);
                }}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step && phase === "scene" ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setPlaying(false);
              if (isLast) setPhase("quiz");
              else setStep((s) => Math.min(s + 1, scenario.steps.length - 1));
            }}
          >
            {isLast ? "Check yourself" : "Next"}
          </Button>
        </div>
      </div>

      {phase !== "scene" && (
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
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(i);
                    setPhase("done");
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
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

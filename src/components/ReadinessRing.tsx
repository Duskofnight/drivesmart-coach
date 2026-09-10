type Props = {
  score: number;
  band: string;
  size?: number;
};

export function ReadinessRing({ score, band, size = 184 }: Props) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={10}
          className="stroke-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={score >= 80 ? "stroke-success" : score >= 55 ? "stroke-primary" : "stroke-destructive"}
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl leading-none font-semibold">{score}</span>
        <span className="text-muted-foreground mt-1 text-[0.7rem] tracking-[0.18em] uppercase">
          readiness
        </span>
        <span className="text-primary mt-2 text-sm font-medium">{band}</span>
      </div>
    </div>
  );
}

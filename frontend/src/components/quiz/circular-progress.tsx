import { motion } from "framer-motion";

export function CircularProgress({
  value,
  size = 160,
  stroke = 12,
  label,
  sublabel,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="quizProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-blue)" />
            <stop offset="50%" stopColor="var(--brand-indigo)" />
            <stop offset="100%" stopColor="var(--brand-purple)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-muted/40"
          opacity={0.25}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#quizProgressGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label}
        {sublabel}
      </div>
    </div>
  );
}

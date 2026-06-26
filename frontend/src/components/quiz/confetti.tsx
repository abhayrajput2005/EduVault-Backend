import { motion } from "framer-motion";
import { useMemo } from "react";

export function Confetti({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        duration: 1.8 + Math.random() * 1.2,
        color: ["#6366f1", "#a855f7", "#22c55e", "#f59e0b", "#ec4899"][i % 5],
        rotate: Math.random() * 360,
      })),
    [],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 1, y: -20, x: `${p.x}vw`, rotate: 0 }}
          animate={{ opacity: 0, y: "110vh", rotate: p.rotate + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className="absolute top-0 h-3 w-2 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  percentage: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  animate?: boolean;
}

const ProgressRing = ({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = '#00A651',
  trackColor = '#E5E7EB',
  label,
  sublabel,
  animate = true,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const dashOffset = circumference - (clampedPct / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!animate || !circleRef.current) return;
    const circle = circleRef.current;
    // Start fully offset (empty) then animate to target
    circle.style.strokeDashoffset = `${circumference}`;
    const timer = setTimeout(() => {
      circle.style.transition = 'stroke-dashoffset 1.5s ease-in-out';
      circle.style.strokeDashoffset = `${dashOffset}`;
    }, 100);
    return () => clearTimeout(timer);
  }, [circumference, dashOffset, animate]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            className="dark:stroke-gray-700"
          />
          {/* Progress fill */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animate ? circumference : dashOffset}
            style={!animate ? { strokeDashoffset: dashOffset } : {}}
          />
        </svg>
        {/* Center text */}
        {label && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-gray-900 dark:text-white leading-none"
            >
              {label}
            </motion.span>
            {sublabel && (
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sublabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;

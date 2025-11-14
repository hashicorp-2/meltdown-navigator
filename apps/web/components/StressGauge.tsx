'use client';

import { motion } from 'framer-motion';

export type StressLevel = 1 | 2 | 3 | 4 | 5;

interface StressGaugeProps {
  value: StressLevel;
  onChange: (level: StressLevel) => void;
}

export function StressGauge({ value, onChange }: StressGaugeProps) {
  const percentage = (value / 5) * 100;
  // Calculate angle for semi-circle (0 to 180 degrees)
  const angle = (percentage / 100) * 180;

  const getColor = (level: StressLevel) => {
    if (level === 5) return '#ef4444'; // red
    if (level === 4) return '#f97316'; // orange
    if (level === 3) return '#f59e0b'; // amber
    if (level === 2) return '#3b82f6'; // blue
    return '#10b981'; // emerald
  };

  const color = getColor(value);

  // Calculate end point of arc
  const centerX = 128;
  const centerY = 128;
  const radius = 112;
  const startAngle = 180; // Start from left (180 degrees)
  const endAngle = 180 - angle; // End angle based on value
  
  const startX = centerX - radius;
  const startY = centerY;
  const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
  const endY = centerY - radius * Math.sin((endAngle * Math.PI) / 180);
  
  const largeArcFlag = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-64 h-32">
        {/* Background semi-circle track */}
        <svg
          width="256"
          height="128"
          viewBox="0 0 256 128"
          className="absolute inset-0"
        >
          <path
            d="M 16 112 A 112 112 0 0 1 240 112"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="16"
            strokeLinecap="round"
            className="dark:stroke-gray-700"
          />
        </svg>

        {/* Filled semi-circle progress */}
        <svg
          width="256"
          height="128"
          viewBox="0 0 256 128"
          className="absolute inset-0"
        >
          <motion.path
            d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: percentage / 100 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Pointer indicator at end of arc */}
        <motion.div
          className="absolute"
          style={{
            left: `${(endX / 256) * 100}%`,
            top: `${(endY / 128) * 100}%`,
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center',
          }}
          animate={{
            left: `${(endX / 256) * 100}%`,
            top: `${(endY / 128) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[16px] border-l-transparent border-r-transparent"
            style={{ borderTopColor: color }}
          />
        </motion.div>

        {/* Droplet icon at start (left side) */}
        <div className="absolute left-0 bottom-0 -translate-x-1/2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ backgroundColor: color }}
          >
            <span className="text-[10px]">💧</span>
          </div>
        </div>
      </div>

      {/* Level display */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--color-ink)] dark:text-white">
          Stress
        </span>
        <span
          className="text-2xl font-bold"
          style={{ color }}
        >
          {value}/5
        </span>
      </div>
    </div>
  );
}


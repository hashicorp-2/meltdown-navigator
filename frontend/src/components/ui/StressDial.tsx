import { memo } from 'react';

export interface StressDialProps {
  /** Current stress level (1-5). */
  value: number;
  /** Label describing what the dial measures (e.g., "Stress"). */
  label?: string;
  /** Optional aria-label for accessibility when label is not visible. */
  ariaLabel?: string;
}

const SEGMENTS = 5;

/**
 * Renders a circular dial that visualizes stress level using concentric arcs,
 * inspired by Tiimo's focus timers. Designed for neurodivergent clarity.
 */
export const StressDial = memo(({ value, label = 'Stress', ariaLabel }: StressDialProps) => {
  const clampedValue = Math.min(Math.max(value, 0), SEGMENTS);
  const percentage = clampedValue / SEGMENTS;
  const strokeDasharray = `${percentage * 100} ${100 - percentage * 100}`;

  return (
    <figure
      className="relative flex size-44 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 via-white to-slate-50 shadow-xl"
      aria-label={ariaLabel ?? label}
    >
      <svg
        className="absolute inset-4"
        viewBox="0 0 36 36"
        role="presentation"
        aria-hidden="true"
      >
        <path
          className="fill-none stroke-slate-200/60"
          strokeWidth="3.6"
          strokeLinecap="round"
          d="M18 2.4a15.6 15.6 0 1 1 0 31.2 15.6 15.6 0 1 1 0-31.2"
        />
        <path
          className="fill-none stroke-indigo-500"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          d="M18 2.4a15.6 15.6 0 1 1 0 31.2 15.6 15.6 0 1 1 0-31.2"
        />
      </svg>
      <div className="relative z-10 flex size-28 flex-col items-center justify-center rounded-full bg-white text-slate-800 shadow-inner">
        <span className="text-xs uppercase tracking-[0.2em] text-indigo-400">{label}</span>
        <span className="text-3xl font-semibold text-indigo-600">{clampedValue}</span>
        <span className="text-sm text-slate-400">/5</span>
      </div>
      <figcaption className="absolute -bottom-8 flex items-center gap-2 text-sm text-indigo-600">
        <span className="inline-flex size-2 rounded-full bg-indigo-400" />
        <span>High awareness mode</span>
      </figcaption>
    </figure>
  );
});

StressDial.displayName = 'StressDial';








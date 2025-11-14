import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'sky' | 'sage' | 'rose' | 'sand' | 'amber' | 'none';
  muted?: boolean;
}

const ACCENT_STYLES: Record<Exclude<SectionCardProps['accent'], undefined>, string> = {
  sky: 'border-[rgba(126,156,203,0.45)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(15,23,42,0.65)]',
  sage: 'border-[rgba(168,216,185,0.5)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(15,23,42,0.65)]',
  rose: 'border-[rgba(232,180,184,0.5)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(15,23,42,0.65)]',
  sand: 'border-[rgba(244,211,196,0.5)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(15,23,42,0.65)]',
  amber: 'border-[rgba(240,180,91,0.5)] bg-white/80 backdrop-blur-sm dark:bg-[rgba(15,23,42,0.65)]',
  none: 'border-[var(--color-border)] bg-white/70 backdrop-blur-sm dark:bg-[rgba(11,22,38,0.7)]'
};

export function SectionCard({
  accent = 'none',
  muted = false,
  className,
  children,
  ...rest
}: SectionCardProps) {
  return (
    <section
      className={cn(
        'relative flex flex-col gap-4 rounded-[var(--radius-lg)] border px-6 py-6 shadow-[var(--shadow-soft)] transition-all duration-300 ease-out',
        ACCENT_STYLES[accent],
        muted && 'opacity-90',
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

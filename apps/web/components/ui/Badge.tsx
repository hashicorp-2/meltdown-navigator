import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type BadgeTone = 'sky' | 'sage' | 'rose' | 'sand' | 'ink';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const TONE_STYLES: Record<BadgeTone, string> = {
  sky: 'bg-[rgba(126,156,203,0.15)] text-[var(--color-sky)] border border-[rgba(126,156,203,0.4)]',
  sage: 'bg-[rgba(168,216,185,0.18)] text-[var(--color-success)] border border-[rgba(168,216,185,0.5)]',
  rose: 'bg-[rgba(232,180,184,0.18)] text-[var(--color-rose)] border border-[rgba(232,180,184,0.45)]',
  sand: 'bg-[rgba(244,211,196,0.2)] text-[var(--color-sand)] border border-[rgba(244,211,196,0.45)]',
  ink: 'bg-[rgba(17,24,39,0.08)] text-[var(--color-ink)] border border-[rgba(17,24,39,0.12)]'
};

export function Badge({ tone = 'sky', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] backdrop-blur-sm',
        TONE_STYLES[tone],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

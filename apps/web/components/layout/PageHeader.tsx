import * as React from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly eyebrow?: string;
  readonly badgeTone?: Parameters<typeof Badge>[0]['tone'];
  readonly actions?: React.ReactNode;
  readonly className?: string;
}

export function PageHeader({
  title,
  subtitle,
  eyebrow,
  badgeTone = 'sky',
  actions,
  className
}: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="flex flex-col gap-4">
        {eyebrow && <Badge tone={badgeTone}>{eyebrow}</Badge>}
        <h1 className="text-balance text-4xl font-semibold leading-tight tracking-[-0.01em] sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="max-w-2xl text-pretty text-base leading-7 text-[var(--color-muted)]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">{actions}</div>}
    </header>
  );
}

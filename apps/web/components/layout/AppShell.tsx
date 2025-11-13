import * as React from 'react';
import { cn } from '@/lib/utils/cn';

interface AppShellProps {
  readonly children: React.ReactNode;
  readonly className?: string;
}

export function AppShell({ children, className }: AppShellProps) {
  return (
    <div className="min-h-screen w-full bg-[var(--body-background)] text-[var(--body-foreground)]">
      <div className={cn('mx-auto flex w-full max-w-[var(--page-max-width)] flex-col gap-12 px-6 pb-24 pt-20 sm:px-10', className)}>
        {children}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'danger';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-sky)] text-[var(--color-ink)] hover:bg-[color-mix(in_oklab,var(--color-sky),#ffffff_12%)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-sky)]',
  secondary:
    'bg-[var(--color-sage)] text-[var(--color-ink)] hover:bg-[color-mix(in_oklab,var(--color-sage),#ffffff_12%)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-sage)]',
  ghost:
    'bg-transparent text-[var(--body-foreground)] hover:bg-[rgba(126,156,203,0.1)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgba(126,156,203,0.4)]',
  subtle:
    'bg-white/70 text-[var(--body-foreground)] shadow-sm hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-sky)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-[color-mix(in_oklab,var(--color-danger),#000000_12%)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-danger)]'
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-12 px-6 text-base'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading = false, icon, className, disabled, children, ...props },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transition-all duration-200 ease-out shadow-[var(--shadow-soft)] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none',
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          loading && 'relative text-transparent',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <span className="absolute inline-flex h-full w-full items-center justify-center text-xs font-medium text-[var(--body-foreground)]">
            Crafting…
          </span>
        )}
        {!loading && icon}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type FocusButtonVariant = 'primary' | 'secondary';

type FocusButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Visual style variant. */
  variant?: FocusButtonVariant;
  /** Emphasize button with glow (for key actions). */
  glow?: boolean;
};

const variantClasses: Record<FocusButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-500 via-indigo-500 to-purple-500 text-white shadow-[0_15px_30px_-10px_rgba(79,70,229,0.6)]',
  secondary:
    'border border-indigo-200 text-indigo-600 bg-white/80 hover:border-indigo-300 backdrop-blur-sm',
};

/**
 * A rounded, Tiimo-inspired button with gentle gradients and optional glow.
 */
export const FocusButton = forwardRef<HTMLButtonElement, FocusButtonProps>(
  ({ variant = 'primary', glow = false, className, children, ...rest }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300',
        variantClasses[variant],
        glow && 'after:absolute after:inset-0 after:rounded-full after:bg-indigo-400/20 after:blur-xl after:content-[""]',
        className,
      )}
      {...rest}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  ),
);

FocusButton.displayName = 'FocusButton';








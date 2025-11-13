import { TranslatorStep } from '../../../../common/types';

export interface VisualStepCardProps {
  /** Individual plan step returned from the translator. */
  step: TranslatorStep;
  /** Optional emoji/icon override to emphasize the step. */
  icon?: string;
  /** Index within the plan to show ordering. */
  position?: number;
}

const defaultIcons = ['💜', '🌿', '🤝', '🪄', '🎯'];

/**
 * Card component that surfaces a single communication step with iconography
 * and neurodivergent-friendly hierarchy.
 */
export function VisualStepCard({ step, icon, position }: VisualStepCardProps) {
  const symbol = icon ?? defaultIcons[(position ?? step.step_number - 1) % defaultIcons.length];

  return (
    <li className="group rounded-3xl border border-transparent bg-white/70 p-5 shadow-lg shadow-indigo-100 transition hover:border-indigo-200 hover:shadow-indigo-200/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-12 items-center justify-center rounded-full bg-indigo-50 text-2xl">
            {symbol}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Step {step.step_number}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
          </div>
        </div>
      </div>
      <p className="mt-3 text-slate-600">{step.rephrased_message}</p>
      <p className="mt-4 text-sm font-medium text-indigo-500">
        Pro tip: {step.pro_tip}
      </p>
    </li>
  );
}








import { useState } from 'react';
import { TranslatorResponseDTO } from '../../../../common/types';
import { VisualStepCard } from './VisualStepCard';

export interface CommunicationSummaryCardProps {
  /** Validated translator response. */
  plan: TranslatorResponseDTO;
  /** Optional label for copy button. */
  onCopyAll?: () => void;
}

const mediumIcons: Record<string, string> = {
  text: '💬',
  sms: '💬',
  'text message': '💬',
  call: '📞',
  phone: '📞',
  email: '📧',
  default: '💜',
};

const normalizeMedium = (value: string): string => value.toLowerCase().trim();

/**
 * Wraps the translated plan in a single card with recommended medium and
 * step list, mirroring the Tiimo-inspired visual hierarchy.
 */
export function CommunicationSummaryCard({ plan, onCopyAll }: CommunicationSummaryCardProps) {
  const [copied, setCopied] = useState(false);
  const mediumKey = normalizeMedium(plan.communication_medium);
  const mediumIcon = mediumIcons[mediumKey] ?? mediumIcons.default;

  const handleCopy = async () => {
    if (onCopyAll) {
      onCopyAll();
      return;
    }

    // Default copy behavior: copy all steps as formatted text
    const textToCopy = [
      `Communication Medium: ${plan.communication_medium}`,
      `Grounding Technique: ${plan.grounding_technique}`,
      '',
      'Steps:',
      ...plan.steps.map(
        (step) =>
          `\n${step.step_number}. ${step.title}\n${step.rephrased_message}\n💡 ${step.pro_tip}`,
      ),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <article className="rounded-4xl bg-white/80 p-6 shadow-2xl shadow-indigo-100 backdrop-blur-xl">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Recommended medium
          </p>
          <h2 className="mt-1 flex items-center gap-3 text-2xl font-semibold text-slate-900">
            <span className="flex size-10 items-center justify-center rounded-full bg-indigo-50 text-2xl">
              {mediumIcon}
            </span>
            <span className="capitalize">{plan.communication_medium}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600">{plan.grounding_technique}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="self-start rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-50"
        >
          {copied ? '✓ Copied!' : 'Copy plan'}
        </button>
      </header>

      <ul className="mt-6 space-y-4">
        {plan.steps.map((step, index) => (
          <VisualStepCard key={step.step_number} step={step} position={index} />
        ))}
      </ul>
    </article>
  );
}








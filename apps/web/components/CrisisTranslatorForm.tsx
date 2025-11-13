'use client';

import { useMemo, useState, useTransition } from 'react';
import { translateCrisis } from '@/app/actions/translateCrisis';
import type { TranslateCrisisResult } from '@/app/actions/translateCrisis';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface FormState {
  stressLevel: number;
  rawMessage: string;
  triggers: string;
  safeSpace: string;
  calmingItem: string;
  communicationStyle: string;
  supportContext: string;
}

const INITIAL_FORM_STATE: FormState = {
  stressLevel: 6,
  rawMessage: '',
  triggers: '',
  safeSpace: '',
  calmingItem: '',
  communicationStyle: '',
  supportContext: ''
};

interface ResultState {
  data?: TranslateCrisisResult;
  error?: string;
}

function buildProfile(form: FormState) {
  const triggers = form.triggers
    .split(',')
    .map((trigger) => trigger.trim())
    .filter(Boolean);

  return {
    triggers,
    safe_space: form.safeSpace,
    calming_item: form.calmingItem,
    communication_style: form.communicationStyle,
    support_network_context: form.supportContext
  } satisfies Record<string, unknown>;
}

export function CrisisTranslatorForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM_STATE);
  const [result, setResult] = useState<ResultState>({});
  const [isPending, startTransition] = useTransition();

  const isSubmitDisabled = useMemo(
    () =>
      isPending ||
      form.rawMessage.trim().length === 0 ||
      Number.isNaN(form.stressLevel) ||
      form.stressLevel < 1 ||
      form.stressLevel > 10,
    [form, isPending]
  );

  const handleChange = <T extends keyof FormState>(key: T, value: FormState[T]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const aiProfile = buildProfile(form);
        const response = await translateCrisis({
          stressLevel: form.stressLevel,
          rawMessage: form.rawMessage,
          aiProfile
        });
        setResult({ data: response, error: undefined });
      } catch (error) {
        console.error(error);
        setResult({
          data: undefined,
          error:
            error instanceof Error
              ? error.message
              : 'Something went wrong while translating your message. Please try again.'
        });
      }
    });
  };

  const handleReset = () => {
    setForm(INITIAL_FORM_STATE);
    setResult({});
  };

  return (
    <div className="flex flex-col gap-10 pb-24">
      <div className="flex flex-col gap-3">
        <Badge tone="sage">Crisis Translator</Badge>
        <p className="max-w-3xl text-base leading-7 text-[var(--color-muted)]">
          Transform dysregulated communication into clear, actionable, and empathetic support requests that
          align with your personalized profile. Share whatever is present—we will help craft it into a voice
          that invites connection.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <SectionCard accent="none" className="gap-7 p-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-[-0.01em]">Crisis Input</h2>
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Give us a sense of how intense things feel and what you want to express. You can keep it brief or
              pour it all out—we will honor the tone and translate it with care.
            </p>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Stress Level (1–10)</span>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={form.stressLevel}
                onChange={(event) => handleChange('stressLevel', Number(event.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r from-[rgba(232,180,184,0.6)] via-[rgba(240,180,91,0.6)] to-[rgba(88,176,131,0.6)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)]"
              />
              <span className="w-10 text-right text-sm font-semibold text-[var(--color-ink)] dark:text-white">
                {form.stressLevel}
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Raw Message</span>
            <textarea
              value={form.rawMessage}
              onChange={(event) => handleChange('rawMessage', event.target.value)}
              rows={6}
              placeholder="Share what you want to say in this moment—even if it's messy or intense."
              className="w-full rounded-[var(--radius-md)] border bg-white/90 p-4 text-sm text-[var(--color-ink)] shadow-sm transition-all focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
            />
          </label>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Triggers</span>
              <input
                value={form.triggers}
                onChange={(event) => handleChange('triggers', event.target.value)}
                placeholder="Comma separated (e.g. loud voices, being rushed)"
                className="rounded-[var(--radius-md)] border bg-white/90 px-4 py-3 text-sm text-[var(--color-ink)] shadow-sm focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Safe Space</span>
              <input
                value={form.safeSpace}
                onChange={(event) => handleChange('safeSpace', event.target.value)}
                placeholder="Where you feel grounded (e.g. quiet bedroom)"
                className="rounded-[var(--radius-md)] border bg-white/90 px-4 py-3 text-sm text-[var(--color-ink)] shadow-sm focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Calming Item</span>
              <input
                value={form.calmingItem}
                onChange={(event) => handleChange('calmingItem', event.target.value)}
                placeholder="Weighted blanket, music, breathing exercise..."
                className="rounded-[var(--radius-md)] border bg-white/90 px-4 py-3 text-sm text-[var(--color-ink)] shadow-sm focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium">Communication Style</span>
              <input
                value={form.communicationStyle}
                onChange={(event) => handleChange('communicationStyle', event.target.value)}
                placeholder="Direct, gentle, written, voice note, etc."
                className="rounded-[var(--radius-md)] border bg-white/90 px-4 py-3 text-sm text-[var(--color-ink)] shadow-sm focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Support Network Context</span>
            <textarea
              value={form.supportContext}
              onChange={(event) => handleChange('supportContext', event.target.value)}
              rows={3}
              placeholder="Who are you reaching out to? How do they usually respond?"
              className="w-full rounded-[var(--radius-md)] border bg-white/90 p-4 text-sm text-[var(--color-ink)] shadow-sm transition-all focus:border-[var(--color-sky)] focus:outline-none focus:ring-2 focus:ring-[rgba(126,156,203,0.35)] dark:bg-[rgba(15,23,42,0.75)] dark:text-white"
            />
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="button"
              variant="primary"
              loading={isPending}
              disabled={isSubmitDisabled}
              onClick={handleSubmit}
            >
              Translate Message
            </Button>
            <Button type="button" variant="ghost" onClick={handleReset} disabled={isPending}>
              Reset
            </Button>
          </div>

          {result.error ? (
            <SectionCard accent="rose" className="gap-2 border-dashed bg-[rgba(232,180,184,0.15)] text-sm text-[var(--color-rose)]">
              <span>{result.error}</span>
            </SectionCard>
          ) : null}
        </SectionCard>

        <SectionCard accent="sage" className="gap-6 p-8 text-[var(--color-success)]">
          <div className="flex flex-col gap-2 text-[var(--color-ink)] dark:text-white">
            <h2 className="text-xl font-semibold tracking-[-0.01em]">Translation Preview</h2>
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Your translated message will appear here with grounding techniques, recommended communication
              medium, follow-up suggestions, and safety notes when relevant.
            </p>
          </div>

          {result.data ? (
            <div className="flex flex-col gap-6 text-[var(--color-ink)] dark:text-white">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)]">
                  Translated Message
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-base leading-7">
                  {result.data.translatedMessage}
                </p>
              </div>

              {result.data.communicationMedium && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)]">
                    Recommended Medium
                  </h3>
                  <p className="mt-1 text-sm opacity-90">{result.data.communicationMedium}</p>
                </div>
              )}

              {result.data.groundingTechnique && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)]">
                    Grounding Technique
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm opacity-90">
                    {result.data.groundingTechnique}
                  </p>
                </div>
              )}

              {result.data.followUpSuggestion && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)]">
                    Follow-Up Suggestion
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm opacity-90">
                    {result.data.followUpSuggestion}
                  </p>
                </div>
              )}

              {result.data.safetyNote && (
                <SectionCard
                  accent="rose"
                  className="gap-2 border-dashed bg-white/80 text-sm text-[var(--color-rose)] dark:bg-[rgba(15,23,42,0.65)]"
                >
                  {result.data.safetyNote}
                </SectionCard>
              )}
            </div>
          ) : null}
        </SectionCard>
      </div>
    </div>
  );
}

'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { translateCrisis } from '@/app/actions/translateCrisis';
import type { TranslateCrisisResult } from '@/app/actions/translateCrisis';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VisualStressLanguage, type StressLevel } from '@/components/VisualStressLanguage';
import { StressGauge } from '@/components/StressGauge';
import { VisualPlanSteps } from '@/components/VisualPlanSteps';
import { ContextualEnvironment, type Environment } from '@/components/ContextualEnvironment';
import { CalmingInterventions } from '@/components/CalmingInterventions';
import { PredictiveAlert } from '@/components/PredictiveAlert';
import { CaregiverAlertButton } from '@/components/CaregiverAlertButton';
import { getProfileByUserId } from '@/lib/api';
import type { ProfileResponseDTO } from '@common/types';

interface FormState {
  stressLevel: StressLevel;
  environment: Environment;
  rawMessage: string;
  triggers: string;
  safeSpace: string;
  calmingItem: string;
  communicationStyle: string;
  supportContext: string;
}

const INITIAL_FORM_STATE: FormState = {
  stressLevel: 3,
  environment: 'unknown',
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
  const [profile, setProfile] = useState<ProfileResponseDTO | null>(null);

  // Load profile on mount
  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem('meltdown_userId');
        if (userId) {
          const userProfile = await getProfileByUserId(userId);
          setProfile(userProfile);
        }
      } catch (error) {
        console.warn('Could not load profile:', error);
      }
    };
    loadProfile();
  }, []);

  const isSubmitDisabled = useMemo(
    () =>
      isPending ||
      form.rawMessage.trim().length === 0 ||
      form.stressLevel < 1 ||
      form.stressLevel > 5,
    [form, isPending]
  );

  const handleChange = <T extends keyof FormState>(key: T, value: FormState[T]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        const aiProfile = buildProfile(form);
        // Convert 1-5 scale to 1-10 for backend compatibility
        const backendStressLevel = (form.stressLevel * 2) as 2 | 4 | 6 | 8 | 10;
        const response = await translateCrisis({
          stressLevel: backendStressLevel,
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

  // Calculate recent trend (simplified - in production, would use actual history)
  const recentTrend: 'increasing' | 'stable' | 'decreasing' = 
    form.stressLevel >= 4 ? 'increasing' : 'stable';

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* Predictive Alert */}
      <PredictiveAlert
        stressLevel={form.stressLevel}
        recentTrend={recentTrend}
        timeOfDay={new Date().getHours()}
        environment={form.environment}
        onSendAlert={() => {
          // Auto-trigger caregiver alert if user confirms
          if (profile && result.data) {
            // This would trigger the alert automatically
            console.log('Predictive alert: sending to caregivers');
          }
        }}
      />

      {/* Header */}
      <div className="flex flex-col gap-2">
        <Badge tone="sage" className="self-start">Crisis Translator</Badge>
        <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-ink)] dark:text-white tracking-tight">
          Grounded support, step by step.
        </h1>
        <p className="text-base leading-7 text-[var(--color-muted)] max-w-2xl">
          Input how you're feeling and we'll craft a calm, structured plan your caregiver can follow.
        </p>
      </div>

      {/* Two-Panel Layout - Matching reference design */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <SectionCard accent="none" className="gap-6 p-6 bg-white rounded-2xl shadow-lg dark:bg-[rgba(15,23,42,0.95)] backdrop-blur-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold tracking-[-0.01em] text-[var(--color-ink)] dark:text-white">
              Crisis Input
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Stress Gauge - Semi-circular like in the design */}
            <div className="flex flex-col gap-4 items-center py-4">
              <span className="text-sm font-semibold text-[var(--color-ink)] dark:text-white">
                How are you feeling right now?
              </span>
              <StressGauge
                value={form.stressLevel}
                onChange={(level) => handleChange('stressLevel', level)}
              />
            </div>

            <div className="flex flex-col gap-4">
              <ContextualEnvironment
                value={form.environment}
                onChange={(env) => handleChange('environment', env)}
                showLabel={true}
              />
            </div>
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Raw message</span>
            <div className="relative">
              <textarea
                value={form.rawMessage}
                onChange={(event) => handleChange('rawMessage', event.target.value)}
                rows={6}
                placeholder="Tell us what's happening..."
                className="w-full rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white p-4 text-sm text-[var(--color-ink)] shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-[rgba(15,23,42,0.75)] dark:text-white dark:focus:border-indigo-400"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Expand"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </label>

          {/* Simplified form - focus on core inputs */}
          <div className="hidden">
            {/* Keep these fields for backend but hide from UI for cleaner design */}
            <input
              value={form.triggers}
              onChange={(event) => handleChange('triggers', event.target.value)}
              placeholder="Triggers"
            />
            <input
              value={form.safeSpace}
              onChange={(event) => handleChange('safeSpace', event.target.value)}
              placeholder="Safe Space"
            />
            <input
              value={form.calmingItem}
              onChange={(event) => handleChange('calmingItem', event.target.value)}
              placeholder="Calming Item"
            />
            <input
              value={form.communicationStyle}
              onChange={(event) => handleChange('communicationStyle', event.target.value)}
              placeholder="Communication Style"
            />
            <textarea
              value={form.supportContext}
              onChange={(event) => handleChange('supportContext', event.target.value)}
              placeholder="Support Context"
            />
          </div>

          <Button
            type="button"
            variant="primary"
            loading={isPending}
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            className="w-full py-3 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg"
          >
            Translate to visual plan
          </Button>

          {result.error ? (
            <SectionCard accent="rose" className="gap-2 border-dashed bg-[rgba(232,180,184,0.15)] text-sm text-[var(--color-rose)]">
              <span>{result.error}</span>
            </SectionCard>
          ) : null}

          {/* Calming Interventions */}
          {form.stressLevel >= 2 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <CalmingInterventions
                stressLevel={form.stressLevel}
                onSelect={(technique) => {
                  console.log('Selected technique:', technique.name);
                  // Could show a modal with full steps here
                }}
              />
            </div>
          )}
        </SectionCard>

        <SectionCard accent="sage" className="gap-6 p-6 bg-white rounded-2xl shadow-lg dark:bg-[rgba(15,23,42,0.95)] backdrop-blur-sm">
          <div className="flex flex-col gap-2 text-[var(--color-ink)] dark:text-white">
            <h2 className="text-lg font-semibold tracking-[-0.01em]">Recommended Output</h2>
          </div>

          {result.data ? (
            <div className="flex flex-col gap-6 text-[var(--color-ink)] dark:text-white">
              {/* Recommended Medium */}
              {result.data.communicationMedium && (
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)] mb-2">
                    Recommended Medium
                  </h3>
                  <p className="text-base font-medium">{result.data.communicationMedium}</p>
                </div>
              )}

              {/* Translated Message - Matching reference style */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👥</span>
                  </div>
                  <p className="flex-1 text-sm leading-6 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                    {result.data.translatedMessage}
                  </p>
                </div>
              </div>

              {/* Visual Plan Steps - Matching reference design */}
              {result.data.translatedMessage && (
                <div className="mt-4">
                  <VisualPlanSteps
                    steps={[
                      {
                        stepNumber: 1,
                        title: 'Open softly',
                        message: result.data.translatedMessage.split('.')[0] || result.data.translatedMessage.substring(0, 100),
                        icon: '🏛️'
                      },
                      {
                        stepNumber: 2,
                        title: 'Name the need',
                        message: result.data.groundingTechnique?.substring(0, 80) || 'Express what you need right now',
                        icon: '📦'
                      },
                      {
                        stepNumber: 3,
                        title: 'Invite support',
                        message: result.data.followUpSuggestion?.substring(0, 80) || 'Ask for what you need',
                        icon: '⚙️'
                      }
                    ]}
                  />
                </div>
              )}

              {result.data.groundingTechnique && (
                <div className="bg-sage-50 dark:bg-sage-900/20 rounded-xl p-4 border border-sage-200 dark:border-sage-800">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-[rgba(17,24,39,0.55)] dark:text-[rgba(226,232,240,0.75)] mb-2">
                    Grounding Technique
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">{result.data.groundingTechnique}</p>
                </div>
              )}

              {result.data.safetyNote && (
                <SectionCard
                  accent="rose"
                  className="gap-2 border-dashed bg-rose-50 dark:bg-rose-900/20 text-sm text-rose-800 dark:text-rose-200"
                >
                  {result.data.safetyNote}
                </SectionCard>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleReset}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    // Copy to clipboard functionality
                    if (result.data?.translatedMessage) {
                      navigator.clipboard.writeText(result.data.translatedMessage);
                    }
                  }}
                >
                  Save Visual Plan
                </Button>
              </div>

              {/* Caregiver Alert Section */}
              {result.data && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <CaregiverAlertButton
                    profile={profile}
                    stressLevel={form.stressLevel}
                    rawMessage={form.rawMessage}
                    translationResult={{
                      translatedMessage: result.data.translatedMessage,
                      communicationMedium: result.data.communicationMedium,
                      groundingTechnique: result.data.groundingTechnique,
                      followUpSuggestion: result.data.followUpSuggestion,
                      safetyNote: result.data.safetyNote,
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--color-muted)]">
              <div className="text-4xl mb-3">💬</div>
              <p className="text-sm">Your translated message and visual plan will appear here</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

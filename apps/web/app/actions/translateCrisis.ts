'use server';

import { z } from 'zod';
import {
  createCrisisTranslatorAgent,
  type CrisisTranslatorOutput
} from '@meltdown/agents';
import { createAgentContext } from '@/lib/agents/context';
import { CRISIS_TRANSLATOR_SYSTEM_PROMPT } from '@/lib/agents/prompts';

const StressLevelSchema = z.number().min(1).max(10);

const CrisisTranslatorInputSchema = z.object({
  stressLevel: StressLevelSchema,
  rawMessage: z.string().min(1, 'Raw message is required'),
  aiProfile: z.object({}).catchall(z.unknown())
});

export type TranslateCrisisInput = z.infer<typeof CrisisTranslatorInputSchema>;
export type TranslateCrisisResult = CrisisTranslatorOutput;

export async function translateCrisis(input: TranslateCrisisInput): Promise<TranslateCrisisResult> {
  const payload = CrisisTranslatorInputSchema.parse(input);
  const context = createAgentContext();

  const agent = createCrisisTranslatorAgent({
    systemPrompt: CRISIS_TRANSLATOR_SYSTEM_PROMPT,
    context
  });

  return agent(payload, context);
}

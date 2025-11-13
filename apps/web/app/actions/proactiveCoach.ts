'use server';

import { z } from 'zod';
import { createProactiveCoachAgent, type ProactiveCoachOutput } from '@meltdown/agents';
import { createAgentContext } from '@/lib/agents/context';
import { PROACTIVE_COACH_SYSTEM_PROMPT } from '@/lib/agents/prompts';

const ProactiveCoachInputSchema = z.object({
  hrvData: z.object({}).catchall(z.unknown()),
  contextualData: z.object({}).catchall(z.unknown()),
  userProfile: z.object({}).catchall(z.unknown()),
  interventionHistory: z.array(z.object({}).catchall(z.unknown())).optional()
});

export type ProactiveCoachActionInput = z.infer<typeof ProactiveCoachInputSchema>;
export type ProactiveCoachActionResult = ProactiveCoachOutput;

export async function runProactiveCoach(
  input: ProactiveCoachActionInput
): Promise<ProactiveCoachActionResult> {
  const payload = ProactiveCoachInputSchema.parse(input);
  const context = createAgentContext();

  const agent = createProactiveCoachAgent({
    systemPrompt: PROACTIVE_COACH_SYSTEM_PROMPT,
    context
  });

  return agent(payload, context);
}

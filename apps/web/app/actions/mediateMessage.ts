'use server';

import { z } from 'zod';
import {
  createCommunicationMediatorAgent,
  type CommunicationMediatorOutput
} from '@meltdown/agents';
import { createAgentContext } from '@/lib/agents/context';
import { COMMUNICATION_MEDIATOR_SYSTEM_PROMPT } from '@/lib/agents/prompts';

const MediatorInputSchema = z.object({
  rawMessage: z.string().min(1, 'Raw message is required'),
  senderContext: z.string().min(1, 'Sender context is required'),
  recipientContext: z.string().min(1, 'Recipient context is required'),
  conversationHistory: z.array(z.string()).default([]),
  communicationGoal: z.string().optional()
});

export type MediateMessageInput = z.infer<typeof MediatorInputSchema>;
export type MediateMessageResult = CommunicationMediatorOutput;

export async function mediateMessage(input: MediateMessageInput): Promise<MediateMessageResult> {
  const payload = MediatorInputSchema.parse(input);

  const context = createAgentContext();
  const agent = createCommunicationMediatorAgent({
    systemPrompt: COMMUNICATION_MEDIATOR_SYSTEM_PROMPT,
    context
  });

  return agent(payload, context);
}

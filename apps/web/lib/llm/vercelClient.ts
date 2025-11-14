import { generateText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import type { LLMClient, LLMInvocationOptions } from '@meltdown/agents';

const DEFAULT_TEMPERATURE = Number(process.env.MELTDOWN_AI_TEMPERATURE ?? '0.7');
const DEFAULT_MAX_TOKENS = Number(process.env.MELTDOWN_AI_MAX_TOKENS ?? '1024');

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? process.env.VERCEL_AI_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? process.env.VERCEL_AI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

type InvocationPayload = {
  system_prompt: string;
  user_prompt: string;
};

type InvocationOptions = {
  temperature?: number;
  maxTokens?: number;
};

export class VercelAIClient implements LLMClient<InvocationPayload, string> {
  readonly model: string;

  constructor(model: string) {
    if (!model) {
      throw new Error('Model name is required for VercelAIClient');
    }
    this.model = model;
  }

  async invoke(payload: InvocationPayload, options?: LLMInvocationOptions): Promise<string> {
    const { system_prompt, user_prompt } = payload;

    if (!system_prompt || !user_prompt) {
      throw new Error('Both system_prompt and user_prompt are required for LLM invocation');
    }

    const provider = this.model.startsWith('claude')
      ? anthropic(this.model as any)
      : openai(this.model as any);

    const response = await generateText({
      model: provider as any,
      system: system_prompt,
      prompt: user_prompt,
      temperature: (options?.metadata as { temperature?: number })?.temperature ?? DEFAULT_TEMPERATURE,
      maxTokens: (options?.metadata as { maxTokens?: number })?.maxTokens ?? DEFAULT_MAX_TOKENS
    });

    return response.text;
  }
}

export function createVercelAIClient(model: string) {
  return new VercelAIClient(model);
}

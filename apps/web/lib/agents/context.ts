import type { AgentContext } from '@meltdown/agents';
import { createVercelAIClient } from '../llm/vercelClient';

const DEFAULT_MODEL = process.env.MELTDOWN_AI_MODEL ?? 'claude-3-5-sonnet';

export function createAgentContext(model: string = DEFAULT_MODEL): AgentContext {
  const llm = createVercelAIClient(model);
  return {
    llm,
    logger: {
      info(message, meta) {
        if (process.env.NODE_ENV !== 'production') {
          console.info(`[agent] ${message}`, meta ?? {});
        }
      },
      warn(message, meta) {
        console.warn(`[agent] ${message}`, meta ?? {});
      },
      error(message, meta) {
        console.error(`[agent] ${message}`, meta ?? {});
      }
    }
  };
}

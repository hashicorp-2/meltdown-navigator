import type { AgentContext } from './types.js';

export type AgentExecutor<TInput, TOutput> = (
  input: TInput,
  context?: AgentContext
) => Promise<TOutput>;

export interface AgentLifecycleHooks<TInput, TOutput> {
  beforeExecute?(input: TInput, context: AgentContext): Promise<void> | void;
  afterExecute?(output: TOutput, context: AgentContext): Promise<void> | void;
  onError?(error: unknown, context: AgentContext, input: TInput): Promise<void> | void;
}

export interface AgentFactoryConfig<TInput, TOutput> {
  readonly name: string;
  readonly executor: AgentExecutor<TInput, TOutput>;
  readonly hooks?: AgentLifecycleHooks<TInput, TOutput>;
}

export function createAgent<TInput, TOutput>(config: AgentFactoryConfig<TInput, TOutput>) {
  const { name, executor, hooks } = config;

  return async function runAgent(input: TInput, context: AgentContext): Promise<TOutput> {
    const safeContext = context ?? ({} as AgentContext);
    try {
      hooks?.beforeExecute && (await hooks.beforeExecute(input, safeContext));

      const output = await executor(input, safeContext);

      hooks?.afterExecute && (await hooks.afterExecute(output, safeContext));
      safeContext.logger?.info?.(`${name} agent executed successfully`);
      return output;
    } catch (error) {
      safeContext.logger?.error?.(`${name} agent failed`, { error });
      hooks?.onError && (await hooks.onError(error, safeContext, input));
      throw error;
    }
  };
}

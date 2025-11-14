import type { AgentContext } from './types.js';
export type AgentExecutor<TInput, TOutput> = (input: TInput, context?: AgentContext) => Promise<TOutput>;
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
export declare function createAgent<TInput, TOutput>(config: AgentFactoryConfig<TInput, TOutput>): (input: TInput, context: AgentContext) => Promise<TOutput>;
//# sourceMappingURL=baseAgent.d.ts.map
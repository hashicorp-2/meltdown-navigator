import { type AgentLifecycleHooks } from './baseAgent.js';
import type { AgentContext, ProactiveCoachInput, ProactiveCoachOutput } from './types.js';
export interface ProactiveCoachAgentConfig {
    readonly systemPrompt: string;
    readonly context: AgentContext;
    readonly hooks?: AgentLifecycleHooks<ProactiveCoachInput, ProactiveCoachOutput>;
}
export declare function createProactiveCoachAgent(config: ProactiveCoachAgentConfig): (input: ProactiveCoachInput, context: AgentContext) => Promise<ProactiveCoachOutput>;
//# sourceMappingURL=proactiveCoach.d.ts.map
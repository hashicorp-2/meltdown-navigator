import { type AgentLifecycleHooks } from './baseAgent.js';
import type { AgentContext, CommunicationMediatorInput, CommunicationMediatorOutput } from './types.js';
export interface CommunicationMediatorAgentConfig {
    readonly systemPrompt: string;
    readonly context: AgentContext;
    readonly hooks?: AgentLifecycleHooks<CommunicationMediatorInput, CommunicationMediatorOutput>;
}
export declare function createCommunicationMediatorAgent(config: CommunicationMediatorAgentConfig): (input: CommunicationMediatorInput, context: AgentContext) => Promise<CommunicationMediatorOutput>;
//# sourceMappingURL=communicationMediator.d.ts.map
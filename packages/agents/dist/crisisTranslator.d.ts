import { type AgentLifecycleHooks } from './baseAgent.js';
import type { AgentContext, CrisisTranslatorInput, CrisisTranslatorOutput } from './types.js';
export interface CrisisTranslatorAgentConfig {
    readonly systemPrompt: string;
    readonly context: AgentContext;
    readonly hooks?: AgentLifecycleHooks<CrisisTranslatorInput, CrisisTranslatorOutput>;
}
export declare function createCrisisTranslatorAgent(config: CrisisTranslatorAgentConfig): (input: CrisisTranslatorInput, context: AgentContext) => Promise<CrisisTranslatorOutput>;
//# sourceMappingURL=crisisTranslator.d.ts.map
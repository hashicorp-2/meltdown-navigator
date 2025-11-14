import { z } from 'zod';
import { createAgent, type AgentLifecycleHooks } from './baseAgent.js';
import type { AgentContext, ProactiveCoachInput, ProactiveCoachOutput } from './types.js';

const ProactiveCoachSchema = z.object({
  stressPrediction: z.object({
    predictedStressLevel: z.number().min(1).max(10),
    confidenceLevel: z.string(),
    timeToPotentialCrisis: z.string(),
    likelyTriggers: z.array(z.string())
  }),
  preventativeCoaching: z.object({
    immediateInterventions: z.array(z.string()),
    shortTermStrategies: z.array(z.string()),
    supportNetworkSuggestions: z.array(z.string()),
    environmentalChanges: z.array(z.string())
  }),
  notification: z.object({
    message: z.string(),
    urgency: z.enum(['low', 'moderate', 'high']),
    recommendedAction: z.string()
  })
});

export interface ProactiveCoachAgentConfig {
  readonly systemPrompt: string;
  readonly context: AgentContext;
  readonly hooks?: AgentLifecycleHooks<ProactiveCoachInput, ProactiveCoachOutput>;
}

function buildPrompt(input: ProactiveCoachInput): string {
  return [
    `HRV Data: ${JSON.stringify(input.hrvData, null, 2)}`,
    `Contextual Data: ${JSON.stringify(input.contextualData, null, 2)}`,
    `User Profile: ${JSON.stringify(input.userProfile, null, 2)}`,
    `Intervention History: ${JSON.stringify(input.interventionHistory ?? [], null, 2)}`,
    'Predict stress escalation and recommend preventative coaching as JSON matching the ProactiveCoachOutput schema.'
  ].join('\n\n');
}

export function createProactiveCoachAgent(config: ProactiveCoachAgentConfig) {
  const { systemPrompt, context, hooks } = config;

  return createAgent<ProactiveCoachInput, ProactiveCoachOutput>({
    name: 'ProactiveCoach',
    hooks,
    executor: async (input: ProactiveCoachInput, runtimeContext?: AgentContext) => {
      const resolvedContext: AgentContext = {
        ...context,
        ...runtimeContext,
        llm: runtimeContext?.llm ?? context.llm,
        memory: runtimeContext?.memory ?? context.memory,
        logger: runtimeContext?.logger ?? context.logger
      };

      const llmPayload = {
        system_prompt: systemPrompt,
        user_prompt: buildPrompt(input)
      };

      const result = await resolvedContext.llm.invoke(llmPayload);
      
      // Extract JSON from the response (handle markdown code blocks, etc.)
      let jsonString = typeof result === 'string' ? result : JSON.stringify(result);
      
      // Try to extract JSON from markdown code blocks
      const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                        jsonString.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        jsonString = jsonMatch[1] || jsonMatch[0];
      }
      
      let parsedData: unknown;
      try {
        parsedData = JSON.parse(jsonString.trim());
      } catch (parseError) {
        throw new Error(`Failed to parse JSON from LLM response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }
      
      const parsed = ProactiveCoachSchema.safeParse(parsedData);

      if (!parsed.success) {
        throw new Error(`ProactiveCoach output validation failed: ${parsed.error.message}`);
      }

      return parsed.data;
    }
  });
}

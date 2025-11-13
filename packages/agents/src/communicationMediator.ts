import { z } from 'zod';
import { createAgent, type AgentLifecycleHooks } from './baseAgent';
import type {
  AgentContext,
  CommunicationMediatorInput,
  CommunicationMediatorOutput
} from './types';

const CommunicationMediatorSchema = z.object({
  sentimentAnalysis: z.object({
    detectedEmotion: z.string(),
    escalationLevel: z.number().min(1).max(10),
    underlyingNeed: z.string()
  }),
  rephrasedMessage: z.string(),
  keyChanges: z.array(z.string()),
  toneShift: z.string(),
  timingSuggestion: z.string(),
  alternativePhrasings: z.array(z.string()).min(1)
});

export interface CommunicationMediatorAgentConfig {
  readonly systemPrompt: string;
  readonly context: AgentContext;
  readonly hooks?: AgentLifecycleHooks<CommunicationMediatorInput, CommunicationMediatorOutput>;
}

function buildPrompt(input: CommunicationMediatorInput): string {
  const {
    rawMessage,
    senderContext,
    recipientContext,
    conversationHistory = [],
    communicationGoal
  } = input;

  const history = conversationHistory.length
    ? conversationHistory.map((item, index) => `${index + 1}. ${item}`).join('\n')
    : 'None provided';

  return [
    `Raw Message: ${rawMessage}`,
    `Sender Context: ${senderContext}`,
    `Recipient Context: ${recipientContext}`,
    `Conversation History:\n${history}`,
    `Communication Goal: ${communicationGoal ?? 'unspecified'}`,
    'Return JSON adhering to the CommunicationMediatorOutput schema with clear, empathetic language.'
  ].join('\n\n');
}

export function createCommunicationMediatorAgent(config: CommunicationMediatorAgentConfig) {
  const { systemPrompt, context, hooks } = config;

  return createAgent<CommunicationMediatorInput, CommunicationMediatorOutput>({
    name: 'CommunicationMediator',
    hooks,
    executor: async (input, runtimeContext) => {
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
      
      const parsed = CommunicationMediatorSchema.safeParse(parsedData);

      if (!parsed.success) {
        throw new Error(`CommunicationMediator output validation failed: ${parsed.error.message}`);
      }

      return parsed.data;
    }
  });
}

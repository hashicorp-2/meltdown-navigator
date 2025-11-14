import { z } from 'zod';
import { createAgent } from './baseAgent.js';
const CrisisTranslatorSchema = z.object({
    translatedMessage: z.string(),
    communicationMedium: z.string().optional(),
    groundingTechnique: z.string().optional(),
    followUpSuggestion: z.string().optional(),
    safetyNote: z.string().optional()
});
function buildPrompt(input) {
    const { stressLevel, rawMessage, aiProfile } = input;
    const profileSummary = JSON.stringify(aiProfile, null, 2);
    return `USER INPUT:\n- Stress Level: ${stressLevel}\n- Raw Message: ${rawMessage}\n` +
        `- AI Profile Context: ${profileSummary}\n\n` +
        'IMPORTANT: Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) matching this schema:\n' +
        '{\n' +
        '  "translatedMessage": "string (required)",\n' +
        '  "communicationMedium": "string (optional)",\n' +
        '  "groundingTechnique": "string (optional)",\n' +
        '  "followUpSuggestion": "string (optional)",\n' +
        '  "safetyNote": "string (optional)"\n' +
        '}';
}
export function createCrisisTranslatorAgent(config) {
    const { systemPrompt, context, hooks } = config;
    return createAgent({
        name: 'CrisisTranslator',
        hooks,
        executor: async (input, runtimeContext) => {
            const resolvedContext = {
                ...context,
                ...runtimeContext,
                llm: runtimeContext?.llm ?? context.llm,
                memory: runtimeContext?.memory ?? context.memory,
                logger: runtimeContext?.logger ?? context.logger
            };
            const prompt = buildPrompt(input);
            const llmPayload = {
                system_prompt: systemPrompt,
                user_prompt: prompt
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
            let parsedData;
            try {
                parsedData = JSON.parse(jsonString.trim());
            }
            catch (parseError) {
                throw new Error(`Failed to parse JSON from LLM response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
            }
            const parsed = CrisisTranslatorSchema.safeParse(parsedData);
            if (!parsed.success) {
                throw new Error(`CrisisTranslator output validation failed: ${parsed.error.message}`);
            }
            if (input.stressLevel >= 8 && !parsed.data.safetyNote) {
                parsed.data.safetyNote = 'If you are in immediate danger, contact emergency services or a crisis hotline.';
            }
            return parsed.data;
        }
    });
}

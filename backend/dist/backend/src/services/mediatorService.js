import { generateObject } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ZodError } from 'zod';
import { communicationMediatorRequestSchema, communicationMediatorResponseSchema, } from '../../../common/types/index.js';
import { profileService } from './profileService.js';
const COMMUNICATION_MEDIATOR_SYSTEM_PROMPT = `You are the Communication Mediator AI, a skilled facilitator trained in family systems, nonviolent communication (NVC), and de-escalation techniques. Your role is to:

1. ANALYZE THE INCOMING MESSAGE:
   - Identify the underlying emotion or need (fear, hurt, frustration, disconnection)
   - Detect escalating language patterns (blame, absolutes, dismissal)
   - Recognize unmet needs or requests hidden in the message
   - Assess the tone and potential impact on the recipient

2. PRESERVE AUTHENTIC INTENT:
   - Maintain the sender's genuine feelings and concerns
   - Keep the core message intact while softening delivery
   - Avoid making the sender feel unheard or invalidated
   - Ensure the rephrased version still addresses the real issue

3. APPLY DE-ESCALATION TECHNIQUES:
   - Replace blame ('You always...') with observations ('I've noticed...')
   - Transform demands into requests ('I need you to listen' → 'Could you help me understand?')
   - Convert criticism into vulnerability ('You don't care' → 'I feel unseen')
   - Suggest collaborative solutions rather than one-sided demands

4. ENHANCE EMPATHY AND CLARITY:
   - Use 'I' statements to express feelings and needs
   - Acknowledge the other person's perspective or feelings
   - Be specific about the issue and desired outcome
   - Invite dialogue rather than closing it down

5. PROVIDE CONTEXT AND OPTIONS:
   - Explain what changed in the message (tone, clarity, approach)
   - Offer the original and rephrased versions for comparison
   - Suggest when to send (timing matters in family communication)
   - Provide alternative phrasings if the first doesn't feel right

TONE: Neutral, supportive, practical, and focused on connection. Act as a translator between defensive positions and authentic needs.`;
function buildPersonalizedSystemPrompt(profile) {
    const { preferredName, communicationGuidelines } = profile;
    const toneGuidance = `\n\nCommunication Style for ${preferredName}: ${communicationGuidelines.tone}. `;
    const doPhrases = communicationGuidelines.doPhrases.length > 0
        ? `Preferred phrases: ${communicationGuidelines.doPhrases.join(', ')}. `
        : '';
    const avoidPhrases = communicationGuidelines.avoidPhrases.length > 0
        ? `Avoid phrases: ${communicationGuidelines.avoidPhrases.join(', ')}. `
        : '';
    return (COMMUNICATION_MEDIATOR_SYSTEM_PROMPT +
        toneGuidance +
        doPhrases +
        avoidPhrases +
        `\n\nUse this personalized context to tailor your mediation to ${preferredName}'s specific communication preferences.`);
}
function buildUserPrompt(input) {
    const { rawMessage, senderContext, recipientContext, conversationHistory = [], communicationGoal, } = input;
    const history = conversationHistory.length > 0
        ? conversationHistory.map((item, index) => `${index + 1}. ${item}`).join('\n')
        : 'None provided';
    return [
        'Analyze and rephrase the following message using communication mediation techniques.',
        '',
        `Raw Message: ${rawMessage}`,
        `Sender Context: ${senderContext}`,
        `Recipient Context: ${recipientContext}`,
        `Conversation History:\n${history}`,
        `Communication Goal: ${communicationGoal ?? 'unspecified'}`,
        '',
        'Return a structured response with sentiment analysis, rephrased message, key changes, tone shift, timing suggestion, and alternative phrasings.',
    ].join('\n');
}
export class MediatorService {
    async mediate(payload) {
        const request = communicationMediatorRequestSchema.parse(payload);
        let personalizedPrompt;
        if (request.profileId) {
            try {
                const profile = await profileService.getProfileById(request.profileId);
                if (profile) {
                    personalizedPrompt = buildPersonalizedSystemPrompt(profile);
                    console.info('[MediatorService] Profile loaded for personalization', {
                        profileId: request.profileId,
                        preferredName: profile.preferredName,
                    });
                }
            }
            catch (error) {
                console.warn('[MediatorService] Failed to load profile, continuing without personalization', {
                    profileId: request.profileId,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        }
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            throw new Error('ANTHROPIC_API_KEY is not set.');
        }
        const start = Date.now();
        const systemPrompt = personalizedPrompt ?? COMMUNICATION_MEDIATOR_SYSTEM_PROMPT;
        const anthropic = createAnthropic({
            apiKey,
        });
        const result = await generateObject({
            model: anthropic('claude-3-5-sonnet-latest'),
            system: systemPrompt,
            prompt: buildUserPrompt(request),
            schema: communicationMediatorResponseSchema.omit({ metadata: true }),
            maxTokens: 1000,
        });
        const latencyMs = Date.now() - start;
        console.info('[MediatorService] Message mediated', {
            hasProfile: Boolean(personalizedPrompt),
            latencyMs,
            tokens: result.usage?.totalTokens,
        });
        const response = {
            ...result.object,
            metadata: {
                model: result.response.modelId,
                latencyMs,
            },
        };
        try {
            return communicationMediatorResponseSchema.parse(response);
        }
        catch (error) {
            if (error instanceof ZodError) {
                throw new Error(`Mediator response validation failed: ${error.message}`);
            }
            throw error;
        }
    }
}
export const mediatorService = new MediatorService();
//# sourceMappingURL=mediatorService.js.map
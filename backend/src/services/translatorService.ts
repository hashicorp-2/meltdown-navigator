import { generateObject } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { ZodError } from 'zod';
import {
  TranslatorRequestDTO,
  TranslatorResponseDTO,
  translatorRequestSchema,
  translatorResponseSchema,
} from '../../../common/types/index.js';
import { profileService } from './profileService.js';

export interface CrisisTranslatorClient {
  generatePlan(input: TranslatorRequestDTO, systemPromptOverride?: string): Promise<unknown>;
}

const VISUAL_COMMUNICATION_SYSTEM_PROMPT = `You are the Crisis Translator AI, a compassionate and intelligent assistant. Your role is to help individuals in emotional distress communicate their needs clearly and empathetically. When a user provides a raw message, you will not return a single translated message. Instead, you will generate a structured 'Visual Communication Plan' in JSON format. This plan breaks the communication into small, manageable steps to reduce cognitive load. Each step must have a title, a rephrased message, an icon suggestion, and a helpful pro-tip. You must also suggest a grounding technique and recommend a communication medium. Your tone is always calm, validating, and empowering. You are a wise ally who helps users navigate difficult conversations.`;

/**
 * Builds a personalized system prompt based on the user's AI profile.
 */
function buildPersonalizedSystemPrompt(profile: {
  preferredName: string;
  supportCircle: Array<{ name: string; relationship: string; contactMethod: string }>;
  communicationGuidelines: {
    tone: string;
    doPhrases: string[];
    avoidPhrases: string[];
  };
  crisisSignals: {
    triggers: string[];
    escalationIndicators: string[];
    selfRegulationTechniques: string[];
  };
}): string {
  const { preferredName, supportCircle, communicationGuidelines, crisisSignals } = profile;

  const supportContext =
    supportCircle.length > 0
      ? `\n\nSupport Circle: ${supportCircle.map((c) => `${c.name} (${c.relationship})`).join(', ')}.`
      : '';

  const toneGuidance = `\n\nCommunication Style: ${communicationGuidelines.tone}. `;
  const doPhrases =
    communicationGuidelines.doPhrases.length > 0
      ? `Preferred phrases: ${communicationGuidelines.doPhrases.join(', ')}. `
      : '';
  const avoidPhrases =
    communicationGuidelines.avoidPhrases.length > 0
      ? `Avoid phrases: ${communicationGuidelines.avoidPhrases.join(', ')}. `
      : '';

  const triggers =
    crisisSignals.triggers.length > 0
      ? `\n\nKnown Triggers: ${crisisSignals.triggers.join(', ')}. `
      : '';
  const techniques =
    crisisSignals.selfRegulationTechniques.length > 0
      ? `Preferred self-regulation techniques: ${crisisSignals.selfRegulationTechniques.join(', ')}. `
      : '';

  return (
    VISUAL_COMMUNICATION_SYSTEM_PROMPT +
    `\n\nPersonalized Context for ${preferredName}:` +
    supportContext +
    toneGuidance +
    doPhrases +
    avoidPhrases +
    triggers +
    techniques +
    `\n\nUse this personalized context to tailor your communication plan to ${preferredName}'s specific needs and preferences.`
  );
}

/**
 * Builds the user-facing portion of the AI prompt describing the
 * real-time context for the crisis translator.
 */
const buildUserPrompt = ({ rawMessage, stressLevel }: TranslatorRequestDTO): string => {
  return [
    'Build a visual communication plan for the following user context.',
    `Stress level (1-5): ${stressLevel}. Higher numbers mean the user is more overwhelmed.`,
    'Raw message provided by the user (verbatim):',
    `"""${rawMessage}"""`,
    'Follow the structure exactly as defined in the system instructions and deliver 2-3 thoughtful steps.',
  ].join('\n');
};

class VercelCrisisTranslatorClient implements CrisisTranslatorClient {
  constructor(private readonly systemPrompt: string = VISUAL_COMMUNICATION_SYSTEM_PROMPT) {}

  /**
   * Calls the Vercel AI SDK (Anthropic Claude 3.5 Sonnet) to generate a
   * structured communication plan for the provided request.
   *
   * @param input - Sanitized translator request payload.
   * @param systemPromptOverride - Optional system prompt override for personalization.
   * @returns Raw AI response payload prior to schema validation.
   */
  async generatePlan(
    input: TranslatorRequestDTO,
    systemPromptOverride?: string,
  ): Promise<unknown> {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set.');
    }

    const start = Date.now();
    const systemPrompt = systemPromptOverride ?? this.systemPrompt;

    const anthropic = createAnthropic({
      apiKey,
    });

    const result = await generateObject({
      model: anthropic('claude-3-5-sonnet-latest') as any,
      system: systemPrompt,
      prompt: buildUserPrompt(input),
      schema: translatorResponseSchema.omit({ metadata: true }),
      maxTokens: 800,
    });

    const latencyMs = Date.now() - start;

    console.info('[TranslatorService] AI plan generated', {
      stressLevel: input.stressLevel,
      hasProfile: Boolean(systemPromptOverride),
      latencyMs,
      tokens: result.usage?.totalTokens,
    });

    return {
      ...result.object,
      metadata: {
        model: result.response.modelId,
        latencyMs,
      },
    } satisfies TranslatorResponseDTO;
  }
}

const defaultClient = new VercelCrisisTranslatorClient();

/**
 * Encapsulates the orchestration of the Crisis Translator AI call and
 * response validation.
 */
export class TranslatorService {
  constructor(private readonly client: CrisisTranslatorClient = defaultClient) {}

  /**
   * Generates a visual communication plan by delegating to the configured
   * AI client and validating the structured response.
   *
   * @param payload - Raw translator request supplied by the controller.
   * @returns A validated translator response matching the shared schema.
   */
  async translate(payload: TranslatorRequestDTO): Promise<TranslatorResponseDTO> {
    const request = translatorRequestSchema.parse(payload);

    // Load profile if profileId is provided
    let personalizedPrompt: string | undefined;
    if (request.profileId) {
      try {
        const profile = await profileService.getProfileById(request.profileId);
        personalizedPrompt = buildPersonalizedSystemPrompt(profile);
        console.info('[TranslatorService] Profile loaded for personalization', {
          profileId: request.profileId,
          preferredName: profile.preferredName,
        });
      } catch (error) {
        console.warn('[TranslatorService] Failed to load profile, continuing without personalization', {
          profileId: request.profileId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        // Continue without personalization if profile load fails
      }
    }

    const response = await this.client.generatePlan(request, personalizedPrompt);

    try {
      const parsedResponse = translatorResponseSchema.parse(response);
      return parsedResponse;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new Error(`Translator response validation failed: ${error.message}`);
      }
      throw error;
    }
  }
}

export const translatorService = new TranslatorService();

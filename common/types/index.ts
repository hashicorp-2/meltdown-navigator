import { z } from 'zod';

export type ContactMethod = 'sms' | 'email' | 'call';
export type CommunicationTone = 'soft' | 'direct' | 'informative';

export interface SupportContact {
  name: string;
  relationship: string;
  contactMethod: ContactMethod;
}

export interface CommunicationGuidelines {
  tone: CommunicationTone;
  doPhrases: string[];
  avoidPhrases: string[];
}

export interface CrisisSignals {
  triggers: string[];
  escalationIndicators: string[];
  selfRegulationTechniques: string[];
}

export interface AiProfileDTO {
  userId: string;
  preferredName: string;
  supportCircle: SupportContact[];
  communicationGuidelines: CommunicationGuidelines;
  crisisSignals: CrisisSignals;
  createdAt: string;
  updatedAt: string;
}

export const translatorStepSchema = z.object({
  step_number: z.number().int().positive(),
  title: z.string().min(1),
  icon_suggestion: z.string().min(1),
  rephrased_message: z.string().min(1),
  pro_tip: z.string().min(1),
});

export const translatorResponseSchema = z.object({
  communication_medium: z.string().min(1),
  grounding_technique: z.string().min(1),
  steps: z.array(translatorStepSchema).min(1),
  metadata: z
    .object({
      model: z.string().optional(),
      latencyMs: z.number().positive().optional(),
    })
    .optional(),
});

export const translatorRequestSchema = z.object({
  rawMessage: z.string().min(1, 'rawMessage is required'),
  stressLevel: z
    .number()
    .int()
    .min(1)
    .max(5),
  profileId: z.string().min(1).optional(),
});

export type TranslatorStep = z.infer<typeof translatorStepSchema>;
export type TranslatorResponseDTO = z.infer<typeof translatorResponseSchema>;
export type TranslatorRequestDTO = z.infer<typeof translatorRequestSchema>;

// Profile schemas
export const supportContactSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  relationship: z.string().min(1, 'Relationship is required').trim(),
  contactMethod: z.enum(['sms', 'email', 'call']),
});

export const communicationGuidelinesSchema = z.object({
  tone: z.enum(['soft', 'direct', 'informative']).default('soft'),
  doPhrases: z.array(z.string()).default([]),
  avoidPhrases: z.array(z.string()).default([]),
});

export const crisisSignalsSchema = z.object({
  triggers: z.array(z.string()).default([]),
  escalationIndicators: z.array(z.string()).default([]),
  selfRegulationTechniques: z.array(z.string()).default([]),
});

export const createProfileRequestSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  preferredName: z.string().min(1, 'preferredName is required').trim(),
  supportCircle: z.array(supportContactSchema).max(5, 'Support circle cannot exceed five contacts').default([]),
  communicationGuidelines: communicationGuidelinesSchema.optional(),
  crisisSignals: crisisSignalsSchema.optional(),
});

export const updateProfileRequestSchema = createProfileRequestSchema.partial().extend({
  userId: z.string().min(1, 'userId is required'),
});

export const profileResponseSchema = z.object({
  userId: z.string(),
  preferredName: z.string(),
  supportCircle: z.array(supportContactSchema),
  communicationGuidelines: communicationGuidelinesSchema,
  crisisSignals: crisisSignalsSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  _id: z.string().optional(),
});

export type CreateProfileRequestDTO = z.infer<typeof createProfileRequestSchema>;
export type UpdateProfileRequestDTO = z.infer<typeof updateProfileRequestSchema>;
export type ProfileResponseDTO = z.infer<typeof profileResponseSchema>;

// Communication Mediator DTOs
export const sentimentAnalysisSchema = z.object({
  detectedEmotion: z.string().min(1),
  escalationLevel: z.number().int().min(1).max(10),
  underlyingNeed: z.string().min(1),
});

export const communicationMediatorRequestSchema = z.object({
  rawMessage: z.string().min(1, 'Raw message is required'),
  senderContext: z.string().min(1, 'Sender context is required'),
  recipientContext: z.string().min(1, 'Recipient context is required'),
  conversationHistory: z.array(z.string()).default([]),
  communicationGoal: z.string().optional(),
  profileId: z.string().min(1).optional(),
});

export const communicationMediatorResponseSchema = z.object({
  sentimentAnalysis: sentimentAnalysisSchema,
  rephrasedMessage: z.string().min(1),
  keyChanges: z.array(z.string()),
  toneShift: z.string().min(1),
  timingSuggestion: z.string().min(1),
  alternativePhrasings: z.array(z.string()).min(1),
  metadata: z
    .object({
      model: z.string().optional(),
      latencyMs: z.number().positive().optional(),
    })
    .optional(),
});

export type CommunicationMediatorRequestDTO = z.infer<
  typeof communicationMediatorRequestSchema
>;
export type CommunicationMediatorResponseDTO = z.infer<
  typeof communicationMediatorResponseSchema
>;
export type SentimentAnalysisDTO = z.infer<typeof sentimentAnalysisSchema>;

// Twilio/Crisis Alert DTOs
export const sendCrisisAlertRequestSchema = z.object({
  to: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use E.164 format (e.g., +1234567890)'),
  message: z.string().min(1, 'Message is required'),
  userName: z.string().optional(),
  stressLevel: z.number().int().min(1).max(5).optional(),
  actionNeeded: z.string().optional(),
});

export type SendCrisisAlertRequestDTO = z.infer<
  typeof sendCrisisAlertRequestSchema
>;

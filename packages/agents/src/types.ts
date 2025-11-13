export type ModelProvider =
  | 'claude-3-5-sonnet'
  | 'gpt-4.1-mini'
  | string;

export interface LLMInvocationOptions<T extends object = Record<string, any>> {
  readonly tools?: Record<string, unknown>;
  readonly metadata?: T;
}

export interface LLMClient<Input = unknown, Output = unknown> {
  readonly model: ModelProvider;
  invoke(payload: Input, options?: LLMInvocationOptions): Promise<Output>;
}

export interface AgentMemory {
  load<T>(key: string): Promise<T | undefined>;
  save<T>(key: string, value: T): Promise<void>;
  append?(key: string, value: unknown): Promise<void>;
}

export interface AgentContext {
  readonly llm: LLMClient;
  readonly memory?: AgentMemory;
  readonly logger?: {
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
  };
}

export interface CrisisTranslatorInput {
  stressLevel: number;
  rawMessage: string;
  aiProfile: Record<string, unknown>;
}

export interface CrisisTranslatorOutput {
  translatedMessage: string;
  communicationMedium?: string;
  groundingTechnique?: string;
  followUpSuggestion?: string;
  safetyNote?: string;
}

export interface CommunicationMediatorInput {
  rawMessage: string;
  senderContext: string;
  recipientContext: string;
  conversationHistory?: string[];
  communicationGoal?: string;
}

export interface SentimentAnalysisSummary {
  detectedEmotion: string;
  escalationLevel: number;
  underlyingNeed: string;
}

export interface CommunicationMediatorOutput {
  sentimentAnalysis: SentimentAnalysisSummary;
  rephrasedMessage: string;
  keyChanges: string[];
  toneShift: string;
  timingSuggestion: string;
  alternativePhrasings: string[];
}

export interface ProactiveCoachInput {
  hrvData: Record<string, unknown>;
  contextualData: Record<string, unknown>;
  userProfile: Record<string, unknown>;
  interventionHistory?: Array<Record<string, unknown>>;
}

export interface ProactiveCoachOutput {
  stressPrediction: {
    predictedStressLevel: number;
    confidenceLevel: string;
    timeToPotentialCrisis: string;
    likelyTriggers: string[];
  };
  preventativeCoaching: {
    immediateInterventions: string[];
    shortTermStrategies: string[];
    supportNetworkSuggestions: string[];
    environmentalChanges: string[];
  };
  notification: {
    message: string;
    urgency: 'low' | 'moderate' | 'high';
    recommendedAction: string;
  };
}

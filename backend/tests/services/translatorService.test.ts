import { ZodError } from 'zod';
import {
  TranslatorRequestDTO,
  TranslatorResponseDTO,
} from '../../../common/types/index.js';
import {
  TranslatorService,
  CrisisTranslatorClient,
} from '../../src/services/translatorService.js';

class FakeTranslatorClient implements CrisisTranslatorClient {
  constructor(private readonly response: unknown, private readonly delayMs = 0) {}

  async generatePlan(): Promise<unknown> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
    }
    return this.response;
  }
}

describe('TranslatorService', () => {
  const validRequest: TranslatorRequestDTO = {
    rawMessage: 'I need support right now.',
    stressLevel: 4,
  };

  const validResponse: TranslatorResponseDTO = {
    communication_medium: 'text',
    grounding_technique: 'Box breathing for 2 minutes',
    steps: [
      {
        step_number: 1,
        title: 'Open gently',
        icon_suggestion: 'text-bubble',
        rephrased_message: 'Hey, I’m feeling anxious and could use help sharing it.',
        pro_tip: 'Take a deep breath before you press send.',
      },
    ],
    metadata: {
      model: 'claude-3.5-sonnet',
      latencyMs: 800,
    },
  };

  it('delegates to client and returns validated response', async () => {
    const service = new TranslatorService(new FakeTranslatorClient(validResponse));

    const result = await service.translate(validRequest);

    expect(result).toEqual(validResponse);
  });

  it('passes through metadata without modification', async () => {
    const responseWithMetadata: TranslatorResponseDTO = {
      ...validResponse,
      metadata: {
        model: 'claude-special',
        latencyMs: 1500,
      },
    };

    const service = new TranslatorService(new FakeTranslatorClient(responseWithMetadata));

    const result = await service.translate(validRequest);

    expect(result.metadata).toEqual({ model: 'claude-special', latencyMs: 1500 });
  });

  it('throws when request schema fails validation', async () => {
    const service = new TranslatorService(new FakeTranslatorClient(validResponse));

    await expect(
      service.translate({ rawMessage: '', stressLevel: 1 }),
    ).rejects.toThrow(ZodError);
  });

  it('wraps response validation errors with descriptive message', async () => {
    const invalidResponse = {
      ...validResponse,
      steps: [],
    };

    const service = new TranslatorService(new FakeTranslatorClient(invalidResponse));

    await expect(service.translate(validRequest)).rejects.toThrow(
      'Translator response validation failed',
    );
  });

  it('rethrows non-Zod errors from the client', async () => {
    class ErroringClient implements CrisisTranslatorClient {
      async generatePlan(): Promise<unknown> {
        throw new Error('Network timeout');
      }
    }

    const service = new TranslatorService(new ErroringClient());

    await expect(service.translate(validRequest)).rejects.toThrow('Network timeout');
  });
});

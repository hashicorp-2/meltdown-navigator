import request from 'supertest';
import express, { ErrorRequestHandler } from 'express';
import routes from '../../src/api/routes/index.js';
import { translatorService } from '../../src/services/translatorService.js';
import { TranslatorResponseDTO } from '../../../common/types/index.js';

const buildFakePlan = (overrides: Partial<TranslatorResponseDTO> = {}): TranslatorResponseDTO => ({
  communication_medium: 'text',
  grounding_technique: 'Box breathing for 2 minutes',
  steps: [
    {
      step_number: 1,
      title: 'Open gently',
      icon_suggestion: 'text-bubble',
      rephrased_message: 'Hey, I’m feeling anxious and need a bit of help.',
      pro_tip: 'Pause and breathe before hitting send.',
    },
    {
      step_number: 2,
      title: 'Give context',
      icon_suggestion: 'notebook',
      rephrased_message: 'It’s been a heavy day and I could use a check-in.',
      pro_tip: 'If it feels too much, send one card at a time.',
    },
  ],
  metadata: {
    model: 'claude-3.5-sonnet-latest',
    latencyMs: 1200,
  },
  ...overrides,
});

describe('TranslatorController', () => {
  const mountApp = (errorHandler?: ErrorRequestHandler) => {
    const app = express();
    app.use(express.json());
    app.use('/api', routes);

    if (errorHandler) {
      app.use(errorHandler);
    }

    return app;
  };

  let translateSpy: jest.SpiedFunction<typeof translatorService.translate>;

  beforeEach(() => {
    translateSpy = jest.spyOn(translatorService, 'translate');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 200 with plan when service succeeds', async () => {
    const fakePlan = buildFakePlan();

    translateSpy.mockResolvedValueOnce(fakePlan);

    const response = await request(mountApp())
      .post('/api/translator')
      .send({ rawMessage: 'Help me', stressLevel: 3 });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fakePlan);
    expect(translateSpy).toHaveBeenCalledWith({
      rawMessage: 'Help me',
      stressLevel: 3,
    });
  });

  it('surfaces optional metadata when provided', async () => {
    const fakePlan = buildFakePlan({ metadata: { model: 'claude', latencyMs: 1500 } });

    translateSpy.mockResolvedValueOnce(fakePlan);

    const response = await request(mountApp())
      .post('/api/translator')
      .send({ rawMessage: 'Need help', stressLevel: 4 });

    expect(response.status).toBe(200);
    expect(response.body.metadata).toEqual({ model: 'claude', latencyMs: 1500 });
  });

  it('returns 400 when validation fails', async () => {
    const response = await request(mountApp())
      .post('/api/translator')
      .send({ stressLevel: 99 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid translator request.');
    expect(response.body).toHaveProperty('issues');
    expect(translateSpy).not.toHaveBeenCalled();
  });

  it('propagates service errors to error middleware', async () => {
    translateSpy.mockRejectedValueOnce(new Error('AI service unavailable'));

    const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
      res.status(503).json({ message: err.message });
    };

    const response = await request(mountApp(errorHandler))
      .post('/api/translator')
      .send({ rawMessage: 'Help me', stressLevel: 3 });

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ message: 'AI service unavailable' });
    expect(translateSpy).toHaveBeenCalledTimes(1);
  });
});

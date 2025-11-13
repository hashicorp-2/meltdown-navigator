import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AiProfileModel } from '../../src/models/AiProfile.js';

describe('AiProfileModel', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  const buildProfile = (overrides: Record<string, unknown> = {}) => {
    const baseProfile = {
      userId: 'user-123',
      preferredName: 'Sam',
      supportCircle: [
        {
          name: 'Alex',
          relationship: 'Partner',
          contactMethod: 'sms',
        },
      ],
      communicationGuidelines: {
        tone: 'soft',
        doPhrases: ['I statements'],
        avoidPhrases: ['Always', 'Never'],
      },
      crisisSignals: {
        triggers: ['Loud noises'],
        escalationIndicators: ['Short breathing'],
        selfRegulationTechniques: ['Box breathing'],
      },
    } as Record<string, unknown>;

    const payload = { ...baseProfile, ...overrides };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    return payload;
  };

  it('creates profile with required fields only', async () => {
    const profile = await AiProfileModel.create(
      buildProfile({
        supportCircle: undefined,
        communicationGuidelines: undefined,
        crisisSignals: undefined,
      }),
    );

    expect(profile.userId).toBe('user-123');
    expect(profile.preferredName).toBe('Sam');
    expect(profile.supportCircle).toEqual([]);
    expect(profile.communicationGuidelines.doPhrases).toEqual([]);
    expect(profile.communicationGuidelines.avoidPhrases).toEqual([]);
    expect(profile.crisisSignals.triggers).toEqual([]);
    expect(profile.createdAt).toBeInstanceOf(Date);
    expect(profile.updatedAt).toBeInstanceOf(Date);
  });

  it('accepts full profile with support circle and guidelines', async () => {
    const profile = await AiProfileModel.create(
      buildProfile({
        supportCircle: [
          {
            name: 'Alex',
            relationship: 'Partner',
            contactMethod: 'sms',
          },
          {
            name: 'Jordan',
            relationship: 'Therapist',
            contactMethod: 'call',
          },
        ],
      }),
    );

    expect(profile.supportCircle).toHaveLength(2);
    expect(profile.communicationGuidelines.tone).toBe('soft');
    expect(profile.crisisSignals.selfRegulationTechniques).toContain('Box breathing');

    const serialized = profile.toObject({ versionKey: false });
    expect(serialized).toMatchObject({
      userId: 'user-123',
      preferredName: 'Sam',
      communicationGuidelines: expect.objectContaining({
        tone: 'soft',
      }),
    });
  });

  it('trims whitespace-heavy inputs', async () => {
    const profile = await AiProfileModel.create(
      buildProfile({
        preferredName: '   Sam   ',
        supportCircle: [
          {
            name: '   Alex   ',
            relationship: '   Partner   ',
            contactMethod: 'sms',
          },
        ],
      }),
    );

    expect(profile.preferredName).toBe('Sam');
    expect(profile.supportCircle[0].name).toBe('Alex');
    expect(profile.supportCircle[0].relationship).toBe('Partner');
  });

  it('updates timestamps when document changes', async () => {
    const profile = await AiProfileModel.create(buildProfile());
    const originalUpdatedAt = profile.updatedAt;

    profile.preferredName = 'Samira';
    await profile.save();

    expect(profile.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
  });

  it('rejects when support circle exceeds five', async () => {
    expect.assertions(2);

    const contacts = Array.from({ length: 6 }).map((_, index) => ({
      name: `Contact ${index}`,
      relationship: 'Friend',
      contactMethod: 'sms',
    }));

    try {
      await AiProfileModel.create(
        buildProfile({ supportCircle: contacts }),
      );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validatorError = error.errors['supportCircle'];

        if (validatorError instanceof mongoose.Error.ValidatorError) {
          expect(validatorError.properties?.path).toBe('supportCircle');
        }

        expect(error.message).toContain('Support circle cannot exceed five contacts.');
      } else {
        throw error;
      }
    }
  });

  it('rejects duplicate support contacts', async () => {
    expect.assertions(2);

    const duplicateContacts = [
      {
        name: 'Alex',
        relationship: 'Partner',
        contactMethod: 'sms',
      },
      {
        name: ' alex ',
        relationship: ' partner ',
        contactMethod: 'email',
      },
    ];

    try {
      await AiProfileModel.create(
        buildProfile({ supportCircle: duplicateContacts }),
      );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validatorError = error.errors['supportCircle'];

        if (validatorError instanceof mongoose.Error.ValidatorError) {
          expect(validatorError.properties?.path).toBe('supportCircle');
        }

        expect(error.message).toContain('Support circle contains duplicate contacts.');
      } else {
        throw error;
      }
    }
  });

  it('rejects invalid contactMethod enum', async () => {
    expect.assertions(2);

    try {
      await AiProfileModel.create(
        buildProfile({
          supportCircle: [
            {
              name: 'Alex',
              relationship: 'Partner',
              contactMethod: 'fax',
            },
          ],
        }),
      );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validatorError = error.errors['supportCircle'];

        if (validatorError instanceof mongoose.Error.ValidatorError) {
          expect(validatorError.kind).toBe('enum');
        }

        expect(error.message).toContain('`fax` is not a valid enum value');
      } else {
        throw error;
      }
    }
  });

  it('rejects invalid tone enum', async () => {
    expect.assertions(2);

    try {
      await AiProfileModel.create(
        buildProfile({
          communicationGuidelines: {
            tone: 'aggressive',
            doPhrases: [],
            avoidPhrases: [],
          },
        }),
      );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validatorError = error.errors['communicationGuidelines.tone'];

        if (validatorError instanceof mongoose.Error.ValidatorError) {
          expect(validatorError.kind).toBe('enum');
        }

        expect(error.message).toContain('`aggressive` is not a valid enum value');
      } else {
        throw error;
      }
    }
  });

  it('requires preferredName', async () => {
    expect.assertions(2);

    try {
      await AiProfileModel.create(
        buildProfile({ preferredName: undefined }),
      );
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const validatorError = error.errors['preferredName'];

        if (validatorError instanceof mongoose.Error.ValidatorError) {
          expect(validatorError.properties?.path).toBe('preferredName');
        }

        expect(error.message).toContain('`preferredName` is required');
      } else {
        throw error;
      }
    }
  });
});









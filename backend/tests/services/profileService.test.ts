import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ProfileService } from '../../src/services/profileService.js';
import type { CreateProfileRequestDTO, UpdateProfileRequestDTO } from '../../../common/types/index.js';

describe('ProfileService', () => {
  let mongoServer: MongoMemoryServer;
  let profileService: ProfileService;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    profileService = new ProfileService();
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

  const buildProfileRequest = (overrides: Partial<CreateProfileRequestDTO> = {}): CreateProfileRequestDTO => {
    return {
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
      ...overrides,
    };
  };

  describe('createProfile', () => {
    it('creates a new profile', async () => {
      const request = buildProfileRequest();

      const profile = await profileService.createProfile(request);

      expect(profile.userId).toBe('user-123');
      expect(profile.preferredName).toBe('Sam');
      expect(profile.supportCircle).toHaveLength(1);
      expect(profile.communicationGuidelines.tone).toBe('soft');
      expect(profile.crisisSignals.triggers).toContain('Loud noises');
      expect(profile._id).toBeDefined();
      expect(profile.createdAt).toBeDefined();
      expect(profile.updatedAt).toBeDefined();
    });

    it('creates a profile with minimal fields', async () => {
      const request = buildProfileRequest({
        supportCircle: [],
        communicationGuidelines: undefined,
        crisisSignals: undefined,
      });

      const profile = await profileService.createProfile(request);

      expect(profile.userId).toBe('user-123');
      expect(profile.preferredName).toBe('Sam');
      expect(profile.supportCircle).toEqual([]);
      expect(profile.communicationGuidelines.tone).toBe('soft');
      expect(profile.crisisSignals.triggers).toEqual([]);
    });

    it('throws error when profile already exists', async () => {
      const request = buildProfileRequest();

      await profileService.createProfile(request);

      await expect(profileService.createProfile(request)).rejects.toThrow(
        'Profile already exists for user: user-123',
      );
    });

    it('validates support circle max length', async () => {
      const request = buildProfileRequest({
        supportCircle: Array.from({ length: 6 }, (_, i) => ({
          name: `Contact ${i}`,
          relationship: 'Friend',
          contactMethod: 'sms' as const,
        })),
      });

      // This should fail at the schema validation level
      await expect(profileService.createProfile(request)).rejects.toThrow();
    });
  });

  describe('getProfileByUserId', () => {
    it('retrieves a profile by user ID', async () => {
      const request = buildProfileRequest();
      const created = await profileService.createProfile(request);

      const profile = await profileService.getProfileByUserId('user-123');

      expect(profile.userId).toBe('user-123');
      expect(profile._id).toBe(created._id);
    });

    it('throws error when profile not found', async () => {
      await expect(profileService.getProfileByUserId('nonexistent')).rejects.toThrow(
        'Profile not found for user: nonexistent',
      );
    });
  });

  describe('getProfileById', () => {
    it('retrieves a profile by profile ID', async () => {
      const request = buildProfileRequest();
      const created = await profileService.createProfile(request);

      const profile = await profileService.getProfileById(created._id!);

      expect(profile.userId).toBe('user-123');
      expect(profile._id).toBe(created._id);
    });

    it('throws error when profile not found', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      await expect(profileService.getProfileById(fakeId)).rejects.toThrow(`Profile not found: ${fakeId}`);
    });

    it('throws error when profile ID is invalid', async () => {
      await expect(profileService.getProfileById('invalid-id')).rejects.toThrow('Invalid profile ID: invalid-id');
    });
  });

  describe('updateProfile', () => {
    it('updates a profile', async () => {
      const request = buildProfileRequest();
      await profileService.createProfile(request);

      const update: UpdateProfileRequestDTO = {
        userId: 'user-123',
        preferredName: 'Samira',
        supportCircle: [
          {
            name: 'Jordan',
            relationship: 'Therapist',
            contactMethod: 'call',
          },
        ],
      };

      const updated = await profileService.updateProfile('user-123', update);

      expect(updated.preferredName).toBe('Samira');
      expect(updated.supportCircle).toHaveLength(1);
      expect(updated.supportCircle[0].name).toBe('Jordan');
    });

    it('updates only provided fields', async () => {
      const request = buildProfileRequest();
      const created = await profileService.createProfile(request);

      const update: UpdateProfileRequestDTO = {
        userId: 'user-123',
        preferredName: 'Samira',
      };

      const updated = await profileService.updateProfile('user-123', update);

      expect(updated.preferredName).toBe('Samira');
      expect(updated.supportCircle).toEqual(created.supportCircle);
      expect(updated.communicationGuidelines.tone).toBe(created.communicationGuidelines.tone);
    });

    it('throws error when profile not found', async () => {
      const update: UpdateProfileRequestDTO = {
        userId: 'nonexistent',
        preferredName: 'New Name',
      };

      await expect(profileService.updateProfile('nonexistent', update)).rejects.toThrow(
        'Profile not found for user: nonexistent',
      );
    });
  });

  describe('deleteProfile', () => {
    it('deletes a profile', async () => {
      const request = buildProfileRequest();
      await profileService.createProfile(request);

      await profileService.deleteProfile('user-123');

      await expect(profileService.getProfileByUserId('user-123')).rejects.toThrow();
    });

    it('throws error when profile not found', async () => {
      await expect(profileService.deleteProfile('nonexistent')).rejects.toThrow(
        'Profile not found for user: nonexistent',
      );
    });
  });

  describe('profileExists', () => {
    it('returns true when profile exists', async () => {
      const request = buildProfileRequest();
      await profileService.createProfile(request);

      const exists = await profileService.profileExists('user-123');

      expect(exists).toBe(true);
    });

    it('returns false when profile does not exist', async () => {
      const exists = await profileService.profileExists('nonexistent');

      expect(exists).toBe(false);
    });
  });
});


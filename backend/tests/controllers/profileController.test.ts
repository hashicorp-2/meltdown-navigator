import request from 'supertest';
import express, { ErrorRequestHandler } from 'express';
import routes from '../../src/api/routes/index.js';
import { profileService } from '../../src/services/profileService.js';
import type { ProfileResponseDTO } from '../../../common/types/index.js';

const buildFakeProfile = (overrides: Partial<ProfileResponseDTO> = {}): ProfileResponseDTO => ({
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  _id: '507f1f77bcf86cd799439011',
  ...overrides,
});

describe('ProfileController', () => {
  const mountApp = (errorHandler?: ErrorRequestHandler) => {
    const app = express();
    app.use(express.json());
    app.use('/api', routes);

    if (errorHandler) {
      app.use(errorHandler);
    }

    return app;
  };

  let createProfileSpy: jest.SpiedFunction<typeof profileService.createProfile>;
  let getProfileByUserIdSpy: jest.SpiedFunction<typeof profileService.getProfileByUserId>;
  let getProfileByIdSpy: jest.SpiedFunction<typeof profileService.getProfileById>;
  let updateProfileSpy: jest.SpiedFunction<typeof profileService.updateProfile>;
  let deleteProfileSpy: jest.SpiedFunction<typeof profileService.deleteProfile>;
  let profileExistsSpy: jest.SpiedFunction<typeof profileService.profileExists>;

  beforeEach(() => {
    createProfileSpy = jest.spyOn(profileService, 'createProfile');
    getProfileByUserIdSpy = jest.spyOn(profileService, 'getProfileByUserId');
    getProfileByIdSpy = jest.spyOn(profileService, 'getProfileById');
    updateProfileSpy = jest.spyOn(profileService, 'updateProfile');
    deleteProfileSpy = jest.spyOn(profileService, 'deleteProfile');
    profileExistsSpy = jest.spyOn(profileService, 'profileExists');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/profiles', () => {
    it('returns 201 with created profile', async () => {
      const fakeProfile = buildFakeProfile();
      createProfileSpy.mockResolvedValueOnce(fakeProfile);

      const response = await request(mountApp())
        .post('/api/profiles')
        .send({
          userId: 'user-123',
          preferredName: 'Sam',
          supportCircle: [
            {
              name: 'Alex',
              relationship: 'Partner',
              contactMethod: 'sms',
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(fakeProfile);
      expect(createProfileSpy).toHaveBeenCalledWith({
        userId: 'user-123',
        preferredName: 'Sam',
        supportCircle: [
          {
            name: 'Alex',
            relationship: 'Partner',
            contactMethod: 'sms',
          },
        ],
      });
    });

    it('returns 400 when validation fails', async () => {
      const response = await request(mountApp()).post('/api/profiles').send({
        userId: 'user-123',
        // missing preferredName
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Invalid profile request.');
      expect(response.body).toHaveProperty('issues');
      expect(createProfileSpy).not.toHaveBeenCalled();
    });

    it('returns 409 when profile already exists', async () => {
      createProfileSpy.mockRejectedValueOnce(new Error('Profile already exists for user: user-123'));

      const response = await request(mountApp())
        .post('/api/profiles')
        .send({
          userId: 'user-123',
          preferredName: 'Sam',
        });

      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        message: 'Profile already exists for user: user-123',
      });
    });
  });

  describe('GET /api/profiles/:userId', () => {
    it('returns 200 with profile', async () => {
      const fakeProfile = buildFakeProfile();
      getProfileByUserIdSpy.mockResolvedValueOnce(fakeProfile);

      const response = await request(mountApp()).get('/api/profiles/user-123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeProfile);
      expect(getProfileByUserIdSpy).toHaveBeenCalledWith('user-123');
    });

    it('returns 404 when profile not found', async () => {
      getProfileByUserIdSpy.mockRejectedValueOnce(new Error('Profile not found for user: nonexistent'));

      const response = await request(mountApp()).get('/api/profiles/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Profile not found for user: nonexistent',
      });
    });
  });

  describe('GET /api/profiles/id/:profileId', () => {
    it('returns 200 with profile', async () => {
      const fakeProfile = buildFakeProfile();
      getProfileByIdSpy.mockResolvedValueOnce(fakeProfile);

      const response = await request(mountApp()).get('/api/profiles/id/507f1f77bcf86cd799439011');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeProfile);
      expect(getProfileByIdSpy).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('returns 404 when profile not found', async () => {
      getProfileByIdSpy.mockRejectedValueOnce(new Error('Profile not found: 507f1f77bcf86cd799439011'));

      const response = await request(mountApp()).get('/api/profiles/id/507f1f77bcf86cd799439011');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Profile not found: 507f1f77bcf86cd799439011',
      });
    });

    it('returns 400 when profile ID is invalid', async () => {
      getProfileByIdSpy.mockRejectedValueOnce(new Error('Invalid profile ID: invalid-id'));

      const response = await request(mountApp()).get('/api/profiles/id/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: 'Invalid profile ID: invalid-id',
      });
    });
  });

  describe('PUT /api/profiles/:userId', () => {
    it('returns 200 with updated profile', async () => {
      const fakeProfile = buildFakeProfile({ preferredName: 'Samira' });
      updateProfileSpy.mockResolvedValueOnce(fakeProfile);

      const response = await request(mountApp())
        .put('/api/profiles/user-123')
        .send({
          preferredName: 'Samira',
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(fakeProfile);
      expect(updateProfileSpy).toHaveBeenCalledWith('user-123', {
        userId: 'user-123',
        preferredName: 'Samira',
      });
    });

    it('returns 404 when profile not found', async () => {
      updateProfileSpy.mockRejectedValueOnce(new Error('Profile not found for user: nonexistent'));

      const response = await request(mountApp())
        .put('/api/profiles/nonexistent')
        .send({
          preferredName: 'New Name',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Profile not found for user: nonexistent',
      });
    });
  });

  describe('DELETE /api/profiles/:userId', () => {
    it('returns 204 when profile is deleted', async () => {
      deleteProfileSpy.mockResolvedValueOnce(undefined);

      const response = await request(mountApp()).delete('/api/profiles/user-123');

      expect(response.status).toBe(204);
      expect(deleteProfileSpy).toHaveBeenCalledWith('user-123');
    });

    it('returns 404 when profile not found', async () => {
      deleteProfileSpy.mockRejectedValueOnce(new Error('Profile not found for user: nonexistent'));

      const response = await request(mountApp()).delete('/api/profiles/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: 'Profile not found for user: nonexistent',
      });
    });
  });

  describe('GET /api/profiles/:userId/exists', () => {
    it('returns 200 with exists: true', async () => {
      profileExistsSpy.mockResolvedValueOnce(true);

      const response = await request(mountApp()).get('/api/profiles/user-123/exists');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ exists: true });
      expect(profileExistsSpy).toHaveBeenCalledWith('user-123');
    });

    it('returns 200 with exists: false', async () => {
      profileExistsSpy.mockResolvedValueOnce(false);

      const response = await request(mountApp()).get('/api/profiles/nonexistent/exists');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ exists: false });
    });
  });
});


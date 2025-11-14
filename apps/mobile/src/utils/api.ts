import {
  TranslatorRequestDTO,
  TranslatorResponseDTO,
  translatorRequestSchema,
  translatorResponseSchema,
  CreateProfileRequestDTO,
  UpdateProfileRequestDTO,
  ProfileResponseDTO,
  createProfileRequestSchema,
  updateProfileRequestSchema,
  profileResponseSchema,
} from '../../../../common/types';

const DEFAULT_BACKEND_URL = 'http://localhost:4000';

const getBackendUrl = (): string => {
  // In React Native, we can use Constants from expo-constants or a config
  // For now, use environment variable or default
  return process.env.EXPO_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL;
};

export class TranslatorApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'TranslatorApiError';
  }
}

export class ProfileApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ProfileApiError';
  }
}

/**
 * Calls the backend translator endpoint and validates the structured response.
 */
export async function translateMessage(
  payload: TranslatorRequestDTO,
): Promise<TranslatorResponseDTO> {
  const body = translatorRequestSchema.parse(payload);

  const response = await fetch(`${getBackendUrl()}/api/translator`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Unexpected translator error';
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new TranslatorApiError(message, response.status);
  }

  const data = await response.json();
  return translatorResponseSchema.parse(data);
}

/**
 * Creates a new profile.
 */
export async function createProfile(
  payload: CreateProfileRequestDTO,
): Promise<ProfileResponseDTO> {
  const body = createProfileRequestSchema.parse(payload);

  const response = await fetch(`${getBackendUrl()}/api/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = 'Unexpected profile error';
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new ProfileApiError(message, response.status);
  }

  const data = await response.json();
  return profileResponseSchema.parse(data);
}

/**
 * Retrieves a profile by user ID.
 */
export async function getProfileByUserId(userId: string): Promise<ProfileResponseDTO> {
  const response = await fetch(`${getBackendUrl()}/api/profiles/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    let message = 'Unexpected profile error';
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new ProfileApiError(message, response.status);
  }

  const data = await response.json();
  return profileResponseSchema.parse(data);
}

/**
 * Checks if a profile exists for a user.
 */
export async function profileExists(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${getBackendUrl()}/api/profiles/${userId}/exists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.exists === true;
  } catch (error) {
    // Network errors - backend not available
    console.warn('Backend not reachable:', error);
    throw error; // Re-throw so caller can handle
  }
}



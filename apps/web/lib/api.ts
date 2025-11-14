import type { ProfileResponseDTO } from '@common/types';

const DEFAULT_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${DEFAULT_BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch {
      // Ignore JSON parse errors
    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export async function getProfileByUserId(userId: string): Promise<ProfileResponseDTO> {
  return fetchApi<ProfileResponseDTO>(`/api/profiles/${userId}`);
}

export async function profileExists(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${DEFAULT_BACKEND_URL}/api/profiles/${userId}/exists`);
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data.exists === true;
  } catch {
    return false;
  }
}

export async function createProfile(payload: {
  userId: string;
  preferredName: string;
  supportCircle?: Array<{
    name: string;
    relationship: string;
    contactMethod: 'sms' | 'email' | 'call';
    phoneNumber?: string;
    email?: string;
  }>;
  communicationGuidelines?: {
    tone: 'soft' | 'direct' | 'informative';
    doPhrases?: string[];
    avoidPhrases?: string[];
  };
  crisisSignals?: {
    triggers?: string[];
    escalationIndicators?: string[];
    selfRegulationTechniques?: string[];
  };
}) {
  return fetchApi('/api/profiles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


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
  CommunicationMediatorRequestDTO,
  CommunicationMediatorResponseDTO,
  communicationMediatorRequestSchema,
  communicationMediatorResponseSchema,
  SendCrisisAlertRequestDTO,
  sendCrisisAlertRequestSchema,
} from "../../../common/types";

const DEFAULT_BACKEND_URL = "http://localhost:4000";

const getBackendUrl = () => {
  if (typeof process !== "undefined") {
    return process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_BACKEND_URL;
  }
  return DEFAULT_BACKEND_URL;
};

export class TranslatorApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "TranslatorApiError";
  }
}

export class ProfileApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "ProfileApiError";
  }
}

export class MediatorApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "MediatorApiError";
  }
}

export class CrisisAlertApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "CrisisAlertApiError";
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Unexpected translator error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
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
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Unexpected profile error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
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
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let message = "Unexpected profile error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
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
 * Retrieves a profile by profile ID.
 */
export async function getProfileById(profileId: string): Promise<ProfileResponseDTO> {
  const response = await fetch(`${getBackendUrl()}/api/profiles/id/${profileId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let message = "Unexpected profile error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
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
 * Updates a profile by user ID.
 */
export async function updateProfile(
  userId: string,
  payload: UpdateProfileRequestDTO,
): Promise<ProfileResponseDTO> {
  const body = updateProfileRequestSchema.parse({ ...payload, userId });

  const response = await fetch(`${getBackendUrl()}/api/profiles/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Unexpected profile error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
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
 * Deletes a profile by user ID.
 */
export async function deleteProfile(userId: string): Promise<void> {
  const response = await fetch(`${getBackendUrl()}/api/profiles/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let message = "Unexpected profile error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new ProfileApiError(message, response.status);
  }
}

/**
 * Checks if a profile exists for a user.
 */
export async function profileExists(userId: string): Promise<boolean> {
  const response = await fetch(`${getBackendUrl()}/api/profiles/${userId}/exists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data.exists === true;
}

/**
 * Mediates a communication message using the Communication Mediator AI.
 */
export async function mediateMessage(
  payload: CommunicationMediatorRequestDTO,
): Promise<CommunicationMediatorResponseDTO> {
  const body = communicationMediatorRequestSchema.parse(payload);

  const response = await fetch(`${getBackendUrl()}/api/mediate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Unexpected mediator error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new MediatorApiError(message, response.status);
  }

  const data = await response.json();
  return communicationMediatorResponseSchema.parse(data);
}

/**
 * Sends a crisis alert via SMS using Twilio.
 */
export async function sendCrisisAlert(
  payload: SendCrisisAlertRequestDTO,
): Promise<{ success: boolean; messageSid: string; message: string }> {
  const body = sendCrisisAlertRequestSchema.parse(payload);

  const response = await fetch(`${getBackendUrl()}/api/crisis-alert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = "Unexpected crisis alert error";
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch (error) {
      // Ignore JSON parse errors and keep generic message.
    }
    throw new CrisisAlertApiError(message, response.status);
  }

  const data = await response.json();
  return data;
}








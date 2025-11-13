import mongoose from 'mongoose';
import { AiProfileModel } from '../models/AiProfile.js';
import { createProfileRequestSchema, updateProfileRequestSchema, } from '../../../common/types/index.js';
/**
 * Converts a Mongoose AiProfile document to a ProfileResponseDTO.
 */
function profileToDTO(profile) {
    const result = {
        userId: profile.userId,
        preferredName: profile.preferredName,
        supportCircle: profile.supportCircle.map((contact) => ({
            name: contact.name,
            relationship: contact.relationship,
            contactMethod: contact.contactMethod,
        })),
        communicationGuidelines: {
            tone: profile.communicationGuidelines.tone,
            doPhrases: profile.communicationGuidelines.doPhrases,
            avoidPhrases: profile.communicationGuidelines.avoidPhrases,
        },
        crisisSignals: {
            triggers: profile.crisisSignals.triggers,
            escalationIndicators: profile.crisisSignals.escalationIndicators,
            selfRegulationTechniques: profile.crisisSignals.selfRegulationTechniques,
        },
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString(),
    };
    // Add _id if it exists (Mongoose Document has _id)
    if (profile._id && typeof profile._id === 'object' && 'toString' in profile._id) {
        result._id = profile._id.toString();
    }
    else if (typeof profile._id === 'string') {
        result._id = profile._id;
    }
    return result;
}
/**
 * Service for managing AI profiles with CRUD operations.
 */
export class ProfileService {
    /**
     * Creates a new AI profile for a user.
     *
     * @param payload - Profile creation request payload.
     * @returns Created profile as DTO.
     * @throws Error if profile already exists or validation fails.
     */
    async createProfile(payload) {
        const request = createProfileRequestSchema.parse(payload);
        // Check if profile already exists for this user
        const existing = await AiProfileModel.findOne({ userId: request.userId });
        if (existing) {
            throw new Error(`Profile already exists for user: ${request.userId}`);
        }
        // Create profile with defaults
        const profile = await AiProfileModel.create({
            userId: request.userId,
            preferredName: request.preferredName,
            supportCircle: request.supportCircle ?? [],
            communicationGuidelines: request.communicationGuidelines ?? {
                tone: 'soft',
                doPhrases: [],
                avoidPhrases: [],
            },
            crisisSignals: request.crisisSignals ?? {
                triggers: [],
                escalationIndicators: [],
                selfRegulationTechniques: [],
            },
        });
        console.info('[ProfileService] Profile created', {
            userId: profile.userId,
            profileId: profile._id ? profile._id.toString() : 'unknown',
        });
        return profileToDTO(profile);
    }
    /**
     * Retrieves an AI profile by user ID.
     *
     * @param userId - User ID to look up.
     * @returns Profile as DTO.
     * @throws Error if profile not found.
     */
    async getProfileByUserId(userId) {
        const profile = await AiProfileModel.findOne({ userId });
        if (!profile) {
            throw new Error(`Profile not found for user: ${userId}`);
        }
        return profileToDTO(profile);
    }
    /**
     * Retrieves an AI profile by profile ID (MongoDB _id).
     *
     * @param profileId - Profile ID to look up.
     * @returns Profile as DTO.
     * @throws Error if profile not found or invalid ID.
     */
    async getProfileById(profileId) {
        if (!mongoose.Types.ObjectId.isValid(profileId)) {
            throw new Error(`Invalid profile ID: ${profileId}`);
        }
        const profile = await AiProfileModel.findById(profileId);
        if (!profile) {
            throw new Error(`Profile not found: ${profileId}`);
        }
        return profileToDTO(profile);
    }
    /**
     * Updates an existing AI profile.
     *
     * @param userId - User ID of the profile to update.
     * @param payload - Profile update request payload.
     * @returns Updated profile as DTO.
     * @throws Error if profile not found or validation fails.
     */
    async updateProfile(userId, payload) {
        const request = updateProfileRequestSchema.parse({ ...payload, userId });
        const profile = await AiProfileModel.findOne({ userId });
        if (!profile) {
            throw new Error(`Profile not found for user: ${userId}`);
        }
        // Update fields
        if (request.preferredName !== undefined) {
            profile.preferredName = request.preferredName;
        }
        if (request.supportCircle !== undefined) {
            profile.supportCircle = request.supportCircle;
        }
        if (request.communicationGuidelines !== undefined) {
            profile.communicationGuidelines = {
                ...profile.communicationGuidelines,
                ...request.communicationGuidelines,
            };
        }
        if (request.crisisSignals !== undefined) {
            profile.crisisSignals = {
                ...profile.crisisSignals,
                ...request.crisisSignals,
            };
        }
        await profile.save();
        console.info('[ProfileService] Profile updated', {
            userId: profile.userId,
            profileId: profile._id ? profile._id.toString() : 'unknown',
        });
        return profileToDTO(profile);
    }
    /**
     * Deletes an AI profile by user ID.
     *
     * @param userId - User ID of the profile to delete.
     * @throws Error if profile not found.
     */
    async deleteProfile(userId) {
        const result = await AiProfileModel.deleteOne({ userId });
        if (result.deletedCount === 0) {
            throw new Error(`Profile not found for user: ${userId}`);
        }
        console.info('[ProfileService] Profile deleted', { userId });
    }
    /**
     * Checks if a profile exists for a user.
     *
     * @param userId - User ID to check.
     * @returns True if profile exists, false otherwise.
     */
    async profileExists(userId) {
        const profile = await AiProfileModel.findOne({ userId });
        return profile !== null;
    }
}
export const profileService = new ProfileService();
//# sourceMappingURL=profileService.js.map
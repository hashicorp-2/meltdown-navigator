import { ZodError } from 'zod';
import { createProfileRequestSchema, updateProfileRequestSchema, } from '../../../common/types/index.js';
import { profileService } from '../services/profileService.js';
/**
 * Handles profile requests by validating payloads and delegating to the
 * profile service.
 */
export const profileController = {
    /**
     * Creates a new profile.
     */
    async create(req, res, next) {
        try {
            const payload = createProfileRequestSchema.parse(req.body);
            console.info('[ProfileController] create invoked', {
                userId: payload.userId,
                preferredName: payload.preferredName,
                supportCircleCount: payload.supportCircle?.length ?? 0,
            });
            const profile = await profileService.createProfile(payload);
            res.status(201).json(profile);
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Invalid profile request.',
                    issues: error.flatten(),
                });
                return;
            }
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    },
    /**
     * Retrieves a profile by user ID.
     */
    async getByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({
                    message: 'userId is required.',
                });
                return;
            }
            console.info('[ProfileController] getByUserId invoked', { userId });
            const profile = await profileService.getProfileByUserId(userId);
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    },
    /**
     * Retrieves a profile by profile ID.
     */
    async getById(req, res, next) {
        try {
            const { profileId } = req.params;
            if (!profileId) {
                res.status(400).json({
                    message: 'profileId is required.',
                });
                return;
            }
            console.info('[ProfileController] getById invoked', { profileId });
            const profile = await profileService.getProfileById(profileId);
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('not found')) {
                    res.status(404).json({
                        message: error.message,
                    });
                    return;
                }
                if (error.message.includes('Invalid profile ID')) {
                    res.status(400).json({
                        message: error.message,
                    });
                    return;
                }
            }
            next(error);
        }
    },
    /**
     * Updates a profile by user ID.
     */
    async update(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({
                    message: 'userId is required.',
                });
                return;
            }
            const payload = updateProfileRequestSchema.parse({
                ...req.body,
                userId,
            });
            console.info('[ProfileController] update invoked', {
                userId,
                hasPreferredName: Boolean(payload.preferredName),
                hasSupportCircle: Boolean(payload.supportCircle),
            });
            const profile = await profileService.updateProfile(userId, payload);
            res.status(200).json(profile);
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Invalid profile update request.',
                    issues: error.flatten(),
                });
                return;
            }
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    },
    /**
     * Deletes a profile by user ID.
     */
    async delete(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({
                    message: 'userId is required.',
                });
                return;
            }
            console.info('[ProfileController] delete invoked', { userId });
            await profileService.deleteProfile(userId);
            res.status(204).send();
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                res.status(404).json({
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    },
    /**
     * Checks if a profile exists for a user.
     */
    async exists(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({
                    message: 'userId is required.',
                });
                return;
            }
            const exists = await profileService.profileExists(userId);
            res.status(200).json({ exists });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=profileController.js.map
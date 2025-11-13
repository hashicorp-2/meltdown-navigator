import { ZodError } from 'zod';
import { translatorRequestSchema, } from '../../../common/types/index.js';
import { translatorService } from '../services/translatorService.js';
/**
 * Handles translator requests by validating payloads and delegating to the
 * translator service.
 */
export const translatorController = {
    async translate(req, res, next) {
        try {
            const payload = translatorRequestSchema.parse(req.body);
            console.info('[TranslatorController] translate invoked', {
                stressLevel: payload.stressLevel,
                hasProfileId: Boolean(payload.profileId),
            });
            const plan = await translatorService.translate(payload);
            res.status(200).json(plan);
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Invalid translator request.',
                    issues: error.flatten(),
                });
                return;
            }
            next(error);
        }
    },
};
//# sourceMappingURL=translatorController.js.map
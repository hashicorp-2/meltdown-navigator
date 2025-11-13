import { ZodError } from 'zod';
import { communicationMediatorRequestSchema, } from '../../../common/types/index.js';
import { mediatorService } from '../services/mediatorService.js';
/**
 * Handles communication mediator requests by validating payloads and delegating to the
 * mediator service.
 */
export const mediatorController = {
    async mediate(req, res, next) {
        try {
            const payload = communicationMediatorRequestSchema.parse(req.body);
            console.info('[MediatorController] mediate invoked', {
                hasProfileId: Boolean(payload.profileId),
                hasConversationHistory: Boolean(payload.conversationHistory && payload.conversationHistory.length > 0),
            });
            const result = await mediatorService.mediate(payload);
            res.status(200).json(result);
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Invalid mediator request.',
                    issues: error.flatten(),
                });
                return;
            }
            next(error);
        }
    },
};
//# sourceMappingURL=mediatorController.js.map
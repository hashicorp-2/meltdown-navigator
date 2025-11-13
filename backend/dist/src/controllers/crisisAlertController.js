import { ZodError } from 'zod';
import { sendCrisisAlertRequestSchema, } from '../../../common/types/index.js';
import { twilioService } from '../lib/twilio.js';
/**
 * Handles crisis alert requests by validating payloads and sending SMS via Twilio.
 */
export const crisisAlertController = {
    async sendAlert(req, res, next) {
        try {
            const payload = sendCrisisAlertRequestSchema.parse(req.body);
            console.info('[CrisisAlertController] sendAlert invoked', {
                to: payload.to,
                hasUserName: Boolean(payload.userName),
                stressLevel: payload.stressLevel,
            });
            let messageSid;
            if (payload.userName && payload.stressLevel) {
                // Use formatted alert
                messageSid = await twilioService.sendFormattedAlert(payload.to, {
                    userName: payload.userName,
                    stressLevel: payload.stressLevel,
                    message: payload.message,
                    actionNeeded: payload.actionNeeded,
                });
            }
            else {
                // Use simple alert
                messageSid = await twilioService.sendCrisisAlert(payload.to, payload.message);
            }
            res.status(200).json({
                success: true,
                messageSid,
                message: 'Crisis alert sent successfully',
            });
        }
        catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    message: 'Invalid crisis alert request.',
                    issues: error.flatten(),
                });
                return;
            }
            if (error instanceof Error && error.message.includes('Twilio is not configured')) {
                res.status(503).json({
                    message: 'SMS service is not available. Twilio is not configured.',
                    error: error.message,
                });
                return;
            }
            if (error instanceof Error && error.message.includes('Invalid phone number')) {
                res.status(400).json({
                    message: error.message,
                });
                return;
            }
            next(error);
        }
    },
};
//# sourceMappingURL=crisisAlertController.js.map
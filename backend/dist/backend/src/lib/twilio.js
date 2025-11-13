import twilio from 'twilio';
/**
 * Twilio client for sending SMS messages.
 * Configured via environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER (the Twilio phone number to send from)
 */
class TwilioService {
    client = null;
    fromNumber = null;
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
        if (accountSid && authToken && phoneNumber) {
            this.client = twilio(accountSid, authToken);
            this.fromNumber = phoneNumber;
            console.log('[TwilioService] Initialized with Twilio credentials');
        }
        else {
            console.warn('[TwilioService] Twilio credentials not provided. SMS features will be unavailable.');
            console.warn('[TwilioService] Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
        }
    }
    /**
     * Checks if Twilio is configured and available.
     */
    isAvailable() {
        return this.client !== null && this.fromNumber !== null;
    }
    /**
     * Sends a crisis alert SMS message to the specified recipient.
     *
     * @param to - The recipient's phone number (E.164 format, e.g., +1234567890)
     * @param message - The message content to send
     * @returns Promise resolving to the message SID if successful
     * @throws Error if Twilio is not configured or if sending fails
     */
    async sendCrisisAlert(to, message) {
        if (!this.isAvailable()) {
            throw new Error('Twilio is not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER environment variables.');
        }
        if (!to || !message) {
            throw new Error('Recipient phone number and message are required.');
        }
        // Validate phone number format (basic E.164 check)
        if (!/^\+[1-9]\d{1,14}$/.test(to)) {
            throw new Error('Invalid phone number format. Please use E.164 format (e.g., +1234567890).');
        }
        try {
            const result = await this.client.messages.create({
                body: message,
                from: this.fromNumber,
                to,
            });
            console.info('[TwilioService] Crisis alert sent', {
                to,
                messageSid: result.sid,
                status: result.status,
            });
            return result.sid;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown Twilio error';
            console.error('[TwilioService] Failed to send crisis alert', {
                to,
                error: errorMessage,
            });
            throw new Error(`Failed to send SMS: ${errorMessage}`);
        }
    }
    /**
     * Sends a formatted crisis alert with structured information.
     *
     * @param to - The recipient's phone number
     * @param alertData - Structured alert data
     * @returns Promise resolving to the message SID
     */
    async sendFormattedAlert(to, alertData) {
        const { userName, stressLevel, message, actionNeeded } = alertData;
        const formattedMessage = [
            `🚨 Crisis Alert from ${userName}`,
            '',
            `Stress Level: ${stressLevel}/5`,
            '',
            `Message: ${message}`,
            ...(actionNeeded ? ['', `Action Needed: ${actionNeeded}`] : []),
            '',
            'Please reach out to provide support.',
        ].join('\n');
        return this.sendCrisisAlert(to, formattedMessage);
    }
}
export const twilioService = new TwilioService();
//# sourceMappingURL=twilio.js.map
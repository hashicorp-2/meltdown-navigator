'use server';

import { z } from 'zod';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const SendAlertSchema = z.object({
  to: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  message: z.string().min(1),
  userName: z.string().optional(),
  stressLevel: z.number().int().min(1).max(5).optional(),
  actionNeeded: z.string().optional(),
  translatedMessage: z.string().optional(),
  groundingTechnique: z.string().optional(),
  mediaUrl: z.string().url().optional(),
});

export type SendAlertInput = z.infer<typeof SendAlertSchema>;

export interface SendAlertResult {
  success: boolean;
  messageSid?: string;
  error?: string;
}

export async function sendCaregiverAlert(
  input: SendAlertInput
): Promise<SendAlertResult> {
  try {
    const payload = SendAlertSchema.parse(input);

    const response = await fetch(`${BACKEND_URL}/api/crisis-alert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      return {
        success: false,
        error: errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      messageSid: data.messageSid,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send alert',
    };
  }
}


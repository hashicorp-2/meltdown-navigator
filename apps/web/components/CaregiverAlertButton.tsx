'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { sendCaregiverAlert, type SendAlertInput } from '@/app/actions/sendCaregiverAlert';
import type { ProfileResponseDTO } from '@common/types';

interface CaregiverAlertButtonProps {
  profile: ProfileResponseDTO | null;
  stressLevel: number;
  rawMessage: string;
  translationResult?: {
    translatedMessage?: string;
    communicationMedium?: string;
    groundingTechnique?: string;
    followUpSuggestion?: string;
    safetyNote?: string;
  };
}

export function CaregiverAlertButton({
  profile,
  stressLevel,
  rawMessage,
  translationResult
}: CaregiverAlertButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [alertStatus, setAlertStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSendAlert = (contactPhone: string, contactName: string) => {
    if (!contactPhone) {
      setAlertStatus({
        type: 'error',
        message: 'No phone number provided for this contact'
      });
      return;
    }

    startTransition(async () => {
      const alertData: SendAlertInput = {
        to: contactPhone,
        message: rawMessage,
        userName: profile?.preferredName || 'User',
        stressLevel: stressLevel,
        translatedMessage: translationResult?.translatedMessage,
        groundingTechnique: translationResult?.groundingTechnique,
        actionNeeded: stressLevel >= 4 
          ? 'High stress level detected. Immediate support recommended.'
          : stressLevel >= 3
          ? 'Moderate stress level. Check-in recommended.'
          : undefined,
      };

      const result = await sendCaregiverAlert(alertData);

      if (result.success) {
        setAlertStatus({
          type: 'success',
          message: `Alert sent to ${contactName}!`
        });
        // Clear success message after 3 seconds
        setTimeout(() => {
          setAlertStatus({ type: null, message: '' });
        }, 3000);
      } else {
        setAlertStatus({
          type: 'error',
          message: result.error || 'Failed to send alert'
        });
      }
    });
  };

  // Get SMS contacts with phone numbers
  const smsContacts = profile?.supportCircle?.filter(
    (contact) => contact.contactMethod === 'sms' && contact.phoneNumber
  ) || [];

  if (smsContacts.length === 0) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
        <p className="font-medium">No SMS contacts configured</p>
        <p className="mt-1 text-xs opacity-75">
          Add phone numbers to your support circle in your profile to enable caregiver alerts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] dark:text-white">
            Send Alert to Caregiver
          </h3>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Notify your support circle about this situation
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {smsContacts.map((contact) => (
          <div
            key={`${contact.name}-${contact.relationship}`}
            className="flex items-center justify-between rounded-lg border bg-white/90 p-3 dark:bg-[rgba(15,23,42,0.75)]"
          >
            <div>
              <p className="text-sm font-medium text-[var(--color-ink)] dark:text-white">
                {contact.name}
              </p>
              <p className="text-xs text-[var(--color-muted)]">
                {contact.relationship}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              loading={isPending}
              onClick={() => handleSendAlert(contact.phoneNumber!, contact.name)}
              disabled={isPending || !contact.phoneNumber}
            >
              Send Alert
            </Button>
          </div>
        ))}
      </div>

      {alertStatus.type && (
        <div
          className={`rounded-lg p-3 text-sm ${
            alertStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'
              : 'bg-rose-50 text-rose-800 dark:bg-rose-900/20 dark:text-rose-200'
          }`}
        >
          {alertStatus.message}
        </div>
      )}
    </div>
  );
}

